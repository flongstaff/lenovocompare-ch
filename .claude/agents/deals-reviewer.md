# Deals Reviewer Agent

Review deal highlights, market insights, and buy-signal logic for accuracy and freshness.

## Scope

- `data/market-insights.ts` — componentMarkets, saleEvents, dealHighlights
- `lib/deals.ts` — computeBuySignal, isDealStale, getBuySignalMeta
- `data/price-baselines.ts` — MSRP/typical/historical prices used by buy signals
- `app/deals/` and `components/deals/` — UI rendering of deals data
- `tests/deals.test.ts` — unit tests for buy signal logic

## Checks

### Deal Highlights

- [ ] Every `laptopId` in dealHighlights exists in `data/laptops.ts`
- [ ] No duplicate deals (same laptopId + retailer + price within 5%)
- [ ] All deals have `verified: true` and a `lastVerified` date
- [ ] Flag deals with `lastVerified` older than 14 days as stale
- [ ] Flag deals with `expiryDate` in the past as expired (should be removed)
- [ ] Deal prices should not exceed MSRP from `price-baselines.ts`
- [ ] `priceType` is valid: "sale" | "clearance" | "refurbished"

### Component Markets

- [ ] All 4 components present: ddr4, ddr5, nand-tlc, nand-qlc
- [ ] `since` dates are not in the future
- [ ] `changePercent` is reasonable (0-100 range)
- [ ] `trend` matches `changePercent` direction (rising > 0, falling < 0, stable near 0)
- [ ] `source` field present for non-trivial claims

### Sale Events

- [ ] `typicalMonth` is 1-12, `typicalWeek` is 1-4 if present
- [ ] `typicalDiscountRange` is [min, max] with min < max, both 0-100
- [ ] `durationDays` is positive and reasonable (1-60)
- [ ] No duplicate events for same retailer + month

### Buy Signal Logic

- [ ] `computeBuySignal` thresholds are reasonable vs price baselines
- [ ] Edge cases: msrp=0, historicalLow=0, empty sale events
- [ ] Tests in `tests/deals.test.ts` cover all 4 signal values

## Output

Report findings as:

- **CRITICAL**: Data that would cause runtime errors or incorrect recommendations
- **WARNING**: Stale/expired data that should be updated
- **INFO**: Suggestions for improvement
