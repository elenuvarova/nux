import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { byId, HERO_ROTATION } from '../data/catalog.js';
import { useMyList } from '../lib/useMyList.js';
import './Hero.css';

function metaLine(film) {
  return [film.genre, film.year, film.runtime, film.rating ? `★ ${film.rating}` : null].filter(Boolean).join(' · ');
}

export default function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = HERO_ROTATION[i];
  const film = byId(slide.filmId);
  const { has, toggle } = useMyList();

  // auto-advance unless paused or reduced-motion. Depending on `i` restarts
  // the timer on every slide change (auto or manual), so a click resets it.
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setTimeout(() => setI((n) => (n + 1) % HERO_ROTATION.length), 8000);
    return () => clearTimeout(t);
  }, [paused, i]);

  if (!film) return null;
  const saved = has(film.id);
  const count = HERO_ROTATION.length;

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label={`Featured: ${film.title}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
    >
      <div className="hero-art" key={film.id} aria-live="off">
        <img src={film.backdrop2 || film.backdrop || film.poster} alt="" fetchpriority="high" />
      </div>
      <div className="hero-content">
        <p className="eyebrow">{slide.eyebrow}</p>
        <h1 className="hero-title" tabIndex={-1}>
          {film.title}
        </h1>
        <p className="hero-meta">
          <span className="hero-badge">{film.type}</span>
          {metaLine(film)}
        </p>
        <div className="hero-actions">
          <Link to={`/watch/${film.id}`} className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
            </svg>
            Play
          </Link>
          <button type="button" className={saved ? "btn btn-secondary btn-secondary--on" : "btn btn-secondary"} onClick={() => toggle(film.id, film.title)} aria-pressed={saved}>
            {saved ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2.5 7.5 6 11l5.5-7" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M7 2.5v9M2.5 7h9" />
              </svg>
            )}
            {saved ? 'In My List' : 'My List'}
          </button>
          <Link to={`/film/${film.id}`} className="btn btn-secondary">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="7" cy="7" r="5.7" />
              <path d="M7 6.3v3.4M7 4.2v.2" strokeLinecap="round" />
            </svg>
            More Info
          </Link>
        </div>
        <div className="hero-dots" role="group" aria-label="Featured titles">
          <button
            type="button"
            className="hero-pause"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={paused ? 'Play featured slideshow' : 'Pause featured slideshow'}
          >
            {paused ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <rect x="2.5" y="1.8" width="3.2" height="10.4" rx="0.8" />
                <rect x="8.3" y="1.8" width="3.2" height="10.4" rx="0.8" />
              </svg>
            )}
          </button>
          {HERO_ROTATION.map((s, n) => (
            <button
              key={s.filmId}
              type="button"
              aria-label={`Go to slide ${n + 1} of ${count}`}
              aria-current={n === i ? 'true' : undefined}
              className={n === i ? 'hero-dot hero-dot--on' : 'hero-dot'}
              onClick={() => setI(n)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
