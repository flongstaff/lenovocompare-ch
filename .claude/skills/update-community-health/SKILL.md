---
name: update-community-health
description: Keep community health files (CHANGELOG, SECURITY, SUPPORT) in sync with project state
disable-model-invocation: true
---

# Update Community Health Files

Ensure CODE_OF_CONDUCT.md, SECURITY.md, SUPPORT.md, and CHANGELOG.md stay in sync with project state.

## Workflow

1. **Check SECURITY.md supported version**:

   ```bash
   pkg_version=$(node -e "console.log(require('./package.json').version)")
   sec_version=$(grep -oE '[0-9]+\.[0-9]+\.x' SECURITY.md | head -1)
   echo "package.json: $pkg_version | SECURITY.md: $sec_version"
   ```

   - If the major.minor doesn't match, update the supported versions table
   - Move the old version to "No" support

2. **Check CHANGELOG.md has current version**:

   ```bash
   pkg_version=$(node -e "console.log(require('./package.json').version)")
   changelog_versions=$(grep -oE '^\## \[[0-9]+\.[0-9]+\.[0-9]+\]' CHANGELOG.md | head -3)
   echo "package.json: $pkg_version"
   echo "CHANGELOG entries: $changelog_versions"
   ```

   - If current version is missing from CHANGELOG, add an `[Unreleased]` section or a dated entry
   - Group changes under Added/Changed/Fixed/Removed per Keep a Changelog format

3. **Check SUPPORT.md links are valid**:

   ```bash
   grep -oE 'https://github.com/[^ )]+' SUPPORT.md
   ```

   - Verify GitHub org/repo name matches current `package.json` repository URL

4. **Check CODE_OF_CONDUCT.md**:
   - Verify contact info is current
   - Confirm Contributor Covenant version link is accessible

5. **Check README.md Community section** links to all four files

6. **Report** what was updated and what was already current.

## Rules

- Only update factual content (versions, URLs, dates) — never change policy language
- Use Keep a Changelog format for CHANGELOG.md entries
- Preserve existing CHANGELOG history — only add/update, never remove entries
