import { useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PosterCard } from '../components/Rail.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { FILMS, GENRES } from '../data/catalog.js';
import './Browse.css';

const CHIPS = ['All', 'Films', 'Documentaries', 'Games', 'Courses'];

export default function Browse() {
  usePageTitle('Browse');
  // chip + query live in the URL so back/forward and deep links keep state
  const [params, setParams] = useSearchParams();
  const chip = CHIPS.includes(params.get('type')) ? params.get('type') : 'All';
  const query = params.get('q') || '';
  const inputRef = useRef(null);

  const update = (patch) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [k, v] of Object.entries(patch)) {
          if (v) next.set(k, v);
          else next.delete(k);
        }
        next.delete('search');
        return next;
      },
      { replace: true }
    );
  };

  useEffect(() => {
    if (params.has('search')) inputRef.current?.focus();
  }, [params]);

  const films = useMemo(() => {
    let list = FILMS;
    if (chip === 'Films') list = list.filter((f) => f.type === 'FILM');
    if (chip === 'Documentaries') list = list.filter((f) => f.type === 'DOC');
    if (chip === 'Games' || chip === 'Courses') list = [];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (f) => f.title.toLowerCase().includes(q) || f.genre.toLowerCase().includes(q) || String(f.year).includes(q)
      );
    }
    return list;
  }, [chip, query]);

  const emptyCopy =
    chip === 'Games' || chip === 'Courses'
      ? `${chip} are coming to NUX soon — check back after the next release window.`
      : query
        ? 'Try a different title, genre or year.'
        : 'This shelf is empty for now.';

  return (
    <main className="browse">
      <header className="browse-head">
        <h1 className="page-title" tabIndex={-1}>
          Browse
        </h1>
        <div className="browse-search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            placeholder="Titles, genres, years…"
            value={query}
            onChange={(e) => update({ q: e.target.value })}
            aria-label="Search the catalog"
          />
          {query && (
            <button type="button" className="browse-clear" onClick={() => update({ q: '' })} aria-label="Clear search">
              <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
              </svg>
            </button>
          )}
        </div>
        <div className="browse-chips" role="group" aria-label="Content type">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={chip === c}
              className={chip === c ? 'chip chip--active' : 'chip'}
              onClick={() => update({ type: c === 'All' ? '' : c })}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      {!query && chip === 'All' && (
        <section className="browse-genres" aria-label="Browse by genre">
          <h2 className="headline">Genres</h2>
          <div className="genre-grid">
            {GENRES.map((g) => (
              <button type="button" className="genre-card" key={g.id} onClick={() => update({ q: g.label })}>
                <img src={g.image} alt="" loading="lazy" />
                <span>{g.label}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="browse-grid-wrap" aria-label="All titles">
        <h2 className="headline">
          {query ? `Results for “${query}”` : 'All Titles'}
          <span className="browse-count" role="status">
            {films.length} {films.length === 1 ? 'title' : 'titles'}
          </span>
        </h2>
        {films.length > 0 ? (
          <div className="browse-grid">
            {films.map((f) => (
              <PosterCard key={f.id} filmId={f.id} />
            ))}
          </div>
        ) : (
          <div className="browse-empty">
            <p className="display-m">Nothing here yet</p>
            <p className="browse-empty-sub">{emptyCopy}</p>
          </div>
        )}
      </section>
    </main>
  );
}
