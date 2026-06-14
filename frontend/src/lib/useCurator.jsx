import { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo } from "react";
import { api } from "./api.js";

const CuratorContext = createContext(null);

// Bridge from AuthProvider (which owns the user) into the Curator state —
// mirrors the configureMyList/configureWatchHistory pattern. On sign-in we load
// the saved conversation; on sign-out we clear it, so a shared device never
// shows a previous user's chat.
let authListener = null;
let configSeq = 0; // guards against a stale history fetch overwriting a newer account
let msgSeq = 0; // stable per-message id so React keys survive retry/clear without a flash
export function configureCurator(user) {
  authListener?.(user);
}

const ERROR_BY_CODE = {
  too_many_requests: "A bit too fast — give the Curator a minute.",
  curator_unavailable: "The Curator stepped away. Try again in a moment.",
};
const ERROR_FALLBACK = "Something went wrong. Try again in a moment.";

export function CuratorProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // {role, content, films?}
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Re-entry latch independent of render/closure: guarantees a single in-flight
  // request even if a stale `send` reference is called (the `loading` state is
  // for rendering only).
  const loadingRef = useRef(false);
  const [authed, setAuthed] = useState(false);
  // Mirror of `messages` so `send` can read the latest history without taking
  // it as a dependency (keeps the context value stable across every keystroke).
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  // Generation token: bumped whenever the thread is reset (New / sign-out) so a
  // send resolving after a reset is ignored instead of orphaning a reply.
  const genRef = useRef(0);
  // The last user message, kept for the "Try again" retry affordance.
  const [retryText, setRetryText] = useState(null);

  // Load saved history on sign-in; clear on sign-out (privacy on shared devices).
  useEffect(() => {
    authListener = (user) => {
      const token = ++configSeq;
      genRef.current += 1; // an account switch invalidates any in-flight send
      setAuthed(!!user);
      if (user) {
        api
          .get("/curator/history")
          .then((r) => {
            // a newer configure() ran while we awaited — drop this stale response
            if (token !== configSeq) return;
            setMessages((r.messages || []).map((m) => ({ ...m, id: ++msgSeq })));
          })
          .catch(() => {});
      } else {
        setMessages([]);
        setError(null);
        setRetryText(null);
      }
    };
    return () => {
      authListener = null;
    };
  }, []);

  const openCurator = useCallback(() => setOpen(true), []);
  const closeCurator = useCallback(() => setOpen(false), []);

  // "New chat" — clear locally and, for signed-in users, on the server too.
  const clearHistory = useCallback(async () => {
    genRef.current += 1; // invalidate any in-flight send so its reply is dropped
    setMessages([]);
    setError(null);
    setRetryText(null);
    if (authed) {
      try {
        await api.del("/curator/history");
      } catch {
        /* ignore — clearing locally is enough */
      }
    }
  }, [authed]);

  const send = useCallback(async (text) => {
    const content = (text || "").trim();
    if (!content || loadingRef.current) return;
    setError(null);
    setRetryText(null);
    const userMsg = { id: ++msgSeq, role: "user", content };
    // history sent to the API: prior turns + this one, role+content only
    const history = [...messagesRef.current, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));
    setMessages((prev) => [...prev, userMsg]);
    const gen = genRef.current;
    loadingRef.current = true;
    setLoading(true);
    try {
      const { reply, films } = await api.post("/curator", { messages: history });
      // a New/sign-out happened mid-request — drop this now-orphaned reply
      if (gen !== genRef.current) return;
      setMessages((prev) => [...prev, { id: ++msgSeq, role: "assistant", content: reply, films: films || [] }]);
    } catch (e) {
      if (gen !== genRef.current) return;
      setError(ERROR_BY_CODE[e?.code] || ERROR_FALLBACK);
      setRetryText(content); // expose a "Try again" affordance for the failed turn
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Re-send the last user message after a failure: roll its turn back off the
  // thread first so `send` rebuilds the history without duplicating it. The ref
  // is updated synchronously so `send` (which reads it immediately) sees the
  // rolled-back history, not the stale optimistic turn.
  const retry = useCallback(() => {
    const text = retryText;
    if (!text || loadingRef.current) return;
    const prev = messagesRef.current;
    const last = prev[prev.length - 1];
    const rolledBack =
      last?.role === "user" && last.content === text ? prev.slice(0, -1) : prev;
    messagesRef.current = rolledBack;
    setMessages(rolledBack);
    setError(null);
    setRetryText(null);
    send(text);
  }, [retryText, send]);

  const value = useMemo(
    () => ({
      open,
      messages,
      loading,
      error,
      canRetry: !!retryText,
      openCurator,
      closeCurator,
      send,
      retry,
      clearHistory,
    }),
    [open, messages, loading, error, retryText, openCurator, closeCurator, send, retry, clearHistory]
  );

  return <CuratorContext.Provider value={value}>{children}</CuratorContext.Provider>;
}

export function useCurator() {
  const ctx = useContext(CuratorContext);
  if (!ctx) throw new Error("useCurator must be used within CuratorProvider");
  return ctx;
}
