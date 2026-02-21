---
name: run-tests
description: Run the Vitest test suite and report results
---

# Run Tests

Run the full Vitest test suite and report pass/fail summary.

## Steps

1. Run `npx vitest run --reporter=verbose` and capture the output.
2. If all tests pass, report the summary (number of tests, suites, time).
3. If any tests fail:
   a. Read the failing test file (`tests/<name>.test.ts`).
   b. Read the corresponding source file it tests (e.g., `lib/scoring.ts` for `tests/scoring.test.ts`).
   c. Identify the root cause of the failure.
   d. Suggest a fix — either in the test (if expectations are stale) or in the source (if logic is broken).

## Test Files

| Test File                      | Source File         | Coverage                                               |
| ------------------------------ | ------------------- | ------------------------------------------------------ |
| `tests/data-integrity.test.ts` | `data/*.ts`         | Cross-references all 9 data files                      |
| `tests/formatters.test.ts`     | `lib/formatters.ts` | CHF formatting, weight, storage, date                  |
| `tests/scoring.test.ts`        | `lib/scoring.ts`    | CPU/GPU/display/memory/connectivity/portability scores |

## Notes

- Tests use `node` environment (not `jsdom`) — see `vitest.config.ts`
- Path alias `@/*` maps to project root
- Data files use `as const` — test fixtures must use `readonly` arrays
