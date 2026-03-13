# Feature Research

**Domain:** Laptop comparison tool — Swiss market, single-brand focus (Lenovo), static + serverless hybrid
**Researched:** 2026-03-13
**Confidence:** HIGH (comparison UX patterns — Baymard, NN/g, RTINGS); HIGH (iFixit repairability data availability); MEDIUM (price source legality — Toppreise read API unconfirmed); HIGH (Cloudflare Workers free tier limits)

---

## Baseline: What v1 Already Ships

Before classifying features, these are DONE in v1 — they are not scope for this milestone:

- Browse + filter 124 models across 4 lineups
- 6-dimension scoring (CPU, GPU, Display, Memory, Connectivity, Portability)
- Side-by-side compare of 2–4 models with radar + dimension charts
- Model detail pages with specs, benchmarks, analysis, editorial
- ConfigSelector (what-if CPU/GPU/RAM/display scoring)
- User-contributed pricing via localStorage + seed price baseline
- Auto-generated pros/cons, use cases, upgrade paths, gaming tier
- CPU (Cinebench, Geekbench) + GPU (Time Spy) benchmark data
- Per-model thermal, battery, fan noise, SSD speed data
- Linux compatibility for all 124 models
- Swiss retailer search links (Digitec, Brack, Toppreise, Ricardo, Tutti)
- Deals page with buy signals (buy-now, good-deal, hold, wait)
- Mobile-responsive compare with swipeable cards
- Dark Carbon Design System theme

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these makes the product feel broken or untrustworthy.

| Feature                                     | Why Expected                                                                                                                                                                                                                                                       | Complexity | Notes                                                                                                                                                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Specs diff highlighting in compare view     | Industry standard since 2015 (Best Buy, RTINGS, Versus all do it). Users comparing 3–4 models cannot manually spot differences across 20 rows. Without it, the compare table is just a wall of text.                                                               | LOW        | Pure frontend. computeSpecsDiff() is a pure function over existing static data. No backend needed. Highlight rows where values differ; add "only show differences" toggle.                                    |
| Current prices from an authoritative source | Community localStorage prices feel provisional. Users expect prices to reflect today's market, not what someone entered 6 months ago. A comparison tool that only shows "maybe CHF 1,299" loses trust.                                                             | HIGH       | Cloudflare Workers cron (weekly). Lenovo.com/ch product pages have JSON-LD PriceSpecification. Toppreise read access unconfirmed — treat as MEDIUM risk. Community prices preserved alongside automated data. |
| Physical size context                       | 14" ThinkPad vs 16" Legion — users cannot visualise size without numbers. Every major review site (NotebookCheck, LaptopMedia, RTINGS) includes W × D × H × weight. In a compare view, users expect visual confirmation that "14" is noticeably smaller than 16"". | LOW        | Data already in laptops.ts (width, depth, height, weight). Need a CSS-scaled rectangle overlay component. No backend.                                                                                         |
| Cited benchmark sources                     | "Score: 72" with no source is not trustworthy for IT procurement buyers. NotebookCheck, Geekbench, and Cinebench scores should link to the review or test page they came from. v1 has `BenchmarkSource` type but sourcing is inconsistent.                         | LOW        | data/ files already have source fields on some entries. Audit and backfill citations. Add inline source links to BenchmarksSection.                                                                           |
| Mobile-usable filter and compare flow       | 60%+ of initial browsing on comparison tools happens on mobile. If filters require horizontal scroll or compare selection breaks on small viewports, users bounce. v1 has swipeable compare cards but filter bar needs work.                                       | MEDIUM     | Primarily CSS/UX work. Drawer-based filter panel on mobile (slide-in, not dropdown). Touch-friendly comparison add/remove.                                                                                    |

### Differentiators (Competitive Advantage)

Features that set this tool apart. Not standard on laptop comparison sites; valued by the target audience (Swiss tech buyers, IT procurement, developers).

