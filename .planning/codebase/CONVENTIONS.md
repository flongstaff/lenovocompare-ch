# Coding Conventions

**Analysis Date:** 2026-03-13

## Naming Patterns

**Files:**

- Components: PascalCase (e.g., `LaptopCard.tsx`, `FilterBar.tsx`)
- Utilities/hooks: camelCase (e.g., `formatters.ts`, `scoring.ts`, `useFilters.ts`)
- Data files: camelCase (e.g., `cpu-benchmarks.ts`, `model-editorial.ts`)
- Test files: `[name].test.ts` or `[name].test.tsx` (e.g., `formatters.test.ts`)

**Functions:**

- Getter functions: `get[Noun]` (e.g., `getModelScores`, `getDisplayScore`, `getPortabilityScore`, `getPerformanceScore`)
- Selector functions: `[verb][Noun]` (e.g., `getEditorialSnippet`, `isBestValue`, `filterLaptops`)
- Hook functions: `use[Noun]` (e.g., `useFilters`, `usePrices`, `useLocalStorage`, `useCompare`)
- Formatter functions: `format[Noun]` or `get[Noun][Adjective]` (e.g., `formatCHF`, `formatDate`, `getPriceAgeBadge`, `getPriceDiscount`)

**Variables:**

- camelCase for all variables and constants
- `SCREAMING_SNAKE_CASE` only for module-level constants exported from constants file (e.g., `STORAGE_KEYS`, `VALID_LINEUPS`)
- Mutable references use `Ref` suffix (e.g., `hasRunRef`, `targetRef`, `validatorRef`)

**Types:**

- PascalCase for all types and interfaces (e.g., `Laptop`, `FilterState`, `SwissPrice`, `PerformanceDimensions`)
- Use `type` for unions and single-source values (e.g., `type Lineup`, `type SortOption`, `type UseCase`)
- Use `interface` for object shapes (e.g., `interface Processor`, `interface Ram`, `interface FilterState`)
- Readonly fields enforced via `readonly` modifier on interfaces — never mutable interface properties

## Code Style

**Formatting:**

- Prettier (v3.8.1) handles formatting
- Config: `.prettierrc.json` with printWidth 120, singleQuote false, trailingComma "all", tabWidth 2
- Plugin: `prettier-plugin-tailwindcss` for Tailwind class ordering
- All files committed to `.prettierrc.json` — run `npx prettier --check .` to verify

**Linting:**

- ESLint 9 with Next.js core-web-vitals and TypeScript rules via `.eslintrc.json`
- Run `npm run lint` to check
- PostToolUse hooks auto-fix ESLint violations on file save

**TypeScript:**

- Strict mode enabled (`strict: true` in `tsconfig.json`)
- Target: ES2017, moduleResolution: bundler
- Path alias: `@/*` maps to project root

## Import Organization

**Order:**

1. React/Next.js imports (React, hooks, next/\*, useCallback, etc.)
2. Third-party libraries (lucide-react, recharts, framer-motion)
3. Type imports (`import type { ... }` for TypeScript types only)
4. Local lib imports (`@/lib/...`)
5. Local component imports (`@/components/...`)
6. Local data imports (`@/data/...`)
7. Dynamic imports and side-effects last

**Path Aliases:**

- Always use `@/` prefix (not relative paths) for cross-module imports
- Example: `import { Laptop } from "@/lib/types"` not `import { Laptop } from "../../../lib/types"`

**Import Type vs Value:**

- Use `import type { Laptop, FilterState }` when importing only for type annotations
- PostToolUse linter auto-converts `import` to `import type` when values aren't used at runtime
- Never put types and values in the same import line if type is-only

## Error Handling

**Patterns:**

- Try-catch wraps file I/O, localStorage access, JSON parsing, and fetch calls
- Errors logged to console with context prefix (e.g., `[useLocalStorage]`, `[useRemotePrices]`)
- Never throw unhandled errors — catch and log with `console.warn()`
- For price validation: return `{ valid: false, warning: string }` object instead of throwing

**Examples:**

```typescript
// localStorage with try-catch and console.warn
try {
  const item = localStorage.getItem(key);
  const parsed: unknown = JSON.parse(item);
  if (validatorRef.current?.(parsed)) {
    setStoredValue(parsed);
  }
} catch (error) {
  console.warn(`[useLocalStorage] Failed to read "${key}":`, error);
}

// Price validation returning result object
export const validatePrice = (price: number): PriceValidationResult => {
  if (!Number.isFinite(price)) {
    return { valid: false, warning: "Price must be a valid number" };
  }
  return { valid: true };
};

// Fetch with manual error wrapping
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
} catch (err) {
  console.warn("[useRemotePrices] Fetch failed, falling back to seed prices:", err);
}
```

## Logging

**Framework:** console (console.warn for errors/warnings only)

**Patterns:**

- Use `console.warn()` for caught errors and non-critical issues (no error tracking system in place)
- Include context prefix in brackets (e.g., `[useLocalStorage]`, `[useRemotePrices]`, `[useCompare]`)
- Never log sensitive data (prices from URL params, user IDs, raw API responses)
- No structured logging (plain string concatenation is acceptable)

## Comments

**When to Comment:**

- Public module comments: explain PURPOSE and CONSTRAINTS at top of file (e.g., `formatters.ts` explains manual formatting to avoid server/client locale mismatch)
- Non-obvious algorithm comments: clamping formulas, scoring logic, percentage calculations
- Data structure comments: explain what readonly means, why a field is optional
- DO NOT comment obvious code (e.g., `// increment count` for `count++`)

**JSDoc/TSDoc:**

