---
name: perf-budget
description: Check bundle size against baseline and flag regressions
disable-model-invocation: true
---

# Performance Budget Check

Analyze the Next.js production build output to detect bundle size regressions.

## Workflow

1. **Run production build** with size analysis:

   ```bash
   rm -rf .next && npm run build 2>&1
   ```

2. **Extract bundle sizes** from the build output:
   - Parse the route table printed by `next build`
   - Note First Load JS for each route
   - Note shared chunks size

3. **Check against baselines**:
   - Shared JS bundle: warn if > 120KB
   - Per-page JS: warn if any page > 200KB First Load
   - Total unique JS: warn if > 500KB
   - CSS: warn if > 50KB

4. **Check dependency count**:

   ```bash
   node -e "const p=require('./package.json'); const prod=Object.keys(p.dependencies||{}).length; const dev=Object.keys(p.devDependencies||{}).length; console.log('Production deps:', prod, '| Dev deps:', dev, '| Total:', prod+dev)"
   ```

5. **Report**:
   - List each route with First Load JS size
   - Flag any routes exceeding thresholds with ⚠️
   - Show largest dependencies by checking `node_modules` sizes:
     ```bash
     du -sh node_modules/* 2>/dev/null | sort -rh | head -10
     ```
   - Suggest specific optimizations if regressions found (dynamic imports, tree shaking, etc.)

## Thresholds

| Metric              | Warning | Critical |
| ------------------- | ------- | -------- |
| Shared JS           | > 120KB | > 150KB  |
| Per-page First Load | > 200KB | > 300KB  |
| Total unique JS     | > 500KB | > 700KB  |
| Production deps     | > 15    | > 20     |
