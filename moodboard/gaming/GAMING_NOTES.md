# NUX Gaming UI Moodboard — Design Notes

**Context:** NUX is a cross-media streaming platform (film + documentary + games + courses) unified by narrative themes. Target user: Jeremy Jones, 25–35, serious viewer and gamer. These notes focus on what NUX can borrow for its social/chat layer and cross-media catalogue treatment.

---

## 1. How Gaming Stores Handle Catalogue Browsing vs Streaming

### Epic Games Store (`epic-store.png`)
- **Pure purchase funnel, not browsing.** The hero carousel dominates above the fold with a single featured title — huge cinematic key art, price, and one CTA. This is "billboard" logic, not catalogue.
- Left sidebar navigation (Browse, Discover, Free Games, News) keeps exploration contained, unlike streaming's horizontal scroll rows.
- Cards in the grid below use **portrait/box-art ratio (~2:3)**, consistent with console conventions. Info density is deliberately low: title, price, sometimes a badge (Free, Sale).
- **No play-in-place.** Everything gates on a download/install step — fundamentally different from streaming where you can sample in seconds.
- Dark grey (#1a1a1a–#202020) background, white text, accent color a desaturated blue. The dark premium feel NUX should reference for its game-content section.

### Nintendo eShop (`nintendo-eshop.png`)
- Bright, colourful, playful — almost anti-Epic. Uses bold gradient banners and Nintendo red prominently.
- Cards are the same portrait box-art format but with rounded corners and white backgrounds in some variants — feels approachable, family-oriented.
- Heavy use of **category filter pills** at the top (Genre, Price, Features, Availability). Useful pattern for NUX's cross-media filter bar (Theme, Format, Duration, Platform).
- Sale badges and "New!" labels are very prominent — NUX could use equivalent "New Episode", "Just Added", "Trending" badges on catalogue cards.

### itch.io (`itchio-home.png`)
- The most catalogue-dense of the three stores. Uses a **multi-column masonry-ish grid** with mixed card heights — reflects the diverse, handmade nature of indie games.
- Tags are first-class citizens: genre, theme, engine, platform tags appear directly on cards. This is the strongest reference for NUX's cross-tagging of content by narrative theme (e.g., "Dystopia", "Identity", "Coming-of-age").
- Cards show: cover image, title, author, short description snippet, price, and tag chips — high info density without feeling overwhelming because the layout breathes with whitespace.
- Community signals (number of views, ratings, comments) are visible at the card level — a pattern NUX should adopt for its social layer ("132 watching", "24 notes", "8 friends played this").
- Warm off-white/cream background with a salmon/coral accent — intentionally anti-corporate. Contrasts well with the darker NUX brand if used as an accent direction for the community/indie-feel layer.

---

## 2. Chat / Social UI Patterns (Twitch)

### Twitch (`twitch-home.png`)
- The Twitch homepage shows **live streams as the primary catalogue unit** — thumbnail (16:9), streamer avatar, viewer count, game tag, and stream title. Live status is signalled by a persistent red "LIVE" badge.
- **Chat is contextual, not global.** It only appears inside a stream page, not on browse. For NUX's social layer this is instructive: surface chat/discussion at the content level (in-player or alongside the player), not on the catalogue homepage.
- Viewer count acts as real-time social proof — "18,423 viewers" is more compelling than a static star rating for live/trending content. NUX can borrow this for live events or "X people watching now" micro-copy.
- Categories/tags on the browse page (Just Chatting, League of Legends, Fortnite…) are content-first, not format-first. NUX should do the same: lead with themes ("Artificial Intelligence", "Revenge", "True Crime") not formats ("Documentary", "Course").
- **Sidebar presence indicators** (who's live among followed channels) is a key social pattern. NUX could show "Friends watching now" in the sidebar to surface social activity without requiring a full chat experience.
- Clip previews autoplay on hover — low-friction content tasting. NUX should support hover-preview for trailers/clips on cards to reduce commitment anxiety before starting a title.

---

## 3. How MasterClass Handles Premium Course Presentation

### MasterClass (`masterclass-home.png`)
- **Instructor-as-hero.** Every card leads with the celebrity instructor's cinematic portrait, not the subject matter. Name and subject are secondary. For NUX, this translates to: lead with the director/creator name for prestige content, not just the title.
- The overall palette is near-black (#0a0a0a) with gold accents — communicates luxury and exclusivity. Very close to what NUX should use for its "prestige layer" (arthouse film, acclaimed documentaries, high-production courses).
- Cards use a **wide landscape ratio (~16:9 or ~3:2)** with the instructor photographed against dark, dramatic, often blurred backgrounds. Consistent art direction makes the grid feel curated, not assembled.
- **Subscription CTA is everywhere but never pushy.** A persistent banner at top with the annual plan price, but content cards are fully visible without a paywall blur. NUX should show content freely in the catalogue and gate only at the point of play.
- Course progress ("X% complete") shows on enrolled courses — useful UI state for NUX's course content layer. Show a thin progress bar at the bottom of a card for in-progress items.
- "Taught by" micro-copy under each title is a simple credibility pattern NUX can use across content types: "Directed by", "Hosted by", "Designed by".

---

## 4. Cross-Media Recommendation Patterns

### YouTube (`youtube-home.png`)
- The homepage algorithm produces **mixed-format rows**: Shorts row, then long-form video rows grouped by channel or topic, then a Shorts shelf again. No explicit format labelling — users just understand the context from thumbnail shape (vertical = Short, horizontal = video).
- **Duration is shown on every thumbnail** (bottom-right corner). For NUX this is critical: "2h 14m" on a film card vs "12 lessons · 4h total" on a course card vs "Episode 3 · 47m" on a series card.
- "Because you watched X" shelf is the clearest recommendation transparency pattern in the industry. NUX can use "Because you watched [title]" or "More with this theme" to explain cross-media recommendations (a film recommends a game, which recommends a documentary).
- Thumbnail hover shows a short preview (autoplay) — low-commitment content tasting, same as Twitch. This should be a core NUX interaction.

### Goodreads (`goodreads-home.png`)
- **Social taste graph is the product.** The homepage for logged-out users emphasises "see what your friends are reading" over discovery of specific titles. For NUX's social layer, the hook is "see what your friends are playing/watching/learning" — the taste graph drives engagement more than algorithmic recs.
- The "Want to read" / "Currently reading" / "Read" shelf system is a strong reference for NUX's content state model: "Want to watch", "In progress", "Finished". Expose these states on cards (a small bookmark icon or coloured indicator).
- Community reviews are front-and-centre — average rating + number of reviews on every card. NUX should show community engagement signals on cards (not just critic scores): "4.2 · 1,840 notes".
- Genre tags + lists ("Best Books of 2024", "Staff Picks") map well to NUX's editorial curation layer — human-curated lists alongside algorithmic recs.

### Khan Academy (`khanacademy-home.png`)
- Uses a **subject-first hierarchy**: Mathematics > Algebra > Quadratic equations. Clean, functional, low-visual-noise. Good reference for NUX's internal navigation within the learning/course content type.
- Progress bars and completion percentages are the primary UI motif for logged-in users — habit formation and streak mechanics are baked in at the structural level, not bolted on.
- Mastery indicators (green/yellow/grey) on subject tiles show knowledge state at a glance. NUX's course layer could use a similar "started / in progress / completed" colour system on course cards.
- The palette is calm: white, pale grey, Khan green (#14BF96). The contrast with gaming stores is stark — educational content needs to feel accessible, not intimidating. NUX should modulate its dark palette for the courses section to feel less like a game store.

---

## 5. Card Grids: Aspect Ratios, Info Density, Hover States

| Platform | Card Ratio | Info Density | Hover |
|---|---|---|---|
| Epic Games | ~2:3 (portrait box art) | Low (title + price) | Subtle scale + glow |
| Nintendo | ~2:3 portrait | Medium (title + price + badges) | Scale + shadow |
| itch.io | Mixed (~3:2 landscape dominant) | High (title + author + tags + price + community count) | None observed |
| Twitch | 16:9 landscape | Medium (title + streamer + game + viewers) | Autoplay preview |
| YouTube | 16:9 landscape | Medium (title + channel + duration + views + age) | Autoplay preview |
| MasterClass | ~3:2 landscape | Low (instructor name + subject) | Subtle overlay with CTA |
| Khan Academy | ~16:9 or square | Low (subject title only) | Highlight ring |
| Goodreads | ~2:3 portrait (book cover) | Medium (title + author + rating + shelves) | Scale |

**Key takeaways for NUX card design:**
- **Use content-type-native ratios:** 2:3 for games (box art convention), 16:9 for films/docs/streams, square or 1:1 for courses/instructors.
- **Layer info hierarchy:** Always show title. On hover or in expanded state: show duration, creator, theme tags, community signals.
- **Autoplay hover** (Twitch/YouTube pattern) is now table-stakes for any video platform. Must implement.
- A **thin coloured bar** at the card bottom for content-type signalling: e.g., purple = game, amber = course, blue = film, green = documentary.

---

## 6. What NUX Can Borrow for Game and Course Cards Specifically

### For Game Cards
- **Epic's dark premium feel** — near-black card backgrounds, high-contrast title typography, white price pill.
- **itch.io's tag density** — show 2–3 narrative theme tags directly on the card (not just genre). "Cyberpunk · Identity · Open World".
- **Twitch's live viewer count** — for NUX Watch Party or live game events: show "X watching now" badge.
- **Goodreads' shelf state** — a small indicator for "Want to play", "Playing", "Played".
- A **difficulty or time-to-complete** indicator borrowed from course card conventions: "~40h to complete" for RPGs, "~6h" for indie games.

### For Course Cards
- **MasterClass's instructor-as-hero** approach — large instructor portrait, name first, topic second.
- **Khan Academy's progress indicators** — show lesson count, total duration, and a completion ring or bar.
- **Goodreads' social signals** — "47 friends completed this", star rating, community notes count.
- Keep cards **brighter/lighter** than film/game cards to signal "active learning" vs passive consumption — a subtle but important UX signal.

---

## 7. Surprising and Inspiring Observations

- **itch.io is the most theme-forward catalogue** of all eight. Its tags are narrative and cultural ("atmospheric", "story rich", "surreal", "emotional") not just technical. This is exactly the taxonomy NUX needs to build cross-media "mood" browsing. A user browsing "surreal" should land on both a David Lynch film and a game like Disco Elysium.

- **MasterClass hides the subject behind the instructor** — completely the opposite of Khan Academy. This is a deliberate prestige signal: you're not buying a SQL course, you're learning writing from Malcolm Gladwell. NUX can use this duality: for premium/prestige content, lead with the creator. For functional/educational content, lead with the outcome.

- **None of these platforms do cross-media recommendations.** Not one. If you watch a film about AI on YouTube, it will never recommend an AI course from Coursera or an AI-themed game. This is NUX's unique opportunity — the whitespace is enormous. The UI pattern (a "More on this theme" row spanning formats) doesn't exist anywhere and would be instantly recognisable as NUX's signature.

- **Twitch's "Categories" browse page** (where you pick a game to watch, not a streamer) is structurally identical to a game store — but the intent is entirely different (passive watching vs active playing). NUX sits at this exact intersection and needs UI that signals which mode the user is in at all times.

- **Goodreads reviews are longer and more literary than Letterboxd** — they're essays, not reactions. For NUX's "notes" feature, the tone should be tuned per content type: quick reaction emojis for games, longer written notes for films, structured reflections (what I learned, what I'd apply) for courses.

- **YouTube's duration transparency** (visible on every thumbnail, before you click) is underrated. Users make sub-second decisions based on "2:14" vs "47:22". NUX must show duration on all cards — it's the primary commitment signal for a serious viewer.

---

## Files in This Directory

| File | Source |
|---|---|
| `epic-store.png` | https://store.epicgames.com |
| `nintendo-eshop.png` | https://www.nintendo.com/us/store/games |
| `itchio-home.png` | https://itch.io |
| `twitch-home.png` | https://www.twitch.tv |
| `youtube-home.png` | https://www.youtube.com |
| `masterclass-home.png` | https://www.masterclass.com |
| `khanacademy-home.png` | https://www.khanacademy.org |
| `goodreads-home.png` | https://www.goodreads.com |

*Captured: June 2026 — for NUX cross-media platform design exploration.*
