# Screen + Component Inventory — Role Screen Redesign

**Feature**: 004-role-screen-redesign  
**Updated**: 2026-07-04 18:01 GMT+7

## Dashboard — Product Map

**Product area**: Dashboard  
**Current route**: `/`  
**Current file**: `frontend/src/routes/RoleEntryPage.tsx`  
**Primary purpose**: Product-area map and role/destination launcher.

### Current components

- AppShell header with title `Dashboard` and status `Offline Live Room`
- Classroom flow panel
  - Admin → Prepare resource + CCI
  - Teacher → Open sentence window
  - Learner → Read sentence and respond
  - History → Review played/current/upcoming work
- Supabase connected status card with Foundation readiness progress
- Design check card with CCI/CPD/CVR mini metrics
- Role shortcuts sidebar
  - Teacher Host → `/teacher/setup`
  - Learner → `/room/demo`
  - Library → `/admin`

### Current UX issues

- Dashboard still reads as a role shortcut board rather than a strict product-area map.
- Missing strict product-area list: Dashboard, Library, History, Create Room, Live Room, Learner.
- “Teacher Host” conflates Create Room and Live Room.
- Learner card points to demo route and does not clearly separate Join/Respond.
- History exists in classroom flow but not as a first-class product area card.
- Inside this area pattern is not explicit yet.
- Metrics are useful but need clearer relationship to product areas.

### Proposed Dashboard redesign

Use Dashboard as the top-level product map:

1. **Hero / command summary**
   - One-line purpose: “Choose where the classroom loop starts.”
   - Dynamic but calm visual treatment.
   - No fake links.
2. **Inside this area** map
   - Dashboard contains: Product Map, Classroom Loop, Readiness Snapshot.
   - Minimal text, icons, local anchors.
3. **Product-area cards**
   - Library — resources / standards / audio
   - History — analytics / completed rooms / learner distribution
   - Create Room — setup / readiness / advanced options
   - Live Room — teacher control / queue / audio / roster / progress
   - Learner — join / respond / captured state
4. **Classroom loop strip**
   - Library → Create Room → Live Room → Learner → History
5. **Readiness snapshot**
   - Summary only: resources ready, audio readiness, recent responses/history, live-room status.
   - No full records.

### Component inventory

| Component | Purpose | Data shown | Hidden/filtered data | Actions | States |
|-----------|---------|------------|----------------------|---------|--------|
| DashboardHero | Set product-map intent | Product title, short purpose | None | None or primary Create Room CTA | ready |
| InsideAreaMap | Explain Dashboard contents | Product Map, Classroom Loop, Readiness Snapshot | Full product details | Anchor links | ready |
| ProductAreaCardGrid | Navigate to product areas | Six product areas with minimal descriptions | Full page data | Open area | ready, disabled if no real route |
| ClassroomLoopStrip | Show loop sequence | Library → Create Room → Live Room → Learner → History | Detailed records | Optional anchors | ready |
| ReadinessSnapshot | Show summary only | counts/status for readiness | full resource/history lists | Open relevant area | loading, empty, error, ready |

### Visual handoff

**Required**: yes — Dashboard is the first product-area redesign and should be generated in Stitch for Lucy review before frontend implementation.

**Status**: imagegen direction `COMMAND MAP` applied as default first slice; Stitch Dashboard remains available for further Lucy review.

### Implementation note

- Applied `COMMAND MAP` direction to `frontend/src/routes/RoleEntryPage.tsx`.
- Dashboard now presents command summary, Inside this area cards, product-area cards, classroom loop, and summary-only readiness snapshot.
- Primary navigation now exposes Dashboard, Library, History, Create Room, Live Room, and Learner in `frontend/src/components/layout/TopNavigation.tsx`.
- After screenshots saved:
  - `specs/004-role-screen-redesign/dashboard-command-map-after-desktop.png`
  - `specs/004-role-screen-redesign/dashboard-command-map-after-mobile.png`

### Validation plan

- Dashboard has product-area nav/cards for Dashboard, Library, History, Create Room, Live Room, Learner.
- Product cards link only to real routes or approved aliases.
- No Users/Settings/Help fake destinations.
- Dashboard does not show full resource/history datasets.
- Browser visual check at `/` after implementation.

