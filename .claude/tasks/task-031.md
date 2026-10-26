# Task 031 — README

## Objective

Write the project README so that anyone who clones the repo immediately understands what the app is, how it looks, how to run it, and how the codebase is structured.

## Context

- Read `status.md` — completed tasks and project state
- Read `.claude/docs/architecture.md` — tech stack and monorepo layout
- Read `.claude/docs/app.md` — domain overview

## Scope

| Action | File |
|--------|------|
| Create | `README.md` (root of the workspace) |

## README Structure

```
# Space Station Manager

[One-line description — HUD-style space station management game]

## Screenshots / Preview
[Placeholder note: "Add screenshots after first deploy"]

## What It Is
2-3 sentences describing the app as a game-like operations console.

## Stack
Table: Frontend | Backend | Database | Animations | Charts | Infra

## Getting Started
### Prerequisites
### Install
### Run (dev)
### Run (with Docker DB)

## Project Structure
Monorepo layout — apps/client, apps/server, libs/db

## Domain Model
Brief bullet list: Station, Crew, Module, Resource, Mission, EventLog

## Available Scripts
nx serve client, nx serve server, nx test client, nx test server, nx build client

## Factory Method
One paragraph explaining the AI Factory Method (tasks, docs, log).
```

## Acceptance Criteria

- [ ] README.md exists at repo root
- [ ] Prerequisites and install steps are accurate
- [ ] Stack table is complete
- [ ] Domain model section present
- [ ] No placeholder content except screenshots note

## Dependencies

- All previous tasks complete

## Notes
_Fill in after execution._
