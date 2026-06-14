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
let initialized = false; // false until the first configure() resolves, so the
// My List page can show a skeleton instead of flashing "empty" on a cold load
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
  initialized = true;
  notify();
}

function applyToggle(id, title) {
  const adding = !ids.includes(id);
  const prev = ids;
  const next = adding ? [id, ...ids] : ids.filter((x) => x !== id);
  setIds(next);
  const successToast = () =>
    toast(adding ? 'Added to My List' : 'Removed from My List', {
      action: { label: 'Undo', onClick: () => applyToggle(id, title) },
    });
  if (authed) {
    (adding ? api.post('/list', { filmId: id }) : api.del(`/list/${id}`))
      // only confirm success once the write actually persisted — otherwise a
      // failed save showed a success toast AND an error toast at the same time
      .then(successToast)
      .catch(() => {
        // the write failed — undo the optimistic change and surface it rather
        // than letting the save silently not persist
        setIds(prev);
        toast(adding ? 'Couldn’t save to My List — try again' : 'Couldn’t update My List — try again');
      });
  } else {
    localStorage.setItem(KEY, JSON.stringify(next));
    successToast(); // guests have no server round-trip — the optimistic state is the truth
  }
}

export function useMyList() {
  const [list, setList] = useState(ids);
  const [ready, setReady] = useState(initialized);

  useEffect(() => {
    // notify() pushes ids; re-read the initialized flag in the same beat
    const sub = (next) => {
      setList(next);
      setReady(initialized);
    };
    subs.add(sub);
    sub(ids); // pick up any sync that happened before mount
    return () => subs.delete(sub);
  }, []);

  const has = useCallback((id) => list.includes(id), [list]);
  const toggle = useCallback((id, title) => applyToggle(id, title), []);

  return { list, ready, has, toggle };
}
