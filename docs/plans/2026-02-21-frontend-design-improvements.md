# Frontend Design Improvements

**Date:** 2026-02-21
**Status:** Approved
**Scope:** Score comprehension, card differentiation, CSS blueprint diagrams, infographics, Signal Precision alignment

---

## 1. Score Comprehension

### ScoreBar Overhaul
- **Colored score numbers** — tier-based: green (#42be65) ≥80, blue (#4589ff) ≥60, yellow (#f1c21b) ≥40, gray (#a8a8a8) <40. Replaces uniform `text-carbon-400`.
- **Reference ghost bar** — faint marker at "best in category" position within the bar track. Gives instant context for where a score sits relative to the ceiling.
- **One-shot fill animation** — replace continuous `.score-shine` shimmer with CSS `@keyframes` that fills from 0% to final width once on mount. Remove the looping animation.
- **Contextual labels on detail page** — beneath each dimension score: "Better than X% of [lineup] models" computed from live data.

### Files affected
- `components/ui/ScoreBar.tsx` — color logic, ghost bar, animation
- `app/globals.css` — replace `.score-shine` with one-shot keyframes
- `app/model/[id]/ModelDetailClient.tsx` — contextual percentile labels

---

## 2. Card Differentiation & Typography

### Card Variants
- Score cards: colored left-border accent (2px solid, series color)
- Spec cards: neutral `.carbon-card` (unchanged)
- Editorial/analysis cards: wider top accent bar (4px)

### Typography Scale
- Section headers (H2): 18px semibold Geist Sans (up from ~14px)
- Subsection headers: 12px uppercase monospace (unchanged)
- Model names on LaptopCard: 17px (up from 15px)
- Accent bar on LaptopCard: 3px (up from 2px)

### Cleanup
- Remove 6% opacity SVG silhouettes from LaptopCard — imperceptible, adds nothing

### Files affected
- `components/models/LaptopCard.tsx` — accent bar, name size, remove silhouette
- `app/model/[id]/ModelDetailClient.tsx` — card variants, section header sizes
- `app/globals.css` — new `.carbon-card-scores`, `.carbon-card-editorial` variants

---

## 3. CSS Blueprint Diagrams

Pure CSS/SVG schematics rendered from real PSREF dimension data. No images — code-drawn only.

### Design
- SVG rectangle proportional to real dimensions (width × depth from Laptop interface)
- Labeled measurement lines with dimension values in mm
- Screen area as inner rectangle with size label (e.g., "14.0\"")
- Lineup-specific accent: ThinkPad TrackPoint dot, Legion vent lines, IdeaPad Pro slim profile indicator
- Monochromatic (#525252 lines) with accent color for measurement annotations
- Height shown as a side-profile bar with label

### Data Requirements
- `Laptop.dimensions` already has `width`, `depth`, `height` in mm
- `Laptop.display.size` for screen diagonal
- `Laptop.lineup` for accent styling

### Component
- `components/models/BlueprintDiagram.tsx` — new component, `"use client"`
- Props: `dimensions`, `displaySize`, `lineup`, `series`
- Placed on detail page in the Specifications section

### Files affected
- `components/models/BlueprintDiagram.tsx` — new file
- `app/model/[id]/ModelDetailClient.tsx` — integrate into specs section

---

## 4. Infographic Additions

### A. Price-Performance Scatter (home page)
- Toggleable overlay above the model grid (button in FilterBar area)
- X-axis: lowest price (CHF), Y-axis: performance score
- Dots colored by lineup, hover shows model name
- Click dot → navigate to model detail
- recharts `ScatterChart` in a new `components/charts/PricePerformanceScatter.tsx`
- Only shows models with prices

### B. Mini Radar on LaptopCard
- Tiny 5-axis radar polygon (Perf, Display, Memory, GPU, Portability) above ScoreBars
- No axis labels — the polygon shape IS the information
- ~80px × 80px, positioned in the score section of the card
- Uses recharts `RadarChart` with minimal config
- ScoreBars remain below for detail

### C. Thermal Profile Bar (detail page)
- Horizontal gradient bar: green ("Cool & Quiet") → yellow → red ("Hot & Loud")
- Model's thermal position marked with a pointer indicator
- Derived from model-benchmarks thermal data
- New `components/models/ThermalProfileBar.tsx`
- Replaces or supplements raw °C/dB numbers in BenchmarksSection

### Files affected
- `components/charts/PricePerformanceScatter.tsx` — new
- `app/HomeClient.tsx` — toggle button + scatter integration
- `components/models/LaptopCard.tsx` — mini radar addition
- `components/models/ThermalProfileBar.tsx` — new
- `components/models/BenchmarksSection.tsx` — integrate thermal profile bar

---

## 5. Signal Precision Alignment

### Red Color Audit
Reserve `#da1e28` (TrackPoint red) exclusively for:
- Header TrackPoint logo
- Critical navigation markers

Remap other usages:
- Thermal warnings → `#ff832b` (orange)
- Gaming tier "High" → `#ee5396` (magenta)
- Price decline arrows → `#f1c21b` (yellow)
- FPS < 30 bars → `#ff832b` (orange)

### Typography Discipline
- Monospace (`font-mono`) reserved for: scores, prices, dimensions, data values
- Labels and headings use Geist Sans (default `font-sans`)
- Hero stat numbers: 32–36px bold monospace for "designation stamp" authority

### Grid Background
- Strengthen dot-grid from 3% to 10–12% opacity
- Use visible hairlines instead of dots for engineering-drawing feel

### Files affected
- `app/globals.css` — dot-grid opacity
- `app/HomeClient.tsx` — hero stat sizing, grid background
- `components/charts/FpsChart.tsx` — red → orange for <30 FPS
- `components/models/BenchmarksSection.tsx` — thermal color remap
- `components/models/GamingTierBadge.tsx` — color remap
- Various components — audit all `#da1e28` usages

---

## 6. Implementation Order

1. **Score comprehension** (ScoreBar overhaul) — foundation, affects all views
2. **Typography & card differentiation** — quick wins, immediate visual impact
3. **Signal Precision alignment** (red audit, grid, typography discipline)
4. **CSS Blueprint diagrams** — new component, detail page only
5. **Thermal Profile Bar** — new component, detail page
6. **Mini Radar on LaptopCard** — grid page enhancement
7. **Price-Performance Scatter** — home page, most complex new feature

## Constraints

- No AI-generated images — all visuals are code-rendered (CSS/SVG)
- No external image dependencies — everything is self-contained
- Maintain existing recharts + Tailwind + Carbon stack
- All new chart components must be `"use client"`
- Preserve existing responsive breakpoints
- No changes to data files or scoring logic
