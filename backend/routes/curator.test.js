import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

const TEST_USER = { id: "user-1" };

vi.mock("../lib/ai.js", () => ({ askCurator: vi.fn() }));
vi.mock("../lib/auth.js", async () => {
  const actual = await vi.importActual("../lib/auth.js");
  return {
    ...actual,
    currentUser: vi.fn().mockResolvedValue(null),
    // stub requireAuth so the protected /history routes get a known user
    // without touching the real session/DB
    requireAuth: (req, _res, next) => {
      req.user = TEST_USER;
      next();
    },
    // no-op the (now DB-backed) limiter so the route test doesn't need a DB
    rateLimit: () => (_req, _res, next) => next(),
  };
});
vi.mock("../models.js", () => ({
  ListItem: { findAll: vi.fn().mockResolvedValue([]) },
  WatchProgress: { findAll: vi.fn().mockResolvedValue([]) },
  CuratorMessage: {
    findAll: vi.fn().mockResolvedValue([]),
    destroy: vi.fn().mockResolvedValue(1),
    bulkCreate: vi.fn().mockResolvedValue([]),
  },
  // DB-backed global budget cap lives in the rate_limits table now
  RateLimit: { findOrCreate: vi.fn() },
}));

import { askCurator } from "../lib/ai.js";
import { currentUser } from "../lib/auth.js";
import { CuratorMessage, RateLimit } from "../models.js";
import curatorRoutes from "./curator.js";

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/curator", curatorRoutes);
  // mirror server.js's global error handler so thrown errors → 500 JSON
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => res.status(err?.status || 500).json({ error: "internal" }));
  return app;
}

beforeEach(() => {
  vi.clearAllMocks();
  currentUser.mockResolvedValue(null); // default: guest
  CuratorMessage.findAll.mockResolvedValue([]);
  CuratorMessage.destroy.mockResolvedValue(1);
  CuratorMessage.bulkCreate.mockResolvedValue([]);
  // default: first budget hit of this hour's window → under budget
  RateLimit.findOrCreate.mockResolvedValue([{ count: 1 }, true]);
});

