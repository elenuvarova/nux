# NUX + Portfolio — Full Professional Audit (2026-06-25)

## 1. Scope & method

This audit covers **five product surfaces** plus a dedicated freshness check, evaluated by 13 specialist auditors whose every Critical/High finding was then re-checked by an adversarial verifier against the live code, tokens, Figma capture, and rendered frames.

| # | Surface | What was audited |
|---|---------|------------------|
| 1 | **Web app** (`frontend/`) | Design-system/token code, a11y (WCAG 2.2 AA), responsive (390/834/1440), Apple HIG/native feel, visual quality vs thesis, copy |
| 2 | **Landing** (`landing/`) | Design-system + token sync, CTA system, a11y, responsive, copy |
| 3 | **Web design-system + tokens** | `tokens.css` semantic layering, sync mechanism, contrast math |
| 4 | **Figma** (`UPtAtDiB37eSssdOGZ8nrq`) + tokens | Variable/token parity, two-mode architecture, Figma↔live drift |
| 5a | **Notion case study** | Product-Designer portfolio fit, claims, freshness |
| 5b | **Portfolio** (`ontwrpn.com`) | Visual/UX, SEO, a11y, performance, hiring-funnel fit |
| — | **Freshness check** | Currency of NUX links, screenshots, and claimed numbers vs the Jun-25 live build |

**Method.** Findings were generated against captured Figma variable defs and screenshots, the live Notion page, the deployed sites (curl + rendered DOM), and the repo at HEAD `0560941`. Every Critical/High was adversarially verified — the verifier ran its own greps, read cited files, recomputed contrast and grid math, checked git history, and fetched live URLs. Findings the verifier **refuted** are dropped from §5 and listed in the "Verified-false" notes; severities were corrected to the verdict.

**Rubric ("Criterion Ink").** Warm near-black `#0d0c0b`; surface ladder `#070606→#332E27`; text `#f2efe9` (17:1) / `#b0a99e` (8.4:1) / `#9a9183` (5.2:1); a **single** rationed accent amber `#c8922a` ("ink not foil", ≤10% of a screen) for primary/Play/active only; type = Fraunces (display) / Inter (UI) / Newsreader (essay). Any doc naming "Playfair Display + JetBrains Mono" is **stale**.

## 2. Executive summary

**Web app.** Genuinely strong and disciplined: a hand-built, semantic-layered token system with zero raw NUX-palette literals, exemplary modal/focus management, and contrast that passes end-to-end. The remaining gaps are maintainability (primitives reached past the semantic layer) and one real platform gap — iPad (834px) renders as a stretched desktop. *Highest-leverage move:* introduce a tablet tier so iPad gets touch chrome + denser grids.

**Landing.** In very good shape — the prior CTA-overload problem is fully resolved (one amber pill per region), zero raw color literals, faithful token sync. Issues are token-hygiene polish (one stale token, a few magic numbers, a `.btn-secondary` divergence). *Highest-leverage move:* re-sync `tokens.css` and add a CI parity guard so drift can never ship again.

**Web design-system + tokens.** The best part of the whole project — principled primitives→semantic→component layering with inline WCAG annotations that match the code. The one structural defect is that several action/active/border states bypass the semantic aliases to the raw primitive. *Highest-leverage move:* route active/progress/border states through their semantic tokens (and add a `--state-active` where none exists).

**Figma + tokens.** Color/spacing/radius/core-type parity is value-for-value clean and the two-mode architecture is textbook. Gaps are a missing `--type-pullquote` token and a Figma var set that is a subset of the shipped code. *Highest-leverage move:* add the pull-quote token and backfill the Figma status/type roles so neither surface is a superset of the other.

**Notion case study.** A mature, honest, ownable case with a real differentiator (the Curator) — but it links reviewers to the wrong surface, shows a stale build, undercounts its own content, and omits the testing/results chapter a PD panel scans for. *Highest-leverage move:* add a short "How I tested it" chapter anchored on the real Chalkmark Browse→Genres revision.

**Portfolio (ontwrpn.com).** Strong head-level SEO, a complete CTA close, and a credible design+AI+CS profile — undermined by a render-blocking Typekit load, a misdirected NUX "Live" link, and stale screenshots. *Highest-leverage move:* repoint the NUX live link/embed to `app.nux.ontwrpn.com` and re-export the stale shots.

## 3. Per-surface scorecards

| Surface | Grade | Strengths | Top issues |
|---|---|---|---|
| **Web app** | **A−** | 1,229 `var()` refs / 0 raw NUX-palette literals; model modal/focus/forms a11y; contrast passes 11.7–17.6:1 | iPad/834 falls into desktop branch (R-1/HIG-2); primitives bypass semantic layer (DS-01); no `-webkit-tap-highlight` suppression (HIG-3) |
| **Landing** | **A−** | Two-token CTA system, one amber pill per region; zero raw colors; faithful sync | Stale `--surface-chip` (no CI guard); `.btn-secondary` diverges from app; magic-number sizes |
| **Design-system + tokens** | **A** | Semantic layering with inline WCAG ratios matching code; `!important` only in reduced-motion | Action/active/border states reach raw primitives; no `--state-active`; 9 dead tokens; no z-index scale |
| **Figma + tokens** | **B+** | Exact color/space/radius/type parity; coherent Wireframe/Hi-Fi two-mode | No `--type-pullquote` (hand-set in px); `UI/Caption` name-collision (11px vs 13px); Figma var set is a subset |
| **Notion case study** | **B** | Honest no-users framing; choice-overload caveat; Curator shown not asserted | "Live" link → landing not app (CS-2); stale Jun-13 screenshots; no testing chapter (CS-3); undercounts catalog |
| **Portfolio (ontwrpn.com)** | **B** | Strong head SEO/JSON-LD; complete CTA close; design+AI+CS profile | Render-blocking Typekit, no preconnect, 262-face kit (PERF-1); CSR-only HTML / SEO body invisible (SEO-1); stale NUX link/embed |

## 4. Cross-cutting themes

1. **Token discipline is excellent in spirit but leaks at the boundaries.** The app and landing have essentially zero raw NUX-palette literals — yet *action/active/progress/border* states repeatedly reach past the semantic aliases to the raw primitive (`--amber-500`, `--white-a0*`), and the Figma↔code type layer has unsynced roles (`--type-pullquote`, `UI/Caption`). The system is one cleanup away from matching its own "0 unbound values" claim.

