import { useRef, useCallback } from 'react';

/* Pointer-driven 3D tilt + a warm sheen that follows the cursor.
   Returns props to spread on the element that should tilt. Pointer-only
   (no tilt on touch / reduced-motion), GPU-cheap (transform + a CSS var). */
export function useTilt({ max = 7 } = {}) {
  const ref = useRef(null);
  const raf = useRef(0);

  const onPointerMove = useCallback(
    (e) => {
      if (e.pointerType !== 'mouse') return;
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
  }, []);

  return { ref, onPointerMove, onPointerLeave: reset, onBlur: reset };
}
