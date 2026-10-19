# Task 009 — Frontend Foundation

## Objective

Set up the React + Vite frontend: global styles and SCSS design tokens, Ant Design dark theme, React Router shell, the main layout component (sidebar navigation + top bar), and a domain service utility. After this task `nx serve client` shows the app shell with navigation — no real data yet.

## Context

- Read `.claude/docs/frontend.md` — folder structure, naming conventions, stack
- Read `.claude/docs/ux.md` — color palette, typography, SCSS tokens, spacing, layout
- Read `.claude/docs/architecture.md` — React Router, Zustand setup

## Scope

| Action | File |
|--------|------|
| Create | `apps/client/src/main.tsx` — React root, AntD ConfigProvider |
| Create | `apps/client/src/app/App.tsx` — providers, layout wrapper |
| Create | `apps/client/src/app/router.tsx` — React Router v6 route definitions |
| Create | `apps/client/src/shared/styles/_variables.scss` — all CSS custom properties |
| Create | `apps/client/src/shared/styles/_mixins.scss` — `respond-to` mixin |
| Create | `apps/client/src/shared/styles/_utilities.scss` — status, text, surface utilities |
| Create | `apps/client/src/shared/styles/global.scss` — reset + html/body base styles |
| Create | `apps/client/src/shared/theme/antd.theme.ts` — Ant Design token overrides |
| Create | `apps/client/src/shared/components/StationLayout/StationLayout.tsx` — sidebar + top bar shell |
| Create | `apps/client/src/shared/components/StationLayout/StationLayout.module.scss` |
| Create | `apps/client/src/shared/services/api.ts` — base fetch wrapper (base URL, error handling) |
| Create | `apps/client/src/pages/StationDashboard/StationDashboard.tsx` — placeholder |
| Create | `apps/client/src/pages/CrewRoster/CrewRoster.tsx` — placeholder |
| Create | `apps/client/src/pages/ModuleManagement/ModuleManagement.tsx` — placeholder |
| Create | `apps/client/src/pages/MissionControl/MissionControl.tsx` — placeholder |
| Create | `apps/client/src/pages/ResourcePanel/ResourcePanel.tsx` — placeholder |
| Create | `apps/client/src/pages/EventLog/EventLog.tsx` — placeholder |

## Layout Requirements

Sidebar navigation items:
- Dashboard (icon: `DashboardOutlined`) → `/`
- Crew (icon: `TeamOutlined`) → `/crew`
- Modules (icon: `AppstoreOutlined`) → `/modules`
- Missions (icon: `RocketOutlined`) → `/missions`
- Resources (icon: `ThunderboltOutlined`) → `/resources`
- Events (icon: `UnorderedListOutlined`) → `/events`

Top bar: station name (from local state placeholder "Kepler Station Alpha") + subtle scan-line CSS texture.

## Ant Design Theme

Apply the token overrides from `ux.md` exactly. Use `theme.darkAlgorithm`.

## SCSS Tokens

Implement all tokens from `ux.md`:
- Color palette (all `--color-*` vars)
- Typography (`--font-ui`, `--font-data`, all `--font-size-*`)
- Spacing scale (`--space-1` through `--space-16`)
- Breakpoints (`--bp-xl` through `--bp-xs`)

## api.ts (base fetch wrapper)

```ts
// baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
// stationFetch(path, options?) → parses JSON, throws on non-2xx
```

## Unit Tests

- `StationLayout.test.tsx` — renders sidebar and nav links
- `api.test.ts` — test that non-2xx response throws

## Acceptance Criteria

- [ ] `nx serve client` runs without errors
- [ ] App shell renders: sidebar with 6 nav items, top bar, content area
- [ ] Navigating to `/crew` renders the CrewRoster placeholder
- [ ] All `--color-*` CSS variables are defined on `:root`
- [ ] Ant Design components use the dark space theme
- [ ] Google Fonts loaded: Inter + Space Mono
- [ ] `nx test client` passes
- [ ] `nx build client` passes
- [ ] `nx run-many --target=lint` passes

## Dependencies

- Task 001 must be complete

## Notes
_Fill in after execution._
