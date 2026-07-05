# Stitch Visual Language Variant Audit

**Feature**: 002-component-library-foundation  
**Project**: Stitch `projects/16464063998967172630` — Chunks Offline Live Room  
**Updated**: 2026-07-04 08:48–09:00 GMT+7

## Stitch source reviewed

Stitch MCP was run against the existing **Chunks Offline Live Room** project. The project already contained design-system variants generated during prior Stitch exploration, so this audit uses those Stitch systems rather than creating duplicate screens.

## Candidate variants

### 1. Chunks Live Room Dark — `assets/10610589535859762881`

- Mode: Dark
- Fonts: Geist / Geist / Public Sans
- Palette: near-black surfaces, red primary, yellow/green response colors
- Strengths: strong teacher command-center tone, high contrast, focused live-room state
- Risk: dark-first approach is more intensive for learners and is not the current frontend default
- Mapping decision: keep as reference for Theme 3 / future dark console refinements, not default runtime theme

### 2. Warm Editorial Learning Interface — `assets/ab9cf6af03034df88df019f0d5d791c3`

- Mode: Light
- Fonts: Oswald / Be Vietnam Pro / JetBrains Mono
- Palette: warm paper, crimson primary, soft outlines
- Strengths: calm classroom/editorial feel, strong fit for Theme 1 modernization
- Risk: warmer palette differs from current white-canvas baseline
- Mapping decision: inform Theme 1 token audit: keep calm surfaces, reduce decorative noise, maintain clear red CTA

### 3. Warm Editorial Learning — `assets/e20c7574fb4d4a0983b12e6d64fd2e2f`

- Mode: Light
- Fonts: Oswald / Be Vietnam Pro
- Palette: tactile paper canvas, dictionary red, cream outline
- Strengths: readable learning-focused surfaces and chunk-like bento organization
- Risk: too editorial for fast live-room operations if overused
- Mapping decision: use as guidance for role cards and progress bento surfaces only

### 4. Academic Editorial — `assets/e2153fd24e9e4830a72c3048ee8e9480`

- Mode: Light
- Fonts: Oswald / Source Serif 4 / Source Sans 3
- Palette: academic paper, burgundy primary, muted secondary
- Strengths: restrained, mature, low-shadow system
- Risk: serif-heavy tone may feel less immediate for classroom live controls
- Mapping decision: use as anti-pattern guardrail: keep academic calm, but avoid serif runtime shift

## Approved mapping for this implementation

The user asked to run the remaining US2/US3 work end-to-end at 2026-07-04 08:48 GMT+7, so the following mapping was applied:

1. Keep four runtime themes (`calm`, `bauhaus`, `modular`, `craft`) and avoid adding a fifth runtime theme.
2. Extract existing frontend theme variables to `frontend/src/styles/tokens.css`.
3. Add shared radius and card-spacing tokens to every theme.
4. Expose radius and spacing through `frontend/tailwind.config.ts`.
5. Keep Stitch output as design-time guidance only; no Stitch runtime dependency added.
6. Use primitives and theme classes as the only supported styling integration layer.

## Acceptance validation

- Central token file now drives all runtime theme variables.
- Tailwind consumes token aliases via CSS variables.
- ThemeSwitcher now uses primitive Button/Badge/Panel instead of one-off button styling.
- Storybook theme toolbar can preview the primitive catalogue across all four runtime themes.
