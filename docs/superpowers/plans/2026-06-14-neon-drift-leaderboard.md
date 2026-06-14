# Neon Drift Leaderboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a global Neon Drift leaderboard — open to guests and registered users — surfaced entirely inside the game's crash overlay (game over → submit your score → see the top of the board).

**Architecture:** A new public `GameScore` Sequelize model and `/api/scores` route. The route uses optional auth (`currentUser`, never 401s): registered users get one upsert-max row keyed `(game, UserId)` and display as an abbreviated account name derived server-side; guests insert one row per run with a typed handle. The frontend extends `NeonDrift.jsx`'s crash overlay with a submit control and a compact top-10 board.

**Tech Stack:** Node + Express + Sequelize (backend), Vitest + Supertest (tests), React + Vite (frontend). All patterns mirror the existing `list.js` route + `list.test.js`.

**Spec:** `docs/superpowers/specs/2026-06-14-neon-drift-leaderboard-design.md`

---

## File Structure

- **Create** `backend/routes/scores.js` — the `/api/scores` route (GET top-N + caller rank, POST submit).
- **Create** `backend/routes/scores.test.js` — Vitest unit tests (mocked models), mirrors `list.test.js`.
- **Modify** `backend/models.js` — add the `GameScore` model + `User.hasMany(GameScore)` association.
- **Modify** `backend/server.js` — import + mount `scoresRoutes`; add `game_scores` indexes to `ensureIndexes()`.
- **Modify** `frontend/src/components/NeonDrift.jsx` — submit + board UI in the crash overlay.
- **Modify** `frontend/src/components/NeonDrift.css` — styles for the submit/board section.

---

## Task 1: GameScore model + association

**Files:**
- Modify: `backend/models.js`

- [ ] **Step 1: Add the GameScore model**

In `backend/models.js`, after the `CuratorCollection` model definition (before the `RateLimit` model), add:

```js
// Arcade leaderboard scores. ONE board per game (the `game` column future-proofs
// for more games). A registered entry is keyed by (game, UserId) and kept at the
// player's best (upsert-max); its display name is derived from User.name at READ
// time, so `name` stays null for registered rows. A guest entry has UserId=null
// and stores the typed handle in `name` — one row per submitted run (no identity
// to dedup on). The unique (game, UserId) index allows many NULL UserIds, so
// guests are unconstrained while accounts get exactly one row.
export const GameScore = sequelize.define(
  "GameScore",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    game: { type: DataTypes.STRING, allowNull: false, defaultValue: "neon-drift" },
    name: { type: DataTypes.STRING, allowNull: true }, // guest handle; null for registered
    score: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "game_scores",
    indexes: [
      { fields: ["game", "score"] }, // leaderboard read (score DESC scan)
      { unique: true, fields: ["game", "UserId"] }, // one row per account per game
    ],
  }
);
```

- [ ] **Step 2: Add the association**

In `backend/models.js`, in the associations block at the bottom (after the `CuratorMessage` association lines), add:

```js
User.hasMany(GameScore, { onDelete: "CASCADE" });
GameScore.belongsTo(User);
```

- [ ] **Step 3: Verify the model loads (no syntax/define errors)**

