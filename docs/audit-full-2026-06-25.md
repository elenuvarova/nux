# NUX — Full Professional Audit (2026-06-25)

Comprehensive multi-dimension audit of the NUX project: the streaming app
(`frontend/`), the API (`backend/`), and the marketing site (`landing/`), plus
deploy, tests, and the portfolio artifacts. Ten independent specialist passes
(security, accessibility, code quality, performance, QA, design system, UX, SEO/
conversion, DevOps) benchmarked against a parallel research pass on how real-world
teams run testing & audits.

Method follows the industry standard finding format (severity · location · evidence
· impact · remediation) and a severity scale (Critical / High / Medium / Low / Nit).
**Report only — no code was modified.**

---

## Executive summary

**Overall posture: strong — well above the bar for a portfolio piece, and in
several places genuinely production-grade.** Every specialist independently reached
the same verdict: this is a disciplined, carefully built codebase by someone who
treats state, security, and accessibility as first-class. Both test suites are green
(**backend 95/95, frontend 20/20, ~2.6s**). The live two-account IDOR attack could
**not** penetrate any route. The app's prerender + JSON-LD SEO and the single-
container nginx/Docker deploy are things a reviewer will notice favourably.

The findings concentrate in three places, none of them a code-correctness emergency:

1. **One true operational risk — no database backups / DR** (DevOps, *Critical*).
   All real user data sits in Coolify Postgres with no scheduled backup or restore path.
2. **The landing surface has drifted from the app's discipline** — a cross-cutting
   theme that surfaces in *four* tracks: forked design tokens, off-ramp typography/
   spacing, divergent film data + forked `useTilt`, no analytics, duplicate homepage
   title. The app is the gold standard; the landing was built fast against fallbacks.
3. **The product's thesis ("curation as the product") is told, not shown** — the
   differentiator is missing from the atomic UI unit (the poster card) and the Curator
   doesn't justify per-pick. Plus one identity contradiction (free vs. "Premium
   membership" vs. "no account"). These are the highest-leverage *portfolio* fixes.

The single biggest user-facing performance win is unglamorous and isolated: **catalog
posters ship at 780×1170 into a 200×300 slot** — resizing cuts a poster from ~382KB to
~40KB (−90%), ~700KB → ~140KB on the Home screen.

### Findings by severity (aggregate)

| Track | Crit | High | Med | Low | Nit | Headline |
|---|---|---|---|---|---|---|
| Security | 0 | 0 | 3 | 4 | 2 | IDOR proven sealed; secrets clean; 3 hardening items |
| Accessibility | 0 | 2 | 5 | 4 | — | Strong baseline; Tour not inert, Settings toggle names |
| Code quality | 0 | 0 | 6 | 8 | 5 | Healthy; client/server cap desync; one unguarded setItem |
| Performance | 0 | 1 | 4 | 2 | — | Oversized posters; unused font; no brotli/preload |
| QA / tests | 0 | 3 | 3 | 2 | — | Strong backend; 0 UI/e2e tests; reset flow untested |
| Design system | 0 | 3 | 4 | 2 | 2 | Mature tokens; landing off-system; stale token JSON |
| UX | 0 | 3 | 6 | 5 | — | Curation invisible on cards; identity contradiction |
| SEO / conversion | 0 | 2 | 4 | 3 | — | App SEO excellent; landing uninstrumented |
| DevOps | 1 | 2 | 5 | 5 | — | No DB backups; CI not a deploy gate; no monitoring |

> Numbers are per-track counts from each specialist; several findings overlap across
> tracks (the landing drift, the `style-src 'unsafe-inline'`, the reset-flow gap), so
> the prioritized roadmap below de-duplicates them.

---

## 1. Security — posture: strong (0 Crit · 0 High)

