# Task 014 — Resource Panel

## Objective

Build the Resource Panel page: detailed view of all five resources with live D3 trend charts showing a rolling 60-point history, alert threshold indicators, and a resource summary table. After this task operators can monitor resource trends over time and see visually when resources approach critical levels.

## Context

- Read `.claude/docs/frontend.md` — domain folder structure, naming conventions
- Read `.claude/docs/ux.md` — D3 usage (ResourceTrendChart — area/line with rolling window)
- Read `.claude/docs/backend.md` — resource API endpoint

## Scope

| Action | File |
|--------|------|
| Create | `apps/client/src/domains/resource/components/ResourceTrendChart/ResourceTrendChart.tsx` |
| Create | `apps/client/src/domains/resource/components/ResourceTrendChart/ResourceTrendChart.module.scss` |
| Create | `apps/client/src/domains/resource/components/ResourceTrendChart/useResourceTrendChart.ts` — D3 hook |
| Create | `apps/client/src/domains/resource/components/ResourceTrendChart/ResourceTrendChart.test.tsx` |
| Create | `apps/client/src/domains/resource/components/ResourceSummaryRow/ResourceSummaryRow.tsx` |
| Create | `apps/client/src/domains/resource/components/ResourceSummaryRow/ResourceSummaryRow.module.scss` |
| Create | `apps/client/src/domains/resource/hooks/useResourceHistory.ts` — rolling history accumulator |
| Create | `apps/client/src/pages/ResourcePanel/ResourcePanel.tsx` — full implementation |
| Create | `apps/client/src/pages/ResourcePanel/ResourcePanel.module.scss` |
| Create | `apps/client/src/pages/ResourcePanel/ResourcePanel.test.tsx` |

## ResourceTrendChart (D3)

- Area chart with a line overlay — `current` over time
- X-axis: time (last 5 minutes, sliding window of last 60 data points at 5s poll)
- Y-axis: 0 → capacity
- Alert threshold line at 20% capacity (dashed, `--color-warning`)
- Critical threshold line at 10% capacity (dashed, `--color-critical`)
- Area fill: gradient from status color (top) to transparent (bottom)
- Line color: maps to status (nominal / warning / critical)
- Smooth transition on each new data point (`d3.line().curve(d3.curveCatmullRom)`)
- Axes: `--color-text-muted`, `--font-data`, `--font-size-xs`

## useResourceHistory

- Holds a rolling array of `{ timestamp, current }` per resource (max 60 points)
- On each poll result, appends new point and drops oldest if > 60
- Lives in `useResourceStore` or as a separate hook — co-located with the store

## ResourceSummaryRow

```
OXYGEN      [████████░░░░]  850 / 1000   ↓ CONSUMING   2.5/tick
```
- Resource name (label style) + fill bar + current/capacity values
- Trend arrow: ↓ consuming (always for now; ↑ if reward just applied)
- Consumption rate in `--font-data` `--color-text-muted`

## ResourcePanel layout

```
┌──────────────────────────────────────────────────────────┐
│ RESOURCES                                                │
│────────────────────────────────────────────────────────  │
│ [ResourceSummaryRow × 5]                                │
│────────────────────────────────────────────────────────  │
│ Resource Trends                                         │
│ [ResourceTrendChart — OXYGEN]                           │
│ [ResourceTrendChart — POWER]                            │
│ [ResourceTrendChart — FOOD]                             │
│ [ResourceTrendChart — FUEL]                             │
│ [ResourceTrendChart — WATER]                            │
└──────────────────────────────────────────────────────────┘
```

## Unit Tests

- `ResourceTrendChart.test.tsx` — renders SVG with area and line paths
- `ResourceSummaryRow.test.tsx` — renders name, values, consumption rate
- `ResourcePanel.test.tsx` — renders 5 summary rows and 5 charts

## Acceptance Criteria

- [ ] Resource Panel shows 5 summary rows with live values
- [ ] Each resource has a D3 trend chart that updates as data accumulates
- [ ] Warning (20%) and critical (10%) threshold lines are visible on each chart
- [ ] Chart fills with history as polling accumulates data points
- [ ] Area color changes with status (green → amber → red)
- [ ] `nx test client` passes
- [ ] `nx build client` passes
- [ ] `nx run-many --target=lint` passes

## Dependencies

- Task 009 (frontend foundation) must be complete
- Task 011 (resource polling and store set up) must be complete
- Task 006 (resource API) must be complete

## Notes
_Fill in after execution._
