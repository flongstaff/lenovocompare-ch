---
name: e2e-check
description: Run a Playwright smoke test across all routes
disable-model-invocation: true
---

# E2E Smoke Check

Run a quick Playwright smoke test to verify all routes load without errors.

## Prerequisites

- Dev server running on `localhost:3000` (start with `npm run dev` if needed)
- Playwright MCP server available (configured in `.mcp.json`)

## Workflow

1. **Start dev server** if not already running:
   - Check if port 3000 is in use: `lsof -i :3000`
   - If not, start in background: `npm run dev &`
   - Wait for server ready

2. **Navigate to each route** using Playwright MCP tools and verify:

   ### Home Page (`/`)
   - Page loads without console errors
   - ThinkPad cards are visible (at least 1 card element)
   - Filter bar is present
   - Series filter chips render

   ### Model Detail (`/model/t14-gen5-amd`)
   - Page loads with model name in heading
   - Specs sections render (processor, display, RAM, etc.)
   - No console errors

   ### Compare (`/compare?ids=t14-gen5-amd,x1-carbon-gen12`)
   - Page loads with comparison table (desktop) or cards (mobile)
   - Both model names appear
   - No console errors

   ### Pricing (`/pricing`)
   - Page loads with price table or empty state
   - Import/export buttons are present
   - No console errors

3. **Check for common issues**:
   - Any hydration mismatch warnings in console
   - Any 404 requests for missing assets
   - Any unhandled promise rejections

4. **Take a screenshot** of each page for visual reference.

## Output Format

```
## E2E Smoke Test Results

### / (Home)
- Load: PASS/FAIL
- Cards visible: PASS/FAIL (count: N)
- Console errors: NONE / [list]
- Screenshot: [attached]

### /model/t14-gen5-amd
- Load: PASS/FAIL
- Specs rendered: PASS/FAIL
- Console errors: NONE / [list]

### /compare
- Load: PASS/FAIL
- Models shown: PASS/FAIL
- Console errors: NONE / [list]

### /pricing
- Load: PASS/FAIL
- UI elements: PASS/FAIL
- Console errors: NONE / [list]

---
Routes tested: 4
Passed: N/4
Console errors: N total
```
