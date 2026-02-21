---
name: update-psref
description: Verify and update a ThinkPad model's specs against its PSREF page
disable-model-invocation: true
---

# Update PSREF

Verify and correct a ThinkPad model's specs against its official Lenovo PSREF page.

## Arguments

- Model ID (e.g., `x1-carbon-gen12`) or model name (e.g., `X1 Carbon Gen 12`)
- If no argument, run for all models missing `psrefUrl`

## Workflow

1. **Find the model** in `data/laptops.ts` by ID or name match.

2. **Get the PSREF page**:
   - If model has `psrefUrl`, use it
   - Otherwise, construct URL: `https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_{Model_Name}` (spaces → underscores)
   - PSREF pages are SPAs — use web search to cross-reference specs instead of direct fetching

3. **Verify specs** against PSREF data:
   - Processor: name, cores, threads, base/boost clocks, TDP
   - Display: size, resolution, panel type, refresh rate, nits, touch
   - RAM: size, type, speed, max size, slots, soldered
   - Storage: type, capacity, slots
   - Battery: Wh, removable
   - Weight (kg, starting weight)
   - Ports and wireless

4. **Report discrepancies** with format:

   ```
   [model.name] — PSREF: [value] vs Registry: [value]
   ```

5. **Fix confirmed mismatches** in `data/laptops.ts`.

6. **Add `psrefUrl`** if missing (required field).

7. **Run `npm run build`** to verify no type errors.

## PSREF URL Patterns

- Standard: `https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_{Model}_{MachineType}`
- Models with platform suffix: include `(Intel)` or `(AMD)` in name but not URL
- X1 2-in-1 Gen 9 uses hyphens: `Lenovo_ThinkPad_X1_2-in-1_Gen_9`
- Older models (T480, T480s) use 4-digit machine types

## Known Gotchas

- PSREF weight is "starting at" — use the lightest config
- T480 battery: 24Wh internal + external (Power Bridge) — use internal only (48Wh total) not combined
- X1 Nano Gen 3 battery is 49.5 Wh (not 49.6)
- PSREF RAM max may differ from actual max (check community reports)
