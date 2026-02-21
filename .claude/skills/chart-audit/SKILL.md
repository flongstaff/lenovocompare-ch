---
name: chart-audit
description: Screenshot chart-heavy pages and verify each chart type renders data correctly
disable-model-invocation: true
---

# Chart Audit

Visual regression check focused specifically on chart rendering — verifies that recharts components render real data, not empty/broken containers.

## Prerequisites

- Dev server running on localhost:3000
- Playwright MCP available

## Workflow

### 1. Navigate to chart-heavy pages and screenshot

Use Playwright MCP browser tools for each page:

#### a. Model Detail — `/model/x1-carbon-gen12`

Charts expected:

- **PerformanceRadar**: 6-axis radar chart (CPU, GPU, Memory, Portable, Display, Connect)
- **BenchmarkBar**: Horizontal bars for Single-Core / Multi-Core / GPU scores
- **PriceTimelineChart** (inside PriceHistoryCard): Smooth curve lines with dots, dashed reference lines (MSRP red, Typical gray, Hist. Low green), retailer legend below

Screenshot at 1280×900 and scroll to each chart section.

#### b. Model Detail with Gaming — `/model/legion-5-16-gen9-intel`

Additional charts expected:

- **FpsChart**: Horizontal bars color-coded by FPS (green ≥60, yellow 30-59, red <30) with 30/60 FPS reference lines
- **ThermalGauge**: Two horizontal bars (Keyboard / Underside) with color gradient
- **BatteryCompareBar**: Two bars (plugged-in vs on-battery) with %-loss delta

#### c. Compare Page — `/compare?ids=x1-carbon-gen12,t14-gen5-intel,p1-gen7`

Charts expected:

- **PerformanceRadar**: Multi-model overlay (3 colored polygons)
- **CpuCompareChart**: Grouped horizontal bars (Single-Core / Multi-Core per model)
- **GpuCompareChart**: Horizontal bars per model with GPU name in tooltip
- **PortabilityCompareChart**: 3 metric rows (Weight, Battery, Display) with normalized bars

#### d. Pricing Page — `/pricing`

Visual expected:

- **PriceSparkline**: Tiny inline SVG sparklines in model group headers (green=trending down, red=trending up)
- At least some groups should show sparklines (need ≥2 prices with different dates)

### 2. Verify each chart

For each screenshot, check:

| Check               | What to Look For                                                                       |
| ------------------- | -------------------------------------------------------------------------------------- |
| **Data present**    | Chart has visible data (bars, lines, dots) — not empty or "No data"                    |
| **Colors correct**  | Carbon dark palette: dark backgrounds (#161616/#262626), colored data elements         |
| **Labels readable** | Axis labels, legend text visible against dark background                               |
| **No overflow**     | Chart fits within its container, no clipping of labels or legend                       |
| **Smooth curves**   | PriceTimelineChart uses smooth monotone lines, not jagged segments                     |
| **Reference lines** | Where applicable (FpsChart: 30/60 lines; PriceTimeline: MSRP/Typical/Low dashed lines) |
| **Legend outside**  | Legend below the chart, not clipped inside the fixed-height container                  |

### 3. Mobile check

Resize to 375px width and check:

- `/model/x1-carbon-gen12` — charts should stack vertically, not overflow horizontally
- `/compare` on mobile should show MobileCompareCards with per-card radar (not the desktop chart grid)

### 4. Report

```
Chart Audit Report
==================
Model Detail (x1-carbon-gen12)
  PerformanceRadar:  ✅/❌ [notes]
  BenchmarkBar:      ✅/❌ [notes]
  PriceTimeline:     ✅/❌ [notes]

Model Detail - Gaming (legion-5-16-gen9-intel)
  FpsChart:          ✅/❌ [notes]
  ThermalGauge:      ✅/❌ [notes]
  BatteryCompareBar: ✅/❌ [notes]

Compare (3 models)
  PerformanceRadar:  ✅/❌ [notes]
  CpuCompareChart:   ✅/❌ [notes]
  GpuCompareChart:   ✅/❌ [notes]
  PortabilityCompare:✅/❌ [notes]

Pricing
  PriceSparklines:   ✅/❌ [notes]

Mobile
  Model charts:      ✅/❌ [notes]
  Compare cards:     ✅/❌ [notes]
```
