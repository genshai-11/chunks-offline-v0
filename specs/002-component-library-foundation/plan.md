# Implementation Plan: Component Library Foundation + Visual Language & Theming Audit

**Branch**: `002-component-library-foundation` | **Date**: 2026-07-04 | **Spec**: `specs/002-component-library-foundation/spec.md`

**Input**: Feature specification from `/specs/002-component-library-foundation/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: TypeScript 5.x, React 18+, Tailwind CSS 3.x

**Primary Dependencies**: shadcn/ui primitives, Radix UI, Tailwind CSS, lucide-react icons; Stitch MCP (Google Stitch design system) for visual language generation and theming audit (resolved: design-time only, see research.md)

**Storage**: N/A (presentation-layer only)

**Testing**: Vitest + React Testing Library, Storybook for component validation

**Target Platform**: Modern browsers (Chrome/Edge/Firefox/Safari latest 2 versions), responsive web (mobile/tablet/desktop)

**Project Type**: Component library + design system foundation for existing web app

**Performance Goals**: Sub-16ms paint for interactive controls, zero layout shift on theme switch

**Constraints**: Must preserve existing Supabase realtime subscriptions and learner response flow; no breaking changes to room/round UI contracts; Stitch MCP output must map to Tailwind tokens (not replace the runtime theming system)

**Scale/Scope**: 3 primary user roles (Admin, Teacher Host, Learner), ~20-30 screens across classroom flows; incremental migration acceptable; Stitch MCP used for design exploration and visual language audit, not as runtime dependency

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Generated plans MUST explicitly evaluate these CHUNKS constitution gates:

- **Domain-Led Live Learning Core**: ✅ Plan preserves room/round/response/progress contracts; primitives must expose disabled states with explanations for learner eligibility
- **Supabase-First Durable Realtime State**: ✅ N/A (presentation only; no state model changes)
- **Learner-Safe UX and Accessibility**: ✅ Explicit requirement (FR-003, SC-003); 44px targets, focus visibility, contrast, disabled explanations are acceptance criteria
- **Dynamic Scoring and Historical Auditability**: ✅ N/A (no scoring changes)
- **Testable Incremental Delivery and Release Control**: ✅ Storybook + component tests + quickstart validation; incremental adoption path defined; release gates inherited from constitution

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
