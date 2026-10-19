# Task 010 — Landing Page

## Objective

Build the animated landing page that serves as the entry point before the player enters the station. It should feel cinematic — deep space aesthetic, animated star field, station title reveal, and system readouts counting up. The "Enter Station" button navigates to the dashboard.

## Context

- Read `.claude/docs/ux.md` — Motion section (Landing Page Animations table), color palette, typography
- Read `.claude/docs/frontend.md` — domain folder structure, naming conventions

## Scope

| Action | File |
|--------|------|
| Create | `apps/client/src/pages/Landing/Landing.tsx` |
| Create | `apps/client/src/pages/Landing/Landing.module.scss` |
| Create | `apps/client/src/pages/Landing/Landing.test.tsx` |
| Create | `apps/client/src/pages/Landing/StarField.tsx` — canvas star particle system |
| Create | `apps/client/src/pages/Landing/useStarField.ts` — canvas animation hook |
| Create | `apps/client/src/pages/Landing/StationTitleReveal.tsx` — Framer Motion letter stagger |
| Create | `apps/client/src/pages/Landing/SystemReadout.tsx` — counting-up stat display |
| Modify | `apps/client/src/app/router.tsx` — add `/landing` or use as index route |

## Visual Composition

```
┌─────────────────────────────────────────────────────────┐
│  [starfield canvas — full viewport, z-index 0]          │
│  [scan-line CSS overlay — z-index 1]                     │
│                                                          │
│          KEPLER STATION ALPHA                            │
│          ── letter-by-letter reveal ──                   │
│                                                          │
│    CREW: 05   MODULES: 06   POWER: 78%   STATUS: NOMINAL │
│    ── counting-up numbers, Space Mono font ──            │
│                                                          │
│              [ ENTER STATION ]                           │
│              ── glow pulse CTA ──                        │
│                                                          │
│    MISSION LOG: ASTEROID SURVEY IN PROGRESS...           │
│    ── typewriter-style scrolling text ──                 │
└─────────────────────────────────────────────────────────┘
```

## StarField (canvas)

- 200 stars, random positions, varying radius (0.5–2px), varying opacity
- Stars twinkle: random opacity oscillation per star
- Parallax: stars shift slightly on `mousemove` (nearer stars move more)
- Color: `rgba(255, 255, 255, alpha)` — some stars tinted `--color-accent` (ice blue)
- Uses `requestAnimationFrame` loop via `useStarField` hook
- Cleans up on unmount

## StationTitleReveal

- Split station name into individual `<span>` chars
- Framer Motion `variants` with `staggerChildren: 0.04`
- Each char: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- Delay: 0.5s after page mount
- Font: `--font-data`, uppercase, letter-spacing 0.2em, `--color-text-primary`

## SystemReadout

- Props: `label`, `targetValue`, `unit`, `delay`
- Counts from 0 → `targetValue` over 1.2s using D3 `tween` or `requestAnimationFrame`
- Font: `--font-data`, color `--color-text-data`
- Label: `--font-ui`, `--font-size-xs`, uppercase, `--color-text-muted`

## Enter Station Button

- Ant Design `Button` with custom SCSS overrides
- Background: transparent, border: 1px solid `--color-accent`
- Text: `--color-accent`, `--font-ui`, uppercase, letter-spacing 0.1em
- Idle state: `pulse-critical` variant using `--color-accent-glow` (not red)
- Hover: background fills to `--color-accent-glow`, text brightens
- Navigates to `/` (dashboard) via React Router `navigate`

## Scan-line Overlay

Pure CSS on a `::after` pseudo-element:
```scss
background: repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(0, 0, 0, 0.03) 2px,
  rgba(0, 0, 0, 0.03) 4px
);
```

## Unit Tests

- `Landing.test.tsx` — renders without crashing, "ENTER STATION" button exists
- `SystemReadout.test.tsx` — renders label and unit

## Acceptance Criteria

- [ ] Landing page renders at `/` before dashboard (or at `/landing` with redirect)
- [ ] Star field canvas animates — stars visible and twinkling
- [ ] Station name reveals letter by letter on mount
- [ ] System readouts count up to their target values
- [ ] "Enter Station" button navigates to the dashboard
- [ ] No layout visible behind the landing page (full-viewport takeover)
- [ ] `nx test client` passes
- [ ] `nx build client` passes
- [ ] `nx run-many --target=lint` passes

## Dependencies

- Task 009 (frontend foundation) must be complete

## Notes
_Fill in after execution._
