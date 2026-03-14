/**
 * Core type definitions for the LenovoCompare CH data model.
 *
 * Central type is `Laptop` — represents a single laptop model with full PSREF specs.
 * Models span four lineups (ThinkPad, IdeaPad Pro, Legion, Yoga) with lineup-specific series.
 * Supporting types cover pricing, filters, scoring dimensions, and analysis output.
 */

/** The four Lenovo product lineups covered by this tool. */
export type Lineup = "ThinkPad" | "IdeaPad Pro" | "Legion" | "Yoga";

/**
 * Sub-series within a lineup. Values are lineup-specific:
 * ThinkPad: X1/T/P/L/E, IdeaPad Pro: Pro 5/5i/7, Legion: 5/5i/7/7i/Pro/Slim, Yoga: 6/7/9/Slim/Book.
 */
export type Series =
  | "X1"
  | "T"
  | "P"
  | "L"
  | "E"
  | "Pro 5"
  | "Pro 5i"
  | "Pro 7"
  | "5"
  | "5i"
  | "7"
  | "7i"
  | "Pro"
  | "Slim"
  | "Yoga 6"
  | "Yoga 7"
  | "Yoga 9"
  | "Yoga Slim"
  | "Yoga Book";

/** Available sort orders for the model grid. Format: field-direction. */
export type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "score-desc"
  | "weight-asc"
  | "screen-desc";

/** CPU specification from PSREF. Clocks in GHz, TDP in watts. */
export interface Processor {
  readonly name: string;
  readonly cores: number;
  readonly threads: number;
  /** Base clock speed in GHz. */
  readonly baseClock: number;
  /** Max turbo/boost clock speed in GHz. */
  readonly boostClock: number;
  /** Thermal Design Power in watts. */
  readonly tdp: number;
}

/** RAM specification. Size/maxSize in GB, speed in MHz. */
export interface Ram {
  /** Installed RAM in GB. */
  readonly size: number;
  readonly type: "DDR4" | "DDR5" | "LPDDR5" | "LPDDR5x";
  /** Memory clock speed in MHz. */
  readonly speed: number;
  /** Maximum supported RAM in GB. */
  readonly maxSize: number;
  /** Number of DIMM slots (0 if fully soldered). */
  readonly slots: number;
  /** Whether RAM is soldered to the motherboard (non-upgradeable). */
  readonly soldered: boolean;
}

/** Display panel specification. Size in inches, brightness in nits. */
export interface Display {
  /** Diagonal screen size in inches. */
  readonly size: number;
  /** Pixel resolution, e.g. "1920x1200". */
  readonly resolution: string;
  /** Marketing label, e.g. "FHD+", "2.8K", "4K". */
  readonly resolutionLabel: string;
  readonly panel: "IPS" | "OLED" | "TN";
  /** Refresh rate in Hz. */
  readonly refreshRate: number;
  /** Peak brightness in nits. */
  readonly nits: number;
  readonly touchscreen: boolean;
}

/** GPU specification. Integrated GPUs omit vram; discrete GPUs specify vram in GB. */
export interface Gpu {
  readonly name: string;
  /** Dedicated VRAM in GB. Omitted for integrated GPUs. */
  readonly vram?: number;
  /** True for iGPUs (e.g. Intel Iris Xe), false for discrete (e.g. RTX 4060). */
  readonly integrated: boolean;
}

/** Internal storage specification. Size in GB. */
export interface Storage {
  readonly type: "NVMe" | "SSD";
  /** Storage capacity in GB. */
  readonly size: number;
  /** Number of M.2/drive slots available. */
  readonly slots: number;
}

/** Linux support level: "certified" (OEM-tested), "community" (user-reported), or "unknown". */
export type LinuxStatus = "certified" | "community" | "unknown";

/** Keyboard specification including layout and input features. */
export interface Keyboard {
  readonly backlit: boolean;
  /** Keyboard layout, e.g. "Full-size", "75%". */
  readonly layout: string;
  /** Whether the keyboard includes a ThinkPad-style TrackPoint. */
  readonly trackpoint: boolean;
}

