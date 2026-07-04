# Quickstart Validation Guide

## Prerequisites
- Git repository initialized before implementation begins.
- Supabase local or preview project available.
- Frontend dependencies installed under `frontend/` after implementation setup.
- Sample approved sentence resources and active CCI cards seeded.

## Local Validation Flow
1. Start Supabase local/preview services.
2. Apply migrations and seed sample Course, Lesson, Section, Sentence Resource, CCI Category, and CCI Standard Card.
3. Start the frontend dev server.
4. Open Teacher setup and create a room with assigned mode and simple scoring.
5. Open the learner share link in a second browser context.
6. Join as a learner with a display name.
7. Teacher opens the first round and assigns the learner.
8. Verify Teacher sees sentence code, full teacher-only prompt details, audio EN/VI availability, and `1 / total resources`; verify Learner sees sentence code/status/eligibility but not full EN/VI prompt details.
9. Teacher selects EN or VI audio and uses replay/stop; verify unavailable language is clearly disabled and playback failure is visible without changing response history.
10. Learner submits Green.
11. Verify response color, Y=2, reflection time, CCI, CPD, and progress cards on teacher/learner screens.
12. Use Teacher keyboard shortcut to advance after captured response; verify old round cannot accept another response and next round shows `2 / total resources`.
13. For a multi-learner assigned/auto-rotate session, validate roughly even response distribution over the selected resource count (for example 100 sentences / 5 learners ≈ 20 records each when evenly assigned).

## Negative Validation
- Invalid room code shows clear error.
- Observing learner in assigned mode cannot submit.
- Double-tapping produces a single tracked response.
- Closed round rejects submission.
- Teacher keyboard advance is ignored while focus is inside input/select/textarea/contenteditable.
- Teacher keyboard advance before captured response requires explicit skip confirmation.
- Learner screen does not leak full sentence text while a live response window is open.
- Missing EN/VI audio does not block round progression and shows a clear unavailable state.

## Admin Validation
- Admin Resource Manager filters missing `audio_en_url` / `audio_vi_url` resources, can queue a selected resource, and can queue all currently shown missing-audio jobs at once.
- Audio generation runs via server-side/secure operator path; provider keys are not visible in browser logs, network payloads, or stored rows.
- Bulk audio queue jobs include deterministic storage paths such as `sentence-audio/{courseId}/{lessonId}/{sentenceCode}-{language}.mp3`; the secure worker/operator uploads files and updates resource audio URLs.
- Admin can create/update CVR values and CCI cards and Teacher setup can select updated active values.
- Admin dashboard can filter by room/session and learner and shows response count, color mix, CCI, CPD, reflection time, and per-learner distribution.

## Release Validation
Before production deploy, complete [pre-deploy-workflow.md](./pre-deploy-workflow.md).
