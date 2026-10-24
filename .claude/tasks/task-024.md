# Task 024 — Module Management Animations

## Objective

Add entrance animations and hover lift to the Module Management page. After this task module cards stagger in and lift on hover, and offline modules pulse to draw attention.

## Context

- Read `.claude/docs/frontend.md` — ModuleManagement page location
- Read `apps/client/src/shared/motion/stationMotion.ts` — available variants

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/ModuleManagement/ModuleManagement.tsx` |
| Modify | `apps/client/src/pages/ModuleManagement/ModuleManagement.module.scss` |

## Animation Design

**Page enter:** Wrap the page root in `motion.div` using `pageEnter` variant.

**Module cards stagger:** Module card list uses `panelContainer` on the wrapper and `panelItem` on each card. Online cards also get `hoverLift`.

**Offline pulse:** Cards with `status === 'offline'` get a CSS animation — a subtle border-color pulse between `--color-offline` and `--color-border` at 2s interval:

```css
@keyframes offline-pulse {
  0%, 100% { border-color: var(--color-border); }
  50%       { border-color: var(--color-offline); }
}
```

Apply `.offline-pulse` class conditionally on offline module cards.

**Empty state:** Fades in with `panelItem` if no modules.

## Unit Tests

- Existing `ModuleManagement.test.tsx` — motion wrappers must not break existing assertions

## Acceptance Criteria

- [ ] Module cards stagger in on mount
- [ ] Online cards lift on hover
- [ ] Offline cards show border pulse animation
- [ ] Empty state fades in if no modules
- [ ] Existing ModuleManagement tests still pass
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 013 (Module Management) must be complete
- Task 020 (motion system) must be complete

## Notes
_Fill in after execution._
