# Frontend Design Improvements — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Overhaul score visualization, card hierarchy, infographics, and visual identity to align with Signal Precision philosophy.

**Architecture:** Modify existing components (ScoreBar, LaptopCard, BenchmarksSection, ModelDetailClient, HomeClient, FpsChart) and add 4 new components (BlueprintDiagram, ThermalProfileBar, MiniRadar, PricePerformanceScatter). All changes are UI-only — no data files or scoring logic modified.

**Tech Stack:** React 18, recharts, Tailwind CSS, CSS/SVG for blueprints, framer-motion for animations.

**Design doc:** `docs/plans/2026-02-21-frontend-design-improvements.md`

---

### Task 1: ScoreBar — Colored Score Numbers

**Files:**
- Modify: `components/ui/ScoreBar.tsx:6-11,54-58`

**Step 1: Edit ScoreBar to color the score number by tier**

In `components/ui/ScoreBar.tsx`, the score number (line 54-58) currently uses `text-carbon-400` uniformly. Use the existing `getScoreLabel` function to derive the color.

```tsx
// Replace lines 54-58 — the showValue span:
{showValue && (
  <span
    className={`${isMd ? "text-[11px]" : "text-[10px]"} w-7 text-right font-mono tabular-nums`}
    style={{ color: getScoreLabel(score).color }}
  >
    {Math.round(score)}
  </span>
)}
```

**Step 2: Verify visually**

Run dev server, check `/model/x1-carbon-gen13` — score numbers should now be green/blue/yellow/gray based on tier.

**Step 3: Commit**

```bash
git add components/ui/ScoreBar.tsx
git commit -m "feat: color ScoreBar numbers by score tier"
```

---

### Task 2: ScoreBar — Reference Ghost Bar

**Files:**
- Modify: `components/ui/ScoreBar.tsx:22-23,45-53`

**Step 1: Add `maxRef` prop and ghost marker**

Add an optional `maxRef` prop for the reference position. Inside the bar track div, add a ghost line marker:

```tsx
interface ScoreBarProps {
  readonly score: number;
  readonly max?: number;
  readonly maxRef?: number;  // <-- add this
  readonly label?: string;
  readonly color?: string;
  readonly showValue?: boolean;
  readonly showLabel?: boolean;
  readonly size?: "sm" | "md";
}
```

Inside the bar track `<div>` (line 45), after the fill `<div>` (line 47-52), add:

```tsx
{maxRef !== undefined && maxRef > 0 && (
  <div
    className="absolute top-0 h-full w-px"
    style={{
      left: `${Math.min(100, (maxRef / max) * 100)}%`,
      background: "var(--muted)",
      opacity: 0.4,
    }}
  />
)}
```

The bar track div needs `relative` added to its className (it already has `overflow-hidden`).

**Step 2: Verify**

No existing usages pass `maxRef`, so nothing changes yet. This is additive. We'll wire it up in Task 7 (detail page percentiles).

**Step 3: Commit**

```bash
git add components/ui/ScoreBar.tsx
git commit -m "feat: add reference ghost marker to ScoreBar"
```

---

### Task 3: ScoreBar — One-Shot Fill Animation

**Files:**
- Modify: `app/globals.css:59-83`
- Modify: `components/ui/ScoreBar.tsx:47`

**Step 1: Replace `.score-shine` in globals.css**

Replace lines 59-83 with a one-shot fill animation:

```css
.score-fill {
  animation: scoreFillIn 0.8s ease-out forwards;
}

@keyframes scoreFillIn {
  from {
    transform: scaleX(0);
    transform-origin: left;
  }
  to {
    transform: scaleX(1);
    transform-origin: left;
  }
}
```

**Step 2: Update ScoreBar class name**

In `components/ui/ScoreBar.tsx` line 47, change `className="score-shine h-full ..."` to `className="score-fill h-full ..."`.

**Step 3: Verify**

Reload page — bars should fill once from left on mount, then stop. No continuous shimmer.

**Step 4: Commit**

```bash
git add app/globals.css components/ui/ScoreBar.tsx
git commit -m "feat: replace ScoreBar shimmer with one-shot fill animation"
```

---

### Task 4: Card Differentiation — Typography Scale & Accent Bar

**Files:**
- Modify: `components/models/LaptopCard.tsx:80-83,86-95,105`
- Modify: `app/model/[id]/ModelDetailClient.tsx` (section headers)

**Step 1: LaptopCard — strengthen accent bar, bump name size, remove silhouette**

In `LaptopCard.tsx`:

