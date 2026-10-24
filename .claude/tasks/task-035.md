# Task 035 — Event Log Copy

## Objective

Apply `stationCopy.events` strings to the Event Log page: heading, intro strip, and empty state message.

## Context

- Read `apps/client/src/shared/copy/stationCopy.ts`
- Read `apps/client/src/pages/EventLog/EventLog.tsx`

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/EventLog/EventLog.tsx` |
| Modify | `apps/client/src/pages/EventLog/EventLog.module.scss` |

## Layout Addition

```
STATION EVENT LOG
Station-wide alert and activity feed — last 50 entries.   ← intro, muted
Filter: [All Types ▾]            Last updated: 14:32:10
────────────────────────────────────────────────────────
[EventEntry…]

[empty state when no events:]
  No events recorded. All systems nominal.
```

- Heading: already exists as "STATION EVENT LOG" — replace hardcoded string with `stationCopy.events.heading`
- Intro: `stationCopy.events.intro` — `--color-text-muted`, `--font-body`, `0.85rem`, placed between heading and filter bar
- Empty state: `stationCopy.events.empty` — shown when the filtered event list is empty

## Unit Tests

- Modify `apps/client/src/pages/EventLog/EventLog.test.tsx`:
  - Renders `stationCopy.events.heading`
  - Renders `stationCopy.events.empty` when event list is empty

## Acceptance Criteria

- [ ] Heading sourced from `stationCopy`
- [ ] Intro strip visible below heading
- [ ] Empty state shown when no events match the filter
- [ ] No hardcoded UI strings in JSX
- [ ] Existing EventLog tests still pass
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 016 (Event Log) must be complete
- Task 028 (station copy foundation) must be complete

## Notes
_Fill in after execution._
