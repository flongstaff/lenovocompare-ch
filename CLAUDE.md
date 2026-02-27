# CLAUDE.md

This file provides guidance to [Claude Code](https://claude.ai/code) when working with code in this repository. For general project documentation, see [README.md](README.md). For contributor guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Project Overview

LenovoCompare CH is a local-first Swiss-market Lenovo laptop comparison tool built with Next.js 14 (App Router). Covers three lineups: **ThinkPad**, **IdeaPad Pro**, and **Legion** (100 models, 2018–2025). Dark IBM Carbon-inspired aesthetic. All data is hardcoded from public PSREF specs; pricing is user-contributed via localStorage.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build — run after major logic changes
npm run lint     # ESLint
npm test         # Vitest unit tests (formatters, scoring, data integrity)
npm run validate # Data integrity validation (all 9 data files)
npx prettier --check .  # Check formatting (auto-runs via hook on edits)
docker compose up  # Dev server via Docker on :3000
```

Vitest is configured for unit tests. Run `npm test` for formatters, scoring, and data integrity checks. Use `npm run build` as the full verification step.

## Gotchas

- After deleting/moving files, `rm -rf .next` before rebuilding — stale cache causes 500 errors
- If `rm -rf .next` still gives `_document` errors, also `rm -rf node_modules/.cache`
- lucide-react `Keyboard` icon shadows `Keyboard` type from `lib/types.ts` — use `as KeyboardIcon` alias; check for similar name collisions with `Monitor`, `Battery`, etc.
- `useSearchParams()` requires a `<Suspense>` boundary wrapping the component
- lucide-react icon `size` prop type is `string | number`, not just `number`
- Footer uses named export (`export const Footer`), Header uses default export
- When adding MCP servers, edit `.mcp.json` directly — `claude mcp add` cannot run inside a session. All servers use Docker (`docker run`), not npx
- GitHub tools are provided via Docker MCP (MCP_DOCKER), not a standalone server — use `mcp__MCP_DOCKER__` prefixed tools for PRs, issues, and code search
- New fields on `Laptop` interface must be optional (`?`) unless you update all models — `psrefUrl` is the only required non-optional field added post-launch
- PSREF URL pattern: ThinkPad uses `Product/ThinkPad/Lenovo_ThinkPad_{Model}_{MachineType}`. IdeaPad Pro uses `Product/IdeaPad/IdeaPad_Pro_{Model}_{MachineType}` (no `Lenovo_` prefix, drop "i" from slug). Legion uses `Product/Legion/Legion_{Model}_{MachineType}` (no `Lenovo_` prefix, drop "i" from slug for Gen 9+). Spaces → underscores, no Intel/AMD suffix in URL
- Model IDs use platform suffixes: `t14-gen5-intel`, `t14s-gen5-amd` — omit suffix only for single-platform models (e.g., `p1-gen7`)
- PostToolUse hooks auto-modify files on save — always re-read files before writing if time has passed
- PostToolUse ESLint hook strips "unused" imports immediately — if adding imports + code that uses them, do it in a single Edit or the imports vanish before the code referencing them lands
- `import type` vs `import` — the linter auto-converts to `import type` when values aren't used at runtime; types used in function return annotations may get stripped if the function body isn't present yet
- recharts components must be in `"use client"` files — they fail during SSR/prerendering without it
- recharts `RadarChart` with long axis labels (e.g. "Connectivity", "Portability") overflows container — use `outerRadius="60%"` with generous `margin` and strip lineup prefix from legend names
- ScoreBar `color` prop must be a raw hex value (e.g. `"#0f62fe"`), NOT a CSS variable — `var(--accent)90` creates invalid CSS when hex opacity suffix is appended in the gradient
- `npm start` (standalone mode) doesn't serve CSS properly — use `npm run dev` for visual testing
- Editing `.claude/settings.json` with grep patterns containing `(` breaks JSON validation in the Edit tool — use Write (full file) instead
- `laptops.ts` array ends with `] as const;` (not `];`) — use `Read` on last 5 lines to find insertion point for new models
- `.mcp.json` is gitignored (machine-specific) — MCP server config won't transfer via git clone
- Use `laptops.ts` and `laptopId` in new/updated skill/agent files (not deprecated `thinkpads.ts`/`thinkpadId`). Run `/stale-ref-check` to audit
- `x?.length > 0` fails TypeScript — optional chaining returns `number | undefined`, use `(x?.length ?? 0) > 0`
- `Math.min(...[])` returns `Infinity` — always guard empty arrays before spread into min/max
- Scoring sub-scores must use `Math.max(0, Math.min(max, ...))` (double clamp) — `Math.min` alone allows negative values from formulas like `(value - baseline) / range`
- `getValueScore` and all score functions must cap at 100 — uncapped scores break compare delta calculations
- `getPriceDiscount(price, msrp)` — guard `msrp === 0` to avoid NaN from division by zero
- Hook tests using `sessionStorage` or `localStorage` need `beforeEach(() => { sessionStorage.clear(); localStorage.clear(); })` — state leaks between test cases via storage initializers
- URL param parsers that build result objects: only assign non-null values — assigning `null` creates keys that inflate `Object.keys().length` and trigger false-positive state updates
- recharts `ScatterChart` with `lineType="joint"` is preferred for sparse time-irregular data (e.g., price entries) over LineChart
- Content filter may block Code of Conduct text — reference Contributor Covenant by URL link instead of embedding full policy text
- Community health files: `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `CHANGELOG.md`, `.github/FUNDING.yml` — keep version in SECURITY.md synced with `package.json`
- Bulk renames across codebase: use `Grep` to find all occurrences first, then `Edit` with `replace_all: true` per file — confirm the target name with user before starting
- Playwright MCP runs in Docker — cannot reach `localhost:3000` on the host. Use `npx playwright screenshot` (native CLI) instead of MCP for local screenshots
- PostToolUse hooks may make large autonomous refactors (e.g., replacing framer-motion with CSS animations, rewriting recharts components as pure SVG, extracting shared constants) — review `git diff` before committing to understand what hooks changed vs what you changed. Hooks can introduce unused imports that break builds — always run `npm run build` after hook-modified files
- Home page (`HomeClient.tsx`) uses `mx-auto max-w-7xl px-4 sm:px-6` container — matches header's max-width. Other page clients may need similar wrapping
- BenchmarksSection should only show benchmark-derived data (scores, measured values, computed insights like ratios/tier ratings/accuracy) — never raw model specs (cores, RAM type, display resolution) which are already in the Specs card. Use `InsightRow` for contextual assessments, not `SpecRow` for duplicated specs
- `.claude/settings.json` hooks use long shell commands in JSON — always use Write (full file) for edits, and validate with `python3 -c "import json; json.load(open('.claude/settings.json'))"` after
- `useMemo`/`useCallback` must be called before early returns — wrap in null-safe lambdas (e.g., `useMemo(() => model ? compute(model) : null, [model])`) and include the null case in the guard
- Named export dynamic imports: `dynamic(() => import('...').then(m => ({ default: m.NamedExport })), { ssr: false })`
- Replacing recharts with pure SVG for small visualizations (e.g., MiniRadar) dramatically reduces bundle — recharts + d3 chain is ~324 KB
- CSS `@keyframes` + `animationDelay` style prop replaces `framer-motion` for simple stagger animations without the ~185 KB bundle cost
- Home page precomputes scores via `useMemo` map in HomeClient, passes `precomputedScores` prop to LaptopCard — avoids per-card `getModelScores()` calls
- `useCompare` uses `sessionStorage` (not `localStorage`) — compare selections persist during navigation/refresh within a tab but clear on new tab/session. Don't switch to `localStorage` or plain `useState`
- Cross-page shared React state: `useState` in a hook called from different page components creates independent instances. Use `sessionStorage` with lazy initializer or a context provider in layout for state that must persist across navigation
- Permission rules live in `.claude/settings.local.json` (machine-specific, 104 allow rules) — check there before adding to `settings.json`

