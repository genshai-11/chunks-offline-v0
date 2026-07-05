# Data Model: Live Response Logic Correction

## Response Scale Option

- `color`: response identifier stored in `learner_responses.response_color`; default values: `red`, `yellow`, `green`, `purple`.
- `coefficient`: performance snapshot stored in `learner_responses.performance_y`; default mapping: red=0, yellow=1, green=2, purple=3.
- `icon`: visual-only learner control symbol.
- `accessibleLabel`: screen-reader label; visible learner control remains minimal/icon-color first.
- `toneClass`: UI background/border treatment.

## Learner Response

Existing table: `learner_responses`

Changed validation:
- `response_color` accepts `red`, `yellow`, `green`, `purple`.
- `performance_y` accepts `0`, `1`, `2`, `3`.
- Existing snapshots remain: CCI Standard X, CVR, reflection time, scoring mode, response mode, formula version.

## Room Round

Existing table: `room_rounds`

Relevant fields:
- `status`: `open` controls answer eligibility.
- `captured_learner_id`: when set, the round has a captured answer and learner controls should be suppressed for everyone else.
- `response_capture_mode_snapshot`: `first_responder` allows any joined learner until capture; assigned/auto-rotate requires assignment until capture.

## Learner Room State

Add/derive:
- `roundHasCapturedResponse`: true when any response exists for the current round or `captured_learner_id` is set.

State implication:
- If learner already responded: `already_responded`/captured confirmation remains visible.
- If another learner responded: learner state should not be `assigned`; controls hidden/suppressed.

## Teacher Room Control State

Derived:
- `hasCapturedCurrentRound`: true when progress responses contain a response for the current round or the current round has `captured_learner_id`.
- Primary `Advance` disabled when current round is open and no capture exists.
