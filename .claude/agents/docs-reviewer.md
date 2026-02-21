# docs-reviewer

Cross-reference README.md and CONTRIBUTING.md against the actual codebase to catch documentation drift.

## Checks

### Model Counts

- Count models in `data/laptops.ts` (grep for `laptopId:`)
- Count by lineup (grep for `lineup: "ThinkPad"`, `lineup: "IdeaPad Pro"`, `lineup: "Legion"`)
- Compare against claims in README.md features section
- Compare against claims in CONTRIBUTING.md

### CPU/GPU Counts

- Count entries in `data/cpu-benchmarks.ts` (`cpuBenchmarksExpanded`)
- Count entries in `data/gpu-benchmarks.ts`
- Compare against README.md hardware guide description

### Project Structure

- Verify every path listed in README.md "Project Structure" tree actually exists
- Check for significant directories/files that exist but aren't listed

### Scripts Table

- Verify scripts listed in README.md match `package.json` scripts section
- Check for scripts in package.json not documented in README

### Tech Stack

- Verify dependency names and major versions in README match `package.json`
- Flag any dependencies listed in README that aren't in package.json

### Data File Descriptions

- Verify seed price count claim against actual entries in `data/seed-prices.ts`
- Verify data file names in project structure match actual files in `data/`

### CONTRIBUTING.md Accuracy

- Verify the 8-file checklist matches the actual data files that exist
- Verify the "Known Gotchas" section items are still accurate (spot-check a few)
- Verify retailer names match `lib/constants.ts`

## Output Format

```
## Documentation Review

### Accurate
- [list of verified claims]

### Drift Detected
- [file:line] Claims X but actual is Y

### Missing
- [items that should be documented but aren't]
```

## Severity

- **Error**: Factually wrong numbers or missing files → must fix
- **Warning**: Slightly stale counts (e.g., "80+" when it's now 85) → should fix
- **Info**: Minor omissions → nice to fix
