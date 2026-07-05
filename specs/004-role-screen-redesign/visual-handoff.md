# Visual Handoff — Role Screen Redesign

**Feature**: 004-role-screen-redesign  
**Updated**: 2026-07-04 18:01 GMT+7

## Dashboard — Stitch Prompt

**Target product area**: Dashboard  
**Target route after implementation**: `/`  
**Preferred Stitch project**: `projects/13176206325646835063` — CHUNKS Product-Area Role Redesign  
**Status**: reset to clean project, pending design system confirmation and all-screen generation
**Previous screen**: `projects/16464063998967172630/screens/828021717b3d4bb7be545720be8ebe1a` — Chunks Product Overview, superseded by clean-project workflow
**New project created at**: 2026-07-04 18:13 GMT+7

### Prompt for Stitch

Design a premium but classroom-safe desktop web dashboard for CHUNKS Offline Live Room. This screen is the top-level product map, not a data-heavy admin dashboard.

Product context:
- CHUNKS is an in-person classroom live-room tool.
- Admin prepares sentence resources, standards, and audio.
- Teacher creates a room, runs a live room, opens sentence windows, manages queue/audio/roster/progress.
- Learners join and respond.
- History reviews completed room/session analytics and learner response distribution.

Navigation/product areas to show clearly:
1. Dashboard — product map
2. Library — resources, CCI/CVR standards, audio readiness
3. History — analytics, completed rooms, learner response distribution
4. Create Room — setup, room idea, course/lesson/topic scope, readiness, advanced options
5. Live Room — teacher control, current round, queue/history, roster, audio, progress, share
6. Learner — join, respond, captured/blocked states

Main design goal:
Make it immediately clear what is inside each product area. Use an “Inside this area” pattern near the top with icons and minimal text. The Dashboard should answer: “Where do I go next?” in under 60 seconds.

Layout requirements:
- Desktop-first responsive web app layout, 1440px wide reference.
- Compact left sidebar navigation with CHUNKS brand and the six product areas.
- Main dashboard content should feel like a product command map, not a marketing landing page.
- Use asymmetric, premium layout but keep classroom clarity.
- Avoid generic equal 3-card rows. Use a stronger product-map composition such as one large primary card plus smaller grouped cards, or an asymmetric bento grid.
- Include a top “Inside this area” strip/cards with: Product Map, Classroom Loop, Readiness Snapshot.
- Include a classroom loop strip: Library → Create Room → Live Room → Learner → History.
- Include product-area cards for Library, History, Create Room, Live Room, Learner. Dashboard itself may be represented as current/home.
- Include a lightweight readiness snapshot with only summary data, not full tables or long records.

Visual style:
- Clean premium SaaS/dashboard style.
- CHUNKS brand accent: deep red, warm neutral background, off-black text.
- No purple/neon AI look.
- No emoji.
- Use icons, badges, thin borders, and compact cards.
- Minimal text. Every card should have a short label, one-line purpose, and optional tiny status.
- Use monospaced numbers only for metrics/status values.
- Strong focus on hierarchy and route clarity.

Content examples:
- Page title: Dashboard
- Short purpose: Choose where the classroom loop starts.
- Inside this area items:
  - Product Map — all destinations
  - Classroom Loop — prepare to review
  - Readiness Snapshot — summary only
- Product-area cards:
  - Library: Resources, standards, audio
  - History: Room analytics and learner response review
  - Create Room: Setup a room from a class idea
  - Live Room: Run rounds, queue, audio, roster, progress
  - Learner: Join and respond safely
- Example summary metrics:
  - Resources ready: 247
  - Audio gaps: 12
  - Recent rooms: 8
  - Captured responses: 134

Interaction states to imply visually:
- Active current page = Dashboard
- Product cards are clickable destinations
- No disabled/fake Users, Settings, Help links
- Readiness snapshot links to relevant product areas

Do not include:
- Full resource tables
- Full analytics tables
- Settings page
- Users page
- Help page
- Fake links
- Large marketing hero
- Emoji

