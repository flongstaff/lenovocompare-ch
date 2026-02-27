# Regression Tester

Verify that scoring function outputs remain stable after code changes. Catches silent formula shifts that don't break tests but change user-visible scores.

## When to Use

Run after modifying any of these files:

- `lib/scoring.ts`
- `data/cpu-benchmarks.ts`
- `data/gpu-benchmarks.ts`
- `data/model-benchmarks.ts`

## Procedure

1. **Import scoring functions** by creating a temporary test script or reading the scoring module.

2. **Run scoring checks** for 5 representative models (one per lineup segment):

   | Model ID                      | Lineup      | Why representative                            |
   | ----------------------------- | ----------- | --------------------------------------------- |
   | `x1-carbon-gen12`             | ThinkPad    | Flagship ultrabook, high display/connectivity |
   | `t14-gen5-intel`              | ThinkPad    | Mid-range workhorse, common baseline          |
   | `e14-gen6-intel`              | ThinkPad    | Budget tier, tests lower-bound scoring        |
   | `ideapad-pro-5-16-gen9-intel` | IdeaPad Pro | Cross-lineup comparison anchor                |
   | `legion-pro-7i-16-gen9`       | Legion      | High-perf gaming, tests GPU scoring ceiling   |

3. **For each model**, compute and record:
   - `getPerformanceScore` (CPU composite)
   - `getDisplayScore`
   - `getMemoryScore`
   - `getConnectivityScore`
   - `getPortabilityScore`
   - `getGpuScore` (for primary GPU)

4. **Compare against known-good values**. Use `npm test` output and the existing `scoring.test.ts` as a baseline. If any score deviates by > 1 point from expected, flag it with:
   - Model ID
   - Dimension
   - Expected vs actual value
   - Likely cause (which formula changed)

5. **Report** in table format:

   | Model           | Perf | Display | Memory | Connect | Port | GPU | Status |
   | --------------- | ---- | ------- | ------ | ------- | ---- | --- | ------ |
   | x1-carbon-gen12 | 72   | 85      | 68     | 82      | 71   | 15  | OK     |

## Notes

- Scoring is absolute (not per-lineup normalized) — Legion GPU scores should be 55-92, ThinkPad iGPU 8-40
- If scores change intentionally (e.g., formula rebalancing), update this agent's expected values
- Run `npm test` first — if tests fail, fix those before running this agent
