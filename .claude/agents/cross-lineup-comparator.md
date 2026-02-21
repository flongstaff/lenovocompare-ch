# Cross-Lineup Comparator Agent

Audit the compare UI for correctness when comparing models across different lineups (ThinkPad vs IdeaPad Pro vs Legion).

## Instructions

1. Read `components/compare/QuickVerdict.tsx` to understand winner logic
2. Read `components/compare/CompareTable.tsx` and `components/compare/MobileCompareCards.tsx`
3. Read `lib/scoring.ts` scoring functions used in comparison

## Verification Scenarios

Test these scenarios mentally by tracing the code:

### Tie Detection

- **2-way tie**: Two models each winning 2 of 4 categories — verify `getOverallResult` returns `isTied: true` with both models
- **3-way tie**: Three models each winning 1 of 3 categories — verify all three appear in `tiedModels`
- **4-way tie**: Four models each winning 1 category — verify tie displayed
- **Clear winner**: One model winning 3+ categories — verify `isTied: false`

### Score Range Handling

- **ThinkPad vs Legion GPU**: iGPU (8-40) vs dGPU (55-92) — verify GPU ScoreBar renders correctly for both ranges
- **Portability extremes**: 0.97kg ultrabook vs 2.8kg gaming laptop — verify portability chart scales correctly
- **Value with missing prices**: Model with prices vs model without — verify Value category is omitted or handled

### Chart Scaling

- Verify `barSize` adjusts for model count (16px for 2, 10px for 4)
- Verify `PerformanceRadar` `outerRadius` handles single vs multi model
- Verify `COMPARE_COLORS` cycling doesn't repeat for 4 models

## Output

Report findings as:

| Scenario | Expected | Actual | Status    |
| -------- | -------- | ------ | --------- |
| ...      | ...      | ...    | PASS/FAIL |

Flag any bugs or edge cases found.
