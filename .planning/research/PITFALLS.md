# Pitfalls Research

**Domain:** Swiss laptop comparison tool — price automation, UX overhaul, deeper technical data
**Researched:** 2026-03-13
**Confidence:** HIGH (most findings verified against official docs or direct codebase evidence)

---

## Critical Pitfalls

### Pitfall 1: Treating "public page" as "legal to fetch automatically"

**What goes wrong:**
The project explicitly rules out retailer scraping, but the boundary between "fetch from official source" and "scrape" blurs fast. Toppreise.ch actively monitors for bots (confirmed: Price2Spy notes Toppreise uses stealth IP traffic detection). Lenovo.com/ch has no documented public pricing API. Google Shopping pricing data requires a registered Merchant Center account and returns _your own_ product data, not competitor prices — it cannot be used to fetch Lenovo.ch prices. The project requirement "fetch from Toppreise.ch" is effectively scraping, even if done weekly.

**Why it happens:**
Developers assume that because a price is displayed publicly, fetching it programmatically is the same as a user viewing it. Swiss law (FADP/DSG, aligned with GDPR) and site TOS treat automated access differently. The distinction matters legally even when the content is not personal data.

**How to avoid:**
Before implementing any price source, answer three questions: (1) Does the site's robots.txt block automated access? (2) Does the TOS explicitly prohibit bots/scrapers? (3) Is there a documented API or data feed? If any answer is unfavorable, do not use that source. Viable legal sources are limited to: lenovo.com/ch official product pages (fetch product page HTML for _your own product pages_ only, not search result scraping), structured JSON-LD pricing data embedded in product pages (a public standard designed for machine reading), and sources that publish a data feed explicitly for aggregators. Maintain a `LEGAL_SOURCES.md` documenting each source's basis for use.

**Warning signs:**

- Implementation involves parsing HTML tables or CSS selectors to extract prices
- The fetch target URL contains search parameters like `?q=thinkpad`
- Rate limiting or IP bans appear during development testing
- No robots.txt or TOS review was done before implementation

**Phase to address:** Price Automation phase — before writing a single line of fetch code, produce a written source assessment for each planned price source.

---

### Pitfall 2: Cloudflare Workers free tier exhaustion mid-batch

**What goes wrong:**
The free tier allows 100,000 requests per day and 10ms CPU time per invocation. A weekly cron job that fetches prices for 124 models from 2-3 sources is not the problem — that's well under 1,000 requests. The problem is architectural: if the Worker also serves as a price API that every visitor hits (to check for fresh prices on page load), 100,000 daily requests vanishes quickly with even modest traffic. The 10ms CPU time limit is the harder constraint: parsing HTML, matching model names, or doing any string processing will hit it. KV writes are capped at 1,000/day — a batch writing 124 prices hits 12% of the daily write budget in one run.

**Why it happens:**
Developers design the Worker as both the periodic fetcher and the real-time price server, then discover that the "free" architecture has a hard ceiling they cannot optimize around without paying.

**How to avoid:**
Separate concerns into two distinct execution paths: (1) a scheduled cron Worker that runs once weekly, fetches all prices, stores them as a single JSON blob in KV (one write, not 124), and (2) a read-only endpoint that serves the cached blob (one read per visitor). The single-blob approach costs 1 KV write per weekly run and 1 KV read per page view. With 100K daily read operations free, this scales to substantial traffic. Never do HTML parsing in the Worker — parse externally and store clean data. The 10ms CPU limit means any non-trivial computation must happen at build time or offloaded.

**Warning signs:**

- The Worker does per-model fetches in a loop during cron execution
- Price freshness is checked on every page load via a Worker fetch
- KV has individual keys per model rather than a single prices blob
- No monitoring of daily request/write counts before launch

**Phase to address:** Price Automation phase — architecture decision must happen before implementation, not during.

---

### Pitfall 3: UX overhaul that ships nothing for months

