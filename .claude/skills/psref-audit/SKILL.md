---
name: psref-audit
description: Audit all PSREF URLs for resolution, processor config completeness, and URL/name consistency
disable-model-invocation: true
---

# PSREF Audit

Validate all laptop models' PSREF URLs and compare processor configurations against live PSREF pages.

## Usage

```
/psref-audit                    # Full audit (URL check + config comparison)
/psref-audit --urls-only        # Just validate URLs resolve
/psref-audit --configs          # Just compare processor configs
/psref-audit --model <id>       # Audit a single model
```

## Prerequisites

- Playwright MCP server must be running (for live PSREF page fetching)
- Dev server not required (data-only audit)

## Workflow

### Phase 1: URL Validation

1. Read `data/laptops.ts` and extract all `psrefUrl` values with their model IDs
2. Validate URL format by lineup:
   - **ThinkPad**: Must match `Product/ThinkPad/Lenovo_ThinkPad_*`
   - **IdeaPad Pro**: Must match `Product/IdeaPad/IdeaPad_Pro_*` (no `Lenovo_` prefix, no "i" in slug)
   - **Legion**: Must match `Product/Legion/Legion_*` (no `Lenovo_` prefix, no "i" in slug for Gen 9+)
3. Cross-check machine type code in URL against `name` field suffix
4. Use Playwright to navigate to each URL and verify it doesn't redirect to PSREF home page

**PSREF loads content dynamically via JavaScript** — `WebFetch` only gets shell HTML. Use Playwright MCP `browser_navigate` + `browser_evaluate` for all page checks.

### Phase 2: Processor Config Comparison

For each model with `processorOptions`, compare against live PSREF data:

1. Navigate to the model's PSREF URL using Playwright
2. Handle cookie consent banner (click "Accept" if present)
3. Click the "Models" tab to reveal processor variants
4. Extract processor list using `browser_evaluate`:

```javascript
// Extract processor names from PSREF Models tab
Array.from(document.querySelectorAll(".tblContent td:first-child, .modelList td:first-child"))
  .map((el) => el.textContent.trim())
  .filter((t) => t.includes("Intel") || t.includes("AMD") || t.includes("Ryzen"));
```

5. Compare extracted processors against our `processorOptions` array
6. Report:
   - CPUs on PSREF but missing from our data
   - CPUs in our data but not on PSREF (possibly discontinued)

### Phase 3: Report

```
=== PSREF Audit Report ===

Models audited:    100
URLs valid:        95/100
URLs redirecting:  3 (likely delisted from PSREF)
URL format issues: 2

Config Comparison:
  Models checked:     45 (with processorOptions)
  Fully matching:     40
  Missing CPUs:       3 models have CPUs on PSREF not in our data
  Extra CPUs:         2 models have CPUs we list but PSREF doesn't

[Details of each issue]
```

### Known PSREF Quirks

- **Cookie consent**: Must dismiss before content loads. Click "Accept" button.
- **Models tab**: Processor variants are hidden behind a "Models" tab click
- **Dynamic loading**: Page content loads via JavaScript — wait for content after navigation
- **Delisted products**: Some older models (e.g., IdeaPad Pro 5 Gen 9 AMD) redirect to PSREF home — this is expected, not an error
- **URL patterns differ by lineup**: ThinkPad uses `Lenovo_` prefix, IdeaPad Pro and Legion do not
- **"i" suffix**: IdeaPad Pro never uses "i" in URL slug. Legion drops "i" for Gen 9+

### Batch Mode

Use the `psref-config-comparator` agent for parallel processing:

```
# Dispatch agents for each model with processorOptions
for each model with processorOptions:
  launch psref-config-comparator agent with model ID
```

This parallelizes PSREF page fetching across multiple browser sessions.

## Resolution

- Missing CPUs → Use `/add-laptop` workflow Step 2 to add CPU benchmarks, then update `processorOptions`
- URL format issues → Fix `psrefUrl` in `data/laptops.ts` using correct patterns above
- Redirecting URLs → Verify product is delisted on PSREF; if so, add comment noting it
