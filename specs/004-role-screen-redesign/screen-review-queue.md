# Screen Review Queue - Role Screen Redesign

**Feature**: 004-role-screen-redesign
**Purpose**: Drive the review -> feedback -> edit loop for every reachable product-area screen.
**Workflow**: Review one screen slice, collect Lucy feedback by keyword, then edit only the approved slice and validate it before moving to the next screen.
**Status**: active review queue

## Review Rules

- Use CodeGraph before editing any runtime source file in the slice.
- Do not implement large layout changes without an approved visual direction.
- Keep product-area ownership strict:
  - Dashboard = product map
  - Library = resources, standards, audio readiness
  - History = analytics and completed sessions
  - Create Room = setup and launch preparation
  - Live Room = teacher control
  - Learner = join and respond
- Keep navigation truthful: no fake Users, Settings, Help, or empty tabs.
- Keep learner routes role-isolated.
- Use existing CHUNKS tokens/primitives unless the slice explicitly needs a new shared primitive.
- After each edit, run focused tests or browser checks named in that screen row.

## Current Review Order

| Order | Slice | Routes | Decision needed before edit | Runtime files |
|---:|---|---|---|---|
| 1 | Navigation + Dashboard | `/` and shared shell | Pick `COMMAND MAP`, `CLASSROOM LOOP`, or `READINESS FIRST` | `frontend/src/components/layout/TopNavigation.tsx`, `frontend/src/routes/RoleEntryPage.tsx` |
| 2 | Library | `/admin` | Choose whether to keep small Inside-this-area patch or use Stitch Library layout | `frontend/src/features/admin/AdminWorkspacePage.tsx`, `frontend/src/features/admin/resources/ResourceManager.tsx` |
| 3 | History | `/admin#history-analytics` | Choose whether History stays as Admin hash alias or needs stronger separate visual treatment | `frontend/src/features/admin/AdminWorkspacePage.tsx`, `frontend/src/features/admin/analytics/SessionAnalyticsDashboard.tsx` |
| 4 | Create Room | `/teacher/setup` | Approve setup-as-launch-preparation hierarchy | `frontend/src/features/teacher/TeacherSetupPage.tsx` |
| 5 | Live Room | teacher room routes | Approve live-session hierarchy before changing dense controls | `frontend/src/features/teacher/TeacherRoomPage.tsx`, `frontend/src/features/teacher/components/*` |
| 6 | Learner Join | `/room/:roomCode` join state | Approve mobile-safe learner entry flow | `frontend/src/features/learner/LearnerJoinPage.tsx` |
| 7 | Learner Room | `/room/:roomCode` response state | Approve response-first mobile/desktop hierarchy | `frontend/src/features/learner/LearnerRoomPage.tsx`, `frontend/src/features/learner/components/*` |

## 1. Navigation + Dashboard

**Purpose**: Make the home screen answer "Where do I go next?" and expose the approved product areas.

**Main components today**:
- `TopNavigation`
- `AppShell`
- `RoleEntryPage`
- Dashboard flow panel
- Role shortcuts
- Readiness/design check cards

**Current issue**: Dashboard still reads as a role shortcut board. Navigation has Dashboard, Library, History, Teacher, Learner, but the approved taxonomy needs Dashboard, Library, History, Create Room, Live Room, Learner.

**Baseline evidence**:
- Current screenshot: `specs/004-role-screen-redesign/current-dashboard-baseline.png`
- Baseline captured from local Vite on 2026-07-04 at `/`.
- Rendered `h1`: `Dashboard`.
- Rendered primary nav text: `DashboardHome`, `LibraryAdmin`, `HistoryAnalytics`, `TeacherHost`, `LearnerRoom`.
- Gap confirmed: Create Room and Live Room are not separate navigation/product-area destinations.

**Direction options**:

| Keyword | Intent | Source |
|---|---|---|
| `COMMAND MAP` | Destination map first; asymmetric product cards | `specs/004-role-screen-redesign/imagegen-options/dashboard-navigation-option-a-command-map.png` |
| `CLASSROOM LOOP` | Classroom sequence first: Library -> Create Room -> Live Room -> Learner -> History | `specs/004-role-screen-redesign/imagegen-options/dashboard-navigation-option-b-classroom-loop.png` |
| `READINESS FIRST` | Launch readiness and next action first | `specs/004-role-screen-redesign/imagegen-options/dashboard-navigation-option-c-readiness-first.png` |
| `STITCH DASHBOARD MAP` | Use generated Stitch product-map screen | `.stitch/designs/004-role-screen-redesign/chunks-dashboard-product-map-view-fb6eb876.jpg` |
| `STITCH FULL VIEW FIX` | Use generated Stitch full-view fix screen | `.stitch/designs/004-role-screen-redesign/chunks-dashboard-full-view-fix-c0d8b3d5.jpg` |

