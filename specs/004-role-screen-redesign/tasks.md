# Tasks: Role Screen Redesign

**Input**: Design documents from `specs/004-role-screen-redesign/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/product-area-ui-contract.md, quickstart.md

**Tests**: Required for changed navigation, Inside this area maps, role isolation, and critical product-area flows.

**Organization**: Tasks are grouped by independently testable user stories from the active spec.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Each task includes exact file paths

## Phase 1: Setup and Current-State Inventory

**Purpose**: Establish review-first workflow before frontend implementation.

- [X] T001 Verify active Spec Kit feature points to `specs/004-role-screen-redesign` in `.specify/feature.json`
- [X] T002 Create screen/component inventory document `specs/004-role-screen-redesign/screen-component-inventory.md` covering Dashboard, Library, History, Create Room, Live Room, Learner Join, and Learner Room
- [X] T003 Review current Dashboard, navigation shell, and role shortcuts in `frontend/src/routes/RoleEntryPage.tsx`, `frontend/src/components/layout/TopNavigation.tsx`, and `frontend/src/components/layout/AppShell.tsx`; record current components/issues in `specs/004-role-screen-redesign/screen-component-inventory.md`
- [X] T004 Review current Library/History surfaces in `frontend/src/features/admin/AdminWorkspacePage.tsx`, `frontend/src/features/admin/resources/ResourceManager.tsx`, and `frontend/src/features/admin/analytics/SessionAnalyticsDashboard.tsx`; record current components/issues in `specs/004-role-screen-redesign/screen-component-inventory.md`
- [X] T005 Review current Create Room surface in `frontend/src/features/teacher/TeacherSetupPage.tsx`; record current components/issues in `specs/004-role-screen-redesign/screen-component-inventory.md`
- [X] T006 Review current Live Room surface in `frontend/src/features/teacher/TeacherRoomPage.tsx` and `frontend/src/features/teacher/components/*`; record current components/issues in `specs/004-role-screen-redesign/screen-component-inventory.md`
- [X] T007 Review current Learner Join/Room surfaces in `frontend/src/features/learner/LearnerJoinPage.tsx`, `frontend/src/features/learner/LearnerRoomPage.tsx`, and `frontend/src/features/learner/components/*`; record current components/issues in `specs/004-role-screen-redesign/screen-component-inventory.md`
- [X] T008 Decide for each product-area slice whether Stitch/visual handoff is required; record `not-needed`, `pending`, or `approved` status in `specs/004-role-screen-redesign/screen-component-inventory.md`
- [X] T008A Create `specs/004-role-screen-redesign/screen-review-queue.md` to drive the per-screen review -> feedback -> edit workflow with visual direction keywords and validation notes

---

## Phase 2: Foundational Product-Area Components

**Purpose**: Build reusable orientation primitives before screen-specific slices.

- [X] T009 Check `frontend/package.json` before adding any third-party UI/icon dependency; prefer existing inline SVG/primitives unless a dependency is already installed
- [ ] T010 [P] Create shared product-area metadata helpers in `frontend/src/components/layout/productAreas.ts` for Dashboard, Library, History, Create Room, Live Room, and Learner labels, purposes, routes, and icons
- [ ] T011 [P] Create reusable Inside this area map component in `frontend/src/components/layout/InsideAreaMap.tsx` with icon-led cards, minimal text, local anchors, summary-only data, and keyboard-accessible links/actions
- [ ] T012 [P] Create integration/unit coverage for Inside this area map in `frontend/tests/integration/product-area-map.test.tsx`
- [X] T013 Update primary navigation in `frontend/src/components/layout/TopNavigation.tsx` to use product-area taxonomy: Dashboard, Library, History, Create Room, Live Room, Learner; preserve learner route isolation
- [ ] T014 Update shell/header support in `frontend/src/components/layout/AppShell.tsx` so product-area pages can provide Inside this area maps and local anchors without reintroducing fake Help/Settings/Users links
- [ ] T015 Run focused tests for navigation/map changes with `cd frontend && npm test -- product-area-map layout-dynamic-components`

**Checkpoint**: Product-area taxonomy and reusable orientation map exist before per-screen redesign.

---

## Phase 3: User Story 1 - Clear product-area navigation and tab inventory (Priority: P1) 🎯 MVP

**Goal**: Every product area exposes its purpose and contained feature groups quickly.

**Independent Test**: Open each product area and identify its purpose/features in under 60 seconds without fake links.

### Tests for User Story 1

- [X] T016 [P] [US1] Update navigation integration tests in `frontend/tests/integration/layout-dynamic-components.test.tsx` for product-area labels, routes/aliases, no fake links, and learner route isolation
- [ ] T017 [P] [US1] Add product-area inventory assertions in `frontend/tests/integration/product-area-map.test.tsx` for Dashboard, Library, History, Create Room, Live Room, and Learner map entries

### Implementation for User Story 1

- [X] T018 [US1] Update Dashboard in `frontend/src/routes/RoleEntryPage.tsx` to act as the product map for Dashboard, Library, History, Create Room, Live Room, and Learner
- [X] T019 [US1] Add Inside this area map to Library/History host page in `frontend/src/features/admin/AdminWorkspacePage.tsx`, with summary-only Resources, Standards, Audio Readiness, and History entries
- [ ] T020 [US1] Add Inside this area map to Create Room in `frontend/src/features/teacher/TeacherSetupPage.tsx`, with room idea, scope, readiness, and advanced options entries
- [ ] T021 [US1] Add Inside this area map to Live Room in `frontend/src/features/teacher/TeacherRoomPage.tsx`, with Now, History & Queue, Roster, Audio, Progress, and Share entries
- [ ] T022 [US1] Add Inside this area map or equivalent compact orientation to Learner Join/Room in `frontend/src/features/learner/LearnerJoinPage.tsx` and `frontend/src/features/learner/LearnerRoomPage.tsx`
- [X] T023 [US1] Update `specs/004-role-screen-redesign/screen-component-inventory.md` with completed map decisions and validation notes

**Checkpoint**: MVP navigation/product-area clarity is demonstrable without full internal redesign.

---

## Phase 4: User Story 2 - Role-specific screen review and redesign (Priority: P1)

**Goal**: Redesign product-area screen internals by approved slices after inventory.

**Independent Test**: Each product-area screen has component inventory, accepted change notes, and validation evidence.

### Tests for User Story 2

- [ ] T024 [P] [US2] Update Admin/Library integration tests in `frontend/tests/integration/admin-resource-manager.test.tsx` for Library map, resources/standards/audio grouping, pagination/filter preservation, and batch confirmation
- [ ] T025 [P] [US2] Update History integration tests in `frontend/tests/integration/admin-session-analytics.test.tsx` for History map and analytics ownership
- [ ] T026 [P] [US2] Update Create Room tests in `frontend/tests/integration/teacher-room-setup.test.tsx` for setup ownership, readiness summary, and advanced options
- [ ] T027 [P] [US2] Update Live Room tests in `frontend/tests/integration/room-session-playback.test.tsx` for Now, History & Queue, Roster, Audio, Progress, and Share grouping
- [ ] T028 [P] [US2] Update Learner tests in `frontend/tests/integration/learner-join.test.tsx` or add `frontend/tests/integration/learner-product-area.test.tsx` for join/respond ownership and role isolation

### Implementation for User Story 2

- [X] T029 [US2] Redesign Library grouping in `frontend/src/features/admin/AdminWorkspacePage.tsx` and `frontend/src/features/admin/resources/ResourceManager.tsx` so resources, standards, and audio readiness are separate and map-linked
- [X] T030 [US2] Redesign History grouping in `frontend/src/features/admin/analytics/SessionAnalyticsDashboard.tsx` so room history and learner distribution are clearly analytics/review, not Library editing
- [ ] T031 [US2] Refine Create Room page in `frontend/src/features/teacher/TeacherSetupPage.tsx` so setup remains recipe-first and database details stay secondary
- [ ] T032 [US2] Refine Live Room layout in `frontend/src/features/teacher/TeacherRoomPage.tsx` and `frontend/src/features/teacher/components/RoomHistorySummary.tsx` so teacher controls and supporting panels have clear product-area ownership
- [ ] T033 [US2] Refine Learner Join/Room layout in `frontend/src/features/learner/LearnerJoinPage.tsx` and `frontend/src/features/learner/LearnerRoomPage.tsx` so learner-safe state remains obvious and isolated
- [ ] T034 [US2] Update `specs/004-role-screen-redesign/screen-component-inventory.md` with before/after notes, accepted changes, and validation status for each product area

---

## Phase 5: User Story 3 - Design approval before large layout implementation (Priority: P2)

**Goal**: Ensure significant redesigns are visually approved before code implementation.

**Independent Test**: Each slice records component inventory and Stitch/static approval status before implementation.

### Implementation for User Story 3

- [ ] T035 [US3] For each product area in `specs/004-role-screen-redesign/screen-component-inventory.md`, list component inventory items: primary content, filters, summaries, actions, empty/loading/error states
- [ ] T036 [US3] Identify significant layout changes requiring Stitch/static handoff and record target page/component prompts in `specs/004-role-screen-redesign/visual-handoff.md`
- [ ] T037 [US3] If Stitch is used, read `C:\Users\gensh\.craft-agent\workspaces\os\sources\stitch\guide.md`, confirm target project/screen with Lucy, then generate or inspect Stitch screen before implementation
- [ ] T038 [US3] Record Lucy approval links/notes for each visual handoff in `specs/004-role-screen-redesign/visual-handoff.md`
- [ ] T039 [US3] Block implementation of any significant layout slice whose visual handoff status is `pending` or `rejected` in `specs/004-role-screen-redesign/visual-handoff.md`

---

## Phase 6: User Story 4 - Design-system aligned layout update (Priority: P2)

**Goal**: Keep redesign premium, accessible, and CHUNKS-system aligned.

**Independent Test**: Updated screens reuse primitives/tokens and preserve accessibility expectations.

### Tests for User Story 4

- [ ] T040 [P] [US4] Update primitive/layout accessibility coverage in `frontend/src/components/primitives/Accessibility.test.tsx` or related tests for Inside this area map focus/labels
- [ ] T041 [P] [US4] Update Storybook role-layout stories in `frontend/src/**/*.stories.tsx` or `.storybook` stories if role layouts changed

### Implementation for User Story 4

- [ ] T042 [US4] Apply frontend design skill checks to changed layout files and document design decisions in `specs/004-role-screen-redesign/design-application-notes.md`
- [ ] T043 [US4] Ensure all changed critical actions use visible labels or explicit accessible labels in `frontend/src/features/**` and `frontend/src/components/layout/**`
- [ ] T044 [US4] Ensure changed disabled actions provide disabled reasons in `frontend/src/features/**` and `frontend/src/components/layout/**`
- [ ] T045 [US4] Ensure responsive layouts avoid horizontal overflow in Dashboard, Library, History, Create Room, Live Room, and Learner screens

---

## Phase 7: User Story 5 - Logic review with no contract regressions (Priority: P2)

**Goal**: Preserve live-room behavior, scoring history, role isolation, and Admin safety while redesigning.

**Independent Test**: Existing tests pass and new tests cover role screen inventory plus critical live-room state visibility.

### Tests for User Story 5

- [ ] T046 [P] [US5] Run or update live-room regression coverage in `frontend/tests/integration/room-session-playback.test.tsx`
- [ ] T047 [P] [US5] Run or update learner state regression coverage in `frontend/tests/integration/learner-join.test.tsx`
- [ ] T048 [P] [US5] Run or update Admin safety regression coverage in `frontend/tests/integration/admin-resource-manager.test.tsx`

### Implementation for User Story 5

- [ ] T049 [US5] Verify redesigned Learner routes do not expose Admin/Teacher controls in `frontend/src/components/layout/TopNavigation.tsx`, `frontend/src/features/learner/LearnerJoinPage.tsx`, and `frontend/src/features/learner/LearnerRoomPage.tsx`
- [ ] T050 [US5] Verify redesigned Live Room preserves teacher next-action clarity and round state behavior in `frontend/src/features/teacher/TeacherRoomPage.tsx`
- [ ] T051 [US5] Verify redesigned Library keeps batch confirmation and error handling in `frontend/src/features/admin/resources/ResourceManager.tsx` and `frontend/src/features/admin/components/ConfirmBatchActionDialog.tsx`

---

## Phase 8: Validation and Documentation

**Purpose**: Prove the redesign is safe and document release controls.

- [ ] T052 Run `cd frontend && npm test`
- [ ] T053 Run `cd frontend && npm run build`
- [ ] T054 Run `cd frontend && npm run build-storybook`
- [ ] T055 Perform browser visual checks for Dashboard `/`, Library `/admin`, History `/admin#history-analytics` or approved alias, Create Room `/teacher/setup`, Live Room `/teacher/room/:roomCode`, Learner Join, and Learner Room; record results in `specs/004-role-screen-redesign/quickstart.md`
- [ ] T056 Update `specs/004-role-screen-redesign/tasks.md` completed checkboxes and summarize any skipped/deferred product-area slices
- [ ] T057 Document release-control status in `specs/004-role-screen-redesign/plan.md`: no production deploy, no remote DDL, commit/tag/preview/rollback/restore/post-deploy gates required before future release

## Dependencies & Execution Order

- Phase 1 blocks all implementation.
- Phase 2 blocks product-area screen slices.
- US1 is MVP and blocks full product-area confidence.
- US2 can start after US1 map/navigation foundation.
- US3 visual handoff gates significant layout implementation in US2/US4.
- US4 and US5 can run in parallel after US1 foundation but must complete before final validation.
- Phase 8 runs after implementation slices.

## Parallel Opportunities

- T003-T007 inventory reviews can run in parallel after T002.
- T010-T012 can run in parallel.
- T016-T017 can run in parallel.
- T024-T028 can run in parallel.
- T040-T041 can run in parallel.
- T046-T048 can run in parallel.

## Independent Test Criteria

- **US1**: Product-area navigation and Inside this area maps are visible and truthful for all destinations.
- **US2**: Each product area has component inventory, accepted redesign notes, and passing tests/browser checks.
- **US3**: Significant layout changes have component inventory and Lucy-approved visual handoff before implementation.
- **US4**: Changed layouts pass accessibility expectations, responsive checks, and design-system consistency.
- **US5**: Existing live-room, learner state, and Admin safety behavior remains intact.

## Implementation Strategy

1. MVP first: complete Phases 1-3 to establish product-area navigation and Inside this area maps.
2. Implement product-area slices incrementally: Library/History, Create Room, Live Room, Learner.
3. Use Stitch/visual handoff only for significant layout changes, not every tiny primitive adjustment.
4. Validate each slice before moving to the next.
5. Run full validation and document release gates.

## Release Control

No production or preview deploy is part of these tasks. Before any future deploy, enforce Lucy's release controls: commit, tag if promoting, preview/canary validation, rollback instructions, restore-path verification, and post-deploy checks.
