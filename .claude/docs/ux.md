# UX — Space Station Manager

> **Status:** Decided — visual language and theme locked.

---

## Design Philosophy

- Functional, mission-critical UI — like a real control room
- Information-dense but readable — no clutter, clear hierarchy
- Tension and urgency when resources are critical
- Calm and in-control when things are running well

---

## Target User

- Casual strategy game player or operational dashboard user
- Comfortable with dashboards and resource management UIs
- Desktop-first, mouse-driven interaction

---

## Core Screens

| Screen | Purpose |
|--------|---------|
| Station Overview | Bird's-eye view of all modules and key metrics |
| Module Detail | Drill into a single module — status, crew, resources |
| Crew Roster | Manage crew assignments and status |
| Resource Panel | Track all resources, trends, and alerts |
| Mission Control | Active and queued missions |
| Log / Events | History of station events |

---

## Dark Space Theme

The UI feels like a real space station operations console — deep dark backgrounds, glowing accents, subtle depth.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-base` | `#080c14` | Page background — deep space black |
| `--color-bg-surface` | `#0f1624` | Cards, panels |
| `--color-bg-elevated` | `#161e30` | Modals, dropdowns, hover states |
| `--color-border` | `#1e2a40` | Panel borders, dividers |
| `--color-border-subtle` | `#131c2e` | Inner borders |
| `--color-accent` | `#38bdf8` | Primary interactive — ice blue |
| `--color-accent-glow` | `rgba(56,189,248,0.15)` | Glow on focused/active elements |
| `--color-nominal` | `#22c55e` | Nominal status — green |
| `--color-warning` | `#f59e0b` | Warning status — amber |
| `--color-critical` | `#ef4444` | Critical status — red |
| `--color-offline` | `#4b5563` | Offline / inactive — gray |
| `--color-text-primary` | `#e2e8f8` | Main text |
| `--color-text-muted` | `#6b7fa8` | Labels, secondary info |
| `--color-text-data` | `#a8d8f0` | Numbers, readings — slightly blue-tinted |

### Typography

Base font size is set on `<html>`: `16px` at desktop, scales down at smaller breakpoints (see Responsive section). All sizes use `rem` so they scale proportionally.

| Token | Value | px equiv @ 16px base | Usage |
|-------|-------|----------------------|-------|
| `--font-ui` | `'Inter', system-ui, sans-serif` | — | All UI labels, headings, buttons |
| `--font-data` | `'Space Mono', 'JetBrains Mono', monospace` | — | All numeric data, readings, codes |
| `--font-size-xs` | `0.6875rem` | 11px | Micro labels |
| `--font-size-sm` | `0.8125rem` | 13px | Secondary text, badges |
| `--font-size-base` | `0.875rem` | 14px | Default body |
| `--font-size-lg` | `1rem` | 16px | Section headings |
| `--font-size-xl` | `1.25rem` | 20px | Panel titles |
| `--font-size-data` | `1.125rem` | 18px | Key metric readouts |

### Ant Design Theme Config

Override Ant Design's design tokens to match the space theme:

```ts
// theme.config.ts
{
  algorithm: theme.darkAlgorithm,
  token: {
    colorBgBase:       '#080c14',
    colorBgContainer:  '#0f1624',
    colorBgElevated:   '#161e30',
    colorBorder:       '#1e2a40',
    colorPrimary:      '#38bdf8',
    colorText:         '#e2e8f8',
    colorTextSecondary:'#6b7fa8',
    borderRadius:       4,
    fontFamily:        "'Inter', system-ui, sans-serif",
  }
}
```

---

## SCSS Variables & Utility Classes

All tokens live in `apps/client/src/shared/styles/_variables.scss`.
Utility classes live in `apps/client/src/shared/styles/_utilities.scss`.

### Status Utilities

```scss
// Usage: <span class="status status--nominal">NOMINAL</span>
.status {
  &--nominal  { color: var(--color-nominal); }
  &--warning  { color: var(--color-warning); }
  &--critical { color: var(--color-critical); animation: pulse-critical 1.5s infinite; }
  &--offline  { color: var(--color-offline); }
}
```

### Text Utilities

```scss
.text {
  &--data    { font-family: var(--font-data); color: var(--color-text-data); }
  &--muted   { color: var(--color-text-muted); font-size: var(--font-size-sm); }
  &--label   { font-size: var(--font-size-xs); text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); }
  &--reading { font-family: var(--font-data); font-size: var(--font-size-data); color: var(--color-text-data); }
}
```

### Surface Utilities

```scss
.surface {
  &--panel    { background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: 4px; }
  &--elevated { background: var(--color-bg-elevated); border: 1px solid var(--color-border); }
  &--glow     { box-shadow: 0 0 12px var(--color-accent-glow); }
}
```

### Spacing Scale

All spacing uses `rem`. Base is `1rem = 16px` at desktop.

```scss
// Use as: padding: var(--space-2)
--space-1:  0.25rem;   // 4px
--space-2:  0.5rem;    // 8px
--space-3:  0.75rem;   // 12px
--space-4:  1rem;      // 16px
--space-6:  1.5rem;    // 24px
--space-8:  2rem;      // 32px
--space-12: 3rem;      // 48px
--space-16: 4rem;      // 64px
```

---

## Responsive Support

Desktop-first. The base styles target 1280px+. All breakpoints scale down using `rem` and fluid layouts — no fixed pixel widths on containers.

### Breakpoints

Defined in `_variables.scss`, used via a `respond-to` mixin:

