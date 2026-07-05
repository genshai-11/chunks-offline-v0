# Accessibility Audit — Component Library Foundation

**Feature**: 002-component-library-foundation  
**Updated**: 2026-07-04

## Scope

- Primitive controls: Button, ButtonLink, Badge, Card, Panel, Input, Select, Tooltip, Dialog, Toast, Progress, Skeleton.
- Refactored entry flow: `RoleEntryPage` + `AppShell` primitive usage.
- Selected Teacher, Learner, and Admin role-layout compositions captured in Storybook.
- Compact dashboard sidebar navigation, compact app header, readable Home/Dashboard board, and Admin Library resource-card layout after Stitch/taste correction.
- Theme switching control after primitive refactor.

## Baseline rules

- Critical controls preserve a minimum `min-h-11` target where users act directly.
- Focus visibility uses the global `:focus-visible` CHUNKS Red outline.
- Disabled actions provide `disabledReason`, `disabledExplanation`, `title`, helper copy, or `aria-describedby`.
- Progress uses native `role="progressbar"` and live text for visible percentages.
- Dialog uses `role="dialog"` or `role="alertdialog"`, `aria-modal`, labelled title, Escape close, and focus restoration.
- Toast uses `role="status"` or `role="alert"` with appropriate `aria-live` behavior.

## Automated checks run

- `jest-axe` test coverage in `frontend/src/components/primitives/Accessibility.test.tsx`.
- Storybook a11y addon configured in `.storybook/preview.tsx` for story-level checks, including selected role-layout stories in `RoleLayouts.stories.tsx`.
- `npm test` validates primitive and primary-flow accessibility assertions.
- `npm run build-storybook` validates Storybook can render the primitive story catalogue.
- Phase 13 browser visual checks covered Dashboard, Admin History & Analytics, Teacher Setup, and Teacher Live Room. Browser console reported 0 errors after validation.

## Findings

- Initial axe run found two issues: a nested complementary landmark in `WorkspaceLayout` and an unnamed `Progress` progressbar. Both were fixed in code.
- Final automated axe run reports no violations in the rendered primitive set and refactored role entry flow.
- Theme-specific contrast still needs visual/manual review in browser for every production release because jsdom cannot fully evaluate rendered computed contrast for all CSS-variable themes.

## Manual validation notes

- Keyboard: sidebar navigation links, dashboard header utility actions, primary action buttons, theme radio buttons, inputs, select controls, resource-card selection buttons, and dialog close/confirm controls are keyboard reachable.
- State clarity: disabled Button/Input states expose reason text via title or nearby described text.
- Theme safety: token extraction keeps all themes routed through `tokens.css` and primitive/theme classes rather than per-screen overrides.
- Contrast safety: the Home/Dashboard correction removed white text on light card surfaces and now uses explicit ink/body text on white panels or true dark surfaces only.
- Phase 12 sentence-text-first correction keeps learner sentence content visible in human-readable language and demotes sentence codes to muted metadata. This improves comprehension for non-technical users while preserving room/code context.
- Phase 12 role-entry actions replace generic `Open` copy with explicit action labels, reducing ambiguous link/button purpose.
- Phase 12 Teacher history/upcoming resource controls use readable sentence snippets in checkbox labels so assistive technology announces meaningful choices instead of code-only identifiers.
- Phase 13 navigation truth removes fake Users, Settings, and Help links from primary shell navigation so keyboard and screen-reader users do not encounter dead destinations.
- Phase 13 Create Room recipe keeps a visible primary CTA and disabled reason while moving secondary controls into Advanced Options that remains keyboard-accessible through `CollapsiblePanel`.
- Phase 13 History & Queue and History & Analytics sections use visible headings and human-readable summaries to make history management discoverable without relying on hash-only labels.
