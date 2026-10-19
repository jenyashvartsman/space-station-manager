# Space Station Manager — Claude Context

This file is auto-loaded by Claude Code every session. It wires together all project documentation and factory rules.

## Project
A space station management application. Players/operators manage resources, crew, modules, and missions aboard a space station.

## AI Factory Method
This project is built using the AI Factory Method:
- Docs define the context and decisions
- Tasks are numbered, discrete, testable units of work
- A factory log tracks every order executed
- Local skills automate repetitive factory operations

## Active Docs
Always read these before making architectural or implementation decisions:

| Domain       | File                              |
|--------------|-----------------------------------|
| Architecture | [.claude/docs/architecture.md](.claude/docs/architecture.md) |
| UX           | [.claude/docs/ux.md](.claude/docs/ux.md) |
| Frontend     | [.claude/docs/frontend.md](.claude/docs/frontend.md) |
| Backend      | [.claude/docs/backend.md](.claude/docs/backend.md) |
| Database     | [.claude/docs/database.md](.claude/docs/database.md) |

## Core Development Rule — Domain-Focused Code

**Every piece of frontend and backend code must be domain-focused.**

- Name files, components, hooks, routes, services, and variables after space station domain concepts: `Station`, `Module`, `Crew`, `Resource`, `Mission`, `EventLog`
- No generic names: no `DataService`, `ItemList`, `handleSubmit`, `processData`
- No utility-first components that are not tied to a domain concept
- Business logic lives in domain services, not in route handlers or React components
- This rule applies from task 001 onwards and is never relaxed

---

## Task Rules
- Tasks live in `.claude/tasks/task-NNN.md`
- Execute one task at a time
- Do not start a task without reading its file
- Mark completion in `status.md` and log it in `.claude/logs/factory.log`

## Task Execution Cycle (mandatory for every task)
After writing code for any task, always follow this cycle before marking it done:

```
1. Write code
2. Run unit tests   →  nx test client  /  nx test server  /  nx run-many --target=test
3. Review output — fix any failures or issues
4. Run tests again — must be green
5. Run build        →  nx build client  /  nx build server  /  nx run-many --target=build
```

A task is **not complete** until tests are green AND the build passes. Do not log progress or advance `status.md` until the full cycle is finished.

**Loop limit:** If the fix → retest cycle repeats more than **3 times** without resolving, stop immediately. Do not attempt further fixes. Report to the developer:
- What the failure is
- What was tried
- Why it is not resolving

The developer decides how to proceed. Never loop silently.

## Factory Log Rule
Every completed task must produce a log entry in `.claude/logs/factory.log` using this format:
```
[YYYY-MM-DD] TASK-NNN | STATUS: done | <one-line summary>
```

## Local Skills
Custom slash commands live in `.claude/commands/`. They are auto-discovered by Claude Code.

## Status Dashboard
Current project state is always in [status.md](status.md).
