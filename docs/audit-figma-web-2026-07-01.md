# NUX — Figma + Web Audit (2026-07-01)

**Scope:** Figma file `UPtAtDiB37eSssdOGZ8nrq` (design system, components, all screens) + live web app (`app.nux.ontwrpn.com`) incl. responsive 320–1920 and PWA + landing (`nux.ontwrpn.com`).
**Method:** programmatic Figma scans (Plugin API, read-only) + visual screenshot review; live Playwright sweep at 320/390/834/1440/1920; three parallel code audits (design-system tokens, WCAG 2.2 AA, PWA/perf) with live curl probes. Bar: "would a staff designer/engineer at a FAANG-tier streamer sign this off?"

## Grades

| Surface | Grade | One-liner |
|---|---|---|
| Figma — design system & components | **A** | Variables/styles/state coverage is exemplary; only cosmetic debt |
| Figma — screens (wireframe + hi-fi) | **B+ → A−** | Visual quality high, prototypes wired; loses points to parked junk frames, placeholder repetition, unstyled wordmarks |
| Web app (live) | **A−** | Token discipline, a11y and PWA are top-decile; a few config-level bugs |
| Landing (live) | **A−** | Strong visuals, reduced-motion done right; type-ramp raws + token drift |

Overall: this *does* read as a real product at a serious-company bar. The gaps below are the difference between "very good portfolio" and "indistinguishable from a shipped FAANG surface."

---

## 1. Figma — Design System (page 0:1) — A

**Verified excellent**
- 3 variable collections: Primitives (31), semantic **Wireframe ↔ Hi-Fi two-mode** collection (35), Spacing & Radius (21). 37 text styles (13 core + 7 tvOS + 17 HiFi), 9 effect styles, **0 paint styles — 100% of color goes through variables**.
- Hi-Fi Foundations sheet documents the surface ladder with **inline contrast ratios** (17.0 / 8.4 / 5.2 : 1) and the "Amber — ink, not foil (≤10% of screen)" rule. That's staff-level documentation practice.
- Wireframe screens page: **0 unstyled texts, 0 raw fills, 0 off-grid paddings, 0 ghost spacers, 0 frame overlaps** (scanned 1,319 nodes).

**Findings**
| # | Issue | Fix | Sev |
|---|---|---|---|
| F1 | Foundations sheet is partial: shows 6 of 21 space tokens, 10 of 35 semantic roles, no elevation/effects, no iconography (58-glyph Icon set undocumented), no motion section; type sheet omits Body/Base 16 | Extend the two Foundations frames (spacing incl. 48–120, effects row, icon grid, Body/Base row) | Med |
| F2 | Semantic collection is *named* "Wireframe" but holds both Wireframe + Hi-Fi modes | Rename collection to `Semantic` / `Theme` (modes keep their names) | Low |
| F3 | `HiFi/Metadata` = 12.5px — the only half-pixel size in the system | Snap to 12 or 13, or comment why 12.5 | Low |

## 2. Figma — Components (pages 1:2, 557:334) — A

**Verified excellent:** 43 wireframe + 47 hi-fi components in tiled auto-layout showcases; Button 45 variants (3×3×5 states), Icon 58 true-SF-Symbol glyphs, full Default/Hover/Pressed/Focus/Disabled coverage with tokenized deltas; descriptions on nearly all masters; Interaction States board with live instances. Component hygiene scan: 0 ghost spacers, ≤1 raw fill per page.

| # | Issue | Fix | Sev |
|---|---|---|---|
| C1 | **Stepper (953:356)** exists only in wireframe (no `HiFi/Stepper`), has no description, and sits at page top level **outside the Showcase frame** | Add HiFi twin, write description, tile it into Showcase | Med |
| C2 | `HiFi/CuratorFab` + `HiFi/TourTooltip` have no descriptions | Write the two descriptions | Low |
| C3 | Scaffolding frame "🎯 SF Source — Batch 3 (paste here)" still parked at x=−3000 on the Components page | Delete (batch was absorbed long ago) | Low |

## 3. Figma — Screens (pages 616:334, 571:1404) — B+/A−

