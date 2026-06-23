import { useState } from 'react';
import HeroDome from './components/HeroDome.jsx';
import { CURATOR, RAILS, COLLECTIONS, poster } from './data/films.js';

const APP = 'https://nux.ontwrpn.com';

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}

export default function App() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="page">
      <a className="skip-link" href="#main">Skip to content</a>
      {/* Nav */}
      <header className="nav">
        <div className="wordmark">NUX</div>
        <nav className="nav-actions">
          <a className="nav-link" href={`${APP}/signin`}>Sign in</a>
          <a className="btn btn-primary" href={`${APP}/welcome`}><PlayIcon /> Start watching</a>
        </nav>
      </header>

      <main id="main">
      {/* Hero — cursor-reactive poster dome */}
      <HeroDome>
        <div className="hero-content">
          <p className="eyebrow">British cinema · curated by hand</p>
          <h1 className="hero-title">Stop scrolling. We’ve already watched everything</h1>
          <p className="hero-sub">
            A small, hand-built home for British cinema. No infinite wall, no “because you watched” —
            just films a person would actually put in front of you, and a curator that answers when
            you ask what to watch.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary btn-lg" href={`${APP}/welcome`}><PlayIcon /> Start watching</a>
            <a className="btn btn-secondary btn-lg" href="#catalogue">Browse the catalogue</a>
          </div>
          <p className="hero-hint">drag to spin · move your cursor to look around</p>
        </div>
      </HeroDome>

      {/* Proof strip */}
      <section className="proof">
        <p>Around 120 films. No algorithm. Every one put there on purpose.</p>
      </section>

      {/* Curator demo */}
      <section className="section curator" aria-labelledby="curator-h">
        <p className="eyebrow center">The Curator</p>
        <h2 id="curator-h" className="section-title center">Tell it the mood. It does the deciding</h2>
        <div className="curator-card">
          <div className="curator-q"><span className="bubble">something quiet and rainy, like a Sunday afternoon</span></div>
          <div className="curator-r">
            <p className="curator-from">The Curator</p>
            <p className="curator-reply">
              Start with <em>Brief Encounter</em> — all restraint and railway stations. Keep
              {' '}<em>Aftersun</em> for when you can take the ache, and <em>The Souvenir</em> if you
              want it to linger. All three reward a grey afternoon.
            </p>
          </div>
          <div className="curator-results">
            {CURATOR.map((f) => (
              <figure className="result" key={f.slug}>
                <img src={poster(f.slug)} alt={f.title} loading="lazy" />
                <figcaption>{f.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <ul className="curator-benefits">
          <li>Ask in plain English</li>
          <li>Only suggests films we actually have</li>
          <li>An opinion, not 200 search results</li>
        </ul>
      </section>

      {/* Catalogue rails */}
      <section className="section catalogue" id="catalogue" aria-labelledby="cat-h">
        <h2 id="cat-h" className="section-title">This is the catalogue, not a teaser</h2>
        {RAILS.map((rail) => (
          <div className="rail" key={rail.label}>
            <h3 className="rail-label">{rail.label}</h3>
            <div className="rail-row">
              {rail.films.map((f) => (
                <figure className="card" key={f.slug}>
                  <img src={poster(f.slug)} alt={f.title} loading="lazy" />
                  <figcaption>
                    <span className="card-title">{f.title}</span>
                    <span className="card-meta">{f.meta}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="section how" aria-labelledby="how-h">
        <h2 id="how-h" className="section-title">From a mood to a film, in three steps</h2>
        <ol className="steps">
          <li><span className="step-n">01</span><h3>Tell us what moves you</h3><p>A few minutes, once. Your homepage opens with those films up top.</p></li>
          <li><span className="step-n">02</span><h3>Get a programme, not a grid</h3><p>Themed rails and collections, put together by hand and changed most weeks.</p></li>
          <li><span className="step-n">03</span><h3>Ask the Curator anything</h3><p>Stuck for the evening? Describe a mood and get a straight answer.</p></li>
        </ol>
      </section>

      {/* Collections */}
      <section className="section collections" aria-labelledby="coll-h">
        <p className="eyebrow">Collections</p>
        <h2 id="coll-h" className="section-title">Every rail has a point of view</h2>
        <div className="coll-grid">
          {COLLECTIONS.map((c) => (
            <article className="coll-card" key={c.title}>
              <div className="coll-img"><img src={poster(c.slug)} alt="" loading="lazy" /></div>
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="section pricing" aria-labelledby="price-h">
        <p className="eyebrow center">Membership</p>
        <h2 id="price-h" className="section-title center">Anyone can browse. Members get the editors</h2>
        <p className="pricing-sub center">
          Look around for free — the whole catalogue, every film page, your own list. Become a member
          when you’d rather we did the choosing.
        </p>
        <div className="plans">
          <div className="plan plan-free">
            <h3>Browse</h3>
            <p className="plan-price">Free</p>
            <p className="plan-note">The whole catalogue, every film page, your own list — no account needed.</p>
            <a className="btn btn-secondary" href={`${APP}/browse`}>Browse the catalogue</a>
          </div>
          <div className="plan plan-member">
            <h3>NUX Membership</h3>
            <div className="toggle" role="group" aria-label="Billing period">
              <button className={!annual ? 'on' : ''} onClick={() => setAnnual(false)} aria-pressed={!annual}>Monthly</button>
              <button className={annual ? 'on' : ''} onClick={() => setAnnual(true)} aria-pressed={annual}>Annual <span className="save">Save 44%</span></button>
            </div>
            <p className="plan-price">
              {annual ? <>£4.99<span className="per"> a month</span></> : <>£8.99<span className="per"> a month</span></>}
            </p>
            <p className="plan-note">{annual ? 'Billed annually at £59.88.' : 'Billed monthly.'} Everything in Browse, plus:</p>
            <ul className="plan-feats">
              <li>The Curator — describe a mood, get a shortlist worth your night</li>
              <li>Editors’ Collections — a new programme most weeks</li>
              <li>Every film, no ads, ever</li>
              <li>Download in HD for the train</li>
              <li>Two screens at once</li>
            </ul>
            <a className="btn btn-primary btn-block" href={`${APP}/welcome`}><PlayIcon /> Start watching</a>
            <p className="plan-reassure">Free for 14 days. Nothing charged today — cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Honesty */}
      <section className="section honesty">
        <p>
          While we’re being honest: NUX is a concept — a portfolio piece built to show how streaming
          could feel if a person did the choosing. The films are real and so is the curation. The
          payment isn’t. Nothing’s charged, and the library’s deliberately small. That’s the point.
        </p>
      </section>

      {/* Final CTA */}
      <section className="section final-cta">
        <h2 className="section-title center">The lights are down. Put something good on</h2>
        <a className="btn btn-primary btn-lg" href={`${APP}/welcome`}><PlayIcon /> Start watching</a>
      </section>

      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="wordmark">NUX</div>
            <p>Cinema for curious minds.</p>
          </div>
          <nav className="footer-links">
            <a href={`${APP}/p/about`}>About</a>
            <a href={`${APP}/browse`}>Catalogue</a>
            <a href={`${APP}/welcome`}>The Curator</a>
            <a href="mailto:eluvrv@gmail.com">Contact</a>
          </nav>
          <div className="footer-news">
            <p>A short letter when we add something worth your evening.</p>
            <form className="news-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email address" aria-label="Email address" />
              <button className="btn btn-secondary" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-legal">
          <span>© 2026 NUX — a portfolio concept by Elena Uvarova.</span>
          <a href="https://ontwrpn.com">Read the case study →</a>
        </div>
      </footer>
    </div>
  );
}
