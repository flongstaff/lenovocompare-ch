# Codebase Structure

**Analysis Date:** 2026-03-13

## Directory Layout

```
lenovocompare-ch/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home page metadata + HomeClient
│   ├── layout.tsx          # Root layout (Header, Footer, ErrorBoundary)
│   ├── globals.css         # App-wide styles
│   ├── HomeClient.tsx      # Home grid, filters, quick picks, scatter chart
│   ├── compare/            # Compare functionality
│   │   ├── page.tsx        # Compare page metadata
│   │   └── CompareClient.tsx  # Multi-model radar + charts
│   ├── model/[id]/         # Model detail pages
│   │   ├── page.tsx        # Model detail metadata
│   │   └── ModelDetailClient.tsx  # Full model view (specs, scores, analysis)
│   ├── pricing/            # User price management
│   │   ├── page.tsx        # Pricing page metadata
│   │   └── PricingClient.tsx  # Price entry, history, export
│   ├── deals/              # Deal tracking and buy signals
│   │   ├── page.tsx        # Deals page metadata
│   │   └── DealsClient.tsx  # Buy signal groups, seasonal calendar
│   ├── hardware/           # CPU/GPU analysis guide
│   │   ├── page.tsx        # Hardware guide metadata
│   │   └── HardwareGuideClient.tsx  # Chip analysis cards
│   ├── validate/           # Data validation utilities (build-time)
│   └── fonts/              # Font files
├── components/             # React components organized by feature
│   ├── layout/
│   │   ├── Header.tsx      # Top nav with logo, links
│   │   └── Footer.tsx      # Footer with trademark notice, data sources
│   ├── charts/             # recharts visualizations
│   │   ├── PerformanceRadar.tsx     # 6-dimension radar (single or multi-model)
│   │   ├── CpuCompareChart.tsx      # Multi-model CPU score bar chart
│   │   ├── GpuCompareChart.tsx      # Multi-model GPU score bar chart
│   │   ├── PortabilityCompareChart.tsx  # Weight + battery comparison
│   │   ├── ThermalCompareChart.tsx  # Thermal performance comparison
│   │   ├── BatteryLifeCompareChart.tsx  # Battery life comparison
│   │   ├── PricePerformanceScatter.tsx  # Price vs composite score (dynamic import)
│   │   ├── BenchmarkBar.tsx         # Single benchmark metric bar
│   │   ├── FpsChart.tsx             # Gaming FPS estimates
│   │   ├── PolarBar.tsx             # Custom polar visualization
│   │   ├── ThermalGauge.tsx         # Thermal gauge widget
│   │   ├── BatteryCompareBar.tsx    # Battery capacity comparison
│   │   ├── ChartTooltip.tsx         # Shared tooltip styles
│   │   └── __tests__/               # Chart unit tests
│   ├── models/             # Model-specific components
│   │   ├── LaptopCard.tsx           # Home grid card (4 scores + specs)
│   │   ├── ModelHeader.tsx          # Model name, lineup, series badges
│   │   ├── DashboardStrip.tsx       # 3-column dashboard (Scores, Prices, Calculator)
│   │   ├── ConfigSelector.tsx       # Processor/GPU/RAM/display option selector
│   │   ├── SpecificationsCard.tsx   # Detailed specs table
│   │   ├── PerformanceOverview.tsx  # Compact radar + 6 dimension score cards
│   │   ├── ScoreCardExpanded.tsx    # Expandable score breakdown (earned/max)
│   │   ├── BenchmarksSection.tsx    # Thermal, battery, noise, display insights
│   │   ├── BenchmarkWidgets.tsx     # Reusable benchmark metric widgets
│   │   ├── ChipDetailCard.tsx       # CPU/GPU deep-dive card
│   │   ├── FormFactorSection.tsx    # Weight, battery, thermal profile
│   │   ├── GamingSection.tsx        # Gaming tier + FPS chart
│   │   ├── GamingTierBadge.tsx      # Gaming tier label
│   │   ├── UpgradeSimulator.tsx     # What-if config swapping
│   │   ├── UseCaseScenarios.tsx     # Use case verdict cards
│   │   ├── LinuxSection.tsx         # Certified distros + driver notes
│   │   ├── ModelAnalysisCard.tsx    # Auto-generated pros/cons
│   │   ├── EditorialCard.tsx        # Curated editorial notes
│   │   ├── HardwareGuide.tsx        # Link to hardware guide
│   │   ├── DeepDive.tsx             # Quick deep-dive shortcut
│   │   ├── MiniRadar.tsx            # Compact 6-dimension radar (SVG)
│   │   ├── BlueprintDiagram.tsx     # Chassis diagram (commented out)
│   │   ├── AiDevReadiness.tsx       # AI dev readiness assessment
│   │   ├── ThermalProfileBar.tsx    # Thermal profile visualization
│   │   └── SeriesBadge.tsx          # Series label
│   ├── compare/            # Comparison UI
│   │   ├── CompareTable.tsx         # Desktop multi-model comparison table
│   │   ├── MobileCompareCards.tsx   # Mobile swipeable card view
│   │   ├── CompareFloatingBar.tsx   # Floating compare button/badge
│   │   ├── CompareSearchSelector.tsx  # Add model to compare
│   │   ├── CompareSelector.tsx      # Model picker dropdown
│   │   ├── CompareConfigPanel.tsx   # Per-model config overrides
│   │   └── QuickVerdict.tsx         # Quick comparison summary
│   ├── pricing/            # Price management UI
│   │   ├── PriceEntryForm.tsx       # Add/edit price entry
│   │   ├── PriceDisplay.tsx         # List prices by model + retailer
│   │   └── PriceHistoryCard.tsx     # Price trend timeline
│   ├── filters/            # Home grid filters
│   │   └── FilterBar.tsx            # Search, lineup, series, price, weight filters
│   ├── deals/              # Deal tracking UI
│   │   ├── DealCard.tsx             # Deal highlight card
│   │   ├── MarketAlertBanner.tsx    # Market summary alert
│   │   ├── BuyWaitSignal.tsx        # Buy/hold/wait signal display
│   │   ├── SeasonalCalendar.tsx     # Sale event calendar
│   │   └── ComponentTracker.tsx     # Memory/storage price trends
│   └── ui/                 # Reusable primitives
│       ├── ScoreBar.tsx             # Score bar with gradient (sm/md sizes)
│       ├── Toast.tsx                # Transient notification
│       ├── ErrorBoundary.tsx        # Error boundary wrapper
│       ├── ChartErrorBoundary.tsx   # Chart-specific error boundary
│       ├── SectionErrorBoundary.tsx # Section-level error boundary
│       ├── Skeleton.tsx             # Loading skeleton components
│       ├── LinuxBadge.tsx           # Linux certification badge
│       └── PriceAgeBadge.tsx        # Price freshness indicator
├── lib/                    # Core logic and hooks
│   ├── types.ts            # Core type definitions (Laptop, SwissPrice, FilterState, etc.)
│   ├── constants.ts        # App constants (colors, retailers, storage keys, sort options)
│   ├── scoring.ts          # Scoring engine (6 dimensions, breakdowns)
│   ├── analysis.ts         # Auto-generated analysis (pros/cons, use cases, upgrade paths)
│   ├── filters.ts          # Filter and sort logic
│   ├── formatters.ts       # Format utilities (CHF, weight, date, storage)
│   ├── validators.ts       # Input validation
│   ├── configUtils.ts      # Laptop configuration (swap options)
│   ├── retailers.ts        # Swiss retailer URL builders
│   ├── deals.ts            # Buy signal computation
│   ├── score-context.ts    # Benchmark percentile context
│   ├── validate-data.ts    # Build-time data integrity checks
│   ├── benchmark-percentiles.ts  # Benchmark percentile lookup
│   ├── chart-utils.ts      # Chart data preparation helpers
│   ├── hooks/              # React hooks
│   │   ├── useLaptops.ts       # Access all 124 models
│   │   ├── usePrices.ts        # Load/manage user + seed prices
│   │   ├── useRemotePrices.ts  # Optional remote price fetch
│   │   ├── useFilters.ts       # Search, sort, range filtering
│   │   ├── useCompare.ts       # Compare selection (sessionStorage)
│   │   ├── useLocalStorage.ts  # Generic localStorage hook
│   │   ├── useToast.ts         # Toast notifications
│   │   └── __tests__/          # Hook tests
│   └── __tests__/          # Core logic tests
├── data/                   # Immutable data (TypeScript constants)
│   ├── laptops.ts          # 124 Laptop models with PSREF specs
│   ├── cpu-benchmarks.ts   # CPU composite scores + expanded full data
│   ├── gpu-benchmarks.ts   # GPU scores, gaming tiers, FPS estimates
│   ├── model-benchmarks.ts # Per-model thermal, battery, noise, SSD, display data
│   ├── linux-compat.ts     # Linux distro + driver compatibility
│   ├── model-editorial.ts  # Curated editorial per model
│   ├── hardware-guide.ts   # CPU/GPU deep-dive analysis
│   ├── seed-prices.ts      # ~205 curated Swiss prices (CHF)
│   ├── price-baselines.ts  # MSRP, typical retail, historical low
│   ├── market-insights.ts  # Market trends, sale events, deal highlights
│   └── community-prices.json  # User-contributed prices (optional remote)
├── tests/                  # Integration/end-to-end tests
│   ├── formatters.test.ts      # Formatter tests
│   ├── filters.test.ts         # Filter + sort tests
│   ├── validators.test.ts      # Validator tests
│   └── playwright/             # Playwright E2E tests (run against dev server)
├── scripts/                # CLI scripts (audit, PSREF scraping, etc.)
├── public/                 # Static assets
├── design/                 # Design reference files
├── .claude/                # Claude Code configuration
│   ├── agents/             # 30 specialized agents
│   ├── skills/             # 48 command skills
│   ├── rules/              # Gotchas and conventions
│   └── settings.json       # Hook configuration
├── .github/                # GitHub workflows
│   ├── workflows/
│   │   ├── ci.yml          # Lint, test, build
│   │   ├── deploy.yml      # Deploy to GitHub Pages
│   │   ├── codeql.yml      # Security analysis
│   │   └── process-price-submission.yml  # Community price ingestion
│   └── FUNDING.yml
├── .prettierrc.json        # Prettier config (2-space indent)
├── .eslintrc.json          # ESLint rules (Carbon-aware)
├── tsconfig.json           # TypeScript config (path aliases @/*)
├── next.config.js          # Next.js config
├── tailwind.config.ts      # Tailwind CSS config (Carbon dark theme)
├── vitest.config.ts        # Vitest config (unit tests)
├── playwright.config.ts    # Playwright config (E2E)
├── package.json            # Dependencies + scripts
├── Dockerfile              # Dev container
└── README.md               # Project documentation
```

