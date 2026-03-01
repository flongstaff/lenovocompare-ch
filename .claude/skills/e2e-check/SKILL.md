---
name: e2e-check
description: Run Playwright E2E tests against the local dev server
disable-model-invocation: true
---

# E2E Check

Run Playwright end-to-end tests against the local dev server to verify key user flows.

## Usage

```
/e2e-check              # Run all E2E tests
/e2e-check home         # Run only home page tests
/e2e-check model        # Run only model detail tests
/e2e-check compare      # Run only compare page tests
/e2e-check pricing      # Run only pricing page tests
```

## Prerequisites

- Dev server running on `localhost:3000` (SessionStart hook handles this)
- Playwright installed (`npx playwright install chromium` if needed)

## Workflow

1. **Verify dev server** is running:

   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
   ```

   If not running, start with `npm run dev &` and wait for readiness.

2. **Check for test files**: Look for E2E test files in `tests/e2e/` or `e2e/`. If none exist, inform the user to run `/e2e-scaffold` first.

3. **Run tests** using native Playwright CLI (not the Docker MCP — it can't reach localhost):

   ```bash
   npx playwright test [filter] --reporter=list
   ```

   If a specific flow is requested, filter by filename pattern.

4. **Capture screenshots** on failure:

   ```bash
   npx playwright test --reporter=list --screenshot=only-on-failure
   ```

5. **Use Playwright MCP for interactive debugging** (if available):

   When the local Playwright MCP server is configured in `.mcp.json`, use it for:
   - Taking screenshots of specific pages for visual verification
   - Clicking through flows interactively to diagnose failures
   - Inspecting page elements and console errors

   The MCP server connects to a local browser and can reach `localhost:3000` directly (unlike the Docker-based MCP).

6. **Report results**:

```markdown
## E2E Test Results

| Flow         | Tests | Passed | Failed | Duration |
| ------------ | ----- | ------ | ------ | -------- |
| Home grid    | X     | X      | X      | Xs       |
| Model detail | X     | X      | X      | Xs       |
| Compare      | X     | X      | X      | Xs       |
| Pricing      | X     | X      | X      | Xs       |

### Failures (if any)

- **[test name]**: [error message]
  - Screenshot: [path if captured]
  - Likely cause: [analysis]
```

## Key User Flows to Test

| Flow         | What to verify                                                   |
| ------------ | ---------------------------------------------------------------- |
| Home grid    | Models render, lineup filter works, sort changes order           |
| Model detail | Page loads for `/model/[id]`, scores display, specs card renders |
| Compare      | Add models to compare, compare page shows charts and table       |
| Pricing      | Price input works, import/export functional                      |

## Notes

- Native `npx playwright` CLI is preferred for running tests (reliable localhost access)
- Playwright MCP (local, via `.mcp.json`) can be used for interactive debugging and screenshots
- `npm start` (standalone mode) doesn't serve CSS properly — use `npm run dev` for E2E testing
- If no E2E tests exist yet, use `/e2e-scaffold` to generate stubs
