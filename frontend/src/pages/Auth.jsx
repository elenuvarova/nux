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

function Field({ label, id, type = 'text', value, onChange, error, autoComplete }) {
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={error ? 'auth-input auth-input--err' : 'auth-input'}
      />
      {error && (
        <span id={`${id}-err`} className="auth-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
