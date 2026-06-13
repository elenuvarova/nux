import { Router } from "express";
import { Op } from "sequelize";
import { ah } from "../lib/asyncHandler.js";
import { rateLimit, currentUser, requireAuth } from "../lib/auth.js";
import { askCurator } from "../lib/ai.js";
import { buildSystemPrompt, validateFilmIds } from "../lib/curatorPrompt.js";
import { ListItem, WatchProgress, CuratorMessage } from "../models.js";
import { FILMS } from "../data/films.js";

const router = Router();
const MAX_MESSAGES = 12;
const MAX_LEN = 500;
const HISTORY_LIMIT = 100;
const titleById = new Map(FILMS.map((f) => [f.id, f.title]));

// Process-wide ceiling on paid LLM calls — a backstop against guest cost-abuse /
// IP rotation that the per-IP rate limit can't catch. In-memory (resets on
// redeploy, acceptable at this scale); tune with CURATOR_HOURLY_CAP.
const HOURLY_CAP = Number(process.env.CURATOR_HOURLY_CAP) || 400;
let budgetWindowStart = Date.now();
let budgetCount = 0;
function underBudget() {
  const now = Date.now();
  if (now - budgetWindowStart >= 60 * 60 * 1000) {
    budgetWindowStart = now;
    budgetCount = 0;
  }
  if (budgetCount >= HOURLY_CAP) return false;
  budgetCount += 1;
  return true;
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
    if (!underBudget()) {
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
      const { reply, filmIds } = await askCurator({ system, messages });
      const cleanReply = String(reply || "").trim();
      const films = validateFilmIds(filmIds);
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