The live two-account IDOR attack was run against every id-taking route (`/api/list`,
`/api/history`, `/api/scores/claim`, `/api/curator/history`) and **no route was
penetrable** — all user data is implicitly session-scoped (`WHERE UserId=req.user.id`),
the strongest design (no id to enumerate). Verified clean: `backend/.env` is gitignored,
untracked, and never in history; no keys in the client bundle; bcrypt cost-12 + 256-bit
session/reset tokens; reset is single-use, SHA-256-hashed, kills all sessions; login is
enumeration-safe with measured timing parity (~239ms both paths); CSRF Origin allowlist
fails closed in prod; the AI film-id allowlist prevents hallucinated output; non-root
container, full nginx security headers.

- **[Medium] CSP `style-src 'unsafe-inline'`** — `nginx.conf:25,82`. Defense-in-depth
  weakening (styles only, not scripts); move to nonce/hashed styles. *(Also raised by
  DevOps as Low — same item.)*
- **[Medium] Rate-limiter fails open on DB error** — `backend/lib/auth.js:107-111`. A DB
  hiccup silently removes brute-force protection at the worst moment. Fail *closed* for
  auth buckets (login/signup/forgot/reset) or add an in-memory fallback counter.
- **[Medium] Curator budget cap is in-memory / per-instance** — `backend/routes/curator.js:19-31`.
  Resets on redeploy, multiplies per instance. Back it with the existing DB rate-limit table.
- **[Low]** Dev-only `npm audit` highs (all under optional `sqlite3` chain, dropped from
  prod image; frontend highs are build-time only) · `rejectUnauthorized:false` on the
  external-DB SSL branch (not taken in prod) · account-keyed login limit enables soft
  lockout of a known email.

## 2. Accessibility — posture: strong (WCAG 2.2 AA, 2 High)

One of the most a11y-literate prototype codebases reviewed: skip link, focus moved to
`<h1>` on route change, `:focus-visible` discipline, `prefers-reduced-motion` honored on
*every* motion surface, three modals with focus trap + Esc + restore, labelled forms with
`aria-describedby`. The documented contrast ratios in `tokens.css` were independently
recomputed and **pass AA**.

- **[High] Tour coachmark doesn't inert the background** — `frontend/src/components/Tour.jsx:137-145`.
  `aria-modal="true"` is claimed but background stays focusable/clickable. Copy the proven
  `root.inert = true` pattern from `NeonDrift.jsx:363` (~5 lines). (SC 2.1.2 / 4.1.2)
- **[High] Settings value rows have run-on accessible names** — `frontend/src/pages/Settings.jsx:45-69`.
  "Download quality High" reads as one name with no state/popup semantics. `aria-hidden`
  the value span + `aria-describedby`, or add `aria-haspopup`. (SC 4.1.2)
- **[Medium]** Browse `role="status"` nested in `<h2>` + empty state not announced
  (SC 4.1.3) · rotating `<h1>` in Hero (SC 1.1.1 — design call, see UX) · landing marquee
  has no in-page pause, only OS reduced-motion (SC 2.2.2) · NeonDrift verified-dot label on
  a bare span is unreliable · confirm 320px/400% reflow with fixed chrome + scroll-lock.
- **Manual passes still owed:** real screen-reader run on the Watch player live region,
  trailer captions (third-party YouTube), forced-colors mode.

## 3. Code quality — posture: strong (0 High · tests green)

Backend is the standout: consistent `asyncHandler`, shared error shape, transactional
multi-writes, idempotent unique-index race handling. Frontend hooks handle the hard parts
(stale-fetch guards, optimistic rollback, focus/inert/scroll-lock).

- **[Medium] Watch-history cap desync** — client slices to 8 (`useWatchHistory.js:69`),
  server returns 12 (`history.js:20`). Continue Watching visibly shrinks after a local
  action. Share one `MAX_CONTINUE` constant.
- **[Medium] Unguarded `localStorage.setItem`** — `Browse.jsx:63`. The one place breaking
  the app's own "wrap setItem" convention; throws in Safari Private mode and breaks search.
