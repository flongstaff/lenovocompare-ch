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

3. **Determine commit type** from the changes using this decision tree:
   - `feat:` — New feature or capability (new components, new pages, new skills/agents/hooks)
   - `fix:` — Bug fix (correcting broken behavior, fixing errors)
   - `data:` — Laptop/benchmark data additions or corrections (laptops.ts, cpu-benchmarks.ts, gpu-benchmarks.ts, model-benchmarks.ts, etc.)
   - `style:` — CSS/UI changes with no logic change (colors, spacing, animations)
   - `refactor:` — Code restructuring without behavior change (renaming, extracting functions)
   - `chore:` — Build config, dependencies, tooling, CI/CD, .claude/ config changes
   - `docs:` — Documentation only (README, CONTRIBUTING, CLAUDE.md, comments)

   **Prefix validation rules**:
   - Every commit MUST have a prefix — never commit without one
   - If changes span multiple types, use the dominant one (e.g., a feature that includes a CSS change → `feat:`)
   - Data-only changes (laptops.ts, benchmarks, editorial, prices) → always `data:`
   - .claude/ config changes (settings.json, skills, agents) → `chore:`
   - Pure documentation edits → `docs:`
   - If unsure between `feat:` and `fix:`, ask: "Did this work before?" Yes → `fix:`, No → `feat:`

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
