import { useEffect, useState, useCallback } from 'react';
import { api } from './api.js';

const KEY = 'nux-continue';

// "continue watching" — populated only when a visitor actually starts a
// trailer. Signed in → backend; guest → localStorage. A fresh visitor has
// an empty list, so the Home rail is hidden rather than faking progress.
let items = readGuest();
let authed = false;
const subs = new Set();

function readGuest() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function notify() {
  subs.forEach((fn) => fn(items));
}

export async function configureWatchHistory(user) {
  authed = !!user;
  if (user) {
    try {
      const r = await api.get('/history');
      items = Array.isArray(r.history) ? r.history : [];
    } catch {
      items = [];
    }
  } else {
    items = readGuest();
  }
  notify();
}

export function useWatchHistory() {
  const [history, setHistory] = useState(items);
  useEffect(() => {
    subs.add(setHistory);
    setHistory(items);
    return () => subs.delete(setHistory);
  }, []);

  // frac = how far through the trailer (0..1); most recent first, one entry
  // per title, capped at 8
  const record = useCallback((id, frac, at) => {
    const f = Math.min(0.95, Math.max(0.04, frac || 0.1));
    items = [{ id, frac: f, at }, ...items.filter((x) => x.id !== id)].slice(0, 8);
    notify();
    if (authed) {
      api.put('/history', { filmId: id, frac: f }).catch(() => {});
    } else {
      localStorage.setItem(KEY, JSON.stringify(items));
    }
  }, []);

  return { history, record };
}
