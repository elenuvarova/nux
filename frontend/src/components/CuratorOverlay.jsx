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

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// A single Curator reply. The most recent one (`animate`) reveals its prose
// word-by-word for a "typing" feel; its film cards appear once the text lands.
// Older replies — and anyone with reduced-motion — render instantly.
// SECURITY: curator content is model/user-derived and is stored verbatim on the
// server, so it MUST render as escaped React text only — never feed it to
// dangerouslySetInnerHTML. (React escaping + the CSP are the real defences.)
function CuratorReply({ message, animate }) {
  // split on whitespace but KEEP the separators so re-joining preserves spacing
  const tokens = message.content ? message.content.split(/(\s+)/) : [];
  const instant = !animate || prefersReducedMotion();
  const [shown, setShown] = useState(instant ? tokens.length : 0);

  useEffect(() => {
    if (instant) {
      setShown(tokens.length);
      return undefined;
    }
    setShown(0);
    let i = 0;
    const id = setInterval(() => {
      i += 2; // reveal a word + its trailing space each tick
      setShown(i);
      if (i >= tokens.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.content, animate]);

  const done = shown >= tokens.length;

  return (
    <div className="curator-reply">
      {/* The visible copy animates token-by-token with NO live region, so screen
          readers aren't spammed per word. Once the newest reply lands we drop the
          complete text into an sr-only polite region to announce it exactly once. */}
      <p className="curator-note">
        {tokens.slice(0, shown).join("")}
        {!done && <span className="curator-caret" aria-hidden="true" />}
      </p>
      {animate && done && (
        <p className="sr-only" role="status" aria-live="polite">
          {message.content}
        </p>
      )}
      {done && message.films?.length > 0 && (
        <div className="curator-results">
          {message.films.map((id) => (
            <PosterCard key={id} filmId={id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CuratorOverlay() {
  const { open, messages, loading, error, canRetry, closeCurator, send, retry, clearHistory } =
    useCurator();
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const panelRef = useRef(null);
  // The element focused before the overlay opened, restored on close so keyboard
  // users land back where they were (usually the Curator FAB).
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (open) {
      lastFocusedRef.current = document.activeElement;
      inputRef.current?.focus();
    } else if (lastFocusedRef.current) {
      // restore focus to the trigger when the panel closes
      lastFocusedRef.current.focus?.();
      lastFocusedRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // lock background scroll while dialog open (aria-modal)
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
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
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
          <div className="curator-head-titles">
            <h2>The Curator</h2>
            <p className="curator-tagline">Describe a mood — I'll pull real picks from the catalogue.</p>
          </div>
          <div className="curator-head-actions">
            {messages.length > 0 && (
              <button
                className="curator-new"
                onClick={() => {
                  clearHistory();
                  inputRef.current?.focus();
                }}
                disabled={loading}
              >
                New
              </button>
            )}
            <button className="curator-close" onClick={closeCurator} aria-label="Close">
              ✕
            </button>
          </div>
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
              <p key={m.id} className="curator-user">
                {m.content}
              </p>
            ) : (
              <CuratorReply key={m.id} message={m} animate={i === messages.length - 1} />
            )
          )}

          {loading && (
            <p className="curator-thinking" role="status" aria-live="polite">
              The Curator is considering…
            </p>
          )}
          {error && (
            <div className="curator-error" role="alert">
              <span>{error}</span>
              {canRetry && (
                <button type="button" className="curator-retry" onClick={retry}>
                  Try again
                </button>
              )}
            </div>
          )}

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
