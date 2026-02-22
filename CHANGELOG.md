# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
