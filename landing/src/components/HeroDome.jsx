import { useEffect, useRef } from 'react';
import { DOME, poster } from '../data/films.js';

// Cursor-reactive 3D poster dome. Drag to spin (with inertia), move the cursor to
// parallax-tilt the dome and drag a warm amber glow across it. Auto-drifts when idle.
// prefers-reduced-motion → static, no auto-spin; pauses when scrolled off-screen.
export default function HeroDome({ children }) {
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current, stage = stageRef.current, glow = glowRef.current;
    if (!hero || !stage) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const RADIUS = 680, perRing = 15;
    const rings = [{ y: -250, tilt: 16, off: 0 }, { y: 0, tilt: 0, off: 6 }, { y: 250, tilt: -16, off: 11 }];
    const tiles = [];
    stage.replaceChildren();
    rings.forEach((rg) => {
      const ring = document.createElement('div');
      ring.className = 'dome-ring';
      ring.style.transform = `translateY(${rg.y}px) rotateX(${rg.tilt}deg)`;
      for (let i = 0; i < perRing; i++) {
        const ang = i * (360 / perRing);
        const t = document.createElement('div');
        t.className = 'dome-poster';
        const img = document.createElement('img');
        img.src = poster(DOME[(i + rg.off) % DOME.length]);
        img.alt = ''; img.loading = 'eager'; img.decoding = 'async'; img.draggable = false;
        t.appendChild(img);
        t.dataset.ang = ang;
        t.style.transform = `rotateY(${ang}deg) translateZ(${RADIUS}px)`;
        ring.appendChild(t); tiles.push(t);
      }
      stage.appendChild(ring);
    });

    let rotY = 0, velY = reduce ? 0 : 0.05;
    let targetTiltX = -6, tiltX = -6, extraY = 0, targetExtraY = 0;
    let dragging = false, lastX = 0, raf = 0, visible = true;

    const onDown = (e) => { dragging = true; hero.classList.add('dragging'); lastX = e.clientX; velY = 0; try { hero.setPointerCapture(e.pointerId); } catch (_) {} };
    const onUp = () => { dragging = false; hero.classList.remove('dragging'); };
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width * 2 - 1;
      const ny = (e.clientY - r.top) / r.height * 2 - 1;
      targetTiltX = -6 - ny * 7;
      targetExtraY = nx * 10;
      if (glow) glow.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
      if (dragging) { rotY += (e.clientX - lastX) * 0.22; velY = (e.clientX - lastX) * 0.22; lastX = e.clientX; }
    };
    const onLeave = () => { targetTiltX = -6; targetExtraY = 0; };

    hero.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(hero);

    const frame = () => {
      if (visible) {
        if (!dragging) { rotY += velY; velY *= 0.96; if (Math.abs(velY) < 0.05 && !reduce) velY += (0.05 - velY) * 0.02; }
        tiltX += (targetTiltX - tiltX) * 0.06;
        extraY += (targetExtraY - extraY) * 0.06;
        stage.style.transform = `rotateX(${tiltX}deg) rotateY(${rotY + extraY}deg)`;
        for (const t of tiles) {
          const a = ((parseFloat(t.dataset.ang) + rotY + extraY) % 360 + 360) % 360;
          const f = Math.cos(a * Math.PI / 180);
          t.style.filter = `brightness(${(0.45 + 0.55 * (f * 0.5 + 0.5)).toFixed(3)})`;
          t.style.opacity = (0.4 + 0.6 * (f * 0.5 + 0.5)).toFixed(3);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      io.disconnect();
    };
  }, []);

  return (
    <section className="hero" ref={heroRef} aria-label="NUX — British cinema, curated">
      <div className="dome-scene" aria-hidden="true"><div className="dome-stage" ref={stageRef} /></div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-glow" ref={glowRef} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      {children}
    </section>
  );
}
