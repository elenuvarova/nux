import { createContext, useContext, useState, useCallback } from "react";
import { api } from "./api.js";

const CuratorContext = createContext(null);

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

  const openCurator = useCallback(() => setOpen(true), []);
  const closeCurator = useCallback(() => setOpen(false), []);
  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const send = useCallback(
    async (text) => {
      const content = (text || "").trim();
      if (!content || loading) return;
      setError(null);
      const userMsg = { role: "user", content };
      // history sent to the API: prior turns + this one, role+content only
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      try {
        const { reply, films } = await api.post("/curator", { messages: history });
        setMessages((prev) => [...prev, { role: "assistant", content: reply, films: films || [] }]);
      } catch (e) {
        setError(ERROR_BY_CODE[e?.code] || ERROR_FALLBACK);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  return (
    <CuratorContext.Provider
      value={{ open, messages, loading, error, openCurator, closeCurator, send, reset }}
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
