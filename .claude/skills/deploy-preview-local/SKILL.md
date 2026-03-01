---
name: deploy-preview-local
description: Pre-deployment verification using local tooling (no Docker)
disable-model-invocation: true
---

# Deploy Preview (Local)

Run a full pre-deployment verification using local Node.js and Python.

## Workflow

Execute these steps in order, stopping on any failure:

### 1. Type Check

```bash
npx tsc --noEmit
```

Must pass with zero errors.

### 2. Lint

```bash
npm run lint
```

Must pass with zero warnings and zero errors.

### 3. Unit Tests

```bash
npm test
```

All tests must pass.

### 4. Production Build

```bash
rm -rf .next && npm run build
```

Must complete successfully.

### 5. Bundle Size Report

After build completes, report the page sizes from the build output. Flag any page over 300KB (First Load JS).

### 6. E2E Tests (if available)

```bash
npm run test:e2e
```

Run if Playwright is configured. Report results but don't block on flaky tests.

### 7. Summary

Output a deployment readiness report:

```
## Deploy Preview Summary
- Type check: PASS/FAIL
- Lint: PASS/FAIL (N warnings)
- Unit tests: PASS/FAIL (N/N passed)
- Build: PASS/FAIL
- Bundle: OK/WARNING (largest page: NKB)
- E2E: PASS/FAIL/SKIPPED

Ready to deploy: YES/NO
```
