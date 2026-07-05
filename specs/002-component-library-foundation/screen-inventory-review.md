# CHUNKS Screen Inventory, Navigation, Component Map, and Design Review

**Feature**: `002-component-library-foundation`  
**Review date**: 2026-07-04 12:56 GMT+7  
**Scope**: Current React app screens after the component-library, Stitch direction, compact dashboard, and Phase 12 minimal workflow corrections.

## 1. Screen Count

The app currently has **5 route-level screens** and **6 practical user-facing screen states**.

### Route-level screens

| # | Screen | Route pattern | Main component | Role |
|---|---|---|---|---|
| 1 | Dashboard / Role Entry | `/` | `RoleEntryPage` | All users |
| 2 | Admin Library | `/admin` | `AdminWorkspacePage` | Admin / content manager |
| 3 | Teacher Setup | `/teacher/setup` | `TeacherSetupPage` | Teacher |
| 4 | Teacher Live Room | `/teacher/room/:roomCode` | `TeacherRoomPage` | Teacher |
| 5 | Learner Join / Learner Room | `/room/:roomCode`, `/chunks-mirror/join/:roomCode` | `LearnerJoinPage` → `LearnerRoomPage` | Learner |

### Practical user-facing screen states

| # | State | Why it counts separately |
|---|---|---|
| 1 | Dashboard | Entry board and role routing hub |
| 2 | Admin Library | Resource, analytics, CCI, CVR management |
| 3 | Teacher Setup | Room creation workflow |
| 4 | Teacher Live Room | Live classroom control workflow |
| 5 | Learner Join | Pre-room display-name form |
| 6 | Learner Room | Active learner sentence/response workflow after joining |

## 2. Global Navigation Bar / Sidebar

### Component

- `TopNavigation`
- Used inside `AppShell`
- Layout behavior:
  - Desktop: compact left sidebar, sticky full-height navigation.
  - Smaller viewports: horizontal top navigation row.

### Navigation items

| Item | Destination | Visibility | Current status |
|---|---|---|---|
| CHUNKS brand | `/` | All routes | Home link |
| Dashboard | `/` | All routes | Active on home |
| Library | `/admin` | Non-learner routes | Active on Admin |
| Teacher | `/teacher/setup` | Non-learner routes | Active on Teacher setup and Teacher room |
| Learner | `/room/demo` | All routes | Active on learner routes |
| History | `/admin#history-analytics` | Non-learner routes | Real Admin anchor for History & Analytics |
| Users | N/A | Hidden | Removed until a real users destination exists |
| Settings | N/A | Hidden | Removed until a real settings destination exists |

### Learner route filtering

On learner routes, navigation is intentionally reduced to:

- Dashboard
- Learner

This reduces distraction during classroom response flow.

### AppShell header controls

`AppShell` adds a compact dashboard header with:

- Eyebrow badge
- Page title
- Description
- Status label
- Search/filter affordance
- Optional page action
- Theme toggle

Phase 13 removed Help and Settings utility links because they did not point to real screens or sections.

## 3. Screen-by-Screen Component Map

## 3.1 Dashboard / Role Entry

**Route**: `/`  
**Main component**: `RoleEntryPage`  
**Purpose**: Explain the classroom workflow and route users into Teacher, Learner, or Admin/Library flows.

### Components on screen

| Area | Components | Notes |
|---|---|---|
| Shell | `AppShell`, `TopNavigation` | Shared dashboard chrome |
| Classroom flow panel | `Panel`, `Badge`, loop-step cards | Shows Admin → Teacher → Learner → History sequence |
| System status card | `Card`, `Badge`, `Progress` | Communicates durable Supabase/realtime model |
| Design status card | `Card`, `Badge`, `MiniMetric` | Communicates minimal internal UI direction |
| Role shortcuts | `Card`, `Badge`, `ButtonLink`, `RoleIcon` | Teacher Host, Learner, Library cards |

### Current strengths

- Role actions are now explicit: “Create or manage room”, “Join learner room”, “Manage library resources”.
- The page explains the full learning loop rather than acting like a generic landing page.
- Compact cards make the dashboard easier to scan.

### Evaluation

**Good**: Clear role segmentation and stronger operational tone.  
**Needs future polish**: The current icon style is functional but not high-end agency level; it uses simple inline SVGs rather than a refined, ultra-light icon system.

## 3.2 Admin Library

**Route**: `/admin`  
**Main component**: `AdminWorkspacePage`  
**Purpose**: Manage sentence resources, audio readiness, CVR values, CCI standards, and analytics.

### Components on screen

