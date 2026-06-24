import { useState } from 'react';
import HeroDome from './components/HeroDome.jsx';
import { DIRECTORS, WALL, CURATOR, RAILS, FOTW, COLLECTIONS, poster } from './data/films.js';
import { useTilt } from './lib/useTilt.js';

const APP = 'https://app.nux.ontwrpn.com';

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
);
const Slate = ({ n, label, center }) => (
  <p className={center ? 'slate center' : 'slate'}><span className="slate-n">N°{n}</span><span className="slate-rule" /><span className="slate-label">{label}</span></p>
);

// Poster card — ported 1:1 from the app's PosterCard so covers match across both
// surfaces: type/genre badge on the artwork, cursor tilt + warm sheen, a glass
// play glyph on hover, amber-bloom shadow. The whole card links into the app.
function RailCard({ f }) {
  const tilt = useTilt();
  return (
    <a className="poster-card" href={`${APP}/welcome`}>
      <div className="poster-card-art" ref={tilt.ref} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave} onBlur={tilt.onBlur}>
        <img src={poster(f.slug)} alt="" loading="lazy" width="200" height="300" />
        <span className="poster-card-badge">{f.genre}</span>
        <span className="poster-card-sheen" aria-hidden="true" />
        <span className="poster-card-play" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.8v10.4c0 .6.65.97 1.17.66l8.4-5.2a.78.78 0 0 0 0-1.32l-8.4-5.2A.78.78 0 0 0 3 1.8z" /></svg>
        </span>
      </div>
      <p className="poster-card-title">{f.title}</p>
      <p className="poster-card-meta">{f.director} · {f.year} · {f.runtime}</p>
    </a>
  );
}

