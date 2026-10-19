# Task 013 — Module Management

## Objective

Build the Module Management page: a list of all modules with drill-down to module detail. Each module shows its status, power consumption, and assigned crew. Operators can change module status. A D3 bar chart shows power consumption across all modules.

## Context

- Read `.claude/docs/frontend.md` — domain folder structure, naming conventions
- Read `.claude/docs/ux.md` — module tile pattern, D3 usage (PowerConsumptionChart)
- Read `.claude/docs/backend.md` — module API endpoints

## Scope

| Action | File |
|--------|------|
| Create | `apps/client/src/domains/module/hooks/useModulePolling.ts` |
| Create | `apps/client/src/domains/module/components/ModuleDetail/ModuleDetail.tsx` |
| Create | `apps/client/src/domains/module/components/ModuleDetail/ModuleDetail.module.scss` |
| Create | `apps/client/src/domains/module/components/ModuleDetail/ModuleDetail.test.tsx` |
| Create | `apps/client/src/domains/module/components/PowerConsumptionChart/PowerConsumptionChart.tsx` |
| Create | `apps/client/src/domains/module/components/PowerConsumptionChart/PowerConsumptionChart.module.scss` |
| Create | `apps/client/src/domains/module/components/PowerConsumptionChart/usePowerConsumptionChart.ts` — D3 hook |
| Create | `apps/client/src/domains/module/components/PowerConsumptionChart/PowerConsumptionChart.test.tsx` |
| Create | `apps/client/src/pages/ModuleManagement/ModuleManagement.tsx` — full implementation |
| Create | `apps/client/src/pages/ModuleManagement/ModuleManagement.module.scss` |
| Create | `apps/client/src/pages/ModuleManagement/ModuleManagement.test.tsx` |
| Modify | `apps/client/src/app/router.tsx` — add `/modules/:id` route |

## PowerConsumptionChart (D3)

- Horizontal bar chart — one bar per module
- X-axis: power consumption (kW), Y-axis: module names
- Bar color maps to module status (nominal/warning/critical/offline)
- Bars animate width from 0 → target on mount (`duration: 400ms`)
- On data update: re-enters with transition
- Axes styled with `--color-text-muted`, `--font-data`, `--font-size-xs`
- Chart is responsive: fills container width, height scales with module count

## ModuleDetail

When a module tile is clicked from the list:
- Ant Design `Drawer` slides in from right
- Shows: module name, type badge, status selector (dropdown), power consumption readout
- Shows assigned crew list (CrewCard mini variant — name + health only)
- Status change: calls `PATCH /modules/:id`, updates store, logs visual feedback

## ModuleManagement layout

```
┌────────────────────────────────────────────────────────────┐
│ MODULES                          [sort: status ▾]          │
│──────────────────────────────────────────────────────────  │
│ Power Consumption                                          │
│ [D3 horizontal bar chart]                                  │
│──────────────────────────────────────────────────────────  │
│ [ModuleTile] [ModuleTile] [ModuleTile]  ← click opens      │
│ [ModuleTile] [ModuleTile] [ModuleTile]     ModuleDetail     │
└────────────────────────────────────────────────────────────┘
```

## Unit Tests

- `PowerConsumptionChart.test.tsx` — renders SVG, one bar per module
- `ModuleDetail.test.tsx` — renders module name, status options
- `ModuleManagement.test.tsx` — renders module tiles

## Acceptance Criteria

- [ ] Module Management page shows all 6 modules
- [ ] D3 power chart renders with one bar per module, animated on mount
- [ ] Clicking a module tile opens the detail drawer
- [ ] Status dropdown in drawer calls PATCH and reflects new status on close
- [ ] Sort by status groups offline modules last
- [ ] `nx test client` passes
- [ ] `nx build client` passes
- [ ] `nx run-many --target=lint` passes

## Dependencies

- Task 009 (frontend foundation) must be complete
- Task 011 (dashboard — ModuleTile component exists) must be complete
- Task 007 (module API) must be complete

## Notes
_Fill in after execution._
