import { Router } from "express";
import { Op } from "sequelize";
import { GameScore, User } from "../models.js";
import { currentUser, rateLimit } from "../lib/auth.js";
import { ah } from "../lib/asyncHandler.js";

const router = Router();

const GAMES = new Set(["neon-drift"]); // whitelist; one board per game
const TOP_N = 10;
const SCORE_MAX = 1_000_000;
const NAME_MAX = 16;

// "Elena Uvarova" -> "Elena U." ; single-token names pass through. Keeps the
// last name server-side. Used for registered display names (derived at read).
function abbreviate(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Player";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0].toUpperCase()}.`;
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
        const ahead = await GameScore.count({
          where: { game, score: { [Op.gt]: mine.score } },
        });
        you = { rank: ahead + 1, score: mine.score };
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
      // one row per account, kept at the best
      const [row, created] = await GameScore.findOrCreate({
        where: { game, UserId: me.id },
        defaults: { game, UserId: me.id, score },
      });
      if (!created && score > row.score) await row.update({ score });
      const best = created ? score : Math.max(row.score, score);
      const ahead = await GameScore.count({ where: { game, score: { [Op.gt]: best } } });
      return res.status(created ? 201 : 200).json({ ok: true, rank: ahead + 1, best });
    }

    // guest: a handle is required
    const name = cleanName(req.body?.name);
    if (!name) return res.status(400).json({ error: "name_required" });
    await GameScore.create({ game, UserId: null, name, score });
    return res.status(201).json({ ok: true, rank: null, best: score });
  })
);

export default router;