| Area | Components | Notes |
|---|---|---|
| Shell | `AppShell`, `TopNavigation` | Admin status label: `Admin / Library` |
| Header action | `ButtonLink` | `Create New` links to resource form area |
| Summary metrics | `Card` | System, Resources, CCI active, Responses |
| Primary workspace | `WorkspaceLayout` | Main + side inspector composition |
| Resource management | `ResourceManager`, `Panel`, `Button`, `Card`, `Badge`, `ConfirmBatchActionDialog` | Filtering, pagination, compact resource cards, edit form, audio generation, approval |
| Analytics | `SessionAnalyticsDashboard`, `Card`, `Badge` | Room sessions, learner distribution, totals |
| CCI manager | `CciManager`, `Card`, `Badge`, form fields | Selected-list + inspector workflow |
| CVR manager | `CvrManager`, `Card`, `Badge`, form fields | Selected-list + inspector workflow |

### Current strengths

- Resource cards now prioritize sentence text and lesson/topic context before internal codes.
- `grid h-full w-full gap-4 p-5 text-left` has been removed.
- Admin is more manageable because resources, analytics, CCI, and CVR are grouped.

### Evaluation

**Good**: Strongest screen after Phase 12. It now has a dashboard-library structure instead of a long flat list.  
**Phase 13 decision**: Admin keeps one route for now, but analytics is exposed as the real **History & Analytics** destination at `/admin#history-analytics`. Users and Settings are hidden until implemented as real destinations.

## 3.3 Teacher Setup

**Route**: `/teacher/setup`  
**Main component**: `TeacherSetupPage`  
**Purpose**: Create a live room by selecting course/lesson/sections, room settings, CCI standard, and capture mode.

### Components on screen

| Area | Components | Notes |
|---|---|---|
| Shell | `AppShell`, `TopNavigation` | Teacher Host status |
| Header meta | `Card`, `Badge` | Current filter summary |
| Main layout | `WorkspaceLayout` | Primary setup panels + ready-check side panel |
| Resource scope | `CollapsiblePanel`, selects, section checkboxes, `Button` | Course, lesson, database sections, select all, clear |
| Room settings | `CollapsiblePanel`, inputs, selects | Room title, host name, CCI standard, capture mode |
| Ready check | `CollapsiblePanel`, `Alert`, `ActionDock`, `Button` | Shows filtered resources, selected sections, capture/scoring, create-room action |

### Current strengths

- Setup is task-based and collapsible.
- Disabled create-room state has meaningful reasons.
- The flow is understandable for room creation.

### Evaluation

**Good**: Clear and functional workflow.  
**Phase 13 decision**: Teacher Setup now starts with a **Create Room recipe** card that shows room title/class idea, course, lesson, topic count, approved-resource count, readiness, and the primary Create Room CTA. Host, capture mode, CCI/scoring, and database topic internals live in Advanced Options.

## 3.4 Teacher Live Room

**Route**: `/teacher/room/:roomCode`  
**Main component**: `TeacherRoomPage`  
**Purpose**: Run the live classroom session, open/close/advance rounds, control audio, monitor responses, share room, manage roster, and review history/upcoming resources.

### Components on screen

| Area | Components | Notes |
|---|---|---|
| Shell | `AppShell`, `TopNavigation` | Room code as status label |
| Header meta | `Card`, `Badge` | Room status |
| Realtime status | Text status badge | Connecting/live/error feedback |
| Current sentence | `CurrentSentenceWindow`, `Card`, `Badge` | Sentence-text-first current/next sentence display |
| Audio controls | `TeacherAudioControls`, `Card`, `Badge`, `Button` | Language options, autoplay, replay, stop, sentence helper |
| Captured response | `CapturedResponsePanel` | Last response and summaries |
| Round controls | `ActionDock`, `Button` | Open, close, advance, finish room |
| Round settings | `CollapsiblePanel`, select, info card | CCI and mode details |
| Share link | `CollapsiblePanel`, `ShareLinkCard` | Room sharing |
| Roster | `CollapsiblePanel`, `TeacherRoster` | Learner list and assigned learner control |
| Upcoming resources/history | `CollapsiblePanel`, `Badge`, checkboxes, `Button` | Locked history and upcoming sentence snippets with audio readiness |

### Current strengths

- Current sentence is now readable text-first.
- Teacher history/upcoming resources are no longer code-only chips.
- Main live-room actions stay visible in the action dock.

### Evaluation

**Good**: The main classroom workflow is now much clearer.  
**Phase 13 decision**: The previous Upcoming Resources panel is now a clear **History & Queue** area with a summary for room title/code, rounds opened, upcoming resources, captured responses, total CPD, CCI average, and readable played/current/upcoming sentence snippets.

