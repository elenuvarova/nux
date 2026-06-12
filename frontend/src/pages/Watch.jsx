import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NotFound from './NotFound.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { loadYouTube } from '../lib/youtube.js';
import { byId } from '../data/catalog.js';
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

/* NUX player — the Figma player anatomy in code: full-bleed stage,
   top scrim with back + title, bottom transport with an amber scrubber.
   YouTube is only the video engine (controls=0, driven via IFrame API). */
export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const film = byId(id);
  const trailer = film ? TRAILERS[film.id] : null;
  usePageTitle(film ? `Watch ${film.title}` : 'Watch');

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [idle, setIdle] = useState(false);

  const hostRef = useRef(null);
  const stageRef = useRef(null);
  const playerRef = useRef(null);
  const idleTimer = useRef(null);
  const seeking = useRef(false);

  const wake = useCallback(() => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 3000);
  }, []);

  // create the engine when playback starts
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
            setDuration(e.target.getDuration() || 0);
            wake();
          },
          onStateChange: (e) => {
            const S = window.YT.PlayerState;
            setPlaying(e.data === S.PLAYING);
            if (e.data === S.ENDED) {
              setEnded(true);
              setIdle(false);
            } else if (e.data === S.PLAYING) {
              setEnded(false);
              setDuration((d) => d || e.target.getDuration() || 0);
            }
          },
        },
      });
      poll = setInterval(() => {
        const p = playerRef.current;
        if (p?.getCurrentTime && !seeking.current) {
          setCurrent(p.getCurrentTime() || 0);
          if (!duration && p.getDuration) setDuration(p.getDuration() || 0);
        }
      }, 250);
    });
    return () => {
      disposed = true;
      clearInterval(poll);
      clearTimeout(idleTimer.current);
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, trailer?.yt]);

  if (!film) return <NotFound message="We couldn't find that title in the catalog." />;

  const art = film.backdrop || film.poster;

  const toggle = () => {
    const p = playerRef.current;
    if (!p) return;
    if (ended) {
      p.seekTo(0, true);
      p.playVideo();
      setEnded(false);
    } else if (playing) p.pauseVideo();
    else p.playVideo();
    wake();
  };
  const skip = (delta) => {
    const p = playerRef.current;
    if (!p?.getCurrentTime) return;
    p.seekTo(Math.max(0, Math.min(duration, p.getCurrentTime() + delta)), true);
    wake();
  };
  const onSeek = (e) => {
    const v = Number(e.target.value);
    setCurrent(v);
    playerRef.current?.seekTo?.(v, true);
    wake();
  };
  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) p.unMute();
    else p.mute();
    setMuted(!muted);
    wake();
  };
  const goFullscreen = () => {
    const el = stageRef.current;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el?.requestFullscreen?.();
    wake();
  };

  const progress = duration ? (current / duration) * 100 : 0;

  return (
    <main
      className={`player ${started && playing && idle ? 'player--idle' : ''}`}
      ref={stageRef}
      onPointerMove={wake}
      onTouchStart={wake}
    >
      {!started ? (
        trailer ? (
          <button type="button" className="player-facade" onClick={() => setStarted(true)}>
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
              <p>We couldn't license a trailer for this title yet.</p>
              <Link to={`/film/${film.id}`} className="btn btn-secondary">
                Back to film page
              </Link>
            </div>
          </div>
        )
      ) : (
        <div className="player-video" onClick={toggle}>
          <div ref={hostRef} />
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
          <p className="player-title">{film.title}</p>
          <p className="metadata">
            Trailer · {film.year}
            {film.runtime ? ` · Full film ${film.runtime}` : ''}
          </p>
        </div>
      </div>

      {/* bottom transport */}
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
              onChange={onSeek}
              onPointerDown={() => (seeking.current = true)}
              onPointerUp={() => (seeking.current = false)}
              aria-label="Seek"
              style={{ '--fill': `${progress}%` }}
            />
            <span className="metadata player-time">{fmt(duration)}</span>
          </div>
          <div className="player-controls">
            <button type="button" className="player-iconbtn" onClick={() => skip(-10)} aria-label="Back 10 seconds">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 3.5A6.5 6.5 0 1 1 3.5 10" />
                <path d="M6.5 1.5 3.5 4l3 2.5" />
                <text x="7" y="14" fontSize="6.5" fill="currentColor" stroke="none" fontFamily="inherit">10</text>
              </svg>
            </button>
            <button type="button" className="player-iconbtn player-playbtn" onClick={toggle} aria-label={ended ? 'Replay' : playing ? 'Pause' : 'Play'}>
              {ended ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3.5 8a6.5 6.5 0 1 1 1 5" />
                  <path d="M3.5 4v4h4" />
                </svg>
              ) : playing ? (
                <svg width="18" height="18" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                  <rect x="2.5" y="1.8" width="3.2" height="10.4" rx="0.8" />
                  <rect x="8.3" y="1.8" width="3.2" height="10.4" rx="0.8" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                  <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
                </svg>
              )}
            </button>
            <button type="button" className="player-iconbtn" onClick={() => skip(10)} aria-label="Forward 10 seconds">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 3.5A6.5 6.5 0 1 0 16.5 10" />
                <path d="M13.5 1.5 16.5 4l-3 2.5" />
                <text x="7" y="14" fontSize="6.5" fill="currentColor" stroke="none" fontFamily="inherit">10</text>
              </svg>
            </button>
            <span className="player-spacer" />
            <button type="button" className="player-iconbtn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted ? (
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
