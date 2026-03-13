# Stack Research

**Domain:** Swiss laptop comparison tool — static site + serverless price backend
**Researched:** 2026-03-13
**Confidence:** MEDIUM-HIGH (core additions verified via official docs; price data sources LOW confidence pending legal confirmation)

---

## Context: What Already Exists

The v1 stack is stable and must not be replaced wholesale. All additions below are additive to:

- Next.js 16.1.6 (App Router, `output: "export"` static mode)
- React 18 + TypeScript 5
- Tailwind CSS 3.4.1 with custom Carbon dark theme
- recharts 3.7.0 (~324 KB bundle concern noted)
- lucide-react 0.575.0
- Geist fonts 1.7.0
- Vitest 4.0.18, Playwright 1.58.2

---

## New Stack Additions by Domain

### 1. Cloudflare Workers Backend (Price Aggregation)

**Architecture decision:** Keep the Next.js app as a pure static export (GitHub Pages or Cloudflare Pages). Add a separate Cloudflare Worker as the price aggregation backend. Do NOT migrate the entire Next.js app to Cloudflare Workers — the static+worker split is simpler, cheaper (static assets are free on Cloudflare), and avoids OpenNext complexity.

The Worker handles:

- Weekly cron-triggered price fetches from legal sources
- Storing aggregated prices in KV (current snapshot) and D1 (price history)
- Exposing a REST endpoint the static frontend calls at runtime

#### Core Worker Technologies

| Technology            | Version        | Purpose                        | Why                                                                                                                                                                                                                                         |
| --------------------- | -------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hono                  | ^4.x           | HTTP router for the Worker     | Lightest full-featured router for Workers; first-class TypeScript, built-in middleware, 12 KB bundle. The Cloudflare docs list it as the recommended micro-framework. Avoid itty-router (less maintained) and Express (no Workers support). |
| Wrangler CLI          | ^3.x           | Local dev + deploy             | Official Cloudflare toolchain. Provides `wrangler dev --test-scheduled` for local cron testing without deploying.                                                                                                                           |
| Workers KV            | N/A (platform) | Current price snapshot storage | Free tier: 100K reads/day, 1K writes/day. Ideal for "latest prices" — one write per model per week from the cron, many reads from the frontend. Single key per model; O(1) lookup.                                                          |
| Cloudflare D1         | N/A (platform) | Price history storage          | Free tier: 5M rows read/day, 100K rows written/day, 5 GB storage. SQLite-in-Workers. Use for price history (INSERT one row per model per fetch). Gives time-series queries that KV cannot. Free tier enforced since Feb 2025.               |
| `@hono/zod-validator` | ^0.x           | Request/response validation    | Pairs with Zod for type-safe API contracts. Matches the TypeScript-first philosophy of the project.                                                                                                                                         |
| Zod                   | ^3.x           | Schema validation              | Already used conceptually in the project (data validation scripts). Same library for both Worker request validation and frontend data parsing.                                                                                              |

**Cron Trigger setup:** Free tier Workers support Cron Triggers at no extra cost. Cron invocations count toward the 100K requests/day limit. A weekly cron touching ~124 models uses negligible quota. Maximum 5 Cron Triggers per Worker on free tier.

**Project layout:** Keep the Worker in a `worker/` subdirectory with its own `wrangler.jsonc`. Do not colocate with the Next.js root — separate `package.json` for the worker avoids dependency conflicts.

#### What NOT to Use for the Worker Backend

| Avoid                               | Why                                                                                                                                                                                                                   | Use Instead                     |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| OpenNext / `@opennextjs/cloudflare` | Designed to run the full Next.js server on Workers — unnecessary complexity when the site is already a static export. Note: Next.js 14 support drops Q1 2026 per Cloudflare docs, which makes this path more fragile. | Separate standalone Hono Worker |
| Cloudflare Durable Objects          | Overkill for weekly batch writes; billing for SQLite-backed DOs starts Jan 2026                                                                                                                                       | D1 for history, KV for snapshot |
| Workers Sites (deprecated)          | Deprecated in Wrangler v4                                                                                                                                                                                             | Workers Static Assets           |
| Express / Fastify                   | No Workers runtime support                                                                                                                                                                                            | Hono                            |

