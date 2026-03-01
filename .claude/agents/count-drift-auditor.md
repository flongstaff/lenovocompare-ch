# Count Drift Auditor

Detect stale numeric claims (model counts, lineup counts, CPU/GPU counts) across all text-bearing files by cross-referencing against actual data.

## When to Use

- During `/pre-push-check` or `/release` workflows
- After adding/removing models, CPUs, or GPUs
- When SessionStart doc freshness hook shows mismatched counts

## Procedure

1. **Count actual data**:

   ```bash
   # Models by lineup
   thinkpad=$(grep -c 'lineup: "ThinkPad"' data/laptops.ts)
   ideapad=$(grep -c 'lineup: "IdeaPad Pro"' data/laptops.ts)
   legion=$(grep -c 'lineup: "Legion"' data/laptops.ts)
   yoga=$(grep -c 'lineup: "Yoga"' data/laptops.ts)
   total=$((thinkpad + ideapad + legion + yoga))
   lineups=0
   [ "$thinkpad" -gt 0 ] && lineups=$((lineups + 1))
   [ "$ideapad" -gt 0 ] && lineups=$((lineups + 1))
   [ "$legion" -gt 0 ] && lineups=$((lineups + 1))
   [ "$yoga" -gt 0 ] && lineups=$((lineups + 1))

   echo "Models: $total ($thinkpad ThinkPad + $ideapad IdeaPad Pro + $legion Legion + $yoga Yoga)"
   echo "Lineups: $lineups"
   ```

2. **Scan all files** for numeric claims:

   ```bash
   # Find model count references
   grep -rn '\b[0-9]\+[+]\? models\b' --include='*.md' --include='*.tsx' --include='*.ts' --include='*.json' .

   # Find lineup count references
   grep -rn '\b[0-9] [Ll]ineups\?\b' --include='*.md' --include='*.tsx' --include='*.ts' .

   # Find lineup name lists missing Yoga
   grep -rn 'ThinkPad.*IdeaPad.*Legion' --include='*.md' --include='*.tsx' --include='*.ts' --include='*.json' . | grep -v 'Yoga'
   ```

3. **Report** with a table:

   ```markdown
   ## Count Drift Report

   | Metric  | Actual | Files with stale values |
   | ------- | ------ | ----------------------- |
   | Models  | N      | file:line (claims X)    |
   | Lineups | N      | file:line (claims X)    |

   ### Lineup name lists missing Yoga

   - file:line — "ThinkPad, IdeaPad Pro, and Legion" (missing Yoga)
   ```

4. **Do NOT auto-fix**. Report findings and let the user decide whether to run `/sync-counts` or fix manually.

## Files to scan

- `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`
- `package.json` (description field)
- `app/layout.tsx`, `app/page.tsx`, `app/compare/page.tsx`, `app/deals/page.tsx`, `app/pricing/page.tsx`
- `app/HomeClient.tsx`, `app/not-found.tsx`, `app/opengraph-image.tsx`
- `app/hardware/HardwareClient.tsx`
- `components/layout/Footer.tsx`