**Recommended default**: `COMMAND MAP` with a compact `CLASSROOM LOOP` strip. It best matches Dashboard as product map while still teaching the classroom flow.

**Default selection if Lucy does not override**: `COMMAND MAP`.

**Implementation status**: applied as first slice.

**After evidence**:
- Desktop screenshot: `specs/004-role-screen-redesign/dashboard-command-map-after-desktop.png`
- Mobile screenshot: `specs/004-role-screen-redesign/dashboard-command-map-after-mobile.png`
- Rendered desktop nav text: `DashboardHome`, `LibraryAdmin`, `HistoryAnalytics`, `Create RoomSetup`, `Live RoomRun`, `LearnerRoom`.
- Rendered mobile nav labels: `Dashboard`, `Library`, `History`, `Create Room`, `Live Room`, `Learner`.
- Rendered product-area cards: `Library`, `Create Room`, `Live Room`, `Learner`, `History`.

**Feedback prompt**:
- Choose one keyword.
- Say which product-area cards should be visually strongest.
- Say whether History may remain `/admin#history-analytics` for now.

**Edit plan after approval**:
1. CodeGraph `TopNavigation RoleEntryPage AppShell`.
2. Add or reuse product-area metadata.
3. Update nav taxonomy and dashboard product map.
4. Keep learner route filtering.
5. Run focused layout/navigation tests.

**CodeGraph blast radius note**:
- `TopNavigation` is called by `AppShell`; CodeGraph found `frontend/tests/integration/layout-dynamic-components.test.tsx` as relevant coverage.
- `RoleEntryPage` is routed by `AppRoutes`; CodeGraph found primitive accessibility coverage nearby.
- `AppShell` is shared by Admin, Teacher, Dashboard, and Learner entry surfaces; if changed, browser-check multiple roles because direct shell coverage is weak.

**Validation**:
- PASS: `cd frontend && npm test -- layout-dynamic-components`
- PASS: `cd frontend && npm run lint`
- PASS: Browser screenshot check `/` desktop and mobile.

## 2. Library

**Purpose**: Prepare resources, standards, and audio readiness before room launch.

**Main components today**:
- `AdminWorkspacePage`
- `ResourceManager`
- `CciManager`
- `CvrManager`
- batch confirmation dialog

**Current issue**: Library and History share the Admin host, so Library needs a clear top orientation area and should not look like analytics or generic database admin.

**Design sources**:
- `STITCH LIBRARY`: `.stitch/designs/004-role-screen-redesign/chunks-library-be920baa.jpg`
- Small-patch option: add Inside-this-area and readiness summary above current managers.

**Recommended default**: small-patch option first unless Lucy wants a full Admin host redesign.

**Implementation status**: applied as small-patch first slice.

**After evidence**:
- Baseline screenshot: `specs/004-role-screen-redesign/current-library-baseline.png`
- Desktop screenshot: `specs/004-role-screen-redesign/library-area-map-after-desktop.png`
- Mobile screenshot: `specs/004-role-screen-redesign/library-area-map-after-mobile.png`
- Rendered headings after patch include `Library prepares the room before class.`, `Library resources`, and `History & Analytics`.
- Area map entries: Resources, Standards, Audio Readiness, Batch Actions.
- Anchors verified: `#resource-manager-title`, `#cci-manager-title`, and `#new-resource` all exist in runtime components.

**Feedback prompt**:
- Should Library be a light orientation patch or a full page redesign?
- Which Library group should be first: Resources, Standards, or Audio Readiness?

**Validation**:
- PASS: `cd frontend && npm test -- admin-resource-manager admin-session-analytics`
- PASS: `cd frontend && npm run lint`
- PASS: Browser screenshot check `/admin` desktop and mobile.

## 3. History

**Purpose**: Review completed sessions, response distribution, and audit/history signals.

**Main components today**:
- `AdminWorkspacePage`
- `SessionAnalyticsDashboard`
- `analyticsService`

**Current issue**: History is a first-class product area concept but currently lands inside Admin via hash. That is acceptable only if the UI clearly frames it as History.

**Design sources**:
- `STITCH HISTORY`: `.stitch/designs/004-role-screen-redesign/chunks-history-analytics-378fb520.jpg`
- `HISTORY OPTION A - AUDIT MAP`: `specs/004-role-screen-redesign/imagegen-options/history-option-a-audit-map.png`
- `HISTORY OPTION B - REVIEW BOARD`: `specs/004-role-screen-redesign/imagegen-options/history-option-b-review-board.png`

**Recommended default**: keep the existing hash route but make the History section visually first-class and read-only/review-oriented.

**Default selection if Lucy does not override**: `HISTORY OPTION A - AUDIT MAP`.

**Implementation status**: applied as read-only audit-map slice.

