# tvOS HIG Checklist — for reviewing NUX tvOS screens

Run any tvOS NUX screen (Figma or built) against this before calling it done. Numbers are from Apple's Human Interface Guidelines (see `tvos-hig-reference` memory). Mark ✅ / ⚠️ / ❌ per line.

---

## A. Focus & selection (the core)
- [ ] **Every** interactive element is reachable by up/down/left/right focus — nothing is touch-only or mouse-only.
- [ ] Focus and activation are **separate** — landing on an item does not auto-open it (the only exception is content that genuinely warrants instant change).
- [ ] Focus uses the **system parallax/lift**, not a custom static ring, unless absolutely necessary.
- [ ] All **5 focus states** are designed and visually distinct: Unfocused · Focused · Highlighted (press) · Selected · Disabled.
- [ ] Focused items are supplied at their **enlarged scale** and stay sharp (no upscaled blur).
- [ ] A focused (enlarged) item **does not overlap or crowd** neighbours — spacing accounts for the scale-up.
- [ ] Focus is **never moved without user interaction** (no auto-jumping focus mid-task).
- [ ] In **full-screen playback**, focus is hidden and gestures act on the content, not on focus.
- [ ] No free-floating **pointer** in menus/browse (pointers only acceptable inside gameplay-style free movement).

## B. Remote (Siri Remote)
- [ ] Swipe = navigate/change focus; focus moves in the **same direction** as the swipe.
- [ ] Press = activate the focused item; press-then-swipe = scrubbing in the player.
- [ ] **Play/Pause** button controls media playback everywhere.
- [ ] **Back** opens the parent screen (Detail→its rail, Home→Apple TV Home); press-and-hold Back → Home Screen.
- [ ] **Inadvertent taps are ignored** during video playback (don't react to a resting thumb).
- [ ] Standard gestures keep standard meanings — no redefining swipe/press outside of gameplay.

## C. Layout & safe area
- [ ] Canvas is **1920×1080pt** (@1x); same UI is designed to look good on a range of TV sizes (no per-size adaptation assumed).
- [ ] Primary content inset **≥60pt top & bottom, ≥80pt left & right**. Nothing important sits in the overscan zone.
- [ ] Only deliberately offscreen-flowing content (rail "peek") sits outside the safe area.
- [ ] Partially-hidden offscreen content peeks **symmetrically** on both screen edges.
- [ ] Grid/rail spacing: **≥40pt horizontal, ≥100pt vertical**; spacing stays consistent so it still reads as a grid when focus scales an item.
- [ ] Titled rows add extra vertical space above the section title so the focus-scale doesn't crowd it.

## D. Typography (10-foot legibility)
- [ ] Body text is at **tvOS Body ≈29pt** scale or larger — legible from ~2.5 m.
- [ ] Titles use the tvOS scale: Title 1 76pt / Title 2 57pt / Title 3 48pt / Headline 38pt.
- [ ] Dynamic Type is supported (text reflows when the viewer changes size).
- [ ] Text has strong contrast over imagery (gradient scrim behind any text on a backdrop).

## E. Top Shelf
- [ ] App provides a dynamic Top Shelf (Carousel Actions / Details, or sectioned row) — not just a static image.
- [ ] Static fallback image is **2320×720pt** if dynamic content is unavailable.
- [ ] Sectioned-row posters use the spec sizes (2:3: 404×608 actual / 380×570 focused / 333×570 unfocused pt).
- [ ] Top Shelf features **new** content and resume points — **no ads, no prices**, no already-watched promotion.
- [ ] Buttons deep-link correctly: Play → Player, More Info → Film Detail.

## F. Experience & system integration
- [ ] Artwork is **edge-to-edge / full-bleed**, cinematic; animations are subtle and fluid.
- [ ] Sign-in is **easy and infrequent**; multi-user profile switch is supported and auto-switches when the viewer changes.
- [ ] Integrates relevant system features: TV app, SharePlay, Top Shelf, TV-provider accounts (where applicable).
- [ ] Audio/visual feedback confirms focus and selection from across the room.

## G. NUX brand consistency (carried from the iOS/desktop system)
- [ ] Criterion Ink palette: bg `#0D0C0B`, surface `#161412`, elevated `#1E1B17`, border `#2E2A24`; text `#F0EDE8 / #9A9087 / #5A5249`; accent `#C8922A` (focus border, selected, primary CTA).
- [ ] Fonts: Playfair Display (display/titles), Inter (UI/body), JetBrains Mono uppercase (metadata).
- [ ] Primary CTA is **"Play"** everywhere (consistent with the iOS/desktop audit decision); hero shows Play + My List only.
- [ ] Media-type colors: film `#E8C97A`, doc `#7AB8E8`, game `#8AE8B8`, course `#C87AE8`; one media-type pill per card max.
- [ ] Poster aspect: 2:3 for Film/Documentary, 16:9 for Game/Course.

---

### Quick verdict template
> **Screen:** … **Reviewer:** … **Date:** …
> Blockers (❌): …
> Fix-soon (⚠️): …
> Pass (✅): A·B·C·D·E·F·G
