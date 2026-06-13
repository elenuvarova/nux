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
  const [loading, setLoading] = useState(!staticCol);

  useEffect(() => {
    if (staticCol) return undefined;
    let alive = true;
    setLoading(true);
    api
      .get(`/collections/${slug}`)
      .then((d) => {
        if (alive) setGenCol(d);
      })
      .catch(() => {
        if (alive) setGenCol(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [slug, staticCol]);

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
  if (!col) return <NotFound message="That collection doesn't exist." />;

  return (
    <main className="collection">
      <header className="collection-hero">
        <img className="collection-bg" src={col.cover} alt="" fetchpriority="high" />
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
                <Link to={`/film/${film.id}`} className="collection-poster">
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
