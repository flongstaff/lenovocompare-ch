#!/bin/bash
# Consolidated PostToolUse hook: context-aware reminders and pattern checks
# Replaces: "Checking context and patterns" + "Checking image size" + "Type-checking scraper"
set -euo pipefail

filepath="$CLAUDE_FILE_PATH"

# --- Pattern-specific reminders ---
if echo "$filepath" | grep -qE 'ScoreBar|ModelDetailClient|CompareTable|MobileCompareCards'; then
  grep -q 'var(--' "$filepath" 2>/dev/null && echo 'WARNING: ScoreBar color prop must use hex values not CSS variables.' || true
elif echo "$filepath" | grep -q 'gpu-benchmarks.ts'; then
  echo 'REMINDER: After editing gpu-benchmarks.ts, check hardware-guide.ts and laptops.ts gpuOptions.'
elif echo "$filepath" | grep -q 'data/laptops.ts'; then
  echo 'REMINDER: New models need entries in linux-compat.ts, model-editorial.ts, seed-prices.ts, price-baselines.ts, hardware-guide.ts (for new CPUs), and model-benchmarks.ts (if review data available).'
fi

# --- Chart component checks ---
if echo "$filepath" | grep -qE 'components/charts/.*\.tsx$'; then
  grep -n 'style={{ height:' "$filepath" 2>/dev/null | while read -r line; do
    echo "INFO: Chart fixed height found — verify legend is outside the ResponsiveContainer wrapper: $line"
  done
fi

# --- TSX-specific checks ---
if echo "$filepath" | grep -qE '\.tsx$'; then
  if grep -q 'recharts' "$filepath" 2>/dev/null && ! head -1 "$filepath" | grep -q 'use client'; then
    echo 'WARNING: recharts import found without "use client" directive — will fail SSR.'
  fi
  if echo "$filepath" | grep -qE '(charts|pricing)/.*\.tsx$'; then
    hits=$(grep -n 'for.*of byRetailer\|for.*of new Map\|for.*of new Set' "$filepath" 2>/dev/null | head -3)
    if [ -n "$hits" ]; then
      echo "WARNING: for...of on Map/Set — use Array.from() or .forEach():"
      echo "$hits"
    fi
  fi
fi

# --- Agent stale reference check ---
if echo "$filepath" | grep -qE '\.claude/agents/'; then
  grep -l 'thinkpads\|thinkpadId' "$filepath" 2>/dev/null && echo 'WARNING: Agent references deprecated thinkpads/thinkpadId names.'
fi

# --- Image size check (Write only) ---
if echo "$filepath" | grep -qE 'public/.*\.(png|jpg|jpeg|webp|gif)$'; then
  size=$(stat -f%z "$filepath" 2>/dev/null || echo 0)
  if [ "$size" -gt 204800 ]; then
    echo "WARNING: Image $(basename "$filepath") is $((size/1024))KB — consider optimizing (>200KB)."
  fi
fi

# --- PSREF scraper type-check ---
if echo "$filepath" | grep -q 'scripts/scrape-psref.ts'; then
  errors=$(npx tsc --noEmit 2>&1 | grep 'scrape-psref' | head -5)
  if [ -n "$errors" ]; then
    echo "PSREF scraper type errors:"
    echo "$errors"
  fi
fi

# --- Seed price ID context ---
if echo "$filepath" | grep -q 'seed-prices.ts'; then
  last_id=$(grep -oE 'sp-[0-9]+' "$filepath" 2>/dev/null | sort -t- -k2 -n | tail -1)
  echo "CONTEXT: Seed price IDs are sequential. Last ID: $last_id"
fi

# --- Package version reminder ---
if echo "$filepath" | grep -q 'package.json' && ! echo "$filepath" | grep -q 'package-lock'; then
  if echo "${CLAUDE_TOOL_INPUT:-}" | grep -q '"version"'; then
    echo 'REMINDER: Update CHANGELOG.md when bumping version in package.json.'
  fi
fi

exit 0
