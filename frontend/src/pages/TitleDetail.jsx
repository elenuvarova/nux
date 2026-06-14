import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import NotFound from './NotFound.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { useMyList } from '../lib/useMyList.js';
import { anyTitleById, byId, FILMS } from '../data/catalog.js';
import Rail, { PosterCard } from '../components/Rail.jsx';
import NeonDrift from '../components/NeonDrift.jsx';
import './FilmDetail.css';
import './TitleDetail.css';

const playIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
  </svg>
);

/* Game + Course detail — poster-led hero (their art is a portrait key
   art), type-specific body: game features / course lessons. A GAME's "Play"
   launches the real playable mini-game instead of a trailer. */
export default function TitleDetail() {
  const { id } = useParams();
  const title = anyTitleById(id);
  const { has, toggle } = useMyList();
  const [playing, setPlaying] = useState(false);
  usePageTitle(title?.title, title?.synopsis);

  // a film's canonical home is /film/:id — redirect so the two routes never diverge
  if (byId(id)) return <Navigate to={`/film/${id}`} replace />;
  if (!title) return <NotFound message="We couldn't find that title in the catalog." />;
  const saved = has(title.id);
  const isCourse = title.type === 'COURSE';
  const isGame = title.type === 'GAME';

  return (
    <>
    <main className="fd">
      <section className="fd-hero fd-hero--poster">
        <div className="fd-poster-frame">
          <img src={title.poster} alt="" fetchpriority="high" style={{ viewTransitionName: 'hero-art' }} />
        </div>
        <div className="fd-content fd-content--poster">
          <p className="eyebrow">
            {title.type} · {title.genre}
          </p>
          <h1 className="fd-title" tabIndex={-1}>
            {title.title}
          </h1>
          <p className="metadata fd-meta">{title.meta}</p>
          {title.synopsis && <p className="fd-synopsis">{title.synopsis}</p>}
          <div className="fd-actions">
            {isGame ? (
              <button type="button" className="btn btn-primary" onClick={() => setPlaying(true)}>
                {playIcon}
                Play
              </button>
            ) : (
              <Link to={`/watch/${title.id}`} className="btn btn-primary">
                {playIcon}
                {isCourse ? 'Start course' : 'Play'}
              </Link>
            )}
            <button type="button" className={saved ? "btn btn-secondary btn-secondary--on" : "btn btn-secondary"} onClick={() => toggle(title.id, title.title)} aria-pressed={saved}>
              {saved ? 'In My List' : 'My List'}
            </button>
            {/* the game has no trailer — the playable demo above is the CTA, so we
                don't offer a "Watch trailer" link that only dead-ends on the
                "Trailer unavailable" fallback */}
          </div>
        </div>
      </section>

      <div className="fd-body">
        {title.features && (
          <section className="fd-section">
            <h2 className="headline">Features</h2>
            <div className="td-features">
              {title.features.map((f) => (
                <span className="td-feature" key={f}>
                  {f}
                </span>
              ))}
            </div>
          </section>
        )}

        {title.lessons && (
          <section className="fd-section">
            <h2 className="headline">Lessons</h2>
            <ol className="td-lessons">
              {title.lessons.map((l) => (
                <li className="td-lesson" key={l.n}>
                  <span className="td-lesson-n">{String(l.n).padStart(2, '0')}</span>
                  <span className="td-lesson-title">{l.title}</span>
                  <span className="metadata">{l.len}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      <section className="td-more">
        <Rail title="More to explore">
          {FILMS.slice(0, 8).map((f) => (
            <PosterCard key={f.id} filmId={f.id} />
          ))}
        </Rail>
      </section>
    </main>
    {isGame && playing && <NeonDrift onClose={() => setPlaying(false)} />}
    </>
  );
}
