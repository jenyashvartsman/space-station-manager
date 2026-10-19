# AI Factory — Space Station Manager

## What Is the AI Factory Method?
A structured way to build software with AI assistance:
- **Docs** keep AI and human on the same context at all times
- **Tasks** are atomic, testable units — no task starts until the previous is verified
- **Logs** create a traceable history of every factory order
- **Skills** automate repetitive AI operations as local slash commands

---

## Factory Structure

```
space-station-manager/
├── CLAUDE.md              # Auto-loaded project context for Claude
├── FACTORY.md             # This file
├── status.md              # Current state dashboard
└── .claude/
    ├── docs/              # Living design documents
    │   ├── architecture.md
    │   ├── app.md
    │   ├── ux.md
    │   ├── frontend.md
    │   ├── backend.md
    │   └── database.md
    ├── tasks/             # Numbered task files (task-001.md … task-NNN.md)
    ├── commands/          # Local Claude Code slash commands
    │   ├── next-task.md
    │   └── log-progress.md
    └── logs/
        └── factory.log    # Append-only order log
```

---

## Factory Workflow

```
1. Read status.md           → know where we are
2. Open next task file      → understand the objective
3. Read relevant docs       → load context
4. Write code               → implement the task
5. Run unit tests           → nx run-many --target=test
6. Review & fix             → address any failures
7. Run tests again          → must be green
8. Run build                → nx run-many --target=build — must succeed
9. /log-progress            → append factory.log + advance status.md
10. Repeat
```

**Rule:** Step 9 is only reached when step 7 is green AND step 8 succeeds. Never log a task as done with failing tests or a broken build.

**Loop limit:** If the fix → retest cycle repeats more than 3 times without resolving, stop and escalate to the developer. Report: what failed, what was tried, why it is stuck. Developer decides the next action — never loop silently.

---

## Task File Schema

Each task in `.claude/tasks/task-NNN.md` follows this structure:

```markdown
# Task NNN — <Title>

## Objective
What needs to be built or changed.

## Context
Which docs are relevant. What depends on this task.

## Scope
| Action | File |
|--------|------|
| Create | path/to/file.ts |
| Modify | path/to/other.ts |

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Dependencies
- Task NNN-1 must be complete

## Notes
Any extra constraints or decisions recorded after execution.
```

---

## Factory Log Format

`.claude/logs/factory.log` is append-only:

```
[YYYY-MM-DD] TASK-NNN | STATUS: done    | <one-line summary>
[YYYY-MM-DD] TASK-NNN | STATUS: skipped | <reason>
[YYYY-MM-DD] TASK-NNN | STATUS: blocked | <blocker>
```

---

## Extracting a Factory Template

At the end of the project, the factory log + task files + docs form a complete template. To extract:
1. Copy `.claude/` directory
2. Strip app-specific content from docs (leave structure)
3. Reset `factory.log` to empty
4. Reset `status.md` to initial state
5. Rename tasks to `task-NNN-template.md`

---

## References

| File | Purpose |
|------|---------|
| [CLAUDE.md](CLAUDE.md) | Claude Code auto-context |
| [status.md](status.md) | Current project state |
| [.claude/docs/architecture.md](.claude/docs/architecture.md) | Architecture decisions |
| [.claude/docs/app.md](.claude/docs/app.md) | Application design |
| [.claude/docs/ux.md](.claude/docs/ux.md) | UX guidelines |
| [.claude/docs/frontend.md](.claude/docs/frontend.md) | Frontend stack |
| [.claude/docs/backend.md](.claude/docs/backend.md) | Backend stack |
| [.claude/docs/database.md](.claude/docs/database.md) | Database schema |
| [.claude/logs/factory.log](.claude/logs/factory.log) | Order history |
