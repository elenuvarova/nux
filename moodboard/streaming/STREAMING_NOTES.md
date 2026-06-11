# Streaming Platform Moodboard — Design Observations
**Project:** NUX — premium streaming platform organized by narrative themes across film, doc, game, course  
**Captured:** 2026-06-09

---

## 1. Criterion Collection — `criterion-home.png`
**URL:** criterion.com

### Layout Structure
- Editorial magazine layout, not a typical streaming grid
- Full-bleed hero image with film title + promotional editorial text
- Alternating text/image rows, heavy white space, clear hierarchy
- Sections: Featured, New Releases, Criterion Channel Picks, spine browsing by decade/director

### Navigation
- Minimal top nav: logo + Shop / Films / Channel / Blog / Search / Cart / Account
- No persistent sidebar — desktop editorial approach
- Search is secondary, browsing is primary

### Content Discovery
- Editorial curation is the main mechanism — "Criterion's Picks" sections, curated lists
- Films grouped by director, genre, decade — intellectual framing not algorithmic
- Blog-style editorial content as discovery layer (essays, interviews)

### Card Anatomy
- Spine-style bookshelf cards (portrait, ~2:3 ratio) showing the iconic Criterion spine art
- Title + director + year in metadata below card
- No hover CTA visible in static shot — editorial over conversion

### Color & Dark/Light
- Predominantly **light / white** — clean editorial aesthetic
- Black spine art and typography for contrast
- Accent colors come entirely from the film art itself
- Very restrained — no UI chrome color

### Typography
- Clean sans-serif for body/nav (appears to be a custom or geometric sans)
- Large editorial display type for feature headlines
- Strong hierarchy: massive display > medium subhead > small body

### NUX Takeaways
- **STEAL:** Editorial framing of content — the "why watch this" layer, not just thumbnails in a grid
- **STEAL:** Letting film art carry the visual weight; minimal UI chrome
- **STEAL:** Sections organized by theme/intent ("Closet Picks", "New Releases") rather than just genre tags
- **AVOID:** Light mode — NUX is dark-first
- **AVOID:** The e-commerce cart/shop paradigm — NUX is pure streaming UX

---

## 2. Criterion Channel — `criterion-channel.png`
**URL:** signup.criterionchannel.com

### Layout Structure
- Dark streaming landing page (unauthenticated)
- Full-bleed hero with film mosaic/collage background — atmospheric
- Three content bands: hero CTA → "Join the Conversation" editorial section → "Criterion 24/7" feature → pricing/plan
- More compact than criterion.com — streaming app aesthetic

### Navigation
- Minimal: logo + Login + Start Free Trial CTA (high contrast button)
- No browse navigation until logged in — gated

### Content Discovery
- Emphasis on curation identity: "Stream the world's best movies"
- Shows featured content in hero collage
- "Whatever you're in the mood for, we've got you covered" — theme/mood framing

### Card Anatomy
- Hero mosaic uses portrait film posters at small scale
- No individual card metadata visible in unauthenticated state