## Claude Code Automations

- **Skills** (46): `/add-laptop`, `/add-price`, `/add-model-year`, `/update-psref`, `/compare-specs` (side-by-side spec and score comparison of 2-4 models in the terminal), `/new-component` (scaffold a new React component following project conventions), `/deploy-check`, `/e2e-check` (run Playwright E2E tests against the local dev server), `/commit` (conventional commits with type/scope validation, banned words, 50-char subject limit), `/squash-commits` (consolidate messy branch history into clean conventional commits), `/add-editorial`, `/refresh-analysis` (regenerate analysis outputs for one or all models), `/benchmark-update`, `/changelog`, `/hardware-update`, `/gpu-update`, `/data-migration`, `/accessibility-check`, `/release`, `/stale-ref-check`, `/github-prep`, `/add-benchmark`, `/bulk-benchmark-verify`, `/price-import-test`, `/ingest-review`, `/run-tests`, `/add-gpu`, `/add-linux-compat`, `/perf-budget` (bundle size regression check), `/bundle-regression` (delta tracking against persisted baseline per route), `/sync-counts` (auto-update model counts in docs), `/visual-test` (screenshots, diffs, chart audit, regression), `/data-verify` (CLI validation, sync, regression snapshots), `/model-check` (data + rendering + charts + price sanity), `/audit perf|price|retailer|psref` (targeted subsystem audits), `/pre-push-check` (full CI validation before push: Prettier + lint + test + validate + build), `/update-community-health` (sync CHANGELOG/SECURITY/SUPPORT versions), `/dependency-upgrade` (evaluate and apply safe dep upgrades), `/prettier-fix` (fix all Prettier issues repo-wide), `/e2e-scaffold` (generate Playwright E2E test stubs), `/cross-file-audit` (verify model coverage across all 9 data files), `/changelog-validate` (cross-reference CHANGELOG vs git log), `/type-coverage-audit` (scan for `any` and type coverage metrics), `/generate-data-schema` (auto-generate docs from types.ts), `/psref-audit` (validate PSREF URLs + compare processor configs against live pages), `/hook-health` (dry-run diagnostic for all hooks)
- **Agents** (26): `pricing-verifier`, `ui-reviewer`, `a11y-reviewer`, `perf-analyzer`, `test-writer`, `component-test-writer`, `editorial-reviewer`, `upgrade-path-reviewer`, `scoring-auditor`, `bundle-analyzer`, `docs-reviewer`, `code-readability-auditor`, `benchmark-data-reviewer`, `cross-lineup-comparator` (compare UI tie handling + score range + chart scaling), `price-trend-analyzer` (seed prices, baselines, retailer pricing, value opportunities), `sustained-perf-analyzer` (thermal throttling, sustained vs peak performance, battery-performance tradeoffs), `dependency-auditor`, `license-compliance-auditor` (MIT compatibility check on transitive deps), `validation-reviewer`, `lighthouse-auditor` (Playwright-based performance + accessibility audit), `data-reviewer` (specs + completeness), `hardware-reviewer` (GPU data + guide content), `chart-reviewer` (chart quality + cross-lineup handling), `data-completeness-checker` (cross-file coverage matrix for all 9 data files), `psref-config-comparator` (live PSREF page diff against laptops.ts configs), `regression-tester` (scoring stability verification against representative models)
- **Hooks** (30): SessionStart (10): clear port 3000 + auto-start dev server (combined), dependency health, doc freshness, community skills sync, stale .next cache, benchmark coverage, stale ref detector, skill freshness, community health file freshness, PSREF data freshness; PostToolUse (12): code quality (Prettier + ESLint + tsc + re-stage — consolidated), data integrity (validate + as-const/dupes/sources — consolidated), validate-data.ts meta-check, context & patterns (ScoreBar/GPU/laptops.ts/charts/recharts/agents — consolidated), image size warning, Vitest runner, npm audit + dep count, PSREF scraper type-check, PSREF URL validation (prefix + slug cross-check — consolidated), build detection info, dev server restart after build, .next auto-clear on file delete/move; Stop (1): kill dev server; PreToolUse (7): security block (lock files + .env/.pem/.key), linter-maintained file warning, recharts import reminder, seed price sequential ID context, CHANGELOG reminder on version bump, git commit/push gate (Prettier check + commit message linter — consolidated), Exa cost warning
- **MCP**: context7 (live docs), playwright (visual testing), memory (cross-session persistence), fetch, exa (structured web search — cost-managed, see policy below), github (disabled — use Docker MCP `mcp__MCP_DOCKER__` tools instead) — all via Docker in `.mcp.json`
- **CI/CD**: `.github/workflows/ci.yml` (lint + test + build), `.github/workflows/deploy.yml` (GitHub Pages deploy), `.github/workflows/codeql.yml` (CodeQL security analysis), `.github/dependabot.yml` (weekly dependency updates)

