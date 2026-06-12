import { Link } from 'react-router-dom';
import { byId, HERO } from '../data/catalog.js';
import { useMyList } from '../lib/useMyList.js';
import './Hero.css';

export default function Hero() {
  const film = byId(HERO.filmId);
  const { has, toggle } = useMyList();
  const saved = has(film.id);

  return (
    <section className="hero" aria-label={`Featured: ${film.title}`}>
      <div className="hero-art">
        <img src={film.backdrop2 || film.backdrop} alt="" fetchpriority="high" />
      </div>
      <div className="hero-content">
        <p className="eyebrow">{HERO.eyebrow}</p>
        <h1 className="hero-title" tabIndex={-1}>{film.title}</h1>
        <p className="hero-meta">
          <span className="hero-badge">{film.type}</span>
          {HERO.meta}
        </p>
        <div className="hero-actions">
          <Link to={`/watch/${film.id}`} className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
            </svg>
            Play
          </Link>
          <button type="button" className="btn btn-secondary" onClick={() => toggle(film.id)} aria-pressed={saved}>
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
      </div>
    </section>
  );
}