**What goes wrong:**
"Full UX/UI overhaul — visual polish, spacing, typography, animations" + "Navigation & flow improvement" + "Information density optimization" + "Mobile UX improvement" is not a phase, it is a project. Attempting this as a single cohesive effort means every component is in flight simultaneously, regression testing becomes impossible, and the site regresses for weeks while nothing ships. Design decisions ripple through 30+ components.

**Why it happens:**
The impulse is correct — the existing Carbon-inspired theme needs consistency work — but "full overhaul" is a frame that invites unbounded scope. Every discovered inconsistency becomes "while I'm here" work.

**How to avoid:**
Decompose into three independent workstreams that can ship separately: (1) typography and spacing tokens — define CSS custom properties for spacing scale, font sizes, and line heights; apply to layout containers first, then cascade down. (2) Component-level polish — one component at a time, each with a before/after screenshot in the PR. (3) Navigation flow — this is interaction design, not styling, and should be treated as a separate feature with user testing criteria. Set a hard rule: no component gets touched for "polish" unless it appears in that sprint's component list. Measure progress by components-completed, not by subjective "done-ness."

**Warning signs:**

- More than 10 files in a single PR for the UX phase
- No definition of "done" for individual components
- Globals.css growing without a corresponding CSS token system
- Animations being added before spacing/typography is stable

**Phase to address:** UX Overhaul phase — begin with a design token audit, not with component changes.

---

### Pitfall 4: Benchmark data that looks current but is stale or model-mismatched

**What goes wrong:**
CPU/GPU benchmark scores degrade in accuracy as new drivers, BIOS updates, and Windows versions change real-world performance. More critically: a score for "Intel Core Ultra 7 155H" may be sourced from a different laptop chassis (different cooling, TDP configuration, or power limits) than the Lenovo model being shown. NotebookCheck reviews a specific SKU under specific conditions; presenting that score as representative of all T14 Gen 5 Intel configurations is misleading if some SKUs have 28W vs 45W TDP settings.

**Why it happens:**
Benchmark data is hard to collect and developers naturally reuse scores across similar CPU names. The `BenchmarkSource` type in `lib/types.ts` supports citation, but the `sourceUrls` field on `ModelBenchmarks` is `readonly string[]` — nothing prevents it from being empty or pointing to a generic page rather than the specific review that produced the measured value.

**How to avoid:**
Enforce a policy: every `ModelBenchmarks` entry that has measured thermal, battery, or SSD values must have at least one `sourceUrl` that links to the exact review page (not just the site homepage). Add a validation rule in `scripts/validate-data.ts` that fails the build if any model has benchmark values but empty `sourceUrls`. For CPU scores in `cpuBenchmarksExpanded`, document TDP assumption in a comment beside the score (e.g., `// source: NCK T14 Gen5, 28W cTDP config`). Flag "community estimate" entries as lower confidence in the UI.

**Warning signs:**

- `sourceUrls` arrays are empty in model-benchmarks entries with measured values
- The same benchmark score is used for Intel and AMD variants of the same model
- Display brightness values don't match any linked review page
- New models added with `sources: ["community"]` and no URL

**Phase to address:** Benchmark Data Enhancement phase — establish validation before adding new data, not after.

---

### Pitfall 5: Next.js version drift breaking static export and GitHub Pages deployment

**What goes wrong:**
The project is on Next.js 16.1.6 (per `package.json`). A known active bug exists: Next.js 16 static exports produce RSC payload files at paths like `__next/page/__PAGE__.txt`, but the browser fetches them at `__next.page.__PAGE__.txt` (dots instead of slashes) — causing 404s on navigation. Additionally, `next/link` prefetching in static exports triggers fetches to incorrect RSC paths. The project currently deploys to GitHub Pages which requires `output: 'export'`, making it directly vulnerable to this class of regression.

**Why it happens:**
Next.js does not treat static export as a first-class deployment target — most development and testing happens against the dev server or Vercel. Static export bugs can pass local `npm run build` but only manifest in the deployed GitHub Pages environment. Dependency updates via Dependabot (which the project has configured) can introduce this regression silently.

