import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Reveal from '../components/Reveal.jsx';
import { SkeletonRail } from '../components/Skeleton.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { useWatchHistory } from '../lib/useWatchHistory.js';
import Rail, { PosterCard, ContinueCard } from '../components/Rail.jsx';
import { RAILS, EDITORIAL_PICK, GENRES, GENRE_MATCH, FILMS } from '../data/catalog.js';
import { useCollections } from '../lib/useCollections.js';
import Tour from '../components/Tour.jsx';
import './Home.css';

// Personalized rails from the onboarding genre picks (Welcome) — one "Because you
// like…" rail per picked genre the catalog can fill (≥3 films), capped at 3 so the
// homepage stays scannable. Makes the taste step visibly real for every pick.
function readPersonalRails() {
  try {
    const prefs = JSON.parse(localStorage.getItem('nux-genre-prefs') || '[]');
    if (!Array.isArray(prefs)) return [];
    const rails = [];
    for (const gid of prefs) {
      const labels = GENRE_MATCH[gid];
      const genre = GENRES.find((g) => g.id === gid);
      if (!labels?.length || !genre) continue;
      const ids = FILMS.filter((f) => labels.includes(f.genre)).map((f) => f.id);
      if (ids.length >= 3) rails.push({ gid, label: genre.label, ids });
    }
    return rails.slice(0, 3);
  } catch {
    return [];
  }
}

export default function Home() {
  usePageTitle(null);
  const [trending, curated, fresh] = RAILS;
  const [personalRails] = useState(readPersonalRails);
  const { history } = useWatchHistory();
  const { collections, loading: collectionsLoading, error: collectionsError } = useCollections();
  // First-run welcome tour — shown once. A short delay lets the hero + rails lay
  // out so the coachmark can measure its targets; it does NOT gate content
  // (the catalog is synchronous, so the page renders immediately — no LCP delay).
  const [showTour, setShowTour] = useState(false);
  useEffect(() => {
    let t;
    try {
      if (!localStorage.getItem('nux_tour_v1')) t = setTimeout(() => setShowTour(true), 350);
    } catch {
      /* private mode — just skip the tour */
    }
    return () => clearTimeout(t);
  }, []);

  return (
    <main>
      <Hero />
      <div className="home-rails">
        {personalRails.map((p) => (
          <Reveal key={p.gid}>
            <Rail title={`Because you like ${p.label}`} seeAllTo={`/genre/${p.gid}`}>
              {p.ids.map((id) => (
                <PosterCard key={id} filmId={id} />
              ))}
            </Rail>
          </Reveal>
        ))}
        <Reveal>
          <Rail title={trending.title}>
            {trending.filmIds.map((id) => (
              <PosterCard key={id} filmId={id} />
            ))}
          </Rail>
        </Reveal>
        {history.length > 0 && (
          <Reveal>
            <Rail title="Continue Watching" wide>
              {history.map((h) => (
                <ContinueCard key={h.id} item={{ filmId: h.id, frac: h.frac }} />
              ))}
            </Rail>
          </Reveal>
        )}
        <Reveal>
          <Rail title={curated.title}>
            {curated.filmIds.map((id) => (
              <PosterCard key={id} filmId={id} />
            ))}
          </Rail>
        </Reveal>
        <Reveal>
          <Rail title={fresh.title}>
            {fresh.filmIds.map((id) => (
              <PosterCard key={id} filmId={id} />
            ))}
          </Rail>
        </Reveal>

        <Reveal as="section" className="editorial" aria-label={EDITORIAL_PICK.title}>
          <div className="editorial-col">
            <p className="eyebrow">{EDITORIAL_PICK.eyebrow}</p>
            <h2 className="display-l">{EDITORIAL_PICK.title}</h2>
            <p className="editorial-dek">{EDITORIAL_PICK.dek}</p>
            <Link to={`/collection/${EDITORIAL_PICK.slug}`} className="btn btn-secondary editorial-cta">
              {EDITORIAL_PICK.cta}
            </Link>
          </div>
          <div className="editorial-cover">
            <img src={EDITORIAL_PICK.image} alt="" loading="lazy" />
          </div>
        </Reveal>

        {/* Generated collections load after the static rails. Hold their place
            with skeletons so they don't pop in (layout shift); degrade quietly
            on error with a subtle, non-blocking note. */}
        {collectionsLoading ? (
          <>
            <SkeletonRail />
            <SkeletonRail />
          </>
        ) : collectionsError ? (
          <p className="home-rails-note" role="status">
            We couldn’t load more collections right now.
          </p>
        ) : (
          collections.map((c) => (
            <Reveal key={c.slug}>
              <Rail title={c.title} seeAllTo={`/collection/${c.slug}`}>
                {c.entries.map(([id]) => (
                  <PosterCard key={id} filmId={id} />
                ))}
              </Rail>
            </Reveal>
          ))
        )}
      </div>
      {showTour && <Tour onClose={() => setShowTour(false)} />}
    </main>
  );
}
