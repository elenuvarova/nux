import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../lib/useAuth';
import { api } from '../lib/api';
import './NeonDrift.css';

/* ──────────────────────────────────────────────────────────────────────────
   NEON DRIFT — a small, self-contained arcade game for the "Neon Drift" title.
   The catalog bills it as a "reflex-driven roguelite — pilot a salvaged
   starfighter through the neon ruins of a dead empire, synthwave score".
   So: a synthwave gate-dodger. Thread your ship through the gaps in the neon
   ruins; one clip and you're scrap. Speed ramps, the gaps tighten.

   Everything game-side is drawn on a single <canvas> and runs off one rAF loop
   with mutable refs (no per-frame React state). React state only drives the
   infrequent phase overlays (ready / crashed) so the DOM stays quiet.
   The game owns its own neon palette on purpose — it's the title's *content*,
   like a film's own colour grade, not NUX chrome.
   ────────────────────────────────────────────────────────────────────────── */

const BEST_KEY = 'nux_neondrift_best';
const GAME = 'neon-drift';
const HANDLE_KEY = 'nux_neondrift_handle'; // remembers a guest's last handle

// mirror of the server's display rule: first name + LAST name's initial.
// "Elena Uvarova" -> "Elena U." ; "Mary Jane Watson" -> "Mary W." ; single token passes through.
const abbreviate = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Player';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
};

const readHandle = () => {
  try {
    return localStorage.getItem(HANDLE_KEY) || '';
  } catch {
    return '';
  }
};

// the game's own synthwave palette (deliberately off the warm-ink system)
const C = {
  skyTop: '#13072b',
  skyMid: '#3a0c5e',
  skyHot: '#7a1b6b',
  sun1: '#ffd23f',
  sun2: '#ff5f6d',
  grid: '#ff2d95',
  gridFar: '#5a1e7a',
  cyan: '#2de2e6',
  cyanGlow: 'rgba(45,226,230,0.9)',
  pink: '#ff2d95',
  pinkGlow: 'rgba(255,45,149,0.9)',
  white: '#fdf3ff',
};

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};
const writeBest = (n) => {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {
    /* private mode — best just won't persist */
  }
};

