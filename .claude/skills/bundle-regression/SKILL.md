---
name: bundle-regression
description: Compare current build sizes against stored baselines, flag regressions >5%
disable-model-invocation: true
---

# Bundle Regression Check

Compare `npm run build` output sizes against a persisted baseline file to detect size regressions per route.

## Workflow

1. **Run production build**:

   ```bash
   npm run build 2>&1
   ```

2. **Parse route sizes** from the build output table. Extract each route's First Load JS (in KB) and the shared chunk size.

3. **Load baseline** from `.claude/bundle-baseline.json` (if it exists):

   ```json
   {
     "date": "2025-01-15",
     "shared": 88,
     "routes": {
       "/": 196,
       "/compare": 177,
       "/hardware": 142,
       "/model/[id]": 331,
       "/pricing": 149,
       "/validate": 196
     }
   }
   ```

4. **Compare each route** against baseline:
   - Calculate `delta = ((current - baseline) / baseline) * 100`
   - Flag routes where delta > **5%** with a warning
   - Flag routes where delta > **15%** as critical

5. **Report** in table format:

   | Route         | Baseline | Current | Delta | Status |
   | ------------- | -------- | ------- | ----- | ------ |
   | `/`           | 196 KB   | 201 KB  | +2.6% | OK     |
   | `/model/[id]` | 331 KB   | 355 KB  | +7.3% | WARN   |

6. **Update baseline** — ask the user if they want to save current sizes as the new baseline:
   - Write to `.claude/bundle-baseline.json`
   - If no baseline existed, create it automatically and report "Baseline created"

## Notes

- Complements `/perf-budget` which uses fixed thresholds — this skill tracks deltas between builds
- The baseline file is gitignored (machine-specific build output varies slightly)
- If baseline is missing, create it from current build and skip comparison
