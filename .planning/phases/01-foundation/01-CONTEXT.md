# Phase 1: Foundation - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver comparison quick wins (differences toggle, physical size overlay, benchmark source attribution) alongside a Cloudflare Workers scaffold with D1 and a price API. The static site stays on GitHub Pages; Workers provides the price backend on a separate origin.

Requirements: COMP-01, COMP-02, COMP-03, COMP-04, PRIC-01, PRIC-02, PRIC-03, PRIC-04, PRIC-05, INFR-01, INFR-02, INFR-03, INFR-04

</domain>

<decisions>
## Implementation Decisions

### Differences Toggle (COMP-01)

- Exact string match comparison — row is hidden if all models produce the same `getValue()` text
- No numeric thresholds or fuzzy matching — "10.2 hrs" vs "10.5 hrs" counts as different
- Toggle lives in the CompareTable header row, right-aligned next to model names
- When active, show a "Hiding N identical rows" count badge near the toggle
- Toggle defaults to OFF — user sees all rows first, then filters

### Physical Size Comparison (COMP-02)

- Proportional CSS rectangles — width × depth rendered as scaled boxes, height as a thin side-view bar
- Side-by-side layout — one rectangle per model in a row, using COMPARE_COLORS for borders
- Show all four dimensions: width, depth, height, weight (label below each rectangle)
- Placed as a new "Physical Comparison" section above the specs table on the compare page
- Collapsible to save vertical space
- All data sourced from existing `Laptop.dimensions` fields

### Benchmark Source Links (COMP-03, COMP-04)

- Score value itself is the clickable link (subtle styling — dotted underline on hover)
- Links use existing `sourceUrls[]` field from `ModelBenchmarks`
- For CPU benchmarks: prefer linking to the specific model's NotebookCheck review page; fall back to Geekbench browser or Cinebench aggregate page if no model review exists
- Scores without a source URL show a subtle muted "(unverified)" or "source needed" text after the score
- Source attribution appears in BenchmarksSection on model detail pages only — not in the compare table (too dense)

### Cloudflare Workers & D1 (PRIC-01 through PRIC-05)

- Workers API deployed to `*.workers.dev` subdomain (free tier, no custom domain needed)
- Static site remains on GitHub Pages at `flongstaff.github.io/lenovocompare-ch`
- Workers and static site are separate origins — CORS headers required on Workers API
- URL redirect/prettification deferred — not in Phase 1 scope
- D1 schema stores price snapshots with model ID, source, CHF amount, fetch timestamp
- Existing seed-prices.ts data seeded into D1 as initial dataset

### Infrastructure (INFR-01 through INFR-04)

- INFR-01/INFR-02 adjusted: Cloudflare Pages deployment replaced with Workers-only deployment (static site stays on GitHub Pages). Single-origin requirement relaxed to CORS-based setup
- GitHub Actions CI updated to include wrangler deploy for Workers
- Playwright smoke test validates static export before deploy

### Frontend Price Integration (PRIC-05)

- `useRemotePrices` hook redirected from `/data/prices.json` to Workers API endpoint
- If Workers API is unreachable (cold start, outage, network error), silently fall back to existing seed-prices.ts data bundled in the static build
- No stale indicator shown to user — prices are always displayed, potentially from seed data

### Claude's Discretion

- CORS header configuration details
- D1 table schema design
- Hono vs vanilla Workers API framework choice
- wrangler.toml configuration
- Specific CSS scaling approach for size rectangles
- Toggle switch component styling (Carbon-consistent)
- Benchmark link URL construction patterns
- Playwright smoke test scope and assertions

</decisions>

<specifics>
## Specific Ideas

- Differences toggle should feel like a filter — not a mode change. Badge communicates what's hidden.
- Size rectangles should be visually clean — proportional boxes with dimension labels, not ornate illustrations.
- Benchmark source links should be subtle and discoverable on hover, not cluttering the benchmark display.
- Price fallback should be invisible to the user — same seed prices, no error states shown.

</specifics>

<code_context>

## Existing Code Insights

### Reusable Assets

- `CompareTable.tsx`: Has `SPEC_ROWS` with `getValue()` per row — diff filter can wrap this array
- `CompareTable.tsx`: `SpecRow` type has `getNumeric` and `highlight` — useful for size comparison data
- `ModelBenchmarks` type: Already has `sources: BenchmarkSource[]` and `sourceUrls: string[]`
- `BenchmarksSection.tsx`: Has `SOURCE_DISPLAY` map for human-readable source names
- `useRemotePrices.ts`: Module-level cache with TTL, fallback pattern — redirect to Workers URL
- `COMPARE_COLORS` in constants.ts: 4 Carbon-palette colors for multi-model overlays — use for size rectangles
- `Laptop.dimensions`: `widthMm`, `depthMm`, `heightMm` fields on most models

### Established Patterns

- Compare components in `components/compare/` — `CompareTable`, `CompareFloatingBar`, `CompareConfigPanel`, `MobileCompareCards`
- Dynamic imports with `{ ssr: false }` for chart components
- Carbon dark theme CSS classes (`.carbon-card`, `.carbon-btn`)
- `useMemo` for precomputed scores to avoid per-render recalculation

### Integration Points

- Diff toggle: Add state + filter logic inside `CompareTable.tsx`
- Size overlay: New component in `components/compare/`, rendered in `CompareClient.tsx` above `CompareTable`
- Benchmark links: Modify `BenchmarksSection.tsx` to wrap scores in `<a>` tags when `sourceUrls` available
- Workers API: New `workers/` directory at project root with wrangler config
- Price hook: Modify `useRemotePrices.ts` to fetch from Workers URL with existing fallback pattern

</code_context>

<deferred>
## Deferred Ideas

- Custom domain / URL prettification — revisit when a domain is purchased
- Cloudflare Pages migration (replacing GitHub Pages entirely) — potential future optimization
- Stale price indicator ("Prices may be outdated" badge) — could add in Phase 2 when automated prices exist

</deferred>

---

_Phase: 01-foundation_
_Context gathered: 2026-03-13_
