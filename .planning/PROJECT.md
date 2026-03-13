# LenovoCompare CH — v2 Milestone

## What This Is

A comprehensive Swiss-market Lenovo laptop comparison tool covering 124+ models across ThinkPad, IdeaPad Pro, Legion, and Yoga lineups (2018-2025). Helps personal buyers, Swiss tech buyers, and IT procurement teams compare laptops with real benchmark data, automated pricing, and deep technical analysis. Dark IBM Carbon-inspired aesthetic, built with Next.js.

## Core Value

When someone in Switzerland needs to compare Lenovo laptops, this tool gives them the clearest, most data-driven answer — with real prices, real benchmarks, and real differences explained.

## Requirements

### Validated

<!-- Shipped and confirmed valuable — existing in current codebase. -->

- ✓ Browse and filter 124+ models across 4 lineups (ThinkPad, IdeaPad Pro, Legion, Yoga) — v1
- ✓ 6-dimension scoring engine (CPU, GPU, Display, Memory, Connectivity, Portability) — v1
- ✓ Side-by-side comparison of 2-4 models with radar + dimension charts — v1
- ✓ Model detail pages with specs, scores, benchmarks, analysis, editorial — v1
- ✓ ConfigSelector for what-if scoring (swap CPU/GPU/RAM/display) — v1
- ✓ User-contributed pricing via localStorage with seed price baseline — v1
- ✓ Auto-generated pros/cons, use cases, upgrade paths, gaming tier — v1
- ✓ CPU/GPU benchmark data with Cinebench, Geekbench, Time Spy scores — v1
- ✓ Per-model thermal, battery, fan noise, SSD speed data — v1
- ✓ Linux compatibility data for all 124 models — v1
- ✓ Hardware guide with curated CPU/GPU analysis — v1
- ✓ Deals page with buy signals (buy-now, good-deal, hold, wait) — v1
- ✓ Swiss retailer search links (Digitec, Brack, Toppreise, Ricardo, Tutti) — v1
- ✓ Mobile-responsive compare with swipeable cards — v1
- ✓ Dark Carbon Design System theme — v1
- ✓ Static export to GitHub Pages — v1

### Active

<!-- Current scope. Building toward these. -->

- [ ] Automated weekly price fetching from legal free sources (Lenovo.com/ch, Toppreise.ch, Google Shopping)
- [ ] Community price submissions preserved alongside automated data
- [ ] Cloudflare Workers backend for price aggregation (free tier)
- [ ] Specs diff highlighting — show exactly what's different between compared models
- [ ] Visual weight/size comparison overlay — physical dimensions and port layout
- [ ] Scenario-based recommendations ("Best for dev work", "Best for students", "Best portable")
- [ ] Total cost of ownership calculator (price + warranty + dock/accessories + upgrades over 3-5 years)
- [ ] Full UX/UI overhaul — visual polish, spacing, typography, animations
- [ ] Navigation & flow improvement — fewer clicks, better compare workflow
- [ ] Information density optimization — scannable cards, progressive disclosure
- [ ] Mobile UX improvement across all pages
- [ ] Enhanced real-world benchmark data with verified sources and citations
- [ ] Thermal/noise deep profiles — sustained vs peak performance, throttling curves
- [ ] Repairability & upgrade info — RAM slots, SSD type, teardown difficulty, parts availability
- [ ] Display deep-dive — color accuracy (Delta E), measured brightness, response time, PWM flicker data
- [ ] Cloudflare deployment setup (domain, Workers, Pages)

### Out of Scope

<!-- Explicit boundaries. -->

- Web scraping of retailers — legal/TOS risk
- User accounts or authentication — keep it simple and local-first
- Non-Lenovo brands — stay focused on the Lenovo Swiss niche
- Mobile native app — web-first, responsive design covers mobile
- Real-time price alerts or push notifications — weekly batch is sufficient
- AI/LLM-generated analysis — keep scoring deterministic and transparent

## Context

- Currently deployed as static site on GitHub Pages at `flongstaff.github.io/lenovocompare-ch`
- 124 models across 4 lineups with complete PSREF specs, benchmarks, editorial, Linux compat
- Scoring is absolute (not per-lineup normalized) — designed for cross-lineup comparison
- All data currently hardcoded as TypeScript constants in `data/` directory
- Price data: 205 curated seed prices + user localStorage contributions
- recharts used for charts (~324 KB bundle cost) — consider optimizing
- CI: GitHub Actions for lint + test + build + deploy + CodeQL
- User has Cloudflare account but nothing configured yet for this project
- Swiss market focus: CHF currency, de-CH locale, Swiss retailers only

## Constraints

- **Legal**: No retailer scraping — must use public APIs, official product pages, or price comparison feeds
- **Budget**: Free tier only — Cloudflare Workers free plan, no paid APIs
- **Stack**: Next.js + TypeScript + Tailwind — maintain current stack, add Cloudflare Workers for backend
- **Data integrity**: All benchmark data must cite sources (NotebookCheck, Geekbench, community measurements)
- **Performance**: Bundle size must not regress significantly — optimize where possible
- **Accessibility**: Maintain WCAG compliance across all new features

## Key Decisions

| Decision                             | Rationale                                                              | Outcome   |
| ------------------------------------ | ---------------------------------------------------------------------- | --------- |
| Cloudflare Workers for price backend | Free tier, user has account, no server management                      | — Pending |
| Keep deterministic scoring (no AI)   | Transparency and reproducibility matter for trust                      | ✓ Good    |
| Legal-only price sources             | TOS compliance, long-term sustainability                               | — Pending |
| Full UX overhaul (not incremental)   | All audiences need polish — personal buyers, IT procurement, portfolio | — Pending |
| Static + serverless hybrid           | Keep fast static pages, add Workers only for price aggregation         | — Pending |

---

_Last updated: 2026-03-13 after initialization_
