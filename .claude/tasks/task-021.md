# Task 021 — Landing Page Animations

## Objective

Add entrance animations and micro-interactions to the Landing page using the shared motion system from Task 019. After this task the landing page feels cinematic: the headline fades in first, then the subheadline, then feature cards stagger in one by one.

## Context

- Read `.claude/docs/frontend.md` — Landing page location
- Read `apps/client/src/shared/motion/stationMotion.ts` — available variants

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/Landing/Landing.tsx` |
| Modify | `apps/client/src/pages/Landing/Landing.module.scss` |

## Animation Design

**Page enter:** Wrap the page root in `motion.div` using `pageEnter` variant.

**Hero stagger:** Headline, subheadline, and CTA button each use `panelItem` variant inside a `panelContainer` `motion.div`:

```
headline   → fades in + slides up (delay 0s)
subheadline → fades in + slides up (delay 0.06s)
CTA button → fades in + slides up (delay 0.12s)
```

**Feature cards stagger:** The feature card grid is a `motion.div` with `panelContainer`; each card is a `motion.div` with `panelItem`. Cards also get `hoverLift` (`whileHover`).

## Unit Tests

- Modify `apps/client/src/pages/Landing/Landing.test.tsx` — still renders headline and feature cards (motion wrappers should not break existing tests; mock Framer Motion if needed)

## Acceptance Criteria

- [ ] Page fades and slides in on mount
- [ ] Hero text elements stagger in sequentially
- [ ] Feature cards stagger in and lift on hover
- [ ] Existing Landing tests still pass
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 010 (Landing page) must be complete
- Task 020 (motion system) must be complete

## Notes
_Fill in after execution._
