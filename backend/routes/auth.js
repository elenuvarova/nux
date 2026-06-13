import { Router } from "express";
import crypto from "crypto";
import { Op } from "sequelize";
import { sequelize } from "../db.js";
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
import { ah } from "../lib/asyncHandler.js";

const router = Router();
const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const APP_URL = process.env.APP_URL || (process.env.NODE_ENV === "production" ? "https://nux.ontwrpn.com" : "http://localhost:5173");

const NAME_MAX = 80;
const AVATAR_MAX = 500;
const PASSWORD_MAX = 200; // generous cap; bcrypt only uses the first 72 BYTES

// Reject too-short and too-long passwords. bcrypt silently truncates at 72
// bytes, so an over-long password would mask part of itself — fail loudly.
function passwordError(password) {
  if (password.length < 8) return "weak_password";
  if (password.length > PASSWORD_MAX || Buffer.byteLength(password, "utf8") > 72) {
    return "password_too_long";
  }
  return null;
}

// avatarUrl must be a SAME-ORIGIN path ("/..."), never an external or
// protocol-relative ("//evil.com") URL — the CSP blocks those from rendering
// anyway, so accept only what can actually load.
function validAvatarUrl(url) {
  return url.length <= AVATAR_MAX && url.startsWith("/") && !url.startsWith("//");
}

// POST /api/auth/signup — 5/hour per IP to blunt automated signups
router.post(
  "/signup",
  rateLimit("signup", 5, 60 * 60 * 1000),
  ah(async (req, res) => {
    const { email = "", name = "", password = "" } = req.body || {};
    const cleanName = name.trim();
    if (!emailRe.test(email)) return res.status(400).json({ error: "invalid_email" });
    if (!cleanName) return res.status(400).json({ error: "name_required" });
    if (cleanName.length > NAME_MAX) return res.status(400).json({ error: "name_too_long" });
    const pwErr = passwordError(password);
    if (pwErr) return res.status(400).json({ error: pwErr });

    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    // course variant B (UX): tell the user the email is taken
    if (existing) return res.status(409).json({ error: "email_taken" });

    const user = await User.create({
      email: email.toLowerCase(),
      name: cleanName,
      hashedPassword: await hashPassword(password),
    });
    await createSession(res, user, req.headers["user-agent"]);
    res.status(201).json({ user: publicUser(user) });
  })
);

// POST /api/auth/login — 5/min per IP
router.post(
  "/login",
  rateLimit("login", 5, 60 * 1000),
  ah(async (req, res) => {
    const { email = "", password = "" } = req.body || {};
    // Over-long password can't be valid (bcrypt caps at 72 bytes); reject
    // before hashing so a huge body can't be used to burn CPU.
    if (typeof password !== "string" || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(401).json({ error: "invalid_credentials" });
    }
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    const ok = await verifyPassword(password, user?.hashedPassword);
    // identical message + comparable timing whether the email exists or not
    if (!user || !ok) return res.status(401).json({ error: "invalid_credentials" });
    await createSession(res, user, req.headers["user-agent"]);
    res.json({ user: publicUser(user) });
  })
);

router.post(
  "/logout",
  ah(async (req, res) => {
    await destroySession(req, res);
    res.json({ ok: true });
  })
);

router.get(
  "/me",
  ah(async (req, res) => {
    const user = await currentUser(req);
    res.json({ user: user ? publicUser(user) : null });
  })
);

// PATCH /api/auth/me — edit name / avatar (own account only)
router.patch(
  "/me",
  requireAuth,
  ah(async (req, res) => {
    const { name, avatarUrl } = req.body || {};
    if (typeof name === "string") {
      const cleanName = name.trim();
      if (!cleanName || cleanName.length > NAME_MAX) {
        return res.status(400).json({ error: "invalid_name" });
      }
      req.user.name = cleanName;
    }
    if (typeof avatarUrl === "string") {
      if (!validAvatarUrl(avatarUrl)) return res.status(400).json({ error: "invalid_avatar" });
      req.user.avatarUrl = avatarUrl;
    }
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  })
);

// POST /api/auth/forgot { email } — always a generic response (no
// enumeration). If the account exists, emails a one-time reset link.
router.post(
  "/forgot",
  rateLimit("forgot", 5, 60 * 60 * 1000),
  ah(async (req, res) => {
    const email = String(req.body?.email || "").toLowerCase();
    const generic = { ok: true, message: "If an account exists for that email, we’ve sent a reset link." };
    if (!emailRe.test(email)) return res.json(generic);

    const user = await User.findOne({ where: { email } });
    if (user) {
      // invalidate any prior tokens for this user, then issue a fresh one — in
      // one transaction so a crash/race between the two can't strand the user
      // with zero valid reset tokens
      const token = crypto.randomBytes(32).toString("hex");
      await sequelize.transaction(async (t) => {
        await PasswordReset.destroy({ where: { UserId: user.id }, transaction: t });
        await PasswordReset.create(
          {
            tokenHash: sha256(token),
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            UserId: user.id,
          },
          { transaction: t }
        );
      });
      const resetUrl = `${APP_URL}/reset?token=${token}`;
      // Fire-and-forget so the registered branch doesn't take measurably longer
      // than the unregistered one (timing-safe enumeration). A real Resend
      // failure is still logged (with user.id, never the email — no PII leak).
      sendPasswordResetEmail(user.email, resetUrl).then((result) => {
        if (result?.error) console.error(`[forgot] reset email failed to send for user ${user.id}`);
      });
      // dev convenience: without email configured, surface the link in logs
      if (!emailConfigured && process.env.NODE_ENV !== "production") {
        console.log(`[dev] reset link for ${user.email}: ${resetUrl}`);
      }
    }
    res.json(generic);
  })
);

// POST /api/auth/reset { token, password } — set a new password, then sign
// the user out everywhere (kill all sessions) and confirm by email.
router.post(
  "/reset",
  rateLimit("reset", 10, 60 * 60 * 1000),
  ah(async (req, res) => {
    const token = String(req.body?.token || "");
    const password = String(req.body?.password || "");
    const pwErr = passwordError(password);
    if (pwErr) return res.status(400).json({ error: pwErr });

    const record = await PasswordReset.findOne({
      where: { tokenHash: sha256(token), expiresAt: { [Op.gt]: new Date() } },
      include: User,
    });
    if (!record || !record.User) return res.status(400).json({ error: "invalid_token" });

    record.User.hashedPassword = await hashPassword(password);
    await record.User.save();
    await PasswordReset.destroy({ where: { UserId: record.User.id } }); // single-use
    await Session.destroy({ where: { UserId: record.User.id } }); // force re-login everywhere
    const result = await sendPasswordChangedEmail(record.User.email, record.User.name);
    if (result?.error) {
      console.error(`[reset] confirmation email failed to send for user ${record.User.id}`);
    }
    res.json({ ok: true });
  })
);

export default router;