2. **Curation is the thesis but is still invisible at the card on the dense grids.** It's wired on Home (every rail passes `note={REASONS[id]}`) but Browse/Genre/MyList ship bare poster+title+meta — exactly the "infinite wall" the product rejects, on the surfaces a reviewer scrolls to test it.

3. **iPad/834 is the one structural responsive gap.** A single `max-width:768` switch routes iPad into the desktop branch — wrong nav chrome (desktop top-bar, not the floating tab bar) and lower grid density than the Figma spec. Recurs in the responsive, HIG, and Figma audits.

4. **Token sync is faithful but unguarded.** `landing/tokens.css` is one token (`--surface-chip`) behind canonical because the sync didn't re-run; it's inert today but proves a one-way sync can silently drift. Flagged by five separate auditors — the fix (re-sync + CI parity guard) is the same each time.

5. **Freshness is the costliest theme for the portfolio.** Across README, Notion, and the portfolio, the "live app" link points at the now-marketing apex, screenshots predate ~25 commits, and the catalog is undercounted ~3.4×. The drift *under-sells* a product that has materially leveled up — a self-inflicted credibility tax on the highest-traffic clicks.

## 5. Findings

Only verdict-confirmed or partial findings are included, at corrected severity. De-duplicated where multiple auditors raised the same issue.

### 5.1 Web app + design-system/tokens

| ID | Sev | Where | Issue | Fix | prior-art |
|---|---|---|---|---|---|
| DS-01 | Med | Settings.css:74, Downloads.css:29/96/114, Watch.css:206/243/376/453, Welcome.css:108/169-170/185, Tour.css:25 (~16 genuine hits) | Action/active/progress states reach past the semantic layer to raw `--amber-500` instead of `--action-primary`/`--accent-progress`/`--border-focus`. Pure maintainability (all resolve to `#c8922a`, no visual regression). | Route fills through their semantic token; note that active/selected states have **no** exact home — add a `--state-active`/`--state-selected` token rather than stretching `--action-primary`. | NEW |
| DS-02 | Med | Rail.css, Watch.css, Home.css, Browse.css, Auth.css, NavBar.css, global.css (~30 hits) | Border alpha primitives `--white-a07/08/14/18` used directly instead of `--border-subtle/-default/-strong` aliases. | Swap hairlines/inset rings to the `--border-*` aliases; keep the raw primitive only where the alpha is a translucent **fill** (skeleton shimmer, buffered-track). | NEW |
| DS-03 | Med | tokens.css:135/137/160/182/183/63/64/121 | 9 dead tokens never referenced (incl. `--action-primary-pressed`, `--radius-xl/2xl`). | Delete the orphans or wire the spec-parity ones (`--action-primary-pressed` in `.btn-primary:active`, `--radius-xl` 24px on overlay/auth corners). Document `--amber-500-rgb` as landing-only. | NEW |
| DS-04 | Med | CuratorFab/NavBar/TabBar (100), CuratorOverlay (110), Tour (130), Watch (150), global (200/9999), Offline/Toast (300), NeonDrift (1000) | No z-index scale — 7 raw stacking values with collisions (3 share 100; OfflineBanner & Toast both 300, order accidental). | Add a `--z-*` scale to tokens.css and reference it everywhere; forces an intentional banner-vs-toast decision. | NEW |
| DS-06 | Low | tokens.css:34-35 | `--amber-glow`/`--amber-sheen` re-type the RGB triplet instead of consuming `--amber-500-rgb`. | Add `--amber-300-rgb`; express both via `rgb(var(--amber-*-rgb) / α)`. | NEW |
| DS-07 | Low | OfflineBanner.css:15, Rail.css:222/307, Browse.css:247, Welcome.css:156 (text); Watch/Settings knobs (fill) | `--paper-100` primitive used where `--text-primary` exists (text) or for knob fills (no semantic token). | Swap text to `--text-primary`; optionally add `--control-knob: var(--paper-100)`. | NEW |
| DS-08 | Low | tokens.css:228 vs Figma UI/Caption | `--type-caption` is 13px; Figma `UI/Caption` is 11px — name-collision on a named style (see FT-2). | Reconcile name==value in one direction; document canonical. | NEW |
| DS-09 | Nit | Footer.css:54 (14px=`--type-label`), Rail.css:244 (12px vs 12.5px), Browse.css:65 (15px=`--type-button`) | One-off font-size literals duplicate existing type-token values. | Reference the matching token; align Rail meta to the 12.5px ramp. | NEW |
| DS-10 | Nit | OfflineBanner.css:13 | Stale `#b3554d` hex in a comment (code correctly uses `--status-danger-strong`). | Reword the comment to the token name. | NEW |
| A11Y-04 | Nit | tokens.css latent pairs | `--text-tertiary` on `--surface-neutral` = **4.33:1** (fails AA); `--status-success` on `--surface-overlay` = **4.34:1**. Not instantiated today, but unguarded foot-guns. | Annotate in tokens.css that these pairs aren't AA-safe, or nudge `--paper-500` one step lighter so tertiary clears 4.5:1 on all six surfaces. | NEW |
| HIG-3 | Med | global.css (no `tap-highlight` anywhere) | No `-webkit-tap-highlight-color` suppression — iOS paints a grey flash rect on every tap, fighting the `--press-scale: 0.97` design. | Add `* { -webkit-tap-highlight-color: transparent; }`. | NEW |
| HIG-4 | Med | CuratorOverlay.css:50/72/123, Rail.css:19-24 | Scrollable sheet/rails lack `overscroll-behavior` — the Curator sheet and shelves scroll-chain & rubber-band into the page on iOS. | Add `overscroll-behavior: contain` to the sheet body and `-x: contain` to rails/results; optional `touch-action: pan-x`. | NEW |
| HIG-5 | Low | Auth.css:3 (`100vh`) vs Welcome.css:3-4 | Auth still uses `100vh` — the iOS toolbar-jump that Welcome already fixed with `100svh`. | Mirror Welcome: `min-height: 100vh; min-height: 100svh;`. | SUPERSEDES |
| HIG-6 | Low | CuratorOverlay.css:119-125 | Bottom sheet has no grabber / swipe-to-dismiss; only the X closes it. | Add a grabber bar + touch swipe-down dismiss; keep X for a11y/desktop. | NEW |
| A11Y-02 | Low | Rail.jsx:51-56, Browse.jsx:245-254 | `<button>` nested inside the card `<Link>` (interactive-in-interactive); SC 4.1.1 removed in WCAG 2.2 but some AT mis-announce. | Make card a non-interactive container with link + play button as siblings (stretched-link pattern). | NEW |
| A11Y-03 | Low | Watch.jsx:602-610/635/658 | Settings popover `role=group` while trigger advertises `aria-haspopup="menu"` — role mismatch. | Set `aria-haspopup="dialog"` (cheapest) or commit to a real `role=menu`. | NEW |
| A11Y-01 | Low | landing.css:162-167, App.jsx:290 | Director marquee's claimed WCAG 2.2.2 pause can't fire by keyboard/AT (container is `aria-hidden`, no focusable children); reduced-motion does stop it. | Drop the misleading 2.2.2 comment (defensible decorative motion), or add a real persistent pause toggle. | CONFIRMS |

