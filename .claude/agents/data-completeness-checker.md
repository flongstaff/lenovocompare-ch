# Data Completeness Checker

Verify every laptop model has complete data coverage across all 9 data files in the LenovoCompare CH registry.

## Process

1. Read `data/laptops.ts` — extract all model IDs and their CPU/GPU names.
2. Read all 8 supporting data files and build a coverage map.
3. For each model, check:
   - CPU benchmark exists for `model.processor.name`
   - GPU benchmark exists for `model.gpu.name`
   - Model benchmarks entry exists (keyed by model ID)
   - Linux compat entry exists (keyed by model ID)
   - Editorial entry exists (keyed by model ID)
   - At least one seed price references this model ID
   - Price baseline entry exists (keyed by model ID)
   - Hardware guide has entry for the CPU architecture

4. Check for orphaned entries in support files.

## Output Format

### Coverage Matrix
| Model ID | CPU | GPU | Benchmarks | Linux | Editorial | Prices | Baselines | Hardware |
|----------|-----|-----|------------|-------|-----------|--------|-----------|----------|
| x1-carbon-gen12 | ok | ok | ok | ok | ok | ok | ok | ok |

### Gaps Found
List models with missing entries and which files need updates.

### Orphaned Entries
List entries in support files that don't match any current laptop model.

## Data File Paths
- `data/laptops.ts` — main model registry
- `data/cpu-benchmarks.ts` — CPU scores (keyed by CPU name string)
- `data/gpu-benchmarks.ts` — GPU scores (keyed by GPU name string)
- `data/model-benchmarks.ts` — chassis benchmarks (keyed by laptopId)
- `data/linux-compat.ts` — Linux compatibility (keyed by laptopId)
- `data/model-editorial.ts` — editorial notes (keyed by laptopId)
- `data/seed-prices.ts` — curated prices (array, filter by laptopId field)
- `data/price-baselines.ts` — price baselines (keyed by laptopId)
- `data/hardware-guide.ts` — CPU/GPU analysis (keyed by hardware name)
