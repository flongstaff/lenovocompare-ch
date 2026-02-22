# Contributing to LenovoCompare CH

Thank you for your interest in contributing! This guide covers everything you need to get started.

## Prerequisites

- **Node.js 20+** and npm
- **Docker** (optional, for containerized dev server)
- A code editor with TypeScript support

## Development Setup

```bash
git clone https://github.com/flong/lenovocompare-ch.git
cd lenovocompare-ch
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to verify the dev server is running.

### Verification

There is no test framework configured. Use the production build as the verification step:

```bash
npm run build
```

Always run this before submitting a PR.

## Project Conventions

### TypeScript

- Use `readonly` for constants and type literals (`as const`)
- Avoid `any` — prefer `unknown` for truly dynamic types
- Arrow functions for components and utilities
- PascalCase for components, camelCase for functions and variables
- Function params accepting `as const` arrays must use `readonly T[]`

### Components

- Functional components only (no class components except ErrorBoundary)
- Default exports for most components (LaptopCard, Header, CompareTable)
- Named exports where noted (Footer: `export const Footer`)
- Components using recharts, framer-motion, or browser APIs must have `"use client"` directive
- `useSearchParams()` requires a `<Suspense>` boundary wrapping the component

### Styling

- IBM Carbon Design System dark theme via custom CSS classes
- Use `.carbon-card`, `.carbon-btn`, `.carbon-btn-ghost`, `.carbon-input`, `.carbon-select`, `.carbon-chip` for structural elements
- Tailwind for utility styling; Carbon classes for layout structure
- `ScoreBar` color prop takes raw hex values (e.g. `"#0f62fe"`), NOT CSS variables

### Data Files

- All data arrays use `as const` assertions
- Seed price IDs are sequential strings (`sp-1` through `sp-205`) — check the last ID before adding
- Data files are keyed by `laptopId` or hardware name (CPU/GPU string)
- New fields on the `Laptop` interface must be optional (`?`) unless you update all 98+ models

## Adding Data

Data contributions are the most common and most valuable. Follow the order below — later files depend on earlier ones.

### Adding a New Laptop Model

This touches up to 8 files. Always follow this order:

1. **`data/cpu-benchmarks.ts`** — Add CPU benchmark scores if the processor is new
   - Provide `single`, `multi`, and `composite` scores (0–100 scale)
   - Check existing entries for similar-generation CPUs as reference

2. **`data/gpu-benchmarks.ts`** — Add GPU benchmark if new (discrete GPUs only need this if not already present)
   - Include `score`, `gamingTier`, and `fpsEstimates` for common titles

3. **`data/laptops.ts`** — Add the model entry
   - Use the correct `lineup` (`"ThinkPad" | "IdeaPad Pro" | "Legion"`)
   - Assign the correct `series` for the lineup
   - `laptopId` format: `{model}-gen{N}-{platform}` (e.g. `t14-gen6-intel`). Omit platform suffix for single-platform models
   - `psrefUrl` is required — follow the pattern: `https://psref.lenovo.com/Product/{Lineup}/Lenovo_{Lineup}_{Model}_{MachineType}`
   - The array ends with `] as const;` — insert before the closing bracket

4. **`data/linux-compat.ts`** — Add Linux compatibility data
   - Include certification status, supported distros, kernel version, driver notes

5. **`data/model-editorial.ts`** — Add curated editorial
   - Brief analysis of the model's strengths, positioning, and target audience

6. **`data/seed-prices.ts`** — Add seed prices
   - Use the next sequential `sp-{N}` ID
   - Prices in CHF with `priceType` and optional `note`

7. **`data/price-baselines.ts`** — Add price baselines
   - MSRP, typical retail, and historical low if known

8. **`data/hardware-guide.ts`** — Add hardware guide entries for new CPUs/GPUs
   - Summary, strengths, weaknesses, bestFor, thermalNotes, alternatives

**Verify**: Run `npm run build` after all additions.

### Adding CPU Benchmarks

Edit `data/cpu-benchmarks.ts`:

- Add to both `cpuBenchmarks` (composite only) and `cpuBenchmarksExpanded` (full detail)
- Scores are 0–100, derived from publicly available aggregate data
- Include `single`, `multi`, and `composite` scores in the expanded entry
- The CPU name string must match exactly what's used in `data/laptops.ts` model entries

### Adding GPU Benchmarks

Edit `data/gpu-benchmarks.ts`:

- Include `score` (0–100), `gamingTier`, and `fpsEstimates` object
- Integrated GPUs (Intel Iris Xe, AMD Radeon) typically score 8–40
- Discrete GPUs (RTX 3060–5080 Laptop) typically score 55–92
- FPS estimates should cover common game titles at 1080p medium/high

### Adding Linux Compatibility

Edit `data/linux-compat.ts`:

- Key by `laptopId`
- Include `status` (`"certified" | "community"`), `certifiedDistros`, `kernelVersion`, `driverNotes`

### Adding Editorial Entries

Edit `data/model-editorial.ts`:

- Key by `laptopId`
- Provide `summary`, `strengths`, `considerations`, and `verdict`

### Adding Seed Prices

Edit `data/seed-prices.ts`:

- Use the next sequential ID (check the last entry)
- Include `laptopId`, `price` (number in CHF), `retailer`, `priceType`, optional `note`
- Valid retailers are defined in `lib/constants.ts`

## Code Contributions

### Branch Naming

- `feat/description` for new features
- `fix/description` for bug fixes
- `data/description` for data additions
- `docs/description` for documentation

### PR Expectations

- Run `npm run build` before submitting — it must pass
- If your PR touches data files, verify cross-references (all laptopIds consistent across files)
- Include screenshots for UI changes
- Keep PRs focused — one feature or fix per PR

### Auto-Formatting

The project has Prettier and ESLint configured. If you use Claude Code, hooks auto-format on save. Otherwise:

```bash
npx prettier --write .
npm run lint
```

## Known Gotchas

These are collected from real development experience:

- **Stale `.next` cache**: After deleting or moving files, run `rm -rf .next` before rebuilding. If `_document` errors persist, also `rm -rf node_modules/.cache`
- **lucide-react name collisions**: Icon names like `Keyboard`, `Monitor`, `Battery` shadow TypeScript interfaces. Use aliases: `import { Keyboard as KeyboardIcon } from "lucide-react"`
- **recharts SSR**: recharts components fail during SSR/prerendering — they must be in `"use client"` files
- **RadarChart overflow**: Long axis labels overflow the container. Use `outerRadius="60%"` with generous margins
- **ScoreBar colors**: Must be raw hex values (`"#0f62fe"`), not CSS variables. `var(--accent)90` creates invalid CSS when the hex opacity suffix is appended
- **`npm start` CSS**: Standalone mode doesn't serve CSS properly. Use `npm run dev` for visual testing
- **`as const` arrays**: `data/laptops.ts` ends with `] as const;` — insert new models before the closing bracket
- **Optional fields**: New fields on `Laptop` must be optional (`?`) unless you update all 98+ models
- **Icon `size` prop**: lucide-react `size` is `string | number`, not just `number`
- **Export styles**: Footer uses named export, Header uses default export — check existing patterns

## Getting Help

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- For questions about the data model or scoring, see the [README](README.md)
