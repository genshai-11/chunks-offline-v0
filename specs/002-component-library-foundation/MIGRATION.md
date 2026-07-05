# Primitive Migration Guide

**Feature**: 002-component-library-foundation  
**Updated**: 2026-07-04

## Goal

Move new UI work and opportunistic refactors toward `frontend/src/components/primitives` so styling, state, sizing, and accessibility behavior remain centralized.

## Preferred imports

```tsx
import { Badge, Button, Card, Input, Panel, Select } from '../components/primitives'
```

Use legacy `components/ui/*` wrappers only when migrating existing files incrementally. The wrappers now delegate to primitives for backward compatibility.

## Migration rules

1. Replace one-off button classes with `Button` / `ButtonLink` variants: `primary`, `secondary`, `ghost`, `destructive`.
2. Replace status spans/chips with `Badge` tones: `neutral`, `brand`, `info`, `success`, `warning`, `error`.
3. Replace custom card containers with `Card` or `Panel` and use slot helpers (`CardHeader`, `CardContent`, `CardFooter`) when content has structure.
4. Use `Input` and `Select` for forms so helper text, error text, and disabled explanations connect via ARIA.
5. When an action is unavailable, pass `disabledReason` / `disabledExplanation`; do not rely on color alone.
6. Theme styling must use CSS variables from `frontend/src/styles/tokens.css` and Tailwind aliases from `frontend/tailwind.config.ts`.

## Selected role-layout notes

- Teacher host surfaces now use primitive command-console cards, badges, panels, and disabled reasons for closed/already-open round controls.
- Learner response surfaces keep Red/Yellow/Green semantics while adding text labels and large primitive button targets.
- Admin resource, analytics, CCI, and CVR surfaces use primitive cards/badges/buttons while preserving batch confirmation contracts.
- Storybook includes `RoleLayouts.stories.tsx` examples for the selected Teacher, Learner, and Admin compositions.
- Global app navigation now follows the Stitch dashboard direction: compact persistent sidebar navigation, compact dashboard header, utility controls, and page-level action slot. Avoid oversized shell containers such as broad `max-w-[96rem]`/large `min-h-20` headers unless the page genuinely needs them.
- Admin Library resources should use grouped dashboard cards with prompts, metadata, readiness badges, and inspector editing instead of long one-line rows.
- Home/Dashboard should behave like a compact operational board, not a landing page. Contrast must be explicit: no white text on white or light primitive surfaces.
- CodeGraph was checked on 2026-07-04 11:09 GMT+7 and the repo is not indexed yet; run `codegraph init .` and `codegraph index .` from the repo root only when Lucy approves creating `.codegraph/` metadata.

## Phase 12 minimal-workflow migration notes

- Use sentence text as the primary visible content in Teacher and Learner workflows. `sentence_code` should be rendered as muted metadata such as `Code S001`, not as the main title.
- Resource/history cards should show readable snippets, lesson/topic context, order, approval, and audio readiness before internal IDs.
- Prefer compact routine cards and rows: `rounded-2xl`, `p-3`/`p-4`, clear dividers, and concise metadata. Reserve large padding and rounded-3xl treatment for intentionally prominent focal sections.
- Replace generic role actions such as `Open` with explicit labels that describe the destination or action.
- When updating tests, assert sentence-text-first behavior rather than code-only secrecy for learner screens.

## Phase 13 product-structure notes

- Navigation must only expose real destinations. Keep Dashboard, Library, History, Teacher, and Learner; hide Users, Settings, and Help until they are real screens or sections.
- The first history destination is Admin **History & Analytics** at `/admin#history-analytics`. Do not reintroduce generic analytics hash links or hidden history-only panels as the only history path.
- Teacher Setup should remain recipe-first: room title/class idea, course, lesson, topic/resource readiness, and Create Room CTA appear before advanced settings.
- Host name, CCI/scoring, capture mode, and database topic internals belong in Advanced Options unless they become part of a future first-class room-launch decision.
- Teacher Live Room history should use **History & Queue** language and readable sentence snippets, not code-only queue/history controls.

## Validation checklist

- Run `npm test`.
- Run `npm run build`.
- Run `npm run build-storybook` when stories or primitive APIs change.
- Confirm 44px minimum target expectations for critical actions.
- Confirm theme switching works for `calm`, `bauhaus`, `modular`, and `craft` without per-screen overrides.
