# PLAYER UX REFERENCES — what makes the best web video players feel great

Studied: Netflix web, YouTube web, Vimeo, Apple TV web (tv.apple.com), MUBI, Plyr, Vidstack. June 2026.
Legend: **[U]** = universal across all six · **[B]** = brand-specific flavor.

## 1. Controls auto-hide + wake
- [U] Hide after ~2–3 s of inactivity **while playing** (Plyr 2 s, YouTube/Netflix ~3 s); never hide while paused.
- [U] Wake on: mousemove over player, any keypress shortcut, touch, focus entering controls; timer resets on each.
- [U] Throttle mousemove (poll a flag on an interval) — don't reset a timeout per event.
- [U] Cursor hides together with controls in fullscreen; reappears on move.
- [U] Touch: longer delay before fade (no mousemove signal); a tap that *reveals* controls must not also toggle play.
- [B] MUBI fades to absolutely clean frame (no persistent chrome) — "leave the film alone" cinematic stance.

## 2. Click / tap zones
- [U] Desktop: single click anywhere on video = play/pause toggle; double-click = fullscreen toggle.
- [!] YouTube fires pause on click 1 then fullscreens on click 2 (brief flicker); Plyr/Vidstack debounce ~200–250 ms — debouncing feels cleaner.
- [U] Mobile: single tap = reveal/hide controls (NOT play/pause); explicit center button toggles playback.
- [U] Mobile: double-tap left/right third of screen = seek −/＋10 s; repeated taps accumulate (+10, +20, +30…) with ripple + counter ("3 taps ≈ zones: left / center / right").
- [B] YouTube: two-finger double-tap skips chapters; seek amount user-configurable 5–60 s.

## 3. Scrubber
- [U] Resting bar is thin (~3 px); on hover the bar thickens (~5–6 px) and a round thumb (~13 px) fades in.
- [U] Hover shows a time tooltip above the cursor position; Plyr calls it the "seek tooltip", on by default.
- [U] Buffered range rendered as a lighter track segment between played (accent) and unplayed (white ~20%).
- [B] YouTube/Netflix/Vidstack: hover thumbnail preview (storyboard/BIF/WebVTT sprites) + chapter title; chapters split the bar into gapped segments.
- [U] Drag = live scrub with tooltip pinned to thumb; keyboard focus on slider allows arrow-key seeking (Vidstack debounces it to feel pointer-equal).
- [B] Netflix: bar sits full-width at the very bottom, red accent; Vimeo: accent color is brand-customizable per embed.

## 4. Keyboard map (the de-facto standard = YouTube's)
- [U] `Space` / `K` play-pause · `M` mute · `F` fullscreen · `C` captions · `Esc` exit fullscreen.
- [U] `←/→` seek ±5 s (Netflix uses ±10) · `J/L` seek ±10 s (YouTube + Vimeo) · `↑/↓` volume ±5%.
- [B] YouTube: `0–9` jump to 0–90% · `Home/End` · `Shift+,/.` speed · `T` theater · `I` miniplayer · `Shift+N/P` next/prev.
- [B] Vimeo: `Shift+←/→` frame-step · `P` frame screenshot · `?` opens shortcut sheet (YouTube `Shift+/` too).
- [U] Shortcuts must not fire while focus is in an input/menu; Plyr exposes `keyboard: {focused, global}` for scoping.

## 5. Volume UX
- [U] Speaker icon with hover-reveal slider that expands inline (YouTube/Vimeo: horizontal; Netflix web: vertical pop-up above icon).
- [U] Icon has 3+ states (muted / low / high); drag-to-zero shows the muted icon.
- [U] Mute is non-destructive: unmute restores the remembered level; level persists across sessions (localStorage).
- [U] Player volume is independent of OS volume — arrows adjust it even when the slider isn't visible (Netflix gives audio-only feedback).

## 6. Pause state
- [U] Pausing pins the controls open (no auto-hide) + keeps scrims; resume restarts the hide timer.
- [B] Netflix: pause surfaces title + episode name (and on idle, a dimmed info overlay with synopsis); video dims slightly under chrome.
- [B] YouTube: paused embeds surface title + channel top bar; no extra dim beyond scrims.
- [U] A brief center "ripple" icon (▶/⏸ ghost that scales + fades) confirms toggles triggered by click/keyboard.

## 7. Buffering indicators
- [U] Centered circular spinner only — never block the controls; controls stay wakeable during buffering.
- [U] Delay the spinner ~300–500 ms after `waiting` so micro-stalls don't flicker it.
- [B] Netflix uses a red arc spinner (historically with % loaded); YouTube a white ring; Apple a system-style activity ring.

