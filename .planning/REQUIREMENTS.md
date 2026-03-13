# Requirements: LenovoCompare CH v2

**Defined:** 2026-03-13
**Core Value:** When someone in Switzerland needs to compare Lenovo laptops, this tool gives them the clearest, most data-driven answer — with real prices, real benchmarks, and real differences explained.

## v1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Comparison Enhancement

- [ ] **COMP-01**: User can toggle "show differences only" in compare table to highlight specs that differ between selected models
- [ ] **COMP-02**: User can see CSS-scaled physical size overlay showing relative width, depth, height, and weight of compared models
- [ ] **COMP-03**: Every benchmark score in BenchmarksSection links to its source page (NotebookCheck, Geekbench, Cinebench)
- [ ] **COMP-04**: Missing benchmark sources are flagged as "source needed" in the UI rather than shown without attribution

### Price Infrastructure

- [ ] **PRIC-01**: Cloudflare Workers project scaffolded with Hono, D1 database, and wrangler config
- [ ] **PRIC-02**: D1 schema stores price snapshots with model ID, source, CHF amount, and fetch timestamp
- [ ] **PRIC-03**: GET /api/prices endpoint returns current prices for all models from D1
- [ ] **PRIC-04**: Existing seed-prices.ts data seeded into D1 as initial dataset
- [ ] **PRIC-05**: Frontend useRemotePrices hook fetches from Workers API and merges with localStorage prices

### Price Automation

- [ ] **AUTO-01**: Cloudflare Workers cron trigger runs weekly to fetch prices from configured sources
- [ ] **AUTO-02**: Lenovo.com/ch price parser extracts CHF prices from JSON-LD PriceSpecification on product pages
- [ ] **AUTO-03**: Each price source is an isolated adapter — one source failing does not abort the cron run
- [ ] **AUTO-04**: Cron execution logs stored in D1 fetch_log table for debugging
- [ ] **AUTO-05**: Value score merge strategy defined — automated prices take precedence over stale seed prices

### Community Pricing

- [ ] **COMM-01**: POST /api/prices/community endpoint accepts user-submitted prices with retailer and note
- [ ] **COMM-02**: Community-submitted prices displayed alongside automated prices with source label
- [ ] **COMM-03**: localStorage price contributions continue to work as fallback when offline

### Price History

- [ ] **HIST-01**: Price history chart shows 90-day price trend per model using D1 snapshots
- [ ] **HIST-02**: Chart displays min, max, and current price markers
- [ ] **HIST-03**: Chart is gated — only renders when model has 2+ price data points in D1
- [ ] **HIST-04**: "Price dropped since last week" badge shown on deals page and model detail when applicable

### Repairability

- [ ] **REPR-01**: iFixit repairability scores mapped to all 124 model IDs (where iFixit data exists)
- [ ] **REPR-02**: Repairability score displayed on model detail page with link to iFixit source
- [ ] **REPR-03**: Repairability score shown in compare table as a new row
- [ ] **REPR-04**: Models without iFixit data show "No iFixit score" rather than zero

### TCO Calculator

- [ ] **TCO-01**: TCO calculator on model detail page computes 1-year, 3-year, and 5-year total cost
- [ ] **TCO-02**: TCO inputs: purchase price (from prices), warranty tier (CHF/year), dock/accessories (CHF), expected repair costs
- [ ] **TCO-03**: Repairability score modulates estimated repair cost (high repairability = lower annual repair estimate)
- [ ] **TCO-04**: TCO comparison available in compare view for side-by-side cost analysis

### Scenario Recommendations

- [ ] **SCEN-01**: Scenario Finder page/mode takes user inputs (budget, primary use, portability need) and ranks models
- [ ] **SCEN-02**: At least 6 predefined scenarios: Developer, Student, Creative Pro, Business Travel, Gaming, Budget
- [ ] **SCEN-03**: Each scenario weights scoring dimensions differently and explains the weighting rationale
- [ ] **SCEN-04**: Results filterable by lineup and budget range in CHF

### Display Deep-Dive

- [ ] **DISP-01**: ModelBenchmarks extended with measured display data: Delta E, sRGB coverage, P3 coverage, typical brightness nits, PWM frequency
- [ ] **DISP-02**: Display deep-dive card on model detail page showing measured values with source citations
- [ ] **DISP-03**: Models without measured display data flagged as "spec-only" (not fabricated)
- [ ] **DISP-04**: Display metrics shown in compare table for side-by-side comparison

### Sustained Performance

- [ ] **PERF-01**: ModelBenchmarks extended with sustained performance data: sustained CPU watts, sustained GPU watts, peak CPU watts, throttling class
- [ ] **PERF-02**: Thermal profile card on model detail showing sustained vs peak performance with throttling context
- [ ] **PERF-03**: Fan noise context labels (silent/audible/loud) shown alongside thermal data
- [ ] **PERF-04**: Sustained performance data sourced from NotebookCheck/LaptopMedia stress tests with citations

### UX Overhaul

- [ ] **UX-01**: Design token system established — consistent spacing, typography scale, color palette across all pages
- [ ] **UX-02**: Component-level polish — cards, buttons, inputs, tables refined for visual consistency
- [ ] **UX-03**: Navigation flow improved — fewer clicks to compare, clearer information hierarchy
- [ ] **UX-04**: Progressive disclosure — summary first, expandable detail sections for power users
- [ ] **UX-05**: Animation refinement — purposeful motion with LazyMotion, remove gratuitous transitions

