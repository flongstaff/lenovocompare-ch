---
name: github-prep
description: Full pre-publication audit — security, docs freshness, code readability, data completeness, build verification, and stale references
disable-model-invocation: true
---

# GitHub Release Preparation

Run all pre-publication checks before pushing to GitHub. Produces a single pass/fail report across 6 phases.

## Arguments

- `--fix` (optional): Auto-fix issues where possible (update counts, add missing JSDoc). Default: report only.
- `--skip-build` (optional): Skip the build verification phase (useful if build was just run).

## Phase 1: Security Audit

### 1a. .gitignore Coverage

Verify `.gitignore` includes:

```
.env
.env.*
*.key
*.pem
.mcp.json
.claude/settings.local.json
.claude/.DS_Store
```

Flag any missing entries.

### 1b. Tracked Sensitive Files

```bash
git ls-files | grep -iE '\.(env|pem|key|secret)'
git ls-files | grep -iE 'credentials|\.mcp\.json'
```

Flag any matches — these should NOT be tracked.

### 1c. Hardcoded Paths

```bash
grep -rn '/Users/' lib/ app/ components/ data/ --include='*.ts' --include='*.tsx' 2>/dev/null | grep -v node_modules | grep -v '.next'
```

Flag any hardcoded user paths in source code (settings files are OK).

## Phase 2: Documentation Freshness

### 2a. Model Counts

Count actual models in `data/laptops.ts`:

```bash
grep -c 'laptopId:' data/laptops.ts        # total
grep -c 'lineup: "ThinkPad"' data/laptops.ts
grep -c 'lineup: "IdeaPad Pro"' data/laptops.ts
grep -c 'lineup: "Legion"' data/laptops.ts
```

Compare against claims in:

- `README.md` (features section, scoring section, data model section)
- `CONTRIBUTING.md` (data files section)
- `app/layout.tsx` (metadata description)
- `app/opengraph-image.tsx` (model count display)
- `package.json` (description field)

Flag any mismatches.

### 2b. CPU/GPU Counts

Count entries in `data/cpu-benchmarks.ts` and `data/gpu-benchmarks.ts`. Compare against README hardware guide description.

### 2c. Seed Price Count

Count entries in `data/seed-prices.ts`. Compare against claims in README/CONTRIBUTING.

### 2d. Stale URLs

```bash
grep -rn 'YOUR_USERNAME\|YOUR_REPO\|example\.com' README.md CONTRIBUTING.md package.json 2>/dev/null
```

Flag any placeholder URLs.

### 2e. TODO Comments in Docs

```bash
grep -n 'TODO\|FIXME\|HACK\|XXX' README.md CONTRIBUTING.md 2>/dev/null
```

Flag any remaining TODO comments in public-facing docs.

### 2f. Project Structure Tree

Verify every path listed in README.md "Project Structure" section actually exists. Flag missing paths and significant directories not listed.

## Phase 3: Code Readability Audit

### 3a. Module-Level JSDoc

Check for JSDoc comment at the top of each file (before or after imports):

**Must have JSDoc:**

- All `lib/*.ts` files
- All `lib/hooks/*.ts` files
- `data/laptops.ts`, `data/model-editorial.ts`

