# Task 007 — Crew & Module API

## Objective

Implement the crew and module domains on the backend. After this task the full CRUD surface for both domains is available, including crew assignment to modules.

## Context

- Read `.claude/docs/backend.md` — domain folder structure, rules
- Read `.claude/docs/database.md` — crew_members and modules schemas

## Scope

| Action | File |
|--------|------|
| Create | `apps/server/src/domains/crew/crew.router.ts` |
| Create | `apps/server/src/domains/crew/crew.service.ts` |
| Create | `apps/server/src/domains/crew/crew.repository.ts` |
| Create | `apps/server/src/domains/crew/crew.types.ts` |
| Create | `apps/server/src/domains/module/module.router.ts` |
| Create | `apps/server/src/domains/module/module.service.ts` |
| Create | `apps/server/src/domains/module/module.repository.ts` |
| Create | `apps/server/src/domains/module/module.types.ts` |
| Modify | `apps/server/src/app.ts` — register crew + module routers |

## API Endpoints

### Crew
| Method | Path | Description |
|--------|------|-------------|
| GET | `/crew` | List all crew with their assigned module |
| GET | `/crew/:id` | Get single crew member |
| PATCH | `/crew/:id` | Update crew (status, assigned_module_id, health) |

### Modules
| Method | Path | Description |
|--------|------|-------------|
| GET | `/modules` | List all modules with crew count |
| GET | `/modules/:id` | Get module with full crew list |
| PATCH | `/modules/:id` | Update module (status, name) |

## Validation (Zod)

### PATCH /crew/:id
```ts
{
  status?: 'active' | 'resting' | 'injured' | 'eva',
  health?: z.number().min(0).max(100),
  assignedModuleId?: z.string().uuid().nullable(),
}
```

### PATCH /modules/:id
```ts
{
  status?: 'nominal' | 'warning' | 'critical' | 'offline',
  name?: z.string().min(1),
}
```

## Business Rules (in services)

- A crew member can only be assigned to a module that belongs to the same station
- Setting `assignedModuleId: null` unassigns the crew member
- Setting a module to `offline` status sets all assigned crew to `resting`

## Unit Tests

- `crew.service.test.ts` — test list, get, update, assignment validation
- `module.service.test.ts` — test list, get, update, offline rule

## Acceptance Criteria

- [ ] `GET /crew` returns all 5 crew members (after seed)
- [ ] `GET /modules` returns all 6 modules with crew counts
- [ ] `PATCH /crew/:id` with `{ assignedModuleId: <uuid> }` updates the assignment
- [ ] Setting module to offline unassigns crew
- [ ] `GET /modules/:id` 404s for a non-existent ID
- [ ] `nx test server` passes
- [ ] `nx build server` passes
- [ ] `nx run-many --target=lint` passes

## Dependencies

- Task 005 (backend foundation) must be complete
- Task 003 (schema) must be complete

## Notes
_Fill in after execution._
