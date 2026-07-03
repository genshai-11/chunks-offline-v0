# Data Model: CHUNKS Mirror / Offline Live Room Frontend

```mermaid
erDiagram
    COURSE ||--o{ LESSON : contains
    LESSON ||--o{ SECTION : contains
    SECTION ||--o{ SENTENCE_RESOURCE : contains
    CCI_CATEGORY ||--o{ CCI_STANDARD_CARD : contains
    ROOM ||--o{ ROOM_MEMBERSHIP : has
    ROOM ||--o{ ROUND : has
    SENTENCE_RESOURCE ||--o{ ROUND : snapshotted_by
    ROUND ||--o| RESPONSE : captures
    ROOM_MEMBERSHIP ||--o{ RESPONSE : submits
    ROOM_MEMBERSHIP ||--o| LEARNER_PROGRESS_SUMMARY : summarizes
```

## Course
- `id`, `title`, `status`, `created_at`, `updated_at`

## Lesson
- `id`, `course_id`, `title`, `order_index`, `status`

## Section
- `id`, `lesson_id`, `title`, `order_index`, `status`

## Sentence Resource
- `id`, `course_id`, `lesson_id`, `section_id`
- `sentence_code`, `text_en`, `text_vi`
- `audio_en_url`, `audio_vi_url`
- `cvr_value` (CVR Ω)
- `approval_status`: draft / approved / archived
- `order_index`, `created_at`, `updated_at`

Validation: Teacher scopes can only use approved resources; approved resources require `cvr_value`.

## CCI Category
- `id`, `label`, `description`, `status`

## CCI Standard Card
- `id`, `category_id`, `label`, `description`, `cci_standard_x`, `is_default`, `status`

Validation: Teacher can select active cards only; at most one default card per category should be active.

## Room / Live Session
- `id`, `room_code`, `teacher_host_id`
- `resource_scope_filter`, `ordered_sentence_resource_ids_snapshot`
- `default_response_capture_mode`: assigned / first_responder / auto_rotate
- `scoring_mode`: simple / timed
- `scoring_settings_snapshot`
- `status`: lobby / round_open / round_closed / finished
- `created_at`, `finished_at`

State: lobby → round_open → round_closed → round_open; lobby/round_closed → finished; finished is terminal.

## Room Membership
- `id`, `room_id`, `auth_user_id`, `display_name`, `role`, `joined_at`, `status`

## Round / Sentence Window
- `id`, `room_id`, `sentence_resource_id`, `round_index`
- `status`: draft / open / closed
- `response_capture_mode_snapshot`, `assigned_learner_id`, `captured_learner_id`
- `cci_standard_x_snapshot`, `cvr_value_snapshot`, `opened_at`, `closed_at`

Validation: open rounds require scoring/CVR snapshots; assigned mode requires assigned learner before learner response.

## Response
- `id`, `room_id`, `round_id`, `captured_learner_id`
- `response_color`: red / yellow / green
- `learner_performance_y`: 0 / 1 / 2 by default
- `reflection_time_ms`, `reflection_seconds`
- `cci_standard_x`, `cvr_value`, `cci_result`, `cpd_result`
- `scoring_mode_snapshot`, `formula_version_snapshot`, `captured_at`

Validation: MVP allows at most one tracked response per round; accepted only while round is open and learner is eligible.

## Learner Progress Summary
Derived by `room_id` + `learner_id`: `response_count`, `red_count`, `yellow_count`, `green_count`, `highest_cpd`, `total_cpd`, `average_cpd`, `average_reflection_seconds`, `last_response_at`.

## Scoring Snapshot Rules
Simple mode:
```text
CCI = CCI Standard X × Learner Performance Y
CPD = CCI × CVR Ω
```
Every response stores the inputs and formula version used at capture time.
