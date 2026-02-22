---
name: hook-health
description: Dry-run diagnostic for all hooks — test execution, timing, and exit codes
disable-model-invocation: true
---

# Hook Health Check

Diagnostic tool for validating all hooks in `.claude/settings.json` fire correctly.

## Usage

```
/hook-health                    # Full diagnostic of all hooks
/hook-health --type <type>      # Check only one hook type (SessionStart, PostToolUse, PreToolUse, Stop)
/hook-health --slow             # Show only hooks exceeding 5s execution time
```

## Workflow

### Step 1: Parse Hook Configuration

Read `.claude/settings.json` and extract all hook definitions:

```bash
cat .claude/settings.json
```

Build an inventory:

| #   | Type         | Matcher     | Description        | Timeout |
| --- | ------------ | ----------- | ------------------ | ------- |
| 1   | SessionStart | —           | Dev server startup | 15s     |
| 2   | PostToolUse  | Edit\|Write | ESLint             | default |
| ... | ...          | ...         | ...                | ...     |

### Step 2: Dry-Run Each Hook

For each hook, execute the command in a controlled context and capture results.

**SessionStart hooks**: Run the command directly and capture output + exit code + duration.

**PostToolUse hooks**: Set mock environment variables before running:

```bash
# Mock environment for PostToolUse hooks
export CLAUDE_FILE_PATH="data/laptops.ts"  # Use a real file for realistic test
export CLAUDE_TOOL_INPUT="{}"
```

Test with multiple file paths to exercise different matchers:

| Test file                                | Exercises                                          |
| ---------------------------------------- | -------------------------------------------------- |
| `data/laptops.ts`                        | Data validation, context reminders, as-const check |
| `components/charts/PerformanceRadar.tsx` | recharts check, chart height check                 |
| `package.json`                           | Dep audit, version bump reminder                   |
| `tests/scoring.test.ts`                  | Vitest runner                                      |
| `.claude/agents/test.md`                 | Stale agent name check                             |

**PreToolUse hooks**: Set mock environment variables:

```bash
export CLAUDE_FILE_PATH="data/laptops.ts"
export CLAUDE_TOOL_INPUT="{}"
export CLAUDE_INPUT="echo test"
export CLAUDE_OUTPUT=""
```

Test with edge cases:

| Test file/input        | Exercises                            |
| ---------------------- | ------------------------------------ |
| `package-lock.json`    | Lock file block (should exit 1)      |
| `.env`                 | Sensitive file block (should exit 1) |
| `data/seed-prices.ts`  | Sequential ID context                |
| `git commit -m "test"` | Prettier gate                        |

**Stop hooks**: Run command and verify dev server cleanup behavior.

### Step 3: Analyze Results

For each hook, record:

- **Exit code**: 0 = pass, 1 = intentional block, other = error
- **Duration**: Time in milliseconds
- **Output**: First 5 lines of stdout/stderr
- **Status**: OK / SLOW (>5s) / ERROR (unexpected exit code) / SILENT (no output)

### Step 4: Report

```
=== Hook Health Report ===

Total hooks:     33
Passing:         31
Slow (>5s):      1
Errors:          1
Silent:          0

SessionStart (9 hooks):
  ✅ Dev server startup          — 3.2s (OK)
  ✅ Dependency health           — 1.1s (OK)
  ✅ Doc freshness               — 0.1s (OK)
  ...

PostToolUse (16 hooks):
  ✅ ESLint (*.ts)               — 0.8s (OK)
  ✅ tsc (*.ts)                  — 2.1s (OK)
  ⚠️ Data validation             — 6.3s (SLOW, timeout 30s)
  ❌ Stale agent check           — exit 2 (ERROR)
  ...

PreToolUse (7 hooks):
  ✅ Lock file block             — 0.0s (correctly blocks)
  ✅ Sensitive file block        — 0.0s (correctly blocks)
  ...

Stop (1 hook):
  ✅ Dev server cleanup          — 0.3s (OK)

Recommendations:
- Hook #14 (data validation): Consider increasing timeout or optimizing
- Hook #22 (stale agent check): Exit code 2 — check grep pattern
```

### Interpreting Results

| Status  | Meaning                       | Action                                                    |
| ------- | ----------------------------- | --------------------------------------------------------- |
| OK      | Hook executes correctly       | None                                                      |
| SLOW    | Exceeds 5s but within timeout | Consider optimizing                                       |
| ERROR   | Unexpected exit code          | Fix command or update expected behavior                   |
| SILENT  | No output produced            | May be expected (e.g., no issues found) or command broken |
| TIMEOUT | Exceeded configured timeout   | Increase timeout or optimize command                      |

### Common Issues

- **grep returning exit 1**: `grep` exits 1 when no match — use `|| true` or `exit 0` at end
- **Missing tools**: `npx` commands fail if dependencies not installed
- **File not found**: Mock file paths must exist for realistic testing
- **Port conflicts**: SessionStart dev server hook may conflict with running server
