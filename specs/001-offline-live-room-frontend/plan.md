# Implementation Plan: CHUNKS Mirror / Offline Live Room Frontend

**Branch**: `001-offline-live-room-frontend` | **Date**: 2026-07-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-offline-live-room-frontend/spec.md`

## Summary
Build a responsive frontend-first CHUNKS Mirror live classroom app where Admin prepares sentence, audio, CVR, CCI, and analytics data; Teacher Host creates live rooms, controls rounds, plays EN/VI sentence audio from the teacher device, and advances by keyboard after learner responses; and Learners join by link/code to submit Red / Yellow / Green responses while seeing only sentence code/status, not full answer text. Supabase provides durable room state, anonymous learner auth, Postgres-backed scoring snapshots, and realtime updates. UI follows root `DESIGN.md` with centralized theme tokens; the current default style is Theme 2 Bauhaus while Theme 1 calm classroom console, Theme 3 CHUNKS Modular Learning Aesthetic, and Theme 4 Craft Minimal Chunking remain available as documented selectable themes.

## Technical Context
**Language/Version**: TypeScript for frontend/shared scoring; SQL for Supabase migrations.
**Primary Dependencies**: React + Vite frontend, Tailwind CSS, Supabase JavaScript client, Vitest/React Testing Library, Playwright.
**Storage**: Supabase Postgres, Supabase Auth, Supabase Realtime, optional Supabase Storage for audio.
**Testing**: Vitest unit/scoring tests, React Testing Library UI state tests, Playwright Teacher/Learner flows, Supabase migration validation.
**Target Platform**: Responsive web app for desktop teacher screens and learner mobile browsers.
**Project Type**: Web application with frontend source under `frontend/` and Supabase assets under `supabase/`.
**Performance Goals**: Visible response-state updates within 2 seconds for 30 concurrent learners in one room.
**Constraints**: No hard-coded scoring history; one tracked Response per Round for MVP; learner controls expose eligibility state; learner room hides full sentence text and shows sentence code only; teacher audio playback must use browser-safe playback with stop-before-play, replay/stop controls, EN/VI selection, and no response-history mutation; all theme-specific visuals must stay centralized in CSS tokens/reusable primitives; production deploy requires commit/tag/preview/rollback/restore verification.
**Scale/Scope**: MVP supports one teacher-controlled room with up to 30 learners and prepared/imported sentence resources. A typical 100-sentence session with 5 learners should create roughly 100 total response records, distributed by assignment/rotation at about 20 records per learner when evenly assigned.

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Domain-Led Live Learning Core: Admin → Teacher → Learner → scoring loop preserved.
- ✅ Supabase-First Durable Realtime State: Postgres is source of truth; realtime derives from durable changes.
- ✅ Learner-Safe UX and Accessibility: learner states, disabled reasons, focus/contrast/touch targets included; Theme 2 Bauhaus, Theme 3 Modular, and Theme 4 Craft Minimal must not reduce response-state clarity.
- ✅ Dynamic Scoring and Historical Auditability: response snapshots include Y, X, Ω, formula version, scoring mode, reflection time.
- ✅ Testable Incremental Delivery and Release Control: stories are independently testable; tasks include tests and release gates.
- ✅ Release history baseline: repository is initialized as git. Deployment still requires commit, tag when applicable, preview/canary validation, rollback, restore-path verification, and post-deploy checks.

## Project Structure
### Documentation (this feature)
```text
specs/001-offline-live-room-frontend/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── pre-deploy-workflow.md
├── contracts/
│   ├── ui-routes.md
│   └── supabase-contracts.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)
```text
DESIGN.md
frontend/
├── package.json
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── src/
│   ├── app/
│   ├── components/
│   ├── features/{admin,teacher,learner,live-room}/
│   ├── lib/{scoring,supabase}/
│   ├── routes/
│   └── styles/
└── tests/{e2e,integration,unit}/

supabase/
├── migrations/
├── seed.sql
└── tests/
```

**Structure Decision**: Use dedicated `frontend/` because the repo currently contains learning materials and Supabase metadata but no app package. Keep Supabase migrations and seed data under `supabase/`.

## Complexity Tracking
| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Phase 0: Research
Completed in [research.md](./research.md).

## Phase 1: Design & Contracts
Completed artifacts: [data-model.md](./data-model.md), [contracts/ui-routes.md](./contracts/ui-routes.md), [contracts/supabase-contracts.md](./contracts/supabase-contracts.md), [quickstart.md](./quickstart.md), [pre-deploy-workflow.md](./pre-deploy-workflow.md).

## Room Session Playback & Analytics Refinement
- Teacher room should adapt the `CHUNKS-MIRROR-SOUND` playback pattern: a small browser audio adapter owns one `HTMLAudioElement`, calls `stop()` before every new play, clamps playback rate to a safe range, exposes `isPlaying()`, and swallows cleanup errors while surfacing `play()` failures to the UI.
- Teacher can choose EN or VI audio for current/next sentence. If selected language is missing, UI must show unavailable state and allow text-only progression.
- Opening/advancing a round may optionally auto-play the selected audio for the classroom; replay/stop must not create or mutate learner response records.
- Teacher room must show `current index / total resources` based on `availableSentences` and `currentRound.sentence_resource_id`; next sentence preview should show code and audio availability.
- Keyboard shortcuts should be scoped to the teacher room, ignored while focus is in input/select/textarea/contenteditable, and gated so Advance only proceeds after a captured response exists for the current round or after explicit teacher confirmation to skip.
- Learner room should render sentence code, room/round status, eligibility, response buttons, and progress; it should not expose `text_en`, `text_vi`, or prompt detail during the live response window.
- Admin audio generation must stay server-side or operator-script driven. Browser Admin UI may enqueue/trigger a secure job and show status, but must never store or log provider API keys such as `NINEROUTER_KEY`.
- Admin analytics should provide session and learner dashboards over persisted rooms, rounds, responses, and progress summaries, including response count, color mix, CCI, CPD, reflection time, and per-learner distribution.

## Post-Design Constitution Check
- ✅ Data model includes durable entities and scoring snapshots.
- ✅ Contracts include eligibility, duplicate-response, and closed-round validation behavior.
- ✅ Quickstart validates teacher, learner, scoring, and progress flows before deploy.
- ✅ Pre-deploy workflow encodes commit/tag/preview/rollback/restore/post-deploy requirements.
- ✅ Git is initialized. Production deployment remains blocked until release candidate changes are committed, tagged when applicable, preview-validated, and rollback/restore paths are verified.
