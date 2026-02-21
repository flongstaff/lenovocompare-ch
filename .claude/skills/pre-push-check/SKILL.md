---
name: pre-push-check
description: Run full CI checks locally before pushing to avoid failed builds
disable-model-invocation: true
---

# Pre-Push Check

Run the same validation pipeline as CI before pushing to prevent build failures.

## Steps

Run these checks **sequentially** — stop on first failure:

1. **Prettier** — `npx prettier --check .`
   - If fails: run `npx prettier --write .`, then re-check
   - Report which files were unformatted

2. **ESLint** — `npm run lint`
   - Report any errors (warnings are OK)

3. **Tests** — `npm test`
   - All tests must pass

4. **Data validation** — `npm run validate`
   - Checks data integrity across all 9 data files

5. **Build** — `npm run build`
   - Full production build with static export
   - Must complete without errors

## Output

Report a summary table:

| Check    | Status    | Notes         |
| -------- | --------- | ------------- |
| Prettier | PASS/FAIL | N files fixed |
| ESLint   | PASS/FAIL | N errors      |
| Tests    | PASS/FAIL | N/N passed    |
| Validate | PASS/FAIL |               |
| Build    | PASS/FAIL | N pages       |

If all pass, confirm safe to push. If any fail, report what needs fixing.
