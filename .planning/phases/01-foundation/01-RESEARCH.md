# Phase 1: Foundation - Research

**Researched:** 2026-03-13
**Domain:** React/Next.js UI enhancements + Cloudflare Workers/D1 backend scaffold
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Differences toggle uses exact string match — row hidden if all models produce same `getValue()` text
- No numeric thresholds or fuzzy matching
- Toggle lives in CompareTable header row, right-aligned next to model names
- When active, show "Hiding N identical rows" count badge near the toggle
- Toggle defaults to OFF
- Physical size comparison: proportional CSS rectangles — width x depth as scaled boxes, height as thin side-view bar
- Side-by-side layout, one rectangle per model, using COMPARE_COLORS for borders
- All four dimensions shown: width, depth, height, weight (label below each rectangle)
- Placed as new "Physical Comparison" section above the specs table on compare page
- Collapsible to save vertical space
- All data sourced from existing `Laptop.dimensions` fields (NOTE: these do not yet exist in the type/data — must be added)
- Score value itself is the clickable link (subtle styling — dotted underline on hover)
- Links use existing `sourceUrls[]` field from `ModelBenchmarks`
- For CPU benchmarks: prefer linking to specific model's NotebookCheck review page; fall back to Geekbench browser or Cinebench aggregate
- Scores without a source URL show subtle muted "(unverified)" or "source needed" text after the score
- Source attribution in BenchmarksSection on model detail pages only — not in compare table
- Workers API deployed to `*.workers.dev` subdomain (free tier, no custom domain)
- Static site remains on GitHub Pages at `flongstaff.github.io/lenovocompare-ch`
- Workers and static site are separate origins — CORS headers required on Workers API
- URL redirect/prettification deferred
- D1 schema stores price snapshots with model ID, source, CHF amount, fetch timestamp
- Existing seed-prices.ts data seeded into D1 as initial dataset
- INFR-01/INFR-02 adjusted: Cloudflare Pages deployment replaced with Workers-only deployment (static site stays on GitHub Pages). Single-origin requirement relaxed to CORS-based setup
- GitHub Actions CI updated to include wrangler deploy for Workers
- Playwright smoke test validates static export before deploy
- `useRemotePrices` hook redirected from `/data/prices.json` to Workers API endpoint
- If Workers API is unreachable, silently fall back to existing seed-prices.ts data bundled in the static build
- No stale indicator shown to user

### Claude's Discretion

- CORS header configuration details
- D1 table schema design
- Hono vs vanilla Workers API framework choice
- wrangler.toml configuration
- Specific CSS scaling approach for size rectangles
- Toggle switch component styling (Carbon-consistent)
- Benchmark link URL construction patterns
- Playwright smoke test scope and assertions

### Deferred Ideas (OUT OF SCOPE)

- Custom domain / URL prettification — revisit when a domain is purchased
- Cloudflare Pages migration (replacing GitHub Pages entirely)
- Stale price indicator ("Prices may be outdated" badge) — could add in Phase 2
  </user_constraints>

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                         | Research Support                                                                                         |
| ------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| COMP-01 | User can toggle "show differences only" in compare table                            | `SPEC_ROWS` with `getValue()` per row already exists — add `useState` filter + header toggle             |
| COMP-02 | CSS-scaled physical size overlay for compare page                                   | `Laptop` type missing `dimensions` — requires new optional fields + data backfill for represented models |
| COMP-03 | Every benchmark score in BenchmarksSection links to source page                     | `ModelBenchmarks.sourceUrls[]` exists but is empty in all 97 model entries — needs data fill + UI change |
| COMP-04 | Missing benchmark sources flagged as "source needed"                                | Companion to COMP-03 — same UI change, conditional rendering based on sourceUrls presence                |
| PRIC-01 | Cloudflare Workers project scaffolded with Hono, D1, wrangler config                | New `workers/` dir at project root; `npm create hono@latest` or manual scaffold                          |
| PRIC-02 | D1 schema stores price snapshots with model ID, source, CHF amount, fetch timestamp | `prices` table SQL schema to design                                                                      |
| PRIC-03 | GET /api/prices endpoint returns current prices from D1                             | Hono route + D1 query pattern                                                                            |
| PRIC-04 | Existing seed-prices.ts data seeded into D1 as initial dataset                      | SQL seed file generated from seed-prices.ts data                                                         |
| PRIC-05 | Frontend useRemotePrices hook fetches from Workers API                              | Modify URL in hook; CORS-aware fetch; existing fallback pattern reused                                   |
| INFR-01 | Cloudflare Pages deployment configured (adjusted: Workers-only, GitHub Pages stays) | wrangler.toml + Cloudflare account setup                                                                 |
| INFR-02 | Workers + static site on single domain (adjusted: CORS-based cross-origin)          | Hono cors() middleware with `flongstaff.github.io` origin                                                |
| INFR-03 | GitHub Actions CI updated for wrangler deploy                                       | `cloudflare/wrangler-action@v3` step in deploy.yml or new workers-deploy.yml                             |
| INFR-04 | Playwright smoke test validates static export before deploy                         | New `tests/e2e/smoke.spec.ts` targeting the `out/` static build                                          |

