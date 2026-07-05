# UI/UX Application Plan — Selected Stitch Direction

**Feature**: 002-component-library-foundation  
**Created**: 2026-07-04 10:44 GMT+7  
**Stitch project**: `projects/2813975030955029949` — CHUNKS Component Library Foundation — Decision Board  
**Stitch screen**: `projects/2813975030955029949/screens/082fd84028f34458858df1b089c5445b` — CHUNKS Component Library Decision Board

## Goal

Apply the selected Stitch decision-board direction to the current React UI/UX while preserving CHUNKS domain behavior, Supabase live-room contracts, accessibility, and release-control discipline.

The selected direction blends:

- Theme 1 calm classroom console: white canvas, editorial spacing, calm role flows.
- Theme 2 Bauhaus classroom poster: geometric structure, black borders, hard shadows, confident visual rhythm.
- Learner-safe clarity: large controls, explicit state, disabled explanations, restrained noise.

## Implementation Principles

1. **Primitives first**: Use `frontend/src/components/primitives` for all new/refactored UI controls.
2. **Tokens only**: Theme-specific values belong in `frontend/src/styles/tokens.css` and Tailwind aliases, not feature files.
3. **Layout consistency**: Shared shell/layout components should absorb spacing, surface, and responsive composition changes.
4. **Role clarity**: Teacher, Learner, and Admin layouts must clearly answer: what is happening, what can I do, why is unavailable?
5. **No behavior drift**: Do not change Supabase service calls, response capture rules, scoring math, or room/round state transitions.
6. **A11y gate**: Every changed flow must keep keyboard access, visible focus, labelled status, 44px+ targets, and disabled explanations.

## Target Areas

### Shared Shell + Navigation

Files:

- `frontend/src/components/layout/AppShell.tsx`
- `frontend/src/components/layout/TopNavigation.tsx`
- `frontend/src/components/layout/WorkspaceLayout.tsx`
- `frontend/src/components/layout/ActionDock.tsx`
- `frontend/src/routes/RoleEntryPage.tsx`

Plan:

- Apply decision-board spacing and panel rhythm to the app shell.
- Use primitive Badge/Button/Card/Panel consistently.
- Ensure top navigation and theme controls remain compact but accessible.

### Teacher Host Flow

Files:

- `frontend/src/features/teacher/TeacherSetupPage.tsx`
- `frontend/src/features/teacher/TeacherRoomPage.tsx`
- `frontend/src/features/teacher/components/TeacherAudioControls.tsx`
- `frontend/src/features/teacher/components/TeacherRoster.tsx`
- `frontend/src/features/teacher/components/CapturedResponsePanel.tsx`
- `frontend/src/features/teacher/components/ShareLinkCard.tsx`
- `frontend/src/features/live-room/CurrentSentenceWindow.tsx`

Plan:

- Shape Teacher Setup as a decision-board inspired command console.
- Improve Teacher Room layout with clear current sentence, action dock, response count, roster, and captured summary zones.
- Ensure disabled round controls explain unavailable states such as `Round closed`.

### Learner Flow

Files:

- `frontend/src/features/learner/LearnerJoinPage.tsx`
- `frontend/src/features/learner/LearnerRoomPage.tsx`
- `frontend/src/features/learner/components/LearnerStateBanner.tsx`
- `frontend/src/features/learner/components/ResponseButtons.tsx`
- `frontend/src/features/learner/components/ProgressCards.tsx`
- `frontend/src/features/learner/components/LastCapturedResponse.tsx`

Plan:

- Keep learner UI simpler and calmer than teacher/admin.
- Apply large response buttons and explicit waiting/assigned/captured/blocked state copy.
- Make already-responded and closed-round states obvious without relying on color alone.

### Admin Flow

Files:

- `frontend/src/features/admin/AdminWorkspacePage.tsx`
- `frontend/src/features/admin/resources/ResourceManager.tsx`
- `frontend/src/features/admin/components/ConfirmBatchActionDialog.tsx`
- `frontend/src/features/admin/analytics/SessionAnalyticsDashboard.tsx`
- `frontend/src/features/admin/cci/CciManager.tsx`
- `frontend/src/features/admin/cvr/CvrManager.tsx`

Plan:

- Apply resource-manager list/card hierarchy from the decision board.
- Use primitives for filters, audio-readiness badges, confirmation dialog, progress/log panels.
- Preserve explicit confirmation for destructive/batch actions.

## Phase 12 Correction Plan — Minimal Role Workflows

