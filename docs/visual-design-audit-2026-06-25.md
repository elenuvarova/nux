# NUX — Visual Design Audit (Graphic Design + UX/UI principles)

**Date:** 2026-06-25
**Scope:** Both deployed surfaces — the streaming **app** (`app.nux.ontwrpn.com`) and the **landing/marketing site** (`nux.ontwrpn.com`).
**Source:** Fresh live screenshots captured from production (not `dist/` or Figma), via a throwaway account, across **three breakpoints — 1440 (desktop) · 834 (iPad) · 390 (iPhone)**.
**Method:** ~32 frames captured (all rails/grids hydrated so no blank lazy-load artifacts), then four independent senior passes — (A) app graphic design, (B) app UX/flows/states, (C) responsive, (D) landing + brand consistency — each judged against the intended **"Criterion Ink"** system, then de-duplicated and severity-sorted here. **Report only — no code changed.**
**Frames:** `_audit-frames/` (untracked).

---

## Rubric baseline (the intended system, from `design/DESIGN_DIRECTION.md`)

Judged against intent, not taste. NUX = *"what it would look like if Criterion designed a streaming product and Apple wrote the interaction layer."* Persona: Jeremy, grad student, watches with intention. Thesis: **"curation as the product."**

- **Color:** warm near-black `#0D0C0B`; surfaces `#161412`/`#1E1B17`; text warm-white `#F0EDE8` / secondary `#9A9087` / tertiary `#5A5249`. **Single accent: amber-gold `#C8922A`** for primary actions/active states *only*. Media-type tag colors: Film gold, Doc slate-blue, Game mint, Course violet.
- **Type:** Playfair Display (display/headings) · Inter (body/UI) · JetBrains Mono (eyebrows/metadata).

---

## A note on rigor — two "Critical" claims were tested live and disproven

Two specialist passes each raised a Critical. I verified both against the live DOM before promoting them, and **both were false** — included here because the verification is part of the audit:

1. **"The player has zero controls once playing — no way to pause, seek, or exit."** *Disproven.* The player exposes a complete auto-hiding transport bar — `Go back · Back 10s · Pause · Seek (slider) · Forward 10s · Mute · Volume · Subtitles · Settings · Fullscreen`, with a `0:12 / 2:03` time display. The screenshot merely caught the controls in their auto-hidden (`player--idle`) state. **This is a strength, not a defect.**
2. **"Mobile Browse has ~6,000px of dead black scroll below the footer."** *Disproven.* Live measurement: document height 12,898px, footer bottom 12,815px → only **83px** below the footer (normal safe-area). The page is legitimately tall because Browse renders all **72 titles** in one 3-column mobile grid. The "void" was unloaded lower poster rows rendering black in the tall full-page JPEG — a capture artifact. (A milder, real version survives below as M-11.)

**Net: there are no Critical visual defects.** The work is well above the portfolio bar and production-grade in places. The highest-leverage items are about *pushing the differentiator harder* and *tightening system discipline*, not fixing breakage.

---

## What's genuinely working

- **The editorial hero is the thesis, realized.** Film detail and Home hero (`app-film-1440-full`, `app-home-1440-loggedin-full`): Playfair at display size, a gold `FILM · EPIC` Mono eyebrow, one amber `Play` against neutral `My List`/`More Info`. This reads exactly like "Criterion meets Apple."
- **The Curator overlay is the single best expression of the product** (`app-curator-result-1440`): prose recommendation + poster picks that each carry a *reason* ("Dark psychological maze", "Eerie gothic atmosphere"). This is "curation shown, not told" done right — and the bar the rest of the app should meet.
- **The Collection / "Essential Ten" page is the visual high point** (`app-collection-1440-full`): numbered editorial list, poster + Playfair title + Mono metadata + a real sentence of rationale per entry.
- **The mobile build feels natively iOS, not a shrunk desktop** (`app-home-390-viewport`, `app-curator-390`): a floating bottom tab bar in the thumb zone + a separate search button, and the Curator opening as a tall bottom sheet with a docked, above-the-keyboard input.
- **System screens carry real state, not stubs** (`app-downloads-1440`): storage meter, per-item status (done / downloading / "Expires in 3 days"). The player pre-roll honestly labels "Trailer · Full film 3h 47m" so it never pretends the trailer is the feature.
- **Type role-casting is disciplined across both surfaces** — Playfair display / Inter body / Mono eyebrow holds on app *and* landing; the warm-black + single-amber palette is faithfully echoed on the landing (closer to the app than prior audits implied).

