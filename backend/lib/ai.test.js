import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { askCurator } from "./ai.js";

const GEMINI_OK = {
  candidates: [{ content: { parts: [{ text: JSON.stringify({ reply: "g", filmIds: ["naked"] }) }] } }],
};
const GROQ_OK = {
  choices: [{ message: { content: JSON.stringify({ reply: "q", filmIds: ["if"] }) } }],
};

function jsonResponse(body, ok = true, status = 200) {
  return { ok, status, json: async () => body, text: async () => JSON.stringify(body) };
}

beforeEach(() => {
  process.env.GEMINI_API_KEY = "gk";
  process.env.GROQ_API_KEY = "qk";
  process.env.AI_PRIMARY = "gemini";
});
afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.AI_PRIMARY;
});

describe("askCurator failover", () => {
  it("returns the primary (gemini) result when it succeeds", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce(jsonResponse(GEMINI_OK));
    const out = await askCurator({ system: "s", messages: [{ role: "user", content: "hi" }] });
    expect(out).toEqual({ reply: "g", filmIds: ["naked"] });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("falls over to groq when gemini errors", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: "boom" }, false, 500)) // gemini 500
      .mockResolvedValueOnce(jsonResponse(GROQ_OK)); // groq ok
    const out = await askCurator({ system: "s", messages: [{ role: "user", content: "hi" }] });
    expect(out).toEqual({ reply: "q", filmIds: ["if"] });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("throws curator_unavailable when both providers fail", async () => {
    global.fetch = vi.fn().mockResolvedValue(jsonResponse({ error: "boom" }, false, 500));
    await expect(
      askCurator({ system: "s", messages: [{ role: "user", content: "hi" }] })
    ).rejects.toMatchObject({ code: "curator_unavailable" });
  });

  it("skips a provider whose key is missing", async () => {
    delete process.env.GEMINI_API_KEY; // only groq configured
    global.fetch = vi.fn().mockResolvedValueOnce(jsonResponse(GROQ_OK));
    const out = await askCurator({ system: "s", messages: [{ role: "user", content: "hi" }] });
    expect(out).toEqual({ reply: "q", filmIds: ["if"] });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
