import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';
import { useAuth } from '../lib/useAuth.jsx';
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
  const auth = useAuth();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
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

    setBusy(true);
    try {
      if (signup) await auth.signup(values.email, values.name, values.password);
      else await auth.login(values.email, values.password);
      navigate('/');
    } catch (err) {
      const mapped = SERVER_ERRORS[err.code] || { field: 'password', msg: 'Something went wrong — try again.' };
      const next2 = { [mapped.field]: mapped.msg };
      setErrors(next2);
      focusFirst(next2);
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
        <h1 className="auth-title" tabIndex={-1}>
          {signup ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="auth-sub">
          {signup ? 'Start your membership — cancel anytime.' : 'Sign in to pick up where you left off.'}
        </p>

        <form className="auth-form" onSubmit={submit} noValidate>
          {signup && (
            <Field label="Name" id="name" value={values.name} onChange={set('name')} error={errors.name} autoComplete="name" />
          )}
          <Field label="Email" id="email" type="email" value={values.email} onChange={set('email')} error={errors.email} autoComplete="email" />
          <Field
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
            <button type="button" className="auth-forgot">
              Forgot password?
            </button>
          )}
          <button type="submit" className="btn btn-primary auth-submit" disabled={busy}>
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

function Field({ label, id, type = 'text', value, onChange, error, autoComplete, hint }) {
  const isPassword = type === 'password';
  const [shown, setShown] = useState(false);
  const [caps, setCaps] = useState(false);
  const describedBy = [error ? `${id}-err` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <input
          id={id}
          type={isPassword && shown ? 'text' : type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          onKeyUp={isPassword ? (e) => setCaps(e.getModifierState && e.getModifierState('CapsLock')) : undefined}
          onBlur={isPassword ? () => setCaps(false) : undefined}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={error ? 'auth-input auth-input--err' : 'auth-input'}
        />
        {isPassword && (
          <button
            type="button"
            className="auth-reveal"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? 'Hide password' : 'Show password'}
            aria-pressed={shown}
            tabIndex={-1}
          >
            {shown ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 10s2.8-5 8-5c1.4 0 2.6.36 3.7.95M18 10s-2.8 5-8 5c-1.4 0-2.6-.36-3.7-.95" />
                <path d="M8.2 8.2a2.5 2.5 0 0 0 3.6 3.6M3 3l14 14" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 10s2.8-5 8-5 8 5 8 5-2.8 5-8 5-8-5-8-5z" />
                <circle cx="10" cy="10" r="2.4" />
              </svg>
            )}
          </button>
        )}
      </div>
      {hint && !error && (
        <span id={`${id}-hint`} className="auth-hint">
          {hint}
        </span>
      )}
      {caps && !error && <span className="auth-caps">Caps Lock is on</span>}
      {error && (
        <span id={`${id}-err`} className="auth-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
