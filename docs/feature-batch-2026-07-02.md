# NUX — Feature Batch + UX Audit (2026-07-02, overnight)

**Status: applied to the working tree, NOT committed.** 51 tracked files changed (+1,757/−254) plus new files (reviews.js, sw.js, push routes/lib/model/script, PushToggle, a11y tests, screenshots). Frontend tests 23/23, backend 128/128, build green. Everything below was verified against the locally built PWA (`vite preview` + backend on SQLite).

## Features shipped

1. **Film Detail to Figma parity** — sticky in-page anchor nav (More Like This · Cast & Crew · Details · Reviews, IntersectionObserver active state), Reviews section (2 critic cards per film for 14 flagship titles, `--type-pullquote` italic Fraunces + amber stars; The Third Man quotes match the Figma frame verbatim), Download secondary pill (honest demo: Saving… → Saved, `aria-pressed`, persisted in `localStorage['nux-downloads']`). Data: `frontend/src/data/reviews.js`.
2. **Hero pager thumbnails** (Paramount+ pattern) — ≥768px the dots become 44×66 poster thumbs (inactive dimmed/desaturated, active = 2px `--border-focus` ring + scale) with an aria-hidden auto-advance progress underline synced to the 8s rotation and frozen on pause; <768px keeps the dots. Reduced-motion kills transitions + progress. All pager a11y preserved (group label, per-thumb "Go to <title>", `aria-current`, SR announcements).
3. **Hover crossfade preview** — poster cards crossfade to the film's landscape still (`backdrop2 || backdrop`) on hover/focus; still mounts on first hover-intent only (no 70-still fetch storms), `@media (hover:hover)` guarded, disabled entirely under reduced-motion; silent no-op for films without stills.
4. **Two editorial collections** — `five-films-on-grief` ("Theme of the Week" — the design-system type specimen made real: Brief Encounter → Aftersun, chronological) and `london-after-dark` ("The Late Programme": Peeping Tom, Performance, The Long Good Friday, Mona Lisa, Naked, Sexy Beast — The Third Man deliberately excluded, it's Vienna). Slugs reserved in `backend/lib/curatorCollections.js` so AI collections can't collide; "More collections" cross-links on every collection page; prerender/sitemap picked both up (93 routes).
5. **Player keyboard cheat sheet** — `?` toggles a focus-trapped `role=dialog` sheet on `--glass-bg-strong` listing the real key map as `<kbd>` chips; also opens from the settings gear menu; hotkeys suspended while open; Esc closes with focus return.
6. **Web push, full stack** — VAPID keys (gitignored `backend/.env`; set the same vars in Coolify before prod sends), `PushSubscription` model (unique endpoint, nullable UserId), `/api/push/public-key | subscribe | DELETE`, broadcast wired to the weekly Curator-collections regeneration + `backend/scripts/send-push.mjs` manual trigger; SW migrated generateSW → **injectManifest** (`frontend/src/sw.js` reproduces the exact caching recipe + `push`/`notificationclick` handlers); Settings "Notifications" group with a four-state soft pre-prompt ("New collections, once a week / One notification when the editors publish a new programme. Nothing else."), iOS install caveat, graceful hide when unconfigured.
7. **View Transitions** — poster→film-page morph via a guarded `document.startViewTransition` click path on PosterCard (BrowserRouter never starts VT itself; `useViewTransitionState` path is pre-wired for a future data-router migration), `film-poster` name anchored in FilmDetail.css for both hero layouts, root crossfade at `--dur-crossfade`, everything off under reduced-motion, Firefox unaffected.

## Verified end-to-end in the browser

- **Push delivered for real**: Settings → Turn on → permission → SW subscribed to `fcm.googleapis.com` (passed the SSRF allowlist) → DB row tied to the QA user → `send-push.mjs` → FCM accepted (1 sent, 0 failed) → **notification "New collections this week — Northern Landscapes" rendered by the browser**. The collections-regen broadcast trigger also fired on its own during testing.
- **NeonDrift game intact**: catalogue → Cloud Play → Launch → canvas runs, crash → "Run ended / Fly again" cycle, Esc closes, focus returns to Cloud Play. (Batch changes to the game were two token re-aliases with identical values.)
- Onboarding → genre taste → personalised Home + tour + toast; anchors/Reviews/Download on film pages; shortcuts sheet; collections pages; 0 console errors; 0 horizontal overflow at 390.

## Security (from the background review of the new push routes)

- **SSRF (HIGH) fixed**: push endpoints must be on a browser push-service host allowlist (FCM / Mozilla / Apple / WNS / Samsung), enforced at subscribe AND re-checked at send time with pruning; tests cover metadata-IP and suffix-spoof attempts.
- **Ownership (MED)**: guest re-subscribe can no longer detach a row from an account (guest upsert refreshes keys only); DELETE stays deliberately capability-based (high-entropy endpoint = proof of possession; must work after logout) with unconditional 204 — reviewed and documented in-code.

## Curator overlay — all 15 AT findings fixed

Both blockers (focus dropped on every send via `disabled` input; Browse entry never moving focus into the dialog) plus portal+`inert` background, persistent empty live regions (VoiceOver-safe announcements), close-on-pick-navigation, sr-only speaker labels, trap that skips disabled controls, PosterCard restructure (play button out of the link, `alt=""`), `aria-describedby` pick reasons, `aria-labelledby`, "N picks follow" announcements, `role="log"` scroller, `aria-haspopup` on the Browse opener, fresh-flag so restored history doesn't re-announce — and a root-cause fix for focus-return to the FAB (opener captured synchronously in `openCurator()`). Browser-verified per flow.
**Still needs Elena's ears (10-minute script)**: VoiceOver (Cmd+F5, Safari): 1) Tab to FAB — expect "Ask the Curator, button"; 2) Space — expect "dialog" + focus in the field; 3) type "something tense", Return, listen ~8s — expect "considering…" then the reply once, never word-by-word; 4) Tab — focus must still be inside the panel; 5) VO+← through the log — turns should read "You:/The Curator:"; 6) Escape — expect focus back on the FAB; 7) Reduce Motion on → reply appears instantly. NVDA (Firefox): repeat 2–3, then browse-mode Down-arrow past the send button — reading must stop at the dialog edge.

## UX audit (7 lenses → 42 findings → 39 survived skeptics → 13 distinct root causes)

Verdict (synthesis): **close to FAANG-shippable; the happy paths and craft depth are at or above the bar — the failure pattern is that unhappy paths lie** (rate-limited reset says "check your email"; unmapped 400s claim "connection problem"; "Skip for now" promises a later that doesn't exist; two search paths return false "Nothing here yet").

| # | Sev | Issue | Fix |
|---|-----|-------|-----|
| 1 | Med | Genre taste write-once; "Skip for now" has no later; device-local while list/history sync | "Your taste" row in Settings reusing the Welcome grid |
| 2 | Med | 429 on forgot-password still shows "Check your email" | Special-case `too_many_requests`/503 copy |
| 3 | Med | `password_too_long`/`name_too_long` render as a connection failure | Map codes; never blame the network for a 4xx |
| 4 | Med | Search can't match directors ("David Lean" → empty) | Add `f.director` to the Browse predicate |
| 5 | Low | Active format chip silently scopes search → false empty state | "N matches in All titles — show them" escape |
| 6 | Low | No guest surface leads with "Create account" | Signup-first copy on My List nudge + error cross-link |
| 7 | Low | Clicking the spotlit FAB dismisses the tour without opening the Curator | Spotlight-rect click → finish() + openCurator() |
| 8 | Low | Browser Back on genre step exits the site | URL-driven steps or a Back control |
| 9 | Low | Mobile hero dots suggest swipe; none exists; 24px targets | Pointer-delta swipe + coarse-pointer padding |
| 10 | Low | Desktop nav "Search" is a link dressed as an input | Real input carrying the first keystroke |
| 11 | Low | Card meta truncates year ("POWELL & PRESSBURGER · 19…") | Non-shrinking year; truncate director first |
| 12 | Low | "New Restorations" rail is mostly 2019-2022 films | Rename "New on NUX" or restock |
| 13 | Low | localStorage write-failure loops onboarding forever | In-memory onboarded flag for the session |

Praised by the auditors: guest-first list/history with server merge; player craft (buffer debounce, idle chrome, deep-link Back); the Curator AT rebuild; curation notes surviving into utility surfaces; four-state push opt-in; the honest-demo register. Full 39-finding verified list: workflow output `w7hl8mzfh` (task file) — the 26 not in the table were judged overlapping or overstated-but-real polish.

## Polish batch — same day, later (all 13 UX findings + 3 nits + tails FIXED)

Seven parallel agents + Figma pass; build green, FE 23/23, BE 128/128, browser-smoked. Final tree: 63 tracked files changed (+2,306/−507) plus new files.

- **Truthful auth errors**: 429 on forgot-password now says "Too many attempts — try again in an hour"; `password_too_long`/`name_too_long` mapped to their fields; the fallback never blames the connection for a 4xx; rate-limit copy split per mode (login minute / signup hour); `invalid_credentials` gains "New here? Create an account".
- **Taste is a loop now**: genre grid extracted to `GenreTastePicker`; Settings "Your taste" group edits `nux-genre-prefs` live (aria-live "Saved"); `lib/prefs.js` adds an in-memory fallback so blocked localStorage can't loop onboarding; browser Back returns step 2 → step 1 (router state).
- **Search fixed**: directors in the Browse predicate ("David Lean" → Lawrence + Brief Encounter, verified live); chip-scoped zero-results show "N matches in All titles — show them"; desktop nav Search is a real input carrying the first keystrokes into Browse via `?q=`.
- **Hero**: touch swipe (pointer-based, vertical-scroll-safe, `touch-action: pan-y`) + 44px dot hit-areas on coarse pointers; card meta year/runtime never truncate (director ellipsizes first); rail renamed **"New on NUX"** (code + Figma Desktop/iPhone homes).
- **Tour**: clicking the spotlit Curator FAB now finishes the tour AND opens the Curator.
- **Downloads page tells the truth**: renders films actually saved via the film-page Download button (deterministic honest-demo sizes, "Saved · On this device", per-row Remove with focus management, storage meter computed from real rows, empty state pointing at film pages); hardcoded demo rows deleted. Verified live: The Third Man appears with Remove + "2.1 GB of 64 GB".
- **"?" works on the player pre-roll** (other hotkeys stay playback-only; Esc on the sheet never navigates).
- **My List guest nudge** leads with "Create a free account".
- **Landing**: wordmark on `--type-wordmark` (24px, app parity); self-unregistering `sw.js` retires zombie PWA workers on nux.\*; nginx serves it no-cache.
- **Figma**: 0 unstyled texts on the Hi-Fi page (new `HiFi/Glyph Mark` style for ✦/✕/↑; review stars on Metadata); **Player — iPad · Hi-Fi** built + iPad Play pills wired (prototype now has zero dead Play buttons on any platform); rail retitled.
- **Push security** (from the earlier security review): endpoint host allowlist at subscribe + send; guest upsert can't reassign ownership.
- NOT done (blocked by design): Coolify VAPID env vars — the auto-mode safety classifier refused pushing production secrets; manual step below stands.

## Ops notes for deploy

- Coolify (app `nux`): add `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT=mailto:eluvrv@gmail.com` env vars (values in local `backend/.env`) — until then push UI stays hidden and routes answer 503 by design.
- `vite preview` now proxies `/api` (port 4173) and localhost:4173 is CSRF/CORS-allowlisted in dev — for local PWA testing only, prod untouched.
- Local artifacts not for commit: `backend/data/*.sqlite` changes (QA user + test subscription), audit screenshots live in the session scratchpad.