1. Line 83: Change `h-[2px]` to `h-[3px]`
2. Line 105: Change `text-[15px]` to `text-[17px]`
3. Lines 86-95: Delete the entire `{LINEUP_SILHOUETTE[model.lineup] && (` block (Image import + usage)
4. Line 4: Remove the `Image` import from `next/image` (now unused)
5. Lines 24-28: Remove the `LINEUP_SILHOUETTE` constant (now unused)

**Step 2: ModelDetailClient — bump section headers**

In `ModelDetailClient.tsx`, find all `h2` elements with `text-lg font-semibold`. Change to `text-lg font-semibold sm:text-xl`. This affects the "Scores", "Swiss Prices", "Value Calculator", "Specifications", "Performance Overview" headings.

**Step 3: Verify**

Check home page grid — cards should have thicker accent bar, slightly larger model names, no ghost silhouette. Check detail page — section headers should be noticeably larger.

**Step 4: Commit**

```bash
git add components/models/LaptopCard.tsx app/model/[id]/ModelDetailClient.tsx
git commit -m "feat: strengthen card accent bar, bump typography scale, remove invisible silhouettes"
```

---

### Task 5: Card Variants in globals.css

**Files:**
- Modify: `app/globals.css:29-31`

**Step 1: Add card variant classes**

After the `.carbon-card` definition (line 31), add:

```css
.carbon-card-scores {
  @apply border border-carbon-700 bg-carbon-800;
  border-left: 2px solid var(--accent);
}

.carbon-card-editorial {
  @apply border border-carbon-700 bg-carbon-800;
  border-top: 4px solid var(--accent);
}
```

**Step 2: Apply in ModelDetailClient**

In `ModelDetailClient.tsx`:
- Scores card: change `carbon-card` → `carbon-card-scores`
- Editorial card wrapper: add `carbon-card-editorial rounded-lg` class

**Step 3: Verify**

Detail page: Scores card should have a blue left border. Editorial should have a thicker top border.

**Step 4: Commit**

```bash
git add app/globals.css app/model/[id]/ModelDetailClient.tsx
git commit -m "feat: add card variants for scores and editorial sections"
```

---

### Task 6: Signal Precision — Red Color Audit

**Files:**
- Modify: `components/charts/FpsChart.tsx:24,58,61`
- Modify: `components/models/BenchmarksSection.tsx` (thermal colors)
- Modify: `components/models/LaptopCard.tsx:46` (Legion 7 series accent)

**Step 1: FpsChart — replace `#da1e28` with `#ff832b`**

In `FpsChart.tsx`:
- Line 24: Change `return "#da1e28"` to `return "#ff832b"` (unplayable FPS bar)
- Line 58: Change `stroke="#da1e28"` to `stroke="#ff832b"` (30 FPS reference line)
- Line 61: Change `fill="#da1e28"` to `fill="#ff832b"` (30 FPS label)
- Legend labels: change `bg-red-600` to `bg-orange-500`

**Step 2: BenchmarksSection — replace thermal `#da1e28` with `#ff832b`**

In `BenchmarksSection.tsx`, find all instances of `#da1e28` and `#da1e2820` (thermal hot state). Replace with `#ff832b` and `#ff832b20`.

**Step 3: LaptopCard — remap Legion 7 accent**

In `LaptopCard.tsx` line 46: Change `"7": "#da1e28"` to `"7": "#fa4d56"` (IBM red-50, distinct from TrackPoint red).

**Step 4: Verify**

- Check FPS chart on a Legion model — <30 bars should be orange, not red
- Check thermal labels in benchmarks — "Hot" should be orange
- Check Legion 7 cards on home page — accent should be a brighter red, not TrackPoint red
- Header TrackPoint logo should remain `#da1e28` (unchanged)

**Step 5: Commit**

```bash
git add components/charts/FpsChart.tsx components/models/BenchmarksSection.tsx components/models/LaptopCard.tsx
git commit -m "fix: reserve TrackPoint red for branding, remap thermal/FPS to orange"
```

---

### Task 7: Signal Precision — Hero & Grid Background

**Files:**
- Modify: `app/HomeClient.tsx:161-167,192-211`

**Step 1: Strengthen grid background**

In `HomeClient.tsx`:
- Line 166 (or equivalent): Change `opacity-[0.03]` to `opacity-[0.08]`
- Change backgroundImage from radial-gradient (dots) to a hairline grid:
```tsx
style={{
  backgroundImage:
    "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
}}
```

**Step 2: Enlarge hero stat numbers**