### Validation result

- PASS: `cd frontend && npm test -- layout-dynamic-components`
- PASS: `cd frontend && npm run lint`
- PASS: Browser screenshot check at `/` desktop and mobile via local Vite port 5174.

## Shared Shell + Navigation

**Current files**: `frontend/src/components/layout/TopNavigation.tsx`, `frontend/src/components/layout/AppShell.tsx`, `frontend/src/components/layout/WorkspaceLayout.tsx`
**Primary purpose**: Keep product-area movement clear across Admin, Teacher, and Learner surfaces while preserving role isolation.

### Current components

- Sticky responsive navigation shell.
- CHUNKS brand link back to `/`.
- Primary nav entries: Dashboard, Library, History, Teacher, Learner.
- Learner route filter that shows only Dashboard and Learner.
- AppShell page frame and WorkspaceLayout two-column work surface.

### Current UX issues

- Top navigation labels do not fully match the approved product-area taxonomy: `Teacher` should split mentally into Create Room and Live Room.
- History currently points to `/admin#history-analytics`, a real section alias, but it must remain visibly tied to History rather than hidden inside Library.
- Learner filtering is good for role isolation, but product-area language needs to stay understandable on mobile.
- Current icon set is inline SVG; future edits should prefer the established icon strategy already in the project or lucide if the dependency is added intentionally.

### Proposed navigation redesign

1. Show the approved product-area map: Dashboard, Library, History, Create Room, Live Room, Learner.
2. Keep aliases honest: History may target the existing Admin analytics section until a standalone route exists.
3. Keep learner routes role-isolated and compact.
4. Use active-state treatment that is visible without relying on color alone.

### Component inventory

| Component | Purpose | Data shown | Hidden/filtered data | Actions | States |
|-----------|---------|------------|----------------------|---------|--------|
| TopNavigation | Move between product areas | Product-area labels, icons, active status | Role-specific hidden areas for learner route | Open area | active, inactive, learner-filtered |
| AppShell | Frame top-level page | Title, eyebrow/status, navigation | Page internals | None | ready |
| WorkspaceLayout | Organize dense work screens | Primary and secondary regions | None | None | one-column mobile, two-column desktop |

### Visual handoff

**Required**: yes for navigation taxonomy options before large implementation.

**Status**: pending option generation.

### Validation plan

- Navigation has no fake product areas.
- Learner route does not expose Admin or Teacher controls.
- Active area is visible on desktop and mobile.
- E2E navigation layout check covers the changed shell.

## Library - Resources, Standards, Audio Readiness

**Product area**: Library
**Current route**: `/admin`
**Current files**: `frontend/src/features/admin/AdminWorkspacePage.tsx`, `frontend/src/features/admin/resources/ResourceManager.tsx`, `frontend/src/features/admin/cci/CciManager.tsx`, `frontend/src/features/admin/cvr/CvrManager.tsx`
**Primary purpose**: Prepare classroom resources, standards/configuration, and audio readiness before a teacher creates a room.

### Current components

- AdminWorkspacePage host surface.
- ResourceManager for resource tables/import/readiness operations.
- CciManager and CvrManager for standard/configuration work.
- Admin batch confirmation and resource service flows.

### Current UX issues

- Library and History share the Admin host, so users may not immediately understand which work belongs to Library versus History.
- Resource and standards tooling can feel like database administration before classroom readiness.
- The top of the page needs a summary-only Inside this area map before dense lists.
- CodeGraph did not find direct test coverage for ResourceManager; changes need focused validation.

### Proposed Library redesign

1. Add an Inside this area map: Resources, Standards, Audio Readiness, Import/Batch Actions.
2. Put readiness summary above dense tables.
3. Keep full resource records inside filtered ResourceManager sections.
4. Keep analytics/history out of Library except as a clear link to History.

### Component inventory

| Component | Purpose | Data shown | Hidden/filtered data | Actions | States |
|-----------|---------|------------|----------------------|---------|--------|
| LibraryAreaMap | Orient Library work | Resources, standards, audio readiness, batch actions | Full records | Anchor to sections | ready |
| ResourceReadinessSummary | Show classroom readiness | Counts/status only | Full resource rows | Open resources | loading, empty, error, ready |
| ResourceManager | Manage library content | Filtered resource records | Nonmatching filters | Import, edit, batch actions | loading, empty, error, ready |
| StandardsPanels | Manage CCI/CVR | Summary and config controls | Full historical analytics | Update standards/config | loading, saved, error |

