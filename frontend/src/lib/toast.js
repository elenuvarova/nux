import { useEffect, useState } from 'react';

// tiny global toast bus — no provider needed
let seq = 0;
const subs = new Set();
let toasts = [];

export function toast(message, opts = {}) {
  const id = ++seq;
  toasts = [...toasts, { id, message, action: opts.action }];
  subs.forEach((fn) => fn(toasts));
  setTimeout(() => dismiss(id), opts.duration || 2600);
  return id;
}

export function dismiss(id) {
  toasts = toasts.filter((t) => t.id !== id);
  subs.forEach((fn) => fn(toasts));
}

export function useToasts() {
  const [list, setList] = useState(toasts);
  useEffect(() => {
    subs.add(setList);
    return () => subs.delete(setList);
  }, []);
  return list;
}
