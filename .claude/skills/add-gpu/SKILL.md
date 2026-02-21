---
name: add-gpu
description: Add a new GPU to the benchmarks database with scores and FPS estimates
---

# Add GPU to Benchmarks

Add a new GPU entry to `data/gpu-benchmarks.ts`.

## Steps

1. **Get GPU details** from the user: GPU name (must match `ThinkPad.gpu.name` values exactly)
2. **Research benchmarks** using web search for the GPU's 3DMark / gaming benchmarks
3. **Determine values**:
   - `score`: 0-100 relative to existing GPUs in the file (RTX 5000 Ada = 95, UHD 620 = 5)
   - `gamingTier`: "None" | "Light" | "Medium" | "Heavy"
   - `fpsEstimates`: Array of 6 games at 720p/1080p Low settings:
     - CS2, Valorant, Minecraft, League of Legends, Civilization VI, Stardew Valley
4. **Add the entry** to the `gpuBenchmarks` record in `data/gpu-benchmarks.ts`
5. **Add hardware guide entry** in `data/hardware-guide.ts` gpuGuide (if not already present):
   - Use `/hardware-update` skill for detailed workflow
   - Or use `/gpu-update` skill which handles all 3 GPU files together
6. **Verify**: Run `npm run validate && npm run build` to confirm no data or type errors

## Template

```typescript
"GPU Name Here": {
  gpuName: "GPU Name Here",
  score: 50,
  gamingTier: "Light",
  fpsEstimates: [
    { title: "CS2", resolution: "1080p", settings: "Low", fps: 45 },
    { title: "Valorant", resolution: "1080p", settings: "Low", fps: 90 },
    { title: "Minecraft", resolution: "1080p", settings: "Medium", fps: 60 },
    { title: "League of Legends", resolution: "1080p", settings: "Medium", fps: 80 },
    { title: "Civilization VI", resolution: "1080p", settings: "Low", fps: 40 },
    { title: "Stardew Valley", resolution: "1080p", settings: "N/A", fps: 60 },
  ],
},
```

## Gaming Tier Guidelines

- **None**: Integrated GPU < 15 score (UHD 620, old Intel HD)
- **Light**: 15-35 score, can run esports titles at 720p (Iris Xe, basic AMD integrated)
- **Medium**: 35-65 score, 1080p Low playable for most titles (Radeon 780M, RTX 500 Ada)
- **Heavy**: 65+ score, dedicated GPU for content creation + gaming (RTX 3000+, RTX 5000)
