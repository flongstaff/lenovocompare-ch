---
name: data-migration
description: Batch transform data files when adding/changing fields on laptop models
user-invocable: true
---

# Data Migration

Batch-transform data files when schema changes require updating all laptop models (98+ across ThinkPad, IdeaPad Pro, and Legion) or related data files.

## When to Use

- Adding a new optional field to the `Laptop` interface in `lib/types.ts`
- Renaming or restructuring an existing field across all models
- Adding a new data file that needs entries for every model
- Backfilling data across all models (e.g., adding `psrefUrl` to every entry)

## Workflow

### 1. Understand the Change

Ask the user:

- What field is being added/changed?
- What type is it? (string, number, enum, nested object)
- Is it optional or required?
- What's the default value for existing models?
- Does it need data from an external source (PSREF, benchmarks)?

### 2. Update the Type

Edit `lib/types.ts` to add the new field. **Always make new fields optional** (`?`) unless updating all 98+ models with real values.

### 3. Batch Update Data Files

The primary data files that may need updating:

| File                       | Records             | Keyed By        |
| -------------------------- | ------------------- | --------------- |
| `data/laptops.ts`          | 98+ models          | `id`            |
| `data/cpu-benchmarks.ts`   | 80+ CPUs            | CPU name string |
| `data/gpu-benchmarks.ts`   | 28+ GPUs            | GPU name string |
| `data/linux-compat.ts`     | 98+ models          | `laptopId`      |
| `data/model-editorial.ts`  | 98+ models          | `laptopId`      |
| `data/hardware-guide.ts`   | 80+ CPUs + 28+ GPUs | hardware name   |
| `data/seed-prices.ts`      | ~205 prices         | `laptopId`      |
| `data/price-baselines.ts`  | 98+ models          | model ID        |
| `data/model-benchmarks.ts` | varies              | model ID        |

### 4. Apply Transformation

For each model in the target file:

1. Read the current entry
2. Compute or set the new field value
3. Edit the entry in-place

Use a systematic approach — process models alphabetically or by array index to avoid missing any.

### 5. Verify

After all edits:

```bash
npx tsc --noEmit  # Type check
npm run build     # Full build verification
```

## Cross-Reference Checklist

When adding a field that references data from another file, verify consistency:

- CPU names in `laptops.ts` must match keys in `cpu-benchmarks.ts`
- GPU names in `laptops.ts` must match keys in `gpu-benchmarks.ts`
- Model IDs in `linux-compat.ts`, `model-editorial.ts`, `seed-prices.ts`, and `price-baselines.ts` must match IDs in `laptops.ts`

## Safety

- Always run `npm run build` after completing the migration
- If adding a required field, update ALL models before building
- If the migration is too large for one session, make the field optional first, backfill incrementally