```scss
// _variables.scss
--bp-xl:   90rem;    // 1440px — large desktop
--bp-lg:   80rem;    // 1280px — desktop (base/default)
--bp-md:   64rem;    // 1024px — laptop / small desktop
--bp-sm:   48rem;    // 768px  — tablet
--bp-xs:   30rem;    // 480px  — mobile (not prioritized, defined for safety)

// _mixins.scss
@mixin respond-to($bp) {
  @media (max-width: #{$bp}) { @content; }
}
```

### Base Font Scale

Scale down the `html` font-size at each breakpoint so all `rem` values compress proportionally:

```scss
html {
  font-size: 16px;                         // 1280px+ (base)
  @include respond-to(var(--bp-md)) { font-size: 15px; }  // 1024px
  @include respond-to(var(--bp-sm)) { font-size: 14px; }  // 768px
  @include respond-to(var(--bp-xs)) { font-size: 13px; }  // 480px
}
```

### Layout Behavior by Breakpoint

| Breakpoint | Layout change |
|------------|---------------|
| 1440px+ | Wider station grid, more columns |
| 1280px | Default — 12-column grid, full sidebar |
| 1024px | Sidebar collapses to icon-only |
| 768px | Single column, panels stack vertically |
| 480px | Minimal view — station overview only, no multi-panel |

### Rules
- No hardcoded `px` widths on layout containers — use `%`, `rem`, or CSS Grid `fr` units
- `px` is allowed for: borders (1px), box-shadows, and media query definitions only
- All font sizes, padding, margin, gap: `rem`
- Images and icons: `em` or `rem` relative to context

---

## Motion & Animation

Every animation must carry information — no decoration for its own sake.

### Libraries

| Library | Version | Usage |
|---------|---------|-------|
| D3.js | v7 | Data-driven SVG charts and visualizations |
| Framer Motion | v11 | Component mount/unmount transitions, layout animations |

### D3.js Usage

D3 is used for **data-bound visualizations only** — not for page transitions or UI animations.

| Component | D3 technique |
|-----------|-------------|
| `ResourceGauge` | Radial arc chart — fill % with animated arc tween |
| `ResourceTrendChart` | Area/line chart — sliding 60-point rolling window |
| `StationSchematic` | Force-directed or fixed layout of module nodes with status color |
| `MissionTimer` | Countdown arc (full circle → empty as time elapses) |
| `PowerConsumptionChart` | Bar chart per module — animates on data change |

**D3 conventions in this project:**
- All D3 code lives in a custom hook alongside its component: `useResourceGauge.ts` next to `ResourceGauge.tsx`
- D3 manipulates a `<svg ref>` directly — React only renders the container `<svg>`
- Transitions use `d3.transition().duration(400).ease(d3.easeCubicOut)`
- Color scales map to SCSS design tokens (`--color-nominal`, `--color-warning`, `--color-critical`)
- Axes use `--color-text-muted` and `--font-data`

### Framer Motion Usage

Framer Motion handles **component-level** enter/exit and layout transitions.

| Usage | Implementation |
|-------|---------------|
| Page transitions | `<AnimatePresence>` on `<Routes>` — fade + slight Y shift |
| Alert / event entry | `initial={{ opacity: 0, y: -8 }}` → `animate={{ opacity: 1, y: 0 }}` |
| Module tile status change | `layout` prop — smooth reorder in grid |
| Crew card mount | Staggered children via `variants` + `staggerChildren: 0.04` |
| Modal/drawer | `AnimatePresence` + scale from 0.96 → 1 + opacity |

### Landing Page Animations

The landing page is the one place that leans into cinematic motion:

| Element | Technique |
|---------|-----------|
| Star field | `<canvas>` particle system — 200 stars, parallax on mouse move |
| Station name | Framer Motion letter-by-letter stagger reveal |
| System readouts | Counting-up number animation (D3 `tween` or CSS counter) |
| CTA button | Subtle glow pulse (CSS `@keyframes`) on idle |
| Background grid | CSS `repeating-linear-gradient` scan-line overlay |

### Timing Rules

| Context | Max duration |
|---------|-------------|
| Interactive elements (hover, focus) | 150ms |
| Data transitions (D3 arc, bar) | 400ms |
| Page transitions (enter/exit) | 300ms |
| Landing page (narrative) | 600ms per beat |
| Critical pulse | 1.5s infinite cycle |

### Status Animations

- Critical status: `pulse-critical` keyframe — subtle red glow pulse (1.5s infinite)
- Alert entry: Framer Motion fade-in + translate-y −8px → 0 (150ms)
- Resource dropping below threshold: arc color transitions through D3 color scale

---

## Component Patterns

| Pattern | Structure |
|---------|-----------|
| Status badge | `<span class="status status--{state}">{STATE}</span>` |
| Resource bar | fill % + `text--reading` value + trend arrow (↑↓→) |
| Crew card | avatar circle + name (`text--base`) + role (`text--label`) + assignment + health bar |
| Module tile | icon + name + status badge + mini resource summary |
| Data readout | `text--label` above + `text--reading` below |

---

## Accessibility

- Keyboard navigable
- Color not the only indicator of status — icons + labels always accompany color
- Screen reader labels on all interactive elements
- Minimum contrast ratio: 4.5:1 for all text on backgrounds

---

## Open Questions

- [x] Dark theme — **space aesthetic, locked above**
- [x] Alert system — **toast notifications (Ant Design message/notification API) — ephemeral, non-blocking**
- [x] Is there a narrative / story layer or pure simulation? — **Pure simulation — no story, indefinite management loop**
- [x] Mobile support — **desktop-only for v1, revisit post-v1**
