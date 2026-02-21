---
name: screenshot-diff
description: Capture before/after screenshots of key routes using Playwright MCP for visual regression detection
disable-model-invocation: true
---

# Screenshot Diff

Capture screenshots of key routes before and after code changes to detect visual regressions. Uses the Playwright MCP server for browser automation.

## Usage

```
/screenshot-diff                    # Full before/after cycle on all routes
/screenshot-diff --before           # Capture "before" baseline only
/screenshot-diff --after            # Capture "after" and compare to baseline
/screenshot-diff --route /model/x1-carbon-gen12  # Single route only
/screenshot-diff --mobile           # Include mobile viewport (375px)
```

## Routes to Capture

Default routes (capture all unless `--route` specified):

| Route                                        | Description             | Key Elements                          |
| -------------------------------------------- | ----------------------- | ------------------------------------- |
| `/`                                          | Home grid               | Laptop cards, filters, lineup pills   |
| `/model/x1-carbon-gen12`                     | Model detail (flagship) | Dashboard, scores, charts, benchmarks |
| `/model/legion-pro-7i-16-gen9`               | Model detail (Legion)   | Gaming section, high GPU scores       |
| `/compare?ids=x1-carbon-gen12,t14s-gen5-amd` | Compare page            | Charts, table, radar                  |
| `/pricing`                                   | Pricing page            | Price cards, import UI                |
| `/hardware`                                  | Hardware guide          | CPU/GPU analysis cards                |

## Workflow

### Phase 1: Capture "Before" (run with `--before` or at start of full cycle)

1. Ensure dev server is running on localhost:3000
2. For each route, use Playwright MCP to:
   - Navigate to `http://localhost:3000{route}`
   - Wait for network idle
   - Take a full-page screenshot
   - Save to `/tmp/screenshot-diff/before/{route-slug}.png`
3. For mobile (if `--mobile`), set viewport to 375x812 and repeat

### Phase 2: Make Code Changes

(User makes their changes between --before and --after)

### Phase 3: Capture "After" (run with `--after` or at end of full cycle)

1. For each route, capture screenshots to `/tmp/screenshot-diff/after/{route-slug}.png`
2. Compare each before/after pair visually using the Playwright MCP screenshot tool
3. Report differences found

### Phase 4: Report

For each route, report:

- **No change**: Screenshots appear identical
- **Expected change**: Visible differences in the area being modified
- **Unexpected change**: Differences in areas not related to the current task

## Notes

- Screenshots are stored in `/tmp/screenshot-diff/` (cleared on each full cycle)
- The dev server must be running before capturing
- Wait for dynamic imports (recharts charts) to load before capturing — use network idle + 2s delay
- Dark theme is default — no need to toggle
- Compare page requires query params — use the full URL with `?ids=`
