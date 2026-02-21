# Scoring Auditor

Audit all 6 scoring dimensions across all laptop models (ThinkPad, IdeaPad Pro, and Legion) for sanity and consistency.

## Instructions

1. Read `lib/scoring.ts` to understand all scoring functions:
   - `getPerformanceScore(cpu)` — CPU composite (0-100)
   - `getDisplayScore(model)` — Resolution + panel + brightness + refresh + touch + size
   - `getMemoryScore(model)` — RAM size/max/type + storage size + upgradability
   - `getConnectivityScore(model)` — Ports + wireless + Bluetooth + storage slots
   - `getPortabilityScore(model)` — Weight + battery
   - `getValueScore(model, prices)` — Performance per CHF (null if no price)

2. Read `data/laptops.ts` to get all models.
3. Read `data/cpu-benchmarks.ts` and `data/gpu-benchmarks.ts` for benchmark data.

## Audit Checks

### Distribution Analysis

For each scoring function, compute scores for all models and report:

- **Min / Max / Median / Mean**
- **Models scoring 0**: These indicate missing data (CPU not in benchmarks, etc.)
- **Models scoring 100**: Check if the cap is being hit too often (poor differentiation)
- **Clustering**: If >50% of models score within a 10-point range, the function has poor spread

### Specific Checks

1. **Performance (CPU)**: Any model where `getPerformanceScore` returns 0? This means the CPU is missing from `cpuBenchmarks`. List all missing CPUs.

2. **Display**: Verify OLED models score higher than IPS equivalents. Verify 4K models score higher than FHD. Check that the panel weight (25 for OLED vs 15 for IPS) isn't dominating the score.

3. **Memory**: Verify soldered models score lower on upgradability than slotted. Check that LPDDR5x scores higher than DDR4 for the type bonus.

4. **Connectivity**: Check that Thunderbolt 4 models score significantly higher than USB-C-only models. Verify Wi-Fi 7 models score above Wi-Fi 6E.

5. **Portability**: Check that sub-1kg models (X1 Nano, X1 Carbon) score highest. Verify P-series workstations score lowest.

6. **GPU Score**: Any model with a dedicated GPU where `getGpuScore` returns 0? List missing GPUs.

## Output Format

```
## Scoring Audit Report

### Distribution Summary
| Dimension     | Min | Max | Median | Mean | Zero-scores | At-100 |
|---------------|-----|-----|--------|------|-------------|--------|
| Performance   |     |     |        |      |             |        |
| Display       |     |     |        |      |             |        |
| Memory        |     |     |        |      |             |        |
| Connectivity  |     |     |        |      |             |        |
| Portability   |     |     |        |      |             |        |

### Missing Benchmark Data
- CPUs not in benchmarks: [list with model IDs that use them]
- GPUs not in benchmarks: [list with model IDs that use them]

### Anomalies
- [model.name]: [dimension] score is [value] — expected [higher/lower] because [reason]

### Recommendations
- [suggested scoring adjustments if distributions are skewed]
```
