# Database — Space Station Manager

> **Status:** Decided — stack locked.

---

## Stack

| Layer | Choice |
|-------|--------|
| Database | PostgreSQL |
| ORM / Query builder | Drizzle ORM — no raw SQL; all queries via Drizzle API |
| Migrations | Drizzle Kit |
| Nx library | `libs/db` — imported as `@space-station/db` |
| Hosting | Docker (dev + prod) — external hosting TBD before prod task |

---

## Entity Overview

```
Station
  └── Module[]
        └── CrewAssignment[]
  └── CrewMember[]
  └── Resource[]
  └── Mission[]
  └── EventLog[]
```

---

## Tables (Draft Schema)

### `station`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `modules`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| station_id | uuid | FK → station |
| type | text | e.g. `life_support`, `lab`, `docking` |
| name | text | |
| status | text | `nominal` / `warning` / `critical` / `offline` |
| power_consumption | float | |
| created_at | timestamptz | |

### `crew_members`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| station_id | uuid | FK → station |
| name | text | |
| role | text | e.g. `engineer`, `scientist`, `pilot` |
| health | int | 0–100 |
| status | text | `active` / `resting` / `injured` / `eva` |
| assigned_module_id | uuid | FK → modules (nullable) |

### `resources`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| station_id | uuid | FK → station |
| type | text | `oxygen`, `power`, `food`, `fuel`, `water` |
| current | float | |
| capacity | float | |
| consumption_rate | float | per tick |
| updated_at | timestamptz | |

### `missions`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| station_id | uuid | FK → station |
| title | text | |
| description | text | |
| status | text | `queued` / `active` / `complete` / `failed` |
| started_at | timestamptz | nullable |
| completed_at | timestamptz | nullable |
| reward | jsonb | resource deltas on completion |

### `event_log`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| station_id | uuid | FK → station |
| type | text | e.g. `alert`, `mission_complete`, `crew_injured` |
| message | text | |
| payload | jsonb | optional structured data |
| created_at | timestamptz | |

---

## Indexes (Planned)

- `resources(station_id, type)` — frequent lookup by station + type
- `event_log(station_id, created_at DESC)` — feed queries
- `missions(station_id, status)` — active mission queries

---

## Open Questions

- [x] Database engine — PostgreSQL (relational)
- [x] Single station per user or multiple saves — single station, no user accounts in v1
- [x] Soft deletes or hard deletes? — **Hard deletes — event_log provides sufficient history**
- [x] Audit trail needed beyond `event_log`? — **No — event_log is sufficient**