**How to avoid:**
Add a post-build smoke test that builds static output and verifies: (1) all `[id].html` pages exist in the `out/` directory, (2) RSC payload files match the expected path format, (3) at least one internal link works via Playwright's `page.goto()` on the static `out/` directory served locally. Pin the exact Next.js version in `package.json` (not `^`) until the RSC path bug is confirmed fixed. Review Next.js changelog before accepting any Dependabot PR that bumps the major/minor version.

**Warning signs:**

- Navigation between model pages returns 404 in deployed site but works locally
- `npm run build` succeeds but deployed pages show blank content after clicking links
- Dependabot has auto-merged a Next.js minor bump without a full deploy test

**Phase to address:** Infrastructure/Deployment phase — establish the smoke test before the UX overhaul changes many pages.

---

### Pitfall 6: Value score breaking when automated prices and seed prices coexist

**What goes wrong:**
The current value score in `scoring.ts` uses `SwissPrice` data from localStorage (user-contributed + seed prices). When automated prices arrive from the Workers backend, the system has two price data sources with different freshness, different retailers, and potentially different `priceType` values. If the value score picks the lowest price regardless of source freshness, a 6-month-old seed price can make a model look better value than it is. If it picks the most recent price, users who entered a deal price from last week lose their data's influence.

**Why it happens:**
The value score was designed for a single-source world (localStorage). Adding a second source (remote API) without a clear merge strategy creates ambiguous state that silently produces wrong scores.

**How to avoid:**
Define the merge strategy before implementing the price backend: remote prices should be the authoritative source for "current retail price", seed prices become the fallback when no remote data exists, and user-contributed prices are always shown as "user reported" but excluded from value score calculation unless no other source exists. Add `source: "remote" | "seed" | "user"` to the price data flowing into the scoring function, and update `getValueScore` to use a source priority order. The `SwissPrice` interface already has `isUserAdded` — extend it rather than replace it.

**Warning signs:**

- Value score changes unexpectedly when the cron job runs
- A model shows "great value" based on an 8-month-old seed price even though remote prices are available
- Two models with identical specs show different value scores due to seed price vs remote price conflict

**Phase to address:** Price Automation phase — define the merge strategy as part of the data model design, before implementing the Worker.

---

## Technical Debt Patterns

| Shortcut                                                     | Immediate Benefit                   | Long-term Cost                                                                           | When Acceptable                                                                |
| ------------------------------------------------------------ | ----------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Storing full price blob in KV as one key                     | Simplest caching approach           | No per-model invalidation; stale data for recently updated models until next weekly run  | Acceptable for weekly batch — matches the update cadence                       |
| Keeping recharts for all charts                              | No migration risk                   | ~324 KB bundle, SSR complications, all chart components need `"use client"`              | Never for new simple visualizations — use inline SVG instead                   |
| Adding new benchmark fields as optional on `ModelBenchmarks` | No migration of existing 97 entries | Old entries silently missing new fields; validation won't catch gaps                     | Acceptable only if UI handles missing field gracefully with a visible fallback |
| Hard-coded CSS Carbon classes alongside Tailwind             | Fast to write                       | Two styling systems create inconsistency; refactoring later requires touching every file | Never — pick one system and write a migration rule                             |
| Fetching prices client-side on every page load               | Always fresh                        | Defeats the static export model; every page now has a network dependency                 | Never — fetch at build time or serve cached data from KV                       |
| Using `processorOptions` for scoring what-if without caching | Simple implementation               | `getModelScores()` called per option selection causes UI jank at 4+ options              | Acceptable at current scale; memoize if options > 6                            |

---

## Integration Gotchas

