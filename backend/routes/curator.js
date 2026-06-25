import { Router } from "express";
import { Op } from "sequelize";
import { ah } from "../lib/asyncHandler.js";
import { rateLimit, currentUser, requireAuth } from "../lib/auth.js";
import { askCurator } from "../lib/ai.js";
import { buildSystemPrompt, validateFilmPicks } from "../lib/curatorPrompt.js";
import { ListItem, WatchProgress, CuratorMessage, RateLimit } from "../models.js";
import { FILMS } from "../data/films.js";

const router = Router();
const MAX_MESSAGES = 12;
const MAX_LEN = 500;
const HISTORY_LIMIT = 100;
const HOUR_MS = 60 * 60 * 1000;
const titleById = new Map(FILMS.map((f) => [f.id, f.title]));

// Process-wide ceiling on paid LLM calls — a backstop against guest cost-abuse /
// IP rotation that the per-IP rate limit can't catch. Backed by the SAME
// rate_limits table as the per-IP limiter, keyed by the wall-clock hour, so the
// count SURVIVES redeploys and is SHARED across instances (the old in-memory
// counter reset on every Coolify deploy and never saw a second instance). Tune
// with CURATOR_HOURLY_CAP. Reuses the per-hour row's resetAt so sweepExpired()
// in server.js reaps stale budget rows like any other rate-limit row.
const HOURLY_CAP = Number(process.env.CURATOR_HOURLY_CAP) || 400;

// Consume one unit of this hour's global budget. Returns false ONLY when the
// cap is provably exceeded; on a store error it returns true (fail OPEN) — the
// per-IP rate limit is still in force, so a DB blip can't break the Curator,
// and this cap is a coarse cost backstop, not a security control.
async function underBudget() {
  const now = Date.now();
  const hour = Math.floor(now / HOUR_MS);
  const key = `curator_budget:${hour}`;
  try {
    const [row, created] = await RateLimit.findOrCreate({
      where: { key },
      // resetAt = end of THIS hour window, so the sweeper can reap it later
      defaults: { count: 1, resetAt: new Date((hour + 1) * HOUR_MS) },
    });
    if (created) return true; // first call this hour
    if (row.count >= HOURLY_CAP) return false; // cap hit for the hour
    await row.increment("count"); // atomic at the DB level
    return true;
  } catch (err) {
    console.error("[curator] budget check failed:", err?.message || err);
    return true; // fail open — per-IP limit still applies
  }
}

// Trim a user's stored conversation back to the newest HISTORY_LIMIT rows so
// storage can't grow unbounded. Best-effort and user-scoped; never throws.
async function trimHistory(userId) {
  try {
    const keep = await CuratorMessage.findAll({
      where: { UserId: userId },
      order: [["createdAt", "DESC"]],
      limit: HISTORY_LIMIT,
      attributes: ["id"],
    });
    if (keep.length < HISTORY_LIMIT) return; // nothing to trim
    await CuratorMessage.destroy({
      where: { UserId: userId, id: { [Op.notIn]: keep.map((r) => r.id) } },
    });
  } catch (err) {
    console.error("[curator] history trim failed:", err?.message || err);
  }
}

router.post(
  "/",
  rateLimit("curator", 20, 5 * 60 * 1000),
  ah(async (req, res) => {
    const raw = Array.isArray(req.body?.messages) ? req.body.messages : null;
    if (!raw || raw.length === 0) return res.status(400).json({ error: "bad_request" });

    const messages = raw
      .slice(-MAX_MESSAGES)
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m?.content || "").slice(0, MAX_LEN).trim(),
      }))
      .filter((m) => m.content);

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return res.status(400).json({ error: "bad_request" });
    }

    // global cost ceiling — beyond the per-IP rate limit, cap total paid calls
    if (!(await underBudget())) {
      return res.status(503).json({ error: "curator_unavailable" });
    }

    // Optional personalization — titles only, never PII.
    let inList = [];
    let continueWatching = [];
    const user = await currentUser(req);
    if (user) {
      const [li, wp] = await Promise.all([
        ListItem.findAll({ where: { UserId: user.id }, order: [["createdAt", "DESC"]], limit: 30 }),
        WatchProgress.findAll({ where: { UserId: user.id }, order: [["updatedAt", "DESC"]], limit: 30 }),
      ]);
      inList = li.map((i) => titleById.get(i.filmId)).filter(Boolean);
      continueWatching = wp.map((w) => titleById.get(w.filmId)).filter(Boolean);
    }

    const system = buildSystemPrompt({ inList, continueWatching });
    try {
      const { reply, films: rawFilms } = await askCurator({ system, messages });
      const cleanReply = String(reply || "").trim();
      // Hard allowlist by id (drops hallucinated ids) while preserving each
      // pick's short reason; still capped at MAX_FILMS. Shape: [{ id, reason }].
      const films = validateFilmPicks(rawFilms);
      // Persist this turn for signed-in users — best-effort, so a DB hiccup
      // never breaks the reply. Guests are never stored.
      if (user) {
        CuratorMessage.bulkCreate([
          { UserId: user.id, role: "user", content: messages[messages.length - 1].content, films: null },
          { UserId: user.id, role: "assistant", content: cleanReply, films },
        ])
          .then(() => trimHistory(user.id))
          .catch((err) => console.error("[curator] save failed:", err?.message || err));
      }
      return res.json({ reply: cleanReply, films });
    } catch (e) {
      if (e.code === "curator_unavailable") {
        return res.status(503).json({ error: "curator_unavailable" });
      }
      throw e; // unexpected → global handler → 500 internal
    }
  })
);

// GET /api/curator/history → the signed-in user's saved conversation (oldest→newest)
router.get(
  "/history",
  requireAuth,
  ah(async (req, res) => {
    const rows = await CuratorMessage.findAll({
      where: { UserId: req.user.id },
      order: [["createdAt", "ASC"]],
      limit: HISTORY_LIMIT,
    });
    res.json({
      messages: rows.map((m) => ({
        role: m.role,
        content: m.content,
        films: m.role === "assistant" ? m.films || [] : undefined,
      })),
    });
  })
);

// DELETE /api/curator/history → clear the user's conversation
router.delete(
  "/history",
  requireAuth,
  ah(async (req, res) => {
    await CuratorMessage.destroy({ where: { UserId: req.user.id } });
    res.json({ ok: true });
  })
);

export default router;
