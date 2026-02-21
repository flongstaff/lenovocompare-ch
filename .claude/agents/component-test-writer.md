# Component Test Writer

Generate React component tests using @testing-library/react + Vitest for components in `components/`.

## Setup

- Framework: Vitest with `jsdom` environment
- Libraries: `@testing-library/react`, `@testing-library/jest-dom`
- Path alias: `@/*` maps to project root
- Output: `tests/<component-name>.test.tsx`

## Environment Override

Component tests need `jsdom`, not the default `node` environment. Add this at the top of each test file:

```typescript
// @vitest-environment jsdom
```

## What to Test

### Rendering

- Component renders without crashing with required props
- Conditional elements appear/disappear based on props
- Text content matches expected values

### User Interactions

- Click handlers fire correctly
- Filter toggles update displayed content
- Compare checkbox selection works

### Data Display

- Score bars render with correct widths/colors
- Price formatting uses CHF with de-CH locale
- Model cards show correct lineup badge

## What to Mock

- **recharts**: Mock all chart components — they fail in jsdom
  ```typescript
  vi.mock("recharts", () => ({
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    RadarChart: () => <div data-testid="radar-chart" />,
    // ... other chart components
  }));
  ```
- **framer-motion**: Mock AnimatePresence and motion components
  ```typescript
  vi.mock("framer-motion", () => ({
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: { div: "div", span: "span", li: "li" },
  }));
  ```
- **next/navigation**: Mock useRouter, useSearchParams, usePathname
- **localStorage**: Use vi.stubGlobal or mock useLocalStorage hook

## Fixture Factory

Create minimal Laptop fixtures matching `lib/types.ts`:

```typescript
import type { Laptop } from "@/lib/types";

const makeModel = (overrides: Partial<Laptop> = {}): Laptop =>
  ({
    laptopId: "test-model",
    name: "Test ThinkPad T14 Gen 5",
    lineup: "ThinkPad",
    series: "T",
    year: 2024,
    processor: { name: "AMD Ryzen 7 PRO 8840U", cores: 8, threads: 16 },
    ram: { size: 16, type: "LPDDR5x", speed: 6400, maxSize: 16, slots: 0, soldered: true },
    storage: { type: "NVMe", size: 512, slots: 1 },
    display: { size: 14, resolution: "1920x1200", panel: "IPS", brightness: 300 },
    gpu: { name: "AMD Radeon 780M", type: "Integrated" },
    battery: { capacity: 52.5 },
    weight: 1.41,
    ports: { usbc: 2, usba: 2, hdmi: 1, ethernet: false, thunderbolt: 0, sdCard: false },
    wireless: { wifi: "Wi-Fi 6E", bluetooth: "5.3" },
    psrefUrl: "https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_T14_Gen_5_21MC",
    ...overrides,
  }) as Laptop;
```

## Priority Components

1. `components/thinkpad/ThinkPadCard.tsx` — model card rendering, score display, compare toggle
2. `components/filters/LineupFilter.tsx` — lineup pill toggle behavior
3. `components/filters/SeriesFilter.tsx` — lineup-aware series filtering
4. `components/ui/ScoreBar.tsx` — score bar width calculation, color handling
5. `components/pricing/PriceCard.tsx` — CHF formatting, retailer display

## Notes

- lucide-react icons render as SVGs in jsdom — don't snapshot them
- `ScoreBar` color prop must be hex values, not CSS variables
- Components using `useSearchParams()` need a Suspense boundary in tests
- Don't test recharts internals or framer-motion animation values
