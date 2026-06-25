import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';
import './Settings.css';

function Toggle({ label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button type="button" className="settings-row" role="switch" aria-checked={on} onClick={() => setOn(!on)}>
      {label}
      <span className={`toggle ${on ? 'toggle--on' : ''}`} aria-hidden="true">
        <span className="toggle-knob" />
      </span>
    </button>
  );
}

const Chevron = () => (
  <svg className="row-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 3l4.5 4L5 11" />
  </svg>
);

export default function Settings() {
  usePageTitle('Settings');
  const navigate = useNavigate();
  return (
    <main className="settings">
      <div className="settings-head">
        <button type="button" className="settings-back" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11.5 3.5 6 9l5.5 5.5" />
          </svg>
        </button>
        <h1 className="page-title" tabIndex={-1}>
          Settings
        </h1>
      </div>

      <section aria-label="Playback">
        <p className="eyebrow settings-eyebrow">Playback</p>
        <div className="settings-group">
          <Toggle label="Autoplay next" defaultOn />
          <Toggle label="Data Saver" />
          <button type="button" className="settings-row" aria-label="Download quality, High">
            <span aria-hidden="true">Download quality</span>
            <span className="settings-value" aria-hidden="true">
              High
              <Chevron />
            </span>
          </button>
        </div>
      </section>

      <section aria-label="Notifications">
        <p className="eyebrow settings-eyebrow">Notifications</p>
        <div className="settings-group">
          <Toggle label="Push notifications" defaultOn />
          <Toggle label="Email updates" />
        </div>
      </section>

      <section aria-label="Account">
        <p className="eyebrow settings-eyebrow">Account</p>
        <div className="settings-group">
          <button type="button" className="settings-row" aria-label="Manage devices, Demo">
            <span aria-hidden="true">Manage devices</span>
            <span className="settings-value" aria-hidden="true"><span className="demo-tag">Demo</span></span>
          </button>
          <Link to="/p/privacy" className="settings-row">
            Privacy
            <Chevron />
          </Link>
          <Link to="/p/terms" className="settings-row">
            Terms of Service
            <Chevron />
          </Link>
        </div>
      </section>

      <p className="metadata settings-version">NUX · v1.0.0</p>
    </main>
  );
}