## 8. Skip ±10 s buttons
- [U] Circular-arrow icon with the numeral *inside* the arc ("10"); back-arrow counterclockwise, forward clockwise (SF Symbols `gobackward.10` / `goforward.10`).
- [B] Netflix/Apple TV: placed flanking the central play/pause in the bottom bar; mobile apps add haptics.
- [B] YouTube web has no visible skip buttons (keyboard/gesture only) — buttons matter most for trailer/lean-back UX.

## 9. Title placement
- [B] Vimeo: top-left card — title + byline, fades with controls. MUBI: top-left, typographic (title + director/year).
- [B] Netflix web: title/episode centered *inside* the bottom control row. YouTube fullscreen/embed: top gradient bar.
- [U] Whatever the slot: title lives on a scrim, fades in/out with the rest of the chrome, never overlaps the scrubber.

## 10. Gradient scrims
- [U] Bottom scrim under controls: black→transparent, roughly 0.6–0 alpha over the lower ~20–25% of the frame.
- [U] Top scrim under the title (lighter, ~0.4–0); both fade in/out *with* the controls as one layer (~200–300 ms ease).
- [U] Never a full-frame flat dim while playing — scrims keep mid-frame contrast intact (Apple instead uses a frosted-glass bar: blur + translucency rather than a long gradient).

## 11. A11y + reduced motion
- [U] All controls are real `<button>`/`<input type=range>` with `aria-label`; toggle state via `aria-pressed` or label swap ("Pause" ↔ "Play").
- [U] Scrubber/volume expose `role=slider` semantics: `aria-valuemin/max/now` + human `aria-valuetext` ("12:34 of 2:10:00").
- [U] Visible focus ring on every control (WCAG 2.4.7); while keyboard focus is inside the chrome, auto-hide is suspended (Vidstack behavior).
- [U] `aria-live="polite"` region announces state changes (play/pause/mute/captions/speed) — Plyr & Vidstack ship this; build it if rolling your own.
- [U] Settings/shortcut popovers trap focus while open and restore it on close; `Esc` closes menu before exiting fullscreen.
- [U] `prefers-reduced-motion`: replace scale/ripple/slide with opacity-only fades; no auto-playing ambient effects.
- [U] WCAG: 4.5:1 contrast for text/icons over scrims; captions toggle exposed, not buried.

## Universal vs brand-specific — summary
- **Universal grammar:** auto-hide ~3 s + pinned-on-pause · click toggle + dblclick fullscreen · mobile 3-zone taps + edge double-tap seek · hover-thickening scrubber + time tooltip + buffered range · Space/K/M/F/arrows · remembered volume w/ non-destructive mute · delayed spinner · scrim-mounted chrome · slider ARIA.
- **Brand flavor:** Netflix vertical volume, in-bar title, red trickplay previews · Vimeo accent theming, frame-step, screenshot · YouTube chapters, 0–9 seek, theater/mini modes · Apple frosted-glass material · MUBI radical minimalism · Plyr/Vidstack = the patterns codified as defaults (Vidstack even ships YouTube-style gesture zones + VTT thumbnails out of the box).

## Top-10 must-haves — NUX trailer player on a YouTube engine (`controls=0` iframe + custom chrome)
1. Auto-hide chrome at 3 s playing / pinned when paused; wake on mousemove·key·touch·focus; hide cursor in fullscreen.
2. Click = play/pause, double-click = fullscreen, with ~250 ms debounce so the pair never flickers.
3. Full keyboard map: `Space/K`, `←/→` ±5 s, `J/L` ±10 s, `↑/↓` volume, `M`, `F`, `C`, `0–9`, `?` help — scoped to player focus.
4. Scrubber: 3→6 px hover grow, thumb fade-in, hover time tooltip, buffered range from `getVideoLoadedFraction()` (skip thumbnail previews — the iframe API can't supply storyboards; don't fake them).
5. ±10 s numeral-in-arc buttons flanking play/pause (trailer = lean-back) + mobile edge double-tap with accumulating counter ripple.
6. Volume: hover-reveal horizontal slider, 3-state icon, mute preserves level, persist level in localStorage (`setVolume` on init).
7. Pause overlay: film title + year on top scrim, slight dim, controls pinned — turns pause into a poster moment (NUX editorial flavor).
8. Bottom + top scrims fading as one layer with the chrome (250 ms; opacity-only under `prefers-reduced-motion`).
9. Buffering: 400 ms-delayed minimal spinner keyed off player state `3 (buffering)`; never lock the chrome.
10. A11y floor: real buttons + `aria-label`s, slider ARIA with `aria-valuetext`, visible focus rings, auto-hide suspended while chrome has focus, `aria-live=polite` announcer, focus-trapped settings popover, `Esc` order = menu → fullscreen.

Sources: YouTube & Netflix help-center shortcut docs · Vimeo player shortcut doc · Apple TV playback-controls guide · Video.js blog on control hiding · Plyr README/controls docs · Vidstack default-layout docs · W3C WAI media-player guidance.
