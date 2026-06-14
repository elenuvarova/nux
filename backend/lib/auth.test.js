import { describe, it, expect, vi, beforeEach } from "vitest";

// Only RateLimit is exercised here; Session/User are imported by auth.js at load.
vi.mock("../models.js", () => ({
  RateLimit: { findOrCreate: vi.fn() },
  Session: {},
  User: {},
}));

import { RateLimit } from "../models.js";
import { rateLimit } from "./auth.js";

function makeRes() {
  return {
    statusCode: 200,
    body: null,
    status(c) {
      this.statusCode = c;
      return this;
    },
    json(b) {
      this.body = b;
      return this;
    },
  };
}

beforeEach(() => vi.clearAllMocks());

describe("rateLimit", () => {
  it("allows the first hit (row freshly created)", async () => {
    RateLimit.findOrCreate.mockResolvedValue([{ count: 1 }, true]);
    const res = makeRes();
    const next = vi.fn();
    await rateLimit("login", 5, 1000)({ ip: "1.2.3.4" }, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });

  it("increments while under the limit", async () => {
    const row = { count: 2, resetAt: new Date(Date.now() + 1000), update: vi.fn(), increment: vi.fn() };
    RateLimit.findOrCreate.mockResolvedValue([row, false]);
    const res = makeRes();
    const next = vi.fn();
    await rateLimit("login", 5, 1000)({ ip: "1.2.3.4" }, res, next);
    expect(row.increment).toHaveBeenCalledWith("count");
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("429s once the count reaches max within the window", async () => {
    const row = { count: 5, resetAt: new Date(Date.now() + 1000), update: vi.fn(), increment: vi.fn() };
    RateLimit.findOrCreate.mockResolvedValue([row, false]);
    const res = makeRes();
    const next = vi.fn();
    await rateLimit("login", 5, 1000)({ ip: "1.2.3.4" }, res, next);
    expect(res.statusCode).toBe(429);
    expect(res.body).toEqual({ error: "too_many_requests" });
    expect(next).not.toHaveBeenCalled();
    expect(row.increment).not.toHaveBeenCalled();
  });

  it("starts a fresh window once resetAt has passed", async () => {
    const row = { count: 99, resetAt: new Date(Date.now() - 1000), update: vi.fn(), increment: vi.fn() };
    RateLimit.findOrCreate.mockResolvedValue([row, false]);
    const res = makeRes();
    const next = vi.fn();
    await rateLimit("login", 5, 1000)({ ip: "1.2.3.4" }, res, next);
    expect(row.update).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });

  it("with a keyFn, skips entirely when no key can be derived", async () => {
    const res = makeRes();
    const next = vi.fn();
    await rateLimit("login_acct", 5, 1000, () => null)({ ip: "1.2.3.4", body: {} }, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(RateLimit.findOrCreate).not.toHaveBeenCalled();
  });

  it("fail-opens (calls next) if the store throws", async () => {
    RateLimit.findOrCreate.mockRejectedValue(new Error("db down"));
    const res = makeRes();
    const next = vi.fn();
    await rateLimit("login", 5, 1000)({ ip: "1.2.3.4" }, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });
});
