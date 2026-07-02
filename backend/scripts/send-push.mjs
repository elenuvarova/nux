// Manual broadcast trigger — the same payload the weekly collections regen
// sends, without waiting a week. Run from backend/:
//   node scripts/send-push.mjs                     # current top collection
//   node scripts/send-push.mjs "Body text" "/url"  # override body / target
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import process from "node:process";

// Load backend/.env regardless of cwd (npm run vs direct node invocation).
try {
  process.loadEnvFile(join(dirname(fileURLToPath(import.meta.url)), "..", ".env"));
} catch {
  /* no .env (e.g. prod, where Coolify injects the vars) — fine */
}

const { sequelize } = await import("../db.js");
const { readCache } = await import("../lib/collectionsCache.js");
const { isConfigured, sendBroadcast } = await import("../lib/push.js");

if (!isConfigured()) {
  console.error("VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY missing — nothing sent.");
  process.exit(1);
}

const rows = await readCache();
const body = process.argv[2] || rows[0]?.title || "A fresh programme is up";
const url = process.argv[3] || "/";

const result = await sendBroadcast({ title: "New collections this week", body, url });
console.log(result);
await sequelize.close();
