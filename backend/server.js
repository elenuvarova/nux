import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize, dbKind } from "./db.js";
import "./models.js";
import authRoutes from "./routes/auth.js";
import listRoutes from "./routes/list.js";
import historyRoutes from "./routes/history.js";

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

app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: "ok", db: dbKind });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/list", listRoutes);
app.use("/api/history", historyRoutes);

if (isProd) {
  app.use(express.static(path.join(__dirname, "public")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

async function start() {
  await sequelize.sync(); // create tables from the models if missing
  app.listen(PORT, () => {
    console.log(`db: ${dbKind}`);
    console.log(`NUX backend on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
