import { Router } from "express";
import { WatchProgress } from "../models.js";
import { requireAuth } from "../lib/auth.js";
import { ah } from "../lib/asyncHandler.js";

const router = Router();
router.use(requireAuth);

const FILM_ID_MAX = 100;

// GET /api/history → [{ id: filmId, frac, at }] most-recent-first
router.get(
  "/",
  ah(async (req, res) => {
    const rows = await WatchProgress.findAll({
      where: { UserId: req.user.id },
      order: [["updatedAt", "DESC"]],
      limit: 12,
    });
    res.json({
      history: rows.map((r) => ({ id: r.filmId, frac: r.frac, at: r.updatedAt.getTime() })),
    });
  })
);

// PUT /api/history { filmId, frac } — upsert progress for one title
router.put(
  "/",
  ah(async (req, res) => {
    const filmId = String(req.body?.filmId || "").trim();
    let frac = Number(req.body?.frac);
    if (!filmId || filmId.length > FILM_ID_MAX) {
      return res.status(400).json({ error: "film_required" });
    }
    if (!Number.isFinite(frac)) frac = 0.05;
    frac = Math.min(0.95, Math.max(0.04, frac));

    // Atomic upsert on the unique index (UserId, filmId): always bumps
    // updatedAt, with no read-modify-write race between two concurrent saves.
    await WatchProgress.upsert({ UserId: req.user.id, filmId, frac });
    res.status(204).end(); // idempotent upsert, no body
  })
);

export default router;