---

### 2. Price Data Sources (Legal Acquisition)

**Critical constraint:** The project explicitly bans retail scraping. The Lenovo robots.txt disallows automated crawling of product directories. This severely limits automated price acquisition. Evidence for each source:

| Source                               | Mechanism                                              | Confidence | Notes                                                                                                                                                        |
| ------------------------------------ | ------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lenovo.com/ch official product pages | HTML fetch + CSS selector parsing                      | LOW        | robots.txt blocks bots on product paths. Legal risk. Do NOT use. Treat Lenovo prices as manual/editorial seed data only.                                     |
| Toppreise.ch API/feed                | Merchant product feed (CSV/XML)                        | LOW        | Toppreise feeds are designed for merchants listing their products — not for reading competitor prices. No public read API found. Contact required to assess. |
| Google Shopping / Merchant API       | Requires Google Merchant Center account + OAuth        | LOW        | Not a free unauthenticated read. Requires merchant account. Not viable for a tool that reads third-party prices.                                             |
| Community contributions (existing)   | localStorage + GitHub PR workflow (existing)           | HIGH       | Already works. The existing `process-price-submission.yml` workflow + seed-prices.ts pattern is the most legally sound approach.                             |
| Manual editorial price updates       | Researcher manually checks Digitec/Brack/Lenovo weekly | MEDIUM     | Labor-intensive but legally unambiguous. Could be supplemented with a script that outputs URLs for manual checking.                                          |

**Recommendation:** Do not attempt fully automated price scraping in this milestone. Instead:

1. Keep community contributions as the primary price ingestion path (already built)
2. Build a Cloudflare Worker that serves as a **price API** (stores/returns prices), but seed it manually via a script the researcher runs weekly — not via automated site fetching
3. The Worker's value is: structured storage, price history, deduplicated JSON API endpoint, and a future upgrade path to real automation if a legal feed becomes available

This is the only approach that satisfies the "free tier + legal" constraints simultaneously. The alternative (automated legal fetching) has no viable free unauthenticated source for Swiss CHF laptop prices currently.

#### Technologies for Price Data Pipeline

| Technology       | Version | Purpose                         | Why                                                                                                                                    |
| ---------------- | ------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Worker D1 SQL    | N/A     | Price history table             | `CREATE TABLE prices (laptop_id TEXT, price_chf REAL, retailer TEXT, fetched_at TEXT, source TEXT)` — simple schema, queryable history |
| Worker KV        | N/A     | Latest price snapshot per model | `prices:{laptopId}` key → JSON snapshot; frontend reads this at runtime                                                                |
| `tsx` (existing) | ^4.21.0 | Manual price import scripts     | Existing pattern — run `tsx scripts/push-prices-to-worker.ts` to POST prices to Worker via authenticated endpoint                      |

---

### 3. Frontend: Deployment Target Change

**Recommendation:** Migrate static hosting from GitHub Pages to **Cloudflare Pages** in this milestone. Rationale:

- GitHub Pages requires the `/lenovocompare-ch` basePath hack in `next.config.mjs` — Cloudflare Pages supports custom domains without path prefixes
- Cloudflare Pages free tier: unlimited bandwidth, unlimited requests for static assets, 500 builds/month
- Same Cloudflare account as the Worker — simpler CORS configuration (same origin or first-party)
- GitHub Actions CI can still run tests; deployment switches to `wrangler pages deploy`

| Technology       | Version        | Purpose                      | Why                                                                                     |
| ---------------- | -------------- | ---------------------------- | --------------------------------------------------------------------------------------- |
| `wrangler` CLI   | ^3.x           | Pages deploy + Worker deploy | Single tool for both; `wrangler pages deploy ./out` for the static export               |
| Cloudflare Pages | N/A (platform) | Static site hosting          | Free unlimited static assets; removes basePath complexity; same-origin CORS with Worker |

**What NOT to do:** Do not use `@cloudflare/next-on-pages` — it only supports the Edge runtime, not the standard Node.js runtime. For a static export, this is irrelevant — `next build` output goes straight to Pages as-is.

---

### 4. UX Component Libraries

