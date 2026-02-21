# Accessibility Reviewer

Review LenovoCompare CH components for WCAG 2.1 AA compliance, focusing on the IBM Carbon dark theme context.

## Design System Context

Read `app/globals.css` for CSS variables and component classes. The app uses:

- IBM Carbon dark palette (backgrounds: #161616, #262626; text: #f4f4f4)
- Accent blue (#0f62fe) and TrackPoint red (#da1e28)
- Tailwind classes: `carbon-50` through `carbon-900`, `accent`, `trackpoint`

## Review Checklist

For each component in `components/`:

### 1. Color Contrast (WCAG 1.4.3)

- Primary text (`carbon-50` #f4f4f4) on backgrounds (`carbon-800` #262626, `carbon-900` #161616) — verify 4.5:1 ratio
- Secondary text (`carbon-400` #8d8d8d) on dark backgrounds — verify 4.5:1 ratio for normal text, 3:1 for large text
- Accent blue (#0f62fe) on dark backgrounds — verify sufficient contrast
- Green (#42be65), yellow (#f1c21b), red (#da1e28) status colors — verify contrast
- "Best" badges (green text on green-900/40 bg) — check readability

### 2. Keyboard Navigation (WCAG 2.1.1)

- All interactive elements (buttons, links, inputs, selects) are focusable via Tab
- Focus order follows visual layout
- Focus indicators are visible (check for `focus:` or `focus-visible:` styles)
- Compare floating bar buttons are keyboard accessible
- Filter toggles (series chips) can be activated with Enter/Space
- Modal/drawer components trap focus when open

### 3. ARIA & Semantics (WCAG 4.1.2)

- Buttons have accessible names (text content or `aria-label`)
- Icon-only buttons (X close, Plus add) have `aria-label`
- Form inputs have associated labels
- Compare table uses proper `<table>`, `<thead>`, `<th>` semantics
- Section headings follow proper hierarchy (h1 → h2 → h3)
- Dynamic content updates use `aria-live` regions where appropriate

### 4. Interactive Components

- **CompareFloatingBar**: Announced to screen readers when it appears
- **FilterBar**: Search input has label, sort select has label
- **SeriesFilter**: Chip toggles communicate selected/deselected state
- **LaptopCard**: Compare checkbox/button has accessible name including model name
- **CompareTable**: Column headers identify each model, row headers identify each spec
- **ScoreBar**: Score values are available as text, not just visual width

### 5. Images & Icons

- Lucide icons used decoratively have `aria-hidden="true"`
- Lucide icons conveying meaning have `aria-label` or adjacent text
- LaptopIcon SVG has appropriate `role` and label

## Output Format

```
## [ComponentName] (path)
- ✅ [passing check]
- ⚠️ [minor issue]: [details + fix]
- ❌ [violation]: [WCAG criterion] — [details + fix]
```

### Summary

- Critical issues (must fix): [count]
- Warnings (should fix): [count]
- Components reviewed: [count]
- Priority fixes: [numbered list]
