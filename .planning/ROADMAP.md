# Roadmap: LenovoCompare CH v2

## Overview

LenovoCompare CH v2 evolves a stable v1 product into a full static + serverless hybrid. The arc is: ship pure-frontend quick wins and the Cloudflare Workers foundation together (Phase 1), add automated and community pricing write paths (Phase 2), layer in high-value differentiators that are independent of the price backend (Phase 3), collect deep benchmark data in a single batch (Phase 4), activate the price history chart once real data has accumulated (Phase 5), and lock in a full UX and mobile polish pass as the final act (Phase 6). Features dictate the order; UX work follows feature completion to avoid rework.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation** - Comparison quick wins + Cloudflare Workers scaffold with D1 and Price API
- [ ] **Phase 2: Price Automation** - Cron aggregator, community dual-write, frontend price hook integration
- [ ] **Phase 3: Differentiators** - Repairability scores, TCO calculator, scenario-based recommendations
- [ ] **Phase 4: Deep Data** - Display measured values and sustained thermal profiles from NotebookCheck
- [ ] **Phase 5: Price History** - 90-day price history chart activated on real D1 accumulation
- [ ] **Phase 6: UX and Mobile** - Design token system, component polish, mobile UX overhaul

## Phase Details

### Phase 1: Foundation

**Goal**: Users see immediate comparison improvements while the price backend infrastructure is ready to serve data
**Depends on**: Nothing (first phase)
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, PRIC-01, PRIC-02, PRIC-03, PRIC-04, PRIC-05, INFR-01, INFR-02, INFR-03, INFR-04
**Success Criteria** (what must be TRUE):

1. User can toggle "show differences only" in compare table and non-differing rows are hidden
2. User can see a CSS-scaled physical dimensions overlay when comparing models (width, depth, height, weight proportionally rendered)
3. Every benchmark score in BenchmarksSection is a clickable link to its source page; scores lacking a source are labeled "source needed"
4. GET /api/prices returns CHF prices from D1 for all models, seeded from existing seed-prices.ts data
5. Cloudflare Pages deployment is live at the configured domain with Workers and static site served from a single origin (no CORS)
   **Plans**: TBD

### Phase 2: Price Automation

**Goal**: Prices update automatically each week from Lenovo.com/ch and community submissions persist in D1 alongside automated data
**Depends on**: Phase 1
**Requirements**: AUTO-01, AUTO-02, AUTO-03, AUTO-04, AUTO-05, COMM-01, COMM-02, COMM-03
**Success Criteria** (what must be TRUE):

1. Cron job runs weekly and writes Lenovo.com/ch CHF prices to D1; a single failed source does not abort the run
2. User can submit a price via the existing form and it is written to both localStorage and D1
3. Community-submitted prices appear alongside automated prices with a source label distinguishing them
4. Model detail pages and the deals page show live D1 prices; localStorage prices continue to work as offline fallback
5. Cron execution history is visible in D1 fetch_log for debugging failed runs
   **Plans**: TBD

### Phase 3: Differentiators

**Goal**: Swiss buyers can evaluate total cost of ownership and repairability, and find the best model for their use case without manually scanning all 124 models
**Depends on**: Phase 1 (model detail page structure stable)
**Requirements**: REPR-01, REPR-02, REPR-03, REPR-04, TCO-01, TCO-02, TCO-03, TCO-04, SCEN-01, SCEN-02, SCEN-03, SCEN-04
**Success Criteria** (what must be TRUE):

1. iFixit repairability score appears on model detail page with a link to the iFixit source; models without data show "No iFixit score" rather than zero
2. Repairability score is visible as a row in the compare table for side-by-side evaluation
3. TCO calculator on model detail page computes 1-year, 3-year, and 5-year totals from purchase price, warranty cost, and dock/accessories inputs
4. Repairability score modulates the estimated repair cost in the TCO calculation
5. Scenario Finder ranks all models against at least 6 predefined use cases (Developer, Student, Creative Pro, Business Travel, Gaming, Budget) filterable by lineup and CHF budget
   **Plans**: TBD

### Phase 4: Deep Data

**Goal**: Buyers evaluating creative or thermal-sensitive workloads can see measured display quality and real sustained performance data with cited sources
**Depends on**: Phase 1 (BenchmarksSection structure stable)
**Requirements**: DISP-01, DISP-02, DISP-03, DISP-04, PERF-01, PERF-02, PERF-03, PERF-04
**Success Criteria** (what must be TRUE):

1. Model detail page shows a Display Deep-Dive card with measured Delta E, sRGB coverage, P3 coverage, brightness nits, and PWM frequency sourced from NotebookCheck; models without measured data are labeled "spec-only"
2. Display metrics appear as rows in the compare table for side-by-side comparison
3. Model detail page shows a Thermal Profile card with sustained CPU/GPU wattage and throttling class alongside existing fan noise labels
4. Every new display and thermal data field has at least one source URL citation (enforced at build time)
   **Plans**: TBD

### Phase 5: Price History

**Goal**: Buyers can see whether a model's price is trending up, down, or stable over the past 90 days before making a purchase decision
**Depends on**: Phase 2 (D1 must have accumulated 4+ weeks of weekly snapshots)
**Requirements**: HIST-01, HIST-02, HIST-03, HIST-04
**Success Criteria** (what must be TRUE):

1. Model detail pages show a 90-day price history chart with min, max, and current price markers when at least 2 D1 snapshots exist
2. Models with fewer than 2 snapshots show a "no history yet" state rather than a broken or empty chart
3. Deals page and model detail badge shows "Price dropped since last week" when applicable
   **Plans**: TBD

### Phase 6: UX and Mobile

**Goal**: Every page feels polished and consistent; mobile users can filter, compare, and read model detail pages without friction
**Depends on**: Phase 5 (all features locked before touching shared components)
**Requirements**: UX-01, UX-02, UX-03, UX-04, UX-05, MOB-01, MOB-02, MOB-03, MOB-04
**Success Criteria** (what must be TRUE):

1. A CSS custom property token system defines spacing, typography scale, and color palette consistently across all pages
2. Mobile filter panel slides in as a drawer rather than a dropdown; compare add/remove interactions are touch-friendly
3. Mobile model detail page stacks sections clearly with no horizontal scroll on charts at any viewport width
4. Lighthouse accessibility and performance scores on mobile do not regress from Phase 5 baseline for any page type
   **Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase               | Plans Complete | Status      | Completed |
| ------------------- | -------------- | ----------- | --------- |
| 1. Foundation       | 0/TBD          | Not started | -         |
| 2. Price Automation | 0/TBD          | Not started | -         |
| 3. Differentiators  | 0/TBD          | Not started | -         |
| 4. Deep Data        | 0/TBD          | Not started | -         |
| 5. Price History    | 0/TBD          | Not started | -         |
| 6. UX and Mobile    | 0/TBD          | Not started | -         |
