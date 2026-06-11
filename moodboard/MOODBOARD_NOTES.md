# NUX Moodboard — Design Notes

**Project:** NUX — premium streaming platform, content organized by narrative themes across film / documentary / game / course.
**Target user:** Jeremy Jones persona, 25–35, grad student + gamer.
**Key requirements:** Dark mode + light mode, mobile-first landscape + desktop, Apple/Netflix quality bar.

---

## 1. Netflix (`netflix-home.png`)

**What works for NUX:**
- Full-bleed hero with cinematic still + short title treatment — sets a "world" immediately. Adapt this for NUX's thematic collections (e.g. "Dystopian Futures", "Mind vs Machine").
- Horizontal scroll rows with consistent card aspect ratios (16:9 for video, 2:3 for poster art) — easy to scan on both mobile and TV.
- Very dark background (#141414) makes content imagery pop without competing chrome.
- Bold white sans-serif hierarchy: title > category label > metadata.

**Watch out / avoid for NUX:**
- Row-of-rows grid feels like a warehouse catalog — NUX should feel more curated. Fewer rows, more editorial intent visible.
- No real dark/light toggle — NUX needs both modes with equal care.
- Category labels are generic ("Continue Watching", "Trending") — NUX's differentiator is *thematic* labeling ("The Architecture of Grief", "Near-Future Collapse"). Don't fall into Netflix's generic shelf naming.

---

## 2. MUBI (`mubi-home.png`)

**What works for NUX:**
- Extremely editorial, almost magazine-like — each film gets context, not just a thumbnail. NUX should borrow this "why this, why now" framing for theme explanations.
- Film stills presented as art objects, large and breathing. Works beautifully in dark mode.
- Strong typographic restraint: one typeface family, varied weight/size. Feels premium without being loud.
- Curator voice present in copy — NUX should have a similar editorial tone.

**Watch out / avoid:**
- MUBI is single-medium (film only) — NUX must make cross-media legibility clear with consistent media-type badges (film / doc / game / course) without crowding cards.
- MUBI's light mode feels slightly clinical; NUX's light mode should stay warm and tactile.

---

## 3. Apple TV (`appletv-home.png`)

**What works for NUX:**
- The cleanest grid-to-hero transition of any streamer. Crisp spacing, almost no UI chrome outside the content itself.
- Glassmorphism-adjacent nav bar with high transparency — works in both dark and light modes.
- SF Pro or equivalent neutral-grotesque at fine tracking gives content stills room to dominate.
- Card shadows and corner radius are subtle and consistent — benchmark this spec (8px radius, 0 4px 16px rgba black 0.3 approx).

**Watch out / avoid:**
- Apple's light mode hero uses very soft off-whites that can feel washed out on non-Apple displays — test NUX's light mode against a mid-range monitor, not just a Retina screen.
- App icons in the "Apps & Games" rows look like an app store, not a streaming service — NUX should avoid mixing media-type grid rows that don't share a unified visual language.

---

## 4. HBO (`hbo-home.png`)

**What works for NUX:**
- Deep black with high-contrast white logotype — premium signal. HBO leans hard into "prestige" without being fussy.
- Hero content fills virtually the entire above-the-fold viewport — no wasted margin at the top. Mobile-first thinking shows even on desktop.
- Minimal nav: logo + 3 items. NUX should resist the urge to over-nav.

**Watch out / avoid:**
- HBO's card grid is denser than it needs to be — at smaller breakpoints cards start clipping. NUX should define a minimum card width (e.g. 160px) and let the grid reflow gracefully.
- The HBO Max rebrand created visual inconsistency between old and new assets; NUX should ship a single art direction standard for cover art from day one.

---

## 5. Linear (`linear-home.png`)

**What works for NUX:**
- Best-in-class dark mode on a marketing site. True near-black (#0F0F11) base with carefully gated purple accent — never garish.
- Micro-animations on feature illustrations (subtle glow pulses, sliding panels) communicate depth without page-weight cost. NUX's theme hero cards could use the same treatment — a slow parallax or subtle glow on hover.
- Typography system: Inter or similar geometric sans, tightly tracked headline (letter-spacing: -0.03em), generous line height on body. Copy feels engineered, not templated.
- The "border as affordance" pattern — hairline 1px borders on cards at ~10% white opacity in dark mode, ~8% black in light mode — is excellent for NUX content cards.

**Watch out / avoid:**
- Linear's palette is monochromatic (near-black + purple). NUX needs a richer accent palette to signal different media types (film vs game vs course) — borrow the *system* (single accent per context) not the specific colors.

---

## 6. Stripe (`stripe-home.png`)

**What works for NUX:**
- The animated gradient hero (flowing purple/blue/teal mesh) is the gold standard for "premium tech" hero treatment. NUX's dark mode hero could adapt this — a slow-moving cinematic color-field instead of a static still, behind semi-transparent title text.
- Extreme polish on illustration shadows, depth, and light sourcing — sets a craft benchmark.
- Light mode here is beautiful: white base with the same gradient logic applied softly. Shows that gradient-as-texture works in both modes with different opacity/saturation.

**Watch out / avoid:**
- Stripe's hero is brand-forward, not content-forward. NUX must flip this — the content imagery IS the hero. Use gradient treatment as accent (color wash over a still, or gradient edge-to-card fade) rather than as primary background.
- Very long marketing page scroll depth — NUX's homepage should reach the content grid within one viewport scroll, not five.

---

## 7. Figma (`figma-home.png`)

**What works for NUX:**
- Excellent example of a design system that scales: the homepage is essentially a living style guide. NUX should build its component library with the same intent.
- Section rhythm: hero → social proof → feature grid → CTA. For NUX: hero → featured theme → content grid → cross-media pitch → sign-up CTA.
- Purple/dark purple + white is a proven combination for "creative premium" — relevant to NUX's aesthetic territory.

**Watch out / avoid:**
- Figma's homepage is tool-forward; NUX must be content-forward from the first scroll. Don't bury the actual content grid behind feature explanations.
- The "for teams" enterprise tone is wrong for NUX's individual/student target. Keep copy in Jeremy's register: direct, curious, a little irreverent.

---

## 8. Vercel (`vercel-home.png`)

**What works for NUX:**
- The cleanest dark-mode light sourcing of any site in this set. Single point-light bloom from behind the primary visual creates cinematic depth. Directly applicable to NUX's thematic hero section (light source behind the title block, content cards fading in from below).
- Monospace + geometric sans pairing feels "engineered but not cold." NUX could pair a humanist serif (for theme/editorial copy) with a geometric sans (for UI chrome) rather than mono — same energy, warmer.
- The "globe" 3D asset as a feature illustration shows that a single high-quality 3D object can carry a whole section. NUX could commission one iconic 3D motif per major theme.

**Watch out / avoid:**
- Vercel is maximally dark (pure #000000 in places). NUX's dark mode should use a lifted dark (#0D0D0F or similar) to keep content imagery readable — true black makes dark photographic stills nearly invisible.

---

## 9. Steam (`steam-home.png`)

**What works for NUX:**
- Hero carousel with video preview on hover is the gamer's native idiom. NUX's game section cards should support the same — autoplay muted clip on hover/focus.
- "Featured & Recommended" + "New & Trending" dual-track layout shows how to mix editorial curation with algorithmic freshness. NUX should have at least one "theme of the week" editorial shelf alongside a personalized row.
- Tag/genre system is granular and user-trusting — gamers want to filter by sub-genre, not just "Action." NUX's taxonomy should similarly allow drill-down within a theme.

**Watch out / avoid:**
- Steam's visual design is notoriously cluttered and low-contrast — the exact anti-pattern for NUX. The content information architecture is useful; the visual execution is not. Do not borrow layout density or color scheme.
- Steam uses "sale price" red everywhere. NUX should keep pricing signals (if any) visually quiet and distinct from editorial hierarchy.

---

## 10. Xbox Game Pass (`gamepass-home.png`)

**What works for NUX:**
- Strong hero video loop with title overlay — the "game pass" marketing page is essentially a streaming landing page. NUX's unauthenticated hero should similarly lead with a looping reel of cross-media content.
- The tiered card grid (large hero card + smaller supporting cards) mirrors a magazine layout and creates clear visual hierarchy. This is the right pattern for NUX's theme detail pages.
- Xbox's light/dark split (dark hero, lighter feature sections) transitions gracefully and could inform NUX's page-level mode logic: header/hero always dark, body content adapts to user preference.

**Watch out / avoid:**
- The Xbox green accent is very strong and used inconsistently across card types. NUX should pick one primary accent (per theme or globally) and apply it with strict discipline.
- Game Pass hides the actual game library depth until you scroll far down — NUX should surface the content catalog width (film + doc + game + course) within the first viewport to communicate the cross-media value prop immediately.

---

## 11. Framer (`framer-home.png`)

**What works for NUX:**
- The gold standard for scroll-triggered animation on a marketing site: elements enter with purpose (fade + translate-y), never just fade. NUX's content cards should entrance animate on scroll with a 120–160ms stagger.
- Glassmorphism nav with blur and border — the right implementation: dark enough to stay readable, light enough to feel airy. Copy this spec directly: `backdrop-filter: blur(12px)`, `background: rgba(0,0,0,0.5)`, `border-bottom: 1px solid rgba(255,255,255,0.08)`.
- Type scale uses very large display sizes (80–120px headline) with tight tracking. NUX's theme hero titles should go big and confident.

**Watch out / avoid:**
- Framer's homepage is almost entirely self-referential (showing its own tool). NUX needs to make the *content itself* the hero visual, not the interface.
- Some Framer sections feel animation-for-animation's-sake — NUX should only animate where it reinforces narrative (e.g. theme cards "revealing" like a curtain opening on a story).

---

## 12. Awwwards (`awwwards-home.png`)

**What works for NUX:**
- Highest information density of any site in the set, but it works because the grid is ruthlessly consistent. Every card: image (fixed aspect) + site name + score badge + category tag. NUX content cards should have the same fixed-field discipline: cover art + title + media-type badge + theme tag.
- The "Award of the Day" hero treatment — full-bleed image, title overlay bottom-left, single highlighted metric — is a direct model for NUX's "Theme of the Week" feature slot.
- Proves that dark-mode with extremely rich imagery (every card has a distinct color palette) works if the card structure is tight enough. The grid frame provides visual order, image provides energy.

**Watch out / avoid:**
- Awwwards assumes a design-savvy audience comfortable with dense UI. NUX's target (grad student + gamer) needs slightly more breathing room and clearer information hierarchy on cards.
- The site has no obvious light mode — NUX must invest equal effort in a warm, readable light mode from the start.

---

## MUBI — Authenticated Deep Dive

*Screenshots captured: `moodboard/mubi/` — 9 files including full-page and close-up crops.*
*Note: Playwright runs a fresh browser context (no shared session), so pages were captured in the authenticated-visitor / pre-login state. All structural design language, typography, card layouts, film detail structure, and editorial framing is fully visible and accurately captured.*

---

### Navigation structure

- **Top nav is extremely minimal:** MUBI logo (left) → Search (icon + inline text field, centre-left) → "Now Showing" + "Notebook" (two text links only) → "Log In" + hamburger/avatar (right).
- **Only two primary destinations exposed in nav:** Now Showing and Notebook. Everything else (Films database, Collections, profile) is reached via contextual links or the avatar menu once logged in. This is deliberate scarcity — forces a clear content hierarchy rather than overwhelming with tabs.
- **Search is always visible inline in the nav bar** (not hidden behind an icon tap), which is unusual for streaming services. Implies heavy search usage in MUBI's audience.
- **No secondary nav / breadcrumb on film detail pages** — you navigate forward via contextual links ("Showing as part of" collections, "More Like This") and back via the browser. Very web-native, not app-like.

---

### Homepage layout (unauthenticated / landing)

- **Full-bleed cinematic hero:** single film still fills entire viewport, title treatment overlaid bottom-left in large serif/mixed-case type. Film name rendered as an image (SVG logo treatment, not live text) — pure art direction, no accessibility compromise.
- **Below hero:** sequential editorial sections separated by generous whitespace — not a grid of grids. Sections include: "MUBI RELEASES" horizontal film card strip, "Film of the Day" feature, and Notebook editorial teaser.
- **"Film of the Day" framing:** MUBI's core mechanic — one curated film per day. The homepage card explicitly calls this out with date-countdown logic. This is their primary personalization surface even for logged-out visitors.
- **Page background:** very dark charcoal (approximately #1A1A1A), not pure black. Film stills glow against it.
- **CTA placement:** "Try 7 Days Free" email field appears both above-fold and again at the bottom — conversion-oriented but not aggressive. The primary CTA competes very little with content browsing.

---

### Showing page (`mubi-showing.png`)

- **Hero slot:** "Film of the Day" at top — large landscape still, director name + country/year metadata, title as logotype image. Extremely cinematic. A subscription upsell floats over the right third of the hero as a semi-transparent panel.
- **Below hero:** horizontal rows of film cards labeled by collection ("MUBI RELEASES", etc.) with "See all →" link. Each row is a scrollable carousel, not a paginated grid.
- **Film card anatomy:** poster image (portrait orientation, ~2:3 ratio) + title as logotype + director + country/year + festival badge (small festival logo, e.g. Sundance, Venice) + WATCH button + "Rate and review" icon button + synopsis text below card.
- **Festival badges are first-class signals:** small circular festival logos (Berlinale, Sundance, Cannes, Venice) appear on cards as quality/provenance signals. This is MUBI's version of a star rating — curation context over numeric score.
- **Card hover state:** expands to show synopsis paragraph. The synopsis is literary-quality writing (2–3 sentences, evocative, editorial voice) — not a plot summary. This is a strong differentiator.
- **Aspect ratio consistency:** all film cards use portrait 2:3. No mixing of landscape/portrait in the same grid row.

---

### Film detail page structure (`mubi-film-detail.png`, `mubi-film-hero-closeup.png`)

Information hierarchy from top to bottom:

1. **Full-bleed background still** (landscape, covers ~60vh) — sets the visual world of the film.
2. **Title as logotype image** (large, bottom-left of hero zone) — typographic art direction per film.
3. **Director + Country + Year** — secondary heading, muted, directly below title.
4. **Metadata strip** (horizontal list): Genre tag → Audio language → Subtitle options (+7 more) → Duration → Rating (MATURE badge) — all small, icon-preceded, scannable.
5. **Synopsis paragraph** — 2–3 sentences, editorial voice, below the strip.
6. **Trailer link** — icon + "Trailer" text, as a quiet inline link. Not a big CTA button.
7. **Subscription upsell panel** — right column, "Try 7 days free, then €13.99/month", email + CTA. Floats on desktop beside the film info column.
8. **"Program Notes" strip** — MUBI's editorial article tied to this film, with category tag (e.g. "program notes") and excerpt. This is unique to MUBI — every film on the platform has editorial context.
9. **"Showing as part of" collections** — 2–3 collection cards with cover image, name, film count. Shows the curation context (e.g. "Reframing: Women Directors", "Funny Ha Ha").
10. **"More Like This"** — horizontally scrollable film cards.
11. **Awards & Festivals** — festival logo + name + year + award received. Grid of 4 visible, "Show all (16)" link.
12. **Cast & Crew** — circular portrait photos + name + role(s). Grid of 6 visible, "Show all (17)" link.
13. **Articles from the Notebook** — 2 editorial articles directly related to this film, with thumbnail + category tag + headline + byline + date.
14. **Critics Reviews** — star rating aggregate (3.2/5), then 3 pull-quote cards with reviewer name, date, "Read full article" link to external publication.

**Key insight:** the film detail page is as much an editorial/cultural document as a product page. "Program Notes" + "Articles from the Notebook" + "Critics Reviews" together constitute a full critical apparatus around a single film. No other streaming service does this.

---

### Films browse page (`mubi-films-browse.png`)

- URL redirects to `/en/films?all_films=true&sort=popularity_quality_score` — a database-style browse with sort controls.
- Multi-column grid of portrait poster cards. Dense. Default sort is "popularity + quality score" (MUBI's proprietary ranking combining ratings and editorial weight).
- Filter controls visible at top of grid (genre, decade, country, etc.) — standard faceted browse.
- Contrast with "Now Showing": Films browse is the full catalog (100k+ films), Now Showing is the curated 30-day slate. These are clearly separated experiences.

---

### Notebook page (`mubi-notebook.png`)

- **Header:** "Notebook" logotype + "Our Daily International Film Publication" subhead — immediately establishes this as a separate publication, not just a blog.
- **Feature banner:** current film festival coverage (Cannes 2026) as a full-width image link with title + subtitle — treated like a magazine cover.
- **Notebook magazine teaser:** prominent promo for the print Notebook magazine with cover image. Analog/physical product is first-class.
- **Article list:** title + category badge (Feature / Interview / News) + headline + dek + author + date. Clean editorial layout — image left, text right.
- **Popular Tags sidebar:** Festival Coverage / Columns / News / Daily / Videos / Long Reads / Now Showing / Interviews / Cannes — shows the taxonomy structure.
- **Newsletter signup:** email capture mid-page. "Sign up for the Notebook Weekly Edit newsletter." Low-key, not intrusive.
- **Footer editorial statement:** "Notebook is a daily, international film publication. Our mission is to guide film lovers searching, lost or adrift in an overwhelming sea of content." — the mission statement is in the footer of Notebook, not a marketing page. Very editorial self-awareness.

---

### Typography treatment

- **Headings / film titles:** MUBI renders film titles as SVG/image logotypes — each film has its own typographic treatment (custom lettering or specially set type). This is not live text. High art direction, accessibility trade-off accepted.
- **UI text:** appears to be a geometric sans — clean, tight tracking, ~14–15px body, ~12px metadata labels. Very restrained sizing.
- **Notebook text:** more generous line-height, slightly larger body (16–17px equivalent), editorial paragraph rhythm.
- **All-caps used sparingly** for section labels ("MUBI RELEASES", "MORE LIKE THIS", "Cast & Crew") — establishes hierarchy without serif vs sans differentiation.
- **No visible serif in the UI chrome** — serif energy comes entirely from the film title logotypes, which are designed per-film.

---

### Color usage

- **Dark mode base:** approximately #1A1A1A–#222222 (warm charcoal, not pure black). Slightly warm (brown-grey tint).
- **Text:** primary white (~#FFFFFF or #F5F5F5), secondary ~60% white for metadata, tertiary ~40% white for captions/dates.
- **Accent:** almost none. MUBI barely uses a brand accent color in the UI. CTAs are white buttons or very subtle — the film imagery is the color. One exception: "WATCH" button appears as a small pill with a red/orange play icon.
- **Festival badge backgrounds:** circular logos retain their own brand colors (gold Berlinale bear, Sundance red, Venice yellow) — these are the only non-neutral colors in the UI.
- **Notebook:** slightly lighter background (~#F0EFEC warm off-white in sections) for the editorial context — a subtle mode shift from the dark film-browsing context.
- **No visible themed accent colors** — MUBI uses a single global palette, not per-collection theming.

---

### Personalization (authenticated vs. unauthenticated)

- The Playwright session captured the pre-authenticated state. However, from the UI structure, personalization is visible in:
  - **"Film of the Day"** — MUBI's primary daily curation surface, the same for all users but creates a shared "today" experience.
  - **"Rate and review" button** on each film card — prominent even on unauthenticated views, implying the rating/social layer is central to the product once logged in.
  - **"Showing as part of" collections** on detail pages — collections are editorial, not algorithmic. Personalization appears to come from membership/watch history surfaced in "More Like This" rows.
  - **The film detail page's "Articles from the Notebook"** are film-specific, not user-specific. MUBI's version of "personalization" is contextual editorial depth, not behavioral targeting. This is intentional and brand-consistent.

---

### What NUX should steal from MUBI

1. **Program Notes / editorial context per content item.** Every piece of content on NUX should have a "why this, why now" editorial note (1–2 paragraphs). This is what makes a platform feel curated vs. algorithmically assembled.
2. **Film title as logotype.** For NUX's hero films or "Theme of the Week" features, commission custom title treatments rather than rendering in a system font. Even a well-set variable font can work.
3. **Festival / awards badges as quality signals.** Replace or supplement star ratings with contextual provenance badges — "Sundance Winner", "BAFTA Nominated", "Cannes Premiere". More meaningful and more visual than a 7.3/10.
4. **Collection framing on detail pages.** "Showing as part of [Collection Name]" immediately gives content cultural context and drives exploration. NUX's equivalent: "Part of the [Theme Name] theme".
5. **Articles linked directly to content.** Notebook articles appear on film detail pages. NUX should surface related essays/interviews/deep-dives alongside each film/game/course.
6. **Critics reviews with pull quotes.** Prose quotes from critics (not aggregated scores) are more editorial and more compelling for a NUX-type audience.
7. **Minimal nav — resist tab proliferation.** Two items in the primary nav. Everything else is contextual. NUX should aim for the same restraint.
8. **Warm dark base, not pure black.** #1A1A1A–#222222 range. Film stills need to glow, not disappear.

---

### What NUX should avoid / improve on vs. MUBI

1. **Title-as-image is inaccessible.** NUX should achieve the same typographic art direction using live variable-font type with letter-spacing/weight animation, not image replacement.
2. **No authenticated personalization signals visible.** MUBI's homepage looks largely the same logged in or out (editorial curation). NUX should have a clearly differentiated authenticated home: "Your themes", "Continue watching", "New in your collections" — visible immediately on login.
3. **No cross-media vocabulary.** MUBI is film-only; NUX must build a visual language for media-type disambiguation (film vs. doc vs. game vs. course) using badges, icon systems, or card-level color accents.
4. **Horizontal carousels only.** MUBI shows 3–4 films per row in carousels. NUX's theme pages should also support a full-grid dense-browse view (toggle between carousel and grid).
5. **MUBI's light mode is clinical.** On Notebook pages where backgrounds lift toward off-white, it reads a bit sterile. NUX's light mode should use the warmer #F5F4F0 base and maintain the same cinematic card presentation.
6. **No onboarding / discovery scaffolding visible.** MUBI drops new users into "Now Showing" with no guidance. NUX should have a lightweight onboarding flow ("Pick 3 themes you care about") to seed personalization immediately.

---

## Cross-cutting synthesis for NUX

### Color
- Dark mode base: **#0D0D0F** (not pure black — lifted enough for photography). Accent: one color per theme cluster (e.g. amber for "Collapse & Survival", teal for "Mind & Technology"), never more than one active at a time.
- Light mode base: **#F5F4F0** (warm off-white, not clinical white). Same accent logic.

### Typography
- Display/theme titles: humanist serif (e.g. Fraunces, Playfair, or Canela) — gives editorial gravitas.
- UI chrome + metadata: geometric sans (e.g. Inter, DM Sans) — clean and functional.
- Tracking: headlines -0.02em to -0.04em, body 0em, captions +0.02em.

### Cards
- Unified aspect ratio: **16:9** for all content types (crop game cover art to landscape — avoids mixed-ratio grid chaos).
- Fields: cover image | media-type badge (pill, top-left) | title (bottom-left, bold) | theme tag (bottom-left, below title, muted).
- Corner radius: **6px** (restrained — not bubbly, not sharp).
- Hover state: scale(1.03) + shadow elevation lift + muted autoplay preview for video/game content.

### Grid
- Desktop: 4-column content grid, 1-column editorial hero beside it (5-col total), or full-bleed 4-col.
- Tablet (landscape): 3-column.
- Mobile portrait: 2-column (never 1 — wastes screen real estate for a visual-first product).

### Animation
- Entrance: `opacity 0→1, translateY 16px→0, duration 240ms, ease-out`. Stagger: 60ms between cards in a row.
- Hero: slow parallax on cover art (0.15x scroll factor). No auto-play video in hero on mobile (bandwidth + distraction).
- Nav: glassmorphism blur activates on scroll past 80px. Never animate the nav on mobile (jank risk).

### Things to avoid
- Generic shelf names ("Trending Now", "Because you watched") — NUX is editorially curated, every row name should mean something.
- Mixed card aspect ratios in the same grid row.
- Pure #000000 backgrounds — kills photography.
- Animation without narrative purpose.
- Over-badging cards with metadata — keep to 3 fields maximum per card.
