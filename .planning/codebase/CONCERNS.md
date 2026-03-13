# Codebase Concerns

**Analysis Date:** 2026-03-13

## Tech Debt

**Deprecated Type Aliases:**

- Issue: `ThinkPad` is a deprecated alias for `Laptop` type in `lib/types.ts`
- Files: `lib/types.ts` (line 117), `lib/hooks/useLaptops.ts` (creates alias), legacy references in `lib/constants.ts`, `lib/hooks/useLocalStorage.ts`
- Impact: Codebase inconsistency, confusion between old/new naming. Older skills/agents may reference deprecated exports
- Fix approach: Audit all skill/agent files (`.claude/skills/`, `.claude/agents/`) for `thinkpadId` or `thinkpads` references. Use `/stale-ref-check` skill to identify remaining instances. Migrate exports to use `laptops` consistently, remove alias when all references updated

**localStorage Legacy Migration Pattern:**

- Issue: `useLocalStorage` hook auto-migrates from old `thinkcompare-*` keys to `lenovocompare-*`
- Files: `lib/hooks/useLocalStorage.ts`, `lib/constants.ts` (STORAGE_KEYS)
- Impact: One-way migration on first access; if user reverts to old code, data is lost. Migration logic adds indirection
- Fix approach: Data has migrated since launch (v0.2.0). Consider deprecation path: log usage of migrated keys for 1-2 releases, then remove migration logic in v0.3+

**framer-motion Dependency:**

- Issue: `framer-motion` imported for simple stagger animations in Home page
- Files: `app/HomeClient.tsx` references suggest framer-motion usage (though not directly visible in read output)
- Impact: Bundle cost for lightweight animation (185 KB), CSS `@keyframes` + `animationDelay` would be equivalent and lighter
- Fix approach: Replace framer-motion with CSS-based stagger animations in `app/HomeClient.tsx` and any component using AnimatePresence. Estimated 185 KB bundle savings

## Known Bugs

**Empty Array Math Operations:**

- Issue: `Math.min(...[])` returns `Infinity`, `Math.max(...[])` returns `-Infinity`
- Files: `lib/scoring.ts` line 227 (`getLowestPrice`), line 303 (`getLowestPrice`), line 394 (`getLineupMaxScore`)
- Trigger: No prices available for a model, or no models in a lineup dimension calculation
- Workaround: All callers check `.length > 0` before calling, but not enforced at function signature level
- Fix approach: Add guard at function entry: `if (matching.length === 0) return null;` for price functions (already done), and `if (scores.length === 0) return 0;` for percentile functions

**Potential NaN in Value Score:**

- Issue: `getValueScore` divides by `(lowestPrice / 1000)` — while zero-price guard exists (line 228), extremely low prices (<CHF 100) divide by <0.1, creating outsized scores
- Files: `lib/scoring.ts` lines 220–245
- Trigger: Test data with unrealistic sub-CHF-100 prices (not in seed data, but possible via user import)
- Symptom: Value score exceeds 100 despite `Math.min(100, ...)` clamping, distorting rankings
- Fix approach: Add min-price guard before division: `const lowestPrice = Math.max(200, Math.min(...matching.map((p) => p.price)));` to enforce CHF 200 floor matching validation rules

**Type Assertion in Chart Components:**

- Issue: `as unknown as React.MouseEvent<SVGCircleElement>` cast in `PricePerformanceScatter.tsx` line 602
- Files: `components/charts/PricePerformanceScatter.tsx`
- Impact: Bypasses type safety; if event shape changes, no compile-time detection
- Fix approach: Verify recharts event type and use proper type, or create safe wrapper handler

## Security Considerations

**PSREF URL Validation:**

- Risk: Validation only checks prefix match (`startsWith`), not full URL structure
- Files: `lib/validate-data.ts` lines 133–141
- Current mitigation: Hardcoded URLs in `laptops.ts`, not user-input. Validation catches obvious errors (wrong lineup prefix)
- Recommendations: Keep as-is; add machine type (MT) parameter validation in future (check `?MT=` exists in URL)

