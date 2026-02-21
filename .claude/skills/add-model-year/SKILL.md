---
name: add-model-year
description: Add a batch of new Lenovo laptop models for a given year across all lineups
disable-model-invocation: true
---

# Add Model Year

Add all new laptop models for a given release year across all three lineups: **ThinkPad**, **IdeaPad Pro**, and **Legion**.

## Arguments

- Year (e.g., `2026`)
- Lineup (optional): `"ThinkPad"` | `"IdeaPad Pro"` | `"Legion"` — if omitted, research all three

## Workflow

1. **Research new models**: Use web search to find models announced for the given year. Check:
   - Lenovo PSREF (`psref.lenovo.com`) for product listings
   - Lenovo press releases for announcement details
   - **ThinkPad**: X1 Carbon, X1 Yoga/2-in-1, X1 Nano, T14, T14s, T16, P1, P14s, P16s, L14, L16, E14, E16, X13
   - **IdeaPad Pro**: Pro 5, Pro 5i, Pro 7
   - **Legion**: 5, 5i, 7, 7i, Pro, Slim

2. **Check existing models**: Read `data/laptops.ts` to see which models for that year already exist.

3. **For each new model, add ALL required data** (use `/add-laptop` skill as reference):

   ### a. CPU Benchmarks (`data/cpu-benchmarks.ts`)

   If new CPU, add single-core, multi-core, composite scores. Also add CPUs for all `processorOptions`.

   ### b. GPU Benchmarks (`data/gpu-benchmarks.ts`)

   If new GPU, add score, gaming tier, FPS estimates. Also add GPUs for all `gpuOptions`.

   ### c. Laptop Model (`data/laptops.ts`)

   Add full model entry with `lineup`, `series`, `psrefUrl` (required), and all spec fields.

   ### d. Linux Compatibility (`data/linux-compat.ts`)

   Add entry with certifiedDistros, recommendedKernel, driverNotes, fedoraNotes.

   ### e. Model Editorial (`data/model-editorial.ts`)

   Add curated editorial with editorialNotes, knownIssues (if any), swissMarketNotes, linuxNotes.

   ### f. Seed Prices (`data/seed-prices.ts`)

   Add 2-3 prices per model. ID format: `"sp-{N}"` — check last ID first. Include `priceType` and `note`.

   ### g. Price Baselines (`data/price-baselines.ts`)

   Add MSRP, typicalRetail, historicalLow, historicalLowDate, historicalLowRetailer.

   ### h. Hardware Guide (`data/hardware-guide.ts`)

   For NEW CPUs/GPUs, add cpuGuide/gpuGuide entries. Use `/hardware-update` skill.

   ### i. Model Benchmarks (`data/model-benchmarks.ts`) — Optional

   If NotebookCheck reviews exist, add chassis benchmark data. Use `/add-benchmark` skill.

4. **Verify**:
   ```bash
   npm run validate    # Data integrity
   npm run build       # Full build
   ```
   Then run `/data-verify --sync` for cross-reference completeness.

## Series Mapping

| Lineup      | Model Pattern                                       | Series     |
| ----------- | --------------------------------------------------- | ---------- |
| ThinkPad    | X1 Carbon, X1 Yoga, X1 2-in-1, X1 Nano, X1 Titanium | `"X1"`     |
| ThinkPad    | T14, T14s, T16, T480, X13, X13 Yoga                 | `"T"`      |
| ThinkPad    | P1, P14s, P16s, P16                                 | `"P"`      |
| ThinkPad    | L14, L16, L13 Yoga, L13 2-in-1                      | `"L"`      |
| ThinkPad    | E14, E16                                            | `"E"`      |
| IdeaPad Pro | IdeaPad Pro 5 (AMD)                                 | `"Pro 5"`  |
| IdeaPad Pro | IdeaPad Pro 5i (Intel)                              | `"Pro 5i"` |
| IdeaPad Pro | IdeaPad Pro 7                                       | `"Pro 7"`  |
| Legion      | Legion 5                                            | `"5"`      |
| Legion      | Legion 5i                                           | `"5i"`     |
| Legion      | Legion 7                                            | `"7"`      |
| Legion      | Legion 7i                                           | `"7i"`     |
| Legion      | Legion Pro                                          | `"Pro"`    |
| Legion      | Legion Slim                                         | `"Slim"`   |

## ID Convention

- ThinkPad: `{model}-gen{N}-{platform}` (e.g., `t14-gen6-intel`, `t14s-gen6-amd`)
- IdeaPad Pro: `ideapad-pro-{model}-{year}` (e.g., `ideapad-pro-5i-16-2025`)
- Legion: `legion-{model}-gen{N}` or `legion-{model}-{year}` (e.g., `legion-7i-gen9`)
- Platform suffix required for Intel/AMD variants; omit for single platform

## Checklist Per Model

Every model MUST have entries in all 7 required files:

| #   | File                       | Required              |
| --- | -------------------------- | --------------------- |
| 1   | `data/cpu-benchmarks.ts`   | Yes (if new CPU)      |
| 2   | `data/gpu-benchmarks.ts`   | Yes (if new GPU)      |
| 3   | `data/laptops.ts`          | Yes                   |
| 4   | `data/linux-compat.ts`     | Yes                   |
| 5   | `data/model-editorial.ts`  | Yes                   |
| 6   | `data/seed-prices.ts`      | Yes (2-3 prices)      |
| 7   | `data/price-baselines.ts`  | Yes                   |
| 8   | `data/hardware-guide.ts`   | Yes (if new hardware) |
| 9   | `data/model-benchmarks.ts` | Optional              |