## Directory Purposes

**`app/`:**

- Purpose: Next.js App Router pages and server-side metadata
- Contains: Page components (page.tsx), client components (\*Client.tsx), global styles, layout
- Key files: `layout.tsx` (root wrapper), `globals.css` (app-wide CSS), `HomeClient.tsx` (main grid), `page.tsx` (home metadata)

**`components/`:**

- Purpose: React UI components organized by feature
- Contains: Layout (Header, Footer), Charts (recharts), Models (cards, detail sections), Compare (table, cards), Pricing (form, display), Filters (bar), Deals (deal cards), UI (primitives)
- Key files: `LaptopCard.tsx` (home grid), `ModelDetailClient.tsx` (detail page), `CompareTable.tsx` (compare desktop), `PerformanceRadar.tsx` (radar chart)

**`lib/`:**

- Purpose: Core logic, hooks, utilities, validators
- Contains: Types, constants, scoring, analysis, filtering, formatting, validation, configuration, routing, deals logic
- Key files: `scoring.ts` (6-dimension scoring), `analysis.ts` (auto-generated insights), `hooks/` (state management)

**`data/`:**

- Purpose: Immutable source of truth — all laptop specs, benchmarks, pricing, editorial
- Contains: TypeScript constant exports (no ORM, no DB)
- Key files: `laptops.ts` (124 models, core), `cpu-benchmarks.ts`, `gpu-benchmarks.ts` (benchmark lookups), `model-editorial.ts` (curated notes), `seed-prices.ts` (baseline prices)

