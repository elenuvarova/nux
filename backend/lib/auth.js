// Auth primitives, adapted from the course's principles to Express:
// sessions live in the DB (not JWT-only), the cookie is httpOnly + Secure
// (prod) + SameSite=Lax, passwords are bcrypt-hashed, and there's a small
// in-memory rate limiter on the auth routes.
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Session, User, RateLimit } from "../models.js";

const COOKIE = "nux_session";
const SESSION_DAYS = 30;
const isProd = process.env.NODE_ENV === "production";

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

// A real, valid bcrypt hash (cost 12) computed once at load. When the email
// doesn't exist we compare against THIS so bcrypt does the same work as a real
// check. The old all-zeros constant was malformed, so bcrypt.compare returned
// early — the faster response leaked which emails are registered. The plaintext
// is random and is never usable as a credential (the no-user branch still 401s).
const DUMMY_HASH = bcrypt.hashSync(crypto.randomBytes(32).toString("hex"), 12);

export async function verifyPassword(plain, hashed) {
  // compare against the dummy hash when the user doesn't exist, so response
  // time doesn't leak whether the email is registered (timing-safe enumeration).
  return bcrypt.compare(plain, hashed || DUMMY_HASH);
}

export async function createSession(res, user, userAgent) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await Session.create({ token, expiresAt, userAgent, UserId: user.id });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
}

export async function destroySession(req, res) {
  const token = req.cookies?.[COOKIE];
  if (token) await Session.destroy({ where: { token } });
  res.clearCookie(COOKIE, { path: "/" });
}

// Resolves the current user from the session cookie; null if none/expired.
export async function currentUser(req) {
  const token = req.cookies?.[COOKIE];
  if (!token) return null;
  const session = await Session.findOne({ where: { token }, include: User });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await session.destroy();
    return null;
  }
  return session.User;
}

// Gate for protected routes — sets req.user or returns 401.
export async function requireAuth(req, res, next) {
  const user = await currentUser(req);
  if (!user) return res.status(401).json({ error: "unauthorized" });
  req.user = user;
  next();
}

export function publicUser(user) {
  return { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl };
}

// ── persistent fixed-window rate limiter (per IP + bucket) ────────────
// Backed by the rate_limits table, so the window SURVIVES redeploys/restarts
// and is shared across instances — an attacker can't reset their count by
// waiting for the next Coolify deploy. Keyed on req.ip: server.js sets
// `trust proxy`, so this is the real client IP from nginx's X-Forwarded-For,
// not a spoofable header. Expired rows are swept by sweepExpired() in server.js.
export function rateLimit(bucket, max, windowMs, keyFn) {
  return async (req, res, next) => {
    // default key is the client IP; an optional keyFn lets a bucket key on
    // something else (e.g. the target email) for per-account throttling
    const suffix = keyFn ? keyFn(req) : req.ip || "local";
    if (!suffix) return next(); // nothing to key on yet (e.g. no email in body)
    const key = `${bucket}:${suffix}`;
    const now = Date.now();
    try {
      const [row, created] = await RateLimit.findOrCreate({
        where: { key },
        defaults: { count: 1, resetAt: new Date(now + windowMs) },
      });
      if (!created) {
        if (now > new Date(row.resetAt).getTime()) {
          await row.update({ count: 1, resetAt: new Date(now + windowMs) }); // new window
        } else if (row.count >= max) {
          return res.status(429).json({ error: "too_many_requests" });
        } else {
          await row.increment("count"); // atomic at the DB level
        }
      }
    } catch (err) {
      // the limiter must never block legitimate auth on its own failure
      console.error("[ratelimit] check failed:", err?.message || err);
    }
    next();
  };
}
