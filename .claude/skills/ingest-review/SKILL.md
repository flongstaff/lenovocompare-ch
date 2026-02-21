---
name: ingest-review
description: Ingest a laptop review (NotebookCheck, JustJoshTech, etc.) and extract benchmark data into model-benchmarks.ts
disable-model-invocation: true
---

# Ingest Review Skill

Extract benchmark data from a laptop review and update `data/model-benchmarks.ts`.

## Usage

```
/ingest-review <model-id> <source-url-or-pdf>
```

## Arguments

- `model-id`: The laptop ID from `data/laptops.ts` (e.g., `t14s-gen6-amd`, `legion-5i-16-gen9`)
- `source-url-or-pdf`: URL to the review page, or path to a downloaded PDF

## Workflow

### 1. Identify the source

Determine the `BenchmarkSource` from the URL or content:

- `notebookcheck` — notebookcheck.net reviews
- `jarrodtech` — Jarrod'sTech YouTube/written reviews
- `justjoshtech` — JustJoshTech reviews
- `tomshardware` — Tom's Hardware reviews
- `geekbench` — Geekbench browser results
- `community` — aggregated community data

Valid sources are defined in `lib/types.ts` as `BenchmarkSource`.

### 2. Extract benchmark data

Look for these data points in the review (all optional — extract whatever is available):

| Field                          | What to look for                       | Unit  |
| ------------------------------ | -------------------------------------- | ----- |
| `thermals.keyboardMaxC`        | Keyboard surface max temp under load   | °C    |
| `thermals.undersideMaxC`       | Bottom surface max temp under load     | °C    |
| `fanNoise`                     | Max fan noise under sustained load     | dB(A) |
| `battery.officeHours`          | Battery life — office/web browsing     | hours |
| `battery.videoHours`           | Battery life — video playback          | hours |
| `batteryPerformance.pluggedIn` | Cinebench 2024 Multi score plugged in  | score |
| `batteryPerformance.onBattery` | Cinebench 2024 Multi score on battery  | score |
| `ssdSpeed.seqReadMBs`          | Sequential read speed                  | MB/s  |
| `ssdSpeed.seqWriteMBs`         | Sequential write speed                 | MB/s  |
| `displayBrightness`            | Measured display brightness (not spec) | nits  |
| `weightWithChargerGrams`       | Total weight including charger         | grams |
| `memoryBandwidthGBs`           | Memory bandwidth                       | GB/s  |
| `pugetPremiere`                | PugetBench Premiere Pro score          | score |
| `pugetDavinci`                 | PugetBench DaVinci Resolve score       | score |

### 3. Compare with existing data

Read the current entry in `data/model-benchmarks.ts` for this model ID:

- If the entry has `sources: ["community"]`, the review data **replaces** it (more reliable)
- If the entry already has verified sources, **merge** — keep existing data, add new fields
- Show a comparison table of old vs new values before applying

### 4. Update model-benchmarks.ts

Edit the entry with extracted values. Always include:

- `sources: ["<source>"]` (or append to existing sources array)
- `sourceUrls: ["<url>"]` if a URL was provided (append to existing)

### 5. Cross-reference CPU benchmarks

If the review includes CPU benchmark scores (Cinebench 2024, Geekbench 6), check whether `data/cpu-benchmarks.ts` has matching or divergent values. Flag significant differences (>10%) but do NOT auto-update cpu-benchmarks.ts (those are cross-model averages).

### 6. Verify

Run `npm run build` to ensure no TypeScript errors after the update.

## Output

Present a summary table showing:

- Model ID and source
- Fields extracted vs fields already present
- Any values that changed significantly from community estimates
- CPU benchmark cross-reference notes (if applicable)

## Notes

- Thermal values should be surface temperatures, not internal CPU temps
- Battery hours should be realistic usage scenarios, not manufacturer claims
- Fan noise should be max sustained load, not idle
- SSD speeds should be sequential, not random IO
- Display brightness should be measured center-point, not spec sheet value
- If `batteryPerformance.onBattery >= batteryPerformance.pluggedIn`, this is valid (some laptops maintain performance on battery) — BatteryCompareBar handles this correctly