### Exa Usage Policy (Cost Management)

Exa is a paid API. **Always try free alternatives first**, only escalate to Exa when they fail:

| Task                       | Try First (Free)                                                      | Exa Only If                                             |
| -------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------- |
| Library/framework docs     | `context7` MCP                                                        | context7 has no entry                                   |
| General web lookup         | `WebSearch` + `WebFetch`                                              | Need structured/filtered results                        |
| Benchmark scores (CPU/GPU) | `WebSearch` for "CPU_NAME cinebench geekbench site:notebookcheck.net" | Multiple sources needed or WebSearch returns stale data |
| Laptop reviews             | `WebFetch` on NotebookCheck/LaptopMedia URLs directly                 | Need to discover which reviews exist                    |
| PSREF specs                | `WebFetch` on psref.lenovo.com URLs directly                          | Never use Exa for this                                  |
| Price research             | Never (user-contributed data only)                                    | Never                                                   |

**Rules**:

- Maximum ~5 Exa calls per session unless user explicitly approves more
- Batch queries: combine related searches into fewer, broader Exa calls
- Cache results in memory MCP for reuse across sessions
- For benchmark research: search NotebookCheck/Tom's Hardware/JarrodsTech via free WebSearch first

## Architecture

- **`app/`** — Next.js App Router pages: home (grid), `/model/[id]` (detail), `/compare` (side-by-side), `/pricing` (manage prices), `/hardware` (CPU/GPU guide)
- **`lib/types.ts`** — Core interfaces: `Laptop` (aliased as `ThinkPad` for compat), `Lineup`, `SwissPrice`, `FilterState`, `CompareState`, `Series`, `LinuxStatus`, `Keyboard`, `GamingTier`, `GpuBenchmarkEntry`, `CpuBenchmarkData`, `LinuxCompatEntry`, `PerformanceDimensions`, `UseCaseScenario`, `ScenarioVerdict`, `ModelBenchmarks`, `BenchmarkSource`
- **`lib/constants.ts`** — App constants: localStorage keys (`lenovocompare-*`), retailers, lineup colors, series colors, sort options, `MAX_COMPARE = 4`, `COMPARE_COLORS`
- **`lib/hooks/`** — Custom hooks: `useLaptops` (aliased as `useThinkPads`), `usePrices`, `useFilters`, `useCompare`, `useLocalStorage` (with legacy key migration), `useToast`
- **`lib/scoring.ts`** — CPU (single/multi/composite), GPU, display, memory, connectivity, portability scores + `getPerformanceDimensions` + `getModelBenchmarks` + `getCpuRawBenchmarks`
- **`lib/analysis.ts`** — Auto-generated pros/cons, use cases, upgrade paths, use-case scenario verdicts, gaming tier
- **`lib/`** — Other utilities: `formatters.ts`, `filters.ts`
- **`lib/retailers.ts`** — Swiss retailer search URL builders (Digitec, Brack, Toppreise, Ricardo, Tutti) + review site URLs (NotebookCheck, LaptopMedia)
- **`data/laptops.ts`** — 100 Laptop models with real PSREF specs (2018–2025): 68 ThinkPad + 14 IdeaPad Pro + 18 Legion. Every model has `lineup` and `psrefUrl` (required). Aliased as `thinkpads` for compat.
- **`data/cpu-benchmarks.ts`** — CPU → single/multi/composite scores (0-100) + raw Cinebench 2024/Geekbench 6 scores + TDP data; `cpuBenchmarks` (composite) + `cpuBenchmarksExpanded` (full, 80+ CPUs including high-TDP gaming)
- **`data/gpu-benchmarks.ts`** — GPU → score/gaming tier/FPS estimates for 28+ GPUs (integrated + discrete RTX 3060–5080 Laptop) + Time Spy/Cyberpunk Ultra FPS for discrete GPUs
- **`data/model-benchmarks.ts`** — Per-model chassis benchmark data (thermals, fan noise, battery, SSD speed, display brightness, content creation) from NotebookCheck reviews + community estimates — all 97 models
- **`data/linux-compat.ts`** — Per-model Linux compatibility (certified distros, kernel, driver notes, Fedora notes) — all 100 models
- **`data/model-editorial.ts`** — Curated editorial for all 100 models
- **`data/hardware-guide.ts`** — Curated CPU and GPU analysis: summary, strengths, weaknesses, bestFor, avoidIf, thermalNotes, generationContext, alternatives, architecture
- **`data/seed-prices.ts`** — ~205 curated Swiss prices in CHF covering all models (with priceType and note fields)
- **`data/price-baselines.ts`** — Static price baselines (MSRP, typical retail, historical low) for all models
- **`components/charts/`** — recharts-based: `PerformanceRadar`, `BenchmarkBar`, `FpsChart`, `CpuCompareChart`, `GpuCompareChart`, `PortabilityCompareChart`, `ThermalGauge`, `BatteryCompareBar` (Carbon dark themed)
- **`components/`** — UI components organized by feature: `layout/`, `models/` (LaptopCard, ConfigSelector, UpgradeSimulator, BenchmarksSection, ChipDetailCard, HardwareGuide), `filters/` (LineupFilter, SeriesFilter), `compare/`, `pricing/`, `ui/` (ScoreBar, Toast, ErrorBoundary, LinuxBadge, Skeleton)
- **`tests/`** — Vitest unit tests: `formatters.test.ts` (CHF/weight/date/storage/shortName), `scoring.test.ts` (CPU/GPU/portability scores), `data-integrity.test.ts` (ID uniqueness, benchmark coverage, source validation, thermal plausibility)

