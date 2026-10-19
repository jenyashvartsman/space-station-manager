# Task 002 — Docker Dev Environment & Environment Config

## Objective

Set up the Docker Compose development environment (PostgreSQL only) and establish the `.env` pattern used by the server to connect to the database. After this task, `docker compose up` starts a healthy Postgres instance and the server can connect to it.

## Context

- Read `.claude/docs/architecture.md` — Docker topology, dev vs prod distinction
- Read `.claude/docs/database.md` — DB engine, connection details

## Scope

| Action | File |
|--------|------|
| Create | `docker/docker-compose.dev.yml` — PostgreSQL service only |
| Create | `.env.example` — committed template, no real secrets |
| Create | `.env` — gitignored, actual local values |
| Modify | `.gitignore` — ensure `.env` is ignored |
| Create | `apps/server/src/config.ts` — typed env loader using `dotenv` + `zod` |

## docker-compose.dev.yml Requirements

```yaml
services:
  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: space_station_dev
      POSTGRES_USER: space_station
      POSTGRES_PASSWORD: space_station_dev
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U space_station"]
      interval: 5s
      timeout: 5s
      retries: 5
volumes:
  pgdata:
```

## .env.example

```
DATABASE_URL=postgresql://space_station:space_station_dev@localhost:5432/space_station_dev
PORT=3000
NODE_ENV=development
```

## config.ts Requirements

- Use `dotenv` to load `.env`
- Use `zod` to parse and validate env vars
- Export a typed `config` object — never import `process.env` directly elsewhere

## Acceptance Criteria

- [ ] `docker compose -f docker/docker-compose.dev.yml up -d` starts Postgres without errors
- [ ] `docker compose -f docker/docker-compose.dev.yml ps` shows db as healthy
- [ ] `apps/server/src/config.ts` exports `config.databaseUrl`, `config.port`, `config.nodeEnv`
- [ ] Server imports `config` without `process.env` usage outside this file
- [ ] `.env` is gitignored; `.env.example` is committed
- [ ] `nx run-many --target=build` still passes
- [ ] `nx run-many --target=test` still passes

## Dependencies

- Task 001 must be complete

## Notes
_Fill in after execution._
