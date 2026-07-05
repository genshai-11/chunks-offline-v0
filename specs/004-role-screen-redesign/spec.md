# Feature Specification: Role Screen Redesign

**Feature Branch**: `004-role-screen-redesign`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "Full redesign pass: review and redesign every role screen/layout now. Be clear which component or feature exists inside each tab, such as Dashboard, Library, History. Use role-based UI/UX feedback and frontend design skill for new layout/design."

## Clarifications

### Session 2026-07-04

- Q: What scope should this redesign use? → A: Full redesign pass: review and redesign every role screen/layout now.
- Q: Which navigation/tab taxonomy should the redesign use? → A: Product-area nav: Dashboard, Library, History, Create Room, Live Room, Learner.
- Q: How should each product area show what is inside? → A: Each page has an “Inside this area” feature map plus local section anchors/cards, styled dynamically with icons and minimal text. Use component filters when needed, show only main/summary data, and avoid listing all data in the map.
- Q: What should each top-level product area contain? → A: Strict product areas: Dashboard = map, Library = resources/standards/audio, History = analytics, Create Room = setup, Live Room = teacher control, Learner = join/respond.
- Q: How should redesign execution happen? → A: Review all screens first, then implement by product-area slices. For redesigned pages/components, define the component inventory, design via Stitch or equivalent visual handoff when useful, wait for approval, then bring approved code/design back into the frontend redesign.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clear product-area navigation and tab inventory (Priority: P1)

As a Teacher, Learner, or Admin, I need every major product-area destination and tab to clearly state what features/components are inside it, so I never wonder where Dashboard, Library, History, Create Room, Live Room, or Learner actions live.

**Why this priority**: Navigation truth is the foundation for the redesign. If users cannot map destinations to features, later visual polish will not solve the product-structure problem.

**Independent Test**: A reviewer can open each major product-area destination and identify the visible feature inventory without clicking dead links or reading internal implementation details.

**Acceptance Scenarios**:

1. **Given** a user opens Dashboard, **When** they scan the visible navigation and role shortcuts, **Then** they can see what each destination is for and which workflow starts there.
2. **Given** a user opens Library, **When** they inspect the Inside this area map and local anchors/cards, **Then** they can distinguish resource management, CCI/CVR standards, audio readiness, and History access without seeing the full data list inside the map itself.
3. **Given** a user opens History, **When** they inspect the page, **Then** they can understand completed room/session analytics and learner response history without navigating to fake or empty tabs.

---

### User Story 2 - Role-specific screen review and redesign (Priority: P1)

As the product owner, I need a role-by-role review and redesign pass across Admin, Teacher, and Learner screens, so each role workflow has a clear purpose, feature grouping, and next action.

**Why this priority**: The requested work is not only a visual pass; it must validate whether each screen's logic and grouping match the classroom workflow.

**Independent Test**: Each product-area screen has documented feedback, component inventory, accepted redesign changes, and validation that critical actions still work.

**Acceptance Scenarios**:

1. **Given** the Library product area, **When** the redesign is complete, **Then** resources, standards, and audio readiness are visibly separated by purpose.
2. **Given** the Create Room product area, **When** the redesign is complete, **Then** setup feels like a launch workflow rather than database configuration.
3. **Given** the Live Room product area, **When** the redesign is complete, **Then** Teacher controls, current round, history/queue, roster, audio, progress, and share controls are easy to locate.
4. **Given** the Learner product area, **When** the redesign is complete, **Then** Join, waiting, active response, captured response, and blocked states remain role-isolated and learner-safe.

---

### User Story 3 - Design approval before large layout implementation (Priority: P2)

As Lucy, I need page/component redesigns to be reviewed visually before code changes when the layout meaningfully changes, so frontend implementation follows an approved design direction.

**Why this priority**: The redesign touches multiple screens; approving visual direction before implementation reduces rework and keeps each page purposeful.

**Independent Test**: Each product-area implementation slice has a component inventory and records whether a Stitch/visual handoff was required and approved before code implementation.

**Acceptance Scenarios**:

1. **Given** a product-area slice needs significant new layout, **When** planning starts, **Then** the component inventory and visual design handoff are prepared before frontend edits.
2. **Given** Lucy approves a Stitch or equivalent visual design, **When** implementation begins, **Then** the frontend redesign follows that approved structure.
3. **Given** a slice does not need new visual handoff, **When** implementation begins, **Then** the plan records why existing primitives/tokens are sufficient.

