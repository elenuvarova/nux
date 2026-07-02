import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api.js';
import { toast } from '../lib/toast.js';
import './PushToggle.css';

// Weekly "new collections" web push, as one row in the Settings Notifications
// group. Four honest states — no fake toggle:
//   ios-install  iOS Safari outside the installed app (push needs Home Screen)
//   idle         soft pre-prompt; the SYSTEM permission dialog only ever fires
//                from the Turn on click
//   on           subscribed (browser + server)
//   denied       permission blocked at the browser level
// Renders nothing until /api/push/public-key answers — no keys, no feature.

// iPadOS reports MacIntel; the touch-points check catches it.
const isIOS = () =>
  /iP(hone|ad|od)/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isInstalled = () =>
  window.matchMedia?.('(display-mode: standalone)')?.matches || navigator.standalone === true;

// subscribe() wants the VAPID key as a Uint8Array, the server hands out base64url.
function toUint8(base64url) {
  const padded = base64url + '='.repeat((4 - (base64url.length % 4)) % 4);
  const raw = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (ch) => ch.charCodeAt(0));
}

export default function PushToggle() {
  const [state, setState] = useState('hidden'); // hidden | ios-install | idle | on | denied
  const [busy, setBusy] = useState(false);
  const keyRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { key } = await api.get('/push/public-key');
        if (!key) return;
        keyRef.current = key;
      } catch {
        return; // 503 / backend down — feature stays hidden
      }
      const supported =
        'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
      let next;
      if (!supported) {
        // push exists on iOS only inside an installed app; elsewhere stay hidden
        next = isIOS() && !isInstalled() ? 'ios-install' : 'hidden';
      } else if (Notification.permission === 'denied') {
        next = 'denied';
      } else {
        const reg = await navigator.serviceWorker.getRegistration();
        const sub = await reg?.pushManager.getSubscription();
        next = sub ? 'on' : 'idle';
      }
      if (alive) setState(next);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // The permission dialog fires from inside subscribe(), i.e. from this click.
  async function turnOn() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) throw new Error('no_sw');
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: toUint8(keyRef.current),
      });
      try {
        await api.post('/push/subscribe', sub.toJSON());
      } catch (err) {
        await sub.unsubscribe().catch(() => {}); // keep browser + server in step
        throw err;
      }
      setState('on');
    } catch {
      if (Notification.permission === 'denied') setState('denied');
      else toast('Could not turn on notifications');
    } finally {
      setBusy(false);
    }
  }

  async function turnOff() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        const { endpoint } = sub;
        await sub.unsubscribe();
        // api.del carries no body; the endpoint IS the credential here
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint }),
        }).catch(() => {}); // a dangling server row is pruned on next broadcast
      }
      setState('idle');
    } catch {
      toast('Could not turn off notifications');
    } finally {
      setBusy(false);
    }
  }

  if (state === 'hidden') return null;

  const hint = {
    'ios-install': 'On iPhone, add NUX to your Home Screen first',
    idle: 'One notification when the editors publish a new programme. Nothing else.',
    on: 'On',
    denied: 'Notifications are blocked for this site. Enable them in your browser settings.',
  }[state];

  return (
    <div className="push-row">
      <div className="push-copy">
        <span className="push-title">New collections, once a week</span>
        <span className="push-hint">{hint}</span>
      </div>
      {state === 'idle' && (
        <button
          type="button"
          className="btn btn-secondary push-btn"
          onClick={turnOn}
          disabled={busy}
          aria-label="Turn on weekly collection notifications"
        >
          Turn on
        </button>
      )}
      {state === 'on' && (
        <button
          type="button"
          className="btn btn-secondary push-btn"
          onClick={turnOff}
          disabled={busy}
          aria-label="Turn off weekly collection notifications"
        >
          Turn off
        </button>
      )}
    </div>
  );
}