| Feature                                                   | Value Proposition                                                                                                                                                                                                                                                                                                                                                            | Complexity | Notes                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Repairability score (iFixit data)                         | No mainstream laptop comparison site surfaces repairability. ThinkPads are famous for repairability (T14 Gen 7 and T16 Gen 5 scored 10/10 iFixit); Legion/Yoga vary significantly. For IT procurement, repairability drives 3–5 year TCO. This is unique signal in the Swiss market.                                                                                         | MEDIUM     | iFixit publishes a downloadable CSV of all scored models and a public repairability page per model (ifixit.com/repairability/laptop-repairability-scores). Lenovo has a dedicated iFixit partnership page. Map iFixit scores to laptopId. Add to model detail and compare table. 60–70% of current 124 models likely have iFixit data (ThinkPad coverage is near-complete; Legion/Yoga less so). |
| TCO calculator (3–5 year cost)                            | Swiss IT procurement cares about total cost, not sticker price. CHF 1,800 ThinkPad with 3-year warranty + CRU repairability may cost less over 5 years than CHF 1,200 IdeaPad Pro with no warranty and sealed RAM. No other Swiss Lenovo comparison tool offers this.                                                                                                        | MEDIUM     | Pure frontend, extends scoring engine. Inputs: purchase price (from seed/remote prices), warranty tier (CHF/year), dock/accessories (CHF one-time), expected replacement parts. Outputs: year-1, year-3, year-5 cost. URL-shareable state. Extracts to lib/tco.ts to keep scoring.ts clean.                                                                                                      |
| Display deep-dive (measured data)                         | Most tools show display specs (resolution, panel type). Few show measured data: Delta E (color accuracy), nits at real content brightness, PWM flicker frequency, sRGB/P3 coverage as percentages. NotebookCheck and LaptopMedia measure these but don't surface them in a comparison. Creative professionals and developers buying for content work specifically need this. | HIGH       | Source from NotebookCheck reviews (already partially in model-benchmarks.ts). Requires data collection pass across all 124 models — many older models lack measured display data. Add new fields to ModelBenchmarks type: deltaE, sRGBCoverage, displayP3Coverage, nitsAtTypical, pwmFrequency. Flag models with no measured data (show "spec-only").                                            |
| Thermal + sustained performance profiles                  | "Max turbo" CPU speed is marketing. What matters is sustained performance under 10–30 minute load (the realistic workday scenario). LaptopMedia and NotebookCheck publish stress test data but present it buried in lengthy reviews. Surfacing sustained vs peak wattage and throttling tier is a differentiator for developers and power users.                             | MEDIUM     | Data partially exists in model-benchmarks.ts (thermals, fanNoise fields). Extend with: sustainedCpuWatts, sustainedGpuWatts, peakCpuWatts, throttlingClass ("aggressive"                                                                                                                                                                                                                         | "moderate" | "minimal"). Source from LaptopMedia cooling article methodology + community estimates. Add ThermalProfile card to model detail. |
| Scenario-based recommendations                            | "Best for dev work", "Best for students", "Best portable under CHF 1,500" — curated, scored recommendations with explicit reasoning. RTINGS does this per-category (best for programming, etc.) but for all brands. Doing this for Lenovo-only with Swiss pricing signals is unique and high-value for first-time buyers.                                                    | MEDIUM     | v1 already has UseCaseScenario / getScenarioVerdicts in lib/analysis.ts. Extend: add a "Scenario Finder" page or filter mode that takes use-case inputs (budget, primary use, portability need) and ranks models. The scoring is already deterministic — the scenario layer just weights dimensions differently.                                                                                 |
| Price history chart                                       | No Swiss Lenovo comparison tool shows price trends over time. Once the Cloudflare D1 price store accumulates 4–8 weeks of weekly snapshots, this becomes possible. For buyers waiting for a sale, "price dropped CHF 200 last month" is highly actionable.                                                                                                                   | MEDIUM     | Requires price backend (Cloudflare Workers + D1) to have run for 4+ weeks. Recharts ScatterChart or LineChart (already in codebase) can render the time series. Show min, max, current with a 90-day window. Block on price automation phase completing.                                                                                                                                         |
| Community price submissions preserved with automated data | Crowdsourced pricing for retailer-specific prices (Digitec deals, Ricardo second-hand) that automated sources can't capture. Keeps the Swiss-specific pricing advantage v1 already has while adding automation on top.                                                                                                                                                       | LOW        | Architecture already designed: POST /api/prices/community (Workers) + keep localStorage write. Community prices shown alongside automated prices with source labels.                                                                                                                                                                                                                             |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create specific problems in this context.

