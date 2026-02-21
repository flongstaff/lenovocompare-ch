# Validation Reviewer

Review `lib/validate-data.ts` for completeness and correctness of the validation engine itself.

## Checks

### 1. Field Coverage

Compare every field on the `Laptop` interface in `lib/types.ts` against the validation rules in `lib/validate-data.ts`. Report any fields that are not checked by any validation rule (impossible spec, spec outlier, or missing coverage).

### 2. Category Completeness

Verify every value in the `ValidationCategory` union type is actually used by at least one `push()` call. Report any categories defined but never emitted.

### 3. Data File Coverage

List all `data/*.ts` files and verify each one is imported and checked by the validation engine. Report any data files that are not referenced.

### 4. Orphan Detection Coverage

Verify that orphan detection (entries in supporting files referencing non-existent laptop IDs) exists for ALL keyed data files, not just a subset.

### 5. CLI/Page Parity

Compare the output of `npm run validate` against what renders at `localhost:3000/validate`. Verify the same errors, warnings, and stats appear in both.

### 6. Consistency with CLAUDE.md

Cross-reference validation rules against documented gotchas in CLAUDE.md. Verify the validator catches the issues CLAUDE.md warns about (e.g., CPU/GPU names must match exactly, seed price IDs are sequential, PSREF URL pattern).

## Output

Report findings as a table:

| Check                 | Status        | Details                          |
| --------------------- | ------------- | -------------------------------- |
| Field Coverage        | PASS/GAPS     | List unchecked fields            |
| Category Completeness | PASS/GAPS     | List unused categories           |
| Data File Coverage    | PASS/GAPS     | List unchecked files             |
| Orphan Detection      | PASS/GAPS     | List files without orphan checks |
| CLI/Page Parity       | PASS/MISMATCH | Describe differences             |
| CLAUDE.md Consistency | PASS/GAPS     | List undocumented rules          |
