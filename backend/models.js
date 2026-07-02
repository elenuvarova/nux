// Data model — User owns everything; ListItem + WatchProgress are the
// per-user data the frontend used to keep in localStorage. The film
// catalog stays static in the frontend (it's curated content, not user data).
import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // normalize at the model layer so the case-insensitive-uniqueness invariant
      // lives in ONE place, not in every call site remembering to .toLowerCase().
      // With every write lowercased, the unique index enforces it at the DB too.
      set(value) {
        this.setDataValue("email", typeof value === "string" ? value.trim().toLowerCase() : value);
      },
    },
    name: { type: DataTypes.STRING, allowNull: false },
    hashedPassword: { type: DataTypes.STRING, allowNull: false },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: "users" }
);

export const Session = sequelize.define(
  "Session",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    token: { type: DataTypes.STRING, allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    userAgent: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: "sessions" }
);

export const ListItem = sequelize.define(
  "ListItem",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    filmId: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "list_items",
    indexes: [{ unique: true, fields: ["UserId", "filmId"] }],
  }
);

export const WatchProgress = sequelize.define(
  "WatchProgress",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    filmId: { type: DataTypes.STRING, allowNull: false },
    frac: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0.05 },
  },
  {
    tableName: "watch_progress",
    indexes: [{ unique: true, fields: ["UserId", "filmId"] }],
  }
);

// Persisted Curator conversation — one row per turn (user or assistant), in
// order, scoped to the user. Guests are never stored (the frontend keeps their
// chat in memory only). `films` holds the recommended film ids for assistant
// turns. JSON works on both SQLite (TEXT) and Postgres.
export const CuratorMessage = sequelize.define(
  "CuratorMessage",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    role: { type: DataTypes.STRING, allowNull: false }, // "user" | "assistant"
    content: { type: DataTypes.TEXT, allowNull: false },
    films: { type: DataTypes.JSON, allowNull: true },
  },
  { tableName: "curator_messages" }
);

// Single-use, short-lived password-reset tokens. We store only a SHA-256
// hash of the token, so a DB leak never exposes a usable reset link.
export const PasswordReset = sequelize.define(
  "PasswordReset",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tokenHash: { type: DataTypes.STRING, allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },
  { tableName: "password_resets" }
);

// Cached generative editorial collections (the "Curator's shelf"). Universal —
// the same set for everyone, so there is no User association. The whole set is
// regenerated as a batch; `generatedAt` is identical across a batch and drives
// the staleness/refresh check. `entries` is [[filmId, note], ...]. JSON works
// on both SQLite (TEXT) and Postgres.
export const CuratorCollection = sequelize.define(
  "CuratorCollection",
  {
    slug: { type: DataTypes.STRING, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    eyebrow: { type: DataTypes.STRING, allowNull: true },
    intro: { type: DataTypes.TEXT, allowNull: true },
    entries: { type: DataTypes.JSON, allowNull: false },
    position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    generatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  { tableName: "curator_collections" }
);

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

// Web-push subscriptions for the weekly "new collections" broadcast. One row
// per browser endpoint (the endpoint URL is the identity — unique, and can
// exceed 255 chars, hence STRING(512)). UserId is nullable: the broadcast is
// content marketing, so signed-out visitors may subscribe too. Rows are pruned
// when the push service reports the endpoint gone (404/410).
export const PushSubscription = sequelize.define(
  "PushSubscription",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    endpoint: { type: DataTypes.STRING(512), allowNull: false, unique: true },
    p256dh: { type: DataTypes.STRING, allowNull: false },
    auth: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "push_subscriptions" }
);

// Fixed-window rate-limit counters, keyed by `${bucket}:${ip}`. Persisted (not
// in-memory) so the window survives redeploys and is shared across instances —
// an attacker can't reset their count by waiting for the next Coolify deploy.
export const RateLimit = sequelize.define(
  "RateLimit",
  {
    key: { type: DataTypes.STRING, primaryKey: true },
    count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    resetAt: { type: DataTypes.DATE, allowNull: false },
  },
  { tableName: "rate_limits", timestamps: false }
);

// Associations — onDelete cascade so deleting a user wipes their data.
User.hasMany(Session, { onDelete: "CASCADE" });
Session.belongsTo(User);
User.hasMany(PasswordReset, { onDelete: "CASCADE" });
PasswordReset.belongsTo(User);
User.hasMany(ListItem, { onDelete: "CASCADE" });
ListItem.belongsTo(User);
User.hasMany(WatchProgress, { onDelete: "CASCADE" });
WatchProgress.belongsTo(User);
User.hasMany(CuratorMessage, { onDelete: "CASCADE" });
CuratorMessage.belongsTo(User);
User.hasMany(GameScore, { onDelete: "CASCADE" });
GameScore.belongsTo(User);
// SET NULL, not CASCADE: notification permission belongs to the BROWSER, not
// the account — deleting the account demotes the row to an anonymous
// subscription instead of silently cancelling what the device opted into.
User.hasMany(PushSubscription, { onDelete: "SET NULL" });
PushSubscription.belongsTo(User);
