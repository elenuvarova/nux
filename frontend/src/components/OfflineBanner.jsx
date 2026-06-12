import { useEffect, useState } from 'react';
import './OfflineBanner.css';

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (!offline) return null;
  return (
    <div className="offline-banner" role="status" aria-live="assertive">
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.5 6.5a9 9 0 0 1 13 0M5 9.5a5 5 0 0 1 8 0M9 12.8v.2M2 2l14 14" />
      </svg>
      You’re offline — showing what’s already loaded. Downloads stay available.
    </div>
  );
}
