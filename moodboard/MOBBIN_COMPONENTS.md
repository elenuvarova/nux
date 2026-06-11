# NUX — Mobbin Component References

UI components researched on Mobbin for NUX streaming platform.
All links open directly in Mobbin. Platform: web unless noted.

---

## 1. MODALS

### 1.1 Content Preview / Video Modal
| App | What it shows | Link |
|-----|--------------|------|
| Sora | Video playing inside a modal over blurred grid — close button top-right, title below | [view](https://mobbin.com/screens/edc7c19c-404e-4442-92bd-4b63cbf26d30) |
| Netflix | Actor filmography popup — dark overlay, back arrow, poster grid | [view](https://mobbin.com/screens/7d9ad7a1-c515-47f7-96d3-197206688249) |

**NUX use:** hover-expand card → quick-look modal with trailer + key metadata (director, year, runtime, badge).

---

### 1.2 Audio / Subtitle Selector Panel
| App | Notes | Link |
|-----|-------|------|
| Disney+ | Full-screen overlay, two-column Audio + Subtitles, checkmark on active | [view](https://mobbin.com/screens/ba592403-c509-43aa-be6d-010219faad37) |
| HBO Max | Bottom-anchored panel over video, subtitle + audio columns, "Customize in Settings" CTA | [view](https://mobbin.com/screens/4f237484-ad06-412f-af3f-aa426a5e94e0) |
| Prime Video | Inline dropdown over video, split Subtitles / Audio columns | [view](https://mobbin.com/screens/891f7b0b-eded-4b51-9bd1-6f8ed4c57b69) |
| Netflix | Right-side panel, two columns, scrollable lists, minimal border separators | [view](https://mobbin.com/screens/ba441978-34a6-4b9e-8505-eebee1e06272) |
| Netflix (alt) | Same layout with active subtitle shown | [view](https://mobbin.com/screens/a595ab83-a782-4d92-884f-38360dfd2e62) |
| HBO Max (alt) | With English CC selected state | [view](https://mobbin.com/screens/d154587e-a1bd-4f95-b031-8edcd74b1f39) |

**NUX use:** player settings panel — audio track + subtitles. Lean toward Disney+/Netflix two-column approach on dark bg.

---

### 1.3 Subscription / Paywall Upsell Modal
| App | Notes | Link |
|-----|-------|------|
| Cosmos | Dark card on black, checklist of features, single CTA button, Cancel text link below | [view](https://mobbin.com/screens/fa5af7b8-233e-41c8-bbd5-160744952442) |
| Cosmos (alt) | Variant with fewer features listed | [view](https://mobbin.com/screens/b474e2d5-256a-47d6-8a85-bec1882b049c) |
| Grok | Monthly/Yearly toggle at top, feature list, bold CTA pill | [view](https://mobbin.com/screens/9ebb30e1-1452-4161-a7e8-864295b74804) |
| Spline | Payment modal — billing toggle Yearly/Monthly, total row, card selector | [view](https://mobbin.com/screens/5393ddf4-7f1c-4d63-99c9-50a47e35ea30) |
| Mobbin | Centered modal, Pro tier highlighted, feature checklist, free trial CTA | [view](https://mobbin.com/screens/8c330b43-b179-4540-a747-aa2812a5a24d) |

**NUX use:** upsell overlay when free user hits paywall (e.g. tries to watch premium title).

---

### 1.4 Confirmation / Destructive Action Dialog
| App | Notes | Link |
|-----|-------|------|
| Luma AI | Small centered dialog, dark rounded card, "Delete" red + "Close" neutral buttons | [view](https://mobbin.com/screens/b2f3e086-827d-4567-bd62-90d3d8c65265) |
| FLORA | Minimal "Are you sure?" — Cancel + Delete (red text), no heavy chrome | [view](https://mobbin.com/screens/a25794b9-8a96-4951-a29a-ec25419a9efd) |
| PlayAI | "Cancel Subscription" — No / Yes (red), explanatory text body | [view](https://mobbin.com/screens/25075a5b-2ec1-4d5e-915f-b3875b025810) |
| Slack | "Delete message" — preview of content being deleted inside modal body | [view](https://mobbin.com/screens/4a6ea685-1ecd-4d25-aaac-937f84418395) |
| Runway | "Delete Model" — neutral Cancel + red Delete, small centered card | [view](https://mobbin.com/screens/d6ff7db4-b1ad-45de-8484-08e24b69c163) |

**NUX use:** remove from watchlist, cancel subscription, delete history.
Pattern: neutral secondary + destructive primary. Keep body copy to one sentence.

---

### 1.5 "Add to List" / Collection Modal
| App | Notes | Link |
|-----|-------|------|
| Suno | "Add to Playlist" — list of existing playlists with thumbnails + "Create Playlist" inline input at bottom | [view](https://mobbin.com/screens/099e2baa-a628-411e-a1ba-afc12d4f6e1f) |
| Suno (feed) | Same modal triggered from feed context | [view](https://mobbin.com/screens/8d110104-dccb-4a1e-be5a-5b7e2bbfbd1c) |

**NUX use:** "Add to Watchlist" → pick list or create new one.

---

### 1.6 Share Modal
| App | Notes | Link |
|-----|-------|------|
| Suno | Social icons row + copy link input — dark overlay | [view](https://mobbin.com/screens/cacdeacc-15a4-4fe5-b037-dba9f648e968) |
| Epidemic Sound | Toggle "Enable public link" + Copy link + Preview buttons, toast on copy | [view](https://mobbin.com/screens/c557a16c-730d-4bb8-99b4-1d2495f3ffd2) |
| YouTube Music | Share modal + "Invite collaborators" — link copy with blue highlight | [view](https://mobbin.com/screens/de4e81c5-53f1-4c32-a2d7-89db012c3b26) |

---

### 1.7 Rating / Review Modal
| App | Notes | Link |
|-----|-------|------|
| Fireflies | Star rating — 5 stars on dark card, no text required | [view](https://mobbin.com/screens/d2d68b89-3d91-4e63-bef4-ae310cd6c202) |
| Whop | "Leave a review" — star selector + text input, Submit button | [view](https://mobbin.com/screens/ff9358f7-2ceb-4055-8c23-2892839a85f6) |
| DoorDash | Post-action rating — star row + highlight chips + text area | [view](https://mobbin.com/screens/e41dea17-ba24-443b-b585-092e6efb7b93) |

**NUX use:** "Rate this film" after watching.

---

## 2. DROPDOWNS & CONTEXT MENUS

### 2.1 Card Overflow / Three-Dot Context Menu
| App | Notes | Link |
|-----|-------|------|
| Spotify | Track context menu — Add to queue, Remove from profile, Edit details, Delete, Exclude from taste, Move to folder, Share, Open in Desktop | [view](https://mobbin.com/screens/a01b0b2c-de8c-4231-8cc9-3ff45bbb077c) |

**NUX use:** `···` on content card → Add to Watchlist / Share / Mark as Watched / Not interested.
Pattern: icon + label rows, 8px radius popover, subtle border.

---

### 2.2 Inline Option Dropdown (small)
| App | Notes | Link |
|-----|-------|------|
| Sora | Orientation picker: Portrait / Landscape — small popover attached to button | [view](https://mobbin.com/screens/d5fb8ede-f087-4520-8fcb-a3baad9ec698) |
| Sora | Duration picker: 15s / 10s — same small popover, checkmark on active | [view](https://mobbin.com/screens/5d9f3f3c-ceb0-47c2-b8d5-0244390f32b4) |
| Sora | Filter by type dropdown on feed | [view](https://mobbin.com/screens/bd1e85a8-6447-4703-9c5e-0499e9b80668) |

**NUX use:** sort dropdown (Newest / Rating / Alphabetical), quality picker.

---

### 2.3 Filter / Sort Panel (sidebar or drawer)
| App | Notes | Link |
|-----|-------|------|
| MasterClass | Left sidebar panel: Format (Classes/Playlists/Sessions), My Content, Duration — collapsible sections, checkbox style | [view](https://mobbin.com/screens/2cf49678-d01f-4d21-aaed-66ff2156a2df) |
| MasterClass (loading) | Skeleton state of same filter panel | [view](https://mobbin.com/screens/5a11df1b-05bc-425c-9edd-97c9de4c3514) |
| Cosmos | Filter chips: Type (All / Images / Videos / Links / Tweets / Notes) | [view](https://mobbin.com/screens/2cca4472-e356-4907-a203-0da9c2380f31) |

**NUX use:** browse page filter drawer — Genre, Year, Media Type (Film/Doc/Game/Course), Duration, Language.

---

## 3. PROFILE SWITCHER ("Who's Watching?")

| App | Notes | Link |
|-----|-------|------|
| Prime Video | Circular avatars, centered layout, "Edit profile" button | [view](https://mobbin.com/screens/e209b337-ee30-42fb-8436-50988d7c1960) |
| Prime Video (manage) | Edit mode — pencil icon under each avatar | [view](https://mobbin.com/screens/efbaf720-95b7-4202-8cd8-55e07fb025ad) |
| Netflix | Square tile avatars with label below, "Add Profile" + ghost | [view](https://mobbin.com/screens/9b0cfc61-f627-4691-b3a8-b4ea35110aad) |
| Netflix (2 profiles) | Fewer profiles variant | [view](https://mobbin.com/screens/199b430d-6faf-4d68-8a0a-0e9096e4e9f0) |
| Disney+ | Round avatars, lock icon on PIN-protected profile | [view](https://mobbin.com/screens/de1c3e16-f24b-4dfd-b343-cbdfc09403a1) |
| HBO Max | Initial-letter avatars with colored ring, Add Adult / Add Kid split CTAs | [view](https://mobbin.com/screens/8a36869b-9d90-42a5-84bc-368c4a407e2f) |

**NUX use:** multi-profile household feature (v2). HBO Max "Add Adult/Kid" split CTA is cleanest for family plans.

---

## 4. EMPTY STATES

| App | Context | Link |
|-----|---------|------|
| OpenSea | "No results found" — centered icon + heading + "Clear filters" CTA | [view](https://mobbin.com/screens/5f1ea200-3f67-424c-adb8-7adf6cfde08c) |
| OpenSea (filters) | Same with active filter tags shown above | [view](https://mobbin.com/screens/45a834a8-d95b-43fe-8420-7f0660bb528b) |
| Modal | "No live apps" — minimal icon + message, search context | [view](https://mobbin.com/screens/bd558200-3ce2-4d87-bc15-692172e14855) |
| NordVPN | "We couldn't find X" — search empty state, dark sidebar | [view](https://mobbin.com/screens/dabd436a-dc28-44ee-a83a-5bea34560a47) |

**NUX use:** empty watchlist, no search results, no titles in genre.
Pattern: centered illustration/icon + 1–2 line message + optional CTA ("Browse all films").

---

## 5. TOASTS & NOTIFICATIONS

### 5.1 Success Toast
| App | Notes | Link |
|-----|-------|------|
| Sora | Top-right pill: "✓ Saved username" — white on dark, minimal | [view](https://mobbin.com/screens/7d21ca74-eb92-4e2a-a325-18e5b796ef15) |
| Epidemic Sound | Bottom-right: "✓ Public link copied to clipboard" — white card, green check | [view](https://mobbin.com/screens/c557a16c-730d-4bb8-99b4-1d2495f3ffd2) |
| Posh | Bottom-right: "✓ Successfully updated group settings" — green pill | [view](https://mobbin.com/screens/612d122e-4ca7-427e-8883-d5586d3f0b79) |

### 5.2 Error Toast
| App | Notes | Link |
|-----|-------|------|
| Posh | Bottom-right red pill: "Invalid current password." | [view](https://mobbin.com/screens/179e0c63-6c0c-4289-b7ba-fb05d7d428d7) |
| Chronicle | Bottom-right: "⊘ Unable to upload file. Please try again." — dark bg | [view](https://mobbin.com/screens/2d33a8a0-148c-4278-9a39-344fc0f1bd29) |

### 5.3 Info / Status Banner
| App | Notes | Link |
|-----|-------|------|
| Better Stack | Green success banner inline in page body — "Status report was successfully created" | [view](https://mobbin.com/screens/4c01167d-1db7-4d92-822a-01e107afba61) |
| Better Stack | Same page, secondary variant | [view](https://mobbin.com/screens/6c8b7528-f19e-4db8-b86c-12dd14f8be68) |

**NUX use:** "Added to watchlist ✓", "Removed from list", "Playback error — try again".
Pattern: top-right corner pill, 3–4s auto-dismiss, no close button needed for success.

---

## 6. SKELETON LOADERS

| App | Notes | Link |
|-----|-------|------|
| Fabric | Split layout skeleton — sidebar + main content area, light grey bars | [view](https://mobbin.com/screens/46846b8b-226e-4952-a05a-97f5b7bb11a1) |
| Sprig | Card grid skeleton — 3-column, rect placeholders with metadata line stubs | [view](https://mobbin.com/screens/8ced8c3a-e24e-4d93-92f7-abd1f3f374a3) |

**NUX use:** home page rows, browse grid while fetching. Use CSS `@keyframes shimmer` on `background-position`.

---

## 7. CONTENT CARDS & ROWS (grid/list reference)

| App | Notes | Link |
|-----|-------|------|
| Netflix | Horizontal rows — hero + 6-card rows with category labels | [view](https://mobbin.com/screens/370f7bf3-22ab-4ecf-b9e8-b4bd76c01ca8) |
| MasterClass | Horizontal lesson list — thumbnail + title + metadata inline | [view](https://mobbin.com/screens/0a3d6160-ecf0-4717-9e80-6110faf90c21) |
| MasterClass | 3-col card grid with hover-ready thumbnails | [view](https://mobbin.com/screens/ca8c57d1-a3ac-4335-bc4d-7963aa76feef) |
| HODINKEE | Video grid — label over image, Most Recent / Popular tabs | [view](https://mobbin.com/screens/848d1ef1-eae7-4de5-bcd7-cfdf8c12ed23) |

---

---

## 8. HERO BANNER & HOME LAYOUT

| App | Notes | Link |
|-----|-------|------|
| HBO Max | "Banshees of Inisherin" — full-bleed hero, left-anchored title + "Must-Watch" editorial tag, gradient overlay, horizontal genre filter chips row below | [view](https://mobbin.com/screens/4084be8b-6016-443e-a977-b05d1a66365e) |
| HBO Max | "Black Adam" premiere — same dark-hero pattern, editorial subtitle, poster row cards below | [view](https://mobbin.com/screens/85e307a8-9084-4706-acdf-43b9adf00e40) |
| Disney+ | Tabbed hero: "For You / Disney+ / Hulu" tabs overlay hero, horizontal recommendations below | [view](https://mobbin.com/screens/a293f37f-86c9-48e7-8b1f-ad115948c119) |
| HBO Max | "Critical Favorites" editorial section — Jeanne Dielman, Citizen Kane, Tokyo Story, In the Mood for Love — editorial label + poster grid | [view](https://mobbin.com/screens/fb25ea40-af9f-4353-8671-01f43a942374) |

**NUX use:** editorial "Film of the Week" hero with handwritten editorial tag. HBO Max "Critical Favorites" is the closest Criterion-aesthetic reference on Mobbin.

---

## 9. HORIZONTAL SCROLL ROWS

| App | Notes | Link |
|-----|-------|------|
| Hulu Originals overlay | Category rows: Newly Released / Popular / Drama / Comedy with "VIEW ALL ›" links — labeled row pattern | [view](https://mobbin.com/screens/0e54a523-aaf4-49af-a7d0-86fe9fc2ca15) |
| Disney+ | "Recommended For You" + "You May Also Like" — dual labeled rows on dark bg | [view](https://mobbin.com/screens/a7e6c6c5-9859-4708-971b-087fa8cbe17f) |
| Netflix | Rows with "Recently Added" + "New Season" badge chips on poster cards | [view](https://mobbin.com/screens/d52b6f4c-b581-43a4-aa9b-3f7714a90d35) |
| Paramount+ | "Top 10 Shows Now" — large rank numerals behind cards (1–10) | [view](https://mobbin.com/screens/618e7a67-ed7d-49ae-b208-0231c0f42627) |
| Telescope | Dark editorial feed — labeled collection rows: "Fashion Colombia / 21 recs", "Playlists / 3 recs" — curator name + timestamp | [view](https://mobbin.com/screens/6f2caaa4-a70d-4daa-9ed9-46dc9489be75) |

**NUX use:** Telescope's curator-labeled rows are closest to the editorial row model (row label = curated list name, not just a genre).

---

## 10. FILM DETAIL PAGE

| App | Notes | Link |
|-----|-------|------|
| HBO Max | "Black Adam" — full-bleed hero, metadata strip (2HR 4MIN · PG-13 · 2022 · HD · 5.1), ▶ Play + + buttons, synopsis, Extras row below | [view](https://mobbin.com/screens/82df4006-c936-47de-8a0b-f157601fa2e1) |
| Disney+ | "Percy Jackson" — sticky header, tab row: EPISODES / SUGGESTED / EXTRAS / DETAILS | [view](https://mobbin.com/screens/9e3722ed-0da1-4aee-8abc-c657df4207fc) |
| Disney+ | Details tab — cast, creator, format badge chips (4K ULTRA HD · Dolby Vision · HDR10 · Dolby Atmos · CC · AD) | [view](https://mobbin.com/screens/b92524bf-9bef-4a2d-864f-2078524d3c0c) |

**NUX use:** Disney+ "Details" tab has the best format/quality badge chip system — reference for NUX media-type badges (Film / Doc / Game / Course) and technical specs (4K, HDR, CC).

---

## 11. ONBOARDING / TASTE QUIZ

| App | Notes | Link |
|-----|-------|------|
| Suno | "Select genres" — pill chip grid on dark radial-gradient bg, 4-step progress dots, Continue CTA | [view](https://mobbin.com/screens/efbcdc1c-14f1-4b8b-abb4-cbf69cf3cfee) |
| Netflix | "Choose 3 you like" — poster grid scroll, "Pick 3 to Continue" sticky footer CTA, step counter top-left | [view](https://mobbin.com/screens/b9ac79d9-47cd-4ae0-bf5c-e4e98f5f959d) |
| Paramount+ | Genre tab filter + poster grid, circular radio checkbox on each card, "NEXT (0)" sticky CTA | [view](https://mobbin.com/screens/e5cdfee3-7d73-4e7c-be3f-845106651d13) |
| Hulu | "Choose 3 or more interests" — large image cards: category name + example titles, heart-icon tap to select | [view](https://mobbin.com/screens/eac88d39-356f-4ebd-9bcc-4aa783301640) |

**NUX use:** Hulu's image-category cards are the best model for NUX — they teach taste by showing real examples ("Emotional TV Dramas — The Handmaid's Tale") not just genre names. Suno chips are best for a fast genre-picker step.

---

## 12. SEARCH & TYPEAHEAD

| App | Notes | Link |
|-----|-------|------|
| Prime Video | Dark centered modal search, plain text suggestion list, "Clear" action | [view](https://mobbin.com/screens/8426c3f5-a3c0-420e-b84e-8eee8f3fba5d) |
| MasterClass | Suggestions with thumbnail + instructor name + course title — instant entity results | [view](https://mobbin.com/screens/3f212367-6ef6-45f0-ac4d-80f7f8ff461a) |
| Epidemic Sound | Grouped dropdown: text completions at top, then entity rows with icon + type label (Genre / Artist) | [view](https://mobbin.com/screens/4d70e651-4315-461e-a351-4392a793ff4d) |
| Paramount+ | Search results page — horizontal scroll related-search chips at top, then result grid with count | [view](https://mobbin.com/screens/44a82712-f6ba-423e-9911-3a4d61511256) |

**NUX use:** MasterClass is the reference — show director/actor thumbnail + role when matching a person (not just film titles). Epidemic Sound's grouped sections (text completions → entities) work well for NUX's mixed content types.

---

## 13. PRICING / SUBSCRIPTION PAGE

| App | Notes | Link |
|-----|-------|------|
| Suno | 3-col dark pricing: Free / Pro / Premier, "Most Popular" heart badge, feature checklist, annual vs monthly | [view](https://mobbin.com/screens/3cc7d72a-4abb-4e96-84f1-1fad5abf3e06) |
| FLORA | 3-col dark: Pro / Agency / Enterprise, per-card yearly toggle, "Get Agency" green accent CTA | [view](https://mobbin.com/screens/ba9e1ca7-8dc2-4eb2-a603-603415c27e81) |
| Epidemic Sound | Dark 3-col: Personal / Commercial / Enterprise, Add subscription + Read more CTAs, annual billed note | [view](https://mobbin.com/screens/d9303ca3-4db1-454a-b61f-7161ae2df6a8) |
| Savee | "Upgrade your workflow" — 25% countdown timer, Pro / Pro+Site / Teams, "Popular" chip on mid tier | [view](https://mobbin.com/screens/239f802c-f2ee-4949-bec0-767bdda61661) |

**NUX use:** Suno and Epidemic Sound are cleanest. Key: feature checklist + annual toggle + "Most Popular" highlight on mid tier. NUX likely has just 1 paid tier (simple pricing = anti-dark-pattern).

---

## 14. VIDEO PLAYER

| App | Notes | Link |
|-----|-------|------|
| Disney+ | Minimal: title+ep top-left, scrubber bottom edge, ⏮ ↺10 ⏸ ↻10 ⏭ center, 🔊 + ⛶ top/bottom-right | [view](https://mobbin.com/screens/7c610d5b-c022-40f7-bd2c-0dde8ad9d2f3) |
| Netflix | Red scrubber, thumbnail preview on hover, episode title center, "Next Episode" ⏭ icon right side | [view](https://mobbin.com/screens/cf0503da-f098-434c-aa4c-a63e38514cff) |
| Hulu (Shōgun) | Ultra-minimal bar: title left, "UP NEXT" pill inline, ▶ ↺ ↻ ⏮ 🔊 icons, scrubber at very bottom edge | [view](https://mobbin.com/screens/5efc4499-4a12-47fe-924f-41c7b79d2eac) |
| Paramount+ | Scrubber with thumbnail preview on hover (chapter preview inset) | [view](https://mobbin.com/screens/481a1495-11e7-4f02-8d6f-ef961a12386b) |
| HBO Max | Vertical volume slider on right side (unusual) + ↺15 ⏸ ↻15 controls | [view](https://mobbin.com/screens/69bbce68-27c7-44ee-84a3-cb1e46e5c09b) |

**NUX use:** Hulu/Disney+ minimal bottom-only controls. Must-have: thumbnail scrubber hover preview, skip-intro button, chapter markers for documentary sections.

---

## 15. NEXT EPISODE / END CARD

| App | Notes | Link |
|-----|-------|------|
| Netflix | "Watch Credits" + "Next Episode ▶" bottom-right CTA buttons, credits rolling in background | [view](https://mobbin.com/screens/9814a73d-fae5-4949-b09e-0111caf84324) |
| Netflix | "Next Episode" inset card bottom-right: ep# + title + synopsis — appears during last minutes | [view](https://mobbin.com/screens/8ec68070-7b32-4b0f-9840-a7a1c53a0046) |

**NUX use:** Give user a visible choice (Watch Credits vs Next) rather than auto-forwarding. Anti-dark-pattern: no countdown timer forcing next episode.

---

## 16. CONTINUE WATCHING ROW

| App | Notes | Link |
|-----|-------|------|
| MasterClass | "Keep Watching" — instructor avatar + class name + "19 Lessons Left", progress bar on thumbnail, Resume CTA button, overflow menu (Remove from Progress / Go to Details) | [view](https://mobbin.com/screens/f7019880-91f3-42f0-a677-ac7452f1d4de) |
| Udemy | "Jump right in" — single-card resume: thumbnail + title + "Your progress" bar + Start course CTA | [view](https://mobbin.com/screens/e812deb1-1c01-48c1-a62c-78d3f802baee) |

**NUX use:** MasterClass model — progress bar at bottom of thumbnail, "X% watched" text, Resume button. Overflow: Remove from Continue Watching.

---

## 17. SETTINGS PAGE

| App | Notes | Link |
|-----|-------|------|
| Savee | Dark settings: Feed section (autoplay toggle, curation toggle), Emails section (two toggles), Backup, Data Export | [view](https://mobbin.com/screens/6d21145f-9d4d-44d6-bf44-57cff63e898d) |
| GitBook | Account: email/password fields, 3rd-party auth (Google/GitHub), Preferences (theme picker), Account actions (Delete account danger zone) | [view](https://mobbin.com/screens/2a1db15b-baf9-4d94-930b-c3de7adc3ebb) |
| Adaline | Theme picker — Light/Dark thumbnail card selector + Update button | [view](https://mobbin.com/screens/c331367a-18fc-4b71-980e-a13993fa4457) |

**NUX use:** NUX needs a "Preferences" section: autoplay toggle (OFF by default — anti-dark-pattern), subtitle language defaults, theme (Light/Dark), language. Adaline's visual theme-card picker is the cleanest reference.

---

## 18. EDITORIAL / MAGAZINE LAYOUT

| App | Notes | Link |
|-----|-------|------|
| The New Yorker (Film Stories) | Section landing — article list: category tag (REFLECTIONS) + issue date + headline + author + thumbnail, serif type on white | [view](https://mobbin.com/screens/e9a2169e-55ba-48bd-b7f0-f1f0c882d33c) |
| The New Yorker (Lost Highway) | Film page — full-width still image + MOVIES category chip + title + excerpt on dark bg | [view](https://mobbin.com/screens/c64dc520-b7dc-4105-b7d2-9794868bee6d) |
| Runway Watch | "AI Film Festival" editorial section — dark event banner + labeled content channel grid | [view](https://mobbin.com/screens/cde69846-cdb7-4243-873f-1901841a20ca) |

**NUX use:** The New Yorker "Lost Highway" card is the single best editorial card reference — category chip + large still + title + excerpt. This is the NUX "Editor's Pick" card pattern.

---

## Summary: Key Patterns for NUX

| Component | Recommended reference |
|-----------|----------------------|
| Audio/subtitle panel | Netflix 2-column, dark bg, checkmark active state |
| Paywall modal | Cosmos — dark card, checklist, single CTA + text cancel |
| Destructive confirm | FLORA / Runway — minimal, no heavy chrome |
| Card context menu | Spotify — icon + label rows, 8px radius popover |
| Filter sidebar | MasterClass — collapsible sections, checkbox style |
| Profile switcher | Netflix tile grid or HBO Max (if kid profiles needed) |
| Empty state | OpenSea — icon + heading + clear-filters CTA |
| Success toast | Sora pill (top-right, 3s dismiss) |
| Error toast | Posh red pill (bottom-right) |
| Skeleton loader | Sprig 3-col card grid pattern |
| Hero banner | HBO Max "Critical Favorites" editorial section |
| Horizontal rows | Telescope curator-labeled rows (editorial model) |
| Film detail page | Disney+ tabbed (Episodes / Suggested / Details) |
| Media type badges | Disney+ "Details" tab format chips |
| Onboarding taste quiz | Hulu image-category cards (shows examples, not just genres) |
| Search typeahead | MasterClass (entity thumbnails + role in suggestions) |
| Pricing page | Suno / Epidemic Sound 3-col dark, feature checklist |
| Video player | Hulu/Disney+ minimal bottom bar |
| Next episode card | Netflix bottom-right inset (user choice, no autoplay force) |
| Continue watching | MasterClass — progress bar + Resume CTA + remove overflow |
| Settings | GitBook layout + Adaline visual theme picker |
| Editorial card | The New Yorker "Lost Highway" — chip + still + title + excerpt |
