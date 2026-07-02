import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Op } from "sequelize";
import { sequelize, dbKind } from "./db.js";
import { Session, PasswordReset, RateLimit } from "./models.js";
import authRoutes from "./routes/auth.js";
import listRoutes from "./routes/list.js";
import historyRoutes from "./routes/history.js";
import curatorRoutes from "./routes/curator.js";
import collectionsRoutes from "./routes/collections.js";
import scoresRoutes from "./routes/scores.js";
import pushRoutes from "./routes/push.js";
import { ah } from "./lib/asyncHandler.js";
import { csrfOriginCheck } from "./lib/security.js";
import { readCache, isStale, kickRegeneration } from "./lib/collectionsCache.js";

const app = express();
// NOT process.env.PORT — Coolify sets PORT=80 (the public ingress, owned by
// nginx). The API listens on a fixed internal port that nginx proxies to.
const PORT = process.env.BACKEND_PORT || 3001;
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1); // behind nginx in prod — read the real client IP
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());

// In prod the SPA and API share an origin, so CORS is only needed for the
// Vite dev server (which we also proxy, but keep this as a safety net).
if (!isProd) {
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:4173"],
      credentials: true,
    })
  );
}

// CSRF: reject cross-origin state-changing requests to the API (Origin/Referer
// allowlist). Safe methods and header-less requests pass through.
app.use("/api", csrfOriginCheck);

app.get(
  "/api/health",
  ah(async (req, res) => {
    try {
      await sequelize.authenticate();
      res.json({ status: "ok", db: dbKind });
    } catch (err) {
      // Don't leak DB internals (host, driver errors) to the client.
      console.error("[health] db check failed:", err?.message || err);
      res.status(500).json({ status: "error" });
    }
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/list", listRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/curator", curatorRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/scores", scoresRoutes);
app.use("/api/push", pushRoutes);

// Global error handler — must be registered AFTER all routes so it catches
// errors funnelled through next() by the ah() wrapper. This process serves the
// API only: in prod nginx is the sole SPA/static server and proxies /api here,
// so there is deliberately no express.static / catch-all SPA route.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[error]", err?.stack || err?.message || err);
  if (res.headersSent) return next(err);
  res.status(err?.status || 500).json({ error: "internal" });
});

// Periodically purge expired sessions and reset tokens so the tables don't
// accumulate dead rows. unref() so it never holds the process open.
function sweepExpired() {
  const now = new Date();
  Promise.all([
    Session.destroy({ where: { expiresAt: { [Op.lt]: now } } }),
    PasswordReset.destroy({ where: { expiresAt: { [Op.lt]: now } } }),
    RateLimit.destroy({ where: { resetAt: { [Op.lt]: now } } }),
  ]).catch((err) => console.error("[sweep] failed:", err?.message || err));
}
const sweepTimer = setInterval(sweepExpired, 60 * 60 * 1000);
sweepTimer.unref();

let server;

// sync() creates missing tables but never adds indexes to EXISTING ones, so add
// the hot-path indexes idempotently here (a no-op if they already exist). This
// is deliberately not a full migration framework — the schema is stable and a
// bad baseline against the live Postgres is the bigger risk.
async function ensureIndexes() {
  const qi = sequelize.getQueryInterface();
  const wanted = [
    ["sessions", ["UserId"], "sessions_userid"],
    ["sessions", ["expiresAt"], "sessions_expiresat"],
    ["curator_messages", ["UserId", "createdAt"], "curator_messages_userid_createdat"],
    ["game_scores", ["game", "score"], "game_scores_game_score"],
    ["game_scores", ["game", "UserId"], "game_scores_game_userid"],
  ];
  for (const [table, fields, name] of wanted) {
    try {
      await qi.addIndex(table, fields, { name });
    } catch {
      /* already exists (or table not present yet) — safe to ignore */
    }
  }
}

// Fill an empty/stale collections cache at boot so the first GET isn't empty
// (regeneration is single-flight + only fires when actually stale).
async function prewarmCollections() {
  try {
    const rows = await readCache();
    if (isStale(rows)) kickRegeneration();
  } catch (err) {
    console.error("[prewarm] collections check failed:", err?.message || err);
  }
}

async function start() {
  // Creates MISSING tables from the models. NOT migration-grade: it never ALTERs
  // an existing table (won't add/drop/retype a column), so before changing a
  // column on a populated table, adopt a real migration tool — don't rely on sync.
  await sequelize.sync();
  await ensureIndexes(); // add hot-path indexes to existing tables (idempotent)
  sweepExpired(); // clear rows that expired while we were down
  prewarmCollections(); // warm the collections cache before the first request
  server = app.listen(PORT, () => {
    console.log(`db: ${dbKind}`);
    console.log(`NUX backend on port ${PORT}`);
  });
}

// Graceful shutdown — Coolify sends SIGTERM on every redeploy. Stop accepting
// connections, drain, close the DB pool, then exit.
async function shutdown(signal) {
  console.log(`[shutdown] received ${signal}, closing...`);
  clearInterval(sweepTimer);
  try {
    if (server) await new Promise((resolve) => server.close(resolve));
    await sequelize.close();
  } catch (err) {
    console.error("[shutdown] error during close:", err?.message || err);
  } finally {
    process.exit(0);
  }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Last-resort safety nets so a stray rejection/exception is logged, not silent.
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err?.stack || err);
});

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
