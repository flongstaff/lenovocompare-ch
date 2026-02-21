---
name: bulk-benchmark-verify
description: Batch verify community-estimated benchmark entries against NotebookCheck reviews and upgrade to verified data
disable-model-invocation: true
---

# Bulk Benchmark Verify

Batch-verify `sources: ["community"]` entries in `data/model-benchmarks.ts` by searching NotebookCheck for real review data. Upgrades estimates to verified measurements where reviews exist.

## Usage

```
/bulk-benchmark-verify              # Verify all community-estimated models
/bulk-benchmark-verify --lineup ThinkPad  # Only ThinkPad models
/bulk-benchmark-verify --limit 10   # Process first 10 unverified models
/bulk-benchmark-verify --id t14-gen5-intel  # Verify single model
```

## Workflow

### Step 1: Identify Targets

Read `data/model-benchmarks.ts` and collect all entries where `sources` includes `"community"` but not `"notebookcheck"`.

### Step 2: Search for Reviews

For each target model:

1. Search NotebookCheck for the model name (e.g., "ThinkPad T14 Gen 5 Intel review NotebookCheck")
2. If a review exists, extract:
   - **Thermals**: keyboard surface max (°C), underside max (°C)
   - **Fan noise**: idle/load dB(A) — use load value for `fanNoise`
   - **Battery**: WiFi browsing hours → `officeHours`, video playback hours → `videoHours`
   - **SSD**: sequential read/write MB/s
   - **Display**: measured max brightness (nits)
   - **Weight with charger**: if listed (grams)
3. If no review found, skip the model — do not modify community estimates

### Step 3: Update Data

For each model where review data was found:

- Replace community estimates with verified values
- Change `sources: ["community"]` to `sources: ["notebookcheck"]`
- Add `sourceUrls` with the NotebookCheck review URL
- Only update fields where the review provides specific measurements

### Step 4: Report

Print a summary table:

```
Model ID              | Status     | Fields Updated
─────────────────────────────────────────────────
t14-gen5-intel        | Upgraded   | thermals, battery, ssdSpeed, displayBrightness
t14-gen4-intel        | No review  | (skipped)
ideapad-pro-5-16-amd  | Upgraded   | thermals, fanNoise, battery
```

### Step 5: Validate

Run `npm run build` to ensure no type errors were introduced.

## Data Quality Rules

- **Thermals**: Must be specific °C values (not ranges). Keyboard max typically 30-55°C.
- **Fan noise**: Use load dB(A). Typical range: 28-60 dB.
- **Battery**: WiFi test → officeHours, video test → videoHours. Range: 3-25 hours.
- **SSD**: Sequential read/write in MB/s. PCIe 4.0: ~5000-7000, PCIe 5.0: ~10000-14000.
- **Display brightness**: Max measured nits. Typical: 250-600.
- **Weight with charger**: Base weight + charger weight (65W ~300g, 135W ~500g, 230W+ ~900g).

## Important

- Never fabricate data — only use values explicitly stated in reviews
- If a review only has partial data, update only the available fields
- Keep existing community estimates for fields without review data
- Always re-read model-benchmarks.ts before writing (hooks may modify it)
