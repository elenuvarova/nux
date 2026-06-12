import { Router } from "express";
import { User } from "../models.js";
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

const router = Router();
const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

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

export default router;
