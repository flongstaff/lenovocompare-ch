# Project Research Summary

**Project:** LenovoCompare CH v2
**Domain:** Static + serverless hybrid — Swiss laptop comparison tool with price aggregation backend
**Researched:** 2026-03-13
**Confidence:** MEDIUM-HIGH (stack and architecture HIGH; price source legality LOW; UX patterns HIGH)

## Executive Summary

LenovoCompare CH v2 is an evolution of an existing, stable v1 product rather than a greenfield build. The core strategic move is adding a Cloudflare Workers backend for price aggregation while the Next.js static frontend stays intact. Research confirms a "static-first, remote-enhanced" pattern is correct: the site must work offline from TypeScript constants and seed prices, with the Workers API enriching the experience when reachable. This resilience principle must be baked into every feature that touches the backend — the frontend can never block on an API call.

The recommended approach is additive conservatism: do not replace recharts (rewrite cost exceeds benefit), do not upgrade to Tailwind v4 or React 19 (breaking changes mid-feature-work), and do not add a component library (conflicts with the Carbon dark theme). New technology additions are scoped to: Hono + Cloudflare Workers (D1 for price history, KV for snapshot cache), optional Radix UI headless primitives for accessibility, and tree-shaken Zod for validation in the Worker. The highest-value pure-frontend features — specs diff highlighting, physical size overlay, and benchmark source citations — are zero-backend and can ship immediately in parallel with backend scaffolding.

The overriding risk is legal: no free, unauthenticated, machine-readable Swiss CHF price API exists. Lenovo.com/ch JSON-LD product pages are the one viable automated source (structured data designed for machine reading); Toppreise.ch requires confirmation of a read API before any fetch code is written; retailer scraping (Digitec, Brack) is a hard legal and technical no. If the automated price source fails validation, the Worker still has value as a structured store for community-contributed prices and manual editorial seeds — the architecture is sound regardless of which source feeds it.

## Key Findings

### Recommended Stack

The v1 stack (Next.js 16, React 18, TypeScript 5, Tailwind 3, recharts, Vitest, Playwright) is stable and must not be replaced. New additions are constrained to the Workers subproject and optional accessibility primitives.

**Core technologies:**

- Hono ^4.x: HTTP router for the Cloudflare Worker — lightest full-featured Workers router with first-class TypeScript support and Cloudflare's own recommendation
- Cloudflare D1 (SQLite): price history storage — enables time-series queries (`SELECT WHERE laptop_id = ? ORDER BY fetched_at DESC`) that KV cannot support
- Cloudflare Workers KV: current price snapshot cache — single JSON blob per weekly cron run; 1 write per batch, 1 read per page view; scales to substantial traffic on the free tier
- Wrangler CLI ^3.x: Workers and Pages deploy — single tool for both; replaces GitHub Pages deploy with `wrangler pages deploy ./out`
- Zod ^3.x: schema validation in the Worker — already used conceptually in data validation scripts; shared schemas via a `shared/` directory are future-viable
- `@radix-ui/react-*` (select primitives only): headless a11y primitives — zero styles, bolt onto existing Carbon CSS classes; install only `dialog`, `tooltip`, `select` as needed

**What to avoid:** Tailwind v4 (Carbon theme rewrite risk), React 19 (concurrent rendering audit needed), OpenNext/next-on-pages (unnecessary for static export), Cloudflare Pages as a separate project (deprecated April 2025 — use Workers static assets), automated scraping of Digitec/Brack/Toppreise (TOS violation).

**Version note:** STACK.md references Next.js 16.1.6 — verify with `npm list next` before assuming version.

### Expected Features

**Must have (table stakes) — P1, ship first:**

- Specs diff highlighting in compare view — users cannot manually spot differences across 20 rows for 4 models; pure frontend, 1-2 days
- Physical size overlay in compare view — W × D × H × weight data already in `laptops.ts`; CSS-scaled rectangle overlay, pure frontend
- Benchmark source citations — backfill `sourceUrls` in `model-benchmarks.ts`; trust-critical for IT procurement buyers
- Cloudflare Workers scaffold + D1 schema — foundation for all price features; seed D1 from existing `seed-prices.ts` so API serves real data immediately
- `useRemotePrices()` integration — existing hook, point it at Workers API; deals and model pages get live prices with zero redesign

**Should have (competitive differentiators) — P2:**