**Verified excellent:** 35 wireframe + 49 real hi-fi frames across iPhone/iPad/Desktop/tvOS incl. loading/empty/offline/no-results states; no frame overlaps; grid discipline; prototypes intact — **304 reactions (299 navigate + 5 back), 5 named flow starts per fidelity**; Home Desktop / tvOS / Film Detail Desktop / Curator look genuinely shippable.

| # | Issue | Fix | Sev |
|---|---|---|---|
| S1 | **13 unnamed frames "Frame 1–13"** (590×1278, x≈26k–31.7k on the Hi-Fi screens page) — pasted live-app QA screenshots with red bug markup, sitting unnamed among portfolio frames | Move to a dedicated `🔬 QA / Annotations` page (or delete if the bugs are fixed); name them | **High** |
| S2 | **Placeholder repetition in hi-fi rails:** on Home — Desktop the "New Restorations" and "The Curator's Shelf" rails show the *same 7 posters in the same order*. Acceptable in wireframe; in hi-fi it reads as a data bug at review | Shuffle one rail to a distinct film set (12 poster swaps) | **High** |
| S3 | **64 unstyled texts** on the Hi-Fi page — mostly `NUX` wordmarks (a `HiFi/Wordmark` style *exists* but isn't applied) and Curator ✦/"Ask the Curator" labels | Batch-apply HiFi/Wordmark + UI styles (scriptable in one pass) | Med |
| S4 | **iPhone Home hero legibility:** scrim too weak mid-hero — poster credits ("Alec Guinness… / cast strip") visibly fight the My List button and meta row; white status-bar glyphs sit on the light desert area of the art | Extend/darken the hero scrim to cover the action row; add a top gradient behind the status bar | Med |
| S5 | Film Detail — Desktop has a **"Reviews" tab but no Reviews section** on the frame (More Like This / Cast & Crew / Details all exist) | Add a minimal Reviews block or drop the tab | Med |
| S6 | Platform coverage asymmetry: Player/Auth/Profile/Settings/Downloads/Search-Active are iPhone-only; Genre is Desktop-only; Collection/Curator lack tvOS; iPad/Desktop **Play is unwired in prototypes because no Player frame exists there** | Conscious scope — но добавить Player — Desktop закрыл бы и прототип-дырку (Play → ничего) | Med |
| S7 | 12 off-grid paddings (pager itemSpacing 10; hero-pause/tc = 3) + 101 fractional coords on hi-fi page | One binder/rounding pass (same script as June) | Low |
| S8 | Wireframe page lacks counterparts for 13 hi-fi screens (Curator, Collection, Genre, Tours, hero variants) | Fine directionally (hi-fi выросла дальше wireframes) — document in case study, not a defect | Info |

**Figma↔build drift (для кейса, не дефект):** live Film Detail не имеет Download-кнопки и таб-ряда, которые есть в Figma hi-fi; Figma опережает билд. В кейсе не обещать полный паритет.

---

## 4. Web app (live) — A−

**Responsive sweep (Playwright, live):** Home / Browse / Film Detail / Watch / My List at 320, 390, 834, 1440, 1920 — **0px horizontal overflow everywhere**, layouts collapse correctly (bottom tab bar + detached search on mobile, top nav ≥834, genre grid 2→3-up). Console: **0 errors**. June's R-1 ("834 falls into desktop branch") looks fine in practice — desktop nav at 834 is comfortable; deprioritize.

**PWA runtime (live):** SW registered + controlling, workbox precache + `media` cache present (11 MB), manifest complete (`id` pinned, standalone, icons 192/512/maskable reachable), iOS metas present. Caching strategy per resource type is textbook (HTML NetworkFirst, images CacheFirst bounded, **`/api/list`+`/api/history` deliberately uncached** — privacy-conscious).

| # | Issue | Evidence / Fix | Sev |
|---|---|---|---|
| W1 | **`viewport-fit=cover` missing** from the viewport meta on both domains → all 12 `env(safe-area-inset-*)` call sites (tab bar, toasts, FAB, player) resolve to 0 on notched iPhones — the installed-PWA experience this was built for | Add `, viewport-fit=cover` in `frontend/index.html` + `landing/index.html` | **High** |
| W2 | **Hero preload fires on every route** — `/browse`, `/film/*`, `/watch/*` all preload the Lawrence still and never use it (console warning, ~66–150 KB wasted per cold non-Home visit) | Inject the preload from the Home route (or `media`-gate it), not global `index.html` | Med |
| W3 | `sw.js` + `workbox-*.js` served `max-age=31536000, immutable` (generic nginx `.js` block). Mitigated in practice: modern browsers bypass HTTP cache for the top-level SW script, and workbox chunk is hash-named — but it's still wrong for older browsers and future non-hashed imports | nginx: `location = /sw.js { add_header Cache-Control "no-cache"; }` above the generic regex | Med |
| W4 | Curation notes (`note={REASONS[id]}`) still Home-only — Browse/Genre/My List grids show bare posters (June V-1: "curation invisible exactly where choice happens") | Pass `note=` in `Browse.jsx`/`Genre.jsx`/`MyList.jsx` | Med |
| W5 | Player settings menu (gear → Speed/Quality) never returns focus to its trigger on close (Esc/outside-click) — WCAG 2.4.3; pattern already correct in `CuratorOverlay.jsx` | Mirror `lastFocusedRef` in `Watch.jsx` | Med |
| W6 | No automated a11y gate (axe) in vitest/CI despite real test infra | `jest-axe` under Vitest on Home/Browse/FilmDetail/Watch/Curator | Med |
| W7 | `-webkit-tap-highlight-color` + `overscroll-behavior` still absent (June HIG-3/4) | 2 lines in `global.css` | Low |
| W8 | `.player-menu` lacks a `max-width: calc(100vw - 24px)` floor (unverified at 320 with menu open) | Copy the `Tour.css` pattern | Low |
| W9 | Decorative SVGs in `Profile.jsx`/`Rail.jsx`/`Watch.jsx` (7 spots) miss `aria-hidden="true"` (95% of codebase has it) | Add the attribute | Low |
| W10 | Manifest lacks `screenshots`/`shortcuts` (richer Android/desktop install sheet) | Add 2 screenshots + My List / Curator shortcuts | Low |

**Corrected finding:** the a11y agent flagged "Home has no `<h1>`" — **false**: `Hero.jsx:70` renders `<h1 class="hero-title" tabindex="-1">`, present live, and route-focus targets it. No action.

**Contrast (computed from tokens):** every shipping text pair passes AA — text/primary 17.0:1, secondary 8.4:1, tertiary 6.3:1, amber-on-ink 7.07:1, and the CTA is correctly **dark-on-amber** (7.07:1; white-on-amber would be ~2.2:1). Focus ring passes 3:1 on all dark surfaces (only theoretical fail on paper surfaces — none shipping).

## 5. Design system in code — A−

Full report from the token audit (highlights):
- **1,685 `var()` refs** (up from 1,229 in June); 0 unjustified hex in UI chrome; shadows all tokenized but 2; NeonDrift palette a correctly documented diegetic exception.
- **Open items:** `landing/tokens.css` drifted again (missing `--surface-chip`) and **CI still has no token-drift guard** (copy the existing `catalog-drift` job pattern); landing has **34 raw font-sizes / 12 distinct values** (needs 3–4 `--type-landing-*` tokens); **no `--z-*` scale** (~35 raw z-index sites); `--type-pullquote` still missing (4 hand-rolled quote treatments); 8 dead tokens; `.chip` vs `.curator-chip` duplicate primitive; 5 `var(--x, #hex)` fallback duplicates in `landing.css`.

## 6. Landing (live) — A−

0 overflow at 320/390/1440; poster-dome hero with **double-gated reduced-motion** (JS + CSS) and 44px touch targets; pricing section clean on mobile; security headers + HTTP/2 + webp negotiation (−56%) verified live.

| # | Issue | Fix | Sev |
|---|---|---|---|
| L1 | Hero hint reads "move your cursor to look around" on touch devices | Swap copy under `(pointer: coarse)` → "drag to look around" | Low |
| L2 | Type-ramp raws + token drift (see §5) | — | Med |
| L3 | Legacy zombie-SW on nux.* for pre-move installs (known, deferred) — 10-line self-unregistering SW when convenient | — | Low |

---

## Priority queue (what actually moves the FAANG needle)

1. **W1** `viewport-fit=cover` (one line ×2 files — unlocks 12 already-written safe-area rules)
2. **S1** rehome/delete the 13 unnamed QA frames (file credibility)
3. **S2** de-duplicate the Desktop Home rails (hi-fi believability)
4. **DS** re-sync landing tokens + add the CI token-drift job (kills the recurring drift class)
5. **W2** route-scope the hero preload; **W3** sw.js no-cache location
6. **S3** batch-apply HiFi/Wordmark + Curator text styles (scriptable)
7. **W4** curation notes on Browse/Genre/MyList; **W5** player-menu focus return
8. **S4** iPhone hero scrim; **S5** Reviews tab; landing type tokens; z-index scale
9. Backlog: Player — Desktop frame (+ prototype wiring), axe CI gate, manifest screenshots/shortcuts, tap-highlight/overscroll, dead tokens

---

## Fix pass — 2026-07-01 (evening). Status: applied, NOT committed

**Code (32 files, +503/−116, `npm test` 22/22 incl. new jest-axe gate, both builds green):**
W1 `viewport-fit=cover` both apps · W2 hero preload now home-only (per-route prerender + `dist/__fallback.html` noindex fallback, nginx `try_files → /__fallback.html`) · W3 nginx `location = /sw.js` no-cache · W4 `note={REASONS[id]}` on Browse/Genre/MyList · W5 player menu focus-return (`lastFocusedRef`) · W6 jest-axe smoke gate (Home+Browse) · W7 tap-highlight + overscroll-behavior · W8 `.player-menu` max-width floor · W9 `aria-hidden` on 8 decorative SVGs · W10 manifest `screenshots`×2 + `shortcuts`×3 + `categories` · DS: `--type-pullquote`, `--z-*` scale (12 files migrated), `--shadow-control`/`--shadow-input-inset`, 8 dead tokens deleted, 4× `--border-strong` re-aliased, chips harmonized, landing type ramp → 6 local tokens (all raw font-sizes tokenized or one-off-commented), pullquotes on token, `var()` hex fallbacks dropped, `--space-7`→`--btn-lg-pad-x`, `.wall img`→`--radius-poster`, touch hint copy swap, tokens re-synced + **`token-drift` CI job added**.

**Figma:** 13 QA frames → new page `🔬 QA — Annotations` (named) · Curator's Shelf de-duped (7 distinct films, DOC→FILM variants fixed) · 55/64 texts styled (9 glyph marks left by design; +2 styles: `HiFi/Wordmark L`, `HiFi/Display S`) · iPhone hero scrim full-height + status-bar band · **Reviews section** on FD Desktop (2 critic cards, token-bound) · **Player — Desktop · Hi-Fi built** + Play wired on FD/Home Desktop + Back→BACK · 18 off-grid gaps snapped to `space/*`, 4 fractional coords rounded · collection renamed **Semantic** · `HiFi/Stepper` twin created (amber, Hi-Fi mode) · Stepper tiled into Showcase + descriptions (Stepper/CuratorFab/TourTooltip) · `HiFi/Metadata` 12.5px rationale documented in the style · scaffold frame deleted · `🧭 Foundations — Addendum` frame added (upper spacing scale, Body/Base + new styles, radii xs/poster, effects, 16-glyph icon row).

**Deliberately not done:** ✦/✕/↑ glyph texts (9) not converted to Icon instances; iPad Player frame (Desktop only); FD tabs in CODE still lag Figma (Download/tabs/Reviews — next build item).

**Verified strengths to keep saying out loud in the case study:** two-mode token architecture (same screens, Wireframe↔Hi-Fi variable modes) with contrast ratios documented *inside* Figma; 0-paint-style all-variable color; 45-variant state-complete Button; dark-on-amber CTA decided by math; privacy-aware SW caching; reduced-motion double-gating; 0 console errors and 0 overflow across 5 viewports live.
