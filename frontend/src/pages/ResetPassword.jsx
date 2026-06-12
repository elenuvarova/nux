import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';
import AuthField from '../components/AuthField.jsx';
import { api } from '../lib/api.js';
import { EXTRAS } from '../data/catalog.js';
import './Auth.css';

const ERRORS = {
  weak_password: 'At least 8 characters.',
  invalid_token: 'This reset link is invalid or has expired.',
};

export default function ResetPassword() {
  usePageTitle('Set a new password');
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const noToken = !token;

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('At least 8 characters.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await api.post('/auth/reset', { token, password });
      setPassword(''); // don't keep the new password in component state
      setDone(true);
    } catch (err) {
      setError(ERRORS[err.code] || 'Something went wrong — try again.');
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
        {done ? (
          <>
            <h1 className="auth-title" tabIndex={-1}>
              Password updated
            </h1>
            <p className="auth-sub">You’ve been signed out everywhere for safety. Sign in with your new password.</p>
            <Link to="/signin" className="btn btn-primary auth-submit" style={{ marginTop: 'var(--space-4)' }}>
              Sign in
            </Link>
          </>
        ) : noToken ? (
          <>
            <h1 className="auth-title" tabIndex={-1}>
              Invalid reset link
            </h1>
            <p className="auth-sub">This link is missing its token. Request a new one.</p>
            <Link to="/forgot" className="btn btn-primary auth-submit" style={{ marginTop: 'var(--space-4)' }}>
              Request a new link
            </Link>
          </>
        ) : (
          <>
            <h1 className="auth-title" tabIndex={-1}>
              Set a new password
            </h1>
            <p className="auth-sub">Choose a new password for your account.</p>
            <form className="auth-form" onSubmit={submit} noValidate>
              <AuthField
                label="New password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                autoComplete="new-password"
                hint="At least 8 characters."
              />
              <button type="submit" className="btn btn-primary auth-submit" disabled={busy} aria-busy={busy}>
                {busy ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
