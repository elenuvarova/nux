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
  Session: { create: vi.fn().mockResolvedValue({}) },
  PasswordReset: { destroy: vi.fn(), create: vi.fn() },
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

import { User, Session } from "../models.js";
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
