# nux

A minimal full-stack template built with React + Vite on the frontend and Node.js + Express + Sequelize on the backend. It deploys for free on Render using a free web service and a free Postgres database, provisioned automatically via a Blueprint file.

## Stack

- **Frontend:** React 18 + Vite 5 (JavaScript)
- **Backend:** Node.js + Express, ES modules
- **Database:** Sequelize ORM — SQLite locally (no install required), PostgreSQL on Render (auto-provisioned)
- **Deploy:** Render free tier via `render.yaml` Blueprint

## Project structure

```
.
├── backend/
│   ├── package.json
│   ├── server.js
│   └── db.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── styles.css
├── Dockerfile
├── render.yaml
├── .env.example
├── .gitignore
├── .dockerignore
└── README.md
```

## Local development

No database to install — SQLite is built in and created automatically on first run.

**Terminal 1 — backend:**

```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — frontend:**

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The frontend proxies `/api` requests to the backend on port 3001.

## Deploy to Render

1. Push this repo to GitHub.
2. In Render: **New → Blueprint** → connect your repo.
3. Render reads `render.yaml` and provisions a free web service and a free Postgres database. `DATABASE_URL` is wired automatically — no copy/paste.

**Free tier notes:**
- The web service sleeps after inactivity; the first request after sleep takes ~30 seconds.
- Render's free Postgres databases expire after 90 days and must be recreated.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Returns `{ status: "ok", db: "sqlite" \| "postgres" }` |
| GET | `/api/hello` | Returns `{ message: "Hello from the backend 👋" }` |
| GET | `*` | Serves the built frontend (production only) |
