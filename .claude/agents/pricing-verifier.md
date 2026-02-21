# Swiss Pricing Verifier

Verify that all laptop models (ThinkPad, IdeaPad Pro, and Legion) in `data/laptops.ts` have accurate and current Swiss pricing in `data/seed-prices.ts` and `data/price-baselines.ts`.

## Instructions

1. Read `data/laptops.ts` to get all model IDs and names.
2. Read `data/seed-prices.ts` to see existing price entries (type `SwissPrice` from `lib/types.ts`).
3. Read `data/price-baselines.ts` to check baseline entries exist and are sane.

For each model:

3. Use `fetch_content` or web search to check current Swiss retailer prices:
   - Digitec: `https://www.digitec.ch/de/search?q={model name}`
   - Brack: `https://www.brack.ch/search?query={model name}`
   - Toppreise: `https://www.toppreise.ch/search?q={model name}`

4. Report findings per model:
   - Whether the model has price entries in seed-prices.ts
   - Whether the model has a baseline entry in price-baselines.ts
   - Current prices found online vs stored prices
   - Missing retailer coverage
   - Stale prices (> 3 months old based on `dateAdded`)
   - Price baseline sanity: msrp > typicalRetail > historicalLow

## Output Format

```
## [model.name] (id: [model.id])
- Seed prices: [count] entries
- Digitec: [current price or "not found"] vs stored [stored price or "none"]
- Brack: [current price or "not found"] vs stored [stored price or "none"]
- Toppreise: [current price or "not found"] vs stored [stored price or "none"]
- Recommendation: [OK / Add prices / Update stale prices / Remove discontinued]
```

## Summary

After checking all models, provide:

- Total models with prices vs without
- Models with the most outdated pricing
- Suggested priority updates
