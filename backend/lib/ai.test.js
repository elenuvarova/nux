import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { askCurator } from "./ai.js";

const GEMINI_OK = {
  candidates: [
    {
      content: {
        parts: [{ text: JSON.stringify({ reply: "g", films: [{ id: "naked", reason: "raw" }] }) }],
      },
    },
  ],
};
const GROQ_OK = {
  choices: [{ message: { content: JSON.stringify({ reply: "q", films: [{ id: "if", reason: "revolt" }] }) } }],
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
    expect(out).toEqual({ reply: "g", films: [{ id: "naked", reason: "raw" }] });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("retries the same provider once on a transient error", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: "rate" }, false, 429)) // gemini 429
      .mockResolvedValueOnce(jsonResponse(GEMINI_OK)); // gemini retry succeeds
    const out = await askCurator({ system: "s", messages: [{ role: "user", content: "hi" }] });
    expect(out).toEqual({ reply: "g", films: [{ id: "naked", reason: "raw" }] });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("retries then falls over to groq when gemini keeps erroring", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: "boom" }, false, 500)) // gemini 500
      .mockResolvedValueOnce(jsonResponse({ error: "boom" }, false, 500)) // gemini 500 (retry)
      .mockResolvedValueOnce(jsonResponse(GROQ_OK)); // groq ok
    const out = await askCurator({ system: "s", messages: [{ role: "user", content: "hi" }] });
    expect(out).toEqual({ reply: "q", films: [{ id: "if", reason: "revolt" }] });
    expect(global.fetch).toHaveBeenCalledTimes(3);
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
    expect(out).toEqual({ reply: "q", films: [{ id: "if", reason: "revolt" }] });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("ignores an unknown GEMINI_MODEL (no model-name URL injection)", async () => {
    process.env.GEMINI_MODEL = "../../v1alpha/evil:inject";
    global.fetch = vi.fn().mockResolvedValueOnce(jsonResponse(GEMINI_OK));
    await askCurator({ system: "s", messages: [{ role: "user", content: "hi" }] });
    const url = String(global.fetch.mock.calls[0][0]);
    expect(url).toContain("gemini-2.0-flash");
    expect(url).not.toContain("evil");
    delete process.env.GEMINI_MODEL;
  });

  it("normalises a legacy filmIds-only response into the new films shape", async () => {
    const legacy = {
      candidates: [
        { content: { parts: [{ text: JSON.stringify({ reply: "g", filmIds: ["naked", "if"] }) }] } },
      ],
    };
    global.fetch = vi.fn().mockResolvedValueOnce(jsonResponse(legacy));
    const out = await askCurator({ system: "s", messages: [{ role: "user", content: "hi" }] });
    expect(out).toEqual({ reply: "g", films: [{ id: "naked" }, { id: "if" }] });
  });

  it("fails over when a response has neither films nor filmIds (bad shape)", async () => {
    const bad = {
      candidates: [{ content: { parts: [{ text: JSON.stringify({ reply: "g" }) }] } }],
    };
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(bad)) // gemini bad shape
      .mockResolvedValueOnce(jsonResponse(GROQ_OK)); // failover to groq
    const out = await askCurator({ system: "s", messages: [{ role: "user", content: "hi" }] });
    expect(out).toEqual({ reply: "q", films: [{ id: "if", reason: "revolt" }] });
  });
});
