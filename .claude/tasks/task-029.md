# Task 029 — HUD Entrance Animations

## Objective

Add game-like entrance animations to all HUD pages (022–028). After this task every page reveals like a console booting up: panels flicker on, data counters tick up from zero, and column headers scan in top-to-bottom — no SaaS-style fade-in.

## Context

- Read `apps/client/src/shared/motion/stationMotion.ts` — existing variants
- Read `.claude/docs/ux.md` — timing guidelines

## New Motion Variants

Add to `stationMotion.ts`:

```ts
// HUD panel boot flicker — brief opacity stutter before settling
export const hudBoot = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 0.4, 0.1, 0.8, 0.3, 1],
    transition: { duration: 0.35, ease: 'linear', times: [0, 0.2, 0.3, 0.5, 0.7, 1] },
  },
};

// HUD column scan — slides in from top with clip
export const hudColumnEnter = {
  initial: { opacity: 0, y: -24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};
```

## Per-Page Application

Apply animations consistently across all HUD pages:

| Page | Root | Columns/Sections | Items |
|------|------|-----------------|-------|
| StationDashboard | `pageEnter` | `hudColumnEnter` per column (stagger 0.08s) | `panelItem` |
| CrewRoster | `pageEnter` | `hudBoot` on each panel | `panelItem` per row |
| ModuleManagement | `pageEnter` | `hudBoot` on each panel | `panelItem` per tile |
| ResourcePanel | `pageEnter` | `hudColumnEnter` per column | `panelItem` per row |
| MissionControl | `pageEnter` | `hudColumnEnter` per column (stagger 0.08s) | `panelItem` per mission |
| EventLog | `pageEnter` | `hudBoot` on header + feed | `panelItem` per entry |

### HUD Shell

The `StationLayout` shell root gets `hudBoot` so the entire chrome flickers on first mount.

## Skeleton Loading

All HUD pages that load async data (`station`, `resources`, `modules`, `missions`) must show `SkeletonPanel` placeholders while loading — use `station === null` or empty array as the signal. Skeletons appear inside the column they belong to.

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/shared/motion/stationMotion.ts` |
| Modify | `apps/client/src/shared/motion/stationMotion.test.ts` |
| Modify | `apps/client/src/shared/components/StationLayout/StationLayout.tsx` |
| Modify | `apps/client/src/pages/StationDashboard/StationDashboard.tsx` |
| Modify | `apps/client/src/pages/CrewRoster/CrewRoster.tsx` |
| Modify | `apps/client/src/pages/ModuleManagement/ModuleManagement.tsx` |
| Modify | `apps/client/src/pages/ResourcePanel/ResourcePanel.tsx` |
| Modify | `apps/client/src/pages/MissionControl/MissionControl.tsx` |
| Modify | `apps/client/src/pages/EventLog/EventLog.tsx` |

## Unit Tests

Update `stationMotion.test.ts`:
- `hudBoot` exports with `initial` and `animate` keys
- `hudColumnEnter` exports with `initial` and `animate` keys
- `animate.opacity` on `hudBoot` is an array (flicker values)

## Acceptance Criteria

- [ ] `hudBoot` and `hudColumnEnter` exported from `stationMotion.ts`
- [ ] All 6 HUD pages apply entrance animations
- [ ] HUD shell chrome itself flickers on mount
- [ ] Skeleton panels shown during loading on all data pages
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Tasks 022–028 (all HUD layouts) must be complete
- Task 020 (motion system) must be complete

## Notes
_Fill in after execution._