**Nice to have (don't flag as error):**

- Other `data/*.ts` files
- `components/**/*.tsx` files

Report files missing module-level JSDoc.

### 3b. Scoring Magic Numbers

Read `lib/scoring.ts` and verify these functions have inline comments explaining their constants:

- `getValueScore` — scaling factor
- `getPortabilityScore` — weight floor, sensitivity, battery ceiling
- `getDisplayScore` — point breakdown in JSDoc
- `getConnectivityScore` — point budget in JSDoc
- `getMemoryScore` — tier breakdown in JSDoc

### 3c. ScoreBar Color Constraint

Verify `components/ui/ScoreBar.tsx` has a comment warning about hex-only color values.

### 3d. AI Comment Patterns

```bash
grep -rn 'TODO: implement\|as an AI\|I cannot\|I apologize\|Here is\|This function' lib/ app/ components/ --include='*.ts' --include='*.tsx' 2>/dev/null | grep -v node_modules
```

Flag any AI-generated boilerplate comments.

## Phase 4: Data Completeness

Delegate to existing checks. For each, read the source files and cross-reference:

### 4a. CPU Coverage

Every `processor.name` in `data/laptops.ts` (including `processorOptions`) must exist in:

- `data/cpu-benchmarks.ts` (`cpuBenchmarksExpanded`)
- `data/hardware-guide.ts` (`cpuGuide`)

### 4b. GPU Coverage

Every `gpu.name` in `data/laptops.ts` (including `gpuOptions`) must exist in:

- `data/gpu-benchmarks.ts` (`gpuBenchmarks`)
- `data/hardware-guide.ts` (`gpuGuide`)

### 4c. Per-Model Files

Every model ID in `data/laptops.ts` must have entries in:

- `data/linux-compat.ts`
- `data/model-editorial.ts`
- `data/seed-prices.ts` (at least 1 price)
- `data/price-baselines.ts`
- `data/model-benchmarks.ts` (optional — coverage tracked but not required)

### 4d. Orphaned Entries

Check for entries in data files that reference model IDs not in `data/laptops.ts`.

## Phase 5: Build Verification

Unless `--skip-build` is passed:

```bash
rm -rf .next && npm run build
```

- Must compile with zero errors
- Verify all expected routes present: `/`, `/compare`, `/pricing`, `/hardware`, `/model/[id]`, `/sitemap.xml`
- Flag any page over 250 kB First Load JS

## Phase 6: Stale Reference Scan

### 6a. Deprecated Names in .claude/

```bash
grep -rn 'thinkpads\.ts\|thinkpadId\b' .claude/skills/ .claude/agents/ 2>/dev/null
grep -rn 'data/thinkpads' .claude/skills/ .claude/agents/ 2>/dev/null
```

Flag any references to pre-rebrand names.

### 6b. Dead File References

```bash
grep -rohE '(data|lib|components|app)/[a-zA-Z0-9/_.-]+\.ts[x]?' .claude/skills/ .claude/agents/ 2>/dev/null | sort -u | while read f; do
  [ ! -f "$f" ] && echo "MISSING: $f"
done
```

## Output Format

```
═══════════════════════════════════════════
  GitHub Preparation Report
═══════════════════════════════════════════

Phase 1 — Security:         ✅ PASS / ❌ FAIL
  .gitignore coverage:      [status]
  Tracked secrets:          [status]
  Hardcoded paths:          [status]

Phase 2 — Documentation:    ✅ PASS / ❌ FAIL
  Model counts:             [actual] models ([breakdown])
  README accuracy:          [status]
  CONTRIBUTING accuracy:    [status]
  Stale URLs:               [status]
  TODO comments:            [status]

Phase 3 — Code Readability: ✅ PASS / ❌ FAIL
  Module JSDoc:             [X/Y] files covered
  Scoring comments:         [status]
  AI patterns:              [status]

Phase 4 — Data:             ✅ PASS / ❌ FAIL
  CPU benchmarks:           [X/Y] covered
  CPU hardware guide:       [X/Y] covered
  GPU benchmarks:           [X/Y] covered
  GPU hardware guide:       [X/Y] covered
  Linux compat:             [X/Y] covered
  Editorial:                [X/Y] covered
  Seed prices:              [X/Y] covered
  Price baselines:          [X/Y] covered

Phase 5 — Build:            ✅ PASS / ❌ FAIL
  Compilation:              [status]
  Routes:                   [list with sizes]

Phase 6 — Stale Refs:       ✅ PASS / ❌ FAIL
  Deprecated names:         [count] found
  Dead file refs:           [count] found

═══════════════════════════════════════════
  READY FOR GITHUB: YES / NO
  Issues to fix: [count]
═══════════════════════════════════════════

[Details of any issues found, grouped by severity]
```

## Auto-Fix Behavior (when `--fix` is passed)

Only fix safe, reversible changes:

- Update model/CPU/GPU counts in README.md, CONTRIBUTING.md, package.json description
- Add missing module-level JSDoc to files (using the patterns from lib/ files)
- Remove TODO/FIXME comments from public docs
- Add missing .gitignore entries

Do NOT auto-fix:

- Missing data entries (use dedicated skills: `/add-editorial`, `/hardware-update`, etc.)
- Build errors
- Security issues (tracked secrets)
- Stale references in .claude/ files (need manual review)

After auto-fix, re-run the full report to confirm fixes.
