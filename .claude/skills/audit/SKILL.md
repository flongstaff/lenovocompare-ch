---
name: audit
description: Run targeted audits — performance/bundle, pricing, retailers, or PSREF URLs
disable-model-invocation: true
---

# Audit

Targeted audits for specific subsystems. Each mode runs independently.

## Usage

```
/audit perf        # Lighthouse performance + bundle size regression
/audit price       # Price data coverage and sanity
/audit retailer    # Retailer consistency across all touchpoints
/audit psref       # PSREF URL coverage and search fallback quality
```

## Mode: perf

Run Lighthouse performance audit against localhost:3000.

### Workflow

1. Verify dev server is running
2. Run build analysis: `npm run build 2>&1 | grep -E '(Route|First Load|├|└|┌)'`
3. Use Playwright MCP to navigate each route and capture performance metrics:
   - `/`, `/compare?ids=t14s-gen6-amd,t14-gen5-intel`, `/model/t14s-gen6-amd`, `/pricing`, `/hardware`
4. Evaluate `performance.getEntriesByType('navigation')` for timing data
5. Check for layout shifts

### Bundle Size Baselines

Flag warnings if:

- Any route's First Load JS exceeds **185 kB**
- Total shared JS exceeds **100 kB**
- Any route increased by more than **5 kB** from baseline

Current baselines (update after intentional changes):

- `/` — 159 kB | `/compare` — 163 kB | `/model/[id]` — 177 kB
- `/pricing` — 145 kB | `/hardware` — 125 kB | Shared — 87.7 kB

Last updated: 2026-02-20

## Mode: price

Cross-validate all pricing data for completeness, consistency, and sanity.

### Checks

1. **Coverage**: Every model has baseline + at least 1 seed price
2. **Baseline sanity**: `msrp > typicalRetail > historicalLow > 0`, all within CHF 200-10000
3. **Seed price sanity**: Valid laptopId, retailer, dateAdded, priceType; sale prices have notes
4. **Cross-reference**: Seed prices within reasonable range of baselines
5. **Year consistency**: Newer models generally have higher MSRPs than same-series older models

### Output

```
Price Audit Report
==================
Coverage:    N/N baselines, N/N seed prices
Sanity:      N baselines pass, N prices pass
Warnings:    X models with only 1 price, Y sale prices missing notes
```

## Mode: retailer

Validate retailer consistency across all touchpoints.

### Checks

1. **RETAILERS constant** (`lib/constants.ts`) as source of truth
2. **Search URL coverage** (`lib/retailers.ts`) — every retailer has URL functions
3. **Chart color coverage** (`PriceHistoryCard.tsx`) — every retailer has a color
4. **Data file references** — seed-prices and price-baselines use only known retailers
5. **Skill doc references** — hardcoded retailer lists in skill docs aren't stale
6. **PriceType coverage** — `lib/types.ts` PriceType matches `PriceEntryForm.tsx` PRICE_TYPES

### Output

```
Retailer Audit Results
──────────────────────
RETAILERS (source of truth): 12
Search URL coverage:  12/12
Chart colors:         12/12
Data file retailers:  All valid
PriceType sync:       OK
Issues: None
```

## Mode: psref

Validate PSREF URL coverage and search fallback quality.

### Checks

1. **Coverage**: Every model has non-empty `psrefUrl`
2. **Search keyword quality**: `getPsrefSearchUrl` resolves to clean keyword (no parentheses, <40 chars)
3. **Extraction strategy distribution**: MT param / Name suffix / URL path / Full name fallback
4. Full name fallback count should be 0 (flag as warning)

### Output

```
PSREF Audit Results
───────────────────
Total: 98+ models
Strategy: MT param: 23, Name suffix: 29, URL path: 45, Fallback: 0
Issues: None
```

## When to Run

- **perf**: Before releases, after adding large components or data
- **price**: After editing seed-prices.ts or price-baselines.ts
- **retailer**: After adding/removing retailers
- **psref**: After `/add-laptop` or modifying `getPsrefSearchUrl`
