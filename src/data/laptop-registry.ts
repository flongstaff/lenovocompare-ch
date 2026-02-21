// ThinkCompare CH – Laptop Registry
// Spec data for ThinkPad T14, X1 Carbon, and X1 2-in-1 series (Swiss market)

export const SERIES_PHILOSOPHIES = {
  T: "The Workhorse",
  X1_CARBON: "The Executive",
  X1_2IN1: "The Creative",
} as const;

export type SeriesPhilosophy = keyof typeof SERIES_PHILOSOPHIES;

export type RamArchitecture = "LPDDR5x (Soldered)" | "DDR5 (SODIMM)";

export type ThunderboltVersion = "Thunderbolt 3" | "Thunderbolt 4" | "USB4";

export type ChassisMaterial = "Carbon Fiber" | "Magnesium Alloy" | "Aluminum" | "Glass Fiber / PPS";

export type FormFactor = "Clamshell" | "2-in-1 (360° Hinge)";

export type PenSupport = "None" | "External (USI 2.0)" | "Garaged";

interface PortSelection {
  readonly usbc: number;
  readonly thunderboltVersion: ThunderboltVersion;
  readonly usba: number;
  readonly hdmi: string;
  readonly rj45: boolean;
  readonly headphone: boolean;
  readonly sdCard: string | false;
}

interface Display {
  readonly size: string;
  readonly resolution: string;
  readonly panelType: string;
  readonly touchscreen: boolean;
  readonly refreshRate: string;
  readonly brightness: string;
  readonly colorGamut: string;
}

interface Battery {
  readonly capacity: string;
  readonly fastCharge: boolean;
  readonly estimatedLife: string;
}

interface SwissPricing {
  readonly msrpCHF: number;
  readonly digitecSearchQuery: string;
  readonly brackSearchQuery: string;
  readonly refurbishedSearchQuery?: string;
}

export interface LaptopSpec {
  readonly id: string;
  readonly name: string;
  readonly series: SeriesPhilosophy;
  readonly philosophy: string;
  readonly generation: number;
  readonly year: number;
  readonly formFactor: FormFactor;
  readonly penSupport: PenSupport;

  // Performance
  readonly processor: string;
  readonly processorCodename: string;
  readonly cores: string;
  readonly tdp: string;
  readonly gpu: string;

  // Memory & Storage
  readonly ramArchitecture: RamArchitecture;
  readonly ramOptions: readonly string[];
  readonly maxRam: string;
  readonly storageOptions: readonly string[];

  // Display
  readonly display: Display;

  // Chassis & Portability
  readonly chassisMaterial: readonly ChassisMaterial[];
  readonly weightKg: number;
  readonly dimensions: string;
  readonly milStd810H: boolean;

  // Ports
  readonly ports: PortSelection;

  // Battery
  readonly battery: Battery;

  // Connectivity
  readonly wifi: string;
  readonly bluetooth: string;
  readonly wwan: boolean;

  // Security
  readonly fingerprintReader: boolean;
  readonly irCamera: boolean;
  readonly tpm: string;

  // Swiss Pricing & Retail
  readonly pricing: SwissPricing;

  // Comparison Categories
  readonly dealbreakers: readonly string[];
  readonly strengths: readonly string[];
}

