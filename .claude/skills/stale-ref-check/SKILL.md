---
name: stale-ref-check
description: Audit .claude/ skill and agent files for stale file paths and deprecated names
disable-model-invocation: true
---

# Stale Reference Check

Scan all `.claude/skills/` and `.claude/agents/` files for references to deprecated names, renamed files, or stale paths.

## Known Renames

These renames have occurred in the project history:

| Old                 | Current                                  | Notes                        |
| ------------------- | ---------------------------------------- | ---------------------------- |
| `data/laptops.ts`   | `data/laptops.ts`                        | Renamed in v0.2              |
| `thinkpadId`        | `laptopId`                               | Field rename in v0.2         |
| `thinkpads` array   | `laptops` (aliased as `thinkpads`)       | Backward-compat alias exists |
| `useThinkPads` hook | `useLaptops` (aliased as `useThinkPads`) | Backward-compat alias exists |

## Workflow

### 1. Scan for Stale References

Search all `.md` files in `.claude/skills/` and `.claude/agents/` for:

```bash
grep -rn 'thinkpads\.ts\|thinkpadId\|data/thinkpads' .claude/skills/ .claude/agents/ 2>/dev/null
```

Also check for other potentially stale paths:

```bash
# Check for file paths that don't exist
grep -rohE '(data|lib|components|app)/[a-zA-Z0-9/_-]+\.ts[x]?' .claude/skills/ .claude/agents/ 2>/dev/null | sort -u | while read f; do
  [ ! -f "$f" ] && echo "MISSING: $f"
done
```

### 2. Report Findings

For each stale reference found, report:

- File path and line number
- The stale reference
- What it should be updated to

### 3. Fix (with confirmation)

Ask the user before making changes. Then for each file with stale references:

- Replace `data/laptops.ts` → `data/laptops.ts`
- Replace `thinkpadId` → `laptopId` (only in instructional text, not in code examples that use the alias)
- Leave backward-compat alias references (`thinkpads` array, `useThinkPads` hook) as-is — the aliases still work

### 4. Verify

After fixes, re-run the scan to confirm no remaining stale references.