/**
 * Central data type representing a single laptop model with full PSREF specs.
 * The `id` is a unique slug (e.g. "t14-gen5-intel"). Optional `*Options` arrays
 * represent configurable components when a model ships in multiple configurations.
 */
export interface Laptop {
  /** Unique slug, e.g. "t14-gen5-intel". Uses platform suffix for dual-platform models. */
  readonly id: string;
  /** Human-readable model name, e.g. "ThinkPad T14 Gen 5 (Intel)". */
  readonly name: string;
  readonly lineup: Lineup;
  readonly series: Series;
  /** Release/announcement year (2018-2025). */
  readonly year: number;
  readonly processor: Processor;
  readonly ram: Ram;
  readonly display: Display;
  readonly gpu: Gpu;
  readonly storage: Storage;
  readonly battery: {
    /** Battery capacity in watt-hours. */
    readonly whr: number;
    readonly removable: boolean;
  };
  /** Weight in kilograms. */
  readonly weight: number;
  /** Physical dimensions in millimeters. */
  readonly dimensions?: {
    readonly widthMm: number;
    readonly depthMm: number;
    readonly heightMm: number;
  };
  /** List of physical port types, e.g. ["USB-C", "HDMI 2.1", "USB-A 3.2"]. */
  readonly ports: readonly string[];
  /** Wireless connectivity standards, e.g. ["Wi-Fi 6E", "Bluetooth 5.3"]. */
  readonly wireless: readonly string[];
  /** Pre-installed OS, e.g. "Windows 11 Pro". */
  readonly os: string;
  /** Full URL to the PSREF product page (required for all models). */
  readonly psrefUrl: string;
  readonly linuxStatus?: LinuxStatus;
  readonly keyboard?: Keyboard;
  /** Alternative CPU options when model ships with multiple processors. */
  readonly processorOptions?: readonly Processor[];
  /** Alternative display options. */
  readonly displayOptions?: readonly Display[];
  /** Alternative GPU options (only when processorOptions span different iGPU families). */
  readonly gpuOptions?: readonly Gpu[];
  /** Alternative RAM configurations. */
  readonly ramOptions?: readonly Ram[];
  /** Alternative storage configurations. */
  readonly storageOptions?: readonly Storage[];
}

/** Classification of a price entry's origin or condition. */
export type PriceType = "msrp" | "retail" | "sale" | "refurbished" | "used";

/** A user-contributed or seed price in CHF for a specific model at a Swiss retailer. */
export interface SwissPrice {
  /** Unique ID, e.g. "sp-42" for seed prices or user-generated UUIDs. */
  readonly id: string;
  /** References Laptop.id. */
  readonly laptopId: string;
  /** Swiss retailer name, e.g. "Digitec", "Brack". */
  readonly retailer: string;
  /** Price in Swiss francs (CHF). */
  readonly price: number;
  /** Direct product URL at the retailer. */
  readonly url?: string;
  /** ISO date string (YYYY-MM-DD) when the price was recorded. */
  readonly dateAdded: string;
  /** True for community-contributed prices, false for curated seed data. */
  readonly isUserAdded: boolean;
  readonly priceType?: PriceType;
  /** Freeform note, e.g. "edu discount" or "open box". */
  readonly note?: string;
}

/** Static price reference points for a model, used to calculate deal quality. All prices in CHF. */
export interface PriceBaseline {
  /** References Laptop.id. */
  readonly laptopId: string;
  /** Manufacturer's suggested retail price in CHF. */
  readonly msrp: number;
  /** Typical Swiss street price in CHF. */
  readonly typicalRetail: number;
  /** Lowest recorded price in CHF. */
  readonly historicalLow: number;
  /** ISO date string when the historical low was recorded. */
  readonly historicalLowDate: string;
  /** Retailer where the historical low was found. */
  readonly historicalLowRetailer: string;
}