**Added**: 2026-07-04 12:14 GMT+7  
**Trigger**: Lucy reviewed the latest UI and reported that several internals are still too heavy, sentence/resource identifiers are too prominent, role features are unclear, some buttons/pages feel empty or ambiguous, and history/view management is hard to understand.

### Non-Negotiable Corrections

1. **Sentence text first**
   - Primary Teacher/Learner sentence displays must show the readable sentence text as the main content.
   - `sentence_code`, resource IDs, and internal identifiers may appear only as subdued metadata.
   - The next-sentence preview must show readable sentence text or a short snippet, not only the sentence code.

2. **Minimal surface density**
   - Replace routine heavy card shells such as `grid h-full w-full gap-4 p-5 text-left` when used for simple resource cards.
   - Replace routine large panel rhythm such as `rounded-3xl border border-chunks-hairline bg-white shadow-soft p-5 sm:p-6 lg:p-8 space-y-5` when the content is simple form/list content.
   - Preferred routine density: compact rows/cards, `rounded-2xl`, `p-3` or `p-4`, clear dividers, explicit text hierarchy.
   - Keep larger hero treatment only for true focal content, not every internal component.

3. **Role features must be visible and manageable**
   - Entry, Teacher, Learner, and Admin pages must clearly show what each role can do.
   - Long pages need internal structure: feature groups, section navigation, or compact task panels.
   - Buttons must communicate purpose; no visually empty button, unlabeled icon-only control, or ambiguous action should remain in touched flows.

4. **History and view management**
   - Teacher room must make played/current/upcoming sentence history readable at a glance.
   - Locked history should show sentence snippets, status, order, and readiness where useful instead of code-only chips.
   - Admin resource management should make it clear how to inspect, filter, select, approve, and return to context.

5. **Stitch/static HTML decision checkpoint**
   - If another Stitch redesign or code extraction path is used, pause first and ask Lucy to choose the required `stitch::extract-static-html` strategy:
     - Strategy A: Puppeteer snapshot, recommended for the local Vite app when no interaction is needed before capture.
     - Strategy B: browser capture when the page must be clicked, filled, or navigated before capture.
   - Do not extract static HTML, launch a browser capture, or send a captured page to Stitch until Lucy explicitly confirms the strategy.

### Phase 12 Strategy A Snapshot Reference

Lucy confirmed Strategy A at 2026-07-04 12:25 GMT+7. Captured local Vite static HTML snapshots with the `stitch::extract-static-html` Puppeteer workflow:

- `C:\Users\gensh\.craft-agent\workspaces\os\sessions\260704-fresh-ripple\data\stitch-snapshots\home.html`
- `C:\Users\gensh\.craft-agent\workspaces\os\sessions\260704-fresh-ripple\data\stitch-snapshots\admin.html`
- `C:\Users\gensh\.craft-agent\workspaces\os\sessions\260704-fresh-ripple\data\stitch-snapshots\teacher-setup.html`
- `C:\Users\gensh\.craft-agent\workspaces\os\sessions\260704-fresh-ripple\data\stitch-snapshots\teacher-room.html`
- `C:\Users\gensh\.craft-agent\workspaces\os\sessions\260704-fresh-ripple\data\stitch-snapshots\learner-room.html`

These snapshots are current-state references for correcting the heavy/card-like layouts. Teacher room and learner room snapshots use placeholder route state (`DEMO01`) and should not be treated as complete domain-data examples.

### Phase 12 Target Files

- `frontend/src/features/live-room/CurrentSentenceWindow.tsx`
- `frontend/src/features/teacher/TeacherRoomPage.tsx`
- `frontend/src/features/teacher/components/TeacherAudioControls.tsx`
- `frontend/src/features/learner/LearnerRoomPage.tsx`
- `frontend/src/features/admin/resources/ResourceManager.tsx`
- `frontend/src/routes/RoleEntryPage.tsx`
- `frontend/src/components/layout/AppShell.tsx`
- `frontend/src/components/layout/TopNavigation.tsx`
- `frontend/src/components/layout/WorkspaceLayout.tsx`
- shared primitives or UI wrappers only when needed to remove heavyweight default spacing safely

### Phase 12 Acceptance Checks

