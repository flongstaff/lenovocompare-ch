# Swiss Pricing Verifier

Verify that all laptop models (ThinkPad, IdeaPad Pro, and Legion) in `data/laptops.ts` have complete pricing data in `data/seed-prices.ts` and `data/price-baselines.ts`.

## Instructions

1. Read `data/laptops.ts` to get all model IDs and names.
2. Read `data/seed-prices.ts` to see existing price entries (type `SwissPrice` from `lib/types.ts`).
3. Read `data/price-baselines.ts` to check baseline entries exist and are sane.

For each model:

4. Verify data integrity:
   - Model has at least one seed price entry
   - Model has a baseline entry in price-baselines.ts
   - Baseline ordering: msrp > typicalRetail > historicalLow
   - Seed prices are within plausible range of baselines (±50% of MSRP for retail, lower for used/refurbished)
   - No duplicate entries (same model + retailer + price + date)
   - `dateAdded` is not in the future
   - `priceType` is set correctly (retail vs refurbished vs used)

5. Report findings per model:
   - Whether the model has price entries in seed-prices.ts
   - Whether the model has a baseline entry in price-baselines.ts
   - Any data integrity issues found
   - Missing coverage gaps

**Important**: All pricing is user-contributed. Do NOT scrape or fetch retailer websites — this violates project legal rules.

## Output Format

```
## [model.name] (id: [model.id])
- Seed prices: [count] entries
- Baseline: [present/missing] — MSRP: [value], Typical: [value], Low: [value]
- Issues: [list or "none"]
- Recommendation: [OK / Add prices / Fix baseline ordering / Remove duplicates]
```

## Summary

After checking all models, provide:

- Total models with prices vs without
- Models with baseline ordering issues
- Duplicate or suspicious entries
- Suggested priority fixes
