# LenovoCompare CH

Swiss-market Lenovo laptop comparison tool — 124+ models across ThinkPad, IdeaPad Pro, Legion, and Yoga with scoring, pricing, and hardware analysis.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI**: React, Framer Motion, Lucide React, Recharts
- **Styling**: CSS/Tailwind

## Commands

```bash
npm run dev              # Dev server
npm run build            # Production build
npm run lint             # ESLint
npm run validate         # Data validation
npm run scrape-psref     # Scrape PSREF data
npm run generate-prices  # Generate price data
npm run fetch-ope-prices # Fetch OPE prices
```

## Architecture

- `app/` — Next.js app router pages (compare, deals, hardware, model)
- `app/compare/` — Main comparison interface
- `app/deals/` — Deal tracking
- `app/hardware/` — Hardware analysis pages
- `app/model/` — Individual model detail pages

## Conventions

- Functional components with arrow functions
- PascalCase for components, camelCase for functions
- Data scraped from PSREF and validated before use
- Check project agents in `.claude/agents/` for specialized tasks

## RPI Workflow

Use `/rpi:research` → `/rpi:plan` → `/rpi:implement` for non-trivial features.

- **Verify**: `npm test && npm run validate && npm run build`
- **Agents**: fullstack-feature-builder (UI+data), pricing-verifier (price data)
- **Output**: `rpi/[feature-slug]/` (gitignored)

Output style: concise
