---
name: deploy-check
description: Run full build, lint, and visual verification before deployment
disable-model-invocation: true
---

# Deploy Check

Run a comprehensive pre-deployment verification of LenovoCompare CH.

## Workflow

Execute these checks in order. Stop and report if any step fails.

### Step 1: TypeScript Compilation

```bash
npx tsc --noEmit
```

- Must pass with zero errors
- Report any type errors with file paths and line numbers

### Step 2: ESLint

```bash
npm run lint
```

- Must pass with zero errors
- Warnings are acceptable but should be noted

### Step 3: Prettier Format Check

```bash
npx prettier --check "app/**/*.tsx" "components/**/*.tsx" "lib/**/*.ts" "data/**/*.ts"
```

- Report any unformatted files
- Offer to auto-fix with `npx prettier --write`

### Step 4: Production Build

```bash
rm -rf .next && npm run build
```

- Must compile successfully
- Report page sizes and flag any page over 200 kB First Load JS
- Verify all expected routes are present:
  - `/` (home)
  - `/compare`
  - `/pricing`
  - `/model/[id]`

### Step 5: Data Integrity

```bash
npm run validate
```

- Runs the full validation engine against all 9 data files
- Checks: duplicate IDs, missing benchmarks, invalid lineup/series, impossible specs, price inversions, orphans, coverage gaps
- Must pass with zero errors (warnings are acceptable)
- If validation is not available, manually check: all models have entries in linux-compat.ts, model-editorial.ts, seed-prices.ts, price-baselines.ts; all CPUs/GPUs (including processorOptions/gpuOptions) have benchmark entries

### Step 6: Visual Check (optional — requires Playwright MCP)

If Playwright MCP is available:

- Start dev server: `npm run dev &`
- Screenshot `/` at 1440px and 375px widths
- Verify dark theme renders, no white flashes
- Stop dev server

## Output

```
## Deploy Check Report

### TypeScript: ✅/❌
[details]

### ESLint: ✅/❌
[details]

### Prettier: ✅/❌
[details]

### Build: ✅/❌
- Routes: [list with sizes]
- Shared JS: [size]

### Data Integrity: ✅/❌
- Models: [count] valid
- Prices: [count] valid, [count] orphaned
- Benchmarks: [count] covered, [count] missing

### Visual: ✅/❌/⏭️ (skipped)
[details]

---
**Ready to deploy: YES/NO**
```
