Log the task that was just completed. Only run this after tests are green and the build passes.

## Step 1 — Append to factory.log

Add one line to `.claude/logs/factory.log`:

```
[YYYY-MM-DD] TASK-NNN | STATUS: done | <one-line summary of what was built or changed>
```

Use today's date. Keep the summary factual and specific (e.g. "libs/db built: 6 Drizzle schemas, connection, migration generated").

## Step 2 — Update status.md

Make these four changes and no others:

1. **Current Task** — change the task number and title to the next task.
2. **Completed Tasks table** — add a row for the task just finished.
3. **Pending Tasks table** — remove the row for the task just finished.
4. **Last Note** — replace the existing note with one sentence describing what was completed and confirming tests/build are green.

Do not modify any other files.