/** Current filter/sort state for the home page model grid. Null values mean "no filter". */
export interface FilterState {
  /** Free-text search query matched against model name. */
  readonly search: string;
  /** Selected lineups to include (empty = all). */
  readonly lineup: readonly Lineup[];
  /** Selected series to include (empty = all). */
  readonly series: readonly Series[];
  readonly sort: SortOption;
  /** Minimum price filter in CHF. */
  readonly minPrice: number | null;
  /** Maximum price filter in CHF. */
  readonly maxPrice: number | null;
  /** Minimum screen size filter in inches. */
  readonly minScreenSize: number | null;
  /** Maximum weight filter in kg. */
  readonly maxWeight: number | null;
  /** Filter to a specific release year. */
  readonly year: number | null;
  /** Minimum RAM filter in GB. */
  readonly ramMin: number | null;
}

/** Predefined use-case categories assigned by the analysis engine. */
export type UseCase =
  | "Business Travel"
  | "Developer"
  | "Creative Work"
  | "Budget"
  | "Desktop Replacement"
  | "Ultraportable"
  | "Student"
  | "IT Fleet"
  | "Light Gaming";

/** Auto-generated analysis output for a model: pros/cons, recommended use cases, and upgrade path. */
export interface ModelAnalysis {
  readonly pros: readonly string[];
  readonly cons: readonly string[];
  /** Best-fit use cases for this model. */
  readonly useCases: readonly UseCase[];
  /** One-sentence model summary. */
  readonly summary: string;
  /** Suggested next-generation or higher-tier upgrade model. */
  readonly upgradePath?: { readonly id: string; readonly name: string };
  /** Per-scenario suitability verdicts (e.g. video editing, web dev). */
  readonly scenarios?: readonly UseCaseScenario[];
  readonly gamingTier?: GamingTier;
}

/** Curated editorial content overlaid on a model's detail page. */
export interface EditorialOverlay {
  /** General editorial commentary about the model. */
  readonly editorialNotes?: string;
  /** Known hardware or software issues. */
  readonly knownIssues?: string;
  /** Switzerland-specific availability or pricing notes. */
  readonly swissMarketNotes?: string;
  /** Notes about Linux compatibility and quirks. */
  readonly linuxNotes?: string;
}

/** Gaming capability tier based on GPU performance. "None" = no gaming, "Heavy" = AAA titles. */
export type GamingTier = "None" | "Light" | "Medium" | "Heavy";

/** Estimated FPS for a specific game/resolution/settings combination. */
export interface GpuFpsEstimate {
  /** Game title, e.g. "Cyberpunk 2077". */
  readonly title: string;
  /** Target resolution, e.g. "1080p". */
  readonly resolution: string;
  /** Quality preset, e.g. "Ultra", "Medium". */
  readonly settings: string;
  /** Estimated average frames per second. */
  readonly fps: number;
}

/** Benchmark data for a specific GPU, keyed by GPU name in gpu-benchmarks.ts. */
export interface GpuBenchmarkEntry {
  readonly gpuName: string;
  /** Normalized GPU score (0-100). */
  readonly score: number;
  readonly gamingTier: GamingTier;
  readonly fpsEstimates: readonly GpuFpsEstimate[];
  /** 3DMark Time Spy graphics score. */
  readonly timeSpyScore?: number;
  /** 3DMark Steel Nomad 4K FPS. */
  readonly steelNomad4kFps?: number;
  /** Cyberpunk 2077 at 1080p Ultra average FPS. */
  readonly cyberpunk1080pUltraFps?: number;
}

/** CPU benchmark scores, keyed by CPU name in cpu-benchmarks.ts. Scores are 0-100 normalized. */
export interface CpuBenchmarkData {
  /** Normalized single-core score (0-100). */
  readonly singleCore: number;
  /** Normalized multi-core score (0-100). */
  readonly multiCore: number;
  /** Weighted composite of single + multi core scores (0-100). */
  readonly composite: number;
  /** Raw Cinebench 2024 single-core score. */
  readonly cinebench2024Single?: number;
  /** Raw Cinebench 2024 multi-core score. */
  readonly cinebench2024Multi?: number;
  /** Raw Geekbench 6 single-core score. */
  readonly geekbench6Single?: number;
  /** Raw Geekbench 6 multi-core score. */
  readonly geekbench6Multi?: number;
  /** Typical average power draw in watts during sustained load. */
  readonly typicalTdpAvg?: number;
  /** Peak power draw in watts during burst workloads. */
  readonly typicalTdpMax?: number;
}

