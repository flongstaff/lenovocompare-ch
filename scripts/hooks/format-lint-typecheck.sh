#!/bin/bash
# Consolidated PostToolUse hook: format + lint + typecheck
# Replaces: "Formatting, linting, type-checking" + "Running tests" + "Auditing dependencies"
set -euo pipefail

filepath="$CLAUDE_FILE_PATH"

# Format: Prettier for TS/TSX/CSS/JSON/MD/YML/MJS/CJS/JS
if echo "$filepath" | grep -qE '\.(ts|tsx)$'; then
  npx prettier --write "$filepath" 2>&1 | head -5
  npx next lint --file "$filepath" 2>&1 | head -20
  npx tsc --noEmit 2>&1 | grep -A2 "$(basename "$filepath")" | head -15
elif echo "$filepath" | grep -qE '\.(css|json|md|yml|yaml|mjs|cjs|js)$'; then
  npx prettier --write "$filepath" 2>&1 | head -5
fi

# Re-stage if file was already staged
if git diff --name-only --cached 2>/dev/null | grep -qF "$filepath"; then
  git add "$filepath" 2>/dev/null && echo 'Re-staged after format/lint.'
fi

# Run tests if editing test files or core lib
if echo "$filepath" | grep -qE '(tests/|lib/(scoring|formatters|filters|analysis)\.ts)$'; then
  npx vitest run --reporter=verbose 2>&1 | tail -20
fi

# Audit dependencies if editing package.json
if echo "$filepath" | grep -q 'package.json' && ! echo "$filepath" | grep -q 'package-lock'; then
  echo 'Checking production dependencies for vulnerabilities...'
  npm audit --audit-level=critical --omit=dev 2>&1 | tail -5
  deps=$(node -e "const p=require('./package.json'); console.log(Object.keys(p.dependencies||{}).length)")
  if [ "$deps" -gt 15 ]; then
    echo "Warning: $deps production dependencies — check bundle impact"
  fi
fi

exit 0
