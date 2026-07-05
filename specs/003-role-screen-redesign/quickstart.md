# Quickstart: Validate Live Response Logic Correction

## Automated checks

```bash
cd frontend
npm test
npm run build
```

## Expected automated coverage

- Scoring maps red/yellow/green/purple to 0/1/2/3.
- Learner active room shows sentence code/identifier, not full sentence text.
- Learner response controls include four minimal choices and hide after captured round state.
- Teacher primary advance is disabled until the current open round has a captured response.

## Manual browser validation

1. Start a teacher room from a filtered sentence set.
2. Open a round.
3. Confirm learner sees only the sentence code/identifier and four color/icon controls.
4. Submit one learner response.
5. Confirm other learner screens no longer offer response controls.
6. Confirm Teacher Advance is available only after capture.
7. Confirm no production deploy is attempted without commit/tag/preview/rollback gates.
