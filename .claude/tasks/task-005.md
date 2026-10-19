# Task 005 — Backend Foundation

## Objective

Build the Express application foundation: entry point, app setup, shared middleware (error handler, request logger), and shared domain types. After this task `nx serve server` runs a healthy Express server with structured error responses and request logging.

## Context

- Read `.claude/docs/backend.md` — folder structure, middleware, shared types, error handling
- Read `.claude/docs/architecture.md` — server entry point conventions

## Scope

| Action | File |
|--------|------|
| Create | `apps/server/src/server.ts` — HTTP server, port binding |
| Create | `apps/server/src/app.ts` — Express app, middleware registration |
| Create | `apps/server/src/middleware/error.middleware.ts` |
| Create | `apps/server/src/middleware/logger.middleware.ts` |
| Create | `apps/server/src/shared/errors.ts` — domain error classes |
| Create | `apps/server/src/shared/types.ts` — response envelope types |
| Create | `apps/server/src/health.router.ts` — `GET /health` |

## Implementation Details

### server.ts
```ts
// Creates http.Server from app, listens on config.port
// Logs "Server running on port {port}"
```

### app.ts
```ts
// express(), json(), cors()
// register logger middleware
// register domain routers (health for now; domains added in later tasks)
// register error middleware LAST
```

### errors.ts
```ts
export class NotFoundError extends Error { status = 404; code = 'NOT_FOUND' }
export class ValidationError extends Error { status = 400; code = 'VALIDATION_ERROR' }
export class ConflictError extends Error { status = 409; code = 'CONFLICT' }
```

### types.ts
```ts
// ApiResponse<T> = { data: T } | { error: string; code: string }
```

### error.middleware.ts
- Catches all errors thrown from route handlers
- Returns `{ error: string, code: string }` with correct HTTP status
- Known errors (NotFoundError etc.) → use their status
- Unknown errors → 500 + log stack trace

### logger.middleware.ts
- Log format: `[METHOD] /path → status (Xms)`
- Uses `Date.now()` diff, no external logging lib

### health.router.ts
- `GET /health` → `{ status: 'ok', uptime: process.uptime() }`

## Unit Tests

- `error.middleware.test.ts` — test that NotFoundError → 404, unknown → 500
- `health.router.test.ts` — test `GET /health` returns 200 with `status: 'ok'`
- Use Supertest

## Acceptance Criteria

- [ ] `nx serve server` starts and logs the port
- [ ] `GET /health` returns `{ status: 'ok', uptime: <number> }` with 200
- [ ] Throwing `NotFoundError` in a route returns `{ error: ..., code: 'NOT_FOUND' }` with 404
- [ ] Unknown thrown error returns 500
- [ ] `nx test server` passes
- [ ] `nx build server` passes
- [ ] `nx run-many --target=lint` passes

## Dependencies

- Task 001 must be complete
- Task 002 must be complete (config.ts needed)

## Notes
_Fill in after execution._
