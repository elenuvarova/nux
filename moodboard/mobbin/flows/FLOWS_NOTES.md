# NUX Streaming Platform — Mobbin Flow Reference Notes

All screenshots extracted from Mobbin via direct image CDN (`bytescale.mobbin.com`).
Captures taken: 2026-06-09. Total files: 54 screenshots.

---

## Netflix (Web) — Home Flow
**Files:** `netflix-flow-01.png` through `netflix-flow-08.png`
**Source:** Mobbin — Netflix Web Home Flow + Netflix iOS Netflix Homepage comparison screen
**Screens captured:** 8

### Screens in flow
1. Hero banner with full-bleed featured content, transparent nav overlay
2. Horizontal scroll rows — "Continue Watching", "Top 10 in Belgium", genre rows
3. Row cards — portrait thumbnails (mobile), landscape (desktop web)
4. Hover/focus state on card showing play button + info overlay
5. Genre category tabs (TV Shows, Movies, New & Popular)
6. Search screen — trending searches, results grid
7. Profile selector screen — avatars + "Manage Profiles" CTA
8. iOS homepage comparison screen — shows how other streaming apps lay out home

### Key UI decisions observed
- **Navigation:** Top fixed nav, transparent over hero, solidifies on scroll. Logo left, nav center (Home/TV Shows/Movies/My List), profile avatar right.
- **Hero:** Full-viewport background image/video with title treatment, subtitle, "Play" (primary) + "More Info" (secondary) CTAs side by side.
- **Content rows:** Horizontal scroll carousels with row label + "See All" link. Cards scale up on hover revealing rank, match %, quick-add buttons.
- **Card layout:** Portrait (2:3) for mobile/browse, landscape (16:9) for continue-watching. No card borders — bleed into dark background.
- **Info hierarchy:** Title > Genre tags + runtime > Synopsis (truncated). Maturity rating badge always visible.
- **Color system:** Near-black (#141414) background, white primary text, #e50914 red accents only on CTAs and logo. Very restrained.

### Elements to replicate for NUX
- Transparent nav collapsing to opaque on scroll — essential for immersion
- "Continue Watching" as first row — drives retention
- Play button as the primary and most visually prominent CTA on both cards and detail pages
- Profile selector as a first-class screen (NUX supports multiple viewer profiles per household)
- Dark background with image-driven color extraction for card/hero treatments

### Elements to avoid
- The "Top 10" numbered cards with giant overlapping digits feel gimmicky; consider a different trending treatment
- The profile selector avatar grid feels dated — consider a more modern approach

---

## HBO Max (Web) — Onboarding Flow
**Files:** `hbo-flow-01.png` through `hbo-flow-10.png`
**Source:** Mobbin — HBO Max Web Onboarding Flow (13 screens, 10 downloaded)
**Screens captured:** 10

### Screens in flow
1. Landing page — value proposition hero with "Start your free trial" CTA
2. Plan selection — 3-tier pricing table (Ad-Lite / Ad-Free / Ultimate)
3. Plan detail — feature checklist per tier
4. Account creation — email + password form
5. Payment method — credit card / PayPal / gift card
6. Billing confirmation screen
7. Content preferences step 1 — genre selection (genre pills)
8. Content preferences step 2 — specific show/character preference selection
9. Profile setup — name + avatar
10. Welcome/home screen after onboarding completion

### Key UI decisions observed
- **Onboarding length:** 10 steps — longer than Netflix but more personalized
- **Plan selection:** Placed very early (step 2), before account creation — friction-forward but ensures intent
- **Preference collection:** Two-step preference collection using large image tiles (genres, then titles/characters). Very visual, low-text.
- **CTAs:** "Continue" button always bottom-fixed, full-width on mobile
- **Progress:** No explicit progress bar shown, but each step has a "Back" arrow
- **Navigation placement:** Top left logo only, no nav during onboarding — reduces distraction

### Elements to replicate for NUX
- Two-phase taste collection (genres first, then specific titles/artists) — more granular personalization
- Large image tiles for preference selection — much more engaging than text lists
- Bottom-fixed full-width primary CTA during onboarding — reduces cognitive load on where to tap
- Welcome screen after onboarding that immediately shows personalized content rows

### Elements to avoid
- Pricing gating very early creates drop-off for exploration — NUX should let users browse before paywall
- 10-step onboarding is too long; aim for 4-5 steps maximum

---

## Spotify (iOS) — Onboarding Flow
**Files:** `spotify-flow-01.png` through `spotify-flow-06.png` (first 6 of 29 total screens)
**Source:** Mobbin — Spotify iOS Onboarding Flow (29 screens total)
**Screens captured:** 6 (first batch; flow covers full signup + preference setup)

### Screens in flow (first 6)
1. Splash / welcome screen — logo + "Sign up free" + "Log in" options
2. Sign up method selection — Apple / Google / Facebook / Email
3. Email registration form
4. Birthday input
5. Gender selection (with "Prefer not to say" option)
6. Terms & conditions with toggles for marketing

### Key UI decisions observed (from first 6 screens)
- **Onboarding gate:** Requires full account before any content access — Spotify forces account creation before discovery
- **Social sign-in first:** Apple/Google/Facebook options appear before email — reduces friction for majority of users
- **Progressive form:** Each step has one input only (email on one screen, birthday on next) — reduces overwhelm
- **Legal:** Marketing consent is opt-in with clear toggles, not buried — good UX pattern
- **Color:** Black (#000) background through entire onboarding, green (#1DB954) accents only on primary CTAs. Extremely consistent.

### Elements to replicate for NUX
- Single-input-per-screen approach for onboarding forms
- Social auth as primary options, email as secondary
- Full-bleed dark background from first screen — establishes premium feel immediately

### Elements to avoid
- Mandatory signup before browsing — NUX should allow guest browsing of catalogue (signed-out state)
- Asking for birthday + gender before preference step — demographic questions feel intrusive; consider skipping or making fully optional

---

## Spotify (iOS) — Music Player Screen
**Files:** `spotify-flow-09.png`
**Source:** Mobbin — Spotify iOS Music Player comparison screen
**Screens captured:** 1 (comparison view showing Spotify player alongside Sonos, IDAGIO)

### Key UI decisions observed
- **Now Playing layout:** Album art dominant (70% of screen), controls below, lyrics toggle above
- **Playback controls:** Previous / Play-Pause (large) / Next, with progress scrubber
- **Secondary controls:** Shuffle, Repeat, Heart/Like, Share, Queue ("Up Next"), Devices
- **Mini-player:** Persistent bottom bar with artwork thumbnail + title + play/pause; disappears when full player opens
- **Queue:** Accessible via swipe-up from player or "Up Next" button

### Elements to replicate for NUX
- For NUX video player: Large play/pause centered, progress scrubber across bottom, secondary controls (volume, fullscreen, cast) in corners
- Mini-player pattern for background playback / podcast-style content
- "Add to playlist / watchlist" from player directly — reduces context switching

---

## Spotify (Web) — Collapsing Library Flow
**Files:** `spotify-flow-07.png`, `spotify-flow-08.png`
**Source:** Mobbin — Spotify Web Collapsing Library Flow
**Screens captured:** 2

### Screens in flow
1. Expanded left sidebar library (full width panel showing playlists/podcasts/artists)
2. Collapsed sidebar (icon-only strip, freeing up content area)

### Key UI decisions observed
- **Library sidebar:** Can be pinned expanded or collapsed to icon strip
- **Filter chips:** Inside expanded library — search by Artists / Playlists / Albums / Podcasts
- **Keyboard shortcut:** Visible on hover for collapsing
- **Web layout:** Left sidebar (library) + Main content (browse/play) + Right sidebar (queue/lyrics) — 3-panel layout on desktop

### Elements to replicate for NUX
- Collapsible sidebar pattern for "My Library" / watchlist on desktop web
- Filter chips within library panel to switch between content types (Series / Films / Live / Podcasts)

---

## Twitch (iOS) — Streamer Profile Flow
**Files:** `twitch-flow-01.png` through `twitch-flow-06.png`
**Source:** Mobbin — Twitch iOS Streamer Profile Flow (11 screens total, 6 downloaded)
**Screens captured:** 6

### Screens in flow
1. Streamer profile page — banner image, channel name, follower count, Subscribe CTA
2. About tab — panels, schedule, social links
3. Stream schedule view
4. Clips tab — horizontal scroll of recent clips
5. Subscribe modal — subscription tier selection (Tier 1/2/3)
6. Subscription confirmation + emote unlock screen

### Key UI decisions observed
- **Profile layout:** Cover banner (16:9) + avatar overlapping bottom edge + name/stats below — creator-profile pattern
- **Social proof prominently displayed:** Live viewer count, follower count, subscriber count all above the fold
- **Subscribe CTA:** Heart/Subscribe button always visible in top-right — never more than 1 tap away
- **Content tabs:** Tabs for Videos / Clips / About / Schedule — standard content creator profile structure
- **Subscription tiers:** Clear visual differentiation between tiers, price + perks listed
- **Chat:** Not shown in profile flow, but Twitch's live chat overlay is its most distinctive feature

### Elements to replicate for NUX
- Creator profile page pattern if NUX has creator accounts (studio/channel pages)
- Live viewer count badge on thumbnails in browse view — social proof for live content
- "Subscribe to channel" as a distinct concept from content paywall — creator monetization model
- Tabs on content pages (Episodes / Clips / About / Schedule) for structured content organization

### Elements to avoid
- Twitch's extremely dense information hierarchy (everything visible at once) — NUX should be more breathable
- The subscription tier complexity — start with one subscription level

---

## Disney+ (iOS) — Home Flow
**Files:** `disney-flow-01.png` through `disney-flow-06.png`
**Source:** Mobbin — Disney+ iOS Home Flow (15 screens total, 6 downloaded)
**Screens captured:** 6

### Screens in flow
1. Home tab — hero carousel with brand-separated horizontal rows (Disney / Pixar / Marvel / Star Wars / National Geographic)
2. Hero with prominent "Play" + "Add to Watchlist" CTAs
3. Brand hub rows — each brand has its own color-coded row header
4. Content detail page — title treatment with logo (not text), play button + "+" watchlist
5. Episode list — season selector + episode cards with title/synopsis/runtime
6. Player screen — video playing with controls overlay

### Key UI decisions observed
- **Brand architecture:** Disney+ organizes by brand (Disney/Pixar/Marvel/Star Wars/NatGeo), not just genre — very distinctive
- **Hero carousel:** Auto-advancing with brand logo overlay (not text title) — visual brand recognition over readability
- **Tab bar:** Home / Search / Downloads / My Disney+ — bottom tab bar on iOS
- **Watchlist:** Plus (+) icon on every card and detail page — consistent placement
- **Color:** Very dark navy (#000511) background, white text. Brand colors appear in row headers only.
- **Content detail:** Full-bleed hero image, title as logo/image, metadata (rating, year, runtime) below, then play CTA
- **Episodes tab:** Clean grid with episode number, thumbnail, title, runtime — no synopsis in list, expand on tap

### Elements to replicate for NUX
- Brand/category hub rows as a navigation model — could adapt to streaming genres or partner channels
- Logo-as-title treatment for hero featured content (when brand assets allow)
- Episode list with season selector + clean card layout
- Full-bleed content detail hero — title treatment with key art, not just text

### Elements to avoid
- Brand-first navigation may confuse users who don't know which brand made what — consider genre + brand hybrid
- Auto-advancing hero carousel is hard to control and can frustrate users

---

## Apple TV (iOS) — Connecting to Apple TV Flow
**Files:** `appletv-flow-01.png` through `appletv-flow-05.png`
**Source:** Mobbin — Apple TV iOS Connecting HBO Max to Apple TV Flow
**Screens captured:** 5 (includes appletv-flow-01.png from context comparison screen)

### Screens in flow
1. Apple TV app home — full-bleed hero, horizontal rails, "Watch Now" tab selected
2. Channel subscription page — HBO Max as a channel within Apple TV+
3. Subscription confirmation
4. Connected state — content from HBO Max appearing within Apple TV app

### Key UI decisions observed
- **Aggregator model:** Apple TV app is a universal player aggregator — content from multiple services plays within one app
- **Channel integration:** Third-party channels (HBO, Paramount+, etc.) are subscription add-ons within the Apple TV app — unified billing
- **Navigation:** Top navigation tabs (Watch Now / Apple TV+ / Store / Library / Search) — not bottom tab bar on iPad; bottom tab bar on iPhone
- **Hero treatment:** Extremely minimal — just the key art with subtle gradient, title in large type, and CTA. No category tags cluttering the hero.
- **Typography:** SF Pro, very large type for titles, generous whitespace — distinctly Apple aesthetic

### Elements to replicate for NUX
- Minimal hero with large typography + generous whitespace — elevated, premium feel
- The aggregator/channel model if NUX plans to integrate third-party content sources
- "Up Next" row concept — picks up where you left off across all content types

---

## MasterClass (iOS) — Home Screen
**Files:** `masterclass-flow-01.png`
**Source:** Mobbin — Netflix iOS Homepage comparison screen (includes MasterClass as reference)
**Screens captured:** 1 (comparison thumbnail)

### Key UI decisions observed
- **Instructor-led layout:** Content organized by instructor, not topic — "Learn cooking with Gordon Ramsay" pattern
- **Visual style:** Very cinematic, film-quality photography. Dark, dramatic lighting.
- **Hero:** Full-bleed instructor portrait + course title + "Start" CTA
- **Browse:** Categories across top (Cooking / Music / Film / Writing / Sports / etc.)
- **Course detail:** Trailer auto-plays, chapter list with duration per lesson, instructor bio

### Elements to replicate for NUX
- Creator/instructor-centric content organization if NUX features creator-led content
- Cinematic photography standard — content imagery should feel editorial quality
- Chapter-list layout for structured course/series content with duration per episode

---

## Additional Reference Apps (Comparison Screens)
**Files:** `hulu-flow-01.png`, `primevideo-flow-01.png`
**Source:** Mobbin — Netflix iOS Homepage comparison view

### Hulu — Key observations
- Green brand color (#1CE783) used sparingly — mainly on active states and logo
- Homepage: Top banner ad/promo + horizontal rows. More ad-forward layout.
- Strong "Live TV" section — Hulu differentiates with live TV integration

### Prime Video — Key observations
- Channels marketplace prominently featured — similar to Apple TV's aggregator model
- X-Ray feature overlay (cast info, music, trivia while watching) — unique differentiator
- Rent/Buy and Subscribe model coexist — mixed payment model creates complexity

---

## NUX-Specific Design Recommendations

### Onboarding (Journey 1)
- **3-4 steps max:** Welcome → Social auth → Taste preferences (visual tile selection, 2 steps max) → Personalized home
- **Skip option:** Always visible but de-emphasized — don't block discovery
- **Preference selection:** Large image tiles (HBO Max model), select 5-10 genres/moods
- **No billing during onboarding** unless free trial ends — keep first impression friction-free

### Home / Personalized Landing (Journey 2)
- **Hero:** Full-bleed, auto-cycling with pause on hover/focus, logo treatment over text title
- **Row structure:** Continue Watching → Trending → Personalized rows by taste → New Releases → Explore by genre
- **Navigation:** Transparent-to-opaque top nav (Netflix model) + bottom tab bar on mobile

### Content Detail (Journey 3)
- **Full-bleed hero** with key art, minimal text overlay
- **CTAs:** Play (primary, prominent) + Add to Watchlist (+) + Share
- **Metadata:** Year / Rating / Runtime / Genre tags — compact, below fold
- **Episode list:** Season selector + clean card grid (Disney+ model) if series

### Video Player (Journey 4)
- **Controls:** Center play/pause, bottom scrubber, top-right close/fullscreen
- **Overlay auto-hides** after 3s of inactivity
- **Mini-player** on swipe down from full-screen
- **For live content:** Chat overlay on right side (Twitch model), collapsible

### Search + Browse (Journey 5)
- **Trending searches** on empty state (Netflix model)
- **Visual results grid** — not list — with thumbnail dominant
- **Filter chips** for content type (Film / Series / Live / Short), genre, language

### Chat / Social Overlay (Journey 6)
- Take Twitch's chat overlay model — right panel on desktop, collapsible overlay on mobile
- "Watch party" concept: shared playback with synchronized chat
- Reactions/emoji reactions on video (like YouTube Live) for lower-commitment engagement

### Profile + Settings (Journey 7)
- **Avatar + display name** at top
- **My List / Watchlist** as first section
- **Watch history** with "Remove from history" option
- **Preferences:** Language, autoplay toggle, notification settings
- **Account:** Subscription plan + billing — last section, lowest visual weight
