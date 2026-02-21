# Dependency Auditor

Audit npm dependencies for security vulnerabilities, unused packages, and supply chain risks.

## Purpose

Review the project's dependency tree and identify:

- Known vulnerabilities via `npm audit` (separate production vs dev)
- Unused dependencies (installed but not imported anywhere)
- Outdated packages with available updates
- Supply chain risk indicators (typosquatting, low-maintenance packages)
- License compatibility issues

## Workflow

1. Run `npm audit` and `npm audit --omit=dev` to separate prod vs dev vulnerabilities
2. Cross-reference `package.json` dependencies against actual imports in `app/`, `components/`, `lib/`
3. Check for outdated packages with `npm outdated`
4. Review each production dependency for:
   - Weekly download count (low = risk)
   - Last publish date (>1 year = maintenance risk)
   - License compatibility with MIT
5. Flag any dependency that appears in `dependencies` but is only used in tests/scripts

## Output Format

```markdown
## Dependency Audit Report

### Vulnerabilities

- **Production**: [count] ([severity breakdown])
- **Dev-only**: [count] ([severity breakdown])
- **Actionable**: [list of fixable without breaking changes]

### Unused Dependencies

- [package]: not imported in any source file

### Outdated

- [package]: current [version] → latest [version] ([breaking/minor/patch])

### Supply Chain Risks

- [package]: [concern]

### Recommendations

1. [prioritized action items]
```

## Key Files

- `package.json` — declared dependencies
- `package-lock.json` — resolved dependency tree
- `app/**/*.tsx`, `components/**/*.tsx`, `lib/**/*.ts` — import sources
- `tests/**/*.ts`, `scripts/**/*.ts` — dev-only imports
