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
}));

import { askCurator } from "../lib/ai.js";
import { currentUser } from "../lib/auth.js";
import { CuratorMessage } from "../models.js";
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

  it("200 with reply + validated films", async () => {
    askCurator.mockResolvedValue({ reply: "Try these.", filmIds: ["naked", "made-up", "drama"] });
    const res = await request(makeApp())
      .post("/api/curator")
      .send({ messages: [{ role: "user", content: "something raw" }] });
    expect(res.status).toBe(200);
    expect(res.body.reply).toBe("Try these.");
    expect(res.body.films).toEqual(["naked"]); // 'made-up' + genre 'drama' dropped
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
    askCurator.mockResolvedValue({ reply: "ok", filmIds: ["naked"] });
    await request(makeApp())
      .post("/api/curator")
      .send({ messages: [{ role: "user", content: "hi" }] });
    expect(CuratorMessage.bulkCreate).not.toHaveBeenCalled();
  });

  it("persists the user + assistant turn for a signed-in user", async () => {
    currentUser.mockResolvedValue(TEST_USER);
    askCurator.mockResolvedValue({ reply: "Here you go.", filmIds: ["naked"] });
    const res = await request(makeApp())
      .post("/api/curator")
      .send({ messages: [{ role: "user", content: "something raw" }] });
    expect(res.status).toBe(200);
    expect(CuratorMessage.bulkCreate).toHaveBeenCalledTimes(1);
    expect(CuratorMessage.bulkCreate.mock.calls[0][0]).toEqual([
      { UserId: "user-1", role: "user", content: "something raw", films: null },
      { UserId: "user-1", role: "assistant", content: "Here you go.", films: ["naked"] },
    ]);
  });
});

describe("GET /api/curator/history", () => {
  it("returns the user's saved messages, oldest→newest, scoped to them", async () => {
    CuratorMessage.findAll.mockResolvedValue([
      { role: "user", content: "hi", films: null },
      { role: "assistant", content: "there", films: ["naked"] },
    ]);
    const res = await request(makeApp()).get("/api/curator/history");
    expect(res.status).toBe(200);
    expect(CuratorMessage.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { UserId: "user-1" } })
    );
    expect(res.body.messages).toEqual([
      { role: "user", content: "hi" },
      { role: "assistant", content: "there", films: ["naked"] },
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
