# Task 022 — HUD Shell Redesign

## Objective

Replace the SaaS-style sidebar layout with a fullscreen HUD shell that makes the entire app feel like a space station operations console. After this task every page uses 100vw × 100vh, no sidebar occupies screen space, and the outer frame has game-grade chrome: corner brackets, scan-line overlay, persistent top status bar, and a compact bottom nav.

## Context

- Read `.claude/docs/ux.md` — color tokens, font tokens
- Read `.claude/docs/frontend.md` — StationLayout location
- Read `apps/client/src/shared/components/StationLayout/StationLayout.tsx` — current layout
- Read `apps/client/src/shared/components/StationLayout/StationLayout.module.scss`

## HUD Shell Design

```
┌╔════════════════════════════════════════════════════╗┐
 ║ ◈ KEPLER STATION ALPHA   STATUS: NOMINAL  T+04:22  ║  ← top status bar (48px)
 ╚════════════════════════════════════════════════════╝
 ┌────────────────────────────────────────────────────┐
 │                                                    │
 │               <page content>                       │  ← flex: 1, overflow hidden
 │                                                    │
 └────────────────────────────────────────────────────┘
 ╔════════════════════════════════════════════════════╗
 ║  [◉ DASH] [✦ CREW] [⬡ MODS] [◈ RES] [⚑ OPS] [▤ LOG] ║  ← bottom nav (52px)
 ╚════════════════════════════════════════════════════╝
└╔corner bracket decorations via CSS ::before/::after╗┘
```

### Corner Brackets

Use `::before` and `::after` on `.hud-shell` to draw corner brackets in `--color-accent`. Each bracket is a 20×20px box-shadow cross — top-left, top-right, bottom-left, bottom-right corners.

### Scan-Line Overlay

A `::before` on `.hud-shell__main` with `repeating-linear-gradient` draws 1px lines every 3px at `rgba(0,0,0,0.08)`. Set `pointer-events: none` and `z-index: 1` so it overlays content without blocking clicks.

### Top Status Bar

```tsx
<header className={styles['hud-shell__top-bar']}>
  <span className={styles['hud-shell__callsign']}>◈ KEPLER STATION ALPHA</span>
  <span className={styles['hud-shell__live-status']}>STATUS: NOMINAL</span>
  <HudUptime />
</header>
```

`HudUptime` counts seconds since page mount and displays `T+HH:MM:SS` via `setInterval(1000)`.

### Bottom Nav

Replace sidebar `<NavLink>` items with compact tab buttons. Active tab uses `--color-accent` + a 2px top border indicator. Nav items:

| Route | Glyph | Label |
|-------|-------|-------|
| `/station` | `◉` | DASH |
| `/crew` | `✦` | CREW |
| `/modules` | `⬡` | MODULES |
| `/resources` | `◈` | RESOURCES |
| `/missions` | `⚑` | OPS |
| `/events` | `▤` | LOG |

### Layout CSS

```
.hud-shell          // position: fixed; inset: 0; display: flex; flex-direction: column; overflow: hidden
.hud-shell__top-bar // height: 48px; flex-shrink: 0
.hud-shell__main    // flex: 1; overflow: hidden; position: relative
.hud-shell__bottom-nav // height: 52px; flex-shrink: 0; display: flex
.hud-shell__nav-tab // flex: 1; display: flex; flex-direction: column; align-items: center
```

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/shared/components/StationLayout/StationLayout.tsx` |
| Modify | `apps/client/src/shared/components/StationLayout/StationLayout.module.scss` |
| Create | `apps/client/src/shared/components/HudUptime/HudUptime.tsx` |
| Create | `apps/client/src/shared/components/HudUptime/HudUptime.test.tsx` |

## Unit Tests

Update `StationLayout.test.tsx`:
- Top bar renders station callsign text
- Bottom nav renders all 6 nav links (by their labels)
- Children render inside the main content area

Create `HudUptime.test.tsx`:
- Renders an element with text matching `T+00:00:00` on mount

## Acceptance Criteria

- [ ] Shell fills 100vw × 100vh with no visible scrollbar on the shell itself
- [ ] Sidebar is removed — bottom nav tabs are present and link correctly
- [ ] Top bar shows station callsign and status text
- [ ] Corner bracket CSS decorations visible on outer frame corners
- [ ] Scan-line overlay present on the main content area
- [ ] `HudUptime` renders T+HH:MM:SS format
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 009 (Frontend Foundation) must be complete
- Task 011 (Station Dashboard) must be complete

## Notes
_Fill in after execution._
