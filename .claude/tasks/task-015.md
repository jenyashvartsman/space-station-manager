# Task 015 — Mission Control

## Objective

Build the Mission Control page: a list of active, queued, and completed missions, a mission creation form, and an animated countdown arc for in-progress missions. After this task operators can launch missions, watch them progress in real time, and see rewards applied when they complete.

## Context

- Read `.claude/docs/frontend.md` — domain folder structure, naming conventions
- Read `.claude/docs/ux.md` — D3 usage (MissionTimer — countdown arc), motion timing
- Read `.claude/docs/backend.md` — mission API endpoints, mission status transitions

## Scope

| Action | File |
|--------|------|
| Create | `apps/client/src/domains/mission/types/mission.types.ts` |
| Create | `apps/client/src/domains/mission/services/mission.service.ts` |
| Create | `apps/client/src/domains/mission/store/useMissionStore.ts` |
| Create | `apps/client/src/domains/mission/hooks/useMissionPolling.ts` |
| Create | `apps/client/src/domains/mission/components/MissionItem/MissionItem.tsx` |
| Create | `apps/client/src/domains/mission/components/MissionItem/MissionItem.module.scss` |
| Create | `apps/client/src/domains/mission/components/MissionItem/MissionItem.test.tsx` |
| Create | `apps/client/src/domains/mission/components/MissionTimer/MissionTimer.tsx` — D3 countdown arc |
| Create | `apps/client/src/domains/mission/components/MissionTimer/MissionTimer.module.scss` |
| Create | `apps/client/src/domains/mission/components/MissionTimer/useMissionTimer.ts` — D3 hook |
| Create | `apps/client/src/domains/mission/components/MissionTimer/MissionTimer.test.tsx` |
| Create | `apps/client/src/domains/mission/components/MissionCreateForm/MissionCreateForm.tsx` |
| Create | `apps/client/src/domains/mission/components/MissionCreateForm/MissionCreateForm.module.scss` |
| Create | `apps/client/src/domains/mission/components/MissionCreateForm/MissionCreateForm.test.tsx` |
| Create | `apps/client/src/pages/MissionControl/MissionControl.tsx` — full implementation |
| Create | `apps/client/src/pages/MissionControl/MissionControl.module.scss` |
| Create | `apps/client/src/pages/MissionControl/MissionControl.test.tsx` |

## MissionTimer (D3 countdown arc)

- Full circle = total duration; arc shrinks clockwise as time elapses
- Color: `--color-nominal` → `--color-warning` at 30% remaining → `--color-critical` at 10%
- Center: remaining time in `MM:SS` using `--font-data`
- Arc animates smoothly every second via `setInterval` + D3 arc tween
- On complete: arc fills `--color-nominal` with a brief pulse, then resets

## MissionItem

```
┌───────────────────────────────────────────────────────┐
│ [MissionTimer]  ASTEROID SURVEY                 ACTIVE │
│                 Deploy probe to survey sector 7        │
│                 Reward: +50 fuel, +30 oxygen           │
│                 [ABORT]                                │
└───────────────────────────────────────────────────────┘
```
- Queued missions show: title, description, `[START]` button
- Completed missions show: title, "Completed X ago", reward summary

## MissionCreateForm

- Ant Design `Modal` triggered by "+ New Mission" button
- Fields: title (required), description (optional), duration in minutes (required, min 1)
- Reward fields: optional resource deltas (oxygen, power, food, fuel, water — number inputs)
- On submit: calls `mission.service.createMission()`, closes modal, refreshes list

## MissionControl layout

```
┌──────────────────────────────────────────────────────────┐
│ MISSION CONTROL              [+ NEW MISSION]             │
│────────────────────────────────────────────────────────  │
│ ACTIVE          [MissionItem — active]                  │
│────────────────────────────────────────────────────────  │
│ QUEUED          [MissionItem] [MissionItem]              │
│────────────────────────────────────────────────────────  │
│ COMPLETED       [MissionItem — complete × N]             │
└──────────────────────────────────────────────────────────┘
```

## Unit Tests

- `MissionTimer.test.tsx` — renders SVG arc, accepts duration and elapsed props
- `MissionItem.test.tsx` — renders title, status badge, correct actions per status
- `MissionCreateForm.test.tsx` — renders form fields, submit calls service
- `MissionControl.test.tsx` — renders section headers, mission items

## Acceptance Criteria

- [ ] Mission Control shows seeded missions in correct sections
- [ ] Active mission shows D3 countdown arc depleting in real time
- [ ] "Start" on queued mission calls PATCH and moves to active section
- [ ] "New Mission" opens form, submit creates mission and adds it to the list
- [ ] Completing a mission shows it in the completed section
- [ ] `nx test client` passes
- [ ] `nx build client` passes
- [ ] `nx run-many --target=lint` passes

## Dependencies

- Task 009 (frontend foundation) must be complete
- Task 008 (mission API) must be complete

## Notes
_Fill in after execution._
