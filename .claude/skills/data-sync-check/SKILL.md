---
name: data-sync-check
description: Cross-reference ALL data files for missing entries, broken PSREF URLs, and incomplete coverage
disable-model-invocation: true
---

# Data Sync Check

Cross-reference all data files to find missing or inconsistent entries across the entire data layer. Covers all three lineups: ThinkPad, IdeaPad Pro, and Legion.

## Checks to Perform

### 1. CPU Coverage

- Read all unique `processor.name` values from `data/laptops.ts` (including `processorOptions`)
- Check each exists in `data/cpu-benchmarks.ts` (`cpuBenchmarksExpanded`)
- Check each exists in `data/hardware-guide.ts` (`cpuGuide`)
- Report any missing entries

### 2. GPU Coverage

- Read all unique `gpu.name` values from `data/laptops.ts` (including `gpuOptions`)
- Check each exists in `data/gpu-benchmarks.ts` (`gpuBenchmarks`)
- Check each exists in `data/hardware-guide.ts` (`gpuGuide`)
- Report any missing entries

### 3. gpuOptions Completeness

- For models with `processorOptions` spanning CPU families with different iGPUs:
  - Verify the model has `gpuOptions` containing the alternative iGPUs
  - Use the CPU-to-GPU family mapping from `/gpu-update` skill
- Report models missing expected `gpuOptions`

### 4. Per-Model Data Files

For every model ID in `data/laptops.ts`, verify an entry exists in:

| File                       | Key                                     | Check                                    |
| -------------------------- | --------------------------------------- | ---------------------------------------- |
| `data/linux-compat.ts`     | `linuxCompat[id]`                       | Entry exists                             |
| `data/model-editorial.ts`  | `modelEditorial[id]`                    | Entry exists                             |
| `data/seed-prices.ts`      | At least 1 price with `laptopId === id` | Has prices                               |
| `data/price-baselines.ts`  | `priceBaselines[id]`                    | Entry exists                             |
| `data/model-benchmarks.ts` | `modelBenchmarks[id]`                   | Entry exists (optional, warn if missing) |

Report any model missing from ANY of the required files.

### 5. PSREF URL Validation

- Verify every model in `data/laptops.ts` has a `psrefUrl` field
- Check URL format matches patterns by lineup:
  - ThinkPad: `https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_*`
  - IdeaPad Pro: `https://psref.lenovo.com/Product/IdeaPad/Lenovo_IdeaPad_Pro_*`
  - Legion: `https://psref.lenovo.com/Product/Legion/Lenovo_Legion_*`
- Optionally: use fetch MCP to verify URLs return 200 (flag any 404s)

### 6. Orphaned Entries

- Check for entries in `cpuBenchmarksExpanded` that no model uses (via processor or processorOptions)
- Check for entries in `gpuBenchmarks` that no model uses (via gpu or gpuOptions)
- Check for entries in `cpuGuide` / `gpuGuide` that no benchmark entry references
- Check for model IDs in `linux-compat`, `model-editorial`, `seed-prices`, `price-baselines`, `model-benchmarks` that don't exist in `laptops.ts`
- Report orphans (not necessarily errors, but worth flagging)

### 7. Alternative References

- For each `HardwareGuideEntry`, check that `alternatives[].name` references a chip that exists in the corresponding benchmark file
- Report any alternatives that reference non-existent chips

### 8. Price Sanity

- Check for models with only 1 seed price (ideal is 2-3)
- Check for price baselines where `historicalLow > typicalRetail > msrp` (inverted)
- Flag any prices that seem unrealistic (< CHF 200 or > CHF 5000)

## Output Format

```
=== Data Sync Report ===

Models:          98+ total (ThinkPad: 68, IdeaPad Pro: 14, Legion: 16)
CPU Coverage:    X/Y in benchmarks, X/Y in hardware guide
GPU Coverage:    X/Y in benchmarks, X/Y in hardware guide

Per-Model Coverage:
  linux-compat:       X/Y ✓/✗
  model-editorial:    X/Y ✓/✗
  seed-prices:        X/Y ✓/✗  (avg N prices/model)
  price-baselines:    X/Y ✓/✗
  model-benchmarks:   X/Y (optional)

PSREF URLs:      X/Y present, X/Y valid format
gpuOptions gaps: [count]
Orphaned CPUs:   [count]
Orphaned GPUs:   [count]
Invalid Alts:    [count]

[Details of any issues found]
```

## Resolution

- Missing benchmark entries: use `/benchmark-update` skill
- Missing hardware guide entries: use `/hardware-update` skill
- Missing linux-compat: use `/add-linux-compat` skill
- Missing editorial: use `/add-editorial` skill
- Missing prices: use `/add-price` skill
- Missing price baselines: manually add to `price-baselines.ts`
- Missing model benchmarks: use `/add-benchmark` skill
- Missing gpuOptions: use `/gpu-update` skill
- Orphaned entries: review if the hardware/model was removed
- Broken PSREF URLs: use `/update-psref` skill
