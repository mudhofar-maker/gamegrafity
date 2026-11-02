export type FarmerMode = 'legacy' | 'sovereign';

export interface FarmerIdentity {
  mode: FarmerMode;
  name: string; // Initially 'Riska' when in legacy, replaced by sovereign ID upon smart contract activation
  walletAddress: string;
  ensName: string;
  did: string;
  isSmartContractActive: boolean;
  avatarSeed: string;
}

export interface FarmBalances {
  kasTreasuryOwner: number; // e.g. Rp 13.950.000
  saldoDompetSaya: number; // e.g. Rp 100.000
  ethBalance: number; // e.g. 0.325 ETH
  totalEggHarvestedAllTime: number;
  totalWithdrawnIdr: number;
  totalWithdrawnEth: number;
  totalGramasiSoldKg: number;
}

export type CatalogCategory =
  | 'Livestock'
  | 'Hulu Suplai'
  | 'Preventif'
  | 'Infrastruktur'
  | 'Sewa Bulanan'
  | 'Utilitas Harian'
  | 'Medis Kritis';

export interface CatalogItem {
  id: string;
  name: string;
  category: CatalogCategory;
  price: number;
  unit: string;
  actionText: string;
  description: string;
  iconName: string;
  badge?: string;
  maxPerPurchase?: number;
  businessLogicNote?: string;
  isUnlimitedStock?: boolean;
  replenishmentSchedule?: string;
  continuousQuotaStatus?: string;
}

export type BiologicalPhase =
  | 'Produktif Normal'
  | 'Puncak Ovulasi'
  | 'Molting Ringan'
  | 'Inkubasi Optimal';

export interface PoultryCohorts {
  incubatingEggs: number; // Telur di mesin tetas (Hari 1-21)
  incubationProgressDays: number; // 1 s/d 21
  chicksDocCount: number; // Anak ayam DOC (Minggu 0 - 6 / Hari 1 - 42)
  growerPulletCount: number; // Ayam dara pullet (Minggu 7 - 18 / Hari 43 - 126, Non-Produksi)
  layerProductiveCount: number; // Ayam indukan bertelur aktif (Minggu 19 - 72)
  spentHensAfkirCount: number; // Ayam afkir non-produksi (Minggu 73+, siap jual karkas)
  sickChicksCount: number; // Anak ayam bergejala virus (harus dijual ke junkfood/olahan)
  virusDetected: boolean;
  virusName: string;
  virusSymptoms: string;
}

export type EggGrade = 'GRADE_A' | 'GRADE_B' | 'GRADE_C';

export interface GramasiCalculation {
  eggCount: number;
  grade: EggGrade;
  gramsPerEgg: number;
  totalWeightGrams: number;
  totalWeightKg: number;
  pricePerKg: number;
  farmerGrossRevenue: number;
  ownerOfftakerMargin: number;
  equivalentPricePerEgg: number;
}

export type ClimateMode = 'AUTO' | 'COOLING_PAD' | 'HEATER_API' | 'ECO';

export interface BiologicalCycle {
  phase: BiologicalPhase;
  population: number; // Total aktif = chicks + grower + layers + spent + roosters
  roosters: number; // 2 Jantan pemacek
  hens: number; // Total betina (grower + layers + spent)
  accumulatedEggs: number; // Butir siap panen
  selectedEggGrade: EggGrade;
  biosecurityHealth: number; // 100%
  feedStockKg: number; // kg
  electricityDaysRemaining: number;
  acClimateDaysRemaining: number; // Sewa AC conditioner & suhu api
  ambientTempC: number; // e.g. 24.5°C
  targetTempC: number; // e.g. 24.0°C
  humidityRh: number; // e.g. 65%
  climateMode: ClimateMode;
  heatStressActive: boolean;
  incubatorUnits: number;
  landPlots: number;
  modernCoopDaysRemaining: number;
  dayCount: number;
  cohorts: PoultryCohorts;
}

