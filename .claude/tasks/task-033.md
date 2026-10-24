# Task 033 — Resource Panel Copy

## Objective

Apply `stationCopy.resources` strings to the Resource Panel page: heading, intro strip, empty state, and per-resource critical/low alert banners.

## Context

- Read `apps/client/src/shared/copy/stationCopy.ts`
- Read `apps/client/src/pages/ResourcePanel/ResourcePanel.tsx`

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/ResourcePanel/ResourcePanel.tsx` |
| Modify | `apps/client/src/pages/ResourcePanel/ResourcePanel.module.scss` |

## Layout Addition

```
RESOURCE STORES
Current inventory levels across all resource categories.   ← intro, muted
────────────────────────────────────────────────────────
⛔ CRITICAL: Oxygen reserves below operational threshold.  ← if < 20% capacity
⚠  WARNING: Fuel reserves low — resupply recommended.     ← if < 40% capacity
────────────────────────────────────────────────────────
[resource rows…]

[empty state:]
  Resource telemetry unavailable.
```

- Heading: `stationCopy.resources.heading`
- Intro: `stationCopy.resources.intro`
- Critical banner: `stationCopy.resources.critical(resource.name)` — Ant Design `Alert` type `error`, one per critical resource
- Low banner: `stationCopy.resources.low(resource.name)` — Ant Design `Alert` type `warning`, one per low resource
- Empty state: `stationCopy.resources.empty`

Alert thresholds (use existing logic if already defined, otherwise):
- Critical: `quantity / capacity < 0.2`
- Low: `quantity / capacity < 0.4` and not critical

## Unit Tests

- Modify `apps/client/src/pages/ResourcePanel/ResourcePanel.test.tsx`:
  - Renders `stationCopy.resources.heading`
  - Renders critical alert for a resource below 20% capacity
  - Renders low alert for a resource between 20–40% capacity
  - Renders empty state when no resources

## Acceptance Criteria

- [ ] Heading and intro strip visible
- [ ] Critical and low banners use interpolated resource names from `stationCopy`
- [ ] Empty state shown when no resources
- [ ] No hardcoded strings in JSX
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 014 (Resource Panel) must be complete
- Task 028 (station copy foundation) must be complete

## Notes
_Fill in after execution._
