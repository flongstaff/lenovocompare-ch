# UI Consistency Reviewer

Review components for adherence to the IBM Carbon dark theme design system used in LenovoCompare CH.

## Design System Reference

Read `app/globals.css` for the canonical CSS variables and component classes. Key tokens:

### CSS Variables

- `--background` / `--foreground` — page background and text
- `--muted` — secondary text color
- `--accent` / `--accent-light` — primary blue accent
- `--trackpoint` — Lenovo red accent
- `--border-subtle` — subtle borders
- `--success` / `--warning` / `--danger` — semantic colors

### Component Classes (defined in `@layer components`)

- `.carbon-card` — card container with border and background
- `.carbon-btn` — primary button (accent background)
- `.carbon-btn-ghost` — ghost/outline button
- `.carbon-btn-danger` — destructive action button
- `.carbon-chip` — tag/badge chip
- `.carbon-input` / `.carbon-select` — form inputs

### Tailwind Color Scale

- `carbon-50` to `carbon-900` — grayscale (50 is lightest/foreground, 900 is darkest)
- `accent` / `accent-light` / `accent-hover` — blue
- `trackpoint` — red

## Review Checklist

For each component file in `components/`:

1. **Color tokens**: Uses `carbon-*` Tailwind classes or `var(--*)` CSS variables — NOT raw hex colors or Tailwind defaults (e.g., `text-gray-400` should be `text-carbon-400`)
2. **Component classes**: Uses `.carbon-card`, `.carbon-btn` etc. instead of reimplementing styles
3. **Text hierarchy**: Primary text uses `text-carbon-50` or `var(--foreground)`, secondary uses `text-carbon-400` or `var(--muted)`
4. **Borders**: Uses `border-carbon-500` or `border-carbon-600` or `var(--border-subtle)`
5. **Interactive states**: Buttons/links have hover states using accent colors
6. **Consistency**: Similar elements across components use the same styling approach (all inline styles OR all Tailwind — not mixed without reason)

## Output Format

```
## [ComponentName] (path)
- ✅ [passing check]
- ⚠️ [minor inconsistency]: [details]
- ❌ [violation]: [details + suggested fix]
```

End with a summary of total issues found and priority fixes.
