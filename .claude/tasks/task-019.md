# Task 019 — SVG Illustrations

## Objective

Add hand-crafted SVG illustrations to key pages to make the app feel like a real space station interface. Each illustration is a domain-specific inline SVG React component — no external image files. After this task the landing page, empty states, and section headers have distinctive space-themed artwork.

## Context

- Read `.claude/docs/frontend.md` — domain folder structure, naming conventions
- Read `.claude/docs/ux.md` — color tokens, font scale

## Design Language

All illustrations must use only CSS custom properties from the design system:
- Stroke: `--color-border`, `--color-border-strong`, `--color-nominal`, `--color-warning`, `--color-critical`
- Fill: `--color-surface`, `--color-surface-elevated`, `--color-bg`
- Accent glows: use SVG `filter` with `feDropShadow` and `--color-nominal` / `--color-warning`
- No hardcoded hex values — use `var(--token)` in SVG `fill` / `stroke` attributes
- Style: technical schematic / blueprint aesthetic — thin strokes, dashed guide lines, crosshair targets, grid overlays

## Scope

| Action | File |
|--------|------|
| Create | `apps/client/src/domains/station/components/StationSchematic/StationSchematic.tsx` |
| Create | `apps/client/src/domains/station/components/StationSchematic/StationSchematic.module.scss` |
| Create | `apps/client/src/domains/station/components/StationSchematic/StationSchematic.test.tsx` |
| Create | `apps/client/src/domains/crew/components/CrewIcon/CrewIcon.tsx` |
| Create | `apps/client/src/domains/crew/components/CrewIcon/CrewIcon.test.tsx` |
| Create | `apps/client/src/domains/module/components/ModuleIcon/ModuleIcon.tsx` |
| Create | `apps/client/src/domains/module/components/ModuleIcon/ModuleIcon.test.tsx` |
| Create | `apps/client/src/domains/mission/components/MissionBadge/MissionBadge.tsx` |
| Create | `apps/client/src/domains/mission/components/MissionBadge/MissionBadge.test.tsx` |
| Modify | `apps/client/src/pages/Landing/Landing.tsx` — embed StationSchematic as hero artwork |
| Modify | `apps/client/src/pages/StationDashboard/StationDashboard.tsx` — add StationSchematic to header area |
| Modify | `apps/client/src/pages/CrewRoster/CrewRoster.tsx` — use CrewIcon in crew cards |
| Modify | `apps/client/src/pages/ModuleManagement/ModuleManagement.tsx` — use ModuleIcon per module type |
| Modify | `apps/client/src/pages/MissionControl/MissionControl.tsx` — use MissionBadge in mission items |

## StationSchematic (hero illustration)

A top-down schematic of a space station with:
- Central hub: circle with crosshair target lines (±40px arms)
- Four radial arms extending outward (habitat ring, power ring, science ring, docking arm)
- Dashed orbit ring around the whole structure
- Small "satellite" circles on each arm end
- Animated: slow rotation of the outer orbit ring (CSS `animation: orbit-spin 60s linear infinite`)
- Size: `viewBox="0 0 400 400"` — scalable

```
        ·  ·  ·  ·
     ·              ·
   ·   [====O====]   ·      ← habitat arm
  ·       |   |       ·
  ·  [=O=]✛[O=]  ·         ← central hub
  ·       |   |       ·
   ·   [====O====]   ·      ← docking arm
     ·              ·
        ·  ·  ·  ·
```

## CrewIcon

A simple SVG astronaut helmet silhouette:
- Accepts `size?: number` (default 32) and `color?: string` (default `var(--color-nominal)`)
- Outer helmet circle, visor rectangle with rounded corners, chin bar
- Used in crew roster cards

## ModuleIcon

Accepts `moduleType: 'habitat' | 'power' | 'science' | 'medical' | 'docking' | 'unknown'`
- Each type renders a distinct small SVG icon (16×16 or 24×24):
  - `habitat`: bed/shelter rectangle with roof
  - `power`: lightning bolt
  - `science`: flask/beaker shape
  - `medical`: cross/plus symbol
  - `docking`: docking clamp brackets
  - `unknown`: question mark in a circle
- Uses `--color-text-muted` stroke by default

## MissionBadge

A circular badge with a targeting reticle design:
- Outer circle, inner circle, four tick marks at N/S/E/W
- Color driven by mission status: `active` → `--color-nominal`, `queued` → `--color-warning`, `completed` → `--color-text-muted`, `failed` → `--color-critical`
- Accepts `status: MissionStatus` and `size?: number`

## Unit Tests

- `StationSchematic.test.tsx` — renders SVG element, has expected data-testid attributes
- `CrewIcon.test.tsx` — renders at correct size, accepts color prop
- `ModuleIcon.test.tsx` — renders correct icon per moduleType
- `MissionBadge.test.tsx` — applies correct color class per status

## Acceptance Criteria

- [ ] Landing page hero shows the StationSchematic illustration
- [ ] StationSchematic orbit ring rotates slowly via CSS animation
- [ ] Crew cards show astronaut helmet CrewIcons
- [ ] Module list items show the correct ModuleIcon for each module type
- [ ] Mission items show MissionBadge with correct status color
- [ ] All SVG illustrations use only CSS variable colors (no hardcoded hex)
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 010 (Landing page) must be complete
- Task 011 (Station Dashboard) must be complete
- Task 012 (Crew Roster) must be complete
- Task 013 (Module Management) must be complete
- Task 015 (Mission Control) must be complete

## Notes
_Fill in after execution._
