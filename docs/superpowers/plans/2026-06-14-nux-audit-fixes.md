# NUX Audit-Fixes Implementation Plan

> **For agentic workers:** Tracked checklist (not pre-coded TDD) — the implementer works in-session with full context. Each finding: `file:line` + fix + verify. Execute cluster-by-cluster, commit + checkpoint after each. Branch: `audit-fixes` (do NOT push to `main` — Coolify auto-deploys on push).

**Goal:** Resolve all ~40 findings from the 2026-06-14 full audit (8 dimensions) without regressions.

**Architecture:** 8 ordered clusters A→H, cheap/safe → expensive/risky. Each cluster is an independent verifiable unit with its own commit.

**Tech Stack:** React 18 + Vite (frontend), Express + Sequelize (backend), plain-CSS tokens, nginx (deploy).

**Approved defaults:** signup-409 left as intentional (no change); `/film/:id` canonical for films + template unification; onboarding = lightweight real personalization (persist picks + 1 reordered rail + honest "2 of 2"); dead buttons → `/p/*` where they exist else "Demo" label; assets done-and-committed with weight numbers (no before/after gate).

---

## Cluster A — Frontend correctness bugs
**Files:** `Hero.jsx`, `pages/Browse.jsx`, `lib/useMyList.js`, `components/CuratorOverlay.jsx`, `lib/useCurator.jsx`, `lib/useTilt.js`, `lib/useAuth.jsx`, `lib/useCollections.js`, `main.jsx`
**Verify:** `cd frontend && npm test` + Playwright spot-check. Commit at end.

- [x] A1 — Hero carousel permanently freezes after keyboard focus — `Hero.jsx:47` — added `onBlurCapture` resetting `hovered=false` when focus leaves the `<section>`.
- [x] A2 — Browse recent-search crash on non-array localStorage — `Browse.jsx:47-53` — `Array.isArray(v) ? v : []` guard.
- [x] A3 — My List failed-save shows success+error toast at once — `useMyList.js` — success toast now fires only in the authed write `.then()` (immediate for guests); error stays in `.catch`.
- [x] A4 — Curator chat messages keyed by index — `useCurator.jsx` (module `msgSeq` → `id` on every message) + `CuratorOverlay.jsx` (key on `m.id`).
- [x] A5 — useTilt rAF not cancelled on unmount — `useTilt.js` — added `useEffect(() => () => cancelAnimationFrame(raf.current), [])`.
- [x] A6 — Duplicate API fetches — ROOT CAUSE: the **Dockerfile** pinned the whole build stage to `ENV NODE_ENV=development` (to force the vite devDep to install), which leaked into `vite build` → the server shipped a **DEV build of React**: ~2× vendor (107KB vs 58KB gz) AND StrictMode double-invoking every effect = the duplicate /api calls. Fixed: removed the stage-wide env, build now runs `NODE_ENV=production npm run build` (devDeps still forced by `--include=dev`). Resolves the double-fetch AND halves the vendor bundle. [Corrects an earlier wrong "deploy-stale" call — confirmed double-fetch persisted on a fresh deploy until this Dockerfile fix.]

## Cluster B — Backend + security
**Files:** `routes/auth.js`, `routes/list.js`, `routes/history.js`, `models.js`, `lib/auth.js`, `routes/history.test.js` (new), `lib/auth.test.js`, `nginx.conf`
**Verify:** `cd backend && npm test`. Commit at end.

- [x] B1 — signup 500 on non-string input — `routes/auth.js` — coerce `String(req.body?.email ?? "")` etc. before `.trim()`/`.toLowerCase()`. Test added.
- [x] B2 — signup unique-email TOCTOU 500 — `routes/auth.js` — try/catch `UniqueConstraintError` → `409 email_taken` (kept fast-path findOne).
- [x] B3 — case-sensitive email uniqueness — `models.js` — `set()` lowercases+trims on assignment, so every write normalizes and the `unique` index enforces case-insensitive uniqueness at the DB. (Functional `LOWER(email)` index unneeded once all writes are lowercased.)
- [x] B4 — `filmId` now validated against the full catalog. `build-films.mjs` emits `EXTRA_IDS` (game/course); `curatorPrompt.js` exports `TITLE_IDS` = films ∪ extras; `/list` POST + `/history` PUT 400 on `unknown_film`. Curator still recommends `FILM_IDS` only. Tests: rejects junk, still accepts the game (`neon-drift`).
- [x] B5 — REST status codes — `list.js` POST branches `201`(created)/`200`(no-op); `list.js` DELETE + `history.js` PUT → `204`. Tests updated.
- [x] B6 — login lockout per-IP only — `lib/auth.js` `rateLimit` gained optional `keyFn`; `routes/auth.js` login adds a per-email bucket (10 / 15 min). Tested.
- [x] B7 — tests — added `routes/history.test.js` (clamp + 204 + scope) and `lib/auth.test.js` (limiter: first-hit/increment/429/window-reset/keyFn-skip/fail-open).
- [x] B8 — CSP hardening — `nginx.conf` (both blocks) — appended `object-src 'none'; base-uri 'self'; form-action 'self'`.

