import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

vi.mock("../lib/ai.js", () => ({ askCurator: vi.fn() }));
vi.mock("../lib/auth.js", async () => {
  const actual = await vi.importActual("../lib/auth.js");
  return { ...actual, currentUser: vi.fn().mockResolvedValue(null) };
});

import { askCurator } from "../lib/ai.js";
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

beforeEach(() => vi.clearAllMocks());

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
});
