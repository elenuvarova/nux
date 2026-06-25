// GENERATOR — projects the landing's film data FROM the app catalog so the two
// surfaces never drift. Facts (title, director, year, runtime, genre) and the
// deep-link id come from frontend/src/data/catalog.js; the editorial layer
// (which films sit in which rail, the Curator's reasons, the spotlight note,
// the collection standfirsts) is curation that lives here.
//
// Why an asset slug AND an id: the landing ships its own poster/still files under
// public/assets/posters/poster-<assetSlug>.jpg (e.g. "third-man"), but the app's
// real catalog id is "the-third-man". The poster path uses assetSlug; every
// deep-link uses the real id so /film/<id> resolves in the app (no 404, no
// fallback to a generic /browse).
//
// Mirrors backend/scripts/build-films.mjs. Re-run with `npm run build:films`
// (also runs automatically on predev + prebuild).
import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// The app catalog is the source of truth, but the landing deploys STANDALONE (its
// Docker image has no sibling frontend/ tree — the prod build context is landing/
// only). When the catalog isn't present, skip and keep the committed films.js; the
// generator only needs to run where the app source exists (local dev via predev,
// or a manual build:films). A static import here would crash the standalone build.
const CATALOG = join(here, '..', '..', 'frontend', 'src', 'data', 'catalog.js');
if (!existsSync(CATALOG)) {
  console.log('[build-landing-films] app catalog not present (standalone build) — keeping committed films.js');
  process.exit(0);
}
const { byId, COLLECTIONS: APP_COLLECTIONS } = await import(pathToFileURL(CATALOG).href);

// asset slug (local poster/still filename) -> real catalog id (deep-link target).
// Most match 1:1; the app prefixes some titles with "the-".
const ASSET_TO_ID = {
  'third-man': 'the-third-man',
  'red-shoes': 'the-red-shoes',
  'the-innocents': 'the-innocents',
  performance: 'performance',
  aftersun: 'aftersun',
  'black-narcissus': 'black-narcissus',
  kes: 'kes',
  'saturday-night-and-sunday-morning': 'saturday-night-and-sunday-morning',
  'this-sporting-life': 'this-sporting-life',
  'billy-liar': 'billy-liar',
  ratcatcher: 'ratcatcher',
  'get-carter': 'get-carter',
  'a-matter-of-life-and-death': 'a-matter-of-life-and-death',
  'the-ladykillers': 'the-ladykillers',
};

// Resolve a film from the catalog by its landing asset slug. Throws loudly if the
// catalog id is missing or unmapped, so a renamed/removed film fails the build
// rather than silently shipping a dead deep-link.
function film(assetSlug) {
  const id = ASSET_TO_ID[assetSlug];
  if (!id) throw new Error(`build-landing-films: no catalog id mapped for asset "${assetSlug}"`);
  const f = byId(id);
  if (!f) throw new Error(`build-landing-films: catalog has no film "${id}" (asset "${assetSlug}")`);
  return {
    slug: assetSlug, // local poster/still asset filename
    id, // real catalog id — the deep-link target
    title: f.title,
    director: f.director,
    year: f.year,
    runtime: f.runtime,
    genre: f.genre,
  };
}

// ── Editorial curation (landing-authored; enriched from the catalog) ──────────

// Decorative collages — poster/still asset slugs only, never deep-linked, so they
// stay as the landing's local asset names (no catalog round-trip needed).
const DOME = [
  'third-man', 'red-shoes', 'brief-encounter', 'black-narcissus', 'peeping-tom',
  'billy-liar', 'if', 'the-ladykillers', 'the-innocents', 'the-servant',
  'walkabout', 'the-devils', 'get-carter', 'mona-lisa', 'this-is-england',
  'ratcatcher', 'kes', 'zulu', 'naked', 'withnail-and-i',
  'under-the-skin', 'sexy-beast', 'aftersun', 'dont-look-now', 'richard-iii',
  'the-lavender-hill-mob',
];

const WALL = [
  'third-man', 'kes', 'get-carter', 'red-shoes', 'naked', 'aftersun', 'zulu',
  'the-innocents', 'withnail-and-i', 'ratcatcher', 'black-narcissus', 'mona-lisa',
  'this-is-england', 'walkabout', 'under-the-skin', 'the-servant', 'dont-look-now',
  'peeping-tom', 'sexy-beast', 'the-devils', 'billy-liar', 'the-ladykillers',
  'performance', 'richard-iii', 'the-long-good-friday', 'distant-voices-still-lives',
  'saturday-night-and-sunday-morning', 'this-sporting-life', 'the-lavender-hill-mob',
  'brief-encounter', 'if', 'wicker-man', 'i-daniel-blake', 'red-road',
];

