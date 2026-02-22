---
name: squash-commits
description: Consolidate messy branch history into clean conventional commits before PR
disable-model-invocation: true
---

# Squash Commits

Consolidate WIP commits on a feature branch into clean conventional commits following the `/commit` guidelines.

## When to Use

- Before creating a PR from a feature branch with messy history
- When a branch has "WIP", "fixup", "oops", or throwaway commit messages
- When multiple commits should logically be one (e.g., feat + its fix-typo follow-up)

## Workflow

1. **Assess the branch**: Run `git log --oneline main..HEAD` (or the appropriate base branch) to see all commits on this branch.

2. **Analyze changes holistically**: Run `git diff main...HEAD --stat` to see the full scope of changes, independent of how they were committed.

3. **Group by logical concern**: Propose how commits should be consolidated. Each resulting commit should represent one logical change:
   - Feature A (may combine 5 WIP commits into 1 `feat` commit)
   - Refactor B (may combine 3 cleanup commits into 1 `refactor` commit)
   - Data change C (may combine scattered data edits into 1 `data` commit)

4. **Present the plan**: Show the user:
   - Current commits (numbered)
   - Proposed squashed commits with draft messages
   - Which original commits map to which new commits

   Example:

   ```
   Current (7 commits):
   1. WIP login form
   2. fix typo
   3. add validation
   4. oops forgot import
   5. style: button colors
   6. more validation tweaks
   7. final cleanup

   Proposed (2 commits):
   A. feat(auth): add login form with email validation
      ← combines 1, 2, 3, 4, 6, 7
   B. style(auth): update login button colors
      ← combines 5
   ```

5. **Wait for approval** before executing.

6. **Execute the squash** using interactive rebase:

   ```bash
   git rebase -i main
   ```

   Mark commits as `pick` (first in group) or `fixup` (subsequent in group). Reword the `pick` commits with the new messages.

   **Alternative for simple cases** (all commits → 1):

   ```bash
   git reset --soft main
   git commit -m "..."
   ```

7. **Verify**: Run `git log --oneline main..HEAD` to confirm the clean history. Run `git diff main...HEAD` to verify no changes were lost.

## Message Format

Each squashed commit must follow `/commit` guidelines:

- `type(scope): subject` (≤50 chars, imperative, no period)
- Body text required (WHAT + WHY, ≥1-2 sentences)
- No banned words (comprehensive, robust, enhanced, etc.)
- `Co-Authored-By:` footer if Claude contributed

## Rules

- **Never force-push to main/master** — only to feature branches after confirming with user
- **Never rebase commits already pushed to a shared branch** without explicit approval
- **Preserve all code changes** — squashing reorganizes history, it must not drop changes
- **Verify diff is identical** before and after squash (`git diff main...HEAD` should be unchanged)
- If the rebase hits conflicts, stop and ask the user — do not resolve automatically
- After squash, remind user they'll need `git push --force-with-lease` if the branch was already pushed
