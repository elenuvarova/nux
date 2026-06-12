import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';
import { GENRES, EXTRAS } from '../data/catalog.js';
import './Welcome.css';

export default function Welcome() {
  usePageTitle('Welcome');
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(new Set());

  const togglePick = (id) => {
    const next = new Set(picked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPicked(next);
  };

  if (step === 0) {
    return (
      <main className="welcome">
        <img className="welcome-bg" src={EXTRAS.welcomeBg} alt="" fetchpriority="high" />
        <div className="welcome-content">
          <p className="welcome-wordmark">NUX</p>
          <h1 className="welcome-title" tabIndex={-1}>
            Cinema for
            <br />
            Curious Minds
          </h1>
          <p className="welcome-sub">Films, documentaries, games and courses — curated by editors who care.</p>
          <button type="button" className="btn btn-primary welcome-cta" onClick={() => setStep(1)}>
            Get Started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" />
            </svg>
          </button>
          <button type="button" className="welcome-signin" onClick={() => navigate('/')}>
            Already have an account? <span>Sign in</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="welcome welcome--genres">
      <div className="welcome-steps" aria-hidden="true">
        <span className="welcome-dot" />
        <span className="welcome-dot welcome-dot--active" />
        <span className="welcome-dot" />
        <span className="welcome-dot" />
      </div>
      <h1 className="welcome-genres-title" tabIndex={-1}>
        What kinds of stories move you?
      </h1>
      <p className="welcome-sub">Select all that apply — we'll use this to personalise your feed.</p>
      <div className="welcome-grid" role="group" aria-label="Genres">
        {GENRES.map((g) => (
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
      <button type="button" className="btn btn-primary welcome-cta" onClick={() => navigate('/')}>
        Continue
      </button>
    </main>
  );
}
