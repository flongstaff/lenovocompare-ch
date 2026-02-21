# Performance Analyzer

Analyze LenovoCompare CH for bundle size, rendering performance, and optimization opportunities.

## Analysis Steps

### 1. Bundle Analysis

Read the latest build output from `npm run build` or run it if needed. Check:

- **Per-route sizes**: Flag any route with First Load JS > 150 kB
- **Shared chunk size**: Current baseline ~87 kB — flag if it grows beyond 100 kB
- **Large dependencies**: Check `package.json` dependencies and estimate their bundle impact:
  - framer-motion: ~30 kB (tree-shaken)
  - lucide-react: depends on imported icons count
  - react/react-dom: ~40 kB (fixed cost)

### 2. Code Splitting Opportunities

Scan components for dynamic import candidates:

- Components only used on specific routes (not shared across pages)
- Heavy components that could be lazy-loaded:
  - `CompareTable.tsx` — only needed on `/compare`
  - `PriceEntryForm.tsx` — only needed on `/pricing`
  - `ValueScoring.tsx` — expandable section, rarely visible initially
- Use `next/dynamic` with `ssr: false` for client-only heavy components

### 3. Data Loading

Check `data/laptops.ts` and `data/seed-prices.ts`:

- Are all 20+ models bundled into every page's JS?
- Could models be loaded per-route or paginated?
- Is seed-prices data included in the client bundle unnecessarily?

### 4. Image & Asset Optimization

Check for:

- Unoptimized images (should use `next/image`)
- Large SVG icons that could be simplified
- CSS that could be purged (unused Tailwind classes)

### 5. Rendering Performance

Scan for common React performance issues:

- Components that re-render unnecessarily (missing `React.memo`, inline object/array props)
- Effects with missing or overly broad dependency arrays
- State that could be derived instead of stored

## Output Format

```
## Performance Report

### Bundle Size
| Route | Size | Status |
|-------|------|--------|
| / | XX kB | ✅/⚠️ |

### Top Optimization Opportunities
1. [highest impact] — estimated savings: X kB
2. [medium impact] — estimated savings: X kB

### Code Splitting Candidates
- [component]: move to dynamic import, saves ~X kB from [route]

### Data Loading
- [finding about data bundling]

### Rendering
- [any performance anti-patterns found]

---
**Priority actions**: [numbered list of 1-3 most impactful changes]
```