---

## Cross-cutting themes (in priority order)

These recur across many frames; fixing the *theme* (often one component or one token rule) propagates everywhere.

**1. The differentiator is invisible at the atomic unit — the poster card.** "Curation as the product" only appears in the Curator overlay and the Collection page. The other ~95% of the app (Home rails, Browse, Genre, Search) uses generic poster + title + director + year — the *same posters* with and without a reason, which makes the gap glaring. **Highest-leverage fix in the whole audit.** → H-1.

**2. The poster-imagery system is unsystematic.** Raw vintage poster art at different scales, crops, color temperatures and resolutions sits in identical frames (flea-market wall, not a designed grid); the *same* posters repeat across adjacent rails; type-tags sit on busy art with no chip plate. One card-component pass fixes Home, Browse, Genre, Collection, Search and Curator at once. → H-2.

**3. Single-amber discipline is slipping.** Amber is the system's "primary action / Play" signal, but a solid-amber Curator FAB/pill competes with Play on nearly every screen; the landing runs *three* CTA treatments and stacks two amber pills in one hero; a pause control and a stray hairline also spend amber on non-actions. → H-3, H-5, M-9.

**4. The onboarding/account model doesn't tell one story.** The taste picker says "step 2 of 2" but there is no visible step 1; the user lands in a guest Home that can save to a list, while account state elsewhere is fully "Member" — the guest↔account boundary is never signposted. → H-4.

**5. Text-over-image & dim-grey contrast is the recurring accessibility risk.** The *named* palette tokens pass AA, but **derived** cases don't reliably: hero/Kes synopsis over bright image regions, type-tags over posters, and "Demo" tags (~3.3:1). Confirm with a contrast pass; never put white text on amber. → M-1 + appendix.

---

## App — graphic design (desktop)

