# Task 016 — Event Log

## Objective

Build the Event Log page: a live feed of station events (alerts, mission completions, crew status changes, resource depletions) that polls every 5 seconds. New entries animate in from the top. After this task operators have full visibility into what is happening on the station.

## Context

- Read `.claude/docs/frontend.md` — domain folder structure, naming conventions
- Read `.claude/docs/ux.md` — alert entry animation (fade-in + translate-y), motion timing
- Read `.claude/docs/backend.md` — event log API endpoint

## Scope

| Action | File |
|--------|------|
| Create | `apps/client/src/domains/event-log/types/event-log.types.ts` |
| Create | `apps/client/src/domains/event-log/services/event-log.service.ts` |
| Create | `apps/client/src/domains/event-log/store/useEventLogStore.ts` |
| Create | `apps/client/src/domains/event-log/hooks/useEventLogPolling.ts` |
| Create | `apps/client/src/domains/event-log/components/EventEntry/EventEntry.tsx` |
| Create | `apps/client/src/domains/event-log/components/EventEntry/EventEntry.module.scss` |
| Create | `apps/client/src/domains/event-log/components/EventEntry/EventEntry.test.tsx` |
| Create | `apps/client/src/domains/event-log/components/EventLogFeed/EventLogFeed.tsx` |
| Create | `apps/client/src/domains/event-log/components/EventLogFeed/EventLogFeed.module.scss` |
| Create | `apps/client/src/domains/event-log/components/EventLogFeed/EventLogFeed.test.tsx` |
| Create | `apps/client/src/pages/EventLog/EventLog.tsx` — full implementation |
| Create | `apps/client/src/pages/EventLog/EventLog.module.scss` |
| Create | `apps/client/src/pages/EventLog/EventLog.test.tsx` |

## EventEntry Design

```
┌──────────────────────────────────────────────────────────┐
│ ● ALERT           Power fluctuation in Power Core        │
│                   2026-10-18 14:32:05                     │
└──────────────────────────────────────────────────────────┘
```
- Left: colored type indicator dot + type label (`text--label`)
- Right: message + timestamp
- Type color mapping:
  - `alert` → `--color-critical`
  - `mission_complete` → `--color-nominal`
  - `mission_failed` → `--color-critical`
  - `crew_injured` → `--color-warning`
  - `resource_depleted` → `--color-critical`
  - `resource_low` → `--color-warning`
  - `module_offline` → `--color-offline`
  - default → `--color-text-muted`

## EventEntry Animation (Framer Motion)

```ts
initial={{ opacity: 0, y: -8 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.15 }}
```

## EventLogFeed

- `AnimatePresence` wrapping the list
- New entries added to the top, old entries removed from bottom when count > 50
- Filter bar: filter by event type (multi-select Ant Design `Select`)
- Shows timestamp in `--font-data` format: `HH:MM:SS`

## useEventLogPolling

- Polls `GET /events?limit=50` every 5s
- Deduplicates by `id` — only animates genuinely new entries
- New entries are IDs not present in the previous poll result

## EventLog layout

```
┌──────────────────────────────────────────────────────────┐
│ STATION EVENT LOG                                        │
│ Filter: [All Types ▾]          Last updated: 14:32:10   │
│────────────────────────────────────────────────────────  │
│ [EventEntry — newest]                                   │
│ [EventEntry]                                            │
│ [EventEntry]                                            │
│ ...                                                     │
└──────────────────────────────────────────────────────────┘
```

## Unit Tests

- `EventEntry.test.tsx` — renders message, timestamp, correct type color
- `EventLogFeed.test.tsx` — renders list of entries, filter works
- `EventLog.test.tsx` — renders page heading, feed component

## Acceptance Criteria

- [ ] Event Log page shows seeded events sorted by `created_at DESC`
- [ ] New events animate in from the top when the backend produces them
- [ ] Type filter hides/shows correct event types
- [ ] Timestamp is displayed in readable format
- [ ] Poll deduplication does not re-animate existing entries
- [ ] `nx test client` passes
- [ ] `nx build client` passes
- [ ] `nx run-many --target=lint` passes

## Dependencies

- Task 009 (frontend foundation) must be complete
- Task 008 (event log API) must be complete

## Notes
_Fill in after execution._
