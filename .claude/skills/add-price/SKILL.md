---
name: add-price
description: Add a Swiss retail price for a laptop model
disable-model-invocation: true
---

# Add Swiss Price

Add a new price entry to `data/seed-prices.ts` for a laptop model (ThinkPad, IdeaPad Pro, or Legion).

## Workflow

1. **Identify the model**: Ask user for the model name or ID. Verify it exists in `data/laptops.ts`.

2. **Get pricing details**:
   - `retailer`: Must be one from `lib/constants.ts` RETAILERS (Digitec, Galaxus, Brack, Lenovo CH, Interdiscount, Fust, MediaMarkt, Toppreise, Revendo, Back Market, Ricardo, Tutti)
   - `price`: CHF amount (number, no currency symbol). Prices include Swiss VAT (8.1%).
   - `priceType`: `"msrp"` | `"retail"` | `"sale"` | `"refurbished"` | `"used"`
   - `note`: Optional context (e.g. "Black Friday 2024", "Student discount")
   - `url`: Optional product page URL

3. **Look up current prices** (optional): If user doesn't provide a price, use web search to find current Swiss pricing:
   - Digitec: `https://www.digitec.ch/de/search?q={model name}`
   - Brack: `https://www.brack.ch/search?query={model name}`

4. **Read seed-prices.ts**: Find the next available `sp-{N}` ID by reading existing entries.

5. **Add the entry** to the `seedPrices` array following the `SwissPrice` interface:

   ```ts
   {
     id: "sp-{N}",
     laptopId: "{model.id}",
     retailer: "{retailer}",
     price: {number},
     priceType: "{priceType}",
     note: "{note}",           // omit if not provided
     url: "{url}",             // omit if not provided
     dateAdded: "{today ISO}", // YYYY-MM-DD
     isUserAdded: false,
   }
   ```

6. **Verify**: Run `npm run validate` to confirm no type or data errors.

## Notes

- Do NOT add duplicate entries (same laptopId + retailer + similar price)
- Check existing prices for the model first and inform the user of current entries
- Round prices to whole CHF (no decimals)
- Sale prices should always include a `note` explaining the sale context
