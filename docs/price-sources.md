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

## Retailer Ranking: Best to Worst for Legal Price Data

| Rank | Retailer | Method | Feed Format | Cost | Laptop Coverage |
|------|----------|--------|-------------|------|-----------------|
| 1 | **MediaMarkt CH** | Awin (ID 14040) + Tradedoubler (ID 23056) | CSV / JSON+XML | Free (publisher) | Full catalog in CHF |
| 2 | **Lenovo CH** | Impact Radius + Admitad | Product feed | Free (publisher) | Full Lenovo catalog in CHF |
| 3 | **Interdiscount** | Open Price Engine API | JSON REST (OpenAPI v3) | Free tier | Electronics inc. laptops |
| 4 | **Revendo** | Open Price Engine API | JSON REST (OpenAPI v3) | Free tier | Refurbished electronics |
| 5 | **Fust** | Adtraction | Network feed (TBC) | Free (publisher) | Electronics catalog |
| 6 | **Back Market** | Awin (DE, ID 18275) | CSV via Awin | Free (publisher) | EUR prices, not CHF |
| 7 | **Ricardo** | Seller API (SearchService) | JSON | Free (account) | Marketplace listings only |
| 8 | **Digitec/Galaxus** | None (merchant programme only) | N/A | N/A | No publisher access |
| 9 | **Brack** | None | N/A | N/A | No access |
| 10 | **Toppreise** | None (data consumer, not provider) | N/A | N/A | No access |

## Retailer-by-Retailer Analysis

### Tier 1: Affiliate Programs with Product Feeds

These retailers offer affiliate programs with structured product data feeds.

#### MediaMarkt CH (Best Option)
- **Awin** advertiser ID **14040** (MediaMarkt CH Partnerprogramm)
- **Tradedoubler** feed ID **23056**
- Awin: CSV product feed via [Product Feed List API](https://help.awin.com/docs/product-feed-list-download)
- Tradedoubler: JSON/XML via [Products API](https://dev.tradedoubler.com/products/publisher/) with search + filtering
- Full CHF laptop catalog available

#### Lenovo CH
- **Impact Radius** — primary affiliate platform. Product feed, deeplinks, coupons/deals
- **Admitad** — Lenovo Many GEOs program with [developer API](https://developers.admitad.com/)
- **FlexOffers** — additional feed access
- Up to 5% commission, 45-day cookie. [Program page](https://www.lenovo.com/ch/en/landing-pages/promotion/affiliate/affiliate-program/)

#### Fust
- **Adtraction** network (Nordic-origin, Swiss office)
- Product feed likely available through Adtraction dashboard once approved
- Part of Coop Group

### Tier 2: Free API (Open Price Engine)

[Open Price Engine](https://openpricengine.com/documentation/) provides a free REST API (OpenAPI v3) with real-time and historical electronics prices for Swiss stores.

| Retailer | Coverage |
|----------|----------|
| **Interdiscount** | Electronics including laptops |
| **Revendo** | Refurbished electronics |

No affiliate registration needed — just an API key from the [free plan](https://openpricengine.com/free-plan/).

### Tier 3: No Programmatic Access

| Retailer | Why | Notes |
|----------|-----|-------|
| **Digitec/Galaxus** | Merchant programme only (sellers, not publishers). No Swiss affiliate program — Tradedoubler only covers DE/FR/BE markets | [swiss-deals-api](https://github.com/gaelgoth/swiss-deals-api) covers daily deals only |
| **Brack** | No affiliate program. Tagged "Kein Affiliate" by beste-shops.ch. Supplier API/EDI is for vendors, not data consumers | Part of Competec Group |
| **Toppreise** | Data consumer, not provider. Actively blocks scraping. Part of Geizhals/Heise Gruppe | Retailers push feeds TO Toppreise |
| **Comparis** | No public API. Proprietary data. Contact: media@comparis.ch | |

### Tier 4: Marketplace & Refurbished (Limited)

| Retailer | Access | Notes |
|----------|--------|-------|
| **Back Market** | Awin (DE, ID 18275). Prices in EUR, not CHF | No dedicated Swiss market. [Official API](https://api.backmarket.dev/) is seller-facing only |
| **Ricardo** | [Seller API](https://help.ricardo.ch/hc/de/articles/115002970529) with SearchService, ArticleService. JSON via .NET Webservice | Primarily seller-facing. [PHP library](https://github.com/diglin/ricardo) exists. Contact for read-only access |
| **Tutti** | None | User listings only |

## Legal Framework

### Swiss Law on Price Data

1. **No specific web scraping law** — Swiss law is "silent on the use of automatically scraped or otherwise obtained third party content" ([MLL Legal](https://mll-legal.com/wp-content/uploads/2023/11/Data-Scraping-Torino-Reinhard-Oertli.pdf))
2. **Product prices are not personal data** — Fall outside nDSG/FADP scope (effective Sept 2023)
3. **UWG (Unfair Competition Act)** — Simple price comparison is generally permissible; "parasitic copying" of substantial investment could be challenged
4. **JSON-LD/structured data** — Gray area. Machine-readable by design for search engines, but not established in Swiss case law as freely usable
5. **Affiliate feeds** — Explicitly provided for publisher use. The clearly legal path

### What's Allowed
- Affiliate product feeds — provided for use by publishers
- Open Price Engine API — explicitly public API with free tier
- Community contributions — users voluntarily sharing observed prices
- Manual price observation — like noting a price in a physical store

### What's NOT Allowed (Project Policy)
- Web scraping — violates retailer TOS and project legal rules
- Automated access without permission — even if technically possible
- Database extraction — Swiss copyright law (URG) applies
- Bypassing anti-bot measures — indicates lack of consent

## Recommended Action Plan

### Phase 1: Community Pipeline (Implemented)
- GitHub Issue template for structured price submissions
- Automated processing via GitHub Action on `approved` label
- Daily regeneration of `prices.json` via scheduled workflow
- Client-side `useRemotePrices` hook with seed-price fallback

### Phase 2: API Integration (Next Steps)
1. **Immediate** — Register for [Open Price Engine](https://openpricengine.com/free-plan/) free API key → Interdiscount + Revendo prices
2. **Short-term** — Register as [Awin](https://www.awin.com/) publisher → apply for MediaMarkt CH (ID 14040) → download CSV product feed
3. **Short-term** — Register on [Impact Radius](https://impact.com/) → apply for Lenovo Switzerland → access CHF product catalog feed
4. **Short-term** — Register on [Tradedoubler](https://www.tradedoubler.com/) → apply for MediaMarkt → use Products API (JSON/XML)

### Phase 3: Extended Coverage (Future)
- Register on [Adtraction](https://adtraction.com/) for Fust product feed
- Register on [Admitad](https://www.admitad.com/) for Lenovo Many GEOs with developer API
- Contact Ricardo about read-only SearchService API access
- Evaluate [Datafeedr](https://www.datafeedr.com/) for multi-network aggregation

### Not Viable
- Digitec/Galaxus — no Swiss affiliate program for publishers
- Brack — no affiliate program at all
- Toppreise — consumer of feeds, not provider
- Comparis — no product price API

## Contributing Prices

See the [Price Submission issue template](../.github/ISSUE_TEMPLATE/price-submission.yml) for the structured form. Requirements:
- Price in CHF including Swiss VAT (8.1%)
- Valid model ID from the site
- Retailer name from the supported list
- Date the price was observed (YYYY-MM-DD)
- Confirmation that the price is real and currently visible