## 3.5 Learner Join

**Route**: `/room/:roomCode` before learner identity is stored  
**Main component**: `LearnerJoinPage`  
**Purpose**: Let learner enter display name and join the room.

### Components on screen

| Area | Components | Notes |
|---|---|---|
| Shell | `AppShell`, filtered `TopNavigation` | Only Dashboard and Learner navigation visible on learner routes |
| Join form | `WorkspaceLayout`, `Card`, `Button`, input | Display name form |
| Learner rules | `Card` dark variant | Explains waiting, assigned response, one tracked response |
| Error state | `Alert` | Cannot join room feedback |

### Current strengths

- Simple and focused.
- Learner navigation is intentionally reduced.
- Rules are visible before joining.

### Evaluation

**Good**: Appropriate simplicity for learner entry.  
**Needs future polish**: Dark rules card is functional but visually less refined than the new compact light surfaces. A premium learner onboarding screen could use a calmer “what happens next” sequence.

## 3.6 Learner Room

**Route**: `/room/:roomCode` after learner identity is stored  
**Main component**: `LearnerRoomPage`  
**Purpose**: Show current sentence and let eligible learner respond Red/Yellow/Green.

### Components on screen

| Area | Components | Notes |
|---|---|---|
| Layout | `WorkspaceLayout` | Primary response area + secondary status/progress |
| Realtime status | Text status badge | Shows connecting/live/error |
| Current sentence | `Card`, `Badge` | Sentence text first, Vietnamese text if available, code as metadata |
| Learner state | `LearnerStateBanner` | Assigned/observing/captured/already responded/closed state |
| Response action | `ActionDock`, `ResponseButtons` | Red, Yellow, Green response buttons with meanings |
| Room status | `Card` | Room code, round, eligibility, opened time, captured response alert |
| Progress | `ProgressCards` | Learner CPD/color/reflection summary |
| Last response | `LastCapturedResponse` | Most recent captured response |

### Current strengths

- Learner now sees the active sentence content, not just the sentence code.
- Response buttons are large and semantic.
- Eligibility state is explicit.

### Evaluation

**Good**: Strong improvement in classroom clarity.  
**Needs future polish**: Response buttons still feel visually heavy and standard. A high-end learner screen could use softer physical button islands with clearer haptic feedback.

## 4. Navigation Evaluation

### Strengths

- Navigation is role-aware and compact.
- Learner routes reduce navigation to avoid distraction.
- Active state is readable through red color, soft background, and left rail.
- Sidebar is much better than the earlier oversized/horizontal role-tab navigation.

### Weaknesses

- `Analytics`, `Users`, and `Settings` are navigation items, but only Analytics maps to Admin hash behavior and Users/Settings are not true route-level screens yet.
- Help and Settings header utility buttons link to hash targets that are not fully realized screens.
- Icon style is serviceable but not premium/high-end; the strokes are relatively standard and heavy.

### Recommendation

For production-quality navigation, either:

1. Convert Analytics, Users, Settings, Help into real sections/routes; or
2. Hide unavailable future items until implemented; or
3. Keep them but mark them as disabled/future with explicit affordance.

## 5. High-End Visual Design Evaluation

### Overall rating

**Current state**: good functional dashboard foundation, not yet a high-end agency-grade interface.

### Scorecard

| Category | Score | Evaluation |
|---|---:|---|
| Information architecture | 8/10 | Clear screens, roles, and classroom loop |
| Navigation clarity | 7/10 | Good role nav; future hash items need resolution |
| Component consistency | 8/10 | Primitives and compact cards are now consistent |
| Classroom usability | 8/10 | Sentence-text-first and history improvements help a lot |
| Visual premium quality | 6/10 | Functional and clean, but not yet luxury/high-end |
| Motion / interaction feel | 4/10 | Mostly static; little choreographed motion or haptic depth |
| Iconography | 5/10 | Clear but generic inline SVG style |
| Density / scanability | 7/10 | Much better after Phase 12; Admin still content-heavy |

### What is good now

- The app now has a real dashboard/sidebar direction.
- Role features are much clearer.
- Learner and teacher flows are more human-readable.
- Admin resource cards are manageable and no longer oversized.
- The design is safer: no white-on-white issue, no code-first learner display, no ambiguous role-entry `Open` buttons.

### What still prevents “high-end” quality

- The interface uses practical cards and borders, but not a distinct premium spatial system.
- There is little motion choreography or tactile interaction feedback.
- Icons are simple inline SVGs instead of a refined icon language.
- Some panels are still conventional form/list layouts.
- Admin is powerful but visually dense.

## 6. Recommended Next Design Pass