- Not required for functions (type annotations are explicit)
- Used for public module exports to explain purpose/constraints
- Examples: `lib/formatters.ts` documents why manual formatting is needed; `lib/scoring.ts` documents scoring dimensions

**Example:**

```typescript
/**
 * Locale-safe formatters for Swiss market display (CHF, weight, dates, storage).
 *
 * All formatting is manual (no Intl) to avoid server/client locale mismatch
 * that causes Next.js hydration errors. Dates use dd.MM.yyyy (de-CH convention).
 */

/** Format a price in CHF with apostrophe thousands separator (Swiss convention) */
export const formatCHF = (price: number): string => { ... };
```

## Function Design

**Size:**

- Prefer small, focused functions (most are 5-15 lines)
- Extract logic when a function grows beyond ~30 lines
- Examples: `filterLaptops` (50 lines), `formatDate` (5 lines), `getDisplayScore` (10 lines)

**Parameters:**

- Use readonly arrays and readonly object properties to enforce immutability
- Single object params for 3+ parameters (e.g., `FilterState`, `LaptopCardProps`)
- Example: `filterLaptops(models: readonly Laptop[], filters: FilterState, prices: readonly SwissPrice[])`

**Return Values:**

- Return null for "not found" cases (e.g., `getGpuBenchmark` returns `GpuBenchmarkEntry | null`)
- Return result objects for validation (e.g., `validatePrice` returns `{ valid: boolean, warning?: string }`)
- Return computed values for scores (e.g., `getDisplayScore` returns `number`)
- Return objects with label/color for UI metadata (e.g., `getPriceAgeBadge` returns `{ label: string, color: string }`)

**Guard Clauses:**

- Use early returns to avoid nested ifs
- Guard against null/undefined with optional chaining (e.g., `value?.length ?? 0`)
- Never use `value?.length > 0` — TypeScript issue with optional chaining returning `number | undefined` — use `(value?.length ?? 0) > 0`

## Module Design

**Exports:**

- Named exports for utilities and hooks (e.g., `export const formatCHF`, `export const useFilters`)
- Default exports for React components (e.g., `export default LaptopCard`)
- Mix of default and named exports in some modules (e.g., `components/charts/` have both)

**Barrel Files:**

- Not heavily used; import directly from source (e.g., `import { formatCHF } from "@/lib/formatters"` not `from "@/lib"`)
- Component directories have no index.ts — import by component name

**Data Files:**

- Use `as const` assertions on arrays (e.g., `laptops.ts` ends with `] as const;`)
- Keyed objects for lookup tables (e.g., `cpuBenchmarks: Record<string, number>`)
- Never mutable default exports

## React Component Patterns

**Component Definition:**

- Functional components with arrow functions and named default exports
- Props interface named `[Component]Props` (e.g., `LaptopCardProps`)
- All props declared as `readonly` (e.g., `readonly model: Laptop`)

**"use client" Directive:**

- Required for components using hooks, event handlers, browser APIs, or recharts
- Place at top of file before imports (e.g., `LaptopCard.tsx`, `HomeClient.tsx`)

**Hooks Usage:**

- `useMemo` for expensive computations and precomputed scores (e.g., `getModelScores` precomputed in `HomeClient`)
- `useCallback` for event handlers passed to children (e.g., `onToggleCompare` in `LaptopCard`)
- `useRef` for once-only tracking (e.g., `hasRunRef` in `useCounter` to prevent re-animation)
- Never put state from inside effect in deps array — guard with `useRef` for one-time effects
- `useLocalStorage` and `useCompare` use `sessionStorage` (not `localStorage`) for compare state

**Memoization:**

```typescript
// Precompute scores at list level, pass to each card
const precomputedScores = useMemo(
  () => laptops.map(m => getModelScores(m, prices)),
  [laptops, prices]
);

// Pass to LaptopCard to avoid per-card computation
<LaptopCard model={model} precomputedScores={precomputedScores[index]} />
```

**List Rendering:**

- Always provide `key` prop (e.g., `key={model.id}` when rendering `laptops.map(...)`)
- Use `memo()` for expensive card components (e.g., `export default memo(LaptopCard)`)

**Cleanup:**

- Cleanup subscriptions/timers in useEffect return
- Example: `return () => { if (frameId) cancelAnimationFrame(frameId); }`

## Constants & Configuration

**Storage:**

- `lib/constants.ts` holds: localStorage keys, retailer names, color palettes, sort options, max compare count
- Color constants use raw hex values (e.g., `#0f62fe`, not CSS variables)
- **Important:** `color` props in components requiring hex (ScoreBar, charts) fail with CSS variables

**Configuration:**

- Environment: no `.env` in committed codebase (machine-specific)
- Build: Next.js config in `next.config.mjs` (bundle analyzer, redirects)
- TypeScript: `tsconfig.json` with strict mode, path alias `@/*`

## Scoring & Data Validation

**Clamping:**

- Use `Math.max(0, Math.min(max, value))` to clamp scores to [0, max] range
- Never use `Math.min()` alone — allows negative values
- Example: `Math.max(0, Math.min(100, scoreFormula))`

**Guard Divisions:**

- Guard `msrp === 0` before division (e.g., `getPriceDiscount`)
- Return 0 for edge cases: `msrp === 0 ? 0 : ...`

**Readonly Arrays:**

- Use `as const` on array literals and function params typed as `readonly [Type][]`
- Example: `VALID_LINEUPS = ["ThinkPad", "IdeaPad Pro", "Legion", "Yoga"] as const satisfies readonly Lineup[]`

---

_Convention analysis: 2026-03-13_
