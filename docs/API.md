# LenovoCompare CH — API Reference

Base URL: `https://lenovocompare-prices.franco-longstaff.workers.dev`

The pricing API is a Cloudflare Workers service backed by D1 (SQLite). It serves Swiss laptop prices in CHF for the LenovoCompare frontend. The API is read-only.

## Authentication

None. The API is public and unauthenticated.

## CORS Policy

The API uses a restrictive CORS policy. Only these origins are allowed:

| Origin                         | Environment |
| ------------------------------ | ----------- |
| `https://flongstaff.github.io` | Production  |
| `http://localhost:3000`        | Development |

- **Allowed methods:** `GET`, `OPTIONS`
- **Allowed headers:** `Content-Type`
- **Preflight cache:** 86400 seconds (24 hours)

Requests from other origins will be blocked by the browser's CORS enforcement.

## Rate Limiting

No explicit rate limiting is enforced at the application level. Cloudflare's default DDoS protection applies.

## Error Response Format

All errors return a JSON object with a single `error` field:

```json
{
  "error": "Failed to fetch prices"
}
```

Error responses use HTTP 500 status codes for server-side failures. There are no 4xx error responses — invalid parameters are silently clamped to valid ranges (see pagination below).

---

## Endpoints

### `GET /`

Health check endpoint.

**Response:** `200 OK`

```json
{
  "status": "ok",
  "service": "lenovocompare-prices"
}
```

**Example:**

```bash
curl https://lenovocompare-prices.franco-longstaff.workers.dev/
```

---

### `GET /api/prices`

Returns a paginated list of all prices, ordered by `dateAdded` descending (newest first).

**Query Parameters:**

| Parameter | Type   | Default | Range | Description                         |
| --------- | ------ | ------- | ----- | ----------------------------------- |
| `limit`   | number | 200     | 1–500 | Maximum number of results to return |
| `offset`  | number | 0       | 0+    | Number of results to skip           |

- `limit` values above 500 are silently clamped to 500.
- `offset` values below 0 are silently clamped to 0.
- Non-numeric values fall back to defaults.

**Response:** `200 OK` — JSON array of price objects.

```json
[
  {
    "id": "sp-1",
    "laptopId": "t14-gen5-intel",
    "retailer": "Digitec",
    "price": 1299,
    "url": "https://www.digitec.ch/...",
    "dateAdded": "2025-01-15",
    "isUserAdded": false,
    "priceType": "retail",
    "note": null
  },
  {
    "id": "sp-2",
    "laptopId": "x1-carbon-gen12",
    "retailer": "Brack",
    "price": 1849,
    "url": null,
    "dateAdded": "2025-01-10",
    "isUserAdded": true,
    "priceType": "sale",
    "note": "Winter sale"
  }
]
```

**Examples:**

```bash
# Fetch first 200 prices (default)
curl https://lenovocompare-prices.franco-longstaff.workers.dev/api/prices

# Fetch 50 prices
curl "https://lenovocompare-prices.franco-longstaff.workers.dev/api/prices?limit=50"

# Paginate: second page of 100
curl "https://lenovocompare-prices.franco-longstaff.workers.dev/api/prices?limit=100&offset=100"
```

---

### `GET /api/prices/:laptopId`

Returns all prices for a specific laptop model, ordered by `dateAdded` descending (newest first). Not paginated — returns all matching rows.

**Path Parameters:**

| Parameter  | Type   | Description                                          |
| ---------- | ------ | ---------------------------------------------------- |
| `laptopId` | string | Model identifier (e.g., `t14-gen5-intel`, `p1-gen7`) |

**Response:** `200 OK` — JSON array of price objects (same shape as `/api/prices`). Returns an empty array `[]` if no prices exist for the given model.

```json
[
  {
    "id": "sp-42",
    "laptopId": "t14-gen5-intel",
    "retailer": "Digitec",
    "price": 1299,
    "url": "https://www.digitec.ch/...",
    "dateAdded": "2025-01-15",
    "isUserAdded": false,
    "priceType": "retail",
    "note": null
  }
]
```

**Examples:**

```bash
# Prices for ThinkPad T14 Gen 5 Intel
curl https://lenovocompare-prices.franco-longstaff.workers.dev/api/prices/t14-gen5-intel

# Prices for ThinkPad P1 Gen 7
curl https://lenovocompare-prices.franco-longstaff.workers.dev/api/prices/p1-gen7
```

---

## Price Object Schema

Each price object in the response has this shape:

| Field         | Type           | Nullable | Description                                                   |
| ------------- | -------------- | -------- | ------------------------------------------------------------- |
| `id`          | string         | No       | Unique price ID (`sp-N` for seeds, UUIDs for user-submitted)  |
| `laptopId`    | string         | No       | References a laptop model ID from `data/laptops.ts`           |
| `retailer`    | string         | No       | Swiss retailer name (e.g., Digitec, Brack, Toppreise)         |
| `price`       | number         | No       | Price in CHF (Swiss francs), always > 0                       |
| `url`         | string \| null | Yes      | Direct product URL at the retailer                            |
| `dateAdded`   | string         | No       | ISO date string (`YYYY-MM-DD`)                                |
| `isUserAdded` | boolean        | No       | `true` for community-contributed, `false` for curated seeds   |
| `priceType`   | string \| null | Yes      | Price category (e.g., `retail`, `sale`, `edu`, `refurbished`) |
| `note`        | string \| null | Yes      | Freeform note (e.g., "edu discount", "open box")              |

## Database Schema

The D1 database table backing this API:

```sql
CREATE TABLE prices (
  id          TEXT PRIMARY KEY,
  laptop_id   TEXT NOT NULL,
  retailer    TEXT NOT NULL,
  price_chf   REAL NOT NULL,
  price_type  TEXT,
  url         TEXT,
  note        TEXT,
  date_added  TEXT NOT NULL,
  is_user_added INTEGER NOT NULL DEFAULT 0,
  source      TEXT NOT NULL DEFAULT 'seed'
);
```

Column names are transformed to camelCase in the API response (e.g., `laptop_id` becomes `laptopId`, `price_chf` becomes `price`, `is_user_added` becomes `isUserAdded`).

The `source` column is stored in the database but not exposed in the API response.

## Infrastructure

- **Runtime:** Cloudflare Workers
- **Framework:** [Hono](https://hono.dev/)
- **Database:** Cloudflare D1 (SQLite at the edge)
- **Worker name:** `lenovocompare-prices`

## Client Integration

The frontend consumes this API via the `useRemotePrices` hook (`lib/hooks/useRemotePrices.ts`), which:

- Fetches `/api/prices` with default pagination (200 results)
- Caches results in a module-level variable for 15 minutes
- Falls back to an empty array on failure (seed prices from `data/seed-prices.ts` are always available as a static fallback)
- Deduplicates concurrent requests via a shared fetch promise

The base URL is configurable via `NEXT_PUBLIC_WORKERS_URL` environment variable, defaulting to the production Workers URL.
