// Cap catalog poster JPGs at MAX_W and regenerate the .jpg.webp sibling that
// nginx content-negotiates. The rail slot is 200px CSS (≤400px at 2× DPR), and
// most posters already ship ~480px — this only shrinks the handful of 780px
// outliers so they stop over-fetching ~4× their displayed size. Idempotent and
// re-runnable (skips anything already at/below the cap). Needs `sips` (macOS)
// + `cwebp`. Run: `node scripts/optimize-posters.mjs`
import { readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const DIR = fileURLToPath(new URL('../public/assets/posters/', import.meta.url));
const MAX_W = 480;
const WEBP_Q = 80;

const jpgs = readdirSync(DIR).filter((f) => f.endsWith('.jpg') && !f.endsWith('.jpg.webp'));
let resized = 0;
for (const f of jpgs) {
  const p = join(DIR, f);
  const w = parseInt(
    execFileSync('sips', ['-g', 'pixelWidth', p]).toString().match(/pixelWidth:\s*(\d+)/)?.[1] || '0',
    10
  );
  if (w <= MAX_W + 40) continue; // already small enough — leave it (no churn)
  execFileSync('sips', ['--resampleWidth', String(MAX_W), p]); // in-place, keeps aspect
  execFileSync('cwebp', ['-quiet', '-q', String(WEBP_Q), p, '-o', `${p}.webp`]); // regen sibling
  resized++;
  console.log(`${f}: ${w}w → ${MAX_W}w`);
}
console.log(`\nDone — capped ${resized} oversized posters at ${MAX_W}w and regenerated their .webp.`);
