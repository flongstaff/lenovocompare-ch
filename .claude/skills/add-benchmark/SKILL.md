---
name: add-benchmark
description: Add per-model benchmark data from NotebookCheck reviews to model-benchmarks.ts
model: sonnet
---

# Add Model Benchmark Data

Add chassis-level benchmark data for a specific laptop model to `data/model-benchmarks.ts`.

## Arguments

`/add-benchmark <model-id>` — e.g., `/add-benchmark x1-carbon-gen12`

## Steps

1. **Validate model exists** — Look up the model ID in `data/laptops.ts`. Abort if not found.
2. **Check existing entry** — Read `data/model-benchmarks.ts` to see if an entry already exists.
3. **Verify CPU raw data** — Check `data/cpu-benchmarks.ts` for Cinebench/Geekbench scores for this model's CPU. If missing, add them first.
4. **Research benchmark data** — Use web search and fetch to find NotebookCheck review for the model:
   - Search: `site:notebookcheck.net "{model name}" review`
   - Extract: thermals (keyboard/underside max °C), fan noise (dB), battery life (office/video hours), SSD speed, display brightness (measured), weight with charger
   - For Legion models: also look for Puget Premiere/DaVinci scores
5. **Add entry** to `data/model-benchmarks.ts` following the `ModelBenchmarks` interface
6. **Verify**: Run `npm run build`

## Template

```typescript
"model-id-here": {
  thermals: { keyboardMaxC: 42.0, undersideMaxC: 47.0 },
  fanNoise: 36.0,
  battery: { officeHours: 10.0, videoHours: 12.0 },
  batteryPerformance: { pluggedIn: 740, onBattery: 520 },
  ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5200 },
  displayBrightness: 400,
  weightWithChargerGrams: 1700,
  memoryBandwidthGBs: 68.0,
  sources: ["notebookcheck"],
},
```

## Field Guide

| Field                          | Unit  | Source                      | Notes                       |
| ------------------------------ | ----- | --------------------------- | --------------------------- |
| `thermals.keyboardMaxC`        | °C    | NotebookCheck "Emissions"   | Max surface temp under load |
| `thermals.undersideMaxC`       | °C    | NotebookCheck "Emissions"   | Bottom max temp under load  |
| `fanNoise`                     | dB(A) | NotebookCheck "Noise"       | Max load measurement        |
| `battery.officeHours`          | hours | NotebookCheck "Battery"     | Wi-Fi/office test           |
| `battery.videoHours`           | hours | NotebookCheck "Battery"     | Video playback test         |
| `batteryPerformance.pluggedIn` | score | NotebookCheck "Performance" | Cinebench multi, AC power   |
| `batteryPerformance.onBattery` | score | NotebookCheck "Performance" | Cinebench multi, battery    |
| `ssdSpeed.seqReadMBs`          | MB/s  | NotebookCheck "Storage"     | Sequential read             |
| `ssdSpeed.seqWriteMBs`         | MB/s  | NotebookCheck "Storage"     | Sequential write            |
| `displayBrightness`            | nits  | NotebookCheck "Display"     | Center measurement          |
| `weightWithChargerGrams`       | grams | NotebookCheck or spec       | Laptop + power adapter      |
| `memoryBandwidthGBs`           | GB/s  | NotebookCheck "Performance" | AIDA64 or similar           |
| `pugetPremiere`                | score | NotebookCheck or review     | PugetBench Premiere Pro     |
| `pugetDavinci`                 | score | NotebookCheck or review     | PugetBench DaVinci Resolve  |

## Sources

Only populate fields with real measured data. Set `sources` to the review sites used:

- `"notebookcheck"` — Primary source for all fields
- `"tomshardware"` — Alternative for US-focused reviews
- `"jarrodtech"` — YouTube/written reviews (good for gaming laptops)
- `"community"` — Aggregated from user reports

## Validation

- Thermals: keyboard 30–55°C, underside 35–60°C (higher = gaming laptops)
- Fan noise: 28–55 dB (ultrabooks ~33, gaming ~48+)
- Battery: 3–18 hours (gaming ~5, ultrabook ~12+)
- SSD: 2000–7500 MB/s read, 1500–6500 MB/s write
- Display brightness: 250–600 nits
