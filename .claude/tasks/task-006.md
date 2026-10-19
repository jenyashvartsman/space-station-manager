# Task 006 — Station & Resource API

## Objective

Implement the station and resource domains on the backend: router, service, repository for each. Add the server-side simulation tick that consumes resources each interval. After this task `GET /station` and `GET /resources` return live data, and resources deplete at the configured rate.

## Context

- Read `.claude/docs/backend.md` — domain folder structure, router/service/repository rules
- Read `.claude/docs/database.md` — station and resource schemas
- Read `.claude/docs/architecture.md` — simulation engine description

## Scope

| Action | File |
|--------|------|
| Create | `apps/server/src/domains/station/station.router.ts` |
| Create | `apps/server/src/domains/station/station.service.ts` |
| Create | `apps/server/src/domains/station/station.repository.ts` |
| Create | `apps/server/src/domains/station/station.types.ts` |
| Create | `apps/server/src/domains/resource/resource.router.ts` |
| Create | `apps/server/src/domains/resource/resource.service.ts` |
| Create | `apps/server/src/domains/resource/resource.repository.ts` |
| Create | `apps/server/src/domains/resource/resource.types.ts` |
| Create | `apps/server/src/simulation/tick.ts` — simulation engine |
| Modify | `apps/server/src/app.ts` — register station + resource routers |

## API Endpoints

### Station
| Method | Path | Handler |
|--------|------|---------|
| GET | `/station` | `StationService.getStation()` |
| PATCH | `/station` | `StationService.updateStation(data)` |

### Resources
| Method | Path | Handler |
|--------|------|---------|
| GET | `/resources` | `ResourceService.getAllResources()` |

## Simulation Tick (`tick.ts`)

- `setInterval` every **5000ms** (5s tick)
- Each tick: fetch all resources → apply `consumption_rate` → clamp to `[0, capacity]` → update DB
- If any resource hits 0: insert an `event_log` entry with `type: 'resource_depleted'`
- Export `startSimulationTick(db)` — called from `server.ts` after DB is ready

## Validation (Zod)

- `PATCH /station` body: `{ name?: string }` — optional name update

## Unit Tests

- `station.service.test.ts` — mock repository, test getStation, updateStation
- `resource.service.test.ts` — mock repository, test getAllResources
- `tick.test.ts` — test that consumption reduces current by `consumption_rate`, clamps at 0

## Acceptance Criteria

- [ ] `GET /station` returns station data (after seed)
- [ ] `GET /resources` returns array of 5 resources
- [ ] `PATCH /station` with `{ name: "New Name" }` updates and returns updated station
- [ ] Simulation tick runs every 5s and reduces resource levels
- [ ] `nx test server` passes
- [ ] `nx build server` passes
- [ ] `nx run-many --target=lint` passes

## Dependencies

- Task 003 (schema) and Task 004 (seed) must be complete
- Task 005 (backend foundation) must be complete

## Notes
_Fill in after execution._
