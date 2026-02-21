import type { HardwareGuideEntry } from "@/lib/types";

/**
 * Curated CPU hardware guide — keyed by exact CPU name strings from cpu-benchmarks.ts.
 * Each entry provides qualitative analysis to help users understand when/why to choose a chip.
 */
export const cpuGuide: Record<string, HardwareGuideEntry> = {
  // Intel Core Ultra (Meteor Lake / Lunar Lake)
  "Intel Core Ultra 9 185H": {
    summary:
      "Intel's flagship mobile processor with 16 cores and a 45W TDP. Best-in-class single and multi-threaded performance for demanding workloads.",
    strengths: [
      "Top-tier single and multi-core performance",
      "Excellent for sustained heavy workloads (compiling, rendering)",
      "Strong integrated Intel Arc GPU for light creative work",
      "Hardware thread director optimises P/E core scheduling",
    ],
    weaknesses: [
      "High 45W TDP impacts battery life significantly",
      "Generates substantial heat — chassis design matters",
      "Overkill and wasteful for typical office/web tasks",
      "Premium price tag across all models carrying this chip",
    ],
    bestFor: [
      "Software developers with large compile jobs",
      "Data scientists running local ML training",
      "Video editors working with 4K timelines",
      "Power users who dock most of the time",
    ],
    avoidIf: [
      "Battery life is your top priority",
      "You mainly use Office apps and web browsing",
      "You need a fanless or silent machine",
      "Budget is a primary concern",
    ],
    thermalNotes:
      "Expect sustained fan noise under load. Look for chassis with dual heat pipes. Throttles in ultra-thin designs — P-series chassis recommended over slim U-series form factors.",
    generationContext:
      "First-gen Intel Core Ultra (Meteor Lake). Introduces the NPU for AI tasks and a tile-based chiplet architecture. Successor to 13th Gen HX-class chips with better power efficiency.",
    alternatives: [
      {
        name: "Intel Core Ultra 7 155H",
        comparison: "~12% slower multi-core but significantly better battery life at 28W base",
      },
      {
        name: "AMD Ryzen 7 PRO 8840HS",
        comparison: "Similar multi-core, better iGPU (780M), slightly lower power draw",
      },
    ],
    architecture: "Meteor Lake",
  },

  "Intel Core Ultra 7 155H": {
    summary:
      "A well-balanced 16-core processor at 28W base TDP. Strong all-round performance without the thermal penalty of the Ultra 9.",
    strengths: [
      "Excellent balance of performance and efficiency",
      "Capable integrated Arc GPU",
      "NPU for on-device AI acceleration",
      "Good multi-threaded scaling for development tasks",
    ],
    weaknesses: [
      "Still draws significant power under sustained load",
      "Single-core trails behind 13th Gen i9 at peak boost",
      "Arc GPU driver maturity lags behind AMD/NVIDIA on Linux",
      "28W base can still stress thin chassis thermals",
    ],
    bestFor: [
      "Developers needing solid compile and container performance",
      "Business professionals with occasional heavy multitasking",
      "Users who want good performance without extreme heat",
      "Mixed docked/mobile workflows",
    ],
    avoidIf: [
      "You need absolute peak single-thread performance",
      "You require proven Linux GPU driver support",
      "Ultra-long battery life (10+ hours) is essential",
      "You only browse and email — an Ultra 5 is more sensible",
    ],
    thermalNotes:
      "Manages well in 14-inch chassis. Fan noise moderate under typical development loads. PL2 boost can cause brief thermal spikes — BIOS-level power limit tuning helps.",
    generationContext:
      "Meteor Lake mainstream flagship. Replaces the i7-13700H with better idle efficiency. First Intel mobile chip with dedicated NPU tile.",
    alternatives: [
      { name: "Intel Core Ultra 9 185H", comparison: "~15% faster multi-core but significantly higher TDP and heat" },
      {
        name: "AMD Ryzen 7 PRO 8840U",
        comparison: "Similar single-core, slightly lower multi-core, but better battery life",
      },
    ],
    architecture: "Meteor Lake",
  },

  "Intel Core Ultra 7 155U": {
    summary:
      "Power-efficient 15W ultrabook processor with 2P+8E+2LPE cores. Prioritises battery life over raw throughput — ideal for mobile professionals.",
    strengths: [
      "Excellent battery efficiency at 15W base TDP",
      "Fanless-capable in well-designed chassis",
      "NPU for local AI inference tasks",
      "Solid single-core for responsive everyday use",
    ],
    weaknesses: [
      "Multi-core performance limited by low core count and power budget",
      "Struggles with sustained heavy workloads (long compiles, rendering)",
      "Integrated GPU weaker than H-series counterparts",
      "Memory bandwidth limited by LPDDR5 in most U-series designs",
    ],
    bestFor: [
      "Mobile professionals prioritising battery life",
      "Office and productivity workflows",
      "Light development work (scripting, web dev)",
      "Frequent travellers who work unplugged",
    ],
    avoidIf: [
      "You compile large codebases regularly",
      "You need strong GPU performance (even integrated)",
      "Sustained multi-threaded workloads are common",
      "You mainly work docked at a desk",
    ],
    thermalNotes:
      "Very manageable thermals. Many chassis run near-silent. Sustained loads may throttle to 12-13W in ultra-thin designs, reducing multi-core throughput.",
    generationContext:
      "Meteor Lake U-series for ultrabooks. The LPE (low-power efficiency) cores handle background tasks at minimal power draw. Replaces 13th Gen U-series with better idle power.",
    alternatives: [
      { name: "Intel Core Ultra 5 125U", comparison: "~15% slower but adequate for pure office work at a lower price" },
      { name: "AMD Ryzen 7 PRO 8840U", comparison: "Higher multi-core performance but slightly more power draw" },
    ],
    architecture: "Meteor Lake",
  },

  "Intel Core Ultra 5 125U": {
    summary:
      "Entry-level Core Ultra at 15W. Adequate for office work and light tasks. Best value option in the Meteor Lake lineup.",
    strengths: [
      "Low power draw extends battery life",
      "Quiet operation in most chassis",
      "NPU included for future AI workloads",
      "Affordable entry into Core Ultra platform",
    ],
    weaknesses: [
      "Noticeably slower multi-core than Ultra 7 variants",
      "Struggles with heavy multitasking",
      "Integrated GPU limited for anything beyond basic displays",
      "Single-core adequate but not fast",
    ],
    bestFor: [
      "Office workers with standard productivity needs",
      "Email, web, documents, and light spreadsheet work",
      "Budget-conscious buyers wanting modern features",
      "Thin-and-light builds where silence matters",
    ],
    avoidIf: [
      "You run Docker containers or compile code regularly",
      "You work with large datasets or spreadsheets",
      "Any kind of creative work (photo/video editing)",
      "You want the machine to last 4+ years without feeling slow",
    ],
    thermalNotes:
      "Minimal thermal output. Fanless designs work well. No throttling concerns for typical office workloads.",
    generationContext:
      "Budget Meteor Lake. Offers the platform's NPU and efficiency improvements at a lower price point. Replaces i5-1335U/1345U.",
    alternatives: [
      {
        name: "Intel Core Ultra 7 155U",
        comparison: "~18% faster overall, worthwhile if keeping the machine for 3+ years",
      },
      { name: "Intel Core Ultra 5 125H", comparison: "Much stronger multi-core but higher TDP and more heat" },
    ],
    architecture: "Meteor Lake",
  },

  "Intel Core Ultra 5 125H": {
    summary:
      "Mid-range H-series with 14 cores at 28W base. Good multi-threaded performance for the price — a sensible choice for developers on a budget.",
    strengths: [
      "Strong multi-core for the price segment",
      "H-series power headroom for burst workloads",
      "Capable Arc integrated GPU",
      "Good value in ThinkPad T and L series",
    ],
    weaknesses: [
      "Single-core trails Ultra 7 by a meaningful margin",
      "Higher TDP than U-series impacts battery",
      "Fan noise more noticeable than U-series counterparts",
      "Less common in premium chassis designs",
    ],
    bestFor: [
      "Developers on a budget who need decent compile times",
      "Students in CS or engineering programs",
      "Multi-tasking professionals who dock frequently",
      "Value-oriented buyers wanting H-class performance",
    ],
    avoidIf: [
      "You need top-tier single-thread responsiveness",
      "Battery life over 8 hours is critical",
      "You want the quietest possible machine",
      "Your workload is purely single-threaded",
    ],
    thermalNotes:
      "Runs warm under sustained load but stays within limits in 14-inch chassis. Fan ramps up during compiles but settles quickly. Adequate cooling in most ThinkPad designs.",
    generationContext:
      "Meteor Lake mid-range H-series. Offers 80% of the Ultra 7 155H performance at a lower price point. Good bang-for-buck in the lineup.",
    alternatives: [
      {
        name: "Intel Core Ultra 7 155H",
        comparison: "~15% faster with better single-core; worth the premium for professional use",
      },
      { name: "AMD Ryzen 5 PRO 8540U", comparison: "Similar composite score, better battery, weaker multi-core burst" },
    ],
    architecture: "Meteor Lake",
  },

  // Intel 13th Gen (Raptor Lake)
  "Intel Core i9-13980HX": {
    summary:
      "The fastest mobile CPU Intel has made in 13th Gen. 24 cores and 55W base TDP deliver desktop-replacement performance — at desktop-level power draw.",
    strengths: [
      "Unmatched multi-core throughput in its generation",
      "Exceptional single-core boost performance",
      "Handles any mobile workload without compromise",
      "Mature platform with excellent driver/software support",
    ],
    weaknesses: [
      "55W+ base TDP destroys battery life (2-3 hours typical)",
      "Requires aggressive cooling — expect loud fans",
      "Only available in thick, heavy workstation chassis",
      "Previous generation — lacks NPU and efficiency improvements",
    ],
    bestFor: [
      "Desktop replacement workstations",
      "Heavy compilation, simulation, and rendering",
      "Professional video production and 3D work",
      "Users who are always plugged in",
    ],
    avoidIf: [
      "You ever need to work on battery",
      "Noise and heat tolerance is low",
      "Portability matters at all",
      "You want modern AI/NPU features",
    ],
    thermalNotes:
      "Demands the best cooling solutions. ThinkPad P-series handles it well with dual-fan designs, but expect sustained noise. Throttles heavily in inadequate chassis. Keep power brick handy.",
    generationContext:
      "13th Gen Raptor Lake HX — Intel's peak performance play. Being superseded by Core Ultra, but nothing in the current Ultra lineup matches its raw multi-core throughput yet.",
    alternatives: [
      {
        name: "Intel Core Ultra 9 185H",
        comparison: "Lower peak multi-core but dramatically better efficiency and battery life",
      },
      { name: "Intel Core i7-13700H", comparison: "70-80% of the performance at much lower power draw" },
    ],
    architecture: "Raptor Lake",
  },

  "Intel Core i7-13700H": {
    summary:
      "Mainstream 13th Gen powerhouse with 14 cores. Proven, reliable performance for professional workloads without the extreme TDP of the i9.",
    strengths: [
      "Strong, proven multi-core performance",
      "Good single-core boost for responsive daily use",
      "Mature drivers and broad software compatibility",
      "Available in well-cooled 14-16 inch chassis",
    ],
    weaknesses: [
      "Previous generation — no NPU or modern efficiency features",
      "45W TDP still impacts battery (4-5 hours typical)",
      "Being phased out in favour of Core Ultra 7",
      "Integrated Iris Xe lags behind Arc in newer chips",
    ],
    bestFor: [
      "Developers wanting proven, stable performance",
      "Professional users who primarily work docked",
      "Buying refurbished/discounted ThinkPads for value",
      "Workloads that benefit from high sustained multi-core",
    ],
    avoidIf: [
      "You want the latest efficiency and AI features",
      "Battery life is a top priority",
      "You plan to keep the laptop for 4+ years",
      "You need strong integrated graphics",
    ],
    thermalNotes:
      "Well-understood thermal profile. ThinkPad T/P series handle it capably. Moderate fan noise under load. Consider repasting after 2+ years for sustained performance.",
    generationContext:
      "13th Gen Raptor Lake H-series. The workhorse of 2023 ThinkPads. Still performs well but lacks the architectural improvements of Meteor Lake and beyond.",
    alternatives: [
      {
        name: "Intel Core Ultra 7 155H",
        comparison: "Similar performance with much better efficiency and NPU; choose for new purchases",
      },
      { name: "AMD Ryzen 7 PRO 7840U", comparison: "Better battery life and iGPU, slightly lower multi-core" },
    ],
    architecture: "Raptor Lake",
  },

  "Intel Core i7-1365U": {
    summary:
      "13th Gen U-series for ultrabooks. Decent single-core with modest multi-threaded capability. A competent office chip.",
    strengths: [
      "Good battery efficiency at 15W",
      "Adequate single-core for snappy daily use",
      "Proven Raptor Lake stability",
      "Quiet operation in most designs",
    ],
    weaknesses: [
      "Limited multi-core performance (2P+8E cores at 15W)",
      "Previous gen without NPU or modern features",
      "Iris Xe integrated graphics showing its age",
      "Being replaced by Core Ultra U-series",
    ],
    bestFor: [
      "Office productivity and light multitasking",
      "Business travellers needing all-day battery",
      "Buying discounted 2023 ThinkPad ultrabooks",
      "Light web development and scripting",
    ],
    avoidIf: [
      "You need strong multi-threaded performance",
      "You want modern AI/NPU features",
      "Long-term (4+ year) investment is planned",
      "You do any creative or development work beyond basics",
    ],
    thermalNotes:
      "Runs cool and quiet. No thermal concerns for office workloads. May throttle under sustained all-core loads in the thinnest chassis.",
    generationContext:
      "13th Gen Raptor Lake U-series. Replaced by Core Ultra 7 155U with better efficiency and NPU. Still capable for office work.",
    alternatives: [
      { name: "Intel Core Ultra 7 155U", comparison: "Better efficiency, NPU, and slightly faster overall" },
      { name: "Intel Core i7-1360P", comparison: "Higher multi-core at the cost of more power and heat" },
    ],
    architecture: "Raptor Lake",
  },

  "Intel Core i7-1360P": {
    summary:
      "13th Gen P-series balancing efficiency and performance. 28W base gives more multi-core headroom than U-series while staying portable.",
    strengths: [
      "Better multi-core than U-series at reasonable TDP",
      "Good single-core boost performance",
      "Fits in thin 14-inch chassis",
      "Proven stability and driver support",
    ],
    weaknesses: [
      "28W draws more battery than 15W U-series",
      "No NPU — previous generation architecture",
      "Iris Xe GPU is dated",
      "Being superseded by Core Ultra H/P chips",
    ],
    bestFor: [
      "Mixed workloads needing occasional multi-core bursts",
      "Developers doing moderate compilation work",
      "Users wanting more headroom than U-series",
      "Discounted 2023 models with good specs elsewhere",
    ],
    avoidIf: [
      "Maximum battery life is the priority",
      "You want latest-gen features",
      "Heavy sustained multi-core workloads (choose H-series)",
      "You need strong integrated graphics",
    ],
    thermalNotes:
      "Slightly warmer than U-series. Fan spins up under load but manageable. Good thermal behaviour in ThinkPad T-series chassis.",
    generationContext:
      "13th Gen Raptor Lake P-series. A middle ground between U and H. Being replaced by Core Ultra chips that blur this segmentation.",
    alternatives: [
      { name: "Intel Core Ultra 7 155H", comparison: "Next-gen replacement with NPU and better efficiency" },
      {
        name: "Intel Core i7-1365U",
        comparison: "Lower power at the cost of multi-core; better for pure battery life",
      },
    ],
    architecture: "Raptor Lake",
  },

  "Intel Core i5-1345U": {
    summary:
      "Budget 13th Gen ultrabook chip. Handles everyday tasks competently. The sensible minimum for a business ThinkPad.",
    strengths: [
      "Very low power draw for all-day battery",
      "Adequate for standard office workflows",
      "Quiet, cool operation",
      "Lower-cost ThinkPad configurations",
    ],
    weaknesses: [
      "Noticeably slower in multi-tasking vs i7",
      "Struggles with heavy browser tabs + apps simultaneously",
      "Previous gen without modern features",
      "Will feel slow sooner than i7 counterparts",
    ],
    bestFor: [
      "Office workers: email, docs, light spreadsheets",
      "Budget-conscious buyers for standard business use",
      "Thin-and-light portability priority",
      "Secondary or travel laptops",
    ],
    avoidIf: [
      "You run more than basic Office/browser workloads",
      "You want the machine to last 4+ years",
      "Any development or creative work is planned",
      "You frequently work with large files or datasets",
    ],
    thermalNotes: "No thermal concerns. Runs cool and silent in virtually all chassis designs.",
    generationContext:
      "13th Gen Raptor Lake U-series budget option. Replaced by Core Ultra 5 125U with NPU and better efficiency.",
    alternatives: [
      { name: "Intel Core Ultra 5 125U", comparison: "Modern replacement with NPU and better efficiency" },
      { name: "Intel Core i5-1340P", comparison: "More multi-core headroom if battery life isn't the top priority" },
    ],
    architecture: "Raptor Lake",
  },

  "Intel Core i5-1340P": {
    summary:
      "Budget P-series with 12 cores at 28W. More multi-core headroom than the i5 U-series at a modest battery cost.",
    strengths: [
      "Better multi-core than i5 U-series",
      "Reasonable power efficiency for a P-series chip",
      "Good value in mid-range ThinkPad configurations",
      "Handles moderate multitasking well",
    ],
    weaknesses: [
      "Single-core noticeably behind i7 variants",
      "Previous generation without NPU",
      "28W impacts battery vs 15W U-series",
      "Iris Xe GPU is basic",
    ],
    bestFor: [
      "Budget-conscious users needing more than basic performance",
      "Light development work with moderate compile loads",
      "Multi-tasking office workers",
      "Students needing capable all-rounders",
    ],
    avoidIf: [
      "You need strong single-core responsiveness",
      "Maximum battery life matters most",
      "You want current-gen features",
      "Heavy or sustained workloads are expected",
    ],
    thermalNotes:
      "Slightly warmer than U-series but well within comfort in ThinkPad 14-inch chassis. Fan audible under load but not disruptive.",
    generationContext:
      "13th Gen P-series budget option. Offers meaningful multi-core uplift over the i5-1345U. Being replaced by Core Ultra 5 125H.",
    alternatives: [
      { name: "Intel Core Ultra 5 125H", comparison: "Modern replacement with better efficiency and NPU" },
      { name: "Intel Core i5-1345U", comparison: "Lower power and cheaper, but noticeably less multi-core" },
    ],
    architecture: "Raptor Lake",
  },

  // Intel Core Ultra (Arrow Lake)
  "Intel Core Ultra 5 235U": {
    summary:
      "Arrow Lake U-series — Intel's latest efficiency-focused architecture. Improved IPC over Meteor Lake at similar power levels.",
    strengths: [
      "Latest Intel architecture with best-in-class IPC",
      "Excellent power efficiency at 15W",
      "Improved NPU over Meteor Lake",
      "Strong single-core for daily responsiveness",
    ],
    weaknesses: [
      "Limited multi-core due to U-series power constraints",
      "New platform with less proven driver ecosystem",
      "Budget positioning limits clock speeds",
      "Limited availability in ThinkPad lineup currently",
    ],
    bestFor: [
      "Buyers wanting the latest architecture",
      "Mobile professionals prioritising efficiency",
      "AI-curious users wanting a capable NPU",
      "Office and light development workloads",
    ],
    avoidIf: [
      "You need proven, battle-tested driver support",
      "Strong multi-core is required",
      "You need maximum bang-for-buck (Meteor Lake discounts exist)",
      "Heavy workloads are part of your routine",
    ],
    thermalNotes:
      "Very efficient thermal profile. Comparable to Meteor Lake U-series. Fanless designs viable for light workloads.",
    generationContext:
      "Arrow Lake — Intel's second-gen Core Ultra. Better IPC and NPU than Meteor Lake, but U-series keeps it conservative on power. Represents Intel's future direction.",
    alternatives: [
      { name: "Intel Core Ultra 5 125U", comparison: "Previous gen — cheaper, well-proven, slightly lower IPC" },
      {
        name: "Intel Core Ultra 5 228V",
        comparison: "Lunar Lake variant with better GPU and efficiency but different platform",
      },
    ],
    architecture: "Arrow Lake",
  },

  // Intel 12th Gen
  "Intel Core i7-1280P": {
    summary:
      "12th Gen P-series flagship with 14 cores. The first Intel hybrid architecture to reach ThinkPads. Still capable but two generations old now.",
    strengths: [
      "Good multi-core performance for its generation",
      "Hybrid P/E core architecture was groundbreaking",
      "Mature, well-supported platform",
      "Available in heavily discounted refurbished units",
    ],
    weaknesses: [
      "Two generations behind current chips",
      "Higher power draw than newer equivalents",
      "No NPU for AI workloads",
      "Integrated Iris Xe is basic by current standards",
    ],
    bestFor: [
      "Budget buyers looking at refurbished ThinkPads",
      "General productivity and moderate development",
      "Users who don't need cutting-edge features",
      "Secondary machines or lab/fleet deployments",
    ],
    avoidIf: [
      "You're buying new — current-gen offers better value",
      "You want modern AI/efficiency features",
      "Battery life is critical",
      "You need maximum long-term viability",
    ],
    thermalNotes:
      "Well-understood thermal profile after years on market. ThinkPad chassis handle it well. Consider repasting older units for best performance.",
    generationContext:
      "12th Gen Alder Lake — first Intel hybrid architecture. Revolutionary at launch, now superseded by Raptor Lake and Meteor Lake. Good refurbished value.",
    alternatives: [
      { name: "Intel Core Ultra 7 155H", comparison: "Two generations newer with much better efficiency and features" },
      { name: "Intel Core i7-1360P", comparison: "One generation newer, better IPC and efficiency" },
    ],
    architecture: "Alder Lake",
  },

  "Intel Core i7-1270P": {
    summary:
      "12th Gen mainstream P-series. Solid performer in its day, now showing its age against Meteor Lake and Ryzen 7000+.",
    strengths: [
      "Proven stability over years of use",
      "Good single-core performance for daily tasks",
      "Well-supported in Linux and Windows",
      "Affordable refurbished pricing",
    ],
    weaknesses: [
      "Two generations old",
      "Power efficiency lags behind newer chips",
      "No NPU or modern power management",
      "Iris Xe is dated for integrated graphics",
    ],
    bestFor: [
      "Refurbished ThinkPad buyers on a budget",
      "Standard office and light development work",
      "Users upgrading from much older hardware",
      "IT fleet deployments where cost matters",
    ],
    avoidIf: [
      "Buying new — always choose current gen",
      "You need strong efficiency or battery life",
      "Future-proofing matters to you",
      "Any GPU-intensive integrated graphics needs",
    ],
    thermalNotes: "Well-behaved thermals. Years of firmware maturity. No surprises in ThinkPad chassis.",
    generationContext:
      "12th Gen Alder Lake P-series. Solid workhorse that's now firmly in the value/refurbished segment.",
    alternatives: [
      {
        name: "Intel Core i7-1360P",
        comparison: "One gen newer with better IPC — choose if price difference is small",
      },
      { name: "Intel Core i7-1280P", comparison: "Same gen flagship with slightly more cores and higher clocks" },
    ],
    architecture: "Alder Lake",
  },

  "Intel Core i7-1265U": {
    summary: "12th Gen U-series for ultrabooks. Efficient and quiet but increasingly outpaced by current chips.",
    strengths: [
      "Good battery efficiency",
      "Quiet operation",
      "Proven platform stability",
      "Very affordable in refurbished market",
    ],
    weaknesses: [
      "Two generations behind",
      "Modest multi-core by today's standards",
      "No modern efficiency features",
      "Iris Xe is basic",
    ],
    bestFor: [
      "Budget refurbished ultrabook purchases",
      "Basic office productivity",
      "Secondary or travel laptops",
      "Users with modest performance needs",
    ],
    avoidIf: [
      "Buying new equipment",
      "Any development or creative work",
      "You want the machine to last 3+ more years",
      "Multi-tasking with many apps",
    ],
    thermalNotes: "Cool and quiet. No concerns. Ideal for fanless or near-fanless ultrabook designs.",
    generationContext:
      "12th Gen Alder Lake U-series. Budget-friendly in the refurbished market but showing its age for modern workflows.",
    alternatives: [
      { name: "Intel Core Ultra 7 155U", comparison: "Current-gen replacement with NPU and much better efficiency" },
      { name: "Intel Core i7-1365U", comparison: "One gen newer, incrementally better" },
    ],
    architecture: "Alder Lake",
  },

  "Intel Core i5-1245U": {
    summary:
      "Budget 12th Gen U-series. Minimum viable spec for a functional ThinkPad — fine for basic tasks, nothing more.",
    strengths: [
      "Very low power draw",
      "Silent operation",
      "Cheapest ThinkPad configurations",
      "Adequate for basic office work",
    ],
    weaknesses: [
      "Weakest 12th Gen performer in the lineup",
      "Noticeably slow for modern multitasking",
      "Two generations old",
      "Will feel dated quickly",
    ],
    bestFor: [
      "Absolute budget priority",
      "Basic email and document work",
      "Short-term or disposable use",
      "IT fleet cost minimisation",
    ],
    avoidIf: [
      "You plan to keep this for more than 2 years",
      "You multitask with more than a few browser tabs",
      "Any development, creative, or analytical work",
      "You value responsive, snappy performance",
    ],
    thermalNotes: "No thermal concerns whatsoever. Runs cool and silent at all times.",
    generationContext:
      "12th Gen Alder Lake budget U-series. Only recommended if price is the overriding factor. Modern i5 equivalents are meaningfully faster.",
    alternatives: [
      { name: "Intel Core Ultra 5 125U", comparison: "Two gens newer, ~22% faster, far better for longevity" },
      { name: "Intel Core i5-1345U", comparison: "One gen newer, incrementally better at modest cost" },
    ],
    architecture: "Alder Lake",
  },

  "Intel Core i5-1240P": {
    summary:
      "12th Gen P-series budget option. More multi-core headroom than the i5 U-series. Decent value in refurbished units.",
    strengths: [
      "Better multi-core than 12th Gen U-series i5",
      "Reasonable all-round capability",
      "Handles moderate multitasking",
      "Affordable in the used market",
    ],
    weaknesses: [
      "Two generations behind",
      "Higher TDP than U-series impacts battery",
      "No modern features (NPU, advanced power management)",
      "Single-core noticeably behind current i5 chips",
    ],
    bestFor: [
      "Budget refurbished purchases needing more than basic performance",
      "Light development on a tight budget",
      "Office multitasking with many apps open",
      "Students needing an affordable all-rounder",
    ],
    avoidIf: [
      "Buying new — current gen i5 is much better",
      "Battery life matters (choose U-series)",
      "You need long-term performance viability",
      "Any serious development or creative work",
    ],
    thermalNotes: "Manageable thermals in ThinkPad chassis. Slightly warmer than U-series but not problematic.",
    generationContext:
      "12th Gen Alder Lake P-series budget tier. Only recommended for budget-constrained refurbished purchases.",
    alternatives: [
      {
        name: "Intel Core Ultra 5 125H",
        comparison: "Current-gen replacement — dramatically better efficiency and features",
      },
      {
        name: "Intel Core i5-1340P",
        comparison: "One gen newer with better IPC; prefer if available at similar price",
      },
    ],
    architecture: "Alder Lake",
  },

  // Intel 8th Gen
  "Intel Core i7-8550U": {
    summary:
      "Legacy 8th Gen quad-core. Perfectly functional for basic tasks but visibly aged. Only consider for very tight budgets or specific use cases.",
    strengths: [
      "Extremely low cost in the used market",
      "Proven, rock-solid stability over many years",
      "Quad-core handles basic multitasking",
      "Excellent Linux support due to long kernel presence",
    ],
    weaknesses: [
      "Dramatically slower than any current chip",
      "Only 4 cores / 8 threads — limited multitasking",
      "UHD 620 iGPU is barely functional for modern displays",
      "No hardware security features of newer platforms",
    ],
    bestFor: [
      "Ultra-budget secondary machines",
      "Dedicated Linux or terminal-only workstations",
      "Light office tasks where cost is paramount",
      "Retro ThinkPad enthusiasts (T480/X1 Carbon Gen 6)",
    ],
    avoidIf: [
      "This is your primary work machine",
      "You need reasonable modern performance",
      "Security features matter (no hardware MFA support)",
      "You plan to run modern IDEs or heavy web apps",
    ],
    thermalNotes: "Very cool and quiet. Ancient 15W TDP. Zero thermal concerns.",
    generationContext:
      "8th Gen Kaby Lake Refresh. The last pre-hybrid Intel architecture. Historic in that it brought quad-core to U-series for the first time. Now 7+ years old.",
    alternatives: [
      { name: "Intel Core i5-1245U", comparison: "Three generations newer, ~40% faster overall, modest cost used" },
      {
        name: "Intel Core i5-8250U",
        comparison: "Same generation, slightly slower — negligible difference in practice",
      },
    ],
    architecture: "Kaby Lake Refresh",
  },

  "Intel Core i5-8250U": {
    summary:
      "Budget 8th Gen quad-core. The absolute minimum for a usable modern ThinkPad. Only for the most budget-constrained situations.",
    strengths: [
      "Extremely cheap in the used market",
      "Stable and well-supported",
      "Adequate for basic browsing and documents",
      "Excellent Linux kernel support",
    ],
    weaknesses: [
      "Slowest chip in the benchmark database",
      "Only 4C/8T with low clocks",
      "UHD 620 struggles with modern content",
      "No modern security or platform features",
    ],
    bestFor: [
      "Absolute minimum budget machines",
      "Linux terminal servers",
      "Basic digital signage or kiosk use",
      "Nostalgia (T480 is a classic ThinkPad)",
    ],
    avoidIf: [
      "You need anything beyond basic browsing",
      "This would be your daily driver",
      "Modern software performance matters",
      "You're considering this for professional use",
    ],
    thermalNotes: "Negligible heat output. Silent operation.",
    generationContext:
      "8th Gen Kaby Lake Refresh budget option. 7+ years old. Functional but firmly in legacy territory.",
    alternatives: [
      {
        name: "Intel Core i7-8550U",
        comparison: "Same gen, slightly faster — marginal improvement for slightly more cost",
      },
      { name: "Intel Core i5-1245U", comparison: "Three gens newer, dramatically faster; prefer if budget allows" },
    ],
    architecture: "Kaby Lake Refresh",
  },

  // AMD Ryzen PRO 8000 (Hawk Point)
  "AMD Ryzen 7 PRO 8840U": {
    summary:
      "AMD's mainstream flagship for business ultrabooks. Zen 4 cores with excellent efficiency and a capable Radeon 780M iGPU. Top pick for AMD ThinkPads.",
    strengths: [
      "Excellent single and multi-core performance at 28W",
      "Radeon 780M is the best integrated GPU available",
      "Outstanding battery efficiency in practice",
      "AMD PRO security and manageability features",
    ],
    weaknesses: [
      "No NPU (AI acceleration requires next-gen AMD)",
      "Slightly lower peak single-core than Intel Ultra 7",
      "AMD platform sometimes has minor BIOS quirks in ThinkPads",
      "Limited to LPDDR5 in most ultrabook configurations",
    ],
    bestFor: [
      "Developers wanting the best integrated GPU for side monitors",
      "Business users wanting strong all-round performance",
      "Linux users (AMD has excellent open-source driver support)",
      "Users who value battery life and performance equally",
    ],
    avoidIf: [
      "You specifically need Intel vPro management features",
      "NPU/AI acceleration is important now",
      "You need Thunderbolt 4 (AMD uses USB4 — functionally similar but not identical)",
      "Your IT department mandates Intel platforms",
    ],
    thermalNotes:
      "Excellent thermal behaviour. Zen 4 efficiency means less heat at equivalent performance. Quiet operation even under moderate load. 780M can warm up during sustained GPU work.",
    generationContext:
      "Zen 4 'Hawk Point' PRO series. Refresh of the 7840U with minor clock improvements. AMD's answer to Intel Core Ultra 7, with a notably stronger iGPU.",
    alternatives: [
      { name: "Intel Core Ultra 7 155H", comparison: "Similar CPU performance, weaker iGPU, but has NPU" },
      {
        name: "AMD Ryzen 7 PRO 7840U",
        comparison: "Previous gen — nearly identical performance, slightly lower clocks",
      },
    ],
    architecture: "Zen 4 (Hawk Point)",
  },

  "AMD Ryzen 5 PRO 8540U": {
    summary:
      "Mid-range Zen 4 business processor. Good efficiency and the capable Radeon 740M iGPU. Solid value in AMD ThinkPads.",
    strengths: [
      "Good performance-per-watt",
      "Capable Radeon 740M integrated graphics",
      "AMD PRO security features included",
      "Competitive pricing in L-series ThinkPads",
    ],
    weaknesses: [
      "Noticeably slower multi-core than Ryzen 7 variant",
      "No NPU for AI workloads",
      "740M iGPU less capable than 780M",
      "Single-core trails Intel i7/Ultra 7",
    ],
    bestFor: [
      "Budget AMD ThinkPad configurations",
      "Office productivity with occasional heavier tasks",
      "Linux users wanting good AMD driver support",
      "Value-oriented business deployments",
    ],
    avoidIf: [
      "You need strong multi-core (choose Ryzen 7)",
      "Integrated GPU performance matters (choose 780M variant)",
      "You do regular development work",
      "Long-term performance headroom is important",
    ],
    thermalNotes: "Very manageable. Runs cooler than the Ryzen 7 variant. Near-silent in typical office workloads.",
    generationContext:
      "Zen 4 Hawk Point mid-range. Positioned against Intel Core Ultra 5 125H with competitive performance and better iGPU.",
    alternatives: [
      { name: "AMD Ryzen 7 PRO 8840U", comparison: "~20% faster overall with a much better iGPU; worth the premium" },
      { name: "Intel Core Ultra 5 125H", comparison: "Similar multi-core, weaker iGPU, but has NPU" },
    ],
    architecture: "Zen 4 (Hawk Point)",
  },

  // AMD Ryzen PRO 7000
  "AMD Ryzen 7 PRO 7840U": {
    summary:
      "Zen 4 business flagship from the previous generation. Nearly identical to the 8840U — excellent value if found at a discount.",
    strengths: [
      "Excellent Zen 4 performance and efficiency",
      "Radeon 780M — best-in-class integrated GPU",
      "Strong multi-core for the TDP class",
      "Now available at discounted/refurbished prices",
    ],
    weaknesses: [
      "Being replaced by 8840U (nearly identical but newer SKU)",
      "No NPU for AI workloads",
      "AMD BIOS maturity varies by ThinkPad model",
      "Thunderbolt absent (USB4 instead)",
    ],
    bestFor: [
      "Value buyers finding discounted 2023 ThinkPads",
      "Same use cases as 8840U — development, business, Linux",
      "Users who want Radeon 780M at a lower price",
      "Refurbished ThinkPad T14s Gen 4 AMD purchases",
    ],
    avoidIf: [
      "Price difference to 8840U is negligible — choose newer",
      "You want the very latest platform features",
      "Intel vPro is required by your organisation",
      "NPU is needed for your workflow",
    ],
    thermalNotes: "Identical thermal characteristics to the 8840U. Efficient and quiet.",
    generationContext:
      "Zen 4 'Phoenix' PRO series. The original Zen 4 business chip. 8840U is a minor refresh — performance is within margin of error.",
    alternatives: [
      { name: "AMD Ryzen 7 PRO 8840U", comparison: "Marginally updated — prefer if same price or close" },
      { name: "Intel Core i7-13700H", comparison: "Higher peak multi-core but worse efficiency; Intel platform" },
    ],
    architecture: "Zen 4 (Phoenix)",
  },

  "AMD Ryzen 5 PRO 7535U": {
    summary:
      "Zen 3+ business chip positioned as a budget option. Older architecture but still serviceable for standard office work.",
    strengths: [
      "Affordable in L-series and budget T-series",
      "Adequate for standard productivity",
      "AMD PRO management features",
      "Decent battery efficiency",
    ],
    weaknesses: [
      "Zen 3+ architecture is two generations behind Zen 4",
      "Noticeably slower than Ryzen 7 PRO variants",
      "Radeon 660M iGPU is basic",
      "Will age faster than Zen 4 alternatives",
    ],
    bestFor: [
      "Budget business ThinkPads",
      "Standard office productivity",
      "IT fleet deployments where cost matters",
      "Users upgrading from much older hardware",
    ],
    avoidIf: [
      "You can stretch to a Ryzen 7 PRO chip",
      "Performance longevity matters",
      "Any development or creative workloads",
      "You want a strong integrated GPU",
    ],
    thermalNotes: "Cool and quiet operation. No thermal concerns for standard office workloads.",
    generationContext:
      "Zen 3+ (Barcelo-R) — rebranded older architecture. Budget positioning only. Significantly behind Zen 4 in IPC and efficiency.",
    alternatives: [
      { name: "AMD Ryzen 7 PRO 7840U", comparison: "Much faster with better iGPU — strongly prefer if budget allows" },
      { name: "AMD Ryzen 5 PRO 8540U", comparison: "Next-gen Zen 4 — better in every metric" },
    ],
    architecture: "Zen 3+ (Barcelo-R)",
  },

  // AMD Ryzen PRO 6000
  "AMD Ryzen 7 PRO 6850U": {
    summary:
      "Zen 3+ with RDNA 2 graphics. A transitional chip — better iGPU than older Zen 3 but surpassed by Zen 4 in every way.",
    strengths: [
      "Radeon 680M iGPU was strong for its generation",
      "Decent multi-core performance",
      "AMD PRO security features",
      "Available at good refurbished prices",
    ],
    weaknesses: [
      "Zen 3+ IPC trails Zen 4 by ~15%",
      "Being phased out — limited new availability",
      "No NPU or modern power management",
      "RDNA 2 iGPU surpassed by RDNA 3 (780M) in Zen 4",
    ],
    bestFor: [
      "Refurbished buyers wanting decent AMD performance",
      "Users who value the 680M iGPU for casual use",
      "Budget-constrained upgrades from older hardware",
      "Linux workstations (good AMD kernel support)",
    ],
    avoidIf: [
      "Buying new — Zen 4 is strictly superior",
      "You need maximum efficiency and battery life",
      "Long-term viability matters",
      "You want the latest iGPU capabilities",
    ],
    thermalNotes:
      "Well-behaved thermals. Zen 3+ is efficient enough at 28W. Established BIOS and thermal management in ThinkPad chassis.",
    generationContext:
      "Zen 3+ 'Rembrandt' PRO series. Notable for introducing RDNA 2 integrated graphics to ThinkPads. Now superseded by Zen 4 Phoenix/Hawk Point.",
    alternatives: [
      { name: "AMD Ryzen 7 PRO 7840U", comparison: "Zen 4 — faster CPU, faster GPU, better efficiency in every way" },
      { name: "AMD Ryzen 7 PRO 8840U", comparison: "Latest Zen 4 refresh — the clear choice for new purchases" },
    ],
    architecture: "Zen 3+ (Rembrandt)",
  },

  // AMD Ryzen 7000
  "AMD Ryzen 7 7840HS": {
    summary:
      "Non-PRO Zen 4 chip for enthusiast/workstation ThinkPads. Identical silicon to the PRO 7840U with higher TDP headroom and without PRO manageability.",
    strengths: [
      "Higher sustained clocks than U-series at 35-54W",
      "Radeon 780M — best integrated GPU",
      "Excellent multi-core performance",
      "Strong for sustained workstation loads",
    ],
    weaknesses: [
      "Higher TDP impacts battery life significantly",
      "No AMD PRO management features",
      "Louder fan noise under sustained load",
      "Less common in business ThinkPad lines",
    ],
    bestFor: [
      "Workstation use cases in ThinkPad P-series",
      "Users who prioritise sustained performance over battery",
      "Creative professionals needing strong iGPU and CPU",
      "Docked desktop-replacement workflows",
    ],
    avoidIf: [
      "Battery life matters — choose U-series PRO variant",
      "Your IT department requires PRO manageability",
      "You work mobile frequently",
      "Office work doesn't need HS-class power",
    ],
    thermalNotes:
      "Draws more power and runs warmer than U-series equivalents. Needs proper ThinkPad chassis cooling (P-series recommended). Fan will be audible under sustained workstation loads.",
    generationContext:
      "Zen 4 Phoenix HS-series. Same silicon as Ryzen 7 PRO 7840U/8840U but configured for higher power targets. Positioned for performance-focused workstations.",
    alternatives: [
      {
        name: "AMD Ryzen 7 PRO 8840U",
        comparison: "Same silicon, lower TDP, PRO features — better for mobile business use",
      },
      { name: "AMD Ryzen 7 PRO 8840HS", comparison: "PRO variant with management features at similar TDP" },
    ],
    architecture: "Zen 4 (Phoenix)",
  },

  "AMD Ryzen 5 7535HS": {
    summary:
      "Mid-range Zen 3+ HS chip. Higher TDP headroom than U-series but older architecture. A budget workstation option.",
    strengths: [
      "Higher sustained clocks than U-series counterpart",
      "Reasonable multi-core for budget workloads",
      "Adequate for moderate sustained tasks",
      "Lower cost workstation option",
    ],
    weaknesses: [
      "Zen 3+ architecture behind current Zen 4",
      "Higher TDP without proportional performance gain",
      "Radeon 660M iGPU is basic",
      "No PRO management features",
    ],
    bestFor: [
      "Budget workstation configurations",
      "Sustained moderate workloads where battery doesn't matter",
      "Cost-conscious buyers needing more than U-series",
      "Docked workflows with external GPU potential",
    ],
    avoidIf: [
      "You can afford Zen 4 alternatives",
      "Battery life matters at all",
      "You need a strong integrated GPU",
      "Long-term performance matters",
    ],
    thermalNotes:
      "Warm under load. HS-class TDP needs adequate cooling. Fine in ThinkPad P-series but may be uncomfortable in thinner chassis.",
    generationContext:
      "Zen 3+ Barcelo-R HS variant. Budget workstation positioning. Zen 4 alternatives are strictly better when available.",
    alternatives: [
      { name: "AMD Ryzen 7 7840HS", comparison: "Much faster with better iGPU — strongly prefer if budget allows" },
      { name: "AMD Ryzen 5 PRO 7535U", comparison: "Same silicon, lower TDP, with PRO features — better for mobile" },
    ],
    architecture: "Zen 3+ (Barcelo-R)",
  },

  "AMD Ryzen 5 7530U": {
    summary: "Budget Zen 3 U-series. Functional for basic tasks but dated architecture means it won't age gracefully.",
    strengths: [
      "Low power draw for decent battery",
      "Adequate for basic office work",
      "Cheapest AMD option in the lineup",
      "Quiet operation",
    ],
    weaknesses: [
      "Zen 3 architecture is significantly behind Zen 4",
      "Limited multi-core headroom",
      "Basic Radeon integrated graphics",
      "No PRO features, no NPU",
    ],
    bestFor: [
      "Absolute budget priority AMD builds",
      "Basic office productivity",
      "Short-term or secondary machines",
      "Cost-minimised fleet deployments",
    ],
    avoidIf: [
      "You can stretch to any Ryzen 7 chip",
      "Performance longevity matters",
      "You do anything beyond basic office work",
      "You want strong integrated graphics",
    ],
    thermalNotes: "Cool and quiet. No thermal concerns. Basic office chip thermals.",
    generationContext:
      "Zen 3 'Barcelo' U-series. Oldest AMD architecture in the current lineup. Budget option only — strongly prefer Zen 4 alternatives.",
    alternatives: [
      { name: "AMD Ryzen 5 PRO 8540U", comparison: "Two generations newer, ~25% faster, much better iGPU" },
      { name: "AMD Ryzen 5 PRO 7535U", comparison: "Slightly faster with PRO features at similar price" },
    ],
    architecture: "Zen 3 (Barcelo)",
  },

  // Intel Core Ultra (Lunar Lake)
  "Intel Core Ultra 7 258V": {
    summary:
      "Lunar Lake — Intel's most efficient architecture ever. 8 cores with on-package LPDDR5x and a powerful Arc 140V GPU. Built for ultrabook excellence.",
    strengths: [
      "Best-in-class power efficiency in the Intel lineup",
      "On-package memory eliminates latency bottleneck",
      "Arc 140V is the strongest Intel integrated GPU",
      "Powerful NPU for on-device AI workloads",
    ],
    weaknesses: [
      "Only 8 cores limits heavy multi-threaded workloads",
      "On-package memory means no RAM upgrades ever",
      "New platform with less track record",
      "Higher cost than Meteor Lake equivalents",
    ],
    bestFor: [
      "Ultrabook users wanting the best efficiency",
      "AI/ML enthusiasts wanting strong NPU capabilities",
      "Premium thin-and-light ThinkPad buyers",
      "Users who prioritise battery life above all else",
    ],
    avoidIf: [
      "You need strong sustained multi-core (8 cores limit)",
      "RAM upgradeability matters (soldered on-package)",
      "You want proven, established platform stability",
      "Budget is constrained (Meteor Lake offers more for less)",
    ],
    thermalNotes:
      "Exceptionally cool running. Designed for fanless and ultra-thin form factors. The most thermally efficient Intel mobile chip to date.",
    generationContext:
      "Lunar Lake — Intel's efficiency-first architecture. Trades multi-core count for dramatically better per-core efficiency and integration. On-package memory is a bold architectural choice.",
    alternatives: [
      { name: "Intel Core Ultra 7 155H", comparison: "More cores and raw multi-core power, but much less efficient" },
      { name: "Intel Core Ultra 5 228V", comparison: "Same Lunar Lake platform, lower spec — budget option" },
    ],
    architecture: "Lunar Lake",
  },

  "Intel Core Ultra 5 228V": {
    summary:
      "Budget Lunar Lake with on-package memory and Arc GPU. Shares the exceptional efficiency of the platform at a lower price point.",
    strengths: [
      "Lunar Lake's best-in-class power efficiency",
      "On-package memory for low latency",
      "Strong NPU for AI tasks",
      "Quiet, cool operation",
    ],
    weaknesses: [
      "Limited multi-core with fewer/slower cores than Ultra 7",
      "Non-upgradeable on-package memory",
      "New platform with less maturity",
      "Weaker GPU than the Ultra 7 258V variant",
    ],
    bestFor: [
      "Budget ultrabook buyers wanting Lunar Lake efficiency",
      "Light productivity and office work",
      "Users who value silence and battery above performance",
      "AI experimentation with NPU on a budget",
    ],
    avoidIf: [
      "Multi-core performance matters",
      "You need RAM flexibility",
      "Heavy workloads are part of your routine",
      "Proven platform stability is required",
    ],
    thermalNotes:
      "Extremely cool. Even more thermally friendly than the Ultra 7 variant. Fanless operation viable for most workloads.",
    generationContext:
      "Lunar Lake budget variant. Same architectural advantages as the Ultra 7 258V (on-package memory, NPU, Arc GPU) at reduced clocks and fewer execution units.",
    alternatives: [
      { name: "Intel Core Ultra 7 258V", comparison: "Faster across the board — worth the premium for multi-year use" },
      { name: "Intel Core Ultra 5 235U", comparison: "Arrow Lake — more traditional architecture, upgradeable RAM" },
    ],
    architecture: "Lunar Lake",
  },

  // AMD Ryzen PRO 8000 HS
  "AMD Ryzen 7 PRO 8840HS": {
    summary:
      "Zen 4 PRO with HS-class TDP headroom. Combines AMD PRO manageability with sustained workstation performance. The business workstation sweet spot.",
    strengths: [
      "AMD PRO security and management features",
      "Higher sustained clocks than U-series (35-54W)",
      "Radeon 780M — best integrated GPU",
      "Excellent for sustained professional workloads",
    ],
    weaknesses: [
      "Higher TDP impacts battery life vs U-series",
      "Louder under sustained load than U-series",
      "No NPU in this generation",
      "USB4 instead of Thunderbolt",
    ],
    bestFor: [
      "IT-managed workstation fleets",
      "Developers needing sustained compilation performance",
      "Professional users who primarily work docked",
      "Business environments requiring AMD PRO features",
    ],
    avoidIf: [
      "Mobile battery life is your priority (choose U-series)",
      "Intel vPro is mandated",
      "You work in quiet environments where fan noise matters",
      "Office tasks don't need HS-class power",
    ],
    thermalNotes:
      "Runs warmer than U-series but Zen 4 efficiency keeps it reasonable. ThinkPad P-series chassis handle it well. Expect audible fan under sustained compilation or rendering.",
    generationContext:
      "Zen 4 Hawk Point PRO HS variant. The best AMD business workstation chip — combines PRO manageability with HS-class sustained performance.",
    alternatives: [
      {
        name: "AMD Ryzen 7 PRO 8840U",
        comparison: "Same silicon at lower TDP — better battery, lower sustained performance",
      },
      {
        name: "AMD Ryzen 7 7840HS",
        comparison: "Same performance without PRO features — choose if IT management isn't needed",
      },
    ],
    architecture: "Zen 4 (Hawk Point)",
  },

  "AMD Ryzen 7 PRO 7535U": {
    summary:
      "Mid-range Zen 3+ mobile processor with 8 cores. A cost-effective option in L-series and budget T-series ThinkPads.",
    strengths: [
      "Solid 8-core/16-thread performance for multitasking",
      "PRO features for enterprise manageability",
      "Good power efficiency at 28W TDP",
      "Proven Zen 3+ architecture — mature and stable",
    ],
    weaknesses: [
      "Older Zen 3+ architecture — trails Zen 4 in IPC",
      "Integrated Radeon 660M is weaker than Zen 4's 780M",
      "No AI NPU — limited on-device ML acceleration",
      "DDR5 support limited compared to newer platforms",
    ],
    bestFor: [
      "Budget-conscious business users",
      "Office productivity and light development",
      "Enterprise deployments needing PRO management",
      "Users upgrading from Intel 8th/10th gen",
    ],
    avoidIf: [
      "You need strong integrated GPU performance",
      "Future-proofing with AI/NPU features matters",
      "Peak single-thread performance is critical",
      "You can stretch the budget to Zen 4 (Ryzen 7 PRO 7840U)",
    ],
    thermalNotes:
      "Very manageable thermal profile. Runs cool in L14/L16 chassis. Rarely throttles under sustained workloads.",
    generationContext:
      "Zen 3+ refresh (Barcelo-R). Not a full generational leap — essentially a refined Zen 3 with minor efficiency gains. Succeeded by Zen 4 PRO 8000 series.",
    alternatives: [
      {
        name: "AMD Ryzen 7 PRO 7840U",
        comparison: "Zen 4 with much stronger iGPU (780M) and NPU — worth the upgrade if available",
      },
      {
        name: "AMD Ryzen 5 PRO 7535U",
        comparison: "Same architecture, fewer cores (6C/12T) — saves cost if 8 cores aren't needed",
      },
    ],
    architecture: "Zen 3+ (Barcelo-R)",
  },

  "Intel Core Ultra 7 165H": {
    summary:
      "High-performance 16-core Meteor Lake processor at 28W. Top-tier option in convertible and mainstream chassis.",
    strengths: [
      "Strong 16-core performance with P/E core mix",
      "Integrated Intel Arc GPU for light creative work",
      "NPU for on-device AI acceleration",
      "Good boost clocks for responsive single-threaded tasks",
    ],
    weaknesses: [
      "28W TDP impacts battery life in thin chassis",
      "Marginal uplift over Ultra 7 155H in most workloads",
      "Arc GPU driver maturity still trailing on Linux",
      "Generates noticeable heat under sustained load",
    ],
    bestFor: [
      "Power users needing strong multi-threaded performance",
      "Developers with compile-heavy workflows",
      "Business users wanting maximum Meteor Lake performance",
      "Mixed docked/mobile usage patterns",
    ],
    avoidIf: [
      "All-day battery life is essential",
      "You mainly do light office work",
      "Ultra 7 155H is available at a lower price",
      "You prioritise silent operation",
    ],
    thermalNotes:
      "Similar thermal profile to Ultra 7 155H. Slightly higher peak power draw. Performs best in 14-inch+ chassis with adequate cooling.",
    generationContext:
      "Top-bin Meteor Lake H-series. Essentially a speed-binned Ultra 7 155H with higher boost clocks. Part of Intel's first Core Ultra generation.",
    alternatives: [
      {
        name: "Intel Core Ultra 7 155H",
        comparison: "Nearly identical performance at slightly lower clocks — usually better value",
      },
      { name: "Intel Core Ultra 9 185H", comparison: "Higher TDP variant for workstation-class sustained performance" },
    ],
    architecture: "Meteor Lake",
  },

  "Intel Core Ultra 7 165U": {
    summary:
      "Efficient 12-core Meteor Lake U-series processor at 15W. Premium ultrabook chip balancing performance with battery life.",
    strengths: [
      "Low 15W TDP for excellent battery life",
      "Strong single-core performance at high boost clocks",
      "NPU for efficient AI workloads",
      "Runs cool and quiet in thin designs",
    ],
    weaknesses: [
      "Multi-core trails H-series significantly",
      "12 threads limit sustained heavy multitasking",
      "Marginal improvement over Ultra 7 155U",
      "Arc GPU performance limited by power budget",
    ],
    bestFor: [
      "Road warriors prioritising battery life",
      "Business professionals with mostly single-threaded work",
      "Ultrabook users wanting premium U-series performance",
      "Light development and office productivity",
    ],
    avoidIf: [
      "You need sustained multi-core performance",
      "Heavy compilation or rendering workloads",
      "Ultra 7 155U is available at lower cost",
      "Gaming or GPU-intensive tasks",
    ],
    thermalNotes:
      "Excellent thermal characteristics. Rarely triggers fan in light workloads. Perfect for silent office environments.",
    generationContext:
      "Top-bin Meteor Lake U-series. Higher boost than Ultra 7 155U. Designed for premium thin-and-light ThinkPads.",
    alternatives: [
      { name: "Intel Core Ultra 7 155U", comparison: "Nearly identical in practice — usually the better value choice" },
      { name: "Intel Core Ultra 7 165H", comparison: "Much stronger multi-core at the cost of battery life and heat" },
    ],
    architecture: "Meteor Lake",
  },

  "Intel Core Ultra 5 135U": {
    summary: "Mid-range 12-core Meteor Lake U-series at 15W. The sweet spot for most business ThinkPad users.",
    strengths: [
      "Great battery life at 15W TDP",
      "Adequate performance for business workloads",
      "NPU included for future AI features",
      "Cost-effective entry to Meteor Lake platform",
    ],
    weaknesses: [
      "Lower boost clocks than Ultra 7 variants",
      "Multi-core performance noticeably behind H-series",
      "Not ideal for sustained heavy workloads",
      "Arc GPU weaker at lower power envelope",
    ],
    bestFor: [
      "Standard business laptop users",
      "Office productivity and web-based workflows",
      "Budget-conscious buyers wanting current-gen Intel",
      "Users prioritising battery life over peak performance",
    ],
    avoidIf: [
      "You regularly compile large codebases",
      "You need strong multi-threaded performance",
      "Heavy data processing is part of your workflow",
      "You can stretch to Ultra 7 for meaningful gains",
    ],
    thermalNotes:
      "Near-silent operation in most scenarios. Very low heat output. Ideal for meeting rooms and quiet offices.",
    generationContext:
      "Mainstream Meteor Lake U-series. Replaces the i5-1345U with better efficiency and adds NPU. Good upgrade from 12th/13th gen i5 U-series.",
    alternatives: [
      { name: "Intel Core Ultra 5 125U", comparison: "Slightly lower clocks — minimal real-world difference" },
      { name: "Intel Core Ultra 7 155U", comparison: "Higher boost clocks and better sustained performance" },
    ],
    architecture: "Meteor Lake",
  },

  "Intel Core Ultra 5 135H": {
    summary:
      "Mid-range 14-core Meteor Lake H-series at 28W. Balanced option for users wanting H-series multi-core without premium cost.",
    strengths: [
      "14 cores provide solid multi-threaded capability",
      "28W TDP is reasonable for most 14-inch chassis",
      "NPU included for AI acceleration",
      "Good price-to-performance ratio in the H-series lineup",
    ],
    weaknesses: [
      "Lower boost clocks than Ultra 7 H variants",
      "Still draws more power than U-series alternatives",
      "Fewer P-cores limits peak single-thread performance",
      "Arc GPU limited by lower power allocation",
    ],
    bestFor: [
      "Developers wanting H-class multi-core on a budget",
      "Business users with occasional heavy multitasking",
      "Users who dock frequently and value sustained performance",
      "Budget P-series or T-series configurations",
    ],
    avoidIf: [
      "Peak single-core speed is critical",
      "Battery life matters more than multi-core",
      "You can afford Ultra 7 155H for meaningful uplift",
      "Your workload is primarily single-threaded",
    ],
    thermalNotes:
      "Moderate thermal load. Handles well in 14-inch T-series chassis. Less demanding than Ultra 7/9 H variants.",
    generationContext:
      "Mid-range Meteor Lake H-series. Sits between the efficiency-focused U-series and the performance-oriented Ultra 7/9 H chips.",
    alternatives: [
      {
        name: "Intel Core Ultra 7 155H",
        comparison: "More P-cores and higher boost — worth it for sustained heavy work",
      },
      { name: "Intel Core Ultra 5 135U", comparison: "Much better battery life if multi-core isn't essential" },
    ],
    architecture: "Meteor Lake",
  },

  // Intel Core Ultra Series 2 (Arrow Lake)
  "Intel Core Ultra 7 265H": {
    summary:
      "Second-gen Core Ultra H-series flagship. Arrow Lake architecture with improved efficiency and Lion Cove cores.",
    strengths: [
      "Latest Arrow Lake architecture with IPC uplift",
      "Improved NPU (second-gen) for better AI performance",
      "Strong multi-core performance with efficiency gains",
      "Better power management than Meteor Lake",
    ],
    weaknesses: [
      "Limited availability — early 2025 platform",
      "Software ecosystem still optimising for Arrow Lake",
      "Modest single-core gains over Meteor Lake 155H",
      "Thermal profile similar to first-gen Ultra 7 H",
    ],
    bestFor: [
      "Early adopters wanting latest Intel platform",
      "Users needing improved NPU for AI workloads",
      "Developers wanting best available Intel multi-core",
      "Enterprise deployments planning 3+ year lifecycle",
    ],
    avoidIf: [
      "Proven platform stability is important to you",
      "Budget is a concern — first-gen Ultra offers better value",
      "Linux support for bleeding-edge platforms concerns you",
      "Meteor Lake Ultra 7 155H meets your needs",
    ],
    thermalNotes:
      "Slightly improved power efficiency over Meteor Lake at same TDP. Arrow Lake thermals benefit from refined power delivery.",
    generationContext:
      "Second-gen Core Ultra (Arrow Lake). Successor to Meteor Lake with Lion Cove P-cores replacing Redwood Cove. Improved NPU and GPU.",
    alternatives: [
      {
        name: "Intel Core Ultra 7 255H",
        comparison: "Lower bin of same architecture — typically similar real-world performance",
      },
      { name: "Intel Core Ultra 7 155H", comparison: "Previous gen — proven, widely available, and often cheaper" },
    ],
    architecture: "Arrow Lake",
  },

  "Intel Core Ultra 7 255H": {
    summary: "Second-gen Core Ultra H-series. Strong Arrow Lake chip for mainstream performance laptops.",
    strengths: [
      "Arrow Lake IPC improvements over Meteor Lake",
      "Balanced performance-to-power ratio",
      "Second-gen NPU for enhanced AI capabilities",
      "Good multi-core scaling for development workloads",
    ],
    weaknesses: [
      "Minimal real-world gap from Ultra 7 265H",
      "New platform may have early driver issues",
      "28W base TDP still impacts battery in thin designs",
      "First-gen Ultra 7 155H often delivers similar value",
    ],
    bestFor: [
      "Business users wanting current-gen Intel H-series",
      "Multi-threaded workloads in T/P-series ThinkPads",
      "Users planning to keep their laptop 3+ years",
      "AI-forward workflows leveraging the improved NPU",
    ],
    avoidIf: [
      "Proven ecosystem matters more than bleeding edge",
      "Budget favours Meteor Lake alternatives",
      "U-series battery life is more important",
      "Linux driver support maturity is critical",
    ],
    thermalNotes:
      "Similar thermal envelope to Meteor Lake H-series. Arrow Lake efficiency gains manifest mainly at idle and light loads.",
    generationContext:
      "Arrow Lake H-series mainstream. Part of Intel's second Core Ultra wave alongside Lunar Lake V-series ultrabooks.",
    alternatives: [
      { name: "Intel Core Ultra 7 265H", comparison: "Higher bin — marginal real-world difference for most workloads" },
      { name: "Intel Core Ultra 5 235H", comparison: "Significantly cheaper with adequate performance for most users" },
    ],
    architecture: "Arrow Lake",
  },

  "Intel Core Ultra 5 235H": {
    summary:
      "Mid-range Arrow Lake H-series. Cost-effective entry to second-gen Core Ultra with solid multi-core capabilities.",
    strengths: [
      "Good multi-core performance at reasonable price point",
      "Second-gen NPU for AI features",
      "Improved power efficiency over Meteor Lake i5 H",
      "Adequate for development and business workloads",
    ],
    weaknesses: [
      "Lower boost clocks than Ultra 7 variants",
      "H-series TDP still impacts battery life",
      "Fewer P-cores than Ultra 7 limits peak throughput",
      "Arrow Lake platform maturity still developing",
    ],
    bestFor: [
      "Budget-conscious users wanting Arrow Lake",
      "Standard development and office workloads",
      "Users stepping up from U-series for better multi-core",
      "Enterprise bulk deployments on current-gen platform",
    ],
    avoidIf: [
      "Maximum single-thread speed is needed",
      "Battery life is the top priority",
      "Proven Meteor Lake platform is available cheaper",
      "Your workload doesn't benefit from H-series cores",
    ],
    thermalNotes: "Lower thermal ceiling than Ultra 7 H variants. Comfortable in standard 14-inch T-series chassis.",
    generationContext:
      "Mid-range Arrow Lake H. Good balance for users who don't need top-bin performance. Replaces Meteor Lake Ultra 5 135H.",
    alternatives: [
      {
        name: "Intel Core Ultra 7 255H",
        comparison: "Higher bin with more P-cores — worth it for heavy multi-threaded work",
      },
      {
        name: "Intel Core Ultra 5 235U",
        comparison: "U-series variant for much better battery life at cost of multi-core",
      },
    ],
    architecture: "Arrow Lake",
  },

  "Intel Core Ultra 5 225H": {
    summary: "Entry-level Arrow Lake H-series. Basic H-class multi-core for budget T-series configurations.",
    strengths: [
      "H-series multi-core at the lowest price point",
      "Second-gen NPU included",
      "Reasonable sustained performance for the price",
      "Arrow Lake efficiency improvements over prior gen",
    ],
    weaknesses: [
      "Lowest boost clocks in the Arrow Lake H lineup",
      "Multi-core noticeably behind Ultra 5 235H",
      "H-series battery life penalty for modest performance gain",
      "Ultra 5 235U often provides better overall experience",
    ],
    bestFor: [
      "Tight-budget H-series configurations",
      "Basic multi-threaded workloads",
      "Enterprise deployments minimising per-unit cost",
      "Users who dock most of the time",
    ],
    avoidIf: [
      "Battery life matters — U-series is better",
      "You can stretch to Ultra 5 235H for worthwhile gains",
      "Single-threaded performance is your focus",
      "You don't specifically need H-class multi-core",
    ],
    thermalNotes: "Lowest thermal output of the Arrow Lake H range. Runs comfortably even in slimmer chassis.",
    generationContext:
      "Base Arrow Lake H-series. Entry point for users wanting more cores than U-series. Part of the 2025 Intel Core Ultra refresh.",
    alternatives: [
      {
        name: "Intel Core Ultra 5 235H",
        comparison: "Meaningfully faster boost clocks — worth the small price premium",
      },
      { name: "Intel Core Ultra 5 225U", comparison: "U-series alternative with much better battery life" },
    ],
    architecture: "Arrow Lake",
  },

  "Intel Core Ultra 7 265U": {
    summary:
      "Premium Arrow Lake U-series at 15W. Best ultrabook efficiency with strong single-core from second-gen Core Ultra.",
    strengths: [
      "Excellent battery life at 15W TDP",
      "Strong single-core boost clocks",
      "Second-gen NPU for on-device AI",
      "Improved power management over Meteor Lake U",
    ],
    weaknesses: [
      "Limited multi-core compared to H-series",
      "Marginal gains over Ultra 7 255U",
      "Premium pricing for U-series top bin",
      "12 threads cap limits heavy multitasking",
    ],
    bestFor: [
      "Premium ultrabook users",
      "Road warriors needing all-day battery",
      "Business professionals with single-threaded workflows",
      "Users wanting latest platform in an efficient package",
    ],
    avoidIf: [
      "Multi-core performance is important",
      "Ultra 7 255U is available at lower cost",
      "Heavy development or compilation workloads",
      "You need more than 12 threads for your workflow",
    ],
    thermalNotes: "Near-silent in most scenarios. Excellent for meeting rooms and quiet work environments.",
    generationContext:
      "Top-bin Arrow Lake U-series. Best single-core in the low-power Intel lineup. Successor to Meteor Lake Ultra 7 165U.",
    alternatives: [
      { name: "Intel Core Ultra 7 255U", comparison: "Slightly lower clocks — minimal practical difference" },
      { name: "Intel Core Ultra 7 265H", comparison: "H-series for vastly better multi-core at cost of battery life" },
    ],
    architecture: "Arrow Lake",
  },

  "Intel Core Ultra 7 255U": {
    summary:
      "Mid-premium Arrow Lake U-series. Efficient 15W chip with good all-round performance for business ultrabooks.",
    strengths: [
      "Low power draw with good single-core",
      "Second-gen NPU",
      "Well-suited for enterprise ultrabook deployments",
      "Quiet, cool operation in thin designs",
    ],
    weaknesses: [
      "Multi-core limited by U-series core count",
      "Small gap from Ultra 5 235U questions value premium",
      "H-series pulls away in sustained workloads",
      "Arrow Lake U platform still maturing",
    ],
    bestFor: [
      "Business ultrabook users",
      "All-day mobile computing",
      "Office and light development workloads",
      "Enterprise fleet purchases on current-gen",
    ],
    avoidIf: [
      "Heavy multi-threaded work is common",
      "Ultra 5 235U meets your performance needs",
      "You need the absolute best single-core (Ultra 7 265U)",
      "Budget allows H-series for better sustained throughput",
    ],
    thermalNotes: "Minimal heat generation. Suitable for fanless or semi-passive designs. Near-silent in typical use.",
    generationContext:
      "Mainstream Arrow Lake U-series. Good middle ground between cost and capability in the 15W range.",
    alternatives: [
      { name: "Intel Core Ultra 7 265U", comparison: "Higher bin — negligible real-world advantage for most" },
      { name: "Intel Core Ultra 5 235U", comparison: "Lower cost with adequate performance for most business use" },
    ],
    architecture: "Arrow Lake",
  },

  "Intel Core Ultra 5 225U": {
    summary: "Entry-level Arrow Lake U-series at 15W. Budget-friendly current-gen option for basic business computing.",
    strengths: [
      "Lowest cost Arrow Lake option",
      "Excellent battery life",
      "Second-gen NPU for AI features",
      "Cool and quiet operation",
    ],
    weaknesses: [
      "Lowest performance in Arrow Lake U lineup",
      "Multi-core limited for demanding tasks",
      "Lower boost clocks noticeable in bursty workloads",
      "Ultra 5 235U offers better value for small price increase",
    ],
    bestFor: [
      "Budget enterprise deployments",
      "Basic office productivity",
      "Users who prioritise battery above all else",
      "Light web-based workflows",
    ],
    avoidIf: [
      "Any sustained performance matters",
      "Development or compilation workloads",
      "You can afford Ultra 5 235U for meaningful uplift",
      "You need strong single-threaded responsiveness",
    ],
    thermalNotes: "Minimal thermal impact. Runs fanless or near-silent in all scenarios.",
    generationContext:
      "Base Arrow Lake U-series. Entry point to second-gen Core Ultra platform. Adequate for basic computing needs.",
    alternatives: [
      {
        name: "Intel Core Ultra 5 235U",
        comparison: "Better boost clocks and sustained performance for modest price increase",
      },
      { name: "Intel Core Ultra 5 225H", comparison: "H-series variant if multi-core matters more than battery life" },
    ],
    architecture: "Arrow Lake",
  },

  // Intel Core Ultra (Lunar Lake V) — additional entries
  "Intel Core Ultra 7 268V": {
    summary:
      "Top-bin Lunar Lake V-series. Intel's most efficient premium processor with exceptional battery life and strong Arc 140V GPU.",
    strengths: [
      "Outstanding battery life — best in class for Intel",
      "Strongest Lunar Lake single-core performance",
      "Excellent integrated Arc 140V GPU",
      "32GB LPDDR5x memory on-package for bandwidth",
    ],
    weaknesses: [
      "8 threads limits heavy multi-core workloads",
      "Memory on-package means no upgrade path",
      "Maximum 32GB RAM — not suitable for memory-heavy work",
      "Premium pricing for Lunar Lake top bin",
    ],
    bestFor: [
      "Premium ultrabook users wanting maximum battery life",
      "Light creative work leveraging Arc 140V GPU",
      "Executives and road warriors",
      "Users who value responsiveness over raw throughput",
    ],
    avoidIf: [
      "You need more than 32GB RAM",
      "Heavy multi-threaded workloads are common",
      "You need expandable memory for future growth",
      "Budget is a primary concern",
    ],
    thermalNotes: "Exceptional — 17W TDP keeps the chassis cool and quiet. Often runs fanless under light loads.",
    generationContext:
      "Top-bin Lunar Lake. Intel's dedicated ultrabook platform with on-package memory. Trades multi-core for efficiency. Coexists with Arrow Lake H/U for different use cases.",
    alternatives: [
      {
        name: "Intel Core Ultra 7 258V",
        comparison: "Slightly lower clocks — saves cost with negligible performance difference",
      },
      {
        name: "Intel Core Ultra 7 265U",
        comparison: "Arrow Lake U-series — more cores but less efficiency and weaker GPU",
      },
    ],
    architecture: "Lunar Lake",
  },

  "Intel Core Ultra 7 256V": {
    summary:
      "Mid-range Lunar Lake V-series. Strong efficiency with Arc integrated graphics at a more accessible price than the 268V/258V.",
    strengths: [
      "Excellent battery life at 17W TDP",
      "Good Arc integrated GPU performance",
      "On-package LPDDR5x for high memory bandwidth",
      "Quiet, cool operation in thin chassis",
    ],
    weaknesses: [
      "8 threads limit multi-core scaling",
      "Non-upgradeable on-package memory",
      "Lower boost clocks than 258V/268V variants",
      "32GB max RAM cap",
    ],
    bestFor: [
      "Mid-range ultrabook buyers",
      "Users wanting Lunar Lake efficiency at lower cost",
      "Light creative and development work",
      "All-day mobile computing",
    ],
    avoidIf: [
      "Multi-threaded performance is critical",
      "Memory expansion is needed",
      "258V is available at reasonable price premium",
      "Sustained workstation-class work is needed",
    ],
    thermalNotes:
      "Very low thermal output at 17W. Rarely triggers fans in normal use. Excellent for silent environments.",
    generationContext: "Mid-bin Lunar Lake. Good balance of capability and price within the V-series lineup.",
    alternatives: [
      {
        name: "Intel Core Ultra 7 258V",
        comparison: "Higher boost clocks — noticeable in bursty single-threaded tasks",
      },
      { name: "Intel Core Ultra 5 238V", comparison: "Lower bin with adequate performance for most users" },
    ],
    architecture: "Lunar Lake",
  },

  "Intel Core Ultra 5 238V": {
    summary: "Upper mid-range Lunar Lake V-series. Good efficiency-focused option with capable integrated graphics.",
    strengths: [
      "Strong battery life and efficiency",
      "Decent Arc integrated GPU",
      "Cost-effective Lunar Lake option",
      "On-package memory for good bandwidth",
    ],
    weaknesses: [
      "8 threads for multi-core work",
      "Lower single-core than Ultra 7 V variants",
      "Fixed 16-32GB memory configurations",
      "Not ideal for sustained heavy workloads",
    ],
    bestFor: [
      "Mainstream ultrabook users",
      "Business professionals prioritising battery life",
      "Light development and office productivity",
      "Users who want Lunar Lake without premium pricing",
    ],
    avoidIf: [
      "Multi-core performance is a priority",
      "You need more than 32GB memory",
      "Sustained performance matters more than efficiency",
      "You can stretch to Ultra 7 for meaningful gains",
    ],
    thermalNotes: "Very low heat output. Ideal for thin-and-light designs. Near-silent operation is the norm.",
    generationContext:
      "Mid-range Lunar Lake V-series. Good entry point to the V platform with adequate performance for most use cases.",
    alternatives: [
      { name: "Intel Core Ultra 7 256V", comparison: "Higher boost and better sustained performance" },
      { name: "Intel Core Ultra 5 236V", comparison: "Lower bin — small performance difference, lower cost" },
    ],
    architecture: "Lunar Lake",
  },

  "Intel Core Ultra 5 236V": {
    summary:
      "Budget-friendly Lunar Lake V-series. Entry-level option for users wanting Lunar Lake's efficiency at the lowest price.",
    strengths: [
      "Excellent battery efficiency",
      "Lunar Lake platform features at lower cost",
      "Adequate single-core for responsive daily use",
      "On-package memory benefits",
    ],
    weaknesses: [
      "Lowest V-series performance tier",
      "8 threads limit concurrent workloads",
      "Lower boost clocks noticeable in demanding tasks",
      "Fixed memory — no upgrade path",
    ],
    bestFor: [
      "Budget ultrabook configurations",
      "Users prioritising efficiency above all",
      "Light office and web workloads",
      "Enterprise fleet with basic computing needs",
    ],
    avoidIf: [
      "Any development or compilation work",
      "You need strong single-core responsiveness",
      "Ultra 5 238V is within budget for worthwhile gains",
      "Multi-threaded workloads are part of your day",
    ],
    thermalNotes: "Minimal thermal footprint. Suitable for the thinnest chassis designs. Fanless operation common.",
    generationContext:
      "Entry Lunar Lake V5 tier. Trades some clock speed for the lowest possible V-series price point.",
    alternatives: [
      {
        name: "Intel Core Ultra 5 238V",
        comparison: "Higher clocks — noticeable improvement for small price difference",
      },
      { name: "Intel Core Ultra 5 226V", comparison: "Lowest bin — minimal savings vs 236V" },
    ],
    architecture: "Lunar Lake",
  },

  "Intel Core Ultra 5 226V": {
    summary: "Lowest-bin Lunar Lake V-series. Maximum efficiency at the most accessible price point.",
    strengths: [
      "Best-in-class power efficiency for Intel",
      "Lowest cost of entry to Lunar Lake",
      "On-package memory bandwidth",
      "Adequate for basic computing tasks",
    ],
    weaknesses: [
      "Lowest performance in V-series lineup",
      "Limited multi-core capability (8 threads)",
      "Lowest boost clocks restrict bursty tasks",
      "236V offers better value for small premium",
    ],
    bestFor: [
      "Ultra-budget Lunar Lake configurations",
      "Users who only need web and office apps",
      "Maximum battery life scenarios",
      "Basic enterprise thin-client replacements",
    ],
    avoidIf: [
      "Anything beyond basic web and office use",
      "You can afford the 236V or 238V for real gains",
      "Future-proofing for any demanding workloads",
      "You need responsive performance for development",
    ],
    thermalNotes: "Negligible thermal output. Silent operation in virtually all scenarios.",
    generationContext: "Base Lunar Lake V5. Exists primarily for the lowest-cost Lunar Lake SKU in enterprise tenders.",
    alternatives: [
      { name: "Intel Core Ultra 5 236V", comparison: "Slightly higher clocks — worth the small premium" },
      { name: "Intel Core Ultra 5 228V", comparison: "Different stepping but similar performance tier" },
    ],
    architecture: "Lunar Lake",
  },

  // Intel 13th Gen U-series (Raptor Lake refresh) — used in X13 Yoga Gen 4, L13 Yoga Gen 4 Intel
  "Intel Core i5-1335U": {
    summary:
      "Entry-level 13th Gen U-series with 2P+8E cores at 15W. Raptor Lake refresh of Alder Lake — minimal performance gains but proven stability.",
    strengths: [
      "Low 15W TDP for good battery life",
      "Hybrid P/E cores handle multitasking well",
      "Proven, mature architecture with stable drivers",
      "Adequate single-core for office and web tasks",
    ],
    weaknesses: [
      "Modest multi-core — not suited for heavy parallel workloads",
      "Minimal performance uplift over 12th Gen i5-1235U",
      "Integrated Iris Xe is competent but not exciting",
      "LPDDR5 bandwidth limited in U-series designs",
    ],
    bestFor: [
      "Budget business laptops for office work",
      "Students needing a reliable, long-battery-life machine",
      "IT fleets with standardized configurations",
      "Light web development and scripting",
    ],
    avoidIf: [
      "You compile large projects regularly",
      "You need strong multi-threaded performance",
      "Gaming or creative work is planned",
      "You want the latest architecture (Core Ultra)",
    ],
    thermalNotes:
      "Very manageable. Most chassis run quiet. 15W envelope keeps thermals in check even in slim 13-inch designs.",
    generationContext:
      "Raptor Lake U-series refresh. Minor clock bumps over Alder Lake i5-1235U. Last generation before the Core Ultra rebrand. Mature and reliable.",
    alternatives: [
      { name: "Intel Core i7-1355U", comparison: "~15% faster — worth the modest premium for development work" },
      { name: "Intel Core i5-1235U", comparison: "Nearly identical performance — save money if available cheaper" },
    ],
    architecture: "Raptor Lake",
  },
  "Intel Core i7-1355U": {
    summary:
      "Mid-range 13th Gen U-series with 2P+8E cores at 15W. Solid single-core boost up to 5.0 GHz makes it responsive for everyday tasks and light development.",
    strengths: [
      "Good single-core boost to 5.0 GHz",
      "Adequate multi-core for most business workloads",
      "Proven Raptor Lake architecture",
      "15W TDP balances performance and battery life",
    ],
    weaknesses: [
      "Multi-core limited by 15W power envelope",
      "Minimal uplift over 12th Gen i7-1255U",
      "No Thunderbolt in some L-series implementations",
      "Last-gen before Core Ultra — no NPU",
    ],
    bestFor: [
      "Business professionals with varied workloads",
      "Light development (web dev, scripting, IDE work)",
      "Convertible/Yoga laptops where battery matters",
      "Users who want proven stability over bleeding-edge",
    ],
    avoidIf: [
      "You need NPU for AI workloads",
      "Heavy compilation or rendering is routine",
      "You want the latest platform features",
      "Strong GPU performance matters",
    ],
    thermalNotes:
      "Well-behaved in 13-inch chassis. The 5.0 GHz boost is brief — sustained loads settle to 15W steady state.",
    generationContext:
      "Raptor Lake U-series flagship. Replaces i7-1265U with modest clock gains. The last Intel U-series before Core Ultra.",
    alternatives: [
      { name: "Intel Core i5-1335U", comparison: "~15% slower but cheaper — adequate for pure office work" },
      { name: "Intel Core i7-1265U", comparison: "Very similar performance — save money on older stock" },
    ],
    architecture: "Raptor Lake",
  },

  // Intel 12th Gen U-series (Alder Lake) — used in X13 Yoga Gen 3, L13 Yoga Gen 3 Intel
  "Intel Core i5-1235U": {
    summary:
      "First hybrid-architecture i5 U-series with 2P+8E cores. The Alder Lake revolution brought big.LITTLE to x86 laptops. Solid for mainstream workloads.",
    strengths: [
      "Hybrid P/E core architecture for efficient multitasking",
      "Good battery life at 15W",
      "10 cores handle parallel tasks better than older 4-core i5s",
      "Mature Iris Xe integrated graphics",
    ],
    weaknesses: [
      "E-cores are weaker than P-cores — not all workloads scale",
      "First-gen hybrid scheduling had Linux quirks (fixed in 5.18+)",
      "15W limits sustained multi-core throughput",
      "DDR4 still used in some L-series designs",
    ],
    bestFor: [
      "Budget business laptops",
      "Students and everyday office use",
      "Light development work",
      "Long battery life on the go",
    ],
    avoidIf: [
      "Heavy multi-threaded workloads are common",
      "You need peak single-core speed",
      "Latest platform features (NPU) are required",
      "You run Linux on kernel < 5.18",
    ],
    thermalNotes:
      "Excellent thermals at 15W. Most 13-inch chassis stay cool and quiet. Alder Lake idle efficiency is good.",
    generationContext:
      "First hybrid U-series — the Alder Lake revolution. E-cores handle background tasks efficiently. Replaced 11th Gen Tiger Lake in mainstream laptops.",
    alternatives: [
      { name: "Intel Core i7-1255U", comparison: "~13% faster single-core boost — modest premium" },
      { name: "Intel Core i5-1135G7", comparison: "Previous gen — significantly slower multi-core" },
    ],
    architecture: "Alder Lake",
  },
  "Intel Core i7-1255U": {
    summary:
      "Alder Lake U-series flagship with 2P+8E cores at 15W. Good single-core boost makes it responsive. The jump from 4-core Tiger Lake to 10-core Alder Lake was significant.",
    strengths: [
      "Strong single-core boost to 4.7 GHz",
      "10 cores handle multitasking well",
      "Good Iris Xe graphics for light tasks",
      "15W TDP keeps battery life reasonable",
    ],
    weaknesses: [
      "Multi-core still limited by 15W envelope",
      "Alder Lake U-series pales next to P-series variants",
      "Some DDR4 implementations limit memory bandwidth",
      "First-gen hybrid — minor scheduling quirks on early kernels",
    ],
    bestFor: [
      "Business laptops with mixed workloads",
      "Development in IDE-heavy workflows",
      "Convertible laptops balancing performance and battery",
      "Users upgrading from 10th/11th Gen",
    ],
    avoidIf: [
      "Heavy sustained multi-core is needed (choose P-series)",
      "Latest platform features are required",
      "Strong GPU compute matters",
      "You want DDR5 — check the specific laptop config",
    ],
    thermalNotes:
      "Well-managed in most 13-14 inch chassis. Brief boost to 4.7 GHz; sustained loads stay at 15W steady state.",
    generationContext:
      "Alder Lake U-series flagship. First hybrid i7 for ultrabooks. Significant multi-core uplift over Tiger Lake i7-1165G7 due to E-cores.",
    alternatives: [
      { name: "Intel Core i5-1235U", comparison: "~13% slower but cheaper — adequate for most tasks" },
      { name: "Intel Core i7-1265U", comparison: "Higher-tier SKU in the same family — minimal real-world difference" },
    ],
    architecture: "Alder Lake",
  },

  // Intel 11th Gen (Tiger Lake) — used in X1 Yoga Gen 6, X13 Yoga Gen 2, L13 Yoga Gen 2, X1 Titanium
  "Intel Core i5-1135G7": {
    summary:
      "Mainstream Tiger Lake quad-core at 15W. Introduced Iris Xe graphics — a big GPU uplift over UHD 620. Still adequate for office and light development in 2025.",
    strengths: [
      "Iris Xe iGPU was a major uplift over Intel UHD",
      "Thunderbolt 4 support",
      "Solid single-core performance for everyday tasks",
      "Mature, stable drivers across Windows and Linux",
    ],
    weaknesses: [
      "Only 4 cores / 8 threads — limits multi-threaded workloads",
      "Significantly slower than Alder Lake+ in parallel tasks",
      "15W TDP limits sustained boost",
      "Aging platform — no hybrid cores, no NPU",
    ],
    bestFor: [
      "Budget used laptops for office work",
      "Students on a tight budget",
      "Basic web development and scripting",
      "Users who prioritise proven stability",
    ],
    avoidIf: [
      "Multi-threaded performance matters (coding, VMs)",
      "You want a laptop that lasts 4+ years from today",
      "Modern features (NPU, DDR5) are important",
      "You can stretch budget to Alder Lake or newer",
    ],
    thermalNotes:
      "Very cool at 15W. Tiger Lake quad-core runs near-silent in most chassis. Sustained boost holds well in 13-14 inch designs.",
    generationContext:
      "Tiger Lake mainstream — the last 4-core mainstream Intel. Iris Xe was a breakthrough for integrated graphics. Replaced 10th Gen Comet Lake and Ice Lake.",
    alternatives: [
      { name: "Intel Core i7-1165G7", comparison: "~10% faster single-core — worth it for development work" },
      { name: "Intel Core i5-1235U", comparison: "Alder Lake successor — 2.5x multi-core with E-cores" },
    ],
    architecture: "Tiger Lake",
  },
  "Intel Core i7-1165G7": {
    summary:
      "Tiger Lake flagship U-series quad-core. Strong single-core boost to 4.7 GHz with Iris Xe graphics. A good balance of performance and efficiency for its era.",
    strengths: [
      "Excellent single-core boost for a 15W chip",
      "Iris Xe graphics capable of light gaming and video editing",
      "Thunderbolt 4 support",
      "Proven, mature platform with excellent driver support",
    ],
    weaknesses: [
      "4 cores / 8 threads — the main bottleneck",
      "Multi-core falls far behind Alder Lake 10+ core designs",
      "No efficiency cores for background task offloading",
      "Aging in 2025 — better options available at similar used prices",
    ],
    bestFor: [
      "Used market buyers seeking proven reliability",
      "Office and productivity workloads",
      "Light development and scripting",
      "Users who value single-core responsiveness",
    ],
    avoidIf: [
      "Multi-core performance is important for your workflow",
      "You want to keep the laptop for 3+ more years",
      "Strong GPU performance is needed",
      "Budget allows for Alder Lake or newer",
    ],
    thermalNotes:
      "Very manageable. The 4.7 GHz boost is brief but efficient. Sustained loads are quiet in most chassis designs.",
    generationContext:
      "Tiger Lake flagship U-series. The best mainstream Intel mobile chip of 2021. First to pair Xe graphics with high boost clocks. Replaced Comet Lake i7-10510U.",
    alternatives: [
      {
        name: "Intel Core i7-1185G7",
        comparison: "Same architecture, slightly higher clocks — marginal real-world difference",
      },
      { name: "Intel Core i5-1135G7", comparison: "~10% slower single-core but cheaper" },
    ],
    architecture: "Tiger Lake",
  },
  "Intel Core i7-1185G7": {
    summary:
      "Top-bin Tiger Lake U-series with the highest boost clocks. Marginally faster than i7-1165G7 — primarily a vPro/enterprise SKU with slightly higher sustained clocks.",
    strengths: [
      "Highest Tiger Lake U-series boost clocks (4.8 GHz)",
      "Includes Intel vPro for enterprise management",
      "Iris Xe graphics with full execution units",
      "Proven stability and driver maturity",
    ],
    weaknesses: [
      "Marginal uplift over i7-1165G7 (2-3%)",
      "Still only 4 cores / 8 threads",
      "Premium pricing for minimal performance gain",
      "Same fundamental limitations as all Tiger Lake U-series",
    ],
    bestFor: [
      "Enterprise deployments requiring vPro",
      "Users who got this chip in an existing laptop",
      "Office workloads where single-core matters",
      "IT-managed fleets needing remote management",
    ],
    avoidIf: [
      "You are choosing between this and i7-1165G7 — save money",
      "Multi-core performance matters",
      "You have budget for Alder Lake or newer",
      "vPro is not required by your IT department",
    ],
    thermalNotes:
      "Nearly identical to i7-1165G7 thermals. The slightly higher boost barely impacts cooling requirements.",
    generationContext:
      "Top-bin Tiger Lake U for enterprise. vPro-capable. Mostly found in premium business laptops (X1 Yoga Gen 6, X1 Titanium Yoga). Successor: i7-1265U.",
    alternatives: [
      { name: "Intel Core i7-1165G7", comparison: "2-3% slower — save the money unless vPro is required" },
      { name: "Intel Core i7-1255U", comparison: "Alder Lake successor — dramatically better multi-core" },
    ],
    architecture: "Tiger Lake",
  },

  // Intel 10th Gen (Comet Lake) — used in X1 Yoga Gen 5, X13 Yoga Gen 1, L13 Yoga Gen 1
  "Intel Core i5-10210U": {
    summary:
      "Comet Lake quad-core at 15W. The last Intel mobile chip with Intel UHD 620 graphics. Adequate for basic tasks but showing its age in 2025.",
    strengths: [
      "Very low power draw — good battery life",
      "Proven, stable 14nm process",
      "Adequate for office and web browsing",
      "Very mature Linux and Windows driver support",
    ],
    weaknesses: [
      "UHD 620 iGPU is weak by current standards",
      "4 cores / 8 threads is limiting for modern multitasking",
      "No Thunderbolt 4 (Thunderbolt 3 only)",
      "14nm efficiency trails modern 7nm/4nm designs",
    ],
    bestFor: [
      "Budget used laptops for basic tasks",
      "Students who mainly browse and write documents",
      "Secondary/backup machines",
      "IT asset lifecycle — still functional for simple workflows",
    ],
    avoidIf: [
      "You need multi-threaded performance",
      "Modern GPU capabilities matter (video decode, etc.)",
      "You want a machine to last 3+ more years",
      "Any development or creative work is planned",
    ],
    thermalNotes: "Very cool. 14nm quad-core at 15W is trivial for any chassis. Completely silent in most designs.",
    generationContext:
      "Comet Lake — Intel's last 14nm mobile generation. Refined quad-core design. Replaced by Tiger Lake (11th Gen) which brought Xe graphics and Thunderbolt 4.",
    alternatives: [
      { name: "Intel Core i7-10510U", comparison: "~13% faster single-core boost — modest uplift" },
      { name: "Intel Core i5-1135G7", comparison: "Tiger Lake successor — much better GPU, similar power" },
    ],
    architecture: "Comet Lake",
  },
  "Intel Core i7-10510U": {
    summary:
      "Comet Lake flagship quad-core at 15W. Higher boost than the i5-10210U but same 4C/8T and UHD 620 graphics. A capable chip for its time, now dated.",
    strengths: [
      "Good single-core boost to 4.9 GHz",
      "Low power draw and cool operation",
      "Proven 14nm reliability",
      "Mature driver support everywhere",
    ],
    weaknesses: [
      "UHD 620 iGPU is weak",
      "4 cores limiting for 2025 workloads",
      "No Thunderbolt 4",
      "14nm process efficiency far behind modern nodes",
    ],
    bestFor: [
      "Used laptop buyers on a tight budget",
      "Basic office and web browsing",
      "Backup or secondary machines",
      "Simple scripting and text editing",
    ],
    avoidIf: [
      "Any serious performance needs",
      "You want GPU-accelerated workflows",
      "Modern connectivity (TB4, Wi-Fi 6E+) matters",
      "This would be your primary development machine",
    ],
    thermalNotes: "Trivial thermals. Runs cool and quiet in any chassis. 14nm at 15W is essentially a non-issue.",
    generationContext:
      "Comet Lake flagship U-series. Last 14nm generation. Found in X1 Yoga Gen 5 and X13 Yoga Gen 1. Replaced by Tiger Lake i7-1165G7.",
    alternatives: [
      { name: "Intel Core i5-10210U", comparison: "~13% slower but cheaper — adequate for basic tasks" },
      { name: "Intel Core i7-1165G7", comparison: "Tiger Lake successor — massively better GPU with Iris Xe" },
    ],
    architecture: "Comet Lake",
  },
  "Intel Core i7-10610U": {
    summary:
      "vPro variant of the Comet Lake i7-10510U. Nearly identical performance with enterprise management features. Found in business-class ThinkPads.",
    strengths: [
      "Intel vPro for enterprise remote management",
      "Good single-core boost to 4.9 GHz",
      "Proven stability and mature drivers",
      "Low power draw",
    ],
    weaknesses: [
      "Marginal uplift over i7-10510U",
      "Same UHD 620 limitations",
      "4 cores — limiting in 2025",
      "vPro adds no consumer benefit",
    ],
    bestFor: [
      "Enterprise IT-managed laptops",
      "Fleet deployments requiring remote management",
      "Basic business workflows",
      "Users inheriting corporate laptops",
    ],
    avoidIf: [
      "vPro is not required — choose i7-10510U instead",
      "Any performance-sensitive workloads",
      "Modern platform features matter",
      "This is a new purchase — newer options exist",
    ],
    thermalNotes: "Identical to i7-10510U. Cool and quiet in all ThinkPad chassis.",
    generationContext:
      "Comet Lake vPro SKU. Essentially an i7-10510U with Intel AMT. Found in X1 Yoga Gen 5 corporate configurations.",
    alternatives: [
      { name: "Intel Core i7-10510U", comparison: "Same performance without vPro — save money if AMT not needed" },
      { name: "Intel Core i7-1165G7", comparison: "Tiger Lake replacement — much better in every dimension" },
    ],
    architecture: "Comet Lake",
  },

  // Intel 8th Gen addition
  "Intel Core i7-8665U": {
    summary:
      "Whiskey Lake vPro variant of the 8th Gen quad-core. Marginally faster than i7-8550U with enterprise management. The last hurrah of the Kaby Lake Refresh architecture.",
    strengths: [
      "Intel vPro for enterprise management",
      "Slightly higher boost than i7-8550U (4.8 GHz)",
      "Proven, rock-solid 14nm platform",
      "Extremely mature driver support",
    ],
    weaknesses: [
      "4 cores / 8 threads — very limiting in 2025",
      "UHD 620 graphics are weak",
      "14nm efficiency far behind modern process nodes",
      "No Thunderbolt 4 or Wi-Fi 6",
    ],
    bestFor: [
      "Ultra-budget used laptop purchases",
      "Basic web and document tasks",
      "Users who need vPro for legacy corporate tools",
      "Linux tinkering on proven hardware",
    ],
    avoidIf: [
      "Any performance-sensitive use case",
      "This would be a primary work machine",
      "You have budget for anything 11th Gen or newer",
      "Modern features (Wi-Fi 6, TB4) are needed",
    ],
    thermalNotes:
      "Cool and silent. 14nm quad-core at 15W generates minimal heat. Any ThinkPad chassis handles it easily.",
    generationContext:
      "Whiskey Lake vPro — a minor 8th Gen refresh. Found in the X1 Yoga 4th Gen. Same Kaby Lake Refresh architecture with vPro. Replaced by Comet Lake.",
    alternatives: [
      { name: "Intel Core i7-8550U", comparison: "Non-vPro variant — identical for consumer use" },
      { name: "Intel Core i7-10510U", comparison: "Comet Lake successor — modest single-core uplift" },
    ],
    architecture: "Whiskey Lake",
  },

  // AMD Ryzen PRO 5000 — used in L13 Yoga Gen 2/3 AMD
  "AMD Ryzen 5 PRO 5650U": {
    summary:
      "Zen 3 hex-core at 15W with Radeon Graphics. Strong multi-core for its power class. PRO branding includes AMD enterprise security features.",
    strengths: [
      "6 cores / 12 threads — good multi-core for 15W",
      "Zen 3 IPC is excellent",
      "AMD PRO security features for enterprise",
      "Strong open-source Linux driver stack",
    ],
    weaknesses: [
      "Radeon Graphics (Vega) iGPU is dated",
      "No Thunderbolt support",
      "DDR4 only in most implementations",
      "Aging in 2025 — Zen 4 and 5 offer better efficiency",
    ],
    bestFor: [
      "Budget AMD laptops for multi-tasking",
      "Linux users who want open-source drivers",
      "Enterprise fleets needing AMD PRO security",
      "Users upgrading from Intel 8th/10th Gen",
    ],
    avoidIf: [
      "Strong iGPU performance matters (Vega is weak)",
      "Thunderbolt docking is required",
      "You want the latest efficiency and features",
      "Budget allows for Ryzen 7000 PRO or newer",
    ],
    thermalNotes: "Cool at 15W. Zen 3 efficiency is good. Most L-series chassis handle it quietly.",
    generationContext:
      "Zen 3 PRO U-series. Strong IPC jump from Zen 2. Found in L13 Yoga Gen 2 AMD. Replaced by Ryzen PRO 5675U (minor refresh).",
    alternatives: [
      { name: "AMD Ryzen 7 PRO 5850U", comparison: "8 cores — ~20% faster multi-core" },
      { name: "Intel Core i5-1135G7", comparison: "Tiger Lake — better iGPU (Iris Xe) but fewer cores" },
    ],
    architecture: "Zen 3",
  },
  "AMD Ryzen 7 PRO 5850U": {
    summary:
      "Zen 3 octa-core at 15W. Excellent multi-threaded performance for a U-series chip. PRO features for enterprise deployment.",
    strengths: [
      "8 cores / 16 threads — top multi-core in its era",
      "Zen 3 IPC matches Intel Tiger Lake single-core",
      "AMD PRO security and manageability",
      "Excellent Linux support with amdgpu",
    ],
    weaknesses: [
      "Radeon Graphics (Vega) iGPU is dated vs Iris Xe",
      "No Thunderbolt",
      "DDR4 in most implementations",
      "Succeeded by faster, more efficient alternatives",
    ],
    bestFor: [
      "Multi-threaded workloads on a budget",
      "Linux development with open-source drivers",
      "Enterprise AMD deployments",
      "Used market buyers seeking strong multi-core",
    ],
    avoidIf: [
      "GPU performance matters — Vega iGPU is weak",
      "Thunderbolt is required",
      "Latest efficiency features are needed",
      "Budget reaches Ryzen PRO 7840U tier",
    ],
    thermalNotes:
      "Manageable at 15W despite 8 cores. Zen 3 efficiency is solid. Sustained loads may hit thermal limits in slim chassis.",
    generationContext:
      "Top Zen 3 PRO U-series. Found in L13 Yoga Gen 2 AMD. Excellent multi-core for its era. Replaced by Ryzen PRO 5875U (minor refresh).",
    alternatives: [
      { name: "AMD Ryzen 5 PRO 5650U", comparison: "6 cores — ~20% less multi-core but cooler" },
      { name: "Intel Core i7-1165G7", comparison: "Tiger Lake — better iGPU but far fewer cores" },
    ],
    architecture: "Zen 3",
  },
  "AMD Ryzen 5 PRO 5675U": {
    summary:
      "Zen 3 refresh with minor clock adjustments. Essentially the same as Ryzen 5 PRO 5650U with slightly different binning. Found in Gen 3 AMD variants.",
    strengths: [
      "Same Zen 3 strengths as 5650U",
      "Marginally higher clocks",
      "Proven, mature architecture",
      "Excellent Linux support",
    ],
    weaknesses: ["Negligible uplift over 5650U", "Same Vega iGPU limitations", "No Thunderbolt", "DDR4 only"],
    bestFor: [
      "Same use cases as 5650U — this is a rebinned part",
      "Budget AMD convertibles",
      "Linux users",
      "Enterprise AMD deployments",
    ],
    avoidIf: [
      "You are choosing between this and 5650U — they are nearly identical",
      "GPU performance matters",
      "Thunderbolt is needed",
      "Newer platforms are within budget",
    ],
    thermalNotes: "Identical to 5650U. Cool and quiet at 15W.",
    generationContext:
      "Zen 3 refresh for the L13 Yoga Gen 3 AMD. Minor binning difference from 5650U. Not a new architecture.",
    alternatives: [
      { name: "AMD Ryzen 5 PRO 5650U", comparison: "Essentially the same chip — ignore the naming" },
      { name: "AMD Ryzen 7 PRO 5875U", comparison: "8 cores for better multi-threaded performance" },
    ],
    architecture: "Zen 3",
  },
  "AMD Ryzen 7 PRO 5875U": {
    summary:
      "Zen 3 refresh octa-core. Minor clock adjustment over 5850U. Same strong multi-core performance and AMD PRO features.",
    strengths: [
      "8 cores / 16 threads",
      "Strong Zen 3 multi-core",
      "AMD PRO security features",
      "Excellent open-source driver support",
    ],
    weaknesses: [
      "Marginal improvement over 5850U",
      "Same Vega iGPU limitations",
      "DDR4, no Thunderbolt",
      "Replaced by newer, more efficient options",
    ],
    bestFor: [
      "Same use cases as 5850U",
      "Multi-threaded workloads on a budget",
      "Linux development",
      "AMD enterprise deployments",
    ],
    avoidIf: [
      "5850U is available cheaper — nearly identical",
      "GPU performance matters",
      "Latest platform features needed",
      "Budget reaches newer Ryzen PRO tiers",
    ],
    thermalNotes: "Same as 5850U. Manageable at 15W. Zen 3 octa-core stays cool in most chassis.",
    generationContext: "Zen 3 refresh for L13 Yoga Gen 3 AMD. Rebinned 5850U. Not a new architecture generation.",
    alternatives: [
      { name: "AMD Ryzen 7 PRO 5850U", comparison: "Essentially the same chip" },
      { name: "AMD Ryzen 5 PRO 5675U", comparison: "6 cores — cooler but less multi-core" },
    ],
    architecture: "Zen 3",
  },

  // AMD Ryzen PRO 7000 (Zen 3 rebrand) — used in L13 Yoga Gen 4 AMD
  "AMD Ryzen 5 PRO 7530U": {
    summary:
      "Zen 3 hex-core rebadged as Ryzen 7000. Despite the 7000-series name, this is Zen 3 architecture (not Zen 4). Solid but not a generational leap.",
    strengths: [
      "6 cores / 12 threads at 15W",
      "Proven Zen 3 architecture",
      "Good multi-core for light workloads",
      "Excellent Linux driver maturity",
    ],
    weaknesses: [
      "Zen 3 rebrand — not actual Zen 4 architecture",
      "Vega iGPU, not RDNA",
      "DDR4 in most implementations",
      "No Thunderbolt support",
    ],
    bestFor: [
      "Budget AMD laptops",
      "Users who don't need cutting-edge",
      "Linux users wanting proven drivers",
      "Basic office and development tasks",
    ],
    avoidIf: [
      "You expect Zen 4 performance from the 7000 name",
      "iGPU performance matters (Vega is dated)",
      "DDR5 or Thunderbolt is needed",
      "Budget allows genuine Zen 4 (Ryzen 8000 PRO)",
    ],
    thermalNotes: "Cool and quiet. Same Zen 3 thermal profile as the 5000 PRO series.",
    generationContext:
      "Zen 3 rebadge as Ryzen 7000 PRO. Confusing naming — no Zen 4. Found in L13 Yoga Gen 4 AMD. Replaced by genuine Zen 4 in Ryzen 8000 PRO.",
    alternatives: [
      { name: "AMD Ryzen 7 PRO 7730U", comparison: "8 cores — better multi-core at same power" },
      { name: "AMD Ryzen 5 PRO 5650U", comparison: "Same architecture — save money on used market" },
    ],
    architecture: "Zen 3",
  },
  "AMD Ryzen 7 PRO 7730U": {
    summary:
      "Zen 3 octa-core rebadged as Ryzen 7000. Strong multi-core despite being a Zen 3 rebrand. The last Zen 3 PRO chip before genuine Zen 4 arrived.",
    strengths: [
      "8 cores / 16 threads — strong multi-core",
      "Proven Zen 3 reliability",
      "AMD PRO security features",
      "Excellent Linux support",
    ],
    weaknesses: [
      "Zen 3 rebrand — misleading 7000-series naming",
      "Vega iGPU is dated",
      "DDR4 in most implementations",
      "No Thunderbolt",
    ],
    bestFor: [
      "Budget multi-threaded workloads",
      "Linux development with open-source AMD drivers",
      "Enterprise AMD fleets",
      "Users who need cores over cutting-edge features",
    ],
    avoidIf: [
      "Zen 4 performance is expected — this is Zen 3",
      "GPU performance matters at all",
      "DDR5 or modern connectivity needed",
      "Budget allows Ryzen PRO 8840U",
    ],
    thermalNotes: "Same as Ryzen 7 PRO 5850U. Zen 3 octa-core at 15W is well-managed.",
    generationContext:
      "Last Zen 3 PRO octa-core. Zen 3 peak performance at budget pricing. Found in L13 Yoga Gen 4 AMD. Succeeded by Zen 4 Ryzen PRO 8840U.",
    alternatives: [
      { name: "AMD Ryzen 5 PRO 7530U", comparison: "6 cores — cooler, less multi-core" },
      { name: "AMD Ryzen 7 PRO 5850U", comparison: "Same architecture at used-market pricing" },
    ],
    architecture: "Zen 3",
  },

  // === High-TDP H/HX-series (IdeaPad Pro / Legion) ===
  "Intel Core i7-12700H": {
    summary:
      "14-core (6P+8E) Alder Lake H-series at 45W TDP. Intel's first hybrid architecture in a high-performance mobile chip. Strong multi-threaded performance for 2022.",
    strengths: [
      "14 cores provide excellent multi-threaded throughput",
      "Strong single-core performance from P-cores",
      "Mature platform with broad driver and software support",
      "Good price-to-performance in the used market",
    ],
    weaknesses: [
      "45W base TDP demands robust cooling",
      "Intel 7 node runs hotter than AMD's competing N5 chips",
      "No NPU for AI acceleration",
      "Integrated UHD 770 is weak — paired GPU is essential",
    ],
    bestFor: [
      "Budget gaming laptops where dGPU handles graphics",
      "Software development with parallel builds",
      "Content creation with 4K editing",
      "Users who value mature ecosystem support",
    ],
    avoidIf: [
      "Battery life is critical — expect 4-5 hours max",
      "You need a thin-and-light form factor",
      "Fan noise is a concern for office environments",
    ],
    thermalNotes:
      "Requires dual-fan cooling systems. Throttles in thin chassis. Best in 16-inch or larger machines with adequate ventilation.",
    generationContext:
      "12th Gen Alder Lake H. Intel's first hybrid core architecture for performance laptops. Competes with AMD Ryzen 6000H series.",
    alternatives: [
      { name: "AMD Ryzen 7 6800H", comparison: "Similar multi-core, better integrated GPU, lower power draw" },
      { name: "Intel Core i7-13700H", comparison: "13th Gen successor — ~10% faster, same thermal profile" },
    ],
    architecture: "Alder Lake H",
  },

  "Intel Core i7-14700HX": {
    summary:
      "20-core (8P+12E) Raptor Lake Refresh HX at 55W TDP. Intel's high-end mobile workstation and gaming chip for 2024 with desktop-class core count.",
    strengths: [
      "20 cores deliver outstanding multi-threaded performance",
      "Strong single-core IPC from Raptor Lake architecture",
      "Excellent for heavy compilation, rendering, and simulation",
      "Wide motherboard support with DDR5",
    ],
    weaknesses: [
      "55W base TDP with 157W turbo is very power-hungry",
      "Requires aggressive cooling — chassis design is critical",
      "Battery life typically under 4 hours",
      "Integrated UHD 770 is negligible — must pair with dGPU",
    ],
    bestFor: [
      "Gaming laptops where sustained CPU performance matters",
      "Professional content creation and 3D rendering",
      "Software engineering with massive parallel builds",
      "Users who primarily use the laptop docked",
    ],
    avoidIf: [
      "You need any semblance of battery life",
      "Noise sensitivity — fans will be audible under load",
      "You're considering a slim or ultraportable design",
    ],
    thermalNotes:
      "Demands large chassis with dual-fan, multi-heatpipe cooling. Even in proper gaming chassis, sustained all-core loads will push 95°C+.",
    generationContext:
      "14th Gen Raptor Lake Refresh HX. Desktop-derived chip for mobile. Competes with AMD Ryzen 9 7945HX. Last Intel generation before Arrow Lake.",
    alternatives: [
      { name: "Intel Core i9-14900HX", comparison: "24 cores — ~15% faster multi-core, same thermal challenges" },
      { name: "AMD Ryzen 7 9755HX", comparison: "Zen 5 competitor — better efficiency, similar performance" },
    ],
    architecture: "Raptor Lake Refresh HX",
  },

  "Intel Core i9-13900HX": {
    summary:
      "24-core (8P+16E) Raptor Lake HX at 55W TDP. The highest core count mobile Intel chip of its generation. Designed for mobile workstation and high-end gaming use.",
    strengths: [
      "24 cores with industry-leading multi-threaded throughput",
      "Excellent single-core performance for gaming",
      "Desktop-class performance in a mobile package",
      "Strong ecosystem support for Intel 13th Gen",
    ],
    weaknesses: [
      "Extreme power consumption at 55W base, 157W turbo",
      "Severe thermal throttling likely in all but the largest chassis",
      "Very short battery life — 2-3 hours typical",
      "Expensive — primarily in premium gaming machines",
    ],
    bestFor: [
      "High-end gaming where CPU bottlenecks matter",
      "Professional 3D rendering and simulation",
      "Video production with complex timelines",
      "Desktop replacement users who rarely unplug",
    ],
    avoidIf: [
      "Portability or battery life matter at all",
      "Your workloads are GPU-bound — you won't use the CPU headroom",
      "Budget is a concern",
    ],
    thermalNotes:
      "The most thermally challenging mobile Intel chip. Requires large chassis with vapour chamber cooling. Expect sustained clock speeds 10-15% below turbo in real workloads.",
    generationContext:
      "13th Gen Raptor Lake HX. Desktop die transplant for mobile. Introduced 24 cores to mobile for the first time. Competes with AMD Ryzen 9 7945HX.",
    alternatives: [
      {
        name: "Intel Core i7-13700H",
        comparison: "14 cores — 30% less multi-core but much better thermals and battery",
      },
      { name: "Intel Core i9-14900HX", comparison: "Refresh with minor IPC gains and same core count" },
    ],
    architecture: "Raptor Lake HX",
  },

  "Intel Core i9-14900HX": {
    summary:
      "24-core (8P+16E) Raptor Lake Refresh HX at 55W TDP. The flagship mobile Intel chip for 2024. Marginal IPC improvement over the 13900HX with the same core layout.",
    strengths: [
      "24 cores for maximum multi-threaded performance",
      "Best single-core Intel mobile performance of its generation",
      "Slight IPC and frequency improvements over 13900HX",
      "Wide availability in premium gaming and workstation laptops",
    ],
    weaknesses: [
      "55W base / 157W turbo — extreme power draw",
      "Minimal improvement over 13900HX — not worth upgrading",
      "Battery life is a formality at 2-3 hours",
      "Thermal throttling inevitable without vapour chamber cooling",
    ],
    bestFor: [
      "New purchases of top-tier gaming or workstation laptops",
      "Users who need the absolute fastest mobile CPU",
      "Multi-threaded workloads like compilation and rendering",
    ],
    avoidIf: [
      "You already have a 13900HX — the improvement is <5%",
      "Portability or battery life matter",
      "Your workloads don't use more than 8 cores",
    ],
    thermalNotes:
      "Same thermal profile as 13900HX. Requires top-tier cooling. Only the largest 16-17 inch gaming chassis handle it properly.",
    generationContext:
      "14th Gen Raptor Lake Refresh HX. Last HX-class chip before Arrow Lake. A minor refresh rather than a new architecture.",
    alternatives: [
      { name: "Intel Core i7-14700HX", comparison: "20 cores — ~15% less multi-core but better thermals and value" },
      { name: "AMD Ryzen 9 8945HS", comparison: "Different class — 8 cores but much better efficiency and battery" },
    ],
    architecture: "Raptor Lake Refresh HX",
  },

  "Intel Core Ultra 7 275HX": {
    summary:
      "20-core Arrow Lake HX at 45W TDP. Intel's 2025 gaming and creator chip with improved power efficiency over Raptor Lake HX. Features Lion Cove P-cores and Skymont E-cores.",
    strengths: [
      "20 cores with improved IPC from Lion Cove architecture",
      "Better power efficiency than 14th Gen HX chips",
      "Integrated NPU for AI workloads",
      "DDR5-6400 support with faster memory subsystem",
    ],
    weaknesses: [
      "45W base TDP still demands robust cooling",
      "New platform — early BIOS and driver maturity concerns",
      "Integrated GPU still weak — relies on dGPU pairing",
      "Price premium as new-gen silicon",
    ],
    bestFor: [
      "New gaming laptop purchases in 2025",
      "Content creators who want AI-assisted workflows",
      "Users upgrading from 12th Gen or older",
      "Professional workloads benefiting from NPU acceleration",
    ],
    avoidIf: [
      "You have a 14700HX — the generational gain is modest",
      "Battery life is your priority — still a high-TDP chip",
      "You need proven platform maturity",
    ],
    thermalNotes:
      "Improved efficiency vs Raptor Lake HX, but still requires dual-fan cooling. Arrow Lake's power management is more granular, which helps partial-load scenarios.",
    generationContext:
      "Arrow Lake HX for mobile. Intel's 2025 high-performance mobile platform. Competes with AMD Ryzen AI 9 HX 370 and Ryzen 7 9755HX.",
    alternatives: [
      { name: "Intel Core Ultra 9 275HX", comparison: "24 cores — ~15% more multi-core for heavier workloads" },
      { name: "AMD Ryzen 7 9755HX", comparison: "Zen 5 competitor — strong efficiency, comparable performance" },
    ],
    architecture: "Arrow Lake HX",
  },

  "Intel Core Ultra 9 275HX": {
    summary:
      "24-core Arrow Lake HX at 45W TDP. Intel's flagship mobile gaming and workstation chip for 2025. Maximum core count with next-gen architecture.",
    strengths: [
      "24 cores — the most cores available in a mobile Intel chip",
      "Lion Cove P-cores deliver strong single-threaded performance",
      "Improved power efficiency over 14900HX",
      "NPU for emerging AI-accelerated applications",
    ],
    weaknesses: [
      "Premium pricing — only in top-tier machines",
      "Still high TDP — 4-5 hours battery typical",
      "Overkill for gaming where single-thread matters more",
      "Early platform with potential BIOS/driver quirks",
    ],
    bestFor: [
      "Flagship gaming laptops and mobile workstations",
      "Professional rendering, simulation, and compilation",
      "Future-proofing with maximum core count",
    ],
    avoidIf: [
      "Gaming is your only use case — the Ultra 7 275HX is better value",
      "Budget matters — the premium over Ultra 7 is significant",
      "You need excellent battery life",
    ],
    thermalNotes:
      "Demands the best cooling available. Large 16-17 inch chassis with vapour chamber recommended. Better than 14900HX thermals thanks to Arrow Lake efficiency, but still hot under sustained load.",
    generationContext:
      "Arrow Lake HX flagship. Intel's response to AMD Ryzen AI 9 HX 370. First Intel mobile chip with both high core count and integrated NPU.",
    alternatives: [
      { name: "Intel Core Ultra 7 275HX", comparison: "20 cores — 85% of the performance at lower cost and heat" },
      { name: "Intel Core i9-14900HX", comparison: "Previous gen — cheaper now, similar core count, worse efficiency" },
    ],
    architecture: "Arrow Lake HX",
  },

  "AMD Ryzen 7 6800H": {
    summary:
      "8-core Zen 3+ at 45W TDP. AMD's 2022 mainstream gaming chip with RDNA 2 integrated graphics. Strong single and multi-core performance with better efficiency than Intel 12th Gen H.",
    strengths: [
      "8 high-performance Zen 3+ cores",
      "Excellent Radeon 680M integrated GPU (RDNA 2)",
      "Better power efficiency than competing Intel 12700H",
      "6 nm process allows sustained boost clocks",
    ],
    weaknesses: [
      "Only 8 cores vs Intel's 14-core hybrids",
      "45W TDP still impacts battery life",
      "Zen 3+ is a minor refresh of Zen 3",
      "Less common in the Swiss market than Intel equivalents",
    ],
    bestFor: [
      "Gaming laptops where integrated GPU is a useful fallback",
      "Users who value power efficiency over maximum core count",
      "Content creation with good all-round performance",
    ],
    avoidIf: [
      "You need maximum multi-threaded throughput — Intel's 14-core chips are faster",
      "Ultra-portable form factor is required",
    ],
    thermalNotes:
      "Runs cooler than competing Intel H-series at the same performance level. 6 nm process helps with sustained workloads.",
    generationContext:
      "Ryzen 6000H (Rembrandt). Zen 3+ with RDNA 2 graphics on 6 nm. AMD's mainstream gaming competitor for 2022.",
    alternatives: [
      { name: "Intel Core i7-12700H", comparison: "More cores (14) but higher power draw and weaker iGPU" },
      { name: "AMD Ryzen 7 7735HS", comparison: "Rebadged refresh — nearly identical performance, newer branding" },
    ],
    architecture: "Zen 3+ (Rembrandt)",
  },

  "AMD Ryzen 7 7735HS": {
    summary:
      "8-core Zen 3+ at 35W TDP. A rebrand of the Ryzen 7 6800HS for the 2023 product cycle. Same silicon, same performance, new model number.",
    strengths: [
      "Proven Zen 3+ architecture with known reliability",
      "RDNA 2 integrated GPU (Radeon 680M) for light gaming",
      "35W TDP for better battery life than 45W H-series",
      "Available in well-priced mid-range machines",
    ],
    weaknesses: [
      "Not actually a new chip — Zen 3+ rebrand, not Zen 4",
      "8 cores lag behind Intel's 14-core hybrids in multi-thread",
      "Confusing naming (7000 series number but Zen 3+, not Zen 4)",
      "Limited to DDR5-4800 on most platforms",
    ],
    bestFor: [
      "Mid-range productivity and light gaming laptops",
      "Users who want a known-good platform at a fair price",
      "Balanced performance and battery life",
    ],
    avoidIf: ["You expect Zen 4 performance — this is Zen 3+", "Maximum multi-core throughput is needed"],
    thermalNotes:
      "35W TDP is manageable in most chassis. Runs cool and quiet under typical workloads. Gaming workloads will still spin fans.",
    generationContext:
      "Ryzen 7000 HS (Rembrandt-R). A confusing product — Zen 3+ silicon with a 7000-series model number. AMD's way of filling the mid-range in 2023.",
    alternatives: [
      { name: "AMD Ryzen 7 6800H", comparison: "Essentially the same chip at 45W — faster but hotter" },
      { name: "AMD Ryzen 7 7840HS", comparison: "Actual Zen 4 — meaningfully faster with RDNA 3 iGPU" },
    ],
    architecture: "Zen 3+ (Rembrandt-R)",
  },

  "AMD Ryzen 5 8645HS": {
    summary:
      "6-core Zen 4 at 35W TDP. AMD's mid-range Hawk Point chip with Ryzen AI branding. Good single-core performance with adequate multi-threading for mainstream use.",
    strengths: [
      "Strong single-core Zen 4 IPC",
      "Ryzen AI NPU for emerging AI workloads",
      "35W TDP provides good battery-life balance",
      "RDNA 3 integrated GPU (Radeon 760M)",
    ],
    weaknesses: [
      "Only 6 cores — lags in heavy multi-threaded tasks",
      "Radeon 760M is noticeably slower than 780M on 8-core variants",
      "Budget positioning limits pairing with premium displays/chassis",
    ],
    bestFor: [
      "Budget-conscious buyers who want modern architecture",
      "Mainstream productivity and light content creation",
      "Students and general-purpose users",
    ],
    avoidIf: [
      "Heavy multi-threaded workloads are common",
      "You need the best integrated GPU — step up to 8-core for 780M",
    ],
    thermalNotes: "Efficient 4 nm chip that runs cool in most chassis. Quiet operation under typical loads.",
    generationContext:
      "Ryzen 8000 HS (Hawk Point). Zen 4 refresh with Ryzen AI branding. Mid-range complement to the 8845HS.",
    alternatives: [
      {
        name: "AMD Ryzen 7 8845HS",
        comparison: "2 more cores and Radeon 780M — significantly better for ~15% more cost",
      },
      { name: "Intel Core Ultra 5 125H", comparison: "Intel competitor — more cores (14) but lower single-thread" },
    ],
    architecture: "Zen 4 (Hawk Point)",
  },

  "AMD Ryzen 7 8845HS": {
    summary:
      "8-core Zen 4 at 35W TDP. AMD's mainstream 2024 powerhouse with excellent single and multi-core performance, Radeon 780M iGPU, and Ryzen AI NPU.",
    strengths: [
      "8 fast Zen 4 cores with strong IPC",
      "Radeon 780M is the best non-discrete GPU available",
      "Ryzen AI NPU for on-device AI acceleration",
      "35W TDP balances performance and battery well",
    ],
    weaknesses: [
      "Essentially a Ryzen 7 7840HS refresh — minimal improvement",
      "RDNA 3 iGPU, while good, is still far from discrete GPUs",
      "NPU ecosystem is still immature",
    ],
    bestFor: [
      "All-round productivity machines",
      "Users who want the best iGPU without a discrete card",
      "Light gaming and creative work",
      "Professionals who need AI features starting to emerge",
    ],
    avoidIf: [
      "You already have a 7840HS — the upgrade is negligible",
      "You need discrete GPU performance for gaming or rendering",
    ],
    thermalNotes:
      "Very manageable thermals at 35W. Even sustained loads stay under 85°C in well-designed chassis. One of the best efficiency profiles in its class.",
    generationContext:
      "Ryzen 8000 HS (Hawk Point). The de facto standard AMD chip for 2024 premium laptops. Successor to the popular 7840HS.",
    alternatives: [
      { name: "AMD Ryzen 9 8945HS", comparison: "Same cores, higher clocks — 5-8% faster, not worth the premium" },
      { name: "AMD Ryzen 5 8645HS", comparison: "6 cores — saves cost but noticeably slower in multi-thread" },
    ],
    architecture: "Zen 4 (Hawk Point)",
  },

  "AMD Ryzen 9 8945HS": {
    summary:
      "8-core Zen 4 at 35W TDP. AMD's top Hawk Point chip with the highest boost clocks. Marginal improvement over the 8845HS — a binning upgrade rather than a new tier.",
    strengths: [
      "Highest boost clocks in the Hawk Point lineup",
      "Same excellent Radeon 780M iGPU and Ryzen AI NPU",
      "Slightly better sustained performance under load",
      "Prestige positioning in premium machines",
    ],
    weaknesses: [
      "Only 3-5% faster than 8845HS — poor value uplift",
      "Still 8 cores — no core count advantage",
      "Premium pricing for minimal gain",
      "Same 4 nm silicon — no architectural improvement",
    ],
    bestFor: [
      "Users buying premium machines where the CPU is bundled",
      "Workloads that benefit from every MHz of clock speed",
    ],
    avoidIf: [
      "You can choose the 8845HS instead — save the money for RAM or storage",
      "You expect a meaningful performance gap — there isn't one",
    ],
    thermalNotes:
      "Identical thermal profile to 8845HS. Higher boost clocks mean slightly more heat under burst loads, but sustained behaviour is the same.",
    generationContext:
      "Ryzen 8000 HS flagship (Hawk Point). A premium bin of the 8845HS silicon. AMD's top non-HX mobile chip for 2024.",
    alternatives: [
      { name: "AMD Ryzen 7 8845HS", comparison: "95% of the performance at lower cost — the smart choice" },
      { name: "Intel Core Ultra 7 155H", comparison: "Intel competitor — more cores (16) but lower single-thread IPC" },
    ],
    architecture: "Zen 4 (Hawk Point)",
  },

  "AMD Ryzen 7 9755HX": {
    summary:
      "8-core Zen 5 at 45W TDP. AMD's 2025 high-performance chip with the latest architecture. Significant IPC improvement over Zen 4 with better power efficiency.",
    strengths: [
      "Zen 5 delivers ~15% IPC improvement over Zen 4",
      "Strong single and multi-core performance",
      "Better power efficiency than Intel Arrow Lake HX",
      "RDNA 3.5 integrated GPU improvement",
    ],
    weaknesses: [
      "45W TDP still impacts battery life",
      "New architecture — early platform maturity concerns",
      "8 cores vs Intel's 20-24 core chips in pure multi-thread",
      "Premium launch pricing",
    ],
    bestFor: [
      "New gaming laptop purchases in 2025",
      "Users upgrading from Zen 3 or older",
      "Balanced gaming and productivity workloads",
      "Those who value AMD's superior power efficiency",
    ],
    avoidIf: [
      "You have Zen 4 — the improvement may not justify the cost",
      "You need maximum core count for professional rendering",
      "Budget is constrained — Zen 4 is now discounted",
    ],
    thermalNotes:
      "Improved 4 nm+ process helps thermals. Runs cooler than Intel HX equivalents at similar performance. Best in 16-inch chassis with dual fans.",
    generationContext:
      "Ryzen 9000 HX (Granite Ridge mobile). AMD's 2025 high-performance mobile platform. First Zen 5 chips for gaming laptops.",
    alternatives: [
      { name: "Intel Core Ultra 7 275HX", comparison: "More cores (20) but worse efficiency and higher heat" },
      { name: "AMD Ryzen 7 8845HS", comparison: "Previous gen — cheaper, 35W TDP, ~15% slower" },
    ],
    architecture: "Zen 5 (Granite Ridge)",
  },

  "AMD Ryzen AI 7 350": {
    summary:
      "8-core Zen 5 at 28W TDP. AMD's 2025 mainstream AI-focused processor for thin-and-light laptops. Pairs strong CPU performance with a capable NPU and RDNA 3.5 integrated graphics.",
    strengths: [
      "Zen 5 architecture with excellent IPC",
      "28W TDP for thin-and-light designs",
      "Enhanced NPU (XDNA 2) for AI workloads",
      "RDNA 3.5 iGPU is a meaningful upgrade over RDNA 3",
    ],
    weaknesses: [
      "New platform with limited real-world testing data",
      "8 cores — competitive but not class-leading in multi-thread",
      "NPU ecosystem still maturing in software support",
      "Premium positioning limits availability in budget machines",
    ],
    bestFor: [
      "Mainstream productivity with AI-enhanced workflows",
      "Thin-and-light laptop buyers who want modern architecture",
      "Light creative work and office productivity",
      "Users interested in on-device AI features",
    ],
    avoidIf: [
      "You need maximum multi-core for rendering — look at HX chips",
      "Your workloads have no AI component — the NPU goes unused",
      "Budget is primary — Zen 4 chips offer better value",
    ],
    thermalNotes:
      "28W TDP is comfortable for most slim chassis. Quiet operation expected under typical loads. Gaming will push thermals but remains manageable.",
    generationContext:
      "Ryzen AI 300 (Strix Point successor). AMD's 2025 mainstream mobile platform. Competes with Intel Core Ultra Series 2 (Lunar Lake) for thin-and-light dominance.",
    alternatives: [
      {
        name: "Intel Core Ultra 7 258V",
        comparison: "Lunar Lake competitor — similar class, different efficiency trade-offs",
      },
      {
        name: "AMD Ryzen 7 8845HS",
        comparison: "Previous gen — 35W with proven track record, ~10% slower single-thread",
      },
    ],
    architecture: "Zen 5 (Strix Point)",
  },
  "AMD Ryzen AI 7 PRO 350": {
    summary:
      "8-core Zen 5 PRO variant at 28W TDP. The enterprise/business counterpart to the consumer Ryzen AI 7 350 with AMD PRO security and manageability features. Same silicon with business-grade firmware and driver validation.",
    strengths: [
      "AMD PRO security — hardware-based memory encryption and secure boot",
      "Enterprise manageability via AMD DASH",
      "Same Zen 5 performance as consumer counterpart",
      "28W TDP for quiet thin-and-light operation",
    ],
    weaknesses: [
      "No performance advantage over consumer Ryzen AI 7 350",
      "PRO features only matter in managed enterprise environments",
      "NPU ecosystem still maturing",
      "New platform — expect early BIOS iterations",
    ],
    bestFor: [
      "IT-managed enterprise fleets (ThinkPad T/X series)",
      "Business users needing hardware-level security",
      "Professional productivity with AI-enhanced workflows",
      "Organisations requiring AMD PRO manageability",
    ],
    avoidIf: [
      "You are a consumer — the non-PRO variant is identical in performance",
      "Maximum multi-core is needed — look at HX chips",
      "Budget is primary — Zen 4 PRO chips offer similar features at lower cost",
    ],
    thermalNotes:
      "28W TDP identical to consumer variant. Quiet operation in ThinkPad chassis. Comfortable for sustained workloads without throttling.",
    generationContext:
      "Ryzen AI PRO 300 (Strix Point PRO). AMD's 2025 enterprise mobile platform for ThinkPad Gen 6 models. Direct competitor to Intel Core Ultra vPro for enterprise.",
    alternatives: [
      { name: "AMD Ryzen AI 7 350", comparison: "Consumer equivalent — identical performance, no PRO manageability" },
      { name: "AMD Ryzen 7 PRO 8840HS", comparison: "Previous gen PRO — proven platform, ~10% slower" },
    ],
    architecture: "Zen 5 (Strix Point PRO)",
  },
  "AMD Ryzen AI 5 PRO 340": {
    summary:
      "6-core Zen 5 PRO variant at 25W TDP. Entry-level enterprise AMD processor for 2025 ThinkPads. PRO security and manageability with modest multi-thread capability.",
    strengths: [
      "AMD PRO security and DASH manageability",
      "25W TDP for excellent battery life",
      "Zen 5 IPC improvements over previous generation",
      "Cost-effective enterprise option",
    ],
    weaknesses: [
      "6 cores limits multi-threaded workloads",
      "Lower performance tier — not for heavy creative work",
      "RDNA 3.5 iGPU (840M) is entry-level",
      "New platform — limited validation data",
    ],
    bestFor: [
      "Cost-conscious enterprise deployments",
      "Light office productivity and web workflows",
      "IT-managed fleets prioritising battery life",
      "Entry-level ThinkPad configurations",
    ],
    avoidIf: [
      "You compile code or run heavy multi-threaded workloads",
      "Integrated graphics performance matters — the 840M is basic",
      "You need more than 6 cores for concurrent workloads",
    ],
    thermalNotes:
      "25W TDP is very manageable. Silent operation under office loads. Even under stress, thin ThinkPad chassis can handle this comfortably.",
    generationContext:
      "Ryzen AI PRO 300 entry-level. AMD's 2025 budget enterprise processor. Replaces Ryzen 5 PRO 8540U in the ThinkPad lineup.",
    alternatives: [
      { name: "AMD Ryzen AI 7 PRO 350", comparison: "Higher tier — 8 cores and better iGPU for ~15% more performance" },
      { name: "AMD Ryzen 5 PRO 8540U", comparison: "Previous gen — proven, slightly lower single-thread" },
    ],
    architecture: "Zen 5 (Strix Point PRO)",
  },
  "AMD Ryzen AI 5 340": {
    summary:
      "6-core Zen 5 at 25W TDP. AMD's 2025 entry-level AI processor for consumer thin-and-light laptops. Pairs efficient CPU cores with XDNA 2 NPU and RDNA 3.5 integrated graphics.",
    strengths: [
      "Zen 5 IPC at an accessible price point",
      "25W TDP for thin-and-light battery life",
      "NPU (XDNA 2) for AI workloads",
      "Good enough for mainstream productivity",
    ],
    weaknesses: [
      "6 cores — limited multi-threaded headroom",
      "RDNA 3.5 iGPU (840M) is entry-level for gaming",
      "Less cache than higher-tier Ryzen AI 7",
      "NPU advantages depend on software support",
    ],
    bestFor: [
      "Budget IdeaPad Pro buyers wanting modern architecture",
      "Office productivity and web-based workflows",
      "Students and light content creators",
      "Users wanting basic AI features without premium pricing",
    ],
    avoidIf: [
      "You need strong multi-thread for rendering or compilation",
      "Integrated graphics gaming matters — the 840M is basic",
      "You want maximum NPU performance — the AI 7 350 is meaningfully better",
    ],
    thermalNotes:
      "25W TDP runs cool in most chassis. Quiet fan operation under typical loads. No thermal concerns for IdeaPad Pro form factors.",
    generationContext:
      "Ryzen AI 300 entry-level (Strix Point). AMD's 2025 budget consumer mobile processor. Pairs with Radeon 840M iGPU.",
    alternatives: [
      { name: "AMD Ryzen AI 7 350", comparison: "Higher tier — 8 cores, better iGPU, ~15% faster multi-thread" },
      { name: "Intel Core Ultra 5 225H", comparison: "Intel competitor — similar class with Arc iGPU" },
    ],
    architecture: "Zen 5 (Strix Point)",
  },
  "Intel Core Ultra 9 285H": {
    summary:
      "16-core Arrow Lake H at 45W TDP. Intel's 2025 flagship H-series mobile processor. 6 Performance + 8 Efficiency + 2 LP Efficiency cores with strong single-threaded leadership.",
    strengths: [
      "Best single-threaded Intel mobile performance in 2025",
      "16 cores for substantial multi-threaded capability",
      "Arc integrated graphics (140V) improved over Meteor Lake",
      "Intel Thread Director for efficient core scheduling",
    ],
    weaknesses: [
      "45W TDP — higher power draw than U-series",
      "Arrow Lake H is new — early BIOS maturity concerns",
      "Competes poorly with AMD HX chips in raw multi-thread",
      "Premium pricing for the H-series flagship",
    ],
    bestFor: [
      "IdeaPad Pro buyers wanting the fastest Intel H-series",
      "Mixed workloads — strong single-thread with decent multi-thread",
      "Content creators using Intel-optimised software",
      "Users who want an integrated GPU capable of light gaming",
    ],
    avoidIf: [
      "Maximum multi-core is the priority — AMD Ryzen 9 or HX chips are better",
      "Battery life is critical — the U-series is significantly more efficient",
      "You need a proven, stable platform — Arrow Lake H is first-gen",
    ],
    thermalNotes:
      "45W TDP requires good cooling. IdeaPad Pro chassis handles it but sustained all-core loads will push temps. Comfortable in 16-inch form factors.",
    generationContext:
      "Core Ultra 200H (Arrow Lake H). Intel's 2025 mainstream high-performance mobile. Competes with AMD Ryzen AI 7 350 in the consumer space.",
    alternatives: [
      { name: "Intel Core Ultra 7 255H", comparison: "Lower tier — 12 cores, slightly cheaper, similar single-thread" },
      { name: "AMD Ryzen AI 7 350", comparison: "AMD competitor — better efficiency, similar overall performance" },
    ],
    architecture: "Arrow Lake H",
  },
  "AMD Ryzen 7 260": {
    summary:
      "8-core Hawk Point rebrand at 35W TDP. Rebranded AMD Ryzen 7 8845HS for 2025 Legion gaming laptops. Same Zen 4 architecture with proven performance and driver maturity.",
    strengths: [
      "Proven Zen 4 architecture — no early-adoption risks",
      "8 cores / 16 threads with solid gaming performance",
      "Radeon 780M iGPU for battery-efficient desktop use",
      "Mature driver and BIOS support",
    ],
    weaknesses: [
      "Not a new architecture — Zen 4 rebrand of 8845HS",
      "No NPU — lacks AI acceleration features",
      "35W TDP is higher than Strix Point equivalent",
      "Zen 5 alternatives exist at similar pricing",
    ],
    bestFor: [
      "Legion 5 buyers who prioritise platform stability over cutting-edge",
      "Gamers who want proven, tested hardware",
      "Budget-conscious gaming laptop shoppers",
      "Users who value driver maturity over new features",
    ],
    avoidIf: [
      "You want the latest architecture — look at Zen 5 options",
      "AI/NPU features are important to you",
      "Maximum single-thread performance is the goal",
    ],
    thermalNotes:
      "35W TDP is standard for gaming laptops. Well-handled by Legion chassis cooling. Proven thermal profile from 8845HS heritage.",
    generationContext:
      "Hawk Point rebrand for 2025. Essentially a Ryzen 7 8845HS in new marketing. Used in Legion 5 Gen 10 as a cost-effective option.",
    alternatives: [
      { name: "AMD Ryzen 7 8845HS", comparison: "Identical silicon — same chip with different branding" },
      { name: "AMD Ryzen 7 9755HX", comparison: "Zen 5 alternative — newer architecture, ~10% faster multi-thread" },
    ],
    architecture: "Zen 4 (Hawk Point)",
  },
  "AMD Ryzen 5 240": {
    summary:
      "6-core Hawk Point rebrand at 32W TDP. Rebranded AMD Ryzen 5 8645HS for entry-level 2025 Legion gaming. Proven Zen 4 platform at budget pricing.",
    strengths: [
      "Proven Zen 4 architecture with mature drivers",
      "6 cores sufficient for current gaming titles",
      "32W TDP for reasonable battery life",
      "Budget-friendly entry point for Legion gaming",
    ],
    weaknesses: [
      "6 cores — limited headroom for multi-threaded workloads",
      "Zen 4 rebrand — no architectural improvements",
      "No NPU for AI features",
      "Radeon 760M iGPU is weaker than 780M in the Ryzen 7",
    ],
    bestFor: [
      "Budget Legion 5 configurations",
      "Gamers who primarily play with a discrete GPU",
      "Entry-level gaming laptop buyers",
      "Users who want proven, stable hardware at a low price",
    ],
    avoidIf: [
      "You multitask heavily while gaming (streaming, recording)",
      "Future-proofing matters — 6 cores is the minimum today",
      "You want AI/NPU features",
    ],
    thermalNotes:
      "32W TDP is very manageable in Legion chassis. Quiet operation under gaming loads when paired with dGPU. No throttling concerns.",
    generationContext:
      "Hawk Point rebrand for 2025 budget segment. Essentially a Ryzen 5 8645HS. Used in entry-level Legion 5 Gen 10 configurations.",
    alternatives: [
      { name: "AMD Ryzen 7 260", comparison: "Higher tier — 8 cores, better iGPU, ~15% more multi-thread" },
      { name: "AMD Ryzen 5 8645HS", comparison: "Identical silicon — same chip under different name" },
    ],
    architecture: "Zen 4 (Hawk Point)",
  },
  "Intel Core Ultra 7 265HX": {
    summary:
      "20-core Arrow Lake HX at 55W TDP. Intel's 2025 high-performance HX mobile processor for gaming and creative workstations. 8P + 12E cores with massive multi-threaded capability.",
    strengths: [
      "20 cores for extreme multi-threaded performance",
      "Strong single-threaded gaming performance",
      "55W sustained TDP with 157W boost",
      "Thunderbolt 4/5 support on HX platform",
    ],
    weaknesses: [
      "High power draw impacts battery life significantly",
      "Requires top-tier cooling — only for 16+ inch gaming chassis",
      "Arrow Lake HX is new — early platform maturity concerns",
      "Premium pricing — significant step up from H-series",
    ],
    bestFor: [
      "Legion Pro buyers wanting Intel's best multi-core",
      "Content creators who compile, render, and edit simultaneously",
      "Competitive gamers wanting maximum frame rates",
      "Desktop replacement workflows",
    ],
    avoidIf: [
      "Battery life matters — this is a plugged-in processor",
      "You need a portable machine — HX chassis are heavy",
      "Budget is a concern — H-series offers 80% of the performance at much lower cost",
    ],
    thermalNotes:
      "55-157W range demands serious cooling. Only viable in Legion-class chassis with dual-fan vapour chamber designs. Expect audible fan noise under sustained loads.",
    generationContext:
      "Core Ultra 200HX (Arrow Lake HX). Intel's 2025 desktop-replacement mobile platform. Competes with AMD Ryzen 9 9955HX for gaming laptop supremacy.",
    alternatives: [
      { name: "Intel Core Ultra 9 275HX", comparison: "Higher tier — more cores and higher boost clocks" },
      { name: "AMD Ryzen 7 9755HX", comparison: "AMD competitor — similar gaming, different multi-thread trade-offs" },
    ],
    architecture: "Arrow Lake HX",
  },
  "AMD Ryzen 9 9955HX": {
    summary:
      "16-core Zen 5 HX at 55W TDP. AMD's 2025 flagship gaming mobile processor. Maximum multi-threaded performance with Zen 5 IPC improvements over Zen 4.",
    strengths: [
      "16 cores / 32 threads — class-leading multi-threaded performance",
      "Zen 5 IPC improvements over Ryzen 9 7945HX",
      "Excellent for simultaneous gaming and content creation",
      "Mature AM5 platform compatibility",
    ],
    weaknesses: [
      "55W TDP — heavy power draw, requires good cooling",
      "Premium pricing — significant cost over Ryzen 7",
      "Diminishing returns over 8-core for pure gaming",
      "High sustained power draw kills battery life",
    ],
    bestFor: [
      "Legion Pro users needing maximum CPU performance",
      "Content creators who render while gaming",
      "Professional-grade multi-threaded workloads on the go",
      "Users who compile large codebases on their laptop",
    ],
    avoidIf: [
      "Pure gaming is the only use case — Ryzen 7 is nearly as fast",
      "Battery life matters — this is a plugged-in chip",
      "Budget is limited — 8-core Zen 5 offers better value",
    ],
    thermalNotes:
      "55W sustained with high boost demands top-tier cooling. Legion Pro chassis with vapour chamber handles it well. Expect audible fans under all-core loads.",
    generationContext:
      "Ryzen 9000 HX (Zen 5). AMD's 2025 flagship mobile gaming processor. Competes with Intel Core Ultra 9 275HX for the gaming laptop crown.",
    alternatives: [
      { name: "AMD Ryzen 7 9755HX", comparison: "Lower tier — 8 cores, significantly cheaper, ~80% of multi-thread" },
      {
        name: "Intel Core Ultra 9 275HX",
        comparison: "Intel competitor — more cores (24), different architecture trade-offs",
      },
    ],
    architecture: "Zen 5 (Granite Ridge HX)",
  },
  "AMD Ryzen 5 PRO 6650U": {
    summary:
      "6-core Zen 3+ PRO at 28W TDP. AMD's 2022 entry-level enterprise processor for ThinkPad T14/T14s Gen 3. Proven Rembrandt platform with RDNA 2 integrated graphics.",
    strengths: [
      "PRO security and manageability",
      "28W TDP for good battery life",
      "Proven Zen 3+ reliability",
      "Cost-effective enterprise option",
    ],
    weaknesses: [
      "Zen 3+ architecture — two generations behind current",
      "6 cores limits heavy multi-threading",
      "RDNA 2 iGPU weaker than RDNA 3",
      "DDR5 support varies by SKU",
    ],
    bestFor: [
      "Budget enterprise ThinkPad deployments",
      "Light office productivity",
      "IT-managed fleets with long refresh cycles",
    ],
    avoidIf: ["Modern performance matters — Zen 5 is 30%+ faster", "Integrated graphics gaming is expected"],
    thermalNotes: "28W TDP is comfortable for thin ThinkPad chassis. No thermal concerns.",
    generationContext:
      "Ryzen PRO 6000 (Rembrandt). AMD's 2022 enterprise mobile. Now two generations old — still serviceable but superseded by PRO 8000 and PRO AI 300.",
    alternatives: [{ name: "AMD Ryzen 7 PRO 6850U", comparison: "Higher tier — 8 cores, better iGPU" }],
    architecture: "Zen 3+ (Rembrandt)",
  },
  "AMD Ryzen 7 7730U": {
    summary:
      "8-core Zen 3 at 15W TDP. Consumer variant of AMD's Barcelo-R refresh. Proven architecture at budget pricing for entry-level ThinkPads.",
    strengths: [
      "8 cores at 15W — efficient multi-threading",
      "Proven Zen 3 architecture with mature drivers",
      "Budget-friendly",
      "Low power draw for good battery life",
    ],
    weaknesses: [
      "Zen 3 — two generations behind Zen 5",
      "15W limits sustained performance",
      "Older Vega iGPU",
      "No NPU for AI features",
    ],
    bestFor: [
      "Budget ThinkPad E-series configurations",
      "Light office productivity",
      "Students and basic business use",
    ],
    avoidIf: ["Performance matters — current gen is significantly faster", "Integrated graphics quality matters"],
    thermalNotes: "15W TDP runs cool in any chassis. Silent operation typical.",
    generationContext:
      "Barcelo-R refresh (Zen 3). Repackaged Ryzen 5000 series for 2023 budget segment. Used in ThinkPad E14 Gen 5.",
    alternatives: [{ name: "AMD Ryzen 5 7530U", comparison: "Lower tier — 6 cores, slightly cheaper" }],
    architecture: "Zen 3 (Barcelo-R)",
  },
  "AMD Ryzen 5 7640HS": {
    summary:
      "6-core Zen 4 at 35W TDP. AMD's 2023 mainstream H-series processor with RDNA 3 integrated graphics (Radeon 760M). Solid mid-tier gaming and productivity performance.",
    strengths: [
      "Zen 4 IPC with good single-thread",
      "RDNA 3 iGPU (760M) for light gaming",
      "35W TDP — reasonable battery life for H-series",
      "Good price-to-performance ratio",
    ],
    weaknesses: [
      "6 cores — limited multi-thread vs 8-core siblings",
      "35W TDP reduces battery life vs U-series",
      "Superseded by Zen 5 in 2025",
      "Radeon 760M weaker than 780M",
    ],
    bestFor: [
      "IdeaPad Pro 5 budget configurations",
      "Light gaming and content creation",
      "Users wanting Zen 4 at a lower price",
    ],
    avoidIf: [
      "Heavy multi-threading is needed — the 7840HS has 8 cores",
      "Maximum gaming iGPU performance matters — 780M is better",
    ],
    thermalNotes: "35W TDP manageable in IdeaPad Pro chassis. Moderate fan noise under load.",
    generationContext: "Phoenix (Zen 4). AMD's 2023 mainstream mobile. Pairs with Radeon 760M iGPU.",
    alternatives: [{ name: "AMD Ryzen 7 7840HS", comparison: "Higher tier — 8 cores, 780M iGPU, ~15% faster" }],
    architecture: "Zen 4 (Phoenix)",
  },
  "Intel Core i5-13500H": {
    summary:
      "12-core Raptor Lake H at 45W TDP. Intel's 2023 mainstream H-series with 4 P-cores + 8 E-cores. Solid productivity performance at a lower price than i7.",
    strengths: [
      "12 cores for good multi-threaded capability",
      "4 P-cores provide decent single-thread",
      "45W TDP with proven Raptor Lake platform",
      "Cost-effective Intel H-series option",
    ],
    weaknesses: [
      "4 P-cores limits peak single-thread vs i7",
      "45W TDP draws more than U-series",
      "13th gen — superseded by Core Ultra",
      "Iris Xe iGPU is basic",
    ],
    bestFor: [
      "IdeaPad Pro 5i budget configurations",
      "Office productivity with occasional heavier workloads",
      "Price-conscious Intel buyers",
    ],
    avoidIf: [
      "Maximum single-thread matters — the i7-13700H is faster",
      "Battery life is critical — U-series is more efficient",
    ],
    thermalNotes: "45W TDP requires decent cooling. IdeaPad Pro chassis handles it adequately.",
    generationContext: "13th Gen Raptor Lake H. Intel's 2023 mainstream H-series. Superseded by Core Ultra in 2024.",
    alternatives: [{ name: "Intel Core i7-13700H", comparison: "Higher tier — 6 P-cores, better single-thread" }],
    architecture: "Raptor Lake",
  },
  "Intel Core i5-14500HX": {
    summary:
      "14-core Raptor Lake Refresh HX at 55W TDP. Intel's 2024 mid-tier gaming HX processor. 6 P-cores + 8 E-cores for balanced gaming and multi-threaded workloads.",
    strengths: [
      "14 cores for strong multi-threading",
      "55W sustained for gaming performance",
      "HX platform with overclocking support",
      "Good value for gaming laptops",
    ],
    weaknesses: [
      "Raptor Lake Refresh — not a new architecture",
      "55W TDP impacts battery life",
      "6 P-cores vs 8 on i7-14700HX",
      "Requires robust cooling",
    ],
    bestFor: [
      "Mid-tier Legion gaming configurations",
      "Budget gaming laptop buyers",
      "Balanced gaming and productivity use",
    ],
    avoidIf: ["Maximum gaming performance needed — i7-14700HX is better", "Battery life matters"],
    thermalNotes: "55W TDP requires Legion-class cooling. Adequate thermal performance in gaming chassis.",
    generationContext:
      "14th Gen Raptor Lake Refresh HX. Intel's 2024 mid-tier gaming mobile. Used in Legion 5i and Pro 5i Gen 9.",
    alternatives: [{ name: "Intel Core i7-14700HX", comparison: "Higher tier — 20 cores, ~15% faster multi-thread" }],
    architecture: "Raptor Lake Refresh HX",
  },
  "Intel Core i7-14650HX": {
    summary:
      "16-core Raptor Lake Refresh HX at 55W TDP. Intel's 2024 upper-mid HX processor. 8 P-cores + 8 E-cores — strong balance of single-thread and multi-thread.",
    strengths: [
      "16 cores with 8 P-cores",
      "Strong single-threaded gaming performance",
      "Good balance of price and performance",
      "HX platform flexibility",
    ],
    weaknesses: [
      "Raptor Lake Refresh architecture",
      "55W TDP — battery life is limited",
      "Close to i7-14700HX — marginal savings",
      "Requires robust cooling",
    ],
    bestFor: [
      "Upper-mid Legion configurations",
      "Gamers wanting more than i5 but not i9 pricing",
      "Content creators on a budget",
    ],
    avoidIf: ["The i7-14700HX is only marginally more expensive", "Battery life is important"],
    thermalNotes: "55W TDP standard for HX. Legion chassis handles it well.",
    generationContext: "14th Gen Raptor Lake Refresh HX. Upper-mid tier for 2024 gaming laptops.",
    alternatives: [
      { name: "Intel Core i7-14700HX", comparison: "4 more cores, marginally faster for small price increase" },
    ],
    architecture: "Raptor Lake Refresh HX",
  },
  "Intel Core i7-13700HX": {
    summary:
      "16-core Raptor Lake HX at 55W TDP. Intel's 2023 gaming HX processor. 8 P-cores + 8 E-cores for strong gaming and multi-threaded workloads.",
    strengths: [
      "16 cores for excellent multi-threading",
      "8 P-cores for strong single-thread",
      "Proven 13th gen HX platform",
      "Now at attractive clearance pricing",
    ],
    weaknesses: [
      "13th gen — superseded by 14th gen",
      "55W TDP kills battery life",
      "Runs hot under sustained loads",
      "Heavy chassis required",
    ],
    bestFor: ["Clearance Legion Pro purchases", "Users wanting proven HX performance at reduced pricing"],
    avoidIf: ["14th gen HX is available at similar pricing", "Battery life or portability matter"],
    thermalNotes: "55W TDP demands good cooling. Legion Pro chassis with vapour chamber handles it.",
    generationContext: "13th Gen Raptor Lake HX. Intel's 2023 gaming HX. Superseded by 14th gen in 2024.",
    alternatives: [{ name: "Intel Core i7-14700HX", comparison: "Next gen — 4 more cores, ~10% faster" }],
    architecture: "Raptor Lake HX",
  },
  "Intel Core i5-12500H": {
    summary:
      "12-core Alder Lake H at 45W TDP. Intel's 2022 mainstream H-series with 4 P-cores + 8 E-cores. Aging but still serviceable for basic gaming and productivity.",
    strengths: [
      "12 cores at a budget price",
      "Proven Alder Lake platform",
      "Available at clearance pricing",
      "Adequate for 1080p gaming",
    ],
    weaknesses: [
      "2022 architecture — three generations old",
      "4 P-cores limits single-thread",
      "45W TDP for dated performance",
      "Iris Xe iGPU is weak",
    ],
    bestFor: ["Budget clearance Legion purchases", "Users where price is the primary concern"],
    avoidIf: ["Current performance expectations exist", "Longevity of the purchase matters"],
    thermalNotes: "45W TDP is standard. No thermal issues in any gaming chassis.",
    generationContext: "12th Gen Alder Lake H. Intel's 2022 H-series. Now three generations old.",
    alternatives: [{ name: "Intel Core i7-12700H", comparison: "Higher tier — 6 P-cores, ~15% faster" }],
    architecture: "Alder Lake H",
  },
};

