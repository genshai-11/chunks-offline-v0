# Feature Specification: CHUNKS Mirror / Offline Live Room Frontend

**Feature Branch**: `001-offline-live-room-frontend`
**Created**: 2026-07-03
**Status**: Draft
**Input**: User description: "Create workflow files before implementation/deployment, including constitution and plan, while preparing the frontend app using the overview and DESIGN-coinbase.md adapted to CHUNKS Red. Add Theme 2 Bauhaus as a selectable/active visual style option."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Teacher starts a live room and controls a sentence window (Priority: P1)
Teacher Host creates a room, selects approved resources and CCI standard, receives room code/share link, opens an assigned-mode round, sees current sentence window state, controls EN/VI audio playback for the classroom, and sees current sequence position (current sentence / total room resources).

**Why this priority**: Without a teacher-controlled room and active round, learners have nothing to join or answer.

**Independent Test**: With seeded resources and CCI cards, a teacher creates one room, opens one assigned round, closes it, and advances to the next sentence.

**Acceptance Scenarios**:
1. **Given** approved sentence resources and an active CCI card, **When** the teacher creates a room, **Then** the room enters lobby state with a unique room code and share link.
2. **Given** a room in lobby with at least one member, **When** the teacher opens an assigned round, **Then** the round snapshots sentence, capture mode, assigned learner, CCI value, CVR value, opened time, audio language selection, and sequence index.
3. **Given** an open round, **When** the teacher closes it, **Then** learners can no longer submit and the teacher can advance.
4. **Given** a current or next sentence has EN/VI audio, **When** the teacher starts or advances the sentence window, **Then** the selected audio language can play through the teacher device using browser audio playback and can be replayed/stopped without changing response history.
5. **Given** at least one learner response is captured for the current round, **When** the teacher presses the configured keyboard shortcut, **Then** the room closes the current round if needed and advances to the next sentence while preserving exactly one tracked result per round.

---

### User Story 2 - Learner joins and submits Red / Yellow / Green response (Priority: P2)
Learner opens a share link or enters a room code, provides display name, joins anonymously, sees current round status and sentence code only (not full EN/VI sentence detail), hears classroom audio from the teacher device, and submits exactly one eligible Red / Yellow / Green response.

**Why this priority**: Learner response capture is the core classroom interaction.

**Independent Test**: Learner joins a prepared active room, sees eligibility state, submits one response, and receives captured/already-responded state.

**Acceptance Scenarios**:
1. **Given** a valid room code, **When** the learner enters display name, **Then** they join the roster using anonymous identity.
2. **Given** assigned mode and the learner is assigned, **When** learner taps Green, **Then** response is captured with learner performance value 2 and reflection time.
3. **Given** assigned mode and learner is observing, **When** response buttons render, **Then** buttons are disabled with an observing explanation.
4. **Given** learner has already responded, **When** they tap another response, **Then** duplicate is rejected.
5. **Given** a round is open, **When** the learner screen renders, **Then** it shows the room, round, sentence code, eligibility, and response controls without exposing the full sentence text prompt.

---

### User Story 3 - Teacher and Learner see progress and captured response summaries (Priority: P3)
After each valid response, Teacher sees captured learner and round result; Learner sees personal progress cards and last captured response details.

**Why this priority**: Immediate feedback verifies scoring correctness and makes the loop useful.

**Independent Test**: After one captured response, both screens show response color, reflection time, CCI A, CPD V, and updated totals.

**Acceptance Scenarios**:
1. **Given** a captured response, **When** progress updates, **Then** learner cards show response count, color counts, highest CPD, total CPD, and average reflection time.
2. **Given** a captured response, **When** teacher reviews the round, **Then** teacher sees captured learner, response status, CCI, CPD, and round status.

---

### User Story 4 - Admin prepares resources, audio, CVR, CCI, and session analytics (Priority: P4)
Admin manages courses, lessons, sections, sentence resources, missing EN/VI audio generation, audio URLs, CVR Ω, approval status, CCI categories/cards, and dashboard analytics by live session and learner.

**Why this priority**: Admin tools are required for production operation but seeded/imported MVP data can support earlier stories.

**Independent Test**: Admin creates or edits one approved sentence resource and one active CCI card; teacher setup can select both.

**Acceptance Scenarios**:
1. **Given** Admin opens Resource Manager, **When** they approve a sentence with CVR Ω and audio, **Then** it becomes available for teacher selection.
2. **Given** Admin opens CCI Standard Manager, **When** they create an active card, **Then** Teacher can choose it.
3. **Given** approved resources are missing EN or VI audio, **When** Admin starts a selected-resource or generate-all-missing secure audio generation job, **Then** missing audio is queued with deterministic storage paths, generated/uploaded server-side or by a secure operator script, and resource audio URLs are updated without exposing provider API keys in the browser.
4. **Given** a completed live room, **When** Admin opens analytics, **Then** they can review session-level and learner-level response counts, color mix, CCI, CPD, reflection time, and per-learner distribution.

