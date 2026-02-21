---
name: commit
description: Create a well-structured git commit with conventional format
disable-model-invocation: true
---

# Commit Changes

Create a standardized git commit for the current working changes.

## Workflow

1. **Inspect changes**: Run `git status` and `git diff --stat` to see what's changed.

2. **Group related changes**: If changes span multiple concerns, suggest splitting into separate commits. Ask the user which group to commit first.

3. **Determine commit type** from the changes:
   - `feat:` — New feature or capability
   - `fix:` — Bug fix
   - `data:` — ThinkPad data additions/corrections
   - `style:` — CSS/UI changes with no logic change
   - `refactor:` — Code restructuring without behavior change
   - `chore:` — Build config, dependencies, tooling
   - `docs:` — Documentation only

4. **Draft the commit message**:
   - First line: `type: short summary` (under 72 chars, imperative mood)
   - Blank line
   - Body: bullet points explaining _why_, not _what_ (the diff shows _what_)
   - Footer: `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` if Claude contributed

5. **Stage files**: Use `git add` with specific file paths. Never use `git add -A` or `git add .`.

6. **Confirm with user**: Show the proposed message and staged files. Wait for approval.

7. **Commit**: Run the commit. Show `git log --oneline -1` to confirm.

## Rules

- Never force-push or amend without explicit user request
- Never commit `.env`, `.pem`, `.key`, or `node_modules`
- If pre-commit hooks fail, fix the issue and create a NEW commit (don't amend)
- Keep data changes (laptops.ts, cpu-benchmarks.ts) in their own commits
