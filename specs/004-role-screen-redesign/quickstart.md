# Quickstart: Role Screen Redesign Validation

## Purpose

Validate that the role-screen redesign provides clear product-area navigation, Inside this area maps, component inventories, role-safe flows, and approved visual handoffs before implementation is considered complete.

## Prerequisites

- Feature spec: `specs/004-role-screen-redesign/spec.md`
- Plan: `specs/004-role-screen-redesign/plan.md`
- UI contract: `specs/004-role-screen-redesign/contracts/product-area-ui-contract.md`
- Frontend dependencies installed in `frontend/`

## Required commands

From `frontend/`:

```bash
npm test
npm run build
npm run build-storybook
```

Expected:
- Unit/integration tests pass.
- Production build passes.
- Storybook build passes.
- Existing known chunk-size warnings may remain unless they become worse or block build.

## Screen inventory validation

Before code edits for each product area, confirm a screen/component inventory exists with:

- Product area name
- Route/anchor
- Current components
- Current UX/logic issues
- Proposed Inside this area map entries
- Component inventory
- Visual handoff needed? yes/no
- Approval status
- Validation plan

## Product-area browser checks

Use local browser validation after implementation slices.

### Dashboard

Route: `/`

Expected:
- Shows product-area map for Dashboard, Library, History, Create Room, Live Room, Learner.
- Each product area has clear purpose and next action.
- No fake Users/Settings/Help destinations.

### Library

Route: `/admin` or approved Library route/alias

Expected:
- Inside this area map shows Resources, Standards, Audio Readiness, and History path.
- Resource list remains filtered/paginated, not duplicated in the map.
- CCI/CVR standards remain accessible.
- Batch/destructive actions still require confirmation.

### History

Route: `/admin#history-analytics` or approved History route/alias

Expected:
- Inside this area map shows room history, learner distribution, response/CPD/CCI summaries.
- Analytics/history content is visibly separate from Library editing.
- Empty history state is clear if no data exists.

### Create Room

Route: `/teacher/setup` or approved Create Room route/alias

Expected:
- Inside this area map shows room idea/title, course/lesson/topic scope, readiness, and advanced options.
- Create Room recipe is primary.
- Advanced options are secondary.
- Disabled Create Room explains why.

### Live Room

Route: `/teacher/room/:roomCode` or approved Live Room route/alias

Expected:
- Inside this area map shows Now/Current Round, Queue/History, Roster, Audio, Progress, Share.
- Teacher next action is clear for lobby/open/closed/finished states.
- History & Queue is reachable without scanning long lists.
- Audio and progress summaries remain clear.

### Learner Join

Route: `/room/:roomCode` or approved Learner route/alias before membership

Expected:
- Join form explains room/display name requirements.
- Learner route does not expose Admin/Teacher controls.
- Errors are visible and recoverable.

### Learner Room

Route: `/room/:roomCode` after join

Expected:
- Learner sees waiting/observing/active/captured/already-responded/blocked state clearly.
- Response controls only appear when eligible.
- Learner does not see Library, History editing, or Teacher controls inside learner room flow.

## Visual handoff validation

For any significant page/component redesign:

1. Confirm component inventory exists.
2. Confirm Stitch/static design artifact exists or a reason is recorded for skipping visual handoff.
3. Confirm Lucy approval is recorded before frontend implementation.
4. Confirm implemented layout follows approved structure while using CHUNKS primitives/tokens.

## Completion criteria

The feature is ready for implementation completion only when:

- All product areas have inventory records.
- All implemented product areas have Inside this area maps.
- Role isolation is preserved.
- Automated validation passes.
- Browser visual checks pass for changed areas.
- No production deploy or remote DDL is performed without release controls.