| Feature                                          | Why Requested                                                                                   | Why Problematic                                                                                                                                                                                                                                                                                                                                      | Alternative                                                                                                                                                                                                           |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Real-time price tracking / push alerts           | Users want to know the instant a price drops. Feels like a natural extension of price tracking. | Requires user accounts, push notification infrastructure, persistent sessions — all of which conflict with the "local-first, no auth" principle. Cloudflare Workers free cron fires weekly, not real-time. Real-time would require a paid Durable Objects setup with WebSocket persistence.                                                          | Weekly price snapshot with a "price dropped since last week" badge is sufficient and achievable on free tier.                                                                                                         |
| Retailer scraping (Digitec, Brack, Toppreise)    | These retailers have the most competitive Swiss prices. Automated tracking would be valuable.   | TOS violation. Digitec actively blocks scraping (Cloudflare bot protection, IP rotation detection). Legal risk under Swiss UWG (unfair competition law). Cloudflare shared IP ranges get banned, affecting all users.                                                                                                                                | Use legal sources only: Lenovo.com/ch (JSON-LD), Toppreise only if they offer a read API to comparison tools, community contributions for retailer-specific prices.                                                   |
| AI/LLM-generated recommendations                 | "Ask the AI which ThinkPad is best for me" is trendy.                                           | Scoring is deterministic and transparent — this is a trust feature. LLM outputs vary run-to-run, cannot be audited, and hallucinate specs. An IT procurement buyer who finds one wrong spec loses all trust. Adds significant bundle weight or API latency. Also conflicts with the project constraint "keep scoring deterministic and transparent." | Rule-based scenario matching (see Scenario-based recommendations above). Transparent, reproducible, zero cost.                                                                                                        |
| Non-Lenovo brand comparison                      | Users sometimes ask "how does this compare to a Dell XPS?"                                      | Breaks the entire data model. Adding even one other brand requires either a different data schema or artificial normalization that misleads comparisons. The Swiss + Lenovo niche is the product's competitive moat.                                                                                                                                 | Add a disclaimer and outbound link to a general comparison tool (RTINGS, Versus) for cross-brand comparison.                                                                                                          |
| User accounts / authentication                   | Some features (saved comparisons, price alert preferences) seem to need accounts.               | Massive complexity addition. Auth infrastructure is overkill for a portfolio/hobby project. Introduces GDPR compliance burden in Switzerland.                                                                                                                                                                                                        | URL-shareable compare state (encode selection in URL params). localStorage for persistence. sessionStorage for tab-level state. These cover 95% of the use cases without auth.                                        |
| Infinite scroll / full model pagination          | The 124-model grid is large; infinite scroll feels modern.                                      | Breaks URL-based filter state sharing. Breaks accessibility (keyboard navigation, focus management). Complicates filter + sort interaction. RTINGS and NotebookCheck use explicit pagination or virtual scroll, not infinite scroll.                                                                                                                 | Virtual list rendering (react-window or native CSS contain) for performance. Keep explicit page count or show-all. Filters reduce the visible set significantly anyway.                                               |
| Real-time benchmark comparisons (user-submitted) | Crowdsourced benchmark data sounds like a natural extension of community pricing.               | Benchmark data quality requires verification. User-submitted Cinebench scores are highly variable (background processes, thermal state, OS version). Presenting unverified scores alongside review-sourced scores destroys trust.                                                                                                                    | Curate benchmarks from NotebookCheck/Geekbench/LaptopMedia with source citations. Accept community reports as "unverified" and display with a warning badge — but don't mix with reviewed data in the scoring engine. |

---

## Feature Dependencies

```
Automated Price Fetching (Cloudflare Workers + D1)
    └──enables──> Community Price Dual-Write (POST /api/prices/community)
    └──enables──> Price History Chart (requires 4+ weeks of snapshots)
    └──enhances──> Deals Page (live prices vs baselines)
    └──enhances──> TCO Calculator (live purchase price as input)

Specs Diff Highlighting
    └──independent (pure frontend, existing data)

Physical Size Overlay
    └──independent (pure frontend, existing laptops.ts width/depth/height fields)

iFixit Repairability Score
    └──enables/enhances──> TCO Calculator (repairability score affects long-term cost)
    └──requires──> Data collection pass (map iFixit scores to all 124 model IDs)

Display Deep-Dive (measured data)
    └──requires──> Data collection pass (source Delta-E, nits, PWM from NotebookCheck per model)
    └──independent (no backend dependency)

TCO Calculator
    └──enhanced by──> Automated Price Fetching (live purchase price)
    └──enhanced by──> iFixit Repairability Score (repair cost modelling)
    └──independent in MVP (can use seed prices + manual price input)

Scenario-Based Recommendations
    └──built on──> Existing scoring engine (getModelScores, getScenarioVerdicts)
    └──enhanced by──> Automated Price Fetching (budget filter uses real prices)
    └──independent (can ship with seed prices)

Sustained Performance Profiles
    └──independent (extends model-benchmarks.ts, no backend)

Thermal + Display deep-dive
    └──share──> Data collection tooling (same NotebookCheck pass covers both)

UX Overhaul
    └──should land AFTER──> Features above stabilize
    └──applies to all──> compare, model detail, deals, home grid
    └──blocks──> mobile UX improvement (both are UX scope, do together)
```

