---
name: add-laptop
description: Add a new laptop model (ThinkPad, IdeaPad Pro, or Legion) with all required data across every data file
---

# Add Laptop to Registry

Add a new laptop model with entries in ALL required data files. Covers all three lineups: **ThinkPad**, **IdeaPad Pro**, and **Legion**. Every step is mandatory unless marked optional.

## Pre-flight

Before starting, gather:

- Model name (e.g. "ThinkPad T14s Gen 6 AMD", "IdeaPad Pro 5i 16", "Legion 7i Gen 9")
- Lineup: `"ThinkPad"` | `"IdeaPad Pro"` | `"Legion"`
- PSREF URL — look up at `https://psref.lenovo.com` and verify it loads

## Workflow

### Step 1: PSREF Lookup & Specs

Use web search or fetch to find the PSREF page. Extract all specs from there — do not guess.

PSREF URL patterns by lineup:

- **ThinkPad**: `https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_{Model}_{MachineType}`
- **IdeaPad Pro**: `https://psref.lenovo.com/Product/IdeaPad/Lenovo_IdeaPad_Pro_{Model}_{MachineType}`
- **Legion**: `https://psref.lenovo.com/Product/Legion/Lenovo_Legion_{Model}_{MachineType}`

Rules: Spaces → underscores, no Intel/AMD suffix in URL.

**Verify the PSREF URL loads** before proceeding. If it 404s, search PSREF for the correct URL.

### Step 2: CPU Benchmarks (`data/cpu-benchmarks.ts`)

If the processor isn't already in `cpuBenchmarksExpanded`:

1. Add single-core, multi-core, and composite scores (0-100 scale)
2. Use web search for Geekbench/Cinebench scores to calibrate against existing CPUs
3. This MUST be done before adding the model (other files depend on CPU names)

Also add entries for ALL CPUs in `processorOptions` if the model has multiple CPU configs.

### Step 3: GPU Benchmarks (`data/gpu-benchmarks.ts`)

If the GPU isn't already in `gpuBenchmarks`:

1. Add score, gaming tier, and FPS estimates
2. Use `/add-gpu` skill for detailed workflow

Also add entries for ALL GPUs in `gpuOptions` if the model has multiple GPU configs.

### Step 4: Laptop Model (`data/laptops.ts`)

Read the file to match format. Add entry with ALL fields:

- `id`: kebab-case (e.g. `t14s-gen6-amd`, `ideapad-pro-5i-16-2025`, `legion-7i-gen9`). Use platform suffix for dual-platform models
- `name`: Full name (e.g. `"ThinkPad T14s Gen 6 AMD"`)
- `lineup`: `"ThinkPad"` | `"IdeaPad Pro"` | `"Legion"`
- `series`: See series mapping below
- `year`, `processor`, `ram`, `display`, `gpu`, `storage`, `battery`, `weight`, `ports`, `wireless`, `os`
- `psrefUrl`: **REQUIRED** — verified PSREF link
- `linuxStatus`: Check Ubuntu certification list, default `"community"` if unsure
- `keyboard`: `{ backlit: true, layout: "standard", trackpoint: true }` (ThinkPad) or `{ backlit: true, layout: "standard", trackpoint: false }` (IdeaPad Pro / Legion)

**Optional multi-config fields** (add when the model has multiple hardware options):

- `processorOptions`: Array of alternative CPUs — each must exist in `cpu-benchmarks.ts`
- `gpuOptions`: Array of alternative GPUs — each must exist in `gpu-benchmarks.ts`. Required when `processorOptions` span CPU families with different integrated GPUs (see CPU-to-GPU mapping in `/gpu-update` skill)

**Note**: `laptops.ts` array ends with `] as const;` — use `Read` on last 5 lines to find insertion point.

### Step 5: Linux Compatibility (`data/linux-compat.ts`)

Add an entry keyed by model ID with:

- `status`: matches `linuxStatus` on the model
- `certifiedDistros`: array of certified distro strings (check Ubuntu/Red Hat cert lists)
- `recommendedKernel`: minimum kernel version for full hardware support
- `driverNotes`: any known driver issues or required firmware
- `fedoraNotes`: Fedora-specific compatibility notes

### Step 6: Model Editorial (`data/model-editorial.ts`)

Add a curated editorial entry keyed by model ID with:

- `summary`: 2-3 sentence overview of the model's positioning
- `verdict`: one-line recommendation
- `bestFor`: array of ideal use cases
- `avoidIf`: array of scenarios where this isn't the right choice

### Step 7: Seed Prices (`data/seed-prices.ts`)

Add 2-3 price entries covering different retailers:

- `id`: sequential `"sp-{N}"` — check last ID first
- `laptopId`: matches model ID
- `retailer`: from RETAILERS in `lib/constants.ts` (Digitec, Brack, etc.)
- `price`: realistic CHF price (web search Swiss retailers)
- `priceType`: `"msrp"` | `"retail"` | `"sale"` | `"used"`
- `note`: optional context (e.g. "Black Friday 2024")
- `dateAdded`: today's ISO date
- `isUserAdded`: `false`

### Step 8: Price Baselines (`data/price-baselines.ts`)

Add entry keyed by model ID with:

- `msrp`: Lenovo MSRP in CHF
- `typicalRetail`: typical Swiss street price
- `historicalLow`: lowest known Swiss price (or estimate ~70-75% of MSRP)
- `historicalLowDate`: ISO date of lowest price
- `historicalLowRetailer`: retailer name

### Step 9: Hardware Guide (`data/hardware-guide.ts`)

For any NEW CPUs or GPUs added in steps 2-3, add hardware guide entries:

- CPU entry in `cpuGuide`: summary, strengths, weaknesses, bestFor, avoidIf, thermalNotes, generationContext, alternatives, architecture
- GPU entry in `gpuGuide`: same structure
- Use `/hardware-update` skill for detailed workflow

### Step 10: Model Benchmarks (`data/model-benchmarks.ts`) — Optional

If a NotebookCheck review exists for this model, add chassis-level benchmark data:

- Use `/add-benchmark` skill for detailed workflow
- Skip if no review data is available yet

### Step 11: Verify

Run all checks:

```bash
npm run validate           # Data validation
npm run build              # Full build (includes validation gate)
```

Then run `/data-verify --sync` to verify cross-reference completeness.

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

## Checklist

Before marking complete, verify ALL files have entries:

| File                       | Entry Key                              | Required                    |
| -------------------------- | -------------------------------------- | --------------------------- |
| `data/cpu-benchmarks.ts`   | CPU name (+ all processorOptions CPUs) | Yes (if new CPU)            |
| `data/gpu-benchmarks.ts`   | GPU name (+ all gpuOptions GPUs)       | Yes (if new GPU)            |
| `data/laptops.ts`          | model ID                               | Yes                         |
| `data/linux-compat.ts`     | model ID                               | Yes                         |
| `data/model-editorial.ts`  | model ID                               | Yes                         |
| `data/seed-prices.ts`      | model ID                               | Yes (2-3 prices)            |
| `data/price-baselines.ts`  | model ID                               | Yes                         |
| `data/hardware-guide.ts`   | CPU/GPU name                           | Yes (if new hardware)       |
| `data/model-benchmarks.ts` | model ID                               | Optional (if review exists) |

**Every model must have entries in ALL 7 required per-model data files.** No exceptions.