If the goal is not only “usable and corrected” but “high-end visual design”, the next pass should focus on:

1. **Navigation truthfulness**
   - Resolve or hide future nav items: Users, Settings, Help.
   - Add actual section anchors for Admin analytics/resource areas if keeping hash navigation.

2. **Premium component styling**
   - Introduce a double-bezel container pattern for focal cards only.
   - Keep routine cards compact, but give hero/current-state components more crafted depth.

3. **Motion and state transitions**
   - Add subtle transform/opacity transitions for panel reveal, card selection, and response-state changes.
   - Avoid noisy animation; use deliberate, classroom-safe motion.

4. **Icon system refinement**
   - Replace ad-hoc inline SVG style with a consistent lightweight icon language.

5. **Admin workspace organization**
   - Consider true tabs or section nav: Resources, Analytics, CCI, CVR.
   - Keep resource editing as a clear inspector pattern.

6. **Learner response polish**
   - Improve Red/Yellow/Green buttons with more tactile nested structure and clearer pressed/loading states.

## 7. Final Assessment

The redesign pass is **functionally complete and validated** for the current Spec Kit feature: it fixes the main issues Lucy raised around sentence IDs, oversized cards, unclear role actions, and hard-to-read history.

However, from a high-end visual-design perspective, the app should be considered **a clean operational dashboard foundation**, not a final premium agency-level interface. The next design pass should focus on refined nav truthfulness, motion, crafted focal components, and reducing Admin density through stronger workspace segmentation.

## 8. Lucy Review Addendum — 2026-07-04 13:04 GMT+7

Lucy’s follow-up review identifies three product-structure issues that should be treated as higher priority than further visual polish.

### 8.1 History is not yet a manageable destination

Current state:

- History appears as part of Teacher Live Room’s `Upcoming resources` collapsible panel.
- Analytics appears in Admin, but it is not clearly framed as a history-management destination.
- Dashboard mentions history in the learning loop, but users do not have an obvious place to manage or review it.

Problem:

- A teacher/admin asking “Where can I manage history?” has no direct navigation answer.
- History is mixed with upcoming filtering, roster, and live controls.

Recommendation:

- Add a clear **History** navigation destination or an Admin/Teacher section that is explicitly named History.
- Split history into understandable groups:
  - Current room history: played/current/upcoming sentence queue.
  - Session history: completed rooms, rounds, learners, responses, CPD/CCI summaries.
  - Resource history: sentence approval/audio readiness changes if needed later.
- If the first implementation stays inside Admin, rename/anchor Analytics as **History & Analytics** and add a direct sidebar item to it.

### 8.2 Create Room should start from main ideas, not database configuration

Current state:

- Teacher Setup exposes course, lesson, database sections, CCI standard, capture mode, room title, host name, and ready check.
- This is correct functionally, but visually reads like a database setup form.

Problem:

- Teacher room creation should initially ask for the main teaching idea: what class/session is being created and what resource scope should be used.
- Details like host name, capture mode, scoring, CCI, and section internals should not dominate the first view.

Recommendation:

- Redesign Teacher Setup as a **Create Room recipe**:
  - Main idea summary: Course, Lesson, Topic/Sections, expected approved resources.
  - Primary CTA: Create room.
  - Advanced settings: hidden behind a compact modal/popover/drawer or collapsible “Advanced room options”.
- The ready check should read like a launch confirmation, not a long form audit.

### 8.3 Router/navigation includes items with no real page

Current state:

- `TopNavigation` includes `Users` and `Settings` links pointing to `/admin#users` and `/admin#settings`.
- `AppRoutes` only defines route-level screens for Home, Admin, Teacher Setup, Teacher Room, and Learner Room.
- Help/Settings header utility links also point to Admin hash targets.

Problem:

- Navigation suggests pages that do not exist.
- This reduces trust because users can click something that does not become a real screen.

Recommendation:

Choose one of these paths before release:

1. **Hide unavailable items**: remove Users, Settings, and Help links until real screens exist.
2. **Implement real placeholder screens**: add route-level pages with clear “Coming soon / not configured” content and no dead hash behavior.
3. **Fold into Admin sections**: keep Settings/Users as Admin cards or tabs only if they are visibly present inside Admin.

For the next task phase, the preferred direction is: **hide or disable fake navigation first**, then add real Users/Settings only when their product scope is defined.

## 9. Next Redesign Target

The next redesign should not be another broad visual restyle. It should be a product-structure redesign:

1. Make History discoverable and manageable.
2. Make Create Room start with main ideas and reveal advanced settings only when needed.
3. Remove or resolve fake navigation destinations.
4. Keep high-end design improvements focused on these workflows rather than decorating every card.
