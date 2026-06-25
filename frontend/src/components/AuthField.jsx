import { useState } from 'react';

// Shared auth input: password reveal toggle, caps-lock warning, hint, error.
export default function AuthField({ label, id, type = 'text', value, onChange, error, autoComplete, hint }) {
  const isPassword = type === 'password';
  const [shown, setShown] = useState(false);
  const [caps, setCaps] = useState(false);
  const describedBy = [error ? `${id}-err` : null, hint && !error ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined;

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
      {caps && !error && <span className="auth-caps" role="status">Caps Lock is on</span>}
      {error && (
        <span id={`${id}-err`} className="auth-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
