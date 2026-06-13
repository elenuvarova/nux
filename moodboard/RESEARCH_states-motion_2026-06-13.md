# States & Motion research — 2026-06-13

Live design-polish session: nav active-state, poster-card hover, micro-animations.
Refero is gated (login wall), so real product screens were pulled from **Mobbin**
(the reference note says to prefer real screens anyway). All refs are web platform.

NUX target aesthetic: **Criterion-Ink** — warm near-black + rationed amber, editorial
/ cinematic, restrained. "Interaction light language" = soft amber glow (projector).

---

## 1. Nav active-state

**Question:** the static amber underline felt uninteresting — what do premium
streaming sites use, and what's the on-brand upgrade?

**Refs (Mobbin):**
- HBO Max — https://mobbin.com/screens/abb2e041-38fe-4db2-beb1-583e8248b206 — top nav `Home | Series | Movies | HBO | Sports`, active = **thin underline** (≈ what NUX had)
- HBO Max — https://mobbin.com/screens/5244b7a6-9ace-42d6-af77-8a5d96605434 — full-screen menu overlay, active row by brightness
- HBO Max — https://mobbin.com/screens/28bd4db1-e6bc-41a1-873d-326211a65591 — menu overlay variant
- Disney+ — https://mobbin.com/screens/a293f37f-86c9-48e7-8b1f-ad115948c119 — centred icon nav; **sliding pill** segmented control (`For You / Disney+ / hulu`)
- Hulu — https://mobbin.com/screens/3032e178-f309-4344-a3f9-2c73bd9db930 — minimal nav, active = **colour/brightness only**
- Paramount+ — https://mobbin.com/screens/7c81ef64-3481-40ed-826c-de09cd68a056 — uppercase nav + dropdown, subtle active highlight

**Takeaway:** three buckets — thin underline, sliding pill, brightness. The underline
is the *baseline*, not the interesting option.

**Decision (Elena):** ditch the underline → **spotlight glow** behind the active link
(soft amber radial glow, as if lit by the projector) + the label catches a little
light (`text-shadow`). One shared indicator that **slides** between links.
→ implemented in `NavBar.jsx` + `NavBar.css` (`.nav-indicator`).
Alternatives offered & not chosen: keep sliding underline, glass pill (Disney+ style).

---

## 2. Poster-card hover

**Refs (Mobbin):**
- Prime Video — https://mobbin.com/screens/e45bebf9-7e97-4eaf-b77b-d0284c2c575d — hover **expands the card into an inline preview**: Play, +, watchlist, year/runtime/rating, synopsis
- Paramount+ — https://mobbin.com/screens/ac0220b9-a512-415d-a532-5ed7615d135c — hover shows a **floating popover preview**: larger art, metadata, synopsis, "Watch Now" + add/notify
- HBO Max — https://mobbin.com/screens/672a569f-8e75-4380-93d1-85d0b2f8e4a1 — clean portrait poster grid, subtle hover
- Hulu — https://mobbin.com/screens/aad0df4e-ab41-4b35-bbee-162d4425d63d — rail grid, kebab + subtle highlight
- Disney+ — https://mobbin.com/screens/d8edf7b1-3561-4989-8a92-a54e32782001 — landscape card grid, brand-tinted hover
- Disney+ — https://mobbin.com/screens/2fac9057-f4dd-4c4e-b195-86732fdd85b4 — themed rails, scale/highlight hover

**Takeaway:** premium sites add an **actionable layer on hover** (Play + metadata).
NUX's card is *already* advanced (3D mouse-tilt, scale 1.03, depth shadow, cursor-
following amber sheen, hairline brighten) — so the move is to add the actionable cue,
not rebuild.

**Decision:** on hover → (a) **amber rim-glow** added to the depth shadow (same light
language as the nav), (b) a **glass play-circle with an amber glyph** that fades +
scales in (`.poster-card-play`). Refs: Prime Video / Paramount+.
→ implemented in `Rail.jsx` (`PosterCard`) + `Rail.css`.

Deferred richer option (not built): full inline-expand / popover preview with synopsis
+ quick actions (Netflix/Prime style) — bigger feature, revisit if wanted.

---

## Next motion candidates (not yet built)
- Tactile button press (`--press-scale` exists) across all interactives
- Amber focus-glow consistency (`--focus-ring`)
- Rail edge fades + smoother momentum
- Staggered reveals polish (`Reveal.jsx` already does scroll-stagger)
