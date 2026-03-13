---
model: haiku
---

# Visual Regression Tester

Capture screenshots of key pages/components and detect visual regressions using Playwright.

## When to Use

- After modifying UI components, layouts, or styles
- Before creating a PR with visual changes
- After updating chart components or data display
- When verifying responsive behavior changes

## Workflow

### 1. Ensure Dev Server is Running

```bash
curl -s -o /dev/null http://localhost:3000 || (npm run dev &>/dev/null & sleep 3)
```

### 2. Capture Baseline Screenshots

Use Playwright to screenshot key routes at desktop (1280x800) and mobile (375x812) viewports:

| Route                       | Key Elements                           | Viewport |
| --------------------------- | -------------------------------------- | -------- |
| `/`                         | Model grid, filters, lineup badges     | Both     |
| `/model/t14-gen5-amd`       | Dashboard strip, score bars, specs     | Both     |
| `/model/x1-carbon-gen12`    | Score bars, prices, charts             | Desktop  |
| `/compare` (with 2+ models) | Compare table, radar chart, bar charts | Both     |
| `/deals`                    | Deal cards, market insights            | Desktop  |
| `/hardware`                 | CPU/GPU analysis cards                 | Desktop  |
| `/pricing`                  | Price management form                  | Desktop  |

### 3. Screenshot Commands

Use `npx playwright screenshot` for captures:

```bash
# Desktop viewport
npx playwright screenshot --viewport-size=1280,800 http://localhost:3000/ screenshots/home-desktop.png

# Mobile viewport
npx playwright screenshot --viewport-size=375,812 http://localhost:3000/ screenshots/home-mobile.png

# Specific model page
npx playwright screenshot --viewport-size=1280,800 "http://localhost:3000/model/t14-gen5-amd" screenshots/model-detail-desktop.png

# Wait for dynamic content (charts load via dynamic imports)
npx playwright screenshot --viewport-size=1280,800 --wait-for-timeout=3000 "http://localhost:3000/model/x1-carbon-gen12" screenshots/model-charts.png
```

### 4. Compare Screenshots

If baseline screenshots exist in `screenshots/baseline/`:

```bash
# Visual diff using ImageMagick (if available)
compare -metric RMSE screenshots/baseline/home-desktop.png screenshots/home-desktop.png screenshots/diff-home-desktop.png 2>&1

# Or use pixel comparison
identify -verbose screenshots/baseline/home-desktop.png | grep -E 'Geometry|Mean'
identify -verbose screenshots/home-desktop.png | grep -E 'Geometry|Mean'
```

### 5. Check Key Visual Properties

For each screenshot, verify:

- **Layout**: No overlapping elements, proper spacing
- **Colors**: Carbon dark theme (background #161616, cards #262626)
- **Typography**: Mono fonts for scores, proper sizing hierarchy
- **Charts**: Radar/bar charts render (not blank), correct colors
- **Responsive**: Mobile view stacks columns, no horizontal scroll
- **Score bars**: Correct width proportions, hex colors (not CSS var fallback)

### 6. Report Findings

Summarize results:

```
Visual Regression Report
========================
Route           | Status  | Notes
----------------|---------|------
/               | PASS    | Grid renders correctly
/model/[id]     | CHANGED | Score bar colors shifted
/compare        | PASS    | Charts render at correct size
/deals          | SKIP    | No visual changes in this PR
```

## Directory Structure

```
screenshots/
  baseline/          # Reference screenshots (git-tracked)
  current/           # Current run (gitignored)
  diff/              # Visual diffs (gitignored)
```

## Notes

- Playwright MCP runs in Docker and cannot reach `localhost:3000` — always use native `npx playwright screenshot` CLI
- Dynamic imports (charts, benchmarks) need `--wait-for-timeout=3000` to ensure content loads
- Screenshot dimensions should match standard breakpoints: 1280px (desktop), 768px (tablet), 375px (mobile)
- Carbon theme uses specific background colors — a blank white area indicates SSR/hydration failure
- Compare page needs models in sessionStorage — may need Playwright script to set state before capture
- Run from project root so paths resolve correctly
