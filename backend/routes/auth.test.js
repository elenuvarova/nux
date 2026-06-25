import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import express from "express";
import request from "supertest";
import bcrypt from "bcryptjs";

// Keep lib/auth REAL (we want the real bcrypt verify + session creation), but
// no-op the rate limiter so repeated test requests don't trip it.
vi.mock("../lib/auth.js", async () => {
  const actual = await vi.importActual("../lib/auth.js");
  return { ...actual, rateLimit: () => (_req, _res, next) => next() };
});
vi.mock("../models.js", () => ({
  User: { findOne: vi.fn(), create: vi.fn() },
  Session: { create: vi.fn().mockResolvedValue({}), destroy: vi.fn().mockResolvedValue(0) },
  PasswordReset: { findOne: vi.fn(), destroy: vi.fn(), create: vi.fn() },
}));
vi.mock("../db.js", () => ({
  sequelize: { transaction: vi.fn(async (fn) => fn({})) },
  dbKind: "sqlite",
}));
vi.mock("../lib/email.js", () => ({
  sendPasswordResetEmail: vi.fn().mockResolvedValue({}),
  sendPasswordChangedEmail: vi.fn().mockResolvedValue({}),
  emailConfigured: false,
}));

import { User, Session, PasswordReset } from "../models.js";
import { sendPasswordResetEmail } from "../lib/email.js";
import authRoutes from "./auth.js";

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => res.status(err?.status || 500).json({ error: "internal" }));
  return app;
}

let HASH;
beforeAll(async () => {
  HASH = await bcrypt.hash("password123", 12);
});
beforeEach(() => {
  vi.clearAllMocks();
  Session.create.mockResolvedValue({});
  Session.destroy.mockResolvedValue(0);
  PasswordReset.destroy.mockResolvedValue(0);
  PasswordReset.create.mockResolvedValue({});
  PasswordReset.findOne.mockResolvedValue(null);
  sendPasswordResetEmail.mockResolvedValue({});
});

describe("POST /api/auth/signup", () => {
  it("400 on an invalid email", async () => {
    const r = await request(makeApp())
      .post("/api/auth/signup")
      .send({ email: "x", name: "A", password: "password123" });
    expect(r.status).toBe(400);
    expect(r.body.error).toBe("invalid_email");
  });

  it("400 on a weak password", async () => {
    const r = await request(makeApp())
      .post("/api/auth/signup")
      .send({ email: "a@b.co", name: "A", password: "short" });
    expect(r.status).toBe(400);
    expect(r.body.error).toBe("weak_password");
  });

  it("coerces non-string fields instead of 500ing", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: "u1", email: "a@b.co", name: "123", avatarUrl: null });
    const r = await request(makeApp())
      .post("/api/auth/signup")
      .send({ email: "a@b.co", name: 123, password: "password123" });
    expect(r.status).toBe(201); // String(123) → "123"; no TypeError on .trim() → no 500
  });

  it("409 when the email is already registered", async () => {
    User.findOne.mockResolvedValue({ id: "u1" });
    const r = await request(makeApp())
      .post("/api/auth/signup")
      .send({ email: "a@b.co", name: "A", password: "password123" });
    expect(r.status).toBe(409);
    expect(r.body.error).toBe("email_taken");
  });

  it("201 + opens a session on success", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: "u1", email: "a@b.co", name: "A", avatarUrl: null });
    const r = await request(makeApp())
      .post("/api/auth/signup")
      .send({ email: "a@b.co", name: "A", password: "password123" });
    expect(r.status).toBe(201);
    expect(Session.create).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/auth/login", () => {
  it("401 on a non-existent email (no user enumeration)", async () => {
    User.findOne.mockResolvedValue(null);
    const r = await request(makeApp())
      .post("/api/auth/login")
      .send({ email: "nope@b.co", password: "password123" });
    expect(r.status).toBe(401);
    expect(r.body.error).toBe("invalid_credentials");
  });

  it("401 on a wrong password", async () => {
    User.findOne.mockResolvedValue({ id: "u1", email: "a@b.co", name: "A", hashedPassword: HASH });
    const r = await request(makeApp())
      .post("/api/auth/login")
      .send({ email: "a@b.co", password: "wrong-password" });
    expect(r.status).toBe(401);
  });

  it("401 on an over-long password (rejected before hashing)", async () => {
    const r = await request(makeApp())
      .post("/api/auth/login")
      .send({ email: "a@b.co", password: "x".repeat(100) });
    expect(r.status).toBe(401);
  });

  it("200 + session on correct credentials", async () => {
    User.findOne.mockResolvedValue({
      id: "u1",
      email: "a@b.co",
      name: "A",
      hashedPassword: HASH,
      avatarUrl: null,
    });
    const r = await request(makeApp())
      .post("/api/auth/login")
      .send({ email: "a@b.co", password: "password123" });
    expect(r.status).toBe(200);
    expect(r.body.user).toMatchObject({ email: "a@b.co" });
    expect(Session.create).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/auth/forgot", () => {
  it("200 generic for a KNOWN email AND creates a reset row", async () => {
    User.findOne.mockResolvedValue({ id: "u1", email: "a@b.co" });
    const r = await request(makeApp()).post("/api/auth/forgot").send({ email: "a@b.co" });
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);
    // a single-use token row is created for the known account
    expect(PasswordReset.create).toHaveBeenCalledTimes(1);
    // prior tokens for this user are cleared first (one valid token at a time)
    expect(PasswordReset.destroy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { UserId: "u1" } })
    );
  });

  it("200 generic for an UNKNOWN email and creates NO reset row (no enumeration)", async () => {
    User.findOne.mockResolvedValue(null);
    const r = await request(makeApp()).post("/api/auth/forgot").send({ email: "ghost@b.co" });
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);
    expect(PasswordReset.create).not.toHaveBeenCalled();
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it("returns the SAME generic body for known and unknown (no response-shape leak)", async () => {
    User.findOne.mockResolvedValue({ id: "u1", email: "a@b.co" });
    const known = await request(makeApp()).post("/api/auth/forgot").send({ email: "a@b.co" });
    User.findOne.mockResolvedValue(null);
    const unknown = await request(makeApp()).post("/api/auth/forgot").send({ email: "ghost@b.co" });
    expect(known.body).toEqual(unknown.body);
  });

  it("200 generic for a malformed email without touching the DB", async () => {
    const r = await request(makeApp()).post("/api/auth/forgot").send({ email: "not-an-email" });
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);
    expect(User.findOne).not.toHaveBeenCalled();
    expect(PasswordReset.create).not.toHaveBeenCalled();
  });
});