describe("POST /api/curator", () => {
  it("400 on empty messages", async () => {
    const res = await request(makeApp()).post("/api/curator").send({ messages: [] });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("bad_request");
  });

  it("400 when last message is not from the user", async () => {
    const res = await request(makeApp())
      .post("/api/curator")
      .send({ messages: [{ role: "assistant", content: "hi" }] });
    expect(res.status).toBe(400);
  });

  it("200 with reply + validated films carrying per-pick reasons", async () => {
    askCurator.mockResolvedValue({
      reply: "Try these.",
      films: [
        { id: "naked", reason: "raw, restless Thewlis monologue" },
        { id: "made-up", reason: "hallucinated" }, // not a catalog id → dropped
        { id: "drama", reason: "a genre row, not a film" }, // dropped
      ],
    });
    const res = await request(makeApp())
      .post("/api/curator")
      .send({ messages: [{ role: "user", content: "something raw" }] });
    expect(res.status).toBe(200);
    expect(res.body.reply).toBe("Try these.");
    // hallucinated 'made-up' + genre 'drama' dropped; the valid pick keeps its reason
    expect(res.body.films).toEqual([{ id: "naked", reason: "raw, restless Thewlis monologue" }]);
  });

  it("drops hallucinated ids even when they arrive with a plausible reason", async () => {
    askCurator.mockResolvedValue({
      reply: "Here.",
      films: [
        { id: "totally-invented", reason: "sounds convincing but isn't real" },
        { id: "if", reason: "Anderson's surreal boarding-school revolt" },
      ],
    });
    const res = await request(makeApp())
      .post("/api/curator")
      .send({ messages: [{ role: "user", content: "rebellion" }] });
    expect(res.status).toBe(200);
    expect(res.body.films).toEqual([{ id: "if", reason: "Anderson's surreal boarding-school revolt" }]);
  });

  it("emits id-only when the model omits a reason (reason optional)", async () => {
    askCurator.mockResolvedValue({ reply: "Here.", films: [{ id: "naked" }] });
    const res = await request(makeApp())
      .post("/api/curator")
      .send({ messages: [{ role: "user", content: "hi" }] });
    expect(res.status).toBe(200);
    expect(res.body.films).toEqual([{ id: "naked" }]);
  });

  it("503 once the hourly global budget is exhausted", async () => {
    // simulate the per-hour budget row already at the cap (default cap 400)
    RateLimit.findOrCreate.mockResolvedValue([{ count: 400, increment: vi.fn() }, false]);
    askCurator.mockResolvedValue({ reply: "x", films: [] });
    const res = await request(makeApp())
      .post("/api/curator")
      .send({ messages: [{ role: "user", content: "hi" }] });
    expect(res.status).toBe(503);
    expect(res.body.error).toBe("curator_unavailable");
    expect(askCurator).not.toHaveBeenCalled(); // never reaches the paid call
  });

  it("does NOT 503 from the budget when the store throws (fail open)", async () => {
    RateLimit.findOrCreate.mockRejectedValue(new Error("db down"));
    askCurator.mockResolvedValue({ reply: "ok", films: [{ id: "naked", reason: "raw" }] });
    const res = await request(makeApp())
      .post("/api/curator")
      .send({ messages: [{ role: "user", content: "hi" }] });
    expect(res.status).toBe(200); // budget fails open; per-IP limit still guards
  });

  it("503 when the adapter reports curator_unavailable", async () => {
    const err = new Error("down");
    err.code = "curator_unavailable";
    askCurator.mockRejectedValue(err);
    const res = await request(makeApp())
      .post("/api/curator")
      .send({ messages: [{ role: "user", content: "hi" }] });
    expect(res.status).toBe(503);
    expect(res.body.error).toBe("curator_unavailable");
  });

  it("does NOT persist anything for a guest", async () => {
    askCurator.mockResolvedValue({ reply: "ok", films: [{ id: "naked", reason: "raw" }] });
    await request(makeApp())
      .post("/api/curator")
      .send({ messages: [{ role: "user", content: "hi" }] });
    expect(CuratorMessage.bulkCreate).not.toHaveBeenCalled();
  });

  it("persists the user + assistant turn (with reasons) for a signed-in user", async () => {
    currentUser.mockResolvedValue(TEST_USER);
    askCurator.mockResolvedValue({
      reply: "Here you go.",
      films: [{ id: "naked", reason: "raw, restless Thewlis monologue" }],
    });
    const res = await request(makeApp())
      .post("/api/curator")
      .send({ messages: [{ role: "user", content: "something raw" }] });
    expect(res.status).toBe(200);
    expect(CuratorMessage.bulkCreate).toHaveBeenCalledTimes(1);
    expect(CuratorMessage.bulkCreate.mock.calls[0][0]).toEqual([
      { UserId: "user-1", role: "user", content: "something raw", films: null },
      {
        UserId: "user-1",
        role: "assistant",
        content: "Here you go.",
        films: [{ id: "naked", reason: "raw, restless Thewlis monologue" }],
      },
    ]);
  });
});

describe("GET /api/curator/history", () => {
  it("returns saved messages oldest→newest, with new {id,reason} and legacy id-only rows intact", async () => {
    CuratorMessage.findAll.mockResolvedValue([
      { role: "user", content: "hi", films: null },
      // new row shape (reasons persisted)
      { role: "assistant", content: "there", films: [{ id: "naked", reason: "raw" }] },
      // legacy row written before reasons existed — must still come back verbatim
      { role: "assistant", content: "older", films: ["if"] },
    ]);
    const res = await request(makeApp()).get("/api/curator/history");
    expect(res.status).toBe(200);
    expect(CuratorMessage.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { UserId: "user-1" } })
    );
    expect(res.body.messages).toEqual([
      { role: "user", content: "hi" },
      { role: "assistant", content: "there", films: [{ id: "naked", reason: "raw" }] },
      { role: "assistant", content: "older", films: ["if"] },
    ]);
  });
});

describe("DELETE /api/curator/history", () => {
  it("clears only the caller's messages", async () => {
    const res = await request(makeApp()).delete("/api/curator/history");
    expect(res.status).toBe(200);
    expect(CuratorMessage.destroy).toHaveBeenCalledWith({ where: { UserId: "user-1" } });
  });
});
