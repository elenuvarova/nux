# Neon Drift — Leaderboard

**Date:** 2026-06-14
**Status:** Approved (design) — pending implementation plan

## Problem

The in-app arcade game **Neon Drift** (`frontend/src/components/NeonDrift.jsx`, a canvas
gate-dodger embedded in the "Neon Drift" title page) keeps only a personal best in
`localStorage` (`nux_neondrift_best`). There is no shared ranking and no reason to come back
or compete. We want the classic arcade payoff: crash → see your score → put your name on the
board → see where you land against everyone else.

## Goal

A single **global leaderboard** for Neon Drift, open to **both guests and registered users**,
surfaced entirely inside the game's crash overlay. After a run ends, the player submits their
score (under their account, or as a typed handle if a guest) and sees the top of the board with
their own row highlighted.

This is a portfolio project (see memory: NUX is portfolio, not a real business). The bar is
"what a reviewer sees works and feels polished," not anti-cheat-hardened competitive integrity.

## Decisions

- **One global board**, both guests and registered users on it. Surfaced **in the crash overlay
  only** — no separate leaderboard page.
- **Identity:**
  - *Registered* — display name derived server-side from `User.name`: `"Elena Uvarova" → "Elena U."`
    (first name + first initial of the next token + "."). Single-token names shown as-is. The last
    name never leaves the server. No typing — one "submit" button. A subtle marker distinguishes a
    verified account from a guest handle.
  - *Guest* — types a handle (1–16 chars), prefilled from the last handle they used (localStorage).
- **Record semantics (chosen approach A):**
  - *Registered* — **one row per account**, kept at their **best** score (upsert-max, dedup on
    `(game, UserId)`). Personal identity exists, so dedup is meaningful.
  - *Guest* — **one row per submitted run** (no stable identity to dedup on; classic arcade model).
    Spam is bounded by a rate-limit and by only ever displaying the top N.
- **Guests vs registered visibility:** everyone can *read* the board; everyone can *submit*. The
  board shows both, with the verified-account marker as the only distinction.
- The existing `localStorage` personal best stays as-is — the offline best, independent of the board.

## Architecture

### Backend

**Model — `GameScore`** (`backend/models.js`)

| field | type | notes |
|---|---|---|
| `id` | UUID pk | |
| `game` | STRING, not null, default `'neon-drift'` | future-proofs for more games; queries always filter on it |
| `UserId` | UUID, nullable, FK → User, `onDelete: CASCADE` | null = guest entry |
| `name` | STRING, nullable | the **guest** handle; null for registered (display derived from `User.name` at read) |
| `score` | INTEGER, not null | |
| `createdAt` | (timestamps) | tie-breaker: earlier run ranks higher on equal score |

Indexes:
- `(game, score DESC)` — leaderboard read.
- **unique** `(game, UserId)` — enforces one-row-per-account-per-game (the upsert target).
  Guest rows have `UserId = null`; the unique index does not constrain multiple nulls in either
  SQLite or Postgres, so guests can have many rows.

Association: `User.hasMany(GameScore, { onDelete: "CASCADE" })`, `GameScore.belongsTo(User)`.

**Route — `backend/routes/scores.js`**, mounted `app.use("/api/scores", scoresRoutes)` in
`server.js`. **Public** — does NOT use `requireAuth`. Resolves the optional user with
`currentUser(req)` (returns the user or null, never 401s).

- `GET /api/scores?game=neon-drift`
  - Validates `game` against a whitelist (`{ "neon-drift" }`); defaults to `neon-drift` if omitted.
  - Returns top N (N = 10):
    ```json
    {
      "top": [
        { "rank": 1, "name": "Elena U.", "score": 142, "registered": true, "isYou": true },
        { "rank": 2, "name": "kai", "score": 130, "registered": false, "isYou": false }
      ],
      "you": { "rank": 7, "score": 88 }
    }
    ```
  - Registered display names are derived from the joined `User.name` at read time (always fresh).
  - `isYou` is true for the caller's own registered row. `you` is the caller's rank if they have a
    registered row outside the top N; `null` for guests (no stable identity) or no entry.
  - Ordering: `score DESC, createdAt ASC`.
- `POST /api/scores  { game, score, name? }`
  - `rateLimit("scores", 10, 10 * 60 * 1000)` (10 submits / 10 min / IP) applied before the handler.
  - Validates: `game` in whitelist; `score` is an integer `0 ≤ score ≤ 1_000_000`.
  - `currentUser(req)`:
    - **registered** → ignore any submitted `name`; upsert the `(game, UserId)` row, keeping
      `max(existing, score)`. Returns the resulting best + the caller's rank.
    - **guest** → `name` required: trimmed, 1–16 chars, control characters stripped; reject
      otherwise (`400 name_required` / `name_invalid`). Insert a new row with `UserId = null`.
  - Response: `{ ok: true, rank: <int|null>, best: <int> }` (rank null for guests).

**Known limitation (accepted):** the score is client-reported and therefore forgeable. We do not
simulate the game server-side. Cheap mitigations only: integer + ceiling validation, per-IP
rate-limit, and an explicit user-initiated submit (no auto-submit on every crash). Documented, not
defended further — appropriate for a portfolio artifact.

### Frontend

All changes in `frontend/src/components/NeonDrift.jsx` and its CSS; flow lives in the existing
crash-phase overlay (rendered via the existing portal/dialog). Uses the existing `api` helper
(`frontend/src/lib/api.js`) and `useAuth` (`frontend/src/lib/useAuth.jsx`).

Crash-overlay additions (below the existing final-score / best display):

1. **Submit section** (shown when `score > 0` and not yet submitted this run):
   - *Logged in* → button "Submit as **Elena U.**" (abbreviation rendered from `user.name`).
   - *Guest* → text input (prefilled from `localStorage` last handle, key e.g.
     `nux_neondrift_handle`) + submit button. Empty/invalid handle disables submit.
2. **Board** (shown after a successful submit, or if already submitted this run):
   - Compact **top 10**, the player's own row highlighted, plus their rank line ("You're #7")
     when applicable.
   - Verified-account marker (small icon/dot) on registered rows.
3. **States:** submitting (button disabled / spinner), success (board appears), error (inline
   message + retry; the game stays fully playable — restart is never blocked by a failed submit).

The `localStorage` personal best logic is untouched.

## Testing

`backend/routes/scores.test.js`, following the `backend/routes/list.test.js` pattern:

- Guest submit inserts a row; missing/invalid `name` → 400.
- Registered submit ties to `UserId`; a second lower submit keeps the previous best (upsert-max);
  a higher submit raises it.
- `GET` returns rows ordered `score DESC, createdAt ASC`, capped at N, with derived registered
  display names and the `registered` / `isYou` flags.
- `score` validation: non-integer, negative, and over-ceiling all → 400.
- Rate-limit: the (N+1)th submit within the window → 429.

## Out of scope (YAGNI)

- Separate leaderboard page / route.
- Per-period boards (daily/weekly), pagination beyond top N.
- Server-side anti-cheat / game-state verification.
- Guest-row retention/pruning (display-top-N + rate-limit is enough at portfolio scale; revisit
  only if the table actually grows large).
- Leaderboards for any title other than Neon Drift (the `game` column leaves the door open).
