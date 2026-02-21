# Cross-Lineup Comparator

Audit the compare page and related UI components for correct handling of cross-lineup score ranges. Scoring is absolute (not per-lineup normalized), meaning Legion dGPUs score 55-92 while ThinkPad iGPUs score 8-40. This is intentional but can cause UX issues when models from different lineups are compared side by side.

## What to Check

### 1. Bar Chart Scaling

- Open `components/charts/BenchmarkBar.tsx`, `CpuCompareChart.tsx`, `GpuCompareChart.tsx`
- Verify bar charts use 0-100 domain (not auto-scaled to data range)
- Auto-scaling would make a ThinkPad iGPU score of 12 look similar to a Legion dGPU score of 85
- Check that `barSize` adapts to model count (should shrink for 3-4 models)

### 2. Radar Chart Overlap

- Open `components/charts/PerformanceRadar.tsx`
- When comparing a Legion (high GPU, low portability) vs ThinkPad (low GPU, high portability), the radar shapes should be visibly different
- Check that axis domains are 0-100 and not auto-scaled

### 3. Compare Table Score Bars

- Open `components/compare/CompareTable.tsx` and `MobileCompareCards.tsx`
- ScoreBar components should show the actual score difference visually
- A ThinkPad GPU score of 12 should look small next to a Legion GPU score of 85

### 4. Value Score Cross-Lineup

- In `lib/scoring.ts`, check if value score calculation accounts for lineup expectations
- A Legion with a high GPU score and higher price may have similar value to a ThinkPad with lower specs and lower price
- The value score should not penalize Legions for being more expensive if the performance justifies it

### 5. Card Grid Mixed Lineups

- On the home page, when all lineups are shown, verify sorting by GPU score doesn't create a misleading ranking
- ThinkPads will always be at the bottom of GPU sort — this is expected

### 6. FPS Chart Cross-Lineup

- `components/charts/FpsChart.tsx` — if a ThinkPad (no dGPU) is compared with a Legion, the ThinkPad should show minimal/no gaming capability rather than being omitted

## Output

Provide a summary of findings:

- **OK**: Areas where cross-lineup comparison works correctly
- **Issue**: Areas where the UX is misleading or confusing
- **Suggestion**: Specific code changes to improve cross-lineup comparison handling
