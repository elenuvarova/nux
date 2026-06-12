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
const hits = new Map();
export function rateLimit(bucket, max, windowMs) {
  return (req, res, next) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "local";
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
