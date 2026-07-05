# Research: Role Screen Redesign

## Decision: Use strict product-area navigation

**Decision**: The app uses six top-level product areas: Dashboard, Library, History, Create Room, Live Room, and Learner.

**Rationale**: Lucy explicitly wants clarity around what each tab contains. Product-area naming is more direct than role-only naming because it tells users what task the area supports.

**Alternatives considered**:
- Role-only navigation — rejected because it hides feature ownership behind Admin/Teacher/Learner labels.
- Workflow-only navigation such as Prepare/Create/Run/Respond/Review — rejected because it is elegant but less explicit for current screens.
- Hybrid role/product navigation — rejected for this feature because Lucy chose strict product areas.

## Decision: Every product area gets an Inside this area map

**Decision**: Each product-area page has an icon-led, minimal-text Inside this area map plus local section anchors/cards or filters for main feature groups.

**Rationale**: The core UX issue is discoverability. A compact map at the top of each area tells users what lives there without forcing them through long data lists.

**Alternatives considered**:
- Dashboard-only app map — rejected because users would lose orientation after navigating away.
- Full persistent secondary sidebar — rejected for now because it adds layout weight and risks crowding classroom screens.
- Header text only — rejected because text-only descriptions do not clarify component ownership fast enough.

## Decision: Keep maps summary-only, not data-heavy

**Decision**: Inside this area maps show main actions, short labels, summary counts/status, and anchors only. Full records remain inside filtered sections/components.

**Rationale**: Lucy specifically requested minimal text and not showing all data. This prevents maps from becoming duplicated dashboards or noisy tables.

**Alternatives considered**:
- Map cards with full latest records — rejected because it would duplicate detailed sections and increase visual density.
- No summary metrics — rejected because lightweight counts/status help users understand readiness.

## Decision: Review all screens before implementing slices

**Decision**: Complete a product-area screen and component inventory before frontend implementation. Then implement by product-area slices.

**Rationale**: Full redesign affects many screens; review-first prevents scattered edits and lets Lucy see component ownership before code changes.

**Alternatives considered**:
- Big-bang implementation — rejected because live-room logic and role isolation are too important to risk broad unreviewed changes.
- Only navigation first — rejected because Lucy asked for full screen/layout redesign clarity, not just top nav.

## Decision: Use Stitch or equivalent visual handoff for significant layout changes

**Decision**: For significant page/component redesigns, define component inventory, create a Stitch or equivalent visual handoff, wait for Lucy approval, then implement.

**Rationale**: Lucy wants to approve page/component design before code when redesigning from components. Stitch is already configured as a source and supports screen generation/handoff workflows.

**Alternatives considered**:
- Implement directly from text specs for every page — accepted only for small layout fixes; rejected for significant redesign because it increases rework risk.
- Use Stitch for every tiny component — rejected because it would slow down simple primitive/tokens-only adjustments.

## Decision: Preserve current backend contracts

**Decision**: This feature is frontend/product-structure work and does not require remote Supabase DDL.

**Rationale**: The redesign changes orientation, grouping, visual hierarchy, and validation. It must preserve room/round/response/scoring history.

**Alternatives considered**:
- Add new navigation metadata tables — rejected because static product-area ownership is sufficient for this redesign.
- Add remote analytics schema — rejected because History currently uses existing session analytics data.
