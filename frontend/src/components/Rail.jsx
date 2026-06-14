import { Link, useNavigate } from 'react-router-dom';
import { byId } from '../data/catalog.js';
import { useTilt } from '../lib/useTilt.js';
import './Rail.css';

/* Mark the artwork inside `scope` as the shared element for the
   poster → hero View Transition morph. Clear stale marks AND the current
   detail hero first — duplicate view-transition-names silently skip the
   whole transition (e.g. when navigating FilmDetail → FilmDetail). */
function markHeroArtIn(scope) {
  document.querySelectorAll('[data-vt="hero-art"], .fd-art img, .fd-poster-frame img').forEach((el) => {
    el.style.viewTransitionName = '';
    delete el.dataset.vt;
  });
  const img = scope?.querySelector('img');
  if (img) {
    img.style.viewTransitionName = 'hero-art';
    img.dataset.vt = 'hero-art';
  }
}

function markHeroArt(e) {
  markHeroArtIn(e.currentTarget);
}

function minutesLabel(min) {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h}h ${m}m left` : `${h}h left`;
  }
  return `${min}m left`;
}

export function PosterCard({ filmId }) {
  const film = byId(filmId);
  const tilt = useTilt();
  const navigate = useNavigate();
  if (!film) return null;
  // Play glyph jumps straight to the player; a click anywhere else on the card
  // opens the film page. preventDefault/stopPropagation keep the wrapping Link
  // from also firing on its way up.
  function playNow(e) {
    e.preventDefault();
    e.stopPropagation();
    markHeroArtIn(e.currentTarget.closest('.poster-card-art'));
    navigate(`/watch/${film.id}`, { viewTransition: true });
  }
  return (
    <Link to={`/film/${film.id}`} className="poster-card" viewTransition onClick={markHeroArt}>
      <div className="poster-card-art" ref={tilt.ref} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>
        <img src={film.poster} alt={`${film.title}, ${film.type}`} loading="lazy" width="200" height="300" />
        <span className="poster-card-badge">{film.type}</span>
        <span className="poster-card-sheen" aria-hidden="true" />
        <button type="button" className="poster-card-play" onClick={playNow} aria-label={`Play ${film.title}`}>
          <svg width="16" height="16" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
          </svg>
        </button>
      </div>
      <p className="poster-card-title">{film.title}</p>
      <p className="metadata">
        {film.year} · {film.genre}
      </p>
    </Link>
  );
}

export function ContinueCard({ item }) {
  const film = byId(item.filmId);
  if (!film) return null;
  const total = film.runtimeMin || 120;
  const frac = typeof item.frac === 'number' ? item.frac : 1 - (item.minutesLeft || 30) / total;
  const progress = Math.min(96, Math.max(4, Math.round(frac * 100)));
  const minutesLeft = Math.max(1, Math.round(total * (1 - frac)));
  const art = item.still || film.backdrop || film.poster;
  return (
    <Link to={`/watch/${film.id}`} className="continue-card" viewTransition onClick={markHeroArt}>
      <div className="continue-card-art">
        <img src={art} alt={`${film.title}, ${film.type}`} loading="lazy" width="320" height="180" />
        <span className="continue-card-play" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
          </svg>
        </span>
        <span className="continue-card-progress" style={{ '--progress': `${progress}%` }} />
      </div>
      <p className="poster-card-title">{film.title}</p>
      <p className="metadata">{minutesLabel(minutesLeft)}</p>
    </Link>
  );
}

export default function Rail({ title, wide = false, seeAllTo = null, children }) {
  return (
    <section className="rail">
      <header className="rail-header">
        <h2 className="headline">{title}</h2>
        {/* only rails with a real destination show "See all" — the finite editorial
            rails are shown in full, so a link to the generic grid would mislead */}
        {seeAllTo && (
          <Link to={seeAllTo} className="rail-seeall">
            See all
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M4.5 2.5 8 6l-3.5 3.5" />
            </svg>
          </Link>
        )}
      </header>
      <div className={wide ? 'rail-scroll rail-scroll--wide' : 'rail-scroll'} role="group" aria-label={title}>
        {children}
      </div>
    </section>
  );
}
