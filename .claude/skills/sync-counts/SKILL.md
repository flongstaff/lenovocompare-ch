---
name: sync-counts
description: Update model, CPU, and GPU counts across all documentation files
---

# Sync Documentation Counts

Automatically update model/CPU/GPU counts in README.md, CONTRIBUTING.md, and CLAUDE.md to match actual data.

## Workflow

1. **Count current data**:

   ```bash
   # Model count by lineup
   thinkpad=$(grep -c 'lineup: "ThinkPad"' data/laptops.ts)
   ideapad=$(grep -c 'lineup: "IdeaPad Pro"' data/laptops.ts)
   legion=$(grep -c 'lineup: "Legion"' data/laptops.ts)
   total=$((thinkpad + ideapad + legion))

   # CPU count
   cpus=$(grep -c '^\s*"' data/cpu-benchmarks.ts | head -1)

   # GPU count
   gpus=$(grep -c '^\s*"' data/gpu-benchmarks.ts | head -1)

   echo "Models: $total ($thinkpad ThinkPad + $ideapad IdeaPad Pro + $legion Legion)"
   echo "CPUs: ~$cpus | GPUs: ~$gpus"
   ```

2. **Scan documentation files** for count references:
   - `README.md` — model counts, CPU/GPU counts
   - `CONTRIBUTING.md` — model counts
   - `CLAUDE.md` — model counts in Project Overview and Architecture sections
   - `app/layout.tsx` — metadata description if it contains counts

3. **Update each file**:
   - Replace `N+ models` patterns with current count (use `N+` format, e.g., `98+ models`)
   - Replace lineup breakdowns (e.g., `68 ThinkPad + 14 IdeaPad Pro + 16 Legion`)
   - Replace CPU/GPU counts (e.g., `80+ CPUs`, `28+ GPUs`)
   - Keep the `+` suffix to allow for minor additions between syncs

4. **Verify** no broken formatting:

   ```bash
   npx prettier --check README.md CONTRIBUTING.md CLAUDE.md
   ```

5. **Report** what changed and what stayed the same.

## Rules

- Only update numeric counts — never change surrounding prose
- Use `N+` format (round down to nearest multiple of 5 or 10 for clean numbers)
- If a count hasn't changed, skip that file
- Show a diff summary of what was updated
