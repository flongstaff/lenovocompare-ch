---
name: data-verify
description: Data validation — cross-reference sync, CLI validation, and regression snapshots
disable-model-invocation: true
---

# Data Verify

Unified data validation skill — cross-reference checks, CLI validation, and regression snapshots.

## Usage

```
/data-verify                    # Run CLI validation (npm run validate)
/data-verify --sync             # Full cross-reference of all data files
/data-verify --regression snapshot [label]  # Capture data aggregate snapshot
/data-verify --regression compare           # Compare latest two snapshots
/data-verify --regression list              # List all saved snapshots
```

## Mode: Validate (default)

Run the automated validation engine against all data files.

```bash
npm run validate
```

Checks: duplicate IDs, missing CPU/GPU benchmarks, invalid lineup/series combos, impossible specs, price baseline inversions, orphan entries, duplicate seed price IDs, missing coverage, unused benchmarks, spec range outliers.

Exit codes: 0 = passed, 1 = validation errors, 2 = validator crashed.

**Errors** block build. **Warnings** don't block but should be addressed. Fix underlying data files, then re-run to confirm.

## Mode: Sync (`--sync`)

Cross-reference ALL data files for missing entries, broken PSREF URLs, and incomplete coverage.

### 1. CPU Coverage

- Read all unique `processor.name` values from `data/laptops.ts` (including `processorOptions`)
- Check each exists in `data/cpu-benchmarks.ts` (`cpuBenchmarksExpanded`)
- Check each exists in `data/hardware-guide.ts` (`cpuGuide`)

### 2. GPU Coverage

- Read all unique `gpu.name` values from `data/laptops.ts` (including `gpuOptions`)
- Check each exists in `data/gpu-benchmarks.ts` (`gpuBenchmarks`)
- Check each exists in `data/hardware-guide.ts` (`gpuGuide`)

### 3. gpuOptions Completeness

- For models with `processorOptions` spanning CPU families with different iGPUs:
  - Verify the model has `gpuOptions` containing the alternative iGPUs
- Report models missing expected `gpuOptions`

### 4. Per-Model Data Files

For every model ID in `data/laptops.ts`, verify an entry exists in:

| File                       | Check                                    | Required |
| -------------------------- | ---------------------------------------- | -------- |
| `data/linux-compat.ts`     | Entry exists                             | Yes      |
| `data/model-editorial.ts`  | Entry exists                             | Yes      |
| `data/seed-prices.ts`      | At least 1 price with matching laptopId  | Yes      |
| `data/price-baselines.ts`  | Entry exists                             | Yes      |
| `data/model-benchmarks.ts` | Entry exists (optional, warn if missing) | No       |

### 5. PSREF URL Validation

- Verify every model has `psrefUrl`
- Check URL format by lineup:
  - ThinkPad: `https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_*`
  - IdeaPad Pro: `https://psref.lenovo.com/Product/IdeaPad/Lenovo_IdeaPad_Pro_*`
  - Legion: `https://psref.lenovo.com/Product/Legion/Lenovo_Legion_*`
- Optionally: fetch to verify URLs return 200

### 6. Orphaned Entries

- Entries in data files that reference model IDs not in `laptops.ts`
- CPUs/GPUs in benchmarks that no model uses
- Hardware guide entries that no benchmark references

### 7. Alternative References

- `HardwareGuideEntry.alternatives[].name` must reference existing chips in benchmark files

### 8. Price Sanity

- Models with only 1 seed price (ideal: 2-3)
- Inverted baselines (`historicalLow > typicalRetail > msrp`)
- Unrealistic prices (< CHF 200 or > CHF 5000)

### Sync Output

```
=== Data Sync Report ===

Models:          98+ total (ThinkPad: 68, IdeaPad Pro: 14, Legion: 16)
CPU Coverage:    X/Y in benchmarks, X/Y in hardware guide
GPU Coverage:    X/Y in benchmarks, X/Y in hardware guide

Per-Model Coverage:
  linux-compat:       X/Y
  model-editorial:    X/Y
  seed-prices:        X/Y (avg N prices/model)
  price-baselines:    X/Y
  model-benchmarks:   X/Y (optional)

PSREF URLs:      X/Y present, X/Y valid format
gpuOptions gaps: [count]
Orphaned CPUs:   [count]
Orphaned GPUs:   [count]

[Details of any issues found]
```

### Resolution Skills

- Missing benchmarks: `/benchmark-update`
- Missing hardware guide: `/hardware-update`
- Missing linux-compat: `/add-linux-compat`
- Missing editorial: `/add-editorial`
- Missing prices: `/add-price`
- Missing model benchmarks: `/add-benchmark`
- Missing gpuOptions: `/gpu-update`
- Broken PSREF URLs: `/update-psref`

## Mode: Regression (`--regression`)

Capture and compare key data aggregates before/after bulk edits to catch silent value corruption.

### When to Use

- Before and after `/data-migration` or `/add-model-year` runs
- After bulk-editing benchmark or price files
- Before committing large data changes

### Metrics Captured

| Metric                             | Source                    |
| ---------------------------------- | ------------------------- |
| Model count (total + per lineup)   | `data/laptops.ts`         |
| CPU/GPU benchmark counts           | `data/cpu-benchmarks.ts`  |
| Mean/min/max CPU/GPU scores        | benchmark files           |
| Seed price count + mean per lineup | `data/seed-prices.ts`     |
| Price baseline count + mean MSRP   | `data/price-baselines.ts` |
| Linux/editorial/guide entry counts | respective files          |
| Score distribution per dimension   | computed via scoring.ts   |

### Snapshot Storage

Save as JSON to `.claude/snapshots/data-snapshot-{timestamp}.json`.

### Compare Thresholds

| Severity    | Condition                                      |
| ----------- | ---------------------------------------------- |
| **Error**   | Any count decreased                            |
| **Error**   | Mean CPU or GPU score changed by > 10 points   |
| **Error**   | Any min score dropped to 0 (missing benchmark) |
| **Warning** | Mean price per lineup changed by > 20%         |
| **Warning** | Score distribution mean shifted by > 5 points  |
| **Info**    | Counts increased (expected after additions)    |

### Regression Output

```
Data Regression Report
======================
Comparing: "before edit" → "after edit"

Models:       98 → 110 (+12) ✅
CPU Benchmarks: 82 → 90 (+8) ✅
GPU Benchmarks: 28 → 30 (+2) ✅
Seed Prices:  205 → 229 (+24) ✅

Score Distribution:
  Performance: mean 55 → 54 (-1) ✅
  GPU:         min 8 → 0 ❌ (likely missing GPU benchmark)

Result: 1 error, 0 warnings
```
