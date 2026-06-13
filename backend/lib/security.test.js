import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { csrfOriginCheck } from "./security.js";

// Drive the middleware with a fake req/res and report whether it called next().
function run(mw, { method = "POST", origin, referer, contentType } = {}) {
  const headers = {};
  if (origin) headers.origin = origin;
  if (referer) headers.referer = referer;
  if (contentType) headers["content-type"] = contentType;
  let status = 200;
  let nexted = false;
  const res = {
    status(s) {
      status = s;
      return this;
    },
    json() {
      return this;
    },
  };
  mw({ method, headers }, res, () => {
    nexted = true;
  });
  return { nexted, status };
}

describe("csrfOriginCheck (dev)", () => {
  it("passes safe methods regardless of origin", () => {
    expect(run(csrfOriginCheck, { method: "GET", origin: "https://evil.example" }).nexted).toBe(true);
  });

  it("passes an allowed dev origin", () => {
    expect(run(csrfOriginCheck, { origin: "http://localhost:5173" }).nexted).toBe(true);
  });

  it("rejects a cross-origin write with 403", () => {
    const r = run(csrfOriginCheck, { origin: "https://evil.example" });
    expect(r.nexted).toBe(false);
    expect(r.status).toBe(403);
  });

  it("derives the origin from Referer when Origin is absent", () => {
    expect(run(csrfOriginCheck, { referer: "http://localhost:5173/browse" }).nexted).toBe(true);
    expect(run(csrfOriginCheck, { referer: "https://evil.example/x" }).status).toBe(403);
  });

  it("is permissive on a no-origin write in dev (curl / native clients)", () => {
    expect(run(csrfOriginCheck, {}).nexted).toBe(true);
  });
});

describe("csrfOriginCheck (prod — fail-closed on no-origin)", () => {
  let prodMw;
  beforeEach(async () => {
    vi.resetModules();
    process.env.NODE_ENV = "production";
    process.env.APP_URL = "https://nux.ontwrpn.com";
    prodMw = (await import("./security.js")).csrfOriginCheck;
    process.env.NODE_ENV = "test";
  });
  afterAll(() => {
    process.env.NODE_ENV = "test";
    delete process.env.APP_URL;
  });

  it("passes the app's own origin", () => {
    expect(run(prodMw, { origin: "https://nux.ontwrpn.com" }).nexted).toBe(true);
  });

  it("rejects a cross-origin write", () => {
    expect(run(prodMw, { origin: "https://evil.example" }).status).toBe(403);
  });

  it("rejects a no-origin NON-json write (the classic cross-site form post)", () => {
    expect(run(prodMw, { contentType: "text/plain" }).status).toBe(403);
  });

  it("allows a no-origin JSON write (the SPA's fetch)", () => {
    expect(run(prodMw, { contentType: "application/json" }).nexted).toBe(true);
  });
});
