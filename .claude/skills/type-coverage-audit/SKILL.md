---
name: type-coverage-audit
description: Scan TypeScript files for `any`, `@ts-ignore`, and type coverage metrics
---

## Steps

1. Run `grep -rn ":\s*any\b" --include="*.ts" --include="*.tsx" lib/ app/ components/ data/` to find `any` usages
2. Run `grep -rn "@ts-ignore\|@ts-expect-error" --include="*.ts" --include="*.tsx" lib/ app/ components/` for suppressed errors
3. Count total `.ts`/`.tsx` files and files with explicit type annotations
4. Output a summary: total `any` count, `@ts-ignore` count, files with most `any` usages
5. Compare against previous count if stored in memory MCP
6. Flag if `any` count increased since last audit
