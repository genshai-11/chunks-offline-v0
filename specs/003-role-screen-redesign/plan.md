# Implementation Plan: Role Screen Redesign — Live Response Logic Correction

**Branch**: `003-role-screen-redesign` | **Date**: 2026-07-04 | **Spec**: [spec.md](./spec.md)

**Input**: Active feature specification plus Lucy's 2026-07-04 17:42 GMT+7 correction: learner screen uses one active sentence identifier, four minimal color/icon responses, one captured response locks other learners, and teacher primary advance requires capture.

## Summary

This slice fixes the live-room response contract and UI logic inside the broader role-screen redesign. The teacher starts from a filtered session list of sentence resources. Each open round exposes one active sentence identifier to learners. Learners answer with a four-option response scale: red/yellow/green/purple mapping to default coefficients 0/1/2/3. Once any learner response is captured for the round, other learner screens stop showing response controls. The Teacher primary advance/next action is blocked while an open round has no captured response.

## Technical Context

**Language/Version**: TypeScript, React 19, Vite, Supabase SQL migrations

**Primary Dependencies**: React Testing Library, Vitest, Supabase JS, Tailwind/design primitives

**Storage**: Supabase Postgres tables: `practice_rooms`, `room_rounds`, `learner_responses`

**Testing**: `npm test`, `npm run build`; existing Supabase SQL validation scripts updated for local DB validation

**Target Platform**: Responsive web app for Teacher Host and Learner classroom flows

**Project Type**: Frontend web app with Supabase-backed durable realtime state

**Performance Goals**: Response lockout must update through existing realtime refresh path without adding polling loops.

**Constraints**: Preserve one-response-per-round semantics, scoring snapshots, formula-version history, role isolation, and no fake Settings route in this slice.

**Scale/Scope**: Supports large filtered session lists, e.g. 200 sentence resources, but only one active sentence code appears on learner live-room screen.

## Constitution Check

Generated plans MUST explicitly evaluate these CHUNKS constitution gates:

- **Domain-Led Live Learning Core**: PASS — roles, room state, round state, response capture, and progress loop are named and preserved.
- **Supabase-First Durable Realtime State**: PASS — captured response lock derives from `learner_responses` and `room_rounds.captured_learner_id`, not client memory.
- **Learner-Safe UX and Accessibility**: PASS WITH DESIGN NOTE — learner controls are icon/color minimal visually, but accessible names remain available for assistive technology.
- **Dynamic Scoring and Historical Auditability**: PASS — purple coefficient 3 is stored via `performance_y`; formula/scoring snapshots remain persisted.
- **Testable Incremental Delivery and Release Control**: PASS — tests/build required; no production deploy in this slice.
- **CodeGraph-First Codebase Work**: PASS — CodeGraph explored response types, learner state, scoring, and teacher advance blast radius before edits.

## Project Structure

### Documentation (this feature)

```text
specs/003-role-screen-redesign/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── live-room-response-contract.md
└── tasks.md
```

### Source Code

```text
frontend/
├── src/lib/domain/types.ts
├── src/lib/scoring/simpleScoring.ts
├── src/features/learner/responseService.ts
├── src/features/learner/LearnerRoomPage.tsx
├── src/features/learner/components/ResponseButtons.tsx
├── src/features/learner/components/LearnerStateBanner.tsx
├── src/features/live-room/progressService.ts
├── src/features/teacher/TeacherRoomPage.tsx
└── tests/
    ├── unit/scoring.test.ts
    └── integration/room-session-playback.test.tsx

supabase/
├── migrations/001_chunks_mirror_core.sql
├── migrations/007_extend_response_scale_to_purple.sql
└── tests/response_validation.sql
```

**Structure Decision**: Implement a focused live-room correction across domain types, scoring, learner UI, teacher controls, tests, and reviewed local Supabase migrations.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Phase Plan

1. Update response scale contract: TypeScript union, scoring map, schema constraints, SQL validation.
2. Update learner state loading so a captured response by any learner suppresses response controls for everyone else.
3. Redesign learner active response view to show only sentence code plus color/icon response controls.
4. Block teacher primary advance while an open round has no captured response.
5. Validate with unit/integration tests and build.

## Release Control

No preview or production deploy is allowed in this slice. Before any future deploy: commit, tag if promoting, validate preview/canary, document rollback, verify hosting/functions restore path, and run post-deploy checks.
