# Data Model: Role Screen Redesign

## Product Area

Represents a top-level user-facing destination.

Fields:
- `id`: canonical identifier: `dashboard`, `library`, `history`, `create-room`, `live-room`, `learner`.
- `label`: visible navigation label.
- `purpose`: one-sentence user-facing purpose.
- `ownerRole`: primary role: Admin, Teacher, Learner, or Shared.
- `route`: existing or planned route/anchor.
- `primaryAction`: main action from this area.
- `featureGroups`: ordered list of Feature Groups.
- `emptyState`: what users see when the area has no data.
- `validation`: tests/browser checks proving the area works.

Validation rules:
- Every Product Area must have real content; no fake destinations.
- Each Product Area must map to strict ownership:
  - Dashboard = product map
  - Library = resources/standards/audio
  - History = analytics
  - Create Room = setup
  - Live Room = teacher control
  - Learner = join/respond

## Inside This Area Map

A compact orientation component at the top of a Product Area.

Fields:
- `productAreaId`: parent Product Area.
- `items`: ordered map entries.
- `summaryMetrics`: optional lightweight counts/status only.
- `anchors`: local section destinations.
- `primaryAction`: optional CTA for the area.
- `style`: icon-led, minimal text, dynamic visual treatment.

Validation rules:
- Must not show full datasets.
- Must use user-facing labels, not internal IDs.
- Must use icons plus minimal text.
- Must support keyboard navigation to anchors/actions.

## Screen Inventory Item

A review record created before implementation.

Fields:
- `productAreaId`: Product Area being reviewed.
- `route`: current route or anchor.
- `screenName`: visible screen/panel name.
- `currentComponents`: component inventory before redesign.
- `currentIssues`: UI/UX/logic problems found.
- `proposedChange`: redesign recommendation.
- `requiresVisualHandoff`: whether Stitch/equivalent approval is required.
- `approvalStatus`: `not-needed`, `pending`, `approved`, or `rejected`.
- `validationPlan`: tests and browser checks for this screen.

Validation rules:
- Each reachable role screen must have an inventory item before code changes.
- Significant layout changes must have visual approval before implementation.

## Component Inventory Item

A reusable or page-local component/feature block inside a product area.

Fields:
- `name`: component/feature name.
- `purpose`: what the component helps the user do.
- `roleStateCoverage`: loading, empty, error, waiting, active, captured, blocked, finished as applicable.
- `dataShown`: main data shown directly.
- `dataHiddenOrFiltered`: data intentionally kept behind filters/detail sections.
- `actions`: user actions inside the component.
- `accessibilityNotes`: labels, disabled reasons, focus behavior.

Validation rules:
- Must identify primary content, filters, summaries, actions, empty states, and error/loading states.
- Must avoid full data dumps in orientation maps.

## Feature Group

A visible cluster inside a Product Area.

Examples:
- Resource Manager
- Standards
- Audio Readiness
- Session Analytics
- Create Room Recipe
- Current Round
- History & Queue
- Roster
- Teacher Audio
- Progress
- Join Room
- Learner Response

Fields:
- `label`: user-facing group name.
- `anchor`: local section anchor.
- `summary`: minimal description.
- `primaryComponent`: component that owns the group.
- `primaryAction`: main action if any.

## Role State

A role-specific UI condition that must remain clear after redesign.

Values:
- `loading`
- `empty`
- `error`
- `ready`
- `waiting`
- `active`
- `captured`
- `already-responded`
- `blocked`
- `finished`

Validation rules:
- Learner states must explain whether the learner is waiting, assigned/eligible, observing, captured, already responded, or blocked.
- Teacher states must explain next room action.
- Admin states must explain empty/error/batch-action outcomes.

## Visual Handoff

A Stitch or equivalent design artifact used before significant layout implementation.

Fields:
- `productAreaId`: related Product Area.
- `componentInventory`: components covered.
- `handoffTool`: `stitch`, `static-reference`, or `not-needed`.
- `handoffLinkOrNote`: pointer to design artifact or reason skipped.
- `approvalStatus`: `pending`, `approved`, `rejected`, or `not-needed`.
- `implementationNotes`: constraints for bringing the approved design into code.

Validation rules:
- Significant new page/component layouts must not be implemented until approved.
- Small copy/spacing/primitive changes may mark visual handoff as `not-needed` with reason.
