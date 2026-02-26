# Swiss Price Data Sources

Legal, non-scraping methods for obtaining Lenovo laptop prices from Swiss retailers. This document supports the automated price pipeline (`scripts/generate-prices-json.ts`).

## How Prices Enter the System

```
Community (GitHub Issues)  →  data/community-prices.json
Seed data (curated)        →  data/seed-prices.ts
                                    ↓
                           scripts/generate-prices-json.ts
                                    ↓
                           public/data/prices.json  (served to client)
                                    ↓
                           useRemotePrices hook → usePrices hook
                                    ↓
                           User localStorage prices merged last
```

## Retailer-by-Retailer Analysis

### Tier 1: Affiliate Programs with Product Feeds

These retailers offer affiliate programs that provide structured product data feeds including prices.

| Retailer | Network | Feed Format | Notes |
|----------|---------|-------------|-------|
| **Lenovo CH** | CJ / Awin / direct | Product catalog | [Affiliate program](https://www.lenovo.com/ch/en/landing-pages/promotion/affiliate/affiliate-program/) — up to 5% commission, weekly eCoupons, MSRP data |
| **Digitec/Galaxus** | Tradedoubler | CSV/FTP | [Merchant programme](https://www.digitec.ch/en/page/join-our-merchant-programme-12462) — automated product/price data via FTP. Contact: haendlerprogramm@digitecgalaxus.ch |
| **Brack** | Tradedoubler (ID 220605) | Standard feed | Part of Competec Group. Affiliate program provides product feeds through Tradedoubler |

**Action**: Register as affiliate on these networks to get structured product feeds with CHF prices. This is the most reliable legal method.

### Tier 2: No Public API — Community Submissions Only

These retailers have no known affiliate program or public API for price data.

| Retailer | Owner | Status |
|----------|-------|--------|
| **Interdiscount** | Coop | No public affiliate program. B2B partnerships only. Contact directly |
| **Fust** | Coop | No public affiliate program. Shares infrastructure with Interdiscount |
| **MediaMarkt CH** | MediaMarktSaturn | No Swiss-specific affiliate program found |

**Action**: Rely on community price submissions via GitHub Issues.

### Tier 3: Price Comparison Engines

| Service | API Available | Notes |
|---------|--------------|-------|
| **Toppreise** | No public API | Actively blocks scraping. 600+ Swiss shops, 200k+ products, hourly updates. Outbound search links only |
| **Comparis** | No public API | Proprietary data. Contact: media@comparis.ch for partnerships |
| **Preispirat** | No public API | Community-driven deal platform. #3 price comparison site in Switzerland |

**Action**: Use as reference/verification only. Link to search pages for user verification.

### Tier 4: Refurbished & Marketplace

| Service | API Available | Notes |
|---------|--------------|-------|
| **Revendo** | No | Swiss refurbished specialist. No known API |
| **Back Market** | No public API | DE site ships to CH. No affiliate data for Swiss market specifically |
| **Ricardo** | Partner APIs only | Integrations via SellInterface, plentymarkets. No open read API for listings |
| **Tutti** | No | User listings only, not programmatically accessible |

**Action**: Community submissions only. Search links provided for manual checking.

## Additional Data Sources

### Google Shopping / Merchant API
- Google's Content API for Shopping supports Switzerland (`CH`) with CHF currency
- Provides price competitiveness reports and market insights
- Requires Google Merchant Center account
- Third-party alternatives: SerpApi, DataForSEO, Oxylabs (paid, varying legality)

### Open Price Engine
- [openpricengine.com](https://www.openpricengine.com/) — Free real-time and historical pricing API
- Covers retail prices across categories
- Could supplement community data for validation

### Datafeedr
- [datafeedr.com](https://www.datafeedr.com/) — Aggregates ~1B products from 27k+ merchants across 40 affiliate networks
- May include Lenovo products with CHF pricing from Swiss affiliate networks
- Useful for cross-referencing prices across multiple networks

## Legal Framework

### What's Legal in Switzerland
1. **Affiliate product feeds** — Explicitly provided for use by publishers. Most reliable method
2. **Public product pages** — Viewing and manually recording prices is legal (just like noting a price in a store)
3. **Community contributions** — Users voluntarily sharing prices they observed. Fully legal
4. **Google Shopping data** — Aggregated with retailer consent. Legal via API
5. **Structured data (JSON-LD/Schema.org)** — Gray area; published for search engines but TOS may restrict automated access

### What's NOT Legal / Allowed
1. **Web scraping** — Violates most Swiss retailer TOS. Project policy prohibits this
2. **Automated access without permission** — Even if technically possible, unauthorized bot access violates Swiss computer fraud laws (StGB Art. 143bis)
3. **Database extraction** — Swiss copyright law (URG) protects database contents even if individual data points are public
4. **Bypassing technical protections** — Anti-bot measures indicate the retailer doesn't consent to automated access

### Swiss Data Protection (nDSG / FADP)
- The revised Federal Act on Data Protection (nDSG, effective Sept 2023) focuses on personal data
- Product prices are not personal data and fall outside nDSG scope
- However, retailer TOS and database rights still apply

## Recommended Strategy

### Phase 1: Community Pipeline (Current)
- GitHub Issue template for manual price submissions
- Community members check retailer sites and submit what they find
- Maintainers verify and approve via the `approved` label
- Automated processing via GitHub Action

### Phase 2: Affiliate Integration (Future)
- Register for Lenovo CH affiliate program
- Register for Tradedoubler (Digitec/Galaxus, Brack feeds)
- Parse affiliate product feeds for Lenovo laptop prices
- Add to `data/community-prices.json` via scheduled script

### Phase 3: Aggregator Integration (Future)
- Evaluate Datafeedr or similar for Swiss market coverage
- Google Merchant API for price competitiveness data
- Open Price Engine for validation/cross-reference

## Contributing Prices

See the [Price Submission issue template](../.github/ISSUE_TEMPLATE/price-submission.yml) for the structured form. Requirements:
- Price in CHF including VAT (8.1%)
- Valid model ID from the site
- Retailer name from the supported list
- Date the price was observed
- Confirmation that the price is real and currently visible
