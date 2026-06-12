import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Op } from "sequelize";
import { sequelize, dbKind } from "./db.js";
import { Session, PasswordReset } from "./models.js";
import authRoutes from "./routes/auth.js";
import listRoutes from "./routes/list.js";
import historyRoutes from "./routes/history.js";
import { ah } from "./lib/asyncHandler.js";
import { csrfOriginCheck } from "./lib/security.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// NOT process.env.PORT — Coolify sets PORT=80 (the public ingress, owned by
// nginx). The API listens on a fixed internal port that nginx proxies to.
const PORT = process.env.BACKEND_PORT || 3001;
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1); // behind nginx in prod — read the real client IP
app.use(express.json());
app.use(cookieParser());

// In prod the SPA and API share an origin, so CORS is only needed for the
// Vite dev server (which we also proxy, but keep this as a safety net).
if (!isProd) {
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:5174"],
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

// Global error handler — must be registered AFTER all routes (so it catches
// errors funnelled through next() by the ah() wrapper) and BEFORE the prod
// static catch-all (so API errors never fall through to the SPA).
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[error]", err?.stack || err?.message || err);
  if (res.headersSent) return next(err);
  res.status(err?.status || 500).json({ error: "internal" });
});

if (isProd) {
  app.use(express.static(path.join(__dirname, "public")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

// Periodically purge expired sessions and reset tokens so the tables don't
// accumulate dead rows. unref() so it never holds the process open.
function sweepExpired() {
  const now = new Date();
  Promise.all([
    Session.destroy({ where: { expiresAt: { [Op.lt]: now } } }),
    PasswordReset.destroy({ where: { expiresAt: { [Op.lt]: now } } }),
  ]).catch((err) => console.error("[sweep] failed:", err?.message || err));
}
const sweepTimer = setInterval(sweepExpired, 60 * 60 * 1000);
sweepTimer.unref();

let server;

async function start() {
  await sequelize.sync(); // create tables from the models if missing
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
