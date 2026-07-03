---
name: "Spec Kit Provider"
description: "Orchestrates GitHub Spec Kit step-by-step: initializes projects if needed, routes feature/change/task requests to the right Speckit skills, and enforces release-control gates."
globs:
  - ".specify/**"
  - "specs/**"
  - "**/spec.md"
  - "**/plan.md"
  - "**/tasks.md"
  - "**/constitution.md"
alwaysAllow:
  - "Bash"
  - "Read"
  - "Grep"
  - "Glob"
  - "LS"
---

# Spec Kit Provider

You are the workflow provider for GitHub Spec Kit inside this repository. Your job is to route the user's request through the correct Spec Kit skill sequence, step by step, without making the user remember individual skill names.

## Core responsibilities

1. **Detect project state first**
   - Check whether `.specify/` exists.
   - Check whether `.agents/skills/speckit-*` exists.
   - Check whether `.specify/memory/constitution.md` exists and whether it still contains template placeholders such as `[PRINCIPLE_1_NAME]`.
   - Check whether feature folders exist under `specs/`.

2. **Initialize Spec Kit if missing**
   - If `specify` is not available, install the official CLI pinned to the currently approved release:
     ```powershell
     uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v0.12.4
     ```
   - If `.specify/` or `.agents/skills/speckit-*` are missing, initialize the current directory:
     ```powershell
     specify init . --integration codex --integration-options="--skills" --script ps --force --ignore-agent-tools
     ```
   - After initialization, re-list `.agents/skills/` and confirm the expected Speckit skills are present.

3. **Route by user intent**
   - For a new product/project baseline: run `speckit-constitution` first.
   - For a new feature/change request: run the sequence:
     1. `speckit-constitution` if constitution is missing or templated
     2. `speckit-specify`
     3. `speckit-clarify` unless the user explicitly says to skip clarification
     4. `speckit-plan`
     5. `speckit-tasks`
     6. `speckit-analyze`
   - For implementation requests: run `speckit-analyze` first, then `speckit-implement`.
   - For task/spec edits: inspect which artifact changed and route:
     - requirements changed → `speckit-specify` or `speckit-clarify`, then `speckit-plan`, `speckit-tasks`, `speckit-analyze`
     - technical approach changed → `speckit-plan`, then `speckit-tasks`, `speckit-analyze`
     - task list changed → `speckit-tasks` if regeneration is needed, then `speckit-analyze`
     - implementation drift or partial completion → `speckit-converge`
   - For converting tasks to GitHub issues: use `speckit-taskstoissues` only when GitHub access is configured and the user requests issue creation.

4. **How to invoke downstream Speckit skills in Craft Agent**
   - Before following any downstream skill, read its local `SKILL.md` from `.agents/skills/<skill-slug>/SKILL.md`.
   - Then follow that skill's instructions exactly.
   - Use these local skill slugs:
     - `speckit-constitution`
     - `speckit-specify`
     - `speckit-clarify`
     - `speckit-plan`
     - `speckit-tasks`
     - `speckit-analyze`
     - `speckit-implement`
     - `speckit-converge`
     - `speckit-checklist`
     - `speckit-taskstoissues`

5. **Step-by-step operating mode**
   - Show a short progress update before each phase.
   - Do not jump to implementation unless the user explicitly asks to implement/build/fix/apply.
   - After generating `tasks.md`, stop and summarize the next implementation command unless the user already requested implementation.
   - If multiple features exist, identify the active/current feature before editing.

6. **Lucy release-control policy**
   For any production deploy, web app release, hosting, functions, or deployment work, enforce:
   - commit before deploy
   - tag before production deploy when applicable
   - preview/canary validation before production
   - rollback instructions in the plan/tasks
   - restore-path verification for hosting/functions
   - post-deploy verification checklist

7. **Safety and hygiene**
   - Do not overwrite user-authored specs without reading them first.
   - Keep Spec Kit tooling updates separate from feature artifact changes.
   - Prefer one active spec workflow at a time unless the user asks for parallel changes.
   - If the repo is not under git, warn that release-control history is weaker and suggest initializing git before implementation/deploy work.

## Common user commands

### Initialize only
User says: "setup Spec Kit", "install provider", "init workflow".

Action:
1. Ensure `specify` CLI exists.
2. Ensure `.specify/` and `.agents/skills/speckit-*` exist.
3. Report installed skills and next command examples.

### Start a new change
User says: "build/add/create/plan feature X".

Action:
1. Ensure initialized.
2. Ensure constitution.
3. Run specify → clarify → plan → tasks → analyze.
4. Stop before implementation unless explicitly requested.

### Continue current change
User says: "continue", "next step", "resume workflow".

Action:
1. Inspect `.specify/`, `specs/`, and existing feature artifacts.
2. Identify the first missing or stale artifact.
3. Run the corresponding downstream Speckit skill.

### Implement current change
User says: "implement", "apply", "build it", "fix according to tasks".

Action:
1. Ensure `tasks.md` exists.
2. Run analyze.
3. Run implement.
4. Run tests/checks requested by tasks.
5. Summarize completed tasks and remaining risks.

### Change an existing task/spec
User says: "change task", "update task", "modify requirement", "adjust plan".

Action:
1. Read current artifacts.
2. Decide the smallest upstream artifact that needs revision.
3. Re-run downstream artifacts to keep spec/plan/tasks consistent.
4. Run analyze at the end.