### Edge Cases
- Invalid, expired, finished, or full room codes show a clear error and retry path.
- Refresh retains learner room membership and current state.
- Concurrent taps in first-responder mode capture only the first valid response.
- Assigned-mode submissions from non-assigned learners are rejected even if client UI is manipulated.
- Missing audio does not block text response, but Teacher audio controls must clearly show unavailable EN/VI tracks.
- Closing a round while learner taps produces either one valid response or a closed-round rejection, never duplicates.
- Batch Admin actions require confirmation and show partial failure details.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST provide role entry for Admin, Teacher Host, and Learner.
- **FR-002**: System MUST allow Teacher Host to create a Room with resource scope, response capture mode, scoring mode, and CCI standard.
- **FR-003**: System MUST generate and display unique room code and share link.
- **FR-004**: System MUST snapshot selected sentence resources and room scoring settings.
- **FR-005**: System MUST allow learners to join by share link or room code with display name and anonymous identity.
- **FR-006**: System MUST maintain room membership and expose roster to Teacher Host.
- **FR-007**: System MUST allow Teacher Host to open, close, advance, and finish rounds.
- **FR-008**: System MUST snapshot capture mode, assigned learner, CCI X, CVR Ω, opened time, audio language selection, and sequence index per round.
- **FR-009**: System MUST display full sentence text/prompt EN/VI, sentence code, audio EN/VI availability, current index/total, and playback controls to Teacher Host; learner screens MUST display sentence code, round status, and eligibility without exposing full sentence text.
- **FR-010**: System MUST provide Red, Yellow, and Green response buttons mapped by default to 0, 1, and 2.
- **FR-011**: System MUST prevent ineligible, duplicate, or closed-round responses on UI and persistence paths.
- **FR-012**: System MUST calculate and store reflection time for every captured response.
- **FR-013**: System MUST calculate simple scoring as CCI = CCI X × Learner Performance Y and CPD = CCI × CVR Ω.
- **FR-014**: System MUST store scoring snapshots on every response.
- **FR-015**: System MUST update learner progress summaries.
- **FR-016**: System MUST provide Admin screens for resources, CVR Ω, approval status, CCI standards, missing-audio status, and session/learner analytics dashboards.
- **FR-017**: System MUST require confirmation before Admin batch actions.
- **FR-021**: System MUST provide Teacher audio controls for EN/VI source selection, replay, stop, playback-rate guardrails, and optional auto-play when opening/advancing a round.
- **FR-022**: System MUST provide Teacher keyboard shortcuts for replay/stop/advance that are disabled while typing in form fields and only advance automatically after the current round has a captured response or explicit teacher confirmation.
- **FR-023**: System MUST support Teacher resource filtering before session creation and limited in-session filtering of unplayed resources while preserving prior round history.
- **FR-024**: System MUST store one tracked response per round and support session distributions where a 100-sentence room with 5 learners can produce approximately 20 learner records each under assigned/auto-rotate flows.
- **FR-025**: System MUST support secure selected-resource and generate-all-missing audio generation for EN/VI resources via server-side job or secure operator script; provider API keys MUST NOT be stored in frontend code or logs, and queued jobs MUST use deterministic storage paths shaped as `sentence-audio/{courseId}/{lessonId}/{sentenceCode}-{language}.mp3`.
- **FR-018**: System MUST render frontend using centralized design tokens from `DESIGN.md`, supporting Theme 1 calm classroom console, active Theme 2 Bauhaus classroom poster, selectable Theme 3 CHUNKS Modular Learning Aesthetic, and selectable Theme 4 Craft Minimal Chunking.
- **FR-019**: System MUST provide loading, empty, error, waiting, assigned, observing, captured, already-responded, and round-closed states.
- **FR-020**: System MUST include pre-deploy workflow with commit/tag, preview/canary, rollback, restore-path, and post-deploy gates.

### Design, Scoring, and Release Alignment *(include for CHUNKS features)*
- UI follows `DESIGN.md`; current default style is Theme 2 Bauhaus, while Theme 1 calm classroom console, Theme 3 CHUNKS Modular Learning Aesthetic, and Theme 4 Craft Minimal Chunking remain selectable alternatives. Response Red / Yellow / Green semantics must remain explicit and accessible.
- Response history stores Y, X, Ω, formula version, scoring mode, and reflection-time snapshots.
- Production release is blocked until git history, preview validation, rollback, and restore path are verified.

### Key Entities *(include if feature involves data)*
- **Course**: Top-level grouping of lessons.
- **Lesson**: Learning unit within a course.
- **Section**: Ordered subdivision of a lesson.
- **Sentence Resource**: Prompt/audio item with EN/VI text, audio URLs, CVR Ω, approval status, and ordering.
- **CCI Category**: Grouping of CCI standards.
- **CCI Standard Card**: Selectable CCI Standard X value with label, active/default status, and unit A.
- **Room / Live Session**: Teacher-controlled live session with room code, resource scope snapshot, settings, and status.
- **Room Membership**: Learner identity, display name, and state inside a room.
- **Round / Sentence Window**: Room-specific sentence window with status and scoring snapshots.
- **Response**: One tracked valid learner response for a round.
- **Learner Progress Summary**: Per-room, per-learner summary used for progress cards.

## Success Criteria *(mandatory)*
### Measurable Outcomes
- **SC-001**: Teacher can create a room and open the first assigned round in under 2 minutes using prepared resources.
- **SC-002**: Learner can join by room code/share link and submit an eligible response in under 60 seconds.
- **SC-003**: 95% of valid responses update teacher and learner visible state within 2 seconds under a 30-learner room load.
- **SC-004**: 100% of captured responses store scoring snapshots sufficient to explain displayed CCI and CPD.
- **SC-005**: Duplicate, ineligible, or closed-round submissions produce zero duplicate tracked responses in validation testing.
- **SC-006**: Critical learner response controls meet 44px touch target, visible focus, and contrast validation.
- **SC-007**: Pre-production validation includes documented preview/canary pass, rollback path, restore path, and post-deploy checklist completion.

## Assumptions
- MVP targets responsive browser app, not native mobile.
- MVP "Offline Live Room" means an in-person classroom session using online Supabase-backed state.
- Seed/imported resources may support first MVP before full Admin import tooling.
- Supabase Anonymous Auth is learner identity default.
- Assigned capture mode and simple scoring are MVP defaults.
- Timed scoring, all-class mode, and network-offline sync are future enhancements.
- Repository must be initialized as git before implementation/deploy release controls can be fully enforced.
