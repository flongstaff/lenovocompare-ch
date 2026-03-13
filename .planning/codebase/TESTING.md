# Testing Patterns

**Analysis Date:** 2026-03-13

## Test Framework

**Runner:**

- Vitest 4.0.18
- Config: `vitest.config.ts` with jsdom environment and path alias resolution
- Setup: `vitest.setup.ts` imports testing-library/jest-dom assertions

**Assertion Library:**

- `@testing-library/jest-dom` with Vitest (imported in setup file)
- Standard Vitest assertions via `expect()`

**Run Commands:**

```bash
npm test              # Run all tests once (vitest run)
npm run test:watch   # Watch mode for development
```

**Coverage:**

- Not configured in vitest.config.ts
- No coverage target enforced
- Use `npm test` to verify before build

## Test File Organization

**Location:**

- Co-located with source: `tests/` directory for util tests
- Tests live alongside implementation (e.g., `formatters.test.ts` with `formatters.ts`)
- Current test files: `tests/formatters.test.ts`, `tests/filters.test.ts`, `tests/validators.test.ts`

**Naming:**

- Pattern: `[module-name].test.ts` (e.g., `formatters.test.ts`)
- Follow source module name exactly

**Structure:**

```
tests/
├── formatters.test.ts
├── filters.test.ts
└── validators.test.ts
```

## Test Structure

**Suite Organization:**

```typescript
import { describe, it, expect, vi, afterEach } from "vitest";
import { formatCHF, getPriceAgeBadge } from "@/lib/formatters";

describe("formatCHF", () => {
  it("formats small prices", () => {
    expect(formatCHF(499)).toBe("CHF 499");
  });

  it("formats thousands with apostrophe separator", () => {
    expect(formatCHF(1299)).toBe("CHF 1\u2019299");
  });
});

describe("getPriceAgeBadge", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return Fresh (green) for prices less than 30 days old", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-03-15"));
    const result = getPriceAgeBadge("2025-03-01");
    expect(result.label).toBe("Fresh");
  });
});
```

**Patterns:**

- One `describe` block per exported function (not per file)
- One `it` per assertion focus (single logical check)
- Test names use "should [behavior] when [condition]" or "should [behavior]"
- Use `afterEach` to clean up side effects (timers, mocks, state)

## Mocking

**Framework:**

- Vitest `vi` object for spies, mocks, and timers
- Import: `import { vi } from "vitest"`

**Patterns:**

```typescript
// Fake timers
afterEach(() => {
  vi.useRealTimers();
});

it("should return correct age badge for old prices", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-07-01"));
  const result = getPriceAgeBadge("2025-03-01");
  expect(result.label).toBe("4mo+");
});

// Mock modules (not yet in use)
vi.mock("@/lib/module");
```

**What to Mock:**

- Timers (for date-dependent logic like `getPriceAgeBadge`)
- External API calls (localStorage, fetch via hooks)
- Not yet: don't mock internal functions or modules

**What NOT to Mock:**

- Pure utility functions (formatters, scoring logic)
- Data modules (laptops, cpu-benchmarks)
- Internal business logic

**Current Scope:**

- Tests cover formatters, filters, and validators
- No component/integration tests yet
- No E2E tests (separate: Playwright E2E test suite via `/e2e-check` skill)

## Fixtures and Factories

**Test Data:**

```typescript
// Imported from source (no duplication)
import { laptops } from "@/data/laptops";
import { cpuBenchmarks } from "@/data/cpu-benchmarks";

// Inline test objects for specific test cases
const defaultFilter: FilterState = {
  search: "",
  lineup: [],
  series: [],
  sort: "name-asc",
  minPrice: null,
  maxPrice: null,
  minScreenSize: null,
  maxWeight: null,
  year: null,
  ramMin: null,
};

const emptyPrices: readonly SwissPrice[] = [];

// Mutation for test cases
const prices: SwissPrice[] = [
  {
    id: "test-1",
    laptopId: "x1-carbon-gen12",
    price: 1500,
    retailer: "Digitec",
    dateAdded: "2024-06-01",
    isUserAdded: false,
  },
];
```

**Location:**

