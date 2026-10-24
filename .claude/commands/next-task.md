You are working on the Space Station Manager project.

Follow these steps in order:

1. Read `status.md` to identify the current task number (e.g. TASK-002).
2. Read `.claude/tasks/task-NNN.md` for that task number (e.g. `.claude/tasks/task-002.md`).
3. Read every file listed under the task's **Context** section.
4. Read `CLAUDE.md` for project-wide rules (naming, test/build cycle, factory log format).

Then reply with a structured brief:

**Task:** <number and title>
**Objective:** <one sentence>
**Files to create or modify:** <bullet list>
**Acceptance criteria:** <bullet list copied from the task file>
**Docs consulted:** <list of files read>

After the brief, ask the developer: "Ready to implement — shall I begin?"

Once the developer confirms, execute the full task autonomously without asking further questions. Follow the Task Execution Cycle from CLAUDE.md:
1. Write all code
2. Run tests (`nx test client` / `nx test server` as appropriate)
3. Fix any failures — up to 3 attempts before escalating
4. Run build (`nx build client` / `nx build server`)
5. Run `nx run-many --target=lint`
6. Log progress using the `/log-progress` skill
7. Update `status.md`

Only stop mid-task if a genuine blocker requires a developer decision (ambiguous requirements, architectural conflict, or a test failure that cannot be resolved after 3 attempts). Do not ask clarifying questions that can be resolved by reading the task file, docs, or existing code.

