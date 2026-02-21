---
name: model-checklist
description: Check a single model's completeness across all 9 data files
---

# Model Checklist

Verify that a single laptop model has complete entries across all 9 data files. Use after `/add-laptop` or when debugging a specific model.

## Arguments

`/model-checklist {model-id}` — e.g., `/model-checklist t14s-gen6-amd`

## Checks

For the given model ID, verify:

| #   | File                       | Check                                                        | Required |
| --- | -------------------------- | ------------------------------------------------------------ | -------- |
| 1   | `data/laptops.ts`          | Model exists with valid `id`, `lineup`, `series`, `psrefUrl` | Yes      |
| 2   | `data/cpu-benchmarks.ts`   | `processor.name` has entry in `cpuBenchmarksExpanded`        | Yes      |
| 3   | `data/cpu-benchmarks.ts`   | Each `processorOptions[].name` has entry (if present)        | Yes      |
| 4   | `data/gpu-benchmarks.ts`   | `gpu.name` has entry in `gpuBenchmarks`                      | Yes      |
| 5   | `data/gpu-benchmarks.ts`   | Each `gpuOptions[].name` has entry (if present)              | Yes      |
| 6   | `data/linux-compat.ts`     | Model ID has entry in `linuxCompat`                          | Yes      |
| 7   | `data/model-editorial.ts`  | Model ID has entry in `modelEditorial`                       | Yes      |
| 8   | `data/seed-prices.ts`      | At least 1 seed price with matching `laptopId`               | Yes      |
| 9   | `data/price-baselines.ts`  | Model ID has entry in `priceBaselines`                       | Yes      |
| 10  | `data/hardware-guide.ts`   | `processor.name` has entry in `cpuGuide`                     | Yes      |
| 11  | `data/hardware-guide.ts`   | `gpu.name` has entry in `gpuGuide`                           | Yes      |
| 12  | `data/hardware-guide.ts`   | Each `processorOptions[].name` has entry in `cpuGuide`       | Yes      |
| 13  | `data/hardware-guide.ts`   | Each `gpuOptions[].name` has entry in `gpuGuide`             | Yes      |
| 14  | `data/model-benchmarks.ts` | Model ID has entry (optional — coverage tracked)             | No       |

## Additional Checks

- `psrefUrl` starts with `https://psref.lenovo.com/`
- `lineup` and `series` are a valid combination
- If `processorOptions` span different CPU families (e.g., Intel + AMD), verify `gpuOptions` is also set
- Seed price `priceType` values are valid
- Price baseline ordering: `msrp > typicalRetail > historicalLow`

## Output

```
Model Checklist: ThinkPad T14s Gen 6 (AMD) [t14s-gen6-amd]
============================================================

 1. ✅ laptops.ts          — Found (ThinkPad / T series / 2025)
 2. ✅ cpu-benchmarks.ts   — AMD Ryzen 7 PRO 8840HS (score: 72)
 3. ✅ cpu-benchmarks.ts   — processorOptions: AMD Ryzen 5 PRO 8640HS (score: 61)
 4. ✅ gpu-benchmarks.ts   — AMD Radeon 780M (score: 18)
 5. — gpu-benchmarks.ts   — No gpuOptions (not required)
 6. ✅ linux-compat.ts     — 3 certified distros, 6 driver notes
 7. ✅ model-editorial.ts  — Editorial present (editorialNotes, linuxNotes)
 8. ✅ seed-prices.ts      — 3 prices (retail: 2, sale: 1)
 9. ✅ price-baselines.ts  — MSRP: 1749 > Typical: 1549 > Low: 1299 ✅
10. ✅ hardware-guide.ts   — CPU guide: AMD Ryzen 7 PRO 8840HS
11. ✅ hardware-guide.ts   — GPU guide: AMD Radeon 780M
12. ✅ hardware-guide.ts   — CPU guide (option): AMD Ryzen 5 PRO 8640HS
13. — hardware-guide.ts   — No gpuOptions to check
14. ⚠️ model-benchmarks.ts — No entry (optional)

Result: 12/13 required ✅, 1 optional missing
Status: COMPLETE ✅
```

## Workflow

1. Read `data/laptops.ts` and find the model by ID
2. If not found, list similar IDs and exit
3. Extract CPU/GPU names including all options
4. Cross-reference each file in order
5. Print the checklist report