</phase_requirements>

---

## Summary

Phase 1 splits into two parallel tracks. The frontend track delivers three compare-page improvements that touch existing components: a diff-toggle in `CompareTable`, a physical size overlay component, and source-attribution links in `BenchmarksSection`. The backend track scaffolds a Cloudflare Workers project from scratch with Hono + D1, deploys it to `*.workers.dev`, seeds it with the existing 205 seed prices, and redirects the `useRemotePrices` hook to call it.

The most important discovery from codebase analysis: **`Laptop.dimensions` does not exist in `lib/types.ts` or in any model entry in `data/laptops.ts`**. COMP-02 therefore requires (1) adding an optional `dimensions` field to the `Laptop` interface, and (2) populating dimension data for all 124 models from PSREF. Without this data, the physical overlay would render empty boxes. This is the highest-risk deliverable because it requires PSREF data sourcing for 124 models. A pragmatic approach is to add dimensions for the subset of models most likely to be compared (recent ThinkPad X1/T14/L14 series + recent Legion/Yoga), and make the component gracefully hide or show partial data.

A second important discovery: all 97 entries in `data/model-benchmarks.ts` have `sources: ["notebookcheck"]` but zero entries populate `sourceUrls[]`. COMP-03 requires backfilling URLs into the data file — this is a data quality task, not just a UI task.

**Primary recommendation:** Implement frontend changes first (COMP-01/03/04 are low-risk code changes, COMP-02 requires data work). Run Cloudflare scaffold in parallel as a separate work stream since it has no shared dependencies.

---

## Standard Stack

### Core

| Library                     | Version         | Purpose                              | Why Standard                                                           |
| --------------------------- | --------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| Hono                        | ^4.x            | HTTP framework for Workers           | Minimal bundle, first-class Cloudflare Workers support, typed bindings |
| Cloudflare D1               | runtime binding | SQLite-at-edge database              | Free tier, low-latency, built-in wrangler tooling                      |
| wrangler                    | ^3.x            | Cloudflare Workers CLI/dev/deploy    | Official Cloudflare tool, required for D1                              |
| `@cloudflare/workers-types` | ^4.x            | TypeScript types for Workers runtime | Official types, required for `D1Database`, `Env` interfaces            |

### Supporting

| Library                      | Version | Purpose               | When to Use                                                       |
| ---------------------------- | ------- | --------------------- | ----------------------------------------------------------------- |
| `hono/cors`                  | bundled | CORS middleware       | Must be applied before route handlers on `*.workers.dev` endpoint |
| `cloudflare/wrangler-action` | v3      | GitHub Actions deploy | Official action, handles `CLOUDFLARE_API_TOKEN` auth              |

### Alternatives Considered

| Instead of           | Could Use                     | Tradeoff                                                                                          |
| -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------- |
| Hono                 | Vanilla Workers fetch handler | Hono adds ~14KB but provides routing, middleware, typed context — worthwhile for this API surface |
| D1 migrations system | Raw `wrangler d1 execute`     | Migrations track state; better for long-term schema evolution across phases                       |

**Installation (in `workers/` subdirectory):**

