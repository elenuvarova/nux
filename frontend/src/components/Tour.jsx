import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCurator } from '../lib/useCurator.jsx';
import './Tour.css';

// A single contextual coachmark spotlighting the Curator — NUX's one "aha".
// (The "curation, not a wall" pitch already lives on the Welcome screen, so the
// old three-step tour just repeated it; this teaches the one thing Welcome
// doesn't.) Kept as a STEPS array so it can grow back to multiple steps if needed
// — the progress dots and Skip button reappear automatically when length > 1.
const STEPS = [
  {
    sel: '[data-tour="curator"]',
    title: 'Meet the Curator',
    body: 'Describe a mood — “a tense noir about betrayal” — and the Curator answers with a few from the catalogue.',
  },
];

const PAD = 8;

export default function Tour({ onClose }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const [cardStyle, setCardStyle] = useState(null);
  const cardRef = useRef(null);
  const { openCurator, lastFocusedRef } = useCurator();
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  function finish() {
    try {
      localStorage.setItem('nux_tour_v1', '1');
    } catch {
      /* private mode — fine, the tour just won't be remembered */
    }
    onClose();
  }

  // Locate + measure the current target; keep the rect in sync on scroll/resize.
  useLayoutEffect(() => {
    if (!s.sel) {
      setRect(null);
      return undefined;
    }
    const el = document.querySelector(s.sel);
    if (!el) {
      setRect(null);
      return undefined;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    const measure = () => setRect(el.getBoundingClientRect());
    measure();
    const settle = setTimeout(measure, 360); // re-measure after smooth scroll settles
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      clearTimeout(settle);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [step, s.sel]);

  // Position the card from the target rect and the card's *real* measured size:
  // centred on the target horizontally, placed below/above it, and always kept
  // fully on-screen. The centred sign-off step (no rect) falls back to the
  // CSS-translate centre below.
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || !rect) {
      setCardStyle(null);
      return;
    }
    const M = 12; // minimum gap from any viewport edge
    const GAP = 14; // breathing room between the card and its target
    const cardW = card.offsetWidth; // honours the max-width clamp on narrow screens
    const cardH = card.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const left = Math.min(Math.max(M, rect.left + rect.width / 2 - cardW / 2), Math.max(M, vw - cardW - M));
    let top;
    if (rect.bottom + GAP + cardH <= vh - M) {
      top = rect.bottom + GAP; // below the target
    } else if (rect.top - GAP - cardH >= M) {
      top = rect.top - GAP - cardH; // above the target
    } else {
      top = vh - cardH - M; // target too tall to clear → pin to the bottom edge
    }
    top = Math.max(M, Math.min(top, vh - cardH - M)); // never clip top or bottom
    setCardStyle({ top, left });
  }, [step, rect]);

  // Make the rest of the app inert while the tour is open so keyboard/AT focus
  // can't reach the spotlit page content behind the (aria-modal) dialog. The
  // tour is portalled to <body> (see the return), so #root can be inerted
  // without inerting the tour itself — same pattern as NeonDrift.
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.inert = true;
    return () => {
      if (root) root.inert = false;
    };
  }, []);

  // Move focus into the card; Escape ends the tour; Tab is trapped inside the
  // card (defense-in-depth on top of the inert background above).
  useEffect(() => {
    cardRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        finish();
        return;
      }
      if (e.key === 'Tab') {
        const card = cardRef.current;
        if (!card) return;
        const items = Array.from(
          card.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')
        );
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === card)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const spot = rect
    ? { top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 }
    : null;

  // The spotlit target sits in the inerted #root and the spotlight itself is
  // pointer-events:none, so a click on the glowing FAB actually lands on this
  // backdrop. On the Curator step, honour the invitation — end the tour and
  // open the Curator — instead of reading it as a dismissal.
  function onBackdropClick(e) {
    const inSpot =
      spot &&
      e.clientX >= spot.left &&
      e.clientX <= spot.left + spot.width &&
      e.clientY >= spot.top &&
      e.clientY <= spot.top + spot.height;
    if (inSpot && s.sel === '[data-tour="curator"]') {
      const fab = document.querySelector(s.sel);
      finish();
      openCurator();
      // the overlay restores focus here on close — point it at the FAB, not
      // the tour card this click just unmounted
      if (fab) lastFocusedRef.current = fab;
      return;
    }
    finish();
  }

  // Until the layout effect measures the card (and for the sign-off step) sit dead-centre.
  const centred = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

  return createPortal(
    <div className="tour" role="dialog" aria-modal="true" aria-label="Welcome tour">
      <div
        className={spot ? 'tour-backdrop' : 'tour-backdrop tour-backdrop--dim'}
        onClick={onBackdropClick}
        aria-hidden="true"
      />
      {spot && <div className="tour-spotlight" style={spot} aria-hidden="true" />}
      <div className="tour-card" ref={cardRef} tabIndex={-1} style={cardStyle || centred}>
        {STEPS.length > 1 && (
          <p className="tour-progress">
            {step + 1} / {STEPS.length}
          </p>
        )}
        <h3 className="tour-title">{s.title}</h3>
        <p className="tour-body">{s.body}</p>
        <div className="tour-actions">
          {STEPS.length > 1 && (
            <button type="button" className="tour-skip" onClick={finish}>
              {last ? 'Close' : 'Skip'}
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary tour-next"
            onClick={() => (last ? finish() : setStep((n) => n + 1))}
          >
            {last ? (STEPS.length > 1 ? 'Done' : 'Got it') : 'Next'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