Deliver as a polished dashboard screen suitable for frontend implementation with React/Tailwind primitives.

### Implementation notes after approval

- Bring design back into `frontend/src/routes/RoleEntryPage.tsx`.
- Reuse CHUNKS primitives/tokens where possible.
- Product metadata should be centralized in `frontend/src/components/layout/productAreas.ts` if implementation proceeds.
- Dashboard should not fetch or render full datasets; use summary placeholders or existing available counts only.

### Approval log

- 2026-07-04 18:05 GMT+7 — Generated in prior Stitch project as `Chunks Product Overview` (`projects/16464063998967172630/screens/828021717b3d4bb7be545720be8ebe1a`). Superseded by clean-project workflow.
- 2026-07-04 18:13 GMT+7 — Created new clean Stitch project `CHUNKS Product-Area Role Redesign` (`projects/13176206325646835063`). Pending design system confirmation and all-screen generation.


## Clean Project — Calm Theme All-Screen Generation

**Project**: `projects/13176206325646835063` — CHUNKS Product-Area Role Redesign  
**Design system**: `assets/1106080313188965094` — CHUNKS Calm Product Areas  
**Generated/downloaded**: 2026-07-04 21:51 GMT+7  
**Status**: generated, pending Lucy page-by-page review and edits

| Product area / screen | Stitch screen ID | Local screenshot | Local HTML |
|---|---|---|---|
| CHUNKS Create Room Setup | `58735b68876f46918867f67f7cf7b911` | [chunks-create-room-setup-58735b68.jpg](../../.stitch/designs/004-role-screen-redesign/chunks-create-room-setup-58735b68.jpg) | [chunks-create-room-setup-58735b68.html](../../.stitch/designs/004-role-screen-redesign/chunks-create-room-setup-58735b68.html) |
| CHUNKS History & Analytics | `378fb520dc5740f59e59eea82488f158` | [chunks-history-analytics-378fb520.jpg](../../.stitch/designs/004-role-screen-redesign/chunks-history-analytics-378fb520.jpg) | [chunks-history-analytics-378fb520.html](../../.stitch/designs/004-role-screen-redesign/chunks-history-analytics-378fb520.html) |
| CHUNKS Learner Room - Live Interaction | `a42e8b189f8b42908f115f35b91ebafa` | [chunks-learner-room-live-interaction-a42e8b18.jpg](../../.stitch/designs/004-role-screen-redesign/chunks-learner-room-live-interaction-a42e8b18.jpg) | [chunks-learner-room-live-interaction-a42e8b18.html](../../.stitch/designs/004-role-screen-redesign/chunks-learner-room-live-interaction-a42e8b18.html) |
| CHUNKS Live Room Console | `2b7ce63438f74ea9bebdaa6c154f5cb3` | [chunks-live-room-console-2b7ce634.jpg](../../.stitch/designs/004-role-screen-redesign/chunks-live-room-console-2b7ce634.jpg) | [chunks-live-room-console-2b7ce634.html](../../.stitch/designs/004-role-screen-redesign/chunks-live-room-console-2b7ce634.html) |
| CHUNKS Library | `be920baa093e418dae87ab25d5de1433` | [chunks-library-be920baa.jpg](../../.stitch/designs/004-role-screen-redesign/chunks-library-be920baa.jpg) | [chunks-library-be920baa.html](../../.stitch/designs/004-role-screen-redesign/chunks-library-be920baa.html) |
| CHUNKS Dashboard - Product Map View | `fb6eb876b5c448949ccd580a3690144e` | [chunks-dashboard-product-map-view-fb6eb876.jpg](../../.stitch/designs/004-role-screen-redesign/chunks-dashboard-product-map-view-fb6eb876.jpg) | [chunks-dashboard-product-map-view-fb6eb876.html](../../.stitch/designs/004-role-screen-redesign/chunks-dashboard-product-map-view-fb6eb876.html) |
| CHUNKS Learner - Live Interaction Mobile | `8c32f3f281874cd3811995a7f3fe5169` | [chunks-learner-live-interaction-mobile-8c32f3f2.jpg](../../.stitch/designs/004-role-screen-redesign/chunks-learner-live-interaction-mobile-8c32f3f2.jpg) | [chunks-learner-live-interaction-mobile-8c32f3f2.html](../../.stitch/designs/004-role-screen-redesign/chunks-learner-live-interaction-mobile-8c32f3f2.html) |
| CHUNKS Learner - Join Room | `5441782890974116b7e94aedf8c7963d` | [chunks-learner-join-room-54417828.jpg](../../.stitch/designs/004-role-screen-redesign/chunks-learner-join-room-54417828.jpg) | [chunks-learner-join-room-54417828.html](../../.stitch/designs/004-role-screen-redesign/chunks-learner-join-room-54417828.html) |
| CHUNKS Dashboard - Full View Fix | `c0d8b3d5c2ea48fa8e9b2491399b2bfd` | [chunks-dashboard-full-view-fix-c0d8b3d5.jpg](../../.stitch/designs/004-role-screen-redesign/chunks-dashboard-full-view-fix-c0d8b3d5.jpg) | [chunks-dashboard-full-view-fix-c0d8b3d5.html](../../.stitch/designs/004-role-screen-redesign/chunks-dashboard-full-view-fix-c0d8b3d5.html) |