```bash
npm create hono@latest workers -- --template cloudflare-workers
cd workers && npm install
npm install -D wrangler @cloudflare/workers-types
```

Or manual scaffold:

```bash
mkdir workers && cd workers
npm init -y
npm install hono
npm install -D wrangler @cloudflare/workers-types typescript
```

---

## Architecture Patterns

### Recommended Project Structure

```
workers/
├── src/
│   └── index.ts           # Hono app entry point
├── migrations/
│   └── 0001_prices.sql    # D1 schema migration
├── seeds/
│   └── seed-prices.sql    # Generated from data/seed-prices.ts
├── wrangler.toml           # Workers config with D1 binding
├── tsconfig.json           # Workers TypeScript config
└── package.json            # Workers-scoped dependencies
```

Note: `workers/` is a standalone package separate from the Next.js project root. It has its own `node_modules`, `tsconfig.json`, and `package.json`. The root `package.json` is not modified.

### Pattern 1: Hono App with D1 Binding

**What:** Hono app uses generic `Bindings` type to make D1 binding type-safe. CORS middleware applied globally before routes.

**When to use:** Any Cloudflare Workers API that calls D1.

```typescript
// Source: https://hono.dev/docs/getting-started/cloudflare-workers
// Source: https://developers.cloudflare.com/d1/worker-api/
import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS must be before routes
app.use(
  "*",
  cors({
    origin: [
      "https://flongstaff.github.io",
      "http://localhost:3000", // dev
    ],
    allowMethods: ["GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400,
  }),
);

app.get("/api/prices", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM prices ORDER BY fetch_timestamp DESC").all<PriceRow>();
  return c.json(results);
});

export default app;
```

### Pattern 2: D1 Schema and Seed Migration

**What:** Schema migration runs once at deploy time. Seed data inserted as a separate SQL file.

**When to use:** Initial database setup. Apply with `wrangler d1 migrations apply`.

```sql
-- migrations/0001_prices.sql
CREATE TABLE IF NOT EXISTS prices (
  id          TEXT PRIMARY KEY,         -- matches SwissPrice.id format ("sp-1")
  laptop_id   TEXT NOT NULL,
  retailer    TEXT NOT NULL,
  price_chf   REAL NOT NULL,
  price_type  TEXT,
  url         TEXT,
  note        TEXT,
  fetch_timestamp TEXT NOT NULL,        -- ISO-8601
  is_user_added INTEGER NOT NULL DEFAULT 0,
  source      TEXT DEFAULT 'seed'       -- 'seed' | 'automated' | 'community'
);

CREATE INDEX IF NOT EXISTS idx_prices_laptop_id ON prices(laptop_id);
```

### Pattern 3: Differences Toggle in CompareTable

**What:** `useState` boolean controlling a filter over `SPEC_ROWS`. All values for each row are computed, then all-equal rows are excluded from render when toggle is active.

**When to use:** Toggle is off by default. Hidden count badge updates reactively.

```typescript
// Inside CompareTable.tsx
const [showDiffsOnly, setShowDiffsOnly] = useState(false);

// Computed inside render — memo not needed since models array rarely exceeds 4
const filteredRows = showDiffsOnly
  ? SPEC_ROWS.filter((row) => {
      if (row.label === "Best Price") return true; // always show price row
      const vals = models.map((m) => row.getValue(m));
      return new Set(vals).size > 1; // at least one difference
    })
  : SPEC_ROWS;

const hiddenCount = SPEC_ROWS.length - filteredRows.length;
```

### Pattern 4: Physical Size Component (CSS Rectangles)

**What:** New component `PhysicalSizeComparison` in `components/compare/`. Pure CSS, no recharts. Proportional scaling computed with `useMemo` from `dimensions` data.

**When to use:** Rendered in `CompareClient.tsx` above `CompareTable`, collapsible via `useState`.

**Scaling approach:**

```typescript
// Scale factor: fit largest model to MAX_WIDTH_PX (e.g., 200px)
const MAX_WIDTH_PX = 200;
const maxWidth = Math.max(...models.map((m) => m.dimensions?.widthMm ?? 0));
const scale = maxWidth > 0 ? MAX_WIDTH_PX / maxWidth : 1;

// Rectangle for each model:
// width: Math.round(m.dimensions.widthMm * scale)
// height: Math.round(m.dimensions.depthMm * scale)  // depth = physical depth
// Border color: COMPARE_COLORS[index]
```

