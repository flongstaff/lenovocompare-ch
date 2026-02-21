---
name: psref-audit
description: Validate PSREF URL coverage and search fallback quality for all models
---

# PSREF Audit

Validates that every model in `data/laptops.ts` has a working PSREF search fallback via `getPsrefSearchUrl` in `lib/retailers.ts`.

## What to Check

1. **Coverage**: Every model must have a non-empty `psrefUrl`
2. **Search keyword quality**: `getPsrefSearchUrl` must resolve to a clean keyword (no parentheses, not overly long)
3. **Extraction strategy distribution**: Report how many models use each strategy:
   - MT query param (`?MT=XXXX`) — best for ThinkPads
   - Name suffix (`\d{2}[A-Z]{2,4}\d{1,2}[A-Z]?$`) — IdeaPad Pro / Legion
   - URL path extraction (`/Product/.../Name_Here`) — ThinkPads without MT
   - Full name fallback — should be 0 (flag as warning)

## Procedure

1. Read `data/laptops.ts` to get all models
2. Read `lib/retailers.ts` to understand `getPsrefSearchUrl` logic
3. For each model, determine which extraction strategy is used and the resulting keyword
4. Report:
   - Total models and per-lineup counts
   - Strategy distribution (MT / suffix / path / fallback)
   - Any models hitting full-name fallback (these need attention)
   - Any models missing `psrefUrl` entirely
   - Any search keywords containing parentheses or exceeding 40 characters
5. If issues found, suggest fixes (add MT param to URL, fix name suffix pattern, etc.)

## Expected Output

```
PSREF Audit Results
───────────────────
Total: 97 models (68 ThinkPad, 14 IdeaPad Pro, 15 Legion)

Strategy Coverage:
  MT param:     23 (all ThinkPad)
  Name suffix:  29 (14 IdeaPad Pro + 15 Legion)
  URL path:     45 (all ThinkPad)
  Fallback:     0

Issues: None
```

## When to Run

- After `/add-laptop` to verify new model has proper PSREF coverage
- After modifying `getPsrefSearchUrl` extraction logic
- After bulk data imports or model year additions
