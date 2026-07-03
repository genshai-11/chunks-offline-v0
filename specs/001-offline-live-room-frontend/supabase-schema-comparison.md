# Supabase Schema Comparison

**Checked**: 2026-07-03 19:49 GMT+7
**Project**: `ftfxekdxeoxizoyxuqoz`

## Existing Data Snapshot

| Table | Rows | Plan Mapping |
|---|---:|---|
| `courses` | 2 | Course |
| `lessons` | 30 | Lesson |
| `lesson_sections` | 131 | Section |
| `sentence_resources` | 7068 | Sentence Resource |
| `cci_categories` | 4 | CCI Category |
| `cci_standard_cards` | 8 | CCI Standard Card |
| `cvr_units` | 9 | CVR support catalog |
| `learners` | 10 | Learner identity/profile |
| `practice_rooms` | 0 | Room / Live Session |
| `room_memberships` | 0 | Room Membership |
| `room_rounds` | 0 | Round / Sentence Window |
| `learner_responses` | 0 | Response |
| `learner_progress` | 0 | Progress summary base |

## Alignment Notes

- The remote project already has the core live-room schema and meaningful resource data.
- Implementation should use existing table names instead of creating duplicate plan names:
  - `Room / Live Session` → `practice_rooms`
  - `Round / Sentence Window` → `room_rounds`
  - `Response` → `learner_responses`
  - `Section` → `lesson_sections`
- `sentence_resources` already includes both earlier single-language columns and CHUNKS EN/VI columns.
- `cci_standard_cards.standard_value` is the remote equivalent of planned `cci_standard_x`.
- `learner_progress` currently tracks aggregate CPD/finalized rounds but not the full planned per-room color/count summary. Frontend should derive richer summaries from `learner_responses` until a later migration adds a room-scoped summary view/table.

## Implementation Decision

Phase 2 local migration is written as an idempotent compatibility baseline. Do **not** apply remote DDL automatically without a committed release candidate, preview validation, rollback notes, and Lucy's release controls.
