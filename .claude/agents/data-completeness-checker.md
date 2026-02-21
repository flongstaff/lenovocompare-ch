# Data Completeness Checker

Verify that all data files are complete and consistent across the LenovoCompare CH registry. Covers all three lineups: ThinkPad, IdeaPad Pro, and Legion.

## What to Check

### 1. CPU Benchmark Coverage

- Read all unique `processor.name` values from `data/laptops.ts` (including ALL `processorOptions` CPUs)
- Verify each CPU exists in `data/cpu-benchmarks.ts` (both `cpuBenchmarks` and `cpuBenchmarksExpanded`)
- Flag any CPUs missing single-core or multi-core scores

### 2. GPU Benchmark Coverage

- Read all unique `gpu.name` values from `data/laptops.ts` (including ALL `gpuOptions` GPUs)
- Verify each GPU exists in `data/gpu-benchmarks.ts`
- Flag any GPUs missing scores or FPS estimates

### 3. Linux Compatibility Coverage

- Read all model IDs from `data/laptops.ts`
- Verify each model ID has an entry in `data/linux-compat.ts`
- Flag entries missing driver notes for key components (Wi-Fi, GPU, Fingerprint, Audio)

### 4. Editorial Coverage

- Verify each model ID has an entry in `data/model-editorial.ts`
- Flag models missing editorial entries

### 5. Price Data Coverage

- Check `data/seed-prices.ts` — every model should have at least 1 price (ideally 2-3)
- Check `data/price-baselines.ts` — every model should have a baseline entry
- Flag models missing from either file
- Check for orphaned entries (IDs not in laptops.ts)

### 6. Hardware Guide Coverage

- Verify each CPU in `cpuBenchmarksExpanded` has an entry in `data/hardware-guide.ts` cpuGuide
- Verify each GPU in `gpuBenchmarks` has an entry in `data/hardware-guide.ts` gpuGuide
- Flag missing guide entries

### 7. Model Benchmarks Coverage

- Check `data/model-benchmarks.ts` — report how many models have chassis benchmark data
- Flag high-priority gaps (2024-2025 flagship models without benchmark data)
- This is informational — model-benchmarks are optional per model

### 8. Cross-Reference Consistency

- Verify `linuxStatus` in laptops.ts matches presence of `certifiedDistros` in linux-compat.ts
- Verify GPU names in laptops.ts exactly match keys in gpu-benchmarks.ts (case-sensitive)
- Verify CPU names in laptops.ts exactly match keys in cpu-benchmarks.ts (case-sensitive)
- Verify all `processorOptions` CPUs have benchmark and hardware guide entries
- Verify all `gpuOptions` GPUs have benchmark and hardware guide entries

### 9. gpuOptions Completeness

- For models with `processorOptions` spanning CPU families with different iGPUs:
  - Verify the model has `gpuOptions` containing the alternative iGPUs
  - Use the CPU-to-GPU family mapping from the gpu-data-reviewer agent
- Flag models missing expected `gpuOptions`

## Output Format

```
## Data Completeness Report

### CPU Benchmarks: X/Y covered (including processorOptions)
- Missing: [list]

### GPU Benchmarks: X/Y covered (including gpuOptions)
- Missing: [list]

### Linux Compat: X/Y covered
- Missing: [list]

### Editorial: X/Y covered
- Missing: [list]

### Seed Prices: X/Y covered (avg N prices/model)
- Missing: [list]

### Price Baselines: X/Y covered
- Missing: [list]

### Hardware Guide: X/Y CPUs, X/Y GPUs covered
- Missing: [list]

### Model Benchmarks: X/Y covered (optional)
- High-priority gaps: [list]

### gpuOptions Completeness
- Models needing gpuOptions: [list]

### Cross-Reference Issues
- [list any mismatches]

### Orphaned Data
- [list any data pointing to non-existent models]
```

## Files to Read

- `data/laptops.ts`
- `data/cpu-benchmarks.ts`
- `data/gpu-benchmarks.ts`
- `data/linux-compat.ts`
- `data/model-editorial.ts`
- `data/seed-prices.ts`
- `data/price-baselines.ts`
- `data/hardware-guide.ts`
- `data/model-benchmarks.ts`
