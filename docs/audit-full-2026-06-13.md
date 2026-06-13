# NUX — Full-Repo Audit (2026-06-13)

Whole-repo audit (frontend · backend · AI Curator · infra) against deployed commit `5c3a4003`
(live at https://nux.ontwrpn.com). 8 parallel dimensions → adversarial verification of every
high/critical → synthesized. 102 raw findings → ~52 distinct. **0 critical · 5 high · 24 medium · 23 low.**

## Summary

**By dimension (deduped):** Backend Security 12 · Backend API/Data 11 · AI/Curator 11 · NeonDrift+frontend 7 ·
Accessibility 6 · Performance 9 · Code Quality 9 · Infra/Deploy 13.

## Top priorities (risk × ease, security first)

1. **Fail loudly when prod isn't Postgres** (High, Infra) — one missing env var silently runs ephemeral SQLite wiped every redeploy. 3-line guard.
2. **Fix the broken login timing oracle** (Sec) — malformed dummy bcrypt hash re-enables user enumeration; use a real hash.
3. **Process-wide budget cap on the unauthenticated Curator endpoint** (Sec) — guest + IP rotation = unbounded paid-LLM spend/DoS.
4. **Adopt migrations; stop bare `sequelize.sync()` in prod** — silent schema drift; unblocks the index fixes.
5. **CI gate before auto-deploy** — tests + `vite build` + docker smoke before the Coolify webhook ships.
6. **Test the highest-stakes paths** — auth/session/CSRF/list/history have zero coverage; supertest already a devDep.
7. **Health check should exercise node+DB** — probe `/api/health` through nginx, not the static nginx `/health`.
8. **NeonDrift focus trap + restore + inert background** (A11y) — modal advertises `aria-modal` but leaks Tab to chrome.
9. **Announce Watch transport state to screen readers** (A11y) — play/pause/mute/captions/speed are silent.
10. **Drop the artificial 300 ms skeleton gate on Home/Browse** (Perf) — self-inflicted LCP delay on the two hottest routes.

## What's solid (not padding)

- **AI grounding & failover** — catalog-in-prompt + hard `validateFilmIds` allowlist means injected/hallucinated ids can't surface; Gemini→Groq with per-attempt AbortController timeouts.
- **Collections cache** — genuinely atomic persist swap (destroy-all + bulkCreate in one transaction), TTL + single-flight; readers never see a half-empty shelf.
- **Auth fundamentals** — bcrypt cost-12 + 72-byte guard, 256-bit session/reset tokens, reset destroys ALL sessions, fresh token per login (no fixation), generic forgot response.
- **CSRF defense-in-depth** — SameSite=Lax cookie + Origin check; scoped `rejectUnauthorized:false` for external DB only is intentional.
- **Graceful shutdown** — drains HTTP + DB pool on SIGTERM; start.sh traps TERM/INT.
- **Container hygiene** — multi-stage build, lockfile-frozen `npm ci`, CSP/HSTS headers in nginx, `.dockerignore`/`.gitignore` exclude the local SQLite + secrets.
- **AI test coverage** — 38+ backend tests assert the real invariants and pass.

## High

1. **Silent SQLite fallback wipes prod data if `DATABASE_URL` unset** — backend/db.js:5-33, server.js:95 — missing/mistyped value silently falls back to ephemeral SQLite. **Fix:** in db.js, `if (NODE_ENV==='production' && !isPostgres) throw`; optionally gate SQLite behind `ALLOW_SQLITE`.
2. **NeonDrift modal: no focus trap / restore / inert background** — NeonDrift.jsx:174-221,227-235; TitleDetail.jsx:102 — Tab escapes to NavBar/TabBar/FAB behind the z-1000 game; close drops focus to `<body>`. **Fix:** mirror CuratorOverlay focus-trap pattern; capture+restore activeElement; mark shell `inert`. Best as a shared `useFocusTrap` hook for Tour/Curator/NeonDrift. WCAG 2.4.3.
3. **Watch transport state not announced to SR** — Watch.jsx:480-491,521-533,548-556 — play/pause/mute/captions/speed only flip aria on the (unfocused) control. **Fix:** add an `sr-only` `aria-live="polite"` region announcing transitions. WCAG 4.1.3.
4. **NeonDrift overlay text can drop below 4.5:1 over the live world** — NeonDrift.css:50,82-87,103-107 — the sun gradient bleeds through the 55-78% scrim center where the text sits (hint ≈ 1.99:1). **Fix:** raise `.ndg-screen` scrim floor to ~0.9 or a solid `#0a041c` plate behind the text. WCAG 1.4.3.
5. **AI catalog re-sent in full every Curator turn — cost on the hottest paid path** — curatorPrompt.js:22-52 — ~1.3-6.7 KB catalog block + up to 12 messages sent every turn. **Fix:** Gemini context/implicit caching for the static prefix; instrument input tokens; optionally trim synopses for chat.

## Medium (selected — full list in workflow output)

- **Security:** unauthenticated Curator cost-abuse (curator.js:35) · in-memory per-IP rate limits wiped on every redeploy (auth.js:78) · CSRF null-origin fail-open in prod (security.js:42) · 9 npm-audit vulns incl. node-tar via sqlite3 (package.json:26).
- **Backend/data:** `sequelize.sync()` no migrations (server.js:95) · no index on sessions.UserId/expiresAt (models.js:19) · non-transactional forgot reissue (auth.js:140) · no index on curator_messages.UserId.
- **AI:** zero cost/latency/token instrumentation · no retry/backoff on transient 429/5xx · no model-version pinning · Groq path ignores JSON schema · collections never pre-warmed (first GET empty).
- **NeonDrift:** rAF never pauses on tab-blur · global window keydown hijack + dual-modal key conflict · reduced-motion ignored by the world · live score invisible to AT · verbose score-screen aria-live.
- **Watch:** `role="menu"` without arrow-key roving.
- **Perf:** 320/280 ms skeleton delays (Home/Browse) · 416 KB hero still un-responsive.
- **Code quality:** zero tests on auth/session/CSRF/list/history · films.js drift risk · duplicated sync-store hooks (useWatchHistory lacks ready flag + swallows errors) · watch-progress constants drift client↔server.
- **Infra:** README documents a non-existent Render deploy · .env.example missing RESEND/EMAIL_FROM/APP_URL · no CI gate · container runs as root · health check never confirms the API · Gemini key in URL query string · no zero-downtime drain order.

## Suggested order of work

1. **Stop the bleeding (data + secrets):** prod-not-Postgres guard, login-timing hash, global Curator budget cap, Gemini key→header.
2. **Build the safety net before changing schemas:** CI gate + DB-aware health check + migrations + the missing auth tests + films-drift guard.
3. **Schema & data-integrity (now migration-backed):** indexes, transactional forgot, persistent rate limiter, the API/data batch.
4. **Highest-visibility accessibility:** Watch live region, NeonDrift focus-trap/inert/restore (shared hook), NeonDrift contrast, Watch menu roles, the NeonDrift a11y batch.
5. **Performance the reviewer feels:** drop skeleton delay, responsive hero image, AI catalog caching + instrumentation, the micro-batch.
6. **AI robustness & cost:** retry/backoff, model pinning + eval, Groq schema, collections pre-warm.
7. **Infra hardening & docs:** non-root container, drain order + rollback, README + env parity, dep bumps.
8. **Maintainability consolidation (last):** shared hooks/helpers, single-source-of-truth fixes, comments + tidy.
