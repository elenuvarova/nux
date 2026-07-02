import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';
import { toast } from '../lib/toast.js';
import { byId } from '../data/catalog.js';
import './Browse.css';
import './Downloads.css';

/* Same key/shape as the writer in FilmDetail (its Download button persists a
   JSON array of film ids) — this page is the reader. */
const DOWNLOADS_KEY = 'nux-downloads';

function readDownloads() {
  try {
    const raw = JSON.parse(localStorage.getItem(DOWNLOADS_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

/* Honest-demo file size — nothing really downloads, so the number is derived
   from the runtime (~20 MB per minute, a plausible HD bitrate): stable per
   film, never random. */
const sizeMb = (film) => (film.runtimeMin || 100) * 20;

function fmtSize(mb) {
  return mb < 1000 ? `${Math.round(mb)} MB` : `${(mb / 1000).toFixed(1)} GB`;
}

export default function Downloads() {
  usePageTitle('Downloads');
  const [ids, setIds] = useState(readDownloads);
  const titleRef = useRef(null);
  const listRef = useRef(null);
  // ids whose film left the catalogue resolve to nothing — skip them
  const films = ids.map(byId).filter(Boolean);
  const totalMb = films.reduce((sum, f) => sum + sizeMb(f), 0);

  const remove = (film) => {
    const idx = films.findIndex((f) => f.id === film.id);
    const next = readDownloads().filter((x) => x !== film.id);
    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(next));
    setIds(next);
    toast('Removed from downloads'); // ToastHost is a polite live region
    // the pressed button unmounts with its row — keep keyboard focus in the
    // list (next row's remove, else the heading) instead of dropping to <body>
    requestAnimationFrame(() => {
      const btns = listRef.current?.querySelectorAll('.downloads-remove');
      const target = btns?.length ? btns[Math.min(idx, btns.length - 1)] : titleRef.current;
      target?.focus();
    });
  };

  return (
    <main className="downloads">
      <header className="downloads-head">
        <h1 className="page-title" tabIndex={-1} ref={titleRef}>
          Downloads
        </h1>
        {films.length > 0 && (
          <>
            <p className="metadata">{fmtSize(totalMb)} of 64 GB used</p>
            <div className="downloads-meter" aria-hidden="true">
              <span style={{ width: `${Math.min(100, (totalMb / 64000) * 100)}%` }} />
            </div>
          </>
        )}
      </header>

      {films.length > 0 ? (
        <ul className="downloads-list" ref={listRef}>
          {films.map((film) => (
            <li key={film.id}>
              <Link to={`/film/${film.id}`} className="downloads-row">
                <span className="downloads-thumb">
                  <img src={film.backdrop || film.poster} alt="" loading="lazy" />
                </span>
                <span className="downloads-info">
                  <span className="downloads-title">{film.title}</span>
                  <span className="metadata">{fmtSize(sizeMb(film))} · Saved · On this device</span>
                </span>
                {/* decorative — the saved state is spelled out in the row text */}
                <span className="downloads-status downloads-status--done" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="10" r="7.5" />
                    <path d="M6.5 10 9 12.5 13.5 7.5" />
                  </svg>
                </span>
              </Link>
              <button
                type="button"
                className="downloads-remove"
                onClick={() => remove(film)}
                aria-label={`Remove ${film.title} download`}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 4.8h12M7 4.8V3.3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M4.5 4.8l.7 9.4a1.5 1.5 0 0 0 1.5 1.3h4.6a1.5 1.5 0 0 0 1.5-1.3l.7-9.4M7.4 8v4.5M10.6 8v4.5" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="browse-empty">
          <svg width="40" height="40" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--icon-tertiary)' }}>
            <path d="M7 2v7M3.8 5.8 7 9l3.2-3.2M2.5 11.7h9" />
          </svg>
          <p className="display-m">Nothing saved yet</p>
          <p className="browse-empty-sub">Select Download on any film page and it’ll be kept here on this device.</p>
          <Link to="/browse" className="btn btn-primary">
            Browse the catalogue
          </Link>
        </div>
      )}
    </main>
  );
}