**Weight is not renderable as a rectangle.** Show as a labeled number row below the visual, consistent with the other dimension labels.

### Pattern 5: Benchmark Source Links

**What:** Modify `BenchmarksSection.tsx` to wrap score numbers in `<a>` tags when a `sourceUrl` exists, or add "(unverified)" label when it does not.

**When to use:** Applied to `MiniBar` label or value, or alongside `StatBox`. Applies to CPU scores (Cinebench/Geekbench) and GPU scores (Time Spy/Cyberpunk). The chassis-level `sourceUrls` at the bottom of the component already partially handles this — the per-metric links are the new addition.

**Note:** The CONTEXT.md says "Score value itself is the clickable link" — the `MiniBar` component renders a label + bar + numeric value. The `value` display is the click target.

### Pattern 6: wrangler.toml for this project

```toml
name = "lenovocompare-prices"
main = "src/index.ts"
compatibility_date = "2026-03-13"

[[d1_databases]]
binding = "DB"
database_name = "lenovocompare-prices"
database_id = "<generate-with-wrangler-d1-create>"
migrations_dir = "migrations"
```

### Anti-Patterns to Avoid

- **Importing Workers code into Next.js:** `workers/` is a separate package. Never import from `workers/src/` in the Next.js codebase.
- **Using `wrangler dev` for integration tests:** `wrangler dev` requires Cloudflare auth for remote D1. Use `--local` flag which uses miniflare locally.
- **Applying migrations with `--remote` in CI without confirmation:** Wrangler will prompt interactively — use `--yes` flag in CI commands.
- **CORS wildcard `*` on the Workers endpoint:** Wildcard is fine for a public API but the decision says to restrict to the GitHub Pages origin. Use the array form.
- **Forgetting to handle OPTIONS preflight:** Hono `cors()` middleware handles this automatically, but only if applied before all routes.
- **Modifying `SPEC_ROWS` const for the diff filter:** Filter the array on render, never mutate `SPEC_ROWS`.
- **Adding `dimensions` as required on `Laptop`:** It must be optional (`?`) per the gotchas rule — not all 124 models will have data immediately. Components must guard with `?.` chains.

---

## Don't Hand-Roll

| Problem                      | Don't Build                                 | Use Instead                     | Why                                               |
| ---------------------------- | ------------------------------------------- | ------------------------------- | ------------------------------------------------- |
| Workers HTTP routing         | Custom fetch event handler with URL parsing | Hono                            | Path params, middleware chain, TypeScript support |
| CORS preflight handling      | Manual OPTIONS response                     | `hono/cors` middleware          | Handles preflight, Vary header, maxAge cache      |
| D1 connection pooling        | None needed                                 | D1 binding directly             | D1 binding is request-scoped, no pool needed      |
| Browser compatibility date   | Hardcoded string                            | `npx wrangler generate` default | Wrangler pins to a valid compatibility date       |
| TypeScript types for runtime | Manual interface                            | `@cloudflare/workers-types`     | Official package, always in sync with runtime     |

**Key insight:** Cloudflare's toolchain handles the complexity of Workers deployment. Hono adds routing without complexity. The entire Workers scaffold should be under 100 lines of TypeScript.

---

## Common Pitfalls

### Pitfall 1: `Laptop.dimensions` Does Not Exist

**What goes wrong:** COMP-02 assumes `Laptop.dimensions` fields exist (`widthMm`, `depthMm`, `heightMm`). They are not in `lib/types.ts` and no model in `data/laptops.ts` has them.
**Why it happens:** The CONTEXT.md mentioned them as "Reusable Assets" but they are a planned addition, not current state.
**How to avoid:** Wave 0 task must add the optional `dimensions` interface to `Laptop` in `lib/types.ts` before any component tries to access it. Data population is a separate data task. The component must render gracefully when dimensions are absent.
**Warning signs:** TypeScript error on `m.dimensions?.widthMm` — property does not exist on type `Laptop`.

