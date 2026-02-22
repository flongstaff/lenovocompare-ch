# PSREF Config Comparator

Compare a laptop model's processor configurations against its live PSREF page.

## Input

You will receive a **model ID** (e.g., `t14s-gen6-intel`, `ideapad-pro-5i-16-gen10`).

## Process

### 1. Load Model Data

Read `data/laptops.ts` and find the model by ID. Extract:

- `name` — display name
- `psrefUrl` — PSREF page URL
- `processor.name` — default processor
- `processorOptions` — array of alternative CPUs (if any)
- `lineup` — ThinkPad / IdeaPad Pro / Legion

### 2. Validate PSREF URL Format

Check URL matches correct pattern for lineup:

- **ThinkPad**: `Product/ThinkPad/Lenovo_ThinkPad_*`
- **IdeaPad Pro**: `Product/IdeaPad/IdeaPad_Pro_*` (no `Lenovo_` prefix, no "i" in slug)
- **Legion**: `Product/Legion/Legion_*` (no `Lenovo_` prefix, no "i" in slug for Gen 9+)

Cross-check: extract machine type code from URL path (e.g., `IMH9`, `AKP10`, `21JS`) and verify it appears in the model `name`.

### 3. Fetch Live PSREF Page

Use Playwright MCP to navigate to the PSREF URL:

1. `browser_navigate` to the psrefUrl
2. Check if page redirected to PSREF home (`https://psref.lenovo.com/`) — if so, report as "delisted"
3. Dismiss cookie consent if present (click "Accept" button)
4. Click the "Models" tab to reveal processor variants
5. Extract processor list using `browser_evaluate`:

```javascript
Array.from(document.querySelectorAll("table tr td:first-child"))
  .map((el) => el.textContent.trim())
  .filter((t) => /Intel|AMD|Ryzen|Qualcomm/i.test(t));
```

### 4. Compare Configurations

Build a diff between our data and PSREF:

**Our CPUs**: default `processor.name` + all `processorOptions[].name`

**PSREF CPUs**: extracted from live page

Report:

- CPUs in both (matched)
- CPUs on PSREF but missing from our data
- CPUs in our data but not on PSREF

### 5. Output

```
Model: ThinkPad T14s Gen 6 Intel (t14s-gen6-intel)
URL:   https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_T14s_Gen_6_21NS
Status: URL valid, page loads

Processor Comparison:
  Our data:  12 CPUs
  PSREF:     14 CPUs
  Matched:   12
  Missing:   2 (Intel Core Ultra 5 225H, Intel Core Ultra 5 235H)
  Extra:     0

URL Format: ✅ Valid
Name/Slug:  ✅ Machine type "21NS" matches
```

## Important Notes

- PSREF loads content dynamically — `WebFetch` won't work, must use Playwright
- Cookie consent banner blocks content on first visit
- Some models may be delisted (redirect to PSREF home) — report but don't treat as error
- Processor names on PSREF may differ slightly (e.g., "Intel Core Ultra 7 265H vPro" vs "Intel Core Ultra 7 265H") — fuzzy match on core name
- For models without `processorOptions`, just verify the default `processor.name` appears on PSREF
