// Dialect is picked from DATABASE_URL so the same config works locally (SQLite)
// and on Render (Postgres) without changing any code.
import { Sequelize } from "sequelize";

const url = process.env.DATABASE_URL || "";
const isPostgres = url.startsWith("postgres://") || url.startsWith("postgresql://");

let sequelize;
let dbKind;

if (isPostgres) {
  dbKind = "postgres";
  // Coolify-internal Postgres needs NO SSL; external managed DBs (Neon) do.
  // Opt in with DATABASE_SSL=true or ?sslmode=require in the URL.
  const wantSsl = process.env.DATABASE_SSL === "true" || /sslmode=require/.test(url);
  // rejectUnauthorized:false is intentional and only applies on this SSL branch,
  // which is for external managed Postgres (e.g. Neon) whose certs aren't in the
  // container's trust store. The primary prod DB is Coolify-internal Postgres on
  // a private Docker network with NO SSL (this branch is skipped), so we're not
  // disabling verification for traffic that crosses the public internet here.
  sequelize = new Sequelize(url, {
    dialect: "postgres",
    logging: false,
    dialectOptions: wantSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  });
} else {
  dbKind = "sqlite";
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.SQLITE_PATH || "./data.sqlite",
    logging: false,
  });
}

export { sequelize, dbKind };
