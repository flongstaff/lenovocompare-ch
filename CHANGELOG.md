# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-03-14

### Added

- Yoga lineup support across all features (scatter chart colors, shortName formatter, filter series)
- JSON-LD structured data on home page (WebSite + SearchAction) and all 124 model detail pages (Product + BreadcrumbList)
- Content Security Policy headers via meta tags and nginx config
- Skip-to-content accessibility link in layout
- Focus-visible styles for all interactive elements
- Reduced motion support via `prefers-reduced-motion` media query
- ARIA combobox pattern for compare search selector
- Screen reader data tables for all chart components
- Price age badge component showing freshness indicators
- Price validation with CHF range checks and warnings
- Filter count badge on filter button
- Model names displayed in compare floating bar
- Compare button on model detail page
- aria-live region for filter result counts
- Hardware page loading skeleton
- Mobile compare card swipe visual feedback (rotation, opacity, direction hints)
- Pagination for Workers API (LIMIT/OFFSET with MAX_LIMIT=500)
- Remote price validation in useRemotePrices hook
- Module-level score caching in score-context.ts
- E2E tests for compare flow
- Unit tests for hooks (useFilters, useCompare, useLocalStorage, useRemotePrices)
- Unit tests for analysis engine and retailer URL builders
- Scoring edge case tests
- Hardware guide entries for all referenced CPUs/GPUs
- JSDoc comments on all core type definitions
- Lighthouse CI and bundle size tracking in CI workflow
- PR deploy preview workflow
- Service worker for offline support
- Dark/light theme toggle

### Fixed

- OpenGraph image runtime incompatible with static export
- Shell injection vulnerability in price submission workflow
- ESLint 8 → ESLint 9 flat config migration
- Dockerfile serving static `out/` directory via nginx
- Toast missing aria-live announcement
- Collapsible section headers using non-interactive elements
- CI workflow missing permissions block
- Factual error in IdeaPad Pro editorial (wrong CPU reference)
- CompareTable redundant analysis/scoring computations (useMemo)
- Score percentile O(n²) iteration (module-level cache)
- Scoring logic duplication (breakdown delegates to score functions)
- Value score now uses all 6 performance dimensions
- Scenario scores clamped to 0-100
- Glass-bar CSS class defined in globals.css
- SHA-pinned GitHub Actions (deploy, dependabot)
- Stale model counts across documentation
- Unsafe type casts in useRemotePrices (runtime validation)
- Conflicting public/robots.txt removed (app/robots.ts canonical)
- ScoreBar title tooltip documenting score caps
- MobileCompareCards using pre-computed useMemo maps instead of per-render calls
- Remote price cache with 15-minute TTL

### Changed

- recharts components migrated to pure SVG (bundle size reduction)
- Scoring engine split into tree-shakeable modules
- Compare/model meta descriptions now dynamic per page

## [0.2.0] - 2025-12-01

### Added

- IdeaPad Pro lineup (14 models: Pro 5, Pro 5i, Pro 7)
- Legion lineup (18 models: 5, 5i, 7, 7i, Pro, Slim)
- GPU benchmarks database (28+ GPUs: integrated + discrete RTX 3060–5080 Laptop)
- Per-model chassis benchmarks (thermals, fan noise, battery, SSD, display brightness)
- Gaming analysis section with FPS estimates and gaming tier classification
- Hardware guide with curated CPU/GPU analysis
- Linux compatibility data for all models
- Model editorial entries for all models
- Seed prices (~205 curated Swiss prices in CHF)
- Price baselines (MSRP, typical retail, historical low)
- Upgrade simulator with memory score comparison
- Config selector for multi-config models
- Performance radar chart and benchmark bar charts
- Content creation benchmarks (PugetBench Premiere/DaVinci)
- Mobile-friendly swipeable compare cards
- Vitest unit test suite
- GitHub Actions CI/CD (lint, test, build, CodeQL, deploy)
- Dependabot for automated dependency updates

### Changed

- Renamed from ThinkCompare to LenovoCompare (covers all lineups)
- Core type renamed from `ThinkPad` to `Laptop` (alias preserved)
- localStorage keys migrated from `thinkcompare-*` to `lenovocompare-*`
- Scoring system changed to absolute (cross-lineup) rather than per-lineup normalized
- Data files use `laptopId` instead of `thinkpadId`

## [0.1.0] - 2025-06-01

### Added

- Initial release with ThinkPad lineup (68 models, 2018–2025)
- Browse and filter grid with series filter
- Model detail pages with full PSREF specs
- Side-by-side comparison (up to 4 models)
- Swiss pricing with localStorage persistence and import/export
- CPU benchmark scoring (Cinebench 2024 + Geekbench 6)
- Display, memory, connectivity, portability scoring
- IBM Carbon dark theme
- Static export for GitHub Pages deployment