/** Linux driver functionality status for a hardware component. */
export type DriverStatus = "works" | "partial" | "broken" | "unknown";

/** Linux driver status for a specific hardware component in a laptop model. */
export interface LinuxDriverNote {
  /** Hardware component name, e.g. "WiFi", "Fingerprint Reader", "Thunderbolt". */
  readonly component: string;
  readonly status: DriverStatus;
  /** Human-readable driver notes or workaround instructions. */
  readonly notes: string;
  /** Minimum kernel version required for support, e.g. "6.1". */
  readonly minKernel?: string;
}

/** Per-model Linux compatibility data, keyed by laptopId in linux-compat.ts. */
export interface LinuxCompatEntry {
  /** References Laptop.id. */
  readonly laptopId: string;
  /** Distros with confirmed compatibility, e.g. ["Ubuntu 22.04", "Fedora 39"]. */
  readonly certifiedDistros: readonly string[];
  /** Minimum recommended kernel version, e.g. "6.5". */
  readonly recommendedKernel: string;
  /** Per-component driver status notes. */
  readonly driverNotes: readonly LinuxDriverNote[];
  /** Fedora-specific compatibility notes. */
  readonly fedoraNotes?: string;
  /** General Linux notes not tied to a specific component. */
  readonly generalNotes?: string;
}

/** Six normalized scores (0-100) for the PerformanceRadar chart. */
export interface PerformanceDimensions {
  readonly cpu: number;
  readonly gpu: number;
  readonly memory: number;
  readonly portability: number;
  readonly display: number;
  readonly connectivity: number;
}

/** How well a model fits a specific use-case scenario, from best to worst. */
export type ScenarioVerdict = "overkill" | "excellent" | "good" | "marginal" | "insufficient";

/** A suitability assessment for a specific workflow scenario (e.g. "4K Video Editing"). */
export interface UseCaseScenario {
  /** Scenario name, e.g. "Web Development", "Photo Editing". */
  readonly scenario: string;
  readonly verdict: ScenarioVerdict;
  /** Brief rationale for the verdict. */
  readonly explanation: string;
}

/** Curated hardware analysis for a CPU or GPU, shown on the /hardware guide page. */
export interface HardwareGuideEntry {
  /** One-sentence summary of the component. */
  readonly summary: string;
  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];
  /** Ideal workloads or user profiles for this component. */
  readonly bestFor: readonly string[];
  /** Situations where this component is a poor fit. */
  readonly avoidIf: readonly string[];
  /** Thermal behavior notes (throttling, cooling requirements). */
  readonly thermalNotes: string;
  /** Context about this component's generation and positioning. */
  readonly generationContext: string;
  /** Competing or adjacent components with brief comparison. */
  readonly alternatives: readonly {
    readonly name: string;
    readonly comparison: string;
  }[];
  /** CPU/GPU architecture name, e.g. "Meteor Lake", "Ada Lovelace". */
  readonly architecture: string;
}

/** Attribution source for per-model benchmark data. */
export type BenchmarkSource =
  | "notebookcheck"
  | "geekbench"
  | "tomshardware"
  | "jarrodtech"
  | "justjoshtech"
  | "community";

/**
 * Per-model chassis benchmark data from reviews and community measurements.
 * Keyed by laptopId in model-benchmarks.ts. All measurements are from real-world testing.
 */
