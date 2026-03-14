# Swiss Retailer Price Data Sources

Legal methods for accessing Swiss retail price data for Lenovo laptops.

## Direct Web Access (No API Required)

### Digitec / Galaxus

- **Method**: Public product pages, no login required
- **URL pattern**: `https://www.digitec.ch/en/s1/product/{slug}-{id}`
- **Affiliate**: Admitad network, program ID `101438744` (Galaxus CH)
- **Notes**: Prices include VAT. Product API exists but is undocumented.

### Brack.ch

- **Method**: Public product pages
- **URL pattern**: `https://www.brack.ch/product/{id}`
- **Affiliate**: Awin network, advertiser ID `16007`

### Lenovo CH

- **Method**: Public product pages
- **URL pattern**: `https://www.lenovo.com/ch/de/p/laptops/{series}/{model}`
- **Affiliate**: Lenovo Partner Network (LPN), apply at partner.lenovo.com
- **Notes**: MSRP + frequent direct sales. "eCoupon" discounts not in listed price.

### Interdiscount

- **Method**: Public product pages
- **URL pattern**: `https://www.interdiscount.ch/de/{category}/{product}`
- **Notes**: Part of Coop group. No public API.

### Fust

- **Method**: Public product pages
- **URL pattern**: `https://www.fust.ch/de/{category}/{product}.html`

### MediaMarkt CH

- **Method**: Public product pages
- **URL pattern**: `https://www.mediamarkt.ch/de/product/{slug}-{id}.html`

## Aggregator APIs

### Open Price Engine (OPE)

- **URL**: https://openpriceengine.com
- **Coverage**: Interdiscount, Revendo, others
- **Plan**: Mid-tier electronics (~$22 / 4 months)
- **Endpoint**: `GET /v1/prices?q={query}&retailer={id}&country=ch`
- **Auth**: Bearer token via `OPE_API_KEY`
- **Script**: `scripts/fetch-ope-prices.ts`

### Toppreise.ch

- **Method**: Price comparison aggregator, public pages
- **URL pattern**: `https://www.toppreise.ch/product/{id}`
- **Notes**: Aggregates from multiple Swiss retailers. No public API.

## Secondhand / Refurbished

### Revendo

- **Method**: Public product pages
- **URL pattern**: `https://www.revendo.ch/de/product/{slug}`
- **Notes**: Refurbished electronics. Covered by OPE integration.

### Back Market CH

- **Method**: Public product pages
- **URL pattern**: `https://www.backmarket.ch/de-ch/{slug}`

### Ricardo.ch

- **Method**: Public auction/buy-now listings
- **Notes**: Swiss marketplace (eBay equivalent). Prices vary by listing.

### Tutti.ch

- **Method**: Public classifieds
- **Notes**: Swiss classifieds. Used prices, no API.

## Contributing Prices

1. **Via the website**: Use the "Add Price" form on the pricing page
2. **Via GitHub Issue**: Use the "Price Submission" issue template
3. **Via PR**: Edit `data/community-prices.json` directly

All prices must be in CHF including Swiss VAT (8.1%).
