import { memo, useContext, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link, useNavigate, useViewTransitionState, UNSAFE_DataRouterStateContext } from 'react-router-dom';
import { byId } from '../data/catalog.js';
import { useTilt } from '../lib/useTilt.js';
import './Rail.css';

/* Poster → film page morph: the clicked card and the detail hero share the
   view-transition-name `film-poster`. Names must be unique per capture or the
   browser skips the whole transition (same film in two rails, or the outgoing
   detail hero on a FilmDetail → FilmDetail hop), so a card claims the name on
   click and every other holder is released first. */
let claimedCard = null;

/* Release everything that may hold a morph name right now: imperative marks
   from earlier clicks, and the detail heroes — their name comes from a
   stylesheet (FilmDetail.css) or an inline prop (TitleDetail), so only an
   inline `none` reliably overrides it. */
function releaseMorphNames() {
  document.querySelectorAll('[data-vt]').forEach((el) => {
    el.style.viewTransitionName = '';
    delete el.dataset.vt;
  });
  document.querySelectorAll('.fd-art img, .fd-poster-frame img').forEach((el) => {
    el.style.viewTransitionName = 'none';
  });
}

/* Mark the artwork inside `scope` as the shared element for the → /watch
   transition (play glyph, Continue Watching). The poster → film page morph
   is handled by the claim in PosterCard instead. */
function markHeroArtIn(scope) {
  releaseMorphNames();
  const img = scope?.querySelector('img');
  if (img) {
    img.style.viewTransitionName = 'hero-art';
    img.dataset.vt = 'hero-art';
  }
}

function markHeroArt(e) {
  markHeroArtIn(e.currentTarget);
}

function minutesLabel(min) {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h}h ${m}m left` : `${h}h left`;
  }
  return `${min}m left`;
}

export const PosterCard = memo(function PosterCard({ filmId, note, describedBy }) {
  const film = byId(filmId);
  const tilt = useTilt();
  const navigate = useNavigate();
  const href = `/film/${filmId}`;
  // Data-router presence is static for the app's lifetime, so the conditional
  // hook call is safe — the pattern react-router's own NavLink uses. Under the
  // declarative <BrowserRouter> the hook would throw, and the router never
  // starts a view transition itself: beginMorph drives one by hand instead.
  const dataRouter = useContext(UNSAFE_DataRouterStateContext) != null;
  const claim = useRef(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const morphing = dataRouter && useViewTransitionState(href) && claimedCard === claim;
  // Crossfade preview still (Apple TV pattern) mounts on first hover/focus, not
  // up front — a 70-poster grid must not fetch 70 landscape stills on load.
  // Once mounted it stays, so re-hovers crossfade from cache.
  const [stillMounted, setStillMounted] = useState(false);
  if (!film) return null;
  const still = film.backdrop2 || film.backdrop;
  const mountStill = still && !stillMounted ? () => setStillMounted(true) : undefined;
  // Play glyph jumps straight to the player; a click anywhere else on the card
  // opens the film page. The button is a SIBLING of the link (a button nested
  // in an <a> is invalid), so no propagation guards are needed.
  function playNow(e) {
    markHeroArtIn(e.currentTarget.closest('.poster-card')?.querySelector('.poster-card-art'));
    navigate(`/watch/${film.id}`, { viewTransition: true });
  }
  // Claim the morph and, without a data router, drive the transition by hand:
  // capture, then commit the new page synchronously so the second capture sees
  // it. Modified clicks (new tab etc.) fall through to the Link untouched.
  function beginMorph(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    claimedCard = claim;
    releaseMorphNames();
    if (dataRouter || !document.startViewTransition) return;
    e.preventDefault();
    const img = e.currentTarget.querySelector('.poster-card-art img');
    if (img) {
      img.style.viewTransitionName = 'film-poster';
      img.dataset.vt = 'film-poster';
    }
    document.startViewTransition(() => {
      flushSync(() => navigate(href));
      // capture the new page at the top — RouteReset's own scroll runs later
      window.scrollTo(0, 0);
    });
  }
  return (
    <div className="poster-card">
      {/* alt="" — the adjacent title/meta text inside the link already names it;
          an alt would make AT read the title twice per card */}
      <Link to={href} className="poster-card-link" viewTransition onClick={beginMorph} onMouseEnter={mountStill} onFocus={mountStill} aria-describedby={describedBy}>
        <div className="poster-card-art" ref={tilt.ref} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>
          <img src={film.poster} alt="" loading="lazy" width="200" height="300" style={morphing ? { viewTransitionName: 'film-poster' } : undefined} />
          {/* keep the still AFTER the poster img: the morph handlers pick the
              first <img> in the art frame as the shared element */}
          {stillMounted && <img className="poster-card-still" src={still} alt="" aria-hidden="true" />}
          <span className="poster-card-badge">{film.type === 'FILM' ? film.genre : film.type}</span>
          <span className="poster-card-sheen" aria-hidden="true" />
        </div>
        <p className="poster-card-title">{film.title}</p>
        {/* two spans so the director ellipsizes while the year · runtime tail
            never truncates (long names ate the year); nbsp keeps the separator
            spacing — bare whitespace between flex items doesn't render */}
        <p className="poster-card-meta">
          <span className="poster-card-meta-director">{film.director}</span>
          <span className="poster-card-meta-tail">&nbsp;· {film.year} · {film.runtime}</span>
        </p>
        {note && <p className="poster-card-note">{note}</p>}
      </Link>
      {/* AFTER the link in DOM order (Tab: card, then play) and OUTSIDE it —
          positioned over the art by CSS */}
      <button type="button" className="poster-card-play" onClick={playNow} aria-label={`Play ${film.title}`}>
        <svg width="16" height="16" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
        </svg>
      </button>
    </div>
  );
});

export function ContinueCard({ item }) {
  const film = byId(item.filmId);
  if (!film) return null;
  const total = film.runtimeMin || 120;
  // history entries carry { filmId, frac }; default low if frac is ever absent
  const frac = typeof item.frac === 'number' ? item.frac : 0;
  const progress = Math.min(96, Math.max(4, Math.round(frac * 100)));
  const minutesLeft = Math.max(1, Math.round(total * (1 - frac)));
  const art = film.backdrop || film.poster;
  return (
    <Link to={`/watch/${film.id}`} className="continue-card" viewTransition onClick={markHeroArt}>
      <div className="continue-card-art">
        <img src={art} alt={`${film.title}, ${film.type}`} loading="lazy" width="320" height="180" />
        <span className="continue-card-play" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" />
          </svg>
        </span>
        <span className="continue-card-progress" style={{ '--progress': `${progress}%` }} />
      </div>
      <p className="poster-card-title">{film.title}</p>
      <p className="metadata">{minutesLabel(minutesLeft)}</p>
    </Link>
  );
}

export default function Rail({ title, wide = false, seeAllTo = null, children }) {
  return (
    <section className="rail">
      <header className="rail-header">
        <h2 className="headline">{title}</h2>
        {/* "See all" appears when the rail has a broader destination (seeAllTo):
            selection rails → the full catalogue, "Because you like" rails → their
            genre page. Personal rails (e.g. Continue Watching) have none. */}
        {seeAllTo && (
          <Link to={seeAllTo} className="rail-seeall link-arrow">
            See all <span aria-hidden="true">→</span>
          </Link>
        )}
      </header>
      <div className={wide ? 'rail-scroll rail-scroll--wide' : 'rail-scroll'} role="group" aria-label={title}>
        {children}
      </div>
    </section>
  );
}
