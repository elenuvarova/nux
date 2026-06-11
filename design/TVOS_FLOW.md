# NUX on tvOS — UX Flow & Focus Specification

**Version:** 1.0 · **Date:** 2026-06-10 · **Platform:** tvOS (Apple TV, 1920×1080 @1x / 3840×2160 @2x)
**Brand:** Criterion Ink — `#0D0C0B` warm near-black + `#C8922A` amber. Display = Playfair Display, UI = Inter, metadata = JetBrains Mono.
**Source of truth for rules:** `design/TVOS_HIG_CHECKLIST.md` + the `tvos-hig-reference` memory.

> tvOS is **not a resized iPhone**. There is no touch, no cursor, no scroll-by-drag. The user sits ~2.5 m away and drives a single **focus** point with the Siri Remote. Every screen below is re-thought around that constraint — the iOS NUX screens are the content source, not the layout source.

---

## 0. The one rule that changes everything: the focus model

- **No cursor.** Focus jumps element→element on directional swipes. Every interactive element must be reachable by up/down/left/right.
- **Focus ≠ activation.** Landing on a card highlights it (parallax lift); a separate **press** opens it. Never auto-open on focus.
- **Parallax, not a ring.** The focused poster lifts toward the viewer, brightens, casts a shadow, and reacts to tiny thumb movements. This replaces hover.
- **5 focus states** every focusable NUX component must define: Unfocused → Focused → Highlighted (press feedback) → Selected (activated, e.g. filled My-List) → Disabled.
- **Assets at focused scale.** A focused poster is ~+10% scale; art must stay sharp at the larger size and **must not crowd neighbours** (that's why rails need generous gaps).

### Criterion Ink focus treatment (NUX-specific)
| State | Treatment |
|---|---|
| Unfocused | Poster at rest, `surface #161412`, no shadow, label hidden |
| **Focused** | Scale 1.08–1.10, lift with `0 24px 80px rgba(0,0,0,0.7)`, **1px amber `#C8922A` inset border**, title + meta fade in below, ambient amber glow `rgba(200,146,42,0.18)` behind |
| Highlighted | On press: quick compress to 0.97 then settle (the "click") |
| Selected | Amber accent persists (e.g. My-List heart filled `#C8922A`) |
| Disabled | 40% opacity, not focusable |

---

## 1. Screen inventory

| # | Screen | Purpose | Maps from iOS NUX |
|---|---|---|---|
| 1 | **Home** | Featured hero + curated rails (Continue, Editor's picks, by media-type) | iPhone Home `99:2` / Desktop Home `131:2` |
| 2 | **Browse / Catalogue** | Genre + media-type filtering, poster grid | Browse `100:135` / `134:207` |
| 3 | **Film Detail** | Full-bleed backdrop, synopsis, cast, related, primary Play | Film Detail `101:250` / `136:419` |
| 4 | **Player** | Full-screen playback + transport overlay | (new — no iOS equivalent built) |
| 5 | **Search** | Keyboard-grid search, live results | iPhone detached search circle |
| 6 | **My List / Profile** | Saved items, profile switch | My List empty `224:375`, Profile tab |
| 7 | **Top Shelf** | Home-Screen showcase (outside the app) | new — tvOS-only surface |

**Build priority (this pass):** Home, Browse, Film Detail, Player. Search / My List / Top Shelf are specced here but built in a follow-up.

---

## 2. Global navigation

tvOS NUX uses a **top tab bar** (the tvOS convention — not a bottom iPhone capsule, not a desktop sidebar). It auto-hides on scroll-down and on the Player.

```
┌──────────────────────────────────────────────────────────────────┐
│  NUX        Home   Browse   My List   Search          ◷ Profile    │  ← top tab bar, 60pt from top
└──────────────────────────────────────────────────────────────────┘
```
- Tabs are focusable; the focused tab underlines in amber. Pressing Up from the top content row returns focus to the tab bar.
- Wordmark "NUX" in Playfair Display, left; Profile avatar far right.
- **Menu/Back button** = go to parent (Home is the top — Back there exits to Apple TV Home Screen). Hold Back = jump to Home Screen.

### Focus traversal map (Home)
```
            [ tab bar: NUX  Home  Browse  MyList  Search  Profile ]
                                  ▲ (Up from hero)
        ┌──────────────────────────────────────────────────────┐
        │  HERO  → [ ▶ Play ]  [ + My List ]   (Right between)   │
        └──────────────────────────────────────────────────────┘
                                  ▼ (Down)
   Continue Watching →  ◀ card  card  card  card ▶   (Left/Right scroll)
                                  ▼
   Editor's Picks     →  ◀ card  card  card  card ▶
                                  ▼
   Films · Documentaries · Games · Courses rails …
```
- **Up/Down** = move between rails (and into the tab bar from the top rail).
- **Left/Right** = scroll within a rail; the focused card centres, neighbours peek at the safe-zone edges.
- **Press** on a card → Film Detail. **Press** on hero Play → Player.

---

## 3. Screen-by-screen flow

### 3.1 Home
- **Hero** (full-bleed, top): backdrop image + bottom-left editorial block — Playfair title, JetBrains meta line (`2024 · 1h 42m · R`), one-line deck, then **two pills**: `▶ Play` (amber filled) + `+ My List` (glass/outline). Only two CTAs — no "Info" clutter (matches the iOS audit decision).
- **Rails** below the hero: Continue Watching (16:9 progress cards) → Editor's Picks → per-media-type rails. Each rail = SectionHeader (Playfair, left, inside the 80pt safe inset) + horizontal strip of posters.
- **First-focus on launch:** hero Play button (predictable, lets a returning viewer resume instantly via Top Shelf intent).
- Posters: 2:3 for Film/Documentary, 16:9 for Game/Course. Media-type pill top-right.

### 3.2 Browse / Catalogue
- **Filter row** at top (inside safe area): media-type chips (All · Films · Docs · Games · Courses) + genre chips. Chips are focusable; selected chip = amber fill.
- **Poster grid** below: tvOS 5–6 column grid (use HIG grid spacing — ≥40pt horizontal, ≥100pt vertical so focus-scale doesn't overlap). Grid scrolls vertically by focus; the top row pushes focus back up into the filter row.
- **No results** state mirrors iOS Browse No-Results `225:433` — EmptyState centred, "Try a different genre".

### 3.3 Film Detail
- **Full-bleed backdrop** top 60%, gradient to `#0D0C0B` at the bottom.
- **Info block** (bottom-left, safe inset): Playfair title, JetBrains meta, synopsis (≤3 lines at Body 29pt), then the **action shelf**: `▶ Play` (primary, first-focus) · `+ My List` · `Rate` · `Share`. Icon-over-label, each focusable, focused = amber lift.
- **Below the fold** (focus Down): **Cast** rail (CastCard with circular portraits) → **Related / More like this** rail (posters). Pressing a related poster reloads Detail in place.
- Back returns to the originating rail position (Home or Browse), not always Home.

### 3.4 Player
- **Full-screen video.** No focus shown — gestures act on content, not focus (HIG rule).
- **Idle:** chrome hidden. Any remote touch / swipe-down reveals the **transport overlay** (bottom): scrubber (press-to-scrub, swipe to seek, time on the JetBrains scale), title top-left, and a row of controls (⏪ ⏯ ⏩ · Subtitles · Audio · Info). Overlay auto-dims after ~3s idle.
- **Play/Pause button** on the remote toggles playback anywhere. **Back** = exit to Detail (with a "are you still watching" resume marker saved).
- Subtitles/Audio open a side sheet; selecting moves focus back to the scrubber.

### 3.5 Search
- **Left:** on-screen keyboard grid (tvOS linear keyboard) or dictation via the remote mic. **Right:** live result posters that refresh as letters are added.
- Press Down from the keyboard moves focus into results; press Up returns to the keyboard.

### 3.6 My List / Profile
- My List = poster grid of saved items (Selected state = amber). Empty = EmptyState (`224:375` analogue): "Your list is empty — browse to add."
- Profile = avatar grid for multi-user switch. tvOS best practice: **make sign-in easy and infrequent**, auto-switch profile when the viewer changes.

---

## 4. Top Shelf (NUX's Home-Screen showcase)

When NUX sits in the Apple TV Dock and is focused, it owns the Top Shelf. Use **Carousel Details** layout:
- Full-bleed previews of new/featured NUX titles auto-play; swipe to move between them.
- Two buttons per item: **Play** (deep-links into Player) + **More Info** (deep-links into Film Detail).
- Show "Continue Watching" resume points; **never show prices or ads** (HIG). Feature new releases, not already-watched titles.
- Static fallback image: **2320×720pt**. Sectioned-row posters (2:3): actual 404×608pt, focused 380×570pt, unfocused 333×570pt.

---

## 5. Remote → action mapping (NUX)

| Input | Home / Browse / Detail | Player |
|---|---|---|
| Swipe (touch surface) | Move focus | Reveal overlay / seek when scrubbing |
| Press (click) | Open focused item / activate button | Play / Pause |
| Play/Pause button | Start playback of focused hero | Toggle playback |
| Back | Parent screen (hold → Home Screen) | Exit to Film Detail |
| Tap up/down zone | (optional) page rails | Skip ±10s |
| Siri / mic | Voice search | "Skip intro", "what did they say" |

---

## 6. tvOS type scale applied to NUX

Map NUX's editorial roles onto Apple's tvOS scale (size/leading pt @1x). Keep Playfair for display/titles, Inter for UI, JetBrains Mono uppercased for metadata.

| NUX role | tvOS style | Size / Leading | Font |
|---|---|---|---|
| Hero title | Title 1 | 76 / 96 | Playfair Display 900 |
| Detail title / page header | Title 2 | 57 / 66 | Playfair Display 700 |
| Section header (rail) | Title 3 | 48 / 56 | Playfair Display 700 |
| Card title (focused) | Headline | 38 / 46 | Inter 600 |
| Synopsis / body | Body | 29 / 36 | Inter 400 |
| Metadata (`2024 · 1h 42m · R`) | Callout | 31 / 38 | JetBrains Mono 500 (uppercase) |
| Captions / chip labels | Caption 1 | 25 / 32 | Inter 500 |

---

## 7. Layout constants (tvOS NUX)

- **Canvas:** 1920×1080pt (@1x), design at @2x where assets matter.
- **Safe area:** primary content inset **60pt top/bottom, 80pt left/right**. Rails deliberately bleed posters past the right safe edge to signal "more →".
- **Rails:** poster gap ≥40pt; row-to-row gap ≥100pt (focus-scale headroom). Titled rows add extra space above the SectionHeader.
- **Grid (Browse):** 5–6 columns within the safe area, consistent spacing so it still reads as a grid when an item scales on focus.
- **Symmetry:** partially-hidden offscreen posters peek the same amount on both screen edges.

---

## 8. What to build in Figma (this pass)

A new page **📺 Wireframes — tvOS (1920)** with frames: Home, Browse, Film Detail, Player. tvOS-scale components (FocusPoster with the 5 states, top TabBar-tvOS, Hero-tvOS, RailHeader, transport overlay) reuse the Criterion Ink tokens. See the build notes appended by the assembly step.
