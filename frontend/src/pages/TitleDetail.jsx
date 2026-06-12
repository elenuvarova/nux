import { useParams } from 'react-router-dom';
import NotFound from './NotFound.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { useMyList } from '../lib/useMyList.js';
import { anyTitleById } from '../data/catalog.js';
import './FilmDetail.css';
import './TitleDetail.css';

/* Game + Course detail — poster-led hero (their art is a portrait key
   art), type-specific body: game features / course lessons. */
export default function TitleDetail() {
  const { id } = useParams();
  const title = anyTitleById(id);
  const { has, toggle } = useMyList();
  usePageTitle(title?.title, title?.synopsis);

  if (!title) return <NotFound message="We couldn't find that title in the catalog." />;
  const saved = has(title.id);
  const isCourse = title.type === 'COURSE';

  return (
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
            <button type="button" className="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
              </svg>
              {isCourse ? 'Start course' : 'Play'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => toggle(title.id, title.title)} aria-pressed={saved}>
              {saved ? 'In My List' : 'My List'}
            </button>
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
    </main>
  );
}
