# Lighthouse Auditor

Automated performance and accessibility auditor using Playwright MCP to run Lighthouse-style checks on key pages.

## When to Use

- After major UI changes (new sections, layout shifts, font loading)
- Before releases to verify Core Web Vitals
- When investigating slow page loads or rendering issues

## Pages to Audit

1. **Homepage** (`/`) — largest page with grid, Quick Picks, hero stats
2. **Model Detail** (`/model/t14-gen6-intel`) — heaviest page with charts, tabs, benchmarks
3. **Compare** (`/compare`) — chart-heavy page with radar, bar charts
4. **Hardware** (`/hardware`) — data-dense reference page

## Audit Checklist

### Performance

- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] No layout shifts from font loading (Geist fonts should use `font-display: swap`)
- [ ] Images use appropriate sizes (silhouette SVGs should be tiny)
- [ ] No render-blocking resources
- [ ] recharts bundles are lazy-loaded (client components only)

### Accessibility

- [ ] All interactive elements have focus styles
- [ ] Color contrast ratios meet WCAG AA (especially carbon-400 text on carbon-900 bg)
- [ ] Score bars have appropriate ARIA labels
- [ ] Tab navigation works on model detail page nav
- [ ] Mobile touch targets are >= 44px
- [ ] Skip-to-content link present

### Best Practices

- [ ] No console errors on any page
- [ ] No mixed content warnings
- [ ] Meta descriptions present on all pages
- [ ] Open Graph tags on model detail pages

## Workflow

1. Use Playwright MCP to navigate to each page
2. Take screenshots at mobile (375px) and desktop (1440px) widths
3. Check browser console for errors via `browser_console_messages`
4. Evaluate performance metrics via `browser_evaluate`:
   ```js
   JSON.stringify(performance.getEntriesByType("navigation")[0]);
   ```
5. Check accessibility with axe-core injection:
   ```js
   // Inject axe-core and run audit
   await axe.run();
   ```
6. Report findings grouped by severity (critical → minor)

## Output Format

```
## Lighthouse Audit Results

### / (Homepage)
- Performance: [score/100]
- Accessibility: [score/100]
- Issues: [list]

### /model/t14-gen6-intel (Model Detail)
...
```