**`tests/`:**

- Purpose: Unit and E2E tests
- Contains: Vitest unit tests (formatters, filters, validators), Playwright E2E tests
- Key files: `formatters.test.ts`, `filters.test.ts`, `validators.test.ts`

## Key File Locations

**Entry Points:**

- `app/page.tsx` — Home page metadata + HomeClient
- `app/compare/page.tsx` — Compare page metadata + CompareClient
- `app/model/[id]/page.tsx` — Model detail metadata + ModelDetailClient
- `app/pricing/page.tsx` — Pricing page + PricingClient
- `app/deals/page.tsx` — Deals page + DealsClient
- `app/hardware/page.tsx` — Hardware guide page

**Configuration:**

- `lib/constants.ts` — Colors, retailers, storage keys, sort options, comparison limits
- `lib/types.ts` — Core interfaces (Laptop, SwissPrice, FilterState, etc.)
- `tsconfig.json` — TypeScript config with path alias `@/*` → project root
- `tailwind.config.ts` — Carbon dark theme colors
- `.prettierrc.json` — Prettier (2-space indent, 120-char line length)
- `.eslintrc.json` — ESLint (next/recommended, Carbon awareness)

**Core Logic:**

- `lib/scoring.ts` — Scoring engine (CPU, GPU, display, connectivity, portability, memory, value)
- `lib/analysis.ts` — Auto-generated analysis (pros, cons, use cases, upgrade paths, gaming tier)
- `lib/filters.ts` — Filter and sort logic
- `lib/configUtils.ts` — Laptop configuration simulation (swap CPU/GPU/RAM/display)

