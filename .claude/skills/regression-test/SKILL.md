---
name: regression-test
description: Snapshot key data aggregates before/after edits to catch silent value regressions
---

# Data Regression Test

Capture and compare key data aggregates before and after bulk edits to catch silent value corruption that passes type checks.

## When to Use

- Before and after `/data-migration` or `/add-model-year` runs
- After bulk-editing `cpu-benchmarks.ts`, `gpu-benchmarks.ts`, or `price-baselines.ts`
- Before committing large data changes

## Workflow

### 1. Capture Snapshot

Read all 9 data files and compute these aggregates:

| Metric                                                                                                 | Source                        |
| ------------------------------------------------------------------------------------------------------ | ----------------------------- |
| Model count (total + per lineup)                                                                       | `data/laptops.ts`             |
| CPU benchmark count                                                                                    | `data/cpu-benchmarks.ts`      |
| GPU benchmark count                                                                                    | `data/gpu-benchmarks.ts`      |
| Mean/min/max CPU composite score                                                                       | `data/cpu-benchmarks.ts`      |
| Mean/min/max GPU score                                                                                 | `data/gpu-benchmarks.ts`      |
| Seed price count + mean price per lineup                                                               | `data/seed-prices.ts`         |
| Price baseline count + mean MSRP per lineup                                                            | `data/price-baselines.ts`     |
| Linux compat entry count                                                                               | `data/linux-compat.ts`        |
| Editorial entry count                                                                                  | `data/model-editorial.ts`     |
| Hardware guide CPU/GPU entry counts                                                                    | `data/hardware-guide.ts`      |
| Model benchmark entry count                                                                            | `data/model-benchmarks.ts`    |
| Score distribution: min/max/mean per dimension (perf, display, memory, connectivity, portability, GPU) | Computed via `lib/scoring.ts` |

### 2. Store Snapshot

Save as JSON to `.claude/snapshots/data-snapshot-{timestamp}.json`:

```json
{
  "timestamp": "2025-01-15T14:30:00Z",
  "label": "before add-model-year 2025",
  "models": { "total": 98, "ThinkPad": 68, "IdeaPad Pro": 14, "Legion": 16 },
  "cpuBenchmarks": { "count": 82, "min": 12, "max": 100, "mean": 52 },
  "gpuBenchmarks": { "count": 28, "min": 8, "max": 92, "mean": 42 },
  "seedPrices": { "count": 205, "meanByLineup": { "ThinkPad": 1450, "IdeaPad Pro": 1100, "Legion": 1800 } },
  "priceBaselines": { "count": 98, "meanMsrpByLineup": { "ThinkPad": 1800, "IdeaPad Pro": 1300, "Legion": 2200 } },
  "linuxCompat": { "count": 98 },
  "editorial": { "count": 98 },
  "hardwareGuide": { "cpu": 82, "gpu": 28 },
  "modelBenchmarks": { "count": 12 },
  "scores": {
    "performance": { "min": 15, "max": 95, "mean": 55 },
    "display": { "min": 20, "max": 90, "mean": 58 },
    "memory": { "min": 10, "max": 85, "mean": 45 }
  }
}
```

### 3. Compare Snapshots

Compare the latest snapshot against the previous one and flag:

| Severity    | Condition                                                           |
| ----------- | ------------------------------------------------------------------- |
| **Error**   | Any count decreased (models, benchmarks, prices, compat, editorial) |
| **Error**   | Mean CPU or GPU score changed by > 10 points                        |
| **Error**   | Any min score dropped to 0 (likely missing benchmark)               |
| **Warning** | Mean price per lineup changed by > 20%                              |
| **Warning** | Score distribution mean shifted by > 5 points                       |
| **Info**    | Counts increased (expected after additions)                         |

### 4. Output

```
Data Regression Report
======================
Comparing: "before add-model-year 2025" → "after add-model-year 2025"

Models:       98 → 110 (+12) ✅
CPU Benchmarks: 82 → 90 (+8) ✅
GPU Benchmarks: 28 → 30 (+2) ✅
Seed Prices:  205 → 229 (+24) ✅
Baselines:    98 → 110 (+12) ✅
Linux Compat: 98 → 110 (+12) ✅
Editorial:    98 → 110 (+12) ✅

Score Distribution:
  Performance: mean 55 → 54 (-1) ✅
  Display:     mean 58 → 57 (-1) ✅
  GPU:         min 8 → 0 ❌ (likely missing GPU benchmark for new model)

Result: 1 error, 0 warnings
```

## Arguments

- `/regression-test snapshot [label]` — Capture a new snapshot with optional label
- `/regression-test compare` — Compare latest two snapshots
- `/regression-test list` — List all saved snapshots