export interface MarketPriceItem {
  id: string;
  commodityName: string;
  marketScope: 'INDONESIA' | 'DUNIA';
  regionOrExchange: string;
  price: number;
  unit: string;
  currency: 'IDR' | 'USD';
  change24hPercent: number;
  high24h: number;
  low24h: number;
  sourceBenchmark: string;
  timingSignal: 'SELL_NOW' | 'HOLD_PEAK' | 'FAIR_MARKET';
  timingNote: string;
  updatedAt: string;
}

export type EmergencyActionType =
  | 'JUNKFOOD_SALVAGE'
  | 'BUY_FEED'
  | 'BUY_ELECTRICITY'
  | 'BUY_AC_CLIMATE'
  | 'CALL_DOCTOR'
  | 'SELL_SPENT_HENS'
  | 'HARVEST_EGGS'
  | 'TOP_UP'
  | 'NONE';

export interface EmergencyDirective {
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  directiveText: string;
  explanation: string;
  actionType: EmergencyActionType;
  actionLabel: string;
  highlightTarget: string;
  financialImpact: string;
}

export type LedgerCategory =
  | 'ALL'
  | 'TOPUP'
  | 'PURCHASE'
  | 'CYCLE'
  | 'WITHDRAW_P2P'
  | 'WITHDRAW_WEB3'
  | 'SYSTEM'
  | 'SALVAGE'
  | 'CLIMATE';

export interface LedgerEntry {
  id: string;
  timestamp: string; // e.g. "14.03.52"
  rawTime: number;
  title: string;
  description: string;
  actor: string;
  category: LedgerCategory;
  amountIdr?: number;
  amountEth?: number;
  isSuccess: boolean;
  txHash?: string;
  p2pRefId?: string;
}

export interface HarvestAttestationRecord {
  batchId: number;
  batchCode: string;
  eggCount: number;
  weightGrams: number;
  weightKg: number;
  grade: EggGrade;
  gradeIndex: number;
  ambientTempC: number;
  biosecurityScore: number;
  farmerAddress: string;
  leafHash: string;
  merkleProof: string[];
  merkleRoot: string;
  tokenId: number;
  salmonellaFreeCertified: boolean;
  coldChainCompliant: boolean;
  timestamp: string;
}

export interface Web3TransactionReceipt {
  txHash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  valueEth: string;
  gasUsed: string;
  gasPriceGwei: string;
  confirmations: number;
  status: 'Success' | 'Pending' | 'Failed';
  method: string;
  eggCount: number;
  fiatValueIdr: number;
  contractAddress: string;
  gramasiWeightKg?: number;
  attestation?: HarvestAttestationRecord;
}

export interface P2PReceipt {
  txId: string;
  refId: string;
  danaNumber: string;
  accountName: string;
  amountIdr: number;
  eggCount: number;
  timestamp: string;
  escrowMerchant: string;
  status: 'COMPLETED' | 'ESCROW_LOCKED';
  feeIdr: number;
  gramasiWeightKg?: number;
}

export interface RegisteredFarmer {
  id: string;
  farmName: string;
  country: string;
  countryCode: string;
  flag: string;
  region: string;
  flockSize: number;
  dailyEggYield: number;
  housingSystem: string;
  certifications: string[];
  payoutRail: string;
  currency: string;
  walletAddress: string;
  did: string;
  ensName: string;
  status: 'TIER-1_ACCREDITED' | 'VERIFIED_ON_CHAIN' | 'PENDING';
  txHash: string;
  blockNumber: number;
  contractAddress: string;
  registeredAt: string;
  merkleProof?: string;
  nodeOperator?: string;
  ambientTempC?: number;
  humidityRh?: number;
  ammoniaPpm?: number;
}

export interface AutoCompoundConfig {
  isEnabled: boolean;
  cashPayoutPercent: number; // e.g. 60 (50-70%)
  autoCompoundPercent: number; // e.g. 40 (30-50%)
  targetReinvestment: 'FEED_AND_SUPPLIES' | 'EXPAND_FLOCK_CAPACITY' | 'HYBRID_GROWTH';
  totalCompoundedAmountIdr: number;
  totalAdditionalBirdsFromCompound: number;
  totalFeedStockPurchasedKg: number;
  compoundingCyclesCompleted: number;
  lastCompoundedAt?: string;
  projectedMonthlyGrowthRatePercent: number;
}

