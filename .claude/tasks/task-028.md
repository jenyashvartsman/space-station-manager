# Task 028 — Station Copy Foundation

## Objective

Create `stationCopy.ts` — a single source of truth for all UI copy strings in the app, written in the voice of a real space station operator interface. All per-page copy tasks (029–035) import from this file. After this task no raw UI strings exist directly in component JSX.

## Context

- Read `.claude/docs/ux.md` — tone and voice guidelines
- Read `.claude/docs/app.md` — domain terminology

## Voice & Tone

- Terse, technical, mission-focused — NASA MCC meets Star Trek LCARS
- Use domain nouns: "Station", "Crew", "Module", "Sector", "Ops"
- No generic words: not "user", "item", "record", "data"
- Numbers are precise; status is binary (NOMINAL / CRITICAL)
- Empty states are operational ("No active missions. Station standing by.")

## Scope

| Action | File |
|--------|------|
| Create | `apps/client/src/shared/copy/stationCopy.ts` |
| Create | `apps/client/src/shared/copy/stationCopy.test.ts` |

## stationCopy.ts

```ts
export const stationCopy = {
  landing: {
    headline:  'SPACE STATION MANAGER',
    tagline:   'Operational command interface — deep-space platform ARES-7',
    cta:       'ACCESS STATION',
    features: {
      station:   { title: 'STATION STATUS',   body: 'Live telemetry from all station sectors. Monitor overall operational health at a glance.' },
      crew:      { title: 'CREW OPERATIONS',  body: 'Track crew assignments, health, and readiness. Keep your team mission-capable.' },
      modules:   { title: 'MODULE SYSTEMS',   body: 'Monitor and control installed station modules. Identify offline systems before they cascade.' },
      resources: { title: 'RESOURCE STORES',  body: 'Manage oxygen, power, food, fuel, and water. Resupply before stores reach critical thresholds.' },
      missions:  { title: 'MISSION CONTROL',  body: 'Launch, track, and complete station missions. Allocate crew and reap operational rewards.' },
      events:    { title: 'EVENT LOG',         body: 'Station-wide alert and activity feed. Every anomaly, completion, and status change recorded.' },
    },
  },
  dashboard: {
    heading: 'STATION DASHBOARD',
    tagline: 'ARES-7 · OPERATIONAL STATUS',
    intro:   'Live station telemetry. All systems nominal.',
  },
  crew: {
    heading: 'CREW OPERATIONS',
    intro:   'Personnel manifest — ARES-7 crew roster.',
    empty:   'No crew assigned to station. Awaiting crew transfer.',
    injuredWarning: 'CREW MEMBER INJURED — Medical attention required.',
  },
  modules: {
    heading: 'MODULE SYSTEMS',
    intro:   'Installed station modules and current system status.',
    empty:   'No modules installed. Station expansion required.',
    offlineWarning: (name: string) => `MODULE OFFLINE: ${name} — Repair required.`,
  },
  resources: {
    heading: 'RESOURCE STORES',
    intro:   'Current inventory levels across all resource categories.',
    empty:   'Resource telemetry unavailable.',
    critical: (resource: string) => `CRITICAL: ${resource} reserves below operational threshold.`,
    low:      (resource: string) => `WARNING: ${resource} reserves low — resupply recommended.`,
  },
  missions: {
    heading:         'MISSION CONTROL',
    intro:           'ARES-7 mission assignments and status.',
    emptyActive:     'No active missions. Station standing by.',
    emptyQueued:     'No queued missions.',
    emptyCompleted:  'No completed missions on record.',
    newMission:      '+ NEW MISSION',
  },
  events: {
    heading: 'STATION EVENT LOG',
    intro:   'Station-wide alert and activity feed — last 50 entries.',
    empty:   'No events recorded. All systems nominal.',
  },
  reset: {
    buttonLabel:  'RESET STATION',
    confirmTitle: 'RESET STATION?',
    confirmBody:  'This will wipe all station data and restore factory defaults. This action cannot be undone.',
    confirmOk:    'CONFIRM RESET',
    success:      'Station reset complete. Reloading…',
    error:        'Reset failed. Check server logs.',
  },
}
```

## Unit Tests

`stationCopy.test.ts`:
- All top-level keys exist: `landing`, `dashboard`, `crew`, `modules`, `resources`, `missions`, `events`, `reset`
- `landing.features` has all six keys: `station`, `crew`, `modules`, `resources`, `missions`, `events`
- Each feature entry has `title` and `body` (non-empty strings)
- `modules.offlineWarning('Power Core')` returns a string containing "Power Core"
- `resources.critical('Oxygen')` returns a string containing "Oxygen"

## Acceptance Criteria

- [ ] `stationCopy.ts` exports `stationCopy` with all domains
- [ ] All string values are non-empty
- [ ] Function values (`offlineWarning`, `critical`, `low`) interpolate their argument
- [ ] `nx test client` passes

## Dependencies

- Task 009 (frontend foundation) must be complete

## Notes
_Fill in after execution._