export const laptopRegistry: readonly LaptopSpec[] = [
  // ─── T14 Gen 6 (AMD) ─────────────────────────────────────────────
  {
    id: "t14-gen6-amd",
    name: "ThinkPad T14 Gen 6 (AMD)",
    series: "T",
    philosophy: SERIES_PHILOSOPHIES.T,
    generation: 6,
    year: 2025,
    formFactor: "Clamshell",
    penSupport: "None",

    processor: "AMD Ryzen 7 PRO 8840U",
    processorCodename: "Hawk Point",
    cores: "8C / 16T",
    tdp: "15–30 W",
    gpu: "AMD Radeon 780M",

    ramArchitecture: "DDR5 (SODIMM)",
    ramOptions: ["16 GB", "32 GB", "64 GB"],
    maxRam: "64 GB",
    storageOptions: ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD"],

    display: {
      size: '14.0"',
      resolution: "1920 × 1200 (WUXGA)",
      panelType: "IPS, Anti-glare",
      touchscreen: false,
      refreshRate: "60 Hz",
      brightness: "300 nits",
      colorGamut: "45% NTSC / 100% sRGB",
    },

    chassisMaterial: ["Glass Fiber / PPS", "Aluminum"],
    weightKg: 1.39,
    dimensions: "317.7 × 226.9 × 17.9 mm",
    milStd810H: true,

    ports: {
      usbc: 2,
      thunderboltVersion: "USB4",
      usba: 2,
      hdmi: "HDMI 2.1",
      rj45: true,
      headphone: true,
      sdCard: false,
    },

    battery: {
      capacity: "52.5 Wh",
      fastCharge: true,
      estimatedLife: "Up to 12.5 hours",
    },

    wifi: "Wi-Fi 6E (802.11ax)",
    bluetooth: "5.3",
    wwan: true,

    fingerprintReader: true,
    irCamera: true,
    tpm: "dTPM 2.0",

    pricing: {
      msrpCHF: 1399,
      digitecSearchQuery: "ThinkPad+T14+Gen+6+AMD",
      brackSearchQuery: "ThinkPad+T14+Gen+6+AMD",
      refurbishedSearchQuery: "ThinkPad+T14",
    },

    dealbreakers: ["DDR5 SODIMM – user-upgradeable RAM", "RJ-45 Ethernet port included", "MIL-STD-810H certified"],
    strengths: [
      "Best repairability in the lineup",
      "Expandable RAM up to 64 GB",
      "Integrated WWAN option",
      "Competitive AMD Ryzen PRO performance",
    ],
  },

  // ─── X1 Carbon Gen 13 (Intel) ────────────────────────────────────
  {
    id: "x1-carbon-gen13",
    name: "ThinkPad X1 Carbon Gen 13 (Intel)",
    series: "X1_CARBON",
    philosophy: SERIES_PHILOSOPHIES.X1_CARBON,
    generation: 13,
    year: 2025,
    formFactor: "Clamshell",
    penSupport: "None",

    processor: "Intel Core Ultra 7 258V",
    processorCodename: "Lunar Lake",
    cores: "8C / 8T (4P + 4E)",
    tdp: "17 W",
    gpu: "Intel Arc 140V",

    ramArchitecture: "LPDDR5x (Soldered)",
    ramOptions: ["16 GB", "32 GB"],
    maxRam: "32 GB",
    storageOptions: ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD"],

    display: {
      size: '14.0"',
      resolution: "2880 × 1800 (2.8K OLED)",
      panelType: "OLED, Anti-reflective",
      touchscreen: true,
      refreshRate: "120 Hz",
      brightness: "500 nits (HDR 600)",
      colorGamut: "100% DCI-P3",
    },

    chassisMaterial: ["Carbon Fiber", "Magnesium Alloy"],
    weightKg: 1.08,
    dimensions: "312.8 × 214.95 × 15.36 mm",
    milStd810H: true,

    ports: {
      usbc: 2,
      thunderboltVersion: "Thunderbolt 4",
      usba: 2,
      hdmi: "HDMI 2.1",
      rj45: false,
      headphone: true,
      sdCard: false,
    },

    battery: {
      capacity: "57 Wh",
      fastCharge: true,
      estimatedLife: "Up to 15 hours",
    },

    wifi: "Wi-Fi 7 (802.11be)",
    bluetooth: "5.4",
    wwan: true,

    fingerprintReader: true,
    irCamera: true,
    tpm: "Microsoft Pluton",

    pricing: {
      msrpCHF: 1899,
      digitecSearchQuery: "ThinkPad+X1+Carbon+Gen+13",
      brackSearchQuery: "ThinkPad+X1+Carbon+Gen+13",
    },

    dealbreakers: [
      "LPDDR5x soldered – NOT upgradeable",
      "No RJ-45 Ethernet port",
      "Lunar Lake efficiency – best battery life",
    ],
    strengths: [
      "Lightest at 1.08 kg",
      "OLED 2.8K 120 Hz display",
      "Lunar Lake power efficiency (17 W TDP)",
      "Carbon Fiber + Magnesium build",
      "Wi-Fi 7 ready",
    ],
  },

  // ─── X1 2-in-1 Gen 9 ─────────────────────────────────────────────
  {
    id: "x1-2in1-gen9",
    name: "ThinkPad X1 2-in-1 Gen 9",
    series: "X1_2IN1",
    philosophy: SERIES_PHILOSOPHIES.X1_2IN1,
    generation: 9,
    year: 2024,
    formFactor: "2-in-1 (360° Hinge)",
    penSupport: "Garaged",

    processor: "Intel Core Ultra 7 155U",
    processorCodename: "Meteor Lake",
    cores: "12C / 14T (2P + 8E + 2LPE)",
    tdp: "15 W",
    gpu: "Intel Arc Graphics (Meteor Lake)",

    ramArchitecture: "LPDDR5x (Soldered)",
    ramOptions: ["16 GB", "32 GB", "64 GB"],
    maxRam: "64 GB",
    storageOptions: ["256 GB SSD", "512 GB SSD", "1 TB SSD"],

    display: {
      size: '14.0"',
      resolution: "2880 × 1800 (2.8K OLED)",
      panelType: "OLED, Anti-reflective, Touch + Pen",
      touchscreen: true,
      refreshRate: "120 Hz",
      brightness: "500 nits (HDR 500)",
      colorGamut: "100% DCI-P3",
    },

    chassisMaterial: ["Aluminum"],
    weightKg: 1.35,
    dimensions: "314.4 × 222.3 × 15.53 mm",
    milStd810H: true,

    ports: {
      usbc: 2,
      thunderboltVersion: "Thunderbolt 4",
      usba: 1,
      hdmi: "HDMI 2.1",
      rj45: false,
      headphone: true,
      sdCard: false,
    },

    battery: {
      capacity: "58 Wh",
      fastCharge: true,
      estimatedLife: "Up to 12 hours",
    },

    wifi: "Wi-Fi 6E (802.11ax)",
    bluetooth: "5.3",
    wwan: true,

    fingerprintReader: true,
    irCamera: true,
    tpm: "dTPM 2.0 / Microsoft Pluton",

    pricing: {
      msrpCHF: 2099,
      digitecSearchQuery: "ThinkPad+X1+2-in-1+Gen+9",
      brackSearchQuery: "ThinkPad+X1+Yoga+Gen+9",
      refurbishedSearchQuery: "ThinkPad+X1+Yoga",
    },

    dealbreakers: ["LPDDR5x soldered – NOT upgradeable", "No RJ-45 Ethernet port", "360° hinge with garaged pen"],
    strengths: [
      "360° convertible with garaged Lenovo Integrated Pen",
      "OLED 2.8K 120 Hz touch display",
      "Best for creative / pen workflows",
      "Tent & tablet modes for presentations",
    ],
  },
] as const;