Run: `cd backend && node --input-type=module -e "import('./models.js').then(m => console.log('GameScore:', !!m.GameScore))"`
Expected: prints `GameScore: true` (it will also open the sqlite connection; that's fine).

- [ ] **Step 4: Commit**

```bash
git add backend/models.js
git commit -m "feat(backend): GameScore model for the Neon Drift leaderboard"
```

---

## Task 2: /api/scores route (TDD)

**Files:**
- Create: `backend/routes/scores.js`
- Test: `backend/routes/scores.test.js`

- [ ] **Step 1: Write the failing test**

Create `backend/routes/scores.test.js`:

```js
import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

// Mock auth: currentUser is settable per-test; rateLimit is a passthrough so the
// route's logic is tested in isolation (the limiter itself is covered by
// auth.test.js). publicUser etc. fall through to the real implementations.
vi.mock("../lib/auth.js", async () => {
  const actual = await vi.importActual("../lib/auth.js");
  return {
    ...actual,
    currentUser: vi.fn(async () => null),
    rateLimit: () => (req, _res, next) => next(),
  };
});

vi.mock("../models.js", () => ({
  GameScore: {
    findAll: vi.fn().mockResolvedValue([]),
    findOrCreate: vi.fn(),
    create: vi.fn().mockResolvedValue({}),
    count: vi.fn().mockResolvedValue(0),
  },
  User: {}, // referenced only as an include target; the mocked findAll ignores it
}));

import { currentUser } from "../lib/auth.js";
import { GameScore } from "../models.js";
import scoresRoutes from "./scores.js";

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/scores", scoresRoutes);
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => res.status(err?.status || 500).json({ error: "internal" }));
  return app;
}

beforeEach(() => {
  vi.clearAllMocks();
  currentUser.mockResolvedValue(null);
  GameScore.findAll.mockResolvedValue([]);
  GameScore.count.mockResolvedValue(0);
  GameScore.create.mockResolvedValue({});
});

describe("GET /api/scores", () => {
  it("returns the top board with derived names and flags", async () => {
    currentUser.mockResolvedValue({ id: "u1", name: "Elena Uvarova" });
    GameScore.findAll.mockResolvedValue([
      { UserId: "u1", name: null, score: 142, User: { name: "Elena Uvarova" } },
      { UserId: null, name: "kai", score: 130, User: null },
    ]);
    const res = await request(makeApp()).get("/api/scores?game=neon-drift");
    expect(res.status).toBe(200);
    expect(res.body.top).toEqual([
      { rank: 1, name: "Elena U.", score: 142, registered: true, isYou: true },
      { rank: 2, name: "kai", score: 130, registered: false, isYou: false },
    ]);
    // ordered score DESC, createdAt ASC, capped
    expect(GameScore.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { game: "neon-drift" },
        order: [["score", "DESC"], ["createdAt", "ASC"]],
        limit: 10,
      })
    );
  });

  it("rejects an unknown game", async () => {
    const res = await request(makeApp()).get("/api/scores?game=pong");
    expect(res.status).toBe(400);
  });
});

describe("POST /api/scores (guest)", () => {
  it("400 when the guest name is missing", async () => {
    const res = await request(makeApp()).post("/api/scores").send({ game: "neon-drift", score: 50 });
    expect(res.status).toBe(400);
    expect(GameScore.create).not.toHaveBeenCalled();
  });

  it("inserts a guest row with the trimmed handle and UserId null", async () => {
    const res = await request(makeApp())
      .post("/api/scores")
      .send({ game: "neon-drift", score: 50, name: "  kai  " });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true, rank: null, best: 50 });
    expect(GameScore.create).toHaveBeenCalledWith({
      game: "neon-drift",
      UserId: null,
      name: "kai",
      score: 50,
    });
  });

  it("400 on a non-integer score", async () => {
    const res = await request(makeApp())
      .post("/api/scores")
      .send({ game: "neon-drift", score: 1.5, name: "kai" });
    expect(res.status).toBe(400);
  });

  it("400 on a score over the ceiling", async () => {
    const res = await request(makeApp())
      .post("/api/scores")
      .send({ game: "neon-drift", score: 1000001, name: "kai" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/scores (registered)", () => {
  beforeEach(() => currentUser.mockResolvedValue({ id: "u1", name: "Elena Uvarova" }));

  it("creates a new row when the user has none", async () => {
    GameScore.findOrCreate.mockResolvedValue([{ score: 80 }, true]);
    GameScore.count.mockResolvedValue(2); // 2 ahead → rank 3
    const res = await request(makeApp()).post("/api/scores").send({ game: "neon-drift", score: 80 });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true, rank: 3, best: 80 });
    expect(GameScore.findOrCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { game: "neon-drift", UserId: "u1" },
        defaults: { game: "neon-drift", UserId: "u1", score: 80 },
      })
    );
  });

  it("keeps the previous best when the new score is lower", async () => {
    const update = vi.fn();
    GameScore.findOrCreate.mockResolvedValue([{ score: 100, update }, false]);
    const res = await request(makeApp()).post("/api/scores").send({ game: "neon-drift", score: 40 });
    expect(res.status).toBe(200);
    expect(res.body.best).toBe(100);
    expect(update).not.toHaveBeenCalled();
  });

  it("raises the best when the new score is higher", async () => {
    const update = vi.fn().mockResolvedValue({});
    GameScore.findOrCreate.mockResolvedValue([{ score: 100, update }, false]);
    const res = await request(makeApp()).post("/api/scores").send({ game: "neon-drift", score: 150 });
    expect(res.status).toBe(200);
    expect(res.body.best).toBe(150);
    expect(update).toHaveBeenCalledWith({ score: 150 });
  });

  it("ignores any name sent by a registered user", async () => {
    GameScore.findOrCreate.mockResolvedValue([{ score: 0 }, true]);
    await request(makeApp()).post("/api/scores").send({ game: "neon-drift", score: 10, name: "hacker" });
    expect(GameScore.findOrCreate).toHaveBeenCalledWith(
      expect.objectContaining({ defaults: expect.not.objectContaining({ name: "hacker" }) })
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd backend && npx vitest run routes/scores.test.js`
Expected: FAIL — `Cannot find module './scores.js'`.

- [ ] **Step 3: Write the route**

Create `backend/routes/scores.js`:

```js
import { Router } from "express";
import { Op } from "sequelize";
import { GameScore, User } from "../models.js";
import { currentUser, rateLimit } from "../lib/auth.js";
import { ah } from "../lib/asyncHandler.js";

const router = Router();

const GAMES = new Set(["neon-drift"]); // whitelist; one board per game
const TOP_N = 10;
const SCORE_MAX = 1_000_000;
const NAME_MAX = 16;

// "Elena Uvarova" -> "Elena U." ; single-token names pass through. Keeps the
// last name server-side. Used for registered display names (derived at read).
function abbreviate(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Player";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0].toUpperCase()}.`;
}

