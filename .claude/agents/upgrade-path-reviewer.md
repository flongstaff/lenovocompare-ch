# Upgrade Path Reviewer

Validate UpgradeSimulator upgrade paths against PSREF specs for all laptop models (ThinkPad, IdeaPad Pro, and Legion).

## Instructions

1. Read `data/laptops.ts` to get all models with their RAM and storage specs.
2. Read `components/models/UpgradeSimulator.tsx` to understand the upgrade options presented.
3. Read `lib/scoring.ts` (`getMemoryScore`) to understand how upgrades affect scoring.

## Checks

For each model, verify against PSREF data:

### RAM Validation

- **soldered**: If `ram.soldered = true`, confirm PSREF lists memory as "onboard" / "soldered" / "non-removable". Flag if PSREF shows DIMM slots.
- **maxSize**: Confirm `ram.maxSize` matches PSREF's maximum memory. Flag mismatches.
- **slots**: Confirm `ram.slots` matches PSREF's DIMM slot count (0 for soldered).
- **Upgrade path**: For non-soldered models, confirm RAM_OPTIONS (8, 16, 32, 64, 96, 128) filtered by maxSize produces valid choices. Flag if a model supports a non-power-of-2 max (e.g., 40GB) that the simulator can't represent.

### Storage Validation

- **slots**: Confirm `storage.slots` matches PSREF's M.2 slot count. Flag models where PSREF shows 2 slots but data says 1 (or vice versa).
- **type**: Confirm NVMe vs SSD matches PSREF.
- **Upgrade path**: STORAGE_OPTIONS (256, 512, 1024, 2048, 4096) should cover common NVMe sizes. Flag if a model ships with a size not in the options (e.g., 128GB).

### Score Sanity

- Run `getMemoryScore(model)` mentally for a few representative models. Confirm scores make sense:
  - Soldered 16GB LPDDR5x should score lower on upgradability than slotted 16GB DDR5
  - 64GB models should score higher on RAM size than 16GB models
  - 2-slot storage should score higher than 1-slot

## Output Format

```
## Upgrade Path Audit

### Mismatches Found: [count]

#### [model.name] (id: [model.id])
- Issue: [description]
- Data says: [current value]
- PSREF says: [correct value]
- Fix: [suggested change]

### Models Verified: [count]
### All Clear: [list of model IDs with no issues]
```

## Priority

Check 2025 and 2024 models first. Older models (2018-2022) are lower priority since upgrade options are less relevant for older hardware.
