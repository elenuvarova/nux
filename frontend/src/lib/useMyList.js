import { useEffect, useState, useCallback } from 'react';

const KEY = 'nux-my-list';

// shared in-memory mirror + subscribers so every mounted component
// (Hero, FilmDetail, MyList page, nav) stays in sync without a store lib
let ids = read();
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
  ids = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  subs.forEach((fn) => fn(next));
}

export function useMyList() {
  const [list, setList] = useState(ids);

  useEffect(() => {
    subs.add(setList);
    return () => subs.delete(setList);
  }, []);

  const has = useCallback((id) => list.includes(id), [list]);

  const toggle = useCallback((id) => {
    write(ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids]);
  }, []);

  return { list, has, toggle };
}
