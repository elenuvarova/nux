import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./ai.js", () => ({ callModel: vi.fn() }));
import { callModel } from "./ai.js";
import {
  generateCollections,
  validateCollectionEntries,
  slugify,
} from "./curatorCollections.js";

beforeEach(() => vi.clearAllMocks());

describe("slugify", () => {
  it("kebab-cases and strips punctuation", () => {
    expect(slugify("Quiet Grief on Screen!")).toBe("quiet-grief-on-screen");
  });
  it("falls back to 'collection' for empty input", () => {
    expect(slugify("")).toBe("collection");
    expect(slugify("   ")).toBe("collection");
  });
});

describe("validateCollectionEntries", () => {
  it("keeps only real catalog ids, as [id, note] pairs", () => {
    const out = validateCollectionEntries([
      { id: "naked", note: "Raw." },
      { id: "made-up-film", note: "Nope." },
      { id: "drama", note: "Genre row, not a film." },
    ]);
    expect(out).toEqual([["naked", "Raw."]]);
  });
  it("dedupes, trims notes to 160 chars, and caps at 6", () => {
    const long = "x".repeat(300);
    const out = validateCollectionEntries([
      { id: "naked", note: long },
      { id: "naked", note: "dupe" },
      { id: "if", note: "a" },
      { id: "aftersun", note: "b" },
      { id: "saint-maud", note: "c" },
      { id: "senna", note: "d" },
      { id: "sexy-beast", note: "e" },
      { id: "the-third-man", note: "f" },
    ]);
    expect(out.length).toBe(6);
    expect(out[0][1].length).toBe(160);
    expect(new Set(out.map((e) => e[0])).size).toBe(6);
  });
  it("handles non-array safely", () => {
    expect(validateCollectionEntries(null)).toEqual([]);
    expect(validateCollectionEntries("nope")).toEqual([]);
  });
});

describe("generateCollections", () => {
  it("cleans, drops thin collections, uniquifies slugs, caps at 3", async () => {
    callModel.mockResolvedValue([
      {
        title: "Quiet Grief",
        eyebrow: "Shelf",
        intro: "Loss.",
        entries: [
          { id: "aftersun", note: "x" },
          { id: "saint-maud", note: "y" },
          { id: "if", note: "z" },
        ],
      },
      {
        title: "Thin",
        eyebrow: "x",
        intro: "y",
        entries: [{ id: "naked", note: "n" }, { id: "fake", note: "f" }],
      },
      {
        title: "Quiet Grief",
        eyebrow: "Shelf",
        intro: "More loss.",
        entries: [
          { id: "senna", note: "x" },
          { id: "sexy-beast", note: "y" },
          { id: "the-third-man", note: "z" },
        ],
      },
      {
        title: "Fourth",
        eyebrow: "x",
        intro: "y",
        entries: [
          { id: "billy-liar", note: "x" },
          { id: "naked", note: "y" },
          { id: "if", note: "z" },
        ],
      },
    ]);

    const out = await generateCollections();
    expect(out.length).toBe(3);
    expect(out[0].slug).toBe("quiet-grief");
    expect(out[1].slug).toBe("quiet-grief-2");
    expect(out[0].entries).toEqual([
      ["aftersun", "x"],
      ["saint-maud", "y"],
      ["if", "z"],
    ]);
  });

  it("propagates a curator_unavailable failure from the adapter", async () => {
    const err = new Error("down");
    err.code = "curator_unavailable";
    callModel.mockRejectedValue(err);
    await expect(generateCollections()).rejects.toMatchObject({ code: "curator_unavailable" });
  });
});
