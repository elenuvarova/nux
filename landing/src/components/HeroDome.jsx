import { useEffect, useRef } from 'react';
import { DOME, poster } from '../data/films.js';

// A clean, EVEN cylinder of posters. Rings are stacked vertically and kept LEVEL
// (no X-tilt → none of the compound skew the old dome had); within each ring the
// posters are spaced at equal angles and oriented tangent to the cylinder, so the
// curve actually reads as a cylinder. Auto-spins gently; drag to spin; the cursor
// parallax-tilts it. Reduced-motion → static; pauses when scrolled off-screen.
const CFG = {
  RADIUS: 560,                          // cylinder radius (larger = gentler front curve)
  PER_RING: 13,                         // posters per ring, evenly spaced
  RING_Y: [-345, -115, 115, 345],       // four level rings
  POSTER_W: 150, POSTER_H: 214,
  IDLE: 0.02,                           // gentle auto-spin (deg/frame)
  FRICTION: 0.95,                       // drag-release inertia decay
  DRAG_GAIN: 0.2,                       // px dragged → deg spun
  TILT: 4,                              // cursor → parallax tilt (deg)
  EASE: 0.07,
};

export default function HeroDome({ children }) {
  const heroRef = useRef(null);
  const fieldRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current, field = fieldRef.current;
    if (!hero || !field) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    field.replaceChildren();
    const tiles = [];
    let k = 0;
    CFG.RING_Y.forEach((ry, ri) => {
      const ring = document.createElement('div');
      ring.className = 'pw-ring';
      ring.style.transform = `translateY(${ry}px)`;
      for (let i = 0; i < CFG.PER_RING; i++) {
        const ang = i * (360 / CFG.PER_RING) + ri * (360 / CFG.PER_RING / 2); // offset alternate rings
        const t = document.createElement('div');
        t.className = 'pw-poster';
        const img = document.createElement('img');
        img.src = poster(DOME[k % DOME.length]);
        img.alt = ''; img.loading = 'eager'; img.decoding = 'async'; img.draggable = false;
        t.appendChild(img);
        t.style.width = CFG.POSTER_W + 'px';
        t.style.height = CFG.POSTER_H + 'px';
        t.style.marginLeft = (-CFG.POSTER_W / 2) + 'px';
        t.style.marginTop = (-CFG.POSTER_H / 2) + 'px';
        t.dataset.ang = ang;
        t.style.transform = `rotateY(${ang}deg) translateZ(${CFG.RADIUS}px)`;
        ring.appendChild(t); tiles.push(t); k++;
      }
      field.appendChild(ring);
    });

    let spin = 0, vel = reduce ? 0 : CFG.IDLE, tiltX = 0, tTiltX = 0, yaw = 0, tYaw = 0;
    let dragging = false, lastX = 0, raf = 0, visible = true;

    const onDown = (e) => { dragging = true; hero.classList.add('dragging'); lastX = e.clientX; vel = 0; try { hero.setPointerCapture(e.pointerId); } catch (_) {} };
    const onUp = (e) => { dragging = false; hero.classList.remove('dragging'); if (e && e.pointerId != null) { try { hero.releasePointerCapture(e.pointerId); } catch (_) {} } };
    const onMove = (e) => {
      if (!visible || reduce) return;
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width * 2 - 1;
      const ny = (e.clientY - r.top) / r.height * 2 - 1;
      tTiltX = -ny * CFG.TILT; tYaw = nx * CFG.TILT;
      if (dragging) { spin += (e.clientX - lastX) * CFG.DRAG_GAIN; vel = (e.clientX - lastX) * CFG.DRAG_GAIN; lastX = e.clientX; }
    };
    const onLeave = () => { tTiltX = 0; tYaw = 0; };

    hero.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(hero);

    const frame = () => {
      if (visible) {
        if (!dragging) { spin += vel; vel *= CFG.FRICTION; if (Math.abs(vel) < CFG.IDLE && !reduce) vel += (CFG.IDLE - vel) * 0.04; }
        tiltX += (tTiltX - tiltX) * CFG.EASE;
        yaw += (tYaw - yaw) * CFG.EASE;
        field.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${(spin + yaw).toFixed(2)}deg)`;
        for (const t of tiles) {
          const a = ((parseFloat(t.dataset.ang) + spin + yaw) % 360 + 360) % 360;
          const fn = Math.cos(a * Math.PI / 180) * 0.5 + 0.5; // 1 front → 0 back
          t.style.filter = `brightness(${(0.35 + 0.6 * fn).toFixed(2)})`;
          t.style.opacity = (0.16 + 0.84 * fn).toFixed(2);
        }
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
