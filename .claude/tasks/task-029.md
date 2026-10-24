# Task 029 — Landing Page Copy

## Objective

Apply `stationCopy.landing` strings to the Landing page and replace the current layout with a structured hero + 6-card feature grid. After this task the landing page reads like a real operational command interface.

## Context

- Read `apps/client/src/shared/copy/stationCopy.ts`
- Read `apps/client/src/pages/Landing/Landing.tsx`

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/Landing/Landing.tsx` |
| Modify | `apps/client/src/pages/Landing/Landing.module.scss` |

## Layout

```
┌─────────────────────────────────────────────────────┐
│  SPACE STATION MANAGER                              │
│  Operational command interface — ARES-7             │
│  [ACCESS STATION]                                   │
│─────────────────────────────────────────────────────│
│  [STATION STATUS]  [CREW OPERATIONS]  [MODULE SYS]  │
│   body copy         body copy          body copy    │
│  [RESOURCE STORES] [MISSION CONTROL]  [EVENT LOG]   │
│   body copy         body copy          body copy    │
└─────────────────────────────────────────────────────┘
```

- Headline: `stationCopy.landing.headline` — large, `--font-display`
- Tagline: `stationCopy.landing.tagline` — muted, `--font-body`
- CTA: `stationCopy.landing.cta` — Ant Design `Button` type primary
- Feature grid: 2 rows × 3 cols (CSS Grid, responsive to 1 col on narrow)
  - Each card: title (`--font-label`, all-caps), body (`--font-body`, muted), border `1px solid var(--color-border)`
  - Card titles and body from `stationCopy.landing.features.*`

## Unit Tests

- Modify `apps/client/src/pages/Landing/Landing.test.tsx`:
  - Renders headline `'SPACE STATION MANAGER'`
  - Renders all 6 feature card titles

## Acceptance Criteria

- [ ] Headline reads "SPACE STATION MANAGER"
- [ ] Tagline reads the ARES-7 line
- [ ] All 6 feature cards rendered with correct title and body
- [ ] No hardcoded strings in JSX — all from `stationCopy`
- [ ] Existing routing/CTA behaviour unchanged
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 010 (Landing page) must be complete
- Task 028 (station copy foundation) must be complete

## Notes
_Fill in after execution._
