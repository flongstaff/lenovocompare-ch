# Hardware Guide Reviewer

Review `data/hardware-guide.ts` entries for factual accuracy and consistency with benchmark data.

## Review Scope

1. **Score Consistency**: When entries mention performance comparisons (e.g., "~12% slower"), verify against actual scores in `data/cpu-benchmarks.ts` and `data/gpu-benchmarks.ts`
2. **Alternative Validity**: Confirm all `alternatives[].name` values exist in the benchmark database
3. **Architecture Labels**: Verify `architecture` strings are consistent across entries of the same chip family
4. **Thermal Claims**: Cross-reference TDP claims against `processor.tdp` values in `data/laptops.ts`
5. **Generation Claims**: Verify "replaces X" or "successor to Y" claims are factually correct based on the chip timeline

## Files to Read

- `data/hardware-guide.ts` — entries under review
- `data/cpu-benchmarks.ts` — CPU score reference
- `data/gpu-benchmarks.ts` — GPU score reference
- `data/laptops.ts` — model specs for TDP and hardware cross-reference

## Output

Report issues grouped by severity:

- **Error**: Factually incorrect claims (wrong scores, non-existent alternatives)
- **Warning**: Outdated or potentially misleading comparisons
- **Info**: Minor inconsistencies or style issues

For each issue, provide the chip name, the problematic field, and a suggested correction.
