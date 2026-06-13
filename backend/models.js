// Data model — User owns everything; ListItem + WatchProgress are the
// per-user data the frontend used to keep in localStorage. The film
// catalog stays static in the frontend (it's curated content, not user data).
import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
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
