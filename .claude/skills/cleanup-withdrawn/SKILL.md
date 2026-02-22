---
name: cleanup-withdrawn
description: Check all PSREF URLs for newly withdrawn models and update the scraper's skip list
disable-model-invocation: true
---

# Cleanup Withdrawn Models

Check all `psrefUrl` values in `data/laptops.ts` against PSREF to identify newly withdrawn or broken models, then update the `WITHDRAWN_IDS` set in `scripts/scrape-psref.ts`.

## Workflow

### Step 1: Check all PSREF URLs

Run HEAD requests against every `psrefUrl` to detect:
- **WDProduct redirects** — model withdrawn from PSREF
- **Homepage redirects** — URL invalid (may need fixing, not necessarily withdrawn)
- **Timeouts** — PSREF SPA issues (not withdrawn)

```bash
# Quick URL check (curl-based, no Playwright needed)
grep -oE 'psrefUrl: "https://psref\.lenovo\.com[^"]+' data/laptops.ts | \
  sed 's/psrefUrl: "//' | while IFS= read -r url; do
    status=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "$url" 2>/dev/null)
    final=$(curl -s -o /dev/null -w "%{url_effective}" -L --max-time 10 "$url" 2>/dev/null)
    if echo "$final" | grep -q "WDProduct"; then
      echo "WITHDRAWN: $url"
    elif [ "$status" != "200" ] || echo "$final" | grep -q "psref.lenovo.com/$"; then
      echo "BROKEN ($status): $url → $final"
    fi
  done
```

### Step 2: Cross-reference with WITHDRAWN_IDS

Compare discovered withdrawn models against the current `WITHDRAWN_IDS` set in `scripts/scrape-psref.ts`.

### Step 3: Update the skip list

Add newly-withdrawn model IDs to `WITHDRAWN_IDS` in `scripts/scrape-psref.ts`, grouped by lineup with comments.

### Step 4: Verify

```bash
npx tsc --noEmit scripts/scrape-psref.ts
```

## Notes

- Withdrawn models are normal — Lenovo retires older products from PSREF regularly
- Don't remove models from `data/laptops.ts` — they're still valid products, just no longer on PSREF
- The weekly CI check (`.github/workflows/psref-check.yml`) also monitors URL health
