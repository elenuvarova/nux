import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../lib/useAuth.jsx';
import './NavBar.css';

export default function NavBar() {
  const { user } = useAuth();
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-left">
          <Link to="/" className="nav-wordmark">
            NUX
          </Link>
          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/browse">Browse</NavLink>
            <NavLink to="/my-list">My List</NavLink>
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