// Trim, strip control chars, cap length. Returns "" if nothing usable remains.
function cleanName(raw) {
  // eslint-disable-next-line no-control-regex
  return String(raw || "").replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, NAME_MAX);
}

function resolveGame(value) {
  const game = String(value || "neon-drift").trim();
  return GAMES.has(game) ? game : null;
}

// GET /api/scores?game=neon-drift → { top: [...], you: {rank, score} | null }
router.get(
  "/",
  ah(async (req, res) => {
    const game = resolveGame(req.query.game);
    if (!game) return res.status(400).json({ error: "unknown_game" });

    const rows = await GameScore.findAll({
      where: { game },
      order: [["score", "DESC"], ["createdAt", "ASC"]],
      limit: TOP_N,
      include: [{ model: User, attributes: ["name"] }],
    });

    const me = await currentUser(req);
    const top = rows.map((row, i) => ({
      rank: i + 1,
      name: row.UserId ? abbreviate(row.User?.name) : row.name,
      score: row.score,
      registered: !!row.UserId,
      isYou: !!(me && row.UserId === me.id),
    }));

    // caller's standing if they're registered but off the visible top
    let you = null;
    if (me && !top.some((r) => r.isYou)) {
      const mine = await GameScore.findOne({ where: { game, UserId: me.id } });
      if (mine) {
        const ahead = await GameScore.count({
          where: { game, score: { [Op.gt]: mine.score } },
        });
        you = { rank: ahead + 1, score: mine.score };
      }
    }

    res.json({ top, you });
  })
);

// POST /api/scores { game, score, name? }
// Registered → upsert-max on (game, UserId), name ignored. Guest → insert a row
// with the typed handle. Public route; optional auth via currentUser.
router.post(
  "/",
  rateLimit("scores", 10, 10 * 60 * 1000),
  ah(async (req, res) => {
    const game = resolveGame(req.body?.game);
    if (!game) return res.status(400).json({ error: "unknown_game" });

    const score = req.body?.score;
    if (!Number.isInteger(score) || score < 0 || score > SCORE_MAX) {
      return res.status(400).json({ error: "invalid_score" });
    }

    const me = await currentUser(req);

    if (me) {
      // one row per account, kept at the best
      const [row, created] = await GameScore.findOrCreate({
        where: { game, UserId: me.id },
        defaults: { game, UserId: me.id, score },
      });
      if (!created && score > row.score) await row.update({ score });
      const best = created ? score : Math.max(row.score, score);
      const ahead = await GameScore.count({ where: { game, score: { [Op.gt]: best } } });
      return res.status(created ? 201 : 200).json({ ok: true, rank: ahead + 1, best });
    }

    // guest: a handle is required
    const name = cleanName(req.body?.name);
    if (!name) return res.status(400).json({ error: "name_required" });
    await GameScore.create({ game, UserId: null, name, score });
    return res.status(201).json({ ok: true, rank: null, best: score });
  })
);

