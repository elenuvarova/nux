// Genre taste + onboarding flag, persisted in localStorage with a module-level
// in-memory mirror of the last written value. Private mode (setItem throws)
// must not lose a pick or bounce the user back into onboarding — the mirror
// carries the session when storage can't.

const PREFS_KEY = 'nux-genre-prefs';
const ONBOARDED_KEY = 'nux-onboarded';

let memPrefs = null; // null until the first write this session
let memOnboarded = false;

export function readGenrePrefs() {
  // the mirror is only ever set by a write in this session, so it's freshest
  if (memPrefs) return memPrefs;
  try {
    const parsed = JSON.parse(localStorage.getItem(PREFS_KEY) || '[]');
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* storage unreadable or corrupt — nothing saved */
  }
  return [];
}

export function writeGenrePrefs(ids) {
  const list = [...ids]; // accepts a Set or an array
  memPrefs = list;
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(list));
  } catch {
    /* private mode — the mirror carries the session */
  }
}

export function markOnboarded() {
  memOnboarded = true;
  try {
    localStorage.setItem(ONBOARDED_KEY, '1');
  } catch {
    /* private mode — the mirror keeps the gate open */
  }
}

export function isOnboarded() {
  if (memOnboarded) return true;
  try {
    return !!localStorage.getItem(ONBOARDED_KEY);
  } catch {
    // storage fully blocked: treat as onboarded — the gate could never be
    // satisfied by a stored flag, so redirecting to /welcome would trap the user
    return true;
  }
}
