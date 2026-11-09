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
  entryPackagePriceIdr?: number; // Modal paket awal kemitraan all-in (bibit, kandang, vitamin, pakan awal)
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
  constructionCostRangeIdr?: string;
  constructionCostMinIdr?: number;
  constructionCostMaxIdr?: number;
  scaleCategory?: 'SKALA_KECIL_50' | 'SKALA_MENENGAH_100' | 'SKALA_KOMERSIAL_500' | 'SKALA_INDUSTRI_1000' | 'LAHAN';
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

export type CoopUnitStatus = 'Active' | 'Hatching' | 'Full';

export interface CoopUnit {
  id: number;
  name?: string;
  capacity: number;
  status: CoopUnitStatus;
  chickenCount: number;
  tier?: string;
  dailyEggs?: number;
  feedDailyKg?: number;
  tempC?: number;
  humidityRh?: number;
  ammoniaPpm?: number;
  lastHatchBatchId?: string;
}

export interface UserProfileData {
  fullName: string;
  role: 'owner' | 'peternak';
  walletAddress: string | null;
  email?: string;
  phone?: string;
  preferredNetwork?: string;
  updatedAt?: string;
}

export interface Web3WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isMetaMask: boolean;
  balanceEth: string | null;
  ensName?: string | null;
  isOwnerWallet: boolean;
}

export type TwoWaySenderStatus = 'BELUM_BAYAR' | 'SUDAH_BAYAR';
export type TwoWayReceiverStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface TwoWayPaymentRecord {
  id: string;
  senderName: string;
  senderWalletOrPhone: string;
  serviceName: string;
  amountIdr: number;
  paymentChannel: 'DANA_P2P' | 'QRIS' | 'BCA' | 'WEB3_WALLET';
  merchantTarget: string;
  senderStatus: TwoWaySenderStatus;
  senderConfirmedAt?: string;
  senderProofNote?: string;
  receiverStatus: TwoWayReceiverStatus;
  receiverApprovedAt?: string;
  receiverApprovedBy?: string;
  unlockedModule: string;
  createdAt: string;
  txHash?: string;
  contractCode?: string;
}

export interface TreasuryReservePool {
  totalReserveBalanceIdr: number;
  infrastructureInflowsIdr: number;
  workingCapitalDeployedIdr: number;
  realizedMarketSalesIdr: number;
  netSpreadSurplusAccumulatedIdr: number;
  reserveBufferHealthPercent: number;
  totalActiveFarmersCount: number;
  lastUpdated: string;
}

export interface DynamicMarginRule {
  commodity: string;
  commodityKey: string;
  realtimeMarketPricePerKg: number;
  mandatorySpreadPercent: number;
  lockedFarmerBuyPricePerKg: number;
  guaranteedSurplusPerKg: number;
  guaranteedSurplusPercent: number;
  status: 'LOCKED_POSITIVE_SURPLUS';
  benchmarkSource: string;
}

export interface AssetToCashBatch {
  batchId: string;
  timestamp: string;
  eggCount: number;
  weightKg: number;
  commodityType: string;
  farmerBuyPriceKg: number;
  farmerPaidIdr: number;
  realizedMarketPriceKg: number;
  realizedGrossSaleIdr: number;
  replenishedCostBasisIdr: number;
  netCashSurplusGeneratedIdr: number;
  status: 'IN_WAREHOUSE' | 'REALIZED_TO_CASH';
  offtakerName: string;
  txHash: string;
}

export interface PhysicalCommodityInventory {
  eggsCount: number;
  weightKg: number;
  commodity: string;
  costBasisIdr: number;
  batchesCount: number;
  estimatedMarketValueIdr: number;
  unrealizedSurplusIdr: number;
}

export type FarmerAccountStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED';

export interface BrokerAbsorptionRecord {
  id: string;
  batchCode: string;
  date: string;
  eggCount: number;
  weightKg: number;
  grade: EggGrade;
  pricePerKg: number;
  payoutIdr: number;
  brokerName: string;
  status: 'SETTLED' | 'PROCESSING';
  txHash: string;
}

