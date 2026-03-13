# Architecture Research

**Domain:** Static + Serverless Hybrid — Swiss laptop comparison tool with price aggregation backend
**Researched:** 2026-03-13
**Confidence:** HIGH (Cloudflare platform); MEDIUM (price source APIs); HIGH (frontend integration patterns)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Browser / Client                             │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │   Next.js Static Export (GitHub Pages → Cloudflare Pages)   │    │
│  │   Home / Model / Compare / Deals / Hardware / Pricing pages  │    │
│  └───────────────────────────┬─────────────────────────────────┘    │
│                               │ fetch(/api/prices)                   │
└───────────────────────────────┼─────────────────────────────────────┘
                                │ HTTPS (CORS-allowed)
┌───────────────────────────────▼─────────────────────────────────────┐
│                    Cloudflare Workers (API layer)                    │
│                                                                      │
│  ┌────────────────────┐   ┌──────────────────────────────────────┐  │
│  │   Price API Worker │   │       Cron Aggregator Worker         │  │
│  │                    │   │                                      │  │
│  │  GET /api/prices   │   │  scheduled() — weekly cron           │  │
│  │  GET /api/prices   │   │  1. Fetch Lenovo.com/ch product page │  │
│  │      /:modelId     │   │  2. Parse price from JSON-LD / HTML  │  │
│  │  POST /api/prices  │   │  3. Fetch Toppreise search results   │  │
│  │      /community    │   │  4. Write to D1 price_snapshots      │  │
│  └────────┬───────────┘   └──────────────────┬───────────────────┘  │
│           │                                  │                      │
│  ┌────────▼──────────────────────────────────▼───────────────────┐  │
│  │                    Cloudflare D1 (SQLite)                      │  │
│  │  Tables: price_snapshots, community_prices, fetch_log          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    Existing Static Data Layer                        │
│  data/laptops.ts  data/seed-prices.ts  data/price-baselines.ts      │
│  data/cpu-benchmarks.ts  data/gpu-benchmarks.ts  (TypeScript)       │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component                       | Responsibility                                                                            | Communicates With                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Static Frontend (Next.js)       | Renders all UI; computes scores locally from TypeScript data                              | Cloudflare Workers API via fetch(); localStorage for compare state |
| Price API Worker                | Serves aggregated price data via REST JSON API; handles community price submissions       | D1 database (read); community_prices table (write)                 |
| Cron Aggregator Worker          | Runs on weekly schedule; fetches prices from public sources; writes snapshots to D1       | Lenovo.com/ch (fetch); Toppreise search (fetch); D1 (write)        |
| Cloudflare D1                   | Stores price snapshots, community contributions, fetch audit log                          | Price API Worker (read/write); Cron Aggregator (write)             |
| Existing TypeScript data/       | Immutable source of truth for specs, benchmarks, editorial — compiled into static bundle  | Scoring engine; analysis layer; all components                     |
| Scoring Engine (lib/scoring.ts) | Computes 6-dimension scores from static data; extended for new features (specs diff, TCO) | data/ layer; lib/configUtils.ts                                    |

## Recommended Project Structure

```
/
├── app/                         # Next.js App Router pages (unchanged pattern)
│   ├── compare/                 # Enhanced with specs diff highlighting
│   ├── model/[id]/              # Enhanced with display deep-dive, repairability
│   ├── deals/                   # Enhanced with live prices from Workers API
│   └── ...
├── data/                        # Static TypeScript constants (unchanged)
│   ├── laptops.ts
│   ├── cpu-benchmarks.ts
│   └── ...
├── lib/
│   ├── scoring.ts               # Extended: TCO calculator, size overlay math
│   ├── hooks/
│   │   └── useRemotePrices.ts   # Enhanced: fetch from Workers API with fallback
│   └── ...
├── workers/                     # NEW: Cloudflare Workers source
│   ├── price-api/
│   │   ├── index.ts             # HTTP handler (GET /api/prices, POST /api/prices/community)
│   │   └── schema.sql           # D1 table definitions
│   ├── cron-aggregator/
│   │   ├── index.ts             # scheduled() handler
│   │   ├── sources/
│   │   │   ├── lenovo-ch.ts     # Lenovo.com/ch price parser
│   │   │   └── toppreise.ts     # Toppreise price parser
│   │   └── normalizer.ts        # Normalize prices to CHF SwissPrice shape
│   └── wrangler.toml            # Cron schedule, D1 binding, CORS config
├── scripts/
│   └── seed-d1.ts               # One-time: import seed-prices.ts into D1
└── .github/workflows/
    └── deploy-workers.yml       # Deploy Workers on push to main
```

