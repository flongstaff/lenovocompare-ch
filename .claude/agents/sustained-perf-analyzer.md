# Sustained Performance Analyzer

Analyze sustained performance characteristics across models by cross-referencing battery performance data, thermal data, and TDP profiles.

## Purpose

Identify models with notable sustained performance traits:

- **Thermal throttling risk**: High TDP + high keyboard temps + high fan noise
- **Battery performance loss**: Large delta between plugged-in and on-battery scores
- **Efficient performers**: Low TDP + good scores (high performance-per-watt)
- **Silent runners**: Good performance with low fan noise (<38 dB)

## Data Sources

1. `data/model-benchmarks.ts` — Per-model thermals, fan noise, battery performance
2. `data/cpu-benchmarks.ts` — CPU TDP profiles (typicalTdpAvg, typicalTdpMax)
3. `data/laptops.ts` — Model specs (processor TDP, battery Whr, weight)

## Analysis Steps

### 1. Load and cross-reference data

For each model with benchmark data:

- Match model → CPU → TDP data
- Combine thermals + fan noise + battery performance into a thermal profile

### 2. Classify thermal behavior

| Classification | Criteria                                  |
| -------------- | ----------------------------------------- |
| Cool & Quiet   | keyboard <40°C AND fan <38 dB             |
| Warm but Quiet | keyboard 40-44°C AND fan <38 dB           |
| Hot & Loud     | keyboard >44°C AND fan >45 dB             |
| Throttle Risk  | keyboard >44°C AND batteryPerf delta >10% |

### 3. Battery performance analysis

For models with `batteryPerformance` data:

- Calculate percentage loss: `(pluggedIn - onBattery) / pluggedIn * 100`
- Flag models with >15% loss as "significant battery throttling"
- Flag models with <=0% loss as "no battery throttling" (notable positive)

### 4. Efficiency analysis

For models with both TDP and benchmark scores:

- Calculate performance-per-watt ratio
- Rank within lineup (ThinkPad vs IdeaPad Pro vs Legion separately)
- Identify outliers (top 3 most efficient, bottom 3 least efficient)

## Output Format

```markdown
## Sustained Performance Report

### Thermal Profiles

| Model | Keyboard °C | Fan dB | TDP W | Classification |
| ----- | ----------- | ------ | ----- | -------------- |

### Battery Performance

| Model | Plugged In | On Battery | Loss % | Rating |
| ----- | ---------- | ---------- | ------ | ------ |

### Efficiency Rankings

| Model | CPU Score | TDP (avg) | Score/Watt | Rank |
| ----- | --------- | --------- | ---------- | ---- |

### Flags

- Models at throttle risk: ...
- Models with excellent efficiency: ...
- Models with significant battery throttling: ...
```

## When to Use

- After bulk benchmark updates to spot anomalies
- When comparing models across lineups for thermal/noise characteristics
- To validate that community-estimated thermal data is plausible
- Before editorial updates to ensure thermal commentary matches data