/**
 * Curated GPU hardware guide — keyed by exact GPU name strings from gpu-benchmarks.ts.
 */
export const gpuGuide: Record<string, HardwareGuideEntry> = {
  "Intel UHD 620": {
    summary:
      "Legacy integrated GPU from 2017-era Intel. Barely functional for modern displays. Only found in older ThinkPad models.",
    strengths: [
      "Zero additional power draw",
      "Functional for basic 2D display output",
      "Supports dual external displays in most chassis",
      "Extremely well-supported across all operating systems",
    ],
    weaknesses: [
      "Cannot handle modern GPU-accelerated workloads",
      "Struggles with 4K display scaling",
      "No hardware video decode for modern codecs",
      "No gaming capability whatsoever",
    ],
    bestFor: [
      "Basic office display output",
      "Terminal and text-based workflows",
      "Legacy hardware that still works",
      "Users who never touch GPU-intensive tasks",
    ],
    avoidIf: [
      "You use any GPU-accelerated applications",
      "You connect to 4K external monitors",
      "Any gaming (even very casual) is desired",
      "You watch high-resolution video content regularly",
    ],
    thermalNotes: "Negligible heat output. Was designed for 15W TDP chips.",
    generationContext:
      "Intel Gen 9.5 graphics (Kaby Lake era). The last Intel iGPU before the Iris Xe generation leap. 7+ years old and showing every bit of its age.",
    alternatives: [
      {
        name: "Intel Iris Xe",
        comparison: "~3x more capable. Found in 12th/13th Gen — minimum recommended for modern use",
      },
      {
        name: "Intel Arc Graphics",
        comparison: "~3.5x more capable. Current-gen integrated GPU with hardware ray tracing",
      },
    ],
    architecture: "Intel Gen 9.5",
  },

  "AMD Radeon Graphics": {
    summary:
      "Generic AMD Vega-era integrated GPU found in Ryzen PRO 5000/7000 mobile chips. Positioned between Intel UHD 620 and Radeon 660M in capability. Adequate for basic tasks and very light gaming.",
    strengths: [
      "Better than Intel UHD 620 for GPU-accelerated tasks",
      "Good hardware video decode support",
      "Low power consumption as part of efficient Zen 3 SoC",
      "Solid open-source driver support (Mesa/AMDGPU)",
    ],
    weaknesses: [
      "Weaker than RDNA 2-based Radeon 660M/680M",
      "Limited gaming capability beyond casual titles",
      "Generic naming makes it hard to identify exact silicon revision",
      "Vega architecture is superseded by RDNA 2/3 in newer chips",
    ],
    bestFor: [
      "Office and productivity on L-series ThinkPads",
      "Linux users who value mature AMD open-source drivers",
      "Very light gaming (Stardew Valley, indie titles)",
      "Budget-conscious buyers on the used market",
    ],
    avoidIf: [
      "You need GPU performance beyond basic display output",
      "Any meaningful gaming is planned",
      "You use GPU-accelerated creative tools regularly",
      "You can stretch budget to a model with RDNA 2 graphics",
    ],
    thermalNotes:
      "Minimal thermal contribution as part of a 15W SoC. The Vega iGPU shares the thermal budget with CPU cores but rarely causes throttling under typical workloads.",
    generationContext:
      "AMD's Vega integrated graphics predates the RDNA 2 architecture used in Radeon 660M/680M. Found in Ryzen PRO 5000 (Cezanne) and rebadged Ryzen PRO 7000 (Barcelo-R) chips in budget L-series ThinkPads.",
    alternatives: [
      {
        name: "Intel UHD 620",
        comparison: "Slightly weaker Intel equivalent. Similar use cases but less capable at GPU decode",
      },
      {
        name: "AMD Radeon 660M",
        comparison: "RDNA 2 upgrade path — roughly 33% more capable with better gaming performance",
      },
      {
        name: "Intel Iris Xe",
        comparison: "Comparable Intel competitor from 12th/13th Gen — roughly similar performance",
      },
    ],
    architecture: "AMD Vega (GCN 5)",
  },

  "Intel Iris Xe": {
    summary:
      "Intel's first modern integrated GPU. A massive leap over UHD 620. Adequate for basic GPU tasks and light gaming.",
    strengths: [
      "Huge improvement over previous Intel iGPUs",
      "Hardware decode for modern video codecs",
      "Handles 4K display output comfortably",
      "Adequate for very light gaming",
    ],
    weaknesses: [
      "Surpassed by newer Arc-based Intel iGPUs",
      "Driver quality on Linux was initially problematic",
      "Limited VRAM (shared system memory)",
      "Struggles with GPU-accelerated creative workflows",
    ],
    bestFor: [
      "12th/13th Gen ThinkPad users with basic GPU needs",
      "Video playback and presentation work",
      "Casual gaming (Valorant, League at low settings)",
      "Multi-monitor office setups",
    ],
    avoidIf: [
      "You need GPU acceleration for creative tools",
      "Anything beyond the lightest gaming is desired",
      "You're choosing between Iris Xe and Arc — choose Arc",
      "Machine learning inference on GPU matters",
    ],
    thermalNotes:
      "Modest heat contribution. Integrated into the CPU die. Doesn't meaningfully impact overall chassis thermals.",
    generationContext:
      "Intel Gen 12 graphics. Introduced with 11th Gen Tiger Lake (2020). Used through 12th and 13th Gen. Replaced by Arc Graphics in Core Ultra.",
    alternatives: [
      { name: "Intel Arc Graphics", comparison: "~27% faster with hardware ray tracing — found in Meteor Lake" },
      { name: "AMD Radeon 680M", comparison: "~45% faster — AMD's RDNA 2 integrated GPU in Zen 3+ chips" },
    ],
    architecture: "Intel Xe-LP",
  },

  "Intel Arc Graphics": {
    summary:
      "Intel's Meteor Lake integrated GPU based on Xe-LPG architecture. Notable step up from Iris Xe with ray tracing support.",
    strengths: [
      "Hardware ray tracing capability",
      "Strong video encode/decode acceleration",
      "Good 4K multi-monitor support",
      "Competitive with AMD Radeon 740M",
    ],
    weaknesses: [
      "Linux driver maturity still improving",
      "Falls behind AMD Radeon 780M in graphics tests",
      "Shared system memory limits bandwidth",
      "Performance varies with memory speed",
    ],
    bestFor: [
      "Core Ultra users with moderate GPU needs",
      "Video playback and content consumption",
      "Light creative work (photo editing, basic video cuts)",
      "Casual gaming at 720p-1080p low settings",
    ],
    avoidIf: [
      "Linux GPU stability is critical to your workflow",
      "You need the strongest integrated graphics (choose AMD 780M)",
      "GPU compute workloads are part of your workflow",
      "Gaming at playable framerates matters",
    ],
    thermalNotes:
      "Integrated into the GPU tile in Meteor Lake's chiplet design. Minimal thermal impact beyond the CPU's normal power draw.",
    generationContext:
      "Xe-LPG architecture in Meteor Lake. Intel's first chiplet-based iGPU. Improving rapidly with driver updates, especially on Linux.",
    alternatives: [
      { name: "Intel Arc 140V", comparison: "Lunar Lake's improved Arc with better efficiency and performance" },
      { name: "AMD Radeon 780M", comparison: "Currently faster in most GPU benchmarks — found in Zen 4 chips" },
    ],
    architecture: "Intel Xe-LPG",
  },

  "Intel Arc 140V": {
    summary:
      "Lunar Lake's integrated Arc GPU — Intel's most powerful iGPU to date. On-package memory gives it a bandwidth advantage over competitors.",
    strengths: [
      "Strongest Intel integrated GPU available",
      "On-package LPDDR5x eliminates memory bandwidth bottleneck",
      "Hardware ray tracing and XeSS upscaling",
      "Excellent video encode/decode for creators",
    ],
    weaknesses: [
      "Only available in Lunar Lake (limited ThinkPad models)",
      "Still trails discrete GPUs significantly",
      "New platform — driver maturity developing",
      "On-package memory means no VRAM/RAM upgrade path",
    ],
    bestFor: [
      "Ultrabook users wanting the best Intel iGPU",
      "Light creative work without a discrete GPU",
      "Casual gaming at 1080p low-medium settings",
      "Users who value efficiency over discrete GPU power",
    ],
    avoidIf: [
      "Serious creative or 3D work (need discrete GPU)",
      "Proven driver stability is essential right now",
      "You need upgradeable memory",
      "Budget is tight (Meteor Lake iGPU is 80% of the way there for less)",
    ],
    thermalNotes:
      "Very efficient thanks to Lunar Lake's design. On-package memory reduces data movement energy. Cool operation even during GPU-heavy tasks.",
    generationContext:
      "Lunar Lake Xe2 architecture. Benefits enormously from on-package memory bandwidth. Represents Intel's integrated graphics peak for the current generation.",
    alternatives: [
      {
        name: "Intel Arc Graphics",
        comparison: "Meteor Lake version — ~20% slower but in more ThinkPad models and cheaper",
      },
      { name: "AMD Radeon 780M", comparison: "Comparable performance — trade-offs in specific workloads" },
    ],
    architecture: "Intel Xe2-LPG",
  },

  "AMD Radeon 660M": {
    summary:
      "Basic RDNA 2 integrated GPU found in budget Zen 3+ AMD chips. Adequate for display output and very light GPU tasks.",
    strengths: [
      "RDNA 2 architecture with hardware ray tracing",
      "Decent video decode acceleration",
      "Good Linux driver support via Mesa",
      "Low power draw",
    ],
    weaknesses: [
      "Limited execution units — basic GPU performance",
      "Falls behind 680M and 780M significantly",
      "Struggles with anything beyond basic 1080p gaming",
      "Found in older, budget-tier chips",
    ],
    bestFor: [
      "Basic display output and video playback",
      "Budget ThinkPad users who don't need GPU power",
      "Linux users wanting open-source AMD driver support",
      "Casual Valorant/League at 720p",
    ],
    avoidIf: [
      "Any meaningful GPU performance matters",
      "You game even casually at 1080p",
      "Creative workflows use GPU acceleration",
      "You can stretch to a 780M-equipped chip",
    ],
    thermalNotes: "Minimal thermal impact. Integrated and low-power.",
    generationContext:
      "RDNA 2 with 6 compute units. Found in Ryzen 5 7535U/HS and similar. Budget tier — the 680M and 780M are notably stronger.",
    alternatives: [
      { name: "AMD Radeon 740M", comparison: "~25% faster — found in newer Zen 4 Ryzen 5 chips" },
      { name: "AMD Radeon 780M", comparison: "~90% faster — the iGPU to aim for in AMD ThinkPads" },
    ],
    architecture: "RDNA 2",
  },

  "AMD Radeon 680M": {
    summary:
      "RDNA 2 integrated GPU with 12 compute units. The strongest iGPU of its generation — now superseded by RDNA 3's 780M.",
    strengths: [
      "Strong integrated GPU for its generation",
      "12 CUs provide good shader throughput",
      "Hardware ray tracing support",
      "Excellent open-source Linux drivers",
    ],
    weaknesses: [
      "Surpassed by RDNA 3 (780M) in newer chips",
      "Higher power draw than budget iGPUs",
      "Only found in older Zen 3+ Rembrandt chips",
      "RDNA 2 driver optimisation peaked — no more improvements",
    ],
    bestFor: [
      "Refurbished Zen 3+ ThinkPad users",
      "Light gaming at 720p-1080p low settings",
      "Users who want decent iGPU without discrete cost",
      "Linux users with open-source driver preference",
    ],
    avoidIf: [
      "You can get a 780M-equipped model instead",
      "GPU performance needs to last 3+ years",
      "You need ray tracing at playable framerates",
      "Creative workflows are GPU-dependent",
    ],
    thermalNotes:
      "Draws more power than budget iGPUs during GPU tasks. Manageable in ThinkPad chassis but contributes to overall thermal load.",
    generationContext:
      "RDNA 2 with 12 CUs — the high-end iGPU option in Zen 3+ Rembrandt. Was class-leading in 2022. Now superseded by RDNA 3's Radeon 780M.",
    alternatives: [
      { name: "AMD Radeon 780M", comparison: "~19% faster with RDNA 3 improvements — found in Zen 4 chips" },
      { name: "Intel Arc 140V", comparison: "Similar performance from Intel's Lunar Lake — competitive trade-off" },
    ],
    architecture: "RDNA 2",
  },

  "AMD Radeon 740M": {
    summary:
      "RDNA 3 mid-range iGPU found in Zen 4 Ryzen 5 chips. Decent improvement over the 660M but still budget-tier.",
    strengths: [
      "RDNA 3 efficiency improvements",
      "Better than previous-gen Radeon 660M",
      "Good Linux mesa driver support",
      "Adequate for casual gaming",
    ],
    weaknesses: [
      "Notably weaker than 780M found in Ryzen 7",
      "Only 4 RDNA 3 compute units",
      "Not enough for GPU-intensive creative work",
      "Budget positioning in the lineup",
    ],
    bestFor: [
      "Ryzen 5 users with basic GPU needs",
      "Casual gaming at 720p-1080p low",
      "Video playback and basic photo editing",
      "Budget builds where discrete GPU isn't justified",
    ],
    avoidIf: [
      "GPU performance is important — choose 780M variant",
      "Gaming at consistent framerates matters",
      "Creative workflows use GPU acceleration",
      "You can afford a Ryzen 7 model instead",
    ],
    thermalNotes: "Low power draw. No meaningful thermal contribution beyond normal CPU heat.",
    generationContext:
      "RDNA 3 with 4 compute units. The budget iGPU in Zen 4 Ryzen 5 chips. A clear step up from RDNA 2 660M but the 780M is the one to aim for.",
    alternatives: [
      { name: "AMD Radeon 780M", comparison: "~52% faster — found in Ryzen 7 chips, worth the upgrade" },
      { name: "Intel Arc Graphics", comparison: "Similar tier from Intel's Meteor Lake — competitive" },
    ],
    architecture: "RDNA 3",
  },

  "AMD Radeon 780M": {
    summary:
      "The king of integrated graphics. 12 RDNA 3 compute units deliver performance that approaches entry-level discrete GPUs. The iGPU to have.",
    strengths: [
      "Best integrated GPU available in any laptop",
      "Approaches NVIDIA MX-series discrete performance",
      "Excellent for 1080p low-medium gaming",
      "Outstanding Linux mesa driver support",
    ],
    weaknesses: [
      "Still can't match discrete GPUs for serious work",
      "Performance depends heavily on memory speed/bandwidth",
      "Only found in Ryzen 7 chips (premium pricing)",
      "Ray tracing technically supported but not practical",
    ],
    bestFor: [
      "Users wanting the best graphics without a discrete GPU",
      "Light-to-medium gaming at 1080p",
      "Creative work where iGPU acceleration helps (video decode, light editing)",
      "Linux users wanting the strongest open-source GPU",
    ],
    avoidIf: [
      "Serious creative/3D work (need discrete GPU)",
      "Gaming at medium-high settings consistently",
      "GPU compute workloads (ML training, rendering)",
      "Budget requires Ryzen 5 pricing — 740M is the fallback",
    ],
    thermalNotes:
      "Can generate noticeable heat during sustained GPU workloads. Ryzen 7 chips with 780M benefit from good chassis cooling. ThinkPad T14s and T14 handle it well.",
    generationContext:
      "RDNA 3 with 12 compute units. Found in Zen 4 Ryzen 7 chips (7840U/8840U/7840HS/8840HS). The high-water mark for integrated graphics performance.",
    alternatives: [
      { name: "Intel Arc 140V", comparison: "Intel's best iGPU — competitive but in fewer ThinkPad models" },
      { name: "NVIDIA RTX 500 Ada", comparison: "Entry-level discrete GPU — ~18% faster with dedicated VRAM" },
    ],
    architecture: "RDNA 3",
  },

  "NVIDIA RTX 500 Ada": {
    summary:
      "Entry-level Ada Lovelace discrete GPU with 4GB VRAM. Brings dedicated GPU memory and CUDA cores to thin workstation ThinkPads.",
    strengths: [
      "Dedicated 4GB VRAM — no shared memory bottleneck",
      "CUDA cores for GPU-accelerated workflows",
      "Hardware ray tracing and DLSS support",
      "Thin enough for 14-inch ThinkPad chassis",
    ],
    weaknesses: [
      "Only 4GB VRAM limits serious creative workloads",
      "Entry-level performance — don't expect high-end results",
      "Additional power draw impacts battery",
      "NVIDIA Linux drivers require proprietary blob",
    ],
    bestFor: [
      "Light CAD and 3D modelling",
      "CUDA-dependent workflows at entry level",
      "Users needing discrete GPU in a portable form factor",
      "Light gaming at medium settings",
    ],
    avoidIf: [
      "Serious 3D/rendering work (need RTX 3000+ Ada)",
      "4GB VRAM isn't enough for your datasets",
      "Linux with open-source drivers is preferred (choose AMD)",
      "Battery life is your top priority",
    ],
    thermalNotes:
      "Adds noticeable heat to the chassis. Thin ThinkPad designs manage it but fans will run more frequently. Battery impact is significant when GPU is active.",
    generationContext:
      "Ada Lovelace entry-level mobile. Replaces older T-series (T550) in workstation ThinkPads. DLSS and ray tracing bring modern GPU features to thin laptops.",
    alternatives: [
      { name: "AMD Radeon 780M", comparison: "Integrated GPU that's ~18% slower but no extra power/heat" },
      { name: "NVIDIA RTX 3000 Ada", comparison: "Much more capable discrete GPU for serious work" },
    ],
    architecture: "Ada Lovelace",
  },

  "NVIDIA RTX 3000 Ada": {
    summary:
      "Mid-range Ada Lovelace workstation GPU with 8GB VRAM. Serious creative and compute capability in a mobile form factor.",
    strengths: [
      "8GB VRAM handles professional workloads",
      "Strong CUDA performance for ML inference and rendering",
      "Excellent ray tracing and DLSS performance",
      "Professional ISV certification for CAD/BIM software",
    ],
    weaknesses: [
      "Significant power draw impacts battery (2-3 hours typical under GPU load)",
      "Generates substantial heat — needs robust cooling",
      "Only available in thicker workstation chassis",
      "NVIDIA proprietary drivers on Linux",
    ],
    bestFor: [
      "CAD, BIM, and professional 3D work",
      "ML inference and moderate training workloads",
      "Video editing and colour grading",
      "Professional gaming and content creation",
    ],
    avoidIf: [
      "You don't use GPU-accelerated applications",
      "Portability and battery life are primary concerns",
      "Open-source Linux GPU drivers are required",
      "Budget is constrained (adds significant cost to chassis)",
    ],
    thermalNotes:
      "Demands proper workstation cooling. ThinkPad P-series chassis with dual fans handle it well. Expect sustained fan noise during rendering or ML workloads. Throttles in inadequately cooled designs.",
    generationContext:
      "Ada Lovelace mobile workstation tier. The sweet spot for professional GPU work in a laptop. CUDA ecosystem makes it essential for ML/AI workflows.",
    alternatives: [
      { name: "NVIDIA RTX 5000 Ada", comparison: "~21% faster with 16GB VRAM — for the most demanding workloads" },
      { name: "NVIDIA RTX 500 Ada", comparison: "Entry-level — dramatically less capable but much thinner/lighter" },
    ],
    architecture: "Ada Lovelace",
  },

  "NVIDIA RTX 5000 Ada": {
    summary:
      "High-end Ada Lovelace workstation GPU with 16GB VRAM. The most powerful mobile GPU in the ThinkPad lineup for maximum professional capability.",
    strengths: [
      "16GB VRAM for large models and datasets",
      "Top-tier CUDA performance for ML and rendering",
      "Best mobile ray tracing performance available",
      "Professional ISV certifications across all major CAD/BIM tools",
    ],
    weaknesses: [
      "Very high power draw (80-110W+) destroys battery life",
      "Only fits in heaviest workstation chassis (2.5kg+)",
      "Generates significant heat requiring aggressive cooling",
      "Premium pricing across all configurations",
    ],
    bestFor: [
      "Large-scale ML training and inference",
      "Professional 3D rendering and animation",
      "Complex CAD assemblies and BIM projects",
      "Users who need the absolute maximum mobile GPU power",
    ],
    avoidIf: [
      "You ever work on battery",
      "Portability matters (heavy chassis only)",
      "Your workloads don't utilise GPU acceleration",
      "Budget is a consideration — the RTX 3000 Ada covers most needs",
    ],
    thermalNotes:
      "Requires the most aggressive cooling in the ThinkPad lineup. Dual-fan, thick chassis mandatory. Sustained loads will produce noticeable fan noise. Keep the power adapter connected for full performance.",
    generationContext:
      "Ada Lovelace top-tier mobile workstation. The pinnacle of NVIDIA's mobile GPU lineup. 16GB VRAM future-proofs for growing model sizes in ML/AI work.",
    alternatives: [
      {
        name: "NVIDIA RTX 3000 Ada",
        comparison: "~21% slower with half the VRAM — adequate for most professional needs at lower cost/weight",
      },
      {
        name: "NVIDIA RTX 500 Ada",
        comparison: "Entry-level — not comparable for serious work but vastly more portable",
      },
    ],
    architecture: "Ada Lovelace",
  },

  "NVIDIA T550": {
    summary:
      "Previous-gen Turing workstation GPU. Being phased out in favour of Ada Lovelace. Still functional for moderate professional workloads.",
    strengths: [
      "Dedicated VRAM for professional applications",
      "CUDA support for GPU-accelerated workflows",
      "ISV certified for professional software",
      "Proven stability over years of deployment",
    ],
    weaknesses: [
      "Previous generation — no DLSS or modern ray tracing",
      "Lower performance per watt than Ada Lovelace",
      "Being phased out of new ThinkPad configurations",
      "Turing architecture receiving fewer driver optimisations",
    ],
    bestFor: [
      "Refurbished workstation ThinkPad buyers",
      "Moderate CAD and 3D work",
      "CUDA workloads that don't need the latest features",
      "Budget-conscious professional GPU needs",
    ],
    avoidIf: [
      "Buying new — Ada Lovelace GPUs are strictly better",
      "You need DLSS or hardware ray tracing",
      "ML/AI workloads benefit from Ada's improvements",
      "Future driver support longevity matters",
    ],
    thermalNotes:
      "Moderate heat output. Previous-gen power efficiency means more heat per unit of performance than Ada Lovelace. ThinkPad P-series handles it adequately.",
    generationContext:
      "Turing architecture professional mobile GPU. The last generation before Ada Lovelace. Functional but clearly surpassed by RTX 500/3000/5000 Ada in every metric.",
    alternatives: [
      {
        name: "NVIDIA RTX 500 Ada",
        comparison: "Similar performance with modern features (DLSS, better ray tracing, lower power)",
      },
      { name: "NVIDIA RTX 3000 Ada", comparison: "Dramatically more capable — choose for serious professional work" },
    ],
    architecture: "Turing",
  },

  "NVIDIA RTX 1000 Ada": {
    summary:
      "Entry-level Ada Lovelace professional GPU with 6GB VRAM. Solid upgrade from integrated graphics for CAD, BIM, and light 3D work.",
    strengths: [
      "Dedicated GPU with 6GB GDDR6 VRAM",
      "Ada Lovelace architecture with hardware ray tracing",
      "CUDA cores for GPU-accelerated applications",
      "ISV-certified drivers for professional software",
    ],
    weaknesses: [
      "6GB VRAM limits large model and dataset handling",
      "Moderate gaming capability but not the focus",
      "Higher power draw than integrated-only configs",
      "RTX 2000 Ada offers significantly more headroom",
    ],
    bestFor: [
      "Engineers running SolidWorks/Creo/AutoCAD",
      "Architects using Revit or SketchUp",
      "Entry-level 3D modeling and visualization",
      "Users needing ISV-certified GPU drivers",
    ],
    avoidIf: [
      "Large 3D scenes exceed 6GB VRAM regularly",
      "Serious GPU rendering or ML training is needed",
      "Integrated graphics meet your needs — saves cost and battery",
      "Gaming is a primary use case",
    ],
    thermalNotes:
      "Manageable in P-series chassis. Adds noticeable heat and fan activity under GPU load. Battery life reduced vs integrated-only.",
    generationContext:
      "Entry Ada Lovelace professional mobile. Replaces RTX A500/T600 as the baseline discrete option. First Ada GPU accessible in slim workstation chassis.",
    alternatives: [
      {
        name: "NVIDIA RTX 500 Ada",
        comparison: "Lower tier with less VRAM — suitable only for the lightest professional GPU needs",
      },
      { name: "NVIDIA RTX 2000 Ada", comparison: "Significantly more capable for complex scenes and larger datasets" },
    ],
    architecture: "Ada Lovelace",
  },

  "NVIDIA RTX 2000 Ada": {
    summary:
      "Mid-range Ada Lovelace professional GPU with 8GB VRAM. Strong choice for mainstream professional visualization and moderate ML workloads.",
    strengths: [
      "8GB GDDR6 VRAM handles complex professional scenes",
      "Hardware ray tracing for realistic visualization",
      "Good CUDA core count for ML inference",
      "ISV-certified for all major professional applications",
    ],
    weaknesses: [
      "8GB still limits very large datasets or high-res renders",
      "Higher TDP impacts battery life noticeably",
      "Overkill if your work only needs basic 2D display output",
      "RTX 3000 Ada is significantly more capable for heavy work",
    ],
    bestFor: [
      "Professional engineers with mid-complexity 3D models",
      "Architects working on medium-scale BIM projects",
      "ML inference and light training workloads",
      "Data visualization with GPU acceleration",
    ],
    avoidIf: [
      "Datasets regularly exceed 8GB VRAM",
      "RTX 1000 Ada meets your professional GPU needs",
      "Battery life is more important than GPU power",
      "Heavy ML training — RTX 3000+ Ada or desktop is better",
    ],
    thermalNotes:
      "Significant heat output under GPU load. Requires adequate P-series cooling. Expect sustained fan activity during professional workloads.",
    generationContext:
      "Mainstream Ada Lovelace professional. Sits in the sweet spot for most mobile workstation users. Replaces RTX A2000.",
    alternatives: [
      {
        name: "NVIDIA RTX 1000 Ada",
        comparison: "Lower cost with less VRAM — sufficient for lighter professional work",
      },
      { name: "NVIDIA RTX 3000 Ada", comparison: "More VRAM and cores for complex scenes — worth it if budget allows" },
    ],
    architecture: "Ada Lovelace",
  },

  "NVIDIA GeForce RTX 4060 Laptop": {
    summary:
      "Consumer-grade Ada Lovelace laptop GPU with 8GB VRAM. Strong gaming and creative performance for ThinkPad P1/X1 Extreme configurations.",
    strengths: [
      "Excellent 1080p gaming performance",
      "DLSS 3 for AI-upscaled frame rates",
      "8GB GDDR6 VRAM for modern games",
      "Good video encoding/decoding acceleration",
    ],
    weaknesses: [
      "8GB VRAM insufficient for 4K gaming or large ML models",
      "Higher TDP significantly impacts battery life",
      "Not ISV-certified like professional RTX GPUs",
      "Generates substantial heat in workstation chassis",
    ],
    bestFor: [
      "Users wanting a gaming-capable workstation laptop",
      "Video editors needing GPU-accelerated encoding",
      "Creative professionals using Blender or DaVinci Resolve",
      "CUDA-dependent development workflows",
    ],
    avoidIf: [
      "Professional ISV certification is required",
      "Battery life is important — integrated GPU is vastly better",
      "Gaming isn't part of your use case",
      "You need more VRAM (RTX 4070 offers 8GB but more cores)",
    ],
    thermalNotes:
      "Heavy thermal load. Only viable in thick P1-class chassis. Expect loud fans under gaming/rendering loads. Battery life drops dramatically under GPU load.",
    generationContext:
      "Consumer Ada Lovelace for gaming laptops. Found in ThinkPad P1 Gen 7 as a GeForce option alongside professional RTX alternatives.",
    alternatives: [
      {
        name: "NVIDIA GeForce RTX 4070 Laptop",
        comparison: "More CUDA cores for ~15% higher gaming/rendering performance",
      },
      {
        name: "NVIDIA RTX 2000 Ada",
        comparison: "Professional variant — ISV-certified, similar performance, better driver stability for CAD",
      },
    ],
    architecture: "Ada Lovelace",
  },

  "NVIDIA GeForce RTX 4070 Laptop": {
    summary:
      "High-end consumer Ada Lovelace laptop GPU. Top-tier gaming and creative performance available in ThinkPad P1/X1 Extreme.",
    strengths: [
      "Excellent gaming performance at 1080p and 1440p",
      "DLSS 3 for significant AI-boosted frame rates",
      "Strong CUDA core count for rendering and ML",
      "Best consumer GPU option in the ThinkPad lineup",
    ],
    weaknesses: [
      "8GB VRAM can bottleneck at 4K or with very large models",
      "Highest power draw of any ThinkPad GPU option",
      "Not ISV-certified for professional software",
      "Significantly reduces battery life — plugged-in use recommended",
    ],
    bestFor: [
      "Gamers wanting a professional-class chassis",
      "Video editors and 3D artists needing maximum GPU power",
      "ML developers needing strong CUDA performance on the go",
      "Users who dock primarily and game occasionally",
    ],
    avoidIf: [
      "Professional ISV-certified drivers are required",
      "Mobile battery life matters",
      "RTX 4060 meets your gaming/creative needs",
      "You prefer a lighter, quieter laptop",
    ],
    thermalNotes:
      "Highest thermal output in ThinkPad GPU lineup. Needs the full P1 Gen 7 cooling solution. Loud under sustained GPU load. Desktop replacement rather than mobile use.",
    generationContext:
      "Top-tier consumer Ada Lovelace in mobile form. Available in ThinkPad P1 Gen 7 for users wanting maximum gaming/creative GPU without going desktop.",
    alternatives: [
      {
        name: "NVIDIA GeForce RTX 4060 Laptop",
        comparison: "15% lower performance but also lower heat/noise — adequate for most",
      },
      {
        name: "NVIDIA RTX 3000 Ada",
        comparison: "Professional alternative — ISV-certified, similar performance tier, better for CAD/BIM",
      },
    ],
    architecture: "Ada Lovelace",
  },

  "Intel Arc 130V": {
    summary:
      "Lower-tier Lunar Lake iGPU paired with Core Ultra 5 V-series processors. Slightly cut-down execution units compared to Arc 140V but retains on-package memory advantage.",
    strengths: [
      "On-package LPDDR5x for strong memory bandwidth",
      "Hardware ray tracing and XeSS upscaling support",
      "Excellent video encode/decode capability",
      "Very power-efficient — great for battery life",
    ],
    weaknesses: [
      "Fewer execution units than Arc 140V (~15% slower GPU)",
      "Only in lower-bin Lunar Lake SKUs",
      "New platform — driver maturity still developing",
      "On-package memory means no upgrade path",
    ],
    bestFor: [
      "Core Ultra 5 Lunar Lake buyers on a budget",
      "Light creative work and video editing",
      "Casual gaming at 720p–1080p low settings",
      "Battery-focused ultrabook users",
    ],
    avoidIf: [
      "You can afford the Arc 140V variant",
      "Gaming above very casual level matters",
      "You need discrete GPU-class performance",
      "Driver stability is critical for your workflow",
    ],
    thermalNotes:
      "Negligible additional heat — integrated into Lunar Lake tile. Slightly lower peak GPU temperatures than Arc 140V under sustained load.",
    generationContext:
      "Lunar Lake's entry-level iGPU. Same Xe2 architecture as Arc 140V but with fewer execution units. Paired with Core Ultra 5 226V/228V/236V processors.",
    alternatives: [
      { name: "Intel Arc 140V", comparison: "~15% faster GPU — paired with Core Ultra 7 V-series" },
      { name: "Intel Arc Graphics", comparison: "Meteor Lake iGPU — slightly slower but on proven platform" },
    ],
    architecture: "Lunar Lake Xe2",
  },

  "Intel Arc 130T": {
    summary:
      "Arrow Lake's mid-tier integrated GPU. Better than Meteor Lake's Arc Graphics but below Lunar Lake's Arc 140V. Paired with Arrow Lake U/H processors.",
    strengths: [
      "Improved over Meteor Lake Arc Graphics",
      "Hardware ray tracing and XeSS upscaling",
      "Good video encode/decode for productivity",
      "Available in more ThinkPad models than Lunar Lake iGPUs",
    ],
    weaknesses: [
      "Uses shared system memory — bandwidth-limited",
      "Below Arc 140V and Lunar Lake iGPUs in gaming",
      "Mid-tier positioning limits creative use",
      "Still an integrated GPU — no discrete-class performance",
    ],
    bestFor: [
      "Arrow Lake ThinkPad users with modest GPU needs",
      "Office and productivity workflows with occasional media tasks",
      "Casual gaming at 720p low settings",
      "Multi-monitor setups without creative work",
    ],
    avoidIf: [
      "Lunar Lake models with Arc 140V are available",
      "Any meaningful gaming is desired",
      "GPU-accelerated creative workflows are part of your work",
      "You need the best possible integrated graphics",
    ],
    thermalNotes:
      "Minimal thermal impact — integrated into Arrow Lake die. Shared thermal budget with CPU cores but GPU rarely reaches thermal limits.",
    generationContext:
      "Arrow Lake (Intel Core Ultra 200 series) integrated GPU. Xe-LPG+ evolution from Meteor Lake. Mid-point between Meteor Lake Arc Graphics and Lunar Lake Arc 140V.",
    alternatives: [
      { name: "Intel Arc 140T", comparison: "Arrow Lake's higher-tier iGPU — ~12% faster, paired with H-series" },
      { name: "Intel Arc 140V", comparison: "Lunar Lake's superior iGPU — ~18% faster with on-package memory" },
      { name: "Intel Arc Graphics", comparison: "Meteor Lake predecessor — ~7% slower but well-proven drivers" },
    ],
    architecture: "Arrow Lake Xe-LPG+",
  },

  "Intel Arc 140T": {
    summary:
      "Arrow Lake's top-tier integrated GPU. Best iGPU available in Arrow Lake H-series processors. Bridges the gap between Meteor Lake and Lunar Lake graphics.",
    strengths: [
      "Strongest Arrow Lake integrated GPU",
      "Hardware ray tracing and XeSS support",
      "Strong video encode/decode for media workloads",
      "Available in high-performance H-series ThinkPads",
    ],
    weaknesses: [
      "Still uses shared system memory",
      "Below Lunar Lake's Arc 140V in overall GPU performance",
      "H-series TDP means less battery life than U-series",
      "Not a substitute for discrete GPU in creative workflows",
    ],
    bestFor: [
      "Arrow Lake H-series ThinkPad users",
      "Productivity users who occasionally need GPU acceleration",
      "Light gaming at 720p–1080p low settings",
      "Users choosing Arrow Lake H over Lunar Lake for CPU multi-core",
    ],
    avoidIf: [
      "Maximum iGPU performance is key — Lunar Lake Arc 140V is better",
      "You need discrete-class GPU performance",
      "Battery life is paramount — U-series would be better",
      "Serious gaming or creative work is planned",
    ],
    thermalNotes:
      "Shares thermal envelope with H-series CPU. Under combined CPU+GPU load, thermal throttling is possible in slim chassis. P-series ThinkPads handle it better.",
    generationContext:
      "Arrow Lake H-series integrated GPU. Xe-LPG+ architecture with more execution units than Arc 130T. Intel's best non-Lunar Lake iGPU for 2025.",
    alternatives: [
      { name: "Intel Arc 140V", comparison: "Lunar Lake's top iGPU — ~10% faster with on-package memory advantage" },
      { name: "Intel Arc 130T", comparison: "Arrow Lake U-series variant — ~12% slower but better battery life" },
      { name: "AMD Radeon 780M", comparison: "AMD's RDNA 3 iGPU — similar tier, slightly faster in some benchmarks" },
    ],
    architecture: "Arrow Lake Xe-LPG+",
  },

  // === Discrete GPUs (Legion / IdeaPad Pro) ===
  "AMD Radeon 880M": {
    summary:
      "AMD's RDNA 3.5 integrated GPU found in Zen 5 processors. A step above the Radeon 780M with more compute units and architectural improvements. The best integrated GPU available in 2025.",
    strengths: [
      "Best-in-class integrated GPU performance",
      "RDNA 3.5 efficiency improvements over 780M",
      "Capable of 1080p gaming at low-medium settings",
      "No separate thermal budget — part of the APU",
    ],
    weaknesses: [
      "Still fundamentally integrated — nowhere near discrete GPUs",
      "Performance depends on system memory bandwidth (no dedicated VRAM)",
      "Limited to the APU's overall power budget",
      "Game compatibility can be inconsistent vs NVIDIA",
    ],
    bestFor: [
      "Thin-and-light laptops where a dGPU isn't available",
      "Casual gaming at 1080p low-medium settings",
      "Hardware-accelerated video encoding/decoding",
      "Users who want to avoid discrete GPU heat and cost",
    ],
    avoidIf: [
      "You want to play modern AAA titles at decent settings",
      "Professional GPU compute workloads are needed",
      "You need CUDA support (NVIDIA only)",
    ],
    thermalNotes:
      "Shares the APU thermal envelope. Under sustained GPU load, CPU clocks may reduce to stay within power limits. Dual-channel memory is essential for bandwidth.",
    generationContext:
      "RDNA 3.5 integrated GPU in Zen 5 APUs (Strix Point). Successor to the Radeon 780M. AMD continues to lead in integrated GPU performance.",
    alternatives: [
      { name: "AMD Radeon 780M", comparison: "Previous gen — ~15% slower but available in cheaper Zen 4 laptops" },
      { name: "Intel Arc 140V", comparison: "Intel's best iGPU — competitive performance, different driver ecosystem" },
    ],
    architecture: "RDNA 3.5",
  },

  "NVIDIA GeForce RTX 3050 Laptop": {
    summary:
      "Entry-level Ampere discrete GPU with 4 GB GDDR6. Bridges the gap between integrated graphics and proper gaming GPUs. Good for light gaming and GPU-accelerated workloads at a budget price point.",
    strengths: [
      "CUDA cores enable hardware-accelerated video editing and ML tasks",
      "DLSS 2.0 support helps in supported titles",
      "Significant step up from integrated graphics",
      "Low power draw (35-75W) keeps thermals manageable",
    ],
    weaknesses: [
      "Only 4 GB VRAM — limiting for modern titles at higher settings",
      "No DLSS 3 Frame Generation (Ampere limitation)",
      "Not enough power for consistent 1080p high-settings gaming",
      "Ampere generation — no Ada efficiency improvements",
    ],
    bestFor: [
      "Light gaming at 1080p medium settings",
      "CUDA-accelerated video editing on a budget",
      "Users who need a dGPU but don't want to pay for RTX 4050+",
      "IdeaPad Pro and ThinkPad users wanting occasional gaming",
    ],
    avoidIf: [
      "You want consistent 60 FPS at 1080p high settings",
      "VRAM-hungry workloads like AI/ML training",
      "You can stretch budget to RTX 4050 — much better value long-term",
    ],
    thermalNotes:
      "35-75W TGP depending on laptop. In thin chassis like IdeaPad Pro, typically runs at 35-50W with modest thermals. Not demanding to cool.",
    generationContext:
      "RTX 30 series Ampere (GA107). Entry-level discrete option. Succeeded by RTX 4050 Laptop which offers dramatically better performance and efficiency.",
    alternatives: [
      {
        name: "NVIDIA GeForce RTX 4050 Laptop",
        comparison: "~60% faster with DLSS 3 — strongly recommended if budget allows",
      },
      { name: "NVIDIA GeForce RTX 3060 Laptop", comparison: "~40% faster with 6 GB VRAM — better for serious gaming" },
      {
        name: "AMD Radeon 780M",
        comparison: "Integrated GPU approaching RTX 3050 in some benchmarks — no extra cost/power",
      },
    ],
    architecture: "Ampere (GA107)",
  },

  "AMD Radeon 760M": {
    summary:
      "RDNA 3 integrated GPU found in AMD Ryzen 5 7640HS and similar Zen 4 chips. A capable iGPU for light tasks but noticeably behind the Radeon 780M found in Ryzen 7 parts.",
    strengths: [
      "RDNA 3 architecture — efficient for integrated graphics",
      "Handles basic photo/video editing with hardware acceleration",
      "No extra power consumption or cooling requirements",
      "Adequate for older esports titles at low settings",
    ],
    weaknesses: [
      "~25% slower than Radeon 780M in Ryzen 7 chips",
      "Struggles with modern games even at lowest settings",
      "Shared system memory — no dedicated VRAM",
      "Limited compute unit count (6 CUs vs 12 CUs in 780M)",
    ],
    bestFor: [
      "Productivity laptops with no gaming ambition",
      "Users who prioritize battery life over GPU power",
      "Light esports (LoL, Valorant, CS2 at low settings)",
      "Budget-focused IdeaPad Pro and Legion configurations",
    ],
    avoidIf: [
      "Gaming is any priority — step up to Ryzen 7 for 780M or add a dGPU",
      "You need GPU-accelerated content creation",
      "Machine learning or AI workloads are planned",
    ],
    thermalNotes:
      "Shares the SoC thermal budget with the CPU. In Ryzen 5 7640HS laptops, the iGPU rarely thermal-throttles as its power draw is modest.",
    generationContext:
      "RDNA 3 integrated in Zen 4 Ryzen 5 mobile (Phoenix). The budget tier of AMD's iGPU lineup. The Radeon 780M in Ryzen 7 parts offers significantly more CUs and bandwidth.",
    alternatives: [
      { name: "AMD Radeon 780M", comparison: "~30% faster with double the CUs — found in Ryzen 7 7840HS/8845HS" },
      { name: "Intel Arc Graphics", comparison: "Intel's Meteor Lake iGPU — roughly comparable performance tier" },
      {
        name: "NVIDIA GeForce RTX 3050 Laptop",
        comparison: "Discrete GPU — ~40% faster with dedicated VRAM, but adds cost/power",
      },
    ],
    architecture: "RDNA 3",
  },

  "NVIDIA GeForce RTX 3060 Laptop": {
    summary:
      "Ampere-based discrete GPU with 6 GB GDDR6. The workhorse gaming GPU of 2022. Capable of 1080p high-settings gaming and decent 1440p at medium. Now well-priced in the used market.",
    strengths: [
      "6 GB VRAM handles most games at 1080p-1440p",
      "Strong rasterization performance for its class",
      "Good ray tracing capability with DLSS 2.0 support",
      "Mature drivers with years of optimization",
    ],
    weaknesses: [
      "Previous generation — no DLSS 3 Frame Generation",
      "6 GB VRAM can be limiting in newer titles at high textures",
      "80-115W TGP depending on chassis — performance varies",
      "Not as efficient as RTX 40 series",
    ],
    bestFor: [
      "Budget-conscious gamers buying used or discounted",
      "1080p gaming at high settings (60+ FPS)",
      "Content creation with CUDA acceleration",
      "Users who don't need the latest DLSS features",
    ],
    avoidIf: [
      "You want 4K gaming — VRAM and power are insufficient",
      "DLSS 3 Frame Generation is important to you",
      "Future-proofing for 2-3 years of new game releases",
    ],
    thermalNotes:
      "80-115W TGP range means performance varies significantly between laptop models. Check the specific chassis's power limit. Requires dual-fan cooling.",
    generationContext:
      "RTX 30 series Ampere (GA106). The most popular laptop GPU of its generation. Succeeded by RTX 4060 Laptop.",
    alternatives: [
      { name: "NVIDIA GeForce RTX 3070 Laptop", comparison: "~20% faster with 8 GB VRAM — better longevity" },
      { name: "NVIDIA GeForce RTX 4050 Laptop", comparison: "Next gen — similar raw performance but adds DLSS 3" },
    ],
    architecture: "Ampere (GA106)",
  },

  "NVIDIA GeForce RTX 3070 Laptop": {
    summary:
      "Ampere-based discrete GPU with 8 GB GDDR6. The sweet spot of the RTX 30 mobile lineup. Excellent 1080p and capable 1440p gaming with good ray tracing support.",
    strengths: [
      "8 GB VRAM — more future-proof than 6 GB options",
      "Strong 1080p and 1440p gaming performance",
      "Good ray tracing with DLSS 2.0",
      "Well-proven driver stack with broad game support",
    ],
    weaknesses: [
      "No DLSS 3 Frame Generation (Ampere limitation)",
      "80-125W TGP — large variance between laptops",
      "Previous generation with limited new stock",
      "Power hungry — impacts battery life significantly",
    ],
    bestFor: [
      "1440p gaming at medium-high settings",
      "Content creation (Premiere, DaVinci, Blender)",
      "Used market buyers looking for the best value/performance",
      "Users who prioritize VRAM over absolute FPS",
    ],
    avoidIf: [
      "You want the latest efficiency and DLSS 3",
      "Battery life matters when gaming",
      "Budget is very tight — the 3060 is close enough for 1080p",
    ],
    thermalNotes:
      "125W Max-Q variants need substantial cooling. Lower-TGP versions trade 10-15% performance for better thermals. Check the specific model's power limit.",
    generationContext:
      "RTX 30 series Ampere (GA104). The performance sweet spot of its generation. Competed with AMD RX 6700M.",
    alternatives: [
      { name: "NVIDIA GeForce RTX 3060 Laptop", comparison: "~20% slower, 6 GB VRAM — but significantly cheaper" },
      {
        name: "NVIDIA GeForce RTX 4060 Laptop",
        comparison: "Next gen — similar performance, much better efficiency and DLSS 3",
      },
    ],
    architecture: "Ampere (GA104)",
  },

  "NVIDIA GeForce RTX 4050 Laptop": {
    summary:
      "Ada Lovelace-based discrete GPU with 6 GB GDDR6. Entry-level RTX 40 series with DLSS 3 Frame Generation. Excellent efficiency makes it viable in thinner gaming machines.",
    strengths: [
      "DLSS 3 Frame Generation dramatically boosts perceived frame rates",
      "Excellent power efficiency — 35-115W TGP range",
      "Strong 1080p gaming at high settings",
      "AV1 hardware encoding for content creators",
    ],
    weaknesses: [
      "Only 6 GB VRAM — can be limiting at higher resolutions",
      "Entry-level positioning — not for 1440p high settings",
      "Wide TGP range means big performance variation between models",
      "Ray tracing is functional but not impressive at this tier",
    ],
    bestFor: [
      "Thin gaming laptops like Legion Slim",
      "1080p gaming with DLSS boosting to high frame rates",
      "Casual gamers who want ray tracing support",
      "Content creators who need CUDA without high power draw",
    ],
    avoidIf: [
      "1440p or 4K gaming is your target",
      "You need 8+ GB VRAM for future-proofing",
      "Maximum ray tracing quality matters",
    ],
    thermalNotes:
      "At 35W it can fit in surprisingly thin machines. At 115W it approaches RTX 3070 performance. Always check the specific laptop's TGP rating.",
    generationContext:
      "RTX 40 series Ada Lovelace (AD107). Entry-level Ada GPU for laptops. The efficiency leader of its class.",
    alternatives: [
      {
        name: "NVIDIA GeForce RTX 4060 Laptop",
        comparison: "~30% faster with 8 GB VRAM — the better buy if available",
      },
      {
        name: "NVIDIA GeForce RTX 3060 Laptop",
        comparison: "Similar raw performance but no DLSS 3 — cheaper on used market",
      },
    ],
    architecture: "Ada Lovelace (AD107)",
  },

  "NVIDIA GeForce RTX 4080 Laptop": {
    summary:
      "Ada Lovelace-based discrete GPU with 12 GB GDDR6. The high-end mobile gaming GPU with excellent 1440p and capable 4K performance. DLSS 3 makes it a generational leap.",
    strengths: [
      "12 GB VRAM — ample for 1440p and 4K gaming",
      "Exceptional 1440p performance at max settings",
      "DLSS 3 Frame Generation for 100+ FPS at high resolutions",
      "Professional-grade CUDA performance for content creation",
    ],
    weaknesses: [
      "High TGP (60-150W) demands the best laptop cooling",
      "Expensive — only in premium gaming machines",
      "Diminishing returns over RTX 4070 for most games",
      "Heavy machines — expect 2.5+ kg chassis",
    ],
    bestFor: [
      "Enthusiast gamers targeting 1440p 144Hz+",
      "4K gaming with DLSS assistance",
      "Professional video editing and 3D rendering",
      "Desktop replacement gaming setups",
    ],
    avoidIf: [
      "1080p is your target resolution — massively overkill",
      "Portability matters — these are heavy machines",
      "Budget is a consideration — RTX 4070 covers 95% of use cases",
    ],
    thermalNotes:
      "Requires premium cooling solutions — vapour chamber preferred. At full 150W TGP, surface temperatures will be high. Gaming on battery is inadvisable.",
    generationContext:
      "RTX 40 series Ada Lovelace (AD104). Second-highest Ada mobile GPU. Positioned between RTX 4070 and the desktop-replacement RTX 4090.",
    alternatives: [
      { name: "NVIDIA GeForce RTX 4070 Laptop", comparison: "~25% slower but much better value and availability" },
      {
        name: "NVIDIA GeForce RTX 5070 Laptop",
        comparison: "Next gen — similar tier with better efficiency and DLSS 4",
      },
    ],
    architecture: "Ada Lovelace (AD104)",
  },

  "NVIDIA GeForce RTX 5070 Laptop": {
    summary:
      "Blackwell-based discrete GPU with 8 GB GDDR7. NVIDIA's 2025 mainstream high-performance laptop GPU. Features DLSS 4 with Multi Frame Generation and improved ray tracing.",
    strengths: [
      "DLSS 4 Multi Frame Generation for massive FPS gains",
      "GDDR7 memory for higher bandwidth",
      "Blackwell architecture brings significant efficiency gains",
      "Strong 1440p performance rivalling last-gen RTX 4080",
    ],
    weaknesses: [
      "Only 8 GB VRAM — same as RTX 4070",
      "New architecture — early driver maturity",
      "Premium pricing at launch",
      "DLSS 4 dependency for competitive frame rates",
    ],
    bestFor: [
      "New gaming laptop purchases in 2025",
      "1440p high refresh rate gaming",
      "Ray tracing enthusiasts who want generational improvement",
      "Content creators needing current-gen CUDA features",
    ],
    avoidIf: [
      "RTX 4070 laptops are available at significant discounts",
      "You need more than 8 GB VRAM for professional work",
      "Driver maturity is critical for your workflow",
    ],
    thermalNotes:
      "Blackwell's efficiency improvements mean better performance-per-watt than Ada. Expect cooler and quieter operation at equivalent performance levels.",
    generationContext:
      "RTX 50 series Blackwell. NVIDIA's 2025 mobile GPU architecture. Competes with AMD RDNA 4 mobile (when available).",
    alternatives: [
      { name: "NVIDIA GeForce RTX 4070 Laptop", comparison: "Previous gen — cheaper, 8 GB VRAM, proven drivers" },
      {
        name: "NVIDIA GeForce RTX 5080 Laptop",
        comparison: "Higher tier — more cores and VRAM for ~30% more performance",
      },
    ],
    architecture: "Blackwell",
  },

  "NVIDIA GeForce RTX 5080 Laptop": {
    summary:
      "Blackwell-based discrete GPU with 16 GB GDDR7. NVIDIA's flagship 2025 mobile GPU. Maximum performance with DLSS 4, ample VRAM, and next-gen ray tracing.",
    strengths: [
      "16 GB GDDR7 — future-proof for high-resolution gaming and professional work",
      "DLSS 4 Multi Frame Generation for extreme frame rates",
      "Best mobile ray tracing performance available",
      "Professional-grade CUDA performance",
    ],
    weaknesses: [
      "Flagship pricing — only in the most expensive machines",
      "High TGP demands top-tier cooling solutions",
      "Diminishing returns over RTX 5070 for most games",
      "Heavy chassis required — portability is minimal",
    ],
    bestFor: [
      "Enthusiast gamers wanting the absolute best mobile GPU",
      "4K gaming with ray tracing and DLSS",
      "Professional 3D rendering and ML training",
      "Desktop replacement setups with external displays",
    ],
    avoidIf: [
      "1080p or 1440p is your target — RTX 5070 is more than enough",
      "Budget matters — the price premium over 5070 is large",
      "You need a portable machine",
    ],
    thermalNotes:
      "Demands the best cooling available. Large 16-17 inch chassis with vapour chamber are the minimum. Even with Blackwell efficiency gains, sustained gaming will push thermals.",
    generationContext:
      "RTX 50 series Blackwell flagship mobile. The most powerful laptop GPU NVIDIA offers in 2025. Positions above RTX 5070 and below any future RTX 5090 mobile.",
    alternatives: [
      {
        name: "NVIDIA GeForce RTX 5070 Laptop",
        comparison: "~30% slower but significantly cheaper and more available",
      },
      { name: "NVIDIA GeForce RTX 4080 Laptop", comparison: "Previous gen — cheaper now, 12 GB VRAM, proven platform" },
    ],
    architecture: "Blackwell",
  },
  "AMD Radeon 840M": {
    summary:
      "RDNA 3.5 integrated graphics in entry-level Ryzen AI 5 processors. Basic iGPU for desktop compositing, video playback, and light productivity. Not designed for gaming.",
    strengths: [
      "Zero additional power draw — shares CPU TDP",
      "RDNA 3.5 architecture with improved efficiency over RDNA 3",
      "Sufficient for 4K video playback and desktop compositing",
      "AV1 hardware decode support",
    ],
    weaknesses: [
      "Entry-level iGPU — not viable for gaming beyond casual titles",
      "Limited compute units compared to 860M",
      "No dedicated VRAM — shares system memory",
      "Significantly slower than any discrete GPU option",
    ],
    bestFor: [
      "Business laptops where gaming is irrelevant",
      "Battery-efficient desktop use and video conferencing",
      "Office productivity without discrete GPU cost/weight",
      "Multi-monitor desktop setups via USB-C/DisplayPort",
    ],
    avoidIf: [
      "Any gaming beyond web/casual games is expected",
      "You need GPU compute for AI/ML workloads",
      "Photo or video editing with GPU acceleration",
    ],
    thermalNotes:
      "Negligible thermal impact — shares CPU thermal envelope. Silent operation is typical. No dedicated cooling required.",
    generationContext:
      "RDNA 3.5 entry-level iGPU in Ryzen AI 300 (Strix Point). Pairs with Ryzen AI 5 340 / Ryzen AI 5 PRO 340. Replaces Radeon 740M.",
    alternatives: [
      {
        name: "AMD Radeon 860M",
        comparison: "Higher tier iGPU — more compute units, meaningfully better for light gaming",
      },
      { name: "Intel Arc Graphics (Lunar Lake)", comparison: "Intel equivalent — similar class integrated graphics" },
    ],
    architecture: "RDNA 3.5",
  },
  "AMD Radeon 860M": {
    summary:
      "RDNA 3.5 integrated graphics in mainstream Ryzen AI 7 processors. Improved iGPU capable of light 1080p gaming and solid multimedia performance. The best AMD iGPU for 2025 thin-and-light laptops.",
    strengths: [
      "RDNA 3.5 with more compute units than 840M",
      "Viable for light 1080p gaming at low-medium settings",
      "Excellent for multimedia and video editing acceleration",
      "No discrete GPU weight or power penalty",
    ],
    weaknesses: [
      "Still integrated graphics — no substitute for a discrete GPU",
      "Shares system memory bandwidth — DDR5 speed matters",
      "Cannot run AAA titles at playable frame rates",
      "No dedicated VRAM for GPU-heavy creative workloads",
    ],
    bestFor: [
      "Thin-and-light users who occasionally game",
      "Business laptops where light gaming is a bonus",
      "Video conferencing and multimedia consumption",
      "Battery-efficient operation without dGPU power draw",
    ],
    avoidIf: [
      "You plan to play AAA games regularly",
      "GPU compute for ML/AI training is needed",
      "Professional GPU-accelerated workflows (3D rendering, video production)",
    ],
    thermalNotes:
      "Shares CPU thermal envelope at 28W TDP. Negligible additional heat. Thin-and-light chassis handle it without issue.",
    generationContext:
      "RDNA 3.5 mainstream iGPU in Ryzen AI 300 (Strix Point). Pairs with Ryzen AI 7 350 / Ryzen AI 7 PRO 350. Replaces Radeon 780M with architectural improvements.",
    alternatives: [
      { name: "AMD Radeon 840M", comparison: "Lower tier — fewer compute units, basic iGPU" },
      {
        name: "NVIDIA GeForce RTX 5050 Laptop",
        comparison: "Discrete GPU — dramatically faster but adds weight, cost, and power draw",
      },
    ],
    architecture: "RDNA 3.5",
  },
  "NVIDIA GeForce RTX 5050 Laptop": {
    summary:
      "Entry-level Blackwell discrete GPU with 8 GB GDDR7. NVIDIA's most affordable 2025 mobile GPU. DLSS 4 support makes it viable for 1080p gaming with ray tracing. Good for budget gaming laptops and light creative work.",
    strengths: [
      "DLSS 4 Multi Frame Generation at the entry level",
      "8 GB GDDR7 — sufficient for 1080p and 1440p gaming",
      "Blackwell efficiency improvements over Ada Lovelace",
      "Ray tracing support for modern titles",
    ],
    weaknesses: [
      "Entry-level discrete — limited headroom for future AAA titles",
      "Similar rasterisation to RTX 4060 despite being newer",
      "8 GB VRAM may constrain future games at higher settings",
      "DLSS dependence for competitive frame rates in demanding titles",
    ],
    bestFor: [
      "Budget gaming laptop buyers who want ray tracing",
      "1080p gamers who play competitive titles at high frame rates",
      "Students who want gaming capability without premium pricing",
      "IdeaPad Pro or Legion 5 entry-level configurations",
    ],
    avoidIf: [
      "1440p or 4K gaming is the target — RTX 5060 or higher needed",
      "Heavy ray tracing workloads — this is the minimum viable tier",
      "Professional creative workflows that demand VRAM",
    ],
    thermalNotes:
      "Low TGP makes it comfortable in thinner chassis. IdeaPad Pro and entry-level Legion cooling is sufficient. Quiet operation at moderate loads.",
    generationContext:
      "RTX 50 series Blackwell entry-level. Replaces RTX 4050 Laptop. Performance similar to RTX 4060 with better efficiency and DLSS 4.",
    alternatives: [
      {
        name: "NVIDIA GeForce RTX 5060 Laptop",
        comparison: "~30% faster with more VRAM — the sweet spot for most gamers",
      },
      {
        name: "NVIDIA GeForce RTX 4060 Laptop",
        comparison: "Previous gen — similar rasterisation, now at clearance pricing",
      },
    ],
    architecture: "Blackwell",
  },
  "NVIDIA GeForce RTX 5060 Laptop": {
    summary:
      "Mid-range Blackwell discrete GPU with 8 GB GDDR7. The 2025 sweet-spot GPU for gaming laptops. DLSS 4 enables excellent 1440p gaming with ray tracing. Strong upgrade over RTX 4060.",
    strengths: [
      "Excellent 1440p gaming performance with DLSS 4",
      "~30% faster than RTX 4060 in rasterisation",
      "DLSS 4 Multi Frame Generation for competitive frame rates",
      "Good ray tracing performance at 1080p/1440p",
    ],
    weaknesses: [
      "8 GB VRAM may become a bottleneck at 4K",
      "Higher TGP than RTX 5050 — needs adequate cooling",
      "4K gaming still requires DLSS upscaling",
      "Mid-range — not for professional GPU compute workloads",
    ],
    bestFor: [
      "The majority of gaming laptop buyers — best value in 2025",
      "1440p gaming with ray tracing at high settings",
      "Competitive gaming at very high frame rates (1080p)",
      "Legion 5 and IdeaPad Pro buyers wanting strong GPU value",
    ],
    avoidIf: [
      "Native 4K gaming without DLSS is the goal",
      "You need maximum GPU compute for ML training",
      "Budget is very tight — RTX 5050 is significantly cheaper",
    ],
    thermalNotes:
      "Moderate TGP — comfortable in Legion chassis, manageable in thinner IdeaPad Pro designs with some thermal throttling. 16-inch chassis recommended.",
    generationContext:
      "RTX 50 series Blackwell mid-range. Replaces RTX 4060 Laptop as the volume sweet-spot. Significant generational improvement.",
    alternatives: [
      { name: "NVIDIA GeForce RTX 5050 Laptop", comparison: "~30% slower but cheaper — fine for 1080p" },
      { name: "NVIDIA GeForce RTX 5070 Laptop", comparison: "~20% faster — for those who want more headroom" },
    ],
    architecture: "Blackwell",
  },
  "NVIDIA GeForce RTX 5070 Ti Laptop": {
    summary:
      "High-end Blackwell discrete GPU with 12 GB GDDR7. Positioned between RTX 5070 and RTX 5080 for near-flagship performance. Excellent for 1440p and 4K gaming with DLSS 4.",
    strengths: [
      "12 GB GDDR7 — future-proof VRAM for high-resolution gaming",
      "Near-flagship rasterisation and ray tracing performance",
      "DLSS 4 Multi Frame Generation for extreme frame rates",
      "Strong professional GPU compute capability",
    ],
    weaknesses: [
      "High TGP demands serious cooling solutions",
      "Price premium over RTX 5070 is significant",
      "Diminishing returns for 1080p gaming",
      "Only available in 16+ inch chassis",
    ],
    bestFor: [
      "Legion Pro buyers who want near-flagship without flagship pricing",
      "4K gaming with DLSS at high settings",
      "Content creators who render and edit with GPU acceleration",
      "Users who want maximum GPU within a Pro (not flagship) budget",
    ],
    avoidIf: [
      "1080p is your target resolution — RTX 5060 is more than enough",
      "Portability matters — the chassis will be large and heavy",
      "Budget is a primary concern — RTX 5070 offers 85% of the performance",
    ],
    thermalNotes:
      "High TGP requires vapour chamber or dual-fan cooling. Legion Pro 16-inch chassis is the minimum. Sustained loads will produce audible fan noise.",
    generationContext:
      "RTX 50 series Blackwell high-end. Slots between RTX 5070 and RTX 5080 Laptop. New tier for 2025 — no direct RTX 40 predecessor.",
    alternatives: [
      { name: "NVIDIA GeForce RTX 5070 Laptop", comparison: "~15% slower but meaningfully cheaper and more available" },
      { name: "NVIDIA GeForce RTX 5080 Laptop", comparison: "~10% faster — for those who need absolute maximum" },
    ],
    architecture: "Blackwell",
  },
  "NVIDIA GeForce RTX 5090 Laptop": {
    summary:
      "Ultimate Blackwell discrete GPU with 16 GB GDDR7. NVIDIA's absolute flagship mobile GPU for 2025. Maximum performance for 4K gaming, professional rendering, and ML training. Desktop-class GPU in a laptop form factor.",
    strengths: [
      "16 GB GDDR7 — maximum VRAM for any mobile GPU",
      "Absolute best mobile gaming and ray tracing performance",
      "DLSS 4 with maximum tensor core count",
      "Professional-grade CUDA/tensor compute for ML and rendering",
    ],
    weaknesses: [
      "Extreme pricing — only in halo-tier flagship machines",
      "Highest TGP demands the best cooling available",
      "Negligible improvement over RTX 5080 for most games",
      "Massive chassis required — no portability",
    ],
    bestFor: [
      "Users who demand the absolute best regardless of cost",
      "4K native gaming at maximum settings with ray tracing",
      "Professional ML training and 3D rendering on the go",
      "Workstation-replacement setups that also game",
    ],
    avoidIf: [
      "Budget has any constraint — the performance uplift over 5080 is marginal",
      "You game at 1080p or 1440p — RTX 5070 is already overkill",
      "Portability matters at all",
      "Power outlet access is uncertain — this draws maximum wattage",
    ],
    thermalNotes:
      "Maximum TGP demands the most advanced cooling in the industry. Only viable in the largest gaming chassis with vapour chamber and aggressive fan curves. Expect sustained high noise levels.",
    generationContext:
      "RTX 50 series Blackwell ultimate flagship. The most powerful laptop GPU available in 2025. Reserved for the most expensive gaming laptops and mobile workstations.",
    alternatives: [
      {
        name: "NVIDIA GeForce RTX 5080 Laptop",
        comparison: "~10% slower but significantly more available and cheaper",
      },
      {
        name: "NVIDIA GeForce RTX 5070 Ti Laptop",
        comparison: "~20% slower — excellent value proposition compared to 5090 pricing",
      },
    ],
    architecture: "Blackwell",
  },
};