**Price Import Validation:**

- Risk: User-imported JSON bypasses some checks (e.g., `url` field allows any string matching regex, not validated for actual host)
- Files: `lib/hooks/usePrices.ts` lines 22–33, 104–108
- Current mitigation: Price range validation (CHF 200–15,000), retailer must be non-empty string, date format implicit via ISO string
- Recommendations: Consider adding retailer whitelist check (validate against known Swiss retailers) in import path. Currently permissive to allow community input

**localStorage XSS Risk:**

- Risk: Prices stored in localStorage are JSON serialized without sanitization
- Files: `lib/hooks/usePrices.ts`, `lib/hooks/useLocalStorage.ts`
- Current mitigation: Prices only used in-memory for calculations and display (not innerHTML). No user-provided text fields rendered directly
- Recommendations: Continue pattern of using `textContent` for all localStorage-sourced strings

## Performance Bottlenecks

**Recharts Bundle Size:**

- Problem: `recharts` + d3 chain is ~324 KB. Used on 9+ chart components across compare, model detail, and deals pages
- Files: Multiple files import recharts: `components/charts/*.tsx`
- Impact: Adds significant overhead to every page with charts. Mobile users affected most
- Improvement path: For simple use cases (single metric bar, scatter, radar), consider SVG-based replacements:
  - `PerformanceRadar`: Hand-rolled SVG polar chart (80–100 lines)
  - `BenchmarkBar`: CSS gradient bar or minimal SVG (30–50 lines)
  - Estimated savings: 200–250 KB if all static charts replaced
  - Keep recharts only for interactive tooltips (CpuCompareChart, GpuCompareChart, PricePerformanceScatter)

**Model Detail Page Dynamic Imports:**

- Problem: 9 separate `dynamic()` imports on model detail page (BenchmarksSection, GamingSection, PriceHistoryCard, DeepDive, etc.)
- Files: `app/model/[id]/ModelDetailClient.tsx` lines 16–46
- Impact: Each dynamic chunk requires separate network request; LCP delayed while skeleton loaders render
- Improvement path: Batch-load related sections (e.g., gaming + hardware in one chunk), or reduce granularity to 3–4 chunks instead of 9. Measure TTI impact before/after

**Scoring Cache Inefficiency:**

- Problem: `lineupDimensionCache` in `lib/scoring.ts` line 371 uses `Map<string, number[]>` but caches persist across renders. For single page load, minimal benefit
- Files: `lib/scoring.ts` lines 370–395
- Impact: Very minor (cache lookups are fast), but strategy should be reviewed if caching extends to percentile calculations at scale
- Improvement path: No action needed for current scale (124 models). If dataset grows to 500+ models, consider memoizing entire lineup score arrays

**Home Page Grid Precomputation:**

- Problem: All 124 model scores pre-computed in `useMemo` in `HomeClient` even if user filters to 5 models
- Files: `app/HomeClient.tsx`
- Impact: Initialization delay proportional to dataset size. Not visible on current hardware, but noticeable on lower-end devices
- Improvement path: Defer scoring until models are filtered. Use React.lazy + Suspense to delay HomeClient render until filter loads

## Fragile Areas

**Benchmark Data Cross-File Dependencies:**

- Files: `data/laptops.ts`, `data/cpu-benchmarks.ts`, `data/gpu-benchmarks.ts`, `data/hardware-guide.ts`, `data/model-benchmarks.ts`
- Why fragile: CPU/GPU names must match exactly between files. If new model added to `laptops.ts` but CPU benchmark missing, scoring silently fails (returns 0). No compile-time safety
- Safe modification: Always add CPUs to `cpu-benchmarks.ts` FIRST, then add model to `laptops.ts`. Run `npm run validate` after each file edit. Use `/stale-ref-check` to catch orphaned references
- Test coverage: `tests/data-integrity.test.ts` validates CPU/GPU benchmark presence, but only at runtime (Vitest). Add `vitest` to pre-commit hooks if not already present

