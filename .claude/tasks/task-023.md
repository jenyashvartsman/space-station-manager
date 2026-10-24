# Task 023 — Crew Roster Animations

## Objective

Add entrance animations and hover lift to the Crew Roster page. After this task crew cards stagger in on mount and lift slightly on hover, making the roster feel responsive.

## Context

- Read `.claude/docs/frontend.md` — CrewRoster page location
- Read `apps/client/src/shared/motion/stationMotion.ts` — available variants

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/CrewRoster/CrewRoster.tsx` |
| Modify | `apps/client/src/pages/CrewRoster/CrewRoster.module.scss` |

## Animation Design

**Page enter:** Wrap the page root in `motion.div` using `pageEnter` variant.

**Crew cards stagger:** The crew card list/grid uses `panelContainer` on the wrapper and `panelItem` on each `CrewCard`. Each card also gets `hoverLift` (`whileHover`).

```
[CrewCard] ← panelItem + whileHover hoverLift
[CrewCard]
[CrewCard]
…
```

**Empty state:** If no crew, the empty state `motion.div` uses `panelItem` to fade in.

## Unit Tests

- Existing `CrewRoster.test.tsx` — motion wrappers must not break existing assertions; mock Framer Motion if needed

## Acceptance Criteria

- [ ] Crew cards stagger in on mount
- [ ] Each card lifts on hover (y: -3px)
- [ ] Empty state fades in if no crew
- [ ] Existing CrewRoster tests still pass
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 012 (Crew Roster) must be complete
- Task 020 (motion system) must be complete

## Notes
_Fill in after execution._
