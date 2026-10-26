# Task 023 — Station Dashboard HUD Layout

## Objective

Transform the Station Dashboard from a scrollable SaaS page into a fullscreen three-column HUD that feels like a cockpit operations console. After this task the dashboard fills the entire viewport: station schematic on the left, resource readouts in the center, module status grid on the right — no empty space, no scroll.

## Context

- Read `.claude/docs/ux.md` — color tokens, font tokens
- Read `.claude/docs/frontend.md` — page and component locations
- Read `apps/client/src/pages/StationDashboard/StationDashboard.tsx`
- Read `apps/client/src/pages/StationDashboard/StationDashboard.module.scss`

## HUD Layout Design

```
┌──────────────────┬──────────────────┬──────────────────┐
│  ◈ SCHEMATIC     │  ◈ RESOURCE BANKS │  ◈ MODULE GRID   │
│                  │                  │                  │
│   [Station SVG]  │  OXYGEN          │  [HAB] NOMINAL   │
│   large, center  │  ████████░ 85%   │  [PWR] WARNING   │
│                  │  POWER           │  [SCI] OFFLINE   │
│  ─────────────── │  ██████░░░ 72%   │  [DOCK] NOMINAL  │
│  STATUS: NOMINAL │  WATER           │  [MED] NOMINAL   │
│  ARES-7          │  █████████ 95%   │                  │
│                  │  FUEL            │                  │
│  [RESET STATION] │  ██████░░░ 64%   │                  │
└──────────────────┴──────────────────┴──────────────────┘
```

CSS Grid: `grid-template-columns: 22% 34% 1fr`. Each column has a `1px solid var(--color-border)` right divider (except the last). A header label row sits at the top of each column in `--font-data` uppercase.

### Left Column — Station Schematic

- `StationSchematic` SVG fills 55% of the column height
- Below the SVG: status badge + station name (one line each)
- `StationResetButton` pinned to the column bottom (`margin-top: auto`)

### Center Column — Resource Banks

Each resource is a full-width block row:
- Resource type label (uppercase, `--font-data`, `--color-text-muted`) — left
- Fill bar: `height: 10px`, full column width, color-coded to status
- Current / capacity values — right side in `--font-data`

Replace radial `ResourceGauge` with a new inline bar layout. The `ResourceGauge` component does not change — simply do not use it here; render the bar layout directly in the page.

### Right Column — Module Grid

Each `ModuleTile` renders as a full-width row (not a card):
- `4px solid var(--color-*)` left border for status color
- Module name + status badge in one line
- Existing `ModuleTile` component can be used if it accepts a `compact` prop; otherwise render inline rows directly in the page.

### Loading State

While `station === null`, show three `SkeletonPanel` placeholders (one per column) instead of the grid.

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/StationDashboard/StationDashboard.tsx` |
| Modify | `apps/client/src/pages/StationDashboard/StationDashboard.module.scss` |
| Create | `apps/client/src/pages/StationDashboard/StationDashboard.test.tsx` |

## Unit Tests

`StationDashboard.test.tsx`:
- Renders column headings: "SCHEMATIC", "RESOURCE BANKS", "MODULE GRID"
- Shows `data-testid="dashboard-skeleton"` while `station === null`
- Renders station name when station data is loaded

## Acceptance Criteria

- [ ] Dashboard fills viewport height, no scrollbar on the page itself
- [ ] Three-column grid matches design
- [ ] Station schematic SVG is prominently sized in left column
- [ ] Resources render as full-width bar rows in center column
- [ ] Modules render as full-width status rows in right column
- [ ] Skeleton loading shown while `station === null`
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 011 (Station Dashboard) must be complete
- Task 022 (HUD Shell) must be complete

## Notes
_Fill in after execution._
