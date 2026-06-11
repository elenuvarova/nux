# NUX — Design Direction

**Version:** 1.0  
**Date:** 2026-06-09  
**Platform:** Web (desktop · iPad · iPhone · mobile landscape)  
**Modes:** Dark + Light  
**Persona:** Jeremy Jones, 25-35, grad student — works hard, plays hard. Watches a film like he reads a paper: with intention.

---

## Reference Analysis

From the moodboard:
- **MUBI:** Clean white editorial base, oversized Helvetica-weight type, restrained accent colours, high-density whitespace, film-poster imagery given full room to breathe. Feels like a very good magazine.
- **Netflix:** Deep near-black (#141414) content grid, red brand mark, bold category rows, content-first layout where the imagery *is* the UI. Immersive, not typographic.

NUX sits between them — more editorial and intentional than Netflix, more content-rich and interactive than MUBI. The best analogy is what it would look like if Criterion designed a streaming product and Apple wrote the interaction layer.

---

## 1. Brand Color Palette

### Existing Wireframe Neutrals (keep as-is)

| Name | Hex | Usage |
|------|-----|-------|
| Ink | `#1A1A1A` | Dark mode backgrounds, primary text |
| Ash | `#ABABAB` | Secondary text, disabled states |
| Silver | `#CCCCCC` | Borders, dividers |
| Mist | `#F2F2F2` | Light mode surfaces |
| White | `#FFFFFF` | Light mode backgrounds |

---

### Direction A — Criterion Ink

> **Rationale:** Deep near-black with a single amber-gold accent. Feels like a premium theatre programme or a Criterion disc spine. The gold reads as prestige without luxury-brand cliché. For Jeremy: serious enough for a thesis, warm enough for 2am watching. This is the most distinctive direction — no major streaming platform uses amber as its hero color.

#### Dark Mode

| Role | Hex | Notes |
|------|-----|-------|
| Background | `#0D0C0B` | Warm near-black. Not pure #000 — avoids OLED smear, feels analogue |
| Surface / Cards | `#161412` | 1-step lift |
| Surface Elevated | `#1E1B17` | Modals, overlays |
| Surface Subtle | `#231F1A` | Hover states, selected rows |
| Border | `#2E2A24` | Hairline dividers |
| Text Primary | `#F0EDE8` | Warm white — softer than #FFFFFF on dark |
| Text Secondary | `#9A9087` | Muted labels, metadata |
| Text Tertiary | `#5A5249` | Disabled, placeholder |
| Brand Accent | `#C8922A` | Amber gold — hero color, CTAs, active states |
| Brand Accent Hover | `#D9A33A` | On hover |
| Brand Glow | `rgba(200,146,42,0.18)` | Ambient glow behind accent buttons |

#### Light Mode

| Role | Hex | Notes |
|------|-----|-------|
| Background | `#FAFAF8` | Warm off-white, not clinical |
| Surface / Cards | `#FFFFFF` | Cards |
| Surface Elevated | `#F5F3EF` | Sidebar, secondary panels |
| Surface Subtle | `#EDEAE4` | Hover, selected |
| Border | `#D8D3CB` | Hairlines |
| Text Primary | `#1A1714` | Warm near-black |
| Text Secondary | `#6B6460` | Muted |
| Text Tertiary | `#A09890` | Disabled |
| Brand Accent | `#A67220` | Amber — darker for light mode contrast (meets 4.5:1 on white) |
| Brand Accent Hover | `#8A5E18` | Deeper on hover |

#### Media-Type Indicator Colors

| Type | Dark Mode Hex | Light Mode Hex | Rationale |
|------|---------------|----------------|-----------|
| Film | `#E8C97A` | `#8A6A1A` | Warm gold — heritage, projected light |
| Documentary | `#7AB8E8` | `#2A6A9A` | Slate blue — factual, journalistic |
| Game | `#8AE8B8` | `#1A8A58` | Mint green — interactive, digital |
| Course | `#C87AE8` | `#7A2AB8` | Soft violet — educational, intellectual |

#### Semantic Colors

| State | Dark Hex | Light Hex | Notes |
|-------|----------|-----------|-------|
| Success | `#4ADE80` | `#16A34A` | Green |
| Error | `#F87171` | `#DC2626` | Red |
| Warning | `#FBBF24` | `#D97706` | Amber (distinct from brand gold) |
| Info | `#60A5FA` | `#2563EB` | Blue |

---

### Direction B — Signal Crimson

> **Rationale:** Closer to the Netflix lineage but shifted toward editorial — deep charcoal (not pure black) with a desaturated crimson. This feels like a film-festival identity: Cannes, Sundance, BAFTA. For Jeremy, it reads modern and prestigious. The charcoal base gives it distance from Netflix's #141414. This is the safest direction — immediately legible as premium media.

#### Dark Mode

| Role | Hex | Notes |
|------|-----|-------|
| Background | `#0F0E0E` | Warm charcoal |
| Surface | `#191616` | Cards |
| Surface Elevated | `#201C1C` | Modals |
| Surface Subtle | `#272222` | Hover |
| Border | `#302A2A` | Hairlines |
| Text Primary | `#F2EEEC` | Off-white |
| Text Secondary | `#948A88` | Muted |
| Text Tertiary | `#564E4C` | Disabled |
| Brand Accent | `#C0392B` | Desaturated cinema red — less aggressive than #E50914 |
| Brand Accent Hover | `#D44436` | Lighter on hover |
| Brand Glow | `rgba(192,57,43,0.15)` | Subtle halo |

#### Light Mode

| Role | Hex | Notes |
|------|-----|-------|
| Background | `#FAFAFA` | Near-white |
| Surface | `#FFFFFF` | Cards |
| Surface Elevated | `#F4F0EF` | Secondary panels |
| Surface Subtle | `#EDE7E6` | Hover |
| Border | `#D8D0CE` | Hairlines |
| Text Primary | `#1A1515` | Near-black with warmth |
| Text Secondary | `#6B5F5D` | Muted |
| Text Tertiary | `#9C908E` | Disabled |
| Brand Accent | `#9E2A1F` | Darkened for 4.5:1 on white |
| Brand Accent Hover | `#821F16` | Deeper |

#### Media-Type Indicators (same warmth family)

| Type | Dark Hex | Light Hex |
|------|----------|-----------|
| Film | `#E89070` | `#9A4020` | Burnt sienna — classic film |
| Documentary | `#70A8E8` | `#1A5A9A` | Cool blue — reportage |
| Game | `#70E8A8` | `#0E7A4A` | Emerald — interactive |
| Course | `#C870E8` | `#7A10A8` | Violet — academic |

---

### Direction C — Polar Noir

> **Rationale:** Deep cool slate with a single electric teal accent. Feels like a premium editorial publication from 2025 — Bloomberg, The Economist digital edition, or Apple's own dark interfaces. For Jeremy, this reads intellectual and modern. The teal accent adds energy without warmth, which suits documentary and course content as well as it suits film. This is the most distinctive and unexpected direction.

#### Dark Mode

| Role | Hex | Notes |
|------|-----|-------|
| Background | `#0A0C10` | Cool near-black |
| Surface | `#111418` | Cards |
| Surface Elevated | `#181C22` | Modals |
| Surface Subtle | `#1E2228` | Hover |
| Border | `#262C34` | Hairlines |
| Text Primary | `#ECF0F4` | Cool off-white |
| Text Secondary | `#8A9099` | Muted |
| Text Tertiary | `#4A5260` | Disabled |
| Brand Accent | `#2DD4C0` | Electric teal |
| Brand Accent Hover | `#3EEACC` | Brighter on hover |
| Brand Glow | `rgba(45,212,192,0.15)` | Ambient glow |

#### Light Mode

| Role | Hex | Notes |
|------|-----|-------|
| Background | `#F8FAFB` | Cool off-white |
| Surface | `#FFFFFF` | Cards |
| Surface Elevated | `#EEF1F4` | Secondary |
| Surface Subtle | `#E2E6EA` | Hover |
| Border | `#CBD1D8` | Hairlines |
| Text Primary | `#111418` | Cool near-black |
| Text Secondary | `#5A6470` | Muted |
| Text Tertiary | `#8A9099` | Disabled |
| Brand Accent | `#0A8A7C` | Darkened teal (4.5:1 on white) |
| Brand Accent Hover | `#077068` | Deeper |

#### Media-Type Indicators

| Type | Dark Hex | Light Hex |
|------|----------|-----------|
| Film | `#E8D070` | `#8A7010` | Warm gold — film grain |
| Documentary | `#70B8E8` | `#1A60A0` | Cerulean |
| Game | `#A070E8` | `#5010A0` | Electric violet |
| Course | `#E87070` | `#A02020` | Coral |

---

### Recommendation

**Primary recommendation: Direction A (Criterion Ink)**  
The amber-gold on warm near-black is genuinely distinctive — no major streaming platform uses this palette. It fits Jeremy's world: warm enough for late-night watching, serious enough for intentional selection. The editorial associations of gold (print publishing, cinema awards, Criterion Collection) reinforce NUX's narrative-theme positioning.

**Direction B** as fallback if stakeholders want safer / more immediately recognizable as "streaming."

**Direction C** if the product leans more into documentary and educational than film.

---

## 2. Typography System

### Recommended Pairing: Inter + Playfair Display + JetBrains Mono

This is a tri-stack — each font has a distinct role and semantic meaning.

| Role | Font | Weight Range | Usage |
|------|------|-------------|-------|
| Display / Hero | Playfair Display | 700, 900 | Hero titles, featured content names, big moments |
| UI / Body | Inter | 300, 400, 500, 600 | All navigation, body copy, labels, buttons |
| Metadata / Code | JetBrains Mono | 400, 500 | Year, duration, ratings, episode numbers, technical metadata |

**Why this works for NUX:**
- Playfair Display in hero positions signals editorial prestige — the same energy as a film-festival catalogue or a Criterion booklet. Its high stroke contrast is cinematic.
- Inter keeps the interface clean and fast-reading. Jeremy is scanning catalogues and reading descriptions, not enjoying typography — Inter gets out of the way.
- JetBrains Mono for metadata creates a subtle typographic system: `2024 · 1h 42m · R` in mono reads like a data label, distinct from prose without being technical/geeky.

**Google Fonts import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Type Scale

| Token | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|------|--------|-------------|----------------|-------|
| `--type-display` | Playfair Display | 72px / 4.5rem | 900 | 1.0 | -0.03em | Hero headline, landing |
| `--type-h1` | Playfair Display | 48px / 3rem | 700 | 1.1 | -0.02em | Featured title, page headers |
| `--type-h2` | Playfair Display | 32px / 2rem | 700 | 1.2 | -0.01em | Section headers, modal titles |
| `--type-h3` | Inter | 24px / 1.5rem | 600 | 1.3 | -0.01em | Card titles, content names |
| `--type-body-lg` | Inter | 18px / 1.125rem | 400 | 1.6 | 0 | Descriptions, first paragraphs |
| `--type-body` | Inter | 16px / 1rem | 400 | 1.6 | 0 | Body copy, UI labels |
| `--type-body-sm` | Inter | 14px / 0.875rem | 400 | 1.5 | 0 | Secondary labels, captions |
| `--type-caption` | Inter | 12px / 0.75rem | 500 | 1.4 | 0.02em | Tags, badges, navigation labels |
| `--type-meta` | JetBrains Mono | 12px / 0.75rem | 400 | 1.4 | 0.04em | Year, duration, rating, episode |
| `--type-meta-lg` | JetBrains Mono | 14px / 0.875rem | 500 | 1.4 | 0.03em | Prominent metadata, scoreboards |

**Usage notes:**
- Playfair Display italic (700i) is available for pull quotes and hero descriptions — use sparingly.
- Never use Playfair Display below 24px — it loses legibility at small sizes.
- JetBrains Mono should be `text-transform: uppercase` for all metadata use.
- Minimum body size on mobile: 16px. Never go below 14px for readable prose.
- Line length: target 60–70 characters for body copy on desktop. Use `max-width: 65ch` on description blocks.

---

## 3. Animation System

### Philosophy

NUX's animations follow a single rule: **every movement must feel like content revealing itself, not UI moving.** The interface is a window into narrative — it should open, not bounce. Inspired by Apple's spatial continuity, Framer Motion's spring system, and the way a cinema curtain rises.

Key principles:
- **Deceleration-led:** Content enters with ease-out. The viewer's eye is the fixed point.
- **Exit faster than enter:** Closing/leaving takes 60-70% of entry duration — feels snappy, not laboured.
- **Stagger reveals:** Lists and grids stagger entrance. Content has weight, it doesn't all arrive at once.
- **No decorative animation:** If an animation doesn't communicate something (hierarchy, relationship, state), it doesn't exist.

---

### Easing Curves

```css
/* --- NUX Easing Tokens --- */

/* Enter: content decelerates as it arrives — "settling in" */
--ease-enter:   cubic-bezier(0.16, 1, 0.3, 1);

/* Exit: content accelerates away — quick, purposeful */
--ease-exit:    cubic-bezier(0.4, 0, 1, 1);

/* Move: element repositioning, reordering, drag */
--ease-move:    cubic-bezier(0.4, 0, 0.2, 1);

/* Spring (use Framer Motion spring for these): */
/* Modal/sheet open: type:'spring', stiffness:300, damping:30 */
/* Card press: type:'spring', stiffness:400, damping:25 */

/* Cinematic — reserved for hero transitions only */
--ease-cinematic: cubic-bezier(0.22, 1, 0.36, 1);
```

**Reference:** `cubic-bezier(0.16, 1, 0.3, 1)` is the Expo.out curve used by Framer Motion's default spring approximation and Apple's UIKit spring animations. `cubic-bezier(0.22, 1, 0.36, 1)` is used in Apple's WWDC transitions.

---

### Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--dur-instant` | `50ms` | State flips (active/inactive, toggle on/off) |
| `--dur-fast` | `150ms` | Hover states, focus rings, button presses |
| `--dur-normal` | `250ms` | Card entrance, tooltip appear, dropdown open |
| `--dur-slow` | `400ms` | Page transitions, modal open, sidebar expand |
| `--dur-cinematic` | `700ms` | Hero reveals, featured content transitions |

---

### Animation Patterns

#### Page Transitions

**Pattern:** Fade + upward translate. New page fades in and rises 16px into position. Previous page fades out and drops 8px. This creates depth without lateral motion (which would imply linear navigation — NUX is non-linear, thematic).

```css
/* With Framer Motion (recommended) */
/* 
  initial: { opacity: 0, y: 16 }
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }
*/

/* CSS fallback */
@keyframes page-enter {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page-enter {
  animation: page-enter var(--dur-slow) var(--ease-enter) both;
}
```

**Reference:** Apple macOS Sonoma window enter, Vercel dashboard route transitions.

---

#### Card Hover / Tap

**Pattern:** Subtle scale lift + shadow intensification. No translate — cards don't move, they expand slightly toward the viewer. On tap/click, compress to 0.97 scale (press feedback), then spring back.

```css
.card {
  transition:
    transform var(--dur-fast) var(--ease-move),
    box-shadow var(--dur-fast) var(--ease-move);
}
.card:hover {
  transform: scale(1.025);
  box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2);
}
.card:active {
  transform: scale(0.97);
  transition-duration: var(--dur-instant);
}

/* Framer Motion variant */
/*
  whileHover: { scale: 1.025, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } }
  whileTap:   { scale: 0.97,  transition: { duration: 0.05 } }
*/
```

**Scale rule:** Never exceed 1.04 for non-hero cards. Larger cards (hero, featured) hover at 1.01 — the illusion of leaning forward.

---

#### Content Reveal (Stagger)

**Pattern:** Catalogue rows and grids use a staggered entrance — 40ms delay between each item, entering from 12px below with opacity 0→1. The stagger reads as the content "loading in" with cinematic weight. First item enters immediately; do not delay the whole group.

```css
/* Framer Motion (recommended) */
/*
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 }
  }
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
}
*/

/* CSS fallback — use inline style for nth-item delay */
.catalogue-item {
  animation: card-enter var(--dur-normal) var(--ease-enter) both;
  animation-delay: calc(var(--item-index, 0) * 40ms);
}
@keyframes card-enter {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Cap stagger at 8–10 items.** After item 10, all remaining items use the same delay as item 10. A 40-item grid should not take 1.6 seconds to finish rendering.

---

#### Hero / Featured Content

**Pattern:** Full-bleed hero with gradient overlay uses a slow parallax on scroll — background image moves at 0.4× scroll speed, foreground text moves at 1.0× (normal). On hero enter, text fades up over 700ms with the cinematic easing. Poster/backdrop image fades in over 500ms with a subtle scale from 1.04→1.0 (zoom-in settle).

```css
/* Hero backdrop image enter */
@keyframes hero-image-enter {
  from { opacity: 0; transform: scale(1.04); }
  to   { opacity: 1; transform: scale(1.00); }
}
.hero-backdrop {
  animation: hero-image-enter var(--dur-cinematic) var(--ease-cinematic) both;
}

/* Hero text enter — staggered after image */
@keyframes hero-text-enter {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-title     { animation: hero-text-enter 0.6s var(--ease-cinematic) 0.2s both; }
.hero-subtitle  { animation: hero-text-enter 0.5s var(--ease-cinematic) 0.35s both; }
.hero-cta       { animation: hero-text-enter 0.4s var(--ease-cinematic) 0.5s both; }

/* Parallax scroll — apply via JS/Framer Motion */
/* backgroundPositionY: scrollY * 0.4 */
```

**Reference:** Apple TV+ homepage hero, Mubi's editorial hero on desktop.

---

#### Loading Skeleton

**Pattern:** Shimmer animation — a gradient moves left-to-right across skeleton bones. Use warm grey tones that match each mode's surface color. Skeleton shapes should mirror the exact layout of the real content (same border-radius, same proportions).

```css
@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
}

/* Dark mode skeleton */
.skeleton {
  background: linear-gradient(
    90deg,
    #1E1B17 25%,
    #2A2620 50%,
    #1E1B17 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
  border-radius: inherit;
}

/* Light mode variant */
.skeleton-light {
  background: linear-gradient(
    90deg,
    #EDEAE4 25%,
    #F5F3EF 50%,
    #EDEAE4 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}
```

**Reference:** Netflix skeleton loading, Facebook content placeholder.

---

#### Modal Open / Close

**Pattern:** Modals scale from 0.95→1.0 and fade from 0→1 on open. Scrim fades from 0→0.72. On close, modal scales from 1.0→0.97 and fades to 0 (duration: 70% of open). Spring physics for the open only — close is a simple ease-in fade for responsiveness.

```css
/* Framer Motion (recommended) */
/*
  // Modal
  initial:   { opacity: 0, scale: 0.95 }
  animate:   { opacity: 1, scale: 1,   transition: { type: 'spring', stiffness: 300, damping: 30 } }
  exit:      { opacity: 0, scale: 0.97, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }

  // Scrim
  initial:   { opacity: 0 }
  animate:   { opacity: 0.72, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }
  exit:      { opacity: 0,    transition: { duration: 0.18 } }
*/

/* CSS fallback */
@keyframes modal-enter {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
.modal { animation: modal-enter var(--dur-normal) var(--ease-enter) both; }
.scrim { animation: fade-in var(--dur-normal) var(--ease-enter) both; }
```

**Mobile bottom sheets:** slide up from translateY(100%) → translateY(0) on open, with spring stiffness:280, damping:26. This is the iOS sheet pattern.

**Reference:** Apple sheet transitions (iOS 16+), Framer Motion AnimatePresence + motion.div.

---

#### Reduced Motion

All animations must respect `prefers-reduced-motion`. Under this preference, eliminate all translate/scale animations and replace with simple opacity fade at 150ms. Stagger delays collapse to 0.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.15s !important;
    animation-delay: 0s !important;
    transition-duration: 0.15s !important;
    transform: none !important;
  }
}
```

---

## 4. Visual Style Direction

### Overall Aesthetic

NUX is editorial-first and content-supreme. The interface disappears in favour of the poster, the still, the cover — the UI provides structure and navigation, never decoration. It draws from the precision of Apple's Human Interface Guidelines (nothing unnecessary), the confidence of Mubi's typography (let the words be beautiful), and the spatial authority of Netflix's grid (content density done right). Dark mode is the primary experience; light mode is a considered alternative for daylight reading, not an afterthought.

---

### Card Treatment

**Standard catalogue card:**
- Aspect ratio: `2:3` (poster/portrait) for film and documentary; `16:9` (landscape) for game and course
- Border radius: `8px` — firm and modern, not soft/friendly, not harsh
- Default state: no visible border; the card lifts from the background via the subtle elevation of the image
- Dark mode surface: `#161412` — 1-step above page background
- Hover state: `scale(1.025)` + box-shadow intensification (see animation section). Image optionally reveals a gradient overlay with title below on long-press/hover-hold.
- Selected/active: `2px` solid `Brand Accent` ring with `4px` offset — obvious without being garish
- Shadow scale:
  - Resting: `0 2px 8px rgba(0,0,0,0.3)`
  - Hover: `0 12px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.2)`
  - Active: none (compressed to background)

**Featured/hero card (editorial block):**
- Full-bleed image with gradient overlay: `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)`
- Text anchored to bottom-left in classic editorial position
- Gradient is never a flat colour — always image-derived or content-aware
- Corner radius on featured: `12px` on desktop; `0px` (full bleed) on mobile

---

### Hero / Featured Content Treatment

The hero is the most important surface on NUX. It should feel like the opening frame of a film.

- **Full bleed** always — no padding, no letterboxing
- Backdrop image fades in with a 1.04→1.0 scale settle (see animation: Hero)
- Gradient overlay: `linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%)` anchors title/metadata at bottom
- Editorial mode (optional, for featured collections): treat the hero as a magazine spread — oversized Playfair Display title, short italicised deck text in Playfair Display italic, clean Inter metadata line below. Think Criterion booklet.
- Ambient colour: where technically feasible, sample the dominant colour from the hero image and use it as a very subtle ambient background glow behind the hero (opacity 0.12–0.2, blurred 80px). This is the Apple Music album-art ambient colour technique.

---

### Icon Style

- **Set:** Lucide Icons (https://lucide.dev) — clean 2px stroke, modern rounded-cap strokes, consistent optical weight
- **Size tokens:**
  - `icon-sm`: 16px (inline, dense UI)
  - `icon-md`: 20px (default, navigation, buttons)
  - `icon-lg`: 24px (prominent actions, empty states)
  - `icon-xl`: 32px (hero actions like play button)
- **Stroke width:** 1.5px for `icon-sm`, 2px for all others
- **Style rule:** Never mix filled and outline icons at the same hierarchy level. All UI navigation icons are outline (stroke). Only the active state of a navigation item can use a filled variant.
- **Color:** Icons inherit `currentColor` — they follow text colour tokens, never have hardcoded fill colours
- **Play button (hero):** Special case — use a custom circle-play icon at 56px × 56px with brand accent fill and a subtle glow (`box-shadow: 0 0 24px rgba(200,146,42,0.4)` in Direction A)

---

### Image Treatment for Catalogue Items

**Poster art (Film, Documentary):**
- Display at native aspect ratio `2:3`
- On hover, reveal a bottom gradient overlay (`0% transparent → 60% rgba(0,0,0,0.7)`) with title and year in `--type-caption` weight
- Apply `image-rendering: auto` — no sharpening filters that destroy film grain
- Use `loading="lazy"` for below-fold items
- Skeleton placeholder at exact poster dimensions before load (see animation: skeleton)

**Game / Course (landscape `16:9`):**
- Lighter gradient treatment — these items benefit from the media type indicator pill (see below)
- A subtle `4px` left-border in the media-type indicator color provides instant categorization at a glance

**Media type pill:**
- Small badge: `border-radius: 4px`, `padding: 2px 6px`, `font: --type-caption`, `background: rgba(MediaTypeColor, 0.18)`, `color: MediaTypeColor`, `border: 1px solid rgba(MediaTypeColor, 0.35)`
- Positioned top-right of card at `8px` offset
- Never show more than one pill per card

**Image quality progression:**
- Load order: low-quality placeholder blur → LQIP (blurred thumbnail) → full resolution
- Use CSS `blur(20px)` on LQIP thumbnail, remove blur with 300ms transition when full image loads
- No hard skeleton-to-image swap — the blur dissolves into the real image

---

## 5. Design Token Summary (CSS Custom Properties)

The following is the complete token set for Direction A (Criterion Ink) — the recommended direction. Adapt hex values only when switching to Direction B or C; all other tokens stay identical.

```css
/* === NUX DESIGN TOKENS — Direction A: Criterion Ink === */

/* --- Neutrals (from wireframe, extended) --- */
--color-ink:    #1A1A1A;
--color-ash:    #ABABAB;
--color-silver: #CCCCCC;
--color-mist:   #F2F2F2;
--color-white:  #FFFFFF;

/* --- Dark Mode Surfaces --- */
--dark-bg:               #0D0C0B;
--dark-surface:          #161412;
--dark-surface-elevated: #1E1B17;
--dark-surface-subtle:   #231F1A;
--dark-border:           #2E2A24;

/* --- Dark Mode Text --- */
--dark-text-primary:   #F0EDE8;
--dark-text-secondary: #9A9087;
--dark-text-tertiary:  #5A5249;

/* --- Light Mode Surfaces --- */
--light-bg:               #FAFAF8;
--light-surface:          #FFFFFF;
--light-surface-elevated: #F5F3EF;
--light-surface-subtle:   #EDEAE4;
--light-border:           #D8D3CB;

/* --- Light Mode Text --- */
--light-text-primary:   #1A1714;
--light-text-secondary: #6B6460;
--light-text-tertiary:  #A09890;

/* --- Brand Accent --- */
--accent:       #C8922A;  /* dark mode */
--accent-hover: #D9A33A;
--accent-glow:  rgba(200, 146, 42, 0.18);
--accent-light: #A67220;  /* light mode */
--accent-light-hover: #8A5E18;

/* --- Media Type Indicators --- */
--type-film-dark:  #E8C97A;   --type-film-light:  #8A6A1A;
--type-doc-dark:   #7AB8E8;   --type-doc-light:   #2A6A9A;
--type-game-dark:  #8AE8B8;   --type-game-light:  #1A8A58;
--type-course-dark: #C87AE8;  --type-course-light: #7A2AB8;

/* --- Semantic --- */
--color-success: #4ADE80;  --color-success-light: #16A34A;
--color-error:   #F87171;  --color-error-light:   #DC2626;
--color-warning: #FBBF24;  --color-warning-light: #D97706;
--color-info:    #60A5FA;  --color-info-light:    #2563EB;

/* --- Typography --- */
--font-display: 'Playfair Display', Georgia, serif;
--font-body:    'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono:    'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

--type-display:  clamp(48px, 6vw, 72px);
--type-h1:       clamp(32px, 4vw, 48px);
--type-h2:       clamp(24px, 3vw, 32px);
--type-h3:       24px;
--type-body-lg:  18px;
--type-body:     16px;
--type-body-sm:  14px;
--type-caption:  12px;
--type-meta:     12px;

/* --- Spacing (8pt base) --- */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  24px;
--space-6:  32px;
--space-7:  48px;
--space-8:  64px;
--space-9:  96px;
--space-10: 128px;

/* --- Border Radius --- */
--radius-sm:   4px;   /* pills, tags, badges */
--radius-md:   8px;   /* standard cards */
--radius-lg:   12px;  /* featured cards, modals */
--radius-xl:   16px;  /* bottom sheets */
--radius-full: 9999px; /* circular elements */

/* --- Shadows (dark mode) --- */
--shadow-sm:  0 2px 8px rgba(0,0,0,0.3);
--shadow-md:  0 4px 16px rgba(0,0,0,0.4);
--shadow-lg:  0 8px 32px rgba(0,0,0,0.5);
--shadow-xl:  0 12px 48px rgba(0,0,0,0.6);
--shadow-hero: 0 24px 80px rgba(0,0,0,0.7);

/* --- Z-Index Scale --- */
--z-base:    0;
--z-lift:    10;
--z-overlay: 20;
--z-nav:     40;
--z-modal:   100;
--z-toast:   200;
--z-tooltip: 300;

/* --- Animation --- */
--ease-enter:    cubic-bezier(0.16, 1, 0.3, 1);
--ease-exit:     cubic-bezier(0.4, 0, 1, 1);
--ease-move:     cubic-bezier(0.4, 0, 0.2, 1);
--ease-cinematic: cubic-bezier(0.22, 1, 0.36, 1);

--dur-instant:   50ms;
--dur-fast:      150ms;
--dur-normal:    250ms;
--dur-slow:      400ms;
--dur-cinematic: 700ms;

/* --- Breakpoints --- */
--bp-xs:  375px;
--bp-sm:  640px;
--bp-md:  768px;
--bp-lg:  1024px;
--bp-xl:  1280px;
--bp-2xl: 1440px;
```

---

## 6. Implementation Notes for React + Vite

**Framer Motion** is strongly recommended over CSS-only animations for:
- Page transitions (AnimatePresence + motion.div)
- Card hover/tap (whileHover, whileTap, variants)
- Modal/sheet enter-exit (AnimatePresence + spring config)
- Stagger effects (variants with staggerChildren)

`framer-motion` is tree-shakeable and adds ~40KB gzipped — acceptable for a premium product. Add `@motionone/animation` if Framer Motion feels heavy for micro-interactions only.

**CSS custom properties** should be applied via a `:root` block (light mode defaults) with a `[data-theme='dark']` attribute toggle — not a media query — so Jeremy can override his OS preference.

**Image optimisation:**
- Use `<img loading="lazy" decoding="async" srcset="..." sizes="...">` for all catalogue items
- Store posters at `400w` and `800w` WebP minimum
- Use LQIP (10px base64 blur) as placeholder before full load

**Font loading:**
- `font-display: swap` for all Google Fonts to prevent invisible text flash
- Preload only the two most critical weights: Inter 400 and Playfair Display 700

---

*This document is the single source of truth for NUX's visual design language. All components, pages, and patterns should reference these tokens. Do not hardcode hex values in component files.*
