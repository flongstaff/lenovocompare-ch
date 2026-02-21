import { LinuxCompatEntry } from "@/lib/types";

/**
 * Per-model Linux compatibility data.
 * Based on publicly available Lenovo certification lists, community wikis, and kernel changelogs.
 */
export const linuxCompat: Record<string, LinuxCompatEntry> = {
  // === 2025 models ===
  "x1-carbon-gen13": {
    laptopId: "x1-carbon-gen13",
    certifiedDistros: ["Ubuntu 24.04 LTS", "RHEL 9.4"],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 — works with iwlwifi in 6.8+" },
      { component: "GPU", status: "works", notes: "Intel Arc 140V — i915/Xe driver, 6.8+ recommended" },
      { component: "Fingerprint", status: "works", notes: "Goodix reader — works with libfprint 1.94.7+" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware required" },
      { component: "Webcam", status: "works", notes: "MIPI camera works in 6.8+" },
    ],
    fedoraNotes: "Fedora 40+ works well out of the box. Lunar Lake Xe GPU needs mesa 24.1+.",
    generalNotes: "Excellent Linux laptop. Lunar Lake platform has strong upstream support.",
  },
  "x1-2in1-gen9": {
    laptopId: "x1-2in1-gen9",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 — iwlwifi 6.8+" },
      { component: "GPU", status: "works", notes: "Intel Arc 140V — Xe driver" },
      { component: "Fingerprint", status: "partial", notes: "Some reader variants need updated libfprint" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer works in Wayland" },
    ],
    fedoraNotes: "Fedora 40+ with Wayland recommended for best pen/touch support.",
    generalNotes: "Community-supported. Convertible features (tablet mode, pen) work well under Wayland.",
  },
  "t14s-gen6-amd": {
    laptopId: "t14s-gen6-amd",
    certifiedDistros: ["Ubuntu 24.04 LTS", "RHEL 9.4"],
    recommendedKernel: "6.7+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "MediaTek MT7922 or Qualcomm — check variant" },
      { component: "GPU", status: "works", notes: "AMD Radeon 780M — amdgpu, works out of the box" },
      { component: "Fingerprint", status: "works", notes: "Goodix/Synaptics — libfprint supported" },
      { component: "Audio", status: "works", notes: "AMD ACP — sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ works excellently. AMD platform has strong open-source driver stack.",
    generalNotes: "One of the best Linux ultrabooks available. OLED + AMD = great combo for Linux.",
  },
  "t14s-gen6-intel": {
    laptopId: "t14s-gen6-intel",
    certifiedDistros: ["Ubuntu 24.04 LTS", "RHEL 9.4"],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Arc 140V — Xe driver, 6.8+" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
    ],
    fedoraNotes: "Fedora 40+ recommended for Lunar Lake support.",
    generalNotes: "Certified. Lunar Lake efficient and well-supported upstream.",
  },
  "t14-gen6-intel": {
    laptopId: "t14-gen6-intel",
    certifiedDistros: ["Ubuntu 24.04 LTS"],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 40+ works well. Arrow Lake supported in recent kernels.",
    generalNotes: "Certified for Ubuntu. Upgradeable RAM is a plus for long-term Linux use.",
  },
  "t14-gen6-amd": {
    laptopId: "t14-gen6-amd",
    certifiedDistros: ["Ubuntu 24.04 LTS"],
    recommendedKernel: "6.7+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Qualcomm/MediaTek — check variant" },
      { component: "GPU", status: "works", notes: "AMD Radeon 780M — amdgpu" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "AMD ACP" },
    ],
    fedoraNotes: "Fedora 39+ works great. AMD drivers are fully open-source.",
    generalNotes: "Certified. Excellent Linux workstation with upgradeable RAM.",
  },

  // === 2024 models ===
  "x1-carbon-gen12": {
    laptopId: "x1-carbon-gen12",
    certifiedDistros: ["Ubuntu 22.04 LTS", "Ubuntu 24.04 LTS", "RHEL 9.3"],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics (MTL) — i915, 6.5+" },
      { component: "Fingerprint", status: "works", notes: "Goodix — libfprint 1.94.6+" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
      { component: "Webcam", status: "works", notes: "MIPI camera works in 6.5+" },
    ],
    fedoraNotes: "Fedora 39+ works out of the box. Meteor Lake well-supported.",
    generalNotes: "Fully certified, flagship Linux ultrabook. Excellent driver support.",
  },
  "x1-yoga-gen9": {
    laptopId: "x1-yoga-gen9",
    certifiedDistros: ["Ubuntu 22.04 LTS", "Ubuntu 24.04 LTS"],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer — Wayland recommended" },
    ],
    fedoraNotes: "Fedora 39+ works well. Use Wayland for best touchscreen/pen experience.",
    generalNotes: "Certified convertible. Pen input works well under Wayland.",
  },
  "t14s-gen5-intel": {
    laptopId: "t14s-gen5-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS", "Ubuntu 24.04 LTS", "RHEL 9.3"],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ works out of the box.",
    generalNotes: "Certified. Reliable Linux ultrabook.",
  },
  "t14s-gen5-amd": {
    laptopId: "t14s-gen5-amd",
    certifiedDistros: ["Ubuntu 22.04 LTS", "Ubuntu 24.04 LTS", "RHEL 9.3"],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Qualcomm QCNFA765 or MediaTek" },
      { component: "GPU", status: "works", notes: "AMD Radeon 780M — amdgpu, excellent" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "AMD ACP — sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ excellent. Best-in-class AMD iGPU performance on Linux.",
    generalNotes: "Certified. Radeon 780M iGPU has outstanding open-source driver support.",
  },
  "t14-gen5-intel": {
    laptopId: "t14-gen5-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS", "Ubuntu 24.04 LTS"],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ works well. Upgradeable RAM is great for Linux users.",
    generalNotes: "Certified. Solid choice with upgradeable RAM and Ethernet.",
  },
  "t14-gen5-amd": {
    laptopId: "t14-gen5-amd",
    certifiedDistros: ["Ubuntu 22.04 LTS", "Ubuntu 24.04 LTS"],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Qualcomm/MediaTek — variant dependent" },
      { component: "GPU", status: "works", notes: "AMD Radeon 740M — amdgpu" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "AMD ACP" },
    ],
    fedoraNotes: "Fedora 39+ works well.",
    generalNotes: "Certified. Good Linux workstation with upgradeable RAM.",
  },
  "t16-gen3-intel": {
    laptopId: "t16-gen3-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS", "Ubuntu 24.04 LTS"],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ works well. Large screen great for development.",
    generalNotes: 'Certified. 16" with dual M.2 slots — ideal Linux dev machine.',
  },
  "p16s-gen3-intel": {
    laptopId: "p16s-gen3-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS", "RHEL 9.3"],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU (iGPU)", status: "works", notes: "Intel Arc Graphics — i915" },
      {
        component: "GPU (dGPU)",
        status: "works",
        notes: "NVIDIA RTX 500 Ada — nvidia/nouveau, proprietary recommended",
      },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ with RPM Fusion for NVIDIA drivers. Use nvidia-prime for GPU switching.",
    generalNotes: "Certified. Discrete NVIDIA GPU requires proprietary drivers for best performance.",
  },
  "p14s-gen5-intel": {
    laptopId: "p14s-gen5-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS", "RHEL 9.3"],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU (iGPU)", status: "works", notes: "Intel Arc Graphics — i915" },
      { component: "GPU (dGPU)", status: "works", notes: "NVIDIA RTX 500 Ada — proprietary recommended" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ with RPM Fusion for NVIDIA. OLED works perfectly.",
    generalNotes: "Certified. Compact workstation with OLED and dGPU.",
  },
  "p1-gen7": {
    laptopId: "p1-gen7",
    certifiedDistros: [],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU (iGPU)", status: "works", notes: "Intel Arc Graphics — i915" },
      { component: "GPU (dGPU)", status: "works", notes: "NVIDIA RTX 3000 Ada — proprietary driver required" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ with RPM Fusion. Use nvidia-prime or envycontrol for GPU management.",
    generalNotes: "Community-supported. Powerful workstation — NVIDIA driver setup required.",
  },
  "l14-gen5-intel": {
    laptopId: "l14-gen5-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS", "Ubuntu 24.04 LTS"],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ works out of the box.",
    generalNotes: "Certified. Budget-friendly with excellent Linux support.",
  },
  "l14-gen5-amd": {
    laptopId: "l14-gen5-amd",
    certifiedDistros: [],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Qualcomm/Realtek — check variant" },
      { component: "GPU", status: "works", notes: "AMD Radeon 660M — amdgpu" },
      { component: "Fingerprint", status: "partial", notes: "Some variants may need updated libfprint" },
      { component: "Audio", status: "works", notes: "AMD ACP" },
    ],
    fedoraNotes: "Fedora 39+ works. May need firmware updates for some Wi-Fi variants.",
    generalNotes: "Community-supported. Good budget Linux option with upgradeable RAM.",
  },
  "l16-gen3-intel": {
    laptopId: "l16-gen3-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS", "Ubuntu 24.04 LTS"],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ works out of the box.",
    generalNotes: 'Certified. Budget 16" with good Linux compatibility.',
  },
  "e14-gen6-intel": {
    laptopId: "e14-gen6-intel",
    certifiedDistros: [],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics — i915" },
      { component: "Fingerprint", status: "partial", notes: "Variant-dependent, check libfprint support" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ works. Budget entry point for Linux.",
    generalNotes: "Community-supported but generally works well.",
  },
  "e16-gen2-amd": {
    laptopId: "e16-gen2-amd",
    certifiedDistros: [],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Realtek/MediaTek — variant dependent" },
      { component: "GPU", status: "works", notes: "AMD Radeon 660M — amdgpu" },
      { component: "Fingerprint", status: "partial", notes: "Varies by SKU" },
      { component: "Audio", status: "works", notes: "AMD ACP" },
    ],
    fedoraNotes: "Fedora 39+ generally works. Check Wi-Fi variant before buying.",
    generalNotes: 'Community-supported. Budget 16" option.',
  },
  "x13-gen5": {
    laptopId: "x13-gen5",
    certifiedDistros: ["Ubuntu 22.04 LTS", "Ubuntu 24.04 LTS"],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ works out of the box.",
    generalNotes: "Certified. Compact and portable with solid Linux support.",
  },

  // === 2023 models ===
  "x1-carbon-gen11": {
    laptopId: "x1-carbon-gen11",
    certifiedDistros: ["Ubuntu 22.04 LTS", "RHEL 9.2"],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 38+ works perfectly.",
    generalNotes: "Certified. Mature platform with excellent driver support.",
  },
  "x1-nano-gen3": {
    laptopId: "x1-nano-gen3",
    certifiedDistros: [],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 38+ works well.",
    generalNotes: "Community-supported. Sub-1kg ultralight with good Linux compat.",
  },
  "x13-gen4-intel": {
    laptopId: "x13-gen4-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 38+ works.",
    generalNotes: 'Certified. Compact 13" with solid Linux support.',
  },
  "x1-yoga-gen8": {
    laptopId: "x1-yoga-gen8",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer — Wayland recommended" },
    ],
    fedoraNotes: "Fedora 38+ works. Wayland for best pen experience.",
    generalNotes: "Certified. Convertible with good Linux pen support.",
  },
  "t14-gen4-intel": {
    laptopId: "t14-gen4-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 38+ works.",
    generalNotes: "Certified. Solid workhorse with upgradeable RAM.",
  },
  "t14-gen4-amd": {
    laptopId: "t14-gen4-amd",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Qualcomm QCNFA765" },
      { component: "GPU", status: "works", notes: "AMD Radeon 780M — amdgpu, excellent" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "AMD ACP" },
    ],
    fedoraNotes: "Fedora 38+ works excellently. AMD stack is fully open-source.",
    generalNotes: "Certified. Great Linux workhorse with Radeon 780M iGPU.",
  },
  "t14s-gen4-intel": {
    laptopId: "t14s-gen4-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 38+ works.",
    generalNotes: "Certified. Slim and light with good driver support.",
  },
  "t14s-gen4-amd": {
    laptopId: "t14s-gen4-amd",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Qualcomm QCNFA765" },
      { component: "GPU", status: "works", notes: "AMD Radeon 780M — amdgpu" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "AMD ACP" },
    ],
    fedoraNotes: "Fedora 38+ excellent. Radeon 780M has great open-source support.",
    generalNotes: "Certified. OLED + AMD Radeon 780M — popular Linux choice.",
  },
  "t16-gen2-intel": {
    laptopId: "t16-gen2-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 38+ works.",
    generalNotes: 'Certified. 16" workhorse with dual M.2.',
  },
  "l14-gen4-intel": {
    laptopId: "l14-gen4-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 38+ works.",
    generalNotes: "Certified. Budget with upgradeable RAM.",
  },
  "e14-gen5": {
    laptopId: "e14-gen5",
    certifiedDistros: [],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Realtek/MediaTek — check variant" },
      { component: "GPU", status: "works", notes: "AMD Radeon 660M — amdgpu" },
      { component: "Fingerprint", status: "partial", notes: "Variant-dependent" },
      { component: "Audio", status: "works", notes: "AMD ACP" },
    ],
    fedoraNotes: "Fedora 38+ generally works. Wi-Fi variant may need firmware.",
    generalNotes: "Community-supported. Budget AMD option.",
  },
  "p14s-gen4": {
    laptopId: "p14s-gen4",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU (iGPU)", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "GPU (dGPU)", status: "works", notes: "NVIDIA T550 — proprietary recommended" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 38+ with RPM Fusion for NVIDIA T550 drivers.",
    generalNotes: "Certified. Compact workstation with OLED.",
  },
  "p16s-gen2": {
    laptopId: "p16s-gen2",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU (iGPU)", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "GPU (dGPU)", status: "works", notes: "NVIDIA T550 — proprietary recommended" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 38+ with RPM Fusion for NVIDIA.",
    generalNotes: 'Certified. 16" workstation with upgradeable RAM and dual M.2.',
  },
  "p16-gen2": {
    laptopId: "p16-gen2",
    certifiedDistros: [],
    recommendedKernel: "6.2+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU (iGPU)", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "GPU (dGPU)", status: "works", notes: "NVIDIA RTX 5000 Ada — proprietary driver required" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 38+ with RPM Fusion. High-end NVIDIA needs proprietary stack.",
    generalNotes: "Community-supported. Powerhouse workstation — NVIDIA setup required.",
  },

  // === 2022 models ===
  "x1-carbon-gen10": {
    laptopId: "x1-carbon-gen10",
    certifiedDistros: ["Ubuntu 22.04 LTS", "RHEL 9.0"],
    recommendedKernel: "5.19+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 37+ works. Mature Alder Lake support.",
    generalNotes: "Certified. Well-established Linux laptop with great community support.",
  },
  "x1-yoga-gen7": {
    laptopId: "x1-yoga-gen7",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "5.19+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer works" },
    ],
    fedoraNotes: "Fedora 37+ works. Wayland recommended for pen.",
    generalNotes: "Certified. Mature convertible with good Linux support.",
  },
  "x1-nano-gen2": {
    laptopId: "x1-nano-gen2",
    certifiedDistros: [],
    recommendedKernel: "5.19+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 37+ works.",
    generalNotes: "Community-supported. Ultra-lightweight with good driver support.",
  },
  "t14-gen3-intel": {
    laptopId: "t14-gen3-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "5.19+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 37+ works.",
    generalNotes: "Certified. Reliable business laptop.",
  },
  "t14-gen3-amd": {
    laptopId: "t14-gen3-amd",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "5.19+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Qualcomm/MediaTek" },
      { component: "GPU", status: "works", notes: "AMD Radeon 680M — amdgpu" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "AMD ACP" },
    ],
    fedoraNotes: "Fedora 37+ works. Radeon 680M has good open-source support.",
    generalNotes: "Certified. Good AMD option with upgradeable RAM.",
  },
  "t14s-gen3-intel": {
    laptopId: "t14s-gen3-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "5.19+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 37+ works.",
    generalNotes: "Certified. Slim ultrabook with mature Linux support.",
  },
  "t14s-gen3-amd": {
    laptopId: "t14s-gen3-amd",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "5.19+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Qualcomm/MediaTek" },
      { component: "GPU", status: "works", notes: "AMD Radeon 680M — amdgpu" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "AMD ACP" },
    ],
    fedoraNotes: "Fedora 37+ works. Good AMD ultrabook for Linux.",
    generalNotes: "Certified. LPDDR5 + Radeon 680M.",
  },
  "t16-gen1-intel": {
    laptopId: "t16-gen1-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "5.19+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 37+ works.",
    generalNotes: 'Certified. First-gen 16" T-series with dual M.2.',
  },
  "l14-gen3-intel": {
    laptopId: "l14-gen3-intel",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "5.19+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 37+ works.",
    generalNotes: "Certified. Budget with upgradeable RAM.",
  },
  "e14-gen4": {
    laptopId: "e14-gen4",
    certifiedDistros: [],
    recommendedKernel: "5.19+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Fingerprint", status: "partial", notes: "Variant-dependent" },
      { component: "Audio", status: "works", notes: "sof-firmware" },
    ],
    fedoraNotes: "Fedora 37+ works.",
    generalNotes: "Community-supported. Budget entry.",
  },

  // === 2018 models ===
  t480: {
    laptopId: "t480",
    certifiedDistros: ["Ubuntu 18.04 LTS", "Ubuntu 20.04 LTS"],
    recommendedKernel: "4.18+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel 8265 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel UHD 620 — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "Intel HDA" },
    ],
    fedoraNotes: "Any recent Fedora works. Legendary Linux laptop.",
    generalNotes: "Certified. The classic Linux ThinkPad — removable battery, upgradeable everything.",
  },
  t480s: {
    laptopId: "t480s",
    certifiedDistros: ["Ubuntu 18.04 LTS", "Ubuntu 20.04 LTS"],
    recommendedKernel: "4.18+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel 8265 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel UHD 620 — i915" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "Intel HDA" },
    ],
    fedoraNotes: "Any recent Fedora works perfectly.",
    generalNotes: "Certified. Slim variant of the T480 — excellent Linux support.",
  },

  // === Yoga / 2-in-1 convertibles ===
  "x1-yoga-3rd": {
    laptopId: "x1-yoga-3rd",
    certifiedDistros: ["Ubuntu 18.04 LTS"],
    recommendedKernel: "4.18+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel 8265 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel UHD 620 — i915" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer — works in X11 and Wayland" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "Intel HDA" },
    ],
    fedoraNotes: "Any recent Fedora works perfectly.",
    generalNotes: "Mature hardware, excellent Linux support. Pen and touch work well under Wayland.",
  },
  "x1-yoga-4th": {
    laptopId: "x1-yoga-4th",
    certifiedDistros: ["Ubuntu 18.04 LTS", "Ubuntu 20.04 LTS"],
    recommendedKernel: "4.18+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX200 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel UHD 620 — i915" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer — full pen support" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "Intel HDA" },
    ],
    fedoraNotes: "Fedora 31+ works well.",
    generalNotes: "Certified. The first X1 Yoga with aluminium roll-cage — solid Linux convertible.",
  },
  "x1-yoga-gen5": {
    laptopId: "x1-yoga-gen5",
    certifiedDistros: ["Ubuntu 20.04 LTS"],
    recommendedKernel: "5.4+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX201 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel UHD — i915" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware recommended" },
    ],
    fedoraNotes: "Fedora 33+ works well.",
    generalNotes: "Certified. Comet Lake platform is well-supported. Pen works in both X11 and Wayland.",
  },
  "x1-yoga-gen6": {
    laptopId: "x1-yoga-gen6",
    certifiedDistros: ["Ubuntu 20.04 LTS", "RHEL 8.4"],
    recommendedKernel: "5.11+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX201 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915, kernel 5.11+" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer — Wayland recommended" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Thunderbolt", status: "works", notes: "TB4 works — early kernels had dock wake issues" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 34+ recommended for Tiger Lake Xe driver maturity.",
    generalNotes:
      "Certified. Tiger Lake Iris Xe requires kernel 5.11+ for stable graphics. Thunderbolt 4 docks work well on recent kernels.",
  },
  "x1-titanium-yoga": {
    laptopId: "x1-titanium-yoga",
    certifiedDistros: [],
    recommendedKernel: "5.11+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX201 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer — 3:2 aspect works correctly" },
      {
        component: "Audio",
        status: "partial",
        notes: "sof-firmware required — some early units had speaker routing issues",
      },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
    ],
    fedoraNotes: "Fedora 34+ recommended. The 3:2 display requires no special configuration.",
    generalNotes:
      "Community-supported. Unique titanium chassis with 3:2 display. All major hardware works but less community testing than mainstream X1 models.",
  },
  "x1-2in1-gen10": {
    laptopId: "x1-2in1-gen10",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 — iwlwifi 6.8+" },
      { component: "GPU", status: "works", notes: "Intel Arc 130V/140V — Xe driver" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer — Wayland recommended" },
      { component: "Fingerprint", status: "partial", notes: "Some reader variants need updated libfprint" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 40+ with Wayland for best pen/touch support.",
    generalNotes:
      "Community-supported. Lunar Lake platform has good upstream support. Same platform as X1 2-in-1 Gen 9.",
  },
  "x13-yoga-gen1": {
    laptopId: "x13-yoga-gen1",
    certifiedDistros: ["Ubuntu 20.04 LTS"],
    recommendedKernel: "5.4+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX201 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel UHD — i915" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "Intel HDA" },
    ],
    fedoraNotes: "Fedora 33+ works well.",
    generalNotes: "Certified. Compact 13-inch convertible with mature Comet Lake platform.",
  },
  "x13-yoga-gen2": {
    laptopId: "x13-yoga-gen2",
    certifiedDistros: ["Ubuntu 20.04 LTS"],
    recommendedKernel: "5.11+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX201 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915, kernel 5.11+" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer — Wayland recommended" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 34+ for Tiger Lake Xe support.",
    generalNotes: "Community-supported. Tiger Lake platform works well on modern kernels. Compact convertible.",
  },
  "x13-yoga-gen3": {
    laptopId: "x13-yoga-gen3",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "5.17+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 36+ works well. Alder Lake is well-supported.",
    generalNotes: "Certified. 12th Gen Alder Lake hybrid architecture well-supported in kernel 5.17+.",
  },
  "x13-yoga-gen4": {
    laptopId: "x13-yoga-gen4",
    certifiedDistros: ["Ubuntu 22.04 LTS"],
    recommendedKernel: "6.1+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Touchscreen", status: "works", notes: "Wacom digitizer" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 38+ works well.",
    generalNotes: "Certified. Raptor Lake U-series is a minor refresh of Alder Lake — very stable Linux support.",
  },
  "l13-yoga-gen1": {
    laptopId: "l13-yoga-gen1",
    certifiedDistros: [],
    recommendedKernel: "5.4+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX200 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel UHD — i915" },
      { component: "Touchscreen", status: "works", notes: "Capacitive touch — basic pen support" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "Intel HDA" },
    ],
    fedoraNotes: "Fedora 33+ works well.",
    generalNotes: "Community-supported. Budget convertible with Comet Lake — all hardware works.",
  },
  "l13-yoga-gen2-intel": {
    laptopId: "l13-yoga-gen2-intel",
    certifiedDistros: [],
    recommendedKernel: "5.11+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX201 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Touchscreen", status: "works", notes: "Capacitive touch" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 34+ for Tiger Lake support.",
    generalNotes: "Community-supported. Budget Tiger Lake convertible — works well on modern kernels.",
  },
  "l13-yoga-gen2-amd": {
    laptopId: "l13-yoga-gen2-amd",
    certifiedDistros: [],
    recommendedKernel: "5.11+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "MediaTek MT7921 or Intel variant" },
      { component: "GPU", status: "works", notes: "AMD Radeon Graphics — amdgpu, works out of the box" },
      { component: "Touchscreen", status: "works", notes: "Capacitive touch" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "AMD ACP" },
    ],
    fedoraNotes: "Fedora 34+ works well. AMD drivers are excellent out of the box.",
    generalNotes: "Community-supported. Strong AMD open-source driver stack makes this a good Linux choice.",
  },
  "l13-yoga-gen3-intel": {
    laptopId: "l13-yoga-gen3-intel",
    certifiedDistros: [],
    recommendedKernel: "5.17+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Touchscreen", status: "works", notes: "Capacitive touch" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 36+ for Alder Lake support.",
    generalNotes: "Community-supported. Alder Lake 12th Gen is well-supported.",
  },
  "l13-yoga-gen3-amd": {
    laptopId: "l13-yoga-gen3-amd",
    certifiedDistros: [],
    recommendedKernel: "5.17+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "MediaTek MT7921 or Qualcomm variant" },
      { component: "GPU", status: "works", notes: "AMD Radeon Graphics — amdgpu" },
      { component: "Touchscreen", status: "works", notes: "Capacitive touch" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "AMD ACP" },
    ],
    fedoraNotes: "Fedora 36+ works well. AMD open-source stack is solid.",
    generalNotes: "Community-supported. Ryzen PRO 5000 refresh — mature drivers, reliable.",
  },
  "l13-yoga-gen4-intel": {
    laptopId: "l13-yoga-gen4-intel",
    certifiedDistros: [],
    recommendedKernel: "6.1+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe — i915" },
      { component: "Touchscreen", status: "works", notes: "Capacitive touch" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 38+ works well.",
    generalNotes: "Community-supported. Raptor Lake U-series — stable Linux support.",
  },
  "l13-yoga-gen4-amd": {
    laptopId: "l13-yoga-gen4-amd",
    certifiedDistros: [],
    recommendedKernel: "6.1+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "MediaTek or Qualcomm variant" },
      { component: "GPU", status: "works", notes: "AMD Radeon Graphics — amdgpu" },
      { component: "Touchscreen", status: "works", notes: "Capacitive touch" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "AMD ACP" },
    ],
    fedoraNotes: "Fedora 38+ works well.",
    generalNotes: "Community-supported. Ryzen PRO 7000 rebadge of Zen 3 — very mature drivers.",
  },
  "l13-2in1-gen5-intel": {
    laptopId: "l13-2in1-gen5-intel",
    certifiedDistros: [],
    recommendedKernel: "6.6+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics — i915" },
      { component: "Touchscreen", status: "works", notes: "Capacitive touch" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 39+ recommended for Meteor Lake support.",
    generalNotes: "Community-supported. Rebranded from L13 Yoga — Meteor Lake U-series.",
  },
  "l13-2in1-gen6-intel": {
    laptopId: "l13-2in1-gen6-intel",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 — iwlwifi 6.8+" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics — Xe driver" },
      { component: "Touchscreen", status: "works", notes: "Capacitive touch" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 40+ recommended for Arrow Lake support.",
    generalNotes: "Community-supported. Arrow Lake U-series — latest generation.",
  },
  "l13-2in1-gen6-amd": {
    laptopId: "l13-2in1-gen6-amd",
    certifiedDistros: [],
    recommendedKernel: "6.7+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "MediaTek MT7922 or Qualcomm" },
      { component: "GPU", status: "works", notes: "AMD Radeon 740M — amdgpu" },
      { component: "Touchscreen", status: "works", notes: "Capacitive touch" },
      { component: "Fingerprint", status: "works", notes: "libfprint supported" },
      { component: "Audio", status: "works", notes: "AMD ACP — sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ works well. AMD Hawk Point has strong open-source support.",
    generalNotes: "Community-supported. Ryzen PRO 8000 with modern AMD driver stack.",
  },

  // === IdeaPad Pro models ===
  "ideapad-pro-5-14-gen8-amd": {
    laptopId: "ideapad-pro-5-14-gen8-amd",
    certifiedDistros: [],
    recommendedKernel: "6.5+",
    driverNotes: [
      {
        component: "Wi-Fi",
        status: "works",
        notes: "MediaTek MT7922 or Realtek — check variant; mt7921e works in 6.5+",
      },
      { component: "GPU", status: "works", notes: "AMD Radeon 740M — amdgpu, fully open-source" },
      { component: "Fingerprint", status: "partial", notes: "Some variants not yet in libfprint — check sensor model" },
      { component: "Audio", status: "works", notes: "AMD ACP — sof-firmware required" },
    ],
    fedoraNotes: "Fedora 39+ recommended. AMD Ryzen 7000 has solid open-source support.",
    generalNotes:
      "Community-supported. AMD Ryzen 7000 series — good baseline Linux compatibility with standard amdgpu stack.",
  },
  "ideapad-pro-5-16-gen8-amd": {
    laptopId: "ideapad-pro-5-16-gen8-amd",
    certifiedDistros: [],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "MediaTek MT7922 or Realtek — mt7921e works in 6.5+" },
      { component: "GPU", status: "works", notes: "AMD Radeon 740M — amdgpu" },
      {
        component: "Fingerprint",
        status: "partial",
        notes: "Sensor variant may not be in libfprint — verify before purchase",
      },
      { component: "Audio", status: "works", notes: "AMD ACP — sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ recommended. AMD platform is well-supported.",
    generalNotes: 'Community-supported. 16" AMD Ryzen 7000 model — standard Linux compatibility.',
  },
  "ideapad-pro-5i-14-gen8": {
    laptopId: "ideapad-pro-5i-14-gen8",
    certifiedDistros: [],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi, works in 6.5+" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe / Intel Arc (13th gen) — i915" },
      { component: "Fingerprint", status: "partial", notes: "Goodix reader — may need libfprint 1.94.6+" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
    ],
    fedoraNotes: "Fedora 39+ works well. Intel 13th gen (Raptor Lake) has mature kernel support.",
    generalNotes: "Community-supported. Intel 13th gen platform — stable Linux experience with standard Intel drivers.",
  },
  "ideapad-pro-5i-16-gen8": {
    laptopId: "ideapad-pro-5i-16-gen8",
    certifiedDistros: [],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      { component: "GPU", status: "works", notes: "Intel Iris Xe / Intel Arc — i915" },
      { component: "Fingerprint", status: "partial", notes: "libfprint 1.94.6+ may be required" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 39+ recommended. Raptor Lake well-supported upstream.",
    generalNotes: 'Community-supported. 16" Intel 13th gen — solid Linux compatibility.',
  },
  "ideapad-pro-5-14-gen9-amd": {
    laptopId: "ideapad-pro-5-14-gen9-amd",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "MediaTek MT7925 or Qualcomm — mt7925e requires 6.8+" },
      { component: "GPU", status: "works", notes: "AMD Radeon 780M — amdgpu, well-supported" },
      {
        component: "Fingerprint",
        status: "partial",
        notes: "Fingerprint sensor variant may not be in libfprint — verify",
      },
      { component: "Audio", status: "works", notes: "AMD ACP — sof-firmware" },
    ],
    fedoraNotes: "Fedora 40+ recommended. AMD Ryzen 8000 (Hawk Point/Strix Point) has excellent open-source support.",
    generalNotes: "Community-supported. AMD Ryzen 8000 series — strong amdgpu driver stack, good daily driver.",
  },
  "ideapad-pro-5-16-gen9-amd": {
    laptopId: "ideapad-pro-5-16-gen9-amd",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "MediaTek MT7925 or Qualcomm — 6.8+ required for MT7925" },
      { component: "GPU", status: "works", notes: "AMD Radeon 780M — amdgpu" },
      { component: "Fingerprint", status: "partial", notes: "Sensor model varies — check libfprint compatibility" },
      { component: "Audio", status: "works", notes: "AMD ACP — sof-firmware" },
    ],
    fedoraNotes: "Fedora 40+ recommended. AMD platform works well out of the box.",
    generalNotes: 'Community-supported. 16" AMD Ryzen 8000 — larger screen with full amdgpu support.',
  },
  "ideapad-pro-5i-14-gen9": {
    laptopId: "ideapad-pro-5i-14-gen9",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 or AX211 — iwlwifi, BE200 needs 6.8+" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics (Meteor Lake) — i915/Xe, 6.8+" },
      { component: "Fingerprint", status: "partial", notes: "Goodix reader — libfprint 1.94.7+ recommended" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
    ],
    fedoraNotes: "Fedora 40+ recommended. Intel Core Ultra 100 (Meteor Lake) supported from 6.8+.",
    generalNotes:
      "Community-supported. Intel Core Ultra 100 series — Meteor Lake Xe graphics work with updated drivers.",
  },
  "ideapad-pro-5i-16-gen9": {
    laptopId: "ideapad-pro-5i-16-gen9",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 or AX211 — iwlwifi, BE200 needs 6.8+" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics (Meteor Lake) — i915/Xe" },
      { component: "Fingerprint", status: "partial", notes: "libfprint 1.94.7+ recommended" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 40+ recommended for Intel Core Ultra 100 support.",
    generalNotes: 'Community-supported. 16" Intel Core Ultra 100 — Meteor Lake with Xe iGPU.',
  },
  "ideapad-pro-5-14-gen10-amd": {
    laptopId: "ideapad-pro-5-14-gen10-amd",
    certifiedDistros: [],
    recommendedKernel: "6.10+",
    driverNotes: [
      {
        component: "Wi-Fi",
        status: "works",
        notes: "MediaTek MT7925 or Qualcomm — 6.10+ recommended for full support",
      },
      { component: "GPU", status: "works", notes: "AMD Radeon 890M (Ryzen AI 300) — amdgpu, 6.10+" },
      { component: "Fingerprint", status: "partial", notes: "Ryzen AI 300 era sensor — verify libfprint support" },
      { component: "Audio", status: "works", notes: "AMD ACP — sof-firmware" },
      { component: "NPU", status: "partial", notes: "AMD XDNA2 NPU — experimental in-kernel support, 6.10+" },
    ],
    fedoraNotes: "Fedora 41+ recommended. Ryzen AI 300 (Strix Point) requires 6.10+ for full feature support.",
    generalNotes:
      "Community-supported. AMD Ryzen AI 300 — cutting-edge platform, strong amdgpu support, NPU still maturing.",
  },
  "ideapad-pro-5-16-gen10-amd": {
    laptopId: "ideapad-pro-5-16-gen10-amd",
    certifiedDistros: [],
    recommendedKernel: "6.10+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "MediaTek MT7925 or Qualcomm — 6.10+ for full compatibility" },
      { component: "GPU", status: "works", notes: "AMD Radeon 890M — amdgpu, 6.10+" },
      { component: "Fingerprint", status: "partial", notes: "Sensor variant may need updated libfprint" },
      { component: "Audio", status: "works", notes: "AMD ACP — sof-firmware" },
      { component: "NPU", status: "partial", notes: "AMD XDNA2 NPU — in-kernel support still maturing" },
    ],
    fedoraNotes: "Fedora 41+ recommended. Ryzen AI 300 has strong community traction.",
    generalNotes: 'Community-supported. 16" AMD Ryzen AI 300 — large format with excellent amdgpu stack.',
  },
  "ideapad-pro-5i-14-gen10": {
    laptopId: "ideapad-pro-5i-14-gen10",
    certifiedDistros: [],
    recommendedKernel: "6.10+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 — iwlwifi, 6.8+; full support in 6.10+" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics (Arrow Lake / Lunar Lake) — Xe driver, 6.10+" },
      { component: "Fingerprint", status: "partial", notes: "libfprint 1.94.7+ recommended" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
    ],
    fedoraNotes: "Fedora 41+ recommended. Intel Core Ultra 200 platform supported in 6.10+.",
    generalNotes:
      "Community-supported. Intel Core Ultra 200 (Arrow Lake/Lunar Lake) — newer platform, driver support improving.",
  },
  "ideapad-pro-5i-16-gen10": {
    laptopId: "ideapad-pro-5i-16-gen10",
    certifiedDistros: [],
    recommendedKernel: "6.10+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 — iwlwifi 6.10+" },
      { component: "GPU", status: "works", notes: "Intel Arc Graphics (Arrow Lake) — Xe driver" },
      { component: "Fingerprint", status: "partial", notes: "libfprint 1.94.7+ may be required" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 41+ recommended. Intel Core Ultra 200 needs kernel 6.10+ for best results.",
    generalNotes: 'Community-supported. 16" Intel Core Ultra 200 — largest IdeaPad Pro format, driver stack maturing.',
  },
  "ideapad-pro-7-14-gen9": {
    laptopId: "ideapad-pro-7-14-gen9",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 or AX211 — iwlwifi; BE200 needs 6.8+" },
      { component: "GPU (iGPU)", status: "works", notes: "Intel Arc Graphics (Meteor Lake) — i915/Xe, 6.8+" },
      {
        component: "GPU (dGPU)",
        status: "partial",
        notes: "NVIDIA RTX 4050/4060 (if equipped) — proprietary drivers recommended; nouveau limited",
      },
      { component: "Fingerprint", status: "partial", notes: "Goodix reader — libfprint 1.94.7+ recommended" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
    ],
    fedoraNotes:
      "Fedora 40+ recommended. Use RPM Fusion for NVIDIA drivers if dGPU equipped. GPU switching via nvidia-prime.",
    generalNotes:
      'Community-supported. Premium 14" Intel Core Ultra 100 — NVIDIA dGPU variant requires proprietary drivers for full performance.',
  },
  "ideapad-pro-7-16-gen9": {
    laptopId: "ideapad-pro-7-16-gen9",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 or AX211 — iwlwifi; BE200 needs 6.8+" },
      { component: "GPU (iGPU)", status: "works", notes: "Intel Arc Graphics (Meteor Lake) — i915/Xe" },
      {
        component: "GPU (dGPU)",
        status: "partial",
        notes: "NVIDIA RTX 4060/4070 (if equipped) — proprietary drivers recommended; nouveau limited",
      },
      { component: "Fingerprint", status: "partial", notes: "libfprint 1.94.7+ recommended" },
      { component: "Audio", status: "works", notes: "sof-firmware required" },
    ],
    fedoraNotes: "Fedora 40+ recommended. RPM Fusion required for NVIDIA dGPU. Optimus/prime-run for GPU switching.",
    generalNotes:
      'Community-supported. Premium 16" Intel Core Ultra 100 — strong Linux base, NVIDIA dGPU adds complexity.',
  },

  // === Legion (2024, Gen 9) ===
  "legion-5-16-gen9-amd": {
    laptopId: "legion-5-16-gen9-amd",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi, well-supported on 6.5+" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 4050/4060 Laptop — proprietary driver required; nouveau limited to basic display",
      },
      { component: "Fingerprint", status: "partial", notes: "Synaptics reader — libfprint support varies by SKU" },
      { component: "Audio", status: "works", notes: "Realtek HDA — standard ALSA/PulseAudio" },
    ],
    fedoraNotes:
      "Fedora 40+ recommended. Install RPM Fusion for NVIDIA drivers. Use prime-run or nvidia-prime for discrete GPU switching. GNOME Wayland works with NVIDIA 530+ driver.",
    generalNotes:
      "Community-supported. AMD Ryzen 7 8845HS (Phoenix 2) is well-supported in kernel 6.5+. NVIDIA dGPU requires proprietary drivers for gaming — nouveau inadequate for 3D. AMD iGPU (Radeon 780M) available via amdgpu driver as fallback.",
  },
  "legion-5i-16-gen9": {
    laptopId: "legion-5i-16-gen9",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi, solid support on 6.5+" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 4050/4060/4070 Laptop — NVIDIA proprietary driver required; nouveau limited",
      },
      { component: "Fingerprint", status: "partial", notes: "Synaptics or Goodix — libfprint 1.94.7+" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware recommended" },
    ],
    fedoraNotes:
      "Fedora 40+ recommended. RPM Fusion required for NVIDIA drivers. Intel Core i7-14700HX Raptor Lake Refresh is well-supported from 6.5+.",
    generalNotes:
      "Community-supported. Intel Core i7-14700HX with NVIDIA dGPU — standard NVIDIA Optimus laptop setup under Linux. Use prime-run for GPU switching. Intel iGPU drives display by default.",
  },
  "legion-7i-16-gen9": {
    laptopId: "legion-7i-16-gen9",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 4070/4080 Laptop — NVIDIA proprietary driver required; nouveau limited",
      },
      { component: "Fingerprint", status: "partial", notes: "libfprint — verify sensor model before deployment" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
      { component: "SD Card Reader", status: "works", notes: "Realtek RTS5227S — standard kernel driver" },
    ],
    fedoraNotes:
      "Fedora 40+ recommended. RPM Fusion for NVIDIA. Core i9-14900HX is fully supported. High GPU TGP — ensure power delivery is configured correctly under NVIDIA driver.",
    generalNotes:
      "Community-supported. Flagship Intel Legion — Core i9-14900HX + RTX 4070/4080 Laptop. NVIDIA proprietary driver essential for gaming performance. Thunderbolt 4 works with recent kernels.",
  },
  "legion-pro-5-16-gen9-amd": {
    laptopId: "legion-pro-5-16-gen9-amd",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 4070 Laptop — NVIDIA proprietary driver required; nouveau limited",
      },
      { component: "Fingerprint", status: "partial", notes: "Synaptics sensor — libfprint support varies" },
      { component: "Audio", status: "works", notes: "Realtek HDA — ALSA/PulseAudio" },
    ],
    fedoraNotes:
      "Fedora 40+ recommended. RPM Fusion for NVIDIA. AMD Ryzen 9 8945HS is well-supported. AMD Radeon 780M iGPU via amdgpu as integrated fallback.",
    generalNotes:
      "Community-supported. AMD Ryzen 9 8945HS + RTX 4070 Laptop — AMD iGPU (Radeon 780M) usable via amdgpu; NVIDIA dGPU needs proprietary driver for full gaming performance.",
  },
  "legion-pro-5i-16-gen9": {
    laptopId: "legion-pro-5i-16-gen9",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 4070/4080 Laptop — NVIDIA proprietary driver required; nouveau limited",
      },
      { component: "Fingerprint", status: "partial", notes: "libfprint — verify sensor before deployment" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
    ],
    fedoraNotes:
      "Fedora 40+ recommended. RPM Fusion for NVIDIA drivers. Core i9-14900HX well-supported. Thunderbolt 4 functional.",
    generalNotes:
      "Community-supported. Intel Core i9-14900HX + RTX 4070/4080 — high-TDP gaming configuration. NVIDIA proprietary driver required. prime-run for dGPU workloads.",
  },
  "legion-slim-5-14-gen9-amd": {
    laptopId: "legion-slim-5-14-gen9-amd",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi, well-supported" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 4050 Laptop — NVIDIA proprietary driver required; nouveau limited",
      },
      { component: "Fingerprint", status: "partial", notes: "Synaptics — libfprint 1.94.7+" },
      { component: "Audio", status: "works", notes: "Realtek HDA — standard ALSA" },
    ],
    fedoraNotes:
      "Fedora 40+ recommended. RPM Fusion for NVIDIA. Ryzen 7 8845HS well-supported on 6.5+. OLED panel works at full resolution under Wayland.",
    generalNotes:
      "Community-supported. Slim gaming form factor — AMD Ryzen 7 8845HS + RTX 4050 Laptop. Soldered LPDDR5x RAM. OLED display at 2.8K works well under Wayland. NVIDIA driver required for dGPU.",
  },
  "legion-slim-5-16-gen9-amd": {
    laptopId: "legion-slim-5-16-gen9-amd",
    certifiedDistros: [],
    recommendedKernel: "6.8+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 4060 Laptop — NVIDIA proprietary driver required; nouveau limited",
      },
      { component: "Fingerprint", status: "partial", notes: "Synaptics — libfprint support varies" },
      { component: "Audio", status: "works", notes: "Realtek HDA — ALSA/PipeWire" },
    ],
    fedoraNotes:
      'Fedora 40+ recommended. RPM Fusion for NVIDIA. Slim 16" chassis — thermal headroom more limited than full Legion 5; monitor CPU/GPU temperatures under load.',
    generalNotes:
      'Community-supported. Slim 16" AMD gaming laptop — Ryzen 7 8845HS + RTX 4060 Laptop. Thinner chassis limits sustained TGP vs full Legion 5. NVIDIA driver required for dGPU gaming.',
  },

  // === Legion (2023, Gen 8) ===
  "legion-5-15-gen8-amd": {
    laptopId: "legion-5-15-gen8-amd",
    certifiedDistros: [],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi, well-supported on 6.1+" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 4060 Laptop — NVIDIA proprietary driver required; nouveau limited",
      },
      { component: "Fingerprint", status: "partial", notes: "Synaptics sensor — libfprint support varies" },
      { component: "Audio", status: "works", notes: "Realtek HDA — ALSA/PulseAudio" },
    ],
    fedoraNotes:
      "Fedora 39+ or Fedora 40 recommended. RPM Fusion for NVIDIA. AMD Ryzen 7 7840HS (Phoenix) well-supported — solid amdgpu iGPU (Radeon 780M) as fallback.",
    generalNotes:
      "Community-supported. AMD Ryzen 7 7840HS + RTX 4060 Laptop — a mature 2023 gaming platform. AMD iGPU available; NVIDIA proprietary driver needed for full dGPU gaming. Good community Linux support.",
  },
  "legion-5i-16-gen8": {
    laptopId: "legion-5i-16-gen8",
    certifiedDistros: [],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi, kernel 6.1+" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 4060 Laptop — NVIDIA proprietary driver required; nouveau limited",
      },
      { component: "Fingerprint", status: "partial", notes: "libfprint — check sensor variant" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
    ],
    fedoraNotes:
      "Fedora 39+ recommended. RPM Fusion for NVIDIA. Core i7-13700H Raptor Lake H well-supported on 6.2+. Thunderbolt 4 functional.",
    generalNotes:
      "Community-supported. Intel Core i7-13700H + RTX 4060 Laptop — well-supported 2023 Intel gaming platform. Thunderbolt 4 works. NVIDIA proprietary driver required for gaming.",
  },
  "legion-pro-5i-16-gen8": {
    laptopId: "legion-pro-5i-16-gen8",
    certifiedDistros: [],
    recommendedKernel: "6.5+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX211 — iwlwifi" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 4070/4080 Laptop — NVIDIA proprietary driver required; nouveau limited",
      },
      { component: "Fingerprint", status: "partial", notes: "libfprint — verify sensor model" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
    ],
    fedoraNotes:
      "Fedora 39+ recommended. RPM Fusion for NVIDIA. Core i9-13900HX is supported on 6.2+. High power consumption — ensure adequate cooling under sustained load.",
    generalNotes:
      "Community-supported. Intel Core i9-13900HX + RTX 4070/4080 Laptop — high-end 2023 gaming rig. NVIDIA proprietary driver essential. Thunderbolt 4 supported. Good overall Linux hardware compatibility.",
  },

  // === Legion (2022, Gen 7) ===
  "legion-5-15-gen7-amd": {
    laptopId: "legion-5-15-gen7-amd",
    certifiedDistros: [],
    recommendedKernel: "6.1+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX200 or AX211 — iwlwifi, well-supported" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 3060 Laptop — NVIDIA proprietary driver required; nouveau limited",
      },
      {
        component: "Fingerprint",
        status: "partial",
        notes: "Synaptics sensor — libfprint may require patching on older distros",
      },
      { component: "Audio", status: "works", notes: "Realtek HDA — ALSA/PulseAudio" },
    ],
    fedoraNotes:
      "Fedora 37+ or Fedora 38+ recommended. RPM Fusion for NVIDIA. AMD Ryzen 7 6800H (Rembrandt) on amdgpu — good iGPU support. A mature, well-understood Linux gaming platform.",
    generalNotes:
      "Community-supported. AMD Ryzen 7 6800H + RTX 3060 Laptop — 2022 gaming platform with strong Linux community support. RTX 3060 well-covered by NVIDIA 525+ drivers. amdgpu iGPU (Radeon 680M) works reliably.",
  },
  "legion-5i-15-gen7": {
    laptopId: "legion-5i-15-gen7",
    certifiedDistros: [],
    recommendedKernel: "6.1+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel AX200 or AX211 — iwlwifi" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 3070 Laptop — NVIDIA proprietary driver required; nouveau limited",
      },
      { component: "Fingerprint", status: "partial", notes: "Synaptics — libfprint support on most 2022 distros" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
    ],
    fedoraNotes:
      "Fedora 37+ recommended. RPM Fusion for NVIDIA. Core i7-12700H Alder Lake H well-supported from kernel 5.19+. Thunderbolt 4 functional.",
    generalNotes:
      "Community-supported. Intel Core i7-12700H + RTX 3070 Laptop — mature 2022 Intel gaming platform. Well-supported by NVIDIA 525+ drivers. Thunderbolt 4 works. Broad community experience available.",
  },

  // === Legion (2025, Gen 10) ===
  "legion-5-15-gen10-amd": {
    laptopId: "legion-5-15-gen10-amd",
    certifiedDistros: [],
    recommendedKernel: "6.10+",
    driverNotes: [
      {
        component: "Wi-Fi",
        status: "works",
        notes: "Intel BE200 or similar Wi-Fi 7 adapter — iwlwifi, BE200 needs 6.8+",
      },
      {
        component: "GPU",
        status: "partial",
        notes:
          "NVIDIA GeForce RTX 5070 Laptop (Blackwell) — NVIDIA proprietary driver 570+ required; nouveau not functional",
      },
      { component: "Fingerprint", status: "partial", notes: "Sensor support varies — libfprint 1.94.8+ recommended" },
      { component: "Audio", status: "works", notes: "Realtek HDA — ALSA/PipeWire" },
    ],
    fedoraNotes:
      "Fedora 41+ recommended. RPM Fusion for NVIDIA Blackwell drivers (570+). AMD Ryzen 7 9755HX (Fire Range) — confirm kernel 6.10+ for full Zen 5 support. Wi-Fi 7 adapter support depends on chipset.",
    generalNotes:
      "Community-supported. AMD Ryzen 7 9755HX + RTX 5070 Laptop — newest 2025 gaming platform. NVIDIA Blackwell (RTX 50 series) requires driver 570+ for Linux; early adoption, verify driver availability before deployment.",
  },
  "legion-5i-15-gen10": {
    laptopId: "legion-5i-15-gen10",
    certifiedDistros: [],
    recommendedKernel: "6.10+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 — iwlwifi, 6.8+ for full support" },
      {
        component: "GPU",
        status: "partial",
        notes:
          "NVIDIA GeForce RTX 5070 Laptop (Blackwell) — NVIDIA proprietary driver 570+ required; nouveau not functional",
      },
      { component: "Fingerprint", status: "partial", notes: "libfprint — verify sensor model" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
    ],
    fedoraNotes:
      "Fedora 41+ recommended. RPM Fusion for NVIDIA Blackwell (570+ driver). Intel Core Ultra 7 275HX (Arrow Lake HX) — full support in 6.10+. Thunderbolt 4 functional.",
    generalNotes:
      "Community-supported. Intel Core Ultra 7 275HX + RTX 5070 Laptop — 2025 Intel gaming platform. NVIDIA Blackwell driver 570+ required. Arrow Lake HX platform well-supported in 6.10+.",
  },
  "legion-7i-16-gen10": {
    laptopId: "legion-7i-16-gen10",
    certifiedDistros: [],
    recommendedKernel: "6.10+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 — iwlwifi, 6.8+ for BE200 support" },
      {
        component: "GPU",
        status: "partial",
        notes:
          "NVIDIA GeForce RTX 5070/5080 Laptop (Blackwell) — NVIDIA proprietary driver 570+ required; nouveau not functional",
      },
      { component: "Fingerprint", status: "partial", notes: "libfprint — check sensor variant for model" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
    ],
    fedoraNotes:
      "Fedora 41+ recommended. RPM Fusion for NVIDIA Blackwell (570+ driver). Core Ultra 9 275HX (Arrow Lake HX) — full support in 6.10+.",
    generalNotes:
      "Community-supported. Premium 2025 Legion — Core Ultra 9 275HX + RTX 5070/5080 Laptop. NVIDIA Blackwell driver 570+ mandatory. 4K OLED 240 Hz display — Wayland recommended for fractional scaling.",
  },
  "legion-pro-5-16-gen10-amd": {
    laptopId: "legion-pro-5-16-gen10-amd",
    certifiedDistros: [],
    recommendedKernel: "6.10+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "MediaTek MT7922 or Realtek — check kernel 6.7+ for MediaTek" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 5060/5070 Laptop (Blackwell) — NVIDIA proprietary driver 570+ required",
      },
      { component: "Audio", status: "works", notes: "AMD ACP/AZ — sof-firmware recommended" },
    ],
    fedoraNotes:
      "Fedora 41+ recommended. RPM Fusion for NVIDIA Blackwell (570+ driver). Ryzen 7 9755HX (Zen 5) — well-supported in 6.10+.",
    generalNotes:
      "Community-supported. AMD Zen 5 + RTX 5060/5070 Laptop — 2025 AMD professional gaming platform. NVIDIA driver 570+ required. Dual NVMe slots both accessible for Linux.",
  },
  "legion-pro-5i-16-gen10": {
    laptopId: "legion-pro-5i-16-gen10",
    certifiedDistros: [],
    recommendedKernel: "6.10+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 — iwlwifi, 6.8+ for BE200 support" },
      {
        component: "GPU",
        status: "partial",
        notes: "NVIDIA GeForce RTX 5060/5070/5070 Ti Laptop (Blackwell) — NVIDIA proprietary driver 570+ required",
      },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
    ],
    fedoraNotes:
      "Fedora 41+ recommended. RPM Fusion for NVIDIA Blackwell (570+ driver). Core Ultra 7/9 275HX (Arrow Lake HX) — full support in 6.10+.",
    generalNotes:
      "Community-supported. Intel Arrow Lake HX + RTX 5060–5070 Ti Laptop — 2025 Intel professional gaming platform. NVIDIA driver 570+ required. Thunderbolt 4 functional for eGPU and docking.",
  },
  "legion-pro-7i-16-gen10": {
    laptopId: "legion-pro-7i-16-gen10",
    certifiedDistros: [],
    recommendedKernel: "6.10+",
    driverNotes: [
      { component: "Wi-Fi", status: "works", notes: "Intel BE200 — iwlwifi, 6.8+ for BE200 support" },
      {
        component: "GPU",
        status: "partial",
        notes:
          "NVIDIA GeForce RTX 5080 Laptop (Blackwell) — NVIDIA proprietary driver 570+ required; nouveau not functional",
      },
      { component: "Fingerprint", status: "partial", notes: "libfprint — check sensor variant for model" },
      { component: "Audio", status: "works", notes: "Intel HDA — sof-firmware" },
      { component: "SD Card Reader", status: "works", notes: "Realtek RTS5227S — standard kernel driver" },
    ],
    fedoraNotes:
      "Fedora 41+ recommended. RPM Fusion for NVIDIA Blackwell (570+ driver). Core Ultra 9 275HX — flagship 2025 Intel CPU, well-supported in 6.10+. SD card reader and Thunderbolt 4 functional.",
    generalNotes:
      "Community-supported. Flagship 2025 Legion — Core Ultra 9 275HX + RTX 5080 Laptop. NVIDIA Blackwell driver 570+ mandatory; early adoption. Highest-power Legion config — confirm power supply and cooling adequacy for Linux sustained workloads.",
  },
};