## Cluster C — Accessibility
**Files:** `App.jsx`, `pages/Collection.jsx`, `pages/Downloads.jsx`, `components/CuratorOverlay.css`, `components/Hero.css`
**Verify:** Playwright a11y snapshot + contrast math. Commit at end.

- [x] C1 — focus dropped on async/skeleton pages — `App.jsx` RouteReset now falls back to `#main` (tabIndex -1) when no `<h1>` exists yet — generic fix for every skeleton-first page, not just Collection.
- [x] C2 — Downloads status by color+`title` only — `Downloads.jsx` — added `.sr-only` text per state ("Downloading, 62%" / "Expiring…" / "Downloaded"); removed the unreliable `title`.
- [x] C3 — Curator placeholder fails AA (4.33:1) — `CuratorOverlay.css` — placeholder → `--text-secondary` (paper-300 ≈ 6.0:1).
- [x] C4 — near-invisible inactive affordances — `Hero.css` — inactive dot + the pause control bumped `--white-a18` → `--white-a40` (≈3.5:1).
- [x] C5 — Curator send button implicit height — `CuratorOverlay.css` — explicit `height: 40px`.

## Cluster D — Design-system tokens
**Files:** `styles/tokens.css` + component/page CSS; optional shared `<Icon>` component
**Verify:** screenshots before/after key screens (no visual change intended except intentional ones). Commit at end.

- [x] D1 — wordmark sized 4 ways — added `--type-wordmark{,-lg,-sm}` + `--track-wordmark` to `tokens.css`; NavBar/Auth/Welcome/Footer now consume them (Auth 26→24 consolidated; tracking unified).
- [x] D3 — CuratorOverlay off-system (partial) — send button `50%`→`--radius-full`; placeholder/height already fixed in C. (px-padding micro-tweaks left as cosmetic.)
- [x] D6 — tab-bar clearance 3 magic numbers — added `--tabbar-clearance: 84px`; `global.css`, `CuratorFab.css`, `ToastHost.css` (= clearance + `--space-3`) now derive from it.
- [x] D2 — added `--type-display-s: 600 16px/1.2`; consumed in `TitleDetail.css` (lesson number) + `Browse.css` (genre-card caption).
- [x] D4 + D8 — added channel tokens `--ink-950-rgb` / `--ink-900-rgb`; the Watch player scrims (×4) and the one-off component label/dim scrims (Rail, Browse, Welcome, Auth) now reference them via `rgb(var(--ink-Xrgb) / a)` — no more raw `7 6 6` / `13 12 11` triplets in components, identical render.
- [x] D5 — icon strokes converged to a clean two-tier: **1.5** (house, 40 uses) + **1.8** (small-glyph tier, 11); the 1.4/1.6 outliers normalized to 1.5.
- [x] D7 — deleted the redundant local `:focus-visible` blocks in `Browse.css` (×2) and `Auth.css` (the global `:focus-visible` already applies the ring).
- [~] D9 — micro-nits left (NeonDrift scoped palette, `--pad-badge`, Info width → `--measure`, `--hover-lift-control`): truly cosmetic, ~zero visible/functional value; intentionally skipped.

## Cluster E — UX flows
**Files:** `App.jsx`, `pages/Welcome.jsx`, `pages/Home.jsx`, `pages/FilmDetail.jsx`, `pages/TitleDetail.jsx`, `components/Rail.jsx`, `pages/Profile.jsx`, `pages/Settings.jsx`, `components/CuratorOverlay.jsx`, `components/CuratorFab.jsx`, `pages/Genre.jsx`, `pages/Watch.jsx`, `lib/useMyList.js`
**Verify:** Playwright walkthrough of each touched flow. Commit at end.

