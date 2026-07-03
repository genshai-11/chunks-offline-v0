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
8. Learner submits Green.
9. Verify response color, Y=2, reflection time, CCI, CPD, and progress cards on teacher/learner screens.
10. Close and advance the round; verify old round cannot accept another response.

## Negative Validation
- Invalid room code shows clear error.
- Observing learner in assigned mode cannot submit.
- Double-tapping produces a single tracked response.
- Closed round rejects submission.

## Release Validation
Before production deploy, complete [pre-deploy-workflow.md](./pre-deploy-workflow.md).
