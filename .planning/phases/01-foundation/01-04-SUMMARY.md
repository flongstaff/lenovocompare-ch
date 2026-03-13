---
phase: 01-foundation
plan: 04
subsystem: integration
tags: [workers-integration, playwright, e2e, ci-cd, useRemotePrices]

# Dependency graph
requires:
  - "01-03: Workers API deployed at https://lenovocompare-prices.franco-longstaff.workers.dev"
provides:
  - "lib/hooks/useRemotePrices.ts: fetches from Workers API with seed-price fallback"
  - ".github/workflows/deploy.yml: Workers deploy job + NEXT_PUBLIC_WORKERS_URL env var"
  - ".github/workflows/ci.yml: Playwright smoke tests after build"
  - "playwright.smoke.config.ts: separate config targeting out/ static export"
  - "tests/e2e/smoke.spec.ts: 5 smoke tests for key pages"
affects:
  - "Phase 2: price submission will POST to same Workers API"

# Tech tracking
tech-stack:
  added:
    - "playwright (E2E test framework, chromium browser)"
    - "serve (static file server for smoke tests)"
    - "cloudflare/wrangler-action@v3 (GitHub Actions Workers deploy)"
  patterns:
    - "NEXT_PUBLIC_WORKERS_URL env var with hardcoded fallback URL"
    - "Separate Playwright config for smoke tests (playwright.smoke.config.ts) vs full E2E"
    - "npx serve out -p 3001 as webServer in Playwright config"

key-files:
  created:
    - playwright.smoke.config.ts
    - tests/e2e/smoke.spec.ts
  modified:
    - lib/hooks/useRemotePrices.ts
    - .github/workflows/deploy.yml
    - .github/workflows/ci.yml

key-decisions:
  - "Removed getBasePath() helper — no longer needed for external Workers URL"
  - "Hardcoded fallback URL is real deployed Workers URL (not a placeholder)"
  - "serve without -s flag — Next.js static export has individual HTML files per route"
  - "Smoke tests use :not(.animate-pulse) selector to wait for hydrated cards"
  - "deploy-workers job runs independently alongside deploy job (not sequentially)"

patterns-established:
  - "E2E smoke tests validate static export before deploy"
  - "Workers deploy automated via wrangler-action in CI"
  - "Frontend fetches from Workers API with graceful fallback to bundled seed data"

requirements-completed:
  - PRIC-05
  - INFR-03
  - INFR-04

# Metrics
duration: 8min
completed: 2026-03-13
---

# Phase 1 Plan 04: Frontend-Workers Integration Summary

**useRemotePrices → Workers API, CI deploy workflow, Playwright smoke tests for static export**

## Performance

- **Duration:** 8 min
- **Completed:** 2026-03-13
- **Tasks:** 3/3 complete
- **Files modified:** 2 modified, 2 created

## Accomplishments

- useRemotePrices now fetches from Workers API (`NEXT_PUBLIC_WORKERS_URL/api/prices`) with 15-min module cache
- Graceful fallback to empty array when Workers unreachable — seed-prices.ts fills in via usePrices merge
- deploy.yml adds `deploy-workers` job with wrangler-action for automated D1 migration + Worker deployment
- ci.yml adds Playwright smoke test step after build
- 5 Playwright smoke tests validate home, compare, model detail, pricing, deals pages from static export

## Files Created/Modified

- `lib/hooks/useRemotePrices.ts` — fetch from `WORKERS_API_URL/api/prices`, removed `getBasePath()` helper
- `.github/workflows/deploy.yml` — `deploy-workers` job + `NEXT_PUBLIC_WORKERS_URL` env var on build step
- `.github/workflows/ci.yml` — Playwright install + smoke test step after build
- `playwright.smoke.config.ts` — Playwright config: `npx serve out -p 3001`, testDir `tests/e2e`, testMatch `smoke.spec.ts`
- `tests/e2e/smoke.spec.ts` — 5 smoke tests: home (hydrated cards), compare, model detail, pricing, deals

## Decisions Made

- Removed `getBasePath()` — external Workers URL replaces relative static path
- `serve` without `-s` flag — Next.js generates individual HTML files, SPA mode breaks routing
- Card selector uses `:not(.animate-pulse)` to skip skeletons and wait for hydrated content
- `deploy-workers` runs in parallel with `deploy` (no `needs:` dependency) for faster CI

## Deviations from Plan

None — all tasks completed as specified.

## Verification

- `npm run build` — PASS
- `npm test` — 171 tests pass
- `npx playwright test --config playwright.smoke.config.ts` — 5/5 smoke tests pass
- Workers API live: health check returns `{"status":"ok"}`
- Prices endpoint returns 301 camelCase SwissPrice objects

## Next Steps

- Set GitHub Actions variable: `NEXT_PUBLIC_WORKERS_URL` = `https://lenovocompare-prices.franco-longstaff.workers.dev`
- Set GitHub Actions secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Phase 01 complete — proceed to Phase 02 planning

---

_Phase: 01-foundation_
_Completed: 2026-03-13_
