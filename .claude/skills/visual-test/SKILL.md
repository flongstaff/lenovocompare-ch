---
name: visual-test
description: Visual testing — screenshot key pages, compare before/after, audit charts, detect regressions
disable-model-invocation: true
---

# Visual Test

Unified visual testing skill — screenshots, diffs, chart audits, and regression detection. Uses Playwright MCP for browser automation.

## Usage

```
/visual-test                    # Quick visual check of all key pages
/visual-test --diff             # Before/after screenshot comparison
/visual-test --diff --before    # Capture "before" baseline only
/visual-test --diff --after     # Capture "after" and compare
/visual-test --charts           # Chart-focused audit (data rendering, labels, colors)
/visual-test --regression       # Full regression test against saved baselines
/visual-test --route /model/x1-carbon-gen12  # Single route only
/visual-test --mobile           # Include mobile viewport (375px)
```

## Prerequisites

- Dev server running on localhost:3000 (auto-started by SessionStart hook)
- Playwright MCP available

## Routes

Default routes (all modes unless `--route` specified):

| Route                                        | Description             | Key Elements                          |
| -------------------------------------------- | ----------------------- | ------------------------------------- |
| `/`                                          | Home grid               | Laptop cards, filters, lineup pills   |
| `/model/x1-carbon-gen12`                     | Model detail (flagship) | Dashboard, scores, charts, benchmarks |
| `/model/legion-pro-7i-16-gen9`               | Model detail (Legion)   | Gaming section, high GPU scores       |
| `/compare?ids=x1-carbon-gen12,t14s-gen5-amd` | Compare page            | Charts, table, radar                  |
| `/pricing`                                   | Pricing page            | Price cards, import UI                |
| `/hardware`                                  | Hardware guide          | CPU/GPU analysis cards                |

## Mode: Quick Check (default)

Screenshot each route and verify:

- IBM Carbon dark theme renders (dark backgrounds, not white)
- Text readable (carbon-50 on carbon-800/900 backgrounds)
- Cards grid displays models with series badges
- Filter bar visible and functional-looking
- Header with "LenovoCompare CH" branding visible
- No layout overflow or broken elements
- Accent colors (blue buttons, trackpoint red) appear correctly

Mobile check: resize to 375px width and screenshot `/` for responsive layout.

### Output

```
Visual Check Report
===================
Home:         ✅/❌ [notes]
Model Detail: ✅/❌ [notes]
Model Legion: ✅/❌ [notes]
Compare:      ✅/❌ [notes]
Pricing:      ✅/❌ [notes]
Hardware:     ✅/❌ [notes]
Mobile:       ✅/❌ [notes]
```

## Mode: Diff (`--diff`)

### Phase 1: Capture "Before" (`--before` or start of full cycle)

1. For each route, navigate and wait for network idle
2. Take full-page screenshot → `/tmp/screenshot-diff/before/{route-slug}.png`
3. For mobile (if `--mobile`), set viewport to 375x812 and repeat

### Phase 2: User makes changes

### Phase 3: Capture "After" (`--after` or end of full cycle)

1. Capture screenshots → `/tmp/screenshot-diff/after/{route-slug}.png`
2. Compare each before/after pair visually
3. Report: **No change** / **Expected change** / **Unexpected change**

## Mode: Charts (`--charts`)

Screenshot chart-heavy pages and verify each chart type renders real data:

### Model Detail — `/model/x1-carbon-gen12`

- **PerformanceRadar**: 6-axis radar (CPU, GPU, Memory, Portable, Display, Connect)
- **BenchmarkBar**: Horizontal bars for Single-Core / Multi-Core / GPU
- **PriceTimelineChart**: Smooth curves, dashed reference lines (MSRP/Typical/Low)

### Model Detail Gaming — `/model/legion-5-16-gen9-intel`

- **FpsChart**: Color-coded bars (green ≥60, yellow 30-59, red <30) with reference lines
- **ThermalGauge**: Keyboard/Underside bars with gradient
- **BatteryCompareBar**: Plugged-in vs on-battery with %-loss delta

### Compare — `/compare?ids=x1-carbon-gen12,t14-gen5-intel,p1-gen7`

- **PerformanceRadar**: Multi-model overlay (3 colored polygons)
- **CpuCompareChart**: Grouped horizontal bars per model
- **GpuCompareChart**: Horizontal bars per model
- **PortabilityCompareChart**: Weight/Battery/Display normalized bars

### Pricing — `/pricing`

- **PriceSparkline**: Inline SVG sparklines in group headers

### Verification Checklist

| Check               | What to Look For                                       |
| ------------------- | ------------------------------------------------------ |
| **Data present**    | Visible data (bars, lines, dots) — not empty           |
| **Colors correct**  | Carbon dark palette, colored data elements             |
| **Labels readable** | Axis labels and legend visible against dark background |
| **No overflow**     | Chart fits container, no clipping                      |
| **Smooth curves**   | PriceTimelineChart uses monotone lines                 |
| **Reference lines** | FpsChart 30/60 lines; PriceTimeline MSRP/Typical/Low   |
| **Legend outside**  | Below chart, not clipped inside fixed-height container |

### Chart Output

```
Chart Audit Report
==================
Model Detail (x1-carbon-gen12)
  PerformanceRadar:  ✅/❌
  BenchmarkBar:      ✅/❌
  PriceTimeline:     ✅/❌

Model Detail Gaming (legion-5-16-gen9-intel)
  FpsChart:          ✅/❌
  ThermalGauge:      ✅/❌
  BatteryCompareBar: ✅/❌

Compare (3 models)
  PerformanceRadar:  ✅/❌
  CpuCompareChart:   ✅/❌
  GpuCompareChart:   ✅/❌
  PortabilityCompare:✅/❌

Pricing
  PriceSparklines:   ✅/❌

Mobile
  Model charts:      ✅/❌
  Compare cards:     ✅/❌
```

## Mode: Regression (`--regression`)

Full pixel-level comparison against saved baselines.

### Workflow

1. Capture at 1400x900 (viewport + full-page) for each route
2. Save to `design/screenshots/current/`
3. If baselines exist in `design/screenshots/baseline/`, compare pixel-by-pixel
4. If no baselines, save current as baseline

### Screenshot naming

`{route-slug}_{viewport|full}.png` — e.g., `home_viewport.png`, `compare-4models_full.png`

### Update baselines

When user says "update baselines" or "accept changes": copy `current/` → `baseline/`

### Regression Output

```
Visual Regression Results
=========================
✅ home — no changes
⚠️ compare-4models — 2.3% pixel difference (charts area)
✅ model-t14s-gen6-amd — no changes
✅ pricing — no changes
✅ hardware — no changes
```

## Notes

- Wait for recharts dynamic imports to load — use network idle + 2s delay
- Dark theme is default — no toggle needed
- Compare page requires query params — use full URL with `?ids=`
- Score bars must use hex color values (not CSS variables)
