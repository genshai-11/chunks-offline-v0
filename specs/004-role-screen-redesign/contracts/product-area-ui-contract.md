# UI Contract: Product Area Redesign

## Purpose

Defines what each top-level product area must contain after the role-screen redesign.

## Global Contract

Every product area MUST include:

1. A truthful navigation destination or existing-route alias.
2. A visible page purpose.
3. An icon-led **Inside this area** feature map.
4. Local anchors/cards or filters for main feature groups when the page contains multiple groups.
5. Summary-only orientation data in the feature map, never full records.
6. Loading, empty, and error states for the primary content.
7. Keyboard-accessible actions and disabled explanations where actions can be unavailable.
8. Validation evidence: automated test, Storybook/visual check, browser check, or documented reason.

## Product Area Contracts

### Dashboard

Ownership: Product map.

Must contain:
- App/product-area map for Dashboard, Library, History, Create Room, Live Room, Learner.
- Role shortcuts or journey starters.
- Minimal readiness/status summaries.
- Clear next action for each product area.

Must not contain:
- Full resource lists.
- Full analytics tables.
- Fake admin/teacher/settings links.

### Library

Ownership: Resources, standards, audio.

Must contain:
- Inside this area map for Resource Manager, Standards, Audio Readiness, and History path.
- Resource management section with filters/pagination.
- Standards/configuration sections for CCI and CVR.
- Audio readiness actions/status.
- Batch action confirmation behavior.

Must not contain:
- Primary analytics/history workspace.
- Full History analytics duplicated in the map.

### History

Ownership: Analytics and review.

Must contain:
- Inside this area map for room history, learner distribution, response/CPD/CCI summaries.
- Completed room/session analytics.
- Learner response distribution.
- Empty-state explanation when no sessions exist.

Must not contain:
- Resource editing controls.
- Create Room setup controls.

### Create Room

Ownership: Setup and launch preparation.

Must contain:
- Inside this area map for room idea/title, course/lesson/topic scope, readiness, advanced options.
- Create Room recipe as primary flow.
- Approved resource count/readiness summary.
- Advanced options for secondary details.
- Clear disabled reasons for Create Room.

Must not contain:
- Long database-first configuration as the first visible experience.
- Live room controls before room creation.

### Live Room

Ownership: Teacher control.

Must contain:
- Inside this area map for Now/Current Round, Queue/History, Roster, Audio, Progress, Share.
- Current sentence/round status.
- Primary round controls.
- History & Queue controls.
- Roster and share link.
- Audio playback availability.
- Progress/captured response summary.

Must not contain:
- Admin resource editing.
- Learner-only response controls as teacher actions.

### Learner

Ownership: Join/respond.

Must contain:
- Join flow for display name and room code/share link.
- Learner room state banner.
- Waiting/observing/active/captured/already-responded/blocked states.
- Response controls only when eligible.
- Clear captured/feedback state.

Must not contain:
- Admin controls.
- Teacher controls.
- Library or History editing links.

## Visual Handoff Contract

Before implementation of significant layout changes:

1. Define component inventory for the product area.
2. Decide whether Stitch or static reference is needed.
3. If Stitch is used, confirm target project/screen before generation/editing.
4. Record Lucy approval before frontend implementation.
5. Keep implementation faithful to the approved structure while adapting to CHUNKS primitives/tokens.

## Validation Contract

A product-area slice is complete only when:

- Its screen/component inventory is recorded.
- Its Inside this area map is visible.
- Its main feature groups are reachable.
- Role isolation is preserved.
- Tests/build pass for affected code.
- Browser visual check confirms the product area.