export default router;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd backend && npx vitest run routes/scores.test.js`
Expected: PASS — all cases green.

- [ ] **Step 5: Commit**

```bash
git add backend/routes/scores.js backend/routes/scores.test.js
git commit -m "feat(backend): /api/scores leaderboard route (guest + account, upsert-max)"
```

---

## Task 3: Mount the route + register indexes

**Files:**
- Modify: `backend/server.js`

- [ ] **Step 1: Import the route**

In `backend/server.js`, after the `import collectionsRoutes from "./routes/collections.js";` line, add:

```js
import scoresRoutes from "./routes/scores.js";
```

- [ ] **Step 2: Mount the route**

In `backend/server.js`, after the `app.use("/api/collections", collectionsRoutes);` line, add:

```js
app.use("/api/scores", scoresRoutes);
```

- [ ] **Step 3: Add the hot-path indexes to ensureIndexes()**

In `backend/server.js`, in the `wanted` array inside `ensureIndexes()`, add these two entries after the `curator_messages` line:

```js
    ["game_scores", ["game", "score"], "game_scores_game_score"],
    ["game_scores", ["game", "UserId"], "game_scores_game_userid"],
```

- [ ] **Step 4: Verify the server boots and the route answers**

Run: `cd backend && (node server.js &) && sleep 2 && curl -s "http://localhost:3001/api/scores?game=neon-drift" && curl -s "http://localhost:3001/api/scores?game=pong" -o /dev/null -w "%{http_code}\n" && kill %1 2>/dev/null`
Expected: first curl prints `{"top":[],"you":null}`; second prints `400`.

- [ ] **Step 5: Run the full backend test suite (nothing regressed)**

Run: `cd backend && npx vitest run`
Expected: PASS — all suites green.

- [ ] **Step 6: Commit**

```bash
git add backend/server.js
git commit -m "feat(backend): mount /api/scores + game_scores indexes"
```

---

## Task 4: Crash-overlay submit + board UI

**Files:**
- Modify: `frontend/src/components/NeonDrift.jsx`

- [ ] **Step 1: Add imports and constants**

At the top of `frontend/src/components/NeonDrift.jsx`, add to the existing imports:

```js
import { useAuth } from '../lib/useAuth';
import { api } from '../lib/api';
```

Below the existing `const BEST_KEY = 'nux_neondrift_best';` line, add:

```js
const GAME = 'neon-drift';
const HANDLE_KEY = 'nux_neondrift_handle'; // remembers a guest's last handle

// mirror of the server's abbreviation, for the "Submit as …" label
const abbreviate = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Player';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0].toUpperCase()}.`;
};

const readHandle = () => {
  try {
    return localStorage.getItem(HANDLE_KEY) || '';
  } catch {
    return '';
  }
};
```

- [ ] **Step 2: Add component state and the submit/load handlers**

Inside `export default function NeonDrift({ onClose })`, after the existing `const [best, setBest] = useState(readBest);` line, add:

```js
  const { user } = useAuth();
  const [handle, setHandle] = useState(readHandle);
  const [submitState, setSubmitState] = useState('idle'); // 'idle'|'submitting'|'done'|'error'
  const [board, setBoard] = useState(null); // { top, you } | null
  const [myRank, setMyRank] = useState(null); // rank from the submit response

  const loadBoard = useCallback(async () => {
    try {
      const data = await api.get(`/api/scores?game=${GAME}`);
      setBoard(data);
    } catch {
      /* board just won't show; the game is unaffected */
    }
  }, []);

  const submitScore = useCallback(async () => {
    const name = handle.trim();
    if (!user && !name) return; // guest must type a handle
    setSubmitState('submitting');
    try {
      const body = user ? { game: GAME, score } : { game: GAME, score, name };
      const res = await api.post('/api/scores', body);
      setMyRank(res.rank);
      if (!user) {
        try {
          localStorage.setItem(HANDLE_KEY, name);
        } catch {
          /* private mode — handle just won't persist */
        }
      }
      setSubmitState('done');
      await loadBoard();
    } catch {
      setSubmitState('error');
    }
  }, [handle, user, score, loadBoard]);
