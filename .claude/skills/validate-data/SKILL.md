---
name: validate-data
description: Run the data validation CLI and browse the /validate dashboard
disable-model-invocation: true
---

# Validate Data Integrity

Run the automated validation engine against all data files.

## Steps

### 1. Run CLI validation

```bash
npm run validate
```

This checks:

- Duplicate laptop IDs
- Missing CPU/GPU benchmarks (models would show score 0)
- Invalid lineup/series combos
- Impossible specs (weight/battery/display/cores/ram/storage <= 0)
- Price baseline inversions (MSRP < retail or retail < historical low)
- Orphan seed prices, price baselines, linux-compat, and editorial entries
- Duplicate seed price IDs
- Missing coverage (linux-compat, editorial, seed prices, price baselines)
- Missing hardware guide entries for referenced CPUs/GPUs
- Unused benchmark entries
- Spec range outliers (weight > 4kg, battery > 100Whr, nits < 200)

Exit codes: 0 = passed, 1 = validation errors found, 2 = validator crashed

### 2. Check the dashboard

Open `http://localhost:3000/validate` in the browser (use Playwright MCP if available) to verify the visual dashboard renders correctly with:

- Summary strip: Errors (red), Warnings (yellow), Stats (green)
- Collapsible category groups with model ID links
- Pass/fail banner at bottom

### 3. Interpret results

**Errors** (exit 1, block build): Data issues that cause incorrect scores or broken UI. Must fix before shipping.

**Warnings** (don't block build): Missing coverage, unused benchmarks, spec outliers. Should fix but not urgent.

**Stats/Info**: Model counts, benchmark counts, coverage percentages.

### 4. If errors found

Fix the underlying data files, then re-run `npm run validate` to confirm. The build command (`npm run build`) also runs validation as a gate — it will not proceed to Next.js build if errors exist.
