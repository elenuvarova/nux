# Mobbin UI Research Notes for NUX

Researched June 9, 2026. Screenshots captured from Mobbin (logged-in session).

---

## Screenshots in This Folder

| File | Source | What it shows |
|---|---|---|
| `mobbin-home.png` | Mobbin discover page | Mobbin homepage — Categories, Screens, UI Elements, Flows nav |
| `mobbin-netflix-onboarding-flow.png` | Netflix iOS Onboarding Flow | Splash → feature carousel → SIGN IN CTA |
| `mobbin-onboarding-detail-1.png` | Netflix Android Onboarding Flow | Full multi-step onboarding screens |
| `mobbin-netflix.png` | Netflix iOS Homepage screen | Personalized home: "For JudyS." — hero + row carousels + bottom tab bar |
| `mobbin-netflix-home-flow.png` | Netflix Web Home Flow | Web layout: hero feature + multi-row catalogue grid |
| `mobbin-streaming-detail-2.png` | HBO Max Web Onboarding Flow | Feature landing → plan selection → ad-tier choice |
| `mobbin-player.png` | HBO Max Web "Watching a show" flow | Show detail page + video player screen side-by-side |
| `mobbin-spotify-onboarding.png` | Spotify iOS Onboarding Flow | Splash → sign-up options → email form (dark UI) |
| `mobbin-spotify-playlist.png` | Spotify iOS Playlist detail Flow | Browse grid (Mood/Hits) → playlist landing → tracklist |
| `mobbin-spotify-library.png` | Spotify Web Collapsing library Flow | Full web layout: left nav sidebar + main grid + mini-player bar |
| `mobbin-spotify-player.png` | Spotify iOS Music Player screen | Full-screen player: album art + scrubber + transport controls + Lyrics pill |
| `mobbin-streaming.png` | Mobbin 404 (search URL wrong) | Shows Mobbin's navigation chrome — useful for seeing search bar |
| `mobbin-dark.png` | Mobbin 404 (search URL wrong) | Same — Mobbin nav chrome |

---

## Most Relevant Patterns for NUX

### 1. Personalized Home Screen (Netflix iOS)
**File:** `mobbin-netflix.png`

Netflix's iOS home screen is the gold standard for personalised streaming home:
- Header shows the user's profile name ("For JudyS.") making personalisation immediate and explicit
- Top navigation tabs: Series | Films | Categories — flat tab bar, not icons, text-only
- Hero/featured content fills 60–70% of the viewport with title treatment, genre tags (Slick · Psychological · Thriller), and two CTAs: "Play" (primary, filled) + "My List" (secondary, outlined)
- Below the hero: horizontally scrolling labelled rows ("Series", "Continue Watching", "Top 10", etc.)
- Bottom tab bar: Home | Hot & New | Downloads | More — 4 items, icon + label

**NUX implication:** The hero + labelled horizontal rows pattern is the right approach for NUX's home screen. The personalisation header ("For [username]") is worth implementing. The category filter tabs at the top (Series/Films/Categories) map to NUX's content types.

---

### 2. Netflix Onboarding (iOS)
**File:** `mobbin-netflix-onboarding-flow.png`

- Pure black screens throughout — no grey backgrounds, no softening
- Splash: just the N logo on black, silent, 1–2 seconds
- Feature carousel: 3–4 slides, each with an illustration (not screenshots) + bold white headline + subtitle
  - "Watch on any device" — illustration of screens
  - "Download and go" — illustration of phone + checkmark
- Dot indicator at bottom of each slide (4 dots)
- Persistent "SIGN IN" CTA in Netflix red at the bottom of every carousel slide — never hidden
- No preference collection during this pre-signup phase

**NUX implication:** For a streaming/media app, keep the pre-signup flow purely benefit-focused with illustrations. Preference collection (genres, moods) should happen *after* account creation, not during. The persistent CTA approach keeps conversion always one tap away.

---

### 3. Spotify Onboarding (iOS)
**File:** `mobbin-spotify-onboarding.png`

- Black background throughout (consistent with Netflix — dark is the standard for media apps)
- Splash: just the green Spotify logo on black
- Sign-up screen: "Millions of songs. Free on Spotify." + four options stacked:
  - Primary: "Sign up free" (green filled, full-width)
  - Social logins: Continue with Google / Facebook / Apple (outlined, icon left)
  - Secondary: "Log in" (text link at bottom)
