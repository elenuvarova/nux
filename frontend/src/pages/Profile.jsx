import { Link, useNavigate } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';
import { useAuth } from '../lib/useAuth.jsx';
import './Profile.css';

const Chevron = () => (
  <svg className="row-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 3l4.5 4L5 11" />
  </svg>
);

const items = [
  {
    label: 'Downloads',
    to: '/downloads',
    icon: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2.5v8M5.5 7 9 10.5 12.5 7M3 13.5h12" />
      </svg>
    ),
  },
  {
    label: 'Notifications',
    icon: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2.5a4.5 4.5 0 0 0-4.5 4.5c0 3.5-1.5 5-1.5 5h12s-1.5-1.5-1.5-5A4.5 4.5 0 0 0 9 2.5zM7.5 14.5a1.7 1.7 0 0 0 3 0" />
      </svg>
    ),
  },
  {
    label: 'Subscription & Billing',
    icon: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="14" height="10" rx="2" />
        <path d="M2 7.5h14" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="2.4" />
        <path d="M9 1.8v2M9 14.2v2M1.8 9h2M14.2 9h2M3.9 3.9l1.4 1.4M12.7 12.7l1.4 1.4M14.1 3.9l-1.4 1.4M5.3 12.7l-1.4 1.4" />
      </svg>
    ),
  },
  {
    label: 'Help & Support',
    icon: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="9" cy="9" r="6.5" />
        <path d="M7.2 7a1.9 1.9 0 0 1 3.7.6c0 1.2-1.9 1.5-1.9 2.6M9 12.6v.2" />
      </svg>
    ),
  },
];

export default function Profile() {
  usePageTitle('Profile');
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate('/signin');
  };

  // signed-out state: prompt to sign in instead of faking an account
  if (ready && !user) {
    return (
      <main className="profile">
        <h1 className="page-title" tabIndex={-1}>
          Profile
        </h1>
        <div className="profile-card profile-card--guest">
          <img className="profile-avatar" src="/assets/avatar-user.jpg" alt="" />
          <div>
            <p className="profile-name">You’re browsing as a guest</p>
            <p className="metadata">Sign in to sync your list across devices.</p>
          </div>
        </div>
        <div className="profile-guest-actions">
          <Link to="/signin" className="btn btn-primary">
            Sign in
          </Link>
          <Link to="/signup" className="btn btn-secondary">
            Create account
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="profile">
      <h1 className="page-title" tabIndex={-1}>
        Profile
      </h1>
      <div className="profile-card">
        <img className="profile-avatar" src={user?.avatarUrl || '/assets/avatar-user.jpg'} alt="" />
        <div>
          <p className="profile-name">{user?.name || 'Member'}</p>
          <p className="metadata">{user?.email ? `${user.email} · Premium` : 'Premium'}</p>
        </div>
      </div>

      <ul className="profile-list">
        {items.map((it) => (
          <li key={it.label}>
            {it.to ? (
              <Link className="profile-row" to={it.to}>
                <span className="row-icon">{it.icon}</span>
                {it.label}
                <Chevron />
              </Link>
            ) : (
              <button type="button" className="profile-row">
                <span className="row-icon">{it.icon}</span>
                {it.label}
                <Chevron />
              </button>
            )}
          </li>
        ))}
      </ul>

      <button type="button" onClick={signOut} className="profile-row profile-signout">
        <span className="row-icon">
          <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 2.5H4a1.5 1.5 0 0 0-1.5 1.5v10A1.5 1.5 0 0 0 4 15.5h3M12 12.5 15.5 9 12 5.5M15.5 9H7" />
          </svg>
        </span>
        Sign out
      </button>
    </main>
  );
}