In the stats row (around lines 192-211), change the stat number class from `font-mono text-2xl font-bold ... sm:text-3xl` to `font-mono text-3xl font-bold ... sm:text-4xl`.

**Step 3: Verify**

Home page hero: visible hairline engineering grid, larger "designation stamp" stat numbers.

**Step 4: Commit**

```bash
git add app/HomeClient.tsx
git commit -m "feat: strengthen hero grid background and enlarge stat numbers"
```

---

### Task 8: Detail Page — Score Percentile Context

**Files:**
- Modify: `app/model/[id]/ModelDetailClient.tsx` (scores card section)
- Modify: `lib/scoring.ts` (add percentile helper)

**Step 1: Add percentile computation helper to scoring.ts**

Add at the bottom of `lib/scoring.ts`:

```tsx
import { laptops } from "@/data/laptops";

/** Compute what % of models in the same lineup this score beats */
export const getScorePercentile = (
  score: number,
  dimension: keyof PerformanceDimensions,
  lineup: string,
): number => {
  const lineupModels = laptops.filter((m) => m.lineup === lineup);
  const allScores = lineupModels.map((m) => getPerformanceDimensions(m)[dimension]);
  const below = allScores.filter((s) => s < score).length;
  return Math.round((below / allScores.length) * 100);
};
```

**Step 2: Add percentile labels under ScoreBars in ModelDetailClient**

In the Scores card section, after each ScoreBar, add a small percentile label:

```tsx
<div className="font-mono text-[9px] text-carbon-500 pl-20">
  Top {100 - getScorePercentile(scores.perf, "cpu", model.lineup)}% of {model.lineup}
</div>
```

Apply this pattern for each dimension (cpu, gpu, display, memory, connectivity, portability).

**Step 3: Wire up `maxRef` on ScoreBars**

Pass the lineup max score as `maxRef` to each ScoreBar. Compute per-dimension max from the lineup's models.

**Step 4: Verify**

Detail page scores card should show "Top X% of ThinkPad" under each bar, and a faint ghost marker at the lineup max position.

**Step 5: Commit**

```bash
git add lib/scoring.ts app/model/[id]/ModelDetailClient.tsx
git commit -m "feat: add score percentile context and lineup max reference markers"
```

---

### Task 9: Blueprint Diagram Component

**Files:**
- Create: `components/models/BlueprintDiagram.tsx`

**Step 1: Create the component**

Since `Laptop` has no `dimensions` field, derive approximate proportions from `display.size` and `weight`. The component renders an SVG schematic.

```tsx
"use client";

interface BlueprintDiagramProps {
  readonly displaySize: number;  // e.g. 14.0
  readonly weight: number;       // kg
  readonly lineup: string;
  readonly series: string;
}

// Approximate chassis dimensions from display diagonal (typical Lenovo proportions)
const getDimensions = (displaySize: number, weight: number) => {
  // Based on common Lenovo chassis sizes
  const widthMm = Math.round(displaySize * 22.5);   // ~315mm for 14", ~360mm for 16"
  const depthMm = Math.round(displaySize * 15.8);   // ~221mm for 14", ~252mm for 16"
  const heightMm = weight < 1.3 ? 15 : weight < 1.8 ? 18 : weight < 2.5 ? 21 : 25;
  return { widthMm, depthMm, heightMm };
};
```

Render a top-down SVG with:
- Outer rectangle (chassis) with rounded corners at the ratio of width:depth
- Inner rectangle (screen area) with subtle fill
- Dimension labels with measurement lines (hairline + arrows)
- Lineup-specific accent: small red circle (ThinkPad TrackPoint), vent lines (Legion), thin profile line (IdeaPad Pro)
- Side-profile bar showing height
- All in monochromatic `#525252` lines with `var(--accent)` for measurement text

Full SVG viewBox should be approximately `0 0 280 220`. Use `stroke="#525252"` for lines, `fill="none"` for rectangles, `font-size="9"` monospace for labels.

**Step 2: Verify component in isolation**

Temporarily render `<BlueprintDiagram displaySize={14} weight={1.24} lineup="ThinkPad" series="X1" />` in a test page or at the top of ModelDetailClient.

**Step 3: Commit**

```bash
git add components/models/BlueprintDiagram.tsx
git commit -m "feat: add CSS/SVG blueprint diagram component"
```

---

### Task 10: Integrate BlueprintDiagram into Detail Page

**Files:**
- Modify: `app/model/[id]/ModelDetailClient.tsx` (specs section area, around line 372)

**Step 1: Import and place BlueprintDiagram**

Add import at top of ModelDetailClient:
```tsx
import { BlueprintDiagram } from "@/components/models/BlueprintDiagram";
```

