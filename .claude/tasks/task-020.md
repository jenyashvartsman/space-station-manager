# Task 020 — Motion System Setup

## Objective

Establish the shared motion infrastructure that all per-page animation tasks depend on: shared Framer Motion variants, CSS motion tokens, `AnimatePresence` on the router, and the `SkeletonPanel` loading placeholder. After this task every page has a common animation vocabulary to build on.

## Context

- Read `.claude/docs/frontend.md` — domain folder structure, router location
- Read `.claude/docs/ux.md` — existing motion patterns

## Scope

| Action | File |
|--------|------|
| Create | `apps/client/src/shared/motion/stationMotion.ts` — shared Framer Motion variants |
| Create | `apps/client/src/shared/motion/stationMotion.test.ts` |
| Create | `apps/client/src/shared/components/SkeletonPanel/SkeletonPanel.tsx` |
| Create | `apps/client/src/shared/components/SkeletonPanel/SkeletonPanel.module.scss` |
| Create | `apps/client/src/shared/components/SkeletonPanel/SkeletonPanel.test.tsx` |
| Modify | `apps/client/src/styles/globals.scss` (or equivalent) — add CSS motion tokens |
| Modify | `apps/client/src/app/AppRouter.tsx` (or equivalent) — wrap route outlet in `AnimatePresence mode="wait"` |

## stationMotion.ts — Variants

```ts
export const pageEnter = {
  initial:  { opacity: 0, y: 12 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:     { opacity: 0, y: -8,  transition: { duration: 0.15 } },
}

export const panelContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
}

export const panelItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

export const hoverLift = {
  whileHover: { y: -3, transition: { duration: 0.15 } },
}
```

## CSS Motion Tokens

Add to `:root` in the global stylesheet:

```css
--motion-fast: 0.15s;
--motion-base: 0.25s;
--motion-slow: 0.4s;
--motion-ease: cubic-bezier(0.4, 0, 0.2, 1);
```

## SkeletonPanel

- Props: `height?: string | number` (default `'80px'`), `className?: string`
- CSS shimmer animation: gradient sliding left→right over `--color-surface` / `--color-surface-elevated`
- `animation: skeleton-shimmer 1.4s ease-in-out infinite`

## AppRouter — AnimatePresence

Wrap the route outlet (or `<Routes>`) in:
```tsx
<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    …
  </Routes>
</AnimatePresence>
```
Requires `useLocation()` from react-router-dom to supply the `key`.

## Unit Tests

- `stationMotion.test.ts` — each export (`pageEnter`, `panelContainer`, `panelItem`, `hoverLift`) has the expected keys
- `SkeletonPanel.test.tsx` — renders, applies custom height, has expected role/testid

## Acceptance Criteria

- [ ] `stationMotion.ts` exports all four variants
- [ ] CSS motion tokens exist in the global stylesheet
- [ ] `SkeletonPanel` renders with shimmer animation class
- [ ] `AppRouter` uses `AnimatePresence mode="wait"` — no flash between route changes
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 009 (frontend foundation) — Framer Motion must be installed

## Notes
_Fill in after execution._