### Structure Rationale

- **workers/**: Isolated from the Next.js app — separate build, separate deploy, separate concerns. The Workers bundle never includes Next.js code and vice versa.
- **workers/sources/**: Each price source is its own module with a typed fetcher + parser. Adding a new source (e.g., Digitec) means adding one file, not touching the aggregator loop logic.
- **workers/schema.sql**: Versioned alongside the Worker — schema migrations are explicit files, not runtime mutations.
- **lib/hooks/useRemotePrices.ts**: Already exists. Extend it to prefer Workers API when available, fall back to localStorage seed prices when Workers returns an error. The frontend never crashes if the backend is down.

## Architectural Patterns

### Pattern 1: Static-First with Optional Remote Enhancement

**What:** The static site works completely offline using TypeScript constants and localStorage. The Workers API enriches the experience when available but is never required.

**When to use:** Any feature that adds value but whose absence must not break the page. Price data is the clearest example — seed prices show if the API is down.

**Trade-offs:** Slightly more complex hook logic (fallback chain). Guarantees resilience.

**Example:**

```typescript
// lib/hooks/useRemotePrices.ts — augmented pattern
export function useRemotePrices(modelId: string) {
  const [prices, setPrices] = useState<SwissPrice[]>([]);
  const [source, setSource] = useState<"remote" | "seed" | "local">("seed");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${WORKERS_API}/api/prices/${modelId}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        setPrices(data);
        setSource("remote");
      })
      .catch(() => {
        // Graceful degradation: fall through to seed prices in parent hook
        setSource("seed");
      });
    return () => controller.abort();
  }, [modelId]);

  return { prices, source };
}
```

### Pattern 2: Cron Aggregator with Typed Source Adapters

**What:** Each price source (Lenovo.com/ch, Toppreise, future: Digitec) is a typed async function that returns `NormalizedPrice[]`. The cron handler calls them in sequence and writes results to D1. Sources are independent — one failure doesn't abort the others.

**When to use:** Any pipeline that consumes multiple unreliable external sources.

**Trade-offs:** More boilerplate per source. Enables isolated testing per source. Prevents cascade failures.

**Example:**

```typescript
// workers/cron-aggregator/index.ts
export default {
  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    const results = await Promise.allSettled([fetchLenovoCHPrices(env), fetchToppreisePrices(env)]);

    for (const result of results) {
      if (result.status === "fulfilled") {
        await writePriceSnapshots(env.DB, result.value);
      } else {
        console.error("Source failed:", result.reason);
        await logFetchError(env.DB, result.reason);
      }
    }
  },
};
```

### Pattern 3: D1 for Structured Price History (not KV)

**What:** Use D1 (SQLite) for price storage. KV is key-value only — querying "all prices for model X across last 4 weeks" requires SQL. D1 supports this natively.

**When to use:** Any time you need to query across records (time range, model filter, source filter). This is the right choice here.

**Trade-offs:** D1 free tier is 5M row-reads/day, 100K row-writes/day, 500 MB storage — more than sufficient for 124 models with weekly snapshots. KV would require pre-baking aggregates, complicating the schema.

**Schema:**

```sql
CREATE TABLE price_snapshots (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  laptop_id  TEXT NOT NULL,           -- matches data/laptops.ts id field
  source     TEXT NOT NULL,           -- 'lenovo-ch' | 'toppreise' | 'community'
  price_chf  REAL NOT NULL,
  currency   TEXT DEFAULT 'CHF',
  retailer   TEXT,
  url        TEXT,
  fetched_at TEXT NOT NULL,           -- ISO 8601
  UNIQUE(laptop_id, source, fetched_at)
);

CREATE TABLE community_prices (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  laptop_id  TEXT NOT NULL,
  price_chf  REAL NOT NULL,
  retailer   TEXT,
  note       TEXT,
  submitted_at TEXT NOT NULL
);

CREATE INDEX idx_snapshots_laptop ON price_snapshots(laptop_id, fetched_at DESC);
```

### Pattern 4: Specs Diff as Pure Computed View

**What:** The specs diff feature (highlight differences between compared models) is a pure transformation of existing static data — no new backend needed. It operates as a derived view over the compare selection, computed at render time.

**When to use:** Features that compare existing structured data. The data is already in TypeScript constants — there is no need to add an API call.

**Trade-offs:** Logic lives in lib/scoring.ts or a new lib/specsDiff.ts. Keeps the feature fast and offline-capable.

**Example:**

```typescript
// lib/specsDiff.ts
export function computeSpecsDiff(models: Laptop[]): SpecsDiff {
  const keys: (keyof Laptop)[] = ["processor", "display", "ram", "storage", "weight", "battery"];
  return Object.fromEntries(
    keys.map((k) => [
      k,
      {
        values: models.map((m) => m[k]),
        differs: new Set(models.map((m) => String(m[k]))).size > 1,
      },
    ]),
  );
}
```

### Pattern 5: TCO Calculator as Scoring Extension

**What:** Total cost of ownership extends the existing scoring engine. It does not require new data sources — it takes user inputs (purchase price, warranty, dock) and computes a 3–5 year cost projection. State lives in the URL or local component state.

**When to use:** Any calculator-style feature built on existing model attributes.

**Trade-offs:** Scoring engine grows. Consider extracting TCO into lib/tco.ts to keep lib/scoring.ts focused on hardware scores.

## Data Flow

### Price Data Flow (After v2)

```
Weekly Cron (Monday 03:00 UTC)
    ↓
Cron Aggregator Worker (scheduled handler)
    ↓ parallel fetch
Lenovo.com/ch product page ──→ parse JSON-LD structured data
Toppreise search results   ──→ parse price from HTML / response
    ↓ normalize to NormalizedPrice[]
D1: INSERT INTO price_snapshots (laptop_id, source, price_chf, fetched_at)
    ↓
(async complete — no client waiting)

User visits Deals or Model page
    ↓
Static page loads from CDN (instant)
    ↓
useRemotePrices() fires after hydration
    ↓ fetch
Price API Worker: GET /api/prices/:modelId
    → SELECT * FROM price_snapshots WHERE laptop_id = ? ORDER BY fetched_at DESC LIMIT 10
    → SELECT * FROM community_prices WHERE laptop_id = ?
    ↓ merge + return JSON
Frontend: render prices, compute buy signal against data/price-baselines.ts
```

### Compare + Specs Diff Flow

```
User selects 2-4 models (sessionStorage via useCompare())
    ↓
CompareClient.tsx resolves models from useLaptops() (static data)
    ↓
computeSpecsDiff(models) → SpecsDiff object (pure function, instant)
    ↓
CompareTable renders with diff highlights (differs === true → accent color cell)
    ↓ (optional)
useRemotePrices() fetches latest prices for each model
    → renders price delta row alongside spec diff
```

### Community Price Submission Flow

```
User submits price via PriceEntryForm
    ↓
validatePrice() gates the input (existing lib/validators.ts)
    ↓ (v2 change)
POST /api/prices/community (Workers API) with { laptopId, price_chf, retailer, note }
    → D1: INSERT INTO community_prices
    → return { id, submitted_at }
ALSO write to localStorage (existing behavior — maintains offline fallback)
    ↓
optimistic UI update via useToast()
```

### Scoring Engine Extension (TCO + Size Overlay)

```
Model detail page mounts with base Laptop from useLaptops()
    ↓
(existing) getModelScores() → PerformanceDimensions (6 scores)
    ↓ (new, parallel)
computeTCO(model, userInputs) → TCOResult { year1, year3, year5, perYearCost }
computeSizeOverlay(models) → SizeProfile[] { width, depth, height, weight }
    ↓
TCOCalculator component: controlled inputs drive TCO recalculation
SizeOverlay component: CSS-scaled rectangles from SizeProfile data
```

### State Management

```
Static data (TypeScript constants)
    → loaded at bundle time, zero latency

sessionStorage
    → compare selections (useCompare) — per-tab, clears on new tab

localStorage
    → user-contributed prices (usePrices) — persists across tabs
    → compare selections fallback

Cloudflare D1 (remote)
    → authoritative aggregated prices — updated weekly
    → community price submissions — durable storage

URL params
    → filter state (useFilters via useSearchParams)
    → TCO calculator presets (future: share TCO config via URL)
```

## Suggested Build Order (Phase Dependencies)

This order minimizes blocked work and surfaces integration risks early:

1. **Cloudflare Workers scaffold + D1 schema** — establishes the backend contract all other work depends on. The Price API Worker's GET endpoint must exist before the frontend can integrate.

2. **Price API Worker (read path)** — GET /api/prices endpoint reading from D1. Seed D1 from existing seed-prices.ts. Frontend can integrate immediately against real data.

3. **useRemotePrices() integration** — update the existing hook to prefer Workers API with localStorage fallback. Deals and Model pages get live prices with zero design changes.

4. **Cron Aggregator Worker** — the write path. Implement Lenovo.com/ch parser first (most controlled), add Toppreise second. D1 starts accumulating real snapshots.

5. **Community price submission (POST path)** — extend PriceEntryForm to dual-write to Workers API + localStorage. Requires D1 write path to be stable.

6. **Specs diff** — pure frontend feature, no backend dependency. Can be built in parallel with any backend phase.

7. **TCO calculator** — pure frontend, extends scoring engine. No backend dependency.

8. **Size overlay** — pure frontend, driven by existing Laptop.width/depth/height fields. No backend dependency.

9. **UX overhaul** — applied after features stabilize. Touching every component before features are complete risks integration churn.

10. **Cloudflare deployment (custom domain, Pages to Workers migration)** — done after feature stability. GitHub Pages continues serving during development.

## Scaling Considerations

| Scale                     | Architecture Adjustments                                                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current (hobby/portfolio) | This architecture is sufficient. Free tier: 100K Worker requests/day, D1 5M reads/day, weekly cron. Fits easily.                                     |
| 1K-10K daily users        | Add Cache-Control headers to Price API responses (e.g., `s-maxage=3600`). D1 reads are served from Cloudflare edge cache, not every request hits D1. |
| 10K+ daily users          | Move to Workers Paid ($5/month). Consider KV as a price cache layer in front of D1 (write once per cron run, read from KV on API requests).          |

### First Bottleneck

D1 row-reads at 5M/day free limit. With 124 models and users fetching model pages, 5M is reachable at ~40K daily active users. **Mitigation:** Cache API responses at the Worker level using the Cache API (`caches.default.put()`). Reduces D1 reads to one per model per hour maximum.

## Anti-Patterns

### Anti-Pattern 1: Scraping Retailers for Prices

**What people do:** Write a Cloudflare Worker that fetches retailer HTML (Digitec, Brack) and parses prices.

**Why it's wrong:** Violates retailer TOS. Digitec/Brack actively block scraping. IP bans hit Cloudflare's shared IP range, breaking all users. Legal risk in Switzerland under UWG.

**Do this instead:** Use sources that explicitly allow automated access: Lenovo.com/ch product pages (structured JSON-LD data), Toppreise.ch (they publish price data to registered merchants — check if a read API exists for comparison tools). Community contributions for retailer prices.

### Anti-Pattern 2: Storing Prices in KV Instead of D1

**What people do:** Use KV because it sounds simpler — one key per model, one value with all prices.

**Why it's wrong:** Price history is inherently a time series. "Show me the last 4 weeks of prices for ThinkPad T14 Gen 5" requires querying across records. In KV, you'd need to pre-bake all aggregates at write time, or fetch and filter client-side. Both approaches break when you want new query shapes (by source, by date range, by retailer).

**Do this instead:** D1 with indexed tables. SQL is exactly the right abstraction for this.

### Anti-Pattern 3: Blocking Page Load on Price API

**What people do:** Fetch prices server-side (in Next.js server components) and make the page non-interactive until prices load.

**Why it's wrong:** The site is statically exported — there is no server component runtime during render. Even if SSR were used, a slow Workers API would delay Time to First Byte for every page load.

**Do this instead:** Render the static page immediately from seed prices. Fire `useEffect` fetch after hydration. Show a loading skeleton for the price row. Pages are always fast; prices appear asynchronously.

### Anti-Pattern 4: Duplicating Score Logic in Workers

**What people do:** Copy scoring functions into the Worker to compute scores server-side (for SEO, for API consumers).

**Why it's wrong:** The scoring engine is tightly coupled to TypeScript types in lib/types.ts and benchmark data in data/. Duplicating it in a Worker creates two diverging implementations. Score discrepancies are confusing and hard to debug.

**Do this instead:** Keep scoring purely client-side. The Workers API serves only price data. If score data must be served via API (e.g., for future mobile app), generate a static JSON file at build time and serve it from the CDN.

### Anti-Pattern 5: Cloudflare Pages + Separate Workers Project

**What people do:** Deploy the static site to Cloudflare Pages (deprecated as of 2025) and add Workers as a separate named project.

**Why it's wrong:** Cloudflare deprecated Pages in April 2025. Workers now serves static assets natively. Running two projects increases deployment complexity and can cause CORS issues between the frontend origin and the API origin.

**Do this instead:** Single Workers deployment. The static Next.js export is served via Workers static assets. The API routes (/api/\*) are handled by the same Worker. Same origin = no CORS configuration needed.

## Integration Points

### External Services

| Service         | Integration Pattern                                                   | Notes                                                                                                                                            |
| --------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lenovo.com/ch   | Fetch product page HTML or JSON-LD from Worker cron                   | Parse `<script type="application/ld+json">` PriceSpecification. No official API. Rate-limit to 1 req/model/week.                                 |
| Toppreise.ch    | Fetch search result page for model name + "lenovo" query              | No public read API confirmed. Parse HTML or check if price feed is accessible as affiliate. Treat as LOW confidence source requiring validation. |
| Google Shopping | Do not use — no free API for price reads; merchant-side only          | Google Shopping Content API is write-only (merchant pushes data, cannot pull competitor prices for free)                                         |
| GitHub Actions  | Existing CI already triggers on push to main; add Workers deploy step | Use `wrangler deploy` in the CI pipeline after test + build succeed                                                                              |

### Internal Boundaries

| Boundary                           | Communication                                             | Notes                                                                                                                                                        |
| ---------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Frontend ↔ Price API Worker        | HTTPS JSON REST (fetch from useRemotePrices hook)         | Workers must set `Access-Control-Allow-Origin` to match GitHub Pages / Cloudflare Pages origin. When both are on same Cloudflare Worker, CORS is eliminated. |
| Price API Worker ↔ D1              | D1 binding (env.DB.prepare().all())                       | D1 is accessed via Workers binding — no network hop, zero latency                                                                                            |
| Cron Aggregator ↔ Price API Worker | Shared D1 binding — both Workers bind to same D1 database | Aggregator writes; API Worker reads. No direct inter-Worker call.                                                                                            |
| Frontend ↔ Scoring Engine          | Direct TypeScript import (no API)                         | Scoring always runs client-side. Never route through Workers.                                                                                                |
| useRemotePrices ↔ localStorage     | Fallback chain in hook code                               | Remote prices take priority. localStorage is the offline baseline.                                                                                           |

## Sources

- [Cloudflare Workers: Choosing a data or storage product](https://developers.cloudflare.com/workers/platform/storage-options/) — HIGH confidence, official docs
- [Making static sites dynamic with Cloudflare D1](https://blog.cloudflare.com/making-static-sites-dynamic-with-cloudflare-d1/) — HIGH confidence, official Cloudflare blog
- [Cloudflare Workers Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) — HIGH confidence, official docs
- [Workers KV performance improvements Aug 2025](https://developers.cloudflare.com/changelog/2025-08-22-kv-performance-improvements/) — HIGH confidence, official changelog
- [Cloudflare Pages deprecated — migrate to Workers 2025](https://vibecodingwithfred.com/blog/pages-to-workers-migration/) — MEDIUM confidence, community blog but consistent with Cloudflare's own migration guide
- [Cloudflare D1 free tier limits](https://developers.cloudflare.com/d1/platform/limits/) — HIGH confidence, official docs
- [CORS header proxy pattern in Cloudflare Workers](https://developers.cloudflare.com/workers/examples/cors-header-proxy/) — HIGH confidence, official docs
- [Toppreise.ch affiliate/merchant registration](https://www.toppreise.ch/dealer-registration) — MEDIUM confidence; no confirmed read API for non-merchants

---

_Architecture research for: LenovoCompare CH v2 — static + serverless hybrid with price aggregation_
_Researched: 2026-03-13_