### Mobile UX

- [ ] **MOB-01**: Drawer-based filter panel on mobile (slide-in, not dropdown)
- [ ] **MOB-02**: Touch-friendly compare add/remove interactions
- [ ] **MOB-03**: Mobile-optimized model detail page — stacked sections with clear visual breaks
- [ ] **MOB-04**: Responsive charts — scale correctly on all viewports without horizontal scroll

### Infrastructure

- [ ] **INFR-01**: Cloudflare Pages deployment configured (replace GitHub Pages)
- [ ] **INFR-02**: Workers + static site served from single Cloudflare domain (no CORS)
- [ ] **INFR-03**: GitHub Actions CI updated for wrangler deploy
- [ ] **INFR-04**: Playwright smoke test validates static export before deploy

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Price Sources

- **PSRC-01**: Toppreise.ch price integration (pending API access confirmation)
- **PSRC-02**: Google Shopping price aggregation (requires investigation)
- **PSRC-03**: Additional Swiss retailer affiliate feeds

### Platform

- **PLAT-01**: Virtual list rendering for large model grid (react-window or CSS contain)
- **PLAT-02**: PWA with offline support
- **PLAT-03**: URL-shareable TCO calculations

## Out of Scope

| Feature                              | Reason                                                                      |
| ------------------------------------ | --------------------------------------------------------------------------- |
| Retailer web scraping                | TOS violation, Swiss UWG legal risk, bot detection                          |
| Real-time price alerts               | Requires user accounts + push infra, conflicts with local-first principle   |
| AI/LLM-generated recommendations     | Deterministic scoring is a trust feature; LLM adds cost and variability     |
| Non-Lenovo brands                    | Breaks data model, Swiss Lenovo niche is the competitive moat               |
| User accounts / authentication       | Massive complexity, GDPR burden, unnecessary for feature set                |
| User-submitted benchmarks in scoring | Quality control impossible; mixing verified and unverified data kills trust |
| Infinite scroll                      | Breaks URL state sharing, accessibility, filter interaction                 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase   | Status  |
| ----------- | ------- | ------- |
| COMP-01     | Phase 1 | Pending |
| COMP-02     | Phase 1 | Pending |
| COMP-03     | Phase 1 | Pending |
| COMP-04     | Phase 1 | Pending |
| PRIC-01     | Phase 1 | Pending |
| PRIC-02     | Phase 1 | Pending |
| PRIC-03     | Phase 1 | Pending |
| PRIC-04     | Phase 1 | Pending |
| PRIC-05     | Phase 1 | Pending |
| AUTO-01     | Phase 2 | Pending |
| AUTO-02     | Phase 2 | Pending |
| AUTO-03     | Phase 2 | Pending |
| AUTO-04     | Phase 2 | Pending |
| AUTO-05     | Phase 2 | Pending |
| COMM-01     | Phase 2 | Pending |
| COMM-02     | Phase 2 | Pending |
| COMM-03     | Phase 2 | Pending |
| HIST-01     | Phase 5 | Pending |
| HIST-02     | Phase 5 | Pending |
| HIST-03     | Phase 5 | Pending |
| HIST-04     | Phase 5 | Pending |
| REPR-01     | Phase 3 | Pending |
| REPR-02     | Phase 3 | Pending |
| REPR-03     | Phase 3 | Pending |
| REPR-04     | Phase 3 | Pending |
| TCO-01      | Phase 3 | Pending |
| TCO-02      | Phase 3 | Pending |
| TCO-03      | Phase 3 | Pending |
| TCO-04      | Phase 3 | Pending |
| SCEN-01     | Phase 3 | Pending |
| SCEN-02     | Phase 3 | Pending |
| SCEN-03     | Phase 3 | Pending |
| SCEN-04     | Phase 3 | Pending |
| DISP-01     | Phase 4 | Pending |
| DISP-02     | Phase 4 | Pending |
| DISP-03     | Phase 4 | Pending |
| DISP-04     | Phase 4 | Pending |
| PERF-01     | Phase 4 | Pending |
| PERF-02     | Phase 4 | Pending |
| PERF-03     | Phase 4 | Pending |
| PERF-04     | Phase 4 | Pending |
| UX-01       | Phase 6 | Pending |
| UX-02       | Phase 6 | Pending |
| UX-03       | Phase 6 | Pending |
| UX-04       | Phase 6 | Pending |
| UX-05       | Phase 6 | Pending |
| MOB-01      | Phase 6 | Pending |
| MOB-02      | Phase 6 | Pending |
| MOB-03      | Phase 6 | Pending |
| MOB-04      | Phase 6 | Pending |
| INFR-01     | Phase 1 | Pending |
| INFR-02     | Phase 1 | Pending |
| INFR-03     | Phase 1 | Pending |
| INFR-04     | Phase 1 | Pending |

**Coverage:**

- v1 requirements: 53 total
- Mapped to phases: 53
- Unmapped: 0

---

_Requirements defined: 2026-03-13_
_Last updated: 2026-03-13 after roadmap creation — all 53 requirements mapped_