- Inline in test files (no separate fixtures directory)
- Default test data (FilterState, empty arrays) at top of test suite
- One-off test objects created near usage point

**Pattern:**

- Import production data directly (laptops, cpu-benchmarks, cpuBenchmarks)
- Create minimal test objects for specific test cases
- No factory functions (simple enough to inline)

## Coverage

**Requirements:**

- No explicit coverage target enforced
- Vitest configured for jsdom environment suitable for unit tests

**View Coverage:**

- No coverage report command yet
- Use `npm test` to run all tests and verify green

**Current Coverage:**

- Formatters (formatCHF, formatWeight, formatDate, formatStorage, shortName, getPriceAgeBadge): full coverage
- Filters (filterLaptops, sortLaptops): full coverage of main sorts and filters
- Validators (validatePrice): boundary testing for min/max CHF price range

## Test Types

**Unit Tests:**

- Scope: Single function with isolated dependencies
- Approach: Import function, call with test data, assert return value
- Examples: `formatCHF(1299)` returns formatted string; `filterLaptops([models], {filter}, [prices])` returns filtered array
- Uses production data imports (laptops, benchmarks) as test fixtures

**Integration Tests:**

- Not yet implemented
- Scope would be: hook + data + business logic together
- Example: useFilters hook integration with URL params and laptops list

**E2E Tests:**

- Separate suite using Playwright (`/e2e-check` skill)
- Not part of `npm test` — separate from unit test suite
- Run via: `npm run e2e` or Playwright CLI

## Common Patterns

**Async Testing:**

```typescript
// Not yet used — most tests are synchronous
// Pattern would be:
it("should fetch and validate prices", async () => {
  const result = await fetchAndValidatePrices();
  expect(result).toBeDefined();
});
```

**Error Testing:**

```typescript
// Validation returns result object (not throw)
it("should reject prices below minimum", () => {
  const result = validatePrice(99);
  expect(result.valid).toBe(false);
  expect(result.warning).toContain("100"); // MIN_PRICE_CHF
});

it("should reject NaN and Infinity", () => {
  expect(validatePrice(NaN).valid).toBe(false);
  expect(validatePrice(Infinity).valid).toBe(false);
});
```

**Boundary Testing:**

```typescript
// Test exact boundary values and just beyond
it("should handle boundary at exactly 30 days", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-03-31"));
  const result = getPriceAgeBadge("2025-03-01");
  expect(result.label).toBe("1mo"); // Boundary: at 30 days
});

it("should handle boundary at exactly 90 days", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-05-30"));
  const result = getPriceAgeBadge("2025-03-01");
  expect(result.label).toBe("3mo"); // Boundary: at 90 days
});

it("should return red for 91+ days", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-05-31"));
  const result = getPriceAgeBadge("2025-03-01");
  expect(result.label).toBe("3mo+"); // Beyond 90 days
});
```

## Test Execution

**Before Commit:**

```bash
npm run lint     # ESLint check
npm test         # Run all unit tests
npm run validate # Data integrity validation
npm run build    # Full production build with next build
```

**Test Data Realism:**

- Use actual laptop models from `data/laptops.ts` (all 124 models available)
- Filter tests slice production data: `[...laptops].slice(0, 10)`
- Benchmark tests use actual CPU/GPU data from `cpu-benchmarks.ts`

**Isolation:**

- Tests are independent (no shared state between suites)
- `afterEach` cleanup prevents timer/mock leakage
- localStorage tests: not yet present (would need `beforeEach(() => { sessionStorage.clear(); localStorage.clear(); })` per gotchas)

## Debugging Tests

**Run Single Test:**

```bash
# Run only one describe block (not standard vitest, edit test file or use:)
npm run test:watch  # Then filter by pattern in watch mode
```

**Watch Mode:**

```bash
npm run test:watch  # Automatic re-run on file changes
```

**Console Logging:**

```typescript
// Add temporary logs for debugging
it("should compute score correctly", () => {
  const score = getDisplayScore(model);
  console.log("Score:", score); // Visible in test output
  expect(score).toBeLessThanOrEqual(100);
});
```

---

_Testing analysis: 2026-03-13_
