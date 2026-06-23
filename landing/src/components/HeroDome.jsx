import { useEffect, useRef } from 'react';
import { DOME, poster } from '../data/films.js';

// Dome geometry + motion tuning — every magic number lives here, nowhere else.
const CFG = {
  RADIUS: 680,
  PER_RING: 15,
  RINGS: [{ y: -250, tilt: 16, off: 0 }, { y: 0, tilt: 0, off: 6 }, { y: 250, tilt: -16, off: 11 }],
  IDLE_VEL: 0.05,   // auto-drift speed (deg/frame)
  RESPIN: 0.02,     // ease back to idle drift after inertia decays
  FRICTION: 0.96,   // drag-release inertia decay
  EASE: 0.06,       // cursor parallax follow easing
  TILT_BASE: -6,    // resting dome X-tilt (deg)
  TILT_GAIN: 7,     // cursor → X-tilt range (deg)
  YAW_GAIN: 10,     // cursor → Y-yaw range (deg)
  DRAG_GAIN: 0.22,  // px dragged → deg rotated
  BRIGHT_FLOOR: 0.45, BRIGHT_RANGE: 0.55, // front posters brightest, back dimmed
  OPACITY_FLOOR: 0.4, OPACITY_RANGE: 0.6,
};

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

    const tiles = [];
    stage.replaceChildren();
    CFG.RINGS.forEach((rg) => {
      const ring = document.createElement('div');
      ring.className = 'dome-ring';
      ring.style.transform = `translateY(${rg.y}px) rotateX(${rg.tilt}deg)`;
      for (let i = 0; i < CFG.PER_RING; i++) {
        const ang = i * (360 / CFG.PER_RING);
        const t = document.createElement('div');
        t.className = 'dome-poster';
        const img = document.createElement('img');
        img.src = poster(DOME[(i + rg.off) % DOME.length]);
        img.alt = ''; img.loading = 'eager'; img.decoding = 'async'; img.draggable = false;
        t.appendChild(img);
        t.dataset.ang = ang;
        t.style.transform = `rotateY(${ang}deg) translateZ(${CFG.RADIUS}px)`;
        ring.appendChild(t); tiles.push(t);
      }
      stage.appendChild(ring);
    });

    let rotY = 0, velY = reduce ? 0 : CFG.IDLE_VEL;
    let targetTiltX = CFG.TILT_BASE, tiltX = CFG.TILT_BASE, extraY = 0, targetExtraY = 0;
    let dragging = false, lastX = 0, raf = 0, visible = true;

    const onDown = (e) => {
      dragging = true; hero.classList.add('dragging'); lastX = e.clientX; velY = 0;
      try { hero.setPointerCapture(e.pointerId); } catch (_) {}
    };
    const onUp = (e) => {
      dragging = false; hero.classList.remove('dragging');
      if (e && e.pointerId != null) { try { hero.releasePointerCapture(e.pointerId); } catch (_) {} }
    };
    const onMove = (e) => {
      if (!visible || reduce) return; // reduced-motion: no cursor parallax / glow drift either

      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width * 2 - 1;
      const ny = (e.clientY - r.top) / r.height * 2 - 1;
      targetTiltX = CFG.TILT_BASE - ny * CFG.TILT_GAIN;
      targetExtraY = nx * CFG.YAW_GAIN;
      if (glow) glow.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
      if (dragging) { rotY += (e.clientX - lastX) * CFG.DRAG_GAIN; velY = (e.clientX - lastX) * CFG.DRAG_GAIN; lastX = e.clientX; }
    };
    const onLeave = () => { targetTiltX = CFG.TILT_BASE; targetExtraY = 0; };

    hero.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(hero);

    const frame = () => {
      if (visible) {
        if (!dragging) { rotY += velY; velY *= CFG.FRICTION; if (Math.abs(velY) < CFG.IDLE_VEL && !reduce) velY += (CFG.IDLE_VEL - velY) * CFG.RESPIN; }
        tiltX += (targetTiltX - tiltX) * CFG.EASE;
        extraY += (targetExtraY - extraY) * CFG.EASE;
        stage.style.transform = `rotateX(${tiltX}deg) rotateY(${rotY + extraY}deg)`;
        for (const t of tiles) {
          const a = ((parseFloat(t.dataset.ang) + rotY + extraY) % 360 + 360) % 360;
          const f = Math.cos(a * Math.PI / 180);
          t.style.filter = `brightness(${(CFG.BRIGHT_FLOOR + CFG.BRIGHT_RANGE * (f * 0.5 + 0.5)).toFixed(3)})`;
          t.style.opacity = (CFG.OPACITY_FLOOR + CFG.OPACITY_RANGE * (f * 0.5 + 0.5)).toFixed(3);
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
      <div className="dome-scene" aria-hidden="true"><div className="dome-stage" ref={stageRef} /></div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-glow" ref={glowRef} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      {children}
    </section>
  );
}