## Key Patterns

- **Lineups**: `"ThinkPad" | "IdeaPad Pro" | "Legion"` — each model has a `lineup` field. Series values vary by lineup (ThinkPad: X1/T/P/L/E, IdeaPad Pro: Pro 5/Pro 5i/Pro 7, Legion: 5/5i/7/7i/Pro/Slim)
- Batch model additions: add CPUs to `cpu-benchmarks.ts` first (other files depend on CPU names), then `laptops.ts`, then supporting files (linux-compat, editorial, seed-prices, price-baselines, hardware-guide, model-benchmarks). Verify with `npm run build` + cross-reference check after
- Convertible series assignment: X1 Yoga/Titanium/2-in-1 → `"X1"`, X13 Yoga → `"T"`, L13 Yoga/2-in-1 → `"L"`
- Seed price IDs are sequential strings (`sp-1` through `sp-205`) — check last ID before adding new entries
- `data/` files keyed by model ID (`laptopId`) or hardware name (CPU/GPU string) — keep keys consistent with `Laptop` interface values
- `COMPARE_COLORS` in constants.ts — 4 Carbon-palette colors for multi-model chart overlays
- Data uses `as const` assertions — use `readonly` arrays in function signatures
- Core type: `Laptop` in `lib/types.ts` with `ThinkPad` as deprecated alias
- Swiss pricing uses CHF with `de-CH` locale formatting
- CSS uses IBM Carbon Design System classes (`.carbon-card`, `.carbon-btn`, `.carbon-input`, `.carbon-select`, `.carbon-chip`)
- Components use default exports (LaptopCard, Header, CompareTable) or named exports
- All user data stored in localStorage via `useLocalStorage` hook (keys: `lenovocompare-prices`, `lenovocompare-compare`; auto-migrates from `thinkcompare-*`)
- framer-motion for card stagger animations + AnimatePresence for filter transitions
- Pages use server/client split: `page.tsx` exports metadata, renders `*Client.tsx` component
- Error boundary wraps main content in layout
- Toast system (`useToast` + `Toast`) for user feedback
- Mobile compare uses swipeable card view (`MobileCompareCards`)
- Model detail page (`ModelDetailClient`): full-width layout with ConfigSelector (if options exist), 3-column dashboard strip (Scores, Swiss Prices, Value Calculator), then stacked cards: 2-column Specs, UpgradeSimulator, Performance Overview (compact radar + 6 dimension score cards), BenchmarksSection (with thermal/noise context labels), GamingSection, HardwareGuide, side-by-side UseCaseScenarios + LinuxSection, ModelAnalysisCard, EditorialCard, compact row DeepDive + PriceCheck (horizontal button rows)
- Compare page: PerformanceRadar + CpuCompareChart + GpuCompareChart + PortabilityCompareChart (desktop), MobileCompareCards with per-card radar (mobile)
- `ScoreBar` has `size` prop: `"sm"` (default, compact) and `"md"` (taller bar, wider labels) — cards/compare use `"md"`
- LaptopCard shows 4 scores (Perf, Display, Memory, GPU with iGPU/dGPU label); CompareTable/MobileCompareCards show 6 (+ Connectivity, Portability, Value)
- `UpgradeSimulator` in `components/models/` — spread readonly `Laptop` to create mutable sim copy for score comparison
- `gpuOptions` on Laptop models: only needed when `processorOptions` span CPU families with different iGPUs. CPU-to-GPU mapping defined in `.claude/skills/gpu-update/SKILL.md`
- **Scoring is absolute** (not per-lineup normalized) — Legion dGPUs naturally score 55–92, ThinkPad iGPUs 8–40. This is correct for cross-lineup comparison.
- Compare charts scale with model count: `barSize` shrinks for 4 models (10px) vs 2 models (16px); chart height uses `models.length * N + offset`
- `PerformanceRadar` auto-compacts for single model (`models.length === 1`) with smaller outerRadius and height

## Stack

- Next.js 14, React 18, TypeScript 5
- Tailwind CSS 3 (Carbon dark theme)
- framer-motion (animations)
- recharts (charts — radar, bar, FPS)
- lucide-react (icons)
- Path alias: `@/*` maps to project root

## Legal

- No web scraping of retailers
- PSREF specs are public product reference data
- CPU benchmarks from publicly available aggregate data
- All pricing is user-contributed
- Review links are outbound only
- Full data source attribution in README.md Data Sources section and Footer.tsx trademark notice
- Project follows [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) — see CODE_OF_CONDUCT.md
- Security reports via private GitHub contact — see SECURITY.md

## Design Assets

- `design/signal-precision.md` — "Signal Precision" design philosophy (industrial measurement aesthetic)
- `design/signal-precision.pdf` — Visual canvas expression of the philosophy
- `design/generate-canvas.py` — Python/reportlab script to regenerate the canvas