### Dependency Notes

- **Price History Chart requires Automated Price Fetching:** The chart has nothing to display until D1 accumulates weekly snapshots. Ship the chart component early but gate the display on "at least 2 data points exist."
- **TCO Calculator enhanced by iFixit data:** The repairability score can modulate the "repair cost" assumption in the TCO model (high repairability = lower estimated repair cost per year). Build TCO first with manual inputs; add iFixit modulation once repairability data is in.
- **Display deep-dive and Thermal profiles share data collection work:** Both require a manual or semi-automated pass through NotebookCheck reviews for all 124 models. Batch this work — do both in the same data phase.
- **UX overhaul conflicts with feature shipping:** Doing a full visual overhaul while features are still changing causes rework. Feature-complete first, then polish.

---

## MVP Definition

This milestone is an enhancement to an existing v1 product, not a green-field launch. "MVP" here means: minimum set of new features that deliver the stated milestone value without the full scope.

### Ship First (High Value, Low Risk)

- [x] Specs diff highlighting in compare view — high user value, pure frontend, 1–2 days. Immediate win visible on the existing compare page.
- [x] Physical size overlay in compare view — high user value, pure frontend, 1–2 days. Leverages existing dimension data.
- [x] Benchmark source citations — trust-building, mostly data work, 1 day. Backfill sources in model-benchmarks.ts and surface links in BenchmarksSection.
- [x] Cloudflare Workers scaffold + D1 schema + Price API Worker (read path) — foundation for all price features. Seed D1 from existing seed-prices.ts so the API serves real data immediately.
- [x] useRemotePrices() integration — front-end hook already exists; point it at Workers API. Deals and Model pages get live prices with zero design changes.

### Add After Scaffolding Stabilizes

- [ ] Cron Aggregator Worker (Lenovo.com/ch parser) — automated price collection begins. This is the hardest backend piece.
- [ ] iFixit repairability score data collection + display — data pass for all 124 models, then surface in model detail and compare table.
- [ ] TCO calculator — pure frontend, high value for IT procurement audience. Build lib/tco.ts, add TCO card to model detail.
- [ ] Scenario-based recommendation mode — extends existing analysis.ts; add Scenario Finder page.

### Defer Until Features Stable

- [ ] Price history chart — requires 4+ weeks of D1 data accumulation. Build component skeleton early; activate when data exists.
- [ ] Display deep-dive (measured Delta E, nits, PWM) — data collection across 124 models is the bottleneck. High quality, high effort.
- [ ] Sustained performance profiles — same data collection bottleneck as display deep-dive. Batch with display data pass.
- [ ] Full UX overhaul — last phase. Touch every component after features are locked.
- [ ] Toppreise price source in Cron Aggregator — treat as V2.x; Toppreise API access unconfirmed.

---

## Feature Prioritization Matrix

| Feature                                               | User Value                        | Implementation Cost      | Priority |
| ----------------------------------------------------- | --------------------------------- | ------------------------ | -------- |
| Specs diff highlighting                               | HIGH                              | LOW                      | P1       |
| Physical size overlay                                 | HIGH                              | LOW                      | P1       |
| Benchmark source citations                            | HIGH (trust)                      | LOW                      | P1       |
| Cloudflare Workers scaffold + D1                      | HIGH (enables all price features) | MEDIUM                   | P1       |
| Price API Worker (read) + useRemotePrices integration | HIGH                              | LOW (scaffolding done)   | P1       |
| Cron Aggregator (Lenovo.com/ch)                       | HIGH                              | HIGH                     | P1       |
| iFixit repairability score                            | HIGH (differentiator)             | MEDIUM                   | P2       |
| TCO calculator                                        | HIGH (IT procurement)             | MEDIUM                   | P2       |
| Scenario-based recommendations                        | MEDIUM–HIGH                       | MEDIUM                   | P2       |
| Community price dual-write to D1                      | MEDIUM                            | LOW (API path done)      | P2       |
| Price history chart                                   | MEDIUM                            | MEDIUM                   | P2       |
| Display deep-dive (measured)                          | HIGH (creative professionals)     | HIGH (data collection)   | P2       |
| Sustained thermal profiles                            | MEDIUM                            | MEDIUM (data collection) | P3       |
| Full UX overhaul                                      | HIGH (portfolio signal)           | HIGH                     | P3       |
| Mobile UX improvement                                 | HIGH                              | MEDIUM                   | P3       |

**Priority key:**

- P1: Must have for this milestone — core functionality or blocking dependency
- P2: Should have — differentiators that justify the milestone
- P3: Nice to have — polish and depth, add when P1/P2 are stable

---