| # | Sev | Frame(s) | Evidence (where) | Principle | Fix |
|---|-----|----------|------------------|-----------|-----|
| **H-1** | High | `app-home-1440-loggedin-full`, `app-browse-1440-full`, `app-genre-drama-1440-full` | Every rail/grid card is just poster + title + director + year. The curatorial *reason* exists only in the Curator overlay & Collection page. | Product thesis / "curation shown vs told" | Add a reason slot to the **poster-card component** — a Mono micro-caption under metadata (persistent, like Collection) or a reason that fades in on hover. Reuse the Curator card's existing reason slot. Even one rail carrying reasons closes the gap. |
| **H-2** | High | `app-home-1440-loggedin-full`, `app-genre-drama-1440-full`, `app-collection-1440-full` | Mixed crops/scales/temperatures/resolutions in identical frames; several scans look soft; the *same* posters (Black Narcissus, Naked, Billy Elliot, 45 Years, The Souvenir) repeat across Drama / Art House / Trending in one viewport. | Imagery system / consistency / curation credibility | Pick one treatment and enforce: uniform 2:3 with a `surface` letterbox + 1px `#2E2A24` for art that doesn't fill, **and** a subtle warm-grade overlay to unify temperature. Set a min source resolution. De-dupe titles across adjacent rails. |
| **M-2** | Med | `app-home-1440-loggedin-full`, `app-genre-drama-1440-full` | Type-tag (`FILM`, `HORROR`) sits directly on busy poster art with no plate and disappears into it (e.g. over The Red Shoes red, Peeping Tom). | Tag legibility over imagery | One chip token: `#1E1B17` @ ~70% + 1px `#2E2A24`, 2px radius — colored label always has a controlled backdrop. |
| **M-3** | Med | `app-home-1440-loggedin-full` ("Essential Ten" promo) | Short text column left, large abstract amber light-flare image right with a hard unaligned edge; breaks the poster-led rhythm and reads unfinished. | Layout/alignment, Gestalt | Use real Collection covers (mini stack of the 10) or give the image deliberate full-bleed with the headline overlaid; align its top/bottom to the text column. |
| **M-4** | Med | `app-curator-open-1440` vs `app-curator-result-1440` | Header height jumps between states: a "New" pill inserted in the result state squeezes the subtitle from one line to two. | Cross-state consistency | Reserve a fixed header min-height for both states; place "New" so it doesn't reflow the subtitle. |
| **M-5** | Med | `app-curator-result-1440` | Third result card ("Don't Look Now") is clipped mid-card, severing its tag and truncating `NICOLAS ROEG · 19…`. | Edge alignment | Show 2 full cards + a *consistent* peek of the 3rd, or narrow cards so 3 fit; keep ≥16px end padding so a card is never severed at its tag. |
| **L-1** | Low | `app-search-results-1440` | Two near-identical amber Curator entry points on one screen: inline "✦ Ask the Curator" pill **and** the "✦ Curator" FAB. | Accent discipline / redundancy | Keep the contextual inline one; suppress the global FAB when it's present, or make the FAB icon-only. |
| **L-2** | Low | `app-home-1440-loggedin-full` | "What we're showing" page title reads as Inter/lighter weight, while peer page titles ("Drama", "Browse", "Essential Ten") are Playfair display. | Type role consistency | Set the Home section title in Playfair to match the page-title role (or make the sub-tier distinction systematic everywhere). |
| **L-3** | Low | `app-genre-drama-1440-full`, `app-browse-1440-full` | Card metadata in very small all-caps Mono truncates and reads noisy ("POWELL & PRESSB…"). | Metadata legibility | Bump Mono one step with slightly reduced tracking, or move director to sentence-case Inter `text-secondary` and reserve Mono for year/runtime. |
| **N-1** | Nit | `app-collection-1440-full` | Some list thumbs carry the poster's own baked-in white border ("Saint Maud", "The Third Man"), breaking the left-edge rhythm against the dark page. | Imagery framing consistency | Apply a uniform `#2E2A24` + `radius-sm` mask so the frame, not the source art, defines the edge. |
| **N-2** | Nit | `app-search-results-1440` (empty) | Empty-state block is dead-centered in the viewport, far below the "0 titles" header — the query and the answer lose proximity. | Gestalt / proximity | Anchor the empty block near the results header (bounded top padding ~`space-12`), not viewport-center. |

---

## App — UX / flows / states (desktop)