### Color & Dark/Light
- **Dark** — deep near-black background (#0d0d0d range)
- White text, high contrast
- Brand red used sparingly for logo/CTA
- Film art provides all color warmth

### Typography
- Large, confident display serif for feature headlines ("Join the Conversation")
- Body in a clean sans
- Good contrast ratio throughout

### NUX Takeaways
- **STEAL:** Dark hero with film art mosaic as atmospheric background — strong "world of cinema" feeling
- **STEAL:** The unauthenticated landing as a mood/identity statement, not a feature list
- **STEAL:** "Criterion 24/7" concept — curated continuous stream — analogous to NUX "thematic journeys"
- **AVOID:** Single-brand focus — NUX spans multiple media types

---

## 3. Letterboxd — `letterboxd-home.png`
**URL:** letterboxd.com

### Layout Structure
- Dark social/catalogue hybrid
- Hero: tagline + sign-up CTA over atmospheric film-still background
- Below fold: social proof row (friend activity cards), "What's popular" grid, news/editorial stream
- Mixed layout: cards + list + article blocks — more editorial than Netflix-style rows

### Navigation
- Top nav: Films / Members / Journal / More — taxonomy-first
- Search prominent
- Sign in / Create account CTAs

### Content Discovery
- Social graph drives discovery: "what your friends watched"
- "Popular this week" genre/list browsing
- Film journal/news articles as editorial discovery
- Lists are first-class objects (user curated + editorial)

### Card Anatomy
- Portrait film posters (~2:3 ratio), tight grid
- On hover (implied): star rating, watch status overlay
- Member cards: avatar + activity text
- Article cards: landscape image + headline

### Color & Dark/Light
- **Dark mode** — deep green-black (#14181c — Letterboxd signature dark)
- Green accent (#00e054 — Letterboxd signature green) for ratings/CTAs
- Film art provides all warm color
- Very consistent, tight brand palette

### Typography
- Body: compact sans-serif, tight leading — information dense
- Headlines: slightly larger but still restrained
- Very readable on dark background

### NUX Takeaways
- **STEAL:** The dark green-black base — warmer than pure black, more cinematic
- **STEAL:** Lists as first-class discovery objects — NUX "themes" = Letterboxd "lists"
- **STEAL:** Community/social proof layer alongside catalogue
- **STEAL:** Portrait 2:3 card ratio for film content
- **AVOID:** The social media information density — NUX should be more premium/spacious
- **AVOID:** The green accent — too associated with Letterboxd specifically

---

## 4. Spotify Web Player — `spotify-home.png`
**URL:** open.spotify.com

### Layout Structure
- Persistent left sidebar (library/navigation) + main content area
- Main area: horizontal rows labeled by context ("Trending songs", "Popular artists", "Recently played")
- No hero — jumps straight into content rows
- Cookie/privacy banner obscures bottom on first visit

### Navigation
- Left rail: Your Library, Create playlist, Find podcasts
- Top bar: search + Premium/Support/Download links + Login/Sign up
- Navigation is functional/utilitarian, not editorial

### Content Discovery
- Algorithmic personalization (empty state shows "Trending" as fallback)
- Row-based browsing: content type rows horizontal-scroll
- "Show all" expands each row
- Heavy personalization once logged in

### Card Anatomy
- Square album art (1:1 ratio) — appropriate for music
- Card: artwork + title + artist below
- Minimal metadata in grid view

### Color & Dark/Light
- **Dark** — Spotify's near-black (#121212) sidebar, slightly lighter (#181818) main
- Green (#1DB954) as primary action color
- White text hierarchy: primary/secondary/tertiary grays

### Typography
- Circular (custom) — geometric sans, highly legible
- Strong weight hierarchy: bold titles vs. muted metadata

### NUX Takeaways
- **STEAL:** The sidebar + main content layout pattern for logged-in experience
- **STEAL:** Named content rows with "Show all" — scalable discovery pattern
- **STEAL:** The slightly layered dark palette (pure black vs. raised surface dark) for depth
- **STEAL:** Persistent playback bar concept → NUX could have a persistent "now watching" strip
- **AVOID:** Square card ratio — film content needs portrait or landscape
- **AVOID:** The algorithmic-first approach — NUX is editorial/themed-first

---

## 5. Apple Music — `apple-music.png`
**URL:** music.apple.com/us/new

### Layout Structure
- Left sidebar navigation + main content area (mirrors Spotify but more premium)
- Main: large featured cards at top, horizontal rows below
- "New" section: large editorial cards ~16:9 with overlay text
- Compact playback controls visible

### Navigation
- Left rail: Search / Home / New / Radio — very minimal
- "Open in Music" CTA to native app
- Sign In button for full access

### Content Discovery
- Editorial "New" section — curated recent releases
- "Best New Songs" list with track preview
- Radio as discovery channel
- Human curation implied over pure algorithm

### Card Anatomy
- Large featured cards: ~16:9 or ~1:1 landscape, full bleed art + overlay title/subtitle text
- Small list items: square thumbnail + title + artist in row format
- Generous card sizing — premium, spacious feel

### Color & Dark/Light
- Light mode in this screenshot (web player defaults light)
- Red (#FA2D48) as Apple Music brand accent
- Would be dark in native app
- Very clean, lots of white space

### Typography
- San Francisco (Apple system font) — extremely polished, precise
- Strong type hierarchy, consistent sizing steps
- Caption text feels premium — not compressed

### NUX Takeaways
- **STEAL:** The large editorial feature cards — content as art, not just a clickable thumbnail
- **STEAL:** The sidebar simplicity — 4-5 items max, no clutter
- **STEAL:** Generous card sizing and white space = perceived premium quality
- **STEAL:** The "New" editorial section concept → NUX "This Week" or "New This Month" thematic drop
- **AVOID:** Light mode for NUX's dark-first approach
- **AVOID:** The native-app redirect pattern (NUX should be web-first)

---

## 6. Disney+ — `disney-home.png`
**URL:** disneyplus.com

### Layout Structure
- Dark landing page with privacy modal overlay on first visit
- Below modal: "Top 10 Today" numbered row with large landscape cards
- Plan comparison table (3 tiers)
- Feature highlights section (device availability, parental controls)
- FAQ accordion
- Heavy on conversion/upsell, light on content browsing

### Navigation
- Minimal top bar: Disney+ logo + Sign Up / Log In
- No content browsing until authenticated

### Content Discovery
- "Top 10 Today" — social proof / trending as hook
- Content preview images as ambient proof of library breadth
- Brand sections implied (Disney, Pixar, Marvel, Star Wars, National Geographic)

### Card Anatomy
- Large landscape cards (~16:9) for Top 10, numbered overlay badge
- Brand logos as navigation items (not text)
- Card shows: title overlay + numbered ranking badge

### Color & Dark/Light
- **Deep dark blue-black** (#0d0d2b range) — signature Disney+ dark navy
- White text
- Gradient overlays on card edges for row scroll effect
- Almost no UI chrome color — content art dominates

### Typography
- Clean rounded sans for body
- Large, impactful display type for headlines
- Avenir/geometric family feel

### NUX Takeaways
- **STEAL:** Deep dark navy over pure black — warmer, more immersive
- **STEAL:** "Top 10" ranked content rows — social proof in catalogue browsing
- **STEAL:** Brand/franchise as navigation concept → NUX could navigate by "theme universe"
- **STEAL:** Full-bleed content art with minimal UI chrome overlay
- **AVOID:** The heavy pricing/plan comparison UI on the landing — NUX landing should be content-first
- **AVOID:** The walled-garden brand silo approach — NUX is cross-media/cross-IP

---

## 7. Max / HBO Max — `max-home.png`
**URL:** hbomax.com

### Layout Structure
- Dark landing with privacy consent modal
- Content mosaic hero (film/show stills tiled as background)
- Plan picker (Basic with Ads / Standard / Ultimate)
- Content category showcase: "Entertainment Like No Other" — genre rows
- FAQ section + device support

### Navigation
- Top bar: HBO Max logo + Sign In + Start Free Trial
- Content navigation gated behind auth

### Content Discovery
- Hero content mosaic — aspirational quality signal
- Genre tabs: Family / Comedy / Drama / Crime / True Crime
- "Discover the Best In..." section rows

### Card Anatomy
- Landscape ~16:9 cards in genre rows
- Character/show art with title overlay
- Cards feel premium — high production value imagery

### Color & Dark/Light
- **Dark** — very deep near-black (#0a0a0a range)
- Purple/blue tones from content art
- White typography, very high contrast
- HBO Max signature: restrained, prestige aesthetic

### Typography
- Clean sans-serif throughout
- Display type is bold but not oversized — confident, not loud
- Strong hierarchy maintained

### NUX Takeaways
- **STEAL:** Prestige restraint — not everything fighting for attention
- **STEAL:** Content mosaic as hero — "the library IS the hero"
- **STEAL:** Genre/theme labeled rows with horizontal scroll
- **STEAL:** The deep near-black tone — not #000000 but a rich dark
- **AVOID:** The subscription tier pricing as primary landing content — NUX landing should be content-first
- **AVOID:** The "HBO" prestige brand lean — NUX has different identity (thematic/cross-media)

---

## 8. Crunchyroll — `crunchyroll-home.png`
**URL:** crunchyroll.com

### Layout Structure
- Dark landing, prominent orange CTA
- Hero: "World's largest dedicated Anime collection" — genre identity-first
- Pricing section (Fan / Mega Fan tiers)
- "Be the First to Watch" — new simulcast releases row
- FAQ + footer

### Navigation
- Top bar: logo + Start Free Trial (high contrast orange button)
- No browse navigation until logged in

### Content Discovery
- Simulcast/new releases as primary hook — recency and exclusivity
- Genre identity is the category (anime = the genre)
- Card row: "Be the First to Watch" — 6 portrait cards with title + subtitle

### Card Anatomy
- Portrait cards (~2:3) for anime series — appropriate for this content type
- Card shows: key art + title + episode count/status
- "New Episode" badge overlays

### Color & Dark/Light
- **Dark** — Crunchyroll dark (#1a1a1a range)
- Orange (#F47521) as aggressive brand accent — very prominent
- High energy, less prestige than Max/Criterion — fan-service aesthetic

### Typography
- Bold display type, high energy
- Orange used in headings as brand expression
- Less refined than Apple/Spotify — functional over editorial

### NUX Takeaways
- **STEAL:** Portrait card ratio for series content
- **STEAL:** "New Episode" / recency badges on cards — status indicators matter
- **STEAL:** Strong genre/community identity as landing hook
- **AVOID:** The orange-dominant accent — too energetic for NUX's premium/dark tone
- **AVOID:** The fan-service aesthetic — NUX is more editorial/prestige
- **AVOID:** Aggressive pricing as primary content

---

## Synthesis: NUX Design Direction

### What NUX should synthesize from these references

**Dark palette:**  
Use Letterboxd's deep green-black (#14181c) or Disney's dark navy as base — not pure black. Layered surfaces (sidebar darker, cards slightly raised) like Spotify's approach.

**Layout pattern:**  
Sidebar nav (Apple Music / Spotify) + editorial main area (Criterion). 4-5 nav items max. Row-based browsing with named, themed sections.

**Hero approach:**  
Content mosaic as hero (Criterion Channel / Max) — the library quality IS the pitch. No generic lifestyle photography.

**Card anatomy:**  
- Film/doc: portrait 2:3 (Letterboxd / Crunchyroll)  
- Game/course: landscape 16:9 (Apple Music feature cards)  
- Featured editorial: large 16:9 with overlay text (Apple Music / Disney)

**Content discovery:**  
Editorial theme rows as primary navigation — NOT algorithmic grid. Named thematic collections ("Survival Stories", "Mind-Bending Narratives") across media types. Letterboxd-style Lists as first-class objects.

**Typography:**  
Geometric sans (Circular/SF Pro direction) + display serif for editorial moments (Criterion influence). Strong hierarchy, generous sizing — quality signal.

**What to avoid:**  
- Pure #000000 black (flat, cheap-feeling)  
- Light mode anywhere in core UX  
- Aggressive CTA color over everything (Crunchyroll orange trap)  
- Pricing tables as landing content  
- Algorithm-first browse (Netflix trap — endless rows, no editorial voice)  
- Square card ratios for video content
