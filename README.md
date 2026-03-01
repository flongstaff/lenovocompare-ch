# LenovoCompare CH

A local-first Swiss-market Lenovo laptop comparison tool covering **124 models** across four lineups: **ThinkPad**, **IdeaPad Pro**, **Legion**, and **Yoga** (2018–2025).

Built with Next.js 14 and a dark IBM Carbon-inspired aesthetic. All specs are hardcoded from public [PSREF](https://psref.lenovo.com) data — no scraping, no external APIs, no tracking.

![Home grid](public/screenshots/home.png)
![Model detail](public/screenshots/detail.png)
![Compare view](public/screenshots/compare.png)

## Features

- **Browse & filter** — Grid of 124 models filterable by lineup (ThinkPad / IdeaPad Pro / Legion / Yoga), series, and sort order
- **Model detail pages** — Full specs, config selector, performance radar, benchmark charts, thermal/battery data, Linux compatibility, editorial analysis
- **Side-by-side compare** — Compare up to 4 models with CPU, GPU, portability, and performance radar charts
- **Swiss pricing** — User-contributed CHF prices stored in localStorage with import/export, seed prices for all models
- **Hardware guide** — Curated CPU and GPU analysis with strengths, weaknesses, thermal notes, and alternatives
- **Scoring system** — Absolute (cross-lineup) scoring across 6 dimensions: Performance, Display, Memory, Connectivity, Portability, Value
- **Upgrade simulator** — RAM/storage upgrade simulation with memory score comparison
- **Gaming analysis** — GPU benchmarks with FPS estimates and gaming tier classification
- **Linux compatibility** — Per-model certification status, supported distros, kernel and driver notes
- **Mobile-friendly** — Swipeable compare cards, responsive grid, touch-optimized filters

## Tech Stack

| Layer      | Technology                                                      |
| ---------- | --------------------------------------------------------------- |
| Framework  | Next.js 14 (App Router)                                         |
| Language   | TypeScript 5                                                    |
| Styling    | Tailwind CSS 3 + IBM Carbon dark theme                          |
| Charts     | recharts                                                        |
| Animations | framer-motion                                                   |
| Icons      | lucide-react                                                    |
| Testing    | Vitest                                                          |
| CI/CD      | GitHub Actions (lint, test, build, CodeQL, GitHub Pages deploy) |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install & Run

```bash
git clone https://github.com/flongstaff/lenovocompare-ch.git
cd lenovocompare-ch
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker

```bash
docker compose up
```

Dev server runs on port 3000.

### Commands

```bash
npm run dev       # Development server
npm run build     # Production build (includes data validation)
npm run lint      # ESLint
npm test          # Vitest unit tests
```

## Project Structure

```
app/                    # Next.js App Router pages
  model/[id]/           #   Model detail page
  compare/              #   Side-by-side comparison
  pricing/              #   Price management
  hardware/             #   CPU/GPU hardware guide
components/
  charts/               # recharts: radar, bar, FPS, thermal, battery
  compare/              # Compare table, mobile cards
  filters/              # Lineup, series, sort filters
  pricing/              # Price input, import/export
  models/               # Model detail components
  ui/                   # Shared UI (ScoreBar, Toast, ErrorBoundary)
  layout/               # Header, Footer
data/
  laptops.ts            # 100 models with full PSREF specs
  cpu-benchmarks.ts     # 80+ CPUs with single/multi/composite scores
  gpu-benchmarks.ts     # 28+ GPUs with gaming tiers and FPS estimates
  model-benchmarks.ts   # Per-model chassis benchmarks (thermals, battery, SSD)
  linux-compat.ts       # Per-model Linux compatibility
  model-editorial.ts    # Curated editorial for all models
  hardware-guide.ts     # CPU/GPU analysis and recommendations
  seed-prices.ts        # ~212 curated Swiss prices in CHF
  price-baselines.ts    # MSRP, retail, and historical price baselines
lib/
  types.ts              # Core interfaces (Laptop, Lineup, SwissPrice, etc.)
  scoring.ts            # Scoring engine (CPU, GPU, display, memory, etc.)
  analysis.ts           # Auto-generated pros/cons, use cases, verdicts
  constants.ts          # App constants, retailers, colors
  hooks/                # Custom React hooks
  retailers.ts          # Swiss retailer URL builders
  formatters.ts         # CHF, weight, date, storage formatters
  filters.ts            # Filter logic
tests/                  # Vitest unit tests
```

## Data Sources

All data comes from publicly available sources. We gratefully acknowledge the original creators:

- **Specifications**: [Lenovo PSREF](https://psref.lenovo.com) — public product reference data
- **CPU benchmarks**: [Cinebench 2024](https://www.maxon.net/en/cinebench) (Maxon) and [Geekbench 6](https://www.geekbench.com) (Primate Labs) — publicly available aggregate scores
- **GPU benchmarks**: [3DMark Time Spy](https://www.3dmark.com) (UL Solutions) — publicly available aggregate scores
- **FPS estimates**: Game titles including Cyberpunk 2077 (CD Projekt Red), CS2 (Valve), and others — approximate FPS from public benchmark databases
- **Chassis benchmarks**: [NotebookCheck](https://www.notebookcheck.net) reviews — thermals, fan noise, battery, display brightness (linked, not scraped)
- **Content creation benchmarks**: [PugetBench](https://www.pugetsystems.com/pugetbench/) (Puget Systems) — Premiere Pro and DaVinci Resolve scores
- **Review data**: [JarrodsTech](https://jarrods.tech) and [JustJosh](https://www.youtube.com/@JustJoshTech) — supplementary benchmark data
- **Linux compatibility**: [Lenovo Linux certification](https://support.lenovo.com/solutions/pd031426), [Ubuntu Certified Hardware](https://ubuntu.com/certified), [Red Hat Ecosystem Catalog](https://catalog.redhat.com), and community reports
- **TDP data**: [Intel ARK](https://ark.intel.com) and [AMD product pages](https://www.amd.com/en/products/specifications/processors)
- **Pricing**: User-contributed via the app's pricing interface

All game titles, benchmark tools, and product names are trademarks of their respective owners. No retailer websites are scraped. Review links are outbound only.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, coding conventions, and data contribution guidelines.

The most impactful contributions are **data additions** — new laptop models, benchmark updates, Linux compatibility notes, and Swiss price data.

## Community

- [Code of Conduct](CODE_OF_CONDUCT.md) — Contributor Covenant v2.1
- [Security Policy](SECURITY.md) — Responsible disclosure process
- [Support](SUPPORT.md) — How to get help and report issues
- [Changelog](CHANGELOG.md) — Release history

## License

[MIT](LICENSE)
