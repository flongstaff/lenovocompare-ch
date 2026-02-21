---
name: gpu-update
description: Add or update GPU entries across benchmarks, hardware guide, and model gpuOptions
disable-model-invocation: true
---

# GPU Update

Add a new GPU or update existing GPU data across all three data files that reference GPUs.

## Arguments

- GPU name (required): Exact GPU name string, e.g. "Intel Arc 140V" or "NVIDIA RTX 4000 Ada"

## Steps

### 1. Check Current State

Read all three GPU data files to identify what exists and what's missing:

- `data/gpu-benchmarks.ts` — score, gamingTier, fpsEstimates
- `data/hardware-guide.ts` — gpuGuide section (summary, strengths, weaknesses, bestFor, avoidIf, thermalNotes, generationContext, alternatives, architecture)
- `data/laptops.ts` — which models reference this GPU in `gpu` or `gpuOptions`

### 2. Add/Update GPU Benchmark

If missing from `data/gpu-benchmarks.ts`:

1. Research public 3DMark / gaming benchmark aggregates for the GPU.
2. Determine score (0-100 scale) and gamingTier using this reference:

| Tier   | Score Range | Examples                                           |
| ------ | ----------- | -------------------------------------------------- |
| None   | 0-10        | Intel UHD 620                                      |
| Light  | 11-34       | Intel Iris Xe, AMD Radeon 660M, Intel Arc 130V     |
| Medium | 35-52       | AMD Radeon 780M, NVIDIA RTX 500 Ada, NVIDIA T550   |
| Heavy  | 53-100      | NVIDIA RTX 2000 Ada, RTX 4060 Laptop, RTX 5000 Ada |

3. Add 6 FPS estimates for standard game titles:
   - CS2, Valorant, Minecraft, League of Legends, Civilization VI, Stardew Valley
   - Use resolution/settings appropriate for the tier
   - Reference existing entries in the same tier for consistency

### 3. Add/Update Hardware Guide Entry

If missing from `data/hardware-guide.ts` gpuGuide:

Add entry with all required fields:

```typescript
"GPU Name": {
  summary: "1-2 sentence overview",
  strengths: ["4 items"],
  weaknesses: ["4 items"],
  bestFor: ["4 items"],
  avoidIf: ["4 items"],
  thermalNotes: "Thermal behavior description",
  generationContext: "Architecture generation and positioning",
  alternatives: [
    { name: "Alt GPU", comparison: "How it compares" },
  ],
  architecture: "Architecture name",
},
```

### 4. Add gpuOptions to Relevant Models

Check `data/laptops.ts` for models that should offer this GPU as an option:

- **Integrated GPUs**: Add to models whose processorOptions include CPUs from the same family. Use the CPU-to-GPU mapping:
  - Lunar Lake Ultra 7 (268V/258V/256V) → Arc 140V
  - Lunar Lake Ultra 5 (238V/236V/228V/226V) → Arc 130V
  - Arrow Lake H (265H/255H) → Arc 140T
  - Arrow Lake H (235H/225H) / Arrow Lake U (all) → Arc 130T
  - Meteor Lake (all) → Arc Graphics
  - 12th/13th Gen Intel → Iris Xe
  - AMD Ryzen 7 PRO 8840U/HS → Radeon 780M
  - AMD Ryzen 5 PRO 8540U → Radeon 740M
  - AMD Ryzen 7 PRO 7840U / 7840HS → Radeon 780M
  - AMD Ryzen 5 PRO 7535U / 7535HS / 7530U → Radeon 660M
  - AMD Ryzen 7 PRO 6850U → Radeon 680M

- **Discrete GPUs**: Add to P-series models that offer multiple discrete GPU tiers, and as option on models that also offer integrated-only configs.

Format for gpuOptions entries:

```typescript
// Integrated
{ name: "Intel Arc 140V", integrated: true }
// Discrete
{ name: "NVIDIA RTX 2000 Ada", vram: 8, integrated: false }
```

### 5. Verify

Run `npm run build` to confirm no type errors.

## Output

```
## GPU Update Report

### GPU: [name]
- Benchmark: [added/updated/already exists] — score: [n], tier: [tier]
- Hardware Guide: [added/updated/already exists]
- Models referencing as base GPU: [list]
- Models referencing in gpuOptions: [list]
- Models that should add gpuOptions: [list of IDs or "none"]

### Build: [PASS/FAIL]
```