Insert after the Specifications card (line ~372), before UpgradeSimulator:
```tsx
<div className="carbon-card scroll-mt-14 rounded-lg p-4">
  <h2 className="text-lg font-semibold sm:text-xl" style={{ color: "var(--foreground)" }}>
    Form Factor
  </h2>
  <div className="mt-3 flex justify-center">
    <BlueprintDiagram
      displaySize={configuredModel.display.size}
      weight={configuredModel.weight}
      lineup={configuredModel.lineup}
      series={configuredModel.series}
    />
  </div>
</div>
```

**Step 2: Add "Form Factor" to jump-nav**

In the jump-nav array (around lines 156-165), add `"Form Factor"` after `"Specs"`.

**Step 3: Verify**

Navigate to any model detail page — should see a schematic top-down view with dimensions below specs.

**Step 4: Commit**

```bash
git add app/model/[id]/ModelDetailClient.tsx
git commit -m "feat: integrate BlueprintDiagram into model detail page"
```

---

### Task 11: Thermal Profile Bar Component

**Files:**
- Create: `components/models/ThermalProfileBar.tsx`

**Step 1: Create the component**

```tsx
"use client";

interface ThermalProfileBarProps {
  readonly keyboardMaxC: number;
  readonly fanNoiseDbA?: number;
  readonly lineup: string;
}
```

Render a horizontal gradient bar (green → yellow → orange → red) spanning a temperature range (30°C to 55°C). Place a pointer/triangle marker at the model's `keyboardMaxC` position. Below the bar, show labeled zones: "Cool" (30-38), "Warm" (38-44), "Hot" (44-55). Below the bar, show the actual temperature and fan noise values.

Use CSS `linear-gradient(90deg, #42be65, #f1c21b, #ff832b, #fa4d56)` for the track. Pointer is a small inverted triangle in white or accent color.

**Step 2: Verify in isolation**

Render with test data: `keyboardMaxC={42}`, `fanNoiseDbA={35}`, `lineup="ThinkPad"`.

**Step 3: Commit**

```bash
git add components/models/ThermalProfileBar.tsx
git commit -m "feat: add ThermalProfileBar visualization component"
```

---

### Task 12: Integrate ThermalProfileBar into BenchmarksSection

**Files:**
- Modify: `components/models/BenchmarksSection.tsx`

**Step 1: Import and place**

Import `ThermalProfileBar` at top. In the Thermals subsection (around lines 170-250), add the `ThermalProfileBar` above the existing StatBox grid:

```tsx
{chassisBench?.thermals && (
  <ThermalProfileBar
    keyboardMaxC={chassisBench.thermals.keyboardMaxC}
    fanNoiseDbA={chassisBench?.fanNoise}
    lineup={model.lineup}
  />
)}
```

**Step 2: Verify**

Check any model with thermal data — should see a gradient bar with position marker above the existing stat boxes.

**Step 3: Commit**

```bash
git add components/models/BenchmarksSection.tsx
git commit -m "feat: integrate ThermalProfileBar into benchmarks section"
```

---

### Task 13: Mini Radar on LaptopCard

**Files:**
- Create: `components/models/MiniRadar.tsx`
- Modify: `components/models/LaptopCard.tsx`

**Step 1: Create MiniRadar component**

A tiny recharts `RadarChart` with no axis labels, no tick marks, just a filled polygon shape. 5 axes: Perf, Display, Memory, GPU, Portability.

```tsx
"use client";
import { RadarChart, PolarGrid, Radar, ResponsiveContainer } from "recharts";

interface MiniRadarProps {
  readonly scores: {
    readonly perf: number;
    readonly display: number;
    readonly memory: number;
    readonly gpu: number;
    readonly portability: number;
  };
  readonly color: string;
}
```

Render inside a `<ResponsiveContainer width={80} height={80}>` with:
- `<PolarGrid stroke="#393939" />` (no radial lines)
- `<Radar dataKey="value" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={1.5} />`
- No `PolarAngleAxis` labels, no `PolarRadiusAxis`
- `outerRadius="80%"` to leave margin

Data format: `[{ axis: "P", value: scores.perf }, ...]`

**Step 2: Add MiniRadar to LaptopCard**

In `LaptopCard.tsx`, in the scores section (after the `border-t` div, around line 183), add the MiniRadar centered above the ScoreBars:

```tsx
<div className="flex justify-center mb-2">
  <MiniRadar scores={{ perf: scores.perf, display: scores.display, memory: scores.memory, gpu: scores.gpu, portability: scores.portability }} color={accent} />
</div>
```

