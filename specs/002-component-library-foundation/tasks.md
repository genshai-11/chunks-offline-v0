# Tasks: Component Library Foundation + Visual Language & Theming Audit

**Feature Branch**: `002-component-library-foundation` | **Date**: 2026-07-04 | **Spec**: `spec.md`

**Input**: Feature specification from `spec.md`, implementation plan from `plan.md`, research decisions from `research.md`

## Phase 1: Setup

- [X] T001 Initialize Storybook for component documentation in `frontend/`
- [X] T002 [P] Configure Tailwind CSS theming structure (tokens, variants) in `frontend/tailwind.config.js`
- [X] T003 [P] Set up component primitives directory structure under `frontend/src/components/primitives/`

## Phase 2: Foundational

- [X] T004 Audit existing UI components and styling patterns across Admin/Teacher/Learner flows (document in `research.md` appendix)
- [X] T005 Define primitive contract interface (variants, states, sizes, accessibility props) in `frontend/src/components/primitives/types.ts`

## Phase 3: User Story 1 - Establish Component Library Foundation (P1)

**Goal**: Teams can rely on reusable UI primitives (Button, Card, Panel, Input, Select, Badge, Tooltip, Dialog, Toast, Progress, Skeleton) that expose variants, states, sizes, and composition.

**Independent Test**: Refactor or create one complete screen (e.g., Teacher control view) using only the new primitives; verify no custom per-screen styling remains for core interactions.

**Acceptance Scenarios** (from spec.md):
1. Existing interface using basic components → applies primitives → uses only documented variants/states
2. Need for new size/state (loading, disabled with explanation) → primitive provides behavior without custom code
3. Same primitive used across Admin/Teacher/Learner → visual and interaction contract identical

### Tasks

- [X] T006 [P] [US1] Implement Button primitive with variants (primary, secondary, ghost, destructive), sizes, states (loading, disabled), and accessibility in `frontend/src/components/primitives/Button.tsx`
- [X] T007 [P] [US1] Implement Card primitive (header, content, footer slots) with elevation variants in `frontend/src/components/primitives/Card.tsx`
- [X] T008 [P] [US1] Implement Panel primitive for layout containers with responsive padding in `frontend/src/components/primitives/Panel.tsx`
- [X] T009 [P] [US1] Implement Input primitive with validation states, disabled explanations, and helper text in `frontend/src/components/primitives/Input.tsx`
- [X] T010 [P] [US1] Implement Select primitive (single/multi) with keyboard navigation and disabled states in `frontend/src/components/primitives/Select.tsx`
- [X] T011 [P] [US1] Implement Badge primitive with semantic color variants (success, warning, error, info) in `frontend/src/components/primitives/Badge.tsx`
- [X] T012 [P] [US1] Implement Tooltip primitive with positioning, delay, and accessibility in `frontend/src/components/primitives/Tooltip.tsx`
- [X] T013 [P] [US1] Implement Dialog primitive (modal, alert, confirmation) with focus trap and escape handling in `frontend/src/components/primitives/Dialog.tsx`
- [X] T014 [P] [US1] Implement Toast primitive (success, error, info, warning) with auto-dismiss and action buttons in `frontend/src/components/primitives/Toast.tsx`
- [X] T015 [P] [US1] Implement Progress primitive (linear, circular) with ARIA live regions in `frontend/src/components/primitives/Progress.tsx`
- [X] T016 [P] [US1] Implement Skeleton primitive for loading states with shimmer animation in `frontend/src/components/primitives/Skeleton.tsx`
- [X] T017 [US1] Create Storybook stories for all primitives with controls for variants/states/sizes in `frontend/src/components/primitives/*.stories.tsx`
- [X] T018 [US1] Validate US1 acceptance scenarios on one refactored screen (e.g., TeacherSetupPage) using only primitives

## Phase 4: User Story 2 - Audit and Refresh Visual Language & Theming (P2)

**Goal**: Visual language and theming definitions are centralized so updates apply everywhere without touching individual components or screens. Stitch MCP used for design-time exploration.

**Independent Test**: Apply a defined visual language change (e.g., tone down decorative treatments in primary theme) and confirm all major flows update consistently with no per-file overrides.

**Acceptance Scenarios** (from spec.md):
1. Active design language adjusted centrally → change appears across Admin/Teacher/Learner interfaces
2. User/admin switches themes → primitives respect theme while preserving learner-safe clarity/contrast
3. Completed audit → any screen uses only approved language without unique exceptions

### Tasks

