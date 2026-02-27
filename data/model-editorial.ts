/**
 * Curated editorial overlays for each laptop model — human-written context,
 * known issues, Swiss market notes, and positioning analysis. Keyed by model ID.
 */
import { EditorialOverlay } from "@/lib/types";

export const modelEditorial: Record<string, EditorialOverlay> = {
  "x1-carbon-gen13": {
    editorialNotes:
      "The Gen 13 debuts Intel Lunar Lake (Core Ultra 258V) bringing improved integrated graphics and significantly better power efficiency. The chassis remains virtually unchanged from Gen 12, maintaining the same excellent keyboard and port selection. The jump to LPDDR5x-8533 is notable but comes soldered as always in the X1 Carbon line.",
    knownIssues:
      "Early BIOS versions had intermittent Thunderbolt dock wake issues. Lenovo released BIOS 1.10+ which resolves most reported cases. Wi-Fi 7 performance depends on router compatibility — real-world gains over Wi-Fi 6E are router-dependent.",
    swissMarketNotes:
      "Available through Lenovo CH, Digitec, and Brack. Swiss keyboard layout (QWERTZ with dedicated umlauts) is the default SKU. Lenovo CH educational discount applies for qualifying institutions.",
    linuxNotes:
      "Lenovo-certified for Ubuntu. Intel Lunar Lake requires kernel 6.10+ for full hardware support including the Arc 140V iGPU. Fingerprint reader works with libfprint 1.94+.",
  },

  "x1-carbon-gen12": {
    editorialNotes:
      "The Gen 12 was the first X1 Carbon with Intel Core Ultra (Meteor Lake), introducing the NPU for on-device AI workloads. The OLED option at 2.8K 120 Hz remains one of the best laptop displays available. Build quality is quintessential ThinkPad — magnesium-carbon hybrid chassis with MIL-STD-810H rating.",
    knownIssues:
      "The Core Ultra 7 155U can throttle under sustained multi-core loads due to the 15W TDP envelope. This is by design for ultraportable thermals. Some users report coil whine under specific loads — varies by unit.",
    swissMarketNotes:
      "Well stocked at Swiss retailers. Refurbished Gen 11 units offer strong value if the Gen 12 price is above budget. Lenovo CH configures to order with 2-3 week lead time for non-stock configurations.",
  },

  "t14s-gen5-amd": {
    editorialNotes:
      "The T14s Gen 5 AMD is arguably the best value in the current T-series. The Ryzen 7 PRO 8840U delivers strong multi-threaded performance while the 2.8K OLED option elevates it beyond typical business-class displays. At 1.24 kg it undercuts the X1 Carbon on price while offering comparable specs.",
    knownIssues:
      "LPDDR5x is soldered at 32 GB maximum — plan for your long-term RAM needs at purchase. The USB-C 4.0 port supports DisplayPort Alt Mode but is not branded Thunderbolt, limiting some dock compatibility.",
    swissMarketNotes:
      "Strong availability in Switzerland. Often positioned CHF 300-500 below the X1 Carbon Gen 12 at comparable specs, making it the value pick for Swiss corporate buyers.",
    linuxNotes:
      "Lenovo-certified for Ubuntu. AMD Ryzen 8000 series has solid mainline kernel support. The Radeon 780M iGPU works well with Mesa drivers. Wi-Fi 7 (MediaTek MT7925) requires kernel 6.7+.",
  },

  "t14s-gen4-amd": {
    editorialNotes:
      "The T14s Gen 4 AMD hit a sweet spot: Ryzen 7 PRO 7840U with Zen 4 cores, 2.8K OLED at 90 Hz, and Wi-Fi 6E in a 1.22 kg chassis. It remains highly competitive even against Gen 5 models and is now available at reduced prices as stock clears.",
    swissMarketNotes:
      "Clearance pricing makes this an excellent value. Check Digitec and Brack for remaining stock — often CHF 200+ below the Gen 5 equivalent.",
    linuxNotes:
      "Excellent Linux support. The Ryzen 7840U with RDNA 3 iGPU runs well on kernel 6.5+. Community reports confirm reliable suspend/resume and good battery life under Linux.",
  },

  "p1-gen7": {
    editorialNotes:
      "The P1 Gen 7 is Lenovo's answer to the MacBook Pro 16 for professionals who need Windows or Linux. The Core Ultra 9 185H paired with RTX 3000 Ada delivers genuine workstation-class performance. The 4K+ OLED at 120 Hz is stunning for colour-critical work, and 84 Wh keeps it running longer than most workstations.",
    knownIssues:
      "Fan noise is noticeable under sustained GPU compute loads — use a dock at the desk for thermal headroom. The 45W TDP CPU needs active cooling, so silent operation is not this machine's forte. At 1.81 kg it is heavy for a P1 but light for a workstation.",
    swissMarketNotes:
      "Premium pricing in Switzerland — typically CHF 3500+. ISV-certified for AutoCAD, Revit, SolidWorks, and Siemens NX, relevant for Swiss engineering firms. Lenovo CH offers on-site next-business-day warranty options.",
    linuxNotes:
      "Community-supported rather than certified. The RTX 3000 Ada requires NVIDIA proprietary drivers (545+). Hybrid graphics switching (PRIME) works but requires configuration. Suspend can be unreliable with the discrete GPU active.",
  },

  "t14-gen4-amd": {
    editorialNotes:
      "The T14 Gen 4 AMD is the workhorse pick: user-upgradeable DDR5 RAM (2 SODIMM slots, up to 64 GB), Ryzen 7 PRO 7840U, and built-in Ethernet. It trades the T14s slim profile for serviceability — a meaningful trade-off for IT departments and power users who value long-term flexibility.",
    swissMarketNotes:
      "Good availability at Swiss business resellers. The upgradeable RAM makes it a favourite for Swiss IT procurement teams who standardize on a single SKU and configure RAM per user role.",
    linuxNotes:
      "Lenovo-certified for Ubuntu. The socketed DDR5 RAM is a practical advantage for Linux users who want to buy base configurations and self-upgrade. All hardware works well on kernel 6.5+.",
  },

  "x1-yoga-gen9": {
    editorialNotes:
      "The X1 Yoga Gen 9 is the convertible sibling of the X1 Carbon Gen 12, sharing its Intel Core Ultra platform and 2.8K OLED panel but adding 360-degree hinge and active pen support. The garaged pen eliminates the need to carry a separate stylus. At 1.35 kg it is only slightly heavier than the Carbon.",
    knownIssues:
      "The OLED panel in tent mode can accumulate fingerprints quickly — a microfibre cloth is essential. Pen jitter at very slow drawing speeds is reported but within normal range for EMR digitizers.",
    swissMarketNotes:
      "Popular with Swiss consultants and architects who present on-site. The pen-capable OLED is valued for annotating drawings and signing documents. Available at Lenovo CH and Digitec.",
    linuxNotes:
      "Lenovo-certified for Ubuntu. Pen input works via libwacom. Auto-rotation in tablet mode requires iio-sensor-proxy. The OLED touch panel works natively on recent kernels.",
  },

  "l14-gen5-intel": {
    editorialNotes:
      "The L14 Gen 5 Intel is the fleet-deployment workhorse. Dual SODIMM slots, built-in Ethernet, and a competitive price point make it the standard-issue ThinkPad for organizations prioritizing total cost of ownership over premium features. The display and build quality are a step below the T-series but perfectly adequate for office work.",
    swissMarketNotes:
      "Often the cheapest current-gen ThinkPad available in Switzerland. Lenovo CH volume discounts apply for fleet purchases. Pair with a ThinkPad USB-C dock for a complete desktop setup.",
  },

  // === 2022 models ===
  "x1-carbon-gen10": {
    editorialNotes:
      "The Gen 10 introduced 12th Gen Intel P-series and OLED to the X1 Carbon line. The 2.8K OLED option was a watershed moment for business ultrabooks — stunning colour accuracy in a sub-1.13 kg chassis. The 1270P offers solid multi-core via P/E core architecture.",
    knownIssues:
      "12th Gen Intel runs warmer than expected in this thin chassis. PL2 spikes can cause brief thermal throttling. The OLED panel, while beautiful, has typical OLED concerns around burn-in with static UI elements over years of use.",
    swissMarketNotes:
      "Now available refurbished at significant discounts. A refurbished Gen 10 OLED offers remarkable value compared to a new Gen 12 WUXGA at similar pricing.",
    linuxNotes:
      "Excellent Linux support. 12th Gen Intel Alder Lake is fully supported on kernel 6.1+. Iris Xe has mature i915 drivers.",
  },

  "x1-yoga-gen7": {
    editorialNotes:
      "The convertible counterpart to the X1 Carbon Gen 10. Shares the same 12th Gen platform and OLED display option with the addition of a 360-degree hinge and garaged Lenovo Precision Pen. The convertible design adds only marginal weight (1.38 kg).",
    knownIssues:
      "The hinge mechanism can feel stiff during the first weeks of use — this loosens naturally. OLED and touchscreen mean higher power draw than the non-touch Carbon equivalent.",
    swissMarketNotes:
      "Popular with Swiss architects and consultants for on-site presentations. Pen-capable models are valued in professional services. Refurbished stock available on Ricardo.",
    linuxNotes:
      "Good Linux support. Pen input works via libwacom. Auto-rotation requires iio-sensor-proxy. Touch and pen both function well on Wayland.",
  },

  "x1-nano-gen2": {
    editorialNotes:
      "The ultralight specialist at under 1 kg. The 2K IPS panel at 13 inches offers sharp text rendering in a remarkably portable package. The 1270P inside provides more multi-core power than you'd expect from a sub-kilogram laptop. Limited port selection is the trade-off for extreme portability.",
    knownIssues:
      "No USB-A ports at all — adapter life is the reality. The 49.6 Wh battery is small but adequate thanks to the efficient display and compact form factor. Fan noise is noticeable when the 28W CPU is pushed — the tiny chassis has limited thermal headroom.",
    swissMarketNotes:
      "Niche but loved by frequent travellers on Swiss rail (compact enough for SBB table trays). Available at reduced prices as Gen 3 stock replaces it.",
  },

  "t14-gen3-intel": {
    editorialNotes:
      "The T14 Gen 3 Intel brought Alder Lake P-series to the mainstream T-series. Dual SODIMM slots with DDR4 make it one of the most serviceable modern ThinkPads. The 12th Gen platform with P/E cores was a significant multi-core uplift over 11th Gen.",
    knownIssues:
      "DDR4 (not DDR5) limits memory bandwidth compared to newer models. The base 300-nit WUXGA panel is adequate but underwhelming next to the 2.8K OLED option.",
    swissMarketNotes:
      "Excellent refurbished value. Swiss corporate fleets are now cycling these out — expect CHF 400-700 on Ricardo for well-maintained units.",
    linuxNotes:
      "Lenovo-certified for Ubuntu. 12th Gen Intel is well-supported. The socketed DDR4 RAM is a practical advantage for Linux users buying base configs to self-upgrade.",
  },

  "t14-gen3-amd": {
    editorialNotes:
      "The AMD variant pairs the Ryzen 7 PRO 6850U (Zen 3+) with the same serviceable T14 chassis. The RDNA 2 Radeon 680M iGPU is noticeably stronger than Intel's Iris Xe, making this a better choice for occasional light gaming or GPU-accelerated tasks.",
    knownIssues:
      "Zen 3+ is a refresh, not a full generational leap — modest IPC gains over Zen 3. USB-C ports lack Thunderbolt branding, limiting some dock compatibility.",
    swissMarketNotes:
      "AMD T14 models often sell at a discount to Intel equivalents in Switzerland despite competitive performance. Good value for cost-conscious IT departments.",
    linuxNotes:
      "Excellent AMD Linux support. The amdgpu driver handles the 680M iGPU well. Battery life under Linux is competitive with Windows.",
  },

  "t14s-gen3-intel": {
    editorialNotes:
      "The slim sibling of the T14 Gen 3. Trades SODIMM slots for a thinner 1.22 kg chassis with soldered LPDDR5 memory. The 2.8K OLED option makes it a compelling alternative to the X1 Carbon at a lower price point.",
    knownIssues:
      "Soldered RAM means the 16/32 GB choice is permanent. The 1270P in this thinner chassis runs slightly warmer than in the T14, though thermal management is still adequate.",
    swissMarketNotes:
      "Positioned between the T14 and X1 Carbon in Swiss pricing. The OLED model offers X1-class display quality at T-series pricing — an underappreciated value proposition.",
    linuxNotes:
      "Lenovo-certified for Ubuntu. Same mature 12th Gen Intel platform as the T14 Gen 3. Thunderbolt 4 ports provide reliable dock support.",
  },

  "t14s-gen3-amd": {
    editorialNotes:
      "The T14s Gen 3 AMD combines Zen 3+ efficiency with a premium slim chassis. LPDDR5 at 6400 MHz provides solid memory bandwidth. The Radeon 680M iGPU outperforms Intel Iris Xe in most GPU-bound scenarios.",
    knownIssues:
      "Soldered RAM limits future upgradeability. The 2.8K OLED option draws more power than the WUXGA IPS, reducing battery life by roughly 1-2 hours.",
    swissMarketNotes:
      "Often available CHF 100-200 below the Intel variant at Swiss retailers. Strong value for AMD-friendly IT departments.",
    linuxNotes:
      "Strong Linux support with mature amdgpu drivers. The AMD platform often achieves slightly better battery life than Intel under Linux.",
  },

  "t16-gen1-intel": {
    editorialNotes:
      "The first T16, replacing the T15 with a 16:10 aspect ratio. The larger 16-inch display with WUXGA is excellent for spreadsheet-heavy work and side-by-side document editing. Dual storage slots and a numpad keyboard complete the productivity package.",
    knownIssues:
      "At 1.67 kg it is noticeably heavier than 14-inch T-series models. DDR4 memory limits bandwidth. The base 300-nit WUXGA panel is adequate but not exceptional.",
    swissMarketNotes:
      "Popular with Swiss financial services firms for the 16-inch display and numpad. Refurbished units offer strong value for spreadsheet-focused roles.",
    linuxNotes:
      "Lenovo-certified for Ubuntu. The larger chassis provides better thermals for sustained workloads. All hardware well-supported on kernel 6.1+.",
  },

  "l14-gen3-intel": {
    editorialNotes:
      "The budget workhorse of the ThinkPad lineup. Dual SODIMM DDR4, built-in Ethernet, and a competitive price make it the fleet favourite. Build quality is a step below T-series but the keyboard remains excellent.",
    knownIssues:
      "The base FHD TN panel is poor — insist on the IPS upgrade. Chassis flex is slightly more noticeable than T-series under pressure.",
    swissMarketNotes:
      "The cheapest ThinkPad for Swiss fleet deployments. Volume discounts from Lenovo CH make it the default choice for large organisations.",
    linuxNotes: "Lenovo-certified. The straightforward 12th Gen Intel platform has zero Linux compatibility issues.",
  },

  "e14-gen4": {
    editorialNotes:
      "The E-series entry point to ThinkPad. Shares the same excellent keyboard with higher-tier models while cutting costs on chassis materials and port selection. The 1240P provides surprisingly strong multi-core for the price point.",
    knownIssues:
      "Chassis is plastic rather than the magnesium/carbon of T/X series — feels less premium. No Ethernet port — dongle required. 40 GB max RAM is an unusual cap.",
    swissMarketNotes:
      "Positioned as the student and SME ThinkPad in Switzerland. Often found at Digitec under CHF 1000 for capable configurations.",
  },

  // === 2023 models ===
  "x1-carbon-gen11": {
    editorialNotes:
      "The Gen 11 was the last X1 Carbon with Intel's traditional Core naming (13th Gen i-series). The WUXGA IPS display at 400 nits is bright enough for outdoor use. At 1.12 kg it maintains the X1 Carbon's position as the benchmark business ultrabook.",
    knownIssues:
      "The i7-1365U is a U-series chip with limited multi-core performance — acceptable for business use but not demanding development. 13th Gen Raptor Lake U-series showed modest gains over 12th Gen.",
    swissMarketNotes:
      "Clearance pricing as Gen 12/13 arrive. Excellent value if the OLED isn't needed — the WUXGA panel is perfectly adequate for office work.",
    linuxNotes:
      "Lenovo-certified for Ubuntu. 13th Gen Intel is fully supported on kernel 6.2+. Mature, stable platform for Linux users.",
  },

  "x1-nano-gen3": {
    editorialNotes:
      "The third generation of ThinkPad's sub-kilogram ultraportable. The 1360P provides more multi-core headroom than the Gen 2 while maintaining the under-1 kg weight. The 2K panel at 450 nits is excellent for its size.",
    knownIssues:
      "Limited port selection remains the primary compromise — two Thunderbolt 4 and one USB-C. The 16 GB soldered RAM cap means no upgrade path. Fan noise under load is noticeable in the tiny chassis.",
    swissMarketNotes:
      "Niche product in Switzerland. Appeals to frequent travellers who prioritise weight above all else. Check for clearance pricing as the model transitions.",
  },

  "x1-yoga-gen8": {
    editorialNotes:
      "The Gen 8 Yoga pairs 13th Gen Intel with the proven X1 convertible chassis. The garaged pen, 360-degree hinge, and OLED option create a compelling package for annotation-heavy workflows. Build quality matches the X1 Carbon series.",
    knownIssues:
      "Similar to the Gen 11 Carbon, the i7-1365U U-series chip limits sustained multi-core. The OLED panel adds to the price premium. Privacy Guard display option limits viewing angles by design.",
    swissMarketNotes:
      "Popular with Swiss law firms and consulting companies for document markup. The pen-capable OLED is valued for contract annotations.",
    linuxNotes:
      "Lenovo-certified. Pen input via libwacom. Auto-rotation and tablet mode work well on recent Wayland compositors.",
  },

  "t14-gen4-intel": {
    editorialNotes:
      "The T14 Gen 4 Intel transitions the workhorse T14 to 13th Gen Intel with DDR5 support. Dual SODIMM slots remain — a rarity in modern 14-inch business laptops. The 2.8K OLED option was a welcome addition to the T-series.",
    knownIssues:
      "The 1360P generates more heat than the U-series i7-1365U in the same chassis. Base WUXGA panel at 300 nits is adequate but the OLED upgrade is transformative.",
    swissMarketNotes:
      "Well-stocked at Swiss business resellers. The upgradeable DDR5 makes it a favourite for Swiss IT departments standardising on a single SKU.",
    linuxNotes:
      "Lenovo-certified for Ubuntu. 13th Gen Intel platform is mature and stable. Dual SODIMM slots appreciated by Linux users who self-upgrade.",
  },

  "t14s-gen4-intel": {
    editorialNotes:
      "The slim T14s Gen 4 Intel offers a thinner alternative to the T14 with soldered LPDDR5. The 2.8K OLED option at 90 Hz is a highlight. Thunderbolt 4 connectivity and Wi-Fi 6E complete a solid ultrabook package.",
    knownIssues:
      "Soldered RAM means the purchase-time choice is permanent. The slim chassis means slightly reduced thermal headroom compared to the T14 Gen 4.",
    swissMarketNotes:
      "Positioned between T14 and X1 Carbon pricing. Often overlooked in favour of the T14s AMD variant but offers Thunderbolt — valuable for Intel-dock-heavy Swiss corporate environments.",
    linuxNotes:
      "Lenovo-certified. Thunderbolt 4 provides reliable dock support on Linux. Same mature 13th Gen platform as the T14 Gen 4.",
  },

  "t16-gen2-intel": {
    editorialNotes:
      "The second-generation 16-inch T-series. 13th Gen Intel with DDR5 support and dual storage slots make it a capable large-screen workhorse. The WQXGA option provides excellent real estate for multi-window workflows.",
    knownIssues:
      "Weight at 1.67 kg makes it a desk-first machine. The numpad keyboard layout shifts the main keyboard left — divisive among users. DDR5 5200 MHz is slower than the 5600 MHz found in newer models.",
    swissMarketNotes:
      "Favoured by Swiss financial analysts and accountants for the 16-inch display and numpad. Available at reduced pricing as Gen 3 arrives.",
    linuxNotes:
      "Lenovo-certified. The large chassis provides generous thermal headroom for sustained workloads. All hardware works well on kernel 6.2+.",
  },

  "l14-gen4-intel": {
    editorialNotes:
      "The L14 Gen 4 updates the fleet favourite to 13th Gen Intel while retaining the practical dual SODIMM DDR4 slots and built-in Ethernet. It remains the lowest-cost entry to a current-gen ThinkPad experience.",
    knownIssues:
      "DDR4 in a 2023 model feels dated. The base display options are adequate but unremarkable. Chassis flex is slightly more noticeable than T-series.",
    swissMarketNotes:
      "Standard-issue ThinkPad for Swiss government and education deployments. Volume pricing from Lenovo CH makes it the default fleet choice.",
    linuxNotes: "Lenovo-certified. Straightforward Intel platform with zero Linux compatibility concerns.",
  },

  "e14-gen5": {
    editorialNotes:
      "The E14 Gen 5 AMD brings Zen 3 to the budget ThinkPad line. The Ryzen 5 7530U provides adequate performance for office productivity. The AMD Radeon 660M iGPU handles basic display tasks.",
    knownIssues:
      "DDR4 with limited max RAM (40 GB) constrains long-term usability. No Ethernet port. Build quality is plastic and noticeably below T-series. The base display is a basic WUXGA IPS.",
    swissMarketNotes:
      "Entry-level ThinkPad for Swiss SMEs and students. Available under CHF 800 at Digitec for base configurations. The ThinkPad keyboard alone justifies the price over consumer alternatives.",
  },

  "x13-gen4-intel": {
    editorialNotes:
      "The compact X13 Gen 4 packs a 13.3-inch WQXGA display into a 1.19 kg chassis. The 2.8K OLED option makes it one of the smallest OLED ThinkPads. Soldered LPDDR5 and Thunderbolt 4 round out a premium ultraportable package.",
    knownIssues:
      "The compact keyboard layout may feel cramped for users accustomed to 14-inch models. Max 32 GB soldered RAM. The 54.7 Wh battery is generous for the size but the high-res display draws more power.",
    swissMarketNotes:
      "Appeals to Swiss professionals who prioritise compactness — popular with consultants travelling with carry-on only.",
    linuxNotes:
      "Lenovo-certified. The compact form factor doesn't compromise Linux compatibility. All hardware works on kernel 6.2+.",
  },

  "p16-gen2": {
    editorialNotes:
      "The P16 Gen 2 is Lenovo's 16-inch mobile workstation flagship. The i9-13980HX with RTX 5000 Ada delivers desktop-class performance. 4 DIMM slots supporting 128 GB DDR5 and dual NVMe slots make it the most expandable ThinkPad available.",
    knownIssues:
      "At 2.67 kg it is a desktop replacement, not a portable. The 55W CPU and discrete GPU generate substantial heat — fan noise is constant under workstation loads. The 94 Wh battery depletes rapidly under GPU load.",
    swissMarketNotes:
      "Positioned for Swiss engineering firms, architecture practices, and post-production studios. ISV-certified for major CAD/CAM software. Premium pricing — typically CHF 4000+.",
    linuxNotes:
      "Community-supported. The RTX 5000 Ada requires NVIDIA proprietary drivers. Hybrid graphics requires PRIME configuration. Best with a dedicated Linux workstation setup.",
  },

  // === 2024 models (not yet covered) ===
  "t14s-gen5-intel": {
    editorialNotes:
      "The T14s Gen 5 Intel brings Core Ultra (Meteor Lake) to the slim T-series. The NPU adds future AI capabilities while the 2.8K OLED option at 120 Hz matches the X1 Carbon's display quality. At 1.24 kg it's one of the lightest T-series models.",
    knownIssues:
      "Soldered LPDDR5x means the RAM choice is permanent. The Core Ultra 7 155U at 15W TDP limits sustained multi-core — adequate for business use but not demanding development. First-gen Core Ultra can have occasional firmware rough edges.",
    swissMarketNotes:
      "Competitive pricing vs the X1 Carbon Gen 12 in Switzerland. The OLED model offers premium display quality at T-series pricing. Strong availability at Digitec and Brack.",
    linuxNotes:
      "Lenovo-certified for Ubuntu. Meteor Lake requires kernel 6.6+ for full support. The Arc iGPU works with i915/Xe driver. NPU not yet widely utilised on Linux.",
  },

  "t14-gen5-intel": {
    editorialNotes:
      "The T14 Gen 5 Intel updates the workhorse to Core Ultra with dual SODIMM DDR5 slots — one of the last upgradeable-RAM 14-inch ThinkPads. Multiple display options from WUXGA to 2.8K OLED give flexibility. Built-in Ethernet preserved.",
    knownIssues:
      "Meteor Lake U-series in the T14 chassis can show mild thermal throttling under sustained all-core loads. The WUXGA LP (low-power) panel option has reduced brightness — check the panel before purchasing.",
    swissMarketNotes:
      "The go-to ThinkPad for Swiss IT departments needing user-upgradeable RAM. Available in multiple configurations from stock at Swiss retailers.",
    linuxNotes:
      "Lenovo-certified. Dual SODIMM slots are a significant advantage for Linux users who buy base configs and self-upgrade. Meteor Lake platform works on kernel 6.6+.",
  },

  "t14-gen5-amd": {
    editorialNotes:
      "The AMD variant pairs Ryzen 7 PRO 8840U with the same practical T14 chassis. The Radeon 780M iGPU is significantly stronger than Intel Arc Graphics, making it better for light creative work and casual gaming. Dual SODIMM DDR5 slots maintained.",
    knownIssues:
      "USB-C ports lack Thunderbolt branding — check dock compatibility. The AMD variant sometimes has slightly different panel options than the Intel version.",
    swissMarketNotes:
      "Often priced slightly below the Intel variant in Switzerland. Strong value for organisations that don't require Thunderbolt connectivity.",
    linuxNotes:
      "Lenovo-certified. AMD Zen 4 with RDNA 3 iGPU has excellent Linux support via amdgpu driver. Often achieves better battery life than Intel on Linux.",
  },

  "t16-gen3-intel": {
    editorialNotes:
      "The T16 Gen 3 brings Core Ultra to the 16-inch workhorse. The larger display excels at spreadsheet work and multi-window layouts. DDR5 with dual SODIMM slots and two NVMe slots provide excellent expandability.",
    knownIssues:
      "1.67 kg weight limits portability. The numpad shifts the main keyboard left. Meteor Lake in the larger chassis runs cooler but the base WUXGA panel is still only 300 nits.",
    swissMarketNotes:
      "Standard issue for Swiss financial sector desk workers. The 16-inch display with numpad is mandatory for many finance roles.",
    linuxNotes:
      "Lenovo-certified. The spacious chassis provides excellent thermals for sustained Linux workloads. Meteor Lake on kernel 6.6+.",
  },

  "p16s-gen3-intel": {
    editorialNotes:
      "The P16s Gen 3 brings Core Ultra to Lenovo's entry workstation line. ISV-certified software support distinguishes it from the T16. Display options up to 4K OLED serve colour-critical work. Dual storage slots and SODIMM RAM maintain serviceability.",
    knownIssues:
      "The 'P' branding suggests workstation power but this is a 15W U-series platform — don't expect P16-class performance. The RTX 500 Ada discrete GPU option adds meaningful capability for professional applications.",
    swissMarketNotes:
      "Positioned for Swiss architects and engineers who need ISV-certified drivers but don't require P16-class power. More affordable than the P1/P16.",
    linuxNotes:
      "Lenovo-certified. The optional NVIDIA RTX 500 Ada requires proprietary drivers on Linux. Intel-only configurations are simpler for Linux.",
  },

  "p14s-gen5-intel": {
    editorialNotes:
      "The P14s Gen 5 pairs Core Ultra with optional NVIDIA RTX 500 Ada in a 14-inch form factor. The lightest ISV-certified workstation in the ThinkPad lineup. The 2.8K OLED option provides excellent colour accuracy for portable creative work.",
    knownIssues:
      "The RTX 500 Ada is entry-level — adequate for CAD but not heavy 3D rendering. Soldered LPDDR5x means no RAM upgrade. Battery life drops noticeably when using the discrete GPU.",
    swissMarketNotes:
      "Appeals to Swiss architects and engineers who travel to client sites. ISV certification gives IT departments confidence for professional software deployments.",
    linuxNotes:
      "Lenovo-certified. Dual-GPU (Intel + NVIDIA) requires PRIME configuration on Linux. Intel-only operation is simpler.",
  },

  "l14-gen5-amd": {
    editorialNotes:
      "The AMD variant of the L14 Gen 5 offers Zen 3+ at the lowest ThinkPad price point. Dual SODIMM DDR5, Ethernet, and a solid keyboard make it a practical fleet machine. The Radeon 660M iGPU handles basic tasks.",
    knownIssues:
      "Zen 3+ (Barcelo-R) is not a current-gen architecture — IPC trails Zen 4. The base 8 GB RAM configuration should be upgraded immediately. Build quality is functional but not premium.",
    swissMarketNotes:
      "The cheapest AMD ThinkPad in Switzerland. Popular for Swiss education and government fleet deployments where AMD is preferred.",
  },

  "l16-gen3-intel": {
    editorialNotes:
      "The 16-inch L-series provides the largest display in the fleet-oriented ThinkPad range. Core Ultra brings the L16 up to date with NPU and improved efficiency. Dual SODIMM DDR5, Ethernet, and SD card reader make it practical for diverse office roles.",
    knownIssues:
      "At 1.77 kg it's heavy for a fleet laptop. The base 300-nit WUXGA panel is adequate but not bright. Build quality is a step below T16 — noticeable in chassis flex.",
    swissMarketNotes:
      "Popular with Swiss organisations needing large-screen fleet laptops at competitive pricing. The SD card reader is valued by photography-adjacent roles.",
  },

  "e14-gen6-intel": {
    editorialNotes:
      "The E14 Gen 6 brings Core Ultra to the budget ThinkPad line. The 2.2K display option is a welcome upgrade over previous gen base panels. DDR5 SODIMM slots provide upgrade flexibility unusual at this price point.",
    knownIssues:
      "Plastic chassis feels less premium than T-series. No Ethernet port. The E-series service manual suggests less robust hinge mechanism than T-series.",
    swissMarketNotes:
      "Entry-level Core Ultra ThinkPad in Switzerland. Available under CHF 900 for base configurations at Digitec. Strong value for students and SMEs.",
  },

  "e16-gen2-amd": {
    editorialNotes:
      "The 16-inch E-series brings a larger display to the budget ThinkPad line. The Ryzen 5 7535HS at 35W provides genuine H-series multi-core in an affordable package. The numpad keyboard suits spreadsheet-heavy users.",
    knownIssues:
      "35W TDP means higher heat and fan noise than U-series models. Zen 3+ architecture trails current-gen Zen 4. Plastic chassis shows wear more readily than T/X series.",
    swissMarketNotes:
      "Budget 16-inch ThinkPad for Swiss price-sensitive buyers. The Ryzen 7 7840HS upgrade option significantly improves performance for a modest price increase.",
  },

  "p14s-gen4": {
    editorialNotes:
      "The P14s Gen 4 pairs 13th Gen Intel with the NVIDIA T550 — a Turing-architecture professional GPU. ISV certification for CAD software distinguishes it from the T14s. The 2.8K OLED option at 90 Hz provides excellent colour fidelity.",
    knownIssues:
      "The T550 is previous-gen Turing — functional but surpassed by Ada Lovelace alternatives. Soldered LPDDR5 at 32 GB max. The discrete GPU adds weight and reduces battery life vs integrated-only models.",
    swissMarketNotes:
      "Now available at clearance pricing as the Gen 5 arrives. Good value for Swiss professionals needing ISV-certified GPU support without premium workstation pricing.",
    linuxNotes:
      "Lenovo-certified. The T550 requires NVIDIA proprietary drivers. PRIME hybrid graphics switching works but requires configuration.",
  },

  "p16s-gen2": {
    editorialNotes:
      "The P16s Gen 2 with 13th Gen Intel and NVIDIA T550 provides entry workstation capabilities in a 16-inch format. Dual SODIMM DDR5 and dual NVMe slots offer excellent expandability. The WQXGA display option suits detailed technical work.",
    knownIssues:
      "The T550 GPU is previous-gen Turing. At 1.73 kg it's a desk-oriented machine. The 52.5 Wh battery is modest for a 16-inch workstation.",
    swissMarketNotes:
      "Clearance pricing makes this a value pick for Swiss engineering firms. The 16-inch ISV-certified workstation at sub-CHF 2000 is hard to beat.",
    linuxNotes:
      "Lenovo-certified. Same NVIDIA hybrid graphics considerations as the P14s Gen 4. Intel-only operation is simpler for Linux.",
  },

  // === 2024 additions ===
  "x13-gen5": {
    editorialNotes:
      "The X13 Gen 5 brings Core Ultra to the compact 13.3-inch form factor. The WQXGA IPS at 400 nits offers sharp text in a 1.17 kg package. The 2.8K OLED option with touch makes it one of the smallest premium OLED ThinkPads available.",
    knownIssues:
      "Compact keyboard may feel cramped. Soldered LPDDR5x at 32 GB max. The 54.7 Wh battery is generous for the size but the high-res displays draw more power.",
    swissMarketNotes:
      "Appeals to Swiss professionals who prioritise portability — popular with consultants and frequent SBB commuters.",
    linuxNotes:
      "Lenovo-certified. Core Ultra Meteor Lake on kernel 6.6+. The compact form factor doesn't compromise Linux compatibility.",
  },

  // === 2025 models ===
  "t14s-gen6-amd": {
    editorialNotes:
      "The T14s Gen 6 AMD pairs the new Ryzen 7 PRO 8840HS with a 2.8K OLED display in a 1.22 kg chassis. The 35W HS-series chip provides workstation-class multi-core in an ultrabook form factor. LPDDR5x at 7500 MHz delivers excellent memory bandwidth.",
    knownIssues:
      "35W TDP in a slim chassis means fans are active under sustained loads. Soldered RAM at 32 GB max. The HS-series runs warmer than the U-series in equivalent chassis designs.",
    swissMarketNotes:
      "Strong contender for Swiss professionals wanting AMD with premium display. Competitive pricing vs Intel equivalents.",
    linuxNotes:
      "Lenovo-certified. AMD Zen 4 with RDNA 3 has excellent Linux support. The higher-power HS chip benefits from Linux power management improvements in kernel 6.7+.",
  },

  "x1-2in1-gen9": {
    editorialNotes:
      "The X1 2-in-1 Gen 9 debuts Intel Lunar Lake in a convertible form factor. The Arc 140V iGPU is the strongest integrated graphics in any ThinkPad convertible. The 2.8K OLED with touch and pen support creates an excellent annotation and creative tool.",
    knownIssues:
      "Lunar Lake's 8 threads limit heavy multi-core work. On-package memory means no upgrade path. Early Lunar Lake firmware may have occasional stability updates. The pen digitizer works best on Wayland.",
    swissMarketNotes:
      "Premium convertible for Swiss architects, designers, and executives. The pen-capable OLED with Lunar Lake efficiency is unique in the market.",
    linuxNotes:
      "Community-supported. Lunar Lake requires kernel 6.10+ for full hardware support. Pen input via libwacom, auto-rotation via iio-sensor-proxy.",
  },

  "t14-gen6-intel": {
    editorialNotes:
      "The T14 Gen 6 Intel offers an unprecedented breadth of platform choice: Lunar Lake V, Arrow Lake H, and Arrow Lake U processors in the same chassis. Dual SODIMM DDR5 maintained. Built-in Ethernet and the widest CPU selection of any current ThinkPad.",
    knownIssues:
      "Platform choice complexity — Lunar Lake models have soldered on-package RAM while Arrow Lake models have SODIMM slots. Ensure you check the specific platform when purchasing. Arrow Lake is a new platform with maturing firmware.",
    swissMarketNotes:
      "The default mainstream ThinkPad for Swiss IT departments. The platform variety allows a single model line to serve diverse user needs from basic office to development.",
    linuxNotes:
      "Lenovo-certified. Lunar Lake needs kernel 6.10+, Arrow Lake needs 6.8+. Check platform-specific requirements before deployment.",
  },

  "t14-gen6-amd": {
    editorialNotes:
      "The T14 Gen 6 AMD continues the AMD tradition of strong value with Ryzen 7 PRO 8840U and upgradeable DDR5 SODIMM slots. The Radeon 780M iGPU remains the strongest integrated graphics in any T-series ThinkPad.",
    knownIssues:
      "USB-C lacks Thunderbolt certification — check dock compatibility. The AMD variant may have slightly different display options than the Intel counterpart.",
    swissMarketNotes:
      "Typically CHF 100-200 below the Intel equivalent in Switzerland. Strong value for AMD-friendly organisations.",
    linuxNotes:
      "Lenovo-certified. AMD Zen 4 has the strongest Linux driver ecosystem of any current laptop platform. Excellent battery life under Linux.",
  },

  "t14s-gen6-intel": {
    editorialNotes:
      "The T14s Gen 6 Intel debuts Lunar Lake V-series in the slim T-series. On-package LPDDR5x-8533 provides exceptional memory bandwidth. The Arc 140V iGPU is the strongest integrated graphics in any T14s. Battery life is class-leading thanks to Lunar Lake's 17W TDP.",
    knownIssues:
      "Lunar Lake's 8 threads and 32 GB RAM cap limit expandability. On-package memory means no upgrade path. New platform — expect firmware refinements through the product lifecycle.",
    swissMarketNotes:
      "Premium T-series pricing in Switzerland. The Lunar Lake efficiency makes it compelling for Swiss professionals who prioritise all-day battery life.",
    linuxNotes:
      "Lenovo-certified. Lunar Lake requires kernel 6.10+. The Arc 140V iGPU needs mesa 24.1+ for full performance. Excellent efficiency under Linux power management.",
  },

  t480: {
    editorialNotes:
      "The legendary T480 — arguably the most beloved ThinkPad ever made. Dual-battery system (internal 24 Wh + hot-swappable external up to 72 Wh) gives unmatched real-world endurance. Two SODIMM slots support up to 64 GB RAM (officially 32 GB). The last T-series with a removable battery, bridge battery hot-swap, and full user upgradeability. A benchmark for what business laptops should be.",
    knownIssues:
      "8th Gen Intel is showing its age for modern workloads. The 250-nit FHD display is dim by 2025 standards. Thunderbolt 3 limited to 2 lanes. BIOS battery whitelist removed via community effort but stock batteries are increasingly hard to find. USB-C charging limited to 45 W.",
    swissMarketNotes:
      "The Swiss used market favourite. Excellent availability on Ricardo and Tutti at CHF 150–300 depending on condition and specs. Still widely deployed in Swiss corporate fleets being decommissioned. The WQHD panel variant commands a premium.",
    linuxNotes:
      "Lenovo-certified for Linux. 8th Gen Intel is the most mature and stable Linux platform — everything works perfectly out of the box on any modern distribution. The dual-battery system is fully supported by TLP and auto-cpufreq.",
  },

  t480s: {
    editorialNotes:
      "The slim variant of the legendary T480. Trades the dual-battery system and one DIMM slot for a thinner 1.32 kg chassis. The same excellent keyboard and port selection as the T480 in a more portable package. Popular in the used market alongside the T480.",
    knownIssues:
      "Max 24 GB RAM (8 GB soldered + 16 GB SODIMM) limits long-term usability. The 250-nit display is dim. No hot-swap external battery like the T480. Battery not user-replaceable.",
    swissMarketNotes:
      "Available on Ricardo and Tutti at CHF 150-350. Good value for students and budget-conscious buyers who want a premium ThinkPad experience.",
    linuxNotes:
      "Excellent Linux support. 8th Gen Intel is the most mature and stable Linux platform. All hardware works flawlessly on any modern distribution.",
  },

  // === Yoga / 2-in-1 convertibles ===
  "x1-yoga-3rd": {
    editorialNotes:
      "The X1 Yoga 3rd Gen introduced the silver aluminium chassis option alongside traditional ThinkPad black. The 2-in-1 form factor with garaged pen makes it a practical convertible. The 8th Gen Intel platform is proven and reliable. Shares much of the X1 Carbon 6th Gen DNA.",
    knownIssues:
      "The 54 Wh battery shows its age in 2025 — expect 4-6 hours of mixed use. The WQHD panel option is IPS rather than OLED. Thunderbolt 3 firmware should be updated for modern dock compatibility.",
    swissMarketNotes:
      "Available on Ricardo and Tutti for CHF 200-400. A practical used convertible for students and note-takers on a budget.",
    linuxNotes:
      "Certified for Ubuntu 18.04. 8th Gen Intel is rock solid on Linux. All convertible features including pen and auto-rotate work well.",
  },
  "x1-yoga-4th": {
    editorialNotes:
      "The 4th Gen refined the aluminium chassis and maintained the garaged pen. Available with 8th Gen or 10th Gen Intel CPUs depending on configuration. The iron-grey colour option was popular. Privacy Guard display option was unique to this generation.",
    knownIssues:
      "The FHD option is adequate but the 4K panel has noticeable battery impact. Some 10th Gen (Comet Lake) configurations run warmer than the 8th Gen variants.",
    swissMarketNotes: "Used market CHF 250-500 on Ricardo. Good value for a premium convertible with pen support.",
    linuxNotes:
      "Certified. Mature Intel platform works flawlessly. Both 8th and 10th Gen CPUs have excellent driver support.",
  },
  "x1-yoga-gen5": {
    editorialNotes:
      "The Gen 5 transitioned to the 16:10 display aspect ratio alongside the X1 Carbon Gen 8. Comet Lake (10th Gen) processors with Wi-Fi 6 and Thunderbolt 3. The garaged pen and 360-degree hinge continued unchanged.",
    knownIssues:
      "Comet Lake is the last pre-Tiger Lake platform — single-core performance lags behind 11th Gen alternatives. LPDDR4x capped at 16 GB.",
    swissMarketNotes: "Used market CHF 300-600. Still a capable convertible for office and note-taking workflows.",
    linuxNotes:
      "Certified for Ubuntu 20.04. Comet Lake platform is well-tested. All hardware works including pen digitizer.",
  },
  "x1-yoga-gen6": {
    editorialNotes:
      "The Gen 6 brought Tiger Lake (11th Gen) with Thunderbolt 4 and Iris Xe graphics — a significant GPU uplift over UHD. The WUXGA 16:10 panel became standard, with a stunning 4K+ option. The garaged ThinkPad Pen Pro is included.",
    knownIssues:
      "Early Tiger Lake BIOS had Thunderbolt dock wake issues — resolved in later updates. Some units exhibit coil whine under specific loads.",
    swissMarketNotes: "Used market CHF 500-900 depending on display option. The 4K+ panel variant commands a premium.",
    linuxNotes:
      "Certified for Ubuntu and RHEL. Tiger Lake Iris Xe needs kernel 5.11+ for full acceleration. Thunderbolt 4 docks work well on recent kernels.",
  },
  "x1-titanium-yoga": {
    editorialNotes:
      "A unique ThinkPad — the thinnest X1 ever at 11.5mm, with a titanium roll-cage and 13.5-inch 3:2 display. Designed to compete with the Surface Pro in convertible form. The 3:2 aspect ratio is excellent for documents and web browsing.",
    knownIssues:
      "Only two Thunderbolt 4 ports and a headphone jack — no USB-A, no HDMI. The 44.5 Wh battery limits runtime. No garaged pen — requires separate magnetic pen. Limited configurations available.",
    swissMarketNotes:
      "Rare in the Swiss market. Limited availability when new, even rarer used. Collector interest keeps prices above equivalent X1 Yogas.",
    linuxNotes:
      "Community-supported. The 3:2 display and Tiger Lake hardware work well. Limited community testing compared to mainstream X1 models due to low sales volume.",
  },
  "x1-2in1-gen10": {
    editorialNotes:
      "The Gen 10 continues the Lunar Lake platform from the Gen 9 with minor refinements. The X1 2-in-1 brand replaces X1 Yoga at the premium end. OLED and pen support remain, with Wi-Fi 7 and Bluetooth 5.4 connectivity.",
    knownIssues:
      "Same Lunar Lake considerations as the Gen 9 — power efficiency is excellent but sustained multi-core trails traditional H-class. Soldered RAM at 32 GB max.",
    swissMarketNotes: "Expected CHF 2500-3000 at Swiss retailers. Premium positioning against the X1 Carbon Gen 13.",
    linuxNotes:
      "Community-supported. Lunar Lake has good upstream kernel support (6.8+). Pen and touch work well under Wayland.",
  },
  "x13-yoga-gen1": {
    editorialNotes:
      "The X13 Yoga Gen 1 brought the convertible form factor to the compact X13 line. Comet Lake platform with garaged pen in a 13.3-inch chassis. Positioned below the X1 Yoga with a more affordable price point and similar convertible features.",
    knownIssues:
      "13.3-inch FHD is the only display option — no high-res panel choices. RAM soldered at 16 GB max. Comet Lake single-core is adequate but not impressive.",
    swissMarketNotes: "Used market CHF 200-400. Compact and practical for mobile professionals who need pen input.",
    linuxNotes:
      "Certified for Ubuntu 20.04. Comet Lake platform works well. Pen digitizer functions in both X11 and Wayland.",
  },
  "x13-yoga-gen2": {
    editorialNotes:
      "The Gen 2 upgraded to Tiger Lake with Iris Xe and Thunderbolt 4. The 16:10 display transition improved vertical screen space. Garaged pen continued. A solid mid-range convertible that shared Tiger Lake benefits with the X1 line.",
    knownIssues:
      "13.3-inch form factor limits thermal headroom for sustained loads. RAM soldered. Tiger Lake U-class has moderate multi-core performance.",
    swissMarketNotes: "Used market CHF 300-500. Good value for a Tiger Lake convertible with pen support.",
    linuxNotes: "Community-supported. Tiger Lake Iris Xe requires kernel 5.11+. Pen and touch work well.",
  },
  "x13-yoga-gen3": {
    editorialNotes:
      "The Gen 3 brought Alder Lake (12th Gen) with its hybrid P/E core architecture. The WQXGA display option (2560x1600) was a welcome addition. Wi-Fi 6E and Thunderbolt 4 continued. Garaged pen remained standard.",
    knownIssues:
      "Hybrid core scheduling on Linux was initially inconsistent — resolved in kernel 5.18+. The 54.7 Wh battery provides decent runtime for a 13-inch convertible.",
    swissMarketNotes:
      "Used/clearance CHF 600-900. A practical choice for pen-first workflows at a lower price than the X1 Yoga Gen 7.",
    linuxNotes:
      "Certified for Ubuntu 22.04. Alder Lake hybrid cores well-supported in kernel 5.17+. All hardware works.",
  },
  "x13-yoga-gen4": {
    editorialNotes:
      "The Gen 4 refined the Raptor Lake U-series with marginal performance gains over Alder Lake. The OLED display option (2.8K 90 Hz) elevated the display experience significantly. The last X13 Yoga generation before the X13 line was simplified.",
    knownIssues:
      "Raptor Lake U-series is a mild refresh — minimal performance uplift over Gen 3. OLED option impacts battery life compared to the IPS panel.",
    swissMarketNotes:
      "Clearance pricing CHF 900-1300. The OLED variant is particularly good value for creative professionals who need pen input.",
    linuxNotes:
      "Certified for Ubuntu 22.04. Raptor Lake is a stable Linux platform. All hardware including the OLED panel works well.",
  },
  "l13-yoga-gen1": {
    editorialNotes:
      "The L13 Yoga Gen 1 brought convertible functionality to the budget L-series. Comet Lake platform with basic pen support in a 13.3-inch chassis. The ThinkPad keyboard and build quality set it apart from consumer convertibles at this price.",
    knownIssues:
      "300-nit display is acceptable but not bright for outdoor use. Heavier than X-series convertibles at 1.43 kg. USB-C ports lack Thunderbolt — no eGPU or TB docks.",
    swissMarketNotes:
      "Used market CHF 150-300 on Ricardo. Budget option for IT fleets needing convertible functionality.",
    linuxNotes:
      "Community-supported. Comet Lake works well. All basic hardware functions. No Thunderbolt simplifies dock compatibility.",
  },
  "l13-yoga-gen2-intel": {
    editorialNotes:
      "The Gen 2 Intel brought Tiger Lake with one Thunderbolt 4 port — a meaningful upgrade over the Gen 1. Iris Xe graphics provided a notable GPU uplift. The build quality and keyboard remained strong for the price point.",
    knownIssues:
      "Only one Thunderbolt 4 port (second USB-C is standard). Display limited to FHD options. 16 GB soldered RAM cap.",
    swissMarketNotes: "Used market CHF 200-400. Good budget Tiger Lake convertible for Swiss SMBs.",
    linuxNotes:
      "Community-supported. Tiger Lake works well on kernel 5.11+. The single Thunderbolt port works with standard docks.",
  },
  "l13-yoga-gen2-amd": {
    editorialNotes:
      "The AMD variant offered Ryzen PRO 5000 with strong multi-core performance at a budget price. No Thunderbolt but USB-C 3.2 covers most dock scenarios. The Zen 3 architecture delivered meaningful performance uplift over Intel U-class alternatives.",
    knownIssues:
      "No Thunderbolt — USB-C only. 16 GB soldered RAM cap. AMD variant had limited availability in some markets.",
    swissMarketNotes: "Used market CHF 200-350. Less common than the Intel variant on the Swiss used market.",
    linuxNotes:
      "Community-supported. AMD Ryzen PRO 5000 has excellent open-source drivers. Radeon graphics work out of the box with amdgpu.",
  },
  "l13-yoga-gen3-intel": {
    editorialNotes:
      "The Gen 3 Intel brought Alder Lake and the 16:10 WUXGA display transition. One Thunderbolt 4 port continued. Wi-Fi 6E was a welcome addition. A practical upgrade over Gen 2 for those who need a budget convertible.",
    knownIssues: "Still limited to DDR4 despite Alder Lake platform. 300-nit display remains. 16 GB RAM cap.",
    swissMarketNotes: "Used/clearance CHF 400-700. Practical for Swiss education and SMB markets.",
    linuxNotes: "Community-supported. Alder Lake is well-supported on kernel 5.17+.",
  },
  "l13-yoga-gen3-amd": {
    editorialNotes:
      "The AMD Gen 3 used a Ryzen PRO 5000 refresh (5675U/5875U) — same Zen 3 architecture as Gen 2 AMD with minor clock adjustments. Still competitive performance with excellent power efficiency.",
    knownIssues:
      "Ryzen PRO 5000 refresh is not a new architecture — marginal gains over Gen 2. DDR4 and 16 GB cap continue. No Thunderbolt.",
    swissMarketNotes: "Used/clearance CHF 350-600. Budget AMD convertible for Swiss markets.",
    linuxNotes: "Community-supported. Zen 3 is mature and rock-solid on Linux. AMD drivers are excellent.",
  },
  "l13-yoga-gen4-intel": {
    editorialNotes:
      "The Gen 4 Intel brought Raptor Lake U-series and DDR5 memory to the L13 Yoga line. The shift from DDR4 to DDR5 was the most notable upgrade. Thunderbolt 4 continued with one port.",
    knownIssues: "Raptor Lake U-series is a mild refresh. Still 16 GB max RAM. The 300-nit display persists.",
    swissMarketNotes: "Available at CHF 700-1000. Positioned for Swiss SMBs and education.",
    linuxNotes: "Community-supported. Raptor Lake is stable. DDR5 has no Linux-specific issues.",
  },
  "l13-yoga-gen4-amd": {
    editorialNotes:
      "The AMD Gen 4 used Ryzen PRO 7000 (7530U/7730U) — a Zen 3 rebrand with minor tweaks, not the Zen 4 architecture. Still delivers solid multi-core performance with good power efficiency for a budget convertible.",
    knownIssues:
      "Ryzen PRO 7530U/7730U are Zen 3 rebadges, not genuine Zen 4. DDR4 remains despite the '7000' branding. 16 GB max RAM.",
    swissMarketNotes:
      "Available at CHF 600-900. The AMD variant is often CHF 50-100 less than Intel at equivalent specs.",
    linuxNotes: "Community-supported. Zen 3 rebrand means extremely mature Linux drivers. No surprises.",
  },
  "l13-2in1-gen5-intel": {
    editorialNotes:
      "Rebranded from L13 Yoga to L13 2-in-1, this Gen 5 brings Meteor Lake Core Ultra to the budget convertible line. The NPU is included but real-world AI workloads are still limited. HDMI 2.1 and one Thunderbolt 4 port are welcome upgrades.",
    knownIssues:
      "Meteor Lake U-series has modest performance — similar to 13th Gen in many workloads. 16 GB RAM cap continues. Display unchanged at 300 nits.",
    swissMarketNotes: "Available at CHF 800-1100. Budget Meteor Lake convertible for Swiss IT departments.",
    linuxNotes: "Community-supported. Meteor Lake has improving Linux support — kernel 6.6+ recommended.",
  },
  "l13-2in1-gen6-intel": {
    editorialNotes:
      "The Gen 6 Intel brings Arrow Lake U-series to the budget L13 2-in-1 line. Modest generational improvements in power efficiency. The chassis and display are largely unchanged from Gen 5.",
    knownIssues:
      "Arrow Lake U-series is new — driver maturity is still developing. Same 300-nit display and 16 GB RAM cap.",
    swissMarketNotes: "Expected at CHF 900-1200 upon Swiss launch. Budget convertible for 2025.",
    linuxNotes:
      "Community-supported. Arrow Lake needs kernel 6.8+ for full support. New platform — expect early-adopter considerations.",
  },
  "l13-2in1-gen6-amd": {
    editorialNotes:
      "The AMD Gen 6 brings Ryzen PRO 8000 (Hawk Point, Zen 4) — a genuine architectural upgrade over the Zen 3 rebadges in Gen 4. DDR5 memory and improved power efficiency make this the strongest AMD L13 convertible to date.",
    knownIssues:
      "Hawk Point is a Zen 4 refresh — good but not the latest Zen 5. 16 GB RAM cap still present. No Thunderbolt.",
    swissMarketNotes:
      "Expected at CHF 800-1100. Strong value proposition for Swiss SMBs wanting modern AMD convertible.",
    linuxNotes:
      "Community-supported. Ryzen PRO 8000 (Hawk Point) has strong open-source driver support. AMD stack is reliable.",
  },

  // === IdeaPad Pro 5 / 5i / 7 ===
  "ideapad-pro-5-14-gen9-amd": {
    editorialNotes:
      "The IdeaPad Pro 5 14 Gen 9 AMD pairs a Ryzen 7 8845HS with a stunning 2.8K 120 Hz OLED panel in a 1.46 kg chassis — rare for a 14-inch creator laptop at this price. The Radeon 780M iGPU handles light creative tasks admirably, and the 73 Wh battery provides a full working day. A genuine ThinkPad-quality keyboard in a consumer package.",
    swissMarketNotes:
      "Available at Digitec and Brack typically in the CHF 1200–1500 range. Strong value proposition compared to ThinkPad T14s Gen 5 AMD at similar specs. Watch for seasonal discounts at Digitec during major sale periods.",
    linuxNotes:
      "Community-supported. Ryzen 8845HS with Zen 4 and RDNA 3 has excellent Linux driver support via amdgpu. Wi-Fi 6E (MediaTek) requires kernel 6.1+. OLED panel works natively.",
  },

  "ideapad-pro-5-16-gen9-amd": {
    editorialNotes:
      "The 16-inch AMD variant trades portability for a larger display and an 84 Wh battery — one of the largest in any 16-inch consumer laptop. The Ryzen 7 8845HS delivers strong sustained performance, and the 2.8K 120 Hz OLED panel is a highlight at this price tier. An excellent desk-and-couch machine for creators who occasionally travel.",
    swissMarketNotes:
      "Available at Digitec and Brack in the CHF 1300–1700 range. The large battery makes it a popular choice for Swiss professionals who work from cafés and client sites without easy access to power.",
    linuxNotes:
      "Community-supported. Same strong AMD Linux stack as the 14-inch model. The larger chassis provides better thermals for sustained workloads under Linux.",
  },

  "ideapad-pro-5i-14-gen9": {
    editorialNotes:
      "The 14-inch Intel variant brings Thunderbolt 4 — a meaningful distinction over the AMD models for users invested in TB docks or eGPU setups. Core Ultra 7 155H in a 14-inch chassis provides excellent single-core performance. The 2.8K OLED option rounds out a capable creator package.",
    swissMarketNotes:
      "Stocked at Digitec and Brack in the CHF 1300–1600 range. Thunderbolt 4 is the key differentiator for Swiss users with existing ThinkPad dock setups — compatible with the ThinkPad Thunderbolt 4 Workstation Dock.",
    linuxNotes:
      "Community-supported. Meteor Lake Core Ultra requires kernel 6.6+ for full hardware support. Thunderbolt 4 works well with standard Linux TB stacks. NPU not yet widely utilised on Linux.",
  },

  "ideapad-pro-5i-16-gen9": {
    editorialNotes:
      "The 16-inch Intel model with Core Ultra 7 155H and 1 TB storage standard is well-configured out of the box for most creative workloads. Thunderbolt 4 connectivity and an 84 Wh battery make it a well-rounded performer. The 2.8K 120 Hz OLED display is excellent for video editing and photo work.",
    swissMarketNotes:
      "Available at Digitec and Brack in the CHF 1400–1800 range. The 1 TB storage baseline and Thunderbolt 4 make it a competitive option for Swiss creative professionals who need a capable machine without post-purchase upgrades.",
    linuxNotes:
      "Community-supported. Meteor Lake platform with kernel 6.6+. Intel Arc graphics on recent Mesa versions. Thunderbolt 4 reliable for dock use.",
  },

  "ideapad-pro-5-14-gen8-amd": {
    editorialNotes:
      "The 2023 Gen 8 AMD was the model that put the IdeaPad Pro on the map for value-conscious creators. The Ryzen 7 7745HX with Zen 4 and a 2.8K 120 Hz OLED display delivered near-workstation performance in a slim consumer chassis. A landmark generation for the series.",
    knownIssues:
      "The 7745HX is a 55W HX-class chip — thermal management in the slim chassis means fans are audible under sustained loads. Ensure adequate ventilation for prolonged creative workloads.",
    swissMarketNotes:
      "Now available at clearance pricing at Digitec and Brack as Gen 9 stock arrives. Excellent value for CHF 900–1200 for remaining units. Still a highly capable machine.",
    linuxNotes:
      "Community-supported. Zen 4 with RDNA 3 has strong Linux support. The HX-class chip runs hot — confirm thermal management under Linux before sustained workloads.",
  },

  "ideapad-pro-5-16-gen8-amd": {
    editorialNotes:
      "The 16-inch Gen 8 AMD offered user-upgradeable DDR5 SODIMM slots — a notable feature often absent in thin consumer laptops. Ryzen 7 7745HX with the option for an RTX 4050 discrete GPU made it a genuine entry-level creator and gaming machine.",
    knownIssues:
      "HX-class 55W TDP in a consumer chassis means active cooling is always present under load. Fan noise is higher than U/H-series alternatives.",
    swissMarketNotes:
      "Clearance pricing at CHF 1000–1400 at Digitec and Brack. The upgradeable RAM is a practical advantage for buyers who want to extend the machine's lifespan.",
    linuxNotes:
      "Community-supported. The discrete RTX 4050 option requires NVIDIA proprietary drivers. PRIME hybrid graphics configuration needed for optimal performance and battery balance.",
  },

  "ideapad-pro-5i-14-gen8": {
    editorialNotes:
      "The 2023 14-inch Intel variant with 13th Gen Core i7-13700H and optional 2.8K OLED offered strong single-core performance and Thunderbolt 4 in a compact creator chassis. Soldered LPDDR5 limits long-term upgradeability but the base 16/32 GB configurations cover most use cases.",
    knownIssues:
      "13th Gen Raptor Lake H-series runs warmer than U-series alternatives — adequate but noticeable in a thin chassis. Soldered LPDDR5 means no RAM upgrade path.",
    swissMarketNotes:
      "Available at clearance pricing CHF 900–1300 at Digitec and Brack. Thunderbolt 4 compatibility with existing Intel dock infrastructure is the key purchase reason over the AMD variant.",
  },

  "ideapad-pro-5i-16-gen8": {
    editorialNotes:
      "The 16-inch 2023 Intel model stood out for offering user-upgradeable DDR5 SODIMM slots alongside Thunderbolt 4 — a combination hard to find at this price tier. The 13th Gen Core i7-13700H with optional RTX 4050 provided a balanced creative and gaming platform.",
    knownIssues:
      "H-series thermals are managed adequately but fan noise is present under load. Base storage configurations may need upgrading — the 512 GB SSD fills up quickly for creative workflows.",
    swissMarketNotes:
      "Clearance pricing CHF 1100–1500 at Digitec and Brack. The upgradeable DDR5 RAM and Thunderbolt 4 together make it one of the best-value 16-inch creator laptops for the Swiss market.",
    linuxNotes:
      "Community-supported. 13th Gen Raptor Lake H is well-supported on kernel 6.2+. SODIMM slots appreciated for self-upgrade builds.",
  },

  "ideapad-pro-5-14-gen10-amd": {
    editorialNotes:
      "The 2025 Gen 10 AMD makes the leap to Ryzen AI 300 (Strix Point, Zen 5) with a dedicated NPU for AI acceleration and Wi-Fi 7 for future-proof connectivity. The 2.8K 120 Hz OLED remains. This is the most capable 14-inch AMD IdeaPad Pro to date, with meaningful IPC gains from Zen 5.",
    swissMarketNotes:
      "Expected at Digitec and Brack in the CHF 1300–1600 range. Wi-Fi 7 is forward-looking — most Swiss home and office routers are still Wi-Fi 6/6E, but the investment will pay off as infrastructure upgrades.",
    linuxNotes:
      "Community-supported. Ryzen AI 300 (Strix Point) requires kernel 6.9+ for full Zen 5 and RDNA 3.5 support. Wi-Fi 7 adapter support varies — check specific chipset before deployment.",
  },

  "ideapad-pro-5-16-gen10-amd": {
    editorialNotes:
      "The 2025 16-inch AMD model brings Ryzen AI 300 to the large-format IdeaPad Pro. The Zen 5 architecture provides the strongest multi-core performance in any IdeaPad Pro to date. Combined with an 84 Wh battery and 2.8K OLED, it is a complete creator workstation without the workstation price.",
    swissMarketNotes:
      "Expected at Digitec and Brack in the CHF 1400–1800 range. The large battery and Ryzen AI performance make it well-suited for Swiss creative professionals who work away from desks.",
    linuxNotes:
      "Community-supported. Ryzen AI 300 with Zen 5 is the newest AMD platform — expect kernel 6.9+ for full support with driver maturity improving through 2025.",
  },

  "ideapad-pro-5i-14-gen10": {
    editorialNotes:
      "The 2025 14-inch Intel model debuts Intel Arrow Lake (Core Ultra 200H) with the integrated Intel Arc graphics — a meaningful GPU uplift over the previous Iris Xe generation. Thunderbolt 4 continues for dock compatibility. A capable creator ultrabook for Intel-ecosystem users.",
    swissMarketNotes:
      "Expected at Digitec and Brack in the CHF 1300–1600 range. Thunderbolt 4 maintains compatibility with existing Swiss corporate dock setups. Arrow Lake brings tangible performance gains over Meteor Lake predecessors.",
    linuxNotes:
      "Community-supported. Arrow Lake requires kernel 6.8+ for full hardware support. Intel Arc graphics on i915/Xe driver — Xe2 architecture has improving Mesa support.",
  },

  "ideapad-pro-5i-16-gen10": {
    editorialNotes:
      "The 2025 16-inch Intel model pairs Arrow Lake with Wi-Fi 7 and Thunderbolt 4 in a large-format creator chassis. Improved Intel Arc integrated graphics handle light GPU workloads better than previous generations. A strong productivity and content creation machine for users in the Intel ecosystem.",
    swissMarketNotes:
      "Expected at Digitec and Brack in the CHF 1400–1900 range. Wi-Fi 7 and Thunderbolt 4 together make it a well-connected choice for Swiss professionals upgrading from older platforms.",
    linuxNotes:
      "Community-supported. Arrow Lake on kernel 6.8+. Intel Arc Xe2 iGPU has improving open-source driver support in Mesa 24.1+.",
  },

  "ideapad-pro-7-14-gen9": {
    editorialNotes:
      "The IdeaPad Pro 7 14 is Lenovo's premium consumer creator laptop — a tier above the Pro 5i. The 14.5-inch 3K OLED at 600 nits and 120 Hz is one of the brightest and sharpest laptop displays available. Core Ultra 9 185H delivers near-workstation multi-core performance. The aluminium chassis and refined aesthetics push it toward MacBook Pro territory in terms of build quality.",
    knownIssues:
      "Core Ultra 9 in a thin chassis means thermal management is active — fan noise is present under sustained creative workloads. The 14.5-inch form factor is slightly unusual — not a standard 14 or 15-inch size.",
    swissMarketNotes:
      "Premium positioning — typically CHF 2000–2500 at Digitec and Brack. Competes directly with the MacBook Pro 14 M3 for Swiss creative professionals. The Windows ecosystem and upgradeable NVMe storage are practical advantages over Apple for many Swiss business workflows.",
    linuxNotes:
      "Community-supported. Core Ultra 9 185H with Meteor Lake has solid kernel 6.6+ support. The 3K OLED works well at native resolution. Not recommended for Linux without community testing of the specific panel.",
  },

  "ideapad-pro-7-16-gen9": {
    editorialNotes:
      "The IdeaPad Pro 7 16 is Lenovo's flagship consumer creator laptop. The 3.2K 120 Hz OLED at 600 nits is among the finest displays on any laptop — exceptional for photo and video work. Core Ultra 9 185H with optional NVIDIA discrete GPU creates a genuine creative workstation in a 1.9 kg package.",
    knownIssues:
      "At 1.9 kg it is not a lightweight portable. Sustained GPU workloads generate heat — the chassis thermals are managed but audible. The OLED panel, while stunning, benefits from the auto-brightness calibration feature to reduce burn-in risk with static UI elements.",
    swissMarketNotes:
      "Premium segment — typically CHF 2200–2800 at Digitec and Brack. Directly competes with the MacBook Pro 16 M3 for Swiss creative professionals. The NVIDIA GPU option provides clear advantages for video rendering, 3D, and ML workflows not easily replicated on Apple Silicon.",
    linuxNotes:
      "Community-supported. Core Ultra 9 with Meteor Lake kernel 6.6+. NVIDIA discrete GPU option requires proprietary drivers and PRIME hybrid graphics configuration. Intel-only configurations are simpler for Linux.",
  },

  // === Legion (2024, Gen 9) ===
  "legion-5-16-gen9-amd": {
    editorialNotes:
      "The Legion 5 16 Gen 9 AMD is Lenovo's mainstream 2024 gaming laptop built around AMD Ryzen 7 8845HS and an NVIDIA RTX 4050 or 4060 Laptop GPU. The 2.5K 165 Hz IPS panel with 350 nits is solid for gaming without the premium of OLED. Dual SODIMM DDR5 slots mean RAM is user-upgradeable — a rare advantage in 2024 gaming laptops. The USB4 port adds versatility for external GPU docks or fast storage.",
    knownIssues:
      "The 350-nit display brightness is adequate but not outstanding in bright environments. Fan noise under sustained load is audible — expected for the chassis size. The base 16 GB DDR5 configuration benefits from upgrade to 32 GB for modern titles.",
    swissMarketNotes:
      "Available at Digitec and Brack in the CHF 1200–1500 range depending on GPU tier. The RTX 4060 configuration offers strong price-to-performance in the Swiss market. Upgradeable RAM and dual NVMe slots reduce long-term TCO.",
    linuxNotes:
      "Community-supported. Ryzen 7 8845HS well-supported on kernel 6.5+. NVIDIA RTX 4050/4060 requires proprietary drivers — install via RPM Fusion on Fedora or nvidia-dkms on Arch/Ubuntu. AMD iGPU (Radeon 780M) works as amdgpu fallback for battery use.",
  },
  "legion-5i-16-gen9": {
    editorialNotes:
      "The Legion 5i 16 Gen 9 brings Intel Core i7-14700HX (Raptor Lake Refresh HX) with up to RTX 4070 Laptop GPU to Lenovo's mainstream 2024 gaming line. The 20-core HX processor delivers strong multi-threaded performance, notably better than the AMD variant's 8-core Ryzen HS in heavily threaded workloads. Thunderbolt 4 enables external GPU docking and high-speed peripherals. Dual SODIMM DDR5 slots retain upgradeability.",
    knownIssues:
      "Intel HX thermals run warmer than AMD HS at equivalent loads — adequate cooling but audible fans under sustained gaming. The base DDR5-5600 benefits from XMP profiles which may not activate automatically.",
    swissMarketNotes:
      "Available at Digitec and Brack in the CHF 1300–1600 range. Intel variant typically CHF 100–200 more than AMD equivalent — Thunderbolt 4 justifies the premium for Swiss users with Intel dock infrastructure.",
    linuxNotes:
      "Community-supported. Core i7-14700HX well-supported on kernel 6.5+. NVIDIA dGPU requires proprietary drivers. Intel iGPU handles display by default — use prime-run for GPU-intensive workloads. Thunderbolt 4 functional on recent kernels.",
  },
  "legion-7i-16-gen9": {
    editorialNotes:
      "The Legion 7i 16 Gen 9 is Lenovo's premium 2024 gaming laptop, pairing Intel Core i9-14900HX with RTX 4070 or 4080 Laptop GPU. The 3.2K 240 Hz IPS display at 500 nits delivers genuinely smooth high-refresh gaming at near-4K resolution. The 99 Wh battery is the maximum allowed on aircraft — meaningful for travel. Dual SODIMM DDR5 and dual NVMe give full user upgradeability.",
    knownIssues:
      "The 2.58 kg weight is substantial for travel use. Core i9-14900HX under full gaming load can throttle without adequate airflow — performance improves on hard flat surfaces. High GPU TGP under gaming means the 99 Wh battery depletes quickly.",
    swissMarketNotes:
      "Premium segment — CHF 2000–2500 at Digitec and Brack for RTX 4070 configuration; RTX 4080 SKUs at CHF 2500+. Competes directly with ASUS ROG Zephyrus and MSI Raider for Swiss gaming enthusiasts.",
    linuxNotes:
      "Community-supported. Core i9-14900HX well-supported on kernel 6.5+. NVIDIA RTX 4070/4080 requires proprietary drivers — RPM Fusion on Fedora. High GPU TGP — verify NVIDIA driver power management settings for sustained Linux workloads.",
  },
  "legion-pro-5-16-gen9-amd": {
    editorialNotes:
      "The Legion Pro 5 16 AMD Gen 9 uses AMD Ryzen 9 8945HS with RTX 4070 Laptop GPU in a chassis tuned for higher sustained TGP than the standard Legion 5. The 2.5K 240 Hz 500-nit display is a step above the standard Legion 5 panel — better refresh and brighter. 64 GB DDR5 max capacity accommodates demanding game development and creative workflows. A strong AMD-platform gaming workstation.",
    swissMarketNotes:
      "Available at Digitec and Brack in the CHF 1600–2000 range. The Pro chassis sustained performance advantage over standard Legion 5 is meaningful for compute-intensive Swiss creative users, not just gamers.",
    linuxNotes:
      "Community-supported. Ryzen 9 8945HS well-supported on kernel 6.5+. NVIDIA RTX 4070 Laptop requires proprietary drivers. AMD Radeon 780M iGPU via amdgpu as power-efficient fallback for non-gaming tasks.",
  },
  "legion-pro-5i-16-gen9": {
    editorialNotes:
      "The Legion Pro 5i 16 Gen 9 pairs Intel Core i9-14900HX with RTX 4070 or 4080 Laptop in a high-TDP Pro chassis. The 240 Hz 2.5K 500-nit display and 64 GB DDR5 max RAM position it as a gaming workstation rather than a casual gaming laptop. Thunderbolt 4 adds professional dock and eGPU compatibility. The 80 Wh battery is modest given the power draw but typical for the segment.",
    swissMarketNotes:
      "Available at Digitec and Brack in the CHF 1700–2200 range. Intel platform justified for Swiss users already invested in Thunderbolt 4 infrastructure. RTX 4080 SKU competes with workstation-class configurations.",
    linuxNotes:
      "Community-supported. Core i9-14900HX well-supported on kernel 6.5+. NVIDIA RTX 4070/4080 Laptop — proprietary drivers required. prime-run for discrete GPU workloads. Thunderbolt 4 dock support functional on recent kernels.",
  },
  "legion-slim-5-14-gen9-amd": {
    editorialNotes:
      "The Legion Slim 5 14 Gen 9 AMD is Lenovo's attempt to bring serious gaming performance to a 1.62 kg portable. The Ryzen 7 8845HS + RTX 4050 Laptop in a sub-15mm chassis is genuinely impressive — sustained gaming performance is lower than the full Legion 5 but workable. The 2.8K OLED at 120 Hz is exceptional for the category and far above competing gaming ultrabooks' typical IPS panels. Soldered LPDDR5x RAM is the key compromise.",
    knownIssues:
      "Soldered LPDDR5x means no RAM upgrade path — buy the 32 GB configuration if budget allows. Sustained gaming TGP is lower than full Legion 5 due to chassis thermal limits. The OLED panel draws more battery power during gaming than IPS alternatives.",
    swissMarketNotes:
      "Available at Digitec and Brack in the CHF 1300–1600 range. Competes with ASUS ROG Zephyrus G14 for Swiss users wanting a portable gaming laptop. The OLED display is a genuine differentiator at this price.",
    linuxNotes:
      "Community-supported. Ryzen 7 8845HS well-supported on kernel 6.5+. NVIDIA RTX 4050 Laptop requires proprietary drivers. The 2.8K OLED panel works correctly under Wayland at native resolution — Wayland recommended over X11 for fractional scaling.",
  },
  "legion-slim-5-16-gen9-amd": {
    editorialNotes:
      "The Legion Slim 5 16 Gen 9 AMD extends the Slim chassis to 16 inches with Ryzen 7 8845HS and RTX 4060 Laptop in a 1.91 kg package — remarkable for a 16-inch gaming laptop. The 2.5K 165 Hz IPS display is a step down from the 14-inch Slim's OLED but the larger screen and higher GPU tier make it a better all-rounder. Soldered LPDDR5x is the same compromise as the 14-inch sibling.",
    knownIssues:
      "Soldered RAM limits long-term upgradeability — spec carefully at purchase. The 1.91 kg is lighter than typical 16-inch gaming laptops but the PSU adds weight for travel. Thermal headroom is tighter than the full Legion 5 at equivalent loads.",
    swissMarketNotes:
      "Available at Digitec and Brack in the CHF 1400–1700 range. A compelling choice for Swiss users who want 16-inch gaming portability without the 2.3+ kg chassis weight of standard gaming laptops.",
    linuxNotes:
      "Community-supported. Ryzen 7 8845HS + RTX 4060 Laptop — same driver situation as other 2024 AMD Legion models. NVIDIA proprietary driver required. Slim chassis means fan noise may be more noticeable under Linux gaming load.",
  },

  // === Legion (2023, Gen 8) ===
  "legion-5-15-gen8-amd": {
    editorialNotes:
      "The Legion 5 15 Gen 8 AMD introduced AMD Ryzen 7 7840HS (Phoenix) with RTX 4060 Laptop in Lenovo's 2023 mainstream gaming line. The 15.6-inch 2.5K 165 Hz IPS panel was a step up from prior 1080p panels in the series. Dual SODIMM DDR5 and dual NVMe slots retain full user upgradeability. A well-balanced 2023 gaming laptop that ages well.",
    swissMarketNotes:
      "Now at clearance pricing CHF 900–1200 at Digitec and Brack. The Ryzen 7 7840HS remains performant for current titles. A strong second-hand value pick if found below CHF 900 with 32 GB RAM.",
    linuxNotes:
      "Community-supported. Ryzen 7 7840HS (Phoenix) well-supported on kernel 6.3+. NVIDIA RTX 4060 Laptop — proprietary drivers via RPM Fusion or nvidia-dkms. AMD iGPU (Radeon 780M) usable via amdgpu. One of the better 2023 AMD gaming Linux platforms.",
  },
  "legion-5i-16-gen8": {
    editorialNotes:
      "The Legion 5i 16 Gen 8 brought Intel Core i7-13700H (Raptor Lake H) with RTX 4060 Laptop to Lenovo's 2023 mainstream Intel gaming line. The 16-inch 2.5K 165 Hz IPS panel offered more screen real estate than the Gen 7 15-inch. Thunderbolt 4 and dual SODIMM DDR5 made it a practical choice for users upgrading from older Intel systems with existing dock infrastructure.",
    swissMarketNotes:
      "Available at clearance pricing CHF 900–1200 at Digitec and Brack. Core i7-13700H remains capable for current titles. Thunderbolt 4 dock compatibility makes it a solid upgrade pick for Swiss corporate users.",
    linuxNotes:
      "Community-supported. Core i7-13700H well-supported on kernel 6.2+. NVIDIA RTX 4060 Laptop — proprietary drivers required. Thunderbolt 4 functional. A mature and stable Linux gaming platform.",
  },
  "legion-pro-5i-16-gen8": {
    editorialNotes:
      "The Legion Pro 5i 16 Gen 8 was Lenovo's 2023 high-end Intel gaming workhorse — Core i9-13900HX with RTX 4070 or 4080 Laptop in a sustained-performance Pro chassis. The 240 Hz 2.5K 500-nit display and 64 GB DDR5 max RAM positioned it as a gaming workstation. The 24-core HX chip delivered near-desktop sustained compute performance, making it genuinely relevant for 3D rendering and simulation alongside gaming.",
    swissMarketNotes:
      "Clearance pricing CHF 1400–1800 at Digitec and Brack. Strong residual value — Core i9-13900HX + RTX 4070/4080 remains a capable configuration for 2025 titles. Look for 32 GB+ RAM configurations.",
    linuxNotes:
      "Community-supported. Core i9-13900HX well-supported on kernel 6.2+. NVIDIA RTX 4070/4080 Laptop — proprietary drivers essential. Thunderbolt 4 functional. A stable and well-understood Linux gaming platform.",
  },

  // === Legion (2022, Gen 7) ===
  "legion-5-15-gen7-amd": {
    editorialNotes:
      "The Legion 5 15 Gen 7 AMD brought AMD Ryzen 7 6800H (Rembrandt) with RDNA 2 iGPU and RTX 3060 Laptop to Lenovo's 2022 mainstream gaming line. The 15.6-inch 2.5K 165 Hz IPS panel was a notable upgrade from 1080p predecessors. Dual SODIMM DDR5 and dual NVMe slots. The RTX 3060 remains capable for 1080p and light 1440p gaming in 2025 titles. A well-aged platform with broad community support.",
    swissMarketNotes:
      "Strong second-hand value — CHF 600–900 on Ricardo and Tutti. The DDR5 platform and upgradeable storage extend usability. RTX 3060 Laptop handles current esports titles at high settings. A smart budget entry to 1440p gaming in the Swiss used market.",
    linuxNotes:
      "Community-supported. Ryzen 7 6800H (Rembrandt) well-supported on kernel 5.19+. NVIDIA RTX 3060 Laptop — a mature NVIDIA Linux driver target, well-covered by 525+ drivers. One of the best-supported AMD Legion configurations for Linux due to platform maturity.",
  },
  "legion-5i-15-gen7": {
    editorialNotes:
      "The Legion 5i 15 Gen 7 paired Intel Core i7-12700H (Alder Lake H) with RTX 3070 Laptop in Lenovo's 2022 mainstream Intel gaming line. The 15.6-inch 2.5K 165 Hz IPS display and Thunderbolt 4 were the key differentiators over the AMD variant. The RTX 3070 Laptop offers meaningful performance headroom over the RTX 3060 in the AMD Gen 7, particularly for 1440p gaming. Dual DDR5 SODIMM slots retained.",
    swissMarketNotes:
      "Second-hand pricing CHF 700–1000 on Ricardo and Tutti. The RTX 3070 Laptop delivers solid 1440p performance in 2025 esports and mid-tier titles. Thunderbolt 4 remains compatible with current docks — a practical advantage for second-hand Swiss corporate buyers.",
    linuxNotes:
      "Community-supported. Core i7-12700H (Alder Lake H) well-supported from kernel 5.19+. NVIDIA RTX 3070 Laptop — mature NVIDIA driver target. Thunderbolt 4 functional. A stable, mature Linux gaming platform with extensive community documentation.",
  },

  // === Legion (2025, Gen 10) ===
  "legion-5-15-gen10-amd": {
    editorialNotes:
      "The Legion 5 16 Gen 10 AMD debuts AMD Ryzen 7 9755HX (Fire Range, Zen 5) paired with NVIDIA RTX 5070 Laptop GPU — Lenovo's entry into next-generation Blackwell gaming hardware for 2025. The HX-class processor brings 8 high-performance Zen 5 cores with significantly improved IPC over Zen 4, delivering near-desktop performance in a gaming laptop. Wi-Fi 7 is standard. The 2.5K 165 Hz IPS display and upgradeable DDR5 SODIMM slots continue the Legion 5 tradition of practical upgradeability.",
    swissMarketNotes:
      "Expected at Digitec and Brack in the CHF 1600–2000 range at launch. RTX 5070 Laptop delivers a meaningful generational leap over RTX 4060 predecessor configurations. Early adopter pricing — expect reductions of CHF 200–300 within 6 months of launch.",
    linuxNotes:
      "Community-supported. Ryzen 7 9755HX (Zen 5, Fire Range) requires kernel 6.10+ for full support. NVIDIA RTX 5070 Laptop (Blackwell) needs NVIDIA driver 570+ — earliest adoption; verify driver availability on your distro before purchase. Wi-Fi 7 adapter (Intel BE200) supported from kernel 6.8+.",
  },
  "legion-5i-15-gen10": {
    editorialNotes:
      "The Legion 5i 16 Gen 10 brings Intel Core Ultra 7 275HX (Arrow Lake HX) with RTX 5070 Laptop GPU to Lenovo's 2025 mainstream Intel gaming line. Arrow Lake HX delivers improved efficiency over Raptor Lake Refresh HX predecessors while maintaining high sustained multi-thread performance with 20 cores. Thunderbolt 4 continues for dock compatibility. Wi-Fi 7 standard. The Intel-platform gaming laptop for users committed to Intel infrastructure.",
    swissMarketNotes:
      "Expected at Digitec and Brack in the CHF 1700–2100 range at launch. Intel variant carries a premium over AMD equivalent — Thunderbolt 4 and Intel ecosystem compatibility justify this for Swiss corporate users with existing dock setups.",
    linuxNotes:
      "Community-supported. Intel Core Ultra 7 275HX (Arrow Lake HX) well-supported in kernel 6.10+. NVIDIA RTX 5070 Laptop (Blackwell) requires driver 570+. Wi-Fi 7 via Intel BE200 (iwlwifi, 6.8+). Thunderbolt 4 functional on recent kernels.",
  },
  "legion-7i-16-gen10": {
    editorialNotes:
      "The Legion 7i 16 Gen 10 is Lenovo's 2025 premium gaming laptop — Intel Core Ultra 9 275HX with RTX 5070 or 5080 Laptop GPU options, 4K OLED 240 Hz display, and up to 64 GB DDR5-6400. The OLED panel is the standout — perfect blacks and 240 Hz refresh for competitive and cinematic gaming alike. Thunderbolt 5 connectivity is forward-looking for eGPU docks and high-speed storage. Dual NVMe slots and SODIMM RAM slots retain full user upgradeability.",
    knownIssues:
      "OLED burn-in risk with persistent HUD elements in long gaming sessions — use pixel shift. The 275HX platform draws significant sustained power — battery life during gaming is limited to ~90 minutes. Early Blackwell driver iterations may require patience.",
    swissMarketNotes:
      "Expected CHF 2600–3200 at Digitec and Brack depending on GPU tier. The OLED display at this price point is competitive with ASUS ROG Strix OLED. RTX 5070 configuration offers best value; RTX 5080 adds ~CHF 300–400 premium.",
    linuxNotes:
      "Community-supported. Core Ultra 9 275HX (Arrow Lake HX) well-supported in kernel 6.10+. NVIDIA RTX 5070/5080 Laptop (Blackwell) requires driver 570+. 4K OLED works well under Wayland with fractional scaling. Thunderbolt 5 support requires latest kernel.",
  },
  "legion-pro-5-16-gen10-amd": {
    editorialNotes:
      "The Legion Pro 5 16 Gen 10 AMD is Lenovo's 2025 professional-grade AMD gaming laptop — Ryzen 7 9755HX or Ryzen 9 9955HX with RTX 5060 or 5070 Laptop GPU. The Zen 5 architecture delivers excellent multi-threaded performance for content creation alongside gaming. Available with 2.5K 240 Hz IPS or OLED display options. Dual SODIMM DDR5 and dual NVMe slots offer full upgradeability — a key advantage over competitors with soldered memory.",
    knownIssues:
      "Ryzen 9 9955HX runs hot under sustained all-core workloads — the cooling system handles it but fan noise is noticeable. The base 16 GB DDR5 configuration benefits from upgrade to 32 GB for AAA titles and content creation. RTX 5070 configuration may be TGP-limited in sustained loads.",
    swissMarketNotes:
      "Expected CHF 2000–2600 at Digitec and Brack depending on GPU and display options. The AMD platform offers slightly better multi-threaded value than the Intel Pro 5i equivalent. OLED display option adds ~CHF 200 premium.",
    linuxNotes:
      "Community-supported. Ryzen 7 9755HX / Ryzen 9 9955HX (Zen 5) well-supported in kernel 6.10+. NVIDIA RTX 5060/5070 Laptop (Blackwell) requires proprietary driver 570+. AMD iGPU via amdgpu for battery-efficient desktop use.",
  },
  "legion-pro-5i-16-gen10": {
    editorialNotes:
      "The Legion Pro 5i 16 Gen 10 is the Intel counterpart to the Pro 5 AMD — Core Ultra 7 or 9 275HX with RTX 5060, 5070, or 5070 Ti Laptop GPU options. The RTX 5070 Ti option pushes this into near-flagship territory. Thunderbolt 4 connectivity is standard. Available in 2.5K IPS or OLED display configurations. The Arrow Lake HX platform excels in single-threaded gaming performance while the HX-class core count handles streaming and content creation simultaneously.",
    knownIssues:
      "The RTX 5070 Ti configuration draws significant power — ensure the 300W adapter is connected for peak performance. Arrow Lake HX platform has higher idle power draw than AMD equivalent — expect shorter battery life during light tasks. BIOS updates for early units are expected.",
    swissMarketNotes:
      "Expected CHF 2100–2800 at Digitec and Brack depending on GPU tier. The RTX 5070 Ti option provides the best performance-to-value at the upper end. Competes directly with MSI Vector and ASUS ROG Strix G16 in the Swiss pro-gaming segment.",
    linuxNotes:
      "Community-supported. Core Ultra 7/9 275HX (Arrow Lake HX) well-supported in kernel 6.10+. NVIDIA RTX 5060/5070/5070 Ti Laptop (Blackwell) requires driver 570+. Thunderbolt 4 functional for eGPU and docking on recent kernels.",
  },
  "legion-pro-7i-16-gen10": {
    editorialNotes:
      "The Legion Pro 7i 16 Gen 10 is Lenovo's 2025 flagship gaming laptop — Intel Core Ultra 9 275HX with RTX 5080 Laptop GPU, 3.2K 240 Hz 500-nit IPS display, and up to 64 GB DDR5-6400. The RTX 5080 Laptop represents a substantial generational jump for GPU-bound gaming and creative workloads. The 99 Wh battery is the aircraft-legal maximum. SD card reader, multiple USB-A ports, and Thunderbolt 4 make it a practical portable workstation beyond gaming. At 2.64 kg it commands dedicated carry.",
    knownIssues:
      "The 2.64 kg chassis and large PSU require committed portability. RTX 5080 Laptop TGP under full load demands adequate power delivery — verify wall socket compatibility when travelling in Switzerland with older building stock. Early-production BIOS updates expected for platform stability.",
    swissMarketNotes:
      "Premium flagship pricing — expected CHF 2800–3500 at Digitec and Brack. Competes with ASUS ROG Strix and MSI Titan for the top-tier Swiss gaming market. RTX 5080 Laptop provides clear advantages for Swiss game developers and 3D/VFX professionals needing local GPU compute.",
    linuxNotes:
      "Community-supported. Core Ultra 9 275HX (Arrow Lake HX) well-supported in kernel 6.10+. NVIDIA RTX 5080 Laptop (Blackwell) requires NVIDIA driver 570+ — verify availability on target distro at time of purchase. New platform — expect early BIOS and driver iterations. Not recommended for production Linux deployment until driver maturity is confirmed.",
  },

  // === ThinkPad X13 models ===
  "x13-gen1-intel": {
    editorialNotes:
      "First X13 generation (2020), replacing the X390. Comet Lake 10th gen Intel in the familiar 13.3-inch ThinkPad ultraportable form factor. Solid build quality with MIL-STD-810H rating.",
    knownIssues: "10th gen Intel Comet Lake runs warmer than Tiger Lake successors. FHD panel is average at 300 nits.",
    swissMarketNotes:
      "Discontinued — available refurbished from Revendo and occasionally on Ricardo. Good value sub-CHF 500.",
  },
  "x13-gen1-amd": {
    editorialNotes:
      "AMD Renoir (Ryzen PRO 4000 Zen 2) variant — a breakthrough for AMD in ThinkPads. Excellent multi-threaded performance and battery life compared to the Intel variant.",
    knownIssues:
      "Early BIOS had minor suspend/resume issues on Linux, resolved in later updates. FHD panel at 300 nits is average.",
    swissMarketNotes: "Discontinued — refurbished units at Revendo. AMD variant harder to find in CH than Intel.",
  },
  "x13-gen2-intel": {
    editorialNotes:
      "Tiger Lake refresh (2021) with Thunderbolt 4 and the transition to 16:10 WUXGA displays. Iris Xe integrated graphics were a significant step up from UHD.",
    knownIssues: "LPDDR4x (soldered) limits upgradeability. Some units had coil whine under load.",
    swissMarketNotes: "Discontinued — refurbished available. 16:10 display makes this a better buy than Gen 1.",
  },
  "x13-gen2-amd": {
    editorialNotes:
      "Cezanne Zen 3 (Ryzen PRO 5000) — improved single-threaded performance over Gen 1 AMD. WUXGA 16:10 display upgrade. DDR4 (not LPDDR) with one upgradeable slot.",
    knownIssues: "DDR4 instead of LPDDR5 limits memory bandwidth. Otherwise very solid.",
    swissMarketNotes: "Discontinued — refurbished from Revendo. AMD variant offers better value than Intel.",
  },
  "x13-gen3-intel": {
    editorialNotes:
      "Alder Lake U-series (2022) with hybrid P+E core architecture. WQXGA display option added. Wi-Fi 6E upgrade. LPDDR5 soldered.",
    knownIssues:
      "Alder Lake hybrid scheduler had early Windows issues — resolved in 22H2. Linux support good with 5.15+.",
    swissMarketNotes:
      "Available new from Digitec and Brack. Swiss QWERTZ keyboard standard. Good business ultraportable.",
  },
  "x13-gen3-amd": {
    editorialNotes:
      "Rembrandt (Ryzen PRO 6000 Zen 3+) with RDNA 2 integrated graphics — a significant iGPU leap. LPDDR5 standard. Wi-Fi 6E available.",
    knownIssues: "Rembrandt RDNA 2 iGPU needs updated mesa drivers for best Linux performance.",
    swissMarketNotes: "Available from Digitec and Brack. AMD variant offers better iGPU performance than Intel.",
  },
  "x13-gen4-amd": {
    editorialNotes:
      "Phoenix (Ryzen PRO 7000 Zen 4) with optional 2.8K OLED display. Strong all-round ultraportable. USB-C only (no Thunderbolt on AMD).",
    knownIssues: "No Thunderbolt — USB4 support varies by dock. OLED option adds slight weight.",
    swissMarketNotes:
      "Available from Digitec, Brack, and Lenovo CH. OLED option adds ~CHF 200. Competitive with T14s Gen 4.",
  },
  "x13s-gen1": {
    editorialNotes:
      "Lenovo's first ARM-based ThinkPad (Snapdragon 8cx Gen 3). Fanless design at 1.06 kg with 5G connectivity. Groundbreaking for always-connected mobile work.",
    knownIssues:
      "ARM app compatibility — not all x86 apps run well under emulation. Limited peripheral support. Linux support is experimental (Fedora ARM).",
    swissMarketNotes:
      "Available from Lenovo CH. Niche product — 5G connectivity useful for Swiss business travel. Limited retailer availability.",
  },

  // === Yoga consumer models ===
  "yoga-6-13alc7": {
    editorialNotes:
      "Budget 13.3-inch convertible with fabric lid — a distinctive Yoga design element. Ryzen 5625U provides solid everyday performance. Good battery life from 59 Whr cell.",
    knownIssues: "RAM soldered at 8 GB — no upgrade path. Fabric lid shows wear over time.",
    swissMarketNotes:
      "Available from Digitec and Galaxus. Budget Yoga option under CHF 900. Competes with HP Envy x360.",
  },
  "yoga-7-14ial7": {
    editorialNotes:
      "2022 mid-range Yoga with 2.8K OLED display — excellent color accuracy for creative work. Alder Lake P-series provides good performance. Convertible with pen support.",
    knownIssues: "OLED at 90 Hz — some users notice flicker at low brightness with PWM dimming.",
    swissMarketNotes:
      "Available from Digitec. OLED display is the key selling point at this price range. CHF 1200-1500.",
  },
  "yoga-7-16iah7": {
    editorialNotes:
      "16-inch Yoga convertible with H-series Alder Lake. Larger screen useful for content creation but adds weight at 2 kg. 120 Hz IPS display.",
    knownIssues:
      "H-series CPU in a convertible — thermals can be loud under sustained load. 2 kg is heavy for a convertible.",
    swissMarketNotes:
      "Available from Digitec. The 16-inch size fills a gap between portable Yogas and desktop replacements.",
  },
  "yoga-7-2in1-14ahp9": {
    editorialNotes:
      "2024 AMD variant with Ryzen 7 8840HS (Hawk Point Zen 4). 2.8K OLED 90 Hz touchscreen. Wi-Fi 7 and USB4. Strong all-round convertible.",
    knownIssues: "No Thunderbolt — AMD USB4 dock compatibility varies.",
    swissMarketNotes: "Available from Digitec and Brack. AMD variant typically CHF 100-200 less than Intel equivalent.",
  },
  "yoga-7-2in1-14iml9": {
    editorialNotes:
      "2024 Intel Core Ultra (Meteor Lake) variant. Thunderbolt 4 with 2.8K OLED. NPU for on-device AI features in Windows 11.",
    knownIssues: "Meteor Lake NPU features are Windows-only. Battery life slightly less than AMD variant.",
    swissMarketNotes: "Available from Digitec and Brack. Intel variant preferred if Thunderbolt docking is needed.",
  },
  "yoga-9-14iap7": {
    editorialNotes:
      "2022 premium Yoga flagship with 4K OLED and B&W rotating soundbar hinge — distinctive audio design. Premium materials and excellent build quality.",
    knownIssues: "4K 60 Hz OLED — no high refresh rate. Soundbar hinge mechanism has limited repairability.",
    swissMarketNotes: "Premium segment — CHF 1800-2200 at Digitec. B&W audio differentiates from competitors.",
  },
  "yoga-9-14irp8": {
    editorialNotes:
      "2023 update with Raptor Lake and 4K OLED at 120 Hz — addressing the Gen 7 refresh rate limitation. B&W soundbar retained.",
    knownIssues: "Premium pricing for incremental CPU upgrade. OLED burn-in risk with static UI elements.",
    swissMarketNotes:
      "Premium segment — CHF 1800-2200. The 120 Hz upgrade makes this the better buy over the 2022 model.",
  },
  "yoga-9-2in1-14imh9": {
    editorialNotes:
      "2024 flagship with Core Ultra 155H, 4K OLED HDR 500, and 32 GB RAM standard. Best Yoga for creative professionals.",
    knownIssues: "HDR 500 OLED consumes more power — battery life slightly less than non-HDR models.",
    swissMarketNotes: "Premium flagship — CHF 2200-2600 at Digitec. Competes with HP Spectre x360 and Dell XPS.",
  },
  "yoga-slim-6-14iap8": {
    editorialNotes:
      "2023 slim clamshell with 2.8K OLED. U-series 13th gen Intel for balanced performance and battery life. Lightweight at 1.36 kg.",
    knownIssues: "U-series limits sustained multi-threaded workloads. No touchscreen on standard model.",
    swissMarketNotes: "Available from Digitec. Budget-friendly OLED slim laptop under CHF 1200.",
  },
  "yoga-slim-6-14irh8": {
    editorialNotes:
      "H-series variant with i7-13700H — more performance headroom than the U-series sibling at the cost of thermals and battery.",
    knownIssues: "H-series in a slim chassis — expect higher fan noise under load. Same OLED panel as IAP8.",
    swissMarketNotes: "Available from Digitec. Choose this over IAP8 if sustained CPU performance matters.",
  },
  "yoga-slim-7-14apu8": {
    editorialNotes:
      "2023 AMD Ryzen 7 7840U (Phoenix Zen 4) slim with 2.8K OLED. Excellent balance of performance, battery, and display quality.",
    knownIssues: "No Thunderbolt — USB4 via AMD. LPDDR5 soldered.",
    swissMarketNotes: "Available from Digitec and Brack. AMD variant offers better battery than Intel equivalents.",
  },
  "yoga-slim-7-14imh9": {
    editorialNotes: "2024 Intel Core Ultra (Meteor Lake) slim. Thunderbolt 4, OLED, and NPU. Wi-Fi 7 ready.",
    knownIssues: "Meteor Lake battery life varies with NPU workloads. LPDDR5x soldered.",
    swissMarketNotes: "Available from Digitec. Intel variant preferred for Thunderbolt docking workflows.",
  },
  "yoga-slim-7x-14are9": {
    editorialNotes:
      "Snapdragon X Elite ARM laptop — 14.5-inch 3K OLED with exceptional battery life (18+ hours claimed). Copilot+ PC with on-device AI.",
    knownIssues:
      "ARM app compatibility — some x86 apps run slowly or not at all. Adobe suite mostly works via emulation. Linux support is experimental.",
    swissMarketNotes:
      "Available from Digitec and Lenovo CH. Early Snapdragon X Elite pricing at CHF 1500-1800. Best for users in the Microsoft ecosystem.",
  },
  "yoga-slim-9-14iap7": {
    editorialNotes:
      "2022 flagship ultrabook with 4K OLED touchscreen and machined aluminium unibody. Alder Lake P-series i7-1280P provides strong performance.",
    knownIssues: "4K 60 Hz — no high refresh rate. Premium pricing for a 2022 model.",
    swissMarketNotes: "Premium segment — CHF 2000-2400. Competes with MacBook Pro 14 and Dell XPS 15.",
  },
  "yoga-book-9-13iru8": {
    editorialNotes:
      "Dual-screen OLED convertible — the bottom screen replaces the physical keyboard with a virtual one. Unique form factor for creative workflows.",
    knownIssues:
      "Virtual keyboard takes adjustment. Battery life reduced due to dual OLED panels. Limited Linux usability — virtual keyboard is Windows-only.",
    swissMarketNotes: "Niche product — CHF 2500-3000 at Digitec. Unique form factor with limited Swiss availability.",
  },
  "yoga-book-9-14iah10": {
    editorialNotes:
      "2025 update with Intel Lunar Lake Core Ultra 7 258V and 14-inch dual screens. Improved battery life over Gen 1 thanks to Lunar Lake efficiency.",
    knownIssues:
      "Same virtual keyboard limitations. Dual OLED still impacts battery. ARM-level efficiency from Lunar Lake helps.",
    swissMarketNotes: "Premium niche — CHF 2800-3200. Very limited Swiss availability. Digitec and Lenovo CH only.",
  },
};
