<!--
Sync Impact Report
Version change: 1.0.0 → 1.1.0
Modified principles:
- V. Testable Incremental Delivery and Release Control — clarified that codebase exploration/fixes must use MCP CodeGraph first when code is involved.
Added sections:
- None
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md updated with CodeGraph-first constitution gate
- ✅ .specify/templates/tasks-template.md updated with CodeGraph exploration/fix tasks
- ✅ .specify/templates/spec-template.md reviewed; no implementation-tooling change required
- ✅ .specify/templates/checklist-template.md reviewed; generated checklists may include CodeGraph items when requested
Follow-up TODOs:
- Commit release changes before any preview/production deployment; tag only when promoting beyond development.
-->
# CHUNKS Mirror / Offline Live Room Constitution

## Core Principles

### I. Domain-Led Live Learning Core
Every change MUST preserve the CHUNKS Mirror loop: Admin prepares Resource and CCI standards, Teacher opens a Room and Sentence Window, Learner responds Red / Yellow / Green, and progress is computed from the captured response. Features MUST name the affected role, room state, round state, and learner eligibility rule. MVP scope MUST keep assigned mode and simple scoring shippable before optional modes.

### II. Supabase-First Durable Realtime State
Supabase Postgres MUST be the system of record for rooms, memberships, rounds, responses, scoring snapshots, and progress summaries. Realtime UI updates MUST be derived from durable state changes, not from client-only memory. Row Level Security and role-aware access rules MUST be planned before production data is used.

### III. Learner-Safe UX and Accessibility
Learners MUST always see whether they are waiting, assigned, observing, captured, already responded, or blocked by a closed round. Disabled response buttons MUST explain why they are unavailable. Critical controls MUST meet keyboard, focus, contrast, and 44px touch-target expectations. Batch or destructive Admin actions MUST require confirmation.

### IV. Dynamic Scoring and Historical Auditability
Scoring coefficients MUST NOT be hard-coded into irreversible history. Responses MUST store snapshots for learner performance mapping, CCI Standard X, CVR Ω, formula version, scoring mode, and reflection time inputs. Existing response history MUST remain explainable after future scoring settings change.

### V. Testable Incremental Delivery and Release Control
Work MUST be sliced by independently testable user stories. Critical live-room behavior, scoring math, authorization, and realtime state transitions MUST have tests or documented manual validation before release. Any production deployment MUST have a prior commit, a release tag when applicable, preview or canary validation, rollback instructions, restore-path verification for hosting/functions, and a post-deploy verification checklist.

## Product and Technical Constraints

- The active design language MUST follow `DESIGN.md`. Supported options are Theme 1 calm classroom console and Theme 2 Bauhaus classroom poster; theme changes MUST remain centralized in tokens/reusable primitives and preserve learner-safe accessibility.
- MVP frontend scope is a responsive web app for Admin, Teacher Host, and Learner screens.
- The phrase "Offline Live Room" means an in-person classroom live session for MVP; network-offline operation is out of scope unless a future spec explicitly adds offline persistence and sync.
- Learner access MUST support share links and room-code fallback with Supabase Anonymous Auth.
- The MVP response rule is one tracked Response per Round / Sentence Window.
- Admin resource batch actions require explicit confirmation and visible completion/failure feedback.
- Production data changes MUST be delivered via reviewed migrations, not ad-hoc console edits.

## Development Workflow and Quality Gates

1. Start each feature from a Spec Kit `spec.md` with prioritized, independently testable stories.
2. Complete `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`, and `tasks.md` before implementation begins.
3. Run the Constitution Check before design and again after design artifacts are generated.
4. When a task requires reading, validating, or changing existing code, agents MUST use MCP CodeGraph first to explore the relevant symbols, call paths, and blast radius before relying on manual grep/read loops. If CodeGraph is not initialized or indexed, initialize/index it for the repository before implementation; if unavailable, document the exception and fallback in the plan or task notes.
5. When CodeGraph exposes a likely defect, missing test coverage, or affected dependency path during implementation, the fix plan MUST either address it in the current slice or record a follow-up task with explicit rationale.
6. Implement MVP story first, validate independently, then add later stories incrementally.
7. Before production deploy: initialize or verify git, commit changes, tag releases when applicable, validate preview/canary, document rollback, verify restore path, and run post-deploy checks.
8. If a rule must be violated, document the violation and simpler alternatives in the plan's Complexity Tracking section before implementation.

## Governance

This constitution supersedes informal project habits for CHUNKS Mirror / Offline Live Room work. Amendments require an updated Sync Impact Report, semantic version bump, and review of dependent Spec Kit templates. MAJOR changes redefine or remove principles, MINOR changes add principles or material governance, and PATCH changes clarify wording without changing obligations. All specs, plans, tasks, and release workflows MUST be checked for compliance before implementation and before production deployment.

**Version**: 1.1.0 | **Ratified**: 2026-07-03 | **Last Amended**: 2026-07-04
