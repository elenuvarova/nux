import { Router } from "express";
import { ah } from "../lib/asyncHandler.js";
import { rateLimit, currentUser, requireAuth } from "../lib/auth.js";
import { askCurator } from "../lib/ai.js";
import { buildSystemPrompt, validateFilmIds } from "../lib/curatorPrompt.js";
import { ListItem, WatchProgress, CuratorMessage } from "../models.js";
import { FILMS } from "../data/films.js";

const router = Router();
const MAX_MESSAGES = 12;
const MAX_LEN = 500;
const titleById = new Map(FILMS.map((f) => [f.id, f.title]));

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

    // Optional personalization — titles only, never PII.
    let inList = [];
    let continueWatching = [];
    const user = await currentUser(req);
    if (user) {
      const [li, wp] = await Promise.all([
        ListItem.findAll({ where: { UserId: user.id }, limit: 200 }),
        WatchProgress.findAll({ where: { UserId: user.id }, limit: 200 }),
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
        ]).catch((err) => console.error("[curator] save failed:", err?.message || err));
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

const HISTORY_LIMIT = 100;

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
