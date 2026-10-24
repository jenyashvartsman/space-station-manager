# Task 034 — Mission Control Copy

## Objective

Apply `stationCopy.missions` strings to the Mission Control page: heading, intro strip, per-section empty states, and new-mission button label.

## Context

- Read `apps/client/src/shared/copy/stationCopy.ts`
- Read `apps/client/src/pages/MissionControl/MissionControl.tsx`

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/MissionControl/MissionControl.tsx` |
| Modify | `apps/client/src/pages/MissionControl/MissionControl.module.scss` |

## Layout Addition

```
MISSION CONTROL                        [+ NEW MISSION]
ARES-7 mission assignments and status.    ← intro, muted
──────────────────────────────────────────────────────
ACTIVE
  [MissionItem]
  — or —
  No active missions. Station standing by.   ← emptyActive

QUEUED
  [MissionItem]
  — or —
  No queued missions.                        ← emptyQueued

COMPLETED
  [MissionItem]
  — or —
  No completed missions on record.           ← emptyCompleted
```

- Heading: `stationCopy.missions.heading`
- Intro: `stationCopy.missions.intro`
- New mission button: `stationCopy.missions.newMission`
- Section empty states: `stationCopy.missions.emptyActive / emptyQueued / emptyCompleted`
- Empty state styling: centered, `--color-text-muted`, `--font-body`

## Unit Tests

- Modify `apps/client/src/pages/MissionControl/MissionControl.test.tsx`:
  - Renders `stationCopy.missions.heading`
  - Renders `emptyActive` when active missions list is empty
  - Renders `emptyQueued` when queued missions list is empty

## Acceptance Criteria

- [ ] Heading and intro strip visible
- [ ] Each section shows its empty state message when the list is empty
- [ ] "+ NEW MISSION" button label matches `stationCopy`
- [ ] No hardcoded strings in JSX
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 015 (Mission Control) must be complete
- Task 028 (station copy foundation) must be complete

## Notes
_Fill in after execution._