- Account creation: step-by-step form, one question per screen ("What's your email?")
- Form fields are dark/charcoal with white text — never white background

**NUX implication:** The social login hierarchy (primary action top, social options below, log in last) is the established pattern. For NUX's onboarding, the step-by-step single-question approach reduces cognitive load. Dark form fields on dark background is standard for media apps.

---

### 4. Spotify Playlist Detail & Browse Grid
**File:** `mobbin-spotify-playlist.png`

Three-step flow:
1. **Browse grid:** "Mood", "Hits", "Throwback favorites" — 2-column grid of playlist cards, each card is square art + text label. The grid has generous gutters and the cards are large enough to show artwork clearly.
2. **Playlist landing:** Full-width cover art, playlist title + metadata (creator, stream count, duration), "Explore this playlist" section, track preview with artwork
3. **Tracklist:** Compact list rows — cover thumbnail (small) + track name + artist + duration + overflow menu (…). Play button (green circle) floats in the bottom-right of the cover.

Bottom tab bar throughout: Home | Search | Your Library — 3 tabs.

**NUX implication:** For NUX's catalogue browse, the 2-column mood/genre grid is proven. Content detail pages need: hero art, metadata, and a clear list of contained items. The floating play button on the cover is a strong pattern for immediate playback.

---

### 5. Spotify Web — Collapsing Library Sidebar
**File:** `mobbin-spotify-library.png`

Web layout has three zones:
- **Left sidebar (collapsible):** "Your Library" — list of playlists/albums with artwork thumbnails. Can collapse to icon-only mode. This is a key pattern for NUX's side nav.
- **Main content area:** Featured DJ banner + horizontal "Your top mixes" row + "Recently played" row with square artwork cards
- **Bottom mini-player bar:** Persistent across all pages — track name, artist, scrubber, transport controls (skip/pause/skip), volume, queue

The recently-played row uses the same card format as search results — consistency throughout.

**NUX implication:** For NUX's desktop/web layout, a collapsible sidebar + main content area + persistent bottom player bar is the established pattern. The mini-player should always show what's currently playing, even when browsing away.

---

### 6. Spotify iOS Music Player (Full-Screen)
**File:** `mobbin-spotify-player.png`

- Full-screen takeover: black background
- Album artwork fills most of the screen as a large square (~60% of height)
- Track title + artist in white text below art, with a "+" (add to library) action inline
- Progress scrubber bar (thin, grey with green fill)
- Timestamps (current / remaining)
- Transport row: shuffle | prev | pause | next | repeat — evenly spaced
- Secondary row of controls: lyrics button | share | queue (three horizontal lines)
- Swipe-up indicator at top of screen (to go back to mini-player or Now Playing queue)
- "Lyrics" pill/chip at bottom with yellow background — contextual action
- Top: chevron down (to collapse player) | "Coldplay" context label | overflow (…)

**NUX implication:** For NUX's player screen, the full-screen artwork + below-art controls pattern is proven. The swipe-down gesture to collapse back to a mini-player is the expected interaction. Including a lyrics/chat overlay (NUX's planned chat feature) as a slide-up panel from the bottom is consistent with this pattern.

---

### 7. HBO Max Show Detail + Player
**File:** `mobbin-player.png` and `mobbin-streaming-detail-2.png`

**Show detail page (mobbin-player.png left panel):**
- Full-width hero image with show title overlay
- Navigation bar: Home | Series | Movies | HBO | Sports (horizontal tab bar, no icons)
- Below hero: show title, network badge (MAX ORIGINAL), episode info, "Watch S1:E1" primary CTA (blue filled)
- Secondary actions: Add to Watchlist, Download, Share icons
- Text description
- "Episodes" and "You May Also Like" tabs below

**Video player (mobbin-player.png right panel):**
- Near-black screen during playback
- Thin white progress bar at very bottom
- Episode title + subtitle (S1:E1 "There Is No Line") in small text
- Clean minimal chrome — no large buttons, everything subtle
- "Episodes" and "You May Also Like" side panel tabs (visible to the right of the video)

**NUX implication:** The side panel on the video player (Episodes + "You May Also Like") is directly relevant to NUX's planned side panel feature. HBO Max implements this as tabs within the player chrome. The minimal player chrome with a persistent side panel is the right model.

