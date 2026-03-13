---
status: resolved
phase: 01-foundation
source: [01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md, 01-04-SUMMARY.md]
started: 2026-03-13T14:00:00Z
updated: 2026-03-13T16:30:00Z
---

## Current Test

[testing complete — all issues resolved]

## Tests

### 1. Cold Start Smoke Test

expected: Kill any running dev server. Run `npm run build` then `npm run dev`. The site boots without errors at localhost:3000. Home page loads showing the laptop grid with model cards (not stuck on skeleton loaders).
result: pass
reported: "npm run build succeeds (260 pages). npm run dev boots cleanly (zero EMFILE errors) and serves all routes at localhost:3000 with 200 status. Initial issue was Claude Code sandbox restricting file watchers — resolved by running dev server outside sandbox or directly in user terminal."

### 2. Diffs Only Toggle

expected: Navigate to /compare and select 2+ models. Above the comparison table, a "Diffs only" toggle button appears. Clicking it hides rows where all selected models have identical values. A badge shows the count of hidden rows (e.g. "12 identical hidden"). Toggling off restores all rows.
result: pass

### 3. Benchmark Source Attribution Links

expected: Navigate to a model detail page for a model with source data (e.g. X1 Carbon Gen 13). In the Benchmarks section, subsections like Thermals, Battery, Storage Speed show a small "Measured:" footer with a clickable link to the NotebookCheck review (dotted underline on hover). For a model without source URLs, the same values show "(unverified)" instead.
result: pass

### 4. Physical Size Comparison

expected: Navigate to /compare and select 2+ models that have dimension data (e.g. X1 Carbon Gen 12 + Legion 5 16AHP9). A "Physical Size" section appears above the spec table showing proportionally-scaled rectangles (top-down footprint) and thickness bars for each model, color-coded per compare slot. Dimension labels show WxDxH in mm and weight.
result: pass

### 5. Workers API Health Check

expected: Open https://lenovocompare-prices.franco-longstaff.workers.dev/ in browser. Response shows `{"status":"ok","service":"lenovocompare-prices"}`. Opening /api/prices returns a JSON array of price objects with camelCase keys (id, laptopId, priceCHF, retailer, etc.).
result: pass

### 6. Remote Prices Loading

expected: With the dev server running, navigate to any model detail page (e.g. /model/x1-carbon-gen13). The Swiss Prices section shows price entries. Open browser DevTools Network tab — you should see a fetch request to the Workers API URL (lenovocompare-prices.franco-longstaff.workers.dev/api/prices). Prices merge with local seed data.
result: pass

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0

## Gaps

None — all tests pass.

## Resolution Notes

The original Test 1 failure (EMFILE / 404 on all routes) was caused by Claude Code's sandbox restricting `fs.watch()` system calls for child processes. The sandbox limits prevented Watchpack from establishing file watchers needed for Next.js route resolution.

**Root cause:** Claude Code sandbox file watcher restriction (NOT macOS maxfiles limit).

**Evidence:**

- Standalone Node test: 41800+ `fs.watch()` calls succeed inside sandbox
- `ulimit -n` shows "unlimited", `launchctl limit maxfiles` shows 65536
- Sandboxed `npm run dev`: always fails with EMFILE, regardless of maxfiles setting
- Unsandboxed `npm run dev` (`dangerouslyDisableSandbox: true`): starts cleanly, zero EMFILE errors, all routes 200

**No code changes needed.** The `turbopack.root: import.meta.dirname` in next.config.mjs resolves a separate workspace root inference warning (caused by stale parent /Users/flong/Developer/package-lock.json) and is retained as a correctness improvement.

**For daily development:** Run `npm run dev` directly in a terminal (not through Claude Code). The static export (`npm run build`) works perfectly in all environments.