### Visual handoff

**Required**: pending; likely not needed for small Inside this area addition, required if the full Admin host layout changes.

**Status**: small Inside this area patch applied; Stitch Library remains available if Lucy requests a full Admin host redesign.

### Implementation note

- Applied Library area map in `frontend/src/features/admin/AdminWorkspacePage.tsx`.
- Area map entries: Resources, Standards, Audio Readiness, Batch Actions.
- History remains available at `/admin#history-analytics`, but its card now frames it as review-only and keeps resource editing in Library.
- After screenshots saved:
  - `specs/004-role-screen-redesign/current-library-baseline.png`
  - `specs/004-role-screen-redesign/library-area-map-after-desktop.png`
  - `specs/004-role-screen-redesign/library-area-map-after-mobile.png`

### Validation plan

- Library communicates resource/standards/audio ownership.
- Full records stay inside ResourceManager.
- Batch actions keep explicit confirmation and completion/failure feedback.
- Run relevant integration checks after edits.

### Validation result

- PASS: `cd frontend && npm test -- admin-resource-manager admin-session-analytics`
- PASS: `cd frontend && npm run lint`
- PASS: Browser screenshot check at `/admin` desktop and mobile via local Vite port 5174.

## History - Analytics and Completed Rooms

**Product area**: History
**Current route**: `/admin#history-analytics`
**Current files**: `frontend/src/features/admin/AdminWorkspacePage.tsx`, `frontend/src/features/admin/analytics/SessionAnalyticsDashboard.tsx`
**Primary purpose**: Review completed room/session analytics, response distribution, and historical audit signals.

### Current components

- Admin host section for analytics.
- SessionAnalyticsDashboard.
- Analytics service for history summaries.

### Current UX issues

- History is reachable as a hash section inside Admin rather than a visibly first-class product area.
- History needs summary/audit framing before charts or analytics details.
- CodeGraph did not find direct test coverage for SessionAnalyticsDashboard; changes need browser and integration validation.

### Proposed History redesign

1. Add a first-class History card/nav destination that lands on the existing analytics section.
2. Add Inside this area map: Completed Rooms, Response Distribution, Learner Trends, Audit Notes.
3. Keep History read-only/review-focused; no resource editing controls.

### Component inventory

| Component | Purpose | Data shown | Hidden/filtered data | Actions | States |
|-----------|---------|------------|----------------------|---------|--------|
| HistoryAreaMap | Orient review workflow | Completed rooms, distributions, trends, audit | Full charts/tables | Anchor to analytics sections | ready |
| SessionAnalyticsDashboard | Show historical insight | Session summaries and analytics | Raw response tables unless opened | Filter/review | loading, empty, error, ready |
| HistorySummaryCards | Provide quick audit snapshot | Counts, recent status, completion signals | Detailed rows | Open analytics | loading, empty, ready |

### Visual handoff

**Required**: pending; use generated option if History becomes visually distinct from Library.

**Status**: imagegen direction `HISTORY OPTION A - AUDIT MAP` applied as default first slice; Stitch History remains available for further Lucy review.

### Implementation note

- Applied read-only History audit map in `frontend/src/features/admin/analytics/SessionAnalyticsDashboard.tsx`.
- History map entries: Completed Rooms, Response Distribution, Learner Trends, Audit Snapshot.
- History remains at `/admin#history-analytics` as a truthful hash destination inside the current Admin host.
- After screenshots saved:
  - `specs/004-role-screen-redesign/current-history-baseline.png`
  - `specs/004-role-screen-redesign/history-audit-map-after-desktop.png`
  - `specs/004-role-screen-redesign/history-audit-map-after-mobile.png`

### Validation plan

- History appears as a first-class product area without fake routing.
- History does not expose Library edit controls as its primary workflow.
- Analytics empty/loading/error states remain readable.

### Validation result

