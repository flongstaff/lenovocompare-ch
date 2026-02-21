# Chart Reviewer

Review all chart components for consistency, correctness, visual quality, and cross-lineup score handling.

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

## Chart Quality Checks

### 1. Color Consistency

- Compare charts use `COMPARE_COLORS` from `@/lib/constants`
- Single-model charts use hardcoded Carbon hex values
- No CSS variables in chart code (recharts renders to SVG, CSS vars don't work)
- PriceHistoryCard uses `RETAILER_COLORS` — verify all retailers have entries

### 2. Tooltip Pattern

Standard dark card: `background: "#262626"`, `border: "1px solid #525252"`, `borderRadius: 6`, `padding: "8px 12px"`, `boxShadow: "0 4px 16px rgba(0,0,0,0.5)"`. Title: `#f4f4f4` 12px bold. Values: `#f4f4f4` monospace bold. Labels: `#c6c6c6` 11px.

### 3. Legend Placement

Legends MUST be outside `ResponsiveContainer`. Pattern: `<div>` wrapper → `<div style={{height}}>` with ResponsiveContainer → legend div below.

### 4. Axis Readability

- Y-axis labels: `fill: "#f4f4f4"` (foreground)
- X-axis numbers: `fill: "#a8a8a8"` (muted)
- Font size: 10-12px. Grid: `stroke: "#393939"`, `strokeDasharray: "3 3"`

### 5. No Mixed-Unit Axes

Weight (kg) and Battery (Wh) must NOT share the same axis.

### 6. Responsive Container

All recharts in `ResponsiveContainer`, `"use client"` files, `next/dynamic` with `{ ssr: false }` when lazy-loaded.

### 7. Bar Sizing

8-14px depending on model count. `barGap` 1-2, `barCategoryGap` 20-25%. Radius: `[0, 3, 3, 0]`.

### 8. TypeScript / Build Safety

- No `for...of` on Map — use `Array.from()` or `.forEach()`
- No `[...new Set()]` — use `Array.from(new Set())`
- Verify all named imports are used as JSX or function calls
- `ZAxis` only with ScatterChart

### 9. Line Chart Patterns

- `type="monotone"` on `<Line>` for smooth curves
- `connectNulls={false}` for sparse data
- Dot: `r: 4`, fill matches, `stroke: "#161616"`, `strokeWidth: 1.5`
- Active dot: `r: 6`, `stroke: "#f4f4f4"`, `strokeWidth: 2`
- `isAnimationActive={false}` on data-driven charts

### 10. Price Type Styling

All 5 `PriceType` values have badge styles: `msrp`, `retail`, `sale`, `used`, `refurbished`. Check both `PriceHistoryCard.tsx` and `PriceDisplay.tsx`.

## Cross-Lineup Score Handling

Scoring is absolute (not per-lineup normalized) — Legion dGPUs score 55-92, ThinkPad iGPUs 8-40. This is intentional but needs correct chart handling.

### 1. Bar Chart Scaling

- Bar charts must use 0-100 domain (not auto-scaled to data range)
- Auto-scaling would make a ThinkPad iGPU 12 look similar to a Legion dGPU 85
- `barSize` adapts to model count (shrinks for 3-4 models)

### 2. Radar Chart Overlap

- When comparing Legion (high GPU, low portability) vs ThinkPad (low GPU, high portability), shapes should be visibly different
- Axis domains must be 0-100, not auto-scaled

### 3. Compare Table Score Bars

- ScoreBar components show actual score difference visually
- ThinkPad GPU 12 looks small next to Legion GPU 85

### 4. Value Score Cross-Lineup

- Check if value score in `lib/scoring.ts` accounts for lineup expectations
- High-price Legions shouldn't be penalized if performance justifies it

### 5. FPS Chart Cross-Lineup

- ThinkPad (no dGPU) compared with Legion should show minimal gaming capability, not be omitted

## Output

```
Chart Review
============
PerformanceRadar.tsx
  ✅ Colors: uses COMPARE_COLORS
  ✅ Tooltip: standard pattern
  ✅ Legend: outside ResponsiveContainer
  ✅ Axes: 0-100 domain, correct colors
  ✅ Build safety: no issues
  ✅ Cross-lineup: fixed domain

[...per chart]

Cross-Lineup Summary
  ✅ Bar scaling: 0-100 domain
  ✅ Radar domain: fixed
  ✅ Value score: lineup-aware
```
