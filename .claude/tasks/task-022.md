# Task 022 — Station Dashboard Animations

## Objective

Add entrance animations and a skeleton loading state to the Station Dashboard. After this task the dashboard panels stagger in on mount and a shimmer placeholder is shown while station data is fetching.

## Context

- Read `.claude/docs/frontend.md` — StationDashboard page location
- Read `apps/client/src/shared/motion/stationMotion.ts` — available variants

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/StationDashboard/StationDashboard.tsx` |
| Modify | `apps/client/src/pages/StationDashboard/StationDashboard.module.scss` |

## Animation Design

**Page enter:** Wrap the page root in `motion.div` using `pageEnter` variant.

**Panel stagger:** The grid of dashboard panels (status cards, resource summary, etc.) uses `panelContainer` on the wrapper and `panelItem` on each panel.

**Skeleton loading:** While station data is fetching (`isLoading` state), render `<SkeletonPanel />` placeholders instead of the real panels. Show 3–4 skeleton panels matching the approximate height of the real cards.

```
Loading state:
  [SkeletonPanel h=120px]
  [SkeletonPanel h=80px]
  [SkeletonPanel h=80px]

Loaded state:
  [StationStatusCard]  ← panelItem
  [ResourceSummary]   ← panelItem
  …
```

## Unit Tests

- Modify `apps/client/src/pages/StationDashboard/StationDashboard.test.tsx` — add test that `SkeletonPanel` is rendered when `isLoading` is true

## Acceptance Criteria

- [ ] Dashboard panels stagger in after data loads
- [ ] Skeleton panels shown while loading
- [ ] No layout shift when switching from skeleton to real content
- [ ] Existing Dashboard tests still pass
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 011 (Station Dashboard) must be complete
- Task 020 (motion system) must be complete

## Notes
_Fill in after execution._
