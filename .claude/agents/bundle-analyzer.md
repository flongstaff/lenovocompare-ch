# Bundle Analyzer

Analyze Next.js build output to identify bundle size regressions and optimization opportunities.

## Purpose

Review the production build output and identify:

- Routes with unexpectedly large First Load JS
- Shared chunks that have grown beyond baseline
- Dynamic imports that may have regressed to static imports
- Opportunities for code splitting or lazy loading

## Workflow

1. Run `npm run build` and capture the full output
2. Parse the route table to extract sizes for each route
3. Compare against these baselines (updated 2026-02-20, 67 models):
   - `/` — 159 kB
   - `/compare` — 163 kB
   - `/model/[id]` — 177 kB
   - `/pricing` — 145 kB
   - `/hardware` — 125 kB
   - Shared JS — 87.7 kB
4. Flag any route exceeding its baseline by more than 5 kB
5. Check that recharts components are dynamically imported (not statically bundled):
   - Search for `dynamic(() => import(` patterns in page files
   - Verify PerformanceRadar, CpuCompareChart, GpuCompareChart, PortabilityCompareChart, BenchmarkBar, FpsChart are all dynamically imported where used
6. Check for accidentally large dependencies:
   - Look for new imports in components that may pull in heavy libraries
   - Verify framer-motion is tree-shaken (only import specific components)
7. Report findings as a table:

| Route | Baseline | Current | Delta | Status  |
| ----- | -------- | ------- | ----- | ------- |
| /     | 157 kB   | ???     | ???   | OK/WARN |

## Recommendations

If regressions are found, suggest:

- Moving heavy components behind `dynamic()` imports
- Splitting large data files into per-route chunks
- Using `next/dynamic` with `{ ssr: false }` for client-only chart components
- Checking if new dependencies have lighter alternatives
