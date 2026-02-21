# Chart Reviewer Agent

Review all chart components in `components/charts/` and `components/pricing/` for consistency, correctness, and visual quality.

## Files to Review

- `components/charts/PerformanceRadar.tsx`
- `components/charts/CpuCompareChart.tsx`
- `components/charts/GpuCompareChart.tsx`
- `components/charts/PortabilityCompareChart.tsx`
- `components/charts/BenchmarkBar.tsx`
- `components/charts/FpsChart.tsx`
- `components/charts/ThermalGauge.tsx`
- `components/charts/BatteryCompareBar.tsx`
- `components/pricing/PriceHistoryCard.tsx` (contains PriceTimelineChart)

## Checks

### 1. Color Consistency

- All compare charts must use `COMPARE_COLORS` from `@/lib/constants` for per-model coloring
- Single-model charts (BenchmarkBar, FpsChart) use hardcoded Carbon hex values
- No CSS variables in chart code (recharts renders to SVG, CSS vars don't work)
- Verify `COMPARE_COLORS` import is present in all compare charts
- PriceHistoryCard uses its own `RETAILER_COLORS` map — verify all retailers have entries

### 2. Tooltip Pattern

All tooltips should follow the standard dark card pattern:

```tsx
style={{
  background: "#262626",
  border: "1px solid #525252",
  borderRadius: 6,
  padding: "8px 12px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.5)"
}}
```

- Title: `#f4f4f4`, 12px, fontWeight 600
- Values: `#f4f4f4`, monospace, fontWeight 600
- Labels: `#c6c6c6`, 11px
- Color swatches: 8×8px, borderRadius 2

### 3. Legend Placement

- Legends MUST be outside the `ResponsiveContainer` wrapper
- Pattern: `<div>` wrapper → `<div style={{height: N}}>` with ResponsiveContainer → legend div below
- Never put legend inside the fixed-height div (causes clipping)

### 4. Axis Readability

- Y-axis labels: `fill: "#f4f4f4"` (foreground, not muted)
- X-axis numbers: `fill: "#a8a8a8"` (muted is fine for numeric scales)
- Font size: 10-12px for axes
- Grid lines: `stroke: "#393939"`, `strokeDasharray: "3 3"`

### 5. No Mixed-Unit Axes

- Weight (kg) and Battery (Wh) must NOT share the same axis
- Score (0-100) charts can share axes
- If two metrics have different units, use separate rows or separate charts

### 6. Responsive Container

- All recharts components must be wrapped in `ResponsiveContainer`
- Must be in `"use client"` files
- Must use `next/dynamic` with `{ ssr: false }` when lazy-loaded

### 7. Bar Sizing

- Bar size should be 8-14px depending on model count
- `barGap` 1-2, `barCategoryGap` 20-25%
- Radius on horizontal bars: `[0, 3, 3, 0]`

### 8. TypeScript / Build Safety (NEW)

- **No `for...of` on Map**: TypeScript target doesn't support Map iteration — use `Array.from()`, `.forEach()`, or spread to array first
- **No `[...new Set()]`**: Use `Array.from(new Set())` instead
- **Import hygiene**: After refactoring chart types (e.g. ScatterChart → ComposedChart), verify all named imports are actually used as JSX elements or function calls — unused recharts imports cause ESLint build failures
- **ZAxis only with ScatterChart**: `ZAxis` is meaningless in `ComposedChart` with `Line` — remove it if scatter was replaced with lines

### 9. Line Chart Patterns (NEW)

- Price/time series charts should use `type="monotone"` on `<Line>` for smooth curves
- Use `connectNulls={false}` when data has gaps per-series (e.g. different retailers reporting at different times)
- Dot styling: `r: 4`, fill matches line color, `stroke: "#161616"` (background), `strokeWidth: 1.5`
- Active dot: `r: 6`, fill matches, `stroke: "#f4f4f4"`, `strokeWidth: 2`
- Disable animation on data-driven charts: `isAnimationActive={false}`
- Merged timeline data pattern: build one data array where each entry has `timestamp` + one key per retailer (null gaps handled by `connectNulls={false}`)

### 10. Price Type Styling Completeness (NEW)

- All 5 `PriceType` values must have badge styles: `msrp`, `retail`, `sale`, `used`, `refurbished`
- Check both `PriceHistoryCard.tsx` (PriceTypeLabel) and `PriceDisplay.tsx` (PRICE_TYPE_STYLES)
- `refurbished` uses teal: `bg-teal-900/30 text-teal-400 border-teal-700`

## Output

Report each chart with pass/fail per check:

```
Chart Review
============
PerformanceRadar.tsx
  ✅ Colors: uses COMPARE_COLORS
  ✅ Tooltip: standard dark card pattern
  ✅ Legend: outside ResponsiveContainer
  ✅ Axes: correct colors and sizes
  ✅ Client directive: "use client" present
  ✅ Build safety: no Map iteration issues

CpuCompareChart.tsx
  ✅ Colors: uses COMPARE_COLORS
  ...

PriceHistoryCard.tsx
  ✅ Line type: monotone curves
  ✅ Price type styles: all 5 covered
  ✅ Build safety: uses forEach on Map
  ...
```
