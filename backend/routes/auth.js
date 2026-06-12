import { Router } from "express";
import crypto from "crypto";
import { Op } from "sequelize";
import { User, Session, PasswordReset } from "../models.js";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  currentUser,
  publicUser,
  requireAuth,
  rateLimit,
} from "../lib/auth.js";
import { sendPasswordResetEmail, sendPasswordChangedEmail, emailConfigured } from "../lib/email.js";

const router = Router();
const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const APP_URL = process.env.APP_URL || (process.env.NODE_ENV === "production" ? "https://nux.ontwrpn.com" : "http://localhost:5173");

// POST /api/auth/signup — 3/hour per IP to blunt automated signups
router.post("/signup", rateLimit("signup", 5, 60 * 60 * 1000), async (req, res) => {
  const { email = "", name = "", password = "" } = req.body || {};
  if (!emailRe.test(email)) return res.status(400).json({ error: "invalid_email" });
  if (!name.trim()) return res.status(400).json({ error: "name_required" });
  if (password.length < 8) return res.status(400).json({ error: "weak_password" });

  const existing = await User.findOne({ where: { email: email.toLowerCase() } });
  // course variant B (UX): tell the user the email is taken
  if (existing) return res.status(409).json({ error: "email_taken" });

  const user = await User.create({
    email: email.toLowerCase(),
    name: name.trim(),
    hashedPassword: await hashPassword(password),
  });
  await createSession(res, user, req.headers["user-agent"]);
  res.status(201).json({ user: publicUser(user) });
});

// POST /api/auth/login — 5/min per IP
router.post("/login", rateLimit("login", 5, 60 * 1000), async (req, res) => {
  const { email = "", password = "" } = req.body || {};
  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  const ok = await verifyPassword(password, user?.hashedPassword);
  // identical message + comparable timing whether the email exists or not
  if (!user || !ok) return res.status(401).json({ error: "invalid_credentials" });
  await createSession(res, user, req.headers["user-agent"]);
  res.json({ user: publicUser(user) });
});

router.post("/logout", async (req, res) => {
  await destroySession(req, res);
  res.json({ ok: true });
});

router.get("/me", async (req, res) => {
  const user = await currentUser(req);
  res.json({ user: user ? publicUser(user) : null });
});

// PATCH /api/auth/me — edit name / avatar (own account only)
router.patch("/me", requireAuth, async (req, res) => {
  const { name, avatarUrl } = req.body || {};
  if (typeof name === "string" && name.trim()) req.user.name = name.trim();
  if (typeof avatarUrl === "string") req.user.avatarUrl = avatarUrl;
  await req.user.save();
  res.json({ user: publicUser(req.user) });
});

// POST /api/auth/forgot { email } — always a generic response (no
// enumeration). If the account exists, emails a one-time reset link.
router.post("/forgot", rateLimit("forgot", 5, 60 * 60 * 1000), async (req, res) => {
  const email = String(req.body?.email || "").toLowerCase();
  const generic = { ok: true, message: "If an account exists for that email, we’ve sent a reset link." };
  if (!emailRe.test(email)) return res.json(generic);

  const user = await User.findOne({ where: { email } });
  if (user) {
    // invalidate any prior tokens for this user, then issue a fresh one
    await PasswordReset.destroy({ where: { UserId: user.id } });
    const token = crypto.randomBytes(32).toString("hex");
    await PasswordReset.create({
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      UserId: user.id,
    });
    const resetUrl = `${APP_URL}/reset?token=${token}`;
    await sendPasswordResetEmail(user.email, resetUrl);
    // dev convenience: without email configured, surface the link in logs
    if (!emailConfigured && process.env.NODE_ENV !== "production") {
      console.log(`[dev] reset link for ${user.email}: ${resetUrl}`);
    }
  }
  res.json(generic);
});

// POST /api/auth/reset { token, password } — set a new password, then sign
// the user out everywhere (kill all sessions) and confirm by email.
router.post("/reset", rateLimit("reset", 10, 60 * 60 * 1000), async (req, res) => {
  const token = String(req.body?.token || "");
  const password = String(req.body?.password || "");
  if (password.length < 8) return res.status(400).json({ error: "weak_password" });

  const record = await PasswordReset.findOne({
    where: { tokenHash: sha256(token), expiresAt: { [Op.gt]: new Date() } },
    include: User,
  });
  if (!record || !record.User) return res.status(400).json({ error: "invalid_token" });

  record.User.hashedPassword = await hashPassword(password);
  await record.User.save();
  await PasswordReset.destroy({ where: { UserId: record.User.id } }); // single-use
  await Session.destroy({ where: { UserId: record.User.id } }); // force re-login everywhere
  await sendPasswordChangedEmail(record.User.email, record.User.name);
  res.json({ ok: true });
});

export default router;
