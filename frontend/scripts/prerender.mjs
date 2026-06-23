// Post-build SEO pass. Social scrapers (LinkedIn/Slack/iMessage/X/Facebook) and
// many crawlers do NOT execute JS, so the per-route <head> that usePageTitle sets
// at runtime is invisible to them — every shared link would otherwise show the
// generic homepage card. This bakes a correct per-route <head> (title, description,
// OG/Twitter, canonical, LCP preload, JSON-LD) into static HTML files that nginx
// serves via `try_files $uri/`, and regenerates sitemap.xml from the catalog.
//
// Runs after `vite build`. Designed to NEVER fail the build: any error is logged
// and skipped so a bad route can't block a deploy.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { FILMS, COLLECTIONS, GENRES, GENRE_MATCH, byId } from '../src/data/catalog.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const ORIGIN = 'https://nux.ontwrpn.com';
const DEFAULT_DESC =
  'An editorial streaming platform for films, documentaries, games and courses — curated by editors who care.';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
const abs = (u) => (u ? (/^https?:\/\//.test(u) ? u : ORIGIN + u) : `${ORIGIN}/og.jpg`);
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

// Vite injects the hashed <script>/<link> asset tags into the built index.html.
// Graft those verbatim into every composed page so the SPA boots identically.
const builtIndex = readFileSync(join(DIST, 'index.html'), 'utf8');
const assetTags = (
  builtIndex.match(/<script type="module"[^>]*><\/script>|<link rel="(?:modulepreload|stylesheet)"[^>]*>/g) || []
).join('\n    ');
if (!assetTags) {
  console.error('[prerender] no asset tags found in dist/index.html — skipping prerender');
  process.exit(0);
}

function compose({ title, description, url, image, preload, jsonLds = [] }) {
  const t = title ? `${esc(title)} — NUX` : 'NUX — Cinema for Curious Minds';
  const d = esc(description || DEFAULT_DESC);
  const img = esc(abs(image));
  const isDefaultImg = !image;
  const lines = [
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />',
    '<link rel="manifest" href="/manifest.webmanifest" />',
    '<meta name="theme-color" content="#0d0c0b" />',
    '<link rel="apple-touch-icon" href="/icon-180.png" />',
    '<meta name="apple-mobile-web-app-capable" content="yes" />',
    '<meta name="mobile-web-app-capable" content="yes" />',
    '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />',
    '<meta name="apple-mobile-web-app-title" content="NUX" />',
    preload ? `<link rel="preload" as="image" href="${esc(abs(preload))}" fetchpriority="high" />` : '',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="NUX" />',
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${img}" />`,
    // dimensions are known only for the default 1200x630 og.jpg; omit for
    // per-route images (wrong dims are worse than none)
    isDefaultImg ? '<meta property="og:image:width" content="1200" />' : '',
    isDefaultImg ? '<meta property="og:image:height" content="630" />' : '',
    `<meta property="og:image:alt" content="${t}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    ...jsonLds.map(ld),
    '<script src="https://t.contentsquare.net/uxa/ce2a4b85786d7.js" defer></script>',
    assetTags,
  ].filter(Boolean);
  return `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    ${lines.join('\n    ')}\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>\n`;
}

function write(routePath, html) {
  // '/' -> dist/index.html ; '/film/x' -> dist/film/x/index.html
  const rel = routePath === '/' ? 'index.html' : join(routePath.replace(/^\//, ''), 'index.html');
  const out = join(DIST, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}

let count = 0;
const safe = (label, fn) => {
  try {
    fn();
    count++;
  } catch (e) {
    console.error(`[prerender] skipped ${label}: ${e?.message || e}`);
  }
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NUX',
  url: `${ORIGIN}/`,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${ORIGIN}/browse?q={query}`,
    'query-input': 'required name=query',
  },
};
const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NUX',
  url: `${ORIGIN}/`,
  logo: `${ORIGIN}/favicon.svg`,
};

// Home (also the SPA fallback for non-prerendered routes) — keep the hero preload.
safe('/', () =>
  write(
    '/',
    compose({
      title: null,
      description:
        'NUX is an editorial streaming platform for films, documentaries, games and courses — curated by editors who care. A design-system showcase built on real British cinema.',
      url: `${ORIGIN}/`,
      preload: '/assets/stills/still-lawrence-of-arabia-2.jpg',
      jsonLds: [website, organization],
    })
  )
);

safe('/browse', () =>
  write('/browse', compose({ title: 'Browse', description: 'Search and browse the full NUX catalog by genre, mood and format.', url: `${ORIGIN}/browse` }))
);

for (const f of FILMS) {
  safe(`/film/${f.id}`, () => {
    const movie = {
      '@context': 'https://schema.org',
      '@type': 'Movie',
      name: f.title,
      ...(f.synopsis ? { description: f.synopsis } : {}),
      ...(f.backdrop || f.poster ? { image: abs(f.backdrop || f.poster) } : {}),
      ...(f.director ? { director: { '@type': 'Person', name: f.director } } : {}),
      ...(f.year ? { datePublished: String(f.year) } : {}),
      ...(f.genre ? { genre: f.genre } : {}),
    };
    write(
      `/film/${f.id}`,
      compose({
        title: f.title,
        description: f.synopsis,
        url: `${ORIGIN}/film/${f.id}`,
        image: f.backdrop || f.poster,
        preload: f.backdrop || f.poster, // the page's LCP image
        jsonLds: [movie],
      })
    );
  });
}

for (const [slug, col] of Object.entries(COLLECTIONS)) {
  safe(`/collection/${slug}`, () => {
    const films = (col.entries || []).map(([id]) => byId(id)).filter(Boolean);
    const itemList = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: col.title,
      numberOfItems: films.length,
      itemListElement: films.map((film, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: film.title,
        url: `${ORIGIN}/film/${film.id}`,
      })),
    };
    write(
      `/collection/${slug}`,
      compose({
        title: col.title,
        description: col.intro,
        url: `${ORIGIN}/collection/${slug}`,
        image: col.cover,
        preload: col.cover,
        jsonLds: [itemList],
      })
    );
  });
}

const liveGenres = GENRES.filter((g) => (GENRE_MATCH[g.id] || []).length > 0);
for (const g of liveGenres) {
  safe(`/genre/${g.id}`, () =>
    write(
      `/genre/${g.id}`,
      compose({
        title: g.label,
        description: `${g.label} on NUX — a curated shelf of British cinema.`,
        url: `${ORIGIN}/genre/${g.id}`,
        image: g.image,
        preload: g.image,
      })
    )
  );
}

const INFO = {
  about: 'About NUX',
  help: 'Help & Support',
  privacy: 'Privacy',
  terms: 'Terms of Service',
};
for (const [slug, title] of Object.entries(INFO)) {
  safe(`/p/${slug}`, () => write(`/p/${slug}`, compose({ title, url: `${ORIGIN}/p/${slug}` })));
}

// Sitemap — every public, indexable route (no auth/watch/account routes).
safe('sitemap.xml', () => {
  const urls = [
    '/',
    '/browse',
    ...FILMS.map((f) => `/film/${f.id}`),
    ...Object.keys(COLLECTIONS).map((s) => `/collection/${s}`),
    ...liveGenres.map((g) => `/genre/${g.id}`),
    ...Object.keys(INFO).map((s) => `/p/${s}`),
  ];
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${ORIGIN}${u}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  writeFileSync(join(DIST, 'sitemap.xml'), xml);
});

console.log(`[prerender] wrote ${count} routes + sitemap (${FILMS.length} films, ${Object.keys(COLLECTIONS).length} collections, ${liveGenres.length} genres)`);
