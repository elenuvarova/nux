import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';
import { STOCKED_GENRES, EXTRAS } from '../data/catalog.js';
import './Welcome.css';

export default function Welcome() {
  usePageTitle('Welcome');
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(new Set());
  // On step change, move focus to the new step's heading so keyboard and screen
  // reader users land on the fresh content (mirrors the route-change focus pattern).
  const headingRef = useRef(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const togglePick = (id) => {
    const next = new Set(picked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPicked(next);
  };

  // Onboarding is the single first-run path. Completing it (finish) arms ONE
  // contextual Curator coachmark on Home; "Sign in" skips straight past it — so
  // a visitor never gets two stacked first-run systems.
  const markOnboarded = () => {
    try {
      localStorage.setItem('nux-onboarded', '1');
    } catch {
      /* private mode — nothing to persist */
    }
  };
  // Persist the genre picks so Home can show a real "Because you like…" rail —
  // the taste step is no longer collected-then-thrown-away — and arm the one-shot
  // first-run moment on Home (taste confirmation + the single Curator coachmark).
  const finish = () => {
    try {
      localStorage.setItem('nux-genre-prefs', JSON.stringify([...picked]));
      localStorage.setItem('nux-curator-hint', '1');
    } catch {
      /* private mode */
    }
    markOnboarded();
    navigate('/');
  };
  const goSignIn = () => {
    markOnboarded();
    navigate('/signin');
  };

  if (step === 0) {
    return (
      <main className="welcome">
        <img className="welcome-bg" src={EXTRAS.welcomeBg} alt="" fetchpriority="high" />
        <div className="welcome-content">
          <p className="welcome-wordmark">NUX</p>
          <h1 className="welcome-title" tabIndex={-1} ref={headingRef}>
            Cinema for{" "}
            <br />
            Curious Minds
          </h1>
          <p className="welcome-sub">Films and documentaries, chosen one at a time.</p>
          <button type="button" className="btn btn-primary welcome-cta" onClick={() => setStep(1)}>
            Get started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" />
            </svg>
          </button>
          <button type="button" className="welcome-signin" onClick={goSignIn}>
            Already have an account? <span>Sign in</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="welcome welcome--genres">
      <div className="welcome-steps" role="group" aria-label="Onboarding progress — step 2 of 2">
        <span className="welcome-dot" aria-hidden="true" />
        <span className="welcome-dot welcome-dot--active" aria-hidden="true" />
      </div>
      <h1 className="welcome-genres-title" tabIndex={-1} ref={headingRef}>
        What kinds of stories move you?
      </h1>
      <p className="welcome-sub">Select all that apply — we’ll use this to personalise your feed.</p>
      <div className="welcome-grid" role="group" aria-label="Genres">
        {STOCKED_GENRES.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`welcome-genre ${picked.has(g.id) ? 'welcome-genre--on' : ''}`}
            aria-pressed={picked.has(g.id)}
            onClick={() => togglePick(g.id)}
          >
            <img src={g.image} alt="" loading="lazy" />
            <span>{g.label}</span>
          </button>
        ))}
      </div>
      <button type="button" className="btn btn-primary welcome-cta" onClick={finish}>
        Continue
      </button>
    </main>
  );
}
