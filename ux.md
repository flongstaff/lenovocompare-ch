# UX Brief: Split ModelDetailClient

**Type:** Pure refactor (zero visual or behavioral changes)
**Scope:** Extract sections from `app/model/[id]/ModelDetailClient.tsx` (842 lines) into focused child components
**Goal:** Developer ergonomics — the page must look and behave identically before and after

---

## 1. User Stories

### US-1: Developer edits a single section without scrolling through 800+ lines

**Acceptance Criteria:**

- Each extracted component lives in its own file under `components/models/`
- Each file is under 150 lines
- `ModelDetailClient.tsx` becomes an orchestrator (~150-200 lines) that composes child components
- No logic duplication between orchestrator and children

### US-2: Developer understands page layout from orchestrator alone

**Acceptance Criteria:**

- `ModelDetailClient.tsx` reads top-to-bottom as a page outline: header, score strip, config, nav, dashboard, sections
- Section ordering, IDs, and class names are visible in the orchestrator (not buried in children)
- Props are explicit — no prop-drilling beyond one level

### US-3: End user sees zero changes

**Acceptance Criteria:**

- Visual diff between before/after is empty (screenshot parity)
- All interactive behavior preserved: config switching, sticky nav, anchor scrolling, price trend icons, external links
- `npm run build` passes with no new warnings
- `npm test` passes unchanged
- Lighthouse scores unchanged (no new JS bundles, no layout shift)

---

## 2. Current User Flow (must be preserved exactly)

### Page Load Flow

1. User navigates to `/model/[id]`
2. `useParams()` extracts `id`, model is looked up from `laptops` array
3. If model not found -> "Model not found" with back link (early return)
4. `useState` initializes `configuredModel` to base model
5. `useMemo` computes `sc` (scores) and `analysis` from configured model
6. Page renders top-to-bottom:

### Section Rendering Order

| #   | Section                                                    | Element ID    | Scroll Target  | Dynamic Import                                                          |
| --- | ---------------------------------------------------------- | ------------- | -------------- | ----------------------------------------------------------------------- |
| 1   | Back link                                                  | —             | —              | No                                                                      |
| 2   | Model header (badges, name, year/OS, PSREF links)          | —             | —              | No                                                                      |
| 3   | Quick score strip (6 dimension chips)                      | —             | —              | No                                                                      |
| 4   | ConfigSelector                                             | —             | —              | Yes                                                                     |
| 5   | Sticky nav bar (9 anchors)                                 | —             | —              | No                                                                      |
| 6   | Dashboard strip: Scores + Swiss Prices + Value Calculator  | `scores`      | `scroll-mt-14` | Partial (ValueScoring)                                                  |
| 7   | Price History                                              | —             | —              | Yes (PriceHistoryCard)                                                  |
| 8   | Specifications (2-col)                                     | `specs`       | `scroll-mt-14` | No                                                                      |
| 9   | Form Factor (blueprint + stats + ports)                    | `form-factor` | `scroll-mt-14` | Yes (BlueprintDiagram)                                                  |
| 10  | Upgrade Simulator                                          | —             | —              | Yes                                                                     |
| 11  | Performance Overview (radar + score cards + benchmark bar) | `performance` | `scroll-mt-14` | Yes (PerformanceRadar, BenchmarkBar, ScoreCardExpanded, AiDevReadiness) |
| 12  | Benchmarks                                                 | `benchmarks`  | `scroll-mt-14` | Yes                                                                     |
| 13  | Gaming                                                     | `gaming`      | `scroll-mt-14` | Yes                                                                     |
| 14  | Hardware Guide                                             | —             | —              | Yes                                                                     |
| 15  | Use Cases + Linux (side-by-side)                           | `use-cases`   | `scroll-mt-14` | Yes                                                                     |
| 16  | Model Analysis                                             | —             | —              | Yes                                                                     |
| 17  | Editorial (conditional)                                    | `editorial`   | `scroll-mt-14` | Yes                                                                     |
| 18  | Research: Deep Dive + Price Check (side-by-side)           | `research`    | `scroll-mt-14` | Yes                                                                     |

### Configuration Change Flow

1. User selects different processor/RAM/GPU in ConfigSelector
2. `handleConfigChange` callback updates `configuredModel` state
3. `useMemo` recomputes `sc` and `analysis`
4. All sections receiving `configuredModel` or `sc` re-render with new values
5. Sections using base `model` (prices, battery, weight, ports) stay unchanged

---

## 3. States (must be preserved per section)

### Page-Level States

| State          | Trigger                            | Behavior                                                 |
| -------------- | ---------------------------------- | -------------------------------------------------------- |
| **Not Found**  | `laptops.find()` returns undefined | Center-aligned "Model not found" + "Back to models" link |
| **Normal**     | Model found, scores computed       | Full page renders all sections                           |
| **Configured** | User changes CPU/RAM/GPU           | Scores, analysis, performance sections update reactively |

### Section-Level States

