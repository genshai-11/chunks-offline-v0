# Pre-Deploy Workflow: CHUNKS Mirror / Offline Live Room

**Created**: 2026-07-03
**Applies to**: Any preview, canary, or production deployment of the web app, Supabase migrations, storage policies, or functions.

## Current Release-Control Status
- Git repository is initialized. Production deployment is still blocked until release changes are committed, tagged when applicable, preview/canary validated, and rollback/restore paths are verified.

## Required Files Before Implementation/Deploy
- `.specify/memory/constitution.md`
- `DESIGN.md`
- `specs/001-offline-live-room-frontend/spec.md`
- `specs/001-offline-live-room-frontend/plan.md`
- `specs/001-offline-live-room-frontend/research.md`
- `specs/001-offline-live-room-frontend/data-model.md`
- `specs/001-offline-live-room-frontend/contracts/ui-routes.md`
- `specs/001-offline-live-room-frontend/contracts/supabase-contracts.md`
- `specs/001-offline-live-room-frontend/quickstart.md`
- `specs/001-offline-live-room-frontend/tasks.md`

## Preview / Canary Gate
- Apply migrations to local or preview Supabase first.
- Validate Teacher creates room, Learner joins, response captures, scoring displays, and progress updates.
- Run accessibility checks for response buttons and learner status messaging.
- Confirm realtime reconnect/refetch behavior in at least one browser refresh scenario.

## Production Gate
- Commit all release changes.
- Create a release tag when applicable.
- Confirm rollback command/path for hosting.
- Confirm Supabase migration rollback or restore plan.
- Verify hosting/function restore path before deploy.
- Run post-deploy smoke checks immediately after release.

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