**Data:**

- `data/laptops.ts` — 124 Laptop models (core reference)
- `data/cpu-benchmarks.ts` — CPU scores (composite, single, multi, TDP)
- `data/gpu-benchmarks.ts` — GPU scores, gaming tiers, FPS estimates
- `data/model-benchmarks.ts` — Per-model thermals, battery, noise, display, SSD
- `data/model-editorial.ts` — Curated notes per model
- `data/seed-prices.ts` — ~205 baseline Swiss prices (CHF)
- `data/price-baselines.ts` — MSRP, typical retail, historical low per model

**Testing:**

- `tests/formatters.test.ts` — CHF, weight, date, storage formatting
- `tests/filters.test.ts` — Filter and sort logic
- `tests/validators.test.ts` — Price and data validation
- `vitest.config.ts` — Vitest configuration
- `playwright.config.ts` — Playwright E2E configuration

## Naming Conventions

**Files:**

- React components: PascalCase with .tsx extension (e.g., `LaptopCard.tsx`, `ModelDetailClient.tsx`)
- Utilities and hooks: camelCase with .ts extension (e.g., `useLaptops.ts`, `formatters.ts`, `scoring.ts`)
- Data files: camelCase with .ts extension (e.g., `cpu-benchmarks.ts`, `model-editorial.ts`)
- Page files: lowercase `page.tsx`, `layout.tsx`, `loading.tsx`, `not-found.tsx`
- Styles: globals.css (app-wide), component styles inline or co-located

**Directories:**

- Feature directories: lowercase plural (e.g., `components`, `charts`, `models`, `hooks`)
- Dynamic route segments: brackets (e.g., `[id]` for model IDs)
- Utility folders: descriptive lowercase (e.g., `layout`, `filters`, `pricing`, `deals`)

**Exports:**

- Components: Default export when possible, named export for utilities
- Data: Named exports for typed constants (e.g., `export const laptops = [...]`)
- Hooks: Named export with `use` prefix (e.g., `export const useLaptops = ...`)
- Types: Named exports (e.g., `export interface Laptop { ... }`)

