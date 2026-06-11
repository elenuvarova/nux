# NUX Hi-Fi Direction — Visual Language for the Dark Pass

**Scope:** the hi-fi visual system that replaces the greyscale wireframes. Brand anchors already locked: page `#0D0C0B` (warm near-black), accent `#C8922A` "Criterion Ink" (amber), type currently Plus Jakarta Sans (headings) + Inter (UI/body). Platforms: iPhone, iPad, desktop web, tvOS.
**Method:** Mobbin screen research (MUBI GO, Apple TV, HBO Max, Letterboxd, Prime Video, The New Yorker) + design-press breakdowns (Spin's MUBI identity, Criterion Fonts In Use, Type/Code's A24 app, Material dark theory, Apple tvOS 26 / Liquid Glass).
**Companions:** `MOODBOARD_NOTES.md` (site-level research, MUBI deep dive), `MOBBIN_COMPONENTS.md` (per-component references). This doc does not repeat them — it decides the *visual* system.

---

## 1. Dark surface system — elevation without shadows

How the premium dark apps actually do it:

| App | Notes | Link |
|-----|-------|------|
| Apple TV (iOS) | **Pure `#000000` page.** Elevation = content imagery + hairlines only; poster art carries all the color. Floating tab bar is a blur material, not a surface step | [view](https://mobbin.com/screens/fd5f8813-9cea-4065-bed3-aba6c6f9b149) |
| Letterboxd | Blue-grey ladder: page `~#14181C` → cards `~#2C3440` → sheets lighter still. Clearest "lightness = elevation" example in a film app | [view](https://mobbin.com/screens/fd0fae1c-e102-46f6-8f77-34f573024407) |
| HBO Max | Neutral near-black `~#0B0B0C`; hero art dissolves into the page color, cards sit on the same surface with no border — hierarchy from imagery alone | [view](https://mobbin.com/screens/5c3fb788-336a-4c29-8225-a573b92049e6) |
| Prime Video | Cool navy-black `~#00050D` — proof that the undertone *is* the brand. Feels colder/more retail than MUBI's warmth | [view](https://mobbin.com/screens/f9e83e55-6ae9-43e6-bf17-68deaad597c3) |
| MUBI GO | **Warm brown-black `~#2A241E`** — the warmest dark in streaming; makes film stills feel like prints on dark paper | [view](https://mobbin.com/screens/94621caa-de49-4098-b761-8307768de5c5) |
| Letterboxd (action sheet) | Raised sheet steps two surface levels up from a blurred page — elevation purely by surface lightness | [view](https://mobbin.com/screens/fcf0ab7b-02d7-42ea-a00f-3acb98827d99) |

Theory (Material dark theme, Atlassian elevation, Uxcel dark-UI guide): shadows are nearly invisible on dark; elevation is communicated by **lighter surface per level (+4–5% lightness per step)**, **hairline borders**, and **blur materials** — not drop shadows. Sources: [Material dark theme](https://m2.material.io/design/color/dark-theme.html), [Atlassian elevation](https://atlassian.design/foundations/elevation), [Uxcel dark-UI elevation guide](https://uxcel.com/blog/mastering-elevation-for-dark-ui-a-comprehensive-guide-342).

**NUX surface ladder (all warm — same brown undertone as `#0D0C0B`, R>G>B always):**

| Step | Hex | Use |
|------|-----|-----|
| sunken | `#070606` | input wells, progress tracks, player chrome background |
| **page** | **`#0D0C0B`** | app background (locked) |
| raised | `#161412` | cards, nav rail, list rows, sticky headers |
| overlay | `#1F1C19` | modals, popovers, context menus, sheets |
| muted | `#25211C` | skeletons, poster placeholders, pressed chips, hover fills |

**Rules:**
- Max **two surface steps visible in one region** (page + raised, or raised + overlay). Three reads as clutter.
- Every raised surface gets a **1px hairline** instead of a shadow: `border: 1px solid rgba(255,255,255,0.08)` (subtle) or `0.14` (interactive/default). Same pattern as Linear (see MOODBOARD_NOTES §5).
- Shadows exist only on **overlay** level and only as ambient depth, not definition: `0 16px 48px rgba(0,0,0,0.5)` — the hairline does the outlining.
- **Glow, not shadow, for emphasis:** featured/hero modules may use a soft amber bloom behind the title block — `radial-gradient(60% 40% at 30% 70%, rgba(200,146,42,0.10), transparent 70%)` — Vercel point-light logic (MOODBOARD_NOTES §8), never above 12% alpha.
- **Pure `#000000` is allowed in exactly one place: the video player** (full-screen playback, OLED-friendly, content is the light source). Everywhere else stays warm `#0D0C0B` — pure black kills dark photographic stills (already noted vs Vercel) and reads "device off", not "cinema".

---

## 2. Accent discipline — amber on dark without the casino

The single best reference is MUBI GO — a gold-on-warm-black app that never reads as a slot machine:

| App | Notes | Link |
|-----|-------|------|
| MUBI GO | Yellow used for: caps **eyebrow headlines**, **outlined** pill buttons (TRAILER), one filled CTA per screen, and the ticket card — a deliberate "document" moment. Everything else (titles, metadata, synopsis) stays white/grey | [view](https://mobbin.com/screens/31dfc858-a79d-4eb4-ba7f-94b60ca04663) |
| MUBI GO (CTA screen) | One filled gold button ("LET'S GO") per screen; second action is a plain text link. Accent = the decision point, never decoration | [view](https://mobbin.com/screens/b403976f-9f70-45f8-975b-8406daf8c0d8) |
| MUBI GO (film card) | Film card itself is 100% neutral — image, white title, grey metadata, gold only on the small outlined Trailer pill | [view](https://mobbin.com/screens/59df8b26-2858-4fd3-8e6b-7966cc90dffc) |
| Letterboxd | Multi-accent (green/orange/blue) but **never on chrome** — accents mark *user actions* (rate, like, list); nav and surfaces stay neutral | [view](https://mobbin.com/screens/f58dd9bd-5788-472e-bc4a-2723f03bae89) |
| HBO Max | Zero accent color in the browse UI — white CTAs on black. Premium read comes from restraint; the cost is anonymity. NUX sits between Max and MUBI GO | [view](https://mobbin.com/screens/d481a493-5cf7-4732-89dd-f05b46b6f736) |

MUBI's web product goes even further — almost no UI accent at all; "the film imagery is the color" (see MOODBOARD_NOTES, MUBI color section). Spin's identity work gives MUBI a flexible palette for *marketing*, but the product UI stays neutral ([Spin — MUBI](https://spin.co.uk/projects/mubi), [The Brand Identity on MUBI by Spin](https://the-brandidentity.com/project/mubi-by-spin)).

**What gets amber in NUX (the full list — nothing else):**
1. **Primary CTA fill** — one per viewport region max (`Play`, `Get Started`, paywall CTA).
2. **Selection state** — active tab indicator (2px underline/tick, not a filled pill), selected chip border + text, radio/checkbox checked.
3. **Progress** — watch-progress fill on cards and in the player scrubber.
4. **Eyebrow labels** — caps editorial kickers ("THEME OF THE WEEK", "EDITOR'S PICK") at 11–12px.
5. **Focus ring** (web/touch) — `2px #C8922A, 2px offset`. tvOS keeps the white-ring convention (see §7).
6. **One badge type only:** "Editor's Pick". Media-type badges (FILM/DOC/GAME/COURSE) stay neutral.

**What never gets amber:** nav chrome, default icons, card titles, metadata, borders/hairlines (except focus), secondary buttons (ghost: hairline border + white text), star ratings, toasts (success = white check on raised surface), scrollbars.

**Avoiding the "casino" failure modes** ([SeedFlip — accent colors for dark mode](https://seedflip.co/blog/accent-colors-dark-mode), [Figma gold color guide](https://www.figma.com/colors/gold/)):
- **Ink, not foil.** `#C8922A` is a pigment — never apply gradients, bevels, embossing, or metallic sheens to it. Flat fills and 1px strokes only. Criterion's gold reads as letterpress ink on paper for exactly this reason.
- **Area budget ≈ 5–10% of any screen.** Amber is a high-attention token: one filled element per region; everything else outlined or text-only (the MUBI GO split: 1 filled CTA, n outlined pills).
- **Never gold + red/green in the same view** (fruit-machine trio). NUX semantic colors stay desaturated: error `#B3554D`, success `#5F8B66` — both muted, both rare.
- **Warm black behind gold, not pure black.** On `#000` the amber "floats" and goes vegas; on `#0D0C0B` the shared warm undertone fuses them. This is why the page color is non-negotiable.
- **Contrast is already solved:** `#C8922A` on `#0D0C0B` = **7.07:1** — passes AA for *normal* text, so amber eyebrows and links are legal at any size. Hover/active brightens to `#E0A848` (9.18:1), never darkens (darker gold on dark = mud).
- Text **on** amber fills must be dark, never white: `#0D0C0B` on `#C8922A` = **7.07:1** ✓; white on amber = 2.41:1 ✗.

---

## 3. Typography for editorial streaming

What the references actually do:

| Ref | Notes | Link |
|-----|-------|------|
| The New Yorker | The editorial pattern NUX wants: caps **eyebrow** → serif display headline → serif body, hairline rules between modules. Works because the serif carries *editorial* surfaces only | [view](https://mobbin.com/screens/f4ee79d4-4921-4f81-adac-7b363e71bcd0) |
| Letterboxd (Year in Review) | Serif display ("Dune: Part Two") + grotesk UI labels + caps eyebrow ("HIGHEST RATED OVERALL") + serif pull-quote — the serif/grotesk split inside a *film product*, not a magazine | [view](https://mobbin.com/screens/f41976a6-dc7b-47f1-b2c6-5e28640d8f77) |
| MUBI GO | Single grotesk (Riforma), hierarchy purely via caps/size/color. Editorial energy comes from the *film stills*, not type contrast | [view](https://mobbin.com/screens/cf57f753-f497-400e-b12f-3c6e413858e3) |

- **MUBI:** one typeface — Riforma by Norm — chosen for "elegance, sophistication and sharpness"; serif energy comes only from per-film logotypes ([Fonts In Use — MUBI](https://fontsinuse.com/uses/51030/mubi-identity), [It's Nice That — Spin × MUBI](https://www.itsnicethat.com/articles/spin-tony-brook-efe-cakarel-graphic-design-180219)).
- **Criterion:** no single UI serif — the channel art-directs type *per collection* (e.g. Filmotype Flyer + Red Top for the John Waters collection) over a neutral UI ([Fonts In Use — Criterion Collection](https://fontsinuse.com/tags/417/criterion-collection)). The lesson: the UI font is a quiet frame; display moments get art direction.

**NUX decision — two families, one of them new:**

| Role | Face | Why |
|------|------|-----|
| Display (hero titles, collection/theme titles, essay headlines, pull quotes) | **Fraunces** (Google, variable: `opsz`, `wght`, `SOFT`, `WONK`) | Old-style display serif with an optical-size axis — at `opsz 144` it gets the sharp, inky, Criterion-poster contrast; set `SOFT 0, WONK 0` to keep it restrained, not whimsical. Pairs with Inter as "retro-modern editorial × functional digital" ([Google Fonts — Fraunces](https://fonts.google.com/specimen/Fraunces), [MaxiBestOf — Fraunces pairings](https://maxibestof.one/typefaces/fraunces)) |
| UI + body (everything else) | **Inter** (keep) | Already in the wireframes; best-in-class dark-screen legibility; tabular figures for metadata |

**Plus Jakarta Sans is retired from headings.** PJS + Inter are two grotesks doing one job — the pairing has no contrast, which is exactly why the wireframes feel "generic SaaS" rather than editorial. Migration is cheap: every `PJS Bold` heading style repoints to either Fraunces (editorial surfaces) or Inter SemiBold (functional surfaces: Settings, forms, player). Rule of thumb: **if the heading names *content or a theme*, it's Fraunces; if it names *a function*, it's Inter.**

Alternates if Fraunces feels too characterful after a screen test (all free/Google): **Newsreader** (quieter, designed for on-screen reading — also the recommended *essay body* face, pairs cleanly with Inter — [MaxiBestOf — Newsreader × Inter](https://maxibestof.one/typefaces/newsreader/pairing/inter)); **Source Serif 4** (safest, slightly corporate); **Libre Caslon Display** (closest to "film-poster classicism", limited weights); **Instrument Serif** (sharp and fashionable, single weight — display-only).

**NUX type scale (dark pass):**

| Style | Spec |
|-------|------|
| Display XL (hero title) | Fraunces `opsz 144, wght 560–600` — 80px desktop / 96px tvOS / 40px iPhone, line-height 1.02–1.08, tracking −0.015em |
| Display L (theme/collection title) | Fraunces `opsz 72` — 40px desktop / 28px iPhone, lh 1.1 |
| Section headline (editorial rows) | Fraunces 24px `opsz 36, wght 600` |
| Eyebrow | Inter 11px / 700 / **+0.14em** / ALL CAPS — amber `#C8922A` on editorial modules, `text/tertiary` elsewhere |
| Card title | Inter 15px / 600 / −0.01em, `text/primary` |
| Body | Inter 15–16px / 400 / lh 1.5 |
| Editorial essay body | **Newsreader** 17–18px / 400 / lh 1.65, max-width 68ch; opening paragraph 20px |
| Metadata | Inter 12.5px / 500 / +0.01em, `text/tertiary`, **tabular-nums**, fields separated by `·` (2016 · 1h 58m · Doc) |
| Pull quote | Fraunces Italic 22–28px, hairline rule or 2px amber bar at left |

Contrast of scale is the editorial signal: hero display ÷ metadata = **80/12.5 ≈ 6.4×** (wireframes are currently ~3×; magazines run 5–8×).

---

## 4. Hero / billboard art direction

| App | Notes | Link |
|-----|-------|------|
| HBO Max (Avatar) | Key art bleeds from the top, **title-treatment logo** centered, metadata line, 2-line synopsis, pagination dots — the scrim eases the art into the page color so the billboard has no bottom edge | [view](https://mobbin.com/screens/5c3fb788-336a-4c29-8225-a573b92049e6) |
| HBO Max (DTF St. Louis) | Quieter variant: photographic still, eyebrow ("HBO ORIGINAL"), logotype, schedule line, synopsis — scrim only at the bottom third, faces left unobstructed | [view](https://mobbin.com/screens/65940066-126c-44de-8579-ee5b5da6bbaf) |
| Apple TV (Apple Event) | Billboard art is **letterboxed onto pure black** — no scrim at all; title set in live text *below* the art. The zero-scrim alternative when art can't be cropped | [view](https://mobbin.com/screens/fd5f8813-9cea-4065-bed3-aba6c6f9b149) |
| Apple TV (editorial billboard) | Collection billboard with text inside the art over a *darkened region of the artwork itself* — title bottom-left, one-line dek in 65% white | [view](https://mobbin.com/screens/e57ccf6f-771e-49a5-a6ec-9d37c36167fc) |
| MUBI GO (weekly film) | Card-sized billboard: eased bottom scrim, date eyebrow, caps title, **director + country + runtime** as the only metadata — the NUX-est reference here | [view](https://mobbin.com/screens/94621caa-de49-4098-b761-8307768de5c5) |

**NUX scrim recipe** (always in **page color**, never neutral black — this is what makes the hero "dissolve" into the app):

```css
/* bottom scrim — eased, 5 stops to avoid the hard band of a 2-stop gradient */
background: linear-gradient(180deg,
  rgba(13,12,11,0)    38%,
  rgba(13,12,11,0.18) 52%,
  rgba(13,12,11,0.45) 66%,
  rgba(13,12,11,0.78) 82%,
  #0D0C0B            100%);

/* desktop ≥1024 adds a left scrim for left-anchored text */
background: linear-gradient(90deg,
  rgba(13,12,11,0.82) 0%,
  rgba(13,12,11,0.45) 32%,
  rgba(13,12,11,0)    60%);

/* top scrim under status bar / transparent nav */
background: linear-gradient(180deg, rgba(13,12,11,0.55) 0%, rgba(13,12,11,0) 18%);
```

- Add **1.5–2% noise** over scrims (see §7) — eased gradients on near-black bands visibly on TVs and mid-range panels.
- **Text protection is a measured rule, not a vibe:** synopsis/metadata must hit **4.5:1 against the lightest pixel behind them** ([Smashing — accessible text over images](https://www.smashingmagazine.com/2023/08/designing-accessible-text-over-images-part1/)); display titles (≥24px bold) need 3:1 minimum, aim 4.5. If art is too bright, deepen the scrim stop under the text block, never box the text.
- **Hero heights:** desktop 80vh (content row must peek), iPad 62vh, iPhone 70vh (4:5 crop of key art), tvOS full-bleed with text inside the title-safe zone.
- **Logo treatment vs plain title:** MUBI ships per-film SVG logotypes — art-directed but inaccessible (flagged in MOODBOARD_NOTES). NUX rule: featured titles get a **custom-set live-text Fraunces logotype** (manual size/tracking/line-break per title, optional small-caps); everything else renders the plain Display style. Only licensed key-art logos (e.g. a studio title treatment) may be images, with the title duplicated in alt/aria.
- **Autoplay:** key-art still first; trailer fades in after 3s dwell (400ms crossfade), muted, **hover/focus-triggered on desktop & tvOS only — never on iPhone** (bandwidth + distraction, consistent with MOODBOARD_NOTES); honors `prefers-reduced-motion` by never starting.

---

## 5. Poster / card treatment on dark

| App | Notes | Link |
|-----|-------|------|
| Letterboxd | Poster grid: every poster carries a **1px inner hairline** so dark posters don't melt into the page; uniform 2:3, ~4px radius, zero chrome on the art | [view](https://mobbin.com/screens/fac7cf14-5519-47c9-9d32-f324caff474d) |
| Apple TV | Channel/editorial tiles at ~10–12px radius with hairline; floating blur tab bar over the grid | [view](https://mobbin.com/screens/e57ccf6f-771e-49a5-a6ec-9d37c36167fc) |
| HBO Max (DC hub) | Posters butt-joined to the page with no border — works only because DC key art is high-key; dark arthouse stills (NUX's diet) need the hairline | [view](https://mobbin.com/screens/5e700dfb-bdfe-46df-9df1-a55f74224a5c) |
| Prime Video | Progress bar inside the Continue-Watching thumbnail: full-width track flush to the bottom edge of the art | [view](https://mobbin.com/screens/f9e83e55-6ae9-43e6-bf17-68deaad597c3) |

**NUX card spec (hi-fi deltas on top of the wireframe components):**
- **Radius:** 6px content cards/posters (locked in MOODBOARD_NOTES synthesis) · 12px editorial/essay cards · 16px modals & sheets · tvOS posters 12px (10-ft viewing).
- **Hairline on every artwork:** `box-shadow: inset 0 0 0 1px rgba(255,255,255,0.07)` — applied *over* the image so black posters and dark stills always have an edge. This replaces Apple-TV-style drop shadows from the old benchmark; on `#0D0C0B` a shadow is invisible anyway (§1).
- **Hover (web/iPad pointer):** `scale(1.02)`, 200ms ease-out; hairline brightens to `rgba(255,255,255,0.16)`; ambient depth `0 12px 40px rgba(0,0,0,0.55)`; title/metadata below the card unaffected. No zoom-crop inside the frame.
- **Focus-visible (web/touch):** `outline: 2px solid #C8922A; outline-offset: 2px` (7.07:1 against page ✓).
- **tvOS focus:** keep the wireframe convention — white 3–4px outer ring + shadow + scale ~1.05 (`border/focus-inverse`), matching system Liquid Glass focus; amber would fight the remote-driven focus model.
- **Progress on cards:** 3px bar flush to the artwork's bottom edge, inside the hairline. Track `rgba(255,255,255,0.18)`, fill `#C8922A`, no rounded caps (butt ends read more precise at 3px).
- **Badges on art:** top-left pill — Inter 10.5px/700/+0.1em caps, `padding 3px 8px`, bg `rgba(13,12,11,0.72)` + `backdrop-filter: blur(8px)`, 1px `rgba(255,255,255,0.12)` border, text `#F2EFE9`. Media-type badges (FILM/DOC/GAME/COURSE) always neutral; the **only** amber badge is EDITOR'S PICK (amber text + amber hairline on the same scrim pill — not a filled gold chip). Max 1 badge + 1 progress bar per card (3-field card discipline from MOODBOARD_NOTES holds).

---

## 6. Editorial surfaces — feeling curated, not algorithmic

| Ref | Notes | Link |
|-----|-------|------|
| The New Yorker (film page) | The "Editor's Pick card" pattern already chosen in MOBBIN_COMPONENTS §18: category chip + large still + serif headline + excerpt | [view](https://mobbin.com/screens/c64dc520-b7dc-4105-b7d2-9794868bee6d) |
| The New Yorker (fiction) | Editorial module anatomy: section label, hairline rule, headline, **byline** — the byline is what makes it human | [view](https://mobbin.com/screens/fd9509e4-ee47-4a66-90bd-c7e82fb1f84b) |
| HBO Max "Critical Favorites" | An editorial shelf *inside* a streaming home: named thesis + 4 canon films, not 40 | [view](https://mobbin.com/screens/fb25ea40-af9f-4353-8671-01f43a942374) |
| Telescope | Curator-labeled rows (curator name + count + timestamp) — the row itself has provenance | [view](https://mobbin.com/screens/6f2caaa4-a70d-4daa-9ed9-46dc9489be75) |
| Letterboxd (Year in Review) | Numbered editorial modules ("1.") + serif + quote + attribution — ranking as essay, not chart | [view](https://mobbin.com/screens/f41976a6-dc7b-47f1-b2c6-5e28640d8f77) |

MUBI's apparatus (Program Notes on every film, Notebook as a standalone publication, collections as context) is fully documented in MOODBOARD_NOTES — that's the content model. A24's app confirms the commercial version: member-gated *bonus content* and zine-style editorial built by [Type/Code](https://typecode.com/aaa24-membership/) as first-class app surfaces, not a blog bolted on.

**NUX editorial layout system:**
- **Collection header block** (above any editorial row): amber eyebrow → Fraunces headline → 2-sentence dek (Inter, `text/secondary`, max 60ch) → byline `Curated by <name> · June 2026` (`text/tertiary`). The dek answers "why this, why now" — the MUBI lesson.
- **Numbered shelves:** editorial collections get oversized Fraunces numerals (`01`–`07`) at 15% white as a backdrop element — finite, sequenced, "an issue of a magazine", the anti-infinite-scroll signal.
- **Mixed-module row:** 1 essay card (2× width, 12px radius, chip + still + serif headline + excerpt) + 3–4 posters from the same theme. Essay card links to the long-read; posters to films.
- **Essay/long-read page:** Newsreader body on `surface/page` (no card), 68ch column, Fraunces headline, drop cap optional, pull quotes per §3, film cards embedded inline at chapter breaks.
- **Spacing is the luxury:** 96–120px between editorial sections on desktop (64 iPhone), vs 32–40px between standard browse rows. Curation = fewer things, further apart.
- **Curated vs algorithmic tells** (enforce in design review): named humans + dates on rows · prose ≥ 2 sentences per featured module · finite counts ("Five films on grief", never "More like this ∞") · editorial row names from the theme taxonomy, never "Trending Now" (already a MOODBOARD rule) · at most 1 personalized row per screen, always labeled honestly ("Picked from your themes").

---

## 7. Grain / texture / materials

- **Grain: yes, 1.5–3% opacity, flat brand surfaces only.** Use on: page background behind editorial sections, hero scrims, onboarding/auth screens, empty states. Never on artwork (film stills already have photographic grain — doubling reads as compression). Primary benefit on near-black: **kills gradient banding** ([CSS-Tricks — grainy gradients](https://css-tricks.com/grainy-gradients/)). Implementation: inline SVG `feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2"` as an overlay, or a 128px tiled PNG at 2–3% opacity, `mix-blend-mode: overlay`.
- **Blur materials (the Apple layer):** nav/tab bars and sheets use `background: rgba(13,12,11,0.72); backdrop-filter: blur(20px) saturate(1.8); border-bottom: 1px solid rgba(255,255,255,0.08)` — the Framer spec from MOODBOARD_NOTES warmed to NUX's base. Posters scrolling *under* the warm glass nav is the single cheapest "premium" effect in the whole system.
- **tvOS 26 / Liquid Glass implications:** Liquid Glass is **system-rendered** (real-time refraction of what's behind it) on Apple TV 4K gen 2/3 — it cannot and should not be faked in-app ([Apple Newsroom — Apple TV redesign](https://www.apple.com/newsroom/2025/06/apple-tv-brings-a-beautiful-redesign-and-enhanced-home-entertainment-experience/), [MacRumors — tvOS 26](https://www.macrumors.com/2025/09/15/apple-releases-tvos-26/), [AppleInsider hands-on](https://appleinsider.com/articles/25/06/18/tvos-26-hands-on-sleek-liquid-glass-redesign-new-control-center-and-more)). Consequences for NUX tvOS: (1) use **system components** for player transport, Control Center interactions and focus — the glass comes free and floats over content; (2) keep custom chrome minimal and content full-bleed so the system material has imagery to refract; (3) Apple's tvOS 26 direction is **"cinematic poster art"** — taller, art-forward tiles — which NUX's poster-first grid already matches; (4) NUX's flat warm surfaces + hairlines are deliberately *not* glass — let the OS provide glass, the brand provides ink. On web/iOS, the only "glass" is the blur-material nav above.
- **No gradients as decoration.** Gradients exist in NUX only as scrims over imagery (§4) and the ≤12% amber bloom (§1). Brand-colored mesh gradients (Stripe-style) would fight the film art — the imagery is the color system.

---

## 8. NUX token mapping — wireframe grey → hi-fi value

Wireframe greys are the light-greyscale HIG ramp currently in Figma (primary `#1C1C1E`, secondary `#6E6E73`, tertiary `#9A9AA0`, hairline `#E0E0E2`, elevated `#F5F5F7`, poster placeholder `#D8D8DC`). Hi-fi flips polarity onto the warm dark ladder. Contrast ratios computed (WCAG 2.x relative luminance), all against the surface named in the rationale.

| Token | Wireframe | Hi-fi | Contrast | Rationale |
|-------|-----------|-------|----------|-----------|
| `surface/page` | `#FFFFFF` | **`#0D0C0B`** | — | Locked brand base; warm so stills glow (MUBI lesson), never `#000` outside the player |
| `surface/raised` | `#F5F5F7` | **`#161412`** | — | +1 elevation step (~4% lighter), cards/nav/rows; hairline replaces shadow |
| `surface/overlay` | `#FFFFFF` + shadow | **`#1F1C19`** | — | Modals/menus/sheets; +2 steps; pairs with `0 16px 48px rgba(0,0,0,0.5)` ambient |
| `surface/sunken` | `#F0F0F2` | **`#070606`** | — | Input wells, progress tracks, player chrome |
| `surface/muted` | `#D8D8DC` (poster placeholder) | **`#25211C`** | — | Skeletons, placeholders, pressed/hover fills; warmest visible step |
| `text/primary` | `#1C1C1E` | **`#F2EFE9`** | **17.0:1** on page | Warm off-white (paper, not LED); AAA everywhere on the ladder (≥13.9:1 even on muted) |
| `text/secondary` | `#6E6E73` | **`#B0A99E`** | **8.4:1** on page | Deks, descriptions, bylines; AAA on page, 7.3:1 on overlay — safe at all sizes |
| `text/tertiary` | `#9A9AA0` → grey/600 | **`#8A8275`** | **5.2:1** on page | Metadata, captions, timestamps; AA on page (5.2) & raised (4.8); **on overlay/muted use `text/secondary`** (drops to 4.5/4.2) |
| `text/inverse` | `#FFFFFF` | **`#0D0C0B`** | 7.1:1 on amber | Label color on amber fills — dark-on-gold, never white-on-gold (2.4:1 ✗) |
| `border/subtle` | `#E0E0E2` | **`rgba(255,255,255,0.08)`** | non-text | Hairlines on raised surfaces, row dividers, artwork inset edge (0.07) |
| `border/default` | grey/600 `#6E6E73` | **`rgba(255,255,255,0.14)`** | non-text | Visible control outlines: ghost buttons, inputs, chips (wireframe a11y fix carried over) |
| `border/focus` | `#1C1C1E` ring | **`#C8922A`** | **7.1:1** on page | Web/touch focus-visible ring, 2px + 2px offset — exceeds the 3:1 non-text minimum |
| `border/focus-inverse` | grey/0 white | **`#FFFFFF`** | 19.5:1 | tvOS focus ring stays white (system/Liquid Glass convention), 3–4px outer |
| `action/primary` | `#1C1C1E` filled | **`#C8922A`** | 7.1:1 vs page | The one filled amber element per region; flat ink, no gradient |
| `action/primary-hover` | — | **`#E0A848`** | 9.2:1 vs page | Brighten on hover/press — gold lightens, never darkens, on dark |
| `action/primary-text` | `#FFFFFF` | **`#0D0C0B`** | **7.1:1** on `#C8922A` | AA at any text size; keeps the CTA "ink on gold paper" |
| `action/secondary` | outlined grey | transparent + `border/default`, text `#F2EFE9` | 17.0:1 | Ghost button — neutral by design so primary stays the only amber |
| `accent/progress` | `#1C1C1E` bar | **`#C8922A`** on track `rgba(255,255,255,0.18)` | 4.2:1 fill-vs-track | Watch progress = brand moment; 3px bars (non-text, >3:1 vs both track and art scrim) |
| `icon/primary` | `#1C1C1E` | **`#F2EFE9`** | 17.0:1 | Default icon ink matches text/primary |
| `icon/secondary` | `#6E6E73` | **`#B0A99E`** | 8.4:1 | Inactive tabs, metadata glyphs |
| `icon/accent` | — | **`#C8922A`** | 7.1:1 | Only inside selected/active states (§2 list) |
| `icon/inverse` | `#FFFFFF` (2:36) | **`#0D0C0B`** | 7.1:1 on amber | Glyphs on amber fills (play icon in CTA); white-on-dark player icons keep using `icon/primary` |

Semantic deltas already specced in the Interaction-States board stay valid on the dark ladder: Hover = surface +1 step or hairline brighten; Pressed = scale 0.96 + opacity 0.92; Disabled = 40% opacity; Focus = `border/focus` (web) / `border/focus-inverse` (tvOS).

---

## Top 10 rules for the NUX hi-fi pass

1. **One warm ladder, no shadows:** `#070606 → #0D0C0B → #161412 → #1F1C19 → #25211C`; elevation = lighter surface + 1px hairline (`white @ 8% / 14%`); shadows only under overlays; pure `#000` only in the player.
2. **Amber is ink, rationed:** flat `#C8922A` on ≤10% of any screen — 1 filled CTA per region, selection, progress, eyebrows, focus ring, EDITOR'S PICK. Hover brightens to `#E0A848`. No gradients, no metallics, never beside red/green.
3. **Text on amber is dark:** `#0D0C0B` labels (7.1:1) — white-on-amber (2.4:1) is banned.
4. **Two families:** Fraunces (display: content & theme names, `opsz` high, SOFT/WONK 0) + Inter (everything functional). Newsreader for long-read bodies. Plus Jakarta Sans retires.
5. **Editorial anatomy everywhere a collection appears:** amber caps eyebrow → Fraunces headline → 2-sentence dek → curator byline + date. Display-to-metadata size ratio ≥ 5×.
6. **Scrims in page color, eased, 5 stops** (`rgba(13,12,11,…)` 0→1), +2% grain to stop banding; synopsis text measured to 4.5:1 against the lightest pixel beneath it.
7. **Every artwork gets the inset hairline** `inset 0 0 0 1px rgba(255,255,255,0.07)`; radii 6 / 12 / 16 (poster / editorial / modal), 12 on tvOS.
8. **Focus split by platform:** web/touch = 2px amber ring +2px offset; tvOS = white 3–4px outer ring + scale (Liquid Glass-native). Don't fake Liquid Glass anywhere — system provides glass, NUX provides ink.
9. **Curated tells are mandatory:** named curators, finite counts, numbered shelves, 96–120px between editorial sections, theme-taxonomy row names — never "Trending Now".
10. **Contrast is shipped, not hoped:** text/primary 17.0:1 · secondary 8.4:1 · tertiary 5.2:1 (page; not allowed on overlay/muted) · amber-on-page 7.1:1 — keep these pairs bound in Figma variables so hi-fi inherits the wireframes' token discipline.