### Pitfall 2: `sourceUrls[]` Is Empty in All 97 Model Benchmark Entries

**What goes wrong:** COMP-03 links use `chassisBench.sourceUrls[]`. All 97 model entries in `data/model-benchmarks.ts` have `sources: ["notebookcheck"]` but no `sourceUrls` array.
**Why it happens:** The URLs were never populated when the benchmark data was authored.
**How to avoid:** The implementation task for COMP-03 must include a data task: populate `sourceUrls` for at least the most-viewed models. The UI can render the "source needed" fallback for models without URLs, satisfying COMP-04 in the interim.
**Warning signs:** `chassisBench.sourceUrls` is `undefined`, so the sources footer at the bottom of `BenchmarksSection` already falls back to displaying source names without links (lines 606-608 of the current component).

### Pitfall 3: Workers `wrangler dev` Requires Auth for Remote D1

**What goes wrong:** Running `wrangler dev` without `--local` flag tries to connect to real Cloudflare D1 and requires auth.
**Why it happens:** Wrangler defaults changed in v3.33.0 — `d1 execute` defaults to local, but `wrangler dev` still connects remotely.
**How to avoid:** Use `wrangler dev --local` for development. Document this in `workers/README.md` or `package.json` dev script.

### Pitfall 4: Diff Toggle and Section Collapse Interact

**What goes wrong:** The existing `SPEC_ROWS` system has two state variables: `collapsedSections` and `showAll`. Adding a third (`showDiffsOnly`) creates 8 state combinations. When `showDiffsOnly` is active and `showAll` is false, the user could see "0 different rows in Quick Compare sections" with no feedback.
**Why it happens:** The existing component already hides rows in "non-quick" sections.
**How to avoid:** Apply diff filter after the existing `isHidden` / `isCollapsed` guards. "Hiding N identical rows" count should count rows that are visible (not hidden by section collapse) but filtered by diff logic.

### Pitfall 5: PostToolUse Hooks Reformat on Save

**What goes wrong:** The project hooks auto-run Prettier and ESLint on every file save. When modifying `CompareTable.tsx` (which is large), the hook may strip imports or reformat in ways that break the change.
**Why it happens:** ESLint auto-removes "unused" imports immediately after save.
**How to avoid:** Add all new imports and all code that uses them in a single `Edit` call. Never stage imports separately from the code that uses them.

### Pitfall 6: GitHub Actions wrangler-action Requires Two Secrets

**What goes wrong:** The deploy step silently fails or uses wrong account if `CLOUDFLARE_ACCOUNT_ID` is missing.
**Why it happens:** `CLOUDFLARE_API_TOKEN` alone is not sufficient — account ID must also be set.
**How to avoid:** Both `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` must be added to the repository's GitHub Secrets before the deploy step runs.

### Pitfall 7: D1 Seed Data Must Use Valid Laptop IDs

**What goes wrong:** Seed SQL generated from `seed-prices.ts` uses `laptopId` values as foreign-key-like references. If the SQL inserts a `laptop_id` that doesn't match any model, the API can return prices for non-existent models.
**Why it happens:** No referential integrity in D1 SQLite (no FK enforcement by default).
**How to avoid:** Generate the seed SQL file from the TypeScript source in a script that validates laptop IDs against `data/laptops.ts`. Do not hand-write the SQL seed.

---

## Code Examples

Verified patterns from official sources:

### Hono D1 Query Pattern

```typescript
// Source: https://developers.cloudflare.com/d1/worker-api/
const { results } = await c.env.DB.prepare("SELECT * FROM prices WHERE laptop_id = ?").bind(laptopId).all<PriceRow>();

// For full table scan (GET /api/prices)
const { results } = await c.env.DB.prepare("SELECT * FROM prices ORDER BY fetch_timestamp DESC").all<PriceRow>();
return c.json(results);
```

### Hono CORS Setup

```typescript
// Source: https://hono.dev/docs/middleware/builtin/cors
import { cors } from "hono/cors";

app.use(
  "*",
  cors({
    origin: ["https://flongstaff.github.io", "http://localhost:3000"],
    allowMethods: ["GET", "OPTIONS"],
    maxAge: 86400,
  }),
);
```

