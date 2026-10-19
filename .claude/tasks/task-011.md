# Task 011 — Station Dashboard

## Objective

Build the main Station Dashboard page: a bird's-eye view of all modules as a grid, live resource gauges using D3, and station-wide status. Data is fetched from the backend via polling and held in Zustand. After this task the dashboard shows real data that updates every 5s.

## Context

- Read `.claude/docs/frontend.md` — domain folder structure, naming conventions, Zustand patterns
- Read `.claude/docs/ux.md` — component patterns (module tile, resource bar, D3 usage), color palette
- Read `.claude/docs/backend.md` — station and resource API endpoints

## Scope

| Action | File |
|--------|------|
| Create | `apps/client/src/domains/station/store/useStationStore.ts` |
| Create | `apps/client/src/domains/station/services/station.service.ts` |
| Create | `apps/client/src/domains/station/types/station.types.ts` |
| Create | `apps/client/src/domains/station/hooks/useStationPolling.ts` |
| Create | `apps/client/src/domains/resource/store/useResourceStore.ts` |
| Create | `apps/client/src/domains/resource/services/resource.service.ts` |
| Create | `apps/client/src/domains/resource/types/resource.types.ts` |
| Create | `apps/client/src/domains/resource/hooks/useResourcePolling.ts` |
| Create | `apps/client/src/domains/resource/components/ResourceGauge/ResourceGauge.tsx` |
| Create | `apps/client/src/domains/resource/components/ResourceGauge/ResourceGauge.module.scss` |
| Create | `apps/client/src/domains/resource/components/ResourceGauge/useResourceGauge.ts` — D3 hook |
| Create | `apps/client/src/domains/resource/components/ResourceGauge/ResourceGauge.test.tsx` |
| Create | `apps/client/src/domains/module/types/module.types.ts` |
| Create | `apps/client/src/domains/module/services/module.service.ts` |
| Create | `apps/client/src/domains/module/store/useModuleStore.ts` |
| Create | `apps/client/src/domains/module/components/ModuleTile/ModuleTile.tsx` |
| Create | `apps/client/src/domains/module/components/ModuleTile/ModuleTile.module.scss` |
| Create | `apps/client/src/domains/module/components/ModuleTile/ModuleTile.test.tsx` |
| Create | `apps/client/src/shared/components/StatusBadge/StatusBadge.tsx` |
| Create | `apps/client/src/shared/components/StatusBadge/StatusBadge.module.scss` |
| Create | `apps/client/src/pages/StationDashboard/StationDashboard.tsx` — full implementation |
| Create | `apps/client/src/pages/StationDashboard/StationDashboard.module.scss` |

## ResourceGauge (D3)

- Radial arc chart — full circle represents `capacity`, filled arc is `current`
- Color: green (`--color-nominal`) > 50%, amber (`--color-warning`) 20–50%, red (`--color-critical`) < 20%
- Center text: `current` value in `--font-data`
- D3 arc tween on value change (400ms, `easeCubicOut`)
- `useResourceGauge(svgRef, { current, capacity })` handles all D3 logic

## ModuleTile

- Status dot (color maps to status) + module name + type badge + crew count
- `StatusBadge` component for the status indicator
- Framer Motion `layout` prop for smooth grid reorders
- `animate` on status change: brief glow pulse using `--color-accent-glow` or status color

## StationDashboard layout

```
┌─────────────────────────────────────────────────────────────┐
│ STATION STATUS: NOMINAL          KEPLER STATION ALPHA        │
│──────────────────────────────────────────────────────────────│
│  Resources (row of 5 gauges — ResourceGauge × 5)            │
│──────────────────────────────────────────────────────────────│
│  Modules (responsive grid, ModuleTile × N)                  │
└─────────────────────────────────────────────────────────────┘
```

## Polling

- `useStationPolling` — polls `station.service.getStation()` every 5000ms
- `useResourcePolling` — polls `resource.service.getResources()` every 5000ms
- Both use `setInterval` + cleanup on unmount
- Updates Zustand store on each response

## Unit Tests

- `ResourceGauge.test.tsx` — renders SVG, accepts current/capacity props
- `ModuleTile.test.tsx` — renders module name, status badge
- `StatusBadge.test.tsx` — renders correct class for each status

## Acceptance Criteria

- [ ] Dashboard shows 5 resource gauges with live D3 arc fills
- [ ] Dashboard shows module grid (6 tiles from seed data)
- [ ] Resource gauges update every 5s with data from the backend
- [ ] Changing a module's status in the DB reflects in the tile within the next poll
- [ ] StatusBadge applies correct color for nominal/warning/critical/offline
- [ ] `nx test client` passes
- [ ] `nx build client` passes
- [ ] `nx run-many --target=lint` passes

## Dependencies

- Task 009 (frontend foundation) must be complete
- Task 006 (station + resource API) must be complete
- Task 007 (module API) must be complete

## Notes
_Fill in after execution._
