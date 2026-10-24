# Task 032 — Module Management Copy

## Objective

Apply `stationCopy.modules` strings to the Module Management page: heading, intro strip, empty state, and per-module offline warning.

## Context

- Read `apps/client/src/shared/copy/stationCopy.ts`
- Read `apps/client/src/pages/ModuleManagement/ModuleManagement.tsx`

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/ModuleManagement/ModuleManagement.tsx` |
| Modify | `apps/client/src/pages/ModuleManagement/ModuleManagement.module.scss` |

## Layout Addition

```
MODULE SYSTEMS
Installed station modules and current system status.    ← intro, muted
──────────────────────────────────────────────────────
[ModuleCard — online]
[ModuleCard — offline]
  └─ ⚠ MODULE OFFLINE: Power Core — Repair required.   ← inline warning under card

[empty state:]
  No modules installed. Station expansion required.
```

- Heading: `stationCopy.modules.heading`
- Intro: `stationCopy.modules.intro`
- Offline warning: `stationCopy.modules.offlineWarning(module.name)` — rendered as a small `--color-critical` text beneath each offline module card
- Empty state: `stationCopy.modules.empty` — centered, `--color-text-muted`

## Unit Tests

- Modify `apps/client/src/pages/ModuleManagement/ModuleManagement.test.tsx`:
  - Renders `stationCopy.modules.heading`
  - Renders offline warning text for a module with `status === 'offline'`
  - Renders empty state when module list is empty

## Acceptance Criteria

- [ ] Heading and intro strip visible
- [ ] Offline warning text appears below each offline module card
- [ ] Empty state shown when no modules
- [ ] No hardcoded strings in JSX
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 013 (Module Management) must be complete
- Task 028 (station copy foundation) must be complete

## Notes
_Fill in after execution._
