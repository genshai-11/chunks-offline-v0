# Implementation Plan: Role Screen Redesign

**Branch**: `004-role-screen-redesign` | **Date**: 2026-07-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-role-screen-redesign/spec.md`

## Summary

Full product-area redesign pass for CHUNKS role screens. The app will use strict product-area navigation: **Dashboard**, **Library**, **History**, **Create Room**, **Live Room**, and **Learner**. Each product area gets an icon-led, minimal-text **Inside this area** feature map plus local anchors/cards or filters for its main component groups. Execution is review-first: document all screens and component inventories, use Stitch or equivalent visual handoff for significant layout changes, get Lucy approval, then implement by product-area slices.

## Technical Context

**Language/Version**: TypeScript, React 19, Vite

**Primary Dependencies**: Existing CHUNKS primitives/tokens, Tailwind, React Testing Library, Vitest, Storybook, optional Stitch handoff through configured Stitch MCP/source

**Storage**: No new storage expected. Existing Supabase Postgres room/resource/history data remains unchanged.

**Testing**: `npm test`, `npm run build`, `npm run build-storybook`, browser visual checks for each product area

**Target Platform**: Responsive web app for classroom Admin, Teacher, and Learner workflows

**Project Type**: Frontend web app with Supabase-backed durable realtime state

**Performance Goals**: Product-area maps and anchors should render immediately with summary data only; large lists remain inside filtered sections/components rather than map cards.

**Constraints**: No fake routes/tabs; learner routes stay role-isolated; design changes must follow CHUNKS tokens/primitives and frontend design skill; significant new layouts require visual handoff approval before code; no remote database or production deploy in this feature.

**Scale/Scope**: Covers reachable role screens/product areas: Dashboard, Library, History, Create Room, Live Room, Learner Join, Learner Room.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Domain-Led Live Learning Core**: PASS — product-area redesign preserves Admin prepare, Teacher create/run, Learner respond, and History review loops.
- **Supabase-First Durable Realtime State**: PASS — no schema change is planned; UI must continue deriving live-room states from durable Supabase state.
- **Learner-Safe UX and Accessibility**: PASS — learner routes remain isolated; disabled reasons, focus, contrast, and touch targets are explicit requirements.
- **Dynamic Scoring and Historical Auditability**: PASS — scoring/history semantics are preserved; History area clarifies audit/review without changing formulas.
- **Testable Incremental Delivery and Release Control**: PASS — implementation is sliced by product area, with tests/build/storybook/browser validation; no deploy allowed without Lucy release controls.
- **CodeGraph-First Codebase Work**: PASS WITH FALLBACK — CodeGraph source is inactive in this session; implementation tasks must either enable/use CodeGraph or document fallback with grep/read exploration before edits.

## Project Structure

### Documentation (this feature)

```text
specs/004-role-screen-redesign/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── product-area-ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── src/components/layout/
│   ├── AppShell.tsx
│   ├── TopNavigation.tsx
│   └── WorkspaceLayout.tsx
├── src/components/primitives/
├── src/features/admin/
│   ├── AdminWorkspacePage.tsx
│   ├── analytics/
│   ├── resources/
│   ├── cci/
│   └── cvr/
├── src/features/teacher/
│   ├── TeacherSetupPage.tsx
│   ├── TeacherRoomPage.tsx
│   └── components/
├── src/features/learner/
│   ├── LearnerJoinPage.tsx
│   ├── LearnerRoomPage.tsx
│   └── components/
├── src/routes/
│   ├── AppRoutes.tsx
│   └── RoleEntryPage.tsx
└── tests/
    ├── integration/
    ├── unit/
    └── e2e/
```

**Structure Decision**: Implement as frontend/product-structure work using existing layout shell, primitives, feature pages, and tests. Add shared orientation/feature-map components only if reuse across product areas justifies it.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Phase Plan

### Phase 0 — Research and screen inventory

1. Inventory reachable product areas and current components: Dashboard, Library, History, Create Room, Live Room, Learner Join, Learner Room.
2. For each product area, record owner, route, purpose, current component groups, UX/logic issues, proposed Inside this area map, and whether Stitch/design handoff is required.
3. Confirm visual handoff workflow: use existing primitives directly for small layout corrections; use Stitch for significant page/component redesign after Lucy confirms target product area and component inventory.
4. Confirm no new route or tab is fake; aliases may point to existing routes only when the destination has real content.

### Phase 1 — Design artifacts

1. Create `data-model.md` for Product Area, Inside This Area Map, Screen Inventory Item, Component Inventory Item, Feature Group, Role State, and Visual Handoff.
2. Create `contracts/product-area-ui-contract.md` defining the expected UI contract per product area.
3. Create `quickstart.md` with validation scenarios for Dashboard, Library, History, Create Room, Live Room, Learner Join, and Learner Room.
4. Re-check constitution gates after design artifacts.

### Phase 2 — Tasks and implementation readiness

1. Generate tasks grouped by product-area slices.
2. Require review-first tasks before code edits.
3. Require Stitch/visual approval tasks before large layout implementation.
4. Validate each slice independently with tests/build/browser checks.

## Release Control

No production deploy or remote Supabase DDL is part of this feature. Before any future deployment: commit, tag if promoting, validate preview/canary, document rollback, verify hosting/functions restore path, and run post-deploy checks.

## Post-Design Constitution Check

- **Domain-Led Live Learning Core**: PASS — planned product areas map directly to CHUNKS classroom loop.
- **Supabase-First Durable Realtime State**: PASS — data remains durable; UI maps summarize only.
- **Learner-Safe UX and Accessibility**: PASS — learner-safe states are required in UI contracts and quickstart validation.
- **Dynamic Scoring and Historical Auditability**: PASS — History is clarified as analytics/audit review; formulas unchanged.
- **Testable Incremental Delivery and Release Control**: PASS — tasks must slice by product area and run required validation.
- **CodeGraph-First Codebase Work**: PASS WITH FALLBACK — CodeGraph use or documented fallback remains an implementation task gate.