- **[Medium] App↔landing data divergence** — `landing/src/data/films.js` uses different
  slugs (`third-man` vs `the-third-man`) than `catalog.js`; landing deep-links can 404.
  Generate landing data from `catalog.js` (reuse `build-films.mjs`) or add a slug-resolution test.
- **[Medium] `useTilt` forked**, landing copy is the weaker one (no live reduced-motion
  listener) · **[Medium]** rate-limiter check-then-increment race · history upsert recency
  path only mocked in tests.
- **[Low]** 3 dead `@fontsource-variable/*` deps · dead `ContinueCard` branches · unused
  `CONTINUE_WATCHING` export · health check authenticates pool but doesn't probe a table.

## 4. Performance — posture: strong, one real gap (1 High)

Measured via real builds + live curl. Frontend JS is small (**91KB brotli**), routes are
code-split (15 lazy chunks), posters are `React.memo`'d, tilt writes to the DOM via rAF, no
backend N+1, hot paths indexed, WebP negotiation works (−46%), LCP image preloaded.

- **[High] Catalog images 2–4× oversized, no `srcset`** — `frontend/src/components/Rail.jsx:53`.
  Posters ship 780×1170 into a ~200×300 slot. A single poster: 382KB JPEG / 309KB WebP →
  **~40KB at 400px (−90%)**. ~50 posters = ~700KB on Home → ~140KB. Add `srcset`/`sizes`
  (mirror `Hero.jsx`) and re-encode sources. **The biggest real-world win, mostly mobile LCP.**
- **[Medium] Newsreader font loaded but never used** — `--font-essay` referenced nowhere;
  20KB (28% of font payload) of dead, service-worker-precached weight. Remove or apply it.
- **[Medium] No font preload** — text paint waits on CSS parse; add one `<link rel=preload>`
  for the above-the-fold Fraunces.
- **[Medium] nginx serves gzip when browsers offer brotli** — JS leaves ~7–8% on the table;
  add `brotli_static`. *(DevOps owns the nginx change.)*
- **[Low]** WebP compresses the wrong-sized source (fix with the High item) · `useCollections`
  refetches on every Home mount (mitigated by SWR cache).

## 5. QA / tests — posture: solid backend, thin frontend (3 High)

Backend tests read like a spec (AI failover control-flow, allowlist, enumeration-safety,
IDOR scoping, input clamping, CSRF). Frontend is tested only at the hook/data layer.

- **[High] Password-reset flow has zero route tests** — `backend/routes/auth.js` forgot/reset.
  The second-most security-sensitive flow (token expiry, single-use, kill-all-sessions,
  transaction) ships unverified. ~8 supertest cases. **Highest-value single addition.**
- **[High] No e2e smoke for critical journeys** — signup→login→reload, My List add→reload,
  Curator→film. Both unit suites can be green while the frontend↔backend contract is broken.
  One Playwright spec wired into the existing docker-ci Postgres job.
- **[High] Authed/merge/rollback hook paths untested** — `useMyList`/`useWatchHistory` guest→
  account merge + optimistic rollback, and `useAuth` (the auth spine + 401→sign-out) are
  untested. Where silent data-loss bugs hide.
- **[Medium]** 0 component render tests (no empty/loading/error-state assertions; `setup.js`
  needs IntersectionObserver/ResizeObserver/rAF stubs first) · `server.js`/`/api/health` +
  `email.js` untested · model layer never hits a real DB (routes mock `models.js` wholesale).
- **[Low]** No coverage tool installed (`@vitest/coverage-v8` absent) · no CI a11y/audit/scan
  step · landing entirely untested.

## 6. Design system — posture: mature core, drifting edges (3 High)

A real three-tier token system (primitives → semantic → component), 8pt scale, documented
type ramp. The **app is exemplary**: 323 `var(--space-*)`, 88 tokenized `font:`, zero literal
transition durations, zero off-system hex. The problems are the landing + source-of-truth.

