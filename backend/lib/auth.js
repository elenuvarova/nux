// Auth primitives, adapted from the course's principles to Express:
// sessions live in the DB (not JWT-only), the cookie is httpOnly + Secure
// (prod) + SameSite=Lax, passwords are bcrypt-hashed, and there's a small
// in-memory rate limiter on the auth routes.
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Session, User } from "../models.js";

const COOKIE = "nux_session";
const SESSION_DAYS = 30;
const isProd = process.env.NODE_ENV === "production";

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain, hashed) {
  // compare against a dummy hash when the user doesn't exist, so the
  // response time doesn't leak whether the email is registered (timing).
  return bcrypt.compare(plain, hashed || "$2a$12$0000000000000000000000000000000000000000000000000000");
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

// ── tiny fixed-window rate limiter (per IP + bucket) ──────────────────
// Keyed by req.ip: server.js sets `trust proxy` so Express derives the real
// client IP from X-Forwarded-For (set by nginx) — no manual header parsing,
// which would otherwise be spoofable.
//
// SINGLE-INSTANCE ONLY: the counters live in this process's memory. They reset
// on every redeploy/restart, and they do NOT span replicas — running two or
// more app instances behind a load balancer would multiply the effective limit
// (each instance counts independently). This is fine for our single-container
// Coolify deploy. Before scaling out horizontally, move this store to Redis or
// Postgres so the window is shared across instances.
const hits = new Map();
export function rateLimit(bucket, max, windowMs) {
  return (req, res, next) => {
    const ip = req.ip || "local";
    const key = `${bucket}:${ip}`;
    const now = Date.now();
    const rec = hits.get(key);
    if (!rec || now > rec.reset) {
      hits.set(key, { count: 1, reset: now + windowMs });
      return next();
    }
    if (rec.count >= max) {
      return res.status(429).json({ error: "too_many_requests" });
    }
    rec.count += 1;
    next();
  };
}

// Evict expired buckets so the Map can't grow unbounded under churn/abuse.
// unref() so this timer never keeps the process alive on shutdown.
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
}, 10 * 60 * 1000).unref();