## Competitor Feature Analysis

| Feature                                | RTINGS.com                                  | Versus.com        | NotebookCheck                    | Our Approach                                                            |
| -------------------------------------- | ------------------------------------------- | ----------------- | -------------------------------- | ----------------------------------------------------------------------- |
| Side-by-side compare                   | Yes — up to unlimited, tabbed UX            | Yes — card-based  | No dedicated compare tool        | Yes — up to 4 models, radar + charts                                    |
| Specs diff highlighting                | Yes — "Show differences" toggle             | No                | No                               | Build: "Only show differences" toggle + colored highlighting            |
| Physical size overlay                  | No                                          | No                | Specs table only                 | Build: CSS-scaled rectangle overlay in compare view                     |
| Repairability data                     | No                                          | No                | Mentioned in reviews, not scored | Build: iFixit score per model, sourced from iFixit CSV                  |
| TCO calculator                         | No                                          | No                | No                               | Build: 3-year/5-year cost with warranty + accessories                   |
| Automated prices                       | Yes — affiliate links (Amazon, Best Buy)    | Yes — price range | Review benchmarks only           | Build: Weekly Cloudflare Worker, CHF only, Lenovo.com/ch                |
| Price history                          | No                                          | No                | No                               | Build: 90-day chart once D1 accumulates data                            |
| Scenario recommendations               | Yes — "Best for programming" category pages | No                | No                               | Build: score-weighted scenario mode for use cases                       |
| Display deep-dive (Delta E, nits, PWM) | Yes — measured, authoritative               | No                | Yes — in reviews, not comparable | Build: measured values sourced from NotebookCheck, surfaced in compare  |
| Thermal / sustained perf               | Yes — measured stress tests                 | No                | Yes — in reviews                 | Build: summarised throttling tier + sustained wattage data              |
| Swiss market focus                     | No                                          | No                | No                               | Unique: CHF pricing, Swiss retailers, de-CH locale                      |
| Single-brand depth                     | No                                          | No                | No                               | Unique: 124 Lenovo models with editorial, Linux compat, config variants |

---

## Sources

- [Baymard Institute: 4 Ways to Optimize the Comparison Feature for Scanning](https://baymard.com/blog/user-friendly-comparison-tools) — HIGH confidence, UX research with user testing
- [NN/g: Comparison Tables for Products, Services, and Features](https://www.nngroup.com/articles/comparison-tables/) — HIGH confidence, canonical UX reference
- [RTINGS.com Laptop Comparison Tool](https://www.rtings.com/laptop/tools/compare) — HIGH confidence, direct competitor analysis
- [Versus.com Laptop Comparison](https://versus.com/en/laptop) — HIGH confidence, direct competitor analysis
- [iFixit: How Repairability Scores Are Calculated](https://www.ifixit.com/News/75533/how-ifixit-scores-repairability) — HIGH confidence, official iFixit methodology
- [iFixit: Laptop Repairability Scores (downloadable CSV)](https://www.ifixit.com/repairability/laptop-repairability-scores) — HIGH confidence, primary data source
- [iFixit: Lenovo ThinkPad T14 Gen 7 and T16 Gen 5 — 10/10 repairability](https://www.ifixit.com/News/115827/new-thinkpads-score-perfect-10-repairability) — HIGH confidence, official iFixit announcement
- [Lenovo + iFixit partnership page](https://www.ifixit.com/lenovo) — HIGH confidence, official partnership
- [NotebookCheck: Display and Thermal Testing Methodology](https://www.notebookcheck.net/How-does-Notebookcheck-test-laptops-and-smartphones-A-behind-the-scenes-look-into-our-review-process.15394.0.html) — HIGH confidence, official methodology
- [DXOMARK Laptop Display Test Protocol](https://www.dxomark.com/dxomark-laptop-test-protocol/) — HIGH confidence, official methodology
- [LaptopMedia: Top Laptops with Best Screens](https://laptopmedia.com/top-100-laptops-with-the-best-screens/) — MEDIUM confidence, industry source
- [Cloudflare Workers Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) — HIGH confidence, official docs
- [Cloudflare D1 Pricing and Limits](https://developers.cloudflare.com/d1/platform/limits/) — HIGH confidence, official docs
- [Toppreise.ch dealer registration](https://www.toppreise.ch/dealer-registration) — MEDIUM confidence; no public read API confirmed for non-merchants
- ARCHITECTURE.md in .planning/research/ — HIGH confidence for Cloudflare integration patterns

---

_Feature research for: LenovoCompare CH v2 — laptop comparison tool, Swiss market, Lenovo focus_
_Researched: 2026-03-13_