**Series/Lineup Validation Mismatch:**

- Files: `lib/validate-data.ts` (VALID_SERIES), `lib/hooks/useFilters.ts` (VALID_LINEUPS, VALID_SERIES), `lib/analysis.ts` (SERIES_DESCRIPTIONS)
- Why fragile: Three separate definitions of valid series per lineup. If one is updated and others aren't, filter selections silently drop on URL deserialization (`lib/hooks/useFilters.ts` line 82 returns `null` for unknown series)
- Safe modification: Update all three locations when adding new lineup or series. Check comments in each file for current state
- Test coverage: `lib/validate-data.ts` checks lineup/series combos, but URL param filtering has no test coverage

**ModelDetailClient Prop Drilling:**

- Files: `app/model/[id]/ModelDetailClient.tsx`
- Why fragile: 8 dynamic imports, 9 error boundaries, multiple state variables (configuredModel, configOverrides). If config flow changes, must update multiple boundary points
- Safe modification: Avoid adding new config types. All config changes route through `handleConfigChange` callback (line 60) and `configuredModel` (line 59)
- Test coverage: No E2E tests for model detail page config changes. E2E test should verify processor/RAM/storage/display option selectors update scores

**Scoring Absolute (Not Normalized) by Lineup:**

- Files: `lib/scoring.ts` (all score functions), `data/cpu-benchmarks.ts`, `data/gpu-benchmarks.ts`
- Why fragile: Scores are absolute across all lineups (Legion dGPUs 55–92, ThinkPad iGPUs 8–40). This is correct for cross-lineup comparison but can confuse if normalized scores expected elsewhere
- Safe modification: Document in score function comments why absolute scoring is used. If any new ranking/comparison added, verify it expects absolute scores. Charts should show "GPU Score 0–100" not "GPU percentile in lineup"
- Test coverage: `regression-tester` agent validates score stability; no explicit test for cross-lineup fairness

**Stale PSREF URLs:**

- Files: `data/laptops.ts` (all psrefUrl fields)
- Why fragile: Lenovo moves/restructures PSREF pages occasionally. URLs are checked structurally but not live-tested
- Safe modification: `/psref-audit` skill validates URLs live against psref.lenovo.com. Run as part of pre-push check
- Test coverage: No automated live URL validation in CI (would require external API calls)

## Scaling Limits

**Model Count — Current: 124:**

- Capacity: Can scale to ~300 models before noticeable performance impact (filtering, scoring)
- Limit: Array iteration across all models for every filter/sort operation. Unindexed O(n) lookups
- Scaling path: For 500+ models, introduce Lunr.js or Fuse.js for full-text search indexing. Add date-based partitioning to avoid loading all historical variants

**Price Data — Current: ~205 seed + user-contributed:**

- Capacity: localStorage limit ~10 MB. ~500 prices per model × 124 models = 62,000 price entries fits comfortably
- Limit: User import with 10,000+ prices could hit storage limits. No cleanup of old prices (30+ days old) enforced
- Scaling path: Implement price archive/truncation on import (keep last N prices per model per retailer). Move to IndexedDB for >5 MB data

**Benchmark Coverage — Current: 80+ CPUs, 28+ GPUs:**

- Capacity: Can scale to 200 CPUs, 100 GPUs without restructuring
- Limit: Manual data entry for each new CPU/GPU (no scraping, for accuracy). Geekbench/Cinebench data sourced from public aggregates
- Scaling path: Automate CPU/GPU benchmark ingestion from publicly documented sources (Geekbench CSV export, Notebookcheck reviews API if available)

## Dependencies at Risk

**recharts (3.7.0) — Maintenance Status:**

