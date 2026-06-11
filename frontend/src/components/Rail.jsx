import { Link } from 'react-router-dom';
import { byId } from '../data/catalog.js';
import './Rail.css';

/* Mark the clicked artwork as the shared element for the
   poster → hero View Transition morph. Clear stale marks first —
   duplicate view-transition-names skip the whole transition. */
function markHeroArt(e) {
  document.querySelectorAll('[data-vt="hero-art"]').forEach((el) => {
    el.style.viewTransitionName = '';
    delete el.dataset.vt;
  });
  const img = e.currentTarget.querySelector('img');
  if (img) {
    img.style.viewTransitionName = 'hero-art';
    img.dataset.vt = 'hero-art';
  }
}

export function PosterCard({ filmId }) {
  const film = byId(filmId);
  return (
    <Link to={`/film/${film.id}`} className="poster-card" viewTransition onClick={markHeroArt}>
      <div className="poster-card-art">
        <img src={film.poster} alt="" loading="lazy" />
        <span className="poster-card-badge">{film.type}</span>
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
  const progress = Math.max(8, 100 - Math.round((item.minutesLeft / 120) * 100));
  return (
    <Link to={`/film/${film.id}`} className="continue-card" viewTransition onClick={markHeroArt}>
      <div className="continue-card-art">
        <img src={item.still} alt="" loading="lazy" />
        <span className="continue-card-play" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
          </svg>
        </span>
        <span className="continue-card-progress" style={{ '--progress': `${progress}%` }} />
      </div>
      <p className="poster-card-title">{film.title}</p>
      <p className="metadata">{item.minutesLeft}m left</p>
    </Link>
  );
}

export default function Rail({ title, wide = false, children }) {
  return (
    <section className="rail">
      <header className="rail-header">
        <h2 className="headline">{title}</h2>
        <a href="#all" className="rail-seeall">
          See all
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M4.5 2.5 8 6l-3.5 3.5" />
          </svg>
        </a>
      </header>
      <div className={wide ? 'rail-scroll rail-scroll--wide' : 'rail-scroll'}>{children}</div>
    </section>
  );
}
