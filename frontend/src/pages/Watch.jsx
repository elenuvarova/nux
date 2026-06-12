import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NotFound from './NotFound.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { byId } from '../data/catalog.js';
import { TRAILERS } from '../data/trailers.js';
import './Watch.css';

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const film = byId(id);
  const trailer = TRAILERS[id];
  const [playing, setPlaying] = useState(false);
  usePageTitle(film ? `Watch ${film.title}` : 'Watch');

  if (!film) {
    return <NotFound message="We couldn't find that title in the catalog." />;
  }

  const art = film.backdrop || film.poster;

  return (
    <main className="watch">
      <div className="watch-top">
        <button type="button" className="watch-back" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11.5 3.5 6 9l5.5 5.5" />
          </svg>
        </button>
        <div>
          <h1 className="watch-title" tabIndex={-1}>
            {film.title}
          </h1>
          <p className="metadata">
            Trailer · {film.year}
            {film.runtime ? ` · Full film ${film.runtime}` : ''}
          </p>
        </div>
      </div>

      <div className="watch-stage">
        {trailer ? (
          playing ? (
            <iframe
              className="watch-frame"
              src={`https://www.youtube-nocookie.com/embed/${trailer.yt}?autoplay=1&rel=0&modestbranding=1`}
              title={`${film.title} — trailer`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <button type="button" className="watch-facade" onClick={() => setPlaying(true)}>
              <img src={art} alt="" />
              <span className="watch-play" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
                </svg>
              </span>
              <span className="watch-cta">Play trailer</span>
            </button>
          )
        ) : (
          <div className="watch-facade watch-facade--off">
            <img src={art} alt="" />
            <div className="watch-empty">
              <p className="display-m">Trailer unavailable</p>
              <p className="watch-empty-sub">We couldn't license a trailer for this title yet.</p>
              <Link to={`/film/${film.id}`} className="btn btn-secondary">
                Back to film page
              </Link>
            </div>
          </div>
        )}
      </div>

      {film.synopsis && <p className="watch-synopsis">{film.synopsis}</p>}
    </main>
  );
}
