# Benchmark Data Reviewer

Cross-reference `data/model-benchmarks.ts` against `data/laptops.ts` to find coverage gaps and validate data plausibility.

## Instructions

1. Read `data/laptops.ts` to get all model IDs and their specs (CPU, year, lineup).
2. Read `data/model-benchmarks.ts` to get all models with benchmark data.
3. Read `data/cpu-benchmarks.ts` to check which CPUs have raw Cinebench/Geekbench scores.

## Coverage Analysis

For each model in `laptops.ts`:

4. Check if it has an entry in `model-benchmarks.ts`. Track:
   - Models WITH benchmark data (count and list)
   - Models WITHOUT benchmark data (count and list)
   - Coverage percentage by lineup (ThinkPad, IdeaPad Pro, Legion)
   - Coverage percentage by year (2024, 2025 should be highest priority)

5. Check if its CPU has raw benchmark scores (cinebench2024Single, geekbench6Single) in `cpu-benchmarks.ts`. Track:
   - CPUs WITH raw scores
   - CPUs WITHOUT raw scores (these models show no CPU benchmark bars)

## Plausibility Validation

For each entry in `model-benchmarks.ts`:

6. Validate thermal data:
   - `keyboardMaxC` should be 30–55°C (warn if outside)
   - `undersideMaxC` should be 35–60°C (warn if outside)
   - `undersideMaxC` should be >= `keyboardMaxC` (warn if not)

7. Validate battery data:
   - `officeHours` should be 3–18 hours
   - `videoHours` should be >= `officeHours` (video is less demanding)
   - Legion models should have lower battery (3–8 hrs), ThinkPads higher (8–16 hrs)

8. Validate performance data:
   - `batteryPerformance.onBattery` should be < `batteryPerformance.pluggedIn`
   - Performance delta should be 15–60% (warn if outside)

9. Validate SSD speeds:
   - `seqReadMBs` should be > `seqWriteMBs`
   - Modern NVMe: 3000–7500 MB/s read

10. Validate display brightness:
    - `displayBrightness` should be within ±30% of spec `display.nits`

## Output Format

```
## Benchmark Data Coverage Report

### Coverage Summary
- Total models: [count]
- Models with benchmark data: [count] ([pct]%)
- Models with CPU raw scores: [count] ([pct]%)

### Coverage by Lineup
- ThinkPad: [x]/[total] ([pct]%)
- IdeaPad Pro: [x]/[total] ([pct]%)
- Legion: [x]/[total] ([pct]%)

### High-Priority Missing (2024-2025 models without data)
- [model-id]: [model name] ([cpu])
- ...

### Data Validation Issues
- [model-id]: [issue description]
- ...

### Missing CPU Raw Benchmarks
- [cpu name] — used by: [model-id, model-id, ...]
```

## Priority

Focus validation on:

1. 2024-2025 models first (most likely to have reviews available)
2. Flagship models (X1 Carbon, Legion Pro, P-series)
3. Models where data seems implausible
