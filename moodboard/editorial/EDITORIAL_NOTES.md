# Editorial Moodboard — Design Notes for NUX
*Captured: June 9, 2026*

---

## 1. The New Yorker — `newyorker.png`
**URL:** https://www.newyorker.com

### Typography
- Wordmark uses a custom high-contrast serif with extreme thin/thick stroke contrast — pure editorial authority.
- Body text uses a compressed, high-quality serif at very small tracking with generous leading. No decorative fonts, zero frivolity.
- All-caps labels in very small, widely-tracked sans-serif for category tags — creates a sharp editorial hierarchy without size.
- Type scale is conservative but deliberate: the hero headline is only ~2–3× body size, not screaming, confident.

### Layout & Grid
- Strict three-column editorial grid for article listings.
- Full-bleed photography used as editorial statements, not decoration — close-cropped faces, black and white, high grain visible.
- Enormous negative space in hero — content placed low, letting imagery breathe above.

### Dark Mode
- The default presentation is black background (#0a0a0a) with white type — not "dark mode" as a toggle but as editorial identity. The darkness is *the aesthetic*, not an option.
- Contrast is extreme: pure white text on near-black, no grey intermediaries.

### What's "Next Level"
- The cookie consent modal itself is visually coherent with the site brand — dark background, white text, same serif treatment.
- Photography is used as texture, not illustration — it conveys gravitas, not engagement-bait.
- Horizontal rules (thin 1px lines) structure the page, doing the work that whitespace does elsewhere.

### NUX Application
- Use an extreme-contrast near-black (#0d0d0d) as the primary surface, not a softened dark grey.
- Typography hierarchy through weight and tracking alone — avoid relying on color to differentiate levels.
- Treat imagery at full-bleed like editorial spreads, not card thumbnails.

---

## 2. Pitchfork — `pitchfork.png`
**URL:** https://pitchfork.com

### Typography
- Wordmark: custom condensed sans-serif, all-caps, very heavy weight — aggressive and confident.
- Navigation: small caps, tight tracking, medium weight — completely different register from the wordmark.
- Article titles use a tall, condensed serif for music editorial prestige.
- Red (#e72b2b) used exclusively for the Subscribe CTA — one accent, maximum restraint elsewhere.

### Layout & Grid
- Two-column content split: primary feature article left (large image + headline), secondary list right.
- Section headers use horizontal ruled lines above and below — creates document-like structure.
- Card borders are absent — content is separated by whitespace and typography weight alone.

### Dark Mode
- Default is white background with off-black text, but the dark elements (black nav bar, black cookie banner) show how Pitchfork handles darkness: near-black (#111) not true black, warm tint.

### Color Accent Usage
- Red used only for the SUBSCRIBE button — maximum impact, zero dilution.
- Category labels use the same red as micro-dots/bullets.
- Everything else is black, white, and grey.

### What's "Next Level"
- The masthead (wordmark centered in the nav) is a statement — symmetry communicates legacy and authority.
- Music imagery bleeds to the edge of cards, no padding, no rounded corners.
- Artist photography treatment: never cropped to a circle or thumbnail — always editorial framing.

### NUX Application
- One single accent color, used nowhere else — when NUX needs urgency, it should feel like that Pitchfork red.
- Condensed weight for display text creates cinematic tension — consider a condensed variant for hero headlines.

---

## 3. New York Times — `nytimes.png`
**URL:** https://www.nytimes.com

### Typography
- The NYT masthead (Cheltenham-derived custom serif) is the single most recognized newspaper wordmark — the typography alone carries weight before a single article is read.
- Body text at ~15px with 1.7 line-height — exceptionally readable, European spacing.
- Article headlines are set in a sharp transitional serif with visible ink-trap details at small sizes.
- Bylines and metadata in a grotesque sans at tiny sizes — clean information hierarchy.

### Layout & Grid
- The "front page" grid mirrors a broadsheet layout: one dominant story (spanning 3 cols), two secondary, smaller tertiary items below.
- No cards, no borders, no shadows — pure typographic grid, content floats in white space.
- Date and weather information in the utility bar is set at 11px — the density of editorial publications without feeling cluttered.

### Dark Mode
- NYT is predominantly light (intentional — mimics newsprint). The dark elements are the navigation bar and subscription CTAs.
- CTA button color is solid blue (#326891) — confidence, not trend-chasing.

### What's "Next Level"
- The logo/masthead occupies the optical center of the navigation, with utility tools symmetrically flanking it — near-perfect compositional balance.
- The cookie consent modal preserves the brand language: same serif, same hierarchy — even legal UX feels NYT.

### NUX Application
- Adopt the "broadsheet" grid for content browsing: one dominant item, two secondary, several tertiary — avoid uniform card grids that flatten hierarchy.
- Don't fight the content — let headlines and images create the visual weight, not UI chrome.

---

## 4. Apple iPad — `apple-ipad.png`
**URL:** https://www.apple.com/ipad/

### Typography
- SF Pro Display at enormous weights for hero text — the font changes apparent weight based on size, so the headline at 80px reads completely differently than the same font at 16px.
- Category labels ("Explore the lineup") are always subdued: medium weight, grey (#6e6e73), smaller than you'd expect.
- Product names ("iPad Pro", "iPad Air") use semibold — never bold, never light. Always precisely semibold.

### Layout & Grid
- Horizontal scroll carousels for product lineup — mimics the physical experience of comparing devices side by side.
- Section rhythm: full-width hero → product lineup carousel → comparison table → feature callout grid → accessories.
- Feature callout grid uses 2-up cards with full bleed imagery — each card is a cinematic still, not a product photo.

### Dark Mode
- Apple.com is predominantly light but masterfully handles dark sections: the dark sections use `#1d1d1f` (Apple's dark surface) not black.
- When dark sections appear, text goes to `#f5f5f7` — a softened off-white, not stark white.
- Transitions between light and dark sections are clean cuts, not gradients.

### Color Accent Usage
- Zero accent colors on the iPad product page — the product photography provides all color.
- CTAs are transparent grey pills with border — almost invisible until hovered.
- Apple's restrained approach: if you use no accent, every accent matters.

### What's "Next Level"
- Product photography fills the entire card — no padding, no background fill, image IS the card.
- The lineup comparison table shows all iPad models simultaneously with pixel-level alignment.
- "Get to Know iPad" feature grid: short-form film clips autoplay in cards, no controls visible.

### NUX Application
- Use `#1d1d1f` for NUX dark surfaces — it's warm enough to feel premium, dark enough to show off content.
- Hero text should be the thinnest readable weight of the display font at large sizes — don't use bold for hero text.
- Let content photography provide all color. Keep UI chrome colorless.

---

## 5. Apple TV — `apple-tvplus.png`
**URL:** https://tv.apple.com

### Typography
- SF Pro Text at dense sizes for show titles — readability at small sizes on large displays.
- Category navigation uses medium weight, small caps feel without actually using small caps — achieved through careful letter-spacing.
- Hero promotional text is set in SF Pro Display, extralight/thin at large sizes — cinematic lightness.

### Layout & Grid
- Full-bleed show artwork as hero — no chrome, no overlaid text, image IS the hero.
- Content rows: horizontal scroll strips organized by genre/collection — Netflix-derived but executed with more whitespace.
- The subscription modal (visible in screenshot) uses a two-column layout: Apple TV vs Apple TV+Peacock bundle — clean comparison.

### Dark Mode
- True dark: `#000000` background — pure black, not `#1d1d1f`. On TV, this makes show artwork appear to float.
- Text is pure white against black — no softening.
- The modal/overlay uses a slightly lighter dark (`#1c1c1e`) for layering — one step of depth.

### What's "Next Level"
- The background behind show artwork actively blurs and samples the dominant color from the artwork — ambient color effect.
- Show title typography disappears when artwork is present — the visual carries all weight.
- Sign-in modal is pure functional clarity: two options, one CTA each, bold benefit statement.

### NUX Application
- For any dark overlay/modal, use pure black backdrop + one step lighter dark for the modal surface.
- When displaying content cards (articles, projects), let the content image be the entire card surface — title overlaid as thin white text.

---

## 6. Rauno Freiberg — `rauno.png`
**URL:** https://rauno.me

### Typography
- Uses an extremely large, light-weight grotesque (appears to be a geometric sans, possibly custom) for the main bio — the letter-forms at this scale show optical corrections that cheap fonts lack.
- Text runs as a single continuous prose block, not a headline — anti-conventional for a portfolio.
- Tracking is tight at large sizes — this creates a magazine editorial feel vs. the open-tracked web-design norm.

### Layout & Grid
- The page appears mostly empty on load — enormous whitespace that forces focus onto the single content card.
- Cards appear to float on the grey-white surface — no shadows, just placement and scale.
- The yellow circle is a pure graphic form, not a UI element — decorative confidence.
- Horizontal card strip implies a timeline or catalog, cropped at the viewport edge (implicit scroll invitation).

### Dark Mode
- The site is light — an interesting counter to dark-mode trends. The light background makes the black typography feel like high-quality print.
- The yellow accent is the only color in the entire page — absolute commitment to restraint.

### What's "Next Level"
- The oversized geometric shape (yellow circle) as background graphic — not an illustration, not an icon, a pure form used as texture.
- The text wraps around/over the circle — text and graphic exist in the same plane, not layered z-stacks.
- Loading state: the page skeleton/progress indicator at top is a beautifully animated thin bar.

### NUX Application
- Consider using one oversized geometric form (circle, arc) as a page-level graphic element — not decoration but a compositional anchor.
- Letting a primary color element be purely abstract (not functional) signals design confidence.
- Cards that crop at the viewport edge without explicit "scroll" affordance feel natural and modern.

---

## 7. Notion — `notion.png`
**URL:** https://www.notion.com

### Typography
- Uses a custom sans (similar to Inter but with softer terminals) — feels approachable but precise.
- Hero headline "Meet the night shift." is medium weight, large, generous line-height — conversational not authoritative.
- Feature section headlines ("Keep work moving 24/7") are heavy weight with tight leading — creates urgency in dense feature lists.
- Body copy is 16–17px with generous line-height — excellent readability.

### Layout & Grid
- Hero: full-width product UI screenshot as the background, text layered below — inverts the usual hero/content relationship.
- Feature sections alternate text-left/image-right and text-right/image-left — classic but executed with precision.
- Feature cards in 2-up and 3-up grids — cards have subtle light borders, extremely rounded corners (16px+).
- Screenshot-heavy approach: every feature shown in context within the actual app UI.

### Dark Mode
- The hero section uses a dark blue/purple gradient background (#1a1a2e style) — not the standard dark mode treatment, a specific brand choice.
- Feature sections revert to white — the dark hero is an attention anchor, not a full dark-mode implementation.
- The AI feature section uses electric blue (#0073ff) accents — the one moment of bold color.

### What's "Next Level"
- Product screenshots are shown at an angle (3D perspective tilt) giving depth without actual 3D.
- The quote section ("Your AI everything app" / Forbes) uses massive type as a graphic element.
- Social proof logos (Bumble, Nike, etc.) shown in greyscale on colored background — keeps brand colors from competing.

### NUX Application
- Feature sections should show content in actual app context, not abstract icons — this dramatically increases comprehension.
- Consider tilted/perspective-transformed UI screenshots for depth in feature showcases.
- One "moment of color" in an otherwise restrained palette (like Notion's electric blue for AI) creates memory.

---

## 8. Linear Features — `linear-features.png`
**URL:** https://linear.app/features

### Typography
- Uses a custom modified sans (similar to Inter/Geist) throughout — clean, functional, zero decoration.
- "The system for modern product development" — center-aligned hero on dark background, semibold, enormous.
- Feature card titles are small (13–14px), medium weight, dimmed — this creates density without aggression.
- All secondary text is `#888` or similar mid-grey — extreme hierarchy through value (lightness), not size.

### Layout & Grid
- Dark grid: the background itself has a subtle dot grid pattern that fades from center — implies infinite workspace.
- Feature cards are 2-up in a tight grid with minimal gap — card surfaces are slightly lighter than background (`#1a1a1a` on `#0f0f0f`).
- Icon grid at the very top: app integration icons in a dissolved grid formation — shows ecosystem breadth cinematically.

### Dark Mode
- Best-in-class dark UI. Not a "dark mode toggle" — dark is the product's identity.
- Background: `#0f0f0f` (near-black, slightly warm).
- Card surfaces: `#141414`–`#1a1a1a` — two steps of elevation, barely perceptible.
- Text: pure white for headlines, `#888` for secondary, `#444` for decorative/disabled.
- Accent: yellow-green (`#f2f243` style) for the analytics graph — one warm accent in cold dark.

### Color Accent Usage
- Near zero color — the data visualization graph uses amber/yellow for contrast against the dark — this makes it feel like a live signal.
- The Linear mark/logo is white on black — no color identity at all.

### What's "Next Level"
- The icon grid formation (orbiting product integrations) is a signature animation — icons drift subtly, implying a living ecosystem.
- Feature cards show actual UI at small scale inside a dark device frame — the darkness of the card surface matches the app's own dark UI so the screenshot appears seamless.
- "Plan the present. Build the future." closing headline — tonal copywriting matches visual restraint.

### NUX Application
- This is the gold standard dark UI reference for NUX. Adopt: `#0f0f0f` base, `#141414` surfaces, `#1a1a1a` elevated surfaces.
- Show NUX UI screenshots inside dark frames on dark backgrounds — seamless, premium.
- One warm accent (gold/amber) for data, attention, or CTAs — everything else stays in the greyscale.

---

## 9. Cosmos — `cosmos.png`
**URL:** https://www.cosmos.so

### Typography
- Wordmark: small, light-weight, all-caps tracking — anti-hero, deliberately quiet.
- Tagline "Your space for inspiration" — medium weight, centered, enormous relative to the Cosmos label.
- No body copy visible at hero — the visual immediately communicates function.

### Layout & Grid
- The hero IS the product: images from the actual Cosmos boards float in a circular arrangement, fading at the edges.
- The floating image arrangement uses 3D depth cues (scale + opacity falloff) — images at the periphery are smaller and more transparent.
- The arrangement rotates slowly (implied from the screenshot positioning) — the page itself is the animation.

### Dark Mode
- Light background with very light grey (`#f5f5f5`) — almost white. The images provide all color and depth.
- This is an interesting choice for a "dark" visual board app — the landing page inverts what the product actually looks like.

### Color Accent Usage
- Zero accent color — the floating images from users' boards provide all color.
- CTAs: solid black pill button ("Sign up") + text link ("Get the app") — maximum contrast, zero decoration.

### What's "Next Level"
- The product demo IS the background — you see actual user-curated images floating around the tagline. No abstract placeholder screenshots.
- The image arrangement communicates "abundance" and "discovery" without any text.
- Fade-to-white at the edges focuses attention on center without a hard crop.

### NUX Application
- For content-heavy features, use actual user content as the visual demonstration — don't simulate it.
- A radial/circular arrangement of content items as hero visual is unexpectedly powerful.
- Fading content at the edge of the viewport (opacity + scale reduction) implies more beyond — editorial invitation.

---

## 10. Readymag — `readymag.png`
**URL:** https://readymag.com

### Typography
- The hero demonstrates its own product: oversized display type ("GO ARC") as a website created with Readymag — meta-demonstration.
- Multiple typefaces coexist (a feature showcase) — shows typographic range without describing it.
- The word "GRID" appears as a massive background text element — typography used as texture.

### Layout & Grid
- An explicit grid of example sites shown as a masonry/collage layout — each cell is a live-looking Readymag project.
- The layout grid itself is asymmetric — different cell sizes, some full-width, some quarter — demonstrates the platform's layout freedom.
- Visual density is high — nearly every pixel is occupied by content or example imagery.

### Dark Mode
- Mixed: the page uses both dark (black) and light (white) sections within the same scroll — dark sections showcase dark Readymag projects, light sections showcase light ones.

### Color Accent Usage
- Vivid, eclectic — multiple accent colors visible across different project thumbnails. This is intentional: Readymag celebrates visual variety.
- CTAs use an orange-red (#e63c14 style) — warm, attention-grabbing, different from the editorial coldness of other references.

### What's "Next Level"
- The hero uses the platform's own output as the hero graphic — "eat your own cooking" at the highest confidence level.
- Project thumbnails in the grid appear to be live or animated — not static screenshots.
- The "Design and launch outstanding websites" headline is set modestly below the fold after a full visual hero — text supports visual, not the reverse.

### NUX Application
- When showcasing NUX's own outputs, lead with the output itself — not a product screenshot of the tool.
- Using NUX-created content as marketing material creates the most authentic proof-of-concept.

---

## Cross-Site Synthesis: Recommendations for NUX

### The Premium Dark Standard
**Adopt Linear's dark system exactly:**
- Page background: `#0f0f0f`
- Card/surface: `#141414`
- Elevated/hover: `#1a1a1a`
- Primary text: `#ffffff`
- Secondary text: `#888888`
- Tertiary/disabled: `#444444`
- One warm accent: `#d4a827` (gold) or `#e8c060` (amber)

### Typography Stack
- Display/hero: A condensed or high-contrast serif for major headlines (New Yorker / Pitchfork influence) — or SF Pro Display extralight at 80px+ (Apple influence)
- Body: A geometric sans at 15–16px, 1.65 line-height (Notion/Linear)
- Labels/metadata: All-caps, wide-tracking, ~11px (NYT/Pitchfork)
- **Never use more than 2 typefaces. Never use a decorative font.**

### Editorial Layout Patterns
1. **Broadsheet hierarchy** (NYT): one dominant item, two secondary, several tertiary — not uniform card grids
2. **Full-bleed content cards** (Apple/New Yorker): image IS the card, no padding, no border-radius
3. **Whitespace as statement** (Rauno): vast empty space before content hits — trust it, don't fill it
4. **Dark card on dark background** (Linear): two-step elevation (`#141414` on `#0f0f0f`) — invisible seams

### Image Treatment
- Full-bleed, no rounded corners on hero/editorial images (New Yorker, Pitchfork, Apple)
- Perspective-tilt for product screenshots (Notion) — creates depth without 3D
- Ambient color sampling from content (Apple TV) — background reflects dominant image color
- Fading at viewport edges (Cosmos) — implies more beyond, editorial invitation

### Animation & Motion Principles
- No decorative animation — only purposeful (Linear's drifting icons, Cosmos's floating images)
- Scroll-triggered reveals should be subtle: opacity + slight Y translate, 300–400ms
- Hover states: immediate, no delay — `transition: 150ms ease`
- Loading states as design (Rauno's thin progress bar)

### Color Restraint Rules (Non-Negotiable)
1. One accent color maximum — used for CTAs or single data highlight only
2. If using dark mode, **never** use `#ffffff` and `#000000` simultaneously — always soften one side
3. Photography provides color — UI chrome provides none
4. Social proof / secondary content in greyscale (Notion)

### Specific Details Worth Copying Exactly
- **Linear's dot-grid background** — subtle, dark-on-dark, fades from center
- **New Yorker's horizontal rule separators** — 1px `#333` lines instead of whitespace alone
- **Apple's `#1d1d1f` surface** — this specific value, not approximations
- **Pitchfork's single red CTA** — one action, maximum urgency
- **NYT masthead centering** — utility left/right, brand dead-center
- **Cosmos's radial float** — content items at different scales around a central text anchor
- **Linear's feature card ratio** — ~16:9 with 14px padding, 8px border-radius
- **Rauno's oversized abstract shape** — a pure geometric form (circle/arc) as compositional anchor with zero function
