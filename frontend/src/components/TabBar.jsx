import { NavLink, Link } from 'react-router-dom';
import './TabBar.css';

const tabs = [
  {
    to: '/',
    end: true,
    label: 'Home',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
        <path d="M3.5 8.4 10 3l6.5 5.4V16a1 1 0 0 1-1 1h-3.6v-4.4H8.1V17H4.5a1 1 0 0 1-1-1V8.4z" />
      </svg>
    ),
  },
  {
    to: '/browse',
    label: 'Browse',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="3" width="6" height="6" rx="1.2" />
        <rect x="11" y="3" width="6" height="6" rx="1.2" />
        <rect x="3" y="11" width="6" height="6" rx="1.2" />
        <rect x="11" y="11" width="6" height="6" rx="1.2" />
      </svg>
    ),
  },
  {
    to: '/my-list',
    label: 'My List',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 3h8a1 1 0 0 1 1 1v13l-5-3.2L5 17V4a1 1 0 0 1 1-1z" />
      </svg>
    ),
  },
];

export default function TabBar() {
  return (
    <nav className="tabbar-wrap" aria-label="Primary">
      <div className="tabbar">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className="tabbar-item">
            {t.icon}
            <span>{t.label}</span>
          </NavLink>
        ))}
      </div>
      <Link to="/browse?search=1" className="tabbar-search" aria-label="Search">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <circle cx="9" cy="9" r="6" />
          <path d="M13.5 13.5 17 17" />
        </svg>
      </Link>
    </nav>
  );
}
