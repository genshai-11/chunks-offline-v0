# Feature Specification: Live Response Logic Correction

**Feature Branch**: `003-role-screen-redesign`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User correction: learner screen uses one active sentence identifier, four minimal color/icon responses, one captured response locks other learners, and teacher primary advance requires capture.

## Clarifications

### Session 2026-07-04

- Q: How should the live learner response screen behave during a teacher session? → A: The teacher session starts from a filtered sentence list. The learner screen shows only the active sentence identifier/code, not full English/Vietnamese/prompt text. Learners answer with four icon/color response controls: red, yellow, green, and purple. Their stored coefficients are 0, 1, 2, and 3 respectively, with centralized scale configuration for future settings.
- Q: What happens after any learner answers a first-responder round? → A: Because MVP tracks one response per round/window, all other learner screens must lose the ability to answer as soon as the round has a captured response; hide or suppress response controls rather than leaving disabled buttons visible.
- Q: When may the teacher move to the next sentence? → A: During an open round, the teacher may advance only after one learner response has been captured. The teacher can still close/finish intentionally, but the primary next/advance action must not skip an unanswered sentence window.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Four-response learner scale (Priority: P1)

As a learner, I need the active response controls to include red, yellow, green, and purple choices so my classroom answer can represent the full corrected response scale.

**Why this priority**: The response scale drives scoring snapshots and learner progress; it must be correct before UI styling or analytics changes.

**Independent Test**: A learner room with an open round shows four accessible response choices and saves the selected color/coefficient correctly.

**Acceptance Scenarios**:

1. **Given** a learner is eligible to answer an open round, **When** the learner screen renders, **Then** four minimal response choices are available: red, yellow, green, and purple.
2. **Given** a learner selects purple, **When** the response is saved, **Then** the stored performance coefficient is 3 and existing scoring snapshots remain explainable.

---

### User Story 2 - Captured response locks other learners (Priority: P1)

As a learner who did not answer first, I need response controls to disappear after another learner is captured so I do not try to submit a second response for the same round.

**Why this priority**: The MVP live-room contract tracks one response per round/window; the UI must reflect the durable captured state.

**Independent Test**: Render two learners against the same open round; after one captured response exists, the other learner no longer sees response controls.

**Acceptance Scenarios**:

1. **Given** a first-responder round is open, **When** any learner response is captured, **Then** all other learner screens suppress response controls for that round.
2. **Given** a learner refreshes after capture, **When** the room state loads, **Then** the learner cannot submit a late response for the captured round.

---

### User Story 3 - Teacher advance requires capture (Priority: P1)

As a teacher, I need the primary next/advance action to wait for a captured response so I do not accidentally skip an unanswered sentence window.

**Why this priority**: Teacher control drives classroom rhythm and protects response history completeness.

**Independent Test**: Teacher room with an open round and no response has disabled primary advance; after capture, advance becomes available.

**Acceptance Scenarios**:

1. **Given** an open round has no captured response, **When** the teacher tries the primary Advance action or shortcut, **Then** the action is blocked and explains capture is required.
2. **Given** an open round has a captured response, **When** the teacher advances, **Then** the room moves to the next sentence normally.

---

### User Story 4 - Preserve progress/history contracts (Priority: P2)

As the implementation team, I need purple responses and captured lockout to preserve progress, analytics, and historical scoring behavior.

**Why this priority**: Response history must remain auditable after extending the scale.

**Independent Test**: Existing progress and analytics tests pass; purple response summaries do not break red/yellow/green history.

**Acceptance Scenarios**:

1. **Given** historical red/yellow/green responses exist, **When** purple support is added, **Then** prior response history remains valid.
2. **Given** progress summaries include responses, **When** purple is present, **Then** totals and summaries render without errors.

### Edge Cases

- Learner live-room screens MUST not reveal full sentence text/prompt content while the teacher is playing the current sentence; use sentence code/identifier only.
- First-responder race conditions MUST converge on the single persisted round response; late learner screens must stop offering response controls after `captured_learner_id` or an existing round response is present.
- Teacher close/finish remains intentional control, but primary next/advance MUST not skip an unanswered open round.
- Existing red/yellow/green history must remain valid after purple is added.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Learner live-room response controls MUST support four response choices: red, yellow, green, and purple.
- **FR-002**: The response scale MUST map red/yellow/green/purple to coefficients 0/1/2/3 by default and keep the mapping centralized for future settings/configuration changes.
- **FR-003**: Learner live-room screens MUST show the active sentence identifier/code only, not full sentence text, translations, or prompt details.
- **FR-004**: In one-response-per-round flow, learner response controls MUST be hidden or suppressed after any learner response has been captured for the active round.
- **FR-005**: Teacher primary advance/next controls MUST require a captured response while the current round is open, preventing accidental skip to the next sentence.
- **FR-006**: Supabase schema, TypeScript domain types, scoring logic, and validation tests MUST accept the purple response and performance coefficient 3 without breaking historical red/yellow/green responses.
- **FR-007**: Critical learner/teacher controls MUST remain keyboard accessible and expose accessible names even when visually minimal.

### Design, Scoring, and Release Alignment *(include for CHUNKS features)*

- System MUST preserve live-room scoring snapshots, formula versions, learner eligibility rules, and response history semantics.
- System MUST treat the response scale as scoring configuration: red/yellow/green/purple default to 0/1/2/3, and future settings work must change the scale through centralized configuration or reviewed migrations rather than scattered UI literals.
- System MUST not introduce production deployment or remote database changes without release-control gates: commit, tag when applicable, preview/canary validation, rollback instructions, restore-path verification, and post-deploy checks.

### Key Entities *(include if feature involves data)*

- **Response Scale Option**: A configurable learner response choice with color/icon identity, default coefficient, accessible label, and stored response color/performance snapshot.
- **Learner Response**: The one tracked response for a round/window, storing response color, performance coefficient, scoring snapshots, formula version, and reflection inputs.
- **Room Round**: The active sentence window with status and captured learner state.
- **Captured Round Lock**: The one-response-per-round state where `room_rounds.captured_learner_id` or an existing `learner_responses` row suppresses further learner response controls.
- **Teacher Advance Gate**: Derived teacher control state that permits primary advance only after capture while a round is open.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Automated tests prove red/yellow/green/purple map to coefficients 0/1/2/3.
- **SC-002**: Automated tests prove learner controls hide after captured round state for another learner.
- **SC-003**: Automated tests prove teacher primary advance is blocked until capture during an open round.
- **SC-004**: Existing progress, analytics, and live-room tests pass after the response scale change.
- **SC-005**: Browser/manual validation confirms the learner active screen shows sentence identifier only and minimal accessible color/icon controls.

## Assumptions

- This slice is a live-room logic correction and not the full product-area redesign pass.
- A full `/settings` screen is not part of this slice; this slice centralizes response-scale configuration so future real Settings/Admin configuration work can edit it without changing learner components.
- No remote Supabase migration is applied without explicit approval and release controls.
