import { Link } from 'react-router-dom';
import { PosterCard } from '../components/Rail.jsx';
import { SkeletonGrid } from '../components/Skeleton.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { useMyList } from '../lib/useMyList.js';
import { useAuth } from '../lib/useAuth.jsx';
import { byId } from '../data/catalog.js';
import './Browse.css';

export default function MyList() {
  usePageTitle('My List');
  const { list, ready } = useMyList();
  const { user } = useAuth();
  const films = list.map(byId).filter(Boolean);

  return (
    <main className="browse">
      <header className="browse-head">
        <h1 className="page-title" tabIndex={-1}>
          My List
        </h1>
      </header>
      <section className="browse-grid-wrap" aria-label="Saved titles">
        {!ready ? (
          <SkeletonGrid count={12} />
        ) : films.length > 0 ? (
          <>
            <div className="browse-grid">
              {films.map((f) => (
                <PosterCard key={f.id} filmId={f.id} />
              ))}
            </div>
            {!user && (
              <p className="browse-empty-sub" style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
                Saved on this device — <Link to="/signin">sign in</Link> to keep your list anywhere.
              </p>
            )}
          </>
        ) : (
          <div className="browse-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--icon-tertiary)' }}>
              <path d="M7 3h10a1 1 0 0 1 1 1v17l-6-3.8L6 21V4a1 1 0 0 1 1-1z" />
            </svg>
            <p className="display-m">Your list is empty</p>
            <p className="browse-empty-sub">Select + on any film, doc, game or course and it’ll show up here.</p>
            <Link to="/browse" className="btn btn-primary">
              Browse the catalogue
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
