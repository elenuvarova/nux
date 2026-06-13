import { Router } from "express";
import { ah } from "../lib/asyncHandler.js";
import { readCache, readOne, isStale, kickRegeneration } from "../lib/collectionsCache.js";

const router = Router();

const toPublic = (row) => ({
  slug: row.slug,
  title: row.title,
  eyebrow: row.eyebrow,
  intro: row.intro,
  entries: row.entries,
});

// GET /api/collections — served instantly from cache; lazily refreshed in the
// background when stale (or empty). Never waits on the model.
router.get(
  "/",
  ah(async (req, res) => {
    const rows = await readCache();
    if (isStale(rows)) kickRegeneration();
    // universal weekly content — let the browser/CDN cache it briefly and serve
    // stale while we revalidate, instead of a DB read on every Home mount
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=3600");
    res.json({ generatedAt: rows[0]?.generatedAt || null, collections: rows.map(toPublic) });
  })
);

// GET /api/collections/:slug — one collection for the detail page.
router.get(
  "/:slug",
  ah(async (req, res) => {
    const row = await readOne(req.params.slug);
    if (!row) return res.status(404).json({ error: "not_found" });
    res.json(toPublic(row));
  })
);

export default router;
