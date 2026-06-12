import { useEffect, useState } from 'react';

// tiny global toast bus — no provider needed
let seq = 0;
const subs = new Set();
let toasts = [];
const timers = new Map();

export function toast(message, opts = {}) {
  const id = ++seq;
  // toasts that carry an action get a long, pausable timeout so a
  // keyboard/SR user can reach the control (WCAG 2.2.1 Timing Adjustable)
  const duration = opts.duration || (opts.action ? 12000 : 2600);
  // cap the stack at 3 so it never piles up
  const trimmed = [...toasts, { id, message, action: opts.action, duration }].slice(-3);
  for (const t of toasts) if (!trimmed.includes(t)) clearTimeout(timers.get(t.id));
  toasts = trimmed;
  subs.forEach((fn) => fn(toasts));
  arm(id, duration);
  return id;
}

export function arm(id, ms) {
  clearTimeout(timers.get(id));
  timers.set(
    id,
    setTimeout(() => dismiss(id), ms)
  );
}

export function pause(id) {
  clearTimeout(timers.get(id));
}

export function resume(id, ms) {
  arm(id, ms);
}

export function dismiss(id) {
  clearTimeout(timers.get(id));
  timers.delete(id);
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
