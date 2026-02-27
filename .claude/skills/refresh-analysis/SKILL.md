---
name: refresh-analysis
description: Regenerate analysis outputs (pros/cons, use cases, verdicts) for one or all models
disable-model-invocation: true
---

# Refresh Analysis

Verify and refresh auto-generated analysis outputs from `lib/analysis.ts` for laptop models.

## Usage

```
/refresh-analysis                    # Audit analysis for all models
/refresh-analysis t14-gen5-intel     # Check analysis for a specific model
/refresh-analysis --verify           # Verify analysis functions produce valid output for all models
```

## What This Checks

The `lib/analysis.ts` module auto-generates several derived data points per model:

| Function              | Output                            | Used In                        |
| --------------------- | --------------------------------- | ------------------------------ |
| `getModelAnalysis`    | Pros, cons, summary               | ModelAnalysisCard              |
| `getUseCases`         | Recommended use cases             | UseCaseScenarios               |
| `getUpgradePaths`     | Suggested upgrades from/to        | UpgradeSimulator               |
| `getScenarioVerdicts` | Per-scenario suitability verdicts | UseCaseScenarios               |
| `getGamingTier`       | Gaming classification             | GamingSection, GamingTierBadge |

## Workflow

### Default: Audit all models

1. **Load all models** from `data/laptops.ts`.

2. **For each model**, call the analysis functions and verify:
   - `getModelAnalysis` returns non-empty `pros` and `cons` arrays
   - `getUseCases` returns 1-4 valid use case strings (matching `UseCase` type)
   - `getGamingTier` returns a valid tier for the model's GPU
   - No function throws an error

3. **Cross-check consistency**:
   - Models with discrete GPUs should have gaming tier >= "light"
   - Business ultrabooks shouldn't list "Desktop Replacement" as primary use case
   - Budget models (E/L series) shouldn't list "Creative Work" as primary use case
   - Legion models should always include gaming-related use cases

4. **Report** models with issues or questionable analysis output.

### Specific model: Deep dive

1. Load the specific model from `data/laptops.ts`.
2. Run all analysis functions and display full output.
3. Compare analysis output against the model's actual specs for accuracy.
4. Flag any analysis that seems inconsistent with the model's specs.

### Verify mode

1. Run all analysis functions for every model.
2. Report any errors, empty results, or type mismatches.
3. Output a pass/fail count.

## Output Format

```markdown
## Analysis Audit Report

### Summary

- Models checked: [count]
- All functions clean: [count]
- Issues found: [count]

### Issues

| Model | Function         | Issue                          |
| ----- | ---------------- | ------------------------------ |
| [id]  | getModelAnalysis | Empty pros array               |
| [id]  | getUseCases      | Unexpected use case for lineup |

### Recommendations

1. [actions to fix]
```

## Notes

- Analysis is computed dynamically from model specs — it's not stored in data files
- Changes to scoring formulas in `lib/scoring.ts` can shift analysis outputs
- Run `/data-verify` first to ensure underlying data is clean
- The analysis functions depend on `getPerformanceDimensions` from `lib/scoring.ts`
