# Task 026 — Resource Panel HUD Layout

## Objective

Transform the Resource Panel into a fullscreen systems monitoring console. After this task the screen is split: resource inventory bars fill the left panel and live trend charts fill the right — all 5 resources visible simultaneously, no scroll.

## Context

- Read `.claude/docs/ux.md` — color tokens, font tokens
- Read `.claude/docs/frontend.md` — ResourcePanel page location
- Read `apps/client/src/pages/ResourcePanel/ResourcePanel.tsx`
- Read `apps/client/src/pages/ResourcePanel/ResourcePanel.module.scss`

## HUD Layout Design

```
┌──────────────────────┬────────────────────────────────┐
│  ◈ RESOURCE STORES   │  ◈ TELEMETRY TRENDS             │
│                      │                                 │
│  OXYGEN              │  OXYGEN ──────────────────────  │
│  ████████░░ 850/1000 │  ╭──╮╭──╮╭──────────           │
│  -2.5 units/s        │  └─────────────────────→       │
│                      │                                 │
│  POWER ⚠ WARNING     │  POWER ───────────────────────  │
│  ██████░░░░ 600/800  │  ╭─╮  ╭─╮╭─────────            │
│  -1.5 units/s        │  └─────────────────────→       │
│                      │                                 │
│  WATER  FUEL  FOOD…  │  WATER  FUEL  FOOD…            │
└──────────────────────┴────────────────────────────────┘
```

### Left Panel — Resource Inventory (36% width)

Each resource is a full-width block row:
- Resource type name: uppercase, `--font-data`
- Fill bar: `height: 14px`, full panel width, color-coded to status
- `current / capacity` values right-aligned in `--font-data`
- Consumption rate below bar in muted text
- Warning/critical badge inline when threshold breached
- Critical rows: `animation: pulse-critical 1.5s infinite` on the bar fill

### Right Panel — Telemetry Trends (flex: 1)

- 5 equal-height sections in a flex column (one per resource)
- Each section: resource name label + `ResourceTrendChart` (existing D3 component)
- Charts resize to fill their section height — no fixed heights

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/ResourcePanel/ResourcePanel.tsx` |
| Modify | `apps/client/src/pages/ResourcePanel/ResourcePanel.module.scss` |

## Unit Tests

Update `ResourcePanel.test.tsx`:
- Renders headings "RESOURCE STORES" and "TELEMETRY TRENDS"
- Renders a bar row per resource in the left panel
- Renders a trend chart per resource in the right panel
- Existing tests still pass

## Acceptance Criteria

- [ ] Page fills viewport height, no scroll
- [ ] Left panel shows full-width inventory rows with consumption rates
- [ ] Right panel shows all 5 trend charts simultaneously
- [ ] Critical rows show pulse animation
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 014 (Resource Panel) must be complete
- Task 022 (HUD Shell) must be complete

## Notes
_Fill in after execution._