export interface FarmerRentalPackageState {
  id: string;
  name: string;
  tierLevel: 'starter' | 'pro' | 'sovereign';
  monthlyCostIdr: number;
  capacityBirds: number;
  requestedAt: string;
  approvedAt?: string;
  expiresAt?: number;
  paymentProofNote?: string;
  paymentChannel?: string;
  contractCode?: string;
}

export interface FarmerLiveProductionState {
  population: number;
  roosters: number;
  hens: number;
  dailyEggsExpected: number;
  dailyFeedKg: number;
  dailyProductionRunningEggs: number;
  accumulatedEggsReady: number;
  totalHarvestedAllTime: number;
  totalGramasiKgAllTime: number;
  totalEarningsIdr: number;
  walletBalanceIdr: number;
  iotSensor: {
    tempC: number;
    humidityRh: number;
    ammoniaPpm: number;
    exhaustRpm: number;
    coolingPadActive: boolean;
  };
  cohorts: {
    docCount: number;
    pulletCount: number;
    layerCount: number;
    afkirCount: number;
  };
}

export interface FarmerAccount {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
  location: string;
  walletAddress: string;
  role: 'peternak' | 'owner';
  registeredAt: string;
  status: FarmerAccountStatus;
  rentalPackage: FarmerRentalPackageState;
  liveProduction: FarmerLiveProductionState;
  brokerAbsorptions: BrokerAbsorptionRecord[];
}

export interface SovereignHPPBreakdown {
  feedCostPerKg: number;
  docAmortizationPerKg: number;
  energyKwhClimatePerKg: number;
  doctorBiosecurityPerKg: number;
  totalHPPPerKg: number;
  hppPerEgg: number;
}

export interface SovereignPricingValidation {
  commodityKey: string;
  commodityName: string;
  HPP_per_kg: number;
  H_broker_per_kg: number;
  P_realtime_per_kg: number;
  farmerNetMarginPerKg: number;
  farmerNetMarginPercent: number;
  brokerGuaranteedSpreadPerKg: number;
  brokerGuaranteedSpreadPercent: number;
  formula: string;
  isValid: boolean;
}

export interface SovereignFlowRateMetrics {
  dV_system_dt_per_hour: number;
  dQ_dt_eggs_per_hour: number;
  dQ_dt_kg_per_hour: number;
  dQ_dt_burn_idr_per_hour: number;
  netFlowDifferentialPerHour: number;
  isFlowSynchronized: boolean;
  pacingIntervalSeconds: number;
  recommendedAutoCompoundPercent: number;
  pacingMode: 'NORMAL' | 'PACED_STABILITY' | 'HIGH_VOLUME_COMPOUND';
}

export interface SovereignMonetaryDirectiveState {
  status: 'LOCKED & ACTIVE';
  V_system: number; // Treasury Reserve IDR
  Q_total_pending_eggs: number; // Total butir siap panen across all coops
  Q_total_pending_kg: number; // Total bobot kg
  H_broker_average: number; // Weighted average broker buy price
  V_harvest: number; // Q * H_broker total liability
  alpha_buffer: number; // 0.15 (15% emergency liquidity buffer)
  required_reserve_with_buffer: number; // (1 + alpha) * V_harvest
  reserve_surplus_idr: number; // V_system - required_reserve_with_buffer
  liquidity_ratio_percent: number; // (V_system / required_reserve) * 100
  isInvariantSatisfied: boolean; // V_system >= (1 + alpha) * V_harvest
  expansionStatus: 'PERMITTED' | 'THROTTLED_BUFFER_PROTECTION';
  hppBreakdown: SovereignHPPBreakdown;
  pricingValidations: SovereignPricingValidation[];
  flowRate: SovereignFlowRateMetrics;
  infiniteAbsorption: {
    totalAbsorbedAllTimeEggs: number;
    totalAbsorbedAllTimeKg: number;
    totalCashPaidToFarmersIdr: number;
    zeroRejectionGuarantee: boolean;
    mortalityRiskRatePercent: number;
  };
  lastEvaluatedAt: string;
}





