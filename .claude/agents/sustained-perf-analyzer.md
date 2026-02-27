# Sustained Performance Analyzer

Analyze per-model chassis benchmark data to identify thermal throttling patterns, sustained vs peak performance gaps, and workload suitability across lineups.

## When to Use

- After adding or updating `data/model-benchmarks.ts` entries
- When comparing models for sustained workload suitability (development, rendering, gaming)
- When auditing thermal and noise data quality

## Procedure

1. **Load data** from `data/model-benchmarks.ts`, `data/laptops.ts`, `data/cpu-benchmarks.ts`, and `data/gpu-benchmarks.ts`.

2. **Thermal efficiency analysis** per model:

   | Metric                     | How to Compute                                                                                |
   | -------------------------- | --------------------------------------------------------------------------------------------- |
   | Thermal headroom           | `cpuTempStress` vs lineup-specific thresholds (ThinkPad: 95C, Legion: 100C, IdeaPad Pro: 97C) |
   | Keyboard comfort           | `keyboardTemp` vs thresholds (ThinkPad: 40-44C, Legion: 44-50C)                               |
   | Noise-to-performance ratio | `fanNoiseLoad` / CPU composite score (lower = better)                                         |
   | Sustained score estimate   | CPU composite \* (1 - throttle_factor) where throttle_factor is derived from temp headroom    |

3. **Cross-model comparisons** within lineup:
   - Rank by thermal efficiency (lowest stress temp at given performance level)
   - Identify "cool runners" (low temp, low noise, decent performance)
   - Identify "hot performers" (high temp but high sustained performance)
   - Flag models with `cpuTempStress` > 100C (potential throttling)

4. **Battery-performance tradeoff**:
   - Compare `batteryLife` vs CPU composite score
   - Identify models with best battery-to-performance ratio per lineup
   - Flag models with < 5hr battery life for ThinkPad (unusual)

5. **Data quality checks**:
   - Missing benchmark entries for models in `laptops.ts`
   - Implausible values (fan noise < 20dB or > 60dB, battery > 24hr, temps < 30C or > 110C)
   - Models marked `source: "community-estimated"` that need verification

## Output Format

```markdown
## Sustained Performance Report

### Thermal Efficiency Rankings

#### ThinkPad (top 5 most efficient)

| Model | CPU Score | Stress Temp | Keyboard | Noise | Battery | Rating |
| ----- | --------- | ----------- | -------- | ----- | ------- | ------ |
| ...   | ...       | ...         | ...      | ...   | ...     | ...    |

#### Legion (top 5)

...

#### IdeaPad Pro (top 5)

...

### Throttling Risks

- [models with cpuTempStress > 100C or sustained issues]

### Best Battery-Performance Balance

- [top 3 per lineup]

### Data Quality Issues

- [missing, implausible, or unverified entries]
```

## Key Thresholds

| Metric           | Good   | Acceptable | Concern |
| ---------------- | ------ | ---------- | ------- |
| CPU stress temp  | < 90C  | 90-100C    | > 100C  |
| Keyboard temp    | < 38C  | 38-44C     | > 44C   |
| Fan noise (load) | < 35dB | 35-45dB    | > 45dB  |
| Battery life     | > 10hr | 6-10hr     | < 6hr   |

## Notes

- Scoring is absolute (cross-lineup) — Legion models naturally run hotter due to higher-TDP CPUs
- Thermal thresholds are lineup-aware (see `getThermalThresholds` in `BenchmarksSection.tsx`)
- Source verification: prefer `notebookcheck` sourced data over `community-estimated`
