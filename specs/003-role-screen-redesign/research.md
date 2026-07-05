# Research: Live Response Logic Correction

## Decision: Add purple as a fourth response scale option

**Rationale**: Lucy specified red/yellow/green/purple with default coefficients 0/1/2/3. The existing system already stores `response_color` and `performance_y` snapshots, so extending the domain union and SQL constraints preserves historical auditability.

**Alternatives considered**:
- UI-only purple button without schema change — rejected because Supabase would reject `purple` and `performance_y = 3`.
- Reusing `green` with different coefficient — rejected because history would not explain the learner-selected option.

## Decision: Centralize response-scale mapping in scoring/UI helpers

**Rationale**: The user wants coefficients to be adjustable through future settings. This slice does not create a fake `/settings` route; it centralizes the mapping so future Admin/Settings work can replace or load configuration without component rewrites.

**Alternatives considered**:
- Hard-code labels/classes inside `ResponseButtons` only — rejected because scoring and UI would drift.
- Build full settings UI now — rejected because navigation truth policy says no fake or empty Settings destination, and this request is a live-room logic correction.

## Decision: Suppress learner controls after any captured round response

**Rationale**: MVP one-response-per-round means after any learner answers, all other learners must stop seeing answer controls. The durable source is the existing `learner_responses` unique round row and `room_rounds.captured_learner_id`.

**Alternatives considered**:
- Disable buttons with explanation — rejected for the active response surface because Lucy requested hiding/no pressing mechanism after capture.
- Client-only broadcast flag — rejected by Supabase-first durable realtime constitution.

## Decision: Block primary teacher advance until capture

**Rationale**: The primary next/advance action must not skip unanswered sentence windows. Teacher can still intentionally close or finish, but the normal advance button and keyboard shortcut should require captured response while round is open.

**Alternatives considered**:
- Confirmation prompt only — rejected because Lucy wants advance available after capture, not a skip path by default.