---

### User Story 4 - Design-system aligned layout update (Priority: P2)

As a designer/developer, I need the redesign to use the existing CHUNKS design system and frontend design standards, so screens feel premium while preserving accessibility and classroom clarity.

**Why this priority**: The redesign touches many screens, so consistency matters more than isolated decorative changes.

**Independent Test**: The updated screens reuse shared primitives/tokens, pass accessibility expectations, and avoid reintroducing fake links, oversized cards, or unclear icon-only controls.

**Acceptance Scenarios**:

1. **Given** a redesigned page, **When** it uses new layout treatment, **Then** it follows the frontend design skill and existing CHUNKS tokens/primitives.
2. **Given** a critical action is disabled, **When** a user encounters it, **Then** the interface explains why.
3. **Given** a screen is viewed on desktop and mobile, **When** the layout adapts, **Then** role actions stay reachable without horizontal overflow.

---

### User Story 5 - Logic review with no contract regressions (Priority: P2)

As the implementation team, I need the redesign to review frontend logic and live-room behavior while preserving Supabase room/round/response/scoring contracts, so visual changes do not break the classroom loop.

**Why this priority**: CHUNKS screens are tied to live room state; layout changes must not weaken room state, learner eligibility, scoring history, or release controls.

**Independent Test**: Existing unit/integration tests pass and any new tests cover changed navigation, role screen inventory, and critical live-room state visibility.

**Acceptance Scenarios**:

1. **Given** a live room has no current round, **When** the Teacher opens Live Room, **Then** the redesigned screen still explains the next action.
2. **Given** a learner is waiting, assigned, captured, already responded, or blocked, **When** the learner screen renders, **Then** the redesigned screen still communicates that state.
3. **Given** Admin edits resources or standards, **When** the redesigned Library screen is used, **Then** destructive/batch actions still require confirmation.

### Edge Cases

- The redesign MUST not add navigation items or tabs unless the destination has real content.
- The redesign MUST keep learner routes isolated from Admin/Teacher controls.
- Empty History, empty Library resources, empty roster, loading state, and error state MUST have visible explanations and next actions.
- Very large resource lists and long sentence text MUST remain scannable without hiding primary actions.
- Inside this area maps MUST not show full datasets; they show only orientation, summary metrics, and main actions.
- Any browser-created test rooms used for validation MUST be documented and not treated as production content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present a clear product-area destination map for Dashboard, Library, History, Create Room, Live Room, and Learner.
- **FR-002**: Product areas MUST use strict ownership: Dashboard is the map; Library contains resources, standards, and audio readiness; History contains analytics; Create Room contains setup; Live Room contains Teacher control; Learner contains join/respond flows.
- **FR-003**: Each product-area destination or tab MUST include an “Inside this area” feature map that uses dynamic styling, icons, and minimal user-facing text to identify key features/components without exposing full underlying data lists.
- **FR-004**: Product-area pages with multiple feature groups MUST provide local section anchors, compact cards, or component filters so users can jump to main feature groups without scanning every record.
- **FR-005**: Feature maps MUST show only main/summary data needed for orientation; detailed records remain inside the relevant section or filtered component.
- **FR-006**: The redesign MUST cover all Admin, Teacher, and Learner role screens currently reachable in the app.
- **FR-007**: The redesign MUST include a role-by-role UI/UX feedback record before or alongside frontend edits.
- **FR-008**: The redesign MUST preserve role isolation: learners MUST NOT see Admin or Teacher controls inside learner room flows.
- **FR-009**: The redesign MUST preserve navigation truth: no fake Users, Settings, Help, or empty hash destinations may appear as working routes/tabs.
- **FR-010**: Dashboard MUST serve as the product map and role/destination launcher, not a duplicate data workspace.
- **FR-011**: Library MUST own resources, standards/configuration, and audio readiness; it MUST NOT become the primary analytics/history workspace.
- **FR-012**: History MUST own analytics, completed room/session review, and learner response history.
- **FR-013**: Create Room MUST own room setup and launch preparation; it MUST not feel like database configuration first.
- **FR-014**: Live Room MUST own Teacher control, including Now/Current Round, Queue/History, Roster, Audio, Progress, and Share controls.
- **FR-015**: Learner MUST own join/respond flows and clearly distinguish join, waiting, active response, captured response, already responded, and blocked states.
- **FR-016**: Any new or changed layout MUST use the frontend design skill and the existing CHUNKS design system before implementation.
- **FR-017**: Critical actions MUST remain keyboard accessible, have visible labels, and provide disabled reasons when unavailable.
- **FR-018**: The redesign MUST include tests or documented browser checks for every changed role flow.
- **FR-019**: The redesign MUST begin with a full screen inventory review across all product areas before frontend implementation slices begin.
- **FR-020**: Each product-area slice MUST define its component inventory before redesigning code, including primary content components, filters, summaries, actions, empty states, and error/loading states.
- **FR-021**: When a product-area slice requires significant new layout, the team MUST produce a visual design handoff first, preferably via Stitch when appropriate, and only implement after Lucy approves the design direction.

