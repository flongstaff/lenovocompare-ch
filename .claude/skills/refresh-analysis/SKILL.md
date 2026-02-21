---
name: refresh-analysis
description: Spot-check auto-generated analysis across all ThinkPad models
disable-model-invocation: true
---

# Refresh Analysis

Run `generateAnalysis()` against every model and report anomalies.

## Workflow

1. **Read source files**:
   - `data/laptops.ts` — all models
   - `lib/analysis.ts` — the analysis engine
   - `lib/types.ts` — `ModelAnalysis`, `UseCase` types

2. **Evaluate each model** by mentally tracing `generateAnalysis(model, allModels)` logic:
   - Count expected pros and cons based on spec thresholds
   - Determine expected use cases
   - Check upgrade path resolution

3. **Flag anomalies**:
   - Models with 0 pros or 0 cons (every model should have at least 1 of each)
   - Models with 0 use cases (every model should match at least 1)
   - Broken upgrade paths (target ID doesn't exist in `laptops`)
   - Upgrade paths that skip generations (e.g., Gen 3 → Gen 5 when Gen 4 exists with same suffix)
   - Use cases that seem wrong for the model (e.g., "Ultraportable" on a 2.6 kg workstation)
   - Missing pros for obvious strengths (e.g., 4K OLED not generating a display pro)

4. **Cross-check editorial**: Read `data/model-editorial.ts` and verify:
   - Every editorial key matches an existing model ID in `laptops.ts`
   - No `linuxNotes` on models without `linuxStatus`
   - Editorial claims don't contradict spec data (e.g., editorial says "IPS" but model has OLED)

## Output Format

```
## Analysis Health Check

### Anomalies
| Model | Issue | Details |
|-------|-------|---------|
| {id}  | {type}| {description} |

### Coverage
- Models with analysis: {count}/{total}
- Models with editorial: {count}/{total}
- Models missing editorial (2024+): {list of IDs}

### Upgrade Path Map
- {model} → {upgrade} (Gen N → Gen N+1)
- {model} → none (latest generation)

### Summary
- Total anomalies: {count}
- Action items: {list of suggested fixes}
```

## When to Run

- After adding new models via `/add-laptop`
- After modifying analysis rules in `lib/analysis.ts`
- After adding editorial via `/add-editorial`
- Before deploying (`/deploy-check` should include this)