| Integration                                | Common Mistake                                                     | Correct Approach                                                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare Workers cron + KV               | Writing one KV entry per model per run (124 writes)                | Write a single JSON blob; 1 write per cron invocation                                                                                    |
| Cloudflare Workers + GitHub Pages          | Calling the Worker from static JS with a hardcoded Worker URL      | Store the Worker URL in an environment variable baked in at build time; use `NEXT_PUBLIC_PRICES_API_URL`                                 |
| lenovo.com/ch product pages                | Fetching the full product page for each model every week           | Fetch only the specific product detail URL from `psrefUrl`; cache headers tell you if content changed (ETag/Last-Modified)               |
| KV + CORS                                  | Worker returns prices but browser blocks the response              | Set `Access-Control-Allow-Origin` in Worker response headers; restrict to the GitHub Pages domain, not `*`                               |
| GitHub Actions + Cloudflare Workers deploy | Deploying Workers with `wrangler publish` using a shared API token | Use a scoped Cloudflare API token with only Workers:Edit permission; never use the global account token in CI                            |
| NotebookCheck as benchmark source          | Citing the review index page URL instead of the specific review    | Every `sourceUrl` must link to the specific laptop review (e.g., `/notebookcheck.net/Lenovo-ThinkPad-T14-Gen-5.html`), not the site root |

---

## Performance Traps

| Trap                                                               | Symptoms                                                      | Prevention                                                                                                                 | When It Breaks                                     |
| ------------------------------------------------------------------ | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| recharts loaded on initial bundle for all routes                   | 324 KB parsed before any content renders                      | `dynamic(() => import('recharts'), { ssr: false })` at the component boundary; or replace with inline SVG for simple bars  | Immediately — every page load pays this cost today |
| Price freshness check on every model detail page load              | Model pages hang waiting for Worker response; TTI degrades    | Serve prices from the static build or from a single cached JSON endpoint; never per-model per-request                      | At any traffic level above manual testing          |
| Scoring `getModelScores()` called for all 124 models in HomeClient | CPU spike on home page mount; filter interactions feel sluggy | Pre-computed scores via `useMemo` are already in place — do not add new per-model computations to this path                | Around 150+ models                                 |
| `as const` data files imported into Workers runtime                | Workers bundle size approaches 3 MB limit (free tier)         | Keep Worker code minimal — never import `data/laptops.ts` into a Worker; Workers only store/serve JSON, not compute scores | Free tier: 3 MB Worker bundle limit                |
| Playwright screenshots in CI for visual regression                 | CI times out on screenshot generation for 124 model pages     | Run visual regression only on a representative sample (10-15 models per lineup)                                            | Around 50+ pages in the test run                   |

---

## Security Mistakes

| Mistake                                                                | Risk                                                                                                                 | Prevention                                                                                                                                                                                   |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Exposing Cloudflare API tokens in Worker code or repository            | Full account takeover; attacker can deploy Workers, access R2/KV, modify DNS                                         | Use Wrangler secrets (`wrangler secret put`) — never hardcode tokens; add `*.env` and `wrangler.toml` secrets section to `.gitignore`                                                        |
| Community price submission PR workflow accepting any price             | Malicious PRs with inflated/deflated prices damage trust; spam                                                       | The existing `process-price-submission.yml` workflow requires `price-approved` label — ensure label can only be applied by repo maintainers (branch protection rule on the workflow trigger) |
| CORS wildcard on price Worker                                          | Cross-origin requests from any domain can query your Worker; minor — it's public data but burns your free tier quota | Restrict `Access-Control-Allow-Origin` to `https://flongstaff.github.io` in production; allow localhost only in dev                                                                          |
| Building static pages with price data baked in from an untrusted fetch | If the price fetch source is compromised during build, bad data goes into the static HTML                            | Validate fetched prices against known bounds (`price > 100 && price < 10000` for CHF laptop prices) before baking into build artifacts                                                       |
| `robots.txt` absent or permissive after adding automated price pages   | Scrapers index your automated price data; Cloudflare Worker gets hammered by bots                                    | Maintain a restrictive `robots.txt` for API endpoints; the existing `/public/_headers` file can add rate-limit headers                                                                       |

---

## UX Pitfalls

