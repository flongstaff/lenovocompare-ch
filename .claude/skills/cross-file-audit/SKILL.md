---
name: cross-file-audit
description: Verify every laptop model has complete entries across all 9 data files — flags gaps and orphans
---

# Cross-File Audit

Audit all 9 data files in the LenovoCompare CH registry to ensure every laptop model has complete coverage. Flags missing entries and orphaned data.

## Steps

### 1. Extract All Model IDs

Read `data/laptops.ts` and collect every model's:
- `id` (the `laptopId` used as key in support files)
- `processor.name` (CPU name string)
- `gpu.name` (GPU name string)
- `processorOptions[].name` (if present — additional CPU names to verify)
- `gpuOptions[].name` (if present — additional GPU names to verify)

### 2. Verify Coverage Across All 9 Files

For each model ID, confirm an entry exists in every supporting file:

| File | Key Type | What to Check |
|------|----------|---------------|
| `data/laptops.ts` | base entry | Model exists (always true by definition) |
| `data/cpu-benchmarks.ts` | CPU name string | `model.processor.name` has a benchmark entry; also check all `processorOptions` |
| `data/gpu-benchmarks.ts` | GPU name string | `model.gpu.name` has a benchmark entry; also check all `gpuOptions` |
| `data/model-benchmarks.ts` | laptopId | Entry keyed by model ID exists |
| `data/linux-compat.ts` | laptopId | Entry keyed by model ID exists |
| `data/model-editorial.ts` | laptopId | Entry keyed by model ID exists |
| `data/seed-prices.ts` | laptopId field | At least one price entry has `laptopId` matching this model |
| `data/price-baselines.ts` | laptopId | Entry keyed by model ID exists |
| `data/hardware-guide.ts` | CPU architecture | CPU architecture/family has a hardware guide entry |

### 3. Check for Orphaned Entries

Scan each support file for entries that reference a `laptopId` or hardware name not present in `data/laptops.ts`:
- Model benchmark keys not matching any laptop ID
- Linux compat keys not matching any laptop ID
- Editorial keys not matching any laptop ID
- Seed prices referencing nonexistent laptop IDs
- Price baseline keys not matching any laptop ID
- CPU benchmark entries for CPUs not used by any model
- GPU benchmark entries for GPUs not used by any model

### 4. Output Coverage Matrix

Print a table showing per-model completeness:

```
| Model ID | CPU | GPU | Benchmarks | Linux | Editorial | Prices | Baselines | Hardware |
|----------|-----|-----|------------|-------|-----------|--------|-----------|----------|
| x1-carbon-gen12 | ok | ok | ok | ok | ok | ok | ok | ok |
| t14-gen5-intel | ok | ok | MISSING | ok | ok | ok | ok | ok |
```

### 5. Flag Gaps

List every model below 100% coverage with:
- The model ID
- Which file(s) are missing entries
- The specific key that should be added (e.g., CPU name, laptop ID)

### 6. Summary

Print totals:
- Total models checked
- Models at 100% coverage
- Models with gaps (count + list)
- Orphaned entries found (count + list)

## Notes

- `processorOptions` and `gpuOptions` are optional arrays — not all models have them
- CPU benchmarks use the exact CPU name string (e.g., `"Intel Core Ultra 7 155H"`)
- GPU benchmarks use the exact GPU name string (e.g., `"Intel Arc Graphics"`)
- Hardware guide entries are keyed by CPU/GPU architecture name, not per-model
- Seed prices are an array — filter by `laptopId` field, not object key
- Run `npm run validate` after fixing any gaps to confirm data integrity
