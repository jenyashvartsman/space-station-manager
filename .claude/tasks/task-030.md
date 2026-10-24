# Task 030 — Station Dashboard Copy

## Objective

Apply `stationCopy.dashboard` strings to the Station Dashboard page, adding a page heading, tagline, and intro strip.

## Context

- Read `apps/client/src/shared/copy/stationCopy.ts`
- Read `apps/client/src/pages/StationDashboard/StationDashboard.tsx`

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/StationDashboard/StationDashboard.tsx` |
| Modify | `apps/client/src/pages/StationDashboard/StationDashboard.module.scss` |

## Layout Addition

```
STATION DASHBOARD
ARES-7 · OPERATIONAL STATUS          ← tagline, --color-nominal, --font-label
──────────────────────────────────────
Live station telemetry. All systems nominal.  ← intro, muted
──────────────────────────────────────
[panels…]
```

- Heading: `stationCopy.dashboard.heading`
- Tagline: `stationCopy.dashboard.tagline` — `--color-nominal`, `--font-label`, small
- Intro: `stationCopy.dashboard.intro` — `--color-text-muted`, `--font-body`, `0.85rem`

## Unit Tests

- Modify `apps/client/src/pages/StationDashboard/StationDashboard.test.tsx`:
  - Renders `stationCopy.dashboard.heading`
  - Renders `stationCopy.dashboard.tagline`

## Acceptance Criteria

- [ ] Page heading, tagline, and intro strip visible on dashboard
- [ ] No hardcoded strings in JSX
- [ ] Existing Dashboard tests still pass
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 011 (Station Dashboard) must be complete
- Task 028 (station copy foundation) must be complete

## Notes
_Fill in after execution._
