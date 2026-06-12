import { Router } from "express";
import { ListItem } from "../models.js";
import { requireAuth } from "../lib/auth.js";

const router = Router();
router.use(requireAuth); // every route below is scoped to req.user

// GET /api/list → ["film-id", ...] most-recent-first
router.get("/", async (req, res) => {
  const items = await ListItem.findAll({
    where: { UserId: req.user.id },
    order: [["createdAt", "DESC"]],
  });
  res.json({ list: items.map((i) => i.filmId) });
});

// POST /api/list { filmId } — idempotent add
router.post("/", async (req, res) => {
  const filmId = String(req.body?.filmId || "");
  if (!filmId) return res.status(400).json({ error: "film_required" });
  await ListItem.findOrCreate({ where: { UserId: req.user.id, filmId } });
  res.status(201).json({ ok: true });
});

// DELETE /api/list/:filmId — only ever touches the caller's rows
router.delete("/:filmId", async (req, res) => {
  await ListItem.destroy({ where: { UserId: req.user.id, filmId: req.params.filmId } });
  res.json({ ok: true });
});

export default router;
