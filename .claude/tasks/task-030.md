# Task 030 — Game Copy (stationCopy + All Pages)

## Objective

Create `stationCopy.ts` — a single source of truth for all UI copy written in the voice of a space station operator. Apply it across all HUD pages so every label, heading, empty state, and warning sounds like a real mission-control system, not a SaaS product.

## Context

- Read `.claude/docs/ux.md` — tone and voice guidelines
- Read `.claude/docs/app.md` — domain terminology

## Voice & Tone

- Terse, urgent, mission-focused — NASA MCC meets a space sim game
- All-caps for section headings and status labels
- Domain nouns only: Station, Crew, Module, Sector, Ops, Telemetry
- No generic SaaS words: not "user", "item", "record", "data", "loading…"
- Numbers are precise; states are operational (NOMINAL / WARNING / CRITICAL / OFFLINE)
- Empty states are operational status messages ("No active missions. Station standing by.")
- Errors read like system alerts ("UPLINK FAILURE — check server logs")

## Scope

| Action | File |
|--------|------|
| Create | `apps/client/src/shared/copy/stationCopy.ts` |
| Create | `apps/client/src/shared/copy/stationCopy.test.ts` |
| Modify | `apps/client/src/pages/StationDashboard/StationDashboard.tsx` |
| Modify | `apps/client/src/pages/CrewRoster/CrewRoster.tsx` |
| Modify | `apps/client/src/pages/ModuleManagement/ModuleManagement.tsx` |
| Modify | `apps/client/src/pages/ResourcePanel/ResourcePanel.tsx` |
| Modify | `apps/client/src/pages/MissionControl/MissionControl.tsx` |
| Modify | `apps/client/src/pages/EventLog/EventLog.tsx` |
| Modify | `apps/client/src/pages/Landing/Landing.tsx` |

## stationCopy.ts

```ts
export const stationCopy = {
  landing: {
    headline: 'SPACE STATION MANAGER',
    tagline:  'Operational command interface — deep-space platform ARES-7',
    cta:      'ACCESS STATION',
    features: {
      station:   { title: 'STATION STATUS',   body: 'Live telemetry from all sectors. Monitor overall operational health at a glance.' },
      crew:      { title: 'CREW OPERATIONS',  body: 'Track assignments, health, and readiness. Keep your crew mission-capable.' },
      modules:   { title: 'MODULE SYSTEMS',   body: 'Monitor installed modules. Identify offline systems before they cascade.' },
      resources: { title: 'RESOURCE STORES',  body: 'Manage O2, power, food, fuel, and water. Resupply before critical thresholds.' },
      missions:  { title: 'MISSION CONTROL',  body: 'Launch and track station missions. Allocate crew and collect operational rewards.' },
      events:    { title: 'COMMS LOG',        body: 'Station-wide alert and activity feed. Every anomaly and status change recorded.' },
    },
  },
  dashboard: {
    colSchematic:  'SCHEMATIC',
    colResources:  'RESOURCE BANKS',
    colModules:    'MODULE GRID',
    statusLabel:   (s: string) => `STATUS: ${s}`,
    loadingResources: 'SCANNING RESOURCE BANKS…',
    loadingModules:   'SCANNING MODULE GRID…',
  },
  crew: {
    colList:   'PERSONNEL MANIFEST',
    colDetail: 'PERSONNEL FILE',
    empty:     'No crew assigned. Awaiting crew transfer.',
    noSelection: 'SELECT CREW MEMBER TO VIEW FILE',
    injuredWarning: 'ALERT: CREW MEMBER INJURED — Medical attention required.',
    filterAll:     'ALL',
    filterActive:  'ACTIVE',
    filterResting: 'RESTING',
    filterEva:     'EVA',
  },
  modules: {
    colMap:    'MODULE SYSTEMS',
    colDetail: 'SYSTEM DETAIL',
    empty:     'No modules installed. Station expansion required.',
    noSelection: 'SELECT A MODULE TO VIEW SYSTEM DETAIL',
    offlineWarning: (name: string) => `MODULE OFFLINE: ${name} — Repair required.`,
  },
  resources: {
    colInventory: 'RESOURCE STORES',
    colTrends:    'TELEMETRY TRENDS',
    empty:        'Resource telemetry unavailable.',
    critical: (r: string) => `CRITICAL: ${r} reserves below operational threshold.`,
    warning:  (r: string) => `WARNING: ${r} reserves low — resupply recommended.`,
  },
  missions: {
    colActive:    'ACTIVE OPS',
    colQueued:    'QUEUED OPS',
    colCompleted: 'COMPLETED OPS',
    emptyActive:     'No active operations. Station standing by.',
    emptyQueued:     'No queued operations.',
    emptyCompleted:  'No completed operations on record.',
    newMission:      '+ NEW MISSION',
  },
  events: {
    heading: 'STATION COMMS LOG',
    live:    'LIVE',
    empty:   'No events recorded. All systems nominal.',
    filterAll:     'ALL',
    filterCritical:'CRITICAL',
    filterWarning: 'WARNING',
    filterInfo:    'INFO',
    filterMission: 'MISSION',
    filterSystem:  'SYSTEM',
  },
  reset: {
    buttonLabel:  'RESET STATION',
    confirmTitle: 'RESET STATION?',
    confirmBody:  'This will wipe all station data and restore factory defaults. This action cannot be undone.',
    confirmOk:    'CONFIRM RESET',
    error:        'UPLINK FAILURE — check server logs.',
  },
  shell: {
    callsign: 'KEPLER STATION ALPHA',
    navDash:  'DASH',
    navCrew:  'CREW',
    navMods:  'MODULES',
    navRes:   'RESOURCES',
    navOps:   'OPS',
    navLog:   'LOG',
  },
}
```

## Applying Copy to Pages

For each page, replace every hardcoded string with the matching `stationCopy.*` key. No new layout changes — this task only replaces text. Column headings, empty states, status labels, and button text must all come from `stationCopy`.

## Unit Tests

`stationCopy.test.ts`:
- All top-level keys exist: `landing`, `dashboard`, `crew`, `modules`, `resources`, `missions`, `events`, `reset`, `shell`
- `landing.features` has all six keys
- `modules.offlineWarning('Power Core')` returns a string containing `'Power Core'`
- `resources.critical('Oxygen')` returns a string containing `'Oxygen'`
- `dashboard.statusLabel('NOMINAL')` returns `'STATUS: NOMINAL'`

## Acceptance Criteria

- [ ] `stationCopy.ts` exported from `apps/client/src/shared/copy/stationCopy.ts`
- [ ] All string values are non-empty
- [ ] All pages use `stationCopy` — no hardcoded UI strings in JSX
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Tasks 022–028 (all HUD layouts) must be complete

## Notes
_Fill in after execution._