| # | Sev | Frame(s) | Evidence (where) | Principle | Fix |
|---|-----|----------|------------------|-----------|-----|
| **H-4** | High | `app-onboarding-taste-1440` (+ guest Home, `app-profile`, `app-mylist-empty`) | Stepper says "step 2 of 2" but no step 1 was ever shown; user lands in a *guest* Home that can save to My List, while account state elsewhere is full "Member" — the guest↔account boundary is never signposted. | Match system & reality / visibility of status | Make Welcome the honest step 1 (or drop the stepper on a one-question screen). Signpost guest state ("Browsing as a guest — create an account to keep your list") and soft-gate the first save. |
| **M-6** | Med | `app-onboarding-taste-1440` | "Continue" is enabled with no selection and no skip; selected-vs-unselected card state isn't clearly visible. | Feedback / error prevention | Make selection unmistakable (amber ring + check). If 0 is allowed, relabel: "Skip for now" at 0 → "Continue" at ≥1. |
| **M-7** | Med | `app-signup-1440`, `app-signin-1440` | No error/validation states designed — only a static "At least 8 characters." No email-format check, field error, or submit-failure region. | Error prevention & recovery | Specify inline field errors (a red distinct from amber), live password-rule satisfaction, email check on blur, and a form-level error region ("email already in use"/network). Hand the exact copy to the builder. |
| **M-8** | Med | `app-mylist-empty-1440` (captured frame shows one item — true empty unverified), `app-downloads-1440` | The genuine empty state is undesigned/unconfirmed; a freshly-onboarded user hitting "nothing here" is a dead end. | Empty states as first-class | Design the true empty state: Playfair line ("Your list is empty") + one value sentence + one amber CTA → "Browse the catalogue". Re-export the genuinely-empty screen. |
| **M-9** | Med | `app-mylist`, `app-downloads`, `app-profile`, `app-settings` | A stray full-width **amber hairline** sits under content on every system page — the brand's most precious color spent on noise. | Restraint / accent reserved for actions | Remove it, or if it's a divider, use the muted `#2E2A24` hairline — not amber. |
| **M-10** | Med | `app-profile-1440-full`, `app-settings-1440-full` | "Demo" tags (Notifications, Billing, Manage devices) are ambiguous (disabled? sample? coming-soon?) and the grey sits near the AA floor. | Real-world language / consistency / contrast | Replace with one consistent meaning ("Coming soon" + visibly disabled row) and lift the tag color to clear 4.5:1. |
| **L-4** | Low | `app-signin-1440`, `app-signup-1440` | Input fields are nearly invisible until focused (dark-on-dark, very low resting border); helper alignment differs between the two forms ("Forgot password?" right vs "At least 8 characters." left). | Affordance / consistency | Raise resting border contrast so an empty field reads as a field; unify sub-field helper alignment across both forms. |
| **L-5** | Low | logged-in headers (`app-mylist`, etc.) | The account menu is an icon-only avatar with no caret/label — new users won't know the menu lives behind their photo. | Affordance / recognition | Add a disclosure caret + hover ring + accessible label ("Account menu"). |
| **N-3** | Nit | `app-downloads`, `app-mylist` | Curator FAB can overlap footer links / the © line on shorter pages. | Don't occlude content | Add bottom inset so the FAB never overlaps the footer, or hide it when the footer is in view. |

*Player note (verified):* transport controls are **complete and correct** (auto-hide on idle, reveal on input). Optional polish only — consider briefly showing controls for ~2s on first play so their existence is discoverable.

---

## App — responsive (390 / 834)

| # | Sev | Frame(s) | Evidence (where) | Principle | Fix |
|---|-----|----------|------------------|-----------|-----|
| **H-3** | High | `app-home-390-viewport`, `app-film-834-full`, `app-home-834-full` | Solid-amber Curator FAB (mobile) / pill (iPad) competes with the amber Play CTA — two filled-amber actions per screen dilute "amber = play this". | Accent discipline / one primary per screen | Demote Curator to neutral dark glass with an amber *icon glyph* (or thin amber border); reserve solid-amber fill for Play only. |
| **H-6** | High | `app-home-834-full`, `app-film-834-full` | **iPad is a stretched phone:** rails still show ~3 posters across at 834px, hero stays single-column narrow with wide empty backdrop, and nav is a desktop top-bar with no tab bar. | iPad use of space / native iPadOS feel | At `≥744`: rails 4.5–5.5 posters peeking; Browse 4–5 columns; 2-column hero (art + larger Playfair title + 60–75ch synopsis). Decide one touch nav model (keep the tab bar on iPad). |
| **M-1** | Med | `app-home-390`, `app-browse-390`, `app-film-390` (+ desktop hero) | Poster bylines truncate after ~14 chars **and** the Mono caption is low-contrast at small size; type-tags over busy posters likewise. Suspected AA failures on derived greys. | Contrast / type scaling (WCAG AA) | Lift caption color/weight to clear ~4.5:1 at size; consider 2.4-up mobile rails so titles get ~25% more width; chip plate behind tags (ties to M-2). **Confirm ratios in an accessibility pass.** |
| **M-11** | Med | `app-browse-390-full` | Browse renders all **72 titles** in one ~12.9k-px mobile scroll — no pagination, "load more", or jump-to-genre. (This is the *real* version of the disproven "dead scroll".) | Progressive disclosure / scannability | Chunk the grid (paginate / infinite-scroll in batches) or add sticky genre/type filters + a back-to-top, so the mobile catalogue isn't a single 14-viewport scroll. |
| **M-12** | Med | `app-home-390-viewport` | Hero packs three pills on one line (Play / + My List / More Info) at 390 — cramped, tight to the safe-area, wrap-risk under Dynamic Type. | Touch spacing / type scaling | Show Play + My List only on mobile; move "More Info" to a tap on the hero or an (i) icon. Keep ≥8px between pills, ≥16px to edges. |
| **L-6** | Low | `app-film-390-full` | Cast & Crew avatar rail has no clear next-item peek and the amber Curator FAB overlaps its right edge ("Kathl…" under the FAB). | Rail affordance / occlusion | Add a half-avatar peek; reserve a right inset = FAB width + 16px so the FAB never overlaps rail content. |
| **L-7** | Low | `app-curator-390` | In-sheet result rail relies on a thin scrollbar; last card clips ("Don't L…"). On touch the *peek* is the affordance, not the bar. | Scroll affordance | Show a clear half-card peek + ≥16px end padding. |
| **N-4** | Nit | `app-home-390-full`, `app-settings-390-full` | Desktop-style footer link row (About/Help/Privacy/Terms/©) repeated on mobile feels webby; links are small, closely-spaced targets. | Native feel / touch targets | Move these into Settings/Profile on mobile, or space links to ≥44px targets. |

