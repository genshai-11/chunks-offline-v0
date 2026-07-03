# Supabase State Contracts

## Auth Contract
- Learners use Supabase Anonymous Auth by default.
- Teacher/Admin access must not rely on client-only role claims in production.
- RLS policies scope learners to memberships and teachers to hosted rooms.

## Realtime Contract
Subscribe by room to durable changes: room status, roster, current round, accepted response, learner progress summary. Realtime messages are hints; UI refetches/reconciles after reconnect.

## Mutation Contract: Join Room
Input: room code, display name, anonymous auth user ID.
Result: active room membership plus current room/round state.
Reject: missing room, finished room, blank display name.

## Mutation Contract: Open Round
Input: room ID, sentence resource or next index, capture mode, assigned learner when required, selected CCI standard.
Result: one open round with sentence, CCI, CVR, capture-mode, opened-time snapshots; room status `round_open`.
Reject: finished room, unapproved resource, another open round, assigned mode without active learner.

## Mutation Contract: Submit Response
Input: room ID, round ID, learner membership ID, response color.
Result: one response with reflection time and scoring snapshots; captured learner recorded; progress summary updates.
Reject: closed/not-open round, ineligible learner, existing response for round, invalid color.

## Mutation Contract: Close / Advance Round
Close marks current round closed and blocks submissions. Advance opens next sentence when available. Finish marks room terminal and blocks joins/rounds/responses.