| Section                           | Loading                                  | Empty                                               | Error                          |
| --------------------------------- | ---------------------------------------- | --------------------------------------------------- | ------------------------------ |
| Charts (Radar, BenchmarkBar, FPS) | `ChartSkeleton` (200px animated pulse)   | N/A — always has data if model exists               | `SectionErrorBoundary` catches |
| Swiss Prices                      | N/A (sync data)                          | "No prices available yet." text                     | N/A                            |
| Price trend indicator             | N/A                                      | Hidden (no baseline or no prices)                   | N/A                            |
| Editorial card                    | N/A                                      | Entire section not rendered (`editorial && ...`)    | `SectionErrorBoundary` catches |
| Linux section                     | N/A                                      | Not rendered in Use Cases grid                      | N/A                            |
| Use Cases grid                    | N/A                                      | Entire grid hidden if no scenarios AND no linux     | N/A                            |
| Dynamic imports                   | `SectionSkeleton` (120px animated pulse) | N/A                                                 | N/A                            |
| Perf/Single/Multi scores          | N/A                                      | ScoreBar hidden when score is 0 (`sc.perf > 0 &&`)  | N/A                            |
| Value score                       | N/A                                      | ScoreBar hidden when null (`valScore \!== null &&`) | N/A                            |
| Benchmark bar                     | N/A                                      | Hidden when all three scores are 0                  | N/A                            |

### Skeleton Components (inline, not extracted)

- `ChartSkeleton`: `<div className="carbon-card animate-pulse" style={{ height: 200 }} />`
- `SectionSkeleton`: `<div className="carbon-card animate-pulse" style={{ height: 120 }} />`

---

## 4. Component Inventory

### Existing Components (reuse as-is, do not modify)

All dynamically imported components stay unchanged:

- `PerformanceRadar`, `BenchmarkBar` (charts)
- `GamingSection`, `BenchmarksSection`, `ScoreCardExpanded`, `AiDevReadiness` (models)
- `PriceCheck`, `ValueScoring`, `PriceHistoryCard` (pricing)
- `DeepDive`, `ModelAnalysisCard`, `EditorialCard` (models)
- `UpgradeSimulator`, `UseCaseScenarios`, `LinuxSection`, `HardwareGuide` (models)
- `ConfigSelector`, `BlueprintDiagram` (models)
- `SeriesBadge`, `LinuxBadge`, `ScoreBar`, `SectionErrorBoundary` (ui)

### Inline Components to Extract (currently defined inside ModelDetailClient.tsx)

| Component                | Lines    | Current Location        | Target Location                               | Props                            |
| ------------------------ | -------- | ----------------------- | --------------------------------------------- | -------------------------------- |
| `SpecRow`                | L92-118  | Inline in file          | `components/models/SpecRow.tsx`               | `{ label, value, icon?, even? }` |
| `PortChip`               | L139-146 | Inline in file          | Keep in `FormFactorConnectivity` or co-locate | `{ label, accent }`              |
| `PhysicalStat`           | L148-162 | Inline in file          | Keep in `FormFactorConnectivity` or co-locate | `{ label, value, unit? }`        |
| `FormFactorConnectivity` | L164-271 | Inline in file          | Already named, extract to own file            | `{ model, configuredModel }`     |
| `parsePortBreakdown`     | L121-137 | Inline utility function | Move with `FormFactorConnectivity`            | Pure function                    |

### New Orchestration Sections to Extract

| Component                    | Approx Lines | What It Contains                                                   |
| ---------------------------- | ------------ | ------------------------------------------------------------------ |
| `ModelHeader`                | ~50          | Back link, badges, model name, year/OS, PSREF links                |
| `QuickScoreStrip`            | ~25          | 6 dimension score chips                                            |
| `StickyNav`                  | ~25          | 9-anchor navigation bar                                            |
| `DashboardStrip`             | ~100         | Scores card, Swiss Prices card, Value Calculator card (3-col grid) |
| `SpecificationsCard`         | ~55          | 2-column spec rows with icons                                      |
| `PerformanceOverviewSection` | ~80          | Radar + AiDevReadiness + ScoreCardExpanded + BenchmarkBar          |

### No New UI Primitives

- No new design tokens, CSS classes, or shared UI components
- All styling uses existing Carbon classes and CSS variables

---

## 5. Accessibility (preserve existing)

### Keyboard Navigation

- Sticky nav anchors are focusable `<a>` elements with `href="#section-id"`
- All external links (`<a target="_blank">`) have `rel="noopener noreferrer"`
- "Back to models" is a Next.js `<Link>` (client-side navigation)
- ConfigSelector handles its own keyboard interaction (dropdown/select)
- No keyboard traps exist in current implementation

### ARIA

- Sticky nav has `aria-label="Page sections"`
- No other custom ARIA attributes in current implementation
- Score values are rendered as visible text (no hidden ARIA needed)

### Focus Management

- `scroll-mt-14` on all anchor targets prevents content from hiding behind sticky nav on anchor click
- No programmatic focus management (no `useRef` + `.focus()` calls)
- Dynamic imports do not steal focus on load

### Contrast

