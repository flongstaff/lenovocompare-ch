---
name: hardware-update
description: Add or update hardware guide entries when new CPUs/GPUs are added to benchmarks
---

# Hardware Guide Update

Add or update entries in `data/hardware-guide.ts` for CPUs and GPUs.

## Workflow

1. Read `data/cpu-benchmarks.ts` and `data/gpu-benchmarks.ts` to get the full list of hardware names
2. Read `data/hardware-guide.ts` to find which entries exist in `cpuGuide` and `gpuGuide`
3. Identify any CPUs/GPUs in benchmarks that are **missing** from the hardware guide
4. For each missing entry, create a `HardwareGuideEntry` with:
   - `summary` — 1-2 sentence overview of the chip's positioning and purpose
   - `strengths` — 4 bullet points on what the chip does well
   - `weaknesses` — 4 bullet points on limitations
   - `bestFor` — 4 use-case bullet points
   - `avoidIf` — 4 reasons to skip this chip
   - `thermalNotes` — thermal behaviour and cooling requirements
   - `generationContext` — where this chip sits in its product line history
   - `alternatives` — 2 alternative chips with comparison text
   - `architecture` — the microarchitecture name (e.g., "Meteor Lake", "Zen 4 (Hawk Point)")
5. If updating an existing entry, preserve the structure and tone of surrounding entries
6. Run `npm run build` to verify after changes

## Quality Guidelines

- Match the tone and detail level of existing entries in `hardware-guide.ts`
- Use factual, measurable claims (benchmark scores, TDP values, core counts)
- Alternatives should reference chips that actually exist in the benchmark database
- Architecture names should be consistent with existing entries
- Keep entries concise — users scan, they don't read essays