**Verified-false (not included):**
- **HIG-1 — "px type ramp ⇒ can't respond to iOS Dynamic Type" (claimed High).** *Refuted as framed.* This is a React/Vite **web** app; iOS Dynamic Type never applies to DOM content and a rem ramp wouldn't honor the iOS slider either — the finding conflates native Dynamic Type with browser text-size. Real residue is a Low nit (a px ramp ignores browser default-font-size; the 9px/10.5px micro-labels). Pinch/page-zoom already satisfy SC 1.4.4. Corrected High→Low; carried only as a minor cleanup.

### 5.2 Landing

| ID | Sev | Where | Issue | Fix | prior-art |
|---|---|---|---|---|---|
| LND-DS-01 | Med | landing/tokens.css vs frontend/tokens.css:73-75 | `--surface-chip` missing — sync didn't re-run; files otherwise byte-identical. Inert today (landing doesn't consume it) but proves silent drift. | Run `npm run sync:tokens`, commit; add a CI guard that fails if a fresh sync diffs. | CONFIRMS |
| LND-DS-04 | Med | landing.css:79-80 vs global.css:323-332 | `.btn-secondary` diverges from the app's (transparent hairline vs app's semi-opaque scrim plate) despite an in-file "lockstep" comment. | Bring landing onto the app recipe, or drop the "lockstep" claim and document the variant. | NEW |
| LND-DS-05 | Low | landing.css:91-92 vs NavBar.css:31-35 | `.wordmark` hardcodes 22px/.02em instead of `--type-wordmark`/`--track-wordmark` (2px below app brand size). | Replace with the tokens (or a hand-tuned `--type-wordmark-sm`). | NEW |
| LND-DS-06 | Low | landing.css:81 | `.btn-lg` introduces raw 52px height + 16px font with no token. | Add `--btn-lg-h` and a `--type-button-lg` (or reference `--type-body`). | NEW |
| LND-DS-07 | Low | landing.css (~25 rules: :86/:128/:195/:201/:202/:253…) | Many label/meta sizes hand-set in raw px instead of `--type-label/-caption/-input/-metadata`. | Map recurring sizes onto tokens; name genuine landing-only sizes (e.g. `--type-landing-pick-title`). | NEW |
| LND-DS-08 | Nit | landing.css:77/79 | Defensive `var()` fallbacks re-introduce raw hex (`#c8922a`, `#0d0c0b`, `#f2efe9`) that can never fire (tokens always loaded). | Drop the literal fallbacks. | NEW |

**Verified-true / closed (do not re-flag):** **LND-DS-03 / H-5** — the prior CTA-overload (two stacked amber hero pills + three treatments) is **FIXED**; the shipped hero is one `.btn-primary` + one ghost `.link-arrow`, nav is `.btn-secondary`, exactly three `.btn-primary` page-wide (one per region). Verified `confirmed`, severity `none` (resolution note, not a live defect).

### 5.3 Figma + tokens

| ID | Sev | Where | Issue | Fix | prior-art |
|---|---|---|---|---|---|
| FT-1 / V-3 | Med | Figma `HiFi/Pull Quote` (Fraunces Italic 24/1.4) vs landing.css:190/192/284/331 | The one Figma type style with **no** code token is the exact texture hand-set 3-4× at different px (curator note/prompt, coll-standfirst 15px, colophon). Undercuts "0 unbound values". | Add `--type-pullquote` (+ optional `--type-standfirst`); route the four consumers through it; re-sync. | SUPERSEDES |
| FT-2 | Low | Figma `UI/Caption` 11/1.5 ls4 vs tokens.css:228 (13px/1) | Name-collision: same name, different size **and** leading — not a rounding gap. | Pick a direction (rename the 13px style or add a true 11px `--type-caption`); make name==value; document canonical. | NEW |
| FT-4 / LND-DS-01 | Med | sync-tokens.mjs early-exit | Same `--surface-chip` drift; root cause is `process.exit(0)` when app source isn't present in the standalone Docker build context, so the "GENERATED" header lies. | Re-sync + commit; move sync to pre-commit hook or a CI diff guard. | CONFIRMS |
| FT-7 | Nit | tokens.css:200/206/217/227-233/38-44 vs Figma var defs | Code is a **superset** — display-m/s, page-title 34, label/input/row/tab, status colors have no Figma equivalent. A designer working only from Figma has no token for an error/offline state or an iPhone large title. | Backfill the Figma Hi-Fi var set (status/danger/success + AA-safe text, the missing type roles); note code is canonical until then. | NEW |
| FT-6 | Low | Notion "Under the hood" vs capture | Most quantitative claims (`0 raw values`, `100+ components`, `30+ styles`, `71 screens / 4 platforms incl tvOS`) are claimed-only from the capture; "all screens instance-based" is contradicted at the build boundary. | Soften unverifiable counts to checkable forms or link the audit frame that proves them; either ship `--type-pullquote` or drop the absolute "0 raw values" wording. | NEW |
| FT-8 | Nit | docs/visual-design-audit:124 (N-6) | Prior audit mis-named the colophon italic "Playfair" — it's Fraunces (`--font-display`). The stale-font rubric leaked into a finding. | Disregard the "Playfair" attribution; track the real issue (no `--type-pullquote`) under FT-1. | SUPERSEDES |

