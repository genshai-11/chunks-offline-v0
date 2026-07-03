# Research: CHUNKS Mirror / Offline Live Room Frontend

## Decision: Use React + Vite + TypeScript for the frontend shell
**Rationale**: The repo has no app package yet, and the MVP needs a fast browser-based classroom UI with distinct Admin, Teacher, and Learner flows. Vite keeps setup lightweight while TypeScript protects scoring and state contracts.
**Alternatives considered**: Next.js was considered for server-rendering, but MVP room interactions are client-heavy and Supabase-first.

## Decision: Keep Supabase Postgres as the durable source of truth
**Rationale**: Room, membership, round, response, and progress state must survive refreshes and multi-device use. Realtime broadcasts durable changes rather than becoming source of truth.
**Alternatives considered**: Client-only state or websocket-only memory were rejected because classroom history and learner progress must be auditable.

## Decision: Enforce response uniqueness and eligibility beyond the client UI
**Rationale**: Learners can manipulate clients or tap concurrently. Database constraints/functions must prevent duplicate tracked responses, non-assigned responses in assigned mode, and closed-round submissions.
**Alternatives considered**: UI-only disabled buttons were rejected.

## Decision: Support centralized theme options and activate Theme 2 Bauhaus
**Rationale**: Theme 1 calm classroom console remains useful for low-noise operational screens, but the user selected Theme 2 Bauhaus for a bolder geometric visual direction. Centralized CSS variables and reusable UI primitives allow the frontend to change visual personality without rewriting feature components.
**Alternatives considered**: A one-off page redesign was rejected because it would fragment Admin, Teacher, and Learner surfaces. Replacing all theme docs with Bauhaus only was rejected because Theme 1 remains a useful fallback/rollback option.

## Decision: Treat "Offline Live Room" as in-person classroom live use for MVP
**Rationale**: The overview describes live classroom behavior with Supabase realtime. Network-offline persistence would materially change synchronization and validation scope.
**Alternatives considered**: Offline-first local sync was deferred to a future spec.

## Decision: Include release controls before production deployment
**Rationale**: Lucy's policy requires commit/tag before deploy, preview/canary validation, rollback instructions, hosting/functions restore-path verification, and post-deploy checks.
**Alternatives considered**: Direct production deployment is rejected until git and preview validation are in place.
