/**
 * Core type definitions for the LenovoCompare CH data model.
 *
 * Central type is `Laptop` — represents a single laptop model with full PSREF specs.
 * Models span three lineups (ThinkPad, IdeaPad Pro, Legion) with lineup-specific series.
 * Supporting types cover pricing, filters, scoring dimensions, and analysis output.
 */

export type Lineup = "ThinkPad" | "IdeaPad Pro" | "Legion";

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
  | "Slim";

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "score-desc"
  | "weight-asc"
  | "screen-desc";

export interface Processor {
  readonly name: string;
  readonly cores: number;
  readonly threads: number;
  readonly baseClock: number;
  readonly boostClock: number;
  readonly tdp: number;
}

export interface Ram {
  readonly size: number;
  readonly type: "DDR4" | "DDR5" | "LPDDR5" | "LPDDR5x";
  readonly speed: number;
  readonly maxSize: number;
  readonly slots: number;
  readonly soldered: boolean;
}

export interface Display {
  readonly size: number;
  readonly resolution: string;
  readonly resolutionLabel: string;
  readonly panel: "IPS" | "OLED" | "TN";
  readonly refreshRate: number;
  readonly nits: number;
  readonly touchscreen: boolean;
}

export interface Gpu {
  readonly name: string;
  readonly vram?: number;
  readonly integrated: boolean;
}

export interface Storage {
  readonly type: "NVMe" | "SSD";
  readonly size: number;
  readonly slots: number;
}

export type LinuxStatus = "certified" | "community" | "unknown";

export interface Keyboard {
  readonly backlit: boolean;
  readonly layout: string;
  readonly trackpoint: boolean;
}

export interface Laptop {
  readonly id: string;
  readonly name: string;
  readonly lineup: Lineup;
  readonly series: Series;
  readonly year: number;
  readonly processor: Processor;
  readonly ram: Ram;
  readonly display: Display;
  readonly gpu: Gpu;
  readonly storage: Storage;
  readonly battery: {
    readonly whr: number;
    readonly removable: boolean;
  };
  readonly weight: number;
  readonly ports: readonly string[];
  readonly wireless: readonly string[];
  readonly os: string;
  readonly psrefUrl: string;
  readonly linuxStatus?: LinuxStatus;
  readonly keyboard?: Keyboard;
  readonly processorOptions?: readonly Processor[];
  readonly displayOptions?: readonly Display[];
  readonly gpuOptions?: readonly Gpu[];
  readonly ramOptions?: readonly Ram[];
  readonly storageOptions?: readonly Storage[];
}

export type PriceType = "msrp" | "retail" | "sale" | "refurbished" | "used";

export interface SwissPrice {
  readonly id: string;
  readonly laptopId: string;
  readonly retailer: string;
  readonly price: number;
  readonly url?: string;
  readonly dateAdded: string;
  readonly isUserAdded: boolean;
  readonly priceType?: PriceType;
  readonly note?: string;
}

export interface PriceBaseline {
  readonly laptopId: string;
  readonly msrp: number;
  readonly typicalRetail: number;
  readonly historicalLow: number;
  readonly historicalLowDate: string;
  readonly historicalLowRetailer: string;
}

export interface FilterState {
  readonly search: string;
  readonly lineup: readonly Lineup[];
  readonly series: readonly Series[];
  readonly sort: SortOption;
  readonly minPrice: number | null;
  readonly maxPrice: number | null;
  readonly minScreenSize: number | null;
  readonly maxWeight: number | null;
  readonly year: number | null;
  readonly ramMin: number | null;
}

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

export interface ModelAnalysis {
  readonly pros: readonly string[];
  readonly cons: readonly string[];
  readonly useCases: readonly UseCase[];
  readonly summary: string;
  readonly upgradePath?: { readonly id: string; readonly name: string };
  readonly scenarios?: readonly UseCaseScenario[];
  readonly gamingTier?: GamingTier;
}

export interface EditorialOverlay {
  readonly editorialNotes?: string;
  readonly knownIssues?: string;
  readonly swissMarketNotes?: string;
  readonly linuxNotes?: string;
}

// Benchmark & Gaming types
export type GamingTier = "None" | "Light" | "Medium" | "Heavy";

export interface GpuFpsEstimate {
  readonly title: string;
  readonly resolution: string;
  readonly settings: string;
  readonly fps: number;
}

