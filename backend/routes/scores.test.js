import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

// Mock auth: currentUser is settable per-test; rateLimit is a passthrough so the
// route's logic is tested in isolation (the limiter itself is covered by
// auth.test.js). publicUser etc. fall through to the real implementations.
vi.mock("../lib/auth.js", async () => {
  const actual = await vi.importActual("../lib/auth.js");
  return {
    ...actual,
    currentUser: vi.fn(async () => null),
    rateLimit: () => (req, _res, next) => next(),
  };
});

vi.mock("../models.js", () => ({
  GameScore: {
    findAll: vi.fn().mockResolvedValue([]),
    findOne: vi.fn().mockResolvedValue(null),
    findOrCreate: vi.fn(),
    create: vi.fn().mockResolvedValue({}),
    count: vi.fn().mockResolvedValue(0),
  },
  User: {}, // referenced only as an include target; the mocked findAll ignores it
}));

import { currentUser } from "../lib/auth.js";
import { GameScore } from "../models.js";
import scoresRoutes from "./scores.js";

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/scores", scoresRoutes);
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => res.status(err?.status || 500).json({ error: "internal" }));
  return app;
}

beforeEach(() => {
  vi.clearAllMocks();
  currentUser.mockResolvedValue(null);
  GameScore.findAll.mockResolvedValue([]);
  GameScore.findOne.mockResolvedValue(null);
  GameScore.count.mockResolvedValue(0);
  GameScore.create.mockResolvedValue({});
});

describe("GET /api/scores", () => {
  it("returns the top board with derived names and flags", async () => {
    currentUser.mockResolvedValue({ id: "u1", name: "Elena Uvarova" });
    GameScore.findAll.mockResolvedValue([
      { UserId: "u1", name: null, score: 142, User: { name: "Elena Uvarova" } },
      { UserId: null, name: "kai", score: 130, User: null },
    ]);
    const res = await request(makeApp()).get("/api/scores?game=neon-drift");
    expect(res.status).toBe(200);
    expect(res.body.top).toEqual([
      { rank: 1, name: "Elena U.", score: 142, registered: true, isYou: true },
      { rank: 2, name: "kai", score: 130, registered: false, isYou: false },
    ]);
    expect(GameScore.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { game: "neon-drift" },
        order: [["score", "DESC"], ["createdAt", "ASC"]],
        limit: 10,
      })
    );
  });

  it("rejects an unknown game", async () => {
    const res = await request(makeApp()).get("/api/scores?game=pong");
    expect(res.status).toBe(400);
  });

  it("reports the caller's rank when they're registered but off the top", async () => {
    currentUser.mockResolvedValue({ id: "u9", name: "Zoe Quinn" });
    GameScore.findAll.mockResolvedValue([
      { UserId: "u1", name: null, score: 500, User: { name: "Ann Bee" } },
    ]);
    GameScore.findOne.mockResolvedValue({ score: 90, createdAt: new Date("2020-01-01") });
    GameScore.count.mockResolvedValue(6); // 6 ahead → rank 7
    const res = await request(makeApp()).get("/api/scores?game=neon-drift");
    expect(res.status).toBe(200);
    expect(res.body.you).toEqual({ rank: 7, score: 90 });
  });
});

describe("POST /api/scores (guest)", () => {
  it("400 when the guest name is missing", async () => {
    const res = await request(makeApp()).post("/api/scores").send({ game: "neon-drift", score: 50 });
    expect(res.status).toBe(400);
    expect(GameScore.create).not.toHaveBeenCalled();
  });

  it("inserts a guest row with the trimmed handle and UserId null", async () => {
    const res = await request(makeApp())
      .post("/api/scores")
      .send({ game: "neon-drift", score: 50, name: "  kai  " });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true, rank: null, best: 50 });
    expect(GameScore.create).toHaveBeenCalledWith({
      game: "neon-drift",
      UserId: null,
      name: "kai",
      score: 50,
    });
  });

  it("400 on a non-integer score", async () => {
    const res = await request(makeApp())
      .post("/api/scores")
      .send({ game: "neon-drift", score: 1.5, name: "kai" });
    expect(res.status).toBe(400);
  });

  it("400 on a score over the ceiling", async () => {
    const res = await request(makeApp())
      .post("/api/scores")
      .send({ game: "neon-drift", score: 1000001, name: "kai" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/scores (registered)", () => {
  beforeEach(() => currentUser.mockResolvedValue({ id: "u1", name: "Elena Uvarova" }));

  it("creates a new row when the user has none", async () => {
    GameScore.findOrCreate.mockResolvedValue([{ score: 80 }, true]);
    GameScore.count.mockResolvedValue(2); // 2 ahead → rank 3
    const res = await request(makeApp()).post("/api/scores").send({ game: "neon-drift", score: 80 });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true, rank: 3, best: 80 });
    expect(GameScore.findOrCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { game: "neon-drift", UserId: "u1" },
        defaults: { game: "neon-drift", UserId: "u1", score: 80 },
      })
    );
  });

  it("keeps the previous best when the new score is lower", async () => {
    const update = vi.fn();
    GameScore.findOrCreate.mockResolvedValue([{ score: 100, update }, false]);
    const res = await request(makeApp()).post("/api/scores").send({ game: "neon-drift", score: 40 });
    expect(res.status).toBe(200);
    expect(res.body.best).toBe(100);
    expect(update).not.toHaveBeenCalled();
  });

  it("raises the best when the new score is higher", async () => {
    const update = vi.fn().mockResolvedValue({});
    GameScore.findOrCreate.mockResolvedValue([{ score: 100, update }, false]);
    const res = await request(makeApp()).post("/api/scores").send({ game: "neon-drift", score: 150 });
    expect(res.status).toBe(200);
    expect(res.body.best).toBe(150);
    expect(update).toHaveBeenCalledWith({ score: 150 });
  });

  it("ignores any name sent by a registered user", async () => {
    GameScore.findOrCreate.mockResolvedValue([{ score: 0 }, true]);
    await request(makeApp()).post("/api/scores").send({ game: "neon-drift", score: 10, name: "hacker" });
    expect(GameScore.findOrCreate).toHaveBeenCalledWith(
      expect.objectContaining({ defaults: expect.not.objectContaining({ name: "hacker" }) })
    );
  });
});

describe("guest name cleaning", () => {
  it("strips control chars and caps length at 16", async () => {
    const res = await request(makeApp())
      .post("/api/scores")
      .send({ game: "neon-drift", score: 5, name: "ka i_supercalifragilistic" });
    expect(res.status).toBe(201);
    const arg = GameScore.create.mock.calls[0][0];
    expect(arg.name).toBe("ka i_supercalifr"); // control chars gone, 16-char cap
    expect(arg.name.length).toBe(16);
  });

  it("400 when the name is only control chars", async () => {
    const res = await request(makeApp())
      .post("/api/scores")
      .send({ game: "neon-drift", score: 5, name: " " });
    expect(res.status).toBe(400);
    expect(GameScore.create).not.toHaveBeenCalled();
  });
});