export interface ModelBenchmarks {
  /** Surface temperatures under load in degrees Celsius. */
  readonly thermals?: {
    readonly keyboardMaxC: number;
    readonly undersideMaxC: number;
  };
  /** Fan noise under load in dBA. */
  readonly fanNoise?: number;
  /** Battery life in hours for standard workloads. */
  readonly battery?: {
    /** Wi-Fi office productivity battery life in hours. */
    readonly officeHours: number;
    /** Local video playback battery life in hours. */
    readonly videoHours: number;
  };
  /** Relative performance scores comparing plugged-in vs battery operation. */
  readonly batteryPerformance?: {
    /** Performance score when plugged in (0-100). */
    readonly pluggedIn: number;
    /** Performance score on battery (0-100). */
    readonly onBattery: number;
  };
  /** Sequential SSD read/write speeds in MB/s. */
  readonly ssdSpeed?: {
    readonly seqReadMBs: number;
    readonly seqWriteMBs: number;
  };
  /** Measured peak display brightness in nits. */
  readonly displayBrightness?: number;
  /** Total travel weight including charger in grams. */
  readonly weightWithChargerGrams?: number;
  /** Measured memory bandwidth in GB/s. */
  readonly memoryBandwidthGBs?: number;
  /** Puget Systems Adobe Premiere Pro benchmark score. */
  readonly pugetPremiere?: number;
  /** Puget Systems DaVinci Resolve benchmark score. */
  readonly pugetDavinci?: number;
  /** Sources that provided the benchmark data. */
  readonly sources?: readonly BenchmarkSource[];
  /** URLs to the source reviews/articles. */
  readonly sourceUrls?: readonly string[];
}

/** Tracked hardware component for market trend analysis. */
export type ComponentId = "ddr4" | "ddr5" | "nand-tlc" | "nand-qlc";

/** Direction of component pricing trend. */
export type MarketTrend = "rising" | "stable" | "falling";

/** Purchase timing recommendation, from most to least urgent. */
export type BuySignal = "buy-now" | "good-deal" | "hold" | "wait";

/** Price type classification for deal highlights. */
export type DealPriceType = "sale" | "clearance" | "refurbished";

/** Market pricing trend for a hardware component (RAM/NAND), shown on the /deals page. */
export interface ComponentMarket {
  readonly component: ComponentId;
  /** Display label, e.g. "DDR5 RAM". */
  readonly label: string;
  readonly trend: MarketTrend;
  /** Price change percentage (positive = increase, negative = decrease). */
  readonly changePercent: number;
  /** ISO date string for the start of the trend period. */
  readonly since: string;
  /** Laptop price tiers affected by this trend, e.g. ["Budget", "Mid-range"]. */
  readonly affectedTiers: readonly string[];
  /** Brief market summary. */
  readonly summary: string;
  /** Attribution for the market data. */
  readonly source?: string;
}

/** A recurring Swiss retail sale event (e.g. Black Friday, Digitec Live Shopping). */
export interface SaleEvent {
  readonly id: string;
  /** Event name, e.g. "Black Friday", "Brack Cyber Monday". */
  readonly name: string;
  /** Retailer hosting the event. */
  readonly retailer: string;
  /** Month when the event typically occurs (1-12). */
  readonly typicalMonth: number;
  /** Week of the month (1-5), if applicable. */
  readonly typicalWeek?: number;
  /** Typical duration of the event in days. */
  readonly durationDays: number;
  /** Expected discount range as [min%, max%]. */
  readonly typicalDiscountRange: readonly [number, number];
  /** Product categories that typically see the best deals. */
  readonly bestFor: readonly string[];
  readonly note?: string;
}

/** A curated deal spotlight for a specific model, shown on the /deals page. */
export interface DealHighlight {
  readonly id: string;
  /** References Laptop.id. */
  readonly laptopId: string;
  /** Retailer offering the deal. */
  readonly retailer: string;
  /** Deal price in CHF. */
  readonly price: number;
  readonly priceType: DealPriceType;
  /** Direct product URL at the retailer. */
  readonly url?: string;
  /** Describes why this deal is noteworthy. */
  readonly note: string;
  /** ISO date string when the deal was added. */
  readonly addedDate: string;
  /** ISO date string when the deal expires (if known). */
  readonly expiryDate?: string;
  /** Whether the deal has been manually verified as active. */
  readonly verified: boolean;
  /** ISO date string of last verification check. */
  readonly lastVerified?: string;
  /** Toppreise.ch search query for price comparison. */
  readonly toppreiseQuery?: string;
}
