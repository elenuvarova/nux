import { describe, it, expect } from "vitest";
import { isStale } from "./collectionsCache.js";

const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const ago = (ms) => new Date(Date.now() - ms);

describe("isStale", () => {
  it("is stale when there are no rows", () => {
    expect(isStale([])).toBe(true);
    expect(isStale(null)).toBe(true);
  });
  it("is fresh when the newest row is within the TTL", () => {
    expect(isStale([{ generatedAt: ago(60 * 1000) }])).toBe(false);
  });
  it("is stale when the newest row is older than the TTL", () => {
    expect(isStale([{ generatedAt: ago(TTL_MS + 60 * 1000) }])).toBe(true);
  });
  it("uses the NEWEST row to decide", () => {
    const rows = [{ generatedAt: ago(TTL_MS + 1000) }, { generatedAt: ago(1000) }];
    expect(isStale(rows)).toBe(false);
  });
});