- Risk: Recharts is community-maintained, updates slow (~2/month). d3 dependency chain is large and sometimes has breaking changes in minor versions
- Impact: If d3 has security fix, recharts may lag in integrating it
- Migration plan: For chart components, recharts is well-tested and stable. No immediate action needed. For future small charts, use native SVG + CSS (0 dependencies)

**next (16.1.6) — Major Version Jump:**

- Risk: Recent major version bump. App Router is stable, but edge cases in SSR/streaming may exist
- Impact: If bug discovered in Next.js 16, upgrade path is straightforward (minor versions)
- Mitigation: CI includes full build test. No special concerns

**lucide-react (0.575.0) — Name Collision Risk:**

- Risk: Icon name `Keyboard` shadows `Keyboard` type in `lib/types.ts`
- Impact: Imports must use alias: `import { Keyboard as KeyboardIcon }`
- Workaround: Alias is in place. Similar collisions possible with other icons (Monitor, Battery, Check). No escalation needed
- Future: Document common collisions in CLAUDE.md gotchas

## Test Coverage Gaps

**Model Detail Page Configuration Flow:**

- What's not tested: Processor option selection → score update, RAM/storage selectors, display option switching
- Files: `app/model/[id]/ModelDetailClient.tsx`, `components/models/ConfigSelector.tsx`
- Risk: Config selector could silently fail to update scores if state flow breaks
- Priority: Medium — affects user interaction on high-traffic page

**Price Import/Export Roundtrip:**

- What's not tested: Export prices → modify JSON → import → verify data integrity
- Files: `lib/hooks/usePrices.ts` lines 79–136
- Risk: Malformed export or import logic could lose price history
- Priority: Medium — only affects users who export/backup prices

**Cross-Lineup Comparison Edge Cases:**

- What's not tested: Comparing ThinkPad ultraportable vs Legion gaming rig — chart scaling, legend rendering with 4 models
- Files: `components/charts/PerformanceRadar.tsx`, `components/charts/CpuCompareChart.tsx`, `components/compare/CompareTable.tsx`
- Risk: Layout could overflow on mobile or legend could display incorrectly for cross-lineup comparisons
- Priority: High — affects main feature (compare page)

**Scoring with No Prices:**

- What's not tested: Models with no seed/user prices — value score returns null, but ranking/sorting behavior undefined
- Files: `lib/scoring.ts` (getValueScore), `lib/filters.ts` (sortLaptops)
- Risk: Sorting by "value" or "price" on models with no prices could produce wrong order
- Priority: Medium — edge case, but possible in early usage

**Linux Compat Data Freshness:**

- What's not tested: Certified distros are hardcoded; kernel version recommendations may be stale
- Files: `data/linux-compat.ts` (all entries)
- Risk: Recommendations may be 1–2 years old if not regularly updated
- Priority: Low — informational content, not critical. Consider adding date field to entries

## Missing Critical Features

**Price Freshness Indicator:**

- Problem: No visual signal that a price is stale (>90 days old)
- Blocks: Cannot reliably recommend "good deals" without knowing price staleness
- Impact: Users may rely on outdated pricing
- Fix: Add age badge to price displays; filter out prices older than 180 days in "current market" views

**Deal Expiry Tracking:**

- Problem: Deal highlights have optional `expiryDate`, but no enforcement or notification when expired
- Blocks: `/deals` page may show offers that have ended
- Impact: User frustration when clicking expired links
- Fix: Auto-hide expired deals; add "last verified" badge with date

**A/B Testing Framework for Scoring:**

- Problem: No way to safely test alternative scoring formulas (e.g., higher GPU weight) without affecting all users
- Blocks: Data-driven optimization of score weights impossible
- Impact: Scoring weights are static; improvements require guesswork
- Fix: Add feature flag for scoring variants; run A/B test with metrics (which variant correlates with user model selections)

---

_Concerns audit: 2026-03-13_
