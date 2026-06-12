import { useEffect, useRef, useState } from "react";
import { useCurator } from "../lib/useCurator.jsx";
import { PosterCard } from "./Rail.jsx";
import "./CuratorOverlay.css";

const CHIPS = [
  "Something tense",
  "A quiet love story",
  "Short tonight",
  "Like The Third Man",
];

// Tappable refinements shown after each reply — they continue the conversation
// (the full history is sent, so the Curator reads them in context).
const FOLLOWUPS = ["Something shorter", "Something lighter", "More like these", "Surprise me"];

export default function CuratorOverlay() {
  const { open, messages, loading, error, closeCurator, send } = useCurator();
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        closeCurator();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeCurator]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  if (!open) return null;

  const submit = (text) => {
    const t = (text ?? draft).trim();
    if (!t) return;
    setDraft("");
    send(t);
  };

  const isEmpty = messages.length === 0;
  const lastMsg = messages[messages.length - 1];
  const showFollowups = !loading && lastMsg?.role === "assistant";

  return (
    <div className="curator-scrim" onClick={closeCurator}>
      <aside
        className="curator-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Ask the Curator"
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="curator-head">
          <h2>The Curator</h2>
          <button className="curator-close" onClick={closeCurator} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="curator-body" ref={bodyRef}>
          {isEmpty && (
            <div className="curator-empty">
              <p className="curator-greeting">
                Tell me the mood you're in, and I'll find something worth your evening.
              </p>
              <div className="curator-chips">
                {CHIPS.map((c) => (
                  <button key={c} className="curator-chip" onClick={() => submit(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <p key={i} className="curator-user">
                {m.content}
              </p>
            ) : (
              <div key={i} className="curator-reply">
                <p className="curator-note">{m.content}</p>
                {m.films?.length > 0 && (
                  <div className="curator-results">
                    {m.films.map((id) => (
                      <PosterCard key={id} filmId={id} />
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {loading && <p className="curator-thinking">The Curator is considering…</p>}
          {error && <p className="curator-error">{error}</p>}

          {showFollowups && (
            <div className="curator-followups" role="group" aria-label="Refine">
              {FOLLOWUPS.map((c) => (
                <button key={c} className="curator-chip" onClick={() => submit(c)}>
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className="curator-input"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Describe a mood, or ask the Curator…"
            aria-label="Message the Curator"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !draft.trim()} aria-label="Send">
            ↑
          </button>
        </form>
      </aside>
    </div>
  );
}
