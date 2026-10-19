# Architecture — Space Station Manager

> **Status:** Decided — stack locked.

---

## Overview

_Describe the high-level system. What are the main moving parts?_

Space Station Manager is a **monorepo** application (frontend + backend in one repo) that allows users to manage a space station: resources, crew, modules, and missions.

The system is containerized with Docker. In development only the database runs in a container; the frontend and backend run on the host. In production everything runs in containers.

---

## System Diagram

```
[ Client (Browser) ]
        |
        v
[ React App — Ant Design + SCSS/BEM ]
        |
      REST (Express)
        |
        v
[ Node.js / Express API ]
        |
        v
[ PostgreSQL ]
```

**Docker topology:**
```
DEV:   host: React (Vite)  +  host: Express  →  container: PostgreSQL
PROD:  container: React (nginx)  +  container: Express  +  container: PostgreSQL
```

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend framework | React (Vite) | Industry standard, large ecosystem |
| State management | Zustand | Minimal boilerplate, no provider wrapping needed |
| UI component library | Ant Design | Rich data-heavy components, fits dashboard UX |
| Styling | SCSS + BEM | Scoped, readable, no runtime cost |
| Backend runtime | Node.js | Same language as frontend, strong ecosystem |
| API framework | Express | Lightweight, well-understood, no magic |
| API style | REST | Simple CRUD fits the domain |
| Database | PostgreSQL | Relational model fits the domain, strong JSON support |
| ORM | Drizzle | TypeScript-first, lightweight, SQL-close |
| Containerization | Docker | Dev: DB only; Prod: full stack |
| Auth | None (v1) | Single player — no accounts needed |
| Hosting | TBD | Decide before prod task |
| Real-time | Polling | Start with polling; upgrade to WebSocket if lag is felt |
| Code formatting | Prettier | Enforced via pre-commit; single style across monorepo |
| Linting | ESLint (flat config) | TypeScript + React rules; errors block CI |

---

## Monorepo Tool

**Nx** — task orchestration, caching, dependency graph, code generation.

Key Nx conventions used in this project:
- Apps live in `apps/` — each is an independently buildable/testable unit
- Shared code lives in `libs/` — imported as `@space-station/[lib-name]`
- All tasks run via `nx run <project>:<target>` or `nx run-many`
- Nx caches build/test outputs — only reruns what changed

## Monorepo Root Layout

```
space-station-manager/
├── apps/
│   ├── client/                      # React + Vite frontend
│   │   ├── src/                     # See frontend.md for full structure
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── project.json             # Nx project config
│   │
│   └── server/                      # Node.js + Express backend
│       ├── src/                     # See backend.md for full structure
│       ├── tsconfig.json
│       └── project.json             # Nx project config
│
├── libs/
│   └── db/                          # Drizzle ORM — schema, connection, migrations, seed
│       ├── src/
│       │   ├── schema/              # Drizzle table definitions (all domains)
│       │   ├── migrations/          # Drizzle Kit generated migrations
│       │   ├── seed/                # Seeders — drop + migrate + insert dev data
│       │   └── connection.ts        # pg pool + Drizzle instance
│       └── project.json             # Nx project config
│       # imported as @space-station/db
│
├── docker/
│   ├── docker-compose.dev.yml       # DB container only
│   └── docker-compose.prod.yml      # client + server + db
│
├── nx.json                          # Nx workspace config
├── tsconfig.base.json               # Shared TS config
├── package.json                     # Single root package.json
├── .prettierrc                      # Prettier config (shared across all apps/libs)
├── .eslintrc.js                     # Root ESLint config (extended per project)
├── .env.example                     # Committed env template (no secrets)
├── .claude/
├── CLAUDE.md
├── FACTORY.md
└── status.md
```

## Nx Common Commands

| Action | Command |
|--------|---------|
| Dev (client) | `nx serve client` |
| Dev (server) | `nx serve server` |
| Test (client) | `nx test client` |
| Test (server) | `nx test server` |
| Test (all) | `nx run-many --target=test` |
| Build (client) | `nx build client` |
| Build (server) | `nx build server` |
| Build (all) | `nx run-many --target=build` |
| Affected only | `nx affected --target=test` |
| Seed DB | `nx run db:seed` — drops all tables, remigrates, inserts dev data |
| Format | `nx run-many --target=format` or `prettier --write .` |
| Lint | `nx run-many --target=lint` |

## Prettier & ESLint

Both tools are configured at the monorepo root and applied to all apps and libs.

**`.prettierrc`**
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

**ESLint** uses flat config (`eslint.config.js`) with:
- `@typescript-eslint/recommended` — TypeScript rules
- `eslint-plugin-react` + `eslint-plugin-react-hooks` — React rules (client only)
- `no-console` warning in server code
- Import order enforced via `eslint-plugin-import`

Each Nx project extends the root config via its own `eslint.config.js`.

---

## Domain Model (High Level)

- **Station** — the top-level entity; has modules, resources, crew
- **Module** — a section of the station (e.g. life support, lab, docking bay)
- **Resource** — oxygen, power, food, fuel, etc.
- **Crew Member** — assigned to modules, has skills and status
- **Mission** — a time-boxed operation affecting resources and crew

---

## Non-Functional Requirements

- [ ] Responsive web app (desktop-first)
- [ ] Target load time: < 2s
- [ ] Offline support: TBD
- [ ] Accessibility: WCAG 2.1 AA

---

## Open Questions

- [x] Single player or multiplayer? — **Single player**
- [x] Real-time simulation tick or turn-based? — **Real-time server tick**
- [x] Cloud save or local only? — **Single station per user, no multi-save**
- [x] Auth strategy? — **None in v1 (single player)**
- [ ] Hosting target — decide before prod task
