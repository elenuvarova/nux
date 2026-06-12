// Loads the YouTube IFrame Player API once and resolves with window.YT.
// Rejects on a script load failure or if the API never readies (offline,
// blocked, slow network) so callers can show a fallback instead of hanging.
let ytPromise = null;

const LOAD_TIMEOUT = 12000;

export function loadYouTube() {
  if (ytPromise) return ytPromise;
  ytPromise = new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      ytPromise = null; // allow a later retry
      reject(new Error('youtube_timeout'));
    }, LOAD_TIMEOUT);

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(window.YT);
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      ytPromise = null; // allow a later retry
      reject(new Error('youtube_load_failed'));
    };
    document.head.appendChild(s);
  });
  return ytPromise;
}
