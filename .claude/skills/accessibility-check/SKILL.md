---
name: accessibility-check
description: Run accessibility audit on all routes using Playwright MCP and axe-core
user-invocable: true
---

# Accessibility Check

Run an automated accessibility audit across all key routes using Playwright MCP.

## Prerequisites

- Dev server running on `localhost:3000` (auto-started by SessionStart hook)
- Playwright MCP server available (Docker)

## Routes to Audit

| Route                                       | Description          | Key Concerns                                  |
| ------------------------------------------- | -------------------- | --------------------------------------------- |
| `/`                                         | Home grid (48 cards) | Card contrast, filter controls, keyboard nav  |
| `/compare?ids=t14s-gen6-amd,t14-gen5-intel` | Compare page         | Chart alt text, table headers, mobile swipe   |
| `/model/t14s-gen6-amd`                      | Model detail         | Score bars, radar chart, interactive elements |
| `/pricing`                                  | Pricing management   | Form inputs, toast notifications              |
| `/hardware`                                 | Hardware guide       | Expandable cards, tab navigation              |

## Workflow

1. **Verify dev server** is running on `:3000`
2. **For each route**, use Playwright MCP to:
   - Navigate to the page
   - Inject and run axe-core: `await page.evaluate(() => axe.run())`
   - Capture any violations
   - Take a screenshot for reference
3. **Check these specific patterns**:
   - All `<img>` tags have `alt` attributes
   - All interactive elements (`<button>`, `<a>`, `<input>`) have accessible names
   - Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)
   - Score bars have `aria-label` or `aria-valuenow` attributes
   - Charts have descriptive `aria-label` on their containers
   - Modal/toast content is announced to screen readers
   - Focus management works when opening/closing compare selector
   - Mobile swipe cards in MobileCompareCards are keyboard-accessible
4. **Output a report** grouped by severity:
   - **Critical**: Missing interactive labels, no keyboard access
   - **Serious**: Contrast failures, missing landmarks
   - **Moderate**: Missing alt text, redundant links
   - **Minor**: Best practice suggestions

## Manual Checks (remind user)

These cannot be automated:

- Screen reader flow makes logical sense
- Focus order matches visual layout
- Animations respect `prefers-reduced-motion`
- Touch targets are at least 44x44px on mobile

## Carbon Design System A11y Notes

The IBM Carbon Design System has built-in accessibility patterns. Verify:

- `.carbon-btn` elements use `<button>` not `<div>`
- `.carbon-input` elements have associated `<label>`
- `.carbon-card` sections use appropriate heading hierarchy
- `.carbon-chip` interactive chips are `<button>` elements
