import { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';
import { useAuth } from '../lib/useAuth.jsx';
import AuthField from '../components/AuthField.jsx';
import { EXTRAS } from '../data/catalog.js';
import './Auth.css';

const SERVER_ERRORS = {
  email_taken: { field: 'email', msg: 'That email is already registered.' },
  invalid_credentials: { field: 'password', msg: 'Invalid email or password.' },
  weak_password: { field: 'password', msg: 'At least 8 characters.' },
  invalid_email: { field: 'email', msg: 'Enter a valid email.' },
  name_required: { field: 'name', msg: 'Tell us your name.' },
  too_many_requests: { field: 'password', msg: 'Too many attempts — try again in a minute.' },
};

export default function Auth({ mode = 'signin' }) {
  const signup = mode === 'signup';
  usePageTitle(signup ? 'Create account' : 'Sign in');
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  // where to land after auth: back to the gated page that bounced us, or home
  const dest = location.state?.from?.pathname || '/';
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const focusFirst = (next) => {
    const first = ['name', 'email', 'password'].find((k) => next[k]);
    if (first) requestAnimationFrame(() => document.getElementById(first)?.focus());
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (signup && !values.name.trim()) next.name = 'Tell us your name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) next.email = 'Enter a valid email.';
    if (values.password.length < 8) next.password = 'At least 8 characters.';
    setErrors(next);
    if (Object.keys(next).length) return focusFirst(next);

    setFormError(null);
    setBusy(true);
    try {
      if (signup) await auth.signup(values.email, values.name, values.password);
      else await auth.login(values.email, values.password);
      navigate(dest, { replace: true });
    } catch (err) {
      const mapped = SERVER_ERRORS[err.code];
      if (mapped) {
        // a known, field-specific problem maps onto its field
        const next2 = { [mapped.field]: mapped.msg };
        setErrors(next2);
        focusFirst(next2);
      } else {
        // network / server / unknown — surface at form level rather than
        // pinning it to the password field (which read as a credentials error)
        setFormError(
          err?.status >= 500
            ? 'Our server had a problem — please try again.'
            : 'Couldn’t reach the server — check your connection and try again.'
        );
      }
    } finally {
      setBusy(false);
    }
  };

  // already signed in: don't show the form, bounce to the destination
  if (auth.ready && auth.user) return <Navigate to={dest} replace />;

  return (
    <main className="auth">
      <img className="auth-bg" src={EXTRAS.welcomeBg} alt="" fetchpriority="high" />
      <div className="auth-card">
        <Link to="/welcome" className="auth-wordmark">
          NUX
        </Link>
        <h1 className="auth-title" tabIndex={-1}>
          {signup ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="auth-sub">
          {signup ? 'Create a free account to sync your list and history.' : 'Sign in to pick up where you left off.'}
        </p>

        <form className="auth-form" onSubmit={submit} noValidate>
          {signup && (
            <AuthField label="Name" id="name" value={values.name} onChange={set('name')} error={errors.name} autoComplete="name" />
          )}
          <AuthField label="Email" id="email" type="email" value={values.email} onChange={set('email')} error={errors.email} autoComplete="email" />
          <AuthField
            label="Password"
            id="password"
            type="password"
            value={values.password}
            onChange={set('password')}
            error={errors.password}
            autoComplete={signup ? 'new-password' : 'current-password'}
            hint={signup ? 'At least 8 characters.' : undefined}
          />
          {!signup && (
            <Link to="/forgot" className="auth-forgot">
              Forgot password?
            </Link>
          )}
          {formError && (
            <p className="auth-form-error" role="alert">
              {formError}
            </p>
          )}
          <button type="submit" className="btn btn-primary auth-submit" disabled={busy} aria-busy={busy}>
            {busy ? 'One moment…' : signup ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          {signup ? 'Already a member?' : 'New to NUX?'}{' '}
          <Link to={signup ? '/signin' : '/signup'}>{signup ? 'Sign in' : 'Create an account'}</Link>
        </p>
      </div>
    </main>
  );
}
