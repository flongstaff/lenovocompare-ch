---
name: retailer-audit
description: Validate retailer consistency across constants, search URLs, chart colors, data files, and skill docs
---

# Retailer Audit

Validates that every retailer is consistently defined across all touchpoints — no orphaned references, no missing colors, no dead brands.

## What to Check

### 1. RETAILERS constant as source of truth

Read `lib/constants.ts` → `RETAILERS` array. This is the canonical list.

### 2. Search URL coverage

Read `lib/retailers.ts`. Every retailer in RETAILERS should appear in at least one search URL function:

- `getRetailerSearchLinks` (new retail)
- `getPriceCompareLinks` (price comparison)
- `getRefurbishedLinks` (refurbished)
- `getMarketplaceLinks` (marketplace)

### 3. Chart color coverage

Read `components/pricing/PriceHistoryCard.tsx` → `RETAILER_COLORS` object. Every retailer in RETAILERS must have a color entry.

### 4. Data file references

Scan these files for retailer name strings and flag any that aren't in RETAILERS:

- `data/seed-prices.ts` — `retailer` field values
- `data/price-baselines.ts` — `historicalLowRetailer` field values

### 5. Skill doc references

Check `.claude/skills/add-price/SKILL.md` and `.claude/skills/price-audit/SKILL.md` for hardcoded retailer lists that may be stale.

### 6. PriceType coverage

Read `lib/types.ts` → `PriceType` union and `components/pricing/PriceEntryForm.tsx` → `PRICE_TYPES` array. They should match.

## Procedure

1. Read `lib/constants.ts` to get RETAILERS
2. Read `lib/retailers.ts` to check URL function coverage
3. Read `components/pricing/PriceHistoryCard.tsx` for RETAILER_COLORS
4. Grep `data/seed-prices.ts` and `data/price-baselines.ts` for retailer values
5. Grep skill docs for hardcoded retailer lists
6. Compare PriceType in types.ts vs PriceEntryForm.tsx
7. Report mismatches

## Expected Output

```
Retailer Audit Results
──────────────────────
RETAILERS (source of truth): 12
  Digitec, Galaxus, Brack, Lenovo CH, Interdiscount, Fust,
  MediaMarkt, Toppreise, Revendo, Back Market, Ricardo, Tutti

Search URL coverage:  12/12
Chart colors:         12/12 (+ extras: Galaxus Used)
Seed price retailers: All valid
Price baseline retailers: All valid
Skill docs: No stale lists
PriceType sync: OK

Issues: None
```

## When to Run

- After adding or removing a retailer from RETAILERS
- After a retailer merger/closure (e.g. Microspot → Interdiscount)
- Before commits that touch pricing or retailer code
- As part of `/data-sync-check`
