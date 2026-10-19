# Task 012 — Crew Roster

## Objective

Build the Crew Roster page: a grid of crew cards showing each member's health, status, role, and current module assignment. Operators can reassign crew to modules and change crew status. Data is fetched from the backend and held in Zustand.

## Context

- Read `.claude/docs/frontend.md` — domain folder structure, naming conventions
- Read `.claude/docs/ux.md` — crew card component pattern, health bar, status utilities
- Read `.claude/docs/backend.md` — crew API endpoints

## Scope

| Action | File |
|--------|------|
| Create | `apps/client/src/domains/crew/types/crew.types.ts` |
| Create | `apps/client/src/domains/crew/services/crew.service.ts` |
| Create | `apps/client/src/domains/crew/store/useCrewStore.ts` |
| Create | `apps/client/src/domains/crew/hooks/useCrewPolling.ts` |
| Create | `apps/client/src/domains/crew/components/CrewCard/CrewCard.tsx` |
| Create | `apps/client/src/domains/crew/components/CrewCard/CrewCard.module.scss` |
| Create | `apps/client/src/domains/crew/components/CrewCard/CrewCard.test.tsx` |
| Create | `apps/client/src/domains/crew/components/CrewHealthBar/CrewHealthBar.tsx` |
| Create | `apps/client/src/domains/crew/components/CrewHealthBar/CrewHealthBar.module.scss` |
| Create | `apps/client/src/domains/crew/components/CrewAssignmentSelect/CrewAssignmentSelect.tsx` |
| Create | `apps/client/src/pages/CrewRoster/CrewRoster.tsx` — full implementation |
| Create | `apps/client/src/pages/CrewRoster/CrewRoster.module.scss` |
| Create | `apps/client/src/pages/CrewRoster/CrewRoster.test.tsx` |

## CrewCard Design

```
┌────────────────────────────────┐
│  ●  Dr. Elena Vasquez          │  ← status dot (color) + name
│     SCIENTIST                  │  ← role (text--label style)
│                                │
│  ████████████░░  95            │  ← health bar + value
│                                │
│  Module: Research Lab          │  ← assignment (or "Unassigned")
│  [Change Assignment ▾]         │  ← CrewAssignmentSelect dropdown
└────────────────────────────────┘
```

## CrewHealthBar

- Filled bar, color maps to health level:
  - > 70: `--color-nominal`
  - 30–70: `--color-warning`
  - < 30: `--color-critical` + `pulse-critical` animation
- Framer Motion `animate={{ width: \`${health}%\` }}` on health change (300ms)
- Numeric value displayed right-aligned in `--font-data`

## CrewAssignmentSelect

- Ant Design `Select` with module options from `useModuleStore`
- `allowClear` to unassign
- On change: calls `crew.service.updateCrew(id, { assignedModuleId })`, updates store

## CrewRoster layout

- Ant Design `Row` / `Col` responsive grid: 4 cards per row at 1280px, 2 at tablet
- Framer Motion `AnimatePresence` + staggered mount of cards (`staggerChildren: 0.04`)
- Filter bar at top: filter by status (all / active / resting / injured / eva)

## Unit Tests

- `CrewCard.test.tsx` — renders name, role, health bar, status dot
- `CrewHealthBar.test.tsx` — renders correct color class for health level
- `CrewRoster.test.tsx` — renders list of cards, filter buttons

## Acceptance Criteria

- [ ] Crew Roster page shows 5 crew cards (from seed data)
- [ ] Each card shows name, role, health bar, status, and assignment
- [ ] Health bar is correct color based on health value
- [ ] Changing assignment in the dropdown calls PATCH and updates the UI
- [ ] Filter by status hides/shows correct cards
- [ ] Cards animate in with stagger on page load
- [ ] `nx test client` passes
- [ ] `nx build client` passes
- [ ] `nx run-many --target=lint` passes

## Dependencies

- Task 009 (frontend foundation) must be complete
- Task 011 (dashboard — for ModuleStore reuse) should be complete
- Task 007 (crew API) must be complete

## Notes
_Fill in after execution._