### wrangler.toml (complete)

```toml
# Source: https://developers.cloudflare.com/workers/wrangler/configuration/
name = "lenovocompare-prices"
main = "src/index.ts"
compatibility_date = "2026-03-13"

[[d1_databases]]
binding = "DB"
database_name = "lenovocompare-prices"
database_id = "REPLACE_AFTER_CREATE"
migrations_dir = "migrations"
```

### GitHub Actions Deploy Step

```yaml
# Source: https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
- name: Deploy Workers
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    workingDirectory: workers
```

### D1 Migrations Apply in CI

```yaml
# Source: https://developers.cloudflare.com/d1/reference/migrations/
- name: Apply D1 Migrations
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    workingDirectory: workers
    command: d1 migrations apply lenovocompare-prices --remote --yes
```

### Differences Toggle — Filter Logic

```typescript
// Inside CompareTable.tsx
const [showDiffsOnly, setShowDiffsOnly] = useState(false);

// Compute inside render (not useMemo — max 4 models, ~30 rows)
const visibleRows = SPEC_ROWS.filter((row) => {
  if (!showDiffsOnly) return true;
  if (row.label === "Best Price") return true; // always show pricing
  const vals = models.map((m) => row.getValue(m));
  return new Set(vals).size > 1;
});
const hiddenIdenticalCount = SPEC_ROWS.length - visibleRows.length;
```

### Physical Size CSS Scaling

```typescript
// New component: components/compare/PhysicalSizeComparison.tsx
const MAX_WIDTH_PX = 200; // largest model fills 200px
const scale =
  Math.max(...models.map((m) => m.dimensions?.widthMm ?? 0)) > 0
    ? MAX_WIDTH_PX / Math.max(...models.map((m) => m.dimensions?.widthMm ?? 0))
    : 1;

// Per-model rectangle
const w = Math.round((m.dimensions?.widthMm ?? 0) * scale);
const h = Math.round((m.dimensions?.depthMm ?? 0) * scale);
// style={{ width: w, height: h, border: `2px solid ${COMPARE_COLORS[i]}` }}
```

### Laptop Dimensions Type Addition

```typescript
// lib/types.ts — add inside Laptop interface
readonly dimensions?: {
  readonly widthMm: number
  readonly depthMm: number
  readonly heightMm: number
}
```

### useRemotePrices Redirect

```typescript
// lib/hooks/useRemotePrices.ts
// Replace static file URL with Workers API endpoint
const WORKERS_API_URL = process.env.NEXT_PUBLIC_WORKERS_URL ?? "https://lenovocompare-prices.YOUR_ACCOUNT.workers.dev";

// In fetchPrices():
const res = await fetch(`${WORKERS_API_URL}/api/prices`);
```

Note: The Workers URL must be set as `NEXT_PUBLIC_WORKERS_URL` in `.env.local` for development and as a GitHub Actions secret/variable for production builds. This avoids hardcoding the account subdomain.

### Playwright Smoke Test (INFR-04)

```typescript
// tests/e2e/smoke.spec.ts
// Run against the static export served locally
import { test, expect } from "@playwright/test";

test("home page loads with model cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-testid="laptop-card"]').first()).toBeVisible();
});

test("compare page renders without errors", async ({ page }) => {
  await page.goto("/compare");
  await expect(page.locator("h1")).toContainText(/Compare/i);
});

test("model detail page renders", async ({ page }) => {
  await page.goto("/model/x1-carbon-gen12");
  await expect(page.locator("h1")).toBeVisible();
});
```

The smoke test playwright config should set `webServer.command` to `npx serve out -p 3001` (targeting the static `out/` directory) and `baseURL` to `http://localhost:3001`. This validates the static export, not the dev server. Create a separate config file `playwright.smoke.config.ts` to avoid conflicting with the existing `playwright.config.ts` (which targets dev server).

---

## State of the Art

