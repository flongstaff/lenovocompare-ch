---
name: test-component
description: Scaffold a Vitest + @testing-library/react test file for a component
model: sonnet
---

# Test Component

Generate a unit test file for a React component using Vitest and @testing-library/react.

## Usage

```
/test-component <ComponentName or path>
```

Examples:

- `/test-component ScoreBar`
- `/test-component components/models/LaptopCard.tsx`

## Steps

1. **Locate the component**: Find the component file using Glob/Grep. If the argument is a name, search `components/**/*.tsx`.

2. **Read the component**: Understand its props interface, conditional rendering, event handlers, and data display logic.

3. **Check for existing tests**: Search `tests/` for an existing test file. If found, extend it rather than overwriting.

4. **Generate the test file** at `tests/<component-name>.test.tsx`:

### File Template

```typescript
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComponentName } from "@/components/path/ComponentName";

// Mock recharts if component uses charts
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  RadarChart: () => <div data-testid="radar-chart" />,
  Radar: () => null,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  PolarRadiusAxis: () => null,
  BarChart: () => <div data-testid="bar-chart" />,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ScatterChart: () => <div data-testid="scatter-chart" />,
  Scatter: () => null,
  ZAxis: () => null,
}));

// Mock framer-motion if component uses animations
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: { div: "div", span: "span", li: "li", button: "button" },
}));

// Mock next/navigation if component uses router
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
  useParams: () => ({}),
}));

// Mock next/dynamic — render components directly
vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<any>) => {
    const Component = vi.fn(() => null);
    Component.displayName = "DynamicComponent";
    return Component;
  },
}));

describe("ComponentName", () => {
  it("renders without crashing", () => {
    render(<ComponentName {...minimalProps} />);
    // Assert key element is present
  });

  // Add tests for:
  // - Conditional rendering (props that show/hide elements)
  // - Text content accuracy
  // - Event handlers (click, change)
  // - Edge cases (empty data, null values, zero scores)
});
```

### Fixture Factory

Use the `makeModel` helper for Laptop props:

```typescript
import type { Laptop } from "@/lib/types";

const makeModel = (overrides: Partial<Laptop> = {}): Laptop =>
  ({
    id: "test-model",
    name: "Test ThinkPad T14 Gen 5",
    lineup: "ThinkPad",
    series: "T",
    year: 2024,
    os: "Windows 11 Pro",
    processor: { name: "AMD Ryzen 7 PRO 8840U", cores: 8, threads: 16 },
    ram: { size: 16, type: "LPDDR5x", speed: 6400, maxSize: 16, slots: 0, soldered: true },
    storage: { type: "NVMe", size: 512, slots: 1 },
    display: {
      size: 14,
      resolution: "1920x1200",
      resolutionLabel: "WUXGA",
      panel: "IPS",
      brightness: 300,
      refreshRate: 60,
      colorGamut: "45% NTSC",
    },
    gpu: { name: "AMD Radeon 780M", type: "Integrated", integrated: true },
    battery: { whr: 52.5 },
    weight: 1.41,
    ports: ["2x USB-C", "2x USB-A", "HDMI 2.1"],
    wireless: ["Wi-Fi 6E", "Bluetooth 5.3"],
    keyboard: { backlitLevels: 2, numpad: false },
    psrefUrl: "https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_T14_Gen_5_21MC",
    ...overrides,
  }) as unknown as Laptop;
```

5. **Test categories** — include tests for each applicable category:

| Category      | What to Test                                           |
| ------------- | ------------------------------------------------------ |
| Rendering     | Renders with required props, shows component structure |
| Conditional   | Elements appear/hide based on prop values              |
| Text          | Labels, formatted values (CHF, scores, dates)          |
| Interactions  | Click handlers, toggles, selections                    |
| Edge cases    | Empty arrays, null/undefined props, zero values        |
| Accessibility | Aria labels, roles, semantic elements present          |

6. **Run the test**: Execute `npx vitest run tests/<component-name>.test.tsx --reporter=verbose` and fix any failures.

7. **Verify full suite**: Run `npx vitest run` to confirm no regressions.

## Mocking Guidelines

| Dependency      | Mock Strategy                                           |
| --------------- | ------------------------------------------------------- |
| recharts        | Replace all chart components with divs (fail in jsdom)  |
| framer-motion   | Replace AnimatePresence/motion with passthrough         |
| next/navigation | Mock useRouter, useSearchParams, usePathname, useParams |
| next/dynamic    | Return stub component                                   |
| next/link       | Render as `<a>` tag (default Next.js test behavior)     |
| localStorage    | Use `vi.stubGlobal` or mock `useLocalStorage` hook      |
| External data   | Import from `data/*.ts` directly (static, `as const`)   |

## Notes

- Use `// @vitest-environment jsdom` at top of file (project default is `node`)
- lucide-react icons render as SVGs — assert by `role="img"` or test-id, not snapshot
- `ScoreBar` color prop must be hex (`"#0f62fe"`), not CSS variables
- Components with `useSearchParams()` need Suspense boundary in test render
- Don't test recharts internals or animation keyframe values
- Use `screen.getByText`, `screen.getByRole`, `screen.queryByText` for assertions