**Onboarding/HBO Max (mobbin-streaming-detail-2.png):**
- Feature landing: hero image + headline "Stream HBO, Discovery+, movies, originals, and more. Only €x/month"
- Plan selection step: show 3 tiers (Basic with Ads / Standard / Premium) as side-by-side cards
- Ad-tier choice highlighted in a different colour
- Clear price comparison + "Start Streaming" CTA per plan

**NUX implication:** If NUX has subscription tiers, the side-by-side plan comparison with highlighted recommended tier is the standard.

---

## Navigation Patterns

### Mobile (iOS)
- **Bottom tab bar:** 3–5 items, icon + label, active item highlighted in accent colour (Netflix: Home/Hot&New/Downloads/More; Spotify: Home/Search/Library)
- Netflix uses text-label tabs at the TOP of the content area for content type filtering (Series/Films/Categories) — these sit below the sticky header, above the hero
- No hamburger menus in primary navigation on any major streaming app

### Web
- **Left sidebar:** Collapsible, shows playlists/library. Icon-only when collapsed, full width when expanded. Spotify's "Your Library" pattern.
- **Top navigation bar:** Horizontal text links (HBO Max: Home/Series/Movies/HBO/Sports)
- **Persistent mini-player bar at bottom:** Always visible, contains track/show info + transport controls

