---
name: changelog-validate
description: Cross-reference CHANGELOG.md entries against git log since last tag — flag undocumented commits
---

## Steps

1. Run `git describe --tags --abbrev=0` to find the last version tag
2. Run `git log --oneline <last-tag>..HEAD` to get all commits since that tag
3. Read `CHANGELOG.md` and find the "Unreleased" or latest version section
4. Compare: for each commit, check if the change is reflected in the changelog
5. Categorize undocumented commits: feat, fix, chore, style, docs, refactor
6. Output a report of what's documented vs undocumented
7. Suggest changelog entries for missing items
8. Suggest version bump: patch (fixes only), minor (features), major (breaking)
