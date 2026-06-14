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
- [x] A6 — Duplicate API fetches — RESOLVED, no code change. HEAD is clean: local prod-preview fires each endpoint **once** (single callers, traced). The 2×/4× seen live was the **stale deployed artifact** (vendor 352KB vs HEAD 179KB). Fix = redeploy from `main`. (Did NOT remove StrictMode — it's inert in prod.)

## Cluster B — Backend + security
**Files:** `routes/auth.js`, `routes/list.js`, `routes/history.js`, `models.js`, `lib/auth.js`, `routes/history.test.js` (new), `lib/auth.test.js`, `nginx.conf`
**Verify:** `cd backend && npm test`. Commit at end.

- [x] B1 — signup 500 on non-string input — `routes/auth.js` — coerce `String(req.body?.email ?? "")` etc. before `.trim()`/`.toLowerCase()`. Test added.
- [x] B2 — signup unique-email TOCTOU 500 — `routes/auth.js` — try/catch `UniqueConstraintError` → `409 email_taken` (kept fast-path findOne).
- [x] B3 — case-sensitive email uniqueness — `models.js` — `set()` lowercases+trims on assignment, so every write normalizes and the `unique` index enforces case-insensitive uniqueness at the DB. (Functional `LOWER(email)` index unneeded once all writes are lowercased.)
- [~] B4 — DEFERRED (low severity, self-pollution only). Validating against `FILM_IDS` would break adding the **game/course** to My List (backend catalog is films-only; `/title/neon-drift` offers "My List"). Correct fix = extend backend catalog to include extras. Existing ≤100-char guard stays.
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
- [~] D2, D4, D5, D7, D8, D9 — DEFERRED (cosmetic / invisible token-naming): display-s gap, Watch scrim renaming (identical render), icon-stroke normalization (~15 subtle inline-SVG edits), focus-visible dedupe (global already applies), scrim-card-label, nits. No user-visible change; safe follow-up batch.

## Cluster E — UX flows
**Files:** `App.jsx`, `pages/Welcome.jsx`, `pages/Home.jsx`, `pages/FilmDetail.jsx`, `pages/TitleDetail.jsx`, `components/Rail.jsx`, `pages/Profile.jsx`, `pages/Settings.jsx`, `components/CuratorOverlay.jsx`, `components/CuratorFab.jsx`, `pages/Genre.jsx`, `pages/Watch.jsx`, `lib/useMyList.js`
**Verify:** Playwright walkthrough of each touched flow. Commit at end.

- [x] E1 — onboarding orphaned + broken promise — App `HomeGate` redirects first-visit `/`→`/welcome`; Welcome stepper now honest "2 of 2" (2 dots); picks persisted to `nux-genre-prefs` + onboarding/Tour flags set; Home renders a real "Because you like {genre}" rail first (verified live: redirect, stepper, personalized rail). `GENRE_MATCH` moved to `catalog.js` (shared, keeps Genre code-split).
- [x] E2 (lite) — dropped the game's dead "Watch trailer" link (`TitleDetail.jsx`) — the only true dead-end. Watch "Back to film page" copy is correct now that only films reach the player.
- [x] E3 — dead buttons — Settings Privacy/Terms → `/p/*` links, Manage devices → "Demo"; Profile Help & Support → `/p/help`, Notifications + Subscription → "Demo".
- [x] E7 (lite) — genre eyebrow "Collection" → "Genre" (taxonomy). Empty genres already render a graceful "Coming soon" state.
- [~] E2 (full), E4, E5 (static-rail see-all; note: the personal rail DOES link `/genre/:id`), E6, E8 — DEFERRED (Medium polish; app works without them): full `/film`·`/title` template merge + related rail, Curator header sub-line, static-rail see-all destinations, Hero trailer tag, guest→account merge toast.

## Cluster F — Performance: preloads
**Files:** `frontend/index.html`, `pages/FilmDetail.jsx`, `lib/usePageTitle.js`
**Verify:** Playwright network panel. Commit at end.

- [ ] F1 — FilmDetail LCP backdrop not preloaded — `FilmDetail.jsx:132,139` + `usePageTitle.js` — inject dynamic `<link rel=preload>` per film.
- [ ] F2 — hero preload wasted on non-Home routes (live warning) — `index.html:14` — move to Home-only runtime preload.

## Cluster G — Performance: assets (heavy)
**Files:** `public/assets/**`, `main.jsx`, `index.html`, build tooling
**Verify:** report build/asset sizes (target images 8.6MB→~2MB, fonts 290KB→~110KB). Commit at end.

- [ ] G1 — images 8.6MB unoptimized — re-encode webp/avif + resize to ~2× display (cast 192², posters ~400×600, Red Shoes still); `<picture>` or Vite image plugin; keep warm-mono grade.
- [ ] G2 — fonts 290KB — subset 3 families to used glyphs (Latin + `ë é ö`), preload LCP fonts; or drop Newsreader (-92KB) if subsetting deferred.

## Cluster H — SEO (heavy / architectural)
**Files:** `vite.config.js`, build scripts, `index.html`, `pages/Collection.jsx`, `pages/Genre.jsx`, `public/robots.txt`
**Verify:** `curl` served HTML per route shows real `<head>`+body. Commit at end.

- [ ] H1 — no SSR → broken share cards — prerender public routes at build (`vite-react-ssg`/prerender plugin), route list from `catalog.js`+collections+genres.
- [ ] H2 — sitemap omits 26 films/genres — generate `sitemap.xml` from catalog at build (exclude auth/watch).
- [ ] H3 — collections/genres no per-route OG image — `Collection.jsx:56`, `Genre.jsx:41` — pass `col.cover`/genre still as OG image.
- [ ] H4 — OG polish — `index.html` — `og:image:width/height/alt` + static `WebSite`+`Organization` JSON-LD.
- [ ] H5 — robots — disallow `/watch /profile /settings /downloads /reset /forgot`.

---

## Checkpoint protocol
After each cluster: run its verify step, commit with a `fix(<area>): …` message, post a short report (what changed, what was verified, any deviations), then proceed to the next cluster.
