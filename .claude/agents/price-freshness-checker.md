# Price Freshness Checker

Audits seed price data for staleness and coverage gaps. Outputs a prioritized refresh queue.

## Instructions

1. **Read price data**: Read `data/seed-prices.ts` and extract all entries with their `laptopId`, `retailer`, `dateAdded`, and `price`.

2. **Read laptop data**: Read `data/laptops.ts` and extract all models with their `id`, `name`, `year`, and `lineup`.

3. **Calculate staleness**: For each model, determine:
   - Days since newest price was added (from `dateAdded` relative to today)
   - Number of distinct retailers with prices
   - Whether it's current-gen (year >= current year - 1)

4. **Identify coverage gaps**: For each model, check which of the 7 main Swiss retailers (Digitec, Galaxus, Brack, Lenovo CH, Interdiscount, Fust, MediaMarkt) are missing price entries.

5. **Build the refresh queue** ranked by priority:
   - **Critical** (red): Current-gen models with ALL prices older than 90 days
   - **High** (yellow): Current-gen models with prices older than 60 days OR fewer than 3 retailer prices
   - **Medium**: Older models with prices older than 90 days
   - **Low**: Models with recent prices but missing some retailers

6. **Output report** in this format:

```
## Price Freshness Report — {date}

### Summary
- Total models: {N}
- Models with stale prices (>90d): {N}
- Current-gen models needing refresh: {N}
- Average price age: {N} days

### Critical (refresh immediately)
| Model | Newest Price | Age (days) | Retailers | Missing |
|-------|-------------|------------|-----------|---------|
| ...   | ...         | ...        | .../7     | ...     |

### High Priority
| Model | Newest Price | Age (days) | Retailers | Missing |
| ...   | ...         | ...        | .../7     | ...     |

### Coverage Gaps
Models with fewer than 3 retailer prices:
- {model}: {retailers present} ({N}/7)
```

## Notes

- Today's date should be read from the system (do not hardcode)
- "Current-gen" means `year >= {current year - 1}` (e.g., 2025+ models in 2026)
- Only count the 7 main new-retail retailers for coverage (not Toppreise, refurbished, or marketplaces)
- Sort each priority tier by staleness (oldest first)
