import { useEffect, useState, useCallback } from 'react';
import { api } from './api.js';

const KEY = 'nux-continue';
// keep in step with the server's GET /history limit (backend/routes/history.js)
// so the Continue Watching rail doesn't visibly shrink after a local record
const MAX_CONTINUE = 12;

// "continue watching" — populated only when a visitor actually starts a
// trailer. Signed in → backend; guest → localStorage. A fresh visitor has
// an empty list, so the Home rail is hidden rather than faking progress.
let items = readGuest();
let authed = false;
let initialized = false; // false until the first configure() resolves, so a
// consumer can tell "still loading" from "genuinely empty" (no empty-flash)
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
  initialized = true;
  notify();
}

export function useWatchHistory() {
  const [history, setHistory] = useState(items);
  const [ready, setReady] = useState(initialized);
  useEffect(() => {
    const sub = (next) => {
      setHistory(next);
      setReady(initialized);
    };
    subs.add(sub);
    sub(items);
    return () => subs.delete(sub);
  }, []);

  // frac = how far through the trailer (0..1); most recent first, one entry
  // per title, capped at MAX_CONTINUE (matches the server's limit)
  const record = useCallback((id, frac, at) => {
    // default 0.05 matches the server (history.js) so a just-started item reads
    // the same on the client and after a refresh
    const f = Math.min(0.95, Math.max(0.04, frac || 0.05));
    const next = [{ id, frac: f, at }, ...items.filter((x) => x.id !== id)].slice(0, MAX_CONTINUE);
    items = next;
    notify();
    if (authed) {
      api.put('/history', { filmId: id, frac: f }).catch((err) =>
        console.warn('[watch-history] save failed:', err?.message || err)
      );
    } else {
      localStorage.setItem(KEY, JSON.stringify(next));
    }
  }, []);

  return { history, ready, record };
}
