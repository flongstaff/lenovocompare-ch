---
name: add-linux-compat
description: Add Linux compatibility data for a laptop model
---

# Add Linux Compatibility Entry

Add a new per-model Linux compatibility entry to `data/linux-compat.ts` for any lineup (ThinkPad, IdeaPad Pro, or Legion).

## Steps

1. **Get model ID** from the user (must match a key in `data/laptops.ts`)
2. **Research compatibility**:
   - Check Lenovo's Linux support page for certification status
   - Search for Ubuntu/Fedora/RHEL certification listings
   - Search forums (r/thinkpad, ThinkWiki) for driver reports
   - Check kernel changelogs for hardware enablement
3. **Build the entry** with all fields from `LinuxCompatEntry` type
4. **Add to `linuxCompat`** record in `data/linux-compat.ts`
5. **Verify**: Run `npm run build`

## Template

```typescript
"model-id-here": {
  laptopId: "model-id-here",
  certifiedDistros: ["Ubuntu 22.04", "RHEL 9"],
  recommendedKernel: "6.5+",
  driverNotes: [
    { component: "Wi-Fi", status: "works", notes: "Intel AX211, works OOB since kernel 5.18" },
    { component: "GPU", status: "works", notes: "Intel integrated, mesa driver" },
    { component: "Fingerprint", status: "partial", notes: "Synaptics, needs libfprint 1.94+" },
    { component: "Audio", status: "works", notes: "Realtek, works OOB" },
    { component: "Webcam", status: "works", notes: "Works OOB" },
    { component: "Bluetooth", status: "works", notes: "Intel AX211, works OOB" },
  ],
  fedoraNotes: "Fully supported on Fedora 39+. All hardware works out of the box.",
  generalNotes: "Well-supported model with no major issues.",
},
```

## Driver Status Values

- `"works"` — Functions out of the box or with standard drivers
- `"partial"` — Works with caveats (specific firmware, manual config)
- `"broken"` — Known non-functional, workaround may exist
- `"unknown"` — No reliable reports found

## Key Sources

- Lenovo Linux support: psref.lenovo.com (check OS compatibility tab)
- Ubuntu certification: ubuntu.com/certified/laptops
- Red Hat ecosystem catalog: catalog.redhat.com
- ThinkWiki: thinkwiki.de
- ArchWiki ThinkPad pages
- r/thinkpad, r/linuxhardware