- [X] T019 [P] [US2] Run Stitch MCP to generate 2-3 visual language variants aligned with Theme 1 (calm classroom) and Theme 2 (Bauhaus poster) — export tokens/guidelines
- [X] T020 [US2] Present Stitch-generated variants to user for explicit review & confirmation before any token mapping or project-wide theming changes
- [X] T021 [US2] Map Stitch MCP output tokens to Tailwind CSS configuration and CSS custom properties in `frontend/tailwind.config.js` and `frontend/src/styles/tokens.css`
- [X] T022 [US2] Update `DESIGN.md` with Stitch-derived visual language guidelines (typography scale, color palette, spacing, elevation, border radius)
- [X] T023 [P] [US2] Refactor existing theme switcher to apply new centralized tokens through primitives (no per-screen overrides)
- [X] T024 [US2] Validate US2 acceptance scenarios: central theme change propagates to all role flows without file edits

## Phase 5: User Story 3 - Maintain Accessibility and Consistency During Evolution (P3)

**Goal**: All interactive elements and layouts continue to meet accessibility expectations (44px targets, focus visibility, contrast, disabled explanations) while component library and visual language evolve.

**Independent Test**: Run accessibility checks or manual validation on primary flows after changes; confirm all critical controls satisfy size, focus, and state-visibility rules.

**Acceptance Scenarios** (from spec.md):
1. Response controls/action docks use primitives → disabled states clearly explain unavailability to learners
2. Theme/visual language updates applied → focus indicators, contrast, touch targets remain compliant

### Tasks

- [X] T025 [P] [US3] Audit all primitives for 44px minimum touch targets, focus rings, and ARIA compliance (document gaps)
- [X] T026 [US3] Add or enhance disabled-state explanations (via `title`, helper text, or `aria-describedby`) on all interactive primitives
- [X] T027 [US3] Run automated accessibility scan (axe-core or equivalent) on Storybook stories and primary flows; fix violations
- [X] T028 [US3] Validate US3 acceptance scenarios: learner response flow and theme-switched screens meet accessibility baseline

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T029 Update component index exports and barrel files for clean imports in `frontend/src/components/primitives/index.ts`
- [X] T030 Document migration guide for incremental adoption of primitives (in `research.md` or new `MIGRATION.md`)
- [X] T031 Run full Constitution Check and accessibility re-validation before marking feature complete
- [ ] T032 Commit changes with release-control tag (if production path) and update changelog


## Phase 7: Selected Stitch UI/UX Application — Current App

**Goal**: Apply the selected Stitch decision-board direction (`projects/2813975030955029949/screens/082fd84028f34458858df1b089c5445b`) to the current React UI/UX using the component primitives and centralized tokens.

**Implementation Plan**: See `uiux-application-plan.md`.

### Setup & Token Alignment

- [x] T033 [US2] Review selected Stitch decision board and extract implementation notes into `specs/002-component-library-foundation/uiux-application-plan.md`
- [x] T034 [US2] Tune `frontend/src/styles/tokens.css` for the selected calm+Bauhaus direction without adding per-screen hard-coded theme values
- [x] T035 [US2] Add/adjust Tailwind aliases in `frontend/tailwind.config.ts` only if new token categories are needed by layouts

### Shared Shell & Entry Flow

- [x] T036 [US1] Refactor shared shell spacing/surfaces in `frontend/src/components/layout/AppShell.tsx`
- [x] T037 [US1] Refactor top navigation and action patterns in `frontend/src/components/layout/TopNavigation.tsx` and `frontend/src/components/layout/ActionDock.tsx`
- [x] T038 [US1] Apply selected decision-board role-card hierarchy to `frontend/src/routes/RoleEntryPage.tsx`
- [x] T039 [US3] Verify shared shell and role entry preserve landmarks, keyboard access, and visible focus states

### Teacher Host Flow

- [x] T040 [US1] Apply command-console layout to `frontend/src/features/teacher/TeacherSetupPage.tsx` using primitives
- [x] T041 [US1] Apply live-room console hierarchy to `frontend/src/features/teacher/TeacherRoomPage.tsx`
- [x] T042 [US1] Refactor Teacher subcomponents (`TeacherAudioControls`, `TeacherRoster`, `CapturedResponsePanel`, `ShareLinkCard`) to primitive surfaces/status/action patterns
- [x] T043 [US3] Ensure Teacher disabled round/action states show explanations such as `Round closed` and remain keyboard accessible

### Learner Flow

