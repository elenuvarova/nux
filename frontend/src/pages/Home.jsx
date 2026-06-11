import Hero from '../components/Hero.jsx';
import Rail, { PosterCard, ContinueCard } from '../components/Rail.jsx';
import { RAILS, CONTINUE_WATCHING, EDITORIAL_PICK } from '../data/catalog.js';
import './Home.css';

export default function Home() {
  const [trending, curated, fresh] = RAILS;

  return (
    <main>
      <Hero />
      <div className="home-rails">
        <Rail title={trending.title}>
          {trending.filmIds.map((id) => (
            <PosterCard key={id} filmId={id} />
          ))}
        </Rail>
        <Rail title="Continue Watching" wide>
          {CONTINUE_WATCHING.map((item) => (
            <ContinueCard key={item.filmId} item={item} />
          ))}
        </Rail>
        <Rail title={curated.title}>
          {curated.filmIds.map((id) => (
            <PosterCard key={id} filmId={id} />
          ))}
        </Rail>
        <Rail title={fresh.title}>
          {fresh.filmIds.map((id) => (
            <PosterCard key={id} filmId={id} />
          ))}
        </Rail>

        <section className="editorial" aria-label={EDITORIAL_PICK.title}>
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
        </section>
      </div>
    </main>
  );
}
