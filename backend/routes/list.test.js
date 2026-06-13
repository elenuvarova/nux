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
  ListItem: {
    findAll: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({}),
    destroy: vi.fn().mockResolvedValue(1),
  },
}));

import { ListItem } from "../models.js";
import listRoutes from "./list.js";

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/list", listRoutes);
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => res.status(err?.status || 500).json({ error: "internal" }));
  return app;
}

beforeEach(() => {
  vi.clearAllMocks();
  ListItem.findAll.mockResolvedValue([]);
  ListItem.create.mockResolvedValue({});
  ListItem.destroy.mockResolvedValue(1);
});

describe("GET /api/list", () => {
  it("returns only the caller's items (scoped query)", async () => {
    ListItem.findAll.mockResolvedValue([{ filmId: "a" }, { filmId: "b" }]);
    const res = await request(makeApp()).get("/api/list");
    expect(res.status).toBe(200);
    expect(res.body.list).toEqual(["a", "b"]);
    expect(ListItem.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { UserId: "user-1" } })
    );
  });
});

describe("POST /api/list", () => {
  it("400 on an empty filmId", async () => {
    const res = await request(makeApp()).post("/api/list").send({ filmId: "" });
    expect(res.status).toBe(400);
  });

  it("400 on an over-long filmId", async () => {
    const res = await request(makeApp()).post("/api/list").send({ filmId: "x".repeat(200) });
    expect(res.status).toBe(400);
  });

  it("creates the item scoped to the caller", async () => {
    const res = await request(makeApp()).post("/api/list").send({ filmId: "naked" });
    expect(res.status).toBe(201);
    expect(ListItem.create).toHaveBeenCalledWith({ UserId: "user-1", filmId: "naked" });
  });
});

describe("DELETE /api/list/:filmId", () => {
  it("400 on an over-long filmId", async () => {
    const res = await request(makeApp()).delete("/api/list/" + "x".repeat(200));
    expect(res.status).toBe(400);
  });

  it("destroys only the caller's row (no IDOR)", async () => {
    const res = await request(makeApp()).delete("/api/list/naked");
    expect(res.status).toBe(200);
    expect(ListItem.destroy).toHaveBeenCalledWith({
      where: { UserId: "user-1", filmId: "naked" },
    });
  });
});
