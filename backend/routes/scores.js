import { Router } from "express";
import { Op, UniqueConstraintError } from "sequelize";
import { GameScore, User } from "../models.js";
import { currentUser, rateLimit, requireAuth } from "../lib/auth.js";
import { ah } from "../lib/asyncHandler.js";

const router = Router();

const GAMES = new Set(["neon-drift"]); // whitelist; one board per game
const TOP_N = 10;
const SCORE_MAX = 1_000_000;
const NAME_MAX = 16;
const CLAIM_MAX = 50; // cap how many guest-run ids a single claim may carry

// "Elena Uvarova" -> "Elena U." ; "Mary Jane Watson" -> "Mary W." ; single-token
// names pass through. Uses the FIRST name + the LAST name's initial, so the full
// surname never leaves the server. Used for registered display names at read time.
function abbreviate(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Player";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

// Trim, strip control chars, cap length. Returns "" if nothing usable remains.
function cleanName(raw) {
  // eslint-disable-next-line no-control-regex
  return String(raw || "").replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, NAME_MAX);
}

function resolveGame(value) {
  const game = String(value || "neon-drift").trim();
  return GAMES.has(game) ? game : null;
}

// Rank = 1 + (rows strictly ahead under the board's ordering: higher score, or
// equal score but an earlier createdAt). Matches the GET board's tiebreak so a
// player's reported rank never disagrees with their position on the board.
async function rankOf(game, score, createdAt) {
  const ahead = await GameScore.count({
    where: {
      game,
      [Op.or]: [
        { score: { [Op.gt]: score } },
        { score, createdAt: { [Op.lt]: createdAt } },
      ],
    },
  });
  return ahead + 1;
}

// Upsert the caller's single (game, UserId) row, keeping the higher score.
// Race-safe against the unique index (mirrors list.js): a concurrent insert
// hitting the unique (game, UserId) index is caught and retried as an update.
// Returns the row instance, whether it was created, and the resulting best.
async function upsertAccountBest(game, userId, score) {
  let row, created;
  try {
    [row, created] = await GameScore.findOrCreate({
      where: { game, UserId: userId },
      defaults: { game, UserId: userId, score },
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      row = await GameScore.findOne({ where: { game, UserId: userId } });
      created = false;
    } else {
      throw err;
    }
  }
  if (!created && score > row.score) await row.update({ score });
  const best = created ? score : Math.max(row.score, score);
  return { row, created, best };
}

// GET /api/scores?game=neon-drift → { top: [...], you: {rank, score} | null }
router.get(
  "/",
  ah(async (req, res) => {
    const game = resolveGame(req.query.game);
    if (!game) return res.status(400).json({ error: "unknown_game" });

    const rows = await GameScore.findAll({
      where: { game },
      order: [["score", "DESC"], ["createdAt", "ASC"]],
      limit: TOP_N,
      include: [{ model: User, attributes: ["name"] }],
    });

    const me = await currentUser(req);
    const top = rows.map((row, i) => ({
      rank: i + 1,
      name: row.UserId ? abbreviate(row.User?.name) : row.name,
      score: row.score,
      registered: !!row.UserId,
      isYou: !!(me && row.UserId === me.id),
    }));

    // caller's standing if they're registered but off the visible top
    let you = null;
    if (me && !top.some((r) => r.isYou)) {
      const mine = await GameScore.findOne({ where: { game, UserId: me.id } });
      if (mine) {
        you = { rank: await rankOf(game, mine.score, mine.createdAt), score: mine.score };
      }
    }

    res.json({ top, you });
  })
);

// POST /api/scores { game, score, name? }
// Registered → upsert-max on (game, UserId), name ignored. Guest → insert a row
// with the typed handle. Public route; optional auth via currentUser.
router.post(
  "/",
  rateLimit("scores", 10, 10 * 60 * 1000),
  ah(async (req, res) => {
    const game = resolveGame(req.body?.game);
    if (!game) return res.status(400).json({ error: "unknown_game" });

    const score = req.body?.score;
    if (!Number.isInteger(score) || score < 0 || score > SCORE_MAX) {
      return res.status(400).json({ error: "invalid_score" });
    }

    const me = await currentUser(req);

    if (me) {
      const { row, created, best } = await upsertAccountBest(game, me.id, score);
      const rank = await rankOf(game, best, row.createdAt);
      return res.status(created ? 201 : 200).json({ ok: true, rank, best });
    }

    // guest: a handle is required. We don't dedup guests (no identity), but we
    // can tell them where THIS run placed — compute the rank of the row we just
    // inserted, using the same tiebreak as the board. The row id is returned so
    // the client can later "claim" this run if the player signs in (see /claim).
    const name = cleanName(req.body?.name);
    if (!name) return res.status(400).json({ error: "name_required" });
    const row = await GameScore.create({ game, UserId: null, name, score });
    const rank = await rankOf(game, score, row.createdAt);
    return res.status(201).json({ ok: true, id: row.id, rank, best: score });
  })
);

// POST /api/scores/claim { game, ids: [] } — auth required. Folds the caller's
// OWN guest runs (rows they created while signed out, identified by the
// unguessable UUIDs the client kept in localStorage) into their account row via
// upsert-max, then deletes those guest rows. This removes the "same human shown
// twice" case after a guest signs in. It only ever touches UserId=null rows, so
// it can never delete or alter another account's row.
router.post(
  "/claim",
  requireAuth,
  ah(async (req, res) => {
    const game = resolveGame(req.body?.game);
    if (!game) return res.status(400).json({ error: "unknown_game" });

    const ids = Array.isArray(req.body?.ids)
      ? req.body.ids.filter((x) => typeof x === "string").slice(0, CLAIM_MAX)
      : [];
    if (ids.length === 0) return res.status(400).json({ error: "ids_required" });

    // only this game's guest rows (UserId null) matching the supplied ids
    const guestRows = await GameScore.findAll({ where: { game, UserId: null, id: ids } });
    if (guestRows.length === 0) return res.json({ ok: true, claimed: 0 });

    const bestGuest = Math.max(...guestRows.map((r) => r.score));
    await upsertAccountBest(game, req.user.id, bestGuest);
    await GameScore.destroy({ where: { game, UserId: null, id: guestRows.map((r) => r.id) } });
    return res.json({ ok: true, claimed: guestRows.length });
  })
);

export default router;
