import { CuratorCollection } from "../models.js";
import { sequelize } from "../db.js";
import { generateCollections } from "./curatorCollections.js";
import { sendBroadcast } from "./push.js";

const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
let regenerating = false; // single-flight guard for background regeneration

export async function readCache() {
  return CuratorCollection.findAll({ order: [["position", "ASC"]] });
}

export async function readOne(slug) {
  return CuratorCollection.findByPk(slug);
}

// Pure: given the cached rows, is the set empty or older than the TTL?
export function isStale(rows) {
  if (!rows || rows.length === 0) return true;
  const newest = Math.max(...rows.map((r) => new Date(r.generatedAt).getTime()));
  // An unparseable generatedAt yields NaN; treat that as stale (don't trust a
  // timestamp we can't read), since NaN comparisons would otherwise read fresh.
  if (!Number.isFinite(newest)) return true;
  return Date.now() - newest > TTL_MS;
}

// Replace the whole set atomically. Old set survives if generation failed
// upstream (we only call this with a non-empty array).
export async function persist(collections) {
  const now = new Date();
  await sequelize.transaction(async (t) => {
    await CuratorCollection.destroy({ where: {}, transaction: t });
    await CuratorCollection.bulkCreate(
      collections.map((c, i) => ({ ...c, position: i, generatedAt: now })),
      { transaction: t }
    );
  });
}

// Fire-and-forget background refresh, single-flight. Never throws to the caller;
// a failed regen leaves the existing cache in place and is retried on the next
// stale read.
export function kickRegeneration() {
  if (regenerating) return;
  regenerating = true;
  (async () => {
    try {
      const cols = await generateCollections();
      // only replace the live shelf with a healthy set — never let a thin/odd
      // regen overwrite a good cache for a week
      if (cols.length >= 2) {
        await persist(cols);
        // fresh shelf published → tell subscribers. Fire-and-forget: a push
        // hiccup must never mark the regen as failed (the cache IS updated).
        sendBroadcast({
          title: "New collections this week",
          body: cols[0].title,
          url: "/",
        }).catch((e) => console.error("[push] broadcast failed:", e?.message || e));
      }
    } catch (e) {
      console.error("[collections] regen failed:", e?.message || e);
    } finally {
      regenerating = false;
    }
  })();
}