- All text uses CSS variables (`var(--foreground)`, `var(--muted)`) from Carbon dark theme
- Score colors are hardcoded hex values meeting WCAG AA on dark backgrounds
- Price trend colors: green `#42be65`, red `#da1e28`, yellow `#f1c21b` — all pass AA on `#161616` background

### Refactor Constraint

- Extracted components must not add or remove any ARIA attributes
- Element IDs must remain on the same DOM elements (not pushed down into children where anchor scrolling would break)
- Tab order must be identical

---

## 6. Responsive Behavior (preserve existing)

### Breakpoints Used

| Breakpoint       | Tailwind Class | Sections Affected                                                    |
| ---------------- | -------------- | -------------------------------------------------------------------- |
| Default (mobile) | —              | Single column everywhere                                             |
| `sm` (640px)     | `sm:`          | Header text size, physical stats grid (2->4 cols)                    |
| `md` (768px)     | `md:`          | Dashboard strip (1->3 cols), Form Factor (1->2 cols)                 |
| `lg` (1024px)    | `lg:`          | Specs (1->2 cols), Use Cases+Linux (1->2 cols), Research (1->2 cols) |

### Layout Details

| Section           | Mobile (<640px)                      | Tablet (640-1023px)                                  | Desktop (1024px+)               |
| ----------------- | ------------------------------------ | ---------------------------------------------------- | ------------------------------- |
| Header            | Stacked: badges, name, PSREF         | Side-by-side: name left, PSREF right (`sm:flex-row`) | Same as tablet                  |
| Score strip       | Wrapping flex chips                  | Same                                                 | Same                            |
| Sticky nav        | Horizontal scroll, `overflow-x-auto` | Same, more visible                                   | Same                            |
| Dashboard         | 3 cards stacked                      | 3 cards in row (`md:grid-cols-3`)                    | Same as tablet                  |
| Specifications    | Single column                        | Single column                                        | 2 columns (`lg:grid-cols-2`)    |
| Form Factor       | Stacked: diagram then stats          | Side-by-side (`md:grid-cols-2`)                      | Same as tablet                  |
| Physical stats    | 2x2 grid                             | 1x4 grid (`sm:grid-cols-4`)                          | Same as tablet                  |
| Performance       | Stacked: radar then cards            | Same                                                 | Side-by-side (`lg:grid-cols-2`) |
| Use Cases + Linux | Stacked                              | Stacked                                              | Side-by-side (`lg:grid-cols-2`) |
| Research row      | Stacked                              | Stacked                                              | Side-by-side (`lg:grid-cols-2`) |

### Sticky Nav Behavior

- Full-width bleed: `-mx-4` with `px-4` compensation
- `backdrop-blur-md` with semi-transparent `rgba(22, 22, 22, 0.92)` background
- `z-20` stacking context
- Horizontally scrollable on all viewports (`overflow-x-auto scrollbar-thin`)

---

## 7. Extraction Plan (for implementer reference)

### Phase 1: Extract inline helpers (no behavior change)

1. Move `SpecRow` to `components/models/SpecRow.tsx`
2. Move `FormFactorConnectivity` (with `PortChip`, `PhysicalStat`, `parsePortBreakdown`) to `components/models/FormFactorConnectivity.tsx`

### Phase 2: Extract page sections (no behavior change)

3. Extract `ModelHeader` — receives `model`, renders back link through PSREF links
4. Extract `QuickScoreStrip` — receives `dimensions` object from `sc`
5. Extract `StickyNav` — stateless, no props needed (static anchor list)
6. Extract `DashboardStrip` — receives `model`, `configuredModel`, `sc`, `modelPrices`, `baseline`, `valScore`
7. Extract `SpecificationsCard` — receives `model`, `configuredModel`
8. Extract `PerformanceOverviewSection` — receives `model`, `configuredModel`, `sc`

### Verification after each phase

- `npm run build` passes
- `npm test` passes
- Visual comparison: no pixel differences
- All anchor links still scroll to correct sections
- Config changes still propagate to all affected sections

### Props Design Principle

- Pass the minimum data each section needs
- Prefer passing computed values (scores, formatted strings) over raw model + recomputing
- Exception: sections that need both `model` (base) and `configuredModel` (configured) must receive both
- Keep `id` and `className` with `scroll-mt-14` in the orchestrator, not in children, so anchor targets remain visible in the page layout

---

## 8. Risk Mitigation

| Risk                                          | Mitigation                                                                            |
| --------------------------------------------- | ------------------------------------------------------------------------------------- |
| Anchor scroll breaks if `id` moves into child | Keep `id` attributes on wrapper `<div>` in orchestrator                               |
| Dynamic import loading states change          | Keep `ChartSkeleton` and `SectionSkeleton` definitions in orchestrator or shared file |
| Config state prop-drilling                    | Pass `configuredModel` directly — only 1 level deep, no context needed                |
| `SectionErrorBoundary` wrapping changes       | Keep error boundaries in orchestrator wrapping the same sections                      |
| Stale `.next` cache after file moves          | Run `rm -rf .next` before rebuild                                                     |
| PostToolUse hooks auto-modify extracted files | Re-read files before writing; run `npm run build` after all extractions               |
