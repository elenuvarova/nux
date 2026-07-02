// CSRF defence-in-depth: the session cookie is SameSite=Lax, which already
// blocks cross-site form posts, but we add an Origin/Referer allowlist check
// on every state-changing /api request as a second layer.
//
// Allowlist: in prod the app's own origin (APP_URL); in dev the Vite servers.
// Safe methods (GET/HEAD/OPTIONS) always pass through. For state-changing
// methods with no Origin/Referer at all, prod requires the SPA's JSON
// content-type rather than failing open; dev stays permissive.
const isProd = process.env.NODE_ENV === "production";

function allowedOrigins() {
  if (isProd) {
    const app = process.env.APP_URL || "https://app.nux.ontwrpn.com";
    return [app.replace(/\/$/, "")];
  }
  // 5173/5174 = vite dev; 4173 = `vite preview` (built PWA + /api proxy)
  return ["http://localhost:5173", "http://localhost:5174", "http://localhost:4173"];
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

  // No Origin/Referer at all. In prod this is suspicious for a state-changing
  // request, so we don't blanket-allow it (that would fail open). The SPA always
  // sends Content-Type: application/json on writes, and browsers can't set that
  // on a simple cross-site form post, so accepting only JSON bodies keeps the
  // app working while rejecting the classic cross-site form attack. In dev we
  // stay permissive (curl, native clients, same-origin fetches that omit it).
  if (!origin) {
    if (!isProd) return next();
    const ct = String(req.headers["content-type"] || "");
    if (ct.includes("application/json")) return next();
    return res.status(403).json({ error: "bad_origin" });
  }

  if (!allow.includes(origin)) {
    return res.status(403).json({ error: "bad_origin" });
  }
  return next();
}
