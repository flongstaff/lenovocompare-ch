# GPU Data Reviewer

Cross-reference all GPU data files to find missing entries, inconsistencies, and unreferenced GPUs.

## Instructions

### 1. Load All GPU Data

Read these files:

- `data/gpu-benchmarks.ts` — all GPU benchmark entries (name, score, gamingTier, fpsEstimates)
- `data/hardware-guide.ts` — gpuGuide section (all hardware guide GPU entries)
- `data/laptops.ts` — all models' `gpu` field and `gpuOptions` arrays

### 2. Cross-Reference Checks

#### A. Benchmark Coverage

For every unique GPU name found in `laptops.ts` (both `gpu.name` and `gpuOptions[].name`):

- Verify it exists in `gpu-benchmarks.ts`
- Flag any missing benchmark entries

#### B. Hardware Guide Coverage

For every GPU in `gpu-benchmarks.ts`:

- Verify it exists in `hardware-guide.ts` gpuGuide
- Flag any benchmark entries without a hardware guide entry

#### C. gpuOptions Completeness

For each model in `laptops.ts`:

- Check if the model has `processorOptions` that map to different iGPUs (using CPU-GPU family mapping)
- If yes, verify the model has `gpuOptions` containing those alternative iGPUs
- Flag models missing expected gpuOptions

CPU-to-GPU family mapping:

- Lunar Lake Ultra 7 → Arc 140V; Ultra 5 → Arc 130V
- Arrow Lake H (Ultra 7) → Arc 140T; Arrow Lake H (Ultra 5) / Arrow Lake U → Arc 130T
- Meteor Lake → Arc Graphics
- 12th/13th Gen Intel → Iris Xe
- 8th Gen Intel → UHD 620
- AMD Ryzen 7 PRO 8840U/HS → Radeon 780M; Ryzen 5 PRO 8540U → Radeon 740M
- AMD Ryzen 7 PRO 7840U / 7840HS → Radeon 780M; Ryzen 5 PRO 7535U/7535HS/7530U → Radeon 660M
- AMD Ryzen 7 PRO 6850U → Radeon 680M

#### D. FPS Estimate Sanity

For each GPU in benchmarks:

- Verify FPS estimates are consistent with the GPU's score (higher score = higher FPS)
- Flag any FPS value that seems out of range for the gamingTier
- Check all 6 standard titles are present: CS2, Valorant, Minecraft, League of Legends, Civilization VI, Stardew Valley

#### E. Orphaned Entries

- Flag any GPU in benchmarks that isn't referenced by any model (not necessarily wrong, but worth noting)
- Flag any GPU in hardware guide that isn't in benchmarks

## Output Format

```
## GPU Data Integrity Report

### Benchmark Coverage
- Total unique GPUs in models: [count]
- GPUs with benchmark entries: [count]
- MISSING benchmarks: [list with model IDs that use them]

### Hardware Guide Coverage
- Total GPUs in benchmarks: [count]
- GPUs with guide entries: [count]
- MISSING guide entries: [list]

### gpuOptions Completeness
- Models with multi-GPU processor families: [count]
- Models with correct gpuOptions: [count]
- MISSING gpuOptions: [list with expected GPUs]

### FPS Estimate Issues
- [GPU]: [issue description]

### Orphaned Entries
- Benchmark-only (no model reference): [list]
- Guide-only (no benchmark): [list]

### Summary
- Total issues: [count]
- Critical (missing data): [count]
- Warnings (orphaned/sanity): [count]
```
