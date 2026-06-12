import { Link } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';
import { byId } from '../data/catalog.js';
import './Downloads.css';

const DOWNLOADS = [
  { id: 'lawrence-of-arabia', still: 'still-lawrence-of-arabia-660.jpg', size: '2.1 GB', state: 'done' },
  { id: 'senna', still: null, size: '1.2 GB', state: 'downloading', progress: 62 },
  { id: 'aftersun', still: null, size: '1.1 GB', state: 'done' },
  { id: 'the-wicker-man', still: null, size: '1.4 GB', state: 'expiring', note: 'Expires in 3 days' },
];

export default function Downloads() {
  usePageTitle('Downloads');
  return (
    <main className="downloads">
      <header className="downloads-head">
        <h1 className="page-title" tabIndex={-1}>
          Downloads
        </h1>
        <p className="metadata">12.4 GB of 64 GB used</p>
        <div className="downloads-meter" aria-hidden="true">
          <span style={{ width: '19%' }} />
        </div>
      </header>

      <ul className="downloads-list">
        {DOWNLOADS.map((d) => {
          const film = byId(d.id);
          if (!film) return null;
          return (
            <li key={d.id}>
              <Link to={`/film/${film.id}`} className="downloads-row">
                <span className="downloads-thumb">
                  <img src={d.still ? `/assets/stills/${d.still}` : film.poster} alt="" loading="lazy" />
                </span>
                <span className="downloads-info">
                  <span className="downloads-title">{film.title}</span>
                  <span className="metadata">
                    {film.genre} · {d.size}
                    {d.note ? ` · ${d.note}` : ''}
                  </span>
                  {d.state === 'downloading' && (
                    <span className="downloads-bar" style={{ '--p': `${d.progress}%` }}>
                      <span className="downloads-bar-fill" />
                    </span>
                  )}
                </span>
                <span className={`downloads-status downloads-status--${d.state}`} aria-hidden="true">
                  {d.state === 'downloading' ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 3v8M6.5 7.5 10 11l3.5-3.5M4 15.5h12" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="10" cy="10" r="7.5" />
                      <path d="M6.5 10 9 12.5 13.5 7.5" />
                    </svg>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