---

## Landing — graphic design + UX + brand consistency

**Headline (brand drift):** the landing now genuinely *looks like NUX* — same warm-black, same single-amber accent, same Playfair/Inter/Mono casting. The real divergences from the app's discipline are **CTA-system fragmentation** and **section rhythm**, plus a copy/pricing contradiction.

| # | Sev | Frame(s) | Evidence (where) | Principle | Fix |
|---|-----|----------|------------------|-----------|-----|
| **H-5** | High | `landing-1440-hero`, `landing-1440-mid`, `landing-1440-lower`, `landing-390-hero` | **Three competing primary-CTA treatments:** amber pill (`▶ Start watching`), amber underline-link (`WATCH IT →` / `Browse the catalogue →`), and a ghost link — with *two* amber `Start watching` pills stacked in the first viewport (desktop and mobile). | Brand consistency / one button system / one primary action | Define exactly two CTA tokens — Primary = amber pill (ink-on-amber), Secondary = ghost/underline in `#9A9087` — and use them everywhere. One filled-amber CTA per viewport; demote the header CTA to ghost so the hero pill is the single dominant action. |
| **H-7** | High | `landing-1440-lower`, `landing-390-full` | **Value-prop contradiction:** Free column says "the whole catalogue… **no account needed**", but the paid column says "Free for 14 days. Nothing charged today" and the hero verb is "Start watching" (which needs a trial + account). | Pricing trust / message coherence | Pick one spine: if Free = "browse, no account", relabel the paid CTA honestly ("Start free trial") and drop the "no account" adjacency; align the hero verb to the action it triggers. |
| **M-13** | Med | `landing-1440-lower` | ~280px of empty black between the pricing card and the colophon — reads as if the page ended / a section was removed. | Section rhythm | Tighten to one section-gap token (~120px desktop); the colophon should sit directly under pricing. |
| **M-14** | Med | `landing-1440-mid` (Kes card) | Inter body sits over a brighter graded region of the still; secondary `#9A9087` is likely below AA there. | Contrast / text-over-image | Left-anchored scrim `linear-gradient(90deg, rgba(13,12,11,.85) →55%, transparent)` behind the text column; re-verify ≥4.5:1. |
| **M-15** | Med | `landing-1440-hero`, `landing-390-hero` | Headline widow — `everything` drops alone to a third line (desktop and mobile), against the house "no single-word widows in headings" rule. | Typography / widows | `text-wrap: balance` or a `&nbsp;` between the last two words; tune hero max-width so line 3 carries ≥2 words. |
| **M-16** | Med | `landing-390-full` | Pricing plans compress into a tight two-card stack at 390; billing toggle tap target looks under 44px. | Mobile execution / targets | Stack plans vertically (Free above Premium) ≤480px; toggle ≥44px height with a clear `#C8922A` active state. |
| **L-8** | Low | `landing-1440-mid` vs `landing-1440-lower` | Eyebrow accent applied inconsistently — `N°05` amber + grey label in places, fully-grey elsewhere. | Accent / eyebrow consistency | One rule: number in accent, label + em-rule in `#9A9087`, applied to every `N°0x`. |
| **L-9** | Low | `landing-1440-full`, `landing-390-full` (catalogue grid) | Catalogue tiles mix aspect ratios/treatments; one near-monochrome still beside saturated art makes the wall ragged. | Imagery consistency | Normalize to 2:3 + uniform radius + a consistent subtle grade. |
| **N-5** | Nit | `landing-1440-hero` | Background poster-wall has pure-white poster fields (Richard III, The Devils) that spike luminance and pull focus from the Playfair headline. | Hierarchy — support shouldn't out-shout | Apply a uniform ~12–18% darken to background posters (active poster excepted). |
| **N-6** | Nit | `landing-1440-lower` | Colophon set in Playfair *italic* at body size — a one-off serif-body texture; `£4.99` rider "a month" sits low against the giant numeral. | Type role / baseline | Cap the note to ~60ch and document `--type-note` (or move to Inter); align the price rider to the numeral's cap-height baseline. |

