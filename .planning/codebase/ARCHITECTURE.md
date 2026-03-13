# Architecture

**Analysis Date:** 2026-03-13

## Pattern Overview

**Overall:** Next.js App Router with layered separation: Data Layer (static TypeScript files), Scoring Engine (computed scores), Analysis Layer (derived insights), UI Layer (React components), and Client hooks for state management.

**Key Characteristics:**

- Next.js 14 App Router with server/client split pattern
- Purely static data (no database) — all laptop specs, pricing, and benchmarks hardcoded as TypeScript constants
- Deterministic scoring engine (no AI/LLM) — computes 6 performance dimensions per model
- Client-side state via `sessionStorage` for compare selection, `localStorage` for user prices
- Dynamic imports for charts to minimize SSR bundle impact
- Color-coded UI: each lineup and series has assigned hex accent color

## Layers

**Data Layer:**

- Purpose: Immutable source of truth for all models, benchmarks, and reference data
- Location: `data/`
- Contains: `laptops.ts` (124 models), `cpu-benchmarks.ts`, `gpu-benchmarks.ts`, `model-benchmarks.ts`, `linux-compat.ts`, `model-editorial.ts`, `hardware-guide.ts`, `seed-prices.ts`, `price-baselines.ts`, `market-insights.ts`
- Depends on: `lib/types.ts` (type definitions)
- Used by: Scoring engine, analysis layer, all components

**Scoring Engine:**

- Purpose: Compute 0–100 scores across 6 dimensions (CPU, GPU, Display, Memory, Connectivity, Portability) + derived scores (value, gaming tier)
- Location: `lib/scoring.ts`
- Contains: `getPerformanceScore()`, `getGpuScore()`, `getDisplayScore()`, `getConnectivityScore()`, `getPortabilityScore()`, `getMemoryScore()`, `getModelScores()`, breakdown functions
- Depends on: `lib/types.ts`, `data/cpu-benchmarks.ts`, `data/gpu-benchmarks.ts`, `data/model-benchmarks.ts`
- Used by: All scoring views, model detail, compare page, home grid

**Analysis Layer:**

- Purpose: Derive auto-generated pros/cons, use-case recommendations, upgrade paths, gaming tier, scenario verdicts from specs and scores
- Location: `lib/analysis.ts`
- Contains: `generateAnalysis()`, `deriveUseCases()`, `getUpgradePath()`, `getScenarioVerdict()`, `getGamingTier()`
- Depends on: `lib/scoring.ts`, `lib/types.ts`, data layer
- Used by: Model detail page analysis cards, filter recommendations

**Type & Constants Layer:**

- Purpose: Core interfaces and app-wide constants
- Location: `lib/types.ts` (interfaces), `lib/constants.ts` (colors, storage keys, retailer list, sort options)
- Depends on: Nothing
- Used by: All layers

**Utility Layers:**

- `lib/filters.ts` — Search, sort, and range filtering for home grid
- `lib/formatters.ts` — CHF currency, weight, date, storage formatting
- `lib/validators.ts` — Input validation for prices and data
- `lib/configUtils.ts` — Laptop configuration simulation (swap CPU/GPU/RAM/display options)
- `lib/retailers.ts` — Swiss retailer search URL builders
- `lib/deals.ts` — Buy signal computation for deals page
- `lib/score-context.ts` — Benchmark percentile context data

**Hooks Layer:**

- Purpose: Encapsulate client-side state and derived data
- Location: `lib/hooks/`
- Contains: `useLaptops()`, `usePrices()`, `useFilters()`, `useCompare()`, `useLocalStorage()`, `useRemotePrices()`, `useToast()`
- Depends on: `lib/types.ts`, data layer, browser storage APIs
- Used by: Client pages and components

**UI Layer:**

