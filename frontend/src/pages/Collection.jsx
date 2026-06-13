import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NotFound from './NotFound.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { COLLECTIONS, byId } from '../data/catalog.js';
import { api } from '../lib/api.js';
import './Collection.css';

export default function Collection() {
  const { slug } = useParams();
  const staticCol = COLLECTIONS[slug];

  // Generated collections live server-side; fetch when the slug isn't static.
  const [genCol, setGenCol] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!staticCol);
  // Bumped by Retry to re-run the effect after a non-404 fetch failure.
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (staticCol) return undefined;
    let alive = true;
    setLoading(true);
    setError(null);
    api
      .get(`/collections/${slug}`)
      .then((d) => {
        if (alive) setGenCol(d);
      })
      .catch((err) => {
        if (alive) {
          setGenCol(null);
          setError(err);
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [slug, staticCol, reload]);

  // Normalize a generated payload to the static collection shape; the cover is
  // the first film's backdrop (the backend carries no image URLs).
  const firstId = genCol?.entries?.[0]?.[0];
  const firstFilm = firstId ? byId(firstId) : null;
  const col =
    staticCol ||
    (genCol && {
      ...genCol,
      cover: firstFilm?.backdrop || firstFilm?.poster || '',
    });

  usePageTitle(col?.title, col?.intro);

  if (loading) {
    return (
      <main className="collection">
        <p className="collection-intro" aria-busy="true">
          Loading…
        </p>
      </main>
    );
  }
  // Only a real 404 means the collection is missing; any other failure is a
  // transient/server error the reader can retry.
  if (error && error.status === 404) {
    return <NotFound message="That collection doesn't exist." />;
  }
  if (error) {
    return (
      <main className="browse">
        <div className="browse-empty">
          <h1 className="display-m" tabIndex={-1}>
            Something went wrong
          </h1>
          <p className="browse-empty-sub">
            That collection couldn&apos;t be loaded. Please try again.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => setReload((n) => n + 1)}>
            Retry
          </button>
        </div>
      </main>
    );
  }
  if (!col) return <NotFound message="That collection doesn't exist." />;

  // Minimal schema.org ItemList of the films in this collection, for SEO.
  const films = col.entries.map(([id]) => byId(id)).filter(Boolean);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: col.title,
    numberOfItems: films.length,
    itemListElement: films.map((film, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: film.title,
      url: `${window.location.origin}/film/${film.id}`,
    })),
  };

  // Escape `<` so a film/collection title can never break out of the <script>
  // (the one injection vector for inline JSON-LD; JSON.stringify alone won't).
  const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

  return (
    <main className="collection">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
      <header className="collection-hero">
        {col.cover ? (
          <img className="collection-bg" src={col.cover} alt="" fetchpriority="high" />
        ) : null}
        <div className="collection-headings">
          <p className="eyebrow">{col.eyebrow}</p>
          <h1 className="collection-title" tabIndex={-1}>
            {col.title}
          </h1>
        </div>
      </header>

      <div className="collection-body">
        <p className="collection-intro">{col.intro}</p>
        <ol className="collection-list">
          {col.entries.map(([id, note], i) => {
            const film = byId(id);
            if (!film) return null;
            return (
              <li className="collection-entry" key={id}>
                <span className="collection-rank">{i + 1}</span>
                <Link to={`/film/${film.id}`} className="collection-poster" aria-label={film.title}>
                  <img src={film.poster} alt="" loading="lazy" />
                </Link>
                <div className="collection-text">
                  <Link to={`/film/${film.id}`} className="collection-name">
                    {film.title}
                  </Link>
                  <p className="metadata">
                    {film.year} · {film.genre}
                    {film.runtime ? ` · ${film.runtime}` : ''}
                  </p>
                  <p className="collection-note">{note}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
