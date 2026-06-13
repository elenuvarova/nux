import { NavLink, Link, useLocation } from 'react-router-dom';
import { useLayoutEffect, useRef, useState } from 'react';
import { useAuth } from '../lib/useAuth.jsx';
import './NavBar.css';

export default function NavBar() {
  const { user } = useAuth();
  const location = useLocation();
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
          <Link to="/browse?search=1" className="nav-search" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Search</span>
          </Link>
          {user ? (
            <Link to="/profile" className="nav-avatar" aria-label="Profile">
              <img src="/assets/avatar-user.jpg" alt="" width="32" height="32" />
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