export type SupportedPaymentChannel = 'QRIS' | 'DANA' | 'BCA' | 'WEB3_WALLET';

export interface HarvestRevenueSplit {
  batchId: string;
  timestamp: string;
  eggCount: number;
  weightKg: number;
  grossHarvestValueIdr: number;
  farmerShare: {
    cashPayoutIdr: number;
    cashPercent: number;
    autoCompoundIdr: number;
    compoundPercent: number;
    totalFarmerEarningsIdr: number;
  };
  deductions: {
    infrastructureLeaseIdr: number;
    supplyHuluMarginIdr: number;
    protocolPlatformFeeIdr: number;
    totalDeductionsIdr: number;
  };
  ownerTreasuryProfitIdr: number;
  txHash: string;
  status: 'SETTLED' | 'PENDING';
}

export type OwnerCashoutDestination =
  | 'BCA_CORPORATE'
  | 'MANDIRI_TREASURY'
  | 'DANA_BUSINESS'
  | 'WEB3_USDC_MAINNET'
  | 'GLOBAL_LAND_EXPANSION';

export interface OwnerRealWorldWithdrawal {
  id: string;
  timestamp: string;
  amountIdr: number;
  destination: OwnerCashoutDestination;
  destinationAccount: string;
  purpose: 'REAL_WORLD_CASHOUT' | 'LAND_EXPANSION_RESERVE' | 'HATCHERY_MICROGRID_ALLOCATION';
  status: 'COMPLETED';
  receiptRef: string;
  txHash?: string;
}

export interface InfrastructurePackage {
  id: string;
  name: string;
  tierLevel: 'starter' | 'pro' | 'sovereign';
  badge: string;
  tagline: string;
  recommended?: boolean;
  totalMonthlyRentIdr: number;
  breakdown: {
    landCostIdr: number;
    coopCostIdr: number;
    landDesc: string;
    coopDesc: string;
  };
  capacityBirds: number;
  hardwareSpecs: {
    ventilation: string;
    sensors: string;
    coolingSystem: string;
    structure: string;
  };
  projectedNetProfitMonthly: {
    minIdr: number;
    maxIdr: number;
    displayRange: string;
    dailyEggs: number;
    monthlyEggRevenueIdr: number;
    monthlyFeedCostIdr: number;
    estNetProfitIdr: number;
  };
}

export interface SupplyItemStockState {
  isUnlimited: boolean;
  stockLabel: string;
  replenishmentCycle: string;
  allocatedQuota: string;
  slaMinutes: number;
}

export interface MetaverseCoopItem {
  id: string;
  name: string;
  tier: string;
  monthlyRentIdr: number;
  capacityBirds: number;
  description: string;
  ventilationType: string;
  coolingSystem: string;
  sensors: string[];
  eggBonusPercent: number;
  badge: string;
  recommended?: boolean;
  specDetails: {
    dimensions: string;
    feederType: string;
    manureHandling: string;
    lightingControl: string;
    iotTelemetryInterval: string;
    biosecurityRating: string;
  };
}

export interface ActiveCoopRental {
  coopId: string;
  name: string;
  tier: string;
  status: 'AKTIF' | 'EXPIRED' | 'STANDBY';
  rentedAt: number; // timestamp ms
  expiresAt: number; // timestamp ms
  durationDays: number;
  monthlyRentIdr: number;
  contractCode: string;
  txHash: string;
  capacityBirds: number;
  packageId?: string;
  packageName?: string;
  iotTelemetry: {
    tempC: number;
    targetTempC: number;
    humidityRh: number;
    targetHumidityRh: number;
    ammoniaPpm: number;
    coolingPadActive: boolean;
    exhaustFanRpm: number;
    airVelocityMs: number;
    lastSyncTime: string;
    sensorHealthPercent: number;
  };
}

