import { useEffect, useState, useCallback } from 'react';

const KEY = 'nux-continue';

// real "continue watching" — populated only when a visitor actually
// starts a trailer. A first-time visitor has an empty list, so the
// Home rail is hidden rather than faking progress.
let items = read();
const subs = new Set();

function read() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function write(next) {
  items = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  subs.forEach((fn) => fn(next));
}

export function useWatchHistory() {
  const [history, setHistory] = useState(items);
  useEffect(() => {
    subs.add(setHistory);
    return () => subs.delete(setHistory);
  }, []);

  // frac = how far through the trailer (0..1); stored as progress, most
  // recent first, one entry per title, capped at 8
  const record = useCallback((id, frac, at) => {
    const f = Math.min(0.95, Math.max(0.04, frac || 0.1));
    const next = [{ id, frac: f, at }, ...items.filter((x) => x.id !== id)].slice(0, 8);
    write(next);
  }, []);

  return { history, record };
}