- Cron Aggregator Worker (Lenovo.com/ch JSON-LD parser) — the automated price write path; hardest backend piece
- iFixit repairability score — no mainstream comparison site surfaces repairability; ThinkPad T14 Gen 7 / T16 Gen 5 are 10/10; data available via public iFixit CSV
- TCO calculator (3-5 year cost) — pure frontend in `lib/tco.ts`; IT procurement differentiator; 3 inputs max at MVP (price, warranty years, dock)
- Scenario-based recommendation mode — extends existing `getScenarioVerdicts()` in `lib/analysis.ts`
- Community price dual-write to D1 — extends existing `PriceEntryForm` with a POST to Workers API alongside localStorage

**Defer until features stable — P3:**

- Price history chart — requires 4+ weeks of D1 accumulation before there is data to display; build component skeleton, gate on data existence
- Display deep-dive (Delta E, nits, PWM, P3 coverage) — high value for creative professionals; bottleneck is manual data collection across 124 models
- Sustained thermal performance profiles — same data collection bottleneck as display deep-dive; batch the two data passes together
- Full UX overhaul — after all features lock; touching components during active feature work creates rework

**Anti-features (never build):**

- Real-time price push alerts — requires accounts, push infrastructure, paid Durable Objects; conflicts with local-first architecture
- Retailer scraping (Digitec, Brack, Toppreise) — TOS violation; Cloudflare shared IPs get banned, affecting all users
- LLM-generated recommendations — scoring is deterministic and auditable; LLM output is not; trust is the product's core asset
- Non-Lenovo brand comparison — breaks the entire data model; the Lenovo/Swiss niche is the competitive moat

### Architecture Approach

The system uses a strict "static-first with optional remote enhancement" pattern. The Next.js static export (served via Cloudflare Workers static assets) works completely from TypeScript constants and seed prices. The Workers price API enriches prices asynchronously after hydration — never blocking page load. A separate cron-triggered Worker runs weekly to fetch and store prices; the API Worker reads from D1; neither Worker imports `data/laptops.ts` or `lib/scoring.ts` (scoring stays client-side only).

**Major components:**

1. Static Frontend (Next.js, Cloudflare Pages/Workers static assets) — renders all UI; computes all scores locally from TypeScript constants; fetches prices asynchronously via `useRemotePrices()`
2. Price API Worker (Hono, GET /api/prices/:modelId, POST /api/prices/community) — serves aggregated and community prices from D1; never imports scoring logic
3. Cron Aggregator Worker (scheduled weekly) — fetches Lenovo.com/ch JSON-LD prices per model; uses `Promise.allSettled()` for source isolation; writes snapshots to D1; logs failures to D1 audit table
4. Cloudflare D1 — three tables: `price_snapshots` (indexed by `laptop_id, fetched_at DESC`), `community_prices`, `fetch_log`
5. Existing TypeScript data layer (`data/`) — immutable source of truth; compiled into static bundle; never duplicated in Workers
6. Scoring Engine (`lib/scoring.ts`) — extended for TCO and specs diff; stays client-side; `lib/tco.ts` extracted to avoid growing `scoring.ts`

**Project layout:** Keep the Worker in `workers/` with its own structure (`price-api/`, `cron-aggregator/`, `wrangler.toml`). Separate from the Next.js root — avoids dependency conflicts and keeps bundle boundaries clean.

### Critical Pitfalls

1. **Illegal price source fetch** — Treat "publicly visible price" as different from "legally fetchable programmatically." Toppreise actively detects bot traffic (confirmed by Price2Spy). Produce a written `LEGAL_SOURCES.md` for each planned source before writing any fetch code. Only Lenovo.com/ch JSON-LD (structured data designed for machine reading) is confirmed viable.

2. **Workers free tier exhaustion via per-model-per-request architecture** — Never write 124 KV entries per cron run; write one JSON blob (1 KV write per weekly batch). Never fire a Worker request on every model page load; render from seed prices immediately and fetch the Workers API once after hydration. The 10ms CPU limit means no HTML parsing in the Worker — parse is done elsewhere, clean data stored.

3. **Value score breaking when remote and seed prices coexist** — Define the merge strategy before implementing: `remote > seed > user-contributed` for value score input; `SwissPrice.source` field enforces this. Unit-test `getValueScore()` against all three source combinations before the Worker goes live.

4. **Stale/mismatched benchmark data** — Enforce `validate-data.ts` build failure when any `ModelBenchmarks` entry has measured values but empty `sourceUrls`. Every source URL must link to the specific review, not the site homepage. Document TDP assumption beside CPU benchmark scores.

