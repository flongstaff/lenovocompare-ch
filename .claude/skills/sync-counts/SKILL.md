---
name: sync-counts
description: Update model, CPU, and GPU counts across all documentation files
---

# Sync Documentation Counts

Automatically update model/CPU/GPU/lineup counts in all text-bearing files to match actual data.

## Workflow

1. **Count current data**:

   ```bash
   # Model count by lineup
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

   # CPU count
   cpus=$(grep -c '^\s*"' data/cpu-benchmarks.ts | head -1)

   # GPU count
   gpus=$(grep -c '^\s*"' data/gpu-benchmarks.ts | head -1)

   echo "Models: $total ($thinkpad ThinkPad + $ideapad IdeaPad Pro + $legion Legion + $yoga Yoga)"
   echo "Lineups: $lineups | CPUs: ~$cpus | GPUs: ~$gpus"
   ```

2. **Scan all files** for count references AND lineup name lists:

   Files to check:
   - `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`
   - `package.json` (description field)
   - `app/layout.tsx`, `app/page.tsx`, `app/compare/page.tsx`, `app/deals/page.tsx`, `app/pricing/page.tsx`
   - `app/HomeClient.tsx` (hero stats: model count + lineup count)
   - `app/not-found.tsx`, `app/opengraph-image.tsx`
   - `app/hardware/HardwareClient.tsx`
   - `components/layout/Footer.tsx`

   Also grep for lineup name lists that are missing a lineup:

   ```bash
   grep -rn 'ThinkPad.*IdeaPad.*Legion' --include='*.md' --include='*.tsx' --include='*.ts' --include='*.json' . | grep -v 'Yoga' | grep -v node_modules | grep -v .next
   ```

3. **Update each file**:
   - Replace `N+ models` patterns with current count (use `N+` format, e.g., `124+ models`)
   - Replace lineup count values (e.g., `value: 3` → `value: 4` in HomeClient hero stats)
   - Replace lineup breakdowns (e.g., `76 ThinkPad + 14 IdeaPad Pro + 18 Legion + 16 Yoga`)
   - Replace CPU/GPU counts (e.g., `80+ CPUs`, `28+ GPUs`)
   - Add missing lineup names to lineup lists (e.g., add "Yoga" to "ThinkPad, IdeaPad Pro, and Legion")
   - Keep the `+` suffix to allow for minor additions between syncs

4. **Verify** no broken formatting:

   ```bash
   npx prettier --check README.md CONTRIBUTING.md CLAUDE.md
   ```

5. **Report** what changed and what stayed the same.

## Rules

- Only update numeric counts and lineup name lists — never change surrounding prose
- Use `N+` format (round down to nearest multiple of 5 or 10 for clean numbers)
- If a count hasn't changed, skip that file
- Lineup order is always: ThinkPad, IdeaPad Pro, Legion, Yoga
- Show a diff summary of what was updated
