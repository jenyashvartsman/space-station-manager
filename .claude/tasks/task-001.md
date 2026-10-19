# Task 001 — Monorepo Init & Tooling

## Objective

Bootstrap the Nx monorepo from scratch: initialize the workspace, create the three projects (`client`, `server`, `libs/db`), install all runtime and dev dependencies, and configure Prettier + ESLint so every subsequent task starts from a clean, linted, formatted baseline.

## Context

- Read `.claude/docs/architecture.md` — stack decisions, folder layout, Prettier/ESLint config
- Read `.claude/docs/frontend.md` — client stack and deps
- Read `.claude/docs/backend.md` — server stack and deps
- Read `.claude/docs/database.md` — DB/ORM deps

## Scope

| Action | File |
|--------|------|
| Create | `package.json` — root, all deps listed |
| Create | `nx.json` — workspace config, default targets |
| Create | `tsconfig.base.json` — shared TS base, path aliases |
| Create | `.prettierrc` — formatting rules |
| Create | `eslint.config.js` — root flat config |
| Create | `.gitignore` |
| Create | `apps/client/` — Nx Vite + React project scaffold |
| Create | `apps/client/eslint.config.js` — extends root, adds React rules |
| Create | `apps/client/project.json` — Nx targets: serve, build, test, lint |
| Create | `apps/server/` — Nx Node + Express project scaffold |
| Create | `apps/server/eslint.config.js` — extends root, TypeScript only |
| Create | `apps/server/project.json` — Nx targets: serve, build, test, lint |
| Create | `libs/db/` — Nx library scaffold |
| Create | `libs/db/project.json` — Nx targets: lint (no build target yet) |

## Dependencies to Install

### Root devDependencies
- `nx`, `@nx/vite`, `@nx/node`, `@nx/js`, `@nx/eslint`
- `typescript`
- `prettier`
- `eslint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`
- `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-import`
- `vitest`, `@vitest/coverage-v8`

### Client dependencies
- `react`, `react-dom`, `react-router-dom`
- `antd`, `@ant-design/icons`
- `zustand`
- `d3` + `@types/d3`
- `framer-motion`
- `sass`

### Server dependencies
- `express`, `@types/express`
- `cors`, `@types/cors`
- `dotenv`
- `zod`

### DB dependencies (in libs/db)
- `drizzle-orm`, `drizzle-kit`
- `pg`, `@types/pg`

## Acceptance Criteria

- [ ] `nx serve client` starts Vite dev server at `localhost:5173` with no errors
- [ ] `nx serve server` starts Express at `localhost:3000` with no errors
- [ ] `nx run-many --target=lint` passes with zero errors on the empty scaffold
- [ ] `nx run-many --target=test` passes (no test files yet — Vitest should exit 0)
- [ ] `nx run-many --target=build` completes for client and server
- [ ] `prettier --check .` exits 0
- [ ] `tsconfig.base.json` path alias `@space-station/db` resolves to `libs/db/src`

## Dependencies
None — this is the first task.

## Notes
_Fill in after execution._
