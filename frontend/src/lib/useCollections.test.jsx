import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCollections } from "./useCollections.js";

vi.mock("./api.js", () => ({ api: { get: vi.fn() } }));
import { api } from "./api.js";

beforeEach(() => vi.clearAllMocks());

describe("useCollections", () => {
  it("loads collections from /collections", async () => {
    api.get.mockResolvedValue({
      collections: [{ slug: "x", title: "X", entries: [["naked", "n"]] }],
    });
    const { result } = renderHook(() => useCollections());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.collections).toHaveLength(1);
    expect(api.get).toHaveBeenCalledWith("/collections");
  });

  it("degrades to an empty list on error", async () => {
    api.get.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useCollections());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.collections).toEqual([]);
  });
});
