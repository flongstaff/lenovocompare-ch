# AGENTS.md

This file provides guidance to agentic coding systems when working with code in this repository.

## Project Overview

LenovoCompare CH is a local-first Swiss-market Lenovo laptop comparison tool built with Next.js 14 (App Router). Covers four lineups: **ThinkPad**, **IdeaPad Pro**, **Legion**, and **Yoga** (124 models, 2018–2025). Dark IBM Carbon-inspired aesthetic. All data is hardcoded from public PSREF specs; pricing is user-contributed via localStorage.

## Build/Lint/Test Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build — run after major logic changes
npm run lint     # ESLint
npm test         # Vitest unit tests (formatters, scoring, data integrity)
npm run validate # Data integrity validation (all 9 data files)
npx prettier --check .  # Check formatting (auto-runs via hook on edits)
```

**Running a single test:** `npm test -- <test-file-name>` (e.g., `npm test -- formatters.test.ts`)
**Watch mode:** `npm run test:watch`

**After deleting/moving files:** `rm -rf .next` before rebuilding — stale cache causes 500 errors
**If \_document errors persist:** also `rm -rf node_modules/.cache`

## Code Style Guidelines

### TypeScript/TypeScript

- Use `strict` mode, ESNext modules, path alias `@/*` maps to project root
- Prefer `readonly` for constants and type literals (`as const`)
- Avoid `any`; prefer `unknown` for truly dynamic types
- Function params accepting arrays of constants must use `readonly T[]` if the array uses `as const`
- Optional chaining in conditions: `x?.length > 0` fails TypeScript — use `(x?.length ?? 0) > 0`
- Guard empty arrays before `Math.min(...[])` or `Math.max(...[])` (returns `Infinity`/`-Infinity`)

### React Patterns

- Functional components with arrow functions
- PascalCase for components, camelCase for functions/vars
- Pages use server/client split: `page.tsx` exports metadata, renders `*Client.tsx` component
- Error boundary wraps main content in layout
- `useSearchParams()` requires a `<Suspense>` boundary wrapping the component
- `useMemo`/`useCallback` must be called before early returns — wrap in null-safe lambdas
- Named export dynamic imports: `dynamic(() => import('...').then(m => ({ default: m.NamedExport })), { ssr: false })`

### Imports & Exports

- Use `import type` for type-only imports (linter auto-converts when values aren't used at runtime)
- Types used in function return annotations may get stripped if function body isn't present yet
- Handle name collisions: `lucide-react` `Keyboard` icon shadows `Keyboard` type from `lib/types.ts` — use `as KeyboardIcon` alias
- Components use default exports (LaptopCard, Header, CompareTable) or named exports (Footer uses named export)

### Error Handling

- Be careful with `useEffect` dependency arrays — including state that's set inside the effect creates loops
- Use `useRef` guards for effects that should only run once (e.g., auto-navigation on mount)
- Validate regex literals: `/(20\d{2})/` not `/(20\\d{2})/` (double backslash matches literal backslash)
- Always wrap async calls in try/catch with descriptive logs

### Formatting (Prettier)

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 120,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Scoring & Data

- Scores are 0–100, double-clamped with `Math.max(0, Math.min(max, ...))`
- All score functions must cap at 100 — uncapped scores break compare delta calculations
- `getValueScore` and `getPriceDiscount` guard `msrp === 0` to avoid NaN from division by zero
- Scoring is absolute (not per-lineup normalized) — Legion dGPUs naturally score 55–92, ThinkPad iGPUs 8–40

### Storage & State

- All user data stored in localStorage via `useLocalStorage` hook (keys: `lenovocompare-*`)
- `useCompare` uses `sessionStorage` (not `localStorage`) — compare selections persist during navigation/refresh within a tab but clear on new tab/session
- Cross-page shared React state: `useState` in a hook called from different page components creates independent instances. Use `sessionStorage` with lazy initializer or a context provider in layout for state that must persist across navigation
- Hook tests using `sessionStorage` or `localStorage` need `beforeEach(() => { sessionStorage.clear(); localStorage.clear(); })` — state leaks between test cases via storage initializers

### URL & Params

- URL param parsers that build result objects: only assign non-null values — assigning `null` creates keys that inflate `Object.keys().length` and trigger false-positive state updates

## Architecture

- **`app/`** — Next.js App Router pages: home (grid), `/model/[id]` (detail), `/compare` (side-by-side), `/pricing` (manage prices), `/hardware` (CPU/GPU guide), `/deals` (market dashboard)
- **`lib/types.ts`** — Core interfaces: `Laptop`, `Lineup`, `SwissPrice`, `FilterState`, `CompareState`, `Series`, `LinuxStatus`, `GamingTier`, `ModelBenchmarks`, `BenchmarkSource`
- **`lib/hooks/`** — Custom hooks: `useLaptops`, `usePrices`, `useFilters`, `useCompare`, `useLocalStorage`, `useToast`
- **`lib/scoring.ts`** — CPU/GPU/display/memory/connectivity/portability scores + `getPerformanceDimensions` + `getModelBenchmarks`
- **`lib/analysis.ts`** — Auto-generated pros/cons, use cases, upgrade paths, use-case scenario verdicts, gaming tier
- **`data/`** — Hardcoded data files: `laptops.ts`, `cpu-benchmarks.ts`, `gpu-benchmarks.ts`, `model-benchmarks.ts`, `linux-compat.ts`, `model-editorial.ts`, `hardware-guide.ts`, `seed-prices.ts`, `price-baselines.ts`

## Key Patterns

- **Lineups**: `"ThinkPad" | "IdeaPad Pro" | "Legion" | "Yoga"` — each model has a `lineup` field
- **Series values**: ThinkPad (X1/T/P/L/E), IdeaPad Pro (Pro 5/Pro 5i/Pro 7), Legion (5/5i/7/7i/Pro/Slim), Yoga (Yoga 6/7/9/Slim/Book)
- Convertible series: X1 Yoga/Titanium/2-in-1 → `"X1"`, X13 Yoga → `"T"`, L13 Yoga/2-in-1 → `"L"`
- Model IDs use platform suffixes: `t14-gen5-intel`, `t14s-gen5-amd` — omit suffix only for single-platform models
- PSREF URL pattern: ThinkPad uses `Product/ThinkPad/Lenovo_ThinkPad_{Model}_{MachineType}`. IdeaPad/Legion: no `Lenovo_` prefix, drop "i" from slug for Gen 9+
- Data uses `as const` assertions — use `readonly` arrays in function signatures
- Swiss pricing uses CHF with `de-CH` locale formatting (manual formatting avoids hydration errors)
- CSS uses IBM Carbon Design System classes (`.carbon-card`, `.carbon-btn`, `.carbon-input`)

## Testing Patterns

- Vitest for unit tests: `tests/formatters.test.ts`, `tests/scoring.test.ts`, `tests/data-integrity.test.ts`
- Test structure: `describe()` + `it()` + `expect()`
- Mock helper functions: `makeLaptop()` or `makeDisplay()` with partial overrides
- Validate constraints: scores 0–100, no duplicate IDs, all benchmarks present, thermal plausibility

## Gotchas

- `lucide-react` icon `size` prop type is `string | number`, not just `number`
- recharts components must be in `"use client"` files — they fail during SSR/prerendering without it
- recharts `RadarChart` with long axis labels overflows container — use `outerRadius="60%"` with generous `margin`
- ScoreBar `color` prop must be a raw hex value (e.g., `"#0f62fe"`), NOT a CSS variable
- `npm start` (standalone mode) doesn't serve CSS properly — use `npm run dev` for visual testing
- PostToolUse hooks auto-modify files on save — always re-read files before writing if time has passed
- PostToolUse ESLint hook strips "unused" imports immediately — if adding imports + code that uses them, do it in a single Edit
- `laptops.ts` array ends with `] as const;` (not `];`) — use `Read` on last 5 lines to find insertion point for new models
- `.mcp.json` is gitignored (machine-specific) — MCP server config won't transfer via git clone

## Dependencies

- Next.js 14, React 18, TypeScript 5
- Tailwind CSS 3 (Carbon dark theme)
- framer-motion (animations)
- recharts (charts — radar, bar, FPS)
- lucide-react (icons)
- Vitest (testing)

## Legal

- No web scraping of retailers
- PSREF specs are public product reference data
- CPU benchmarks from publicly available aggregate data
- All pricing is user-contributed
- Review links are outbound only
- Project follows [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)
