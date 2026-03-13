# Data & Model Gotchas

- New fields on `Laptop` interface must be optional (`?`) unless you update all models — `psrefUrl` is the only required non-optional field added post-launch
- PSREF URL pattern: ThinkPad uses `Product/ThinkPad/Lenovo_ThinkPad_{Model}_{MachineType}`. IdeaPad Pro uses `Product/IdeaPad/IdeaPad_Pro_{Model}_{MachineType}` (no `Lenovo_` prefix, drop "i" from slug). Legion uses `Product/Legion/Legion_{Model}_{MachineType}` (no `Lenovo_` prefix, drop "i" from slug for Gen 9+). Spaces → underscores, no Intel/AMD suffix in URL
- Model IDs use platform suffixes: `t14-gen5-intel`, `t14s-gen5-amd` — omit suffix only for single-platform models (e.g., `p1-gen7`)
- `laptops.ts` array ends with `] as const;` (not `];`) — use `Read` on last 5 lines to find insertion point for new models
- Use `laptops.ts` and `laptopId` in new/updated skill/agent files (not deprecated `thinkpads.ts`/`thinkpadId`). Run `/stale-ref-check` to audit
- Content filter may block Code of Conduct text — reference Contributor Covenant by URL link instead of embedding full policy text
- Community health files: `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `CHANGELOG.md`, `.github/FUNDING.yml` — keep version in SECURITY.md synced with `package.json`
- When adding a new lineup or series, update `VALID_LINEUPS` and `VALID_SERIES` in `lib/hooks/useFilters.ts` and `SERIES_DESCRIPTIONS` in `lib/analysis.ts` — without this, filter selections silently drop on URL deserialization