- **[High] Token source forked + stale** — `frontend/.../tokens.css` and `landing/.../tokens.css`
  are byte-identical *duplicates* (nothing keeps them synced); `design/tokens/*.json` encodes a
  **superseded indigo palette** (`#6650F5`) that no longer matches the shipped amber/ink. Make
  one canonical `tokens.css`; archive or regenerate the JSON.
- **[High] Landing bypasses the type ramp** — 55 literal `font-size` vs 3 `--type-*` uses
  (app: 88 token uses, 6 literals). Off-ramp sizes (`19px`, `22px`) fall between steps.
- **[High] Landing bypasses the spacing scale** — 9 `--space-*` uses; raw px throughout, several
  off the 4pt grid (`18/22/26/30/34px`). App uses `--space-*` 323×.
- **[Medium]** Landing re-implements `.btn` (different sizing model, raw transitions, reaches past
  the semantic layer) · rebuilds scrim/shadow recipes by hand (already drifting: 60px vs 80px) ·
  half-tokenized motion (`.15s/.2s/.6s` literals).
- **Verdict:** visually one brand *today*, but every divergence is a latent gap with no guardrail.

## 7. UX — posture: portfolio-grade, thesis under-told (3 High)

Not a happy-path prototype: every flow handles loading/empty/error/offline; My List has Undo;
focus/trap/reduced-motion/SR announcements throughout. The author's competitive heuristic eval
demonstrably shaped the build (onboarding is 2 steps + skippable; empty search has recovery).

- **[High] Curation rationale invisible on poster cards** — `Rail.jsx`. Cards show the same IA as
  any algorithmic streamer; the "why this" note (the differentiator vs. Shudder, per the author's
  own eval) is missing from the atomic unit. You already author per-film notes in `COLLECTIONS` —
  surface one line on editorial-rail cards. **Highest-leverage portfolio change.**
- **[High] Curator replies don't justify per-pick** — `CuratorOverlay.jsx`. The chat answers, then
  shows bare posters; extend the per-message `films` payload to `[{id, reason}]` and render the
  reason under each card. Turns "a search that talks" into "a curator that justifies."
- **[High] Identity contradiction** — signup says "Start your membership — cancel anytime";
  Profile shows "Premium / Subscription & Billing"; Terms says "no membership, payment or account."
  Pick one truth (free editorial showcase) and align `Auth.jsx`, `Profile.jsx`, `Info.jsx`.
- **[Medium]** Two overlapping first-run systems (Welcome + Tour repeat the pitch) · taste-step
  payoff is silent · logout lands on `/signin` (a wall, for a browse-anywhere product) · Games/
  Courses chips hard-empty the grid · the Curator (the headline feature) has no Home invitation.
- **[Low]** `/watch` deep-link `navigate(-1)` can exit the app · first-watch never confirms
  "Added to Continue Watching."

## 8. SEO / conversion — app excellent, landing uninstrumented (2 High)

Two surfaces: **landing = `nux.ontwrpn.com`**, **app = `app.nux.ontwrpn.com`** (brief had these
swapped; verified live). The app's `prerender.mjs` bakes real per-route HTML + rich JSON-LD
(`WebSite`/`Organization`/`Movie`/`ItemList`) — crawlers get full HTML, verified on `/film/kes/`.
The landing copy is genuinely human, one clear value prop, single dominant CTA, real proof, honest
portfolio framing — **the strongest single asset in the project.**

- **[High] No analytics on the landing** — `landing/src/main.jsx` has no Clarity; CSP blocks it.
  The conversion page's funnel (CTA-by-location, pricing toggle, newsletter, scroll depth) is
  invisible — "does it convert?" is unanswerable. Add Clarity + extend the landing CSP.
- **[High] Newsletter submit is a silent no-op that says "you're on the list"** — `landing/App.jsx:45-59`.
  Wire it to a real list or make the confirmation honest.
- **[Medium]** Two indexable homepages share an identical `<title>` (brand-query dilution) · thin
  landing JSON-LD (no `Organization`/`ItemList`/`Offer`) · single-URL sitemap · pricing has no
  anchor tier.