**Verified-false (not included):**
- **FT-5 / H-6 — "Figma iPad = 5 cards, live = ~3 across" (claimed High).** *Partial/largely stale.* The density fix already shipped at HEAD — commit `0560941` added `Rail.css:352` `grid-auto-columns:160px` for 769-1024, raising the live iPad from 3.49→**4.03** cards. The Figma "5 across" is a horizontal scroll-rail peek, not a hard count, and the proposed "150-160px ⇒ 5 cards" math actually yields ~4. The genuine residue (iPad uses a top bar, and the nav-model breakpoint is debatable) is captured under R-1/HIG-2. Corrected High→Low; the density half is closed.

### 5.4 Visual / responsive / HIG (web app + landing)

| ID | Sev | Where | Issue | Fix | prior-art |
|---|---|---|---|---|---|
| V-1 | High | Browse.jsx:261, Genre.jsx:52, MyList.jsx:30 | Curation is invisible on the dense grids — `PosterCard` supports `note` and Home passes it, but these three call sites pass none, so the catalogue reads as the "infinite wall" the thesis rejects. | Pass `note={REASONS[f.id]}` at all three call sites (2-line clamp already protects height). **Caveat:** `REASONS` covers 72/89 ids — ~17 titles stay bare (node cleanly omitted); fix is correct but partial coverage. | SUPERSEDES |
| R-1 / HIG-2 | High | NavBar.css:163, TabBar.css:87, Hero.css:204 (all `max-width:768`); Rail.css:352 / Browse.css:329 (only 769-1024 density) | iPad/834 falls into the desktop branch: desktop top-nav (not the floating tab bar), no detached search, single-row hero — confirmed in `app-home-834-full.jpeg`. Pointer-coarse 44px sizing *does* fire, so touch targets are partly handled, but nav chrome + hero layout are wrong for the tablet tier. | Move the structural switch to ~1024px or gate on `(pointer:coarse)`: iPad gets the tab bar + detached search + icon-only FAB + denser grids. | CONFIRMS |
| R-2 | Med | Rail.css:6 (64px gutter) + 352-355 (card-width only); FilmDetail.css:130, Home.css | iPad rails show ~3.9 posters across vs Figma's 5 because the 769-1024 band shrinks cards but keeps the desktop 64px gutter (recomputed 706px inner ⇒ 3.92). Layout-fidelity gap, not a break. | In the 769-1024 band also reduce the rail/section gutter (~24px) and/or drop card width; apply to FilmDetail and Home. | CONFIRMS |
| R-3 / HIG-7 | Med | Browse.css:321-324 | Mobile Browse renders all 72 titles in one ~12,899px scroll — no pagination/sticky filter/back-to-top; the floating tab bar hovers over a dumb wall (also a thesis mismatch). | Chunk into batches of ~24 via the existing `.browse-more`; make the genre/type row sticky; add back-to-top and scroll-to-top on active-tab re-tap. | CONFIRMS |
| R-4 | Med | Hero.css:204-227 (fix present) vs live 390 captures | Hero may still render all three pills on one row at 390 despite a committed two-row wrap — live differs from repo (deploy lag or override). Reads tight, nothing clips. | Verify the deployed bundle includes the Hero.css fix; raise specificity so `.btn-primary{flex:1 0 100%}` wins. | SUPERSEDES |
| R-5 | Med | Home.css:188 (900), Rail/Browse (769-1024), Collection.css:170 (640), nav/hero (768) | iPad uses inconsistent collapse breakpoints (768/900/1024/640) so regions reflow at different widths — a patchwork at 834. | Adopt one named tablet tier (744-1024) routing nav, hero, gutters, and density together. | NEW |
| R-6 | Low | FilmDetail.css:127-132 (no 769-1024 rule) | Cast & "More Like This" rows keep the 64px desktop gutter at 834 — same width under-use as the rails. | Add FilmDetail to the same tablet gutter/density treatment as R-2. | NEW |
| R-7 | Low | Hero.css:209-211 | Mobile hero pills are tight to the safe-area edges at 390 with no room if labels grow (Dynamic Type/localisation). | Resolves once R-4's two-row layout renders; otherwise demote "More Info" to two pills on mobile. | CONFIRMS |
| V-5 | Low | Rail.css:257-266 / :63 | Card `note` and metadata share Inter 12.5px — the curatorial reason can read as a third metadata line, not an editorial voice. | Set `.poster-card-note` in Newsreader (`--font-essay`) or add leading/indent; keep the 2-line clamp. | NEW |

**Verified-true / closed (do not re-flag, do not re-open from stale frames):** H-2 (poster letterbox+grade), H-3 (neutral Curator FAB), H-4 (2-step onboarding), H-5 (CTA system), H-7 (unified "Start free trial"), L-2 (Fraunces Home title), M-9 (no amber hairlines) are **FIXED** in HEAD. HIG-8 amber-discipline half is **FIXED** (FAB neutral glass; residual iPad label rolls into R-1).

### 5.5 Copy (web app + landing)