- Purpose: React components organized by feature
- Location: `components/`
- Subdivisions: `layout/` (Header, Footer), `charts/` (recharts visualizations), `models/` (model cards, detail sections), `compare/` (comparison table and cards), `pricing/` (price entry, history), `filters/` (filter bar), `ui/` (reusable primitives), `deals/` (deal tracking)
- Depends on: Scoring engine, analysis layer, hooks, types
- Characteristics: "use client" directive required for interactive components; dynamic imports for charts; error boundaries for safety

**Pages Layer:**

- Purpose: Next.js app router pages
- Location: `app/`
- Entry points: `app/page.tsx` (home), `app/compare/page.tsx`, `app/pricing/page.tsx`, `app/deals/page.tsx`, `app/hardware/page.tsx`, `app/model/[id]/page.tsx`
- Pattern: Each page exports server-side metadata, renders a `*Client.tsx` component
- Depends on: All layers

## Data Flow

**Home Grid (Browse & Filter):**

1. `HomeClient.tsx` calls `useLaptops()` → loads all 124 models from `data/laptops.ts`
2. `usePrices()` → loads user-contributed prices from `localStorage` + `seed-prices.ts` baseline
3. `useFilters()` → applies search/lineup/series/year/weight/RAM/price filters via `lib/filters.ts`
4. Per-model scoring: `getModelScores()` in `lib/scoring.ts` computes 6 dimension scores
5. `LaptopCard` component renders each filtered model with 4 scores (Performance, Display, Memory, GPU)
6. Optional: `PricePerformanceScatter` chart dynamically loads to visualize price vs composite score

**Model Detail View:**

1. `app/model/[id]/page.tsx` reads URL param, renders `ModelDetailClient.tsx`
2. `useLaptops()` finds the specific model
3. `usePrices()` loads all prices for that model
4. `getModelScores()` computes scores for configured model (respects ConfigSelector options)
5. `generateAnalysis()` derives pros/cons, use cases, upgrade path from specs + scores
6. Dynamic sections load: `BenchmarksSection` (thermals, battery, noise), `BenchmarkBar` chart (CPU/GPU/thermals), `PerformanceRadar` (6-dimension radar), `EditorialCard` (curated notes), `LinuxSection` (distros + drivers)
7. Optional: `ConfigSelector` allows swapping CPU/GPU/RAM/display options (via `lib/configUtils.ts`), instantly recomputes scores

**Compare View:**

1. `CompareClient.tsx` uses `useCompare()` to load selectedIds from `sessionStorage`
2. Models resolved from `useLaptops()`; prices from `usePrices()`
3. `getPerformanceDimensions()` for each model → feeds `PerformanceRadar` (multi-model overlay)
4. Per-dimension charts: `CpuCompareChart`, `GpuCompareChart`, `PortabilityCompareChart`, `ThermalCompareChart`, `BatteryLifeCompareChart`
5. Desktop: ResponsiveContainer grid; Mobile: `MobileCompareCards` (swipeable card view with per-card radar)
6. Optional: `CompareConfigPanel` allows per-model config overrides, recalculates scores

**Pricing View:**

1. `PricingClient.tsx` uses `usePrices()` to load both seed-prices and user-contributed prices
2. `PriceEntryForm` allows adding/editing prices with optional note and priceType
3. `PriceDisplay` groups prices by model and retailer, shows sparkline trend
4. Changes committed to `localStorage` under `lenovocompare-prices` key
5. Community prices exported via JSON button for sharing

**Deals View:**

1. `DealsClient.tsx` loads all models + prices
2. `computeBuySignal()` from `lib/deals.ts` analyzes price vs baseline to assign signal: buy-now, good-deal, hold, wait
3. `dealHighlights` from `data/market-insights.ts` (curated deals) + `saleEvents` (seasonal calendar)
4. Models grouped by buy signal, expandable UI per signal group
5. Optional: lineup filter to view only specific lineups

**Hardware Guide Page:**