---

## Appendix — suspected contrast (confirm with an accessibility pass)

The **named** tokens pass AA (computed): secondary `#9A9087` on `#0D0C0B` ≈ 6.25:1; warm-white ≈ 16.7:1; amber-as-text ≈ 7.07:1; current ink-on-amber button ≈ 6.6:1. The **risks are in derived/over-image cases**, all eyeballed from JPEGs — verify against live computed values before treating as binding:

- Hero & Kes synopsis (`#9A9087`) over the **bright** regions of a backdrop (app `app-film-1440-full`; landing `landing-1440-mid`).
- Type-tags and bylines over busy poster art at card size.
- "Demo" tags (`app-profile`/`app-settings`) ≈ 3.3:1 — below AA.
- **Guardrail:** never set **white** text on amber (≈ 2.37:1). Keep ink-on-amber. Audit any hover state that flips button text to white.

---

## Prioritized roadmap (by leverage)

**Do first (portfolio-defining, mostly one component/token each):**
1. **H-1 + H-2 — the poster card.** Add a curatorial reason slot and normalize poster imagery (+ de-dupe across rails, + tag chip M-2). One component → fixes Home, Browse, Genre, Collection, Search, Curator. This is the single biggest move; it makes "curation as the product" visible where the product actually lives.
2. **H-3 + H-5 — amber discipline.** One rule, app + landing: solid-amber fill = primary/Play only; Curator and all secondary CTAs go neutral/ghost. Collapses several findings at once.
3. **H-7 — pricing/identity coherence.** Resolve "no account" vs "14-day trial / Start watching" before it ships.

**Do next:**
4. **H-4 / M-6 — onboarding honesty** (real step 1, visible selection, guest signposting).
5. **H-6 — iPad as a tablet** (column counts, 2-column hero, touch nav).
6. **M-7 / M-8 — error & empty states** (auth validation; true My List/Downloads empties).
7. **M-13 / M-15 / M-16 — landing rhythm, headline widow, mobile pricing.**

**Polish:** M-9 (amber hairline), M-10 ("Demo" tags), M-11 (mobile Browse pagination), M-1 + appendix (contrast pass), the Low/Nit list.

---

## Counts

| Surface | High | Med | Low | Nit |
|---|---|---|---|---|
| App — graphic design | 2 | 4 | 3 | 2 |
| App — UX/flows/states | 1 | 5 | 2 | 1 |
| App — responsive | 2 | 4 | 2 | 1 |
| Landing | 2 | 4 | 2 | 2 |
| **Total (de-duplicated)** | **7** | **~14** | **~9** | **~6** |

**Critical: 0** (two candidate Criticals tested live and disproven). Overall: a confident, coherent, production-grade visual system whose biggest opportunity is to make its own differentiator — curation — visible at the poster-card level, and to hold its single-amber discipline across every surface and breakpoint.
