import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

vi.mock("../lib/collectionsCache.js", () => ({
  readCache: vi.fn(),
  readOne: vi.fn(),
  isStale: vi.fn(),
  kickRegeneration: vi.fn(),
}));

import { readCache, readOne, isStale, kickRegeneration } from "../lib/collectionsCache.js";
import collectionsRoutes from "./collections.js";

function makeApp() {
  const app = express();
  app.use("/api/collections", collectionsRoutes);
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => res.status(err?.status || 500).json({ error: "internal" }));
  return app;
}

const ROW = {
  slug: "quiet-grief",
  title: "Quiet Grief",
  eyebrow: "Shelf",
  intro: "Loss.",
  entries: [["aftersun", "x"]],
  position: 0,
  generatedAt: "2026-06-13T08:00:00.000Z",
};

beforeEach(() => vi.clearAllMocks());

describe("GET /api/collections", () => {
  it("returns the cached set mapped to the public shape", async () => {
    readCache.mockResolvedValue([ROW]);
    isStale.mockReturnValue(false);
    const res = await request(makeApp()).get("/api/collections");
    expect(res.status).toBe(200);
    expect(res.body.generatedAt).toBe(ROW.generatedAt);
    expect(res.body.collections).toEqual([
      { slug: "quiet-grief", title: "Quiet Grief", eyebrow: "Shelf", intro: "Loss.", entries: [["aftersun", "x"]] },
    ]);
    expect(kickRegeneration).not.toHaveBeenCalled();
  });

  it("triggers a background regeneration when the set is stale", async () => {
    readCache.mockResolvedValue([]);
    isStale.mockReturnValue(true);
    const res = await request(makeApp()).get("/api/collections");
    expect(res.status).toBe(200);
    expect(res.body.collections).toEqual([]);
    expect(res.body.generatedAt).toBeNull();
    expect(kickRegeneration).toHaveBeenCalledTimes(1);
  });
});

describe("GET /api/collections/:slug", () => {
  it("200 with the single collection when it exists", async () => {
    readOne.mockResolvedValue(ROW);
    const res = await request(makeApp()).get("/api/collections/quiet-grief");
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe("quiet-grief");
    expect(res.body.entries).toEqual([["aftersun", "x"]]);
  });

  it("404 when the slug is unknown", async () => {
    readOne.mockResolvedValue(null);
    const res = await request(makeApp()).get("/api/collections/nope");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("not_found");
  });
});