```

- [ ] **Step 3: Reset the submit state on each new run**

In the existing `start` callback, after the `setScore(0);` line, add:

```js
    setSubmitState('idle');
    setBoard(null);
    setMyRank(null);
```

- [ ] **Step 4: Render the submit/board section in the crashed branch**

In `NeonDrift.jsx`, the crashed branch currently ends with the "Fly again" button and the `ndg-hint` paragraph inside the `phase !== 'playing'` block. Replace the existing crashed-branch block — the `<> … </>` that starts with `<p className="ndg-eyebrow">Run ended</p>` — with this version (adds the leaderboard section after the score, before the shared "Fly again" button which stays where it is):

```jsx
              <>
                <p className="ndg-eyebrow">Run ended</p>
                {/* the meaningful result, announced once (not the whole panel) */}
                <p className="sr-only" role="status">
                  Run ended. Score {score}
                  {score >= best && score > 0 ? ', a new best.' : `, best ${best}.`}
                </p>
                <h2 className="ndg-title ndg-title--score" aria-hidden="true">{score}</h2>
                <p className="ndg-sub" aria-hidden="true">
                  {score >= best && score > 0 ? 'New best run' : `Best ${best}`}
                </p>

                {submitState !== 'done' && score > 0 && (
                  <div className="ndg-submit">
                    {user ? (
                      <button
                        type="button"
                        className="btn btn-ghost ndg-submit-btn"
                        onClick={submitScore}
                        disabled={submitState === 'submitting'}
                      >
                        {submitState === 'submitting'
                          ? 'Submitting…'
                          : `Submit as ${abbreviate(user.name)}`}
                      </button>
                    ) : (
                      <form
                        className="ndg-submit-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          submitScore();
                        }}
                      >
                        <label className="sr-only" htmlFor="ndg-handle">Your name for the leaderboard</label>
                        <input
                          id="ndg-handle"
                          className="ndg-handle"
                          value={handle}
                          onChange={(e) => setHandle(e.target.value)}
                          placeholder="Your name"
                          maxLength={16}
                          autoComplete="off"
                        />
                        <button
                          type="submit"
                          className="btn btn-ghost ndg-submit-btn"
                          disabled={submitState === 'submitting' || !handle.trim()}
                        >
                          {submitState === 'submitting' ? 'Submitting…' : 'Add to leaderboard'}
                        </button>
                      </form>
                    )}
                    {submitState === 'error' && (
                      <p className="ndg-submit-err" role="alert">
                        Couldn’t save your score.{' '}
                        <button type="button" className="ndg-retry" onClick={submitScore}>Try again</button>
                      </p>
                    )}
                  </div>
                )}

                {board?.top?.length > 0 && (
                  <div className="ndg-board" aria-label="Leaderboard">
                    <p className="ndg-board-head">Leaderboard</p>
                    <ol className="ndg-board-list">
                      {board.top.map((row) => (
                        <li
                          key={`${row.rank}-${row.name}`}
                          className={`ndg-board-row${row.isYou ? ' ndg-board-row--you' : ''}`}
                        >
                          <span className="ndg-board-rank">{row.rank}</span>
                          <span className="ndg-board-name">
                            {row.name}
                            {row.registered && (
                              <span className="ndg-board-verified" title="Signed-in player" aria-label="signed-in player">●</span>
                            )}
                          </span>
                          <span className="ndg-board-score">{row.score}</span>
                        </li>
                      ))}
                    </ol>
                    {(board.you || myRank) && !board.top.some((r) => r.isYou) && (
                      <p className="ndg-board-you">
                        You’re #{board.you?.rank ?? myRank}
                      </p>
                    )}
                  </div>
                )}
              </>
```

- [ ] **Step 5: Verify the build compiles**

Run: `cd frontend && npx vite build`
Expected: build succeeds with no errors referencing `NeonDrift`.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/NeonDrift.jsx
git commit -m "feat(game): leaderboard submit + board in the Neon Drift crash overlay"
```

---

## Task 5: Style the submit + board