### Design, Scoring, and Release Alignment *(include for CHUNKS features)*

- System MUST follow `DESIGN.md` and the active frontend design skill when user-visible UI is affected.
- System MUST preserve live-room scoring snapshots, formula versions, learner eligibility rules, and response history semantics.
- System MUST not introduce production deployment or remote database changes without release-control gates: commit, tag when applicable, preview/canary validation, rollback instructions, restore-path verification, and post-deploy checks.

### Key Entities *(include if feature involves data)*

- **Product Area**: A top-level user-facing destination: Dashboard, Library, History, Create Room, Live Room, or Learner.
- **Role Destination**: A product area or route owned by a role, including label, purpose, owned role, visible features, and next action.
- **Inside This Area Map**: An icon-led, minimal-text orientation component that summarizes key features and main actions inside a product area without listing all data.
- **Screen Inventory Item**: A review record for a screen or major panel; includes role, route, current UX issue, proposed redesign, accepted changes, validation status, and whether a Stitch/visual handoff is required.
- **Component Inventory Item**: A component or feature block inside a product area, such as sentence display, resource filters, summary metrics, standards editor, queue controls, roster, audio controls, progress, or learner response buttons.
- **Feature Group**: A visible group of related controls/content inside a screen, such as Resource Manager, Standards, Audio Readiness, Current Round, Queue, Roster, Progress, or Learner Response.
- **Role State**: A role-specific UI state such as loading, empty, error, waiting, active, captured, blocked, or finished.
- **Visual Handoff**: A Stitch or equivalent approved design artifact used before implementing significant new page/component layout.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can identify the purpose and contained features of Dashboard, Library, History, Create Room, Live Room, and Learner in under 60 seconds per destination using the Inside this area map and local anchors/cards.
- **SC-002**: 100% of redesigned role screens have documented feedback, accepted change notes, and validation evidence.
- **SC-003**: 0 primary navigation items point to empty, fake, or unimplemented destinations after redesign.
- **SC-004**: 100% of critical changed actions retain visible labels, keyboard access, and disabled-state explanation where applicable.
- **SC-005**: Existing automated tests pass, and new/updated tests cover navigation truth, role screen inventory, and the most important changed role workflows.
- **SC-006**: Browser visual validation covers Dashboard, Library, History, Create Room, Live Room, Learner Join, and Learner Room before the redesign is considered complete.
- **SC-007**: 100% of product-area implementation slices have a component inventory before code changes begin.
- **SC-008**: Any product-area slice using Stitch or a visual handoff records approval before frontend implementation begins.

## Assumptions

- The redesign is a frontend/product-structure pass and does not require remote Supabase schema changes.
- The redesign uses a product-area navigation taxonomy: Dashboard, Library, History, Create Room, Live Room, and Learner.
- Product ownership is strict: Dashboard = map; Library = resources/standards/audio; History = analytics; Create Room = setup; Live Room = teacher control; Learner = join/respond.
- Each product-area page uses an icon-led, minimal-text Inside this area map plus local anchors/cards; detailed data is intentionally kept out of the map unless needed as a summary metric.
- Existing role routes remain the starting point unless future clarification explicitly approves new routes or aliases for the product-area taxonomy.
- The current CHUNKS design system, primitives, and tokens remain the default foundation.
- The redesign may update documentation, tests, and frontend code, but production deployment is out of scope for this spec.
- Full redesign pass means every reachable role screen is reviewed first, then improved by product-area slices and validated incrementally.
- Stitch/design handoff is used for significant page or component redesigns when visual approval is needed before code changes.
