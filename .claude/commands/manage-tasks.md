Manage tasks in the factory task list. Handles adding new tasks, deleting existing ones, and modifying task content.

## Read arguments

Check `$ARGUMENTS` to determine the operation:

| Arguments | Operation |
|-----------|-----------|
| `add [title]` | Add a new task |
| `delete NNN` | Delete task NNN |
| `modify NNN` | Modify task NNN |
| *(blank)* | Ask the developer which operation they want |

If arguments are blank or ambiguous, ask: "What would you like to do? (add / delete NNN / modify NNN)"

---

## ADD a task

### Step 1 — Determine task number

Read `status.md`. Find the highest task number across both the Completed Tasks and Pending Tasks tables. The new task number is that number + 1, zero-padded to 3 digits (e.g. if the highest is 031, the new task is 032).

### Step 2 — Gather task details

If a title was provided in `$ARGUMENTS`, use it. Otherwise ask for it.

Then ask (all at once as a numbered list):

1. **Objective** — What needs to be built or changed? One clear paragraph.
2. **Relevant docs** — Which docs does this task need? *(architecture / frontend / backend / database / ux — or "all")*
3. **Scope** — Which files will be created or modified? List them with action (Create / Modify).
4. **Acceptance criteria** — 2–4 binary, testable criteria. *(Unit tests pass and Build succeeds are always included — list any additional ones.)*
5. **Dependencies** — Which tasks must be complete before this one? *(task numbers, or "none")*
6. **Where to insert** — Add at the end of Pending Tasks, or before/after a specific pending task? *(e.g., "after task 034", "at the end")*

### Step 3 — Write the task file

Create `.claude/tasks/task-NNN.md`:

```
# Task NNN — {title}

## Objective
{objective}

## Context
_Which docs are relevant to this task._

{checked_items_for_each_relevant_doc}
- [ ] Read `.claude/docs/architecture.md` — if this task touches structure or stack
- [ ] Read `.claude/docs/frontend.md` — if this task touches client code
- [ ] Read `.claude/docs/backend.md` — if this task touches server code
- [ ] Read `.claude/docs/database.md` — if this task touches schema or queries
- [ ] Read `.claude/docs/ux.md` — if this task touches UI or interaction

## Scope
_What files will be created or modified._

| Action | File |
|--------|------|
{scope_rows}

## Acceptance Criteria

{additional_criteria}
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
{dependencies_or_none}

## Notes
_Fill in after execution: decisions made, issues encountered, anything deferred._
```

### Step 4 — Update status.md

Add the new task to the Pending Tasks table at the position the developer specified. Do not modify anything else in `status.md`.

### Step 5 — Report

> "Task NNN — {title} added.
> File: `.claude/tasks/task-NNN.md`
> Position in queue: {position description}"

---

## DELETE a task

### Step 1 — Read the task

Read `.claude/tasks/task-NNN.md`. Show a one-line summary of its objective.

### Step 2 — Safety checks

- **Completed task?** Check `status.md` Completed Tasks table. If the task is already completed, refuse: "Task NNN is already completed and logged — deleting completed tasks would break the factory log history. Only pending tasks can be deleted."
- **Current task?** If the task matches the Current Task in `status.md`, warn: "Task NNN is the current task. Deleting it will advance the current task. Confirm? (yes / no)"

### Step 3 — Confirm

Show: "About to delete Task NNN — {title}. This cannot be undone. Confirm? (yes / no)"

On "no": stop. On "yes": proceed.

### Step 4 — Delete

1. Delete `.claude/tasks/task-NNN.md`
2. Remove the task's row from the Pending Tasks table in `status.md`
3. If the deleted task was the Current Task, update Current Task to the next pending task (or "_None_" if pending is now empty)
4. Update Last Note in `status.md`

### Step 5 — Report

> "Task NNN — {title} deleted.
> Removed from Pending Tasks. Factory log unchanged."

---

## MODIFY a task

### Step 1 — Read the task

Read `.claude/tasks/task-NNN.md`. Display its current content in full.

### Step 2 — Ask what to change

Ask: "Which section(s) do you want to update? (Objective / Context / Scope / Acceptance Criteria / Dependencies / Notes — or describe the change)"

### Step 3 — Apply changes

Make only the changes the developer described. Do not rewrite sections that were not mentioned.

If the title changes, also update the task row in `status.md` Pending Tasks to match the new title.

### Step 4 — Report

> "Task NNN updated. Changed: {list of sections modified}."
