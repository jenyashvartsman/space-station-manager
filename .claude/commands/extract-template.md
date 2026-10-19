You are extracting a reusable AI Factory Template from this completed project.

Read the following files in order:
1. FACTORY.md
2. CLAUDE.md
3. .claude/logs/factory.log
4. .claude/docs/architecture.md
5. .claude/docs/ux.md
6. .claude/docs/frontend.md
7. .claude/docs/backend.md
8. .claude/docs/database.md
9. All files in .claude/tasks/

Then produce a single file called `FACTORY-TEMPLATE.md` in the project root.

The output must be a self-contained guide a developer can drop into any new project to run the AI Factory Method from scratch. It must be fully app-agnostic — no space station content.

Structure the output as follows:

---

# AI Factory Template

## What Is This?
One paragraph explaining the AI Factory Method.

## Factory File Structure
The exact folder/file structure to create, with purpose of each file.

## Phase 0 — Bootstrap
Step-by-step instructions to create the factory scaffold in a new project.
Include the exact content of:
- CLAUDE.md (generic version)
- FACTORY.md (generic version)
- status.md (generic version)
- task-TEMPLATE.md (copy as-is)
- factory.log initial entry format

## Phase 1 — Fill the Docs
Instructions for filling in each of the 5 doc files.
For each doc: what questions to answer, what decisions to lock, what TBDs are acceptable to defer.

## Phase 2 — Discovery Questions
The exact discovery questions to ask before writing tasks (extracted from factory.log FACTORY PROCESS NOTEs).
Explain what each answer affects.

## Phase 3 — Generate Tasks
Instructions for using /generate-tasks to produce the task list from the completed docs.

## Phase 4 — Execute Tasks
The full task execution cycle rule (extracted from CLAUDE.md).
The loop limit rule.

## Phase 5 — Extract Template
Instructions for running /extract-template at project end to produce the next factory template.

## Process Notes Extracted from This Factory
List all FACTORY PROCESS NOTEs from factory.log, verbatim, as reusable lessons.

---

After writing the file, report: how many tasks were completed in this factory, how many process notes were captured, and the file path.
