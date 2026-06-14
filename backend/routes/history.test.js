import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

const TEST_USER = { id: "user-1" };

// stub requireAuth so every route runs as a known user, without real sessions
vi.mock("../lib/auth.js", async () => {
  const actual = await vi.importActual("../lib/auth.js");
  return {
    ...actual,
    requireAuth: (req, _res, next) => {
      req.user = TEST_USER;
      next();
    },
  };
});
vi.mock("../models.js", () => ({
  WatchProgress: {
    findAll: vi.fn().mockResolvedValue([]),
    upsert: vi.fn().mockResolvedValue([{}, true]),
  },
}));

import { WatchProgress } from "../models.js";
import historyRoutes from "./history.js";

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/history", historyRoutes);
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => res.status(err?.status || 500).json({ error: "internal" }));
  return app;
}

beforeEach(() => {
  vi.clearAllMocks();
  WatchProgress.findAll.mockResolvedValue([]);
  WatchProgress.upsert.mockResolvedValue([{}, true]);
});

describe("GET /api/history", () => {
  it("returns the caller's progress, scoped + shaped", async () => {
    WatchProgress.findAll.mockResolvedValue([
      { filmId: "naked", frac: 0.5, updatedAt: new Date(1000) },
    ]);
    const res = await request(makeApp()).get("/api/history");
    expect(res.status).toBe(200);
    expect(res.body.history).toEqual([{ id: "naked", frac: 0.5, at: 1000 }]);
    expect(WatchProgress.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { UserId: "user-1" } })
    );
  });
});

describe("PUT /api/history", () => {
  it("400 on an empty filmId", async () => {
    const res = await request(makeApp()).put("/api/history").send({ filmId: "", frac: 0.5 });
    expect(res.status).toBe(400);
  });

  it("clamps an over-range frac to 0.95 and upserts scoped to the caller (204)", async () => {
    const res = await request(makeApp()).put("/api/history").send({ filmId: "naked", frac: 5 });
    expect(res.status).toBe(204);
    expect(WatchProgress.upsert).toHaveBeenCalledWith({ UserId: "user-1", filmId: "naked", frac: 0.95 });
  });

  it("clamps an under-range frac up to 0.04", async () => {
    await request(makeApp()).put("/api/history").send({ filmId: "naked", frac: 0.001 });
    expect(WatchProgress.upsert).toHaveBeenCalledWith({ UserId: "user-1", filmId: "naked", frac: 0.04 });
  });

  it("falls back to 0.05 when frac is not a finite number", async () => {
    await request(makeApp()).put("/api/history").send({ filmId: "naked", frac: "abc" });
    expect(WatchProgress.upsert).toHaveBeenCalledWith({ UserId: "user-1", filmId: "naked", frac: 0.05 });
  });
});
