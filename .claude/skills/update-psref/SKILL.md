---
name: update-psref
description: Run the full PSREF scrape → fix URLs → merge pipeline for all or specific models
disable-model-invocation: true
---

# Update PSREF

Run the automated PSREF scraping pipeline to extract processor, display, RAM, storage, and GPU options from Lenovo's PSREF pages.

## Arguments

- `--id <model-id>` — Scrape a single model (e.g., `x1-carbon-gen12`)
- `--lineup <lineup>` — Scrape one lineup (`ThinkPad`, `IdeaPad Pro`, `Legion`)
- `--missing-only` — Only models without existing option arrays
- No arguments — full scrape of all non-withdrawn models

## Pipeline

### Step 1: Scrape PSREF pages

```bash
npx tsx scripts/scrape-psref.ts [args]
```

This uses Playwright to:

- Build product listing lookup tables (with `?MT=` URLs)
- Navigate to each model's PSREF Specifications tab
- Extract structured data (processors, displays, RAM, storage, GPUs)
- Output results to `scripts/psref-data.json`

Key flags:

- `--no-discovery` — Skip search fallback (faster, uses listing lookup only)
- `--no-listing` — Skip listing page scrape (use stored URLs only)
- `--headful` — Show browser window for debugging
- `--resume` — Continue from existing psref-data.json

### Step 2: Fix URLs (if discovery found new ones)

```bash
npx tsx scripts/fix-psref-urls.ts          # Dry run
npx tsx scripts/fix-psref-urls.ts --apply  # Patch laptops.ts
```

### Step 3: Merge scraped data into laptops.ts

```bash
npx tsx scripts/merge-psref.ts --dry-run   # Preview
npx tsx scripts/merge-psref.ts             # Apply
```

Only adds option arrays (processorOptions, displayOptions, etc.) when:

- Model doesn't already have that option array
- Scraped data has >1 entry for that category
- CPUs/GPUs exist in the benchmarks database

### Step 4: Verify

```bash
npm test && npm run build
```

## Architecture

- `scripts/scrape-psref.ts` — Main scraper with Playwright, URL normalization, listing lookup (4 strategies), search discovery fallback, withdrawn skip list
- `scripts/fix-psref-urls.ts` — Patches `psrefUrl` values in laptops.ts from discovered URLs
- `scripts/merge-psref.ts` — Inserts option arrays into model blocks in laptops.ts
- `scripts/psref-name-map.ts` — CPU/GPU name normalization (PSREF names → benchmark keys)
- `scripts/psref-data.json` — Scrape output (gitignored)

## Known Limitations

- ~20 models are withdrawn from PSREF (maintained in `WITHDRAWN_IDS` set)
- Some newer models (Gen 13, Gen 10) may timeout or redirect — PSREF SPA rendering issues
- IdeaPad Pro Gen 10 models are listed as "IdeaPad Slim" on PSREF (correct match)
- Legion screen sizes may differ between marketing names and PSREF listings
