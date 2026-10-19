# Task 004 — Database Seed Data

## Objective

Build the seed system in `libs/db/src/seed/`: a destructive drop → migrate → insert pipeline that populates the database with realistic development data for all six domains. After this task `nx run db:seed` gives you a fully populated station to work with.

## Context

- Read `.claude/docs/database.md` — schema, FK order, seed rules
- Read `.claude/docs/backend.md` — seed entry point structure, Nx seed command

## Scope

| Action | File |
|--------|------|
| Create | `libs/db/src/seed/index.ts` — orchestrator |
| Create | `libs/db/src/seed/station.seed.ts` |
| Create | `libs/db/src/seed/module.seed.ts` |
| Create | `libs/db/src/seed/crew.seed.ts` |
| Create | `libs/db/src/seed/resource.seed.ts` |
| Create | `libs/db/src/seed/mission.seed.ts` |
| Create | `libs/db/src/seed/event-log.seed.ts` |
| Modify | `libs/db/project.json` — add `seed` Nx target |

## Seed Data Requirements

### Station
- 1 station: `{ name: 'Kepler Station Alpha' }`

### Modules (6 total, varied statuses)
| name | type | status | power_consumption |
|------|------|--------|-------------------|
| Life Support Alpha | life_support | nominal | 12.5 |
| Research Lab | lab | nominal | 8.0 |
| Docking Bay 1 | docking | nominal | 4.0 |
| Power Core | power_core | warning | 22.0 |
| Habitation Ring | habitation | nominal | 6.5 |
| Medical Bay | medical | offline | 0.0 |

### Crew (5 members)
| name | role | health | status | assigned_module |
|------|------|--------|--------|-----------------|
| Dr. Elena Vasquez | scientist | 95 | active | Research Lab |
| Chief Okonkwo | engineer | 88 | active | Power Core |
| Lt. Sato | pilot | 100 | active | Docking Bay 1 |
| Dr. Petrov | medic | 72 | resting | null |
| Eng. Reyes | engineer | 60 | injured | null |

### Resources (5 types)
| type | current | capacity | consumption_rate |
|------|---------|----------|-----------------|
| oxygen | 850 | 1000 | 2.5 |
| power | 620 | 800 | 18.0 |
| food | 430 | 600 | 1.2 |
| fuel | 290 | 500 | 0.8 |
| water | 710 | 900 | 1.8 |

### Missions (3 missions)
- 1 active: "Asteroid Survey" — started 2h ago
- 1 queued: "Solar Panel Repair"
- 1 complete: "Supply Run" — completed yesterday

### Event Log (8 events, most recent first)
Mix of: alert (power fluctuation), mission_complete, crew_injured (Reyes), module_offline (Medical Bay), resource_low (fuel), crew_status_change × 2, system_startup

## Seed index.ts Behavior

```ts
1. Drop all tables in reverse FK order
2. Run drizzle-kit migrate (or push schema)
3. seedStation → seedModules → seedCrew → seedResources → seedMissions → seedEventLog
4. console.log('✓ Seed complete')
5. process.exit(0)
```

## Nx seed target (project.json)

```json
"seed": {
  "executor": "nx:run-commands",
  "options": {
    "command": "tsx src/seed/index.ts",
    "cwd": "libs/db"
  }
}
```

## Acceptance Criteria

- [ ] `nx run db:seed` completes without errors
- [ ] After seed: `SELECT COUNT(*) FROM modules` → 6
- [ ] After seed: `SELECT COUNT(*) FROM crew_members` → 5
- [ ] After seed: `SELECT COUNT(*) FROM resources` → 5
- [ ] After seed: `SELECT COUNT(*) FROM missions` → 3
- [ ] Seed is idempotent — running it twice produces the same result
- [ ] `nx run-many --target=lint` passes
- [ ] `nx run-many --target=build` passes

## Dependencies

- Task 003 must be complete (schema and migration must exist)

## Notes
_Fill in after execution._
