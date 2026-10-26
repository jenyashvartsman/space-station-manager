# Task 028 — Event Log HUD Layout

## Objective

Transform the Event Log page into a fullscreen comms terminal. After this task the feed fills the entire viewport like a live telemetry ticker: dense event rows, a type-filter toolbar, and a blinking live indicator — no wasted space.

## Context

- Read `.claude/docs/ux.md` — color tokens, font tokens
- Read `.claude/docs/frontend.md` — EventLog page location
- Read `apps/client/src/pages/EventLog/EventLog.tsx`
- Read `apps/client/src/pages/EventLog/EventLog.module.scss`

## HUD Layout Design

```
┌──────────────────────────────────────────────────────┐
│  ◈ STATION COMMS LOG              ● LIVE  14:22:31   │
│  [ALL] [CRITICAL] [WARNING] [INFO] [MISSION] [SYSTEM]│
├──────────────────────────────────────────────────────┤
│  ⚠ 14:22:31  OXYGEN LEVEL CRITICAL — BELOW 20%      │
│  ✓ 14:19:04  MISSION COMPLETE: Orbital Survey        │
│  ℹ 14:15:00  CREW STATUS: Dr. Vasquez — Active       │
│  ✓ 14:10:22  MODULE ONLINE: Research Lab             │
│  ⚠ 14:05:11  POWER WARNING — 72% capacity            │
│  …                                                   │
│  (scrolling feed fills remaining height)             │
└──────────────────────────────────────────────────────┘
```

### Header Bar

- Left: "◈ STATION COMMS LOG" in `--font-data`
- Right: `● LIVE` (blinking dot via `animation: blink 1s step-end infinite`) + last-updated timestamp

### Filter Toolbar

Existing `EventLogFeed` type-filter buttons styled as compact HUD pills in a row below the header. The "ALL" filter selects/deselects all.

### Event Feed

- Each `EventEntry` row: type icon glyph + timestamp + message text
- Full-width rows, `font-family: var(--font-data)`, `font-size: var(--font-size-sm)`
- Feed area fills remaining viewport height, `overflow-y: auto`
- Custom thin scrollbar matching the dark theme
- New entries slide in from the top via `AnimatePresence` (existing behavior)

### Live Blink

Add a `blink` keyframe to the SCSS module and apply it to the `● LIVE` indicator dot:

```css
@keyframes blink {
  50% { opacity: 0; }
}
```

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/EventLog/EventLog.tsx` |
| Modify | `apps/client/src/pages/EventLog/EventLog.module.scss` |

## Unit Tests

Update `EventLog.test.tsx`:
- Renders heading "STATION COMMS LOG"
- Renders the live indicator element
- Filter buttons present
- Existing event rendering tests still pass

## Acceptance Criteria

- [ ] Page fills viewport height, no page scroll
- [ ] Header shows "STATION COMMS LOG" + live indicator
- [ ] Filter toolbar visible below header
- [ ] Feed fills remaining height with overflow scroll
- [ ] Live dot blinks
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 016 (Event Log) must be complete
- Task 022 (HUD Shell) must be complete

## Notes
_Fill in after execution._
