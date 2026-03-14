#!/bin/bash
# Consolidated PostToolUse hook: all data file validation
# Replaces: "Validating data integrity" + "Validating deals data" + "Validating PSREF URLs" + "Verifying validation engine"
set -euo pipefail

filepath="$CLAUDE_FILE_PATH"

# --- Data file integrity checks ---
if echo "$filepath" | grep -qE '(data/(laptops|cpu-benchmarks|gpu-benchmarks|linux-compat|seed-prices|price-baselines|model-editorial|hardware-guide|model-benchmarks)|lib/types)\.ts$'; then
  npm run validate 2>&1 | tail -10
fi

if echo "$filepath" | grep -qE 'data/.*\.ts$'; then
  # Check as const assertion
  if echo "$filepath" | grep -qE 'data/(laptops|cpu-benchmarks|gpu-benchmarks)\.ts$'; then
    tail -5 "$filepath" | grep -q 'as const' || echo 'WARNING: Data file missing as const assertion at end — type narrowing will break.'
  fi

  # Check duplicate keys
  dupes=$(grep -oE '^  "[^"]+":' "$filepath" 2>/dev/null | sort | uniq -d | tr -d ' ')
  if [ -n "$dupes" ]; then
    echo "WARNING: Duplicate keys in $(basename "$filepath"): $dupes"
  fi

  # Check benchmark sources
  if echo "$filepath" | grep -q 'model-benchmarks.ts'; then
    valid_sources='notebookcheck|geekbench|tomshardware|jarrodtech|justjoshtech|community'
    bad=$(grep -oE '"[a-z]+"' "$filepath" 2>/dev/null | grep -v -E "\"($valid_sources)\"" | grep -v '"sources"' | sort -u | head -5)
    if [ -n "$bad" ]; then
      echo "WARNING: Unknown BenchmarkSource values in model-benchmarks.ts: $bad"
    fi
  fi
fi

# --- Deals data validation ---
if echo "$filepath" | grep -qE "(market-insights|deals)\.ts$"; then
  npx tsc --noEmit 2>&1 | grep -A2 "$(basename "$filepath")" | head -15

  deal_ids=$(grep -oE "id: \"deal-[^\"]+\"" data/market-insights.ts 2>/dev/null | sort | uniq -d)
  if [ -n "$deal_ids" ]; then
    echo "WARNING: Duplicate deal IDs: $deal_ids"
  fi

  laptop_ids=$(grep -oE "laptopId: \"[^\"]+\"" data/market-insights.ts 2>/dev/null | sed 's/laptopId: "//;s/"//' | sort -u)
  for lid in $laptop_ids; do
    grep -q "id: \"$lid\"" data/laptops.ts 2>/dev/null || echo "WARNING: Deal references unknown laptopId: $lid"
  done
fi

# --- PSREF URL validation ---
if echo "$filepath" | grep -q 'data/laptops.ts'; then
  bad=$(grep -n 'psrefUrl:' "$filepath" | grep -E 'IdeaPad/Lenovo_|Legion/Lenovo_' | head -5)
  if [ -n "$bad" ]; then
    echo 'WARNING: PSREF URLs must not use Lenovo_ prefix for IdeaPad Pro or Legion:'
    echo "$bad"
  fi

  grep -n 'psrefUrl:' "$filepath" | while IFS= read -r line; do
    lineno=$(echo "$line" | cut -d: -f1)
    url=$(echo "$line" | grep -oE 'https://[^"]*')
    slug=$(echo "$url" | sed 's/?.*//' | sed 's|.*/||')
    code=$(echo "$slug" | grep -oE '[0-9][0-9][A-Z][A-Z]*[0-9]*$')
    if [ -n "$code" ]; then
      name_line=$(head -n "$lineno" "$filepath" | tail -20 | grep 'name:' | tail -1)
      if [ -n "$name_line" ]; then
        echo "$name_line" | grep -q "$code" || {
          name_code=$(echo "$name_line" | grep -oE '[0-9][0-9][A-Z][A-Z]*[0-9]*')
          if [ -n "$name_code" ] && [ "$name_code" != "$code" ]; then
            echo "WARNING: PSREF slug mismatch at line $lineno: URL has $code but name has $name_code"
          fi
        }
      fi
    fi
  done
fi

# --- Validation engine self-check ---
if echo "$filepath" | grep -q 'validate-data.ts'; then
  npm run validate 2>&1 | tail -5 && npm run build 2>&1 | tail -5
fi

exit 0
