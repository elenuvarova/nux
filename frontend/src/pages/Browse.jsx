import { useMemo, useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PosterCard } from '../components/Rail.jsx';
import { FILMS, GENRES } from '../data/catalog.js';
import './Browse.css';

const CHIPS = ['All', 'Films', 'Documentaries', 'Games', 'Courses'];

export default function Browse() {
  const [params] = useSearchParams();
  const [chip, setChip] = useState('All');
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

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

  return (
    <main className="browse">
      <header className="browse-head">
        <h1 className="page-title">Browse</h1>
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
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the catalog"
          />
          {query && (
            <button type="button" className="browse-clear" onClick={() => setQuery('')} aria-label="Clear search">
              <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
              </svg>
            </button>
          )}
        </div>
        <div className="browse-chips" role="tablist" aria-label="Content type">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={chip === c}
              className={chip === c ? 'chip chip--active' : 'chip'}
              onClick={() => setChip(c)}
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
              <button type="button" className="genre-card" key={g.id}>
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
          <span className="browse-count">{films.length}</span>
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
            <p className="browse-empty-sub">
              {query ? 'Try a different title, genre or year.' : 'This shelf is coming soon — check back after the next release window.'}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