1. Loads `hardware-guide.ts` CPU and GPU analysis entries
2. Components (ChipDetailCard) render per-CPU and per-GPU curated analysis: strengths, weaknesses, thermals, gen context, alternatives

**State Management:**

- **Browse filters**: `useFilters()` derives from URL query params (via `useSearchParams`) + local `FilterState`
- **Compare selections**: `useCompare()` persists in `sessionStorage` (sessionStorage key: `lenovocompare-compare`) — survives page refresh within a tab but clears on new tab
- **User prices**: `usePrices()` reads from `localStorage` (key: `lenovocompare-prices`) + `seed-prices.ts` baseline + `community-prices.json` (optional remote fallback)
- **Toast notifications**: `useToast()` manages transient user feedback via `Toast` component

## Key Abstractions

**Laptop Model:**

- Purpose: Immutable record of one laptop with all PSREF specs
- Examples: `data/laptops.ts` (array of 124), typed as `Laptop` interface in `lib/types.ts`
- Pattern: Every model has required fields (`id`, `name`, `lineup`, `series`, `processor`, `display`, `gpu`, `battery`, `weight`, `psrefUrl`) and optional fields for variants (`processorOptions`, `displayOptions`, `gpuOptions`, `ramOptions`, `storageOptions`)

**ScoreBreakdown Types:**

- Purpose: Decompose each dimension score into component contributions for educational transparency
- Examples: `DisplayBreakdown`, `ConnectivityBreakdown`, `MemoryBreakdown`
- Pattern: Each breakdown function (`getDisplayScoreBreakdown()`, etc.) returns record of labeled components with earned/max points, used by ScoreCardExpanded component

**Benchmark Data:**

- Purpose: Aggregate CPU single/multi/composite, GPU score/tier/FPS, model-specific thermals/battery/noise
- Examples: `cpuBenchmarks` (composite by CPU name), `cpuBenchmarksExpanded` (full details), `gpuBenchmarks` (GPU name → GpuBenchmarkEntry), `modelBenchmarks` (by laptopId)
- Pattern: Keyed by unique identifier (CPU name, GPU name, laptopId); sourced from NotebookCheck/Geekbench/community

**Performance Dimensions:**

- Purpose: 6-dimensional radar chart axes for cross-model comparison
- Examples: `PerformanceDimensions` interface: cpu, gpu, memory, portability, display, connectivity (each 0–100)
- Pattern: Computed per-model via `getPerformanceDimensions()`, overlaid in PerformanceRadar for 2–4 model compare

**ModelAnalysis:**

- Purpose: Auto-generated qualitative assessment of a model
- Example: `generateAnalysis()` returns `ModelAnalysis` with pros, cons, use cases, upgrade path, gaming tier, scenario verdicts
- Pattern: Deterministic (no AI) — derived from specs + scores via pattern matching rules

**Configured Model:**

- Purpose: Represent a model with selected options (CPU, GPU, RAM, display) for what-if scoring
- Example: User selects alternate CPU in ConfigSelector → creates new Laptop object with swapped processor/scores
- Pattern: `lib/configUtils.ts` spreads base model and replaces selected fields, recalculates scores

## Entry Points

**Home Page (`app/page.tsx`):**

- Location: `app/page.tsx`
- Triggers: User navigates to `/`
- Responsibilities: Metadata export, renders `HomeClient.tsx`

**Home Grid Client (`app/HomeClient.tsx`):**

- Location: `app/HomeClient.tsx`
- Triggers: Client-side load
- Responsibilities: Load models + prices, manage filter state, paginate and render LaptopCard grid, show price/performance scatter chart, floating compare bar

**Model Detail (`app/model/[id]/page.tsx` → `ModelDetailClient.tsx`):**

- Location: `app/model/[id]/page.tsx` (server), `app/model/[id]/ModelDetailClient.tsx` (client)
- Triggers: User clicks model card or navigates to `/model/{id}`
- Responsibilities: Load model by ID, manage config state, render header + specs + scores + charts + analysis + recommendations

