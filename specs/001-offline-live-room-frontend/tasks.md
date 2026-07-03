# Tasks: CHUNKS Mirror / Offline Live Room Frontend

**Input**: Design documents from `/specs/001-offline-live-room-frontend/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md, pre-deploy-workflow.md
**Tests**: Included because constitution requires critical live-room behavior, scoring, authorization, and release gates to be validated.

## Phase 1: Setup (Shared Infrastructure)
- [x] T001 Initialize git repository or confirm existing git history at repository root before implementation
- [x] T002 Create frontend package scaffold in frontend/package.json
- [x] T003 [P] Configure Vite TypeScript app entry in frontend/index.html and frontend/src/main.tsx
- [x] T004 [P] Configure Tailwind and CHUNKS Red tokens in frontend/tailwind.config.ts from DESIGN.md
- [x] T005 [P] Create global styles and design CSS variables in frontend/src/styles/globals.css
- [x] T006 [P] Configure test runners in frontend/vitest.config.ts and frontend/playwright.config.ts
- [x] T007 Create Supabase environment example in frontend/.env.example
- [x] T008 Create release checklist copy in docs/release/chunks-mirror-release.md

## Phase 2: Foundational (Blocking Prerequisites)
- [x] T009 Create Supabase schema migration in supabase/migrations/001_chunks_mirror_core.sql
- [x] T010 Create seed data in supabase/seed.sql
- [x] T011 [P] Implement Supabase browser client in frontend/src/lib/supabase/client.ts
- [x] T012 [P] Implement shared domain types in frontend/src/lib/domain/types.ts
- [x] T013 [P] Implement scoring utility tests in frontend/tests/unit/scoring.test.ts
- [x] T014 Implement scoring utilities in frontend/src/lib/scoring/simpleScoring.ts
- [x] T015 [P] Implement route shell and role entry route in frontend/src/routes/AppRoutes.tsx
- [x] T016 [P] Implement reusable status, card, button, and alert components in frontend/src/components/ui/
- [x] T017 Implement realtime subscription helper in frontend/src/lib/supabase/realtime.ts
- [x] T018 Implement authorization and mutation error mapping in frontend/src/lib/domain/errors.ts

## Phase 3: User Story 1 - Teacher starts a live room and controls a sentence window (Priority: P1) 🎯 MVP
**Independent Test**: Teacher creates room from seeded data and opens/closes one assigned round.
- [x] T019 [P] [US1] Add Teacher room setup integration test in frontend/tests/integration/teacher-room-setup.test.tsx
- [x] T020 [P] [US1] Add Teacher live control E2E test in frontend/tests/e2e/teacher-live-room.spec.ts
- [x] T021 [P] [US1] Create Teacher setup page in frontend/src/features/teacher/TeacherSetupPage.tsx
- [x] T022 [P] [US1] Create Teacher live room page in frontend/src/features/teacher/TeacherRoomPage.tsx
- [x] T023 [US1] Implement room creation service in frontend/src/features/teacher/teacherRoomService.ts
- [x] T024 [US1] Implement open, close, advance, and finish round service functions in frontend/src/features/live-room/roundService.ts
- [x] T025 [US1] Implement teacher roster and share-link components in frontend/src/features/teacher/components/
- [x] T026 [US1] Implement current sentence window component in frontend/src/features/live-room/CurrentSentenceWindow.tsx
- [x] T027 [US1] Wire Teacher routes in frontend/src/routes/AppRoutes.tsx
- [x] T028 [US1] Validate US1 manually using specs/001-offline-live-room-frontend/quickstart.md

## Phase 3A: Layout & Dynamic Component Refactor (Design Skill Pass)
**Goal**: Replace overly spread full-page layouts with a compact responsive app shell, navigation bar, collapsible panels, dynamic workspace components, and Theme 2 white-canvas consistency before continuing US2.
**Independent Test**: Teacher setup and teacher room remain functional while navigation, panel hide/expand, filtered resources, and mobile collapse work without horizontal overflow.
- [x] T070 [P] Create layout redesign artifact in specs/001-offline-live-room-frontend/layout-redesign.md covering AppShell, navigation, responsive workspaces, collapsible panels, and Theme 2 white-canvas rules
- [x] T071 [P] Create reusable AppShell and TopNavigation components in frontend/src/components/layout/AppShell.tsx and frontend/src/components/layout/TopNavigation.tsx
- [x] T072 [P] Create dynamic CollapsiblePanel component with persisted open/closed state in frontend/src/components/ui/CollapsiblePanel.tsx
- [x] T073 [P] Create WorkspaceLayout and ActionDock components in frontend/src/components/layout/WorkspaceLayout.tsx and frontend/src/components/layout/ActionDock.tsx
- [x] T074 [US1] Refactor TeacherSetupPage into compact step-based sections with collapsible Resource Scope, Room Settings, and Ready Check panels in frontend/src/features/teacher/TeacherSetupPage.tsx
- [x] T075 [US1] Refactor TeacherRoomPage into a command-center layout with primary Sentence Window, sticky action dock, and collapsible Roster, Share Link, and Round Settings panels in frontend/src/features/teacher/TeacherRoomPage.tsx
- [x] T076 [US1] Replace full-screen page shells with stable min-h-[100dvh], max-w-7xl containers, and mobile single-column collapse across frontend/src/routes/RoleEntryPage.tsx and frontend/src/features/teacher/
- [x] T077 [P] Add layout interaction tests for navigation and collapsible panels in frontend/tests/integration/layout-dynamic-components.test.tsx
- [x] T078 [P] Add responsive navigation/layout E2E coverage in frontend/tests/e2e/navigation-layout.spec.ts
- [x] T079 [P] Audit Theme 2 white background, Bauhaus borders, focus states, and 44px touch targets in frontend/src/styles/globals.css
- [x] T080 Validate layout refactor with npm test, npm run build, and targeted Playwright teacher navigation tests
- [x] T083 Refine compact header navigation with icon-only route buttons and icon-only theme toggle in frontend/src/components/layout/TopNavigation.tsx and frontend/src/components/ui/ThemeSwitcher.tsx
- [x] T084 Add Theme 3 CHUNKS Modular Learning Aesthetic documentation, centralized tokens, icon-toggle support, and validation coverage in DESIGN-modular.md, DESIGN.md, frontend/src/styles/globals.css, frontend/src/components/ui/ThemeSwitcher.tsx, and frontend/tests/
- [x] T085 Add Theme 4 Craft Minimal Chunking documentation, centralized tokens, icon-toggle support, and validation coverage in DESIGN-craft.md, DESIGN.md, frontend/src/styles/globals.css, frontend/src/components/ui/ThemeSwitcher.tsx, and frontend/tests/

## Phase 4: User Story 2 - Learner joins and submits Red / Yellow / Green response (Priority: P2)
**Independent Test**: Learner joins a prepared active room, sees eligibility state, and submits one valid response.
- [x] T029 [P] [US2] Add Learner join integration test in frontend/tests/integration/learner-join.test.tsx
- [x] T030 [P] [US2] Add Learner response E2E test in frontend/tests/e2e/learner-response.spec.ts
- [x] T031 [P] [US2] Add duplicate and ineligible response tests in supabase/tests/response_validation.sql
- [x] T032 [P] [US2] Create Learner join page in frontend/src/features/learner/LearnerJoinPage.tsx
- [x] T033 [P] [US2] Create Learner room page in frontend/src/features/learner/LearnerRoomPage.tsx
- [x] T034 [US2] Implement anonymous join service in frontend/src/features/learner/learnerJoinService.ts
- [x] T035 [US2] Implement response submission service in frontend/src/features/learner/responseService.ts
- [x] T036 [US2] Implement response buttons with disabled reasons in frontend/src/features/learner/components/ResponseButtons.tsx
- [x] T037 [US2] Implement learner state banner in frontend/src/features/learner/components/LearnerStateBanner.tsx
- [x] T038 [US2] Wire Learner routes in frontend/src/routes/AppRoutes.tsx
- [x] T039 [US2] Validate duplicate, observing, and closed-round rejection paths using quickstart.md

## Phase 5: User Story 3 - Teacher and Learner see progress and captured response summaries (Priority: P3)
**Independent Test**: After one valid response, both screens display response color, reflection time, CCI, CPD, and updated totals.
- [x] T040 [P] [US3] Add progress summary integration test in frontend/tests/integration/progress-summary.test.tsx
- [x] T041 [P] [US3] Add scoring display E2E test in frontend/tests/e2e/scoring-progress.spec.ts
- [x] T042 [P] [US3] Create learner progress cards in frontend/src/features/learner/components/ProgressCards.tsx
- [x] T043 [P] [US3] Create last captured response component in frontend/src/features/learner/components/LastCapturedResponse.tsx
- [x] T044 [P] [US3] Create teacher captured response panel in frontend/src/features/teacher/components/CapturedResponsePanel.tsx
- [x] T045 [US3] Implement progress query/subscription service in frontend/src/features/live-room/progressService.ts
- [x] T046 [US3] Integrate progress summaries into LearnerRoomPage and TeacherRoomPage
- [x] T047 [US3] Validate 2-second visible update target in frontend/tests/e2e/scoring-progress.spec.ts

## Phase 6: User Story 4 - Admin prepares resources and CCI standards (Priority: P4)
**Independent Test**: Admin creates/updates one approved sentence resource and one active CCI card; teacher setup can select both.
- [ ] T048 [P] [US4] Add Admin resource manager integration test in frontend/tests/integration/admin-resource-manager.test.tsx
- [ ] T049 [P] [US4] Add Admin CCI manager integration test in frontend/tests/integration/admin-cci-manager.test.tsx
- [ ] T050 [P] [US4] Create Admin workspace page in frontend/src/features/admin/AdminWorkspacePage.tsx
- [ ] T051 [P] [US4] Create Resource Manager components in frontend/src/features/admin/resources/
- [ ] T052 [P] [US4] Create CCI Standard Manager components in frontend/src/features/admin/cci/
- [ ] T053 [US4] Implement Admin resource service in frontend/src/features/admin/resources/resourceService.ts
- [ ] T054 [US4] Implement Admin CCI service in frontend/src/features/admin/cci/cciService.ts
- [ ] T055 [US4] Add batch-action confirmation dialog in frontend/src/features/admin/components/ConfirmBatchActionDialog.tsx
- [ ] T056 [US4] Wire Admin route `/admin` in frontend/src/routes/AppRoutes.tsx

## Phase 7: Polish & Cross-Cutting Concerns
- [x] T067 Add Theme 2 Bauhaus documentation and activate centralized Bauhaus frontend theme option
- [x] T068 Add Admin theme switcher for dynamic calm/Bauhaus theme selection persisted in localStorage
- [ ] T057 [P] Run accessibility audit in frontend/tests/e2e/accessibility.spec.ts
- [ ] T058 [P] Add loading, empty, reconnecting, and permission-denied states across frontend/src/features/
- [ ] T059 [P] Add user-facing copy review for learner states in frontend/src/features/learner/components/
- [ ] T060 Harden Supabase RLS policies in supabase/migrations/001_chunks_mirror_core.sql
- [ ] T081 Add Supabase RLS authorization validation for anon, Teacher Host, and Admin access boundaries after T060
- [ ] T082 Add 30-learner realtime/load validation for SC-003 and document 95% within 2 seconds pass criteria
- [ ] T061 Run quickstart validation and update docs/release/chunks-mirror-release.md
- [ ] T062 Commit release candidate changes before preview deployment
- [ ] T063 Create release tag when preparing production deployment
- [ ] T064 Validate preview/canary deployment and record evidence in docs/release/chunks-mirror-release.md
- [ ] T065 Verify hosting rollback path and Supabase restore/migration rollback path in docs/release/chunks-mirror-release.md
- [ ] T066 Complete post-deploy verification checklist in specs/001-offline-live-room-frontend/pre-deploy-workflow.md

## Dependencies & Execution Order
- Setup → Foundational → US1 MVP → US2 → US3 → US4 → Polish/Release.
- US1 can start after Foundation with seeded resources.
- US2 requires room/round contract from US1 for full E2E validation.
- US3 requires accepted response contract from US2.
- US4 can run later because seeded MVP data supports early stories.

## Parallel Opportunities
- T003-T007 after T002.
- T011-T018 after schema direction is confirmed.
- US1 page/component tasks T021-T022 and T025-T026.
- US2 page/component tasks T032-T033 and T036-T037.
- US3 display components T042-T044.
- US4 Resource and CCI managers T051-T052.

## Implementation Strategy
### MVP First
1. Complete Phase 1 and Phase 2.
2. Complete US1 Teacher Room Control.
3. Complete minimal US2 Learner join/response path.
4. Validate teacher opens round → learner responds → teacher closes round.
5. Stop and demo before Admin management depth.

## Notes
- Release tasks are mandatory before production deploy.
- Repository is now initialized as git; release-control compliance still requires commits/tags before preview or production deploy.
