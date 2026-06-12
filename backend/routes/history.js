import { Router } from "express";
import { WatchProgress } from "../models.js";
import { requireAuth } from "../lib/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/history → [{ id: filmId, frac, at }] most-recent-first
router.get("/", async (req, res) => {
  const rows = await WatchProgress.findAll({
    where: { UserId: req.user.id },
    order: [["updatedAt", "DESC"]],
    limit: 12,
  });
  res.json({
    history: rows.map((r) => ({ id: r.filmId, frac: r.frac, at: r.updatedAt.getTime() })),
  });
});

// PUT /api/history { filmId, frac } — upsert progress for one title
router.put("/", async (req, res) => {
  const filmId = String(req.body?.filmId || "");
  let frac = Number(req.body?.frac);
  if (!filmId) return res.status(400).json({ error: "film_required" });
  if (!Number.isFinite(frac)) frac = 0.05;
  frac = Math.min(0.95, Math.max(0.04, frac));

  const [row, created] = await WatchProgress.findOrCreate({
    where: { UserId: req.user.id, filmId },
    defaults: { frac },
  });
  if (!created) {
    row.frac = frac;
    row.changed("updatedAt", true);
    await row.save();
  }
  res.json({ ok: true });
});

export default router;