| Pitfall                                                      | User Impact                                                                                                                          | Better Approach                                                                                                                                                                                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Showing price age without context                            | "Price from 2 weeks ago" is meaningless without knowing if that's normal                                                             | Show price age relative to the update cadence: "Updated weekly — last updated 3 days ago" gives context; the existing `PriceAgeBadge` component should reference the cron schedule                                                       |
| TCO calculator with too many inputs                          | IT procurement users abandon complex forms; personal buyers don't know accessory costs                                               | Start with 3 inputs only: purchase price, warranty years, and dock (yes/no at a flat CHF estimate). Let complexity grow from user feedback, not assumption                                                                               |
| Information density "optimization" that hides critical specs | Users miss RAM soldering status (huge purchase decision) or display panel type when cards are too compact                            | Define a "non-negotiable visible" spec list per use case before designing card compression. RAM soldered, display panel, and weight must always be visible — never progressive-disclose these                                            |
| Specs diff highlighting showing every field                  | When comparing 4 models, 80% of fields differ; highlighting loses meaning                                                            | Only highlight fields where the difference is ≥ 10% or categorically different (e.g., OLED vs IPS, soldered vs upgradeable)                                                                                                              |
| Scenario recommendations without score transparency          | "Best for dev work" recommendation feels arbitrary; users don't trust it                                                             | Show the score breakdown behind each recommendation: "T14 Gen 5 scores 78/100 for developer workflow — CPU: 82, RAM: 70, Connectivity: 85"                                                                                               |
| Animation-first UX overhaul                                  | framer-motion at 185 KB is already in the bundle; adding more animations increases TTI and is distracting on information-dense pages | Remove framer-motion from pages where content is static (hardware guide, deals). Reserve animation for state transitions (filter changes, compare add/remove). Already partially addressed in codebase via CSS `@keyframes` replacements |

---

## "Looks Done But Isn't" Checklist

- [ ] **Price automation:** A Worker exists and cron runs — but verify: does the static site actually consume the new prices, or does it still only read from localStorage seed data?
- [ ] **Specs diff highlighting:** Highlighted differences render in the compare table — but verify: does the diff logic handle `processorOptions` (multi-config models) where the base config is the same but options differ?
- [ ] **TCO calculator:** Numbers appear and update — but verify: are the accessory costs (dock, warranty) based on Swiss CHF market rates, not USD equivalents?
- [ ] **UX overhaul "complete":** All pages look polished on desktop — but verify: run Lighthouse on mobile for each page; check that filter interactions on mobile don't show layout overflow
- [ ] **Benchmark data with citations:** `sourceUrls` are populated — but verify: every URL resolves to a page that contains the actual measurement (not a redirect, not a 404, not the site homepage)
- [ ] **Cloudflare deployment:** Worker is deployed and responding — but verify: CORS headers allow the GitHub Pages domain; KV namespace is in production (not preview); cron trigger is active and has fired at least once
- [ ] **Mobile UX improvement:** Pages render correctly on 375px viewport — but verify: compare table is usable (not just renderable) on mobile; swipeable card view handles 4 models without layout overflow
- [ ] **Repairability data:** RAM slot count and SSD type are shown — but verify: these fields match the PSREF source for each config (some models have soldered RAM in base config, upgradeable in higher SKUs — this must be per-config, not per-model)

---

## Recovery Strategies

| Pitfall                                                                | Recovery Cost | Recovery Steps                                                                                                                                                                 |
| ---------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Legal price source found to violate TOS after implementation           | HIGH          | Remove fetch immediately; fall back to seed prices; document why source was removed in `LEGAL_SOURCES.md`; notify users via changelog                                          |
| Cloudflare free tier exhausted mid-month                               | LOW           | Switch cron to bi-weekly or monthly; serve stale cached prices with staleness badge; upgrade to $5/month Workers Paid if usage warrants                                        |
| Next.js version bug breaks static export after Dependabot merge        | MEDIUM        | Revert the Next.js version bump in `package.json`; pin exact version; open issue tracking the upstream bug; add the smoke test that would have caught it                       |
| UX overhaul creates accessibility regressions (contrast, keyboard nav) | MEDIUM        | Run `npm run a11y-check` (existing skill); restore previous component states for affected components; fix one component at a time with axe-core validation                     |
| Benchmark data found to be from wrong chassis (score mismatch)         | MEDIUM        | Mark affected entries with `sources: ["community"]` as interim; add a visible "estimated" badge in the UI; correct with sourced data in the next benchmark update cycle        |
| KV corruption or Worker deployment failure loses price cache           | LOW           | Prices fall back to seed data in `data/seed-prices.ts` automatically if remote fetch fails — confirm this fallback path exists in `lib/hooks/useRemotePrices.ts` before launch |

