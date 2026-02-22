---
name: prettier-fix
description: Fix all Prettier formatting issues across the repo and verify clean state
disable-model-invocation: true
---

# Prettier Fix

Fix all Prettier formatting issues and verify the repo is CI-ready.

## Steps

1. Run `npx prettier --check .` to identify files with issues
2. If issues found, run `npx prettier --write .` to fix all files
3. Run `npx prettier --check .` again to verify all files pass
4. Report which files were fixed
5. If files were fixed, remind the user to commit the formatting changes before pushing
