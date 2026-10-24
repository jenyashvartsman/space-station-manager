# Task 036 — README

## Objective

Write a comprehensive `README.md` at the repo root covering what the app is, how to run it, how to use it, and how the codebase is organized. After this task a developer who clones the repo can get the app running without consulting anyone.

## Context

- Read `.claude/docs/architecture.md` — stack, ports, project structure
- Read `.claude/docs/app.md` — feature overview
- Read `docker/docker-compose.dev.yml` — database startup
- Read `package.json` (root) — available nx scripts

## Scope

| Action | File |
|--------|------|
| Create | `README.md` — repo root |

## README Structure

### 1. Header
- Title: **Space Station Manager**
- One-liner: "An operational command interface for managing a deep-space station — crew, modules, resources, and missions."
- ASCII mockup of the app dashboard

### 2. Features
Bulleted list — one line per page:
- Station Dashboard — live telemetry overview
- Crew Roster — personnel status and role management
- Module Management — installed modules and system health
- Resource Panel — inventory levels with critical/low alerts
- Mission Control — launch and track station missions
- Event Log — real-time station alert feed

### 3. Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Ant Design, Framer Motion, D3, Zustand |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (via Docker) |
| Monorepo | Nx |

### 4. Prerequisites
- Node.js ≥ 18
- Docker Desktop

### 5. Getting Started
```bash
# 1. Clone
git clone <repo-url>
cd space-station-manager

# 2. Install dependencies
npm install

# 3. Start the database
docker compose -f docker/docker-compose.dev.yml up -d

# 4. Apply schema and seed
npx nx run db:migrate
npx nx run db:seed

# 5. Start dev servers
npx nx run-many --target=serve --parallel

# Client → http://localhost:5173
# Server → http://localhost:3000
```

### 6. Available Scripts
| Command | Description |
|---------|-------------|
| `npx nx serve client` | Start frontend dev server |
| `npx nx serve server` | Start backend dev server |
| `npx nx run-many --target=serve --parallel` | Start both |
| `npx nx test client` | Run client tests |
| `npx nx test server` | Run server tests |
| `npx nx run-many --target=test` | Run all tests |
| `npx nx build client` | Build client |
| `npx nx build server` | Build server |
| `npx nx run-many --target=lint` | Lint all projects |

### 7. Project Structure
```
space-station-manager/
├── apps/
│   ├── client/          # React frontend (Vite)
│   │   └── src/
│   │       ├── domains/ # Feature domains (crew, mission, module, …)
│   │       ├── pages/   # Route-level page components
│   │       ├── shared/  # Cross-domain components, motion, copy
│   │       └── app/     # App shell, router
│   ├── server/          # Express backend
│   │   └── src/         # Routes and services per domain
│   └── db/              # Schema, migrations, seed
├── docker/              # Docker Compose files
└── .claude/             # AI Factory docs and tasks
```

### 8. Using the App
1. **Station Dashboard** — open at `/station` for a live overview
2. **Crew Roster** — `/crew` — view crew members, health, and role
3. **Module Management** — `/modules` — see which modules are online or offline
4. **Resource Panel** — `/resources` — check oxygen, power, food, fuel, water levels
5. **Mission Control** — `/missions` — start queued missions, watch them run, see rewards
6. **Event Log** — `/events` — real-time feed of all station alerts and completions
7. **Reset Station** — bottom of the Dashboard — wipes data and re-seeds to factory defaults

### 9. API Reference
| Method | Path | Description |
|--------|------|-------------|
| GET | `/station` | Station overview |
| GET | `/crew` | List crew |
| PATCH | `/crew/:id` | Update crew member |
| GET | `/modules` | List modules |
| PATCH | `/modules/:id` | Update module |
| GET | `/resources` | List resources |
| PATCH | `/resources/:id` | Update resource |
| GET | `/missions` | List missions |
| POST | `/missions` | Create mission |
| PATCH | `/missions/:id` | Update mission status |
| GET | `/events` | List events (supports `?limit=`) |
| POST | `/station/reset` | Wipe and re-seed database |

### 10. Development Notes
- All files named after space station domain concepts — no generic names
- Feature code lives in `apps/client/src/domains/<domain>/`
- Task history at `.claude/logs/factory.log`

## Acceptance Criteria

- [ ] `README.md` exists at the repo root
- [ ] All 10 sections present
- [ ] Getting Started commands are accurate
- [ ] Script table matches actual nx targets
- [ ] Project structure tree reflects real directory layout

## Dependencies

- All tasks 001–035 should be complete

## Notes
_Fill in after execution._
