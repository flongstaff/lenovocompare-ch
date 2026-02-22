---
name: commit
description: Create a well-structured git commit with conventional format
disable-model-invocation: true
---

# Commit Changes

Create a standardized git commit following Conventional Commits (https://www.conventionalcommits.org/).

## Message Format

```
type(scope): subject

Body text — WHAT changed and WHY (minimum 1-2 sentences).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Subject Line Rules

- **Max 50 characters** (hard limit)
- **Imperative mood**: "add" not "added" or "adds"
- **Lowercase first letter** (unless proper noun)
- **No period at the end**
- Be specific: "add email validation" not "add validation"

### Body Rules (Required — never skip)

- Separate from subject with blank line
- Wrap at 72 characters
- Explain WHAT changed and WHY — the diff shows HOW
- Use bullet points (`-`) for multiple changes
- Mention specific components, functions, or files when relevant
- Reference issue numbers if applicable

### Footer (Optional)

- Breaking changes: `BREAKING CHANGE: description`
- Issue references: `Closes #123`, `Fixes #456`
- Co-author: `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` (if Claude contributed)

## Commit Types

| Type       | Use when                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------ |
| `feat`     | New feature or capability (components, pages, skills, agents, hooks)                       |
| `fix`      | Bug fix (correcting broken behavior)                                                       |
| `data`     | Laptop/benchmark data additions or corrections (laptops.ts, benchmarks, editorial, prices) |
| `refactor` | Code restructuring without behavior change (renaming, extracting)                          |
| `perf`     | Performance improvement (specify the metric)                                               |
| `style`    | CSS/UI changes with no logic change (colors, spacing, animations)                          |
| `test`     | Adding or updating tests                                                                   |
| `docs`     | Documentation only (README, CONTRIBUTING, CLAUDE.md)                                       |
| `build`    | Build system or dependencies (npm, next.config, Docker)                                    |
| `ci`       | CI/CD pipeline changes (.github/workflows)                                                 |
| `chore`    | Routine tasks (gitignore, .claude/ config, maintenance)                                    |
| `revert`   | Revert a previous commit                                                                   |

### Type Decision Rules

- Every commit MUST have a type — never commit without one
- If changes span multiple types, use the dominant one
- Data-only changes → always `data`
- `.claude/` config changes → `chore`
- Pure documentation → `docs`
- If unsure between `feat` and `fix`, ask: "Did this work before?" Yes → `fix`, No → `feat`

### Scope (Optional but Recommended)

Indicates the area of change. Project-specific scopes:

`auth`, `ui`, `api`, `scoring`, `filters`, `compare`, `pricing`, `charts`, `models`, `hardware`, `linux`, `i18n`, `a11y`, `seo`, `layout`, `detail`, `grid`

## Banned Words

Never use these vague or subjective words in commit messages:

> comprehensive, robust, enhanced, improved (unless specifying metric), optimized (unless specifying metric), better, awesome, great, amazing, powerful, seamless, elegant, clean, modern, advanced

## Workflow

1. **Inspect changes**: Run `git status` and `git diff --stat` to see what's changed.

2. **Group related changes**: If changes span multiple concerns, suggest splitting into separate commits. Ask the user which group to commit first.

3. **Order commits by dependency** when preparing multiple:
   - Dependencies/configs before usage
   - Foundation before features (models before views)
   - Utilities before consumers
   - Data files before components that render them

4. **Determine type and scope** from the changes using the tables above.

5. **Draft the commit message** following the format rules. Verify against the banned words list.

6. **Stage files**: Use `git add` with specific file paths. Never use `git add -A` or `git add .`.

7. **Confirm with user**: Show the proposed message and staged files. Wait for approval.

8. **Commit**: Run the commit. Show `git log --oneline -1` to confirm.

## Pre-Commit Checklist

Before suggesting a commit, verify:

- [ ] Type is correct
- [ ] Scope is meaningful (if used)
- [ ] Subject is imperative mood, ≤50 chars, no period
- [ ] Body is present with ≥1-2 sentences
- [ ] Body explains WHAT and WHY
- [ ] No banned words
- [ ] One logical change per commit
- [ ] Files grouped correctly
- [ ] No `.env`, `.pem`, `.key`, or `node_modules` staged

## Rules

- Never force-push or amend without explicit user request
- If pre-commit hooks fail, fix the issue and create a NEW commit (don't amend)
- Keep data changes (laptops.ts, cpu-benchmarks.ts) in their own commits
- When splitting commits, each must be independently valid (no broken intermediate states)