- [x] T044 [US1] Apply learner-safe response layout to `frontend/src/features/learner/LearnerRoomPage.tsx`
- [x] T045 [US1] Refactor `ResponseButtons` to use primitive Button variants/sizes while preserving Red/Yellow/Green semantics
- [x] T046 [US1] Refactor `LearnerStateBanner`, `ProgressCards`, and `LastCapturedResponse` to primitive Badge/Card/Progress patterns
- [x] T047 [US3] Verify waiting/assigned/captured/already-responded/closed-round states are visible and non-color-only

### Admin Flow

- [x] T048 [US1] Apply selected resource-manager hierarchy to `frontend/src/features/admin/resources/ResourceManager.tsx`
- [x] T049 [US1] Refactor `ConfirmBatchActionDialog` to use primitive Dialog/Button patterns while preserving confirmation requirements
- [x] T050 [US1] Apply primitive card/badge/progress patterns to `SessionAnalyticsDashboard`, `CciManager`, and `CvrManager`
- [x] T051 [US3] Verify Admin batch/destructive actions keep explicit confirmation and completion/failure feedback

### Storybook, Tests, and Validation

- [x] T052 [US1] Add Storybook examples for selected Teacher, Learner, and Admin layout compositions in `frontend/src/components/primitives/*.stories.tsx` or a new layout story file
- [x] T053 [US3] Extend `frontend/src/components/primitives/Accessibility.test.tsx` or integration tests for selected role layouts
- [x] T054 [US1] Run and fix `npm test`
- [x] T055 [US1] Run and fix `npm run build`
- [x] T056 [US1] Run and fix `npm run build-storybook`
- [x] T057 [US3] Update `specs/002-component-library-foundation/accessibility-audit.md` with final selected-layout findings
- [x] T058 [US2] Update `DESIGN.md` if implementation reveals token/style governance changes
- [x] T059 [US1] Update `specs/002-component-library-foundation/MIGRATION.md` with role-layout migration notes
- [x] T060 [US3] Re-run constitution check and update `specs/002-component-library-foundation/constitution-check.md`

### Phase 8: Stitch Dashboard Layout Correction — Global Shell + Admin Library

- [x] T061 [US1] Attempt Stitch dashboard-layout generation using project `2813975030955029949` and design system `assets/13510900032955570886`; proceed from screenshot/prompt direction when generation timed out without producing a new screen
- [x] T062 [US1] Replace horizontal role-tab navigation in `frontend/src/components/layout/TopNavigation.tsx` with dashboard-style sidebar navigation, icon-led items, and active section states
- [x] T063 [US1] Refactor `frontend/src/components/layout/AppShell.tsx` into sidebar + dashboard header shell with title, status, search affordance, utility controls, and action slot
- [x] T064 [US1] Tune `frontend/src/components/layout/WorkspaceLayout.tsx` for wider primary dashboard canvas and sticky side inspector only at wide breakpoints
- [x] T065 [US1] Reframe `frontend/src/features/admin/AdminWorkspacePage.tsx` as a Library dashboard with Create New action and summary metric cards
- [x] T066 [US1] Redesign `frontend/src/features/admin/resources/ResourceManager.tsx` from one-line rows into grouped dashboard resource cards with metadata, prompts, readiness badges, pagination, and inspector form
- [x] T067 [US3] Update layout/Admin integration tests for Dashboard/Library terminology and richer resource-card structure
- [x] T068 [US3] Run targeted layout/Admin/a11y validation and `npm run build` after dashboard correction

### Phase 9: Compact Taste Correction — Readability + Real Dashboard Density

- [x] T069 [US1] Refine `frontend/src/components/layout/TopNavigation.tsx` from oversized sidebar styling into compact icon-led dashboard rows with readable active states
- [x] T070 [US1] Refine `frontend/src/components/layout/AppShell.tsx` from oversized header/content containers into compact dashboard chrome with smaller title, tighter utility controls, and reduced max width
- [x] T071 [US1] Redesign `frontend/src/routes/RoleEntryPage.tsx` from landing/role cards into a compact Stitch-style dashboard board with loop steps, status panels, metrics, and role shortcuts
- [x] T072 [US3] Fix white-on-white and low-contrast layout risks by removing the incorrect dark-card usage on light surfaces and making each text/surface pairing explicit
- [x] T073 [US3] Run targeted layout, accessibility, Admin resource, and build validation after compact taste correction

### Phase 10: Visible Navigation Delta — Remove Primitive Button Leakage

- [x] T075 [US1] Diagnose why the visible app still resembled the old layout by running local Vite and inspecting rendered DOM/classes in browser
- [x] T076 [US1] Replace sidebar navigation `ButtonLink` usage with custom app-nav anchors so primitive `theme-button`/`rounded-full` styles cannot leak into the dashboard sidebar
- [x] T077 [US1] Tighten shell grid from `14.5rem` to `12.5rem` and keep header/content chrome compact so the visual delta is obvious
- [x] T078 [US3] Validate browser DOM shows `hasThemeButton: false` for active nav and run targeted layout/accessibility/build checks

