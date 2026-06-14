// One-off (re-runnable) cast-photo sourcer.
// Pulls each actor's lead image from Wikipedia (Wikimedia Commons) via the
// pageimages API and writes it to public/assets/cast/cast-<slug>.jpg.
// Missing/ambiguous actors are simply skipped — the UI falls back to an
// initials monogram, and a global CSS treatment unifies whatever we get.
//
//   node scripts/fetch-cast.mjs
//
// Prints the slugs that succeeded (paste into CAST_PHOTOS in catalog.js) and
// the names that came back empty.

import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { FILMS } from '../src/data/catalog.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'assets', 'cast');
const UA = 'NUX-portfolio/1.0 (https://ontwrpn.com; eluvrv@gmail.com)';

// slug() must match the helper used in catalog.js / FilmDetail.
const slug = (name) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Disambiguation: the plain name resolves to the wrong person or a list page.
const TITLE = {
  Sabu: 'Sabu (actor)',
  'Frank Williams': 'Frank Williams (Formula One)',
  'Gary Lewis': 'Gary Lewis (actor)',
  'Joe Simpson': 'Joe Simpson (mountaineer)',
  'Simon Yates': 'Simon Yates (climber)',
  'Tom Burke': 'Tom Burke (actor)',
  'Adam Pearson': 'Adam Pearson (actor)',
  'Robert Swann': 'Robert Swann (actor)',
  'David Wood': 'David Wood (playwright)',
  'Lesley Sharp': 'Lesley Sharp',
};

async function leadImage(title) {
  const url =
    'https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1' +
    '&prop=pageimages&piprop=thumbnail&pithumbsize=400&titles=' +
    encodeURIComponent(title);
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages || {};
  for (const id of Object.keys(pages)) {
    const thumb = pages[id]?.thumbnail?.source;
    if (thumb) return thumb;
  }
  return null;
}

async function main() {
  await mkdir(OUT, { recursive: true });

  // Unique actors that don't already have an explicit photo.
  const names = new Set();
  for (const f of FILMS) {
    if (f.cast) for (const p of f.cast) if (!p.photo) names.add(p.name);
  }

  const ok = [];
  const missing = [];

  for (const name of names) {
    const candidates = [TITLE[name] || name];
    if (!TITLE[name]) candidates.push(`${name} (actor)`);
    let src = null;
    for (const c of candidates) {
      src = await leadImage(c);
      if (src) break;
    }
    if (!src) {
      missing.push(name);
      process.stdout.write(`·  MISS  ${name}\n`);
      continue;
    }
    const img = await fetch(src, { headers: { 'User-Agent': UA } });
    const buf = Buffer.from(await img.arrayBuffer());
    const s = slug(name);
    await writeFile(join(OUT, `cast-${s}.jpg`), buf);
    ok.push(s);
    process.stdout.write(`✓  ${s}  (${(buf.length / 1024) | 0}kb)\n`);
  }

  console.log(`\n--- ${ok.length} ok, ${missing.length} missing ---`);
  console.log('\nCAST_PHOTOS slugs:\n' + ok.map((s) => `'${s}'`).join(', '));
  console.log('\nMissing (initials fallback):\n' + missing.join(', '));
}

main();
