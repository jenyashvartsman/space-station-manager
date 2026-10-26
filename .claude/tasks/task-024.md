# Task 024 — Crew Roster HUD Layout

## Objective

Transform the Crew Roster from a scrollable SaaS card list into a fullscreen personnel-database terminal. After this task the roster fills the viewport: a dense crew list on the left and an inline personnel detail panel on the right — no drawer, no scroll.

## Context

- Read `.claude/docs/ux.md` — color tokens, font tokens
- Read `.claude/docs/frontend.md` — CrewRoster page location
- Read `apps/client/src/pages/CrewRoster/CrewRoster.tsx`
- Read `apps/client/src/pages/CrewRoster/CrewRoster.module.scss`

## HUD Layout Design

```
┌──────────────────────────┬───────────────────────────┐
│  ◈ PERSONNEL MANIFEST    │  ◈ PERSONNEL FILE          │
│  [ALL][ACTIVE][REST][EVA]│                            │
├──────────────────────────┤  VASQUEZ, ELENA            │
│  ● VASQUEZ, E.  ACTIVE   │  SCIENTIST                 │
│  ● REEVES, J.   RESTING  │  HEALTH: ████████░ 80%     │
│  ● NAIR, P.     ACTIVE   │  ASSIGNED: Research Lab    │
│  ● CHEN, L.     INJURED  │  STATUS: ACTIVE            │
│  ● OKAFOR, K.   EVA      │                            │
│                          │  [CHANGE ASSIGNMENT ▼]     │
└──────────────────────────┴───────────────────────────┘
```

### Left Panel — Crew List (40% width)

- Filter tabs at top (existing filter buttons, styled as compact HUD pills)
- Each row: status dot + name + role + status badge — one line
- `cursor: pointer`; selected row: `background: var(--color-bg-elevated)` + `3px solid var(--color-accent)` left border
- `overflow-y: auto`; custom thin scrollbar

### Right Panel — Personnel Detail (flex: 1)

- Always visible, never a drawer or modal
- Empty state: "SELECT CREW MEMBER TO VIEW FILE" centered in muted text
- When a crew member is selected: name (large, `--font-ui`), role, `CrewHealthBar`, assignment, status
- `CrewAssignmentSelect` rendered inline in the panel

### Local State

Add `selectedCrewId: string | null` state to `CrewRoster`. Clicking a row sets it. The right panel renders the matching crew member from the store.

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/CrewRoster/CrewRoster.tsx` |
| Modify | `apps/client/src/pages/CrewRoster/CrewRoster.module.scss` |

## Unit Tests

Update `CrewRoster.test.tsx`:
- Renders a list row for each crew member
- Right panel shows "SELECT CREW MEMBER" text by default
- Clicking a crew row shows that crew member's name in the detail panel
- Existing filter tests still pass

## Acceptance Criteria

- [ ] Roster fills viewport height, no page scroll
- [ ] Left panel shows compact crew rows with filter tabs
- [ ] Right panel is always visible (no drawer/modal)
- [ ] Clicking a row populates the right panel with that crew member's data
- [ ] Right panel shows health bar, role, and assignment selector
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 012 (Crew Roster) must be complete
- Task 022 (HUD Shell) must be complete

## Notes
_Fill in after execution._
