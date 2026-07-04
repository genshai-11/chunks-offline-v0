# Tasks: Component Library Foundation + Visual Language & Theming Audit

**Feature Branch**: `002-component-library-foundation` | **Date**: 2026-07-04 | **Spec**: `spec.md`

**Input**: Feature specification from `spec.md`, implementation plan from `plan.md`, research decisions from `research.md`

## Phase 1: Setup

- [ ] T001 Initialize Storybook for component documentation in `frontend/`
- [ ] T002 [P] Configure Tailwind CSS theming structure (tokens, variants) in `frontend/tailwind.config.js`
- [ ] T003 [P] Set up component primitives directory structure under `frontend/src/components/primitives/`

## Phase 2: Foundational

- [ ] T004 Audit existing UI components and styling patterns across Admin/Teacher/Learner flows (document in `research.md` appendix)
- [ ] T005 Define primitive contract interface (variants, states, sizes, accessibility props) in `frontend/src/components/primitives/types.ts`

## Phase 3: User Story 1 - Establish Component Library Foundation (P1)

**Goal**: Teams can rely on reusable UI primitives (Button, Card, Panel, Input, Select, Badge, Tooltip, Dialog, Toast, Progress, Skeleton) that expose variants, states, sizes, and composition.

**Independent Test**: Refactor or create one complete screen (e.g., Teacher control view) using only the new primitives; verify no custom per-screen styling remains for core interactions.

**Acceptance Scenarios** (from spec.md):
1. Existing interface using basic components → applies primitives → uses only documented variants/states
2. Need for new size/state (loading, disabled with explanation) → primitive provides behavior without custom code
3. Same primitive used across Admin/Teacher/Learner → visual and interaction contract identical

### Tasks

- [ ] T006 [P] [US1] Implement Button primitive with variants (primary, secondary, ghost, destructive), sizes, states (loading, disabled), and accessibility in `frontend/src/components/primitives/Button.tsx`
- [ ] T007 [P] [US1] Implement Card primitive (header, content, footer slots) with elevation variants in `frontend/src/components/primitives/Card.tsx`
- [ ] T008 [P] [US1] Implement Panel primitive for layout containers with responsive padding in `frontend/src/components/primitives/Panel.tsx`
- [ ] T009 [P] [US1] Implement Input primitive with validation states, disabled explanations, and helper text in `frontend/src/components/primitives/Input.tsx`
- [ ] T010 [P] [US1] Implement Select primitive (single/multi) with keyboard navigation and disabled states in `frontend/src/components/primitives/Select.tsx`
- [ ] T011 [P] [US1] Implement Badge primitive with semantic color variants (success, warning, error, info) in `frontend/src/components/primitives/Badge.tsx`
- [ ] T012 [P] [US1] Implement Tooltip primitive with positioning, delay, and accessibility in `frontend/src/components/primitives/Tooltip.tsx`
- [ ] T013 [P] [US1] Implement Dialog primitive (modal, alert, confirmation) with focus trap and escape handling in `frontend/src/components/primitives/Dialog.tsx`
- [ ] T014 [P] [US1] Implement Toast primitive (success, error, info, warning) with auto-dismiss and action buttons in `frontend/src/components/primitives/Toast.tsx`
- [ ] T015 [P] [US1] Implement Progress primitive (linear, circular) with ARIA live regions in `frontend/src/components/primitives/Progress.tsx`
- [ ] T016 [P] [US1] Implement Skeleton primitive for loading states with shimmer animation in `frontend/src/components/primitives/Skeleton.tsx`
- [ ] T017 [US1] Create Storybook stories for all primitives with controls for variants/states/sizes in `frontend/src/components/primitives/*.stories.tsx`
- [ ] T018 [US1] Validate US1 acceptance scenarios on one refactored screen (e.g., TeacherSetupPage) using only primitives

## Phase 4: User Story 2 - Audit and Refresh Visual Language & Theming (P2)

**Goal**: Visual language and theming definitions are centralized so updates apply everywhere without touching individual components or screens. Stitch MCP used for design-time exploration.

**Independent Test**: Apply a defined visual language change (e.g., tone down decorative treatments in primary theme) and confirm all major flows update consistently with no per-file overrides.

**Acceptance Scenarios** (from spec.md):
1. Active design language adjusted centrally → change appears across Admin/Teacher/Learner interfaces
2. User/admin switches themes → primitives respect theme while preserving learner-safe clarity/contrast
3. Completed audit → any screen uses only approved language without unique exceptions

### Tasks

- [ ] T019 [P] [US2] Run Stitch MCP to generate 2-3 visual language variants aligned with Theme 1 (calm classroom) and Theme 2 (Bauhaus poster) — export tokens/guidelines
- [ ] T020 [US2] Present Stitch-generated variants to user for explicit review & confirmation before any token mapping or project-wide theming changes
- [ ] T021 [US2] Map Stitch MCP output tokens to Tailwind CSS configuration and CSS custom properties in `frontend/tailwind.config.js` and `frontend/src/styles/tokens.css`
- [ ] T022 [US2] Update `DESIGN.md` with Stitch-derived visual language guidelines (typography scale, color palette, spacing, elevation, border radius)
- [ ] T023 [P] [US2] Refactor existing theme switcher to apply new centralized tokens through primitives (no per-screen overrides)
- [ ] T024 [US2] Validate US2 acceptance scenarios: central theme change propagates to all role flows without file edits

## Phase 5: User Story 3 - Maintain Accessibility and Consistency During Evolution (P3)

**Goal**: All interactive elements and layouts continue to meet accessibility expectations (44px targets, focus visibility, contrast, disabled explanations) while component library and visual language evolve.

**Independent Test**: Run accessibility checks or manual validation on primary flows after changes; confirm all critical controls satisfy size, focus, and state-visibility rules.

**Acceptance Scenarios** (from spec.md):
1. Response controls/action docks use primitives → disabled states clearly explain unavailability to learners
2. Theme/visual language updates applied → focus indicators, contrast, touch targets remain compliant

### Tasks

- [ ] T025 [P] [US3] Audit all primitives for 44px minimum touch targets, focus rings, and ARIA compliance (document gaps)
- [ ] T026 [US3] Add or enhance disabled-state explanations (via `title`, helper text, or `aria-describedby`) on all interactive primitives
- [ ] T027 [US3] Run automated accessibility scan (axe-core or equivalent) on Storybook stories and primary flows; fix violations
- [ ] T028 [US3] Validate US3 acceptance scenarios: learner response flow and theme-switched screens meet accessibility baseline

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T029 Update component index exports and barrel files for clean imports in `frontend/src/components/primitives/index.ts`
- [ ] T030 Document migration guide for incremental adoption of primitives (in `research.md` or new `MIGRATION.md`)
- [ ] T031 Run full Constitution Check and accessibility re-validation before marking feature complete
- [ ] T032 Commit changes with release-control tag (if production path) and update changelog

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

**Total Tasks**: 31
**Tasks per Story**: US1=13, US2=5, US3=4, Setup+Foundational+Polish=9
**Parallel Opportunities**: 14 tasks marked [P]
**Suggested MVP**: US1 (T001–T018) — Component Library Foundation
