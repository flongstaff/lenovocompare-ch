---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-13
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------- |
| **Framework**          | Vitest 4.x (unit), Playwright 1.58.x (E2E)                                             |
| **Config file**        | `vitest.config.ts`, `playwright.config.ts`                                             |
| **Quick run command**  | `npm test`                                                                             |
| **Full suite command** | `npm test && npm run build && npx playwright test --config playwright.smoke.config.ts` |
| **Estimated runtime**  | ~30 seconds                                                                            |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test && npm run build && npx playwright test --config playwright.smoke.config.ts`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement | Test Type | Automated Command                                                                                 | File Exists  | Status     |
| -------- | ---- | ---- | ----------- | --------- | ------------------------------------------------------------------------------------------------- | ------------ | ---------- |
| 01-01-01 | 01   | 1    | COMP-01     | unit      | `npm test -- tests/compare-table.test.ts`                                                         | ❌ W0        | ⬜ pending |
| 01-01-02 | 01   | 1    | COMP-02     | unit      | `npm test -- tests/physical-size.test.ts`                                                         | ❌ W0        | ⬜ pending |
| 01-02-01 | 02   | 1    | COMP-03     | unit      | `npm test -- tests/benchmarks-section.test.ts`                                                    | ❌ W0        | ⬜ pending |
| 01-02-02 | 02   | 1    | COMP-04     | unit      | `npm test -- tests/benchmarks-section.test.ts`                                                    | ❌ W0        | ⬜ pending |
| 01-03-01 | 03   | 1    | PRIC-01     | manual    | `cd workers && npx tsc --noEmit`                                                                  | ❌ W0        | ⬜ pending |
| 01-03-02 | 03   | 1    | PRIC-02     | manual    | `cd workers && npx wrangler d1 migrations apply lenovocompare-prices --local`                     | ❌ W0        | ⬜ pending |
| 01-03-03 | 03   | 1    | PRIC-03     | unit      | `cd workers && npm test`                                                                          | ❌ W0        | ⬜ pending |
| 01-03-04 | 03   | 1    | PRIC-04     | manual    | `cd workers && npx wrangler d1 execute lenovocompare-prices --file seeds/seed-prices.sql --local` | ❌ W0        | ⬜ pending |
| 01-04-01 | 04   | 2    | PRIC-05     | unit      | `npm test -- tests/useRemotePrices.test.ts`                                                       | ❌ W0        | ⬜ pending |
| 01-05-01 | 05   | 2    | INFR-01     | smoke     | `curl https://lenovocompare-prices.*.workers.dev/api/prices`                                      | Post-deploy  | ⬜ pending |
| 01-05-02 | 05   | 2    | INFR-02     | smoke     | curl with Origin header                                                                           | Post-deploy  | ⬜ pending |
| 01-05-03 | 05   | 2    | INFR-03     | CI        | Observe GitHub Actions run                                                                        | Needs update | ⬜ pending |
| 01-05-04 | 05   | 2    | INFR-04     | E2E       | `npx playwright test --config playwright.smoke.config.ts`                                         | ❌ W0        | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] `tests/compare-table.test.ts` — stubs for COMP-01 (diff toggle)
- [ ] `tests/physical-size.test.ts` — stubs for COMP-02 (scaling math)
- [ ] `tests/benchmarks-section.test.ts` — stubs for COMP-03/04 (link rendering, unverified label)
- [ ] `tests/useRemotePrices.test.ts` — stubs for PRIC-05 (fallback)
- [ ] `playwright.smoke.config.ts` — separate smoke config for static export
- [ ] `tests/e2e/smoke.spec.ts` — INFR-04 smoke test
- [ ] `workers/src/index.test.ts` — PRIC-03 endpoint test (if unit testing Workers)

---

## Manual-Only Verifications

| Behavior                        | Requirement | Why Manual                 | Test Instructions                                       |
| ------------------------------- | ----------- | -------------------------- | ------------------------------------------------------- |
| Workers deployed to workers.dev | INFR-01     | Requires live deployment   | Run `wrangler deploy`, curl endpoint                    |
| CORS headers present            | INFR-02     | Requires live deployment   | curl with `Origin: https://flongstaff.github.io` header |
| GitHub Actions deploy succeeds  | INFR-03     | CI-only                    | Push to main, observe Actions tab                       |
| D1 migration applies            | PRIC-02     | Requires wrangler CLI      | Run migration apply command locally                     |
| Seed data loads                 | PRIC-04     | Requires D1 local instance | Execute seed SQL locally                                |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
