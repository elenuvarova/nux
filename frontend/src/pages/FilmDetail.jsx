import { useParams, Link, Navigate } from 'react-router-dom';
import Rail, { PosterCard } from '../components/Rail.jsx';
import NotFound from './NotFound.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { useMyList } from '../lib/useMyList.js';
import { byId, FILMS, anyTitleById } from '../data/catalog.js';
import './FilmDetail.css';

/* Serialize JSON-LD safely for embedding in a <script> tag: escape `<` (so a
   stray "</script>" in catalog text can't break out) and the U+2028/U+2029
   separators that are valid JSON but break inline scripts. Content is
   first-party (catalog.js), so this only guards the script-context boundary. */
function jsonLd(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/[\u2028\u2029]/g, (c) => '\\u' + c.charCodeAt(0).toString(16));
}

/* First letters of the first two words of a name — used for the avatar
   fallback when a cast member has no photo (we only have stills for a few). */
function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/* Resolve a root-relative asset path to an absolute URL for structured data. */
function absoluteUrl(url) {
  if (!url) return url;
  if (/^https?:\/\//.test(url)) return url;
  return window.location.origin + (url.startsWith('/') ? url : `/${url}`);
}

function related(film) {
  const sameGenre = FILMS.filter((f) => f.id !== film.id && f.genre === film.genre);
  const sameType = FILMS.filter((f) => f.id !== film.id && f.genre !== film.genre && f.type === film.type);
  return [...sameGenre, ...sameType].slice(0, 7);
}

export default function FilmDetail() {
  const { id } = useParams();
  const film = byId(id);
  const { has, toggle } = useMyList();
  usePageTitle(film?.title, film?.synopsis, { image: film?.backdrop || film?.poster });

  if (!film) {
    // a non-film title (game / course) deep-linked to /film — its template is /title
    if (anyTitleById(id)) return <Navigate to={`/title/${id}`} replace />;
    return <NotFound message="We couldn't find that title in the catalogue." />;
  }

  const saved = has(film.id);

  const more = related(film);
  const details = [
    ['Director', film.director],
    ['Cast', film.cast?.slice(0, 3).map((p) => p.name).join(', ')],
    ['Genre', film.genre],
    ['Release', film.year],
    ['Country', film.country],
    ['Language', film.language],
    ['Runtime', film.runtime],
  ].filter(([, v]) => v);

  const meta = [
    film.year,
    film.runtime,
    film.rating ? `★ ${film.rating}` : null,
    film.certificate,
  ]
    .filter(Boolean)
    .join(' · ');

  // schema.org Movie — lets search engines and AI answer engines parse the
  // title as a film (rich results / citation). Only emit keys we actually have.
  const movieLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: film.title,
    ...(film.year ? { datePublished: String(film.year) } : {}),
    ...(film.genre ? { genre: film.genre } : {}),
    ...(film.synopsis ? { description: film.synopsis } : {}),
    ...(film.backdrop || film.poster
      ? { image: absoluteUrl(film.backdrop || film.poster) }
      : {}),
    ...(film.director ? { director: { '@type': 'Person', name: film.director } } : {}),
  };

  const heroContent = (
    <>
      <p className="eyebrow">
        {film.type} · {film.genre}
      </p>
      <h1 className="fd-title" tabIndex={-1}>
        {film.title}
      </h1>
      <p className="metadata fd-meta">{meta}</p>
      {film.synopsis && <p className="fd-synopsis">{film.synopsis}</p>}
      <div className="fd-actions">
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
      </div>
    </>
  );

  return (
    <main className="fd">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(movieLd) }}
      />
      {film.backdrop ? (
        <section className="fd-hero">
          <div className="fd-art">
            <img src={film.backdrop} alt="" fetchpriority="high" style={{ viewTransitionName: 'hero-art' }} />
          </div>
          <div className="fd-content">{heroContent}</div>
        </section>
      ) : (
        <section className="fd-hero fd-hero--poster">
          <div className="fd-poster-frame">
            <img src={film.poster} alt="" fetchpriority="high" style={{ viewTransitionName: 'hero-art' }} />
          </div>
          <div className="fd-content fd-content--poster">{heroContent}</div>
        </section>
      )}

      <div className="fd-body">
        {film.cast && (
          <section className="fd-section">
            <h2 className="headline">Cast &amp; Crew</h2>
            <div className="fd-cast">
              {film.cast.map((person) => (
                <div className="fd-cast-card" key={person.name}>
                  {person.photo ? (
                    <img src={person.photo} alt={person.name} loading="lazy" width="96" height="96" />
                  ) : (
                    <span className="fd-cast-avatar" aria-hidden="true">
                      {initials(person.name)}
                    </span>
                  )}
                  <p className="poster-card-title">{person.name}</p>
                  <p className="metadata">{person.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {more.length > 0 && (
          <Rail title="More Like This">
            {more.map((f) => (
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
