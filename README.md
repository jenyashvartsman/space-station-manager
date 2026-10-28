# Space Station Manager

A HUD-style space station management game running in your browser.

## Screenshots / Preview

> Add screenshots after first deploy.

## What It Is

Space Station Manager is a game-like operations console where you command a space station in real time. Monitor oxygen, power, and food reserves; assign crew to modules; launch missions; and track every station event through a scrolling event log — all rendered as a sci-fi HUD.

## Gameplay

You inherit a fully crewed space station and must keep it alive.

**Resources deplete in real time.** The server ticks every 5 seconds, consuming oxygen, power, food, and fuel based on the active load of each module. Let a resource hit zero and the station starts failing.

**Modules govern consumption.** Each section of the station — life support, lab, docking bay, and others — draws power when online. Take a module offline to cut its draw; this also idles the crew assigned to it.

**Crew need managing.** Each crew member has a health value, a role, and a module assignment. Injured crew recover when resting; healthy crew working in functional modules keep the station running efficiently.

**Missions generate rewards.** Launch a mission from Mission Control, set a duration, and wait. Completed missions return resources (oxygen, power, food, fuel) that offset the station's constant drain. Active missions have a countdown timer; abandon them if conditions change.

**The event log tells the story.** Every resource depletion warning, mission outcome, module status change, and crew event is written to the live event feed so you can trace what went wrong — or right.

**Reset at any time.** The Station Reset button re-seeds the database and reloads the page, returning the station to its original state.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| State management | Zustand |
| UI components | Ant Design |
| Styling | SCSS + BEM |
| Animations | Framer Motion |
| Charts | Recharts |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Drizzle |
| Monorepo tooling | Nx |
| Infra (dev) | Docker (DB only) |
| Infra (prod) | Docker Compose (full stack) |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop (for the dev database)

### Install

```bash
git clone <repo-url>
cd space-station-manager
npm install
```

### Run (dev)

Start the database container, then the backend and frontend in separate terminals.

```bash
# Terminal 1 — database
docker compose -f docker/docker-compose.dev.yml up -d

# Terminal 2 — backend (http://localhost:3000)
npx nx serve server

# Terminal 3 — frontend (http://localhost:4200)
npx nx serve client
```

### Run (with Docker DB)

The dev Docker Compose file runs only the PostgreSQL container. The `.env.example` file documents all required environment variables; copy it to `.env` and adjust as needed.

```bash
cp .env.example .env
docker compose -f docker/docker-compose.dev.yml up -d
```

### Seed the database

```bash
npx nx run db:seed
```

This drops all tables, re-applies migrations, and inserts development data.

## Project Structure

```
space-station-manager/
├── apps/
│   ├── client/        # React + Vite frontend
│   └── server/        # Node.js + Express API
├── libs/
│   └── db/            # Drizzle schema, migrations, seed  (@space-station/db)
├── docker/
│   ├── docker-compose.dev.yml   # DB container only
│   └── docker-compose.prod.yml  # Full stack
├── nx.json
├── tsconfig.base.json
└── package.json
```

## Domain Model

- **Station** — top-level entity; owns all modules, resources, and crew
- **Module** — a section of the station (life support, lab, docking bay, etc.)
- **Resource** — consumables tracked over time: oxygen, power, food, fuel
- **Crew** — crew members assigned to modules; each has a role and status
- **Mission** — a time-boxed operation that consumes resources and involves crew
- **EventLog** — append-only feed of every significant station event

## Available Scripts

| Command | Description |
|---|---|
| `npx nx serve client` | Start frontend dev server |
| `npx nx serve server` | Start backend dev server |
| `npx nx test client` | Run client unit tests |
| `npx nx test server` | Run server unit tests |
| `npx nx run-many --target=test` | Run all tests |
| `npx nx build client` | Production build — client |
| `npx nx build server` | Production build — server |
| `npx nx run-many --target=build` | Production build — all |
| `npx nx run-many --target=lint` | Lint all projects |
| `npx nx run db:seed` | Drop, migrate, and seed the database |

## Factory Method

This project is built with the **AI Factory Method**: all work is broken into numbered, discrete tasks defined in `.claude/tasks/`. An AI agent (Claude Code) executes one task at a time, runs tests and a build after every change, and appends a one-line entry to `.claude/logs/factory.log` on completion. Architectural decisions live in `.claude/docs/` and are read before every task. `status.md` tracks the current task and all completed work. This structure keeps human and AI in sync and every decision auditable.
