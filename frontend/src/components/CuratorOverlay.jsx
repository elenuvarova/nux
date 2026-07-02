import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
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

// A single Curator reply. A `fresh` reply (just sent, not restored history)
// reveals its prose word-by-word for a "typing" feel; its film cards appear
// once the text lands. Older/restored replies — and anyone with reduced-motion
// — render instantly. Screen-reader announcement of the reply happens once,
// via the panel-level status region, NOT here — a live region on animating
// text would be read word-by-word.
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
      <p className="curator-note">
        {/* speaker attribution is otherwise only visual (bubble side/colour) */}
        <span className="sr-only">The Curator: </span>
        {tokens.slice(0, shown).join("")}
        {!done && <span className="curator-caret" aria-hidden="true" />}
      </p>
      {done && message.films?.length > 0 && (
        <div className="curator-results">
          {message.films.map((f) => {
            // backend now returns { id, reason? }; tolerate legacy [string] rows
            const id = typeof f === "string" ? f : f.id;
            const reason = typeof f === "string" ? null : f.reason;
            // message.id keeps the id unique when the same film is picked twice
            // in one conversation
            const reasonId = reason ? `curator-reason-${message.id}-${id}` : undefined;
            return (
              <div className="curator-pick" key={id}>
                <PosterCard filmId={id} describedBy={reasonId} />
                {reason && (
                  <p className="curator-pick-reason" id={reasonId}>
                    {reason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CuratorOverlay() {
  const {
    open,
    messages,
    loading,
    error,
    canRetry,
    closeCurator,
    send,
    retry,
    clearHistory,
    // captured by openCurator at click time; by the time this component's
    // effects run, the (now display:none) FAB has already been blurred to <body>
    lastFocusedRef,
  } = useCurator();
  const [draft, setDraft] = useState("");
  // Text for the two panel-level sr-only status regions. The nodes mount EMPTY
  // and are filled afterwards — VoiceOver often stays silent on a live region
  // that is inserted already populated.
  const [statusText, setStatusText] = useState("");
  const [announceText, setAnnounceText] = useState("");
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const panelRef = useRef(null);
  const { pathname } = useLocation();
  const pathRef = useRef(pathname);
  const wasLoadingRef = useRef(false);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      // opened mid-send (Browse hands its query straight in): if the input
      // can't take focus for any reason, the dialog itself must hold it
      if (document.activeElement !== inputRef.current) panelRef.current?.focus();
    } else {
      // stale announcement text must not be present when the panel remounts —
      // a live region that mounts populated is skipped or misread
      setStatusText("");
      setAnnounceText("");
      if (lastFocusedRef.current) {
        // restore focus to the trigger when the panel closes
        lastFocusedRef.current.focus?.();
        lastFocusedRef.current = null;
      }
    }
  }, [open, lastFocusedRef]);

  useEffect(() => {
    if (!open) return undefined;
    // The panel is portalled to <body>, so #root can be made inert without
    // inerting the dialog — keyboard/AT can't reach the page behind the
    // aria-modal panel (same pattern as Tour and NeonDrift). Guarded: tests
    // render without a #root node.
    const root = document.getElementById("root");
    if (root) root.inert = true;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // lock background scroll while dialog open (aria-modal)
    const onKey = (e) => {
      if (e.key === "Escape") {
        closeCurator();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        // disabled controls (send with an empty draft, New while loading) can't
        // take focus — wrapping onto one would strand the trap
        const focusable = Array.from(
          panelRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.disabled);
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
      if (root) root.inert = false;
    };
  }, [open, closeCurator]);

  // Activating a pick is an SPA navigation underneath the open dialog — close
  // it, or RouteReset's heading focus lands behind an aria-modal wall.
  useEffect(() => {
    if (pathRef.current === pathname) return;
    pathRef.current = pathname;
    if (open) closeCurator();
  }, [pathname, open, closeCurator]);

  // fill/clear the persistent status region AFTER mount, never on it
  useEffect(() => {
    setStatusText(loading ? "The Curator is considering…" : "");
  }, [loading]);

  // One-shot reply announcement: only replies flagged `fresh` by send() are
  // announced (restored history stays silent), and the region is cleared right
  // after so browsing AT never finds stale text.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || !last.fresh) return undefined;
    const picks = last.films?.length || 0;
    const suffix =
      picks === 0 ? "" : picks === 1 ? " — 1 pick follows." : ` — ${picks} picks follow.`;
    setAnnounceText(`${last.content}${suffix}`);
    const t = setTimeout(() => setAnnounceText(""), 1200);
    return () => clearTimeout(t);
  }, [messages]);

  // The input stays focusable during a send (readOnly, not disabled), but a
  // chip or the New button can unmount under the focused element mid-flight —
  // put focus back on the input once the reply lands.
  useEffect(() => {
    if (
      wasLoadingRef.current &&
      !loading &&
      open &&
      !panelRef.current?.contains(document.activeElement)
    ) {
      inputRef.current?.focus();
    }
    wasLoadingRef.current = loading;
  }, [loading, open]);

  if (!open) return null;

  const submit = (text) => {
    const t = (text ?? draft).trim();
    if (!t) return;
    setDraft("");
    send(t);
  };

  // Chips unmount the moment a send starts — focus must move to the input
  // BEFORE the clicked chip leaves the DOM, or it drops to <body>.
  const submitChip = (c) => {
    inputRef.current?.focus();
    submit(c);
  };

  const isEmpty = messages.length === 0;
  const lastMsg = messages[messages.length - 1];
  const showFollowups = !loading && lastMsg?.role === "assistant";

  return createPortal(
    <div className="curator-scrim" onClick={closeCurator}>
      <aside
        className="curator-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="curator-title"
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="curator-head">
          <div className="curator-head-titles">
            <h2 id="curator-title">The Curator</h2>
            <p className="curator-tagline">Describe a mood. I’ll pull a few from the catalogue.</p>
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

        {/* role=log fits a transcript but is implicitly live — announcements are
            owned by the status regions below, and the typing animation must not
            be read word-by-word, so liveness is switched off. tabIndex makes the
            scroller reachable so keyboard users can scroll old turns. */}
        <div
          className="curator-body"
          ref={bodyRef}
          role="log"
          aria-live="off"
          aria-label="Conversation"
          tabIndex={0}
        >
          {isEmpty && (
            <div className="curator-empty">
              <p className="curator-greeting">
                Tell me the mood you're in, and I'll find you something for tonight.
              </p>
              <div className="curator-chips">
                {CHIPS.map((c) => (
                  <button key={c} className="curator-chip" onClick={() => submitChip(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <p key={m.id} className="curator-user">
                {/* speaker attribution is otherwise only visual (bubble side/colour) */}
                <span className="sr-only">You: </span>
                {m.content}
              </p>
            ) : (
              <CuratorReply key={m.id} message={m} animate={!!m.fresh && i === messages.length - 1} />
            )
          )}

          {loading && (
            // announcement comes from the persistent status region — exposing
            // this copy too would read it twice
            <p className="curator-thinking" aria-hidden="true">
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
                <button key={c} className="curator-chip" onClick={() => submitChip(c)}>
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* persistent live regions: mounted with the panel and initially empty,
            because a role=status node inserted with content is often not read */}
        <p className="sr-only" role="status">
          {statusText}
        </p>
        <p className="sr-only" role="status">
          {announceText}
        </p>

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
            // readOnly, NOT disabled: a disabled input throws focus to <body>
            // mid-send; send() already guards re-entry via its loading latch
            readOnly={loading}
          />
          <button type="submit" disabled={loading || !draft.trim()} aria-label="Send">
            ↑
          </button>
        </form>
      </aside>
    </div>,
    document.body
  );
}
