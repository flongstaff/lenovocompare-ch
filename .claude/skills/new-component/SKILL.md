---
name: new-component
description: Scaffold a new React component following Carbon dark theme conventions
disable-model-invocation: true
---

# New Component

Scaffold a new React component that follows the LenovoCompare CH design system.

## Arguments

Required: component name (e.g. "ModelBadge") and category (e.g. "ui", "thinkpad", "compare", "filters", "pricing", "layout").

## Workflow

1. **Parse arguments**: Extract the component name (PascalCase) and category subdirectory.

2. **Read design system reference**: Read `app/globals.css` to understand available CSS variables and component classes (`.carbon-card`, `.carbon-btn`, `.carbon-chip`, etc.).

3. **Create the component file** at `components/{category}/{ComponentName}.tsx` using this template:

```tsx
"use client";

import { motion } from "framer-motion";

interface {ComponentName}Props {
  // Props here
}

export const {ComponentName} = ({ }: {ComponentName}Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Component content */}
    </motion.div>
  );
};
```

## Design System Rules

Every component MUST follow these conventions:

### Colors (Tailwind classes only — never raw hex)

- **Backgrounds**: `bg-carbon-800` (primary surface), `bg-carbon-700` (alt surface), `bg-carbon-900` (page bg)
- **Text**: `text-carbon-50` (primary), `text-carbon-100` (secondary), `text-carbon-400` (muted)
- **Borders**: `border-carbon-500` or `border-carbon-600`
- **Accent**: `text-accent`, `bg-accent`, `hover:bg-accent-hover`
- **TrackPoint red**: `text-trackpoint` (use sparingly — highlights only)

### Component Classes (from globals.css)

- Cards → use `className="carbon-card"` (includes bg, border, hover states)
- Buttons → `carbon-btn` (primary), `carbon-btn-ghost` (outline), `carbon-btn-danger` (destructive)
- Chips/badges → `carbon-chip`, `carbon-chip-success`, `carbon-chip-warn`
- Inputs → `carbon-input`, `carbon-select`

### Animation

- Entry: `initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}`
- Use `transition={{ duration: 0.2 }}` for subtle, quick animations
- Stagger children with `delay: index * 0.05` when rendering lists

### Typography

- Font family is IBM Plex Sans (set globally) — don't override
- Monospace values (prices, specs): `font-mono` class
- Section labels: `text-[10px] font-bold uppercase tracking-widest text-carbon-200`

### Patterns

- Always use `"use client"` directive for interactive components
- Use `readonly` on interface props
- Arrow function components with named export
- Import icons from `lucide-react`

4. **Verify**: Run `npm run build` to confirm the new component compiles.
