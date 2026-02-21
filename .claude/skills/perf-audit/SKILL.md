---
name: perf-audit
description: Run Lighthouse performance audit against localhost:3000
user-invocable: true
---

# Performance Audit

Run a Lighthouse performance audit against the dev server to check for regressions in bundle size, LCP, CLS, and other Web Vitals.

## Prerequisites

- Dev server must be running on `localhost:3000` (auto-started by SessionStart hook)
- Uses Playwright MCP for browser automation

## Workflow

1. **Verify dev server** is running: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000`
2. **Run build analysis** first for bundle size baseline:
   ```bash
   npm run build 2>&1 | grep -E '(Route|First Load|├|└|┌)'
   ```
3. **Use Playwright MCP** to navigate to each key route and capture performance metrics:
   - `/` — Home page (48 cards, heaviest client JS)
   - `/compare?ids=t14s-gen6-amd,t14-gen5-intel` — Compare page (charts)
   - `/model/t14s-gen6-amd` — Model detail (most complex page)
   - `/pricing` — Pricing page
   - `/hardware` — Hardware guide
4. **For each route**, use Playwright to:
   - Navigate to the page
   - Take a screenshot
   - Evaluate `performance.getEntriesByType('navigation')` for timing data
   - Check for layout shifts via `PerformanceObserver` entries
   - Report First Load JS size from build output
5. **Output a summary table** with:
   - Route, First Load JS (from build), Navigation timing, Screenshot

## Thresholds

Flag warnings if:

- Any route's First Load JS exceeds **185 kB** (current max is ~177 kB)
- Total shared JS exceeds **100 kB** (currently ~88 kB)
- Any dynamically imported chart component is accidentally bundled statically

## Bundle Size Regression Check

Compare current build output against these baselines (update after intentional changes):

- `/` — 159 kB First Load JS
- `/compare` — 163 kB First Load JS
- `/model/[id]` — 177 kB First Load JS
- `/pricing` — 145 kB First Load JS
- `/hardware` — 125 kB First Load JS
- Shared JS — 87.7 kB

Last updated: 2026-02-20 (67 models, 59 CPUs, 19 GPUs)

Report any route that increased by more than **5 kB** from baseline.
