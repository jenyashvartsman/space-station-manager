# AI Factory — Space Station Manager

## What Is the AI Factory Method?
A structured way to build software with AI assistance:
- Docs keep the AI and developer on the same context at all times
- Commands are generated from the stack — real commands, not placeholders
- Tasks are atomic, testable units — no task starts until the previous is verified
- Logs create a traceable history of every factory order

---

## File Organization

### Directory Tree

```
<project-root>/
├── CLAUDE.md                    ← AI context file — auto-loaded every session
├── status.md                    ← current project state dashboard
└── .claude/
    ├── FACTORY.md               ← this file; factory process and structure reference
    ├── docs/                    ← living design documents (read before coding)
    │   ├── app.md               ← product vision — read first
    │   ├── architecture.md      ← stack and infrastructure decisions
    │   ├── ux.md                ← design language, screens, libraries
    │   ├── frontend.md          ← frontend conventions and folder structure
    │   ├── backend.md           ← backend conventions and layer architecture
    │   └── database.md          ← schema, migrations, delete strategy
    ├── tasks/                   ← numbered task files — one file per unit of work
    │   ├── task-TEMPLATE.md     ← blank schema; copy for every new task
    │   └── task-NNN.md          ← NNN = zero-padded 3-digit number (001, 002, ...)
    ├── commands/                ← slash command prompts — auto-discovered by Claude Code
    │   ├── next-task.md         ← brief + execute the current task
    │   ├── log-progress.md      ← append factory.log + advance status.md
    │   ├── manage-tasks.md      ← add / delete / modify tasks
    │   ├── customize-factory.md ← modify docs, rules, autonomy, commands
    │   └── extract-template.md  ← generate FACTORY-TEMPLATE.md at project end
    └── logs/
        └── factory.log          ← append-only order log
```

### Naming Conventions

| Location | Convention | Examples |
|----------|-----------|---------|
| `docs/` | `kebab-case.md` — one concern per file | `security.md`, `deployment.md` |
| `tasks/` | `task-NNN.md` — number only, zero-padded 3 digits; title lives inside the file | `task-032.md` |
| `commands/` | `verb-noun.md` — action-first, kebab-case | `run-tests.md`, `review-pr.md` |
| `logs/` | `factory.log` only — never create additional log files | — |

### Rules for Adding New Files

**Docs**
- New docs go in `.claude/docs/`
- Register in `CLAUDE.md` Active Docs table
- Add to `.claude/tasks/task-TEMPLATE.md` Context checklist with a note on when it applies
- One concern per file — do not merge unrelated concerns into one doc

**Tasks**
- New tasks go in `.claude/tasks/`
- File name: `task-NNN.md` where NNN is the next sequential number
- Register in `status.md` Pending Tasks table
- Never use subdirectories — the status.md table is the organizational index

**Commands**
- New commands go in `.claude/commands/`
- Auto-discovered by Claude Code — no registration required
- Each command file does one thing and does it completely

**Logs**
- All log entries go in `.claude/logs/factory.log`
- Append-only — never edit existing lines
- No additional log files

**Root**
- Only `CLAUDE.md` and `status.md` live in the project root
- Never create new files in the root without developer approval

---

## Factory Phases

```
Phase 0 — Bootstrap    → scaffold dirs, stub files, factory.log
Phase 1 — App Design   → fill app.md (product vision, domain, features)
Phase 2 — Architecture → fill architecture.md (stack, monorepo, infra)
Phase 3 — UX           → fill ux.md (design language, components, screens)
Phase 4 — Frontend     → fill frontend.md (structure, conventions, state)
Phase 5 — Backend      → fill backend.md (structure, layers, services)
Phase 6 — Database     → fill database.md (schema, migrations, seeds)
Phase 7 — Discovery    → lock scope decisions, record in factory.log
Phase 8 — Commands     → generate context file + stack-specific commands
Phase 9 — Tasks        → generate numbered task list from completed docs
```

---

## Task Execution Cycle (mandatory for every task)

```
1. Read status.md                → identify the current task
2. Read .claude/tasks/task-NNN.md → load objective, scope, criteria
3. Read every doc in the task's Context section
4. Write all code
5. Run tests   — fix — run tests again — must be green
6. Run build   — must succeed
7. Run lint    — must pass
8. Run log-progress command — append factory.log + advance status.md
```

Loop limit: Stop after 3 failed fix attempts. Escalate — never loop silently.

---

## Factory Log Format

`.claude/logs/factory.log` is append-only:

```
[YYYY-MM-DD] TASK-NNN | STATUS: done    | <summary>
[YYYY-MM-DD] TASK-NNN | STATUS: skipped | <reason>
[YYYY-MM-DD] TASK-NNN | STATUS: blocked | <blocker>
```