### Dark UI as Default
All major streaming apps (Netflix, Spotify, HBO Max) use near-black (`#000` to `#141414`) as the primary background. This is not a "dark mode toggle" — it IS the mode. White text on dark is standard throughout. UI chrome (cards, sidebar, headers) uses slightly lighter darks (#1a1a1a, #282828) for layering.

---

## Onboarding Patterns

### Step Count & Flow
- **Pre-signup:** 3–5 benefit screens (illustrations, not screenshots) → Sign up / Log in choice
- **Account creation:** Single-question-per-screen form (email → password → birthdate → gender → plan)
- **Preference collection (post-signup):** Spotify shows genre/mood cards for preference collection AFTER account creation. Netflix does it as part of profile setup.

### Preference Selection UI
- Visual grid of genre/mood cards (square or portrait cards with artwork + text label)
- Multi-select with tap-to-toggle (selected state = brighter/outlined/checkmarked)
- "Select all that apply" instruction
- Typically 2–3 columns, ~6–12 options visible at once
- Clear "Done" or "Next" CTA once minimum selections met

### NUX Onboarding Design Direction
1. Splash screen (logo on black, 1.5s)
2. 3-slide benefit carousel (illustrations, bold headlines, persistent CTA)
3. Sign up / Log in choice (primary CTA top, social logins below, log in text link last)
4. Step-by-step account creation (one field per screen)
5. Genre/mood/format preference grid (post-signup, skip option available)
6. Personalized home screen

---

## Player UI Patterns

### Mobile (Full-Screen Player)
- Full-screen art (album cover or show thumbnail) as background/focal point
- Transport controls in a horizontal row (prev/play/next) centered
- Progress scrubber below art, timestamps at ends
- Gesture: swipe down to minimize to mini-player
- Secondary controls in a second row (lyrics, share, queue)
- Context label at top (artist name, show name)

### Side Panel (NUX-Specific)
HBO Max's player has tabs right of the video for "Episodes" and "You May Also Like". This is directly applicable to NUX's planned side panel with chat/queue/recommendations. The tabs sit in the player chrome at the same level as the video, not as a modal overlay.

### Mini-Player Bar
Always visible at the bottom of every screen during active playback:
- Small thumbnail (left)
- Track/show title + artist/show (center)
- Play/Pause button (right side)
- Progress bar as a thin line along the very top edge of the bar

---

## Dark Mode Implementation

All streaming apps use:
- Primary background: `#000000` or `#0a0a0a` (pure/near black)
- Card/surface background: `#141414` to `#1e1e1e`
- Sidebar/elevated surface: `#282828` (Spotify)
- Primary text: `#FFFFFF`
- Secondary text: `#A7A7A7` (Spotify gray) or `#888` (Netflix)
- Accent/CTA: Brand colour (Netflix red `#E50914`, Spotify green `#1DB954`, HBO Max blue `#0063E5`)
- Card hover/pressed: subtle lightening of background, no border addition
- No shadows — layering achieved purely through background colour differences
- Artwork cards: images are self-lit; the dark background makes colours pop

**NUX Design Direction:** Use `#0d0d0d` as base, `#1a1a1a` for cards, `#242424` for modals/sheets, white primary text, grey secondary text. Pick a distinctive accent colour (avoid red and green as they're taken by Netflix/Spotify).

---

## Patterns That Directly Answer NUX Design Challenges

### Challenge: Chat/messaging overlay in media app
**Pattern found:** HBO Max uses a slide-up bottom sheet for secondary content. Spotify uses a queue panel that slides in from the right. Neither uses a full-screen modal that destroys context.
**Recommendation for NUX:** Implement chat as a slide-in panel from the right of the player (like HBO Max's Episodes tab), or a swipe-up bottom sheet that overlays the lower 60% of the player. Keep the video/content visible above.

### Challenge: Personalized home screen
**Pattern found:** Netflix's "For [Username]" header + hero + horizontal labelled rows is the standard.
**Recommendation for NUX:** Use a hero slot for current/featured content, then personalised rows with labels like "Because you played X", "New in [Genre]", "Continue Playing". First row should always be "Continue" for returning users.

### Challenge: Catalogue grid layout
**Pattern found:** Spotify's 2-column grid with square artwork cards for genre/mood browsing. Netflix uses a tighter ~3-column portrait card grid for title browsing.
**Recommendation for NUX:** 2-column wide cards (landscape) for featured playlists/collections, 3-column portrait cards for individual titles/games. Use horizontal scroll rows on home; vertical scroll grid on dedicated browse/search pages.

### Challenge: Onboarding preference collection
**Pattern found:** Visual grid of selectable genre/mood cards, multi-select, post-signup placement.
**Recommendation for NUX:** Show 8–12 genre/mood tiles in a 2-column grid. Each tile has a background image + label. Tapping selects with a check mark and brightens the card. Require minimum 3 selections before enabling "Done". Skip link available.

### Challenge: Navigation pattern
**Pattern found:** Bottom tab bar (mobile) with 3–4 items. Content-type tabs at the top of the content area (not the navigation bar). No hamburger.
**Recommendation for NUX:** Bottom bar: Home | Browse | Search | Profile (4 tabs). Top of home screen: content type tabs (Games | Series | Music | etc.) as a horizontally scrolling chip row.

---

## Mobbin URLs for Future Reference

- Netflix iOS Onboarding: https://mobbin.com/flows/55e1808d-5c26-4229-a392-4b2d3bbeaf11
- Netflix Android Onboarding: https://mobbin.com/flows/9d9e4868-e49e-4bc2-90bf-34593444de8b
- Netflix Web Onboarding: https://mobbin.com/flows/21753c58-4d81-4c04-8103-feeb4eeb621a
- Netflix Web Home Flow: https://mobbin.com/flows/661212c7-e4dd-45e5-b216-a9aad61b6835
- Netflix iOS Homepage screen: https://mobbin.com/screens/d79ef4f8-0e39-4f5b-8693-72ef13b002e4
- HBO Max Watching a Show: https://mobbin.com/flows/099a1c2c-bf23-4421-80c6-bf0d6b8f3bbc
- HBO Max Web Onboarding: https://mobbin.com/flows/563c19a1-0513-4841-9458-411906cb843b
- Prime Video Android Onboarding: https://mobbin.com/flows/6965327d-fa71-4ade-a052-35c1a3c281d6
- Spotify iOS Onboarding: https://mobbin.com/flows/d162ef83-02c1-45d9-be0f-6d03633ac095
- Spotify Android Onboarding: https://mobbin.com/flows/8d06c457-3bdd-4271-b5c9-dd71b4191da0
- Spotify iOS Playlist detail: https://mobbin.com/flows/dafca833-7bf4-46e3-97d0-4769403f8f7a
- Spotify Web Collapsing Library: https://mobbin.com/flows/ec930c03-e9d0-43e8-add0-c8c692d5a729
- Spotify iOS Music Player screen: https://mobbin.com/screens/68da2696-bf3e-477b-94ea-1b7040ea4ce9
- Mobile Watching Video flows: https://mobbin.com/explore/mobile/flows/watching-video
- Mobile Onboarding flows: https://mobbin.com/explore/mobile/flows/onboarding