**Step 3: Verify**

Home page cards should show a small radar polygon above the score bars. Different models should have visibly different shapes.

**Step 4: Run build**

```bash
npm run build
```

Ensure no SSR issues (both components are `"use client"`).

**Step 5: Commit**

```bash
git add components/models/MiniRadar.tsx components/models/LaptopCard.tsx
git commit -m "feat: add mini radar polygon to laptop cards"
```

---

### Task 14: Price-Performance Scatter Component

**Files:**
- Create: `components/charts/PricePerformanceScatter.tsx`

**Step 1: Create the scatter chart**

```tsx
"use client";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useRouter } from "next/navigation";
```

Props: `models: Array<{ id, name, lineup, price, perf }>`. Uses recharts `ScatterChart` with:
- X-axis: price (CHF), labeled "Price (CHF)"
- Y-axis: perf score (0-100), labeled "Performance"
- Dots colored by lineup: ThinkPad `#0f62fe`, IdeaPad Pro `#be95ff`, Legion `#42be65`
- Custom tooltip showing model name + price + score
- Click handler: `router.push(`/model/${point.id}`)`
- Dark theme: `fill="#161616"` bg, `stroke="#393939"` grid
- Height: 300px fixed

**Step 2: Verify in isolation**

Render with a small test dataset of 5-6 models.

**Step 3: Commit**

```bash
git add components/charts/PricePerformanceScatter.tsx
git commit -m "feat: add price-performance scatter chart component"
```

---

### Task 15: Integrate Scatter into Home Page

**Files:**
- Modify: `app/HomeClient.tsx`

**Step 1: Add toggle state and chart**

Add state: `const [showScatter, setShowScatter] = useState(false);`

Compute scatter data from the filtered models + prices:
```tsx
const scatterData = filtered
  .map((m) => {
    const s = getModelScores(m, prices);
    return s.lowestPrice ? { id: m.id, name: m.name, lineup: m.lineup, price: s.lowestPrice, perf: s.perf } : null;
  })
  .filter(Boolean);
```

Add a toggle button near the FilterBar area (after Quick Picks, before the grid):
```tsx
<button onClick={() => setShowScatter(!showScatter)} className="carbon-btn-ghost text-xs">
  {showScatter ? "Hide" : "Show"} Price Map
</button>
```

Conditionally render the scatter chart:
```tsx
{showScatter && scatterData.length > 0 && (
  <div className="carbon-card rounded-lg p-4 mb-4">
    <PricePerformanceScatter models={scatterData} />
  </div>
)}
```

**Step 2: Verify**

Toggle the "Show Price Map" button — scatter should appear/disappear. Click a dot — should navigate to model detail.

**Step 3: Run full build**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add app/HomeClient.tsx
git commit -m "feat: integrate price-performance scatter into home page"
```

---

### Task 16: Final Build Verification & Cleanup

**Files:**
- All modified files

**Step 1: Full build**

```bash
rm -rf .next && npm run build
```

**Step 2: Run tests**

```bash
npm test
```

**Step 3: Lint check**

```bash
npm run lint
```

**Step 4: Visual spot-check**

Visit these pages on dev server:
- `/` — grid cards (mini radar, thicker accent bar, no silhouettes, larger names)
- `/` with "Show Price Map" toggle — scatter chart
- `/model/x1-carbon-gen13` — score percentiles, ghost bars, card variants, blueprint diagram, thermal profile bar
- `/model/legion-5i-gen9-16` — Legion model with FPS chart (orange <30 bars), thermal profile

**Step 5: Commit any cleanup**

```bash
git add -A
git commit -m "chore: final cleanup after frontend design improvements"
```

---

## Summary

| Task | Description | Est. Complexity |
|------|-------------|-----------------|
| 1 | ScoreBar colored numbers | Small |
| 2 | ScoreBar ghost bar | Small |
| 3 | ScoreBar one-shot animation | Small |
| 4 | Typography scale & accent bar | Small |
| 5 | Card variant classes | Small |
| 6 | Red color audit | Medium |
| 7 | Hero grid & stats | Small |
| 8 | Score percentile context | Medium |
| 9 | BlueprintDiagram component | Large |
| 10 | BlueprintDiagram integration | Small |
| 11 | ThermalProfileBar component | Medium |
| 12 | ThermalProfileBar integration | Small |
| 13 | MiniRadar component + card integration | Medium |
| 14 | PricePerformanceScatter component | Medium |
| 15 | Scatter integration in home page | Small |
| 16 | Final build verification | Small |
