---
name: benchmark-update
description: Batch update CPU/GPU benchmark scores from public aggregate data
disable-model-invocation: true
---

# Batch Benchmark Update

Update CPU and/or GPU benchmark scores in bulk when new processors or GPUs are released.

## Steps

### CPU Benchmarks

1. **Read current data**: Load `data/cpu-benchmarks.ts` to see existing entries in both `cpuBenchmarks` (composite 0-100) and `cpuBenchmarksExpanded` (singleCore/multiCore/composite).
2. **Identify gaps**: Cross-reference processor names in `data/laptops.ts` (including `processorOptions`) — any CPU used by a model but missing from benchmarks is a gap.
3. **Research scores**: For each missing or outdated CPU, search for public Cinebench R23 / Geekbench 6 aggregates. Normalize to the 0-100 scale used in the file (reference: i9-14900HX = 95, i5-1235U = 42).
4. **Update entries**: Add or update entries in both `cpuBenchmarks` and `cpuBenchmarksExpanded`.
5. **Hardware guide**: For newly added CPUs, also add entries in `data/hardware-guide.ts` cpuGuide. Use `/hardware-update` skill.
6. **Verify**: Run `npm run validate && npm run build`.

### GPU Benchmarks

1. **Read current data**: Load `data/gpu-benchmarks.ts` to see existing entries.
2. **Identify gaps**: Cross-reference GPU names in `data/laptops.ts` (including `gpuOptions`).
3. **Research scores**: Search for 3DMark Time Spy / gaming benchmark aggregates. Use the `/add-gpu` skill format for new entries.
4. **Hardware guide**: For newly added GPUs, also add entries in `data/hardware-guide.ts` gpuGuide. Use `/hardware-update` skill.
5. **Verify**: Run `npm run validate && npm run build`.

## Scoring Reference (CPU)

| Tier       | Score Range | Example CPUs                          |
| ---------- | ----------- | ------------------------------------- |
| Ultra High | 90-100      | i9-14900HX, i9-13980HX                |
| High       | 70-89       | i7-14700HX, i7-13700H, Ryzen 9 7945HX |
| Mid-High   | 50-69       | i7-1365U, i7-1360P, Ryzen 7 7840U     |
| Mid        | 35-49       | i5-1345U, i5-1340P, Ryzen 5 7540U     |
| Low        | 15-34       | i5-1235U, i5-8250U                    |
| Ultra Low  | 0-14        | Older i3/Celeron                      |

## Output

```
## Benchmark Update Report

### CPUs Updated: [count]
- [CPU Name]: composite [old] → [new], single [old] → [new], multi [old] → [new]

### CPUs Added: [count]
- [CPU Name]: composite [score], single [score], multi [score]

### GPUs Updated/Added: [count]
- [GPU Name]: score [value], tier [tier]

### Still Missing: [count]
- [CPU/GPU Name] — used by [model IDs]
```
