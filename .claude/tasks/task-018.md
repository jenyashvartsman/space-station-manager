# Task 018 — Routing & Lazy Loading

## Objective

Make the Landing page the default route (`/`) and convert all page imports to React lazy loading so the initial bundle only loads what is needed. After this task the app opens on the landing page, and each page's code is only fetched when the user navigates to it.

## Context

- Read `apps/client/src/app/AppRouter.tsx` (or equivalent router file) — current route definitions
- Read `.claude/docs/frontend.md` — page locations

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/app/AppRouter.tsx` (or equivalent) — default route + lazy imports |
| Modify | `apps/client/src/app/AppShell.tsx` (or equivalent, if Suspense boundary lives there) |

## Routing Changes

**Default route:** The root path `/` must render the `Landing` page. If there is currently an index redirect or a different default, replace it.

```
/            → Landing
/station     → StationDashboard
/crew        → CrewRoster
/modules     → ModuleManagement
/resources   → ResourcePanel
/missions    → MissionControl
/events      → EventLog
*            → redirect to /
```

**Lazy loading:** Convert all page-level imports from static to `React.lazy`:

```tsx
// Before
import Landing from '@/pages/Landing/Landing'

// After
const Landing          = lazy(() => import('@/pages/Landing/Landing'))
const StationDashboard = lazy(() => import('@/pages/StationDashboard/StationDashboard'))
const CrewRoster       = lazy(() => import('@/pages/CrewRoster/CrewRoster'))
const ModuleManagement = lazy(() => import('@/pages/ModuleManagement/ModuleManagement'))
const ResourcePanel    = lazy(() => import('@/pages/ResourcePanel/ResourcePanel'))
const MissionControl   = lazy(() => import('@/pages/MissionControl/MissionControl'))
const EventLog         = lazy(() => import('@/pages/EventLog/EventLog'))
```

**Suspense boundary:** Wrap the route outlet in `<Suspense>` with a fallback. Use a simple full-page centered spinner using the existing design tokens — not a third-party component:

```tsx
<Suspense fallback={<div className={styles.routeLoader}>Loading…</div>}>
  <Routes>…</Routes>
</Suspense>
```

`routeLoader` CSS: centered text, `--color-text-muted`, `--font-label`, full viewport height.

## Unit Tests

- Modify `apps/client/src/app/AppRouter.test.tsx` (or equivalent):
  - Navigating to `/` renders the Landing page
  - Navigating to `/station` renders the StationDashboard
  - Navigating to an unknown route redirects to `/`

If no router tests exist, create `apps/client/src/app/AppRouter.test.tsx` with the above cases.

## Acceptance Criteria

- [ ] Opening the app at `/` shows the Landing page
- [ ] All page imports use `React.lazy`
- [ ] A `Suspense` fallback is shown during route transitions
- [ ] Unknown routes redirect to `/`
- [ ] `nx test client` passes
- [ ] `nx build client` passes — Vite produces separate chunks per page

## Dependencies

- Task 009 (frontend foundation) must be complete
- Tasks 010–016 (all pages) must be complete

## Notes
_Fill in after execution._
