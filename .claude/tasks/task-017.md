# Task 017 — Station Reset (Re-seed from UI)

## Objective

Allow operators to wipe and re-seed the database from the UI, resetting the station to its initial state. This is useful for demos and testing without touching the terminal. After this task, a "Reset Station" action in the UI triggers the backend seed script and reloads all data.

## Context

- Read `.claude/docs/backend.md` — server architecture, route structure
- Read `.claude/docs/frontend.md` — domain folder structure, naming conventions
- Read `.claude/docs/ux.md` — modal/confirmation patterns

## Scope

### Backend

| Action | File |
|--------|------|
| Create | `apps/server/src/station/station-reset.route.ts` — `POST /station/reset` endpoint |
| Modify | `apps/server/src/app.ts` — register the new route |

### Frontend

| Action | File |
|--------|------|
| Create | `apps/client/src/domains/station/components/StationResetButton/StationResetButton.tsx` |
| Create | `apps/client/src/domains/station/components/StationResetButton/StationResetButton.module.scss` |
| Create | `apps/client/src/domains/station/components/StationResetButton/StationResetButton.test.tsx` |
| Modify | `apps/client/src/pages/StationDashboard/StationDashboard.tsx` — add StationResetButton |

## Backend: POST /station/reset

- Runs the seed logic from `apps/db/src/seed.ts` programmatically (import and call the seed function directly — do not shell out)
- Respond `200 { message: "Station reset complete" }` on success
- Respond `500 { error: "..." }` on failure
- The seed function must be importable; if it is a top-level script today, refactor it to export a `seed()` function that the script calls, and that the route can also call

## StationResetButton Design

```
┌──────────────────────────────────────┐
│  [RESET STATION]                     │
│  ↓ on click: confirmation modal      │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ RESET STATION?                 │  │
│  │ This will wipe all data and    │  │
│  │ restore factory defaults.      │  │
│  │                                │  │
│  │  [Cancel]    [Confirm Reset]   │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

- Button uses `--color-critical` styling (danger action)
- Ant Design `Modal.confirm` for the confirmation dialog
- While resetting: button shows a loading spinner, all store data is cleared
- On success: call `window.location.reload()` to reload the full app with fresh data
- On error: show an Ant Design `message.error` notification

## StationDashboard placement

- Add `<StationResetButton />` to the bottom of the Station Dashboard page, below all panels
- Small secondary placement — it should not dominate the dashboard

## Unit Tests

- `StationResetButton.test.tsx` — renders button, clicking opens confirmation modal

## Acceptance Criteria

- [ ] `POST /station/reset` truncates all tables and re-runs seed data
- [ ] Clicking "Reset Station" shows a confirmation modal
- [ ] Confirming the modal calls the reset endpoint and reloads the page
- [ ] Cancelling the modal does nothing
- [ ] Loading state is shown while the request is in flight
- [ ] Error notification is shown if the endpoint fails
- [ ] `nx test client` passes
- [ ] `nx test server` passes
- [ ] `nx build client` passes
- [ ] `nx build server` passes

## Dependencies

- Task 003 (database schema) must be complete — seed script must be importable
- Task 011 (Station Dashboard) must be complete

## Notes
_Fill in after execution._