### Phase 11: Component-Internal Redesign — Not Just Shell Chrome

- [x] T080 [US1] Redesign shared `CollapsiblePanel` from old oversized cards into compact rail-led sections used inside Teacher setup and room workflows
- [x] T081 [US1] Redesign shared `ActionDock` from generic panel/card styling into a command-strip action surface used by Teacher and Learner workflows
- [x] T082 [US1] Redesign `frontend/src/features/admin/cci/CciManager.tsx` from repeated card/form layout into selected-list plus inspector workflow
- [x] T083 [US1] Redesign `frontend/src/features/admin/cvr/CvrManager.tsx` from repeated card/form layout into selected-list plus inspector workflow
- [x] T084 [US1] Redesign `frontend/src/features/admin/analytics/SessionAnalyticsDashboard.tsx` from stacked summary cards into metric strip, room stream, and learner distribution tiles
- [x] T085 [US3] Preserve readable text/background contrast and existing test-visible copy contracts during internal component redesign
- [x] T086 [US3] Run focused Teacher/Learner/Admin/a11y validation and production build after internal component redesign

### Phase 12: Minimal Role Workflows — Sentence Text, Clear Features, History View

**Reason**: Lucy reviewed the latest UI at 2026-07-04 12:14 GMT+7 and found the component internals still too heavy, code/id-first, and hard to manage. This phase must correct the actual role workflows, not only shell chrome.

- [x] T087 [US2] Before extracting static HTML or sending another app snapshot into Stitch, ask Lucy to choose the extraction strategy required by `stitch::extract-static-html`: Strategy A Puppeteer snapshot, recommended for the local Vite app, or Strategy B browser capture when interaction is needed first
- [x] T088 [US2] Use the confirmed Stitch/static-HTML path to produce or refresh a minimal component-level reference for Teacher room, Learner room, Admin resources, and role entry; record the chosen reference and any Stitch screen IDs in `specs/002-component-library-foundation/uiux-application-plan.md`
- [x] T089 [US1] Refactor `frontend/src/features/live-room/CurrentSentenceWindow.tsx` so the visible hierarchy is sentence text first; keep `sentence_code` only as subdued metadata, never as the primary title/content
- [x] T090 [US1] Refactor Teacher room history/upcoming resources in `frontend/src/features/teacher/TeacherRoomPage.tsx` so locked history and upcoming filters show readable sentence text snippets, status, order, and audio readiness instead of code-only chips
- [x] T091 [US1] Refactor learner and audio helper surfaces in `frontend/src/features/learner/LearnerRoomPage.tsx` and `frontend/src/features/teacher/components/TeacherAudioControls.tsx` so learners/teachers see human sentence content and clear availability, with IDs/codes secondary only
- [x] T092 [US1] Replace oversized resource-card internals in `frontend/src/features/admin/resources/ResourceManager.tsx`, including `grid h-full w-full gap-4 p-5 text-left`, with a minimal compact card/list pattern that prioritizes sentence text, lesson/topic, readiness, and selected state
- [x] T093 [US1] Audit and simplify heavy surface classes such as `rounded-3xl border border-chunks-hairline bg-white shadow-soft p-5 sm:p-6 lg:p-8 space-y-5`; preserve primitive consistency while moving routine panels toward compact `rounded-2xl`, `p-3`/`p-4`, and clear section rhythm
- [x] T094 [US1] Clarify role-level feature navigation across entry, Teacher, Learner, and Admin pages so each role shows what can be done there, where to go next, and how to view/manage history; no page should feel like a long unmanaged stack
- [x] T095 [US3] Audit all visible buttons and icon controls touched by Phase 12; every control must have visible purpose text or an explicit accessible label, and no button may render visually empty
- [x] T096 [US3] Add or update tests for sentence-text-first display, no code-first learner/teacher primary content, compact resource cards, clear role feature navigation, labelled controls, and history/view affordances
- [x] T097 [US3] Update `DESIGN.md`, `specs/002-component-library-foundation/MIGRATION.md`, `accessibility-audit.md`, and `constitution-check.md` with the Phase 12 minimal-workflow rules and validation results
- [x] T098 [US3] Run `npm test`, `npm run build`, `npm run build-storybook`, and a local browser visual check for the corrected role workflows

### Phase 13: Product-Structure Redesign — History, Create Room, Navigation Truth

