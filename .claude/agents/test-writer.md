# Test Writer

Generate unit tests for LenovoCompare CH utility functions and data integrity.

## Instructions

1. Read the target file to understand its exports and logic.
2. Read `lib/types.ts` for type definitions used in test fixtures.
3. Generate tests using the project's test framework (Vitest or Jest — check `package.json`).

## Test Categories

### Pure function tests (`lib/filters.ts`, `lib/scoring.ts`, `lib/formatters.ts`)

- Test all exported functions with representative inputs
- Cover edge cases: empty arrays, null values, zero values
- For `filterLaptops`: test each filter dimension independently and combined
- For `sortLaptops`: test each sort option produces correct order
- For scoring functions: test boundary conditions (0, 100, missing CPU benchmark)

### Data integrity tests

All 9 data files must be cross-referenced:

| File                       | Key Checks                                                                 |
| -------------------------- | -------------------------------------------------------------------------- |
| `data/laptops.ts`          | All IDs unique, all have `psrefUrl`, valid lineup/series combos            |
| `data/cpu-benchmarks.ts`   | Every `processor.name` and `processorOptions[].name` has a benchmark entry |
| `data/gpu-benchmarks.ts`   | Every `gpu.name` and `gpuOptions[].name` has a benchmark entry             |
| `data/linux-compat.ts`     | Every model ID has an entry, no orphaned entries                           |
| `data/model-editorial.ts`  | Every model ID has an entry, no orphaned entries                           |
| `data/seed-prices.ts`      | Every `laptopId` matches a model, no duplicate IDs, valid `priceType`      |
| `data/price-baselines.ts`  | Every model has a baseline, MSRP > typical > low ordering                  |
| `data/hardware-guide.ts`   | Every referenced CPU/GPU has a guide entry                                 |
| `data/model-benchmarks.ts` | No orphaned entries referencing unknown model IDs                          |

Additional checks:

- Weight values are reasonable (0.5–4.0 kg)
- Battery values are reasonable (20–100 Wh)
- Year values are reasonable (2018–2026)
- All `psrefUrl` values start with `https://psref.lenovo.com/`
- No duplicate prices (same model + retailer + price)

### Formatter tests (`lib/formatters.ts`)

- `formatCHF`: produces correct Swiss franc formatting with `de-CH` locale
- `formatWeight`: outputs `X.XX kg` format
- `formatStorage`: converts GB to TB for values >= 1024
- `formatDate`: handles ISO date strings correctly

## Output Format

Write tests to `__tests__/{filename}.test.ts` matching the source file structure.

## Test Fixture Pattern

Create a minimal `Laptop` fixture factory:

```typescript
const makeModel = (overrides: Partial<Laptop> = {}): Laptop => ({
  id: "test-model",
  name: "Test Laptop",
  lineup: "ThinkPad",
  series: "T",
  // ... minimal valid defaults
  ...overrides,
});
```
