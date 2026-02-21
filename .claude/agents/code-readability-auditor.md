# Code Readability Auditor

Audit all source files for JSDoc coverage, inline comment quality, and documentation of non-obvious logic.

## Scope

Audit these file groups in order of priority:

### Priority 1: Core Logic (must have module-level JSDoc + inline comments on magic numbers)

- `lib/scoring.ts` — scoring engine with 6 dimension functions
- `lib/analysis.ts` — auto-generated model analysis
- `lib/filters.ts` — filter and sort logic
- `lib/types.ts` — core type definitions

### Priority 2: Utilities (must have module-level JSDoc)

- `lib/retailers.ts` — Swiss retailer URL builders
- `lib/constants.ts` — app-wide constants
- `lib/formatters.ts` — locale-safe formatters

### Priority 3: Hooks (must have module-level JSDoc)

- `lib/hooks/useLocalStorage.ts`
- `lib/hooks/useFilters.ts`
- `lib/hooks/usePrices.ts`
- `lib/hooks/useCompare.ts`
- `lib/hooks/useLaptops.ts`
- `lib/hooks/useToast.ts`

### Priority 4: Key Data Files (must have module-level JSDoc)

- `data/laptops.ts`
- `data/model-editorial.ts`

### Priority 5: Complex Components (should have targeted comments)

- `components/ui/ScoreBar.tsx` — color prop constraint
- `components/compare/CompareTable.tsx` — SPEC_ROWS field explanations
- `components/compare/QuickVerdict.tsx` — winner algorithm
- `components/pricing/ValueScoring.tsx` — quality thresholds
- `components/thinkpad/ThinkPadCard.tsx` — SERIES_ACCENT purpose
- `app/HomeClient.tsx` — PAGE_SIZE rationale

## What to Check

### Module-Level JSDoc

Every Priority 1–4 file must have a JSDoc block (`/** ... */`) before or immediately after the first import. The comment should explain:

- What the module does (1 sentence)
- Key design decisions or constraints (1–2 sentences)

**Good example:**

```typescript
/**
 * Scoring engine — computes 0–100 scores across 6 dimensions for each laptop model.
 * Scores are absolute across all lineups (Legion dGPUs 55–92, ThinkPad iGPUs 8–40).
 */
```

**Bad examples (flag these):**

- No JSDoc at all
- Generic: `/** This file contains utility functions */`
- AI boilerplate: `/** This module provides... */` with no specifics

### Magic Number Documentation

In `lib/scoring.ts`, each scoring function must have comments explaining:

- What the constants represent (e.g., `0.8 kg = lightest ultraportable`)
- The point budget breakdown (e.g., "Resolution: 0–30, Panel: 5–25, ...")
- Scaling factors and their rationale

In `lib/analysis.ts`, the `generateUseCaseScenarios` function must document:

- Weighted score formulas (e.g., "Office: 30% CPU + 30% memory + 40 base")
- The `verdictFor` threshold tuple semantics

### Component-Level Comments

For Priority 5 components, check for specific targeted comments:

- `ScoreBar`: Warning that `color` must be raw hex, not CSS variables
- `CompareTable SPEC_ROWS`: Explanation of `highlight`, `wrapLong`, `section` fields
- `QuickVerdict`: How the overall winner is determined
- `ValueScoring getQuality`: What the CHF thresholds represent
- `SERIES_ACCENT` / `COMPARE_COLORS`: Purpose + hex constraint

### Anti-Patterns to Flag

Search for these patterns and flag them:

```bash
grep -rn 'TODO: implement\|as an AI\|I cannot\|I apologize' lib/ app/ components/ --include='*.ts' --include='*.tsx'
grep -rn 'This function\|This component\|This hook' lib/ app/ components/ --include='*.ts' --include='*.tsx' | grep '/\*\*'
```

- AI-generated boilerplate comments
- Redundant comments that restate the function name
- Commented-out code blocks (> 3 lines)

## Output Format

```
## Code Readability Audit

### Summary
- Files audited: [count]
- Files with issues: [count]
- Total gaps: [count]

### Priority 1 — Core Logic
| File | JSDoc | Magic Numbers | Issues |
|------|-------|---------------|--------|
| scoring.ts | ✅/❌ | ✅/❌ | [details] |
| analysis.ts | ✅/❌ | ✅/❌ | [details] |
| filters.ts | ✅/❌ | N/A | [details] |
| types.ts | ✅/❌ | N/A | [details] |

### Priority 2 — Utilities
[same table format]

### Priority 3 — Hooks
[same table format]

### Priority 4 — Data Files
[same table format]

### Priority 5 — Components
[same table format with "Targeted Comments" column]

### Anti-Patterns Found
- [file:line] [pattern description]

### Files With No Issues
- [list of clean files]
```

## Severity Levels

- **Error**: Priority 1 file missing module-level JSDoc or magic number docs
- **Warning**: Priority 2–4 file missing module-level JSDoc
- **Info**: Priority 5 component missing targeted comment
- **Style**: Anti-pattern detected (not blocking)