### Notes

- Calm/light theme was used from current repo design tokens, not the prior dark Stitch design system.
- New clean Stitch project supersedes prior generated Dashboard screen; old project was not deleted because deleting is destructive and requires explicit confirmation.
- Generated set includes two Dashboard variants and desktop/mobile learner variants; Lucy can choose/fix page by page and role by role.

## Imagegen Direction Options - Navigation + Dashboard

**Generated**: 2026-07-04 22:16 GMT+7
**Purpose**: quick visual direction options for Lucy feedback before editing `TopNavigation` and `RoleEntryPage`.
**Status**: pending Lucy selection.

| Keyword | Best fit | Local mockup |
|---|---|---|
| `COMMAND MAP` | Dashboard as top-level destination map with asymmetric product-area cards | [dashboard-navigation-option-a-command-map.png](imagegen-options/dashboard-navigation-option-a-command-map.png) |
| `CLASSROOM LOOP` | Dashboard centered on the classroom sequence: Library -> Create Room -> Live Room -> Learner -> History | [dashboard-navigation-option-b-classroom-loop.png](imagegen-options/dashboard-navigation-option-b-classroom-loop.png) |
| `READINESS FIRST` | Dashboard centered on launch readiness and next action, with product areas grouped below | [dashboard-navigation-option-c-readiness-first.png](imagegen-options/dashboard-navigation-option-c-readiness-first.png) |

### Selection notes

- Use `COMMAND MAP` if the first question should be "where do I go next?"
- Use `CLASSROOM LOOP` if the first question should be "how does the classroom flow work?"
- Use `READINESS FIRST` if the first question should be "am I ready to launch or continue a room?"

## Imagegen Direction Options - History

**Generated**: 2026-07-04 22:47 GMT+7
**Purpose**: quick visual direction options for History before/while editing `SessionAnalyticsDashboard`.
**Status**: `HISTORY OPTION A - AUDIT MAP` applied as the default first slice.

| Keyword | Best fit | Local mockup |
|---|---|---|
| `HISTORY OPTION A - AUDIT MAP` | Read-only audit map with Completed Rooms, Response Distribution, Learner Trends, Audit Snapshot | [history-option-a-audit-map.png](imagegen-options/history-option-a-audit-map.png) |
| `HISTORY OPTION B - REVIEW BOARD` | Larger completed-room review board with analytics side panels | [history-option-b-review-board.png](imagegen-options/history-option-b-review-board.png) |

### Selection notes

- Use `HISTORY OPTION A - AUDIT MAP` when History should stay compact inside `/admin#history-analytics`.
- Use `HISTORY OPTION B - REVIEW BOARD` if History later becomes a full standalone route or larger review workspace.
