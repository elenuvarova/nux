import { Router } from "express";
import { UniqueConstraintError } from "sequelize";
import { ListItem } from "../models.js";
import { requireAuth } from "../lib/auth.js";
import { ah } from "../lib/asyncHandler.js";

const router = Router();
router.use(requireAuth); // every route below is scoped to req.user

const LIST_LIMIT = 200; // cap rows returned; a user's list won't realistically exceed this
const FILM_ID_MAX = 100;

// GET /api/list → ["film-id", ...] most-recent-first
router.get(
  "/",
  ah(async (req, res) => {
    const items = await ListItem.findAll({
      where: { UserId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: LIST_LIMIT,
    });
    res.json({ list: items.map((i) => i.filmId) });
  })
);

// POST /api/list { filmId } — idempotent add
router.post(
  "/",
  ah(async (req, res) => {
    const filmId = String(req.body?.filmId || "").trim();
    if (!filmId || filmId.length > FILM_ID_MAX) {
      return res.status(400).json({ error: "film_required" });
    }
    // Race-safe idempotent add: a concurrent insert hitting the unique index
    // (UserId, filmId) is treated as success rather than an error.
    let created = true;
    try {
      await ListItem.create({ UserId: req.user.id, filmId });
    } catch (err) {
      // already in the list (unique index) → idempotent no-op, not a creation
      if (err instanceof UniqueConstraintError) created = false;
      else throw err;
    }
    res.status(created ? 201 : 200).json({ ok: true });
  })
);

// DELETE /api/list/:filmId — only ever touches the caller's rows
router.delete(
  "/:filmId",
  ah(async (req, res) => {
    const filmId = String(req.params.filmId || "").trim();
    if (!filmId || filmId.length > FILM_ID_MAX) {
      return res.status(400).json({ error: "film_required" });
    }
    await ListItem.destroy({ where: { UserId: req.user.id, filmId } });
    res.status(204).end(); // idempotent delete, no body
  })
);

export default router;
