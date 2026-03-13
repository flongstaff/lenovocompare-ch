# Build & Hook Gotchas

- After deleting/moving files, `rm -rf .next` before rebuilding — stale cache causes 500 errors
- If `rm -rf .next` still gives `_document` errors, also `rm -rf node_modules/.cache`
- `npm start` (standalone mode) doesn't serve CSS properly — use `npm run dev` for visual testing
- PostToolUse hooks auto-modify files on save — always re-read files before writing if time has passed
- PostToolUse ESLint hook strips "unused" imports immediately — if adding imports + code that uses them, do it in a single Edit or the imports vanish before the code referencing them lands
- `import type` vs `import` — the linter auto-converts to `import type` when values aren't used at runtime; types used in function return annotations may get stripped if the function body isn't present yet
- PostToolUse hooks may make large autonomous refactors (e.g., replacing framer-motion with CSS animations, rewriting recharts components as pure SVG, extracting shared constants) — review `git diff` before committing to understand what hooks changed vs what you changed. Hooks can introduce unused imports that break builds — always run `npm run build` after hook-modified files
- Editing `.claude/settings.json` with grep patterns containing `(` breaks JSON validation in the Edit tool — use Write (full file) instead
- `.claude/settings.json` hooks use long shell commands in JSON — always use Write (full file) for edits, and validate with `python3 -c "import json; json.load(open('.claude/settings.json'))"` after