- PASS: `cd frontend && npm test -- admin-session-analytics admin-resource-manager`
- PASS: `cd frontend && npm run lint`
- PASS: Browser screenshot check at `/admin#history-analytics` desktop and mobile via local Vite port 5174.

## Create Room - Setup and Launch Preparation

**Product area**: Create Room
**Current route**: `/teacher/setup`
**Current file**: `frontend/src/features/teacher/TeacherSetupPage.tsx`
**Primary purpose**: Help a teacher choose room idea/scope/readiness and launch a real room without feeling like database setup.

### Current components

- Teacher setup form.
- Course/lesson/topic/resource selection controls.
- Room creation action and readiness feedback.
- Advanced options where available.

### Current UX issues

- Current navigation label `Teacher` blurs setup with live room control.
- Setup needs an Inside this area map that says what must be ready before launch.
- Advanced configuration should stay present but not dominate first-time flow.

### Proposed Create Room redesign

1. Add Inside this area map: Room Idea, Scope, Readiness, Advanced Options.
2. Use a launch-preparation layout with a clear primary creation action.
3. Keep disabled reasons visible when a room cannot be created.
4. Keep real room launch route and Supabase contract unchanged.

### Component inventory

| Component | Purpose | Data shown | Hidden/filtered data | Actions | States |
|-----------|---------|------------|----------------------|---------|--------|
| CreateRoomAreaMap | Orient setup workflow | Room idea, scope, readiness, advanced options | Full resource lists | Anchor to sections | ready |
| RoomScopeSelector | Choose teaching scope | Course/lesson/topic/resource summaries | Nonmatching resources | Select scope | loading, empty, error, ready |
| ReadinessPanel | Show launch readiness | Missing/ready signals | Full library records | Open Library or continue | blocked, ready |
| CreateRoomAction | Launch a room | Button, disabled reason | None | Create room | idle, submitting, success, error |

### Visual handoff

**Required**: yes if the setup page is reorganized beyond adding orientation cards.

**Status**: pending.

### Validation plan

- Setup reads as launch preparation.
- Disabled reasons are visible and keyboard accessible.
- Existing teacher room setup tests are updated/run.

## Live Room - Teacher Control

**Product area**: Live Room
**Current routes**: `/teacher/room/:roomId`, `/teacher/room/:roomId/history`, live teacher routes in `AppRoutes`
**Current files**: `frontend/src/features/teacher/TeacherRoomPage.tsx`, `frontend/src/features/teacher/components/*`, `frontend/src/features/live-room/CurrentSentenceWindow.tsx`
**Primary purpose**: Let the teacher run the room: current round, queue/history, roster, audio, progress, and share controls.

### Current components

- TeacherRoomPage live control surface.
- CurrentSentenceWindow.
- TeacherAudioControls.
- TeacherRoster.
- CapturedResponsePanel.
- RoomHistorySummary.
- ShareLinkCard.
- Progress services and live-room audio playback.

### Current UX issues

- Live control is dense and needs clearer hierarchy around Now versus supporting panels.
- Queue/history, roster, audio, progress, and share controls need local orientation without becoming extra routes.
- Teacher control must remain fast and classroom-safe during a live session.

### Proposed Live Room redesign

1. Add compact Inside this area map: Now, History & Queue, Roster, Audio, Progress, Share.
2. Make Now/current sentence the strongest visual focus.
3. Keep secondary controls scan-friendly and stable.
4. Preserve keyboard/audio behavior and realtime contracts.

### Component inventory

| Component | Purpose | Data shown | Hidden/filtered data | Actions | States |
|-----------|---------|------------|----------------------|---------|--------|
| LiveRoomAreaMap | Orient live controls | Now, history/queue, roster, audio, progress, share | Detailed records | Anchor/scroll to panels | ready |
| CurrentSentenceWindow | Run current round | Sentence, round status | Full history | Open/close window | idle, open, closed, error |
| TeacherAudioControls | Control audio | Playback status | Audio internals | Play/stop/retry | ready, playing, error |
| TeacherRoster | Show learners | Learner presence/status | Full response history | Review roster | loading, empty, ready |
| CapturedResponsePanel | Show response stream | Recent captured responses | Full analytics | Review | loading, empty, ready |
| ShareLinkCard | Share learner access | Link/code | None | Copy/share | ready, copied |

