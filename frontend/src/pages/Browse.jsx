import { useMemo, useRef, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PosterCard } from '../components/Rail.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { useCurator } from '../lib/useCurator.jsx';
import { FILMS, GENRES, EXTRAS } from '../data/catalog.js';
import './Browse.css';

const CHIPS = ['All', 'Films', 'Documentaries', 'Games', 'Courses'];

export default function Browse() {
  usePageTitle('Browse');
  // chip + query live in the URL so back/forward and deep links keep state
  const [params, setParams] = useSearchParams();
  const chip = CHIPS.includes(params.get('type')) ? params.get('type') : 'All';
  const query = params.get('q') || '';
  const inputRef = useRef(null);
  const { openCurator, send } = useCurator();
  // hand the typed query (if any) straight to the Curator — search → curation
  const askCurator = () => {
    openCurator();
    const q = query.trim();
    if (q) send(q);
  };

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

  // recent searches (localStorage) + focus state for the suggestions panel
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nux-recent-search') || '[]');
    } catch {
      return [];
    }
  });
  const remember = (q) => {
    const v = q.trim();
    if (v.length < 2) return;
    const next = [v, ...recent.filter((x) => x.toLowerCase() !== v.toLowerCase())].slice(0, 6);
    setRecent(next);
    localStorage.setItem('nux-recent-search', JSON.stringify(next));
  };

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

  // the one game / one course live behind their chips (real detail pages);
  // run them through the same title/genre/meta predicate so typing actually
  // filters instead of hard-emptying the shelf into a dead-end
  const extras = useMemo(() => {
    const base = chip === 'Games' ? [EXTRAS.game] : chip === 'Courses' ? [EXTRAS.course] : [];
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (x) =>
        x.title.toLowerCase().includes(q) ||
        x.genre.toLowerCase().includes(q) ||
        x.meta.toLowerCase().includes(q)
    );
  }, [chip, query]);

  // remember a query once it settles and actually matched something
  useEffect(() => {
    if (!query.trim() || films.length + extras.length === 0) return undefined;
    const t = setTimeout(() => remember(query), 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, films.length, extras.length]);

  const emptyCopy = query
    ? 'Try a different title, genre or year.'
    : 'This shelf is empty for now.';

  return (
    <main className="browse">
      <header className="browse-head">
        <h1 className="page-title" tabIndex={-1}>
          Browse
        </h1>
        <div className="browse-search-row">
        <div
          className="browse-search"
          // close the recent panel only when focus leaves the whole wrapper,
          // so Tab can move from the input into a suggestion button
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
          }}
        >
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
            onFocus={() => setFocused(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') remember(query);
              if (e.key === 'Escape') update({ q: '' });
            }}
            aria-label="Search the catalog"
          />
          {focused && !query && recent.length > 0 && (
            <div className="browse-recent">
              <p className="browse-recent-head" id="recent-label">
                Recent
              </p>
              <ul aria-labelledby="recent-label">
                {recent.map((r) => (
                  <li key={r}>
                    <button type="button" className="browse-recent-row" onClick={() => update({ q: r })}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="7" cy="7" r="5.2" />
                        <path d="M7 4.2V7l1.8 1.1" />
                      </svg>
                      {r}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {query && (
            <button type="button" className="browse-clear" onClick={() => update({ q: '' })} aria-label="Clear search">
              <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
              </svg>
            </button>
          )}
        </div>
          <button
            type="button"
            className="browse-ask"
            onClick={askCurator}
            aria-label="Ask the Curator about your search"
          >
            <span className="ask-spark" aria-hidden="true">✦</span>
            <span className="browse-ask-label">Ask the Curator</span>
          </button>
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
              <Link to={`/genre/${g.id}`} className="genre-card" key={g.id} aria-label={g.label}>
                <img src={g.image} alt="" loading="lazy" />
                <span>{g.label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="browse-grid-wrap" aria-label="All titles">
        <h2 className="headline">
          {query ? `Results for “${query}”` : 'All Titles'}
          <span className="browse-count" role="status">
            {films.length + extras.length} {films.length + extras.length === 1 ? 'title' : 'titles'}
          </span>
        </h2>
        {films.length + extras.length > 0 ? (
          <div className="browse-grid">
            {extras.map((x) => (
              <Link to={`/title/${x.id}`} className="poster-card" key={x.id} viewTransition>
                <div className="poster-card-art">
                  <img src={x.poster} alt={`${x.title}, ${x.type}`} loading="lazy" />
                  <span className="poster-card-badge">{x.type}</span>
                  <span className="poster-card-sheen" aria-hidden="true" />
                  <span className="poster-card-play" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
                    </svg>
                  </span>
                </div>
                <p className="poster-card-title">{x.title}</p>
                <p className="metadata">{x.genre}</p>
              </Link>
            ))}
            {films.map((f) => (
              <PosterCard key={f.id} filmId={f.id} />
            ))}
          </div>
        ) : (
          <div className="browse-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true" style={{ color: 'var(--icon-tertiary)' }}>
              <circle cx="10.5" cy="10.5" r="7" />
              <path d="M15.5 15.5 21 21" />
            </svg>
            <p className="display-m">Nothing here yet</p>
            <p className="browse-empty-sub">{emptyCopy}</p>
            {query && (
              <button type="button" className="btn btn-secondary" onClick={() => update({ q: '' })}>
                Clear search
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
