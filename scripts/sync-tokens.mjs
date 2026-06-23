#!/usr/bin/env node
// Design tokens have ONE source of truth: frontend/src/styles/tokens.css.
// The landing deploys from /landing in isolation (its Docker context can't reach
// ../frontend), so it ships a committed COPY. Run this after editing tokens so the
// two never drift.
//   node scripts/sync-tokens.mjs          → copy frontend tokens → landing
//   node scripts/sync-tokens.mjs --check  → exit 1 if they differ (CI guard)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'frontend/src/styles/tokens.css');
const DST = join(root, 'landing/src/styles/tokens.css');
const src = readFileSync(SRC, 'utf8');

if (process.argv.includes('--check')) {
  const dst = readFileSync(DST, 'utf8');
  if (src !== dst) {
    console.error('✗ landing/src/styles/tokens.css is OUT OF SYNC with frontend.\n  Fix: node scripts/sync-tokens.mjs');
    process.exit(1);
  }
  console.log('✓ tokens in sync');
  process.exit(0);
}

writeFileSync(DST, src);
console.log('✓ synced landing/src/styles/tokens.css ← frontend/src/styles/tokens.css');