| Old Approach                                          | Current Approach                        | When Changed        | Impact                                                                                                        |
| ----------------------------------------------------- | --------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------- |
| GitHub Pages only for static + Vercel/Netlify for API | Cloudflare Workers + GitHub Pages       | Ongoing (2024-2025) | Free tier edge compute, D1 at no extra cost                                                                   |
| `wrangler publish`                                    | `wrangler deploy`                       | Wrangler v3 (2023)  | `publish` is deprecated — use `deploy`                                                                        |
| `wrangler d1 execute` defaults to remote              | Defaults to local as of wrangler@3.33.0 | 2024                | `--remote` flag required for production operations                                                            |
| Cloudflare Pages Functions                            | Cloudflare Workers standalone           | 2024                | Workers standalone is preferred for API-only projects; Pages Functions are for fullstack-on-Pages deployments |

**Deprecated/outdated:**

- `wrangler publish`: replaced by `wrangler deploy` — using `publish` in CI will fail on wrangler v3+
- `next export` command: replaced by `output: 'export'` in `next.config.js` — check the project's next.config to confirm it already uses this

---

## Open Questions

1. **Laptop dimensions data source**
   - What we know: PSREF pages contain physical dimensions for each model. The scrape-psref script exists.
   - What's unclear: How many of the 124 models have been scraped and whether dimensions are in the scrape output.
   - Recommendation: Check `scripts/scrape-psref.ts` output format. If dimensions are in PSREF data, a migration script can populate all 124 models. If not, populate the 20-30 most-compared models manually as a Wave 0 data task, defer the rest.