---

## Pitfall-to-Phase Mapping

| Pitfall                                           | Prevention Phase            | Verification                                                                                              |
| ------------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------- |
| Illegal price source fetch                        | Price Automation (earliest) | `LEGAL_SOURCES.md` document exists and reviewed before any fetch code written                             |
| Workers free tier exhaustion                      | Price Automation            | Architecture diagram shows single-blob KV strategy; load test with simulated traffic                      |
| UX overhaul scope creep                           | UX Overhaul                 | Component checklist exists; PRs limited to components in sprint scope                                     |
| Stale/mismatched benchmark data                   | Benchmark Data Enhancement  | `validate-data.ts` fails build on empty `sourceUrls` with measured values                                 |
| Next.js static export regression                  | Infrastructure/Deployment   | Playwright smoke test on `out/` directory passes before every merge to main                               |
| Value score merge conflict (remote + seed prices) | Price Automation            | `getValueScore` unit test covers all three source combinations; merge strategy documented in code comment |
| TCO calculator over-complexity                    | UX Overhaul                 | TCO limited to 3 inputs at MVP; no additional inputs added without a user request                         |
| recharts bundle bloat                             | UX Overhaul / Performance   | `npm run analyze` baseline taken before phase; no route exceeds baseline + 10 KB                          |

---

## Sources

- Cloudflare Workers free tier limits: [developers.cloudflare.com/workers/platform/limits](https://developers.cloudflare.com/workers/platform/limits/) — HIGH confidence (official docs)
- Cloudflare KV free tier limits (100K reads, 1K writes/day): [developers.cloudflare.com/kv/platform/limits](https://developers.cloudflare.com/kv/platform/limits/) — HIGH confidence (official docs)
- Cloudflare Workers subrequest limit (50 external, free tier): [community.cloudflare.com/t/workers-workers-are-no-longer-limited-to-1000-subrequests/891675](https://community.cloudflare.com/t/workers-workers-are-no-longer-limited-to-1000-subrequests/891675) — MEDIUM confidence (community post citing February 2026 changelog)
- Toppreise.ch bot detection: [price2spy.com/blog/toppreise-ch-also-monitored-by-stealth-ip-traffic](https://www.price2spy.com/blog/toppreise-ch-also-monitored-by-stealth-ip-traffic/) — MEDIUM confidence (third-party blog, but confirmed by site behavior patterns)
- Next.js 16 RSC path bug in static exports: [github.com/vercel/next.js/issues/85374](https://github.com/vercel/next.js/issues/85374) — HIGH confidence (open GitHub issue in the Next.js repo)
- Switzerland FADP data protection and web scraping: [iclg.com/practice-areas/data-protection-laws-and-regulations/switzerland](https://iclg.com/practice-areas/data-protection-laws-and-regulations/switzerland) — MEDIUM confidence (legal summary, not a lawyer's opinion)
- recharts bundle size (~324 KB): codebase `CLAUDE.md` direct statement — HIGH confidence (project documentation)
- Cloudflare Worker 3 MB bundle size limit (free): WebSearch results — MEDIUM confidence (confirm against [developers.cloudflare.com/workers/platform/limits](https://developers.cloudflare.com/workers/platform/limits/) before relying on it)
- UX scope creep failure patterns: general industry knowledge + Volkswagen Cariad case — MEDIUM confidence (well-documented pattern)
- Existing codebase patterns and constraints: direct code inspection (`lib/types.ts`, `lib/scoring.ts`, `package.json`, `CLAUDE.md`) — HIGH confidence

---

_Pitfalls research for: Swiss laptop comparison tool v2 — price automation, UX overhaul, deeper technical data_
_Researched: 2026-03-13_
