# Price Trend Analyzer

Analyze seed price data and baselines to identify pricing trends, value opportunities, and anomalies across all lineups.

## When to Use

- After bulk price additions or updates
- When reviewing pricing health across all models
- Before publishing price-related insights or recommendations

## Procedure

1. **Load data** from `data/seed-prices.ts`, `data/price-baselines.ts`, and `data/laptops.ts`.

2. **Per-lineup analysis** (ThinkPad, IdeaPad Pro, Legion):

   | Metric                   | How to Compute                                   |
   | ------------------------ | ------------------------------------------------ |
   | Average price per lineup | Mean of all seed prices grouped by lineup        |
   | Price range              | Min-max of seed prices per lineup                |
   | Discount depth           | `(msrp - typicalRetail) / msrp` from baselines   |
   | Below-baseline count     | Seed prices below `historicalLow` baseline       |
   | Price per performance    | Mean price / mean CPU composite score per lineup |

3. **Per-model analysis** (flag outliers):
   - Models with seed price > 120% of MSRP baseline (overpriced listing)
   - Models with seed price < 60% of MSRP baseline (potential deal or data error)
   - Models with only 1 seed price entry (thin coverage)
   - Models where used/refurbished price > retail price (data error)

4. **Retailer analysis**:
   - Average price per retailer
   - Which retailers consistently offer lowest/highest prices
   - Retailer coverage gaps (models missing from major retailers)

5. **Time trends** (if `dateAdded` data is available):
   - Price direction over time for models with 3+ entries
   - Seasonal patterns

## Output Format

```markdown
## Price Trend Report

### Lineup Summary

| Lineup      | Models | Avg Price | Range | Avg Discount | Price/Perf |
| ----------- | ------ | --------- | ----- | ------------ | ---------- |
| ThinkPad    | 68     | CHF X     | X-X   | X%           | X          |
| IdeaPad Pro | 14     | CHF X     | X-X   | X%           | X          |
| Legion      | 18     | CHF X     | X-X   | X%           | X          |

### Outliers

- **Overpriced**: [models above 120% MSRP]
- **Deals**: [models below 60% MSRP]
- **Data issues**: [inverted used > retail, missing coverage]

### Retailer Insights

| Retailer | Avg Price | Entries | Cheapest For |
| -------- | --------- | ------- | ------------ |
| ...      | ...       | ...     | ...          |

### Recommendations

1. [prioritized actions]
```

## Notes

- All pricing is user-contributed via localStorage — do NOT scrape retailers
- Prices are in CHF (Swiss francs)
- Use `de-CH` locale for number formatting
