// Single source of truth for design tokens. The app's tokens.css is canonical;
// the landing must never drift from it. This copies the canonical file into the
// landing's Vite source tree (you can't import across two Vite roots without a
// fragile relative path that breaks the dev server's module graph), prepending a
// "do not edit" header. Wired as predev + prebuild so a sync always runs before
// the styles are read. Re-run by hand with `npm run sync:tokens`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, '..', '..', 'frontend', 'src', 'styles', 'tokens.css');
const DEST = join(here, '..', 'src', 'styles', 'tokens.css');

// The landing deploys STANDALONE — its Docker image has no sibling frontend/ tree
// (the prod build context is landing/ only). When the canonical source isn't
// present, skip and keep the committed tokens.css; the sync only needs to run
// where the app source exists (local dev via predev, or a manual sync:tokens).
if (!existsSync(SRC)) {
  console.log('[sync-tokens] app source not present (standalone build) — keeping committed tokens.css');
  process.exit(0);
}

const HEADER =
  '/* GENERATED — do not edit by hand. Synced from frontend/src/styles/tokens.css\n' +
  '   by landing/scripts/sync-tokens.mjs (runs on predev + prebuild). Edit the\n' +
  '   canonical file in the app, then re-run `npm run sync:tokens`. */\n\n';

const canonical = readFileSync(SRC, 'utf8');
writeFileSync(DEST, HEADER + canonical);
console.log('[sync-tokens] wrote landing/src/styles/tokens.css from the app catalog of tokens');