- [x] E1 — onboarding orphaned + broken promise — App `HomeGate` redirects first-visit `/`→`/welcome`; Welcome stepper now honest "2 of 2" (2 dots); picks persisted to `nux-genre-prefs` + onboarding/Tour flags set; Home renders a real "Because you like {genre}" rail first (verified live: redirect, stepper, personalized rail). `GENRE_MATCH` moved to `catalog.js` (shared, keeps Genre code-split).
- [x] E2 (lite) — dropped the game's dead "Watch trailer" link (`TitleDetail.jsx`) — the only true dead-end. Watch "Back to film page" copy is correct now that only films reach the player.
- [x] E3 — dead buttons — Settings Privacy/Terms → `/p/*` links, Manage devices → "Demo"; Profile Help & Support → `/p/help`, Notifications + Subscription → "Demo".
- [x] E7 (lite) — genre eyebrow "Collection" → "Genre" (taxonomy). Empty genres already render a graceful "Coming soon" state.
- [x] E2 (full) — `/film` and `/title` now unify: a non-film on `/film` redirects to `/title`, a film on `/title` redirects to `/film` (canonical per type, no divergence). TitleDetail gained a "More to explore" rail so game/course pages aren't terminal.
- [x] E4 — Curator header now carries a persistent tagline ("Describe a mood — I'll pull real picks from the catalogue") so its purpose is clear beyond the empty state.
- [x] E5 — `Rail` only renders "See all" when it has a real destination; the finite editorial rails (shown in full) + Continue Watching no longer link misleadingly to the generic grid. Collections/personal/genre rails keep theirs.
- [x] E8 — signing in now MERGES a guest's saved titles into the account (dedupe server-side) instead of silently dropping them, with a "Saved titles synced to your account" toast.
- [~] E6 — Hero "Trailer" tag SKIPPED: the player facade already discloses "Play trailer"; a tag would clutter the cinematic hero for marginal gain (audit itself called the current behavior "defensible").

## Cluster F — Performance: preloads
**Files:** `frontend/index.html`, `pages/FilmDetail.jsx`, `lib/usePageTitle.js`
**Verify:** Playwright network panel. Commit at end.

- [x] F1 + F2 — DELIVERED VIA H's per-route prerender (static, the real LCP win a runtime preload can't give): each `/film/:id` (and collection/genre) page bakes a `<link rel=preload as=image fetchpriority=high>` for its backdrop/cover; the home hero still preload is emitted ONLY on `/` (gone from every other prerendered route, fixing the "preloaded but not used" waste).

## Cluster G — Performance: assets (heavy)
**Files:** `public/assets/**`, `main.jsx`, `index.html`, build tooling
**Verify:** report build/asset sizes (target images 8.6MB→~2MB, fonts 290KB→~110KB). Commit at end.

- [x] G1 (resize) — in-place `sips` downscale of the oversized-for-display art (no markup/format change, grade preserved): **cast 4.7M→1.2M** (−74%; were 500×630 shown at 96px), posters 1.6M→1.4M (kept 600px for the TitleDetail poster-hero use). Stills left alone (`srcSet`-managed, shown large). Net ~3.7M off.
- [x] G1 (webp) — DONE via Pillow (already installed, no system change). 117 `.webp` siblings generated (catalog imagery **4.7MB → 1.5MB, −69%** for webp-capable browsers); nginx serves them through `map $http_accept` + `try_files $uri$webp_suffix $uri` with the original jpg as guaranteed fallback and an explicit `types{}` for correct Content-Type — zero markup change, images can't break. Regenerate after image changes: `python3` Pillow loop over `public/assets/**/*.jpg`.
- [~] G2 (font subset) — DEFERRED (risk): `pyftsubset` is available, but the win requires replacing the `@fontsource` pre-subset variable files with self-hosted subset `@font-face` + exhaustive glyph coverage (curly quotes, em dashes, ë/é/ö) to avoid tofu — a careful, glyphhanger-verified pass, not a safe pre-deploy rush. The cast resize already captured the largest asset win (~3.7M).

## Cluster H — SEO (heavy / architectural)
**Files:** `vite.config.js`, build scripts, `index.html`, `pages/Collection.jsx`, `pages/Genre.jsx`, `public/robots.txt`
**Verify:** `curl` served HTML per route shows real `<head>`+body. Commit at end.

- [x] H1 — broken share cards — `scripts/prerender.mjs` (post-`vite build`) bakes a correct per-route `<head>` (title/description/OG/Twitter/canonical/LCP-preload + JSON-LD) into static HTML for home, browse, all 21 films, the collection, 10 live genres, 4 info pages. nginx serves them via `try_files $uri/` (no nginx change). **Verified live: `/film/the-third-man` serves the right card + boots the SPA.** Robust (per-route try/catch, never fails the build).
- [x] H2 — sitemap — generated from the catalog by the same script: **38 URLs** (was 7), auth/watch/account excluded.
- [x] H3 — per-route OG image — films→backdrop, collections→`col.cover`, genres→genre image (in the prerendered head; the runtime `usePageTitle` still sets them for JS clients).
- [x] H4 — OG polish — `og:image:width/height` (for the 1200×630 default), `og:image:alt`, and `WebSite`+`Organization` JSON-LD on home.
- [x] H5 — robots — `public/robots.txt` disallows `/watch/ /profile /settings /downloads /signin /signup /forgot /reset`; stale static `sitemap.xml` removed (now generated).

---

## Checkpoint protocol
After each cluster: run its verify step, commit with a `fix(<area>): …` message, post a short report (what changed, what was verified, any deviations), then proceed to the next cluster.
