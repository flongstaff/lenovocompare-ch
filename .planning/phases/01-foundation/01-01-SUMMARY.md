---
phase: 01-foundation
plan: 01
subsystem: ui
tags: [react, typescript, vitest, compare-table, benchmarks, source-attribution]

# Dependency graph
requires: []
provides:
  - "Differences-only toggle in CompareTable with hidden-row count badge"
  - "SourceLinkedValue component for benchmark score attribution"
  - "64 NotebookCheck source URLs populated in model-benchmarks.ts"
  - "Unit tests for diff-toggle filter logic (10 tests)"
  - "Unit tests for source link rendering logic (13 tests)"
affects: [compare, model-detail, benchmarks]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pure function extraction (filterDiffRows) for testable filter logic"
    - "SourceLinkedValue helper component for conditional link/unverified display"
    - "Section-level source attribution footer pattern in benchmark subsections"

key-files:
  created:
    - tests/compare-table.test.ts
    - tests/benchmarks-section.test.ts
  modified:
    - components/compare/CompareTable.tsx
    - components/models/BenchmarksSection.tsx
    - data/model-benchmarks.ts

key-decisions:
  - "Diff toggle defaults to OFF — users see all rows by default, opt into filtered view"
  - "Source attribution as subsection footer line rather than wrapping individual StatBox/MiniBar value props"
  - "SourceLinkedValue shows dotted-underline link to sourceUrls[0] when present, (unverified) label when absent"
  - "Added workers/ to tsconfig.json exclude to prevent D1Database type bleed from Cloudflare Workers"

patterns-established:
  - "SourceLinkedValue pattern: <SourceLinkedValue value='review source' sourceUrls={chassisBench.sourceUrls} /> in subsections with chassis bench data"
  - "filterDiffRows pure function mirrors component filter logic for testability without React rendering"

requirements-completed: [COMP-01, COMP-03, COMP-04]

# Metrics
duration: 45min
completed: 2026-03-13
---

# Phase 01 Plan 01: UX Improvements — Diff Toggle and Benchmark Source Attribution

**CompareTable diff-only toggle with hidden-count badge, and per-subsection benchmark source attribution links with (unverified) fallback labels for 64 NotebookCheck-reviewed models.**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-03-13T12:45:00Z
- **Completed:** 2026-03-13T13:40:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- CompareTable gets a "Diffs only" toggle that hides rows where all compared models have identical values, showing a badge with the hidden row count
- BenchmarksSection gets a `SourceLinkedValue` component that renders benchmark values as clickable links (dotted underline on hover) when `sourceUrls` is populated, or adds a muted "(unverified)" label when absent
- 64 model entries in `model-benchmarks.ts` now have `sourceUrls` arrays pointing to NotebookCheck reviews (all X1 Carbon Gen 10-13, T14/T14s/T16, Legion flagships, Yoga 9i, P-series, IdeaPad Pro, and more)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add differences-only toggle to CompareTable** - `580b327` (feat)
2. **Task 2: Add benchmark source attribution links** - `f1a3086` (feat)

## Files Created/Modified

- `tests/compare-table.test.ts` - 10 unit tests for `filterDiffRows` pure function (all pass)
- `tests/benchmarks-section.test.ts` - 13 unit tests for `SourceLinkedValue` rendering logic (all pass)
- `components/compare/CompareTable.tsx` - `showDiffsOnly` state, `visibleRows`/`hiddenCount` filter, toggle button with `aria-pressed`, section header hiding when all rows filtered
- `components/models/BenchmarksSection.tsx` - `SourceLinkedValue` component, source attribution footer in Thermals, Battery, Storage Speed, Display (Measured), and Content Creation subsections
- `data/model-benchmarks.ts` - 64 model entries updated with `sourceUrls` arrays for NotebookCheck reviews
- `tsconfig.json` - Added `workers/` to exclude to prevent D1Database type pollution

## Decisions Made

- **Toggle default OFF**: Users see all rows by default, opt into filtered view — avoids disorienting initial empty state
- **Section-level attribution over value-wrapping**: Adding a small "Measured: [review source]" footer per subsection is cleaner than modifying `StatBox`/`MiniBar` component APIs to accept a `sourceUrl` prop
- **First URL strategy**: `SourceLinkedValue` always uses `sourceUrls[0]` as the primary link; future multi-source expansion is possible but not needed now

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added workers/ to tsconfig.json exclude**

- **Found during:** Task 1 (build verification)
- **Issue:** Root tsconfig.json included `**/*.ts` glob, picking up `workers/src/index.ts` which uses `D1Database` from `@cloudflare/workers-types` not installed at root level
- **Fix:** Added `"workers"` to the `exclude` array in tsconfig.json
- **Files modified:** tsconfig.json
- **Verification:** `npm run build` passed after fix
- **Committed in:** `580b327` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Build-blocking tsconfig issue fixed. No scope creep.

## Issues Encountered

- Prettier pre-commit hook failed on first Task 1 commit attempt — ran `npx prettier --write` on three files, re-staged, committed successfully
- Prettier pre-commit hook failed on Task 2 commit attempt for `tests/benchmarks-section.test.ts` — same fix applied

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Both UX improvements are live: diff toggle in compare table, source attribution in model detail pages
- 64 models now have source links; remaining models show "(unverified)" correctly per COMP-04
- No blockers for subsequent plans

---

_Phase: 01-foundation_
_Completed: 2026-03-13_
