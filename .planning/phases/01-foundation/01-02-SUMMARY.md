---
phase: 01-foundation
plan: "02"
subsystem: compare-ui
tags: [dimensions, physical-comparison, compare-page, psref-data]
dependency_graph:
  requires: []
  provides: [Laptop.dimensions, PhysicalSizeComparison]
  affects: [compare-page, CompareClient, laptops-data]
tech_stack:
  added: []
  patterns: [CSS-scaled proportional rectangles, collapsible section via useState]
key_files:
  created:
    - components/compare/PhysicalSizeComparison.tsx
  modified:
    - lib/types.ts
    - data/laptops.ts
    - app/compare/CompareClient.tsx
    - tests/compare-table.test.ts
decisions:
  - "Used MAX_WIDTH_PX=200 scale factor for top-down footprint rectangles, separate MAX_HEIGHT_BAR_PX=20 for thickness bar"
  - "Separate top-down footprint rectangle and side-view thickness bar rather than combined 3D-style box"
  - "Graceful null return when zero models have dimensions data, dashed placeholder when individual model lacks dimensions"
  - "Non-dynamic import for PhysicalSizeComparison since it is pure CSS with no recharts dependencies"
metrics:
  duration: "~35 minutes (resumed session)"
  completed_date: "2026-03-13"
  tasks_completed: 2
  files_changed: 5
  models_with_dimensions: 20
requirements_satisfied: [COMP-02]
---

# Phase 01 Plan 02: Physical Size Comparison Summary

**One-liner:** CSS-scaled proportional dimension rectangles for compare page using PSREF-sourced mm data for 20 models across all four lineups.

## What Was Built

### Task 1: Dimensions type and PSREF data population

Added optional `dimensions` field (`widthMm`, `depthMm`, `heightMm`) to the `Laptop` interface in `lib/types.ts`. Populated dimension data for 20 models from PSREF spec pages:

**ThinkPad X1 family (4 models):**

- X1 Carbon Gen 10: 315.6 x 222.5 x 14.95 mm
- X1 Carbon Gen 11: 315.6 x 222.5 x 14.96 mm
- X1 Carbon Gen 12: 312.8 x 214.75 x 14.96 mm
- X1 Carbon Gen 13: 312.8 x 214.75 x 17.95 mm
- X1 Yoga Gen 7: 315.6 x 222.5 x 15.2 mm
- X1 Yoga Gen 9: 315.6 x 222.5 x 16.8 mm
- X1 Nano Gen 3: 293.2 x 208.0 x 14.4 mm

**ThinkPad T-series (8 models):**

- T14 Gen 5 Intel/AMD: 315.9 x 223.7 x 17.7 mm
- T14 Gen 6 Intel/AMD: 315.9 x 223.7 x 21.8 mm
- T14s Gen 5 Intel/AMD: 313.6 x 219.4 x 16.9 mm
- T14s Gen 6 Intel/AMD: 313.6 x 219.4 x 19.75 mm

**ThinkPad P-series (1 model):**

- P1 Gen 7: 354.4 x 241.2 x 17.05 mm

**Legion (2 models):**

- Legion 5 16AHP9: 359.7 x 262.3 x 25.2 mm
- Legion Pro 5 16ARP9: 363.4 x 261.75 x 26.95 mm

**Yoga (3 models):**

- Yoga 9 14IRP8: 318.0 x 230.0 x 15.25 mm
- Yoga 9 2-in-1 14IMH9: 318.0 x 230.0 x 15.25 mm

**X1 2-in-1 (1 model):**

- X1 Yoga Gen 7: 315.6 x 222.5 x 15.2 mm

### Task 2: PhysicalSizeComparison component and integration

Created `components/compare/PhysicalSizeComparison.tsx`:

- Top-down footprint rectangle: width x depth, scaled proportionally to `MAX_WIDTH_PX=200`
- Thickness side bar: relative height with `MAX_HEIGHT_BAR_PX=20` scale
- COMPARE_COLORS border + semi-transparent fill per model slot
- Collapsible section via `useState<boolean>(true)` with ChevronDown/ChevronUp toggle
- Labels: model name (truncated), WxDxH dimensions in mm, weight
- Graceful fallback: dashed placeholder with "Dimensions unavailable" for models lacking data
- Returns null when all models lack dimensions (prevents empty card rendering)

Integrated into `app/compare/CompareClient.tsx` above `CompareTable`, guarded by `selectedModels.length >= 2`.

## Verification

- TypeScript: `npx tsc --noEmit` passes cleanly
- Build: `npm run build` succeeds (260 static pages)
- Tests: `npm test` — 171 tests pass across 16 test files

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Pre-existing TypeScript errors in compare-table.test.ts**

- **Found during:** Task 1 TypeScript verification
- **Issue:** Test fixtures for `processor` objects were missing `baseClock` and `boostClock` fields required by the `Processor` interface, causing tsc to fail
- **Fix:** Added `baseClock` and `boostClock` values to three test processor fixtures
- **Files modified:** `tests/compare-table.test.ts`
- **Commit:** 89ce39f

**2. [Rule 3 - Blocking] Prettier formatting failure on PhysicalSizeComparison.tsx**

- **Found during:** Task 2 commit
- **Issue:** Pre-commit Prettier hook rejected the new component file
- **Fix:** Ran `npx prettier --write` on the file, then re-staged and committed
- **Files modified:** `components/compare/PhysicalSizeComparison.tsx`
- **Commit:** af2c210

## Self-Check: PASSED

- `components/compare/PhysicalSizeComparison.tsx`: FOUND
- `lib/types.ts` dimensions field: FOUND
- 20 models with dimensions in `data/laptops.ts`: FOUND (20 matches)
- Task 1 commit 89ce39f: FOUND
- Task 2 commit af2c210: FOUND
- Build: PASSED
- Tests: 171/171 PASSED
