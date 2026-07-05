# Tasks: Role Screen Redesign — Live Response Logic Correction

**Input**: Design documents from `specs/003-role-screen-redesign/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/live-room-response-contract.md, quickstart.md

**Tests**: Required for changed scoring, learner lockout, and teacher advance behavior.

**Organization**: Tasks are grouped by independently testable user stories from the active spec.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Each task includes exact file paths

## Phase 1: Setup and CodeGraph Context

**Purpose**: Ensure codebase exploration and current contracts are understood before edits.

- [X] T001 Verify MCP CodeGraph index is current for repository root with `codegraph status .` and `codegraph sync .` if pending
- [X] T002 Use MCP CodeGraph to inspect `ResponseColor`, `LearnerPerformanceY`, `ResponseButtons`, `deriveLearnerState`, `submitLearnerResponse`, `calculateSimpleScore`, and `TeacherRoomPage` before edits

---

## Phase 2: Foundational Response Contract

**Purpose**: Extend response scale across TypeScript and Supabase contracts before UI behavior depends on purple.

- [X] T003 Update response domain types in `frontend/src/lib/domain/types.ts` for `purple` and coefficient `3`
- [X] T004 Update centralized scoring map and formula version handling in `frontend/src/lib/scoring/simpleScoring.ts`
- [X] T005 Add Supabase migration `supabase/migrations/007_extend_response_scale_to_purple.sql` to accept `purple` and `performance_y = 3`
- [X] T006 Update base schema constraints in `supabase/migrations/001_chunks_mirror_core.sql` for fresh local databases
- [X] T007 Update SQL validation in `supabase/tests/response_validation.sql` for purple response acceptance

**Checkpoint**: Scoring and schema can represent four response options.

---

## Phase 3: User Story 2 - Correct Teacher/Learner Live Logic (Priority: P1) 🎯 MVP

**Goal**: Learner sees only the sentence identifier and four minimal responses; captured round suppresses all other learner controls; Teacher primary advance requires capture.

**Independent Test**: Integration test renders learner active room before and after captured state, and teacher room before and after captured response.

### Tests for User Story 2

- [X] T008 [P] [US2] Update scoring unit tests in `frontend/tests/unit/scoring.test.ts` for purple coefficient 3
- [X] T009 [P] [US2] Update learner/teacher integration tests in `frontend/tests/integration/room-session-playback.test.tsx` for sentence-code-only learner view, hidden controls after capture, and teacher advance disabled until capture

### Implementation for User Story 2

- [X] T010 [US2] Update `frontend/src/features/learner/responseService.ts` so learner state detects any captured response for the current round, not only the current learner response
- [X] T011 [US2] Redesign `frontend/src/features/learner/components/ResponseButtons.tsx` as four minimal icon/color controls with accessible names and centralized response scale data
- [X] T012 [US2] Update `frontend/src/features/learner/components/LearnerStateBanner.tsx` copy so it does not mention only Red/Yellow/Green
- [X] T013 [US2] Update `frontend/src/features/learner/LearnerRoomPage.tsx` to show active sentence code only and suppress response controls after capture
- [X] T014 [US2] Update `frontend/src/features/teacher/TeacherRoomPage.tsx` so the primary advance button and ArrowRight shortcut require captured response while a round is open

**Checkpoint**: Live-room logic matches Lucy's corrected flow.

---

## Phase 4: User Story 4 - Preserve Contracts and Reporting (Priority: P2)

**Goal**: Preserve progress/history and analytics behavior after adding purple.

**Independent Test**: Existing progress and analytics tests pass; purple does not break response summaries.

- [X] T015 [US4] Update response color tone/count handling in `frontend/src/features/live-room/progressService.ts`, `frontend/src/features/learner/components/ProgressCards.tsx`, `frontend/src/features/learner/components/LastCapturedResponse.tsx`, `frontend/src/features/teacher/components/CapturedResponsePanel.tsx`, and `frontend/src/features/admin/analytics/analyticsService.ts` as needed
- [X] T016 [US4] Update affected test fixtures in `frontend/tests/integration/progress-summary.test.tsx` and `frontend/tests/integration/admin-session-analytics.test.tsx` if type changes require purple-aware summaries

---

## Phase 5: Validation and Documentation

**Purpose**: Validate automated checks and record remaining release gates.

- [X] T017 Run `cd frontend && npm test`
- [X] T018 Run `cd frontend && npm run build`
- [X] T019 Re-run MCP CodeGraph exploration for changed symbols and sync index with `codegraph sync .`
- [X] T020 Update `specs/003-role-screen-redesign/tasks.md` completed checkboxes and summarize release-control note: no deploy before commit/tag/preview/rollback gates

---

## Dependencies & Execution Order

- Phase 1 blocks all edits.
- Phase 2 blocks learner UI because purple must be valid in types/schema/scoring first.
- T008/T009 tests should be updated before T010-T014 implementation.
- Phase 4 can run after TypeScript response types compile.
- Phase 5 runs after implementation.

## Parallel Opportunities

- T008 and T009 can run in parallel after T003-T007 intent is known.
- T015 and T016 can run after T010-T014 compile.

## Implementation Strategy

1. Complete MVP live-room logic first: T001-T014.
2. Preserve progress/analytics contract: T015-T016.
3. Validate and sync CodeGraph: T017-T020.

## Release Control

No production or preview deploy is part of these tasks. Before any future deploy, enforce Lucy's release controls: commit, tag if promoting, preview/canary validation, rollback instructions, restore-path verification, and post-deploy checks.