5. **Next.js 16 RSC path bug in static export** — An open Next.js issue (#85374) causes `__next/page` paths to resolve incorrectly in static exports on navigation. Add a Playwright smoke test against the `out/` directory before any Dependabot Next.js version merge. Pin exact Next.js version (not `^`).

6. **UX overhaul scope creep** — "Full overhaul" is unbounded. Decompose into three independent workstreams: design tokens first, then per-component polish with before/after screenshots, then navigation flow as a separate feature. Limit PRs to the components in that sprint's list.

## Implications for Roadmap

Based on combined research findings, the dependency graph dictates a clear phase order. Backend scaffolding must precede any price-dependent features. Pure frontend features (specs diff, size overlay, benchmark citations) can be built in parallel at any point. UX overhaul must follow feature completion to avoid rework.

### Phase 1: Foundation — Quick Wins + Backend Scaffold

**Rationale:** The three pure-frontend P1 features (specs diff, size overlay, benchmark citations) have zero dependencies and deliver immediate visible value. Running them in parallel with the Workers scaffold maximises throughput — neither blocks the other. The Workers scaffold must precede all price features, making it highest priority even though it has no immediate user-visible output.

**Delivers:** Specs diff highlighting and "only show differences" toggle in compare view; CSS-scaled size overlay component; benchmark source URLs backfilled and surfaced as inline links; Cloudflare Workers project scaffolded with D1 schema, seed data imported, Price API GET endpoint live, CORS configured.

**Features addressed:** Specs diff highlighting (P1), physical size overlay (P1), benchmark source citations (P1), Workers scaffold + D1 schema (P1)

**Pitfalls avoided:** Source legality review completed before any fetch code exists; D1 single-blob KV architecture decided at scaffold time; `LEGAL_SOURCES.md` written

**Research flag:** Standard patterns for Workers scaffold (Hono, D1 binding) — skip `/gsd:research-phase`. Source legality assessment for Lenovo.com/ch JSON-LD requires manual robots.txt and TOS verification before proceeding to Phase 2.

### Phase 2: Price Automation

**Rationale:** With D1 schema and the read path live (Phase 1), this phase adds the write path. `useRemotePrices()` integration is low-effort (hook already exists) and makes D1 data visible immediately in the UI. The cron aggregator is the highest-effort backend piece and should be built with source isolation (`Promise.allSettled()`) so a failed Lenovo fetch does not abort the entire run. Community dual-write extends existing `PriceEntryForm`.

**Delivers:** `useRemotePrices()` updated to prefer Workers API with localStorage fallback; Cron Aggregator Worker targeting Lenovo.com/ch JSON-LD; community price dual-write to D1 alongside localStorage; `getValueScore()` updated with source priority merge strategy and unit tests; D1 begins accumulating real weekly snapshots.

**Features addressed:** `useRemotePrices()` integration (P1), Cron Aggregator (P1), community price dual-write (P2)

**Pitfalls avoided:** Remote + seed price merge conflict defined before implementation; `NEXT_PUBLIC_PRICES_API_URL` env var used (not hardcoded); CORS restricted to production domain; wrangler secrets used for Cloudflare API token

**Research flag:** Needs `/gsd:research-phase` — confirm Lenovo.com/ch robots.txt allows automated product page fetching; confirm JSON-LD `PriceSpecification` is consistently present across all 124 model product pages. Toppreise integration explicitly deferred to v2.x (read API unconfirmed).

### Phase 3: Differentiators — Repairability + TCO + Scenarios

**Rationale:** These three features are independent of each other and of the price backend (TCO works with seed prices at MVP). Repairability data collection (iFixit CSV) can run in parallel with TCO implementation. The scenario finder extends existing `analysis.ts` — minimal new code.

**Delivers:** iFixit repairability scores mapped to all 124 model IDs (with "no data" fallback for models without scores); repairability score surfaced in model detail and compare table; `lib/tco.ts` with 3-input TCO calculator (purchase price, warranty years, dock); TCO card added to model detail page; Scenario Finder page or mode weighting existing score dimensions by use case.

**Features addressed:** iFixit repairability score (P2), TCO calculator (P2), scenario-based recommendations (P2)

**Pitfalls avoided:** TCO limited to 3 inputs at MVP; repairability data validated as per-config where configs differ (not just per-model); scenario recommendations show score breakdown behind each recommendation (transparency)

**Research flag:** Standard patterns — skip `/gsd:research-phase`. iFixit CSV download and mapping is a data task, not a research task.

### Phase 4: Deep Data — Display Measured Values + Thermal Profiles

**Rationale:** Both features share the same data collection bottleneck: a manual pass through NotebookCheck reviews for all 124 models. Batching this work into one phase avoids two separate data passes. These are high-value differentiators but have no technical complexity — the bottleneck is data, not code.

**Delivers:** New fields on `ModelBenchmarks`: `deltaE`, `sRGBCoverage`, `displayP3Coverage`, `nitsAtTypical`, `pwmFrequency` (populated from NotebookCheck reviews, with "spec-only" flag where measured data is absent); sustained thermal profiles with `sustainedCpuWatts`, `throttlingClass`; ThermalProfile card on model detail.

**Features addressed:** Display deep-dive (P2), sustained thermal profiles (P3)

**Pitfalls avoided:** Every new benchmark field has at least one `sourceUrl` (build-time validation); Intel and AMD variants of the same model have separate benchmark entries where they differ

**Research flag:** Data collection task — no `/gsd:research-phase` needed. NotebookCheck review URLs are known; this is execution, not discovery.

### Phase 5: Price History Chart

**Rationale:** Explicitly blocked on Phase 2 completing and running for 4+ weeks. The chart component can be built in Phase 2 with a data-existence gate, but this phase activates it with real data and polish.

**Delivers:** 90-day price history chart (recharts `ScatterChart`) on model detail pages; min/max/current indicators; "no history yet — check back after [date]" state for models with insufficient data.

**Features addressed:** Price history chart (P2)

**Pitfalls avoided:** Chart gates on `data.length >= 2`; never shows a chart with a single point

**Research flag:** Standard recharts pattern — skip `/gsd:research-phase`.

### Phase 6: UX Overhaul + Mobile Improvements

**Rationale:** Final phase, after all features are locked. Doing this earlier guarantees rework as feature additions touch the same components. Three independent workstreams: design tokens, per-component polish, navigation flow.

**Delivers:** CSS custom property token system for spacing scale, font sizes, and line heights; per-component polish pass (one component per PR with before/after screenshots); drawer-based mobile filter panel; verified Lighthouse scores on mobile for all page types; animation audit (remove framer-motion from static pages, keep for state transitions).

**Features addressed:** Mobile UX improvement (P3), full UX overhaul (P3)

**Pitfalls avoided:** No more than 10 files per UX PR; Lighthouse run on mobile before and after each component; a11y validation (`axe-core`) for each changed component; recharts bundle baseline taken before phase and monitored

**Research flag:** Standard patterns — skip `/gsd:research-phase`. A11y patterns well-documented.

### Phase Ordering Rationale

- Phases 1-2 are infrastructure-first: pure frontend quick wins run in parallel with backend scaffolding (no wasted time) while the price architecture is settled early (avoids rebuilding score logic later)
- Phase 3 differentiators are independent of price automation — they can advance even if Phase 2 encounters source legality issues
- Phase 4 is data-bound, not code-bound; its position is flexible but benefits from having the full model detail page structure from Phases 1-3 stable
- Phase 5 is explicitly time-blocked on Phase 2 accumulating data
- Phase 6 last is non-negotiable — UX work on moving targets creates rework

### Research Flags

**Needs `/gsd:research-phase` during planning:**

- Phase 2 (Price Automation): Lenovo.com/ch robots.txt verification, JSON-LD schema validation across 124 product pages, Wrangler CI/CD setup with `CLOUDFLARE_API_TOKEN` scoping

**Standard patterns (skip `/gsd:research-phase`):**

- Phase 1: Hono Workers scaffold, D1 schema, recharts specs diff — all well-documented
- Phase 3: iFixit CSV data mapping, `lib/tco.ts` pure TypeScript — no novel research
- Phase 4: NotebookCheck data collection — execution task with known methodology
- Phase 5: recharts time-series — existing pattern in codebase
- Phase 6: a11y, Tailwind tokens, Lighthouse — well-documented web standards

## Confidence Assessment

| Area         | Confidence | Notes                                                                                                                                                                                                         |
| ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | HIGH       | Core additions (Hono, D1, KV, Wrangler) verified against official Cloudflare docs; recharts keep/replace decision well-evidenced; Tailwind v4 / React 19 defer rationale verified against official changelogs |
| Features     | HIGH       | UX patterns from Baymard + NN/g (high confidence); iFixit data availability confirmed; competitor feature gap analysis (RTINGS, Versus) is direct observation                                                 |
| Architecture | HIGH       | Cloudflare platform patterns from official docs; static-first + remote enhancement pattern is established; D1 vs KV tradeoff well-reasoned                                                                    |
| Pitfalls     | HIGH       | Most findings backed by official docs (Workers limits, Next.js issue #85374, KV write caps) or confirmed behavior (Toppreise bot detection via Price2Spy); legal risk from multiple sources                   |

**Overall confidence:** HIGH for technical implementation; LOW specifically for automated price source legality

### Gaps to Address

- **Lenovo.com/ch JSON-LD availability:** Assumed to contain `PriceSpecification` structured data based on standard e-commerce JSON-LD practice; must be manually verified on 3-5 product pages before Phase 2 implementation begins
- **Toppreise read API:** No public API confirmed — treat as "not available" and defer any Toppreise integration to v2.x. Contact Toppreise directly if a future automated source is desired
- **Next.js 16 RSC bug status:** GitHub issue #85374 may be fixed in a patch release; verify before Phase 1 lands and before any Dependabot version bump is accepted
- **D1 exact row limits:** Numeric daily limits for D1 row reads/writes should be confirmed against the official D1 limits page before designing the history query pattern
- **Cloudflare Pages deprecation timeline:** ARCHITECTURE.md references a community blog for the Pages → Workers static assets migration; confirm against official Cloudflare docs before migrating hosting

## Sources

### Primary (HIGH confidence)

- [Cloudflare Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/) — free tier limits, KV writes/reads
- [Cloudflare D1 Pricing and Limits](https://developers.cloudflare.com/d1/platform/limits/) — row read/write limits, 500 MB storage
- [Cloudflare Workers KV Limits](https://developers.cloudflare.com/kv/platform/limits/) — 100K reads/day, 1K writes/day
- [Hono Cloudflare Workers guide](https://hono.dev/docs/getting-started/cloudflare-workers) — HTTP router setup, bindings pattern
- [Cloudflare Workers Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) — scheduled event handler
- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) — breaking changes, React 19 bundling behavior
- [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) — config migration, breaking changes
- [iFixit Laptop Repairability Scores CSV](https://www.ifixit.com/repairability/laptop-repairability-scores) — primary repairability data source
- [iFixit + Lenovo partnership page](https://www.ifixit.com/lenovo) — ThinkPad repairability program
- [Baymard Institute: Comparison Feature UX](https://baymard.com/blog/user-friendly-comparison-tools) — specs diff highlighting pattern
- [NN/g: Comparison Tables](https://www.nngroup.com/articles/comparison-tables/) — table design best practices
- [Next.js GitHub issue #85374](https://github.com/vercel/next.js/issues/85374) — RSC path bug in static exports
- Project CLAUDE.md and codebase inspection — recharts bundle size, scoring patterns, data file structure

### Secondary (MEDIUM confidence)

- [motion.dev bundle size docs](https://motion.dev/docs/react-reduce-bundle-size) — LazyMotion 4.6 KB initial; framer-motion rebranding confirmed
- [Toppreise.ch dealer registration](https://www.toppreise.ch/dealer-registration) — feed is merchant-push, no read API confirmed
- [Price2Spy: Toppreise bot detection](https://www.price2spy.com/blog/toppreise-ch-also-monitored-by-stealth-ip-traffic/) — active bot monitoring confirmed
- [Switzerland FADP / web scraping legal summary](https://iclg.com/practice-areas/data-protection-laws-and-regulations/switzerland) — legal risk assessment
- [Cloudflare Pages → Workers migration](https://vibecodingwithfred.com/blog/pages-to-workers-migration/) — community blog (consistent with Cloudflare migration guide)
- WebSearch: recharts vs alternatives 2025 bundle comparison — retain recharts decision

### Tertiary (LOW confidence — needs validation before implementation)

- Lenovo.com/ch JSON-LD PriceSpecification availability — assumed from standard e-commerce practice; not directly verified
- Lenovo robots.txt product page access rules — referenced but content not confirmed this session
- Cloudflare Worker 3 MB bundle size limit — found in search results; confirm against official limits page

---

_Research completed: 2026-03-13_
_Ready for roadmap: yes_