| ID | Sev | Where | Issue | Fix | prior-art |
|---|---|---|---|---|---|
| F-03 | Med | Downloads.jsx:6-25 | Downloads shows fabricated device state (GB, expiry countdown) as fact, with **no** "Demo"/simulated tag — the one screen where the otherwise-careful honesty system breaks (Profile tags every sim row). | Add a "Demo"/"Sample data" tag on the header or a one-line dek ("Sample downloads — nothing is actually stored on this device"). | NEW |
| F-04 | Low | App.jsx:189 vs 262 | "The editors**'** room" (straight) vs "Editors**'** Collections" (curly) — same possessive, two glyphs, house standard is curly. | Change line 189 to curly U+2019. | NEW |
| F-05 | Low | App.jsx:190 | N°04 display heading "We**'**d rather…" uses a straight apostrophe; especially visible at display size. | Change to "We'd" (curly); sweep App.jsx in one pass with F-04. | NEW |
| F-06 | Low | App.jsx:205 | "point of{' '}view" — JSX `{' '}` is a breaking space, so "view" can still widow (the class the hero was fixed for). | Use `&nbsp;`: "point of&nbsp;view". | NEW |
| F-07 | Low | Hero.jsx:82 vs Watch.jsx:429 | Hero CTA "Play" loads a trailer; the Watch page honestly says "Play trailer". Same action, two labels. | Label the hero "Play trailer" (or rely on Watch's "Trailer · Full film" line). | NEW |
| F-08 | Nit | Welcome.jsx:104 | "personalise your feed" undercuts the "not a feed" thesis ("No infinite wall…"). | Swap "feed" for the brand's own vocabulary ("shape your homepage"). | NEW |
| F-09 | Nit | App.jsx (24 em-dashes), films.js | Em-dash is the only mid-sentence break — a mild list-y tell across long-form blurbs. | Vary the breaks on a future pass (colon/period/comma); keep dashes that earn the pause. | NEW |
| F-10 | Nit | App.jsx:312-313 | Footer copyright ends with a period; adjacent tagline doesn't — reads as oversight. | Make it deliberate: drop the period on line 312. | NEW |

**Verified-true / closed:** F-01 (pricing/identity contradiction, H-7) and F-02 ("everything" widow, M-15) are **FIXED**. Residual nit: the analytics event is still `cta_start_watching_click` though buttons say "Start free trial" — rename to `cta_start_trial_click` (not user-facing).

### 5.6 Notion case study

| ID | Sev | Where | Issue | Fix | prior-art |
|---|---|---|---|---|---|
| CS-2 / FRESH-1 | High | Notion callout + gallery; README.md:6 | The case-study "Live app" link → the **landing** (`nux.ontwrpn.com` now serves marketing), not the app (`app.nux.ontwrpn.com`). The gallery literally labels the apex "The web app." A reviewer's highest-intent click lands on a pricing page; no app link exists anywhere in the case. | Repoint the callout, gallery caption, and README.md:6 to `app.nux.ontwrpn.com`; relabel (landing = `nux.*`, app = `app.nux.*`); surface both. | CONFIRMS |
| CS-3 | High | Notion arc (no testing/results chapter) | The strongest UX evidence Elena produced lives only in repo PDFs, invisible to the case: a Nielsen heuristic eval (5 platforms, severity-rated) **and** an Optimal Workshop Chalkmark first-click test (n=12) with a real "Browse" ambiguity finding and a concrete Browse→Genres revision. For a PD panel, the decision→validation→revision loop is the core artifact and it's missing. | Add a short "How I tested it" section between Prototype and Shipped, anchored on the **real** Chalkmark Browse→Genres revision (a stronger substitute for the finding's illustrative examples). | NEW |
| CS-1 / FRESH-3 | Med | Notion "Content & imagery" | Stale catalog counts: "21 posters / 14 stills" vs **72 posters / 77 stills / 72 titles** shipped (verified via assets + `films.js`). An *under-*claim that reads as un-maintained and hides real craft. | Update to true counts; wire the number to a single source so it can't drift. | NEW |
| CS-4 | Med | Notion "Design system" / "Under the hood" / "Shipped" | Narrative leans craft-inventory (component/style/platform counts) over decision-rationale — no explicit tradeoff section, no "what I'd do next." | Convert 2-3 inventory bullets to "Decision → Why → Tradeoff"; add a one-paragraph "What I'd do next." | NEW |
| CS-5 | Med | Notion (model not stated) + shipped product | Identity contradiction the case could pre-empt: signup "Start your membership" vs Profile "Premium/Billing" vs Terms "no membership/account" vs landing pricing fork. | State the model once ("a free editorial showcase — pricing is a portfolio device"); align Auth/Profile/Info product-side. | CONFIRMS |
| CS-6 / FRESH-2 | Med→High* | Notion Home + gallery embeds (raw `main` URLs, committed Jun-13) | Embedded shots predate ~25 visible commits (pre-editorial-unification, 52-film, "3RD MAN" backdrop, no Details table / More Like This / Curator FAB). The case sells an older, thinner build. (*Freshness auditor rates the screenshot drift High.) | Re-export Home/Browse/Film-detail/mobile + figma-* from the current app; refresh Notion and portfolio together as one freshness sweep. | CONFIRMS |
| CS-7 | Low | Notion "Under the hood" | `0 raw / 100+ components / 71 screens / 4 platforms incl tvOS 1920` are presented as flat facts a reviewer can't verify; partly conflicts with the live iPad. | Keep the numbers but anchor each to an openable artifact; soften the platform line to "iPhone/iPad/desktop shipped; tvOS designed-not-built." | NEW |
| CS-8 | Low | Notion "Design system" | "Plus Jakarta Sans" (Wireframe-mode font) ships nowhere; risks reading as drift rather than the intentional mode switch. (Also CORRECTS the stale "Playfair/Mono" rubric in `design/DESIGN_DIRECTION.md`.) | Frame as deliberate ("Wireframe uses Plus Jakarta for a neutral look; Hi-Fi switches the token to Fraunces"); fix the stale Playfair naming at its source. | SUPERSEDES |
| CS-9 | Low | Notion TL;DR + capability lists | A few AI-tell cadences — rigid Problem/Insight/Solution/Outcome four-beat, long comma-chained capability inventories. | Break one or two chains into a sentence-with-a-reason; vary one TL;DR beat; run through the copy-editing AI-tell pass before publish. | NEW |
| CS-10 | Low | Notion "The Curator — AI" | The differentiator chapter is told in backend/safety terms; the design decision and felt user experience are under-written for a PD case. | Lead with the design decision + moment of delight, keep grounding/failover as "how I made it trustworthy"; add a per-pick-reason screenshot. | NEW |

### 5.7 Portfolio (ontwrpn.com)

