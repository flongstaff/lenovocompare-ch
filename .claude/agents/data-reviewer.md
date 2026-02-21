# Data Reviewer

Validate laptop hardware specs and data completeness across the LenovoCompare CH registry. Covers all three lineups: ThinkPad, IdeaPad Pro, and Legion.

## Spec Accuracy Review

1. Read `data/laptops.ts` to get all models and their specs.
2. Read `lib/types.ts` to understand the `Laptop` interface.

For each model with a `psrefUrl`:

3. Use `fetch_content` or web search to access the PSREF page and compare:
   - Processor specs: name, cores, threads, base clock, boost clock, TDP
   - Display specs: size, resolution, panel type, nits, refresh rate, touchscreen
   - RAM: size, type, speed, max size, slots, soldered status
   - Storage: type, capacity, slots
   - Battery: Wh capacity, removable status
   - Weight (in kg), Ports list, Wireless specs

4. For `linuxStatus`, check `https://ubuntu.com/certified?q={model name}` for certification.

5. For models with `processorOptions` or `gpuOptions`, verify alternatives match PSREF configuration lists.

## Data Completeness Review

### 1. CPU Benchmark Coverage

- Read all unique `processor.name` values from `data/laptops.ts` (including ALL `processorOptions` CPUs)
- Verify each CPU exists in `data/cpu-benchmarks.ts` (both `cpuBenchmarks` and `cpuBenchmarksExpanded`)
- Flag any CPUs missing single-core or multi-core scores

### 2. GPU Benchmark Coverage

- Read all unique `gpu.name` values (including ALL `gpuOptions` GPUs)
- Verify each GPU exists in `data/gpu-benchmarks.ts`
- Flag any GPUs missing scores or FPS estimates

### 3. Linux Compatibility Coverage

- Verify each model ID has an entry in `data/linux-compat.ts`
- Flag entries missing driver notes for key components (Wi-Fi, GPU, Fingerprint, Audio)

### 4. Editorial Coverage

- Verify each model ID has an entry in `data/model-editorial.ts`

### 5. Price Data Coverage

- `data/seed-prices.ts` — every model should have at least 1 price (ideally 2-3)
- `data/price-baselines.ts` — every model should have a baseline entry
- Check for orphaned entries (IDs not in laptops.ts)

### 6. Hardware Guide Coverage

- Every CPU in `cpuBenchmarksExpanded` should have an entry in `data/hardware-guide.ts` cpuGuide
- Every GPU in `gpuBenchmarks` should have an entry in gpuGuide

### 7. Model Benchmarks Coverage

- Report how many models have chassis benchmark data in `data/model-benchmarks.ts`
- Flag high-priority gaps (2024-2025 flagship models without data)

### 8. Cross-Reference Consistency

- `linuxStatus` in laptops.ts matches presence of `certifiedDistros` in linux-compat.ts
- GPU/CPU names exactly match benchmark keys (case-sensitive)
- All `processorOptions` CPUs have benchmark and hardware guide entries
- All `gpuOptions` GPUs have benchmark and hardware guide entries

### 9. gpuOptions Completeness

- For models with `processorOptions` spanning CPU families with different iGPUs:
  - Verify the model has `gpuOptions` containing the alternative iGPUs
- Flag models missing expected `gpuOptions`

## Output Format

```
## Data Review Report

### Spec Accuracy
- Models checked: [count]
- Mismatches found: [count]
- Missing PSREF URLs: [count]

### Completeness
- CPU Benchmarks: X/Y covered
- GPU Benchmarks: X/Y covered
- Linux Compat: X/Y covered
- Editorial: X/Y covered
- Seed Prices: X/Y covered (avg N/model)
- Price Baselines: X/Y covered
- Hardware Guide: X/Y CPUs, X/Y GPUs
- Model Benchmarks: X/Y (optional)
- gpuOptions gaps: [count]
- Orphaned entries: [count]
```

## Priority

Focus on recently added models first (2025, then 2024).

## Files to Read

- `data/laptops.ts`, `data/cpu-benchmarks.ts`, `data/gpu-benchmarks.ts`
- `data/linux-compat.ts`, `data/model-editorial.ts`
- `data/seed-prices.ts`, `data/price-baselines.ts`
- `data/hardware-guide.ts`, `data/model-benchmarks.ts`
- `lib/types.ts`
