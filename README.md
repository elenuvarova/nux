# NUX — editorial streaming platform

An editorial streaming experience for British cinema — curation as the product, not an
infinite algorithmic wall. Full-stack portfolio piece, designed end-to-end and shipped live.

**Live:** app → <https://app.nux.ontwrpn.com> · marketing landing → <https://nux.ontwrpn.com>

## Stack

- **Frontend:** React 18 + Vite 5 (JavaScript), plain CSS custom-property design tokens
- **Backend:** Node.js + Express (ES modules) + Sequelize — SQLite locally, PostgreSQL in production
- **AI:** an "AI Curator" — mood search + chat, grounded in the real catalog (Gemini 2.0 Flash →
  Groq failover, server-side keys, a hard film-id allowlist so it can't hallucinate titles)
- **Deploy:** one Docker image (nginx serves the built SPA + proxies `/api` → Express), self-hosted
  on Coolify + Hetzner; auto-deploys on push to `main`

## Features

Cookie-session auth (signup / login / password reset), a personal **My List** and **Continue
Watching** synced to Postgres, the **AI Curator** (search + chat), generative themed **collections**,
a YouTube-backed trailer player with full keyboard controls, and a small playable canvas game
(*Neon Drift*) on its title page.

## Local development

No database to install — SQLite is created automatically on first run.

```bash
# Terminal 1 — backend (http://localhost:3001)
cd backend && npm install && npm run dev

# Terminal 2 — frontend (http://localhost:5173, proxies /api → backend)
cd frontend && npm install && npm run dev
```

Copy `.env.example` → `backend/.env` and fill in the AI keys (optional — the Curator degrades
gracefully without them). See `.env.example` for every variable.

## Tests

```bash
cd backend && npm test     # vitest — routes, auth, CSRF, AI failover, collections
cd frontend && npm test    # vitest — hooks + data
```

CI (`.github/workflows`) runs both suites + a frontend build + a catalog-drift guard, and builds
the real Docker image and smoke-tests `/api/health` through nginx.

## Architecture

Single container, multi-stage build:

```text
Browser ──▶ nginx :80 ──┬─▶  /            built SPA  (immutable hashed assets, CSP/HSTS headers)
                        └─▶  /api/*  ──▶  Express :3001 (loopback) ──▶ Postgres
```

`/api/health` is DB-aware (used by the container HEALTHCHECK); nginx terminates TLS at the edge
(Cloudflare) and the API never faces the internet directly.

## Deploy (Coolify + Docker)

1. Push to GitHub.
2. Coolify builds the `Dockerfile` and runs the container; a subdomain A-record points at the host.
3. Set the env vars from `.env.example` in Coolify (notably a `postgres://` `DATABASE_URL` — the app
   **refuses to start** in production without one, to avoid a silent ephemeral SQLite).
4. Auto-deploy fires on push to `main` via a GitHub webhook.

### Web push

One broadcast ("New collections this week") fires when the weekly collections regenerate.
Subscriptions are stored server-side (`push_subscriptions`); the notification itself is shown by
the hand-written service worker (`frontend/src/sw.js`).

- Generate keys once: `cd backend && npx web-push generate-vapid-keys`.
- Set `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` and `VAPID_SUBJECT` (a `mailto:` address) in
  Coolify — locally they live in `backend/.env`. Without them `/api/push/*` answers 503 and the
  Settings row stays hidden; nothing else is affected.
- Manual test send (no need to wait a week): `cd backend && node scripts/send-push.mjs "Body" "/"`.
- iOS caveat: Safari only exposes web push once NUX is added to the Home Screen (iOS 16.4+) —
  the Settings row explains this in place.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | `{ status, db }` — authenticates the DB |
| POST | `/api/auth/{signup,login,logout,forgot,reset}` · GET/PATCH `/api/auth/me` | cookie-session auth |
| GET/POST/DELETE | `/api/list` | the signed-in user's My List |
| GET/PUT | `/api/history` | watch progress (Continue Watching) |
| POST/GET/DELETE | `/api/curator` · `/api/curator/history` | the AI Curator chat |
| GET | `/api/collections` · `/api/collections/:slug` | generated themed collections |
| GET/POST/DELETE | `/api/push/public-key` · `/api/push/subscribe` | web-push key + subscriptions |
