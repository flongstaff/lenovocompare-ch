---
name: visual-check
description: Start dev server and screenshot key pages to verify UI rendering
disable-model-invocation: true
---

# Visual Check

Visually verify the LenovoCompare CH app by screenshotting key pages.

## Workflow

1. **Start dev server** if not already running:

   ```bash
   npm run dev &
   ```

   Wait for "Ready" message on localhost:3000.

2. **Screenshot key pages** using Playwright MCP browser tools:
   - `/` — Home page with cards grid, filter bar, header
   - `/compare` — Comparison table (add 2-3 models first via UI interaction)
   - `/pricing` — Pricing page with entry form
   - `/model/x1-carbon-gen12` — Individual model detail page

3. **Check each screenshot for**:
   - IBM Carbon dark theme renders (dark backgrounds, not white)
   - Text is readable (carbon-50 on carbon-800/900 backgrounds)
   - Cards grid displays ThinkPad models with series badges
   - Filter bar is visible and functional-looking
   - Header with "LenovoCompare CH" branding visible
   - No layout overflow or broken elements
   - Accent colors (blue buttons, trackpoint red) appear correctly

4. **Mobile check**: Resize browser to 375px width and screenshot `/` to verify responsive layout.

5. **Report findings**:

   ```
   ## Visual Check Report
   - Home: ✅/❌ [notes]
   - Compare: ✅/❌ [notes]
   - Pricing: ✅/❌ [notes]
   - Model Detail: ✅/❌ [notes]
   - Mobile: ✅/❌ [notes]
   ```

6. **Clean up**: Stop the dev server if you started it.