2. **NEXT_PUBLIC_WORKERS_URL environment variable in production**
   - What we know: The static site is built in GitHub Actions and deployed to GitHub Pages. The Workers URL must be embedded at build time.
   - What's unclear: Whether the repo currently has `NEXT_PUBLIC_WORKERS_URL` set as a GitHub Actions variable or secret.
   - Recommendation: Add `NEXT_PUBLIC_WORKERS_URL` as a GitHub Actions variable (not secret — it's a public URL). In the build step, pass it as an environment variable.

3. **Playwright smoke test `serve` tool availability in CI**
   - What we know: The existing `playwright.config.ts` uses `npm run dev`. The smoke test must target `out/` static export.
   - What's unclear: Whether `serve` (`npm install -g serve`) is available in the GitHub Actions ubuntu-latest runner or if `npx serve` is sufficient.
   - Recommendation: Use `npx serve out -p 3001` — npx handles the install. No global install needed.

---

## Validation Architecture

### Test Framework

| Property           | Value                                                                         |
| ------------------ | ----------------------------------------------------------------------------- |
| Framework          | Vitest 4.x (unit), Playwright 1.58.x (E2E)                                    |
| Config file        | `vitest.config.ts` (or inherited from `package.json`), `playwright.config.ts` |
| Quick run command  | `npm test` (Vitest)                                                           |
| Full suite command | `npm test && npx playwright test --config playwright.smoke.config.ts`         |

### Phase Requirements → Test Map

| Req ID  | Behavior                                             | Test Type                    | Automated Command                                                                                 | File Exists? |
| ------- | ---------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------- | ------------ |
| COMP-01 | Diff toggle hides identical rows                     | unit                         | `npm test -- tests/compare-table.test.ts`                                                         | Wave 0       |
| COMP-02 | Physical size component renders rectangles           | unit                         | `npm test -- tests/physical-size.test.ts`                                                         | Wave 0       |
| COMP-03 | Benchmark scores are clickable links when URL exists | unit                         | `npm test -- tests/benchmarks-section.test.ts`                                                    | Wave 0       |
| COMP-04 | Missing source shows "source needed" text            | unit                         | `npm test -- tests/benchmarks-section.test.ts`                                                    | Wave 0       |
| PRIC-01 | Workers scaffold compiles and wrangler types pass    | manual (wrangler type-check) | `cd workers && npx tsc --noEmit`                                                                  | Wave 0       |
| PRIC-02 | D1 schema migration applies without error            | manual (wrangler local)      | `cd workers && npx wrangler d1 migrations apply lenovocompare-prices --local`                     | Wave 0       |
| PRIC-03 | GET /api/prices returns JSON array                   | unit (Workers)               | `cd workers && npm test` (if Vitest added)                                                        | Wave 0       |
| PRIC-04 | Seed data loads into D1                              | manual (wrangler local)      | `cd workers && npx wrangler d1 execute lenovocompare-prices --file seeds/seed-prices.sql --local` | Wave 0       |
| PRIC-05 | useRemotePrices falls back to seed on error          | unit                         | `npm test -- tests/useRemotePrices.test.ts`                                                       | Wave 0       |
| INFR-01 | Workers deployed to workers.dev                      | smoke/manual                 | `curl https://lenovocompare-prices.*.workers.dev/api/prices`                                      | Post-deploy  |
| INFR-02 | CORS headers present on response                     | smoke/manual                 | curl with `Origin: https://flongstaff.github.io`                                                  | Post-deploy  |
| INFR-03 | GitHub Actions deploy job succeeds                   | CI (GitHub)                  | Observe Actions run                                                                               | Needs update |
| INFR-04 | Playwright smoke passes on static export             | E2E                          | `npx playwright test --config playwright.smoke.config.ts`                                         | Wave 0       |

### Sampling Rate

- **Per task commit:** `npm test` (Vitest unit suite)
- **Per wave merge:** `npm test && npm run build && npx playwright test --config playwright.smoke.config.ts`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/compare-table.test.ts` — covers COMP-01 (diff toggle filter logic)
- [ ] `tests/physical-size.test.ts` — covers COMP-02 (scaling math, graceful empty state)
- [ ] `tests/benchmarks-section.test.ts` — covers COMP-03/04 (link rendering, unverified label)
- [ ] `tests/useRemotePrices.test.ts` — covers PRIC-05 (fallback behavior)
- [ ] `playwright.smoke.config.ts` — separate smoke config targeting `out/` static export
- [ ] `tests/e2e/smoke.spec.ts` — INFR-04 smoke test (home, compare, model detail page loads)
- [ ] `workers/src/index.test.ts` — PRIC-03 endpoint test (if unit testing Workers with Vitest)
- [ ] `lib/types.ts` `dimensions` field — type addition enables COMP-02

---

## Sources

### Primary (HIGH confidence)

- [Cloudflare D1 Get Started](https://developers.cloudflare.com/d1/get-started/) — schema creation, wrangler commands, binding configuration
- [Cloudflare D1 Worker API](https://developers.cloudflare.com/d1/worker-api/) — `D1Database` interface, `prepare/bind/all/first/run` patterns
- [Cloudflare D1 Migrations](https://developers.cloudflare.com/d1/reference/migrations/) — migration directory structure, apply commands, CI flags
- [Cloudflare Workers GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/) — `wrangler-action@v3`, required secrets
- [Hono Getting Started — Cloudflare Workers](https://hono.dev/docs/getting-started/cloudflare-workers) — app structure, bindings type pattern
- [Hono CORS Middleware](https://hono.dev/docs/middleware/builtin/cors) — origin array, `allowMethods`, middleware order
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) — `wrangler.toml` fields, `migrations_dir`, `compatibility_date`
- Codebase audit — `CompareTable.tsx`, `BenchmarksSection.tsx`, `useRemotePrices.ts`, `lib/types.ts`, `data/model-benchmarks.ts`

### Secondary (MEDIUM confidence)

- [Cloudflare CORS Header Proxy Example](https://developers.cloudflare.com/workers/examples/cors-header-proxy/) — CORS pitfall for separate origins (GitHub Pages community confirmation)
- [cloudflare/wrangler-action GitHub](https://github.com/cloudflare/wrangler-action) — `accountId` requirement (cross-verified with official docs)

### Tertiary (LOW confidence)

- WebSearch: `wrangler d1 execute --local` behavior change in v3.33.0 — flagged; verify with official release notes before implementation

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — Cloudflare official docs confirm Hono, D1, wrangler-action patterns
- Architecture: HIGH — Direct codebase inspection confirms component integration points
- Pitfalls: HIGH (COMP-02 gap, sourceUrls gap) — confirmed by reading actual source files; MEDIUM (wrangler v3 behavior change) — from web search, verify
- Validation: HIGH — Existing Playwright + Vitest setup confirmed, gap list from codebase scan

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (Cloudflare APIs evolve; verify wrangler version at implementation time)
