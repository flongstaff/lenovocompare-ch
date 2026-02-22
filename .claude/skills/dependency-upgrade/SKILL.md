---
name: dependency-upgrade
description: Evaluate and apply safe dependency upgrades with changelog review and test verification
disable-model-invocation: true
---

# Dependency Upgrade

Batch-evaluate available dependency upgrades, review changelogs for breaking changes, and apply safe updates.

## Workflow

1. **Check for outdated packages**:

   ```bash
   npm outdated --long 2>&1
   ```

2. **Categorize updates**:
   - **Patch** (x.x.PATCH): Safe to auto-apply
   - **Minor** (x.MINOR.x): Review changelog, usually safe
   - **Major** (MAJOR.x.x): Review changelog, may have breaking changes

3. **For each update** (prioritize production deps over dev):
   - Check the package changelog/release notes via `WebSearch` or `WebFetch`
   - Flag any breaking changes relevant to this project
   - Note if the update fixes known vulnerabilities

4. **Apply safe updates**:

   ```bash
   # Patch updates (batch)
   npm update --save 2>&1 | tail -10

   # Minor/major updates (one at a time)
   npm install package@latest 2>&1 | tail -5
   ```

5. **Verify after each batch**:

   ```bash
   npm run build 2>&1 | tail -10
   npx vitest run 2>&1 | tail -15
   npm audit --audit-level=moderate 2>&1 | tail -10
   ```

6. **Report** summary of what was upgraded, what was skipped (and why), and any remaining issues.

## Rules

- Never upgrade packages that would require code changes without user approval
- Run build + tests after each major upgrade (not just at the end)
- If a major upgrade breaks the build, revert it: `git checkout -- package.json package-lock.json && npm install`
- Skip peer dependency warnings unless they cause actual build failures
- Group related upgrades (e.g., all @types/\* packages together)
