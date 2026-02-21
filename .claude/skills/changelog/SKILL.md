---
name: changelog
description: Generate a changelog from recent commits since last tag or date
disable-model-invocation: true
---

# Generate Changelog

Generate a user-facing changelog from git history.

## Steps

1. **Determine range**: Check for the latest git tag (`git tag --sort=-creatordate | head -1`). If no tags exist, ask the user for a start date or commit hash, or default to last 20 commits.

2. **Gather commits**: Run `git log --oneline --no-merges [range]` to get the commit list.

3. **Categorize**: Group commits into sections based on commit message patterns:
   - **New Features**: commits with "add", "new", "implement", "create"
   - **Improvements**: commits with "update", "improve", "enhance", "refactor"
   - **Bug Fixes**: commits with "fix", "resolve", "patch"
   - **Data Updates**: commits touching `data/` files (models, benchmarks, prices, editorial)
   - **Other**: anything that doesn't fit above

4. **Format**: Output in markdown with:
   - Version header (tag name or date range)
   - Categorized bullet points
   - Summary stats (files changed, models added, etc.)

5. **Optional**: If the user wants, write the output to a `CHANGELOG.md` file.

## Output Format

```markdown
# Changelog

## [version or date range]

### New Features

- Added UpgradeSimulator for RAM/storage upgrade simulation
- Added 3 score bars (Perf, Display, Memory) to ThinkPad cards

### Improvements

- Improved CompareTable readability with better contrast and padding
- Full-width model detail layout with dashboard strip

### Bug Fixes

- Fixed ValueScoring heading inconsistency in dashboard strip

### Data Updates

- Added 3 new ThinkPad models for 2025
- Updated CPU benchmarks for Intel 14th gen

---

_Generated from [count] commits ([start]..[end])_
```
