# Chart & recharts Gotchas

- recharts components must be in `"use client"` files — they fail during SSR/prerendering without it
- recharts `RadarChart` with long axis labels (e.g. "Connectivity", "Portability") overflows container — use `outerRadius="60%"` with generous `margin` and strip lineup prefix from legend names
- ScoreBar `color` prop must be a raw hex value (e.g. `"#0f62fe"`), NOT a CSS variable — `var(--accent)90` creates invalid CSS when hex opacity suffix is appended in the gradient
- recharts `ScatterChart` with `lineType="joint"` is preferred for sparse time-irregular data (e.g., price entries) over LineChart
- BenchmarksSection should only show benchmark-derived data (scores, measured values, computed insights like ratios/tier ratings/accuracy) — never raw model specs (cores, RAM type, display resolution) which are already in the Specs card. Use `InsightRow` for contextual assessments, not `SpecRow` for duplicated specs
- Replacing recharts with pure SVG for small visualizations (e.g., MiniRadar) dramatically reduces bundle — recharts + d3 chain is ~324 KB
