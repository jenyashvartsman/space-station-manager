# Frontend — Space Station Manager

> **Status:** Decided — stack locked.

---

## Domain-Focused Rule

All frontend code is organized and named around space station domain concepts.

| Rule | Example |
|------|---------|
| Components named after domain entities | `StationOverview`, `ModuleTile`, `CrewCard`, `ResourceBar`, `MissionList` |
| Hooks named after domain actions | `useStationState`, `useCrewAssignment`, `useMissionTimer` |
| Stores scoped to domain slices | `useStationStore`, `useCrewStore`, `useMissionStore` |
| No generic component names | ~~`DataCard`~~, ~~`ItemList`~~, ~~`StatusWidget`~~ |
| Business logic stays out of components | Components render; domain logic lives in hooks or services |

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 |
| Language | TypeScript |
| Build tool | Vite (via Nx `@nx/vite`) |
| Monorepo | Nx — `nx serve client`, `nx test client`, `nx build client` |
| UI library | Ant Design |
| Styling | SCSS + BEM (`block__element--modifier`) |
| State management | Zustand (one store per domain) |
| Data fetching | fetch + custom hooks (no extra lib unless needed) |
| Testing | Vitest + React Testing Library |

---

## Folder Structure

```
apps/client/src/
├── main.tsx
├── app/
│   ├── App.tsx              # Root component, providers
│   └── router.tsx           # React Router route definitions
│
├── domains/                 # One folder per domain — grows with the app
│   ├── station/
│   │   ├── components/
│   │   │   └── StationOverview/
│   │   │       ├── StationOverview.tsx
│   │   │       ├── StationOverview.module.scss
│   │   │       └── StationOverview.test.tsx
│   │   ├── hooks/
│   │   │   └── useStationState.ts
│   │   ├── services/
│   │   │   └── station.service.ts   # API calls for this domain
│   │   ├── store/
│   │   │   └── useStationStore.ts   # Zustand slice
│   │   └── types/
│   │       └── station.types.ts
│   ├── module/
│   │   ├── components/
│   │   │   ├── ModuleTile/
│   │   │   └── ModuleDetail/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── types/
│   ├── crew/
│   ├── resource/
│   ├── mission/
│   └── event-log/
│
├── pages/                   # Route-level pages — compose domain components
│   ├── StationDashboard/
│   ├── ModuleDetail/
│   ├── CrewRoster/
│   ├── MissionControl/
│   └── ResourcePanel/
│
└── shared/                  # Only truly cross-domain primitives
    ├── components/
    │   └── StatusBadge/     # Used by station, module, crew — lives here
    └── styles/
        ├── _variables.scss  # Design tokens (colors, spacing, etc.)
        ├── _mixins.scss
        └── global.scss
```

**Rules:**
- Domain folders are the unit of growth — add a new domain, add a new folder
- `pages/` only compose; no business logic
- `shared/` only for components used by 3+ domains; otherwise keep in the domain
- Each component folder contains: `.tsx`, `.module.scss`, `.test.tsx`

---

## Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Component files | `PascalCase.tsx` | `StationOverview.tsx` |
| SCSS files | `PascalCase.module.scss` | `StationOverview.module.scss` |
| Hook files | `camelCase.ts` | `useStationState.ts` |
| Service files | `camelCase.service.ts` | `station.service.ts` |
| Store files | `camelCase.store.ts` or `usePascalStore.ts` | `useStationStore.ts` |
| Type files | `camelCase.types.ts` | `station.types.ts` |
| Test files | co-located `*.test.tsx` | `StationOverview.test.tsx` |
| Exports | Named exports only (no default for utils/hooks/services) | |
| BEM | `block__element--modifier` in SCSS | `.station-overview__module-tile--offline` |

---

## Key Components (Planned)

- `StationOverview` — main dashboard grid
- `ModuleTile` — compact module status card
- `ResourceBar` — fill bar with trend indicator
- `CrewCard` — crew member summary
- `AlertBanner` — critical status notification
- `MissionItem` — single mission in the mission list

---

## Open Questions

- [ ] React Router vs TanStack Router?
- [ ] Real-time updates: polling interval or WebSocket?
