---
name: visual-regression
description: Capture and compare screenshots of all routes for visual regression testing
disable-model-invocation: true
---

# Visual Regression Testing

Capture screenshots of all key routes and compare against saved baselines to detect visual regressions.

## Routes to Capture

| Route                                                                | Viewport | Description                      |
| -------------------------------------------------------------------- | -------- | -------------------------------- |
| `/`                                                                  | 1400×900 | Home grid with all 98+ models    |
| `/compare?ids=t14s-gen6-amd,t14s-gen4-amd,t14-gen4-amd,t14-gen6-amd` | 1400×900 | Compare page with 4 models       |
| `/model/t14s-gen6-amd`                                               | 1400×900 | Model detail page                |
| `/pricing`                                                           | 1400×900 | Pricing page with grouped prices |
| `/hardware`                                                          | 1400×900 | Hardware guide page              |

## Workflow

### 1. Ensure dev server is running

```bash
curl -s -o /dev/null http://localhost:3000 || (npm run dev &>/dev/null & sleep 5)
```

### 2. Capture screenshots using Playwright

Write a Python script that:

- Launches headless Chromium at 1400×900
- Navigates to each route, waits for `networkidle` + 3s
- Takes both viewport and full-page screenshots
- Saves to `design/screenshots/current/`

### 3. Compare against baselines

- Baselines are stored in `design/screenshots/baseline/`
- If baselines don't exist, save current as baseline and report "Baselines created"
- If baselines exist, compare pixel-by-pixel
- Report differences with file paths to both images

### 4. Update baselines

When the user says "update baselines" or "accept changes":

- Copy all `current/` screenshots to `baseline/`
- Report which baselines were updated

## Screenshot naming

`{route-slug}_{viewport|full}.png`

Examples:

- `home_viewport.png`, `home_full.png`
- `compare-4models_viewport.png`, `compare-4models_full.png`
- `model-t14s-gen6-amd_viewport.png`, `model-t14s-gen6-amd_full.png`
- `pricing_viewport.png`, `pricing_full.png`
- `hardware_viewport.png`, `hardware_full.png`

## Key areas to verify

- Chart labels and legends fully visible (no clipping)
- Card layouts balanced and aligned
- Text contrast readable (--muted color at #a8a8a8)
- Mobile compare cards (capture at 375×812 too)
- Score bars rendering with correct hex colors (not CSS variables)

## Output

Report format:

```
Visual Regression Results
========================
✅ home — no changes
⚠️ compare-4models — 2.3% pixel difference (charts area)
✅ model-t14s-gen6-amd — no changes
✅ pricing — no changes
✅ hardware — no changes

Screenshots saved to design/screenshots/current/
```
