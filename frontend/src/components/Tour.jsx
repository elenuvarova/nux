import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Tour.css';

// First-run coachmark tour. Each step optionally spotlights a target element
// (located by a [data-tour="…"] selector); the last step is a centered sign-off.
const STEPS = [
  {
    sel: '[data-tour="hero"]',
    title: 'Curation, not a wall',
    body: 'Every rail is hand-picked around a narrative theme — no infinite algorithm scroll.',
  },
  {
    sel: '[data-tour="curator"]',
    title: 'Meet the Curator',
    body: 'Describe a mood — “a tense noir about betrayal” — and the Curator answers with real picks from the catalogue.',
  },
  {
    sel: null,
    title: 'That’s the tour',
    body: 'Browse by theme, search a title, or just ask the Curator. Enjoy.',
  },
];

const PAD = 8;
const CARD_W = 320;

export default function Tour({ onClose }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const cardRef = useRef(null);
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

  // Move focus into the card; Escape ends the tour.
  useEffect(() => {
    cardRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const spot = rect
    ? { top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 }
    : null;

  let cardStyle;
  if (rect) {
    const APPROX_H = 200; // enough for the 3-line card; we only need a safe clamp
    const left = Math.min(Math.max(12, rect.left), Math.max(12, window.innerWidth - CARD_W - 12));
    let top;
    if (rect.bottom + 14 + APPROX_H < window.innerHeight) {
      top = rect.bottom + 14; // below the target
    } else if (rect.top - 14 - APPROX_H > 12) {
      top = rect.top - 14 - APPROX_H; // above the target
    } else {
      top = window.innerHeight - APPROX_H - 16; // tall target → pin near the bottom
    }
    top = Math.max(12, Math.min(top, window.innerHeight - APPROX_H - 12)); // always on-screen
    cardStyle = { top, left };
  } else {
    cardStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }

  return (
    <div className="tour" role="dialog" aria-modal="true" aria-label="Welcome tour">
      <div
        className={spot ? 'tour-backdrop' : 'tour-backdrop tour-backdrop--dim'}
        onClick={finish}
        aria-hidden="true"
      />
      {spot && <div className="tour-spotlight" style={spot} aria-hidden="true" />}
      <div className="tour-card" ref={cardRef} tabIndex={-1} style={cardStyle}>
        <p className="tour-progress">
          {step + 1} / {STEPS.length}
        </p>
        <h3 className="tour-title">{s.title}</h3>
        <p className="tour-body">{s.body}</p>
        <div className="tour-actions">
          <button type="button" className="tour-skip" onClick={finish}>
            {last ? 'Close' : 'Skip'}
          </button>
          <button
            type="button"
            className="btn btn-primary tour-next"
            onClick={() => (last ? finish() : setStep((n) => n + 1))}
          >
            {last ? 'Done' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
