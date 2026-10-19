# Task 008 — Mission & Event Log API

## Objective

Implement the mission and event-log domains on the backend. Missions can be created, started, and completed. The simulation tick advances active missions and records events. After this task the full backend API surface is complete.

## Context

- Read `.claude/docs/backend.md` — domain folder structure, rules, simulation tick
- Read `.claude/docs/database.md` — missions and event_log schemas

## Scope

| Action | File |
|--------|------|
| Create | `apps/server/src/domains/mission/mission.router.ts` |
| Create | `apps/server/src/domains/mission/mission.service.ts` |
| Create | `apps/server/src/domains/mission/mission.repository.ts` |
| Create | `apps/server/src/domains/mission/mission.types.ts` |
| Create | `apps/server/src/domains/event-log/event-log.router.ts` |
| Create | `apps/server/src/domains/event-log/event-log.service.ts` |
| Create | `apps/server/src/domains/event-log/event-log.repository.ts` |
| Create | `apps/server/src/domains/event-log/event-log.types.ts` |
| Modify | `apps/server/src/app.ts` — register mission + event-log routers |
| Modify | `apps/server/src/simulation/tick.ts` — advance mission timers, log events |

## API Endpoints

### Missions
| Method | Path | Description |
|--------|------|-------------|
| GET | `/missions` | List all missions (supports `?status=active`) |
| GET | `/missions/:id` | Get single mission |
| POST | `/missions` | Create a new queued mission |
| PATCH | `/missions/:id` | Transition mission status |

### Event Log
| Method | Path | Description |
|--------|------|-------------|
| GET | `/events` | Get recent events (last 50, `?limit=N` supported) |

## Validation (Zod)

### POST /missions
```ts
{
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  durationSeconds: z.number().int().min(10),
  reward: z.record(z.number()).optional(), // { oxygen: 50, fuel: 30 }
}
```

### PATCH /missions/:id
```ts
{
  status: z.enum(['active', 'complete', 'failed']),
}
```

## Business Rules (in services)

- Only `queued` missions can be set to `active` (sets `started_at`)
- Only `active` missions can be set to `complete` or `failed`
- On `complete`: apply `reward` deltas to resources, log `mission_complete` event
- On `failed`: log `mission_failed` event
- Simulation tick: advance active mission timers; auto-complete when `durationSeconds` elapsed

## Unit Tests

- `mission.service.test.ts` — test create, status transitions, reward application
- `event-log.service.test.ts` — test query with limit

## Acceptance Criteria

- [ ] `GET /missions` returns all 3 seeded missions
- [ ] `POST /missions` creates a new queued mission
- [ ] `PATCH /missions/:id` with `{ status: 'active' }` starts mission (sets `started_at`)
- [ ] Completing a mission applies resource rewards
- [ ] `GET /events` returns up to 50 events, sorted by `created_at DESC`
- [ ] `nx test server` passes
- [ ] `nx build server` passes
- [ ] `nx run-many --target=lint` passes

## Dependencies

- Task 005 (backend foundation) must be complete
- Task 006 (resource API) must be complete — needed for reward application
- Task 003 (schema) must be complete

## Notes
_Fill in after execution._
