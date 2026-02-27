---
name: compare-specs
description: Side-by-side spec and score comparison of 2-4 laptop models in the terminal
disable-model-invocation: true
---

# Compare Specs

Quick terminal-based side-by-side comparison of 2-4 laptop models with specs and scores.

## Usage

```
/compare-specs t14-gen5-intel x1-carbon-gen12
/compare-specs legion-pro-7i-16-gen9 legion-5i-16-gen9 ideapad-pro-5-16-gen9-intel
```

## Workflow

1. **Validate model IDs**: Read `data/laptops.ts` and confirm each ID exists. If any ID is invalid, list similar IDs and ask the user to clarify.

2. **Load data** for each model from:
   - `data/laptops.ts` — core specs
   - `data/cpu-benchmarks.ts` — CPU scores
   - `data/gpu-benchmarks.ts` — GPU scores
   - `data/price-baselines.ts` — pricing
   - `data/model-benchmarks.ts` — thermals, battery, noise

3. **Compute scores** using functions from `lib/scoring.ts`:
   - `getPerformanceScore`
   - `getDisplayScore`
   - `getMemoryScore`
   - `getConnectivityScore`
   - `getPortabilityScore`
   - `getGpuScore`

4. **Output comparison table**:

```markdown
## Spec Comparison

|               | Model A           | Model B            |
| ------------- | ----------------- | ------------------ |
| **Lineup**    | ThinkPad          | ThinkPad           |
| **Series**    | T                 | X1                 |
| **Display**   | 14" 1920x1200 IPS | 14" 2880x1800 OLED |
| **Processor** | i7-1355U          | Ultra 7 155H       |
| **RAM**       | 16 GB DDR5        | 32 GB LPDDR5x      |
| **Storage**   | 512 GB NVMe       | 1 TB NVMe          |
| **GPU**       | Iris Xe           | Intel Arc          |
| **Weight**    | 1.41 kg           | 1.24 kg            |
| **Battery**   | 52.5 Wh           | 57 Wh              |
| **MSRP**      | CHF X             | CHF X              |
|               |                   |                    |
| **Scores**    |                   |                    |
| Performance   | 55                | 72                 |
| Display       | 48                | 85                 |
| Memory        | 60                | 75                 |
| Connectivity  | 70                | 82                 |
| Portability   | 68                | 78                 |
| GPU           | 12                | 22                 |
```

5. **Add insights** below the table:
   - Which model wins each score category (bold the winner)
   - Best value (score-per-CHF if prices available)
   - Key tradeoffs in 1-2 sentences

## Notes

- Maximum 4 models (matches `MAX_COMPARE` constant)
- Scoring is absolute (not per-lineup normalized)
- Use `formatCHF` from `lib/formatters.ts` for price formatting
- Do NOT fetch external data — use only local data files
