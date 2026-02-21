---
name: price-audit
description: Validate price-baselines.ts and seed-prices.ts coverage and sanity
---

# Price Data Audit

Cross-validate all pricing data files for completeness, consistency, and sanity.

## Data Files

- `data/laptops.ts` — 98+ model definitions (source of truth for model IDs)
- `data/price-baselines.ts` — MSRP, typical retail, historical low per model
- `data/seed-prices.ts` — Curated Swiss retail prices (~205 entries)

## Checks

### 1. Coverage

For every model ID in `laptops.ts`:

- ✅ Has entry in `price-baselines.ts`
- ✅ Has at least 1 price in `seed-prices.ts`
- ⚠️ Flag models with only 1 seed price (ideally 2+)

### 2. Baseline Sanity

For each baseline entry:

- `msrp > 0` and `msrp <= 10000` (CHF range)
- `typicalRetail < msrp` (retail should be below MSRP)
- `historicalLow < typicalRetail` (low should be below typical)
- `historicalLow > 0` (no free laptops)
- `historicalLowDate` is valid ISO date
- `historicalLowRetailer` is one of known retailers (see RETAILERS in `lib/constants.ts`)

### 3. Seed Price Sanity

For each seed price:

- `price > 0` and `price <= 10000`
- `laptopId` matches a valid model in `laptops.ts`
- `retailer` is a known retailer
- `dateAdded` is valid ISO date
- `priceType` is one of: "msrp", "retail", "sale", "used"
- If `priceType === "sale"`, should have a `note` (e.g., "Black Friday 2024")

### 4. Cross-Reference

- Seed prices should be within reasonable range of baselines:
  - `price <= baseline.msrp * 1.1` (not much above MSRP)
  - `price >= baseline.historicalLow * 0.5` (not suspiciously low)
- Flag any seed price that claims "sale" but is above `typicalRetail`

### 5. Year Consistency

- Group models by year from `laptops.ts`
- Newer models should generally have higher MSRPs than same-series older models
- Flag any 2025 model with MSRP below its 2023 equivalent

## Output Format

```
Price Audit Report
==================

Coverage:
  ✅ N/N models have baselines
  ✅ N/N models have seed prices
  ⚠️ X models have only 1 seed price: [list]

Baseline Sanity:
  ✅ All N baselines pass range checks
  ✅ All MSRP > typical > low ordering correct

Seed Price Sanity:
  ✅ N prices pass validation
  ⚠️ X sale prices missing notes: [list]

Cross-Reference:
  ✅ All prices within expected range of baselines

Summary: N models, N baselines, N seed prices — X warnings, Y errors
```

## When to Run

- After adding new models (`/add-laptop`)
- After editing `seed-prices.ts` or `price-baselines.ts`
- Before commits that touch pricing data
- As part of `/data-sync-check`