- **[Low]** No `theme-color`/`apple-touch-icon` on landing · trailing-slash canonical mismatch on
  prerendered routes · collection tiles link to generic `/browse` not `/collection/<slug>`.

## 9. DevOps — posture: high, one critical gap (1 Crit · 2 High)

A genuinely well-engineered single-container deploy: multi-stage Dockerfile, non-root API via
`su-exec`, drops `sqlite3`+devDeps, DB-aware health check *through nginx*, `start.sh` keeps PID 1 +
traps TERM/INT + supervises the API, `db.js` fails loudly if prod lacks Postgres. Secrets verified clean.

- **[Critical] No Postgres backups / DR** — all real user data (accounts, sessions, lists, history,
  curator, leaderboard) has no scheduled backup or restore path. A bad migration/disk/drop = permanent
  loss. Enable Coolify scheduled backups (daily, off-box, retain 7) + verify one restore. **Top priority.**
- **[High] CI is not a deploy gate** — Coolify auto-deploys on push *regardless of red CI* (the
  workflow comment admits it). Move the deploy trigger to a final CI job calling the Coolify deploy API
  after tests+smoke pass, and/or add branch protection + PR flow.
- **[High] No observability beyond the container's own health check** — no uptime monitor, no error
  alerting, no log rotation (a chatty error loop can fill the 160GB disk; logs are lost on redeploy).
  Add an external uptime monitor on `/api/health` + Docker log rotation.
- **[Medium]** `sequelize.sync()` silently ignores column changes on existing tables (schema-drift
  tripwire; adopt migrations before the next change to a populated table) · no lint/`npm audit`/Dependabot
  in CI · no workflow concurrency-cancel or timeouts · stop-start redeploy has a brief downtime gap.
- **[Low]** Dead prod static-serving block in `server.js:76-81` · stale "Render" comment in `db.js`.

---

## Cross-cutting themes (de-duplicated)

1. **The landing is the weak surface.** It appears as a finding in *four* tracks — design-system
   (forked tokens, off-ramp type/space, cloned button), code-quality (divergent film data, forked
   `useTilt`), SEO/conversion (no analytics, duplicate title, dead newsletter), and a11y (marquee
   pause). Root cause: it was hand-built against token *fallbacks* rather than consuming the system.
   **One structural fix — make the landing import the app's canonical tokens + shared primitives and
   generate its data from `catalog.js` — collapses ~8 findings at once.**
2. **Tell vs. show the thesis.** "Curation as the product" is delivered by the engine but not legible
   at the surfaces a reviewer scans first (cards, Curator results). The highest *portfolio* ROI.
3. **Operational safety net is missing.** Backups + a real CI gate + monitoring are the three things
   standing between "a shipped demo" and "a service you'd trust with a reviewer's account."
4. **Tests are deep where it's risky and absent where it's visible.** Backend security is well-fenced;
   the UI, e2e contract, and the reset flow are not.

---

## Prioritized remediation roadmap

Severity + reviewer-visibility + effort. P0 = do first.

### P0 — operational safety (do before anything else)
- **Enable Coolify Postgres backups + verify one restore.** *(DevOps Crit; dashboard action, no code.)*
- **Make CI a real deploy gate** (deploy via Coolify API after green CI, or branch protection + PR). *(DevOps High.)*
- **Add uptime monitoring on `/api/health` + Docker log rotation.** *(DevOps High.)*

### P1 — highest leverage (correctness, security hardening, the big perf win)
- **Resize + `srcset` catalog posters/stills** (−90% image weight, mobile LCP). *(Perf High.)*
- **Fix the watch-history cap desync** + **wrap the Browse `setItem`**. *(Code Medium ×2 — quick, real bugs.)*
- **Security hardening trio:** fail-closed auth rate-limiter, persistent Curator budget cap, drop
  `style-src 'unsafe-inline'`. *(Security Medium ×3.)*
- **Password-reset route tests** + **one Playwright e2e smoke** in docker-ci. *(QA High ×2.)*
- **Accessibility Highs:** inert the Tour background; fix Settings toggle names. *(A11y High ×2 — small.)*

