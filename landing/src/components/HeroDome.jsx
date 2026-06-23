import { useEffect, useRef } from 'react';
import { DOME, poster } from '../data/films.js';

// Flat, depth-layered poster WALL. Every poster faces the camera (no rotation =
// no skew/crookedness), floating at varied depths so the field parallaxes as it
// drifts and leans toward the cursor. Drag to pan. Reduced-motion → static;
// pauses when scrolled off-screen.
const CFG = {
  COLS: 7, ROWS: 5,
  COL_W: 236, ROW_H: 300,        // grid spacing
  POSTER_W: 158, POSTER_H: 226,  // ~2:3
  DEPTH: 300,                    // max |translateZ| (depth spread)
  PARALLAX_X: 64, PARALLAX_Y: 40,// cursor → field pan
  TILT: 3,                       // cursor → field tilt (deg) — tiny, stays flat
  DRIFT: 26,                     // ambient horizontal sway (px)
  EASE: 0.06,
};

export default function HeroDome({ children }) {
  const heroRef = useRef(null);
  const fieldRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current, field = fieldRef.current;
    if (!hero || !field) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

    field.replaceChildren();
    let k = 0;
    for (let r = 0; r < CFG.ROWS; r++) {
      for (let c = 0; c < CFG.COLS; c++) {
        const stagger = (r % 2) * (CFG.COL_W / 2);
        const x = (c - (CFG.COLS - 1) / 2) * CFG.COL_W + stagger + (rand(k) - 0.5) * 36;
        const y = (r - (CFG.ROWS - 1) / 2) * CFG.ROW_H + (rand(k + 99) - 0.5) * 36;
        const z = (rand(k + 7) - 0.5) * 2 * CFG.DEPTH;
        const t = document.createElement('div');
        t.className = 'pw-poster';
        const img = document.createElement('img');
        img.src = poster(DOME[k % DOME.length]);
        img.alt = ''; img.loading = 'eager'; img.decoding = 'async'; img.draggable = false;
        t.appendChild(img);
        t.style.width = CFG.POSTER_W + 'px';
        t.style.height = CFG.POSTER_H + 'px';
        t.style.transform = `translate3d(${(x - CFG.POSTER_W / 2).toFixed(1)}px, ${(y - CFG.POSTER_H / 2).toFixed(1)}px, ${z.toFixed(1)}px)`;
        const depthN = (z + CFG.DEPTH) / (2 * CFG.DEPTH); // 0 far → 1 near
        t.style.filter = `brightness(${(0.5 + 0.4 * depthN).toFixed(2)})`;
        t.style.opacity = (0.5 + 0.5 * depthN).toFixed(2);
        t.style.zIndex = String(1000 + Math.round(z));
        field.appendChild(t); k++;
      }
    }

    let panX = 0, panY = 0, tPanX = 0, tPanY = 0, tiltX = 0, tiltY = 0, tTiltX = 0, tTiltY = 0;
    let dragging = false, lastX = 0, dragX = 0, raf = 0, visible = true;
    const t0 = performance.now();

    const onDown = (e) => { dragging = true; hero.classList.add('dragging'); lastX = e.clientX; try { hero.setPointerCapture(e.pointerId); } catch (_) {} };
    const onUp = (e) => { dragging = false; hero.classList.remove('dragging'); if (e && e.pointerId != null) { try { hero.releasePointerCapture(e.pointerId); } catch (_) {} } };
    const onMove = (e) => {
      if (!visible || reduce) return;
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width * 2 - 1;
      const ny = (e.clientY - r.top) / r.height * 2 - 1;
      tPanX = -nx * CFG.PARALLAX_X; tPanY = -ny * CFG.PARALLAX_Y;
      tTiltY = nx * CFG.TILT; tTiltX = -ny * CFG.TILT;
      if (dragging) { dragX += (e.clientX - lastX); lastX = e.clientX; }
    };
    const onLeave = () => { tPanX = 0; tPanY = 0; tTiltX = 0; tTiltY = 0; };

    hero.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(hero);

    const frame = (now) => {
      if (visible) {
        const drift = reduce ? 0 : Math.sin((now - t0) / 6500) * CFG.DRIFT;
        panX += (tPanX + dragX - panX) * CFG.EASE;
        panY += (tPanY - panY) * CFG.EASE;
        tiltX += (tTiltX - tiltX) * CFG.EASE;
        tiltY += (tTiltY - tiltY) * CFG.EASE;
        field.style.transform = `translate3d(${(panX + drift).toFixed(2)}px, ${panY.toFixed(2)}px, 0) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      io.disconnect();
    };
  }, []);

  return (
    <section className="hero" ref={heroRef} aria-label="NUX — British cinema, curated">
      <div className="pw-scene" aria-hidden="true"><div className="pw-field" ref={fieldRef} /></div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      {children}
    </section>
  );
}
