import { useEffect, useState } from 'react';
import Hero from '../components/Hero.jsx';
import Reveal from '../components/Reveal.jsx';
import { SkeletonRail } from '../components/Skeleton.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import Rail, { PosterCard, ContinueCard } from '../components/Rail.jsx';
import { RAILS, CONTINUE_WATCHING, EDITORIAL_PICK } from '../data/catalog.js';
import './Home.css';

export default function Home() {
  usePageTitle(null);
  const [trending, curated, fresh] = RAILS;
  // brief skeleton on first mount so the page assembles, then settles
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 320);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return (
      <main>
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
        <Reveal>
          <Rail title="Continue Watching" wide>
            {CONTINUE_WATCHING.map((item) => (
              <ContinueCard key={item.filmId} item={item} />
            ))}
          </Rail>
        </Reveal>
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
            <a href="#editorial" className="btn btn-secondary editorial-cta">
              {EDITORIAL_PICK.cta}
            </a>
          </div>
          <div className="editorial-cover">
            <img src={EDITORIAL_PICK.image} alt="" loading="lazy" />
          </div>
        </Reveal>
      </div>
    </main>
  );
}
