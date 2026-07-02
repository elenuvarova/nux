import { useState } from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';
import AuthField from '../components/AuthField.jsx';
import { api } from '../lib/api.js';
import { EXTRAS } from '../data/catalog.js';
import './Auth.css';

export default function ForgotPassword() {
  usePageTitle('Reset password');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Enter a valid email.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      // the response is always generic — no account enumeration
      await api.post('/auth/forgot', { email });
      setSent(true);
    } catch (err) {
      if (err.code === 'too_many_requests') {
        // the one deliberate 4xx this endpoint sends (5/hour per IP) — the
        // generic "we've sent a link" would be false here
        setError('Too many attempts — try again in an hour.');
      } else if (!err.status || err.status >= 500) {
        // a genuine network drop or 5xx (incl. the limiter's fail-closed 503)
        // means we can't say the mail was sent — ask the user to retry
        setError('Something went wrong — please try again.');
      } else {
        // any other deliberate 4xx stays generic so we never reveal whether
        // the account exists
        setSent(true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth">
      <img className="auth-bg" src={EXTRAS.welcomeBg} alt="" fetchpriority="high" />
      <div className="auth-card">
        <Link to="/welcome" className="auth-wordmark">
          NUX
        </Link>
        {sent ? (
          <>
            <h1 className="auth-title" tabIndex={-1}>
              Check your email
            </h1>
            <p className="auth-sub">
              If an account exists for <strong>{email}</strong>, we’ve sent a link to reset your password. It expires in
              an hour.
            </p>
            <Link to="/signin" className="btn btn-primary auth-submit" style={{ marginTop: 'var(--space-4)' }}>
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <h1 className="auth-title" tabIndex={-1}>
              Reset your password
            </h1>
            <p className="auth-sub">Enter your email and we’ll send you a reset link.</p>
            <form className="auth-form" onSubmit={submit} noValidate>
              <AuthField
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                autoComplete="email"
              />
              <button type="submit" className="btn btn-primary auth-submit" disabled={busy} aria-busy={busy}>
                {busy ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
            <p className="auth-switch">
              Remembered it? <Link to="/signin">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