**Decision: Do NOT add a new component library.** The existing IBM Carbon-inspired custom Tailwind theme (`.carbon-card`, `.carbon-btn`, `.carbon-input`) is a core part of the product identity. Adding shadcn/ui or Radix would conflict unless heavily customized.

**What to add instead:**

| Technology                              | Version | Purpose                                                         | Why                                                                                                                                                                                                                                                                              |
| --------------------------------------- | ------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@radix-ui/react-*` (select primitives) | ^1.x    | Accessible headless primitives for dropdowns, dialogs, tooltips | Radix is headless — zero styles, full a11y. Bolt Radix primitives onto existing Carbon CSS classes. Use only the primitives needed: `@radix-ui/react-dialog`, `@radix-ui/react-tooltip`, `@radix-ui/react-select`. Do not install the full suite.                                |
| `motion` (formerly `framer-motion`)     | ^11.x   | Animation (existing, rebranded)                                 | The library was rebranded from `framer-motion` to `motion` in Feb 2025. Use `LazyMotion` + `m` component to cap bundle impact at ~4.6 KB for initial render. The CLAUDE.md notes framer-motion was removed from deps — verify and add back as `motion` if animations are needed. |

**What NOT to use:**

| Avoid                                | Why                                                                                                  | Use Instead                                           |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| shadcn/ui                            | Opinionated styling conflicts with Carbon dark theme; would require extensive CSS variable remapping | Custom Tailwind components on existing Carbon classes |
| MUI / Chakra UI                      | React 18 only, large bundle, opinionated styles that fight the Carbon dark theme                     | Radix headless primitives                             |
| Headless UI (Tailwind Labs)          | Tailwind-specific, but still adds overhead; less flexible than Radix for custom styling              | `@radix-ui/react-*`                                   |
| Full framer-motion / `motion` import | 34 KB baseline without LazyMotion                                                                    | `import { m } from 'motion/react'` + `LazyMotion`     |

---

### 5. Data Visualization Enhancements

**Decision: Keep recharts. Do not replace it this milestone.** The bundle cost (~324 KB including D3) is already accepted. Replacing recharts would require rewriting all 8 chart components. The CLAUDE.md notes that MiniRadar was converted to pure SVG — continue that pattern for new small visualizations.

**What to add:**

| Technology                       | Version | Purpose                                                                         | Why                                                                                                                                                                                                                       |
| -------------------------------- | ------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pure SVG components (no library) | N/A     | New small charts: thermal throttle curve, dimension overlay, repairability bars | The project already has precedent (MiniRadar as SVG). New charts that are simple bar/line shapes should be SVG, not recharts. Avoids bundle growth.                                                                       |
| `d3-shape` (tree-shaken)         | ^3.x    | Path generation for complex new charts only                                     | If a new chart type (e.g., thermal throttle curve over time) needs smooth line interpolation, import only `d3-shape` (~20 KB) rather than pulling in all of D3 via recharts. Only use if a pure SVG path is insufficient. |

**What NOT to use:**

| Avoid                      | Why                                                                                                                        | Use Instead                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Nivo                       | Larger bundle than recharts; heavy D3 dependency                                                                           | recharts (existing) or pure SVG                          |
| Victory                    | Lodash + PropTypes dependencies inflate bundle; no benefit over recharts for this use case                                 | recharts (existing)                                      |
| Chart.js / react-chartjs-2 | Canvas-based; makes custom dark theme and Carbon styling harder; no SSR-safe rendering without ssr: false                  | recharts (SVG-based, existing)                           |
| `@visx/*` (Airbnb)         | Excellent for custom, low-level charts but high learning curve; requires significant D3 knowledge; no prebuilt chart types | recharts for standard charts, pure SVG for simple shapes |

---

### 6. TypeScript / Build Tooling Changes

**Do NOT upgrade to Tailwind v4 this milestone.** Tailwind v4 is a breaking change (config moves to CSS, utility class renames, browser support floor at Safari 16.4). The existing Carbon dark theme in `tailwind.config.ts` would need full rewriting. The performance gains (3-10x faster builds) do not justify the migration risk during a feature milestone.

**Do NOT upgrade to Next.js 15 or 16 this milestone.** The project already runs Next.js 16.1.6 per the codebase STACK.md — this is current. No action needed. (Note: the codebase STACK.md says 16.1.6 but `package.json` shows `^16.1.6` — verify with `npm list next` that 16.x is actually installed.)

**Do NOT upgrade to React 19 this milestone.** Next.js 16 bundles React 19.2 for the App Router, but the project currently pins `react: "^18"`. Upgrading React 19 changes concurrent rendering behavior and requires auditing all server/client component boundaries.

| Technology            | Version | Purpose                                          | Why                                                                       |
| --------------------- | ------- | ------------------------------------------------ | ------------------------------------------------------------------------- |
| `wrangler`            | ^3.x    | Worker dev + deploy                              | New dev dependency; install in `worker/` subproject                       |
| `hono`                | ^4.x    | Worker HTTP framework                            | New dependency in `worker/package.json`                                   |
| `@hono/zod-validator` | ^0.x    | Request validation in Worker                     | Worker-only dependency                                                    |
| `zod`                 | ^3.x    | Schema validation (Worker + optionally frontend) | Worker-only initially; consider sharing schemas via a `shared/` directory |

---

## Installation

```bash
# Worker subproject (worker/package.json)
cd worker
npm install hono @hono/zod-validator zod
npm install -D wrangler typescript @cloudflare/workers-types

# Root project — no new production dependencies needed for this milestone
# Optional: restore motion if animations were removed
npm install motion

# Optional: Radix primitives (install only what's needed)
npm install @radix-ui/react-dialog @radix-ui/react-tooltip @radix-ui/react-select
```

---

## Alternatives Considered

| Recommended                        | Alternative               | Why Not                                                                                                              |
| ---------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Hono                               | itty-router               | itty-router is less maintained; no built-in middleware ecosystem                                                     |
| Hono                               | Express                   | Express has no Cloudflare Workers support                                                                            |
| D1 (price history) + KV (snapshot) | KV only                   | KV cannot do time-series queries; D1 free tier is generous for this use case                                         |
| D1 (price history) + KV (snapshot) | Durable Objects           | DO storage billing starts Jan 2026; more complex; overkill for batch weekly writes                                   |
| Cloudflare Pages (static)          | Continue GitHub Pages     | Pages removes basePath complexity and enables same-origin CORS with the Worker                                       |
| Cloudflare Pages (static)          | Vercel                    | Vercel free tier has bandwidth limits and function invocation limits; Cloudflare Pages is more permissive for static |
| Radix UI primitives                | shadcn/ui                 | shadcn/ui requires CSS variable remapping that conflicts with Carbon theme                                           |
| Keep recharts                      | Replace with Nivo/visx    | Rewrite cost too high; no meaningful user-facing benefit                                                             |
| Manual price seeding               | Automated retail scraping | No legal free unauthenticated Swiss CHF price API exists; robots.txt concerns on Lenovo.com                          |
| Tailwind v3 (keep)                 | Upgrade to Tailwind v4    | Breaking config migration; Carbon theme rewrite risk; not worth it in a feature milestone                            |

---

## What NOT to Use (Summary)

| Avoid                                                     | Why                                                                                           | Use Instead                                 |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Automated retail scraping (Lenovo.com/ch, Brack, Digitec) | Lenovo robots.txt disallows; legal/TOS risk; no free API                                      | Community contributions + manual seed data  |
| Toppreise.ch data feed as a reader                        | Feed is merchant-push (sellers push TO Toppreise); not a public read API                      | Community price submissions                 |
| `@opennextjs/cloudflare`                                  | Designed for server-rendered Next.js; unnecessary for static export + separate Worker pattern | `wrangler pages deploy ./out`               |
| `@cloudflare/next-on-pages`                               | Edge runtime only; requires rewriting all server components                                   | Not needed for static export                |
| shadcn/ui as a component system                           | CSS variable conflicts with Carbon theme; adds 30-80 KB of styles                             | Custom Tailwind + Radix headless primitives |
| Tailwind v4 upgrade                                       | Breaking config change; Carbon theme must be rewritten; browser support floor                 | Stay on Tailwind 3.4.x                      |
| React 19 upgrade                                          | Concurrent rendering changes need audit; risky during feature work                            | Stay on React 18                            |

---

## Version Compatibility

| Package                     | Compatible With                  | Notes                                                                               |
| --------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| Hono ^4.x                   | Cloudflare Workers runtime       | Do not use `hono/node-server` in Workers; use `hono` only                           |
| `@cloudflare/workers-types` | wrangler ^3.x                    | Install as dev dep in worker subproject; provides `KVNamespace`, `D1Database` types |
| Zod ^3.x                    | hono ^4.x, `@hono/zod-validator` | Zod v4 (alpha as of mid-2025) is not yet production-stable; pin to ^3.x             |
| recharts ^3.x               | React 18                         | recharts 3.x requires React 18+; compatible with current stack                      |
| Radix UI ^1.x               | React 18                         | Radix v1.x targets React 18; React 19 support in progress but not blocking          |
| `motion` ^11.x              | React 18                         | `motion` (formerly framer-motion) v11 supports React 18; use `m` + `LazyMotion`     |
| wrangler ^3.x               | Node.js >=20                     | Matches existing engine requirement                                                 |

---

## Sources

- [Cloudflare Workers Pricing docs](https://developers.cloudflare.com/workers/platform/pricing/) — free tier request/KV limits (HIGH confidence)
- [Cloudflare Workers KV Limits](https://developers.cloudflare.com/kv/platform/limits/) — 100K reads/day, 1K writes/day verified (HIGH confidence)
- [Cloudflare D1 Pricing docs](https://developers.cloudflare.com/d1/platform/pricing/) — free tier row limits, enforced Feb 2025 (HIGH confidence)
- [Hono Cloudflare Workers guide](https://hono.dev/docs/getting-started/cloudflare-workers) — setup and Bindings pattern (HIGH confidence)
- [Cloudflare Static Assets migration guide](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/) — Workers Sites deprecated in Wrangler v4 (HIGH confidence)
- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) — breaking changes, React 19 bundling (HIGH confidence)
- [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) — config migration breaking changes (HIGH confidence)
- [motion.dev bundle size docs](https://motion.dev/docs/react-reduce-bundle-size) — LazyMotion 4.6 KB initial, rebranding confirmed (HIGH confidence)
- [Toppreise.ch dealer registration](https://www.toppreise.ch/dealer-registration) — feed is merchant-push, no public read API (MEDIUM confidence — inferred from architecture, no public API docs found)
- [Lenovo robots.txt](https://www.lenovo.com/robots.txt) — bot access restrictions on product paths (MEDIUM confidence — URL found in search, content not directly verified this session)
- WebSearch: recharts vs alternatives 2025 bundle size comparison (MEDIUM confidence — summary from multiple sources)
- WebSearch: Cloudflare Pages vs Workers for static Next.js 2025 (MEDIUM confidence)

---

## Open Questions (LOW Confidence — Needs Phase-Specific Investigation)

1. **Toppreise.ch data access:** Does Toppreise offer a read API for affiliate/partner programs (as opposed to merchant-push feeds)? Contact required before building any automated Toppreise integration.
2. **Lenovo CH affiliate program:** Does Lenovo Switzerland have an affiliate/partner API with structured product + price data? `apitracker.io/a/lenovo` suggests Lenovo has some APIs but Swiss CH specifics unknown.
3. **robots.txt exact paths:** Verify `lenovo.com/ch` robots.txt allows or disallows fetching product listing pages programmatically. Currently treating all automated Lenovo fetching as disallowed pending verification.
4. **D1 exact free limits:** The specific numeric daily limits for D1 row reads/writes were not directly quoted in search results — verify against [official D1 limits page](https://developers.cloudflare.com/d1/platform/limits/) before building the history schema.
5. **Wrangler Pages + GitHub Actions:** Confirm `CLOUDFLARE_API_TOKEN` secret setup for `wrangler pages deploy` in CI — existing GitHub Actions workflows use `gh-pages` deploy action and will need updating.

---

_Stack research for: LenovoCompare CH v2 milestone — price backend + UX overhaul_
_Researched: 2026-03-13_