| ID | Sev | Where | Issue | Fix | prior-art |
|---|---|---|---|---|---|
| PERF-1 | High | Served head: `<link rel=stylesheet href=use.typekit.net/uaz0deh.css>` | Adobe Typekit is a render-blocking head stylesheet with **no preconnect** (cold TLS on the LCP path), **262 `@font-face` all `font-display:auto`** (FOIT), over a WebGL hero. Only ~2 families are actually used. Threatens LCP/first impression on the highest-stakes recruiter surface. | Add `preconnect` to use/p.typekit.net; enable `font-display:swap` (or self-host the 2-3 used weights and drop the 262-face kit); gate the WebGL hero on reduced-motion/low-power. | NEW |
| SEO-1 | High | `ontwrpn.com/` and `/work/nux` raw HTML | Pure client-side render — served `<body>` is an empty `<div id="root">` with **0 heading tags / 0 body text**; all headings/prose are JS-injected. LLM answer-engines and JS-budget crawlers see only head meta. Root cause behind the "H1=wordmark / projects-not-in-outline" observations. (Note: the repo's existing `prerender.mjs` bakes only head meta — true SSR/SSG of the body is needed.) | Prerender `/`, `/work/<slug>`, `/certifications` to real H1/H2/H3 + body via vite-react-ssg / `renderToString`. Fixes SEO-2/SEO-3 in one change. | SUPERSEDES |
| SEO-3 / JF-3 / JF-4 / PF-7 | Med | Live DOM: H1 "ontwrpn"; only 3 generic H2s; 6 projects not headings | The H1 is a wordmark; "Product Designer" only in 11px caption; the six Selected-Work projects are styled spans, not headings — invisible to rotor navigation and weak for SEO/the 5-second scan. Meta description ~30 chars (no name/role). | Add a descriptive H1 (keep the wordmark styled); promote each project name to `<h2>/<h3>` linking its `/work/<slug>`; surface role+location+availability in the hero's primary line; expand the meta description to ~140 chars. | CONFIRMS |
| JF-1 | Med | Impact band at ~y3260 of 9115px | Proof/impact stats sit multiple screens below the fold; the hero carries no number — a 10-second scan leaves with a vibe, not the "−68%" stat. (Personal portfolio, not a conversion product, so a persuasion-optimization point.) | Plant one proof number in the hero/intro ("−68% on a colour workflow · 3 live products · end-to-end"); keep the Impact section. | NEW |
| JF-2 | High | Selected-Work tiles (text-only); homepage imgCount=0 | The work index is wordmark + tags + arrow with **no thumbnail** — a visual designer's craft is hidden until a click, and reviewers triage by thumbnail. (Note: per-case pages *do* render real alt-tagged `<img>`; the gap is the homepage hero + Work-index thumbnails being CSS-bg.) | Add a hover/inline still per tile (NUX film-detail, Chroma palette, SVP board) as real `<img>` with alt (doubles as SEO/a11y). | NEW |
| PF-3 | Med | Skills constellation (1440 render) | No label collision-avoidance — leaf labels overlap and garble in the AI/Product clusters a reviewer scrutinizes most ("Cla​ude & Testing Code"). | Add bounding-box repulsion after the force sim settles; offset labels radially; shorten the longest; move parentheticals to tooltips. | NEW |
| PF-4 / A11Y-1 | Med | Constellation interaction + small screen | Pointer/drag-driven ("drag to explore") with no proven touch/SR fallback; the viz encodes the full skills list (recruiter/ATS-scanned) with no parallel text. | Below ~720px, replace the force-graph with a static grouped list / tap-accordion; add a visually-hidden `<ul>` of skill labels + `role=img` aria-label; re-capture at 390 with reveal triggered. | NEW |
| PERF-2 | Med | ~9115px single page + WebGL; og.png 1.0MB | Heavy first load — long DOM + always-running canvas inflate TBT/battery; LCP gated on Typekit (PERF-1); 1MB OG fetched on every unfurl. | Lazy-mount WebGL in viewport, freeze on scroll-away/reduced-motion, static-image first paint; compress og.png (→<300KB); code-split below-fold. | NEW |
| PF-5 / JF-8 / SEO-5 | Med | 12 mobile targets 37-39px ("View all" 24px) | All clear WCAG 2.5.8 AA (24px) but miss Apple's 44px HIG; EN/NL/FR switchers and "View all" are the most mis-tap-prone on the recruiter's likely device. | Lift interactive min-height to ≥44px via padding (keep type size); ≥8px gaps on the language group. | NEW |
| SEO-4 | Low | og.png 980×636, 1.0MB, no alt | OG image below the 1200×630 card size, heavy, and no `og:image:alt`/`twitter:image:alt`. | Export 1200×630, compress <300KB, add image-alt meta. | NEW |
| PF-10 | Nit | Intro H2 + About H2 | Two stacked H2s make the same generalist "I do everything" claim — slightly dilutes a 4-H2 outline. | Keep the intro H2 as positioning; recast the About H2 toward evidence/specifics. | NEW |
| PF-9 | Low | WebGL hero | Full-viewport animated canvas with no measured LCP/perf budget — a flagged risk on mid/low-end mobile, not a confirmed defect. | Measure LCP throttled; ship a static gradient poster first paint, lazy-upgrade to WebGL; serve the static poster under reduced-motion. | NEW |
| PF-8 / JF-6 / FRESH-6 | Low | Portfolio NUX tile/case/embed | "CASE STUDY →" affordance + the NUX "Live — try it" embed point at the stale apex (now landing), and the embedded media is the stale Jun-13 shot — so the "end-to-end" tag's only clickable proof shows a marketing page. | Repoint the NUX `href`/`Live ↗`/embed to `app.nux.ontwrpn.com`; swap the media for a current curation-surface shot. | CONFIRMS |

**Verified-false (not included):**
- **PF-1 — "Count-up Impact stats render −0%/0%/0 with no fallback" (claimed High).** *Refuted.* The "−0%" render is an artifact of the auditor's own animation-kill (MATERIAL.md explicitly labels it "NOT a real defect"); in a normal load the section is simply not-yet-revealed, not zeroed. The portfolio source is out-of-repo, so the "ships containing 0" claim is unverifiable and a reset-to-0-then-animate pattern would look identical when JS is killed mid-load. Residue is a Low **verify** action (confirm the no-JS/reduced-motion/SR fallback value) — already captured as A11Y-2. Corrected High→Low.
- **PF-2 — "Scroll-reveal gates the whole page body behind JS+scroll, invisible to no-JS/crawlers" (claimed High).** *Partial/largely wrong mechanism.* The reveal is *already* opacity-additive (GSAP sets inline `opacity:0` at runtime; **no CSS rule** hides `[data-reveal]`), and reduced-motion forces the visible end state — so for no-JS the reveal doesn't gate anything. The real no-JS failure is unrelated (pure CSR / empty `#root`), which is the **separate** SEO-1. The genuine residue is narrow (a JS-on-but-no-scroll headless render) → Low.
- **SEO-2 — "Zero `<img>` elements site-wide" (claimed High).** *Refuted at site level.* The portfolio is multi-route (`/`, `/work/:slug`, `/certifications`); the case pages already render real `<img>` with `alt`, `loading="lazy"`, `decoding="async"` (380 image refs in case data) — the finding's own proposed fix is already implemented. The `img=0` figure was measured only on the homepage. Accurate residue (homepage hero + Work-index thumbnails are CSS-bg) is the minor JF-2/PF-6 enhancement, not a site-wide crisis. Corrected High→Low.

## 6. Freshness / currency — is the NUX representation current?

**Short answer: no — three concrete, one-line-fixable drifts under-sell a product that has materially leveled up.** The landing/app URL split itself shipped correctly (apex = landing, `app.nux.*` = app, both verified live); the problem is everything still points at the *old* meaning of the apex.

| Stale item | Current state vs what's shipped | Exact update |
|---|---|---|
| **"Live app" URL drift** (FRESH-1 / CS-2 / JF-6) | README.md:6, the Notion callout + gallery ("The web app, live at nux.ontwrpn.com"), and **three** portfolio pointers (work-card `href`, case `Live ↗`, full-page `embed`) all resolve to the **landing**. `nux.ontwrpn.com` → `<title>NUX — An editorial home for British cinema</title>` (marketing); the app is `app.nux.ontwrpn.com` → `<title>NUX — Cinema for Curious Minds</title>`. | Repoint all six to `https://app.nux.ontwrpn.com`; relabel landing=`nux.*` / app=`app.nux.*`; the portfolio embed must embed the **app** so "try it" shows the product, not pricing. |
| **Jun-13 case-study screenshots** (FRESH-2 / CS-6) | `docs/screenshots/web-{home,browse,fd}-desktop.png` + `web-home-mobile.png` (committed Jun-13, unchanged at HEAD, served via raw `main` URLs in Notion) predate ~25 commits. **HOME** shots are hero-only; live home is a full editorial page (~8 named rails + "See all", "The Essential Ten", "Islands of the Mind"). **BROWSE** shows a partial first row; live is a 72-title grid. **FILM DETAIL** is "3RD MAN" typographic backdrop with no Details table; live "Lawrence of Arabia" has a full-bleed still, Details table, "More Like This", Curator FAB, "Marketing site ↗" footer. The home embed's own caption claims rails the embedded image doesn't show. | Re-export Home/Browse/Film-detail desktop + Home mobile (+ figma-*) from `app.nux.ontwrpn.com`; replace in Notion and the portfolio (`/cases/nux/web-*.png` + the work-card preview). Prioritise Home + film-detail. |
| **Catalog count** (FRESH-3 / CS-1) | Notion says "21 posters / 14 stills"; shipped is **72 posters / ~77 stills / 72 titles** (verified via `assets/` + `films.js`). An under-claim. | Update to "72 British films, each with a bespoke poster + editorial still"; wire to a single source. |
| **Wireframe font claim** (FRESH-4 / CS-8) | Notion names "Plus Jakarta Sans" as a system font; `grep` returns **zero** hits in shipped CSS/JS — it survives only in `design/_archive/`. Shipped system is Fraunces/Inter/Newsreader. | Frame it as the deliberate Wireframe-mode-only font, or drop it; fix the separate stale "Playfair/Mono" naming in `design/DESIGN_DIRECTION.md`. |
| **Figma scale claims** (FRESH-5 / FT-6 / CS-7) | `0 raw / 100+ components / 71 screens / 4 platforms incl tvOS` are asserted, not verifiable from the capture, and the iPad layout has at least one Figma↔live drift. | Re-run the scripted Figma audit before the next review; either re-sync Figma iPad or note the denser intent as a known gap; soften the platform line to what's live. |

**Net:** the freshness drift *hurts by under-selling*. The live app is the strongest, most current piece in the portfolio (END-TO-END 2026) — fix the link, screenshots, and counts as one sweep.

## 7. Prioritized roadmap

**Do first (highest leverage, mostly one-line/one-prop):**
- Repoint every "live app" link/embed to `app.nux.ontwrpn.com` — README, Notion ×2, portfolio ×3. `[portfolio][case][app]`
- Re-export the Jun-13 NUX screenshots from the current app; refresh Notion + portfolio. `[case][portfolio]`
- Pass `note={REASONS[f.id]}` on Browse/Genre/MyList — the single biggest thesis gap (V-1). `[app]`
- Introduce a tablet tier (~744-1024 / `pointer:coarse`): iPad gets the tab bar + denser grids (R-1/R-2/R-5/HIG-2). `[app]`
- Add `preconnect` + `font-display:swap` (or self-host) for Typekit (PERF-1). `[portfolio]`

**Do next:**
- Re-sync `landing/tokens.css` and add a CI parity guard (LND-DS-01/FT-4). `[landing][ds]`
- Route action/active/progress/border states through their semantic tokens; add `--state-active` (DS-01/DS-02). `[ds]`
- Add `--type-pullquote` and route the four landing consumers through it (FT-1/V-3). `[ds][landing]`
- Add a "How I tested it" chapter (Chalkmark Browse→Genres) + the catalog count + a tradeoffs/"what's next" pass (CS-3/CS-1/CS-4). `[case]`
- Prerender the portfolio routes to real HTML; promote project names to headings (SEO-1/SEO-3). `[portfolio]`
- Tag the Downloads page "Demo" to close the honesty gap (F-03). `[app]`
- `-webkit-tap-highlight-color: transparent` + `overscroll-behavior: contain` on sheets/rails (HIG-3/HIG-4). `[app]`
- Add real `<img>` thumbnails to the portfolio Work index (JF-2). `[portfolio]`

**Polish:**
- Add a z-index scale; delete/wire the 9 dead tokens (DS-04/DS-03). `[ds]`
- Auth `100svh`; mobile Browse pagination + sticky filter + back-to-top (HIG-5/R-3). `[app]`
- Curly-quote sweep + `&nbsp;` fixes + "Play trailer" parity (F-04/05/06/07). `[app][landing]`
- Constellation label collision + touch fallback + parallel skills list (PF-3/PF-4). `[portfolio]`
- Bump 44px touch targets; expand meta description; 1200×630 OG (PF-5/SEO-4). `[portfolio]`
- Annotate the latent sub-AA token pairs (A11Y-04); reconcile `UI/Caption` 11/13px (FT-2). `[ds]`
- One manual SR + forced-colors + trailer-caption pass before claiming full WCAG 2.2 AA (A11Y-07). `[app]`

## 8. What's genuinely strong

- **The token system is the project's best idea, well executed.** 1,229 `var()` references with zero raw NUX-palette literals, principled primitives→semantic→component layering, inline WCAG ratios that *match* the code, and the foreign NeonDrift palette correctly sandboxed as local scoped tokens with a comment. `!important` appears in exactly 5 places — all legitimately in the reduced-motion block.
- **Contrast holds end-to-end, verified.** text-primary 11.7-17.6:1, text-secondary 5.78-8.69:1; ink-on-amber Play button = **7.07:1** (the case study's "7.1:1" is accurate); white-on-amber (2.76:1) ships nowhere.
- **Accessibility is genuinely strong** — single `:focus-visible` amber ring surviving forced-colors, all three modal widgets manage focus/inert/Esc/trap/restore correctly, the Watch player is a model custom-widget (full keyboard map + `aria-live`), forms wired with `aria-invalid`/`describedby`/`role=alert`, reduced-motion honored on every motion surface.
- **Native feel is real, not webby** — glass is *selective* (chrome + on-artwork only, never card bodies), a faithful iOS-26 floating tab bar + detached search, systematic 44px touch targets via the content-box padding trick, a single `--press-scale` token unifying tap feel.
- **Curation is now visible at the card on Home** and the Curator chapter (catalog-in-prompt grounding, id-allowlist, Gemini→Groq failover, injection guard) is a real product-engineering decision log — the differentiator is *shown*.
- **Landing CTA discipline and copy are exemplary** — exactly two CTA tokens, one amber pill per region; copy reads human with zero AI-slop vocabulary, an honest "portfolio concept" disclosure, and precise trailer-vs-film labelling.
- **Figma↔code parity is value-for-value clean** on color/spacing/radius/core-type, and the one-source/two-mode (Wireframe/Hi-Fi) architecture is the textbook-correct way to run lo-fi/hi-fi.
- **The case study and portfolio carry genuine maturity** — the contested-evidence choice-overload caveat, the honest no-users impact reframing, the design+shipped-AI+CS-rigor profile, strong head-level SEO/JSON-LD, and a complete, low-friction contact close with the right EU/sponsorship signal.
- **The Collection ("The Essential Ten") page and the landing remain the visual high points** — warm near-black ladder, single rationed amber, Fraunces display, editorial N° eyebrows: exactly "Criterion designed the product, Apple wrote the interaction layer."

---

## 9. Appendix — NUX case on the portfolio, re-checked in EN · NL · FR (live, main-loop)

Live-checked 2026-06-25 via Playwright. Pages: `ontwrpn.com/work/nux` (EN), `/nl/work/nux` (NL), `/fr/work/nux` (FR).
The portfolio has a DEDICATED, coded NUX case page (distinct from the Notion case), fully localized in 3 languages.

## Verdict: localization quality is EXCELLENT — issues are shared across all 3 languages (one data source)

### Strengths (all 3 languages)
- **Complete & fluent** — identical structure in each language: same 8 H2 sections (concept / token-modes / catalog & imagery / AI Curator / Neon Drift / responsive build / Sources), 20 paragraphs, 7 images, all with alt text (imgMissingAlt = 0). No untranslated English leftovers in NL or FR body copy (Sources citations correctly stay in English; product UI names — Home/Browse/Play, "Islands of the Mind" — correctly kept).
- **Correct per-locale i18n SEO** — `<html lang>` = en/nl/fr; `og:locale` = en_US / nl_NL / fr_FR; full `hreflang` set (en, nl, fr, x-default) on every page; translated `<meta description>` per language; localized `<title>`/back-link ("← Projects" → "← Projets").
- **NL is idiomatic** — "keuzestress", "bouwsteen", "dichtgetimmerd tot 0 hardcoded waarden", "zwevende glazen tabbalk", "geharde non-root-container". European decimals correct: "17,0:1 / 8,4:1 / 5,2:1", "2,5%".
- **FR typography is rigorous** (rare to see done right): guillemets « » used throughout (no straight/curly quotes); **16 non-breaking spaces before high punctuation `; : ! ?`, with 0 plain-space violations**; correct nbsp inside « … » (0 violations); `≤10 %`, `2,5 %`, `17,0:1` all spaced/decimal-correct French. Layout holds with the longer French strings (hero + meta block confirmed visually, `nux-case-fr-hero.jpeg`).

### Issues (apply to EN + NL + FR — fix once at the shared data source)
1. **HIGH — "Live" demo link points to the LANDING, not the app.** On all three case pages the "Live ↗" link and the in-page "Live demo / Démo en ligne — try it" button href = `https://nux.ontwrpn.com`, which now serves the marketing **landing** (`<title>NUX — An editorial home for British cinema</title>`). The actual app is `https://app.nux.ontwrpn.com` ("Cinema for Curious Minds"). A reviewer clicking "try the live demo" on the case study lands on marketing, not the working product. → repoint to app.nux.ontwrpn.com (or label clearly: "Marketing site" vs "Open the app"). Same drift as the Notion case + README.md:6.
2. **MEDIUM — Figma link uses a DIFFERENT file than the canonical one.** All 3 pages link Figma to file `oW61WvsNzi8iIze5kaJoX7` ("NUX — HEC Montréal"), but `frontend/src/styles/tokens.css` header and the Notion case both cite `UPtAtDiB37eSssdOGZ8nrq`. Both files exist and both have a "🎨 Design System" page (the linked one resolves fine — likely a clean public duplicate). → confirm `oW61…` is the current/polished copy, and unify the public Figma link across portfolio + Notion + the tokens.css header so a cross-referencing reviewer sees one canonical file.
3. **LOW (optional polish)** — a few design/UX anglicisms kept untranslated in NL/FR where a native term exists: TL;DR label "Insight" (FR could be "Observation/Éclairage"), "eyebrow ambré" (FR "surtitre"). Defensible as jargon; only worth touching if aiming for fully-native copy.

### Claim consistency across languages
The factual claims ("4 platforms / 71 screens", "0 unbound/hardcoded values", "21 posters / 14 stills", "33 screens per mode", "Plus Jakarta Sans" wireframe font, "50+ components per platform") are IDENTICAL across EN/NL/FR — no per-language claim drift. (Whether those numbers are still current vs the live app is the separate freshness lane's job; here the point is the translations don't contradict each other.)