**Component Props:**

- Interface naming: `{ComponentName}Props` (e.g., `LaptopCardProps`)
- Destructured with readonly arrays where applicable
- No inline objects/functions in JSX props

**IDs and Keys:**

- Model IDs: slugified model name with platform suffix (e.g., `t14-gen5-intel`, `p1-gen7`)
- Lineup values: "ThinkPad", "IdeaPad Pro", "Legion", "Yoga" (exact strings)
- Series values: "X1", "T", "P", "L", "E", "Pro 5", "Pro 5i", "Pro 7", "5", "5i", "7", "7i", "Pro", "Slim", "Yoga 6", "Yoga 7", "Yoga 9", "Yoga Slim", "Yoga Book"
- Price IDs: sequential strings (e.g., `sp-1`, `sp-2`, ..., `sp-205`)
- Retailer names: exact strings from `RETAILERS` in `lib/constants.ts`

## Where to Add New Code

**New Feature (non-model addition):**

- Primary code: Feature in `lib/` (logic) or `components/` (UI)
- Tests: Matching `.test.ts` file in `tests/` or component co-location
- Example: New filter type → add to `FilterState` in `lib/types.ts`, implement in `lib/filters.ts`, UI in `components/filters/`

**New Component/Module:**

- Implementation: `components/[feature]/[ComponentName].tsx` following existing structure
- If reusable primitive: `components/ui/[ComponentName].tsx`
- If model-specific section: `components/models/[SectionName].tsx`
- Tests: `components/[feature]/__tests__/[ComponentName].test.tsx`

**Utilities:**

- Shared helpers: `lib/[domain].ts` or `lib/hooks/[useHook].ts`
- Math/format functions: `lib/formatters.ts` or domain-specific file
- Validators: `lib/validators.ts` or domain-specific file

**New Data:**

- Model specifications: Add to `data/laptops.ts`, then update supporting files:
  - CPU: Add to `data/cpu-benchmarks.ts` first (other files depend on it)
  - Benchmarks: Add to `data/model-benchmarks.ts`
  - Editorial: Add to `data/model-editorial.ts`
  - Linux: Add to `data/linux-compat.ts`
  - Prices: Add to `data/seed-prices.ts`
  - Baselines: Add to `data/price-baselines.ts`
  - Hardware guide: Add to `data/hardware-guide.ts` if new CPU/GPU
- Lookup data: CPU/GPU benchmarks → `data/cpu-benchmarks.ts` or `data/gpu-benchmarks.ts`
- Editorial/metadata: Model-specific → `data/model-editorial.ts`, CPU/GPU → `data/hardware-guide.ts`

**Styling:**

- Component styles: Inline className with Tailwind + Carbon classes (e.g., `className="carbon-card px-4 py-2"`)
- Global styles: `app/globals.css`
- Color values: Use hex from `lib/constants.ts` (not CSS variables in recharts due to opacity suffix issue)

## Special Directories

**`.claude/`:**

- Purpose: Claude Code automations (agents, skills, rules, hooks)
- Generated: Partially (agents/skills are authored, hooks auto-run)
- Committed: Yes — part of repo

**`.github/workflows/`:**

- Purpose: GitHub Actions CI/CD pipelines
- Generated: No
- Committed: Yes

**`out/`:**

- Purpose: Static export output (npm run build → out/)
- Generated: Yes
- Committed: No — gitignored

**`.next/`:**

- Purpose: Next.js build cache
- Generated: Yes
- Committed: No — gitignored

**`node_modules/`:**

- Purpose: Installed dependencies
- Generated: Yes
- Committed: No — gitignored

**`public/`:**

- Purpose: Static assets served at root
- Generated: No
- Committed: Yes (favicon, fonts)

**`design/`:**

- Purpose: Design reference (signal precision aesthetic, canvas PDF)
- Generated: No (except canvas PDF from generate-canvas.py)
- Committed: Yes

---

_Structure analysis: 2026-03-13_
