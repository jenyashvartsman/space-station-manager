# Backend — Space Station Manager

> **Status:** Decided — stack locked.

---

## Domain-Focused Rule

All backend code is organized and named around space station domain concepts.

| Rule | Example |
|------|---------|
| Routes named after domain resources | `/station`, `/modules`, `/crew`, `/resources`, `/missions` |
| Services named after domain actions | `StationService`, `CrewService`, `MissionService`, `ResourceService` |
| Repositories named after entities | `StationRepository`, `CrewRepository`, `MissionRepository` |
| No generic service names | ~~`DataService`~~, ~~`ItemController`~~, ~~`processItem`~~ |
| Business logic in services, not routes | Route handlers only validate input, call a service, return a response |

---

## Stack

| Layer | Choice |
|-------|--------|
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| Monorepo | Nx — `nx serve server`, `nx test server`, `nx build server` |
| API style | REST |
| ORM | Drizzle ORM |
| Database | PostgreSQL |
| Validation | Zod |
| Testing | Vitest + Supertest |
| Auth | None (v1 — single player) |

---

## Folder Structure

```
apps/server/src/
├── server.ts                    # Entry point — creates HTTP server
├── app.ts                       # Express app setup — registers middleware & routers
│
├── domains/                     # One folder per domain — grows with the app
│   ├── station/
│   │   ├── station.router.ts    # Express router — validates input, calls service
│   │   ├── station.service.ts   # Business logic
│   │   ├── station.repository.ts# Drizzle queries — imports db from @space-station/db
│   │   └── station.types.ts     # Request/response types for this domain
│   ├── module/
│   │   ├── module.router.ts
│   │   ├── module.service.ts
│   │   ├── module.repository.ts
│   │   └── module.types.ts
│   ├── crew/
│   ├── resource/
│   ├── mission/
│   └── event-log/
│
├── middleware/
│   ├── error.middleware.ts      # Global error handler
│   ├── auth.middleware.ts       # JWT guard (once auth is decided)
│   └── logger.middleware.ts     # Request logging
│
└── shared/
    ├── errors.ts                # Domain error classes (NotFoundError, etc.)
    └── types.ts                 # Shared response envelope types

# DB layer lives in libs/db — not inside the server app:
libs/db/src/
├── connection.ts                # Drizzle instance + pg pool — import as @space-station/db
├── schema/
│   ├── station.schema.ts
│   ├── module.schema.ts
│   ├── crew.schema.ts
│   ├── resource.schema.ts
│   ├── mission.schema.ts
│   └── event-log.schema.ts
├── migrations/                  # Drizzle Kit generated migrations
└── seed/
    ├── index.ts                 # Entry — drops all tables, runs migrations, seeds in order
    ├── station.seed.ts
    ├── module.seed.ts
    ├── crew.seed.ts
    ├── resource.seed.ts
    ├── mission.seed.ts
    └── event-log.seed.ts
```

**Rules:**
- Domain folders are the unit of growth — add a domain, add a folder
- Routers: validate input (Zod), call service, return response — nothing else
- Services: all business logic — no DB calls, no HTTP details
- Repositories: all Drizzle queries — import `db` from `@space-station/db`, never write raw SQL
- `shared/` only for things used by 3+ domains
- Schema and migrations live in `libs/db` — never duplicate table definitions inside the server

---

## Seeders

Seeders live in `libs/db/src/seed/`. They are run via Nx as a standalone script — not part of the server runtime.

### Behavior

The seed script is **destructive by design**:

```
1. Drop all tables (in reverse FK order)
2. Run all Drizzle Kit migrations (recreate schema)
3. Insert seed data domain by domain
```

Use for: local dev reset, CI test database setup. Never run against production.

### Nx Command

```bash
nx run db:seed
```

Defined in `libs/db/project.json` as a `node` executor targeting `seed/index.ts`.

### Seed Entry Point (`seed/index.ts`)

```ts
// Pseudocode — actual implementation in task
await dropAllTables(db)      // truncate or drop+recreate via migrations
await runMigrations(db)
await seedStation(db)
await seedModules(db)
await seedCrew(db)
await seedResources(db)
await seedMissions(db)
await seedEventLog(db)
console.log('Seed complete')
process.exit(0)
```

### Domain Seed Files

Each `*.seed.ts` exports a single function `seed<Domain>(db)` that inserts realistic dev data for that domain. Seed files may import from each other only for FK references (e.g. `module.seed.ts` needs the station ID from `station.seed.ts`).

### Rules

- Seed files are the only place with hardcoded domain data — never in services or tests
- Each domain seed must be idempotent if re-run after a clean drop
- No seed data in production builds — the seed script is excluded from the server app bundle

---

## API Endpoints (Planned)

### Station
| Method | Path | Description |
|--------|------|-------------|
| GET | `/station` | Get station state |
| PATCH | `/station` | Update station settings |

### Modules
| Method | Path | Description |
|--------|------|-------------|
| GET | `/modules` | List all modules |
| GET | `/modules/:id` | Get module detail |
| PATCH | `/modules/:id` | Update module state |

### Crew
| Method | Path | Description |
|--------|------|-------------|
| GET | `/crew` | List all crew |
| GET | `/crew/:id` | Get crew member |
| PATCH | `/crew/:id` | Update crew assignment |

### Resources
| Method | Path | Description |
|--------|------|-------------|
| GET | `/resources` | Get all resource levels |

### Missions
| Method | Path | Description |
|--------|------|-------------|
| GET | `/missions` | List missions |
| POST | `/missions` | Create mission |
| PATCH | `/missions/:id` | Update mission status |

---

## Simulation Engine

The core game loop / simulation tick:
- Runs on a server-side `setInterval` (real-time tick — decided)
- Consumes resources based on active modules
- Advances mission timers
- Generates events (alerts, crew status changes)

---

## Error Handling

- All errors return `{ error: string, code: string }`
- HTTP status codes follow REST conventions
- Validation errors return 400 with field-level detail

---

## Open Questions

- [x] Auth strategy — **None in v1 (single player)**
- [x] Simulation tick — **Server-side interval (real-time tick)**
- [x] Save model — **Single station, no user accounts**
- [ ] WebSocket for real-time events? — polling first, revisit if needed
