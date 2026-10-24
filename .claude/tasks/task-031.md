# Task 031 — Crew Roster Copy

## Objective

Apply `stationCopy.crew` strings to the Crew Roster page: heading, intro strip, empty state, and injured warning banner.

## Context

- Read `apps/client/src/shared/copy/stationCopy.ts`
- Read `apps/client/src/pages/CrewRoster/CrewRoster.tsx`

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/CrewRoster/CrewRoster.tsx` |
| Modify | `apps/client/src/pages/CrewRoster/CrewRoster.module.scss` |

## Layout Addition

```
CREW OPERATIONS
Personnel manifest — ARES-7 crew roster.      ← intro strip, muted
──────────────────────────────────────────────
⚠ CREW MEMBER INJURED — Medical attention required.   ← shown if any crew.status === 'injured'
──────────────────────────────────────────────
[crew cards…]

[empty state when no crew:]
  No crew assigned to station. Awaiting crew transfer.
```

- Heading: `stationCopy.crew.heading`
- Intro: `stationCopy.crew.intro`
- Injured banner: `stationCopy.crew.injuredWarning` — Ant Design `Alert` type `warning`, shown conditionally
- Empty state: `stationCopy.crew.empty` — centered, `--color-text-muted`

## Unit Tests

- Modify `apps/client/src/pages/CrewRoster/CrewRoster.test.tsx`:
  - Renders `stationCopy.crew.heading`
  - Renders empty state when crew list is empty
  - Renders injured warning when a crew member has status `'injured'`

## Acceptance Criteria

- [ ] Heading and intro strip visible
- [ ] Injured banner appears when any crew member is injured
- [ ] Empty state shown when no crew
- [ ] No hardcoded strings in JSX
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 012 (Crew Roster) must be complete
- Task 028 (station copy foundation) must be complete

## Notes
_Fill in after execution._