export default function NeonDrift({ onClose }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const gameRef = useRef(null);
  const rafRef = useRef(0);
  const scoreSrRef = useRef(null); // sr-only mirror of the canvas score

  const [phase, setPhase] = useState('ready'); // 'ready' | 'playing' | 'crashed'
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(readBest);

  const { user } = useAuth();
  const [handle, setHandle] = useState(readHandle);
  const [submitState, setSubmitState] = useState('idle'); // 'idle'|'submitting'|'done'|'error'
  const [board, setBoard] = useState(null); // { top, you } | null
  const [myRank, setMyRank] = useState(null); // rank from the submit response

  const loadBoard = useCallback(async () => {
    try {
      const data = await api.get(`/scores?game=${GAME}`);
      setBoard(data);
    } catch {
      /* board just won't show; the game is unaffected */
    }
  }, []);

  const submitScore = useCallback(async () => {
    const name = handle.trim();
    if (!user && !name) return; // guest must type a handle
    setSubmitState('submitting');
    try {
      const body = user ? { game: GAME, score } : { game: GAME, score, name };
      const res = await api.post('/scores', body);
      setMyRank(res.rank);
      if (!user) {
        try {
          localStorage.setItem(HANDLE_KEY, name);
        } catch {
          /* private mode — handle just won't persist */
        }
      }
      setSubmitState('done');
      await loadBoard();
    } catch {
      setSubmitState('error');
    }
  }, [handle, user, score, loadBoard]);

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // ── fresh run state ───────────────────────────────────────────────────
  const resetGame = useCallback((W, H) => {
    gameRef.current = {
      W,
      H,
      phase: 'playing',
      t: 0,
      ship: { x: W * 0.28, y: H / 2, vy: 0, targetY: H / 2, tilt: 0 },
      obstacles: [],
      particles: [],
      stars: Array.from({ length: 60 }, (_, i) => ({
        x: ((i * 137.5) % 100) / 100,
        y: ((i * 53.1) % 60) / 100, // upper sky only
        z: 0.3 + ((i * 31) % 70) / 100,
      })),
      gridPhase: 0,
      speed: 260,
      score: 0,
      sinceSpawn: 0,
      spawnGap: 1.35, // seconds between gates (shrinks with speed)
      shake: 0,
      started: false, // small grace before first gate
    };
  }, []);

  // ── one-time canvas + loop setup ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = 0;
    let H = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      W = Math.max(320, Math.floor(r.width));
      H = Math.max(240, Math.floor(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = gameRef.current;
      if (g) {
        // keep the ship's vertical ratio so a resize doesn't kill the player
        const ratio = g.H ? g.ship.y / g.H : 0.5;
        g.W = W;
        g.H = H;
        g.ship.x = W * 0.28;
        g.ship.y = ratio * H;
        g.ship.targetY = g.ship.y;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    let last = performance.now();
    let lastAnnounced = -1;
    const loop = (now) => {
      const g = gameRef.current;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 1 / 30) dt = 1 / 30; // clamp tab-switch jumps
      if (g && g.phase === 'playing') {
        update(g, dt, reduceMotion);
        // mirror the running score into an sr-only live region (the canvas
        // score is otherwise invisible to assistive tech)
        if (scoreSrRef.current && g.score !== lastAnnounced) {
          lastAnnounced = g.score;
          scoreSrRef.current.textContent = `Score ${g.score}`;
        }
        if (g.crashedThisFrame) {
          g.crashedThisFrame = false;
          g.phase = 'crashed';
          const final = g.score;
          setScore(final);
          setBest((b) => {
            const nb = Math.max(b, final);
            if (nb !== b) writeBest(nb);
            return nb;
          });
          setPhase('crashed');
        }
      }
      render(ctx, g, W, H, now, reduceMotion);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    // returning from a hidden tab: reset the clock so dt doesn't spike (the
    // browser already pauses rAF while the tab is hidden)
    const onVis = () => {
      if (!document.hidden) last = performance.now();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  // ── input ─────────────────────────────────────────────────────────────
  const start = useCallback(() => {
    const canvas = canvasRef.current;
    const r = canvas.getBoundingClientRect();
    resetGame(r.width, r.height);
    setScore(0);
    setSubmitState('idle');
    setBoard(null);
    setMyRank(null);
    setPhase('playing');
  }, [resetGame]);

  // pointer / touch: ship target follows the cursor's Y
  const onPointer = useCallback((e) => {
    const g = gameRef.current;
    if (!g || g.phase !== 'playing') return;
    const r = canvasRef.current.getBoundingClientRect();
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    g.ship.targetY = Math.max(20, Math.min(r.height - 20, cy));
  }, []);

  // keyboard: arrows / W,S steer; Space/Enter starts; Esc closes
  useEffect(() => {
    const held = { up: false, down: false };
    const apply = () => {
      const g = gameRef.current;
      if (!g) return;
      g.keyDir = (held.down ? 1 : 0) - (held.up ? 1 : 0);
    };
    const onKeyDown = (e) => {
      // never hijack typing in a field (e.g. if another overlay is ever open)
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'Escape') {
        onClose?.();
        return;
      }
      // trap Tab inside the overlay so focus can't reach the (inert) page chrome
      if (e.key === 'Tab') {
        const ov = overlayRef.current;
        if (!ov) return;
        const items = Array.from(
          ov.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
        ).filter((el) => el.offsetParent !== null);
        if (items.length === 0) {
          e.preventDefault();
          ov.focus();
          return;
        }
        const first = items[0];
        const last2 = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === ov)) {
          e.preventDefault();
          last2.focus();
        } else if (!e.shiftKey && active === last2) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        held.up = true;
        apply();
        e.preventDefault();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        held.down = true;
        apply();
        e.preventDefault();
      } else if (e.key === ' ' || e.key === 'Enter') {
        const g = gameRef.current;
        if (!g || g.phase !== 'playing') start();
        e.preventDefault();
      }
    };
    const onKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') held.up = false;
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') held.down = false;
      apply();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onClose, start]);

  // Modal focus management: focus the overlay, make the rest of the app inert
  // (the overlay is portalled to <body>, so #root can be inert without inerting
  // the game), lock scroll, and restore focus to the trigger (Play) on close.
  useEffect(() => {
    const opener = document.activeElement;
    const root = document.getElementById('root');
    overlayRef.current?.focus();
    if (root) root.inert = true;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      if (root) root.inert = false;
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  const stageTap = (e) => {
    // tapping the stage (re)launches a run — but NOT when the tap lands on the
    // leaderboard controls, or their pointerdown would relaunch the game and
    // unmount the submit form before it can fire.
    if (e.target.closest('.ndg-submit, .ndg-board')) return;
    if (phase !== 'playing') start();
  };

  return createPortal(
    <div
      className="ndg-overlay"
      ref={overlayRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ndg-dialog-title"
    >
      {/* sr-only: dialog name + persistent controls + a live score mirror */}
      <p className="sr-only" id="ndg-dialog-title">Neon Drift — playable game</p>
      <p className="sr-only">
        Steer your ship with the mouse or the up and down arrow keys to fly through the gaps.
        Press Escape to close.
      </p>
      <p className="sr-only" aria-live="polite" ref={scoreSrRef} />

      <div className="ndg-stage" onPointerDown={stageTap}>
        <canvas
          ref={canvasRef}
          className="ndg-canvas"
          aria-label="Neon Drift game — steer with the mouse or arrow keys"
          onPointerMove={onPointer}
          onTouchMove={onPointer}
        />

        {phase !== 'playing' && (
          <div className="ndg-screen">
            {phase === 'ready' ? (
              <>
                <p className="ndg-eyebrow">NUX Arcade</p>
                <h2 className="ndg-title">NEON DRIFT</h2>
                <p className="ndg-sub">
                  Thread your starfighter through the neon ruins. One clip and you're scrap.
                </p>
              </>
            ) : (
              <>
                <p className="ndg-eyebrow">Run ended</p>
                {/* the meaningful result, announced once (not the whole panel) */}
                <p className="sr-only" role="status">
                  Run ended. Score {score}
                  {score >= best && score > 0 ? ', a new best.' : `, best ${best}.`}
                </p>
                <h2 className="ndg-title ndg-title--score" aria-hidden="true">{score}</h2>
                <p className="ndg-sub" aria-hidden="true">
                  {score >= best && score > 0 ? 'New best run' : `Best ${best}`}
                </p>

                {submitState !== 'done' && score > 0 && (
                  <div className="ndg-submit">
                    {user ? (
                      <button
                        type="button"
                        className="btn btn-ghost ndg-submit-btn"
                        onClick={submitScore}
                        disabled={submitState === 'submitting'}
                      >
                        {submitState === 'submitting'
                          ? 'Submitting…'
                          : `Submit as ${abbreviate(user.name)}`}
                      </button>
                    ) : (
                      <form
                        className="ndg-submit-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          submitScore();
                        }}
                      >
                        <label className="sr-only" htmlFor="ndg-handle">Your name for the leaderboard</label>
                        <input
                          id="ndg-handle"
                          className="ndg-handle"
                          value={handle}
                          onChange={(e) => setHandle(e.target.value)}
                          placeholder="Your name"
                          maxLength={16}
                          autoComplete="off"
                        />
                        <button
                          type="submit"
                          className="btn btn-ghost ndg-submit-btn"
                          disabled={submitState === 'submitting' || !handle.trim()}
                        >
                          {submitState === 'submitting' ? 'Submitting…' : 'Add to leaderboard'}
                        </button>
                      </form>
                    )}
                    {submitState === 'error' && (
                      <p className="ndg-submit-err" role="alert">
                        Couldn’t save your score.{' '}
                        <button type="button" className="ndg-retry" onClick={submitScore}>Try again</button>
                      </p>
                    )}
                  </div>
                )}

                {board?.top?.length > 0 && (
                  <div className="ndg-board" aria-label="Leaderboard">
                    <p className="ndg-board-head">Leaderboard</p>
                    <ol className="ndg-board-list">
                      {board.top.map((row) => (
                        <li
                          key={`${row.rank}-${row.name}`}
                          className={`ndg-board-row${row.isYou ? ' ndg-board-row--you' : ''}`}
                        >
                          <span className="ndg-board-rank">{row.rank}</span>
                          <span className="ndg-board-name">
                            {row.name}
                            {row.registered && (
                              <span className="ndg-board-verified" title="Signed-in player" aria-label="signed-in player">●</span>
                            )}
                          </span>
                          <span className="ndg-board-score">{row.score}</span>
                        </li>
                      ))}
                    </ol>
                    {(board.you || myRank) && !board.top.some((r) => r.isYou) && (
                      <p className="ndg-board-you">
                        You’re #{board.you?.rank ?? myRank}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
            <button type="button" className="btn btn-primary ndg-go" onClick={start}>
              {phase === 'ready' ? 'Launch' : 'Fly again'}
            </button>
            <p className="ndg-hint">
              Move the cursor / drag, or use <kbd>↑</kbd> <kbd>↓</kbd> to steer
            </p>
          </div>
        )}
      </div>

      <button type="button" className="ndg-close" onClick={onClose} aria-label="Close game">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 4l10 10M14 4L4 14" />
        </svg>
      </button>
    </div>,
    document.body
  );
}

/* ── simulation ──────────────────────────────────────────────────────── */
function update(g, dt, reduceMotion) {
  g.t += dt;
  // freeze the scrolling perspective grid under reduced-motion
  g.gridPhase = reduceMotion ? 0 : (g.gridPhase + g.speed * dt * 0.0016) % 1;

  // keyboard steering nudges the target; pointer sets it directly (above)
  if (g.keyDir) g.ship.targetY = clamp(g.ship.targetY + g.keyDir * 520 * dt, 20, g.H - 20);

  // eased "drift" follow — lag + banking gives the piloting feel
  const ship = g.ship;
  const prevY = ship.y;
  ship.y += (ship.targetY - ship.y) * Math.min(1, dt * 11);
  ship.y = clamp(ship.y, 16, g.H - 16);
  ship.vy = (ship.y - prevY) / (dt || 1 / 60);
  ship.tilt += (clamp(ship.vy / 900, -0.5, 0.5) - ship.tilt) * Math.min(1, dt * 10);

  // difficulty ramp
  g.speed = Math.min(640, g.speed + dt * 9);
  g.spawnGap = Math.max(0.82, 1.35 - g.score * 0.012);

  // spawn gates (after a short grace so you're not hit on frame 1)
  g.sinceSpawn += dt;
  if (g.t > 0.9 && g.sinceSpawn >= g.spawnGap) {
    g.sinceSpawn = 0;
    const gapH = Math.max(g.H * 0.22, g.H * 0.4 - g.score * 1.6);
    const margin = 38;
    const gapY = rand(margin + gapH / 2, g.H - margin - gapH / 2, g.t);
    g.obstacles.push({ x: g.W + 60, w: 52, gapY, gapH, passed: false });
  }

  // move + score gates
  for (const o of g.obstacles) {
    o.x -= g.speed * dt;
    if (!o.passed && o.x + o.w < ship.x) {
      o.passed = true;
      g.score += 1;
      spawnBurst(g, ship.x, ship.y, C.cyan, 6);
    }
  }
  g.obstacles = g.obstacles.filter((o) => o.x + o.w > -20);

  // collision — ship as a circle vs the two pillars
  const sr = 13;
  for (const o of g.obstacles) {
    const topRect = { x: o.x, y: 0, w: o.w, h: o.gapY - o.gapH / 2 };
    const botRect = { x: o.x, y: o.gapY + o.gapH / 2, w: o.w, h: g.H - (o.gapY + o.gapH / 2) };
    if (circleRect(ship.x, ship.y, sr, topRect) || circleRect(ship.x, ship.y, sr, botRect)) {
      crash(g, reduceMotion);
      break;
    }
  }

  // thruster trail (suppressed under reduced-motion)
  if (!reduceMotion && Math.random() < 0.9) {
    g.particles.push({
      x: ship.x - 14,
      y: ship.y + 2,
      vx: -g.speed * 0.4 - rand(20, 90, g.t),
      vy: rand(-40, 40, g.t * 1.3) + ship.vy * 0.2,
      life: 0.5,
      max: 0.5,
      r: rand(1.5, 3.5, g.t),
      c: Math.random() < 0.5 ? C.cyan : C.pink,
    });
  }
  stepParticles(g, dt);
  if (g.shake > 0) g.shake = Math.max(0, g.shake - dt * 2.4);
}

function crash(g, reduceMotion) {
  g.crashedThisFrame = true;
  // no screen-shake or particle burst under reduced-motion
  if (!reduceMotion) {
    g.shake = 1;
    spawnBurst(g, g.ship.x, g.ship.y, C.pink, 28);
    spawnBurst(g, g.ship.x, g.ship.y, C.cyan, 18);
  }
}

function stepParticles(g, dt) {
  for (const p of g.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 60 * dt;
    p.life -= dt;
  }
  g.particles = g.particles.filter((p) => p.life > 0);
}

function spawnBurst(g, x, y, color, n) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + rand(-0.3, 0.3, g.t + i);
    const sp = rand(60, 320, g.t + i * 1.7);
    g.particles.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life: rand(0.4, 0.9, g.t + i),
      max: 0.9,
      r: rand(1.5, 4, g.t + i),
      c: color,
    });
  }
}

/* ── rendering ───────────────────────────────────────────────────────── */
function render(ctx, g, W, H, now, reduceMotion) {
  if (!g) {
    // pre-init: just paint the sky so the canvas isn't black before first run
    paintSky(ctx, W, H);
    paintGrid(ctx, W, H, reduceMotion ? 0 : (now / 1000) * 0.1, reduceMotion);
    return;
  }
  ctx.save();
  if (g.shake > 0) {
    const s = g.shake * 10;
    ctx.translate(rand(-s, s, now), rand(-s, s, now + 1));
  }

  paintSky(ctx, g.W, g.H);
  paintSun(ctx, g.W, g.H);
  paintStars(ctx, g, reduceMotion);
  paintGrid(ctx, g.W, g.H, g.gridPhase, reduceMotion);

  // obstacles — neon ruin pillars
  for (const o of g.obstacles) {
    paintPillar(ctx, o.x, 0, o.w, o.gapY - o.gapH / 2, g, false);
    paintPillar(ctx, o.x, o.gapY + o.gapH / 2, o.w, g.H - (o.gapY + o.gapH / 2), g, true);
  }

  // particles (additive glow)
  ctx.globalCompositeOperation = 'lighter';
  for (const p of g.particles) {
    const a = Math.max(0, p.life / p.max);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  if (g.phase === 'playing') paintShip(ctx, g.ship);

  // HUD score (on-canvas so React doesn't re-render per frame)
  if (g.phase === 'playing') {
    ctx.font = '700 28px "Inter Variable", Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = C.white;
    ctx.shadowColor = C.cyanGlow;
    ctx.shadowBlur = 16;
    ctx.fillText(String(g.score), g.W / 2, 52);
    ctx.shadowBlur = 0;
    ctx.textAlign = 'start';
  }

  ctx.restore();
  paintScanlines(ctx, W, H);
}

function paintSky(ctx, W, H) {
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, C.skyTop);
  sky.addColorStop(0.55, C.skyMid);
  sky.addColorStop(0.72, C.skyHot);
  sky.addColorStop(0.74, '#1a0930');
  sky.addColorStop(1, '#0a041c');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
}

function paintSun(ctx, W, H) {
  const cx = W / 2;
  const cy = H * 0.7;
  const r = Math.min(W, H) * 0.22;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  const sun = ctx.createLinearGradient(0, cy - r, 0, cy + r);
  sun.addColorStop(0, C.sun1);
  sun.addColorStop(1, C.sun2);
  ctx.fillStyle = sun;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  // classic synthwave scan bands across the lower half of the sun
  ctx.fillStyle = '#1a0930';
  for (let i = 0; i < 7; i++) {
    const by = cy + (i * i) * 1.6;
    ctx.fillRect(cx - r, by, r * 2, Math.max(2, 3 + i));
  }
  ctx.restore();
  // soft bloom
  ctx.globalCompositeOperation = 'lighter';
  const halo = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.8);
  halo.addColorStop(0, 'rgba(255,95,109,0.35)');
  halo.addColorStop(1, 'rgba(255,95,109,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
}

function paintStars(ctx, g, reduceMotion) {
  ctx.fillStyle = C.white;
  const drift = reduceMotion ? 0 : g.t * 6; // freeze parallax under reduced-motion
  for (const s of g.stars) {
    const x = (s.x * g.W - drift * s.z) % g.W;
    const px = x < 0 ? x + g.W : x;
    ctx.globalAlpha = 0.25 + s.z * 0.5;
    ctx.fillRect(px, s.y * g.H, s.z * 1.6, s.z * 1.6);
  }
  ctx.globalAlpha = 1;
}

function paintGrid(ctx, W, H, phase, reduceMotion) {
  const horizon = H * 0.74;
  const vp = W / 2;
  ctx.save();
  ctx.strokeStyle = C.grid;
  ctx.shadowColor = C.pinkGlow;
  ctx.shadowBlur = reduceMotion ? 0 : 8;
  ctx.lineWidth = 1;
  // receding horizontal lines (perspective): density increases toward horizon
  const rows = 14;
  for (let i = 0; i < rows; i++) {
    let f = (i + phase) / rows; // 0..1 toward viewer
    const y = horizon + (H - horizon) * f * f;
    ctx.globalAlpha = 0.15 + f * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  // converging vertical lines to the vanishing point
  ctx.globalAlpha = 0.5;
  for (let i = -10; i <= 10; i++) {
    const xBottom = vp + i * (W / 9);
    ctx.beginPath();
    ctx.moveTo(vp + i * 6, horizon);
    ctx.lineTo(xBottom, H);
    ctx.stroke();
  }
  ctx.restore();
}

function paintPillar(ctx, x, y, w, h, g, flip) {
  if (h <= 0) return;
  ctx.save();
  const grad = ctx.createLinearGradient(x, 0, x + w, 0);
  grad.addColorStop(0, 'rgba(122,27,107,0.25)');
  grad.addColorStop(0.5, 'rgba(255,45,149,0.42)');
  grad.addColorStop(1, 'rgba(122,27,107,0.25)');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);
  // glowing edge along the gap-facing side
  ctx.strokeStyle = C.cyan;
  ctx.shadowColor = C.cyanGlow;
  ctx.shadowBlur = 14;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, flip ? y : y + h);
  ctx.lineTo(x + w, flip ? y : y + h);
  ctx.stroke();
  // bright outline
  ctx.shadowBlur = 6;
  ctx.strokeStyle = 'rgba(255,45,149,0.8)';
  ctx.strokeRect(x + 0.5, y, w - 1, h);
  ctx.restore();
}

function paintShip(ctx, ship) {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.tilt);
  // glow
  ctx.shadowColor = C.cyanGlow;
  ctx.shadowBlur = 18;
  // hull — a sleek chevron pointing right
  ctx.beginPath();
  ctx.moveTo(16, 0);
  ctx.lineTo(-12, -10);
  ctx.lineTo(-6, 0);
  ctx.lineTo(-12, 10);
  ctx.closePath();
  const hull = ctx.createLinearGradient(-12, 0, 16, 0);
  hull.addColorStop(0, C.pink);
  hull.addColorStop(1, C.cyan);
  ctx.fillStyle = hull;
  ctx.fill();
  // cockpit spark
  ctx.shadowBlur = 0;
  ctx.fillStyle = C.white;
  ctx.beginPath();
  ctx.arc(2, 0, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintScanlines(ctx, W, H) {
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#000';
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
  ctx.restore();
}

/* ── helpers ─────────────────────────────────────────────────────────── */
function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}
function circleRect(cx, cy, r, rect) {
  const nx = clamp(cx, rect.x, rect.x + rect.w);
  const ny = clamp(cy, rect.y, rect.y + rect.h);
  const dx = cx - nx;
  const dy = cy - ny;
  return dx * dx + dy * dy <= r * r;
}
// deterministic-ish jitter (avoids Math.random bans elsewhere; here it's fine,
// but a seeded form keeps bursts varied without a global RNG dependency)
function rand(min, max, seed) {
  const s = Math.sin((seed || 0) * 999.7 + min * 12.9 + max * 78.2) * 43758.5;
  const f = s - Math.floor(s);
  return min + (max - min) * f;
}