**Files:**
- Modify: `frontend/src/components/NeonDrift.css`

- [ ] **Step 1: Append the leaderboard styles**

At the end of `frontend/src/components/NeonDrift.css`, append (these use the game's own neon palette to match the existing `.ndg-*` chrome; keep colors consistent with the values already in this file if they differ):

```css
/* ── leaderboard (crash overlay) ─────────────────────────────────────── */
.ndg-submit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.ndg-submit-form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}
.ndg-handle {
  min-width: 0;
  width: 9rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(45, 226, 230, 0.5);
  background: rgba(19, 7, 43, 0.6);
  color: #fdf3ff;
  font: inherit;
}
.ndg-handle:focus-visible {
  outline: 2px solid #2de2e6;
  outline-offset: 2px;
}
.ndg-submit-btn { white-space: nowrap; }
.ndg-submit-err {
  color: #ff8fb0;
  font-size: 0.85rem;
  margin: 0;
}
.ndg-retry {
  background: none;
  border: none;
  color: #2de2e6;
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
  padding: 0;
}

.ndg-board {
  margin-top: 1rem;
  width: min(22rem, 86vw);
  text-align: left;
}
.ndg-board-head {
  margin: 0 0 0.4rem;
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(253, 243, 255, 0.7);
}
.ndg-board-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.ndg-board-row {
  display: grid;
  grid-template-columns: 1.6rem 1fr auto;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.5rem;
  border-radius: 0.4rem;
  font-variant-numeric: tabular-nums;
}
.ndg-board-row--you {
  background: rgba(255, 45, 149, 0.18);
  box-shadow: inset 0 0 0 1px rgba(255, 45, 149, 0.5);
}
.ndg-board-rank { color: rgba(253, 243, 255, 0.6); }
.ndg-board-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ndg-board-verified {
  margin-left: 0.35rem;
  font-size: 0.55em;
  color: #2de2e6;
  vertical-align: middle;
}
.ndg-board-score { font-weight: 700; }
.ndg-board-you {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: #2de2e6;
  text-align: center;
}
```

- [ ] **Step 2: Verify the build still compiles**

Run: `cd frontend && npx vite build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/NeonDrift.css
git commit -m "style(game): Neon Drift leaderboard styling"
```

---

## Task 6: End-to-end verification

**Files:** none (manual + automated smoke).

- [ ] **Step 1: Run the full backend suite**

Run: `cd backend && npx vitest run`
Expected: PASS, including `routes/scores.test.js`.

- [ ] **Step 2: Run the full frontend suite + build**

Run: `cd frontend && npx vitest run && npx vite build`
Expected: tests PASS, build succeeds.

- [ ] **Step 3: Manual smoke (use the `run` skill / dev server)**

Start backend (`cd backend && node server.js`) and frontend dev server (`cd frontend && npm run dev`), then in the browser:
- Open the Neon Drift title → Play → crash.
- As a guest: type a name → "Add to leaderboard" → the board appears with your row highlighted; reopen and confirm the name field is prefilled next run.
- Sign in → crash → "Submit as <First L.>" → board shows the abbreviated account name with the verified dot; submit a lower score next run and confirm the board still shows your best.
- Verify Escape still closes the overlay and keyboard steering is unaffected by the new input field.

- [ ] **Step 4: Final commit (if any verification fixes were needed)**

```bash
git add -A
git commit -m "test(game): verify Neon Drift leaderboard end to end"
```

---

## Notes for the implementer

- **Optional auth is the key idea:** `/api/scores` is mounted WITHOUT `requireAuth`. It calls `currentUser(req)` itself (returns the user or `null`), so guests and signed-in users hit the same endpoint.
- **Why derive registered names at read time:** storing only the guest `name` and computing the registered display from `User.name` on GET means a user renaming their account is reflected on the board with no backfill, and the last name never persists in `game_scores`.
- **Known limitation (by design):** the score is client-reported and forgeable. We defend cheaply only — integer + ceiling validation, per-IP `rateLimit`, explicit user-initiated submit. No server-side game simulation. This is a portfolio artifact, not a competitive ladder.
- The shared `rateLimit` helper is already covered by `auth.test.js`; the scores tests stub it to a passthrough and do not re-test the limiter itself.
```
