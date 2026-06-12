import { useEffect, useState, useCallback } from 'react';
import { toast } from './toast.js';
import { api } from './api.js';

const KEY = 'nux-my-list';

// shared in-memory mirror + subscribers so every mounted component
// (Hero, FilmDetail, MyList page, nav) stays in sync without a store lib.
// When signed in the source of truth is the backend; guests fall back to
// localStorage so the feature still works without an account.
let ids = readGuest();
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
  subs.forEach((fn) => fn(ids));
}

function setIds(next) {
  ids = next;
  notify();
}

// called by AuthProvider when the signed-in user changes
export async function configureMyList(user) {
  const token = ++configSeq;
  authed = !!user;
  if (user) {
    let next;
    try {
      const r = await api.get('/list');
      next = Array.isArray(r.list) ? r.list : [];
    } catch {
      next = [];
    }
    // a newer configure() ran while we awaited — drop this stale response
    if (token !== configSeq) return;
    ids = next;
  } else {
    ids = readGuest();
  }
  notify();
}

function applyToggle(id, title) {
  const adding = !ids.includes(id);
  const next = adding ? [id, ...ids] : ids.filter((x) => x !== id);
  setIds(next);
  if (authed) {
    (adding ? api.post('/list', { filmId: id }) : api.del(`/list/${id}`)).catch(() => {});
  } else {
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  toast(adding ? 'Added to My List' : 'Removed from My List', {
    action: { label: 'Undo', onClick: () => applyToggle(id, title) },
  });
}

export function useMyList() {
  const [list, setList] = useState(ids);

  useEffect(() => {
    subs.add(setList);
    setList(ids); // pick up any sync that happened before mount
    return () => subs.delete(setList);
  }, []);

  const has = useCallback((id) => list.includes(id), [list]);
  const toggle = useCallback((id, title) => applyToggle(id, title), []);

  return { list, has, toggle };
}
