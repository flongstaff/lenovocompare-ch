# Bundle Analyzer & Guardian

Analyze Next.js build output to identify bundle size regressions. Fail if thresholds are exceeded.

## Purpose

Review the production build output and identify:

- Routes with unexpectedly large First Load JS
- Shared chunks that have grown beyond baseline
- Dynamic imports that may have regressed to static imports
- Opportunities for code splitting or lazy loading

## Thresholds (Hard Fail)

Any route exceeding these triggers a FAIL:

| Route         | Max First Load JS |
| ------------- | ----------------- |
| `/`           | 220 kB            |
| `/compare`    | 200 kB            |
| `/deals`      | 140 kB            |
| `/model/[id]` | 350 kB            |
| `/pricing`    | 170 kB            |
| `/hardware`   | 160 kB            |
| Shared JS     | 100 kB            |

## Baselines (Updated 2026-02-27, 124 models)

| Route         | First Load JS | Route Size |
| ------------- | ------------- | ---------- |
| `/`           | 205 kB        | 12.6 kB    |
| `/compare`    | 184 kB        | 11.5 kB    |
| `/deals`      | 124 kB        | 10.8 kB    |
| `/model/[id]` | 338 kB        | 129 kB     |
| `/pricing`    | 154 kB        | 10.7 kB    |
| `/hardware`   | 143 kB        | 4.58 kB    |
| Shared JS     | 87.9 kB       | —          |

## Workflow

1. Run `npm run build` and capture the full output
2. Parse the route table to extract sizes for each route
3. Compare against baselines — flag any route exceeding its baseline by more than 5 kB
4. Check against hard thresholds — FAIL if any route exceeds its max
5. Check that recharts components are dynamically imported (not statically bundled):
   - Search for `dynamic(() => import(` patterns in page files
   - Verify PerformanceRadar, CpuCompareChart, GpuCompareChart, PortabilityCompareChart, BenchmarkBar, FpsChart are all dynamically imported where used
6. Check for accidentally large dependencies:
   - Look for new imports in components that may pull in heavy libraries
   - Verify framer-motion is tree-shaken (only import specific components)
7. Report findings as a table:

```
Bundle Guardian Report
======================
Route          Baseline  Current  Delta   Threshold  Status
/              205 kB    ??? kB   +? kB   220 kB     ✅/❌
/compare       184 kB    ??? kB   +? kB   200 kB     ✅/❌
/deals         124 kB    ??? kB   +? kB   140 kB     ✅/❌
/model/[id]    338 kB    ??? kB   +? kB   350 kB     ✅/❌
/pricing       154 kB    ??? kB   +? kB   170 kB     ✅/❌
/hardware      143 kB    ??? kB   +? kB   160 kB     ✅/❌
Shared JS      87.9 kB   ??? kB   +? kB   100 kB     ✅/❌

Result: PASS / FAIL
```

## Recommendations

If regressions are found, suggest:

- Moving heavy components behind `dynamic()` imports
- Splitting large data files into per-route chunks
- Using `next/dynamic` with `{ ssr: false }` for client-only chart components
- Checking if new dependencies have lighter alternatives
