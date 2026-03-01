---
name: price-refresh
description: Guided workflow to refresh Swiss retail prices for a laptop model using free, legal methods
args: "[model-id or model name]"
---

# Price Refresh Workflow

Assists manual price updates by generating retailer search URLs, guiding the user through checking each one, and auto-generating the seed-prices.ts entry.

**Legal basis**: Links to public retailer search pages (always legal). User manually reports observed prices. No scraping, no paid APIs.

## Workflow

### 1. Identify the model

If the user provided a model ID or name as argument:

- Look it up in `data/laptops.ts` by `id` or `name` (fuzzy match OK)
- If not found, list similar models and ask the user to pick one

If no argument provided:

- Run the price-freshness-checker agent to get the ranked refresh queue
- Present the top 5 stalest current-gen models
- Ask the user which one to refresh

Store the matched `Laptop` object for URL generation.

### 2. Show current prices

Read `data/seed-prices.ts` and filter entries matching `laptopId`. Display:

- Retailer, price (CHF), dateAdded, priceType, note
- Flag any prices older than 90 days as stale

If no prices exist yet, say so.

### 3. Generate retailer search URLs

Using the URL patterns from `lib/retailers.ts`, generate clickable links for the model:

**New retail** (check all 7):

- Digitec: `https://www.digitec.ch/de/search?q={name+encoded}`
- Galaxus: `https://www.galaxus.ch/de/search?q={name+encoded}`
- Brack: `https://www.brack.ch/search?query={name+encoded}`
- Lenovo CH: `https://www.lenovo.com/ch/de/search?query={name}`
- Interdiscount: `https://www.interdiscount.ch/de/search?q={name}`
- Fust: `https://www.fust.ch/de/searchresult.html?queryString={name}`
- MediaMarkt: `https://www.mediamarkt.ch/de/search.html?query={name}`

**Price comparison**:

- Toppreise: `https://www.toppreise.ch/en/search?q={name+encoded}`

**Refurbished** (optional — ask if user wants these):

- Revendo: `https://revendo.ch/en/search?q={name}`
- Back Market: `https://www.backmarket.de/de-de/search?q={name}`
- Galaxus Used: `https://www.galaxus.ch/de/secondhand/search?q={name+encoded}`

Present the URLs as a numbered list. Tell the user:

> Open each link, check if the model is listed, and report back:
>
> - The price in CHF (whole number)
> - Whether it's retail, sale, or MSRP
> - Any notes (e.g. "i7/32GB config", "out of stock", "student discount")
> - The direct product URL (optional but helpful)

### 4. Record reported prices

For each price the user reports:

1. Read `data/seed-prices.ts` to find the last `sp-{N}` ID
2. Generate the next sequential ID
3. Build the `SwissPrice` entry:

```ts
{
  id: "sp-{next}",
  laptopId: "{model.id}",
  retailer: "{retailer}",
  price: {CHF amount},
  dateAdded: "{today YYYY-MM-DD}",
  isUserAdded: false,
  priceType: "{retail|msrp|sale|refurbished|used}",
  note: "{user note}",  // omit if none
  url: "{product URL}",  // omit if none
}
```

4. Append to `data/seed-prices.ts` before the closing `];`
5. If updating an existing price (same laptopId + retailer), update the existing entry's price, dateAdded, and note instead of adding a duplicate

### 5. Validate

Run `npm run validate` to confirm no errors.

Report summary: how many prices added/updated, which retailers had no results.

### 6. Suggest next steps

- If Toppreise had results, suggest checking Geizhals too (same parent company)
- If many retailers show "out of stock", note this in the model's price context
- Suggest the next stalest model to refresh

## Important rules

- **Never scrape** — only generate search URLs for the user to check manually
- **Round prices** to whole CHF (no decimals)
- **Swiss VAT** (8.1%) is included in all displayed retail prices
- **Deduplicate** — don't add entries for same laptopId + retailer if price hasn't changed
- **Attribution** — when recording prices, the dateAdded is when the user observed the price
