// Microsoft Clarity — conversion + behaviour instrumentation for the landing.
// Reuses the app's Clarity project (x7st844dqx) so both surfaces report into one
// place. Clarity loads from clarity.ms; nginx.conf allows it in script-src /
// connect-src. Every call is guarded so an ad-blocker that drops the SDK can
// never break the page.
import Clarity from '@microsoft/clarity';

const PROJECT_ID = 'x7st844dqx';
let started = false;

export function initAnalytics() {
  if (started) return;
  started = true;
  try {
    Clarity.init(PROJECT_ID);
  } catch {
    /* SDK blocked — analytics is best-effort, never load-bearing */
  }
}

// Fire a custom event. Clarity.event takes no params, so any params are written
// as session tags alongside it (the way Clarity models "an event with context").
export function track(name, params) {
  try {
    Clarity.event(name);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v != null) Clarity.setTag(`${name}:${k}`, String(v));
      }
    }
  } catch {
    /* no-op when Clarity isn't present */
  }
}

// One-shot scroll-depth beacon: fires `event` the first time `el` is ~halfway
// into the viewport, then disconnects. Used on the proof + pricing sections to
// see how far visitors actually read.
export function scrollDepth(el, event) {
  if (!el || typeof IntersectionObserver === 'undefined') return () => {};
  let fired = false;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!fired && e.isIntersecting) {
          fired = true;
          track(event);
          io.disconnect();
        }
      }
    },
    { threshold: 0.5 }
  );
  io.observe(el);
  return () => io.disconnect();
}
