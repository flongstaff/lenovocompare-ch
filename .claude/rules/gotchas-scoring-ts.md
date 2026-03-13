# Scoring & TypeScript Gotchas

- `x?.length > 0` fails TypeScript — optional chaining returns `number | undefined`, use `(x?.length ?? 0) > 0`
- `Math.min(...[])` returns `Infinity` — always guard empty arrays before spread into min/max
- Scoring sub-scores must use `Math.max(0, Math.min(max, ...))` (double clamp) — `Math.min` alone allows negative values from formulas like `(value - baseline) / range`
- `getValueScore` and all score functions must cap at 100 — uncapped scores break compare delta calculations
- `getPriceDiscount(price, msrp)` — guard `msrp === 0` to avoid NaN from division by zero