export interface GpuBenchmarkEntry {
  readonly gpuName: string;
  readonly score: number;
  readonly gamingTier: GamingTier;
  readonly fpsEstimates: readonly GpuFpsEstimate[];
  readonly timeSpyScore?: number;
  readonly steelNomad4kFps?: number;
  readonly cyberpunk1080pUltraFps?: number;
}

export interface CpuBenchmarkData {
  readonly singleCore: number;
  readonly multiCore: number;
  readonly composite: number;
  readonly cinebench2024Single?: number;
  readonly cinebench2024Multi?: number;
  readonly geekbench6Single?: number;
  readonly geekbench6Multi?: number;
  readonly typicalTdpAvg?: number;
  readonly typicalTdpMax?: number;
}

// Linux compatibility types
export type DriverStatus = "works" | "partial" | "broken" | "unknown";

export interface LinuxDriverNote {
  readonly component: string;
  readonly status: DriverStatus;
  readonly notes: string;
  readonly minKernel?: string;
}

export interface LinuxCompatEntry {
  readonly laptopId: string;
  readonly certifiedDistros: readonly string[];
  readonly recommendedKernel: string;
  readonly driverNotes: readonly LinuxDriverNote[];
  readonly fedoraNotes?: string;
  readonly generalNotes?: string;
}

// Performance dimensions for radar chart
export interface PerformanceDimensions {
  readonly cpu: number;
  readonly gpu: number;
  readonly memory: number;
  readonly portability: number;
  readonly display: number;
  readonly connectivity: number;
}

// Use case scenario types
export type ScenarioVerdict = "overkill" | "excellent" | "good" | "marginal" | "insufficient";

export interface UseCaseScenario {
  readonly scenario: string;
  readonly verdict: ScenarioVerdict;
  readonly explanation: string;
}

// Hardware guide types
export interface HardwareGuideEntry {
  readonly summary: string;
  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];
  readonly bestFor: readonly string[];
  readonly avoidIf: readonly string[];
  readonly thermalNotes: string;
  readonly generationContext: string;
  readonly alternatives: readonly {
    readonly name: string;
    readonly comparison: string;
  }[];
  readonly architecture: string;
}

// Benchmark data types
export type BenchmarkSource =
  | "notebookcheck"
  | "geekbench"
  | "tomshardware"
  | "jarrodtech"
  | "justjoshtech"
  | "community";

export interface ModelBenchmarks {
  readonly thermals?: {
    readonly keyboardMaxC: number;
    readonly undersideMaxC: number;
  };
  readonly fanNoise?: number;
  readonly battery?: {
    readonly officeHours: number;
    readonly videoHours: number;
  };
  readonly batteryPerformance?: {
    readonly pluggedIn: number;
    readonly onBattery: number;
  };
  readonly ssdSpeed?: {
    readonly seqReadMBs: number;
    readonly seqWriteMBs: number;
  };
  readonly displayBrightness?: number;
  readonly weightWithChargerGrams?: number;
  readonly memoryBandwidthGBs?: number;
  readonly pugetPremiere?: number;
  readonly pugetDavinci?: number;
  readonly sources?: readonly BenchmarkSource[];
  readonly sourceUrls?: readonly string[];
}

// Market insight types for /deals page
export type ComponentId = "ddr4" | "ddr5" | "nand-tlc" | "nand-qlc";
export type MarketTrend = "rising" | "stable" | "falling";
export type BuySignal = "buy-now" | "good-deal" | "hold" | "wait";
export type DealPriceType = "sale" | "clearance" | "refurbished";

export interface ComponentMarket {
  readonly component: ComponentId;
  readonly label: string;
  readonly trend: MarketTrend;
  readonly changePercent: number;
  readonly since: string;
  readonly affectedTiers: readonly string[];
  readonly summary: string;
  readonly source?: string;
}

export interface SaleEvent {
  readonly id: string;
  readonly name: string;
  readonly retailer: string;
  readonly typicalMonth: number;
  readonly typicalWeek?: number;
  readonly durationDays: number;
  readonly typicalDiscountRange: readonly [number, number];
  readonly bestFor: readonly string[];
  readonly note?: string;
}

export interface DealHighlight {
  readonly id: string;
  readonly laptopId: string;
  readonly retailer: string;
  readonly price: number;
  readonly priceType: DealPriceType;
  readonly url?: string;
  readonly note: string;
  readonly addedDate: string;
  readonly expiryDate?: string;
  readonly verified: boolean;
}