// ─── Helper: Format price in CHF (Swiss locale) ────────────────────
export const formatCHF = (amount: number): string =>
  new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF" }).format(amount);

// ─── Helper: Generate retailer search URLs ─────────────────────────
const RETAILER_BASES = {
  digitec: "https://www.digitec.ch/de/search?q=",
  brack: "https://www.brack.ch/search?query=",
  ricardo: "https://www.ricardo.ch/de/s/",
  tutti: "https://www.tutti.ch/de/q/",
} as const;

export const getDigitecLink = (spec: LaptopSpec): string =>
  `${RETAILER_BASES.digitec}${spec.pricing.digitecSearchQuery}`;

export const getBrackLink = (spec: LaptopSpec): string => `${RETAILER_BASES.brack}${spec.pricing.brackSearchQuery}`;

export const getRefurbishedLinks = (spec: LaptopSpec) => {
  const query = spec.pricing.refurbishedSearchQuery;
  if (!query) return null;
  return {
    ricardo: `${RETAILER_BASES.ricardo}${query}`,
    tutti: `${RETAILER_BASES.tutti}${query}`,
  };
};

// ─── Filter helpers ────────────────────────────────────────────────
export const getByFamily = (series: SeriesPhilosophy): readonly LaptopSpec[] =>
  laptopRegistry.filter((l) => l.series === series);

export const getLaptopById = (id: string): LaptopSpec | undefined => laptopRegistry.find((l) => l.id === id);
