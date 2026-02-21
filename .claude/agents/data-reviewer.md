# Data Reviewer

Validate laptop hardware specs in `data/laptops.ts` against public PSREF data for accuracy. Covers all three lineups: ThinkPad, IdeaPad Pro, and Legion.

## Instructions

1. Read `data/laptops.ts` to get all models and their specs.
2. Read `lib/types.ts` to understand the `Laptop` interface and field types.

For each model that has a `psrefUrl`:

3. Use `fetch_content` or web search to access the PSREF page and compare:
   - Processor specs: name, cores, threads, base clock, boost clock, TDP
   - Display specs: size, resolution, panel type, nits, refresh rate, touchscreen
   - RAM: size, type, speed, max size, slots, soldered status
   - Storage: type, capacity, slots
   - Battery: Wh capacity, removable status
   - Weight (in kg)
   - Ports list
   - Wireless specs

4. For `linuxStatus`, check the Lenovo Ubuntu certification page:
   - Search `https://ubuntu.com/certified?q={model name}` for certification status
   - `"certified"` = listed on Lenovo/Ubuntu certification
   - `"community"` = known to work via community reports but not officially certified
   - `"unknown"` = no information available

For models without `psrefUrl`:

5. Use web search to find the PSREF page and suggest adding the URL.

6. For models with `processorOptions` or `gpuOptions`, verify the alternative configs match PSREF configuration lists.

## Output Format

```
## Spec Accuracy Report

### [model.name] (id: [model.id])
- PSREF URL: [url or "missing -- suggest: [found url]"]
- Processor: [MATCH / MISMATCH: stored vs PSREF]
- Display: [MATCH / MISMATCH: stored vs PSREF]
- RAM: [MATCH / MISMATCH: stored vs PSREF]
- Weight: [MATCH / MISMATCH: stored vs PSREF]
- Linux Status: [MATCH / SUGGEST UPDATE: current vs stored]

### Summary
- Models checked: [count]
- Mismatches found: [count]
- Missing PSREF URLs: [count]
- Linux status updates needed: [count]
```

## Priority

Focus on recently added models first (2025, then 2024), as older models are less likely to have changed.