- Teacher current sentence view: the largest visible text is the sentence content, not `sentence_code`.
- Learner room: learners see the active sentence/request and response state in human language; codes are secondary.
- Resource manager: sentence text and lesson/topic context are visible before internal codes; cards/lists are compact and scannable.
- Teacher history/upcoming filter: played/current/upcoming resources are understandable without knowing sentence IDs.
- Role entry and role pages: each role exposes clear feature choices and history/view affordances.
- Buttons: every visible button has clear purpose text or an accessible label, and icon-only controls remain justified.
- Styling: routine internals avoid oversized `p-5`/`p-8` and `rounded-3xl` treatment unless the content is intentionally a focal panel.
- Validation: `npm test`, `npm run build`, `npm run build-storybook`, and a local browser visual check pass before release-control commit.

## Phase 13 Direction — History, Create Room, Navigation Truth

**Added**: 2026-07-04 13:04 GMT+7  
**Trigger**: Lucy reviewed `screen-inventory-review.md` and clarified that the next redesign must solve product-structure gaps: where users manage history, why Create Room still feels too configuration-heavy, and why Users/Settings/Help navigation appears when no real page exists.

### Phase 13 Product Decisions To Make

1. **History destination**
   - Preferred first step: rename or expose Admin Analytics as **History & Analytics** if a separate route is too large for this feature.
   - Alternative: add a real `/history` or `/admin/history` route.
   - Do not leave history only inside Teacher Room’s upcoming-resource collapsible panel.

2. **Create Room recipe**
   - Teacher Setup should lead with main ideas:
     - Course / lesson / topic scope.
     - Approved-resource count.
     - Room title/class idea.
     - Launch readiness.
   - Advanced details such as capture mode, scoring/CCI, host name, and section internals should be secondary in an Advanced Options disclosure, drawer, popover, or modal.

3. **Navigation truthfulness**
   - Users, Settings, Analytics, and Help must not behave like real pages unless real pages/sections exist.
   - Either implement real destinations or hide/disable unavailable items with clear copy.
   - Learner routes should remain distraction-reduced.

### Phase 13 Design Direction

Use the high-end design skill selectively, not as a broad visual restyle. The next pass should craft three focal areas:

- Create Room recipe card: premium, simple, main idea first.
- History/Queue destination: clear, manageable, scannable sequence of rooms/rounds/sentences/responses.
- Navigation: truthful destinations only, with no dead hash links.

### Phase 13 Acceptance Checks

- A user can answer “Where do I manage history?” from the navigation or visible Admin/Teacher page structure.
- Teacher Setup can be understood from the first visible card without reading every database field.
- Advanced create-room settings are accessible but not visually dominant.
- Users/Settings/Help do not appear as working destinations unless they have real route or section content.
- Tests cover route truth, history visibility, and create-room advanced disclosure behavior.

### Phase 13 Implementation Decision

Implemented decision: keep history inside the existing Admin route as a real anchored destination, **History & Analytics**, at `/admin#history-analytics`. This avoids adding route complexity while making history discoverable from primary navigation and visible Admin page structure.

Navigation truth changes:

- Removed non-real Users, Settings, and Help destinations from shell/navigation.
- Replaced hash-only Analytics nav copy with a real **History** nav item pointing to `/admin#history-analytics`.
- Preserved learner route navigation reduction.

Create Room changes:

- Teacher Setup now leads with a **Create Room recipe** focal card.
- Course, lesson, room title/class idea, selected topic count, approved-resource count, readiness, and Create Room CTA are visible first.
- Host, capture mode, CCI/scoring, and database topic internals live in **Advanced Options**.

Teacher room history changes:

- The previous generic Upcoming Resources panel is now **History & Queue**.
- A room history summary shows room title/code, rounds opened, upcoming count, captured responses, total CPD, CCI average, and resource count.

Validation result:

- `npm test`, `npm run build`, and `npm run build-storybook` passed on 2026-07-04 after Phase 13 implementation.
- Browser visual checks passed for Dashboard, Admin History & Analytics, Teacher Setup, and Teacher Live Room. The live-room check used `/teacher/room/QTQ52L`, created through the UI for local validation.

## Test Plan

Run after each implementation slice:

```powershell
cd frontend
npm test
npm run build
npm run build-storybook
```

Add/adjust tests for:

- role entry visual/layout smoke checks
- Teacher setup/room layout still creates and controls rooms
- Learner join/response flow still captures response state
- Admin resource manager still filters, edits, and confirms batch actions
- axe coverage for changed primitive/layout paths

## Release Control

No deployment is part of this plan. Before any preview or production deploy:

1. Commit changes.
2. Tag release if promoting beyond development.
3. Validate preview/canary.
4. Document rollback path.
5. Verify restore path for hosting/functions.
6. Run post-deploy verification checklist.
