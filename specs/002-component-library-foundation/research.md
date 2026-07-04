# Research: Component Library Foundation + Stitch MCP Integration

**Feature**: 002-component-library-foundation
**Date**: 2026-07-04

## Research Tasks

### 1. Stitch MCP Integration Decision

**Question**: Should Stitch MCP (Google Stitch design system) be used to generate/decide visual language and theming for this component library foundation?

**Context from spec**:
- FR-002: Central definition and application of visual language rules
- FR-004: Multiple supported visual themes must apply through primitives and central visual language
- Constitution: "The active design language MUST follow `DESIGN.md`. Supported options are Theme 1 calm classroom console and Theme 2 Bauhaus classroom poster"
- Existing theming uses Tailwind CSS tokens (to be evolved, not replaced)

**Decision**: **Use Stitch MCP for design-time exploration and visual language audit only** — NOT as runtime dependency.

**Rationale**:
- Stitch MCP excels at generating consistent visual language, color palettes, typography scales, and component variants from prompts or reference screens.
- It produces design tokens and guidelines that can be exported and mapped to Tailwind CSS configuration.
- Keeps runtime stack unchanged (Tailwind + shadcn/ui primitives) while leveraging AI-assisted design consistency.
- Aligns with "central visual language" requirement (FR-002) by treating Stitch output as the source of truth for DESIGN.md and token definitions.
- Avoids adding a new CSS-in-JS runtime (e.g., @stitches/react) that would conflict with Tailwind.

**Alternatives considered**:
- Manual Tailwind theming only: Rejected — too slow for audit, risks inconsistency across 20-30 screens.
- Full Stitch runtime theming: Rejected — violates "evolve rather than replace" assumption; adds unnecessary complexity.
- Figma + manual token sync: Rejected — Stitch MCP provides faster iteration for this project size.

**Implementation approach**:
- Phase 0: Use Stitch MCP to generate 2-3 visual language variants aligned with existing Theme 1/Theme 2.
- Export Stitch design tokens → map to `tailwind.config.js` and CSS custom properties.
- Update `DESIGN.md` with Stitch-derived guidelines.
- Component primitives (shadcn/ui + Radix) remain the runtime implementation; Stitch only informs the visual contract.

**Open follow-ups** (to be validated in quickstart.md):
- Confirm Stitch MCP output format (JSON tokens, CSS, or MD guidelines).
- Verify mapping script from Stitch tokens to Tailwind (one-time or repeatable?).

---

### 2. Component Primitive Scope

**Question**: Which primitives are in scope for the foundation library?

**Decision**: Start with: Button, Card, Panel, Input, Select, Badge, Tooltip, Dialog, Toast, Progress, Skeleton.

**Rationale**: Covers 80% of classroom interaction surfaces (response buttons, teacher controls, admin forms, learner status).

---

### 3. Accessibility Baseline

**Decision**: All primitives must expose `aria-*` attributes, keyboard navigation, 44px minimum touch targets (per constitution), and disabled-state explanations via `title` or adjacent helper text.

**Validation**: Storybook accessibility addon + manual keyboard/flow testing in quickstart.md.

---

## Next Steps

- Proceed to Phase 1: data-model.md (N/A — no data entities), contracts/ (UI contracts for primitives), quickstart.md (Storybook + validation scenarios).
- After plan complete → `/speckit-tasks` to generate implementation tasks.
