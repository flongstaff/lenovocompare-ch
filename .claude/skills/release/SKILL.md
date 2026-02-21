---
name: release
description: Bump version, generate changelog from git history, and create a git tag
disable-model-invocation: true
---

# Release

Create a versioned release with changelog and git tag.

## Arguments

- `$ARGUMENTS` — Version bump type: `patch` (default), `minor`, or `major`. Or an explicit version like `0.3.0`.

## Workflow

### 1. Determine Version

Read the current version from `package.json`:

```bash
node -e "console.log(require('./package.json').version)"
```

Calculate the new version based on the argument:

- `patch` → increment patch (0.2.0 → 0.2.1)
- `minor` → increment minor (0.2.0 → 0.3.0)
- `major` → increment major (0.2.0 → 1.0.0)
- Explicit version (e.g. `0.3.0`) → use as-is

### 2. Generate Changelog

Get commits since the last tag (or all commits if no tags exist):

```bash
git log $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD --oneline --no-decorate
```

Group commits by type based on conventional-ish prefixes:

- **Features**: commits with `feat`, `add`, `new` in message
- **Fixes**: commits with `fix`, `bug`, `patch` in message
- **Data**: commits with `data`, `model`, `benchmark`, `price` in message
- **Docs**: commits with `doc`, `readme`, `contributing` in message
- **Other**: everything else

### 3. Update Files

1. Update `version` in `package.json` (use Edit tool, not npm version — avoids auto-tagging)
2. Prepend a new section to `CHANGELOG.md` (create if it doesn't exist):

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Features

- commit message

### Fixes

- commit message

### Data

- commit message
```

### 4. Commit and Tag

```bash
git add package.json CHANGELOG.md
git commit -m "release: vX.Y.Z"
git tag -a vX.Y.Z -m "Release vX.Y.Z"
```

### 5. Summary

Print:

- Previous version → new version
- Number of commits included
- Changelog preview
- Remind user to `git push --follow-tags` when ready

**Do NOT push automatically.** Let the user decide when to push.
