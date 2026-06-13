import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { CuratorProvider, useCurator, configureCurator } from "./useCurator.jsx";

vi.mock("./api.js", () => ({ api: { post: vi.fn(), get: vi.fn(), del: vi.fn() } }));
import { api } from "./api.js";

const wrapper = ({ children }) => <CuratorProvider>{children}</CuratorProvider>;
beforeEach(() => vi.clearAllMocks());

describe("useCurator", () => {
  it("open/close toggles the panel", () => {
    const { result } = renderHook(() => useCurator(), { wrapper });
    expect(result.current.open).toBe(false);
    act(() => result.current.openCurator());
    expect(result.current.open).toBe(true);
    act(() => result.current.closeCurator());
    expect(result.current.open).toBe(false);
  });

  it("send appends the user message then the curator reply", async () => {
    api.post.mockResolvedValue({ reply: "Here.", films: ["naked"] });
    const { result } = renderHook(() => useCurator(), { wrapper });
    await act(async () => {
      await result.current.send("something raw");
    });
    const msgs = result.current.messages;
    expect(msgs[0]).toMatchObject({ role: "user", content: "something raw" });
    expect(msgs[1]).toMatchObject({ role: "assistant", content: "Here.", films: ["naked"] });
    // only role+content are sent to the API (films stripped)
    expect(api.post).toHaveBeenCalledWith("/curator", {
      messages: [{ role: "user", content: "something raw" }],
    });
  });

  it("maps a rate-limit error to a friendly message", async () => {
    const err = new Error("too_many_requests");
    err.code = "too_many_requests";
    api.post.mockRejectedValue(err);
    const { result } = renderHook(() => useCurator(), { wrapper });
    await act(async () => {
      await result.current.send("hi");
    });
    await waitFor(() => expect(result.current.error).toMatch(/moment|fast|minute/i));
  });

  it("maps a curator-unavailable error to a friendly message", async () => {
    const err = new Error("curator_unavailable");
    err.code = "curator_unavailable";
    api.post.mockRejectedValue(err);
    const { result } = renderHook(() => useCurator(), { wrapper });
    await act(async () => {
      await result.current.send("hi");
    });
    await waitFor(() => expect(result.current.error).toMatch(/stepped away|moment/i));
  });

  it("loads saved history when a user signs in", async () => {
    api.get.mockResolvedValue({
      messages: [
        { role: "user", content: "hi" },
        { role: "assistant", content: "yo", films: [] },
      ],
    });
    const { result } = renderHook(() => useCurator(), { wrapper });
    await act(async () => {
      configureCurator({ id: "u1" });
    });
    await waitFor(() => expect(result.current.messages).toHaveLength(2));
    expect(api.get).toHaveBeenCalledWith("/curator/history");
  });

  it("clears the conversation on sign-out", async () => {
    api.post.mockResolvedValue({ reply: "x", films: [] });
    const { result } = renderHook(() => useCurator(), { wrapper });
    await act(async () => {
      await result.current.send("hi");
    });
    expect(result.current.messages).toHaveLength(2);
    act(() => {
      configureCurator(null);
    });
    expect(result.current.messages).toEqual([]);
  });

  it("clearHistory clears locally and deletes server history when signed in", async () => {
    api.get.mockResolvedValue({ messages: [{ role: "user", content: "hi" }] });
    api.del.mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useCurator(), { wrapper });
    await act(async () => {
      configureCurator({ id: "u1" });
    });
    await waitFor(() => expect(result.current.messages).toHaveLength(1));
    await act(async () => {
      await result.current.clearHistory();
    });
    expect(result.current.messages).toEqual([]);
    expect(api.del).toHaveBeenCalledWith("/curator/history");
  });
});
