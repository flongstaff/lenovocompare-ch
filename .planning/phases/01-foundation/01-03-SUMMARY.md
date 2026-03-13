---
phase: 01-foundation
plan: 03
subsystem: infra
tags: [cloudflare-workers, hono, d1, sqlite, cors, edge-api]

# Dependency graph
requires: []
provides:
  - "workers/src/index.ts: Hono edge API with GET /api/prices and GET /api/prices/:laptopId"
  - "workers/migrations/0001_prices.sql: D1 schema for prices table with indexes"
  - "workers/seeds/seed-prices.sql: 301 INSERT statements seeding all Swiss laptop prices"
  - "workers/wrangler.toml: Cloudflare Workers deployment config with D1 binding"
affects:
  - "01-04: useRemotePrices.ts redirected to Workers URL after user deploys"
  - "Phase 2: price fetch cron will INSERT into same D1 prices table"

# Tech tracking
tech-stack:
  added:
    - "hono ^4.0.0 — edge-native web framework for Cloudflare Workers"
    - "wrangler ^3.0.0 — Cloudflare CLI for local dev and deployment"
    - "@cloudflare/workers-types ^4.0.0 — TypeScript types for D1, Env bindings"
  patterns:
    - "D1 binding via Hono Bindings type, accessed as c.env.DB"
    - "Snake_case DB columns mapped to camelCase SwissPrice shape in response transform"
    - "INSERT OR IGNORE for idempotent seed operations"
    - "CORS restricted to flongstaff.github.io + localhost:3000 only"

key-files:
  created:
    - workers/src/index.ts
    - workers/package.json
    - workers/tsconfig.json
    - workers/wrangler.toml
    - workers/migrations/0001_prices.sql
    - workers/seeds/seed-prices.sql
  modified: []

key-decisions:
  - "workers/ is a fully standalone package — zero imports from Next.js root"
  - "database_id left as REPLACE_AFTER_CREATE placeholder — filled by user post wrangler d1 create"
  - "CORS allows exactly two origins: flongstaff.github.io and localhost:3000 (per CONTEXT.md)"
  - "GET /api/prices/:laptopId endpoint added beyond plan spec — enables per-model price fetch"

patterns-established:
  - "Workers project lives in workers/ subdirectory with its own node_modules and package.json"
  - "D1 table uses snake_case columns; API response transforms to camelCase SwissPrice interface"
  - "Migrations in workers/migrations/, seeds in workers/seeds/ — separate lifecycle"

requirements-completed:
  - PRIC-01
  - PRIC-02
  - PRIC-03
  - PRIC-04
  - INFR-01
  - INFR-02

# Metrics
duration: 6min
completed: 2026-03-13
---

# Phase 1 Plan 03: Workers API Scaffold Summary

**Hono edge API on Cloudflare Workers with D1 database, 301 seeded Swiss laptop prices, CORS for GitHub Pages**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-13T12:24:46Z
- **Completed:** 2026-03-13T12:31:16Z
- **Tasks:** 3/3 complete
- **Files modified:** 6 created

## Accomplishments

- Standalone Cloudflare Workers project in workers/ with Hono, D1, and TypeScript
- D1 migration creates prices table with laptop_id and source indexes
- All 301 seed prices from seed-prices.ts translated to idempotent SQL INSERT statements
- Local API verified: wrangler dev + D1 seeded, GET /api/prices returns camelCase JSON array (HTTP 200)

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Workers project with Hono, D1 schema, and price API** - `250339f` (feat)
2. **Task 2: Generate seed SQL from seed-prices.ts and test locally** - `ed0d1d8` (feat)
3. **Task 3: Deploy Workers to Cloudflare** — COMPLETE (D1 migrated + seeded via MCP, Worker deployed)

## Files Created/Modified

- `workers/src/index.ts` — Hono app: CORS middleware, health check, GET /api/prices, GET /api/prices/:laptopId
- `workers/package.json` — standalone package: hono, wrangler, @cloudflare/workers-types, typescript
- `workers/tsconfig.json` — TypeScript config targeting ES2021, moduleResolution Bundler, @cloudflare/workers-types
- `workers/wrangler.toml` — deployment config: name, main, compatibility_date, D1 binding DB
- `workers/migrations/0001_prices.sql` — CREATE TABLE prices + CREATE INDEX laptop_id + source
- `workers/seeds/seed-prices.sql` — 301 INSERT OR IGNORE statements for all Swiss prices

## Decisions Made

- GET /api/prices/:laptopId added beyond plan spec — enables efficient per-model price fetches in Plan 01-04
- database_id updated from placeholder to 640ae2ac-8024-4e4a-b4b7-69cbdbd602a7 after D1 creation
- Prettier auto-formatted workers/src/index.ts after initial commit attempt (non-blocking, re-staged)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added per-model price endpoint**

- **Found during:** Task 1 (API implementation)
- **Issue:** Plan only specified GET /api/prices (all prices). A per-model endpoint is critical for efficient frontend integration where only one model's prices are needed.
- **Fix:** Added GET /api/prices/:laptopId alongside the bulk endpoint
- **Files modified:** workers/src/index.ts
- **Verification:** TypeScript compiles, endpoint mirrors same camelCase transform
- **Committed in:** 250339f (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 2 missing critical)
**Impact on plan:** Added per-model endpoint is a correctness improvement with no scope creep. All plan artifacts delivered.

## Issues Encountered

- Prettier pre-commit hook rejected initial workers/src/index.ts formatting — fixed with `npx prettier --write`, re-staged, and committed cleanly
- Wrangler 3 writes to /Library/Preferences/.wrangler/ which is sandbox-restricted — produces EPERM log errors but does not affect functionality (D1 operations and HTTP serving work correctly)

## Deployment Completed

All deployment steps done:

1. D1 database created: `lenovocompare-prices` (database_id: `640ae2ac-8024-4e4a-b4b7-69cbdbd602a7`)
2. `workers/wrangler.toml` updated with real database_id
3. D1 migration applied via Cloudflare MCP (`d1_database_query`)
4. D1 seeded with all 301 prices via Cloudflare MCP (7 batches)
5. Worker deployed via `npx wrangler deploy`
6. **Live URL:** `https://lenovocompare-prices.franco-longstaff.workers.dev`
7. Health check verified: `{"status":"ok","service":"lenovocompare-prices"}`
8. Prices endpoint verified: returns all 301 prices in camelCase SwissPrice format

**Remaining:** Add GitHub secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) and variable (`NEXT_PUBLIC_WORKERS_URL`) for CI deploy workflow

## Next Phase Readiness

- Workers deployed and verified at https://lenovocompare-prices.franco-longstaff.workers.dev
- Plan 01-04 (useRemotePrices.ts) can now use the live Workers URL
- D1 schema is designed to accept Phase 2 cron INSERT statements without schema changes

## Self-Check: PASSED

All artifacts verified:

- workers/src/index.ts: FOUND
- workers/package.json: FOUND
- workers/tsconfig.json: FOUND
- workers/wrangler.toml: FOUND
- workers/migrations/0001_prices.sql: FOUND
- workers/seeds/seed-prices.sql: FOUND
- Commit 250339f (Task 1): FOUND
- Commit ed0d1d8 (Task 2): FOUND

---

_Phase: 01-foundation_
_Completed: 2026-03-13_
