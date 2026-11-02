Customize the AI Factory for this project — modify docs, rules, autonomy grants, or commands.

## Step 1 — Understand the request

Read `$ARGUMENTS`. Identify which category of change is being requested:

| Category | Examples |
|----------|---------|
| **doc** | "update architecture.md", "add a security doc", "remove the database doc" |
| **rule** | "increase the loop limit to 5", "change the naming rule", "update the execution cycle" |
| **autonomy** | "allow the AI to run deploy commands", "remove docker from autonomy", "add npm install" |
| **command** | "add a deploy command", "update how next-task works", "add a review-pr command" |

If `$ARGUMENTS` is blank or the category is unclear, ask:

> "What would you like to customize?
> - **doc** — add, remove, or update a factory doc (architecture, app, ux, etc.)
> - **rule** — change a factory rule (loop limit, naming convention, execution cycle)
> - **autonomy** — update what the AI can do without asking
> - **command** — add or update a slash command"

---

## Structure Integrity Rules

Before creating or renaming any file, read `.claude/FACTORY.md` — specifically the **File Organization** section. Enforce these rules on every change:

| File type | Must live in | Naming convention |
|-----------|-------------|-------------------|
| Docs | `.claude/docs/` | `kebab-case.md` — one concern per file |
| Tasks | `.claude/tasks/` | `task-NNN.md` — number only, zero-padded 3 digits |
| Commands | `.claude/commands/` | `verb-noun.md` — action-first, kebab-case |
| Logs | `.claude/logs/factory.log` only | append-only, never create new log files |

**Root rule:** Only `CLAUDE.md` and `status.md` live in the project root. Refuse any request to create other files there.

If a proposed path or name violates these rules, say so and suggest the correct location/name before proceeding.

---

## Category: DOC

### Update an existing doc

1. Read `CLAUDE.md` to find the file path for the named doc
2. Read the doc file
3. Show its current content, then ask: "Which sections do you want to change?"
4. Apply only the requested changes
5. If the doc's purpose or domain label changed, update the Active Docs table in `CLAUDE.md`

### Add a new doc

1. Ask:
   - What is the doc's domain label? *(e.g., "Security", "Deployment", "Testing")*
   - What should it contain? *(describe sections or paste content)*
2. Derive the filename: `kebab-case.md` matching the domain label, placed in `.claude/docs/`
3. Write the new doc file with the described content and an `## Open Questions` section at the end
4. **Propagate — 3 files must be updated:**
   - `CLAUDE.md` — add a row to the Active Docs table
   - `.claude/tasks/task-TEMPLATE.md` — add a `- [ ] Read .claude/docs/<name>.md` line to the Context checklist with a note about when it applies
   - `.claude/FACTORY.md` — add the file to the Directory Tree under `docs/`

### Remove a doc

1. Read the doc to show its content
2. Confirm: "About to remove `.claude/docs/<name>.md` and unlink it everywhere. Confirm? (yes / no)"
3. On yes:
   - Delete the doc file
   - Remove its row from the Active Docs table in `CLAUDE.md`
   - Remove its line from the Context checklist in `.claude/tasks/task-TEMPLATE.md`
   - Remove its entry from the Directory Tree in `.claude/FACTORY.md`
4. Report what was removed

---

## Category: RULE

Read `CLAUDE.md` before making any change. Identify the exact section to modify. Apply only the requested change. Never rewrite unrelated sections.

### Loop limit

Find the loop limit number in the Task Execution Cycle section of `CLAUDE.md`. Replace only that number. Also update the same number in `.claude/FACTORY.md` Task Execution Cycle section.

> Example: "increase the loop limit to 5" → change "3 times" to "5 times" in both files

### Naming / domain rule

The Core Development Rule section in `CLAUDE.md` lists the domain entity names and the no-generic-names constraint. Update the entity list or the rule text as requested.

### Task execution cycle steps

The Task Execution Cycle section in `CLAUDE.md` lists the numbered steps (write code → run tests → fix → build). Add, remove, or reorder steps as requested. Keep the loop limit note intact. Mirror the change in `.claude/FACTORY.md`.

### Factory log format

The Factory Log Rule section in `CLAUDE.md` defines the log line format. Update only the format string. Mirror the change in `.claude/FACTORY.md`.

---

## Category: AUTONOMY

Read the Factory Autonomy section of `CLAUDE.md`. It has two parts: commands the AI **may** run without asking, and things that **require approval**.

### Add an autonomy grant

Ask:
1. What is the exact command? *(paste the full CLI invocation)*
2. What section does it belong to? *(Test & Build / Docker / other — or suggest creating a new subsection)*
3. What is the "when to use" note for the table?

Add the row to the correct table in `CLAUDE.md`. If a new subsection is needed, create it.

### Remove an autonomy grant

Show the current autonomy tables. Ask which row to remove. Remove it. If removing the last row of a subsection, remove the subsection heading too.

### Move a command to "requires approval"

Remove it from the autonomy table and add it as a bullet under "Requires Developer Approval".

---

## Category: COMMAND

### Add a new command

1. Derive the filename from the requested name: `verb-noun.md` in `.claude/commands/`. If the name doesn't follow this convention, suggest the correct form before proceeding.
2. Ask:
   - What should it do? *(describe the workflow in plain language)*
   - What files does it read?
   - What files does it write or modify?
   - Does it require developer confirmation before taking action? *(yes / no)*
3. Write `.claude/commands/<verb-noun>.md` with a clear, step-by-step instruction set following the same style as the existing commands.
4. Add the new command to the Directory Tree in `.claude/FACTORY.md` under `commands/`
5. If the command is relevant to the task execution cycle (e.g., a lint or deploy step that should run after build), ask: "Should this be referenced in the Task Execution Cycle in `CLAUDE.md`?" and update if yes.

### Update an existing command

List the files in `.claude/commands/`. Read the specified command file. Show its current content. Ask which parts to change. Apply only those changes.

---

## Step 2 — Apply changes

Make all required edits. For any change with downstream effects, apply all of them:

| If you change... | Also update... |
|-----------------|----------------|
| Add a doc | `CLAUDE.md` Active Docs + `task-TEMPLATE.md` Context checklist + `FACTORY.md` Directory Tree |
| Remove a doc | `CLAUDE.md` Active Docs + `task-TEMPLATE.md` Context checklist + `FACTORY.md` Directory Tree |
| Add a command | `FACTORY.md` Directory Tree |
| Change loop limit | `CLAUDE.md` Task Execution Cycle + `FACTORY.md` Task Execution Cycle |
| Change execution cycle steps | `CLAUDE.md` + `FACTORY.md` |
| Add autonomy grant | `CLAUDE.md` Factory Autonomy table |

---

## Step 3 — Report

List every file changed with a one-line description of what was modified:

> "Factory updated:
> - `CLAUDE.md` — added security.md to Active Docs table
> - `.claude/docs/security.md` — created with 4 sections
> - `.claude/tasks/task-TEMPLATE.md` — added security.md to Context checklist
> - `.claude/FACTORY.md` — added security.md to Directory Tree"
