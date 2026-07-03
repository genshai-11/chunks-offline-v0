# CHUNKS Mirror / Offline Live Room Release Checklist

**Created**: 2026-07-03
**Source**: specs/001-offline-live-room-frontend/pre-deploy-workflow.md

## Release-Control Status

- [x] Git repository initialized or verified before implementation.
- [ ] Release candidate changes committed before preview deployment.
- [ ] Production release tag created when applicable.
- [ ] Preview/canary deployment validated before production.
- [ ] Hosting rollback path documented and verified.
- [ ] Supabase migration rollback or restore path documented and verified.
- [ ] Post-deploy smoke checks completed.

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

## Preview / Canary Gate

- [ ] Apply migrations to local or preview Supabase first.
- [ ] Validate Teacher creates room, Learner joins, response captures, scoring displays, and progress updates.
- [ ] Run accessibility checks for response buttons and learner status messaging.
- [ ] Confirm realtime reconnect/refetch behavior after a browser refresh.

## Production Gate

- [ ] Commit all release changes.
- [ ] Create a release tag when applicable.
- [ ] Confirm rollback command/path for hosting.
- [ ] Confirm Supabase migration rollback or restore plan.
- [ ] Verify hosting/function restore path before deploy.
- [ ] Run post-deploy smoke checks immediately after release.

## Rollback Instructions Template

1. Identify release tag and deployment ID.
2. Revert hosting to previous known-good deployment.
3. If database migration caused failure, execute documented down migration or restore from verified backup path.
4. Disable affected feature flag or route if partial rollback is safer.
5. Re-run Teacher/Learner smoke flow.
6. Record incident notes and follow-up tasks.

## Post-Deploy Verification Checklist

- [ ] Home role entry loads.
- [ ] Teacher can create room and copy share link.
- [ ] Learner can join via share link.
- [ ] Teacher can open assigned round.
- [ ] Learner can submit one response.
- [ ] Duplicate/closed-round response is blocked.
- [ ] Progress cards update.
- [ ] Admin resource/CCI screens load.
- [ ] Logs show no critical auth, realtime, or scoring errors.
