---
name: compare-specs
description: Compare registry specs against PSREF data for accuracy
disable-model-invocation: true
---

# Compare Specs Against PSREF

Verify that ThinkPad specs in the registry match official Lenovo PSREF data.

## Arguments

Accepts an optional model name or ID. If not provided, checks all models.

## Workflow

1. **Read the registry**: Load all models from `data/laptops.ts` and the `ThinkPad` interface from `lib/types.ts`.

2. **For each model** (or the specified model):

   a. **Construct PSREF URL**: If the model has `psrefUrl`, use it directly. Otherwise, construct a search:
   - Base: `https://psref.lenovo.com/Product/ThinkPad/`
   - Pattern: `Lenovo_ThinkPad_{model name with underscores}`

   b. **Fetch PSREF page** using `fetch_content` or web search to get official specs.

   c. **Compare key fields**:
   | Field | Registry Key | PSREF Source |
   |-------|-------------|-------------|
   | CPU | `processor.name` | Processor section |
   | Cores/Threads | `processor.cores`/`threads` | Processor section |
   | TDP | `processor.tdp` | Processor section |
   | RAM | `ram.size`, `ram.type`, `ram.speed` | Memory section |
   | Max RAM | `ram.maxSize` | Memory section |
   | Display | `display.size`, `display.resolution` | Display section |
   | Weight | `weight` | Physical section |
   | Battery | `battery.whr` | Battery section |
   | Ports | `ports` array | I/O Ports section |

3. **Report per model**:

   ```
   ## [model.name]
   - ✅ CPU: matches (Intel Core Ultra 7 155U)
   - ⚠️ Weight: registry says 1.09kg, PSREF says 1.08kg (minor)
   - ❌ Max RAM: registry says 64GB, PSREF says 32GB (fix needed)
   - ℹ️ Missing psrefUrl — add: https://psref.lenovo.com/...
   ```

4. **Summary**: Total models checked, matches, minor discrepancies, errors needing fixes.
