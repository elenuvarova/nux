import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Reveal from '../components/Reveal.jsx';
import { SkeletonRail } from '../components/Skeleton.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { useWatchHistory } from '../lib/useWatchHistory.js';
import Rail, { PosterCard, ContinueCard } from '../components/Rail.jsx';
import { RAILS, EDITORIAL_PICK } from '../data/catalog.js';
import { useCollections } from '../lib/useCollections.js';
import './Home.css';

export default function Home() {
  usePageTitle(null);
  const [trending, curated, fresh] = RAILS;
  const { history } = useWatchHistory();
  const { collections, loading: collectionsLoading, error: collectionsError } = useCollections();
  // brief skeleton on first mount so the page assembles, then settles
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 320);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return (
      <main>
        <h1 className="sr-only" tabIndex={-1}>
          Home
        </h1>
        <div className="home-hero-skeleton" />
        <div className="home-rails">
          <SkeletonRail />
          <SkeletonRail wide />
          <SkeletonRail />
        </div>
      </main>
    );
  }

  return (
    <main>
      <Hero />
      <div className="home-rails">
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
            We couldn't load more collections right now.
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
    </main>
  );
}
