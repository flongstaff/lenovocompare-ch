---
name: add-deal
description: Add a curated deal highlight or update market insights data
disable-model-invocation: true
---

# Add Deal / Update Market Insights

Add a deal highlight, sale event, or component market update to `data/market-insights.ts`.

## Workflow

### Adding a Deal Highlight

1. **Identify the model**: Ask user for model name or ID. Verify it exists in `data/laptops.ts`.

2. **Get deal details**:
   - `retailer`: Must be from `lib/constants.ts` RETAILERS
   - `price`: CHF amount (whole number)
   - `priceType`: `"sale"` | `"clearance"` | `"refurbished"`
   - `url`: Product page URL (optional)
   - `note`: Context (e.g. "Digitec daily deal", "End-of-line clearance")
   - `expiryDate`: ISO date if known (optional)
   - `lastVerified`: Today's ISO date

3. **Generate ID**: Use format `deal-{laptopId}-{YYYYMMDD}` (e.g. `deal-t14-gen5-intel-20260227`).

4. **Check for duplicates**: Read existing `dealHighlights` in `market-insights.ts`. Skip if same laptopId + retailer + similar price already exists.

5. **Add entry** to `dealHighlights` array:

   ```ts
   {
     id: "deal-{id}",
     laptopId: "{model.id}",
     retailer: "{retailer}",
     price: {number},
     priceType: "{priceType}",
     url: "{url}",
     note: "{note}",
     addedDate: "{today ISO}",
     expiryDate: "{expiry ISO}",
     verified: true,
     lastVerified: "{today ISO}",
   }
   ```

6. **Verify**: Run `npm run validate` and `npm run verify-deals`.

### Updating Component Markets

1. Edit the relevant entry in `componentMarkets` array (ddr4, ddr5, nand-tlc, nand-qlc).
2. Update `trend`, `changePercent`, `since`, `summary`, and `source` fields.
3. Run `npm run validate`.

### Adding a Sale Event

1. Add to `saleEvents` array with unique ID, retailer, typical timing, and discount range.
2. Run `npm run validate`.

## Notes

- Deal prices must be verified — set `verified: true` and `lastVerified` to today
- Deals older than 14 days without re-verification show as stale (`isDealStale` in `lib/deals.ts`)
- Cross-check deal price against `data/price-baselines.ts` — flag if above MSRP
- Remove expired deals periodically (check `expiryDate`)