**After evidence**:
- Baseline screenshot: `specs/004-role-screen-redesign/current-history-baseline.png`
- Desktop screenshot: `specs/004-role-screen-redesign/history-audit-map-after-desktop.png`
- Mobile screenshot: `specs/004-role-screen-redesign/history-audit-map-after-mobile.png`
- Rendered History map entries: Completed Rooms, Response Distribution, Learner Trends, Audit Snapshot.
- Rendered headings after patch include `Review completed classroom evidence.`, `Room and learner history`, `Room history`, and `Learner distribution`.

**Feedback prompt**:
- Should History remain an Admin hash alias for this pass?
- Which summary should lead: Completed Rooms, Response Distribution, or Learner Trends?

**Validation**:
- PASS: `cd frontend && npm test -- admin-session-analytics admin-resource-manager`
- PASS: `cd frontend && npm run lint`
- PASS: Browser screenshot check `/admin#history-analytics` desktop and mobile.

## 4. Create Room

**Purpose**: Help a teacher prepare and launch a room without feeling like database configuration.

**Main components today**:
- `TeacherSetupPage`
- scope/resource selectors
- room creation action
- readiness/disabled feedback

**Current issue**: Teacher setup is currently grouped under `Teacher`, but product taxonomy wants Create Room separate from Live Room.

**Design sources**:
- `STITCH CREATE ROOM`: `.stitch/designs/004-role-screen-redesign/chunks-create-room-setup-58735b68.jpg`

**Recommended default**: setup-as-launch-preparation hierarchy: Room Idea, Scope, Readiness, Advanced Options.

**Feedback prompt**:
- Should Create Room emphasize quick launch or detailed setup first?
- Which disabled/readiness messages must stay visible?

**Validation**:
- `cd frontend && npm test -- teacher-room-setup`
- Browser check `/teacher/setup`.

## 5. Live Room

**Purpose**: Let the teacher run the live room: current round, queue/history, roster, audio, progress, and share.

**Main components today**:
- `TeacherRoomPage`
- `CurrentSentenceWindow`
- `TeacherAudioControls`
- `TeacherRoster`
- `CapturedResponsePanel`
- `RoomHistorySummary`
- `ShareLinkCard`

**Current issue**: This screen is high-risk because dense controls must stay fast during class. Visual hierarchy must protect the Now/current sentence area.

**Design sources**:
- `STITCH LIVE ROOM`: `.stitch/designs/004-role-screen-redesign/chunks-live-room-console-2b7ce634.jpg`

**Recommended default**: Now-first layout with compact supporting control zones.

**Feedback prompt**:
- Should the Now/current sentence panel dominate the full top area?
- Which secondary panel should be nearest: Audio, Roster, Queue, Progress, or Share?

**Validation**:
- `cd frontend && npm test -- room-session-playback teacher-keyboard-audio`
- Browser check live teacher room route with available test data/mock state.

## 6. Learner Join

**Purpose**: Let a learner enter the correct room and understand whether to join, wait, or retry.

**Main components today**:
- `LearnerJoinPage`
- room code/share-link handling
- learner identity/assignment handling
- handoff to `LearnerRoomPage`

**Current issue**: Learner entry should be mobile-safe and role-isolated. It should not look like an Admin/Teacher screen.

**Design sources**:
- `STITCH LEARNER JOIN`: `.stitch/designs/004-role-screen-redesign/chunks-learner-join-room-54417828.jpg`

**Recommended default**: mobile-first join card with quiet room-state feedback.

**Feedback prompt**:
- Should learner join prioritize room code entry or share-link confirmation?
- What tone should blocked/waiting messages use?

**Validation**:
- `cd frontend && npm test -- learner-join`
- Browser check learner route on mobile viewport.

## 7. Learner Room

**Purpose**: Let a learner see the current sentence/window state and submit one valid response when eligible.

**Main components today**:
- `LearnerRoomPage`
- realtime status badge
- current sentence card
- `LearnerStateBanner`
- `ResponseButtons`
- `ProgressCards`
- `LastCapturedResponse`

**Current issue**: The response action must stay obvious, stable, touch-safe, and role-isolated across waiting, active, captured, already responded, and blocked states.

**Design sources**:
- `STITCH LEARNER ROOM DESKTOP`: `.stitch/designs/004-role-screen-redesign/chunks-learner-room-live-interaction-a42e8b18.jpg`
- `STITCH LEARNER ROOM MOBILE`: `.stitch/designs/004-role-screen-redesign/chunks-learner-live-interaction-mobile-8c32f3f2.jpg`

**Recommended default**: response-first hierarchy when active; status-first hierarchy when waiting or blocked.

**Feedback prompt**:
- Should the response buttons be the largest visual element during an open round?
- How much progress/history should remain visible during active response?

**Validation**:
- `cd frontend && npm test -- room-session-playback progress-summary`
- Browser check learner route on desktop and mobile.

## Feedback Log

| Date | Slice | Decision | Notes |
|---|---|---|---|
| 2026-07-04 | Navigation + Dashboard | pending | Waiting for Lucy to choose a keyword option. |