### P2 — portfolio impact (what raises the perceived seniority of the work)
- **Surface curation rationale on cards + per-pick Curator reasons.** *(UX High ×2 — the thesis.)*
- **Resolve the identity contradiction** (one coherent "free editorial showcase" model). *(UX High.)*
- **Collapse the landing onto the design system** (canonical tokens, type ramp, spacing, shared
  `.btn`/scrim/shadow) + **generate landing data from `catalog.js`** + **unify `useTilt`**.
  *(Design-system 3 High + Code 2 Medium — one cross-cutting effort.)*
- **Instrument the landing** (Clarity + funnel events) + **honest newsletter** + **distinct title /
  theme-color / richer JSON-LD.** *(SEO/conversion High ×2 + Medium.)*

### P3 — hygiene & depth (when time allows)
- Remove dead Newsreader font, dead deps/exports; font preload + brotli.
- Authed hook tests + a few state-bearing component tests (after `setup.js` stubs); install coverage tool.
- First-run consolidation, logout→Home, Games/Courses chip handling, Home Curator invitation.
- Adopt migrations before the next schema change; lint + `npm audit` + Dependabot in CI.

---

## Where NUX stands vs. how real teams operate

Benchmarked against the industry-practice research (OWASP Top 10:2025 / ASVS v5, WCAG 2.2 AA,
Core Web Vitals, Nielsen heuristics, the testing trophy, Google eng-practices, FedRAMP SLAs).

| Dimension | Pro-team bar | NUX today | Verdict |
|---|---|---|---|
| Test strategy | Trophy/pyramid hybrid, integration-heavy, all layers in CI | Strong backend integration; **no e2e, no UI tests** | Meets bar on backend; add 1 e2e layer |
| CI gate | Required checks block merge to main | CI runs but **doesn't block deploy** | **Below bar** — fix (P0) |
| Security — SCA/secrets | Dependabot + secret scanning + push protection | Secrets clean; **no Dependabot/scan in CI** | Add the free tier |
| Security — review | OWASP Top 10 + ASVS L1 self-review, IDOR check | **IDOR proven sealed; enumeration-safe; allowlisted AI** | **Exceeds portfolio bar** |
| Accessibility | WCAG 2.2 AA: axe + keyboard + 1 screen reader | Contrast passes AA; reduced-motion everywhere; 2 High gaps | At/above bar; owe 1 SR pass |
| Performance | LCP ≤2.5s / INP ≤200ms / CLS ≤0.1 | Small JS, split, indexed; **posters oversized** | One fix from strong |
| Code quality | Lint + format gate, small-diff review | Clean, consistent, transactional; **no lint in CI** | Above bar on code; wire the gate |
| UX research | Heuristic eval + n=5 + SUS | Competitive heuristic eval done; **n=5 study scoped, not run** | Strong; run the planned study |
| SEO | Lighthouse + Search Console + JSON-LD | **App prerender + rich JSON-LD is excellent**; landing thin | App exceeds; lift the landing |
| Audit reporting | Per-finding format + severity + risk register | *This document* | Meets the professional shape |
| Standards anchor | ASVS / WCAG / CWV; SOC 2 / ISO as context | Right standards, free tier | Correct posture for a portfolio |

**The throughline from the research:** professional rigor on a portfolio app is demonstrated by
*borrowing the structure* of industry practice — the right layers, the right thresholds, the standard
finding format, the named severity scales — at the free/lightweight tier, while explicitly noting what
you'd add at production scale. NUX already does this in security, a11y, SEO, and deploy engineering.
Closing the P0 operational gaps and making the thesis visible would put the *whole* project at that bar.

---

*Generated by a 10-track parallel specialist audit (security, accessibility, code quality,
performance, QA, design system, UX, SEO/conversion, DevOps) + an industry-practice research pass.
Each finding is reproducible from its cited `file:line`. No code was modified.*
