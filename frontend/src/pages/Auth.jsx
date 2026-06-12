import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';
import { EXTRAS } from '../data/catalog.js';
import './Auth.css';

export default function Auth({ mode = 'signin' }) {
  const signup = mode === 'signup';
  usePageTitle(signup ? 'Create account' : 'Sign in');
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (signup && !values.name.trim()) next.name = 'Tell us your name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) next.email = 'Enter a valid email.';
    if (values.password.length < 6) next.password = 'At least 6 characters.';
    setErrors(next);
    if (Object.keys(next).length === 0) navigate('/');
  };

  return (
    <main className="auth">
      <img className="auth-bg" src={EXTRAS.welcomeBg} alt="" />
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
          <button type="submit" className="btn btn-primary auth-submit">
            {signup ? 'Create account' : 'Sign in'}
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
