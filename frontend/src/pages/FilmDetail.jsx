import { useParams } from 'react-router-dom';
import Rail, { PosterCard } from '../components/Rail.jsx';
import { byId, FILMS } from '../data/catalog.js';
import './FilmDetail.css';

export default function FilmDetail() {
  const { id } = useParams();
  const film = byId(id) || byId('the-third-man');

  const related = FILMS.filter((f) => f.id !== film.id && (f.genre === film.genre || f.type === film.type)).slice(0, 7);

  const details = [
    ['Director', film.director],
    ['Cast', film.cast?.slice(0, 3).map((p) => p.name).join(', ')],
    ['Genre', film.genre],
    ['Release', film.year],
    ['Country', film.country],
    ['Language', film.language],
    ['Runtime', film.runtime],
  ].filter(([, v]) => v);

  return (
    <main className="fd">
      <section className="fd-hero">
        <div className="fd-art">
          <img src={film.backdrop || film.poster} alt="" fetchpriority="high" style={{ viewTransitionName: 'hero-art' }} />
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
            <button type="button" className="btn btn-secondary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M7 2.5v9M2.5 7h9" />
              </svg>
              My List
            </button>
          </div>
        </div>
      </section>

      <div className="fd-body">
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

        {related.length > 0 && (
          <Rail title="More Like This">
            {related.map((f) => (
              <PosterCard key={f.id} filmId={f.id} />
            ))}
          </Rail>
        )}

        {details.length > 0 && (
          <section className="fd-section">
            <h2 className="headline">Details</h2>
            <dl className="fd-details">
              {details.map(([label, value]) => (
                <div className="fd-details-row" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </main>
  );
}
