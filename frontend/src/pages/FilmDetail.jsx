import { useParams, Link } from 'react-router-dom';
import { byId } from '../data/catalog.js';
import './FilmDetail.css';

export default function FilmDetail() {
  const { id } = useParams();
  const film = byId(id) || byId('the-third-man');

  return (
    <main className="fd">
      <section className="fd-hero">
        <div className="fd-art">
          <img src={film.backdrop || film.poster} alt="" fetchpriority="high" />
        </div>
        <div className="fd-content">
          <p className="eyebrow">
            {film.type} · {film.genre}
          </p>
          <h1 className="fd-title">{film.title}</h1>
          <p className="metadata fd-meta">
            {film.year}
            {film.runtime ? ` · ${film.runtime}` : ''}
            {film.rating ? ` · ★ ${film.rating}` : ''}
            {film.certificate ? ` · ${film.certificate}` : ''}
          </p>
          {film.synopsis && <p className="fd-synopsis">{film.synopsis}</p>}
          <div className="fd-actions">
            <button type="button" className="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
              </svg>
              Play
            </button>
            <button type="button" className="btn btn-secondary">My List</button>
          </div>
        </div>
      </section>

      {film.cast && (
        <section className="fd-section">
          <h2 className="headline">Cast &amp; Crew</h2>
          <div className="fd-cast">
            {film.cast.map((person) => (
              <div className="fd-cast-card" key={person.name}>
                <img src={person.photo} alt={person.name} loading="lazy" />
                <p className="poster-card-title">{person.name}</p>
                <p className="metadata">{person.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="fd-section">
        <Link to="/" className="btn btn-secondary">
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}
