import { Link, useParams } from 'react-router-dom';
import NotFound from './NotFound.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { COLLECTIONS, byId } from '../data/catalog.js';
import './Collection.css';

export default function Collection() {
  const { slug } = useParams();
  const col = COLLECTIONS[slug];
  usePageTitle(col?.title);
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
