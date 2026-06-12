import { useEffect, useState, useCallback } from 'react';
import { api } from './api.js';

const KEY = 'nux-continue';

// "continue watching" — populated only when a visitor actually starts a
// trailer. Signed in → backend; guest → localStorage. A fresh visitor has
// an empty list, so the Home rail is hidden rather than faking progress.
let items = readGuest();
let authed = false;
let configSeq = 0; // guards against a stale fetch overwriting a newer account
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
  const token = ++configSeq;
  authed = !!user;
  if (user) {
    let next;
    try {
      const r = await api.get('/history');
      next = Array.isArray(r.history) ? r.history : [];
    } catch {
      next = [];
    }
    // a newer configure() ran while we awaited — drop this stale response
    if (token !== configSeq) return;
    items = next;
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
    const next = [{ id, frac: f, at }, ...items.filter((x) => x.id !== id)].slice(0, 8);
    items = next;
    notify();
    if (authed) {
      api.put('/history', { filmId: id, frac: f }).catch(() => {});
    } else {
      localStorage.setItem(KEY, JSON.stringify(next));
    }
  }, []);

  return { history, record };
}
