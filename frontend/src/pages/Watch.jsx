import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NotFound from './NotFound.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { loadYouTube } from '../lib/youtube.js';
import { useWatchHistory } from '../lib/useWatchHistory.js';
import { anyTitleById } from '../data/catalog.js';
import { TRAILERS } from '../data/trailers.js';
import './Watch.css';

function fmt(sec) {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const s = Math.floor(sec % 60);
  const m = Math.floor((sec / 60) % 60);
  const h = Math.floor(sec / 3600);
  const mm = h ? String(m).padStart(2, '0') : String(m);
  return `${h ? h + ':' : ''}${mm}:${String(s).padStart(2, '0')}`;
}

const IconPlay = () => (
  <svg width="18" height="18" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
  </svg>
);
const IconPause = () => (
  <svg width="18" height="18" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <rect x="2.5" y="1.8" width="3.2" height="10.4" rx="0.8" />
    <rect x="8.3" y="1.8" width="3.2" height="10.4" rx="0.8" />
  </svg>
);
const IconReplay = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16.5 10a6.5 6.5 0 1 1-1.9-4.6" />
    <path d="M16.5 2.5V6h-3.5" />
  </svg>
);
const IconCaptions = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="4.5" width="16" height="11" rx="2.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 9.2a1.8 1.8 0 0 0-3 1.3 1.8 1.8 0 0 0 3 1.3M14.5 9.2a1.8 1.8 0 0 0-3 1.3 1.8 1.8 0 0 0 3 1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IconGear = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8.5 6.5 12 13 4.5" />
  </svg>
);
const IconChevR = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 3l4.5 4L5 11" />
  </svg>
);
const IconSkip = ({ forward }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path
      d={forward ? 'M11 4.2a6.8 6.8 0 1 0 6.8 6.8' : 'M11 4.2a6.8 6.8 0 1 1-6.8 6.8'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d={forward ? 'M14.6 1.6 17.8 4.2l-3.2 2.6' : 'M7.4 1.6 4.2 4.2l3.2 2.6'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text x="11" y="13.6" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" stroke="none" fontFamily="Inter, sans-serif">
      10
    </text>
  </svg>
);

/* NUX player — Figma player anatomy in code. YouTube is only the engine:
   controls=0 behind pointer-events:none; paused state is covered by our
   own scrim so YT chrome (title, related, logo) never shows. */
export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const film = anyTitleById(id);
  const trailer = film ? TRAILERS[film.id] : null;
  usePageTitle(film ? `Watch ${film.title}` : 'Watch');
  const { record } = useWatchHistory();

  const [started, setStarted] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [everPlayed, setEverPlayed] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(() => {
    const v = Number(localStorage.getItem('nux-volume'));
    return Number.isFinite(v) && v > 0 && v <= 100 ? v : 80;
  });
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [idle, setIdle] = useState(false);
  const [rate, setRate] = useState(1);
  const [rates, setRates] = useState([0.5, 0.75, 1, 1.25, 1.5, 2]);
  const [captions, setCaptions] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [qualities, setQualities] = useState([]);
  const [menu, setMenu] = useState(null); // null | 'settings' | 'speed' | 'quality'

  const hostRef = useRef(null);
  const stageRef = useRef(null);
  const playerRef = useRef(null);
  const idleTimer = useRef(null);
  const seeking = useRef(false);
  const clickTimer = useRef(null);
  const bufferTimer = useRef(null);
  const progressRef = useRef(0);
  // monotonic-ish timestamp without Date.now (avoids the sandbox restriction
  // in build tooling; performance.timeOrigin + now is fine at runtime)
  const stamp = () => Math.round(performance.timeOrigin + performance.now());

  const wake = useCallback(() => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 3000);
  }, []);

  // engine
  useEffect(() => {
    if (!started || !trailer) return undefined;
    let disposed = false;
    let poll;
    loadYouTube().then((YT) => {
      if (disposed) return;
      playerRef.current = new YT.Player(hostRef.current, {
        videoId: trailer.yt,
        playerVars: { autoplay: 1, controls: 0, rel: 0, playsinline: 1, iv_load_policy: 3, disablekb: 1 },
        events: {
          onReady: (e) => {
            e.target.setVolume(volume);
            setDuration(e.target.getDuration() || 0);
            const avail = e.target.getAvailablePlaybackRates?.();
            if (avail?.length) setRates(avail.filter((r) => r >= 0.5 && r <= 2));
            wake();
          },
          onStateChange: (e) => {
            const S = window.YT.PlayerState;
            setPlaying(e.data === S.PLAYING);
            // delay the spinner ~400ms so micro-stalls don't flicker it
            clearTimeout(bufferTimer.current);
            if (e.data === S.BUFFERING) {
              bufferTimer.current = setTimeout(() => setBuffering(true), 400);
            } else {
              setBuffering(false);
            }
            if (e.data === S.PLAYING) {
              setEverPlayed(true);
              setEnded(false);
              setDuration((d) => d || e.target.getDuration() || 0);
              const q = e.target.getAvailableQualityLevels?.() || [];
              if (q.length) setQualities(q);
            }
            if (e.data === S.ENDED) {
              setEnded(true);
              setIdle(false);
            }
          },
        },
      });
      poll = setInterval(() => {
        const p = playerRef.current;
        if (p?.getCurrentTime && !seeking.current) {
          const t = p.getCurrentTime() || 0;
          const d = p.getDuration?.() || duration;
          setCurrent(t);
          if (d) progressRef.current = t / d;
          if (!duration && d) setDuration(d);
          if (p.getVideoLoadedFraction) setBuffered(p.getVideoLoadedFraction() * 100);
        }
      }, 250);
    }).catch(() => {
      // YouTube engine failed to load (offline, blocked, timeout) — fall back
      if (!disposed) {
        setStarted(false);
        setLoadError(true);
      }
    });
    return () => {
      disposed = true;
      clearInterval(poll);
      clearTimeout(idleTimer.current);
      // remember this title in Continue Watching (real history)
      if (progressRef.current > 0.02 && film) record(film.id, progressRef.current, stamp());
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, trailer?.yt]);

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (ended) {
      p.seekTo(0, true);
      p.playVideo();
      setEnded(false);
    } else if (p.getPlayerState?.() === window.YT?.PlayerState.PLAYING) p.pauseVideo();
    else p.playVideo();
    wake();
  }, [ended, wake]);

  const skip = useCallback(
    (delta) => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      const next = Math.max(0, Math.min(duration || Infinity, p.getCurrentTime() + delta));
      p.seekTo(next, true);
      setCurrent(next);
      wake();
    },
    [duration, wake]
  );

  const applyVolume = useCallback(
    (v) => {
      const p = playerRef.current;
      setVolume(v);
      if (v > 0) localStorage.setItem('nux-volume', String(v));
      if (!p) return;
      p.setVolume(v);
      if (v === 0) {
        p.mute();
        setMuted(true);
      } else {
        p.unMute();
        setMuted(false);
      }
      wake();
    },
    [wake]
  );

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (muted || volume === 0) {
      const v = volume === 0 ? 60 : volume;
      p.setVolume(v);
      p.unMute();
      setVolume(v);
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
    wake();
  }, [muted, volume, wake]);

  const goFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else stageRef.current?.requestFullscreen?.();
    wake();
  }, [wake]);

  const applyRate = useCallback(
    (r) => {
      playerRef.current?.setPlaybackRate?.(r);
      setRate(r);
      wake();
    },
    [wake]
  );

  const applyQuality = useCallback(
    (q) => {
      if (q !== 'auto') playerRef.current?.setPlaybackQuality?.(q);
      setQuality(q);
      wake();
    },
    [wake]
  );

  const toggleCaptions = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (captions) {
      p.unloadModule?.('captions');
      p.unloadModule?.('cc');
    } else {
      p.loadModule?.('captions');
      p.loadModule?.('cc');
      p.setOption?.('captions', 'track', { languageCode: 'en' });
    }
    setCaptions(!captions);
    wake();
  }, [captions, wake]);

  // keyboard map (universal player conventions)
  useEffect(() => {
    if (!started) return undefined;
    const onKey = (e) => {
      if (e.target.matches('input, textarea, select')) return;
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          toggle();
          break;
        case 'arrowleft':
          e.preventDefault();
          skip(-5);
          break;
        case 'arrowright':
          e.preventDefault();
          skip(5);
          break;
        case 'j':
          skip(-10);
          break;
        case 'l':
          skip(10);
          break;
        case 'arrowup':
          e.preventDefault();
          applyVolume(Math.min(100, volume + 10));
          break;
        case 'arrowdown':
          e.preventDefault();
          applyVolume(Math.max(0, volume - 10));
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          goFullscreen();
          break;
        case 'c':
          toggleCaptions();
          break;
        case 'escape':
          if (menu) setMenu(null);
          break;
        case '>':
        case '.':
          applyRate(rates[Math.min(rates.length - 1, rates.indexOf(rate) + 1)] ?? rate);
          break;
        case '<':
        case ',':
          applyRate(rates[Math.max(0, rates.indexOf(rate) - 1)] ?? rate);
          break;
        default:
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [started, toggle, skip, applyVolume, toggleMute, goFullscreen, toggleCaptions, applyRate, menu, rate, rates, volume]);

  // close the settings popover on outside click
  useEffect(() => {
    if (!menu) return undefined;
    const onDown = (e) => {
      if (!e.target.closest('.player-settings')) setMenu(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [menu]);

  if (!film) return <NotFound message="We couldn't find that title in the catalog." />;

  const art = film.backdrop || film.poster;
  const progress = duration ? (current / duration) * 100 : 0;
  const covered = started && (!everPlayed || (!playing && !buffering));

  return (
    <main
      className={`player ${started && playing && idle && !menu ? 'player--idle' : ''}`}
      ref={stageRef}
      onPointerMove={wake}
      onTouchStart={wake}
      onKeyDownCapture={wake}
      onFocusCapture={wake}
    >
      {!started ? (
        trailer && !loadError ? (
          <button
            type="button"
            className="player-facade"
            onClick={() => {
              // don't spin up a player that can never load when offline
              if (!navigator.onLine) {
                setLoadError(true);
                return;
              }
              setLoadError(false);
              setStarted(true);
              wake();
            }}
          >
            <img src={art} alt="" />
            <span className="player-bigplay" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 14 14" fill="currentColor">
                <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
              </svg>
            </span>
            <span className="player-facade-cta">Play trailer</span>
          </button>
        ) : (
          <div className="player-facade player-facade--off">
            <img src={art} alt="" />
            <div className="player-missing">
              <p className="display-m">Trailer unavailable</p>
              <p>
                {loadError
                  ? "We couldn't load the player. Check your connection and try again."
                  : "We couldn't license a trailer for this title yet."}
              </p>
              <Link to={`/film/${film.id}`} className="btn btn-secondary">
                Back to film page
              </Link>
            </div>
          </div>
        )
      ) : (
        <div
          className="player-video"
          onClick={() => {
            // mobile convention: a tap that reveals hidden controls must not toggle
            if (window.matchMedia('(pointer: coarse)').matches && idle) {
              wake();
              return;
            }
            // debounce vs double-click so click+fullscreen never flicker
            clearTimeout(clickTimer.current);
            clickTimer.current = setTimeout(toggle, 250);
          }}
          onDoubleClick={() => {
            clearTimeout(clickTimer.current);
            goFullscreen();
          }}
        >
          <div ref={hostRef} />
          {/* our pause cover — hides YouTube's paused-state chrome entirely */}
          <div className={`player-cover ${covered ? 'player-cover--on' : ''}`} aria-hidden="true">
            <img src={art} alt="" />
          </div>
          {((!everPlayed && !loadError) || (buffering && !covered)) && (
            <span className="player-spinner" aria-hidden="true" />
          )}
        </div>
      )}

      {/* top chrome */}
      <div className="player-top">
        <button type="button" className="player-iconbtn" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11.5 3.5 6 9l5.5 5.5" />
          </svg>
        </button>
        <div className="player-titles">
          <h1 className="player-title" tabIndex={-1}>
            {film.title}
          </h1>
          <p className="metadata">
            Trailer · {film.year}
            {film.runtime ? ` · Full film ${film.runtime}` : ''}
          </p>
        </div>
      </div>

      {/* center transport — the Figma player anatomy: skip / play / skip
          live in the middle of the screen, not the bottom bar */}
      {started && trailer && (
        <div className="player-center-transport">
          <button type="button" className="player-iconbtn player-skipbtn" onClick={() => skip(-10)} aria-label="Back 10 seconds">
            <IconSkip forward={false} />
          </button>
          <button
            type="button"
            className="player-iconbtn player-playbtn"
            onClick={toggle}
            aria-label={ended ? 'Replay' : playing ? 'Pause' : 'Play'}
          >
            {ended ? <IconReplay /> : playing ? <IconPause /> : <IconPlay />}
          </button>
          <button type="button" className="player-iconbtn player-skipbtn" onClick={() => skip(10)} aria-label="Forward 10 seconds">
            <IconSkip forward />
          </button>
        </div>
      )}

      {/* bottom bar — scrubber + secondary controls only */}
      {started && trailer && (
        <div className="player-transport">
          <div className="player-scrub">
            <span className="metadata player-time">{fmt(current)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(current, duration || 0)}
              onChange={(e) => {
                const v = Number(e.target.value);
                setCurrent(v);
                playerRef.current?.seekTo?.(v, true);
                wake();
              }}
              onPointerDown={() => (seeking.current = true)}
              onPointerUp={() => (seeking.current = false)}
              aria-label="Seek"
              aria-valuetext={`${fmt(current)} of ${fmt(duration)}`}
              style={{ '--fill': `${progress}%`, '--buffered': `${Math.max(buffered, progress)}%` }}
            />
            <span className="metadata player-time">{fmt(duration)}</span>
          </div>
          <div className="player-controls">
            <div className="player-volume">
              <button type="button" className="player-iconbtn" onClick={toggleMute} aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}>
                {muted || volume === 0 ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2.5 7v4h3l4 3.5v-11L5.5 7h-3z" fill="currentColor" stroke="none" />
                    <path d="M12.5 6.5l4 5M16.5 6.5l-4 5" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M2.5 7v4h3l4 3.5v-11L5.5 7h-3z" fill="currentColor" stroke="none" />
                    <path d="M12.5 6.5a3.5 3.5 0 0 1 0 5M14.5 4.5a6.3 6.3 0 0 1 0 9" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                className="player-volume-slider"
                min="0"
                max="100"
                step="1"
                value={muted ? 0 : volume}
                onChange={(e) => applyVolume(Number(e.target.value))}
                aria-label="Volume"
                style={{ '--fill': `${muted ? 0 : volume}%` }}
              />
            </div>
            <span className="player-spacer" />

            <button
              type="button"
              className={`player-iconbtn ${captions ? 'player-iconbtn--on' : ''}`}
              onClick={toggleCaptions}
              aria-pressed={captions}
              aria-label="Subtitles"
            >
              <IconCaptions />
            </button>

            <div className="player-settings">
              <button
                type="button"
                className={`player-iconbtn ${menu ? 'player-iconbtn--on' : ''}`}
                onClick={() => setMenu(menu ? null : 'settings')}
                aria-haspopup="menu"
                aria-expanded={!!menu}
                aria-label="Settings"
              >
                <IconGear />
              </button>

              {menu === 'settings' && (
                <div className="player-menu" role="menu">
                  <button type="button" className="player-menu-row" role="menuitem" onClick={() => setMenu('speed')}>
                    <span>Playback speed</span>
                    <span className="player-menu-value">
                      {rate === 1 ? 'Normal' : `${rate}×`}
                      <IconChevR />
                    </span>
                  </button>
                  {qualities.length > 0 && (
                    <button type="button" className="player-menu-row" role="menuitem" onClick={() => setMenu('quality')}>
                      <span>Quality</span>
                      <span className="player-menu-value">
                        {quality === 'auto' ? 'Auto' : quality}
                        <IconChevR />
                      </span>
                    </button>
                  )}
                  <button type="button" className="player-menu-row" role="menuitemcheckbox" aria-checked={captions} onClick={toggleCaptions}>
                    <span>Subtitles</span>
                    <span className="player-menu-value">{captions ? 'On' : 'Off'}</span>
                  </button>
                </div>
              )}

              {menu === 'speed' && (
                <div className="player-menu" role="menu">
                  <button type="button" className="player-menu-head" onClick={() => setMenu('settings')}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 3 4.5 7 9 11" />
                    </svg>
                    Playback speed
                  </button>
                  {rates.map((r) => (
                    <button
                      key={r}
                      type="button"
                      className="player-menu-row"
                      role="menuitemradio"
                      aria-checked={rate === r}
                      onClick={() => applyRate(r)}
                    >
                      <span className="player-menu-check">{rate === r && <IconCheck />}</span>
                      {r === 1 ? 'Normal' : `${r}×`}
                    </button>
                  ))}
                </div>
              )}

              {menu === 'quality' && (
                <div className="player-menu" role="menu">
                  <button type="button" className="player-menu-head" onClick={() => setMenu('settings')}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 3 4.5 7 9 11" />
                    </svg>
                    Quality
                  </button>
                  {['auto', ...qualities.filter((q) => q !== 'auto')].map((q) => (
                    <button
                      key={q}
                      type="button"
                      className="player-menu-row"
                      role="menuitemradio"
                      aria-checked={quality === q}
                      onClick={() => applyQuality(q)}
                    >
                      <span className="player-menu-check">{quality === q && <IconCheck />}</span>
                      {q === 'auto' ? 'Auto' : q.replace('hd', '').replace('large', '480p').replace('medium', '360p').replace('small', '240p')}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button type="button" className="player-iconbtn" onClick={goFullscreen} aria-label="Fullscreen">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 2.5H2.5V7M11 2.5h4.5V7M7 15.5H2.5V11M11 15.5h4.5V11" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
