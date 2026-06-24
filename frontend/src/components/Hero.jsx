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
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  // Timer pauses on an explicit user-pause OR a transient hover/focus, but the
  // button reflects ONLY the explicit pause — so hovering the hero never flips
  // the control's glyph (which is what made it read as a second "Play").
  const paused = userPaused || hovered;
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
  // every hero backdrop ships a 660px-wide variant (X.jpg → X-660.jpg) so phones
  // don't download the full 1600px LCP image
  const bg = film.backdrop2 || film.backdrop || film.poster;
  const bgSmall = bg.replace(/\.jpg$/, '-660.jpg');

  return (
    <section
      className="hero"
      data-tour="hero"
      aria-label={`Featured: ${film.title}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      // pair for onFocusCapture: when focus leaves the hero entirely, clear the
      // pause latch so a keyboard user tabbing through doesn't freeze the
      // carousel for the rest of the session
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false);
      }}
    >
      <div className="hero-art" key={film.id} aria-live="off">
        <img
          src={bg}
          srcSet={`${bgSmall} 660w, ${bg} 1600w`}
          sizes="100vw"
          alt=""
          fetchpriority="high"
          width="1280"
          height="720"
        />
      </div>
      <div className="hero-content">
        {/* announces each slide change to assistive tech (the carousel auto-
            advances + manual dots were previously silent) */}
        <p className="sr-only" role="status">{`Slide ${i + 1} of ${count}: ${film.title}`}</p>
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
            className={userPaused ? 'hero-pause hero-pause--paused' : 'hero-pause'}
            onClick={() => setUserPaused((p) => !p)}
            aria-pressed={userPaused}
            aria-label={userPaused ? 'Resume featured slideshow' : 'Pause featured slideshow'}
          >
            {/* Glyph follows the media convention so a click is unmistakable:
                paused → play triangle (resume), playing → pause bars. Kept at the
                same 16px size + bottom-row placement so it never reads as the
                hero's primary "Play" CTA (a full amber pill with text label). */}
            {userPaused ? (
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
              aria-label={`Go to ${byId(s.filmId)?.title || `slide ${n + 1} of ${count}`}`}
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
