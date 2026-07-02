import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useLayoutEffect, useRef, useState } from 'react';
import { useAuth } from '../lib/useAuth.jsx';
import './NavBar.css';

export default function NavBar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // The nav search is a real input, not a styled link: typing routes to Browse
  // with the query, where ?search=1 autofocuses the main field mid-word. Local
  // state holds the characters until that handoff (cleared on blur), so nothing
  // is lost if a second keystroke lands before Browse takes focus.
  const [navQuery, setNavQuery] = useState('');
  const toBrowse = (q) => {
    const query = q.trim() ? `&q=${encodeURIComponent(q)}` : '';
    // replace while already on /browse so per-keystroke updates don't stack history
    navigate(`/browse?search=1${query}`, { replace: location.pathname === '/browse' });
  };
  const linksRef = useRef(null);
  // A single amber indicator that slides to sit under the active link. Measured
  // from the live DOM so it always tracks the real text width; hidden on routes
  // where none of the primary links is active (e.g. a detail or profile page).
  const [ind, setInd] = useState({ left: 0, width: 0, on: false });

  useLayoutEffect(() => {
    const active = linksRef.current?.querySelector('a.active');
    if (active) setInd({ left: active.offsetLeft, width: active.offsetWidth, on: true });
    else setInd((s) => ({ ...s, on: false }));
  }, [location.pathname]);

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-left">
          <Link to="/" className="nav-wordmark">
            NUX
          </Link>
          <nav className="nav-links" aria-label="Primary" ref={linksRef}>
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/browse">Browse</NavLink>
            <NavLink to="/my-list">My List</NavLink>
            <span
              className="nav-indicator"
              aria-hidden="true"
              data-on={ind.on}
              style={{ '--ind-left': `${ind.left}px`, '--ind-width': `${ind.width}px` }}
            />
          </nav>
        </div>
        <div className="nav-right">
          <form
            className="nav-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              toBrowse(navQuery);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search"
              aria-label="Search the catalogue"
              value={navQuery}
              onChange={(e) => {
                setNavQuery(e.target.value);
                toBrowse(e.target.value);
              }}
              onBlur={() => setNavQuery('')}
            />
          </form>
          {user ? (
            <Link to="/profile" className="nav-avatar" aria-label="Account menu" aria-haspopup="menu">
              <span className="nav-avatar-img">
                <img src="/assets/avatar-user.jpg?v=2" alt="" width="32" height="32" />
              </span>
              <svg className="nav-avatar-caret" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 4.5 6 7.5l3-3" />
              </svg>
            </Link>
          ) : (
            <Link to="/signin" className="btn btn-secondary">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
