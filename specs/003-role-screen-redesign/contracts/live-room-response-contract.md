# UI/Data Contract: Live Room Response Correction

## Learner Active Round Contract

Given a joined learner and an open current round:

- The learner UI MUST display the active sentence identifier/code.
- The learner UI MUST NOT display full English text, Vietnamese text, or prompt detail on the active response surface.
- If no response has been captured for the round and the learner is eligible, show four minimal color/icon controls.
- If any response has been captured for the round, hide/suppress the response controls for learners who did not capture the response.
- Controls need accessible names for assistive technology even when visible text is minimal.

## Response Submission Contract

`submitLearnerResponse(input)` accepts:

- `responseColor`: `red | yellow | green | purple`
- `roundId`: active round ID
- `learnerId`: joined learner ID
- `openedAt`: round open timestamp

Persisted snapshots:

- `response_color`
- `performance_y` using default response scale 0/1/2/3
- `reflection_time_ms`, `reflection_seconds`
- `cci_standard_x`, `cvr_value`, `cci_result`, `cpd_result`
- `scoring_mode_snapshot`, `response_capture_mode_snapshot`, `formula_version_snapshot`

## Teacher Advance Contract

- If no round is open, teacher may open/start the next sentence when required setup is valid.
- If current round is open and has no captured response, primary Advance/Next is disabled.
- If current round is open and has a captured response, primary Advance closes current round and opens the next sentence.
