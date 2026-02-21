# Price Trend Analyzer Agent

Analyze price data across all models for economic plausibility, trend anomalies, and data quality issues.

## Data Files

- `data/seed-prices.ts` — ~205 curated Swiss prices in CHF
- `data/price-baselines.ts` — Static baselines (MSRP, typical retail, historical low) per model
- `data/laptops.ts` — Model metadata (year, lineup, series) for context

## Analysis Checks

### 1. Baseline Sanity

For each model in `price-baselines.ts`:

- **MSRP > Typical Retail > Historical Low** — this ordering must hold. Flag any inversions.
- **Historical Low > 0** — no zero or negative baselines.
- **MSRP within lineup norms**: ThinkPad X1 series MSRP typically CHF 1500–3500, T series CHF 1000–2200, L/E series CHF 700–1500. IdeaPad Pro CHF 800–2000. Legion CHF 1200–3500. Flag extreme outliers.
- **Historical Low retailer** exists and is a recognized Swiss retailer (Digitec, Galaxus, Brack, Lenovo CH, Interdiscount, Fust, MediaMarkt, Revendo, Back Market, Ricardo, Tutti).

### 2. Seed Price Plausibility

For each price in `seed-prices.ts`:

- **Price > 0** — no zero or negative prices.
- **Price within ±50% of MSRP** — if a baseline exists, prices outside this range are suspicious (unless `priceType` is `used` or `refurbished`, which can be much lower).
- **Refurbished/Used prices < Retail prices** — for the same model, refurbished and used prices should generally be lower than retail.
- **Date plausibility** — `dateAdded` should not be in the future. Dates far in the past (>3 years before model release year) are suspicious.
- **No duplicate entries** — same model + same retailer + same price + same date = likely duplicate.

### 3. Cross-Model Trend Analysis

- **Newer gen cheaper than older gen** — if a Gen 6 model of the same series is cheaper than Gen 5, it may indicate a data error (unless the Gen 5 was a premium config).
- **Legion vs ThinkPad price overlap** — Legion models with dGPUs should generally cost more than equivalent ThinkPad models. Flag cases where a Legion model is significantly cheaper than a comparable ThinkPad.
- **Price clustering** — if >3 models in the same series have identical prices, flag as potentially copy-pasted data.

### 4. Coverage Gaps

- **Models without any seed prices** — list models that exist in `laptops.ts` but have zero entries in `seed-prices.ts`.
- **Models without baselines** — list models missing from `price-baselines.ts`.
- **Single-source models** — models where all prices come from a single retailer (less reliable for trend analysis).
- **Price type distribution** — flag models with only MSRP or only used prices (limited price intelligence).

### 5. Sparkline/Chart Data Quality

With the new PriceSparkline and PriceTimelineChart components:

- **Minimum 2 data points** — models with only 1 price entry won't render a sparkline. List these.
- **Chronological spread** — models where all prices share the same `dateAdded` won't show a meaningful trend line. Flag groups where date range < 7 days.
- **Trend direction sanity** — if a model's prices are monotonically increasing over time, flag it (prices normally decrease or fluctuate, not steadily increase).

## Output

```
Price Trend Analysis
====================

Baseline Sanity
  ✅ 97/97 models: MSRP > Typical > Historical Low
  ❌ x1-yoga-gen9: Typical (CHF 2199) > MSRP (CHF 2099)
  ⚠️  e14-gen6-intel: MSRP CHF 599 — unusually low for ThinkPad

Seed Price Plausibility
  ✅ 203/205 prices within ±50% of MSRP
  ❌ sp-42: t14-gen5-intel at CHF 3999 (MSRP CHF 1599) — 150% above MSRP
  ⚠️  sp-101: refurbished at CHF 1499, higher than retail CHF 1399

Cross-Model Trends
  ⚠️  t14-gen6-intel (CHF 1199) cheaper than t14-gen5-intel (CHF 1299) — expected for newer gen?
  ✅ No duplicate price clusters detected

Coverage Gaps
  ❌ 3 models with no seed prices: [list]
  ⚠️  12 models with only 1 price entry (no sparkline)
  ⚠️  8 models with all prices on same date

Summary
  Total models: 97
  With baselines: 97 (100%)
  With seed prices: 94 (97%)
  With ≥2 prices (sparkline-ready): 85 (88%)
  Anomalies found: X
```
