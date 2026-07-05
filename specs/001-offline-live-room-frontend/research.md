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

## Research: Kahoot Realtime "Live Room" Mechanism (for CHUNKS comparison)
**Date**: 2026-07-04 (performed before any Phase 8 implementation)
**Sources**: Official Kahoot support, engineering analyses (Ably multiplayer quiz arch, RaftLabs build guide, Uber design interview post), open-source Kahoot clones (Spring WS, Socket.io, etc.), reverse-engineering libs (kahoot-py), Supabase Realtime docs + community comparisons.

### How Kahoot Achieves Realtime Rooms + "Online" Presence
1. **Join Flow ("room online")**:
   - Host starts a live game → server generates short numeric **PIN** (game code) + lobby screen.
   - Players go to kahoot.it (or app), enter PIN + nickname.
   - Join is typically a lightweight registration (HTTP) that creates a participant record/session.
   - Immediately, a persistent **WebSocket connection** is established to a room/session-specific channel keyed by the PIN.
   - Host subscribes to the same room channel and receives live "player joined" (presence) events. Roster populates instantly on host screen (names appear in realtime).
   - Late joins allowed in many modes until host "locks" the game.
   - Rejoin: Disconnected players can re-enter the PIN and resume (score preserved).

2. **Core Transport**:
   - **WebSockets** (primary). Many clones use:
     - Socket.IO (WS + graceful fallback to long-polling)
     - Native WS
     - Managed services (Ably, Pusher) or frameworks (Spring WebSocket, Phoenix Channels)
   - Clients stay connected for the duration of the live session.
   - Channels/rooms: one logical channel per active game PIN for efficient fan-out.

3. **Live Play Realtime Flow**:
   - Host actions (Start / Next question) → server broadcasts events to all clients in the room channel.
   - **Timer synchronization**: Server sends `startAt` timestamp + duration. Clients run local countdowns. This keeps everyone seeing questions "at the same time" despite network variance.
   - Player answers: Sent over WS (fast, low overhead).
   - Server processing:
     - Validate (exactly one tracked answer per question/player — usually DB unique constraint or in-memory idempotency).
     - Score (correct + speed bonus based on time remaining).
     - Update leaderboard (often in Redis Sorted Sets for O(log n) rank/insert).
     - Broadcast:
       - To host: who answered, partial/full results, live roster updates.
       - To players: personal result + (after reveal) correct answer + leaderboard.
   - Reveal + leaderboard push happens quickly after timer or "all answered".
   - State is driven by host (or timers) — not pure peer-to-peer.

4. **"Room Online" / Presence**:
   - Explicit join/leave/disconnect events.
   - Host sees live count + list of connected players.
   - Often enhanced with dedicated Presence APIs (e.g., Ably Presence, Socket.IO adapters).
   - Heartbeats or connection state to handle flaky mobile networks.

5. **Hot Path vs Durable State**:
   - **During active quiz**: In-memory room state + dedicated realtime pub/sub (Redis, Ably, WS hub) for speed and low latency. Fan-out must be fast (target <1-2s for leaderboards even with hundreds of players).
   - **DB (Postgres etc.)**: Used for quiz definitions, final persisted scores, reports, history, and audit. DB changes are **not** the primary broadcast mechanism for live gameplay because of replication latency and write contention.
   - After session: Flush results.

### Common Tech in Kahoot Clones & Analyses
- WS gateway + room manager (in-memory map of active rooms + connected sockets).
- Pub/sub broker for scaling across servers (Redis adapter for Socket.IO, or managed like Ably).
- Selective/targeted messages (host gets more data than players).
- Sequence numbers + resync on gap for ordering/reliability.
- Reconnect handling (exponential backoff, resume state).

### Comparison to Current CHUNKS / Supabase Approach
- **CHUNKS current**: Relies on Supabase **postgres_changes** (DB row events over WS) + refetch on change. Matches the spec's "realtime messages are hints; UI reconciles with durable Postgres".
- **Strengths of current design**: Simple, no extra infra, durable-by-default, integrates with RLS/auth.
- **Kahoot-style differences / gaps exposed by research**:
  - Kahoot uses direct event push over session channels (not waiting for DB replication + full refetch).
  - Roster/join and answer feedback feel "instant" because of in-room WS broadcasts + in-memory structures.
  - Supabase Realtime also supports **Broadcast** (ephemeral custom events) and **Presence** (beyond just DB changes) since 2022 — our code only uses the DB changes part.
  - Our bugs (invalid `room_id` filter on `learner_responses` poisoning the channel, separate progress vs room channels, no publication setup, no subscription status UI) prevent even the DB-driven path from working reliably.
  - For classroom scale (small # of concurrent rooms, <50 learners/room) the DB approach can be "good enough" once fixed. For high concurrency, dedicated WS + Redis/Ably layer is the proven pattern.
- Supabase Realtime limits (from docs/community): ~10k concurrent, message quotas, tied to table filters/RLS/replication. Some teams switch to pure Socket.IO or Ably for games when they hit these or need sub-100ms custom events.

### Implications for Our Work (before implement)
- The Phase 8 tasks (fixing subscriptions, adding publication, surfacing status, improving progress scope, adding tests for SC-003) are still the right first steps — they make the existing "durable realtime" actually deliver Kahoot-like join visibility + feedback.
- Potential follow-ups (do not implement yet):
  - Leverage Supabase Broadcast for direct non-persisted events (e.g., "round opened", timer ticks) instead of only table changes.
  - Add explicit presence or membership "online" heartbeats if roster needs stronger "who is currently connected" vs just joined.
  - Timer handling: send `opened_at` + duration explicitly (like Kahoot `startAt`).
  - Consider sequence/versioning on events for robustness.
- For MVP classroom use, no need to rewrite on custom WS server. Fix + validate first.
- SC-003 (95% updates <2s) is achievable with the fixes + proper Supabase project config (replication enabled, quotas).

**Sources / Further Reading** (captured during research):
- Ably: Live multiplayer quiz architecture
- RaftLabs: How to Build an Interactive Learning App Like Kahoot (Redis for leaderboard fan-out)
- LevelUp/Interview post: Design a Real-Time Quiz like Kahoot (WS channels, Redis sorted sets, sequence numbers, reconnect storms)
- GitHub replicas (Spring Boot WS, Socket.io)
- Kahoot support (PIN lobby, late join, rejoin)
- Supabase Realtime docs (Broadcast + Presence + postgres_changes) + comparisons vs Socket.io

This research was run in response to the request to pause before `/speckit-implement`. No code changes or implement actions taken.
