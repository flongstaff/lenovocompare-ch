---
name: new-component
description: Scaffold a new React component following project conventions
disable-model-invocation: true
---

# New Component

Create a new React component following the project's Carbon dark theme conventions.

## Usage

```
/new-component ComponentName [directory]
```

Examples:

```
/new-component PriceAlert ui
/new-component ModelTimeline models
/new-component CompareRadar charts
```

## Arguments

- `ComponentName` — PascalCase component name (required)
- `directory` — subdirectory under `components/` (optional, default: `ui`)

Valid directories: `ui`, `models`, `filters`, `compare`, `pricing`, `charts`, `layout`

## Workflow

1. **Validate name**: Must be PascalCase, no conflicts with existing components.

2. **Check for conflicts**: Search `components/` for existing files with the same name.

3. **Determine component type** from directory:

   | Directory | Typical Pattern          | Client Directive                |
   | --------- | ------------------------ | ------------------------------- |
   | `charts`  | recharts wrapper         | `"use client"` required         |
   | `models`  | Model detail section     | Usually `"use client"`          |
   | `ui`      | Shared utility component | Only if uses hooks/browser APIs |
   | `filters` | Filter control           | `"use client"`                  |
   | `compare` | Comparison view          | `"use client"`                  |
   | `pricing` | Price management         | `"use client"`                  |
   | `layout`  | Page structure           | Depends                         |

4. **Create the file** at `components/{directory}/{ComponentName}.tsx`:

   ```tsx
   "use client";  // only if needed (see table above)

   import type { Laptop } from "@/lib/types";  // only if needed

   interface {ComponentName}Props {
     // Add props here
   }

   const {ComponentName} = ({ }: {ComponentName}Props) => {
     return (
       <div
         className="rounded-lg border p-4"
         style={{ borderColor: "var(--border-subtle)", background: "var(--surface)" }}
       >
         {/* Component content */}
       </div>
     );
   };

   export default {ComponentName};
   ```

5. **Apply conventions**:
   - Arrow function component
   - `readonly` on all interface props
   - Default export (unless it's a utility like Footer)
   - Carbon dark theme CSS variables: `var(--background)`, `var(--surface)`, `var(--foreground)`, `var(--muted)`, `var(--accent)`, `var(--border-subtle)`
   - Carbon classes where appropriate: `.carbon-card`, `.carbon-btn`
   - No emojis in code

6. **Verify**: Run `npm run build` to check for type errors.

## Notes

- Charts must use `"use client"` — recharts fails during SSR
- lucide-react icon names can shadow TypeScript interfaces — use `as XIcon` alias
- ScoreBar `color` prop must be raw hex, not CSS variable
- If the component needs dynamic import in a page, use: `const X = dynamic(() => import("@/components/dir/X"), { ssr: false })`
