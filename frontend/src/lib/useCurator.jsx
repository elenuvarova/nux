import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { api } from "./api.js";

const CuratorContext = createContext(null);

// Bridge from AuthProvider (which owns the user) into the Curator state —
// mirrors the configureMyList/configureWatchHistory pattern. On sign-in we load
// the saved conversation; on sign-out we clear it, so a shared device never
// shows a previous user's chat.
let authListener = null;
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

  // Load saved history on sign-in; clear on sign-out (privacy on shared devices).
  useEffect(() => {
    authListener = (user) => {
      setAuthed(!!user);
      if (user) {
        api
          .get("/curator/history")
          .then((r) => setMessages(r.messages || []))
          .catch(() => {});
      } else {
        setMessages([]);
        setError(null);
      }
    };
    return () => {
      authListener = null;
    };
  }, []);

  const openCurator = useCallback(() => setOpen(true), []);
  const closeCurator = useCallback(() => setOpen(false), []);
  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // "New chat" — clear locally and, for signed-in users, on the server too.
  const clearHistory = useCallback(async () => {
    setMessages([]);
    setError(null);
    if (authed) {
      try {
        await api.del("/curator/history");
      } catch {
        /* ignore — clearing locally is enough */
      }
    }
  }, [authed]);

  const send = useCallback(
    async (text) => {
      const content = (text || "").trim();
      if (!content || loadingRef.current) return;
      setError(null);
      const userMsg = { role: "user", content };
      // history sent to the API: prior turns + this one, role+content only
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      setMessages((prev) => [...prev, userMsg]);
      loadingRef.current = true;
      setLoading(true);
      try {
        const { reply, films } = await api.post("/curator", { messages: history });
        setMessages((prev) => [...prev, { role: "assistant", content: reply, films: films || [] }]);
      } catch (e) {
        setError(ERROR_BY_CODE[e?.code] || ERROR_FALLBACK);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [messages]
  );

  return (
    <CuratorContext.Provider
      value={{ open, messages, loading, error, openCurator, closeCurator, send, reset, clearHistory }}
    >
      {children}
    </CuratorContext.Provider>
  );
}

export function useCurator() {
  const ctx = useContext(CuratorContext);
  if (!ctx) throw new Error("useCurator must be used within CuratorProvider");
  return ctx;
}
