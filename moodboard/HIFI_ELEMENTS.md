# NUX — Hi-Fi Element Patterns

Element-level reference for the hi-fi pass. Complements `MOBBIN_COMPONENTS.md` —
nothing from there is repeated; cross-references appear as "see MOBBIN_COMPONENTS §x.x".
Platforms: iPhone / iPad / desktop web / tvOS. Theme: `#0D0C0B` bg + `#C8922A` amber.
Surfaces used in specs: `#1A1917` (raised), `#2E2B27` (border), text `#F5EFE2` / `#B5AFA4` / `#8A857C`.

---

## 1. tvOS FOCUS UI

Mobbin has no tvOS section — references are Apple HIG + engineering teardowns.

| App | Notes | Link |
|-----|-------|------|
| Apple HIG (tvOS) | Focus = the core mechanic: no cursor, no ring. Focused item scales up, lifts with shadow, gets parallax tilt + specular sheen on Siri Remote micro-swipes. 5 states: Unfocused / Focused / Highlighted (press flash) / Selected / Disabled | [view](https://developer.apple.com/design/human-interface-guidelines/designing-for-tvos) |
| devsign — custom focus effects | Teardown of system values: scale ≈ 1.05–1.10×, drop shadow grows with "lift", motion parallax ±2–4° tilt | [view](https://devsign.co/notes/custom-focus-effects-in-tvos) |
| Brightec — focus engine | Why you should NOT hand-roll focus: system applies size increase + shadow elevation automatically via `UIImageView.adjustsImageWhenAncestorFocused` | [view](https://www.brightec.co.uk/blog/tvos-focus-engine) |
| Oxagile — focus best practices | Recommends 1.05–1.1× scale, brightness/border only as secondary cue; never move focus programmatically | [view](https://www.oxagile.com/article/tvos-focus-engine-best-practices/) |
| ediblecode — TV keyboards survey | State of TV on-screen keyboards: tvOS linear single-row A–Z vs Netflix 6×7 alphabetical grid (square grid ≈ 4.23 presses/char vs 4.89 for wide grid) | [view](https://ediblecode.com/blog/tv-keyboards/) |
| MacRumors — tvOS keyboard setting | tvOS offers Linear (default) and Grid layouts in Settings → General → Keyboard Layout | [view](https://www.macrumors.com/2025/06/02/change-apple-tv-keyboard-layout/) |

**NUX spec — focused card:** rely on the system effect, don't fight it: scale **1.08×**, shadow `0 20px 40px rgba(0,0,0,0.5)`, system parallax + sheen on the poster image. **No amber ring** (amber is reserved for *selected*, not *focused* — e.g. active tab underline 3pt). Card title outside the image stays put; only the image lifts. Reserve **min 100pt vertical / 40pt horizontal** gutters so the scaled card never overlaps neighbors (per HIG grid spec: 2-col = 860pt unfocused width, up to 9 cols). Safe zone: 60pt top/bottom, 80pt left/right.

**NUX spec — focused text button:** unfocused = `#1A1917` fill, text `#F5EFE2`; focused = inverted: fill `#F5EFE2`, text `#0D0C0B`, scale 1.06×, same shadow. Highlighted (press) = 80ms dip to 0.97×. tvOS type: buttons 38pt Headline, row labels 31pt Callout, body 29pt.

**NUX spec — TV hero / Top Shelf:** full-bleed edge-to-edge still with bottom gradient `rgba(13,12,11,0) → 92%`; title lockup left-anchored inside safe zone; Play + More Info buttons get first focus. Top Shelf: Carousel Details layout; static fallback 2320×720pt; sectioned-row 2:3 poster 404×608pt (focused-safe 380×570, unfocused 333×570).

**NUX spec — TV search keyboard:** follow the **system linear single-row A–Z** keyboard pinned top (free dictation/Siri voice included), results grid below it — do NOT rebuild Netflix's left-side 6×7 grid (efficient but nonstandard; loses system dictation). Recent searches render as the default grid before typing.

---

## 2. VIDEO PLAYER — MOBILE

| App | Notes | Link |
|-----|-------|------|
| Netflix | Full control set, landscape: title "S4:E1 …" top-center, center cluster ↺10 / ⏸ / ↻10, bottom utility row **Speed (1x) · Lock · Episodes · Audio & Subtitles · Next Ep.**, red scrubber + remaining time, AirPlay top-right | [view](https://mobbin.com/screens/b1f2670c-5b85-416c-aec3-368bbc58c2fb) |
| Netflix | Scrub-drag state: all controls hide, large thumbnail preview + timestamp rides above the thumb; brightness slider visible left edge | [view](https://mobbin.com/screens/0f152aed-a871-416c-aee2-19dea1f6c742) |
| Netflix | Playback-speed control: discrete slider 0.5× / 0.75× / 1× (Normal) / 1.25× / 1.5× in a side panel | [view](https://mobbin.com/screens/0d84896c-c1dd-4a0b-aad5-3e948cd7163b) |
| Netflix | Double-tap skip: ±10 ripple arcs over the video, minimal scrubber visible (preview context) | [view](https://mobbin.com/screens/deb11185-e87c-4fdc-86da-b59cc65725e3) |
| Netflix | Buffering: center spinner replaces play/pause; scrub preview still live | [view](https://mobbin.com/screens/0e09a469-ca3b-489e-82e2-257eafefa88f) |
| Netflix | Reaction variant: thumbs (rate) stack on the right edge for some titles | [view](https://mobbin.com/screens/88899a64-54d0-47c3-a71b-ef614b37bdc3) |

Web player bar refs (Hulu/Disney+ minimal bottom bar): see MOBBIN_COMPONENTS §14. Next-episode end card: §15. Audio/subtitle panel: §1.2.

**NUX spec:** 3-layer layout — (1) top bar: ✕ close left, title 15px center ("S1:E4 · Episode name"), AirPlay/cast right; (2) center cluster: ↺10 and ↻10 at 44pt glyphs, play/pause 56pt; (3) bottom: scrubber **4px track** (`rgba(245,239,226,0.25)`), **amber fill**, 14px thumb growing to 20px on drag, remaining time right in 13px tabular numerals, then utility row of 5 text+icon items 13px (Speed · Lock · Chapters · Audio & Subtitles · Next). Gestures: double-tap halves = ±10s with ripple arc + "10" label; vertical drag left = brightness, right = volume (thin 2px vertical sliders fade in at the edge); show a one-time gesture hint overlay on first playback. **Lock** replaces everything with a single lock glyph + time until tapped twice. Scrub preview thumbnail **168×95** with timestamp, 8px above the bar. Controls auto-hide after 3s; tap = toggle. Settings entry = "Audio & Subtitles" + "Speed" inline (no buried gear).

---

## 3. VIDEO PLAYER — 10-FOOT / tvOS

| App | Notes | Link |
|-----|-------|------|
| Apple — Customizing tvOS playback | The redesigned system player: transport bar bottom with title above it, press-then-swipe scrubbing with thumbnail, swipe-down **Info panel with tabs (Info / Chapters / Audio / Subtitles)** — chapters as a thumbnail row | [view](https://developer.apple.com/documentation/avkit/customizing-the-tvos-playback-experience) |
| David Cordero — Skip Intro on tvOS | How Netflix-style "Skip Intro" works in tvOS: modal overlay view controller on top of the player; the pill takes focus while visible | [view](https://dcordero.me/posts/how_to_implement_a_skip_intro_button_in_tvOS.html) |
| Matthijs Langendijk — Netflix TV UI teardown | Netflix's TV player/browse rebuild: bottom transport area, overlays kept to one zone at a time | [view](https://mlangendijk.medium.com/breaking-down-the-new-netflix-tv-ui-d651aff8bbee) |
| BasThomas — tvOS guidelines summary | Playback rules: avoid persistent logo overlays; interactive overlays appear with ≥0.5s delay; content is king | [view](https://github.com/BasThomas/tvOS-guidelines) |

**NUX spec:** adopt the **system player anatomy** (don't reinvent): transport bar inset 80pt l/r + 60pt bottom; **6px track**, amber fill, scrub thumbnail **320×180** above the playhead; title (38pt Headline) + dot-meta line (25pt Caption, `#B5AFA4`) sit above the bar-left; time remaining right. Swipe **down** = info overlay panel with tabs **Info · Chapters · Audio · Subtitles** — chapters as 268×150 thumbnail cards with chapter title + start time (key for NUX documentaries/courses). **Skip Intro / Skip Recap**: pill bottom-right, 80pt above the transport zone, appears ≥0.5s after the intro starts, auto-focused while visible, disappears on intro end — never covers subtitles. During playback gestures control content, never show card focus effects. "Next lesson/episode" card: bottom-right inset 480×270 in the final 20s — user must click (no forced countdown, consistent with MOBBIN_COMPONENTS §15 anti-dark-pattern stance).

---

## 4. CONTINUE WATCHING CARDS

Course-flavored refs (MasterClass/Udemy resume): see MOBBIN_COMPONENTS §16.

| App | Notes | Link |
|-----|-------|------|
| Disney+ | Card anatomy: 16:9 thumb, center ▶ glyph, progress bar bottom edge of image, meta "43m remaining" + title + rating chip "NC16 · S1:E4 …", ⋮ overflow right of meta | [view](https://mobbin.com/screens/19bc083e-19c2-41a3-b2eb-19f571c5b0ae) |
| Disney+ | "Remove from Continue Watching?" confirm — explicitly says watch progress is kept | [view](https://mobbin.com/screens/19bc083e-19c2-41a3-b2eb-19f571c5b0ae) |
| HBO Max | Long-press/⋮ bottom sheet: episode synopsis on top, then ✕ Remove / ▶ Resume S4 E22 / ↻ Restart / ⓘ More Info | [view](https://mobbin.com/screens/6dab1c60-5243-4a46-b626-05f050fa617b) |
| Netflix | Detail-page resume: red progress bar + "31m remaining" inline under the episode thumb; primary CTA flips Play → **Resume** | [view](https://mobbin.com/screens/936c4d0d-6931-4570-9f34-f7036a472244) |
| Peacock | Hero-card resume variant: "WATCH S1 E1" pill directly on the card + meta row under badge | [view](https://mobbin.com/screens/1fa8bcf7-b0c3-447f-9d6b-8c535e2d556a) |

**NUX spec:** landscape 16:9 card (mobile 240×135, web 320×180, TV 460×260). Progress bar **on the image bottom edge**: 3px amber fill on `rgba(245,239,226,0.2)` track, full card width, square ends. Below image: line 1 = title 15px `#F5EFE2`; line 2 = meta 12px `#8A857C` — films: "47 min left"; series: "S1:E4 · 43m left"; courses: "Lesson 6 of 24 · 12m left"; games: "Last played 2d ago". Center ▶ glyph 40px at 90% white appears on hover/focus (always visible on touch). ⋮ overflow (44pt target) → sheet: Resume / Restart / Details / Remove from row — removal confirm copy promises progress is kept (Disney+ wording). CTA flips Play→Resume everywhere the title appears.

---

## 5. GENRE / TASTE ONBOARDING PICKER

Poster-grid + chip baseline refs (Netflix "Pick 3", Hulu interest cards, Suno chips, Paramount+ radios): see MOBBIN_COMPONENTS §11.

| App | Notes | Link |
|-----|-------|------|
| HBO Max | "Pick Movies You're Interested In" — 2-col poster grid, white ✓ circle top-right when selected vs ＋ when not, 3-step progress dots top, sticky **Done** | [view](https://mobbin.com/screens/5277cbd6-59ef-46cb-b13d-b3dee463ceb0) |
| pliability | Image interest cards: ✓ / ＋ circle pinned bottom-right of each card, selected card brightens, **Skip top-right**, linear progress bar top, Continue pill bottom | [view](https://mobbin.com/screens/f1f8c18b-018a-43ca-8ff5-5ed6756eb933) |
| Uber Eats | "Select 3 that you're looking for" — selected get 2px border; once 3 picked the rest **dim to 40%**; Continue + Skip stacked | [view](https://mobbin.com/screens/c8cc7aac-e5ad-4a2f-b5ab-638cc34ddaac) |
| Blinkist | Outlined category rows + "STEP 3 OF 4" eyebrow — list-style alternative to grids | [view](https://mobbin.com/screens/59214bad-15cb-4152-ae61-19e8ae819585) |

**NUX spec:** two steps — (1) genre **chips** (fast): 40px pill, 1px `#2E2B27` border, selected = amber border + amber text + subtle `rgba(200,146,42,0.12)` fill, spring scale 1.0→1.05→1.0 on tap; (2) **title cards** (taste): 2:3 posters, 12px radius, unselected shows ＋ 28px circle bottom-right, selected = ✓ 28px amber circle + 2px amber inset ring + image brightens 1.1×; pressed-state scale 0.97. **Gating:** sticky bottom CTA disabled until 3 picks, label counts up — "Pick 3 to continue (1/3)" → "Continue". **Skip** = ghost text button top-right on every step (taste is optional, auth is not). Step indicator: thin progress bar top (2px amber) not dots. tvOS variant: same grid, focus = system scale, select toggles the ✓.

---

## 6. AUTH ON DARK

| App | Notes | Link |
|-----|-------|------|
| Netflix | Sign-in step 1: single field "Email address or mobile number" — dark filled input, 1px border, red Continue full-width, "Get help ∨" + reCAPTCHA footnote | [view](https://mobbin.com/screens/fba27ddb-fd90-4b1e-8270-77f286001914) |
| alias | Dark form: **floating label inside the field** (small grey label above value), "SHOW" text toggle as password reveal, full-width dark Sign In | [view](https://mobbin.com/screens/816943bb-3658-4c0a-9a3c-3a51beede219) |
| Revolut Business | Welcome back: filled dark field + clear ✕, **white primary Continue**, "or" divider, dark Google/Apple SSO buttons with white logos | [view](https://mobbin.com/screens/47f12910-a6c4-4fd1-8e52-70f719cc4eae) |
| yope | Black bg: "continue with Apple" as the hero **white pill** (Apple's dark-mode guideline), secondary providers as small icon-only dark squares | [view](https://mobbin.com/screens/748b33d7-4b6a-469a-9c85-3ead2c4a9d4b) |
| Paramount+ (web) | TV pairing: "Enter the activation code for your Android TV" — 5 underlined digit slots, device illustration, single ACTIVATE button | [view](https://mobbin.com/screens/6aad85b9-86a5-46b3-8015-dadfa1070500) |
| Disney+ (web) | One-time code modal: 6 boxed cells, Continue + Cancel, "Didn't receive the email? Resend" | [view](https://mobbin.com/screens/c11464af-6348-4ec6-a03d-b473ff9db2e8) |
| WhatsApp (web) | Reverse pairing ("enter code on phone"): segmented code `HD5R-5GTL` + numbered 1-2-3-4 steps — the clearest instruction pattern | [view](https://mobbin.com/screens/8c4e0167-8661-474e-ad04-9a45d71fe93e) |

**NUX spec — fields:** 56px height, fill `#1A1917`, radius 10, border 1px `#2E2B27` → **amber on focus** (1.5px); floating label 12px `#8A857C` over 16px value; password reveal = eye icon 24px right (icon beats alias's "SHOW" text for i18n). Error: border `#E5484D`, 13px message below the field, never placeholder-only. **SSO:** "Continue with Apple" white pill 50px, black  logo + 16px medium text (Apple dark-bg rule), Google below in `#1A1917` with white logo; "or" hairline divider between SSO and email. Primary CTA: amber fill, `#0D0C0B` text. **TV pairing (NUX tvOS sign-in):** TV shows `nux.com/link` + 6-char code in 57pt Title2 monospaced, regenerating every 15 min; phone/web page = 6 boxed cells 64×76 (desktop) / underline slots (mobile), auto-advance, paste-aware, auto-submit on 6th char; success → TV updates instantly with profile confirmation. Numbered steps under the code, WhatsApp-style.

---

## 7. SETTINGS / PROFILE ON STREAMING APPS

Generic settings layout + theme picker: see MOBBIN_COMPONENTS §17. Profile-switcher grids ("Who's watching"): §3.

| App | Notes | Link |
|-----|-------|------|
| Disney+ | Account screen: eyebrow section labels (SUBSCRIPTION / ACCESS & SECURITY / SETTINGS), **plan row "Disney+ Premium"** with chevron + upgrade note, **Manage Devices** row, "Restrict profile creation" toggle, dimmed Delete account | [view](https://mobbin.com/screens/f4ae144d-967d-4527-86a3-110fd67236f8) |
| HBO Max | Profile hub: avatar strip top (adult with **lock badge**, "kids" profile, grey ＋ New) + Manage Profiles button, then grouped card rows: App Settings / Account / Subscription / Privacy / Help ↗ / Sign Out, version footer | [view](https://mobbin.com/screens/27a6f871-457a-4b63-a832-606267089c87) |
| Paramount+ | Profile tab: centered avatar + "Switch Profile", flat list with **Downloads + blue dot**, Account, Parental Controls, Legal, Support, Settings, Redeem Offer, Sign Out | [view](https://mobbin.com/screens/12d27be5-cbb2-47f0-ad6a-cca4f13a092f) |
| Tesla | Dark grouped list with leading icons + chevrons, single inline toggle row with sub-caption, "Sign Out" as centered text link | [view](https://mobbin.com/screens/dc893a56-d375-4366-93ec-fa021a882b15) |
| Blinkist | Subscription group: plan value right-aligned in row ("Pro trial"), red "Cancel free trial" text row + explanation caption below | [view](https://mobbin.com/screens/c587821a-efeb-435f-b1d0-d0c4c66752f3) |

**NUX spec:** profile tab = avatar 72px + name + "Switch profile" text link, then grouped cards (radius 12, fill `#1A1917`, 1px `#2E2B27`): rows 56px, 15px label, leading 20px icon `#B5AFA4`, trailing chevron or value. Eyebrow group labels **11px caps, letter-spacing 0.08em, `#8A857C`**. **Plan row:** "NUX Premium" + sub-caption "Renews 12 Jul · €11.99/mo", chevron → plan screen with change/cancel (cancel = plain row, never hidden). **Devices:** row per device — icon (tv/phone/laptop), name, "Last active 2h ago" caption, swipe/“Sign out” per row + "Sign out all" red text row. **Kids profiles:** avatar grid 96px circles 2-col, amber ring on active, 20px lock badge bottom-right for PIN profiles, "Add Kid" creates profile with content-rating cap selector (HBO Max split-CTA model, see §3 there). Destructive rows: `#E5484D` text, confirmation per MOBBIN_COMPONENTS §1.4.

---

## 8. DOWNLOADS

| App | Notes | Link |
|-----|-------|------|
| Disney+ | Downloads tab: series row "377.9 MB • 1 Episode" + chevron; downloading item shows **progress ring** in place of the action icon + PG chip + 1h 53m; Edit top-right | [view](https://mobbin.com/screens/a97b9c3f-044e-4dba-85ca-1bedb89f5b9f) |
| Netflix | Per-episode rows: "51m \| 187.7 MB", ✓-in-box = downloaded, dashed circle = queued/downloading, pencil = edit mode | [view](https://mobbin.com/screens/d9b4bf64-762f-4c2f-9087-37e6a501debf) |
| Netflix | Downloads empty state: circled glyph + "Never be without Netflix" + body + "See What You Can Download" CTA | [view](https://mobbin.com/screens/9a07d24f-0b27-4602-8ac4-a3ce9d42a630) |
| Xbox | **Storage meter**: "211GB free of 364GB" thin bar under console name; installed list sortable by SIZE with per-item GB | [view](https://mobbin.com/screens/eebca4f9-9b75-4da6-9272-4c995eed8b48) |
| Paramount+ | Per-profile downloads (avatar header) + "Browse Available Videos ⤓" inline empty CTA below existing items | [view](https://mobbin.com/screens/239504c7-2b8a-44a5-bc34-84af2c957765) |

**NUX spec — item anatomy:** row 88px: thumb 132×74 (16:9, radius 8) → title 15px → meta 13px `#8A857C` "1.2 GB · 52 min · Expires in 13 days" (expiry turns `#E5484D` under 48h) → trailing state icon 28px: ⤓ (available) / **progress ring 3px amber stroke on `#2E2B27` track** (downloading, % inside on tap) / ✓ (done) / ⏸ (paused — tap to resume). Series collapse to one row "5 episodes · 2.1 GB" + chevron. **Storage meter** pinned bottom: 4px bar — used `#3A362F` / NUX downloads **amber** / free track — caption "12.4 GB used by NUX · 96 GB free". **Smart Downloads** toggle row top ("Auto-download next lesson/episode, delete watched") with 12px footnote, OFF by default (consistent with NUX anti-dark-pattern autoplay stance, MOBBIN_COMPONENTS §17). **Edit mode:** "Edit" top-right → checkboxes slide in left, bottom bar "Delete (3) · 2.8 GB"; swipe-to-delete also works per row. Quality picker (Standard/High) via small dropdown — MOBBIN_COMPONENTS §2.2.

---

## 9. SEARCH — ACTIVE STATE

Typeahead/entity suggestions + results-page chips: see MOBBIN_COMPONENTS §12. No-results layout baseline: §4.

| App | Notes | Link |
|-----|-------|------|
| Disney+ | Idle state: field "Search by title, character, or genre", then **Popular Searches** + **Trending Searches** poster rows + Explore/Collections — browse content before any typing | [view](https://mobbin.com/screens/daaf40cd-c990-44a2-95b3-d71f56866f6b) |
| Disney+ | Instant results: 2-col grid after a few characters — poster + title + "NC16 · 2023 • Drama" meta line, ✕ clear in field | [view](https://mobbin.com/screens/2c1e59cd-250b-44ad-8de0-1991199685d5) |
| Pinterest | Recent searches: thumbnail + query text + ✕ remove per row, Cancel beside field, mic in field | [view](https://mobbin.com/screens/acebe484-7baa-4ace-9c68-f5de9d01544e) |
| Apple Photos | Voice search entry: mic button in the field expands to a live waveform strip while listening | [view](https://mobbin.com/screens/67df3f5f-13cc-42da-b38d-88663c9a3d15) |
| Apple Store | "Recently Viewed" cards + "Try Searching" plain-text suggestion rows with magnifier icons — two-tier idle panel | [view](https://mobbin.com/screens/d798a4d3-8f8e-4c28-8685-93aadc523a8c) |

**NUX spec:** field 44px `#1A1917`, radius 10, magnifier left, **mic right** (mobile/TV; expands to waveform while dictating), ✕ clear when text. **Idle panel:** (1) "Recent" — text rows 44px with small 40×56 poster thumb if entity + ✕ per row + "Clear all"; (2) "Trending on NUX" — editorial: numbered 01–10 list, 64×96 thumbs, dot-meta line (ties to the Top-10 numerals pattern, MOBBIN_COMPONENTS §9). **Live results:** fire after 2 chars, 250ms debounce, grid replaces panel in-place (no page nav); each cell = poster + title + meta "Film · 2023 · Drama"; first row reserved for people/collections entity matches (MasterClass model §12). Keep typed query in the field. **No results:** "No matches for 'tarkvsky'" 17px + "Did you mean *Tarkovsky*?" amber link + Trending row re-shown below — never a dead end. tvOS: linear keyboard top (see §1), recents grid as default content, voice via Siri button.

---

## 10. GAME & COURSE DETAIL — DIFFERENTIATION

Film detail baseline (hero, meta strip, tabs): see MOBBIN_COMPONENTS §10. Course rows/cards: §7, §16.

| App | Notes | Link |
|-----|-------|------|
| Xbox | Game detail: box art + studio, GAME PASS badge, green LAUNCH CTA, **ESRB block** ("EVERYONE" + descriptors "Users Interact, In-Game Purchases"), Details / Capabilities tabs | [view](https://mobbin.com/screens/ff4ca3bf-a3e5-441b-b6b6-fc925af73e69) |
| Xbox | Capabilities tab: **"Playable on" platform chips** (Series X\|S · One · PC · Cloud, each with device glyph), **Size chips per platform** (151GB / 148GB), capability chips (Online co-op 2–6 · 4K Ultra HD · HDR10 · cross-platform) | [view](https://mobbin.com/screens/efbbb7c3-5e2d-4b52-8e8e-825fb916f1d3) |
| Xbox | Achievements: per-game row "G 240/2750 · 🏆 18 · 9%" + hairline progress bar — compact play-history meter | [view](https://mobbin.com/screens/feeded9a-9e67-48fc-a690-771f8b0bd952) |
| MasterClass | Class facts grid: Length "6 Sections" / Outcome (hand-drawn red circle) / Structure "Hands-on Curriculum" / Difficulty "All Levels" + numbered curriculum accordion below | [view](https://mobbin.com/screens/f740077c-9cac-413e-85f8-0438ca7467ce) |
| MasterClass | "Get to know your instructor": full-bleed portrait + huge display-type name + 4-line bio — the editorial instructor block | [view](https://mobbin.com/screens/e9300b28-29e1-4aa7-8e8f-2616b9ad7f03) |
| MasterClass | Card meta overlay "26 lessons • 5h 41m" + instructor name / course subtitle below the thumb | [view](https://mobbin.com/screens/f1d860c4-82c2-40b9-aede-4af8afbc7fbe) |
| Coursera | "Course 1 of 7 · 8% complete" + green progress bar + **Resume** + next-item inline; player sidebar = lesson list with type icon (Video/Reading) + duration + green checks | [view](https://mobbin.com/screens/f91726c7-28d7-4144-8957-35666b76edf4) |

**NUX spec — shared skeleton, swapped middle band.** All detail pages keep hero + meta row + CTA + synopsis. Then:

- **GAME detail inserts:** (1) **PlatformChip row** — outlined chips 28px, glyph + label (tvOS · iPad · Controller supported); (2) facts strip 3-col: "~18 h to beat" / age-rating block (PEGI/ESRB icon + 2 descriptors, Xbox style) / "Offline play ✓"; (3) achievements meter row if started: "12/40 · 30%" + hairline bar; (4) screenshots/trailer gallery row 16:9. CTA = "Play" (amber) — never "Watch".
- **COURSE detail inserts:** (1) **CourseFactsGrid** 2×2: "24 lessons · 5h 41m" / Level / Outcome / Materials; (2) **InstructorBlock**: 4:5 portrait, eyebrow "YOUR INSTRUCTOR" 11px caps, display-serif name, 2-line bio, chevron to instructor page; (3) **LessonRow list** (numbered): 64px row = "07" numeral 15px `#8A857C` + lesson title 15px + duration 13px + trailing state (✓ amber = done, ▶ = current with 2px progress underline, lock = paywalled), grouped into chapters with accordion headers; (4) progress summary above the list: "8% complete · Lesson 2 of 24" + amber bar + **Resume lesson** CTA. CTA = "Start course" → "Resume".
- Film keeps cast/crew row; never show lesson lists or platform chips there. Type badge in the hero meta row tells users which schema they're in (see §11).

---

## 11. BADGES & METADATA ROWS

Disney+ format-chip system baseline: see MOBBIN_COMPONENTS §10.

| App | Notes | Link |
|-----|-------|------|
| Netflix | Detail meta row: "2025 · [TV-MA] · 7 Seasons · [HD] · [AD] · [CC]" — rating + quality as tiny outlined/filled boxes inline with plain-text meta | [view](https://mobbin.com/screens/be073e16-40a7-4470-a407-55d0843ce001) |
| Disney+ (web) | Hero lockup: badge row [PG13][HD][CC][AD] directly under title, then "2023 – 2025 • 2 Seasons • Action and Adventure, Fantasy" as a separate dot row | [view](https://mobbin.com/screens/5fcbb0f5-4c27-47c1-ae35-d627c8d8a767) |
| Disney+ | Search-result cell meta: "NC16" filled chip + "2023 • Drama" — chip + dot-row compressed to one line | [view](https://mobbin.com/screens/2c1e59cd-250b-44ad-8de0-1991199685d5) |
| Xbox | Capability chips as wrapping cloud: filled `#2E2B27`-style pills, 1 line of 11px text each (4K Ultra HD / HDR10 / Smart Delivery) | [view](https://mobbin.com/screens/efbbb7c3-5e2d-4b52-8e8e-825fb916f1d3) |
| Peacock | Card meta under hero: "81% · Comedy-Drama · 1 Season" with leading rating dot icon — compact dot row on artwork | [view](https://mobbin.com/screens/1fa8bcf7-b0c3-447f-9d6b-8c535e2d556a) |

**NUX spec — 3 badge tiers:**
1. **TypeBadge** (Film / Doc / Game / Course): filled `rgba(200,146,42,0.15)`, amber text, 10px caps, ls 0.1em, radius 4, 4×8px padding — the only colored badge; appears on cards top-left and in hero meta.
2. **RatingBadge** (PG-13 / 16+ / PEGI): filled `#2E2B27`, `#F5EFE2` text 11px medium, radius 3 — always first in the meta row.
3. **QualityBadge** (4K · HDR · DV · ATMOS · CC · AD): **outlined 1px `#3A362F`**, text `#8A857C` 10px caps ls 0.08em, radius 3 — hero + Details tab only, never on cards.

**DotMetaRow:** 13px `#B5AFA4`, separator "·" with 6px gaps, order fixed: `year · runtime/seasons/lessons · genre, genre` (max 2 genres, truncate with ellipsis); on TV bump to 25pt Caption. Tiny-caps eyebrow labels (CURATED BY, YOUR INSTRUCTOR): 11px/0.08em `#8A857C`. Numerals in meta always tabular lining.

---

## 12. EMPTY / EDGE STATES ON DARK

Generic empty-state pattern (icon + heading + CTA): see MOBBIN_COMPONENTS §4. Skeletons: §6.

| App | Notes | Link |
|-----|-------|------|
| Peacock | **Typographic empty state**: giant download glyph + huge 4-line display text "To download and watch offline, upgrade to Premium Plus" — editorial, no illustration | [view](https://mobbin.com/screens/28d04929-2ec0-4d08-a3d9-f64d001e1153) |
| Disney+ | Downloads empty: 120px outlined circle + glyph, "You have no downloads" heading + 2-line caption — quiet icon-only norm | [view](https://mobbin.com/screens/c438c06c-36d1-4421-8b9e-1d57fa387579) |
| HBO Max | "No Saved Downloads" + instruction with the **icon inline in the sentence** ("Tap ⤓ to download…") — teaches the gesture | [view](https://mobbin.com/screens/d59a9e6a-9028-45ac-83dd-d6f1bfe3f5e1) |
| Netflix | Empty + CTA variant: "Never be without Netflix" + "See What You Can Download" button — converts the dead end into browse | [view](https://mobbin.com/screens/9a07d24f-0b27-4602-8ac4-a3ce9d42a630) |
| TIDE | **OFFLINE MODE** label top-center (accent color) + content narrowed to a "Downloads" pill; unavailable features dimmed in place | [view](https://mobbin.com/screens/ac5e224f-6d2c-48c7-ab87-9e5fdaee6c8e) |

**NUX spec:** dark editorial norm = **no illustrations** — glyph or pure type. Three variants:
1. **Quiet** (empty list/My List/downloads): 64px glyph in 120px circle, 1.5px `#2E2B27` outline, heading 17px `#F5EFE2`, body 14px `#8A857C` max 2 lines, optional ghost CTA "Browse films" — centered, 64px below nav.
2. **Typographic** (first-run/upsell empties): Peacock-style — oversized glyph cropped at edge + 28px/34 display text in `#F5EFE2`, amber on the key phrase; no box, no circle.
3. **Offline**: persistent 32px top banner `#1A1917` "You're offline — showing downloads" with 8px amber dot, app auto-routes to Downloads; unavailable rows stay visible at 40% opacity (don't vanish content); retry = pull-to-refresh + "Try again" text button. No-results state: see §9 spec (suggestion + trending, never dead-end).
Loading order stays skeleton → content (§6); error toast pattern: §5.2.

---

## COMPONENT DELTA LIST — new components/variants the wireframe DS needs for hi-fi

**Player**
1. `PlayerScrubber` — 4px track / amber fill / 14→20px thumb, thumbnail preview 168×95 (mobile) · 320×180 (TV), chapter tick marks.
2. `PlayerControlBar.mobile` — top bar + center ±10/play cluster + utility text row (Speed · Lock · Chapters · Audio & Subs · Next).
3. `TVTransportBar` — 6px bar, title+meta lockup above-left, time right, 80/60pt safe-zone insets.
4. `TVInfoPanel` — swipe-down overlay, tabs Info · Chapters · Audio · Subtitles; chapter cards 268×150.
5. `SkipPill` — "Skip intro / recap" bottom-right pill, ≥0.5s delayed entry, auto-focus on TV.
6. `NextUpCard` — end-card inset (episode/lesson), user-click only, 480×270 on TV.
7. `GestureHintOverlay` — one-time double-tap/brightness/volume coach marks.
8. `LockButton` state — player variant that strips UI to lock glyph + time.
9. `SpeedSlider` — discrete 0.5–1.5× stepped slider panel.

**Cards & rows**
10. `ContinueCard` — 16:9 card + edge progress bar (3px amber) + media-aware meta line + ⋮ sheet (Resume/Restart/Details/Remove).
11. `EpisodeRow` — thumb 132×74 + number+title + duration + per-row ⤓/✓, season selector + "Download All" header.
12. `LessonRow` — numeral + title + duration + state (✓ done / ▶ current+progress / 🔒 locked), chapter accordion headers.
13. `FocusCard.tvos` — poster card with 5 focus states (1.08× scale, shadow, parallax), unfocused/focused asset pair.

**Onboarding**
14. `TastePickCard` — 2:3 poster with ＋/✓ 28px circle, amber inset ring selected state.
15. `GenreChip.selectable` — 40px pill, amber border+tint selected, spring tap animation.
16. `SelectionCounterCTA` — sticky disabled-until-N button: "Pick 3 to continue (1/3)".

**Auth**
17. `TextField.dark` — 56px filled field, floating label, amber focus border, error state, password-reveal eye.
18. `SSOButton` — Apple (white pill) + Google (dark) 50px variants per provider guidelines.
19. `CodePairingField` — 6-cell OTP boxes (64×76 desktop / underline mobile), auto-advance + paste, with TV-side code lockup (57pt mono).

**Settings / profile**
20. `SettingsRow` variants — plan row (value+renewal caption), device row (icon+last-active+sign-out), toggle row with footnote, destructive row.
21. `ProfileAvatarGrid` — 96px circles, amber active ring, 20px lock badge, "Add Kid/Adult" ghost tiles.

**Downloads**
22. `DownloadRow` — thumb + "1.2 GB · 52 min · Expires in 13 days" meta + trailing state icon, edit-mode checkbox slide-in.
23. `DownloadProgressRing` — 28px, 3px amber stroke, pause/resume tap states.
24. `StorageMeter` — 4px segmented bar (other / NUX / free) + caption.

**Search**
25. `SearchIdlePanel` — Recent rows (+ ✕ clear) + numbered "Trending on NUX" list with thumbs.
26. `VoiceSearchButton` — mic-in-field that expands to waveform while listening.
27. `TVKeyboard` — system linear A–Z row layout adoption (spec, not custom build).

**Detail-page blocks**
28. `PlatformChip` — outlined 28px chip with device glyph (game pages).
29. `GameFactsStrip` — time-to-beat / age-rating block (icon + descriptors) / offline-play.
30. `AchievementMeter` — "12/40 · 30%" + hairline progress bar.
31. `CourseFactsGrid` — 2×2 facts (lessons+runtime / level / outcome / materials).
32. `InstructorBlock` — 4:5 portrait + eyebrow + display name + bio + chevron.
33. `CourseProgressSummary` — "% complete · Lesson x of y" + amber bar + Resume CTA.

**System**
34. `TypeBadge` / `RatingBadge` / `QualityBadge` — the 3-tier badge set (amber-tint / filled / outlined).
35. `DotMetaRow` — fixed-order year·runtime·genre row, 13px mobile / 25pt TV, tabular numerals.
36. `EmptyState` — variants: quiet (circle glyph), typographic (display text), offline (banner + dimmed content).
37. `OfflineBanner` — persistent 32px bar with amber dot + auto-route-to-downloads behavior.