const DIRECTORS = [
  'Powell & Pressburger', 'Ken Loach', 'Carol Reed', 'Lynne Ramsay', 'Mike Leigh',
  'Nicolas Roeg', 'Andrea Arnold', 'David Lean', 'Terence Davies', 'Lindsay Anderson',
  'Jonathan Glazer', 'Mike Hodges', 'Shane Meadows', 'Charlotte Wells', 'Andrew Haigh',
  'Karel Reisz', 'Neil Jordan', 'Joseph Losey',
];

// Curator demo — one mood, three picks. Reason is editorial; the rest is catalog.
const CURATOR = {
  prompt: 'something quiet and rain-soaked, set up north',
  picks: [
    { ...film('kes'), reason: 'a Barnsley boy and a kestrel — tenderness with the grain left in.' },
    { ...film('ratcatcher'), reason: 'a Glasgow canal in a bin-strike summer; beauty where you least expect it.' },
    { ...film('aftersun'), reason: 'for when you can take the ache, slow and from a distance.' },
  ],
};

// Catalogue rails — proof the library is real. Order is editorial; facts catalog.
const RAILS = [
  {
    label: 'This week’s picks',
    films: ['third-man', 'red-shoes', 'the-innocents', 'performance', 'aftersun', 'black-narcissus'].map(film),
  },
  {
    label: 'Kitchen-sink realism',
    films: ['kes', 'saturday-night-and-sunday-morning', 'this-sporting-life', 'billy-liar', 'ratcatcher', 'get-carter'].map(film),
  },
];

// The editors' room — one film, properly. Note is editorial; the rest is catalog.
const FOTW = {
  ...film('kes'),
  still: '/assets/stills/still-kes.jpg',
  note:
    "A Barnsley boy written off by everyone trains a kestrel from the nest — and finds the one thing that's his alone. Loach leaves the grain in: the cold playground, the brother who's all fist, the one teacher who finally looks up. Watch it when you want tenderness that hasn't been sanded smooth.",
};

// Themed collections. Each tile deep-links to a resolvable app route: the one
// collection the app actually ships (best-2026) goes to /collection/<slug>; the
// rest open the representative film page so no tile dead-ends on /browse.
const ESSENTIAL_TEN = Object.keys(APP_COLLECTIONS)[0]; // 'best-2026'
const COLLECTIONS = [
  {
    title: 'The Angry Young Men',
    standfirst: 'When British film clocked off, got working-class, and stayed furious.',
    count: 6,
    still: 'saturday-night-and-sunday-morning',
    href: film('saturday-night-and-sunday-morning').id,
    kind: 'film',
  },
  {
    title: 'Ealing, with teeth',
    standfirst: 'The comedies that were never really that nice about anyone.',
    count: 5,
    still: 'the-ladykillers',
    href: film('the-ladykillers').id,
    kind: 'film',
  },
  {
    title: 'Powell & Pressburger',
    standfirst: 'The lush, the strange and the impossibly romantic — Technicolor and all.',
    count: 7,
    still: 'a-matter-of-life-and-death',
    href: film('a-matter-of-life-and-death').id,
    kind: 'film',
  },
  {
    // the only tile that maps to a real app collection route
    title: 'The Essential Ten',
    standfirst: APP_COLLECTIONS[ESSENTIAL_TEN].intro.split(/[.—]/)[0].trim() + '.',
    count: APP_COLLECTIONS[ESSENTIAL_TEN].entries.length,
    still: 'billy-liar',
    href: ESSENTIAL_TEN,
    kind: 'collection',
  },
];

// ── Emit ──────────────────────────────────────────────────────────────────────
const j = (v) => JSON.stringify(v, null, 2);
const out = `// GENERATED by scripts/build-landing-films.mjs — do not edit by hand.
// Run \`npm run build:films\` to regenerate from frontend/src/data/catalog.js.
// Facts come from the app catalog; deep-links use the real catalog \`id\` (not the
// local poster \`slug\`), so every poster/tile resolves to an app route.

// Posters/stills are the brand's strongest asset — the landing leads with them.
// Path uses the local asset slug; \`id\` is the catalog id used for deep-links.
export const poster = (slug) => \`/assets/posters/poster-\${slug}.jpg\`;
export const still = (slug) => \`/assets/stills/still-\${slug}.jpg\`;

export const DOME = ${j(DOME)};

export const WALL = ${j(WALL)};

export const DIRECTORS = ${j(DIRECTORS)};

export const CURATOR = ${j(CURATOR)};

export const RAILS = ${j(RAILS)};

export const FOTW = ${j(FOTW)};

export const COLLECTIONS = ${j(COLLECTIONS)};
`;

writeFileSync(join(here, '..', 'src', 'data', 'films.js'), out);
const railCount = RAILS.reduce((n, r) => n + r.films.length, 0);
console.log(`[build-landing-films] wrote landing/src/data/films.js (${railCount} rail films, ${CURATOR.picks.length} picks, ${COLLECTIONS.length} collections — all deep-linked to real catalog ids)`);
