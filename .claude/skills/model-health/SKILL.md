---
name: model-health
description: Full health check for a single model — data completeness, page rendering, chart verification
---

# Model Health Check

End-to-end health check for a single laptop model. Combines data file completeness (like `/model-checklist`) with live page rendering and chart verification.

## Arguments

`/model-health {model-id}` — e.g., `/model-health t14s-gen6-amd`

## Workflow

### Phase 1: Data Completeness

Run the same checks as `/model-checklist` — verify entries across all 9 data files. See that skill for the full checklist.

### Phase 2: Page Rendering

1. Ensure dev server is running on localhost:3000
2. `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/model/{model-id}` — expect 200
3. If 404/500, report the error and stop

### Phase 3: Chart Verification

Check that the model's data produces valid chart inputs:

| Chart              | Requirement                                                |
| ------------------ | ---------------------------------------------------------- |
| PerformanceRadar   | `getPerformanceDimensions()` returns 6 non-zero dimensions |
| BenchmarkBar       | CPU single/multi scores > 0; GPU score > 0                 |
| PriceTimelineChart | At least 2 seed prices (for chart to render)               |
| FpsChart           | GPU has FPS estimates in `gpuBenchmarks` (only if dGPU)    |

Verify by reading the relevant data files and computing:

- Import scoring functions from `lib/scoring.ts` conceptually — check that `cpuBenchmarksExpanded` has the CPU, `gpuBenchmarks` has the GPU
- Count seed prices for the model — need 2+ for timeline scatter chart
- Check if GPU is discrete (non-integrated) — if so, verify FPS data exists

### Phase 4: Price Sanity

- Baseline ordering: `msrp >= typicalRetail >= historicalLow`
- No seed price exceeds MSRP by >20% (likely data entry error)
- At least one seed price is within 15% of `typicalRetail`

## Output

```
Model Health: ThinkPad T14s Gen 6 (AMD) [t14s-gen6-amd]
========================================================

DATA COMPLETENESS: 13/13 required ✅
PAGE RENDERING:    HTTP 200 ✅
CHARTS:
  PerformanceRadar  — 6 dimensions ✅
  BenchmarkBar      — CPU: 72/68, GPU: 18 ✅
  PriceTimeline     — 3 prices (chart renders) ✅
  FpsChart          — iGPU (skipped) —
PRICE SANITY:      All checks pass ✅

Overall: HEALTHY ✅
```

## When to Use

- After `/add-laptop` to verify the full pipeline
- After editing seed prices or baselines for a model
- When a user reports a model page looks wrong
- Periodic spot-checks on random models