**Reason**: Lucy reviewed `screen-inventory-review.md` at 2026-07-04 13:04 GMT+7 and identified that the app still lacks an obvious history-management destination, Teacher Setup still feels like database configuration instead of a main-idea room launcher, and navigation includes Users/Settings/Help destinations that do not exist as real screens.

- [x] T099 [US1] Redesign route/navigation truth in `frontend/src/routes/AppRoutes.tsx`, `frontend/src/components/layout/TopNavigation.tsx`, and `frontend/src/components/layout/AppShell.tsx`: remove, disable, or implement Users, Settings, Analytics, and Help destinations so no nav item points to an empty/nonexistent page
- [x] T100 [US1] Decide and implement the first History destination: either a real route such as `/history`/`/admin/history`, or a clearly anchored Admin section renamed **History & Analytics**; document the decision in `screen-inventory-review.md`
- [x] T101 [US1] Refactor Teacher Live Room history management in `frontend/src/features/teacher/TeacherRoomPage.tsx` so played/current/upcoming resources are reachable from a clear History/Queue area instead of being buried inside a generic upcoming-resources collapsible panel
- [x] T102 [US1] Add or refactor a history summary component that shows room title/code, round sequence, sentence snippets, learner response counts, and CPD/CCI status without requiring users to understand internal IDs
- [x] T103 [US1] Redesign Teacher Setup in `frontend/src/features/teacher/TeacherSetupPage.tsx` around a **Create Room recipe**: main idea first, resource scope summary, approved-resource count, and a launch confirmation; advanced settings must be secondary
- [x] T104 [US1] Move secondary create-room settings such as host name, capture mode, scoring/CCI details, and database section internals into a compact Advanced Options disclosure, drawer, popover, or modal so the first screen only shows the main ideas
- [x] T105 [US3] Ensure the Create Room action remains accessible and explicit: disabled reasons, keyboard support, focus management for any modal/drawer, and no hidden required fields without visible explanation
- [x] T106 [US2] Apply a high-end but classroom-safe visual treatment only to the focal workflows: Create Room recipe, History/Queue, and real navigation destinations; avoid broad decorative restyling that reintroduces oversized generic cards
- [x] T107 [US3] Update integration tests for route truth, no fake Users/Settings/Help links, visible History destination/section, Teacher history management, and Create Room recipe/advanced-options behavior
- [x] T108 [US3] Update `screen-inventory-review.md`, `uiux-application-plan.md`, `MIGRATION.md`, `accessibility-audit.md`, and `constitution-check.md` with Phase 13 decisions and validation results
- [x] T109 [US3] Run `npm test`, `npm run build`, `npm run build-storybook`, and local browser visual checks for Dashboard, Admin/History, Teacher Setup, and Teacher Live Room after Phase 13

### Release Control

- [ ] T110 Commit selected UI/UX application changes before any preview/production deploy; tag only if promoting beyond development

## Dependencies

**User Story Completion Order**:
1. **US1 (P1)** must complete before US2/US3 can validate against primitives
2. **US2 (P2)** depends on US1 primitives existing to apply theming
3. **US3 (P3)** runs in parallel with US1/US2 but validates final state after both

**Parallel Opportunities** (marked [P]):
- T002/T003 (Setup) — independent directories
- T006–T016 (US1 primitives) — each primitive is independent file
- T019/T023 (US2 Stitch + theme switcher) — design work vs. code work
- T025 (US3 audit) — can start once primitives exist

## Implementation Strategy

**MVP Scope (Recommended)**: Complete **US1 only** (T001–T018) to deliver the component library foundation. This provides immediate value for new screen development and reduces duplication.

**Incremental Delivery**:
- After US1: Team can build new screens with primitives; existing screens migrate opportunistically.
- After US2: Central theming audit complete; DESIGN.md updated; Stitch output integrated.
- After US3: Accessibility baseline locked; no regressions in learner safety.

**Test Strategy** (no TDD requested in spec):
- Storybook stories serve as visual + interaction tests.
- Quickstart.md (Phase 1 follow-up) will define runnable validation scenarios.
- Manual keyboard/flow testing on refactored screen for each story.

**Release Control**:
- Commit before any preview deploy.
- Tag release if promoting beyond dev.
- Post-deploy verification checklist inherited from constitution.

---

**Total Tasks**: 110
**Tasks per Story**: US1=13, US2=5, US3=4, Setup+Foundational+Polish=9
**Parallel Opportunities**: 14 tasks marked [P]
**Suggested MVP**: US1 (T001–T018) — Component Library Foundation