### Visual handoff

**Required**: yes before large layout changes because live-session hierarchy is high risk.

**Status**: pending.

### Validation plan

- Now/current round remains fastest to find.
- Audio and keyboard behavior do not regress.
- Learner response/realtime state remains durable and accurate.
- Run room-session playback and teacher keyboard/audio checks after edits.

## Learner Join - Enter Room

**Product area**: Learner
**Current route**: `/room/:roomCode` before learner assignment, plus `/chunks-mirror/*` learner aliases where present
**Current file**: `frontend/src/features/learner/LearnerJoinPage.tsx`
**Primary purpose**: Let a learner join the correct room and reach the response state with minimal confusion.

### Current components

- Learner join form/state.
- Room code/share-link handling.
- Learner identity/assignment handling.
- LearnerRoomPage handoff after join.

### Current UX issues

- Dashboard currently points to a demo learner route; product map should describe Join versus Respond more honestly.
- Join flow needs compact orientation for room code, identity, waiting/active handoff.
- Learner must not see Admin or Teacher affordances.

### Proposed Learner Join redesign

1. Add compact Learner orientation: Join, Wait, Respond, Captured/Blocked.
2. Keep form controls large, labeled, and mobile-safe.
3. Show clear blocked/error reasons.
4. Preserve anonymous learner access flow.

### Component inventory

| Component | Purpose | Data shown | Hidden/filtered data | Actions | States |
|-----------|---------|------------|----------------------|---------|--------|
| LearnerJoinMap | Orient learner flow | Join, wait, respond, captured/blocked | Teacher/admin details | None or anchors | ready |
| LearnerJoinForm | Enter room/identity | Room code, learner name/id | Internal IDs | Join room | idle, submitting, error |
| LearnerJoinStatus | Explain next step | Waiting/blocked reason | Internal room state | Retry/back | loading, blocked, ready |

### Visual handoff

**Required**: pending; likely useful for mobile-first learner polish.

**Status**: pending.

### Validation plan

- Learner join stays role-isolated.
- Errors and blocked states explain what to do next.
- Run learner join integration check after edits.

## Learner Room - Respond

**Product area**: Learner
**Current route**: `/room/:roomCode` after join/session load
**Current file**: `frontend/src/features/learner/LearnerRoomPage.tsx`
**Primary purpose**: Let a learner see the current sentence/window state and submit one valid response when eligible.

### Current components

- Realtime status badge.
- Current sentence card.
- LearnerStateBanner.
- ResponseButtons inside ActionDock.
- Room status card.
- ProgressCards.
- LastCapturedResponse.

### Current UX issues

- Response state is functional, but orientation could better distinguish waiting, active response, captured, already responded, and blocked states.
- Current sentence is strong; supporting status/progress should not compete with the response action.
- Mobile/touch safety is critical.

### Proposed Learner Room redesign

1. Use a learner-state-first hierarchy: Current Sentence, Response Action, Captured/Blocked status.
2. Add compact orientation only if it does not distract during active response.
3. Keep response buttons stable size with visible labels/disabled reasons.
4. Keep realtime status visible but quiet.

### Component inventory

| Component | Purpose | Data shown | Hidden/filtered data | Actions | States |
|-----------|---------|------------|----------------------|---------|--------|
| LearnerCurrentSentence | Show current prompt | Sentence code/status | Teacher controls | None | waiting, active, closed |
| LearnerStateBanner | Explain eligibility | Learner state, disabled reason | Internal eligibility rules | None | assigned, waiting, blocked, responded |
| ResponseButtons | Submit one response | Color choices, disabled reason | Scoring internals | Submit response | enabled, disabled, submitting |
| LearnerProgressCards | Show personal progress | Summary and last response | Classwide analytics | None | loading, empty, ready |
| LastCapturedResponse | Confirm stored response | Last response color/time | Full history | None | empty, captured |

### Visual handoff

**Required**: yes before any major mobile response layout change.

**Status**: pending.

### Validation plan

- Learner can understand whether to wait, respond, or stop.
- One-response-per-round rule remains unchanged.
- Disabled reasons remain visible.
- Run room-session playback and learner flow checks after edits.
