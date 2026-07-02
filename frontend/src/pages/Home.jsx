import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Slate from '../components/Slate.jsx';
import Reveal from '../components/Reveal.jsx';
import { SkeletonRail } from '../components/Skeleton.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { readGenrePrefs } from '../lib/prefs.js';
import { useWatchHistory } from '../lib/useWatchHistory.js';
import Rail, { PosterCard, ContinueCard } from '../components/Rail.jsx';
import { RAILS, EDITORIAL_PICK, REASONS, GENRES, GENRE_MATCH, FILMS, COLLECTIONS, byId } from '../data/catalog.js';
import { useCollections } from '../lib/useCollections.js';
import { toast } from '../lib/toast.js';
import Tour from '../components/Tour.jsx';
import './Home.css';

// Personalized rails from the onboarding genre picks (Welcome) — one "Because you
// like…" rail per picked genre the catalog can fill (≥3 films), capped at 3 so the
// homepage stays scannable. Makes the taste step visibly real for every pick.
function readPersonalRails() {
  try {
    const prefs = readGenrePrefs();
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
  // Cross-rail de-duplication: the same title appearing in three rails within one
  // viewport read like a broken recommender on a curation-first product. Walk the
  // rails in display order and drop any film already shown — but never gut a rail
  // below `min` (fall back to its full list so no rail goes sparse/empty).
  // Show each title once across the page so the same poster doesn't repeat in
  // three rails (which read like a broken recommender on a curation-first home).
  const seen = new Set();
  // Personal rails first: dedupe NON-destructively and only commit a rail's ids
  // to `seen` once it survives the >=3 filter — otherwise a dropped rail's films
  // would be marked seen and then vanish from the static rails below too.
  const personalRailsD = [];
  for (const p of personalRails) {
    const ids = p.ids.filter((id) => !seen.has(id));
    if (ids.length >= 3) {
      ids.forEach((id) => seen.add(id));
      personalRailsD.push({ ...p, ids });
    }
  }
  // Static rails are never dropped, so commit eagerly; only fall back to the full
  // list if dedupe would empty a rail (a short all-unique rail beats a repeating one).
  const take = (ids) => {
    const fresh = ids.filter((id) => !seen.has(id));
    const out = fresh.length > 0 ? fresh : ids;
    out.forEach((id) => seen.add(id));
    return out;
  };
  const trendingIds = take(trending.filmIds);
  const curatedIds = take(curated.filmIds);
  const freshIds = take(fresh.filmIds);
  // Essential-Ten promo: a stack of the first three real covers reads as "a
  // collection worth opening" — replaces the abstract genre-flare placeholder.
  const essentialCovers = (COLLECTIONS[EDITORIAL_PICK.slug]?.entries || [])
    .slice(0, 3)
    .map(([id]) => byId(id))
    .filter(Boolean);
  const { history } = useWatchHistory();
  const { collections, loading: collectionsLoading, error: collectionsError } = useCollections();
  // First-run, post-onboarding moment (research: one contextual "aha" beats an
  // upfront tour). Fires ONCE, only right after Welcome completes: a toast that
  // confirms the feed was tuned to the user's picks (closing the taste loop),
  // then a single coachmark on the Curator — NUX's one aha. The short delay lets
  // the hero + rails lay out so the coachmark can measure its target; it never
  // gates content (the catalog is synchronous — no LCP delay).
  const [showTour, setShowTour] = useState(false);
  useEffect(() => {
    let t;
    try {
      if (localStorage.getItem('nux-curator-hint')) {
        localStorage.removeItem('nux-curator-hint'); // one-shot
        const prefs = readGenrePrefs();
        const labels = prefs
          .map((id) => GENRES.find((g) => g.id === id)?.label)
          .filter(Boolean)
          .slice(0, 3);
        if (labels.length) {
          const text =
            labels.length === 1
              ? labels[0]
              : `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;
          toast(`Your feed’s tuned to ${text}`);
        }
        t = setTimeout(() => setShowTour(true), 350);
      }
    } catch {
      /* private mode — skip the first-run moment */
    }
    return () => clearTimeout(t);
  }, []);

  return (
    <main>
      <Hero />
      <Reveal as="header" className="home-lead">
        <Slate n="—" label="Tonight" />
        <h2 className="section-title home-section-title">What we’re showing</h2>
      </Reveal>
      <div className="home-rails">
        {personalRailsD.map((p) => (
          <Reveal key={p.gid}>
            <Rail title={`Because you like ${p.label}`} seeAllTo={`/genre/${p.gid}`}>
              {p.ids.map((id) => (
                <PosterCard key={id} filmId={id} note={REASONS[id]} />
              ))}
            </Rail>
          </Reveal>
        ))}
        <Reveal>
          <Rail title={trending.title} seeAllTo="/browse">
            {trendingIds.map((id) => (
              <PosterCard key={id} filmId={id} note={REASONS[id]} />
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
          <Rail title={curated.title} seeAllTo="/browse">
            {curatedIds.map((id) => (
              <PosterCard key={id} filmId={id} note={REASONS[id]} />
            ))}
          </Rail>
        </Reveal>
        <Reveal>
          <Rail title={fresh.title} seeAllTo="/browse">
            {freshIds.map((id) => (
              <PosterCard key={id} filmId={id} note={REASONS[id]} />
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
          {essentialCovers.length === 3 ? (
            <div className="editorial-stack" aria-hidden="true">
              {essentialCovers.map((f) => (
                <img key={f.id} src={f.poster} alt="" loading="lazy" />
              ))}
            </div>
          ) : (
            <div className="editorial-cover">
              <img src={EDITORIAL_PICK.image} alt="" loading="lazy" />
            </div>
          )}
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
                {c.entries.map(([id, reason]) => (
                  <PosterCard key={id} filmId={id} note={reason || REASONS[id]} />
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
