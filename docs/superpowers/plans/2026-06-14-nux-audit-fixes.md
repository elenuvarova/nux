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

- [ ] B1 — signup 500 on non-string input — `routes/auth.js:50` — coerce `String(req.body?.email||'')` / `String(req.body?.name||'')` before `.toLowerCase()`/`.trim()`.
- [ ] B2 — signup unique-email TOCTOU 500 — `routes/auth.js:62` — try/catch `UniqueConstraintError` → `409 email_taken`.
- [ ] B3 — case-sensitive email uniqueness on PG — `models.js:11` — model `set()` lowercases on assignment; functional unique index `LOWER(email)` (or document citext).
- [ ] B4 — unvalidated `filmId` writes — `routes/list.js:30`, `routes/history.js:32` — validate against `FILM_IDS` set → 400 on miss.
- [ ] B5 — REST status codes — `list.js:36` (201→200 on idempotent no-op), `history.js:42` + `list.js:54` (→ 204).
- [ ] B6 — login lockout per-IP only — `lib/auth.js:80-104` + `routes/auth.js:75` — add per-email limiter bucket.
- [ ] B7 — missing tests — add `routes/history.test.js` (clamp + upsert) + rate-limiter unit test (window rollover, 429 boundary).
- [ ] B8 — CSP hardening — `nginx.conf` — append `object-src 'none'; base-uri 'self'; form-action 'self'`.

## Cluster C — Accessibility
**Files:** `App.jsx`, `pages/Collection.jsx`, `pages/Downloads.jsx`, `components/CuratorOverlay.css`, `components/Hero.css`
**Verify:** Playwright a11y snapshot + contrast math. Commit at end.

- [ ] C1 — focus dropped on async/skeleton pages — `App.jsx:41` (RouteReset: fall back to `#main`, re-fire when `aria-busy` clears) + `Collection.jsx:58-83` (render `<h1 tabIndex=-1>` in loading branch).
- [ ] C2 — Downloads status by color+`title` only — `Downloads.jsx:49-65` — `.sr-only` state text + `role=progressbar`/`aria-valuenow` for per-row %.
- [ ] C3 — Curator placeholder fails AA (4.33:1) — `CuratorOverlay.css:89-92` — `::placeholder { color: var(--text-secondary) }`.
- [ ] C4 — inactive carousel dots ~1.67:1 — `Hero.css:142-152` — bump inactive dot/badge border toward `--white-a40`.
- [ ] C5 — Curator send button implicit height — `CuratorOverlay.css:94-96` — explicit `height: 40px`.

## Cluster D — Design-system tokens
**Files:** `styles/tokens.css` + component/page CSS; optional shared `<Icon>` component
**Verify:** screenshots before/after key screens (no visual change intended except intentional ones). Commit at end.

- [ ] D1 — wordmark sized 4 ways — `tokens.css` (+`NavBar.css:32`, `Auth.css:43`, `Welcome.css:41`, `Footer.css:16`) — add `--type-wordmark` set, settle tracking.
- [ ] D2 — small-Fraunces gap — `tokens.css` add `--type-display-s: 600 16px/1.2` (+`TitleDetail.css:41`, `Browse.css:249`).
- [ ] D3 — CuratorOverlay off-system — `CuratorOverlay.css:30,32,54,90,95,96` — type/space/radius tokens; `50%`→`--radius-full`.
- [ ] D4 — Watch raw ink-950 scrims — `Watch.css:49,101,152,174` — player scrim tokens.
- [ ] D5 — icon stroke-width (1.4/1.5/1.6/1.8) — normalize to `1.5` (shared `<Icon strokeWidth>` default).
- [ ] D6 — tab-bar clearance 3 magic numbers — `tokens.css` `--tabbar-clearance` (+`global.css:30`, `CuratorFab.css:27`, `ToastHost.css:51`).
- [ ] D7 — duplicate local `:focus-visible` — delete from `Browse.css:56-60,96-100`, `Auth.css:104-108` (rely on global).
- [ ] D8 — one-off scrim alphas — `--scrim-card-label` token (Rail/Browse/Welcome/Auth).
- [ ] D9 — nits batch — NeonDrift scoped palette vars; `--hover-lift-control`; `--pad-badge`; Info width → `--measure-*`; stray font literals → `--type-*`.

## Cluster E — UX flows
**Files:** `App.jsx`, `pages/Welcome.jsx`, `pages/Home.jsx`, `pages/FilmDetail.jsx`, `pages/TitleDetail.jsx`, `components/Rail.jsx`, `pages/Profile.jsx`, `pages/Settings.jsx`, `components/CuratorOverlay.jsx`, `components/CuratorFab.jsx`, `pages/Genre.jsx`, `pages/Watch.jsx`, `lib/useMyList.js`
**Verify:** Playwright walkthrough of each touched flow. Commit at end.

- [ ] E1 — onboarding orphaned + broken promise — redirect first-visit `/`→`/welcome` (flag); honest "2 of 2" stepper (`Welcome.jsx:48`); persist picks + reorder ≥1 Home rail (`Welcome.jsx:72`, `Home.jsx`).
- [ ] E2 — `/film` vs `/title` split — both routes resolve any type & render correct template; film on `/title`→redirect `/film`; add related rail to TitleDetail; drop game "Watch trailer" link (`TitleDetail.jsx:64`); "film page"→"title page" copy (`Watch.jsx`).
- [ ] E3 — dead buttons — `Profile.jsx:113-131`, `Settings.jsx:45-71` — wire Privacy/Terms/Help→`/p/*`; label genuine mocks "Demo".
- [ ] E4 — Curator under-sells — header sub-line ("Describe a mood, I'll pull real picks") + one-time FAB hint.
- [ ] E5 — curated "See all"→generic Browse — `Rail.jsx:94`, `Home.jsx:38,54,61` — real `/collection/<slug>` destinations.
- [ ] E6 — Hero "Play" hides it's a trailer — `Hero.jsx` — "Trailer" tag matching `player-facade-cta`.
- [ ] E7 — empty genres dead-end — `Browse.jsx:189`, `Genre.jsx:42,53` — badge/hide empty; fix "Collection"→"Genre" eyebrow.
- [ ] E8 — silent guest→account list swap — `useMyList.js:37-56` — toast on first sign-in with a guest list.

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
