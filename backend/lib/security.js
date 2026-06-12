// CSRF defence-in-depth: the session cookie is SameSite=Lax, which already
// blocks cross-site form posts, but we add an Origin/Referer allowlist check
// on every state-changing /api request as a second layer.
//
// Allowlist: in prod the app's own origin (APP_URL); in dev the Vite servers.
// Requests with no Origin header for safe methods pass through (e.g. top-level
// navigations, same-origin GETs, server-to-server health checks).
const isProd = process.env.NODE_ENV === "production";

function allowedOrigins() {
  if (isProd) {
    const app = process.env.APP_URL || "https://nux.ontwrpn.com";
    return [app.replace(/\/$/, "")];
  }
  return ["http://localhost:5173", "http://localhost:5174"];
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function csrfOriginCheck(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  const allow = allowedOrigins();
  // Prefer Origin (sent on all cross-origin and most same-origin writes);
  // fall back to the origin parsed from Referer when Origin is absent.
  let origin = req.headers.origin;
  if (!origin && req.headers.referer) {
    try {
      origin = new URL(req.headers.referer).origin;
    } catch {
      origin = null;
    }
  }

  // No Origin/Referer at all: not a browser cross-site request we can verify;
  // allow it (native clients, same-origin fetches that omit the header).
  if (!origin) return next();

  if (!allow.includes(origin)) {
    return res.status(403).json({ error: "bad_origin" });
  }
  return next();
}
