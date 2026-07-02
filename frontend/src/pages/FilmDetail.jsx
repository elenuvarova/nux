import { useEffect, useRef, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Rail, { PosterCard } from '../components/Rail.jsx';
import NotFound from './NotFound.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { useMyList } from '../lib/useMyList.js';
import { toast } from '../lib/toast.js';
import { byId, FILMS, anyTitleById } from '../data/catalog.js';
import { REVIEWS } from '../data/reviews.js';
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

/* Demo downloads — persisted ids only; the Downloads page is a static
   fixture for now, so nothing else reads this key yet. */
const DOWNLOADS_KEY = 'nux-downloads';

function readDownloads() {
  try {
    const raw = JSON.parse(localStorage.getItem(DOWNLOADS_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export default function FilmDetail() {
  const { id } = useParams();
  const film = byId(id);
  const { has, toggle } = useMyList();
  usePageTitle(film?.title, film?.synopsis, { image: film?.backdrop || film?.poster });

  // 'idle' | 'saving' | 'saved' — the demo download, persisted per film
  const [download, setDownload] = useState(() => (readDownloads().includes(id) ? 'saved' : 'idle'));
  const saveTimer = useRef();
  // section id the anchor bar highlights; null until the scroll spy reports
  const [active, setActive] = useState(null);
  // until this timestamp the spy stays quiet: an anchor click sets its id
  // directly, and the smooth scroll it triggers must not re-highlight whatever
  // section happens to pass through the band on the way down
  const spyHold = useRef(0);

  // FilmDetail → FilmDetail hops keep the component mounted: re-read the
  // persisted download state and drop a pending fake-save timer
  useEffect(() => {
    setDownload(readDownloads().includes(id) ? 'saved' : 'idle');
    setActive(null);
    spyHold.current = 0;
    return () => clearTimeout(saveTimer.current);
  }, [id]);

  // scroll spy for the anchor bar: current = first section (document order)
  // intersecting the band below the sticky chrome (nav + anchor bar ≈ 112px)
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('.fd [data-fd-section]'));
    if (targets.length === 0) return undefined;
    const inView = new Set();
    // at the page bottom a short last section can never win the band, so a
    // #reviews jump would leave "Details" highlighted — force the last one
    const bottomed = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const spy = () => {
      if (Date.now() < spyHold.current) return;
      if (bottomed()) {
        setActive(targets[targets.length - 1].id);
        return;
      }
      const current = targets.find((t) => inView.has(t.id));
      if (current) setActive(current.id);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inView.add(e.target.id);
          else inView.delete(e.target.id);
        }
        spy();
      },
      { rootMargin: '-112px 0px -55% 0px' }
    );
    targets.forEach((t) => io.observe(t));
    window.addEventListener('scroll', spy, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', spy);
    };
  }, [id]);

  if (!film) {
    // a non-film title (game / course) deep-linked to /film — its template is /title
    if (anyTitleById(id)) return <Navigate to={`/title/${id}`} replace />;
    return <NotFound message="We couldn't find that title in the catalogue." />;
  }

  const saved = has(film.id);

  const more = related(film);
  const reviews = REVIEWS[film.id];

  function toggleDownload() {
    if (download === 'saving') return;
    if (download === 'saved') {
      localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(readDownloads().filter((x) => x !== film.id)));
      setDownload('idle');
      toast('Removed from downloads'); // ToastHost is a polite live region
      return;
    }
    setDownload('saving');
    // brief fake latency so the demo save reads as a save, not a glitch
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(DOWNLOADS_KEY, JSON.stringify([...new Set([...readDownloads(), film.id])]));
      setDownload('saved');
      toast('Saved for offline viewing');
    }, 900);
  }

  const details = [
    ['Director', film.director],
    ['Cast', film.cast?.slice(0, 3).map((p) => p.name).join(', ')],
    ['Genre', film.genre],
    ['Release', film.year],
    ['Country', film.country],
    ['Language', film.language],
    ['Runtime', film.runtime],
  ].filter(([, v]) => v);

  // anchor bar entries — only sections that actually render get a link
  const anchors = [
    more.length > 0 && ['more-like-this', 'More Like This'],
    film.cast && ['cast-crew', 'Cast & Crew'],
    details.length > 0 && ['details', 'Details'],
    reviews && ['reviews', 'Reviews'],
  ].filter(Boolean);
  const activeAnchor = active ?? anchors[0]?.[0];

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
        <button
          type="button"
          className={download === 'saved' ? 'btn btn-secondary btn-secondary--on' : 'btn btn-secondary'}
          onClick={toggleDownload}
          aria-pressed={download === 'saved'}
        >
          {download === 'saved' ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 7.5 6 11l5.5-7" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 2v7M3.8 5.8 7 9l3.2-3.2M2.5 11.7h9" />
            </svg>
          )}
          {download === 'saved' ? 'Saved' : download === 'saving' ? 'Saving…' : 'Download'}
        </button>
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
            {/* receives the poster → film page morph: `film-poster` name is
                anchored in FilmDetail.css so only one layout carries it */}
            <img src={film.backdrop} alt="" fetchpriority="high" />
          </div>
          <div className="fd-content">{heroContent}</div>
        </section>
      ) : (
        <section className="fd-hero fd-hero--poster">
          <div className="fd-poster-frame">
            <img src={film.poster} alt="" fetchpriority="high" />
          </div>
          <div className="fd-content fd-content--poster">{heroContent}</div>
        </section>
      )}

      {anchors.length > 0 && (
        <nav className="fd-anchors glass" aria-label="On this page">
          <ul>
            {anchors.map(([anchorId, label]) => (
              <li key={anchorId}>
                <a
                  href={`#${anchorId}`}
                  className="fd-anchor-link"
                  aria-current={activeAnchor === anchorId ? 'location' : undefined}
                  onClick={() => {
                    // the clicked id wins until the smooth scroll settles
                    spyHold.current = Date.now() + 600;
                    setActive(anchorId);
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="fd-body">
        {more.length > 0 && (
          <div id="more-like-this" data-fd-section>
            <Rail title="More Like This">
              {more.map((f) => (
                <PosterCard key={f.id} filmId={f.id} />
              ))}
            </Rail>
          </div>
        )}

        {film.cast && (
          <section className="fd-section" id="cast-crew" data-fd-section>
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

        {details.length > 0 && (
          <section className="fd-section" id="details" data-fd-section>
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

        {reviews && (
          <section className="fd-section" id="reviews" data-fd-section>
            <h2 className="headline">Reviews</h2>
            <div className="fd-reviews">
              {reviews.map((r) => (
                <figure className="fd-review" key={r.source}>
                  <blockquote>“{r.quote}”</blockquote>
                  <figcaption>
                    <span className="fd-review-stars" role="img" aria-label={`${r.stars} out of 5 stars`}>
                      {'★'.repeat(r.stars)}
                      {'☆'.repeat(5 - r.stars)}
                    </span>
                    <span className="fd-review-source">— {r.source}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