export default function App() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="page" id="top">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="nav">
        <a className="wordmark" href="#top">NUX</a>
        <nav className="nav-actions">
          <a className="nav-link" href={`${APP}/signin`}>Sign in</a>
          <a className="btn btn-primary" href={`${APP}/welcome`}><PlayIcon /> Start watching</a>
        </nav>
      </header>

      <main id="main">
        {/* Hero — poster cylinder */}
        <HeroDome>
          <div className="hero-content">
            <p className="eyebrow">British cinema · curated by hand</p>
            <h1 className="hero-title">Stop scrolling. We’ve already watched everything</h1>
            <p className="hero-sub">
              A small, hand-built home for British cinema. No infinite wall, no “because you watched” —
              just films a person would actually put in front of you, and a curator that answers when you ask.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary btn-lg" href={`${APP}/welcome`}><PlayIcon /> Start watching</a>
              <a className="link-arrow" href="#catalogue">Browse the catalogue <span>→</span></a>
            </div>
            <p className="hero-hint">drag to spin<span className="hint-cursor"> · move your cursor to look around</span></p>
          </div>
        </HeroDome>

        {/* Director marquee */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...DIRECTORS, ...DIRECTORS].map((d, i) => (
              <span className="marquee-item" key={i}>{d}<i>✳</i></span>
            ))}
          </div>
        </div>

        {/* N°01 — the library: poster wall as proof */}
        <section className="proof" aria-labelledby="proof-h">
          <div className="wall" aria-hidden="true">
            {WALL.map((s) => <img key={s} src={poster(s)} alt="" loading="lazy" />)}
          </div>
          <div className="proof-over">
            <Slate n="01" label="The library" center />
            <h2 id="proof-h" className="proof-line">Forty years of British cinema, every one put there on purpose</h2>
            <p className="proof-stats"><b>~50</b> films<i>·</i><b>0</b> algorithms<i>·</i><b>0</b> ads, ever</p>
          </div>
        </section>

        {/* N°02 — the Curator */}
        <section className="section curator" aria-labelledby="cur-h">
          <Slate n="02" label="The Curator" />
          <div className="curator-grid">
            <div className="curator-ask">
              <h2 id="cur-h" className="section-title">Tell it the mood.<br />It does the deciding</h2>
              <p className="curator-prompt">“{CURATOR.prompt}”</p>
              <p className="curator-note">
                Start with <em>Kes</em> — a Barnsley boy and a kestrel, tenderness with the grain left in.
                Keep <em>Ratcatcher</em> for the canal-side beauty in a bin-strike summer, and save
                {' '}<em>Aftersun</em> for when you can take the ache. All three reward a grey afternoon.
              </p>
              <p className="curator-sign">— The NUX Curator</p>
              <a className="link-arrow" href={`${APP}/welcome`}>Ask it yourself <span>→</span></a>
            </div>
            <ul className="picks">
              {CURATOR.picks.map((p) => (
                <li className="pick" key={p.slug}>
                  <div className="pick-still"><img src={poster(p.slug)} alt="" loading="lazy" /></div>
                  <div className="pick-body">
                    <p className="pick-eyebrow">► Reason</p>
                    <h3 className="pick-title">{p.title}</h3>
                    <p className="pick-credit">{p.director} · {p.year}</p>
                    <p className="pick-reason">{p.reason}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* N°03 — the collection: rails + index */}
        <section className="section catalogue" id="catalogue" aria-labelledby="cat-h">
          <div className="cat-head">
            <div>
              <Slate n="03" label="The collection" />
              <h2 id="cat-h" className="section-title">This is the catalogue, not a teaser</h2>
            </div>
            <a className="link-arrow" href={`${APP}/browse`}>Browse everything <span>→</span></a>
          </div>

          {RAILS.map((rail) => (
            <div className="rail" key={rail.label}>
              <p className="rail-eyebrow">{rail.label}</p>
              <div className="rail-row">
                {rail.films.map((f) => <RailCard f={f} key={f.slug} />)}
              </div>
            </div>
          ))}

        </section>

        {/* N°03½ — the editors' room (single-film spotlight, replaces the type-index) */}
        <section className="section fotw" aria-labelledby="fotw-h">
          <Slate n="03½" label="The editors' room" />
          <h2 id="fotw-h" className="section-title">We'd rather show you one film properly than fifty in a hurry</h2>
          <a className="fotw-card" href={`${APP}/film/${FOTW.slug}`}>
            <div className="fotw-art" style={{ backgroundImage: `url(${FOTW.still})` }} aria-hidden="true" />
            <div className="fotw-body">
              <p className="fotw-meta">{FOTW.director} · {FOTW.year} · {FOTW.runtime}</p>
              <h3 className="fotw-title">{FOTW.title}</h3>
              <p className="fotw-note">{FOTW.note}</p>
              <span className="fotw-cta">Watch it <span aria-hidden="true">→</span></span>
            </div>
          </a>
        </section>

        {/* N°04 — collections */}
        <section className="section collections" aria-labelledby="coll-h">
          <Slate n="04" label="Collections" />
          <h2 id="coll-h" className="section-title">Every rail has a point of view</h2>
          <div className="coll-stack">
            {COLLECTIONS.map((c, i) => (
              <a className={`coll-tile t${i + 1}`} href={`${APP}/browse`} key={c.title}>
                <img className="coll-still" src={poster(c.slug)} alt="" loading="lazy" />
                <div className="coll-text">
                  <span className="coll-n">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="coll-title">{c.title}</h3>
                  <p className="coll-standfirst">{c.standfirst}</p>
                  <p className="coll-count">{c.count} films <span>→</span></p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* N°05 — how it works */}
        <section className="section how" aria-labelledby="how-h">
          <Slate n="05" label="How it works" />
          <h2 id="how-h" className="section-title">From a mood to a film, in three moves</h2>
          <ol className="moves">
            <li className="move">
              <span className="move-n">01</span>
              <div className="move-body"><h3>Tell us what moves you</h3><p>A few minutes, once. Your homepage opens with those films up top — no quiz, no cold start.</p></div>
            </li>
            <li className="move">
              <span className="move-n">02</span>
              <div className="move-body"><h3>Get a programme, not a grid</h3><p>Themed rails and collections, put together by hand and changed most weeks — like a season at a rep cinema.</p></div>
            </li>
            <li className="move">
              <span className="move-n">03</span>
              <div className="move-body"><h3>Ask the Curator anything</h3><p>Stuck for the evening? Describe a mood in plain English and get three films, with reasons — not two hundred results.</p></div>
            </li>
          </ol>
        </section>

        {/* N°06 — membership */}
        <section className="section pricing" aria-labelledby="price-h">
          <Slate n="06" label="Membership" center />
          <h2 id="price-h" className="section-title center">Anyone can browse.<br />Members get the editors</h2>
          <div className="plans">
            <div className="plan plan-free">
              <p className="plan-name">Browse</p>
              <p className="plan-price">Free</p>
              <p className="plan-note">The whole catalogue, every film page, your own list — no account needed.</p>
              <a className="link-arrow" href={`${APP}/browse`}>Browse the catalogue <span>→</span></a>
            </div>
            <div className="plan plan-member">
              <p className="plan-name">NUX Membership</p>
              <div className="toggle" role="group" aria-label="Billing period">
                <button type="button" className={!annual ? 'on' : ''} onClick={() => setAnnual(false)} aria-pressed={!annual}>Monthly</button>
                <button type="button" className={annual ? 'on' : ''} onClick={() => setAnnual(true)} aria-pressed={annual}>Annual <span className="save">Save 44%</span></button>
              </div>
              <p className="plan-price">{annual ? <>£4.99<span className="per"> a month</span></> : <>£8.99<span className="per"> a month</span></>}</p>
              <p className="plan-note">{annual ? 'Billed annually at £59.88.' : 'Billed monthly.'} Everything in Browse, plus:</p>
              <ul className="plan-feats">
                <li>The Curator — a mood in, a shortlist worth your night</li>
                <li>Editors’ Collections — a new programme most weeks</li>
                <li>Every film, no ads, ever</li>
                <li>Download in HD for the train · two screens at once</li>
              </ul>
              <a className="btn btn-primary btn-block" href={`${APP}/welcome`}><PlayIcon /> Start watching</a>
              <p className="plan-reassure">Free for 14 days. Nothing charged today — cancel anytime.</p>
            </div>
          </div>
        </section>

        {/* Colophon / honesty */}
        <section className="colophon">
          <p className="colophon-mark">✳</p>
          <p className="colophon-text">
            NUX is a design portfolio project by Elena Uvarova. The catalogue is real British cinema;
            the streaming, accounts and payments are simulated. The library is deliberately small —
            that’s the point.
          </p>
        </section>

        {/* Final CTA */}
        <section className="final-cta">
          <Slate n="07" label="Now showing" center />
          <h2 className="final-line">The lights are down.<br />Put something good on</h2>
          <a className="btn btn-primary btn-lg" href={`${APP}/welcome`}><PlayIcon /> Start watching</a>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <nav className="footer-index" aria-label="Footer">
            <a href={`${APP}/p/about`}>About <span>→</span></a>
            <a href={`${APP}/browse`}>Catalogue <span>→</span></a>
            <a href={`${APP}/welcome`}>The Curator <span>→</span></a>
            <a href="https://ontwrpn.com">Case study <span>→</span></a>
            <a href="mailto:eluvrv@gmail.com">Contact <span>→</span></a>
          </nav>
          <form className="news-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="news">A short letter when we add something worth your evening.</label>
            <div className="news-row">
              <input id="news" type="email" placeholder="Email address" />
              <button className="btn btn-secondary" type="submit">Subscribe</button>
            </div>
          </form>
        </div>
        <p className="footer-mark" aria-hidden="true">NUX</p>
        <div className="footer-legal">
          <span>© 2026 NUX — a portfolio concept by Elena Uvarova.</span>
          <span>Cinema for curious minds.</span>
        </div>
      </footer>
    </div>
  );
}
