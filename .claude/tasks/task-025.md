# Task 025 — Module Management HUD Layout

## Objective

Transform the Module Management page into a fullscreen engineering console. After this task the screen is split: a schematic module map on the left and an inline detail panel on the right — no drawer, no scroll, all data visible at once.

## Context

- Read `.claude/docs/ux.md` — color tokens, font tokens
- Read `.claude/docs/frontend.md` — ModuleManagement page location
- Read `apps/client/src/pages/ModuleManagement/ModuleManagement.tsx`
- Read `apps/client/src/pages/ModuleManagement/ModuleManagement.module.scss`

## HUD Layout Design

```
┌──────────────────────┬────────────────────────────────┐
│  ◈ MODULE SYSTEMS    │  ◈ SYSTEM DETAIL                │
│                      │                                 │
│  [HAB]──────[SCI]    │  HABITAT MODULE                 │
│    │                 │  TYPE: Habitat                  │
│  [HUB]              │  STATUS: NOMINAL                 │
│    │                 │  POWER: 42 kW                   │
│  [PWR]──────[DOCK]   │  CREW: Vasquez, Nair            │
│                      │                                 │
│  Sort: [STATUS▼]     │  [CHANGE STATUS ▼]              │
│        [NAME]        │                                 │
│        [POWER]       │  ─ POWER CONSUMPTION ──────     │
│                      │  [D3 bar chart]                 │
└──────────────────────┴────────────────────────────────┘
```

### Left Panel — Module Map (38% width)

- Module tiles laid out in a visual map/schematic pattern (CSS Grid, 2 cols)
- Each tile: `ModuleIcon` + module name + `StatusBadge`
- `4px` left border colored to module status
- Selected tile: `background: var(--color-bg-elevated)` + accent border
- Sort controls below the map (existing sort buttons, compact style)

### Right Panel — System Detail (flex: 1)

- Always visible, no drawer
- Empty state: "SELECT A MODULE TO VIEW SYSTEM DETAIL" in muted text, centered
- When selected:
  - Module name (large), type, status, power consumption value, assigned crew list
  - `PowerConsumptionChart` (D3 bar chart) at bottom of panel
  - Status change selector (`Select` component)
- Route-driven: reading `:moduleId` from the URL continues to work; selecting a tile pushes the route

### Replacing the Drawer

The existing Ant Design `Drawer` in `ModuleDetail` is replaced by the right panel. The `ModuleDetail` component can still be used as the content — rendered inside the panel instead of a drawer.

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/ModuleManagement/ModuleManagement.tsx` |
| Modify | `apps/client/src/pages/ModuleManagement/ModuleManagement.module.scss` |

## Unit Tests

Update `ModuleManagement.test.tsx`:
- Renders column headings: "MODULE SYSTEMS" and "SYSTEM DETAIL"
- Right panel shows "SELECT A MODULE" message by default
- Clicking a module tile shows that module's name in the detail panel
- Existing sort tests still pass

## Acceptance Criteria

- [ ] Page fills viewport height, no scroll
- [ ] Left panel shows module tiles in a map grid
- [ ] Right panel is always visible (no drawer)
- [ ] Selecting a tile loads module detail inline
- [ ] Status selector and power chart render in detail panel
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 013 (Module Management) must be complete
- Task 022 (HUD Shell) must be complete

## Notes
_Fill in after execution._
