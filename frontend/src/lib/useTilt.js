import { useRef, useCallback, useEffect } from 'react';

/* Pointer-driven 3D tilt + a warm sheen that follows the cursor.
   Returns props to spread on the element that should tilt. Pointer-only
   (no tilt on touch / reduced-motion), GPU-cheap (transform + a CSS var). */
export function useTilt({ max = 7 } = {}) {
  const ref = useRef(null);
  const raf = useRef(0);
  const reduce = useRef(false);

  // cancel any queued frame if the element unmounts mid-tilt (e.g. a fast
  // filter change in Browse) so the callback never runs against a detached node
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduce.current = mq.matches;
    const on = () => (reduce.current = mq.matches);
    mq.addEventListener('change', on);
    return () => {
      mq.removeEventListener('change', on);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      if (e.pointerType !== 'mouse' || reduce.current) return;
      const el = ref.current;
      if (!el) return;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width; // 0..1
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', `${(px - 0.5) * 2 * max}deg`);
        el.style.setProperty('--rx', `${(0.5 - py) * 2 * max}deg`);
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
      });
    },
    [max]
  );

  const reset = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
    /* recentre the sheen origin too, else the next hover flashes the cursor
       sheen from the last exit position for one frame */
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '50%');
  }, []);

  return { ref, onPointerMove, onPointerLeave: reset, onBlur: reset };
}
