# Task 027 — Mission Control HUD Layout

## Objective

Transform the Mission Control page into a fullscreen tactical operations board. After this task three columns fill the viewport — ACTIVE, QUEUED, COMPLETED — with mission timers and action buttons always visible, no scroll.

## Context

- Read `.claude/docs/ux.md` — color tokens, font tokens
- Read `.claude/docs/frontend.md` — MissionControl page location
- Read `apps/client/src/pages/MissionControl/MissionControl.tsx`
- Read `apps/client/src/pages/MissionControl/MissionControl.module.scss`

## HUD Layout Design

```
┌──────────────────┬──────────────────┬──────────────────┐
│  ◈ ACTIVE OPS    │  ◈ QUEUED OPS    │  ◈ COMPLETED OPS │
│  (2)             │  (3)             │  (5)             │
├──────────────────┼──────────────────┼──────────────────┤
│  ASTEROID SURVEY │  ORBITAL REQ.    │  ✓ ORBITAL SCAN  │
│  [timer arc]     │  [START] [ABORT] │    +120 oxygen   │
│  15:32 remain    │                  │    T-04:22 ago   │
│  Reward: +80 O2  │  SUPPLY RUN      │                  │
│                  │  [START] [ABORT] │  ✓ RESUPPLY      │
│  ORBITAL MAINT.  │                  │    +200 food     │
│  [timer arc]     │  RECON OPS       │                  │
│  04:07 remain    │  [START] [ABORT] │                  │
│                  │                  │                  │
│         [+ NEW MISSION ──────────────────────────────] │
└──────────────────┴──────────────────┴──────────────────┘
```

### Three-Column Grid

CSS Grid: `grid-template-columns: 1fr 1fr 1fr`. Each column has:
- Header: section title + count badge
- `overflow-y: auto` body for its mission items
- `1px solid var(--color-border)` right divider (except last)

### Mission Items in Active Column

- `MissionItem` is rendered as a full-width block
- Mission timer arc (`MissionTimer` D3 component) displayed prominently
- Reward line below

### New Mission Button

Fixed at bottom of the page, spanning all three columns — full width.

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/MissionControl/MissionControl.tsx` |
| Modify | `apps/client/src/pages/MissionControl/MissionControl.module.scss` |

## Unit Tests

Update `MissionControl.test.tsx`:
- Renders three column headings: "ACTIVE OPS", "QUEUED OPS", "COMPLETED OPS"
- "NEW MISSION" button is present and accessible
- Existing mission item and create form tests still pass

## Acceptance Criteria

- [ ] Page fills viewport height, no scroll on the page frame
- [ ] Three-column grid matches design
- [ ] Each column independently scrolls if items overflow
- [ ] New Mission button spans full width at the bottom
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 015 (Mission Control) must be complete
- Task 022 (HUD Shell) must be complete

## Notes
_Fill in after execution._