describe("POST /api/auth/reset", () => {
  // Build a PasswordReset record whose nested User captures the new hash on save,
  // so we can later prove the password truly changed by logging in with it.
  function makeRecord() {
    const user = {
      id: "u1",
      email: "a@b.co",
      name: "A",
      hashedPassword: HASH, // old hash
      avatarUrl: null,
      save: vi.fn(async function () {
        this._saved = true;
      }),
    };
    return { id: "pr1", User: user, user };
  }

  it("400 on a weak/short new password (before any token lookup)", async () => {
    const r = await request(makeApp())
      .post("/api/auth/reset")
      .send({ token: "tok", password: "short" });
    expect(r.status).toBe(400);
    expect(r.body.error).toBe("weak_password");
    expect(PasswordReset.findOne).not.toHaveBeenCalled();
  });

  it("400 on an expired/invalid token (no matching unexpired row)", async () => {
    PasswordReset.findOne.mockResolvedValue(null); // expiresAt filter excludes expired rows
    const r = await request(makeApp())
      .post("/api/auth/reset")
      .send({ token: "expired", password: "newpassword123" });
    expect(r.status).toBe(400);
    expect(r.body.error).toBe("invalid_token");
  });

  it("400 on a reused / already-used token (single-use: row no longer exists)", async () => {
    // first use consumed + deleted the row, so the second lookup finds nothing
    PasswordReset.findOne.mockResolvedValue(null);
    const r = await request(makeApp())
      .post("/api/auth/reset")
      .send({ token: "alreadyused", password: "newpassword123" });
    expect(r.status).toBe(400);
    expect(r.body.error).toBe("invalid_token");
  });

  it("200 on a valid token: changes the password, consumes the token, kills ALL sessions", async () => {
    const record = makeRecord();
    PasswordReset.findOne.mockResolvedValue(record);
    const r = await request(makeApp())
      .post("/api/auth/reset")
      .send({ token: "valid", password: "newpassword123" });
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);

    // password actually changed: the saved hash verifies against the new pw and
    // NOT the old one — and we can "log in" with it through the real verifier
    expect(record.user.save).toHaveBeenCalledTimes(1);
    expect(record.user.hashedPassword).not.toBe(HASH);
    expect(await bcrypt.compare("newpassword123", record.user.hashedPassword)).toBe(true);
    expect(await bcrypt.compare("password123", record.user.hashedPassword)).toBe(false);

    // token is single-use (its rows deleted) and every session is destroyed
    expect(PasswordReset.destroy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { UserId: "u1" } })
    );
    expect(Session.destroy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { UserId: "u1" } })
    );

    // prove "can log in with new pw": drive the real /login against the updated user
    User.findOne.mockResolvedValue(record.user);
    const login = await request(makeApp())
      .post("/api/auth/login")
      .send({ email: "a@b.co", password: "newpassword123" });
    expect(login.status).toBe(200);
    expect(login.body.user).toMatchObject({ email: "a@b.co" });
  });
});
