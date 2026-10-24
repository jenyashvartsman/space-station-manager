# Task 026 — Mission Control Animations

## Objective

Add entrance animations to the Mission Control page. After this task mission items stagger in per section and new missions animate in when added without a full page re-render.

## Context

- Read `.claude/docs/frontend.md` — MissionControl page location
- Read `apps/client/src/shared/motion/stationMotion.ts` — available variants

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/MissionControl/MissionControl.tsx` |
| Modify | `apps/client/src/pages/MissionControl/MissionControl.module.scss` |
| Modify | `apps/client/src/domains/mission/components/MissionItem/MissionItem.tsx` |

## Animation Design

**Page enter:** Wrap the page root in `motion.div` using `pageEnter` variant.

**Section stagger:** Each section (ACTIVE, QUEUED, COMPLETED) is its own `panelContainer`. Mission items within each section use `panelItem`.

**Live list updates:** Wrap each section's item list in `AnimatePresence`. When a mission status changes (e.g., queued → active), the item exits the QUEUED section and enters the ACTIVE section with the standard `panelItem` animation.

```tsx
<AnimatePresence>
  {activeMissions.map((m) => (
    <MissionItem key={m.id} mission={m} />
  ))}
</AnimatePresence>
```

**MissionItem** itself becomes a `motion.div` with `panelItem` (initial/animate/exit).

**Empty state per section:** Each empty state fades in with `panelItem`.

## Unit Tests

- Existing `MissionControl.test.tsx` and `MissionItem.test.tsx` — motion wrappers must not break existing assertions

## Acceptance Criteria

- [ ] Mission sections stagger in on mount
- [ ] Items animate in/out when status changes between sections
- [ ] Empty section states fade in
- [ ] Existing MissionControl and MissionItem tests still pass
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 015 (Mission Control) must be complete
- Task 020 (motion system) must be complete

## Notes
_Fill in after execution._
