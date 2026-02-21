# Hardware Reviewer

Cross-reference all GPU and CPU hardware data files for missing entries, inconsistencies, and factual accuracy. Combines GPU data integrity checks with hardware guide content review.

## GPU Data Integrity

### 1. Load All GPU Data

- `data/gpu-benchmarks.ts` — all GPU benchmark entries
- `data/hardware-guide.ts` — gpuGuide section
- `data/laptops.ts` — all models' `gpu` and `gpuOptions`

### 2. Cross-Reference

#### A. Benchmark Coverage

For every unique GPU name in `laptops.ts` (both `gpu.name` and `gpuOptions[].name`):

- Verify it exists in `gpu-benchmarks.ts`
- Flag any missing benchmark entries

#### B. Hardware Guide Coverage

For every GPU in `gpu-benchmarks.ts`:

- Verify it exists in `hardware-guide.ts` gpuGuide
- Flag benchmark entries without guide entries

#### C. gpuOptions Completeness

CPU-to-GPU family mapping:

- Lunar Lake Ultra 7 → Arc 140V; Ultra 5 → Arc 130V
- Arrow Lake H (Ultra 7) → Arc 140T; Arrow Lake H (Ultra 5) / Arrow Lake U → Arc 130T
- Meteor Lake → Arc Graphics
- 12th/13th Gen Intel → Iris Xe
- 8th Gen Intel → UHD 620
- AMD Ryzen 7 PRO 8840U/HS → Radeon 780M; Ryzen 5 PRO 8540U → Radeon 740M
- AMD Ryzen 7 PRO 7840U/7840HS → Radeon 780M; Ryzen 5 PRO 7535U/7535HS/7530U → Radeon 660M
- AMD Ryzen 7 PRO 6850U → Radeon 680M

#### D. FPS Estimate Sanity

- FPS consistent with GPU score (higher score = higher FPS)
- All 6 standard titles present: CS2, Valorant, Minecraft, League of Legends, Civilization VI, Stardew Valley

#### E. Orphaned Entries

- GPUs in benchmarks not referenced by any model
- GPUs in hardware guide not in benchmarks

## Hardware Guide Content Review

### 1. Score Consistency

When entries mention performance comparisons (e.g., "~12% slower"), verify against actual scores in `data/cpu-benchmarks.ts` and `data/gpu-benchmarks.ts`.

### 2. Alternative Validity

Confirm all `alternatives[].name` values exist in the benchmark database.

### 3. Architecture Labels

Verify `architecture` strings are consistent across entries of the same chip family.

### 4. Thermal Claims

Cross-reference TDP claims against `processor.tdp` values in `data/laptops.ts`.

### 5. Generation Claims

Verify "replaces X" or "successor to Y" claims are factually correct based on the chip timeline.

## Output Format

```
## Hardware Review Report

### GPU Data Integrity
- Benchmark coverage: X/Y GPUs
- Hardware guide coverage: X/Y GPUs
- gpuOptions completeness: X models needing attention
- FPS estimate issues: [count]
- Orphaned entries: [count]

### Hardware Guide Content
- Score consistency issues: [count]
- Invalid alternatives: [count]
- Architecture label issues: [count]
- TDP claim issues: [count]

### Summary
- Critical (missing data): [count]
- Warnings (content/orphaned): [count]
```

Report issues grouped by severity: **Error** (factually incorrect), **Warning** (outdated/misleading), **Info** (minor style).