**Compare (`app/compare/page.tsx` → `CompareClient.tsx`):**

- Location: `app/compare/page.tsx` (server), `app/compare/CompareClient.tsx` (client)
- Triggers: User selects 2–4 models to compare
- Responsibilities: Load compare selections from `sessionStorage` via URL params, render multi-model radar + dimension-specific charts, support config overrides

**Pricing (`app/pricing/page.tsx` → `PricingClient.tsx`):**

- Location: `app/pricing/page.tsx`, `app/pricing/PricingClient.tsx`
- Triggers: User navigates to `/pricing`
- Responsibilities: Load user-contributed prices, provide entry form, export/import JSON, render price trends

**Deals (`app/deals/page.tsx` → `DealsClient.tsx`):**

- Location: `app/deals/page.tsx`, `app/deals/DealsClient.tsx`
- Triggers: User navigates to `/deals`
- Responsibilities: Load all models + prices, compute buy signals, render market alerts + seasonal calendar + deal cards

**Hardware Guide (`app/hardware/page.tsx` → `HardwareGuideClient.tsx`):**

- Location: `app/hardware/page.tsx`
- Triggers: User navigates to `/hardware`
- Responsibilities: Render CPU and GPU analysis guides (from `hardware-guide.ts`)

## Error Handling

**Strategy:** Graceful degradation with error boundaries + fallback components

**Patterns:**

- `ErrorBoundary` wraps main content in root layout (`app/layout.tsx`) — catches React errors, displays friendly message
- `ChartErrorBoundary` wraps recharts visualizations — charts fail silently if data unavailable, page remains usable
- `SectionErrorBoundary` wraps individual model detail sections — failing section doesn't break entire page
- `try/catch` in data fetching hooks (`usePrices()`, `useRemotePrices()`) — parse errors logged, graceful default returned
- Dynamic imports with `loading` fallback (`ChartSkeleton`) — charts load after page interactive
- Validators in `lib/validators.ts` — user price input validated before commit to localStorage
- `getModelScores()` guards against missing benchmarks (returns 0 if CPU/GPU not found)

## Cross-Cutting Concerns

**Logging:**

- Development: `console.log/warn/error` in hooks and utilities
- Production: No structured logging (static site, no server)
- Errors: Logged to console, not sent to external service

**Validation:**

- Price entry: `validatePrice()` checks range and type in `PriceEntryForm` before commit
- Laptop data: `validate-data.ts` runs on build to check ID uniqueness, benchmark coverage, source validity, thermal plausibility
- Filter state: URL params deserialized with type guards; invalid values dropped

**Authentication:**

- Not applicable — no user accounts
- All data is public (PSREF specs, seed prices, community prices via localStorage)

**Styling:**

- IBM Carbon Design System CSS classes (`.carbon-card`, `.carbon-btn`, `.carbon-input`, `.carbon-chip`)
- Dark theme: `bg-carbon-900`, `text-carbon-50`
- Tailwind CSS for layout and spacing
- CSS variables for colors (e.g., `var(--accent)`) pulled from `lib/constants.ts` at render time (NOT used in recharts due to hex suffix issue)
- Recharts dark theme via inline stroke colors

**Accessibility:**

- Skip-to-content link in root layout
- Keyboard navigation for all interactive elements
- Form labels associated with inputs
- ARIA labels on icons without text
- Image alt text required
- Contrast ratios checked via Lighthouse

**Performance:**

- Dynamic imports for charts (ssr: false) to reduce initial bundle
- `useMemo` for expensive computations (scoring, filtering, chart data prep)
- `useCallback` for event handlers to prevent re-renders
- Image optimization via Next.js Image component
- Bundle size budget: recharts (~324 KB) + d3 (~80 KB) kept under control via conditional imports
- Chart sizing scales with model count (4 models = smaller bar widths) to avoid overflow

---

_Architecture analysis: 2026-03-13_
