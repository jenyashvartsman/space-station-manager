# Task 027 — Event Log Animations

## Objective

Align the Event Log page with the shared motion system from Task 019. The event entries already animate (from Task 016); this task ensures the page enter and filter bar use the standard variants consistently.

## Context

- Read `.claude/docs/frontend.md` — EventLog page location
- Read `apps/client/src/shared/motion/stationMotion.ts` — available variants
- Read `apps/client/src/pages/EventLog/EventLog.tsx` — existing animation code

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/EventLog/EventLog.tsx` |
| Modify | `apps/client/src/domains/event-log/components/EventEntry/EventEntry.tsx` |

## Animation Design

**Page enter:** Replace any existing page-level entrance with `motion.div` using the standard `pageEnter` variant from `stationMotion.ts`.

**EventEntry:** The existing `initial/animate/exit` on EventEntry should be imported from `stationMotion.ts` rather than defined inline. Verify the values match; update if they differ:

```ts
// Replace inline values with:
import { panelItem } from '@/shared/motion/stationMotion'
// initial: { opacity: 0, y: -8 } → use panelItem.initial  (adjust y direction to -8 for top-entry)
```

Keep the `AnimatePresence` on `EventLogFeed` as-is — it is already correct.

**Filter bar:** The filter bar row fades in with `panelItem` so it does not appear before the header.

## Unit Tests

- Existing `EventLog.test.tsx` and `EventEntry.test.tsx` — no new tests required; verify existing tests still pass after refactor

## Acceptance Criteria

- [ ] Event Log page uses `pageEnter` from `stationMotion.ts`
- [ ] EventEntry animation values sourced from shared motion file
- [ ] No duplicate inline animation constants in EventEntry or EventLog
- [ ] Existing EventLog and EventEntry tests still pass
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 016 (Event Log) must be complete
- Task 020 (motion system) must be complete

## Notes
_Fill in after execution._
