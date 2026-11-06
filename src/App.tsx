import React, { useState, useEffect, useMemo } from 'react';
import {
  FarmerIdentity,
  FarmBalances,
  BiologicalCycle,
  LedgerEntry,
  CatalogItem,
  Web3TransactionReceipt,
  P2PReceipt,
  EmergencyDirective,
  MetaverseCoopItem,
  ActiveCoopRental,
  InfrastructurePackage,
  AutoCompoundConfig,
  SupportedPaymentChannel,
  OwnerCashoutDestination,
  CoopUnit,
  UserProfileData,
  FarmerAccount,
} from './types/farm';
import { INITIAL_CATALOG } from './data/catalogData';
import { METAVERSE_COOP_CATALOG, INFRASTRUCTURE_PACKAGES } from './data/metaverseCoopData';
import { getOrCreateSovereignWallet, IDR_PER_EGG } from './services/web3Service';
import { formatRupiah, formatEth, shortenAddress } from './utils/formatters';
import { sounds } from './utils/soundEffects';
import { calculateEmergencyDirective } from './utils/emergencyEngine';
import { useMetaMask } from './hooks/useMetaMask';
import { OWNER_METAMASK_ADDRESS } from './config/web3Config';
import { OFFICIAL_BCA_CONFIG } from './config/bankConfig';

import { SovereignIdentityHeader } from './components/SovereignIdentityHeader';
import { EmergencyAlertBanner } from './components/EmergencyAlertBanner';
import { PoultryLifecyclePipeline } from './components/PoultryLifecyclePipeline';
import { ClimateControlPanel } from './components/ClimateControlPanel';
import { MarketPriceBoard } from './components/MarketPriceBoard';
import { FarmVisualizer } from './components/FarmVisualizer';
import { MultiCoopManager } from './components/MultiCoopManager';
import { MetaverseCoopRental } from './components/MetaverseCoopRental';
import { PartialAutoCompoundPanel } from './components/PartialAutoCompoundPanel';
import { OwnerTreasurySettlementModal } from './components/OwnerTreasurySettlementModal';
import { UserProfileModal } from './components/UserProfileModal';
import { CatalogTable } from './components/CatalogTable';
import { LiveLedger } from './components/LiveLedger';
import { TopUpModal } from './components/TopUpModal';
import { WithdrawModal } from './components/WithdrawModal';
import { P2PQrisBarcodeModal } from './components/P2PQrisBarcodeModal';
import { TwoWayConfirmationModal } from './components/TwoWayConfirmationModal';
import { EtherscanModal } from './components/EtherscanModal';
import { SmartContractViewer } from './components/SmartContractViewer';
import { GramasiBusinessModal } from './components/GramasiBusinessModal';
import { AgroFiOracleBar } from './components/AgroFiOracleBar';
import { GlobalFarmerOnboardingModal } from './components/GlobalFarmerOnboardingModal';
import { GlobalCoopNetworkMap } from './components/GlobalCoopNetworkMap';
import { GlobalReadinessAuditModal } from './components/GlobalReadinessAuditModal';
import { PersonalFarmerDashboard } from './components/PersonalFarmerDashboard';
import { FarmerAccountSwitcherModal } from './components/FarmerAccountSwitcherModal';
import { SovereignMonetaryDirectiveModal } from './components/SovereignMonetaryDirectiveModal';
import { AboutGamegrafityModal } from './components/AboutGamegrafityModal';
import { AuthModal, AuthUser } from './components/AuthModal';
import { SupportedLanguage, SupportedCurrency } from './utils/i18n';
import { INITIAL_MARKET_PRICES } from './data/marketPriceData';
import { ClimateMode, MarketPriceItem } from './types/farm';
import { CreditCard, TrendingUp, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Initialize sovereign wallet using ethers
  const { wallet: signerWallet } = useMemo(() => getOrCreateSovereignWallet(), []);

  // Farmer Identity State
  const [farmer, setFarmer] = useState<FarmerIdentity>(() => {
    return {
      mode: 'legacy',
      name: 'Riska', // Initially legacy 'Riska', purged upon sovereign mode / smart contract
      walletAddress: signerWallet.address,
      ensName: 'sovereign.gamegrafity.eth',
      did: `did:pkh:eip155:1:${signerWallet.address}`,
      isSmartContractActive: false,
      avatarSeed: signerWallet.address.substring(2, 8),
    };
  });

  // Balances State (Matches prompt starting balances)
  const [balances, setBalances] = useState<FarmBalances>({
    kasTreasuryOwner: 13950000, // Rp 13.950.000
    saldoDompetSaya: 100000, // Rp 100.000
    ethBalance: 0.285, // Web3 ETH reserve
    totalEggHarvestedAllTime: 420,
    totalWithdrawnIdr: 0,
    totalWithdrawnEth: 0,
    totalGramasiSoldKg: 26.25, // Total timbangan kg terjual
  });

  // Real Biological Cycle & Cohorts State (Realistic breakdown for 40 birds)
  const [cycle, setCycle] = useState<BiologicalCycle>({
    phase: 'Produktif Normal',
    population: 40, // 40 Ekor (2 Jantan : 38 Betina)
    roosters: 2, // 2 Jantan pemacek
    hens: 38, // 38 Betina total: 6 DOC + 4 Pullet + 26 Layer Produktif + 2 Afkir
    accumulatedEggs: 120, // 120 Butir siap panen broker
    selectedEggGrade: 'GRADE_B', // Standar acuan pasar nasional (Pinsar)
    biosecurityHealth: 100, // 100% (Aman)
    feedStockKg: 85,
    electricityDaysRemaining: 7,
    acClimateDaysRemaining: 7, // Sewa AC conditioner & suhu api
    ambientTempC: 24.2, // Suhu ideal 24°C
    targetTempC: 24.0,
    humidityRh: 65, // Kelembaban 65% RH
    climateMode: 'AUTO',
    heatStressActive: false,
    incubatorUnits: 0,
    landPlots: 1,
    modernCoopDaysRemaining: 0,
    dayCount: 1,
    cohorts: {
      incubatingEggs: 0, // Telur di mesin tetas (Hari 1-21)
      incubationProgressDays: 0,
      chicksDocCount: 6, // 6 Ekor DOC (Minggu 0-6, Rentan Virus)
      growerPulletCount: 4, // 4 Ekor Dara Pullet (Minggu 7-18, Non-Produksi)
      layerProductiveCount: 26, // 26 Ekor Indukan Bertelur Puncak (Minggu 19-72)
      spentHensAfkirCount: 2, // 2 Ekor Ayam Afkir Tua (Minggu 73+, Non-Produksi)
      sickChicksCount: 0, // Gejala virus
      virusDetected: false,
      virusName: 'None',
      virusSymptoms: 'None',
    },
  });

  // Live Ledger State (Initial logs precisely matching user prompt)
  const [ledger, setLedger] = useState<LedgerEntry[]>([
    {
      id: 'log-1',
      timestamp: '14.03.52',
      rawTime: Date.now() - 60000,
      title: 'TOP-UP QRIS (Riska)',
      description: 'Berhasil mengisi saldo sebesar Rp 100.000.',
      actor: 'Riska',
      category: 'TOPUP',
      amountIdr: 100000,
      isSuccess: true,
    },
    {
      id: 'log-2',
      timestamp: '14.03.43',
      rawTime: Date.now() - 120000,
      title: 'Gagal membeli Vitamin',
      description: 'Saldo tidak cukup.',
      actor: 'Riska',
      category: 'PURCHASE',
      amountIdr: 25000,
      isSuccess: false,
    },
    {
      id: 'log-3',
      timestamp: '14.03.36',
      rawTime: Date.now() - 180000,
      title: 'PEMBELIAN (Riska)',
      description: "Membeli 'Mesin Tetas' seharga Rp 1.500.000. Kas Owner bertambah.",
      actor: 'Riska',
      category: 'PURCHASE',
      amountIdr: 1500000,
      isSuccess: true,
    },
    {
      id: 'log-4',
      timestamp: '14.03.06',
      rawTime: Date.now() - 240000,
      title: 'Autentikasi berhasil',
      description: 'Selamat datang kembali, Riska!',
      actor: 'Riska',
      category: 'SYSTEM',
      isSuccess: true,
    },
    {
      id: 'log-5',
      timestamp: '00:00',
      rawTime: Date.now() - 3600000,
      title: 'Ledger sistem diinisialisasi untuk Riska',
      description: 'Menunggu transaksi...',
      actor: 'Riska',
      category: 'SYSTEM',
      isSuccess: true,
    },
  ]);

  // Real MetaMask Web3 Provider Integration (window.ethereum)
  const {
    account: metaMaskAccount,
    connect: connectMetaMask,
    disconnect: disconnectMetaMask,
    balanceEth: metaMaskBalanceEth,
  } = useMetaMask();

  // User Profile & Role Settings State (Default: Mudhofar, Owner)
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => {
    return {
      fullName: localStorage.getItem('gamegrafity_profile_name') || 'Mudhofar',
      role: (localStorage.getItem('gamegrafity_profile_role') as 'owner' | 'peternak') || 'owner',
      walletAddress: localStorage.getItem('gamegrafity_profile_wallet') || null,
    };
  });
  const [isOpenProfileModal, setIsOpenProfileModal] = useState<boolean>(false);

  // Multi-Coop Manager & Mesin Tetas State (Scalable: 10 -> 20 -> 40 -> 1.000 -> 6.000 ekor)
  const [coops, setCoops] = useState<CoopUnit[]>([
    {
      id: 1,
      name: 'Kandang Starter #1',
      capacity: 150,
      status: 'Active',
      chickenCount: 40,
      tier: 'Starter Semi-Closed',
      dailyEggs: 35,
      feedDailyKg: 5,
      tempC: 24.2,
      humidityRh: 65,
      ammoniaPpm: 7.8,
    },
  ]);
  const [totalHatcheryStock, setTotalHatcheryStock] = useState<number>(50);

  // Modal States
  const [isOpenTopUp, setIsOpenTopUp] = useState<boolean>(false);
  const [isOpenWithdraw, setIsOpenWithdraw] = useState<boolean>(false);
  const [isOpenContractViewer, setIsOpenContractViewer] = useState<boolean>(false);
  const [isOpenGramasiModal, setIsOpenGramasiModal] = useState<boolean>(false);
  const [isOpenEtherscanConsole, setIsOpenEtherscanConsole] = useState<boolean>(false);
  const [isOpenOwnerTreasuryModal, setIsOpenOwnerTreasuryModal] = useState<boolean>(false);
  const [isOpenQrisModal, setIsOpenQrisModal] = useState<boolean>(false);
  const [isOpenTwoWayModal, setIsOpenTwoWayModal] = useState<boolean>(false);
  const [twoWayTargetService, setTwoWayTargetService] = useState<{ name: string; amountIdr: number; channel?: any } | undefined>(undefined);
  const [twoWayPendingCount, setTwoWayPendingCount] = useState<number>(1);
  const [activeEtherscanReceipt, setActiveEtherscanReceipt] = useState<Web3TransactionReceipt | null>(null);

  // Personalized Farmer Dashboard & User Management State
  const [activeFarmerId, setActiveFarmerId] = useState<string>('farmer-ahmad');
  const [activeFarmer, setActiveFarmer] = useState<FarmerAccount | null>(null);
  const [isOpenFarmerSwitcher, setIsOpenFarmerSwitcher] = useState<boolean>(false);
  const [isOpenMonetaryDirectiveModal, setIsOpenMonetaryDirectiveModal] = useState<boolean>(false);
  const [isOpenAboutModal, setIsOpenAboutModal] = useState<boolean>(false);
  
  // Neon PostgreSQL farmers_users Auth State
  const [isOpenAuthModal, setIsOpenAuthModal] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('gamegrafity_auth_user');
      return saved ? JSON.parse(saved) : {
        id: 1,
        google_email: 'uangnyagoparbanyak@gmail.com',
        full_name: 'Mudhofar (Founder & Sovereign Owner)',
        signup_date: new Date(Date.now() - 86400000 * 14).toISOString(),
        last_sign_in: new Date().toISOString(),
        last_sign_out: null,
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'owner' as const
      };
    } catch {
      return null;
    }
  });

  // Active Metaverse Coop & Infrastructure Rental State
  const [activeCoopRental, setActiveCoopRental] = useState<ActiveCoopRental | null>({
    coopId: 'kandang-bertingkat-iot',
    name: 'Kandang Bertingkat IoT',
    tier: 'Smart Multi-Tier Closed House',
    status: 'AKTIF',
    rentedAt: Date.now() - 3600000 * 2,
    expiresAt: Date.now() + 29 * 86400 * 1000 + 23 * 3600 * 1000 + 58 * 60 * 1000,
    durationDays: 30,
    monthlyRentIdr: 1850000,
    contractCode: 'COOP-IOT-2026-X891',
    txHash: '0x8f2a938b4efc891102b3c45781a9f029381746251bdf28172938472910ab',
    capacityBirds: 500,
    iotTelemetry: {
      tempC: 24.2,
      targetTempC: 24.0,
      humidityRh: 65,
      targetHumidityRh: 65,
      ammoniaPpm: 7.8,
      coolingPadActive: true,
      exhaustFanRpm: 1450,
      airVelocityMs: 2.4,
      lastSyncTime: 'Real-Time IoT Active',
      sensorHealthPercent: 99,
    },
  });

  // Partial Auto-Compound Configuration State (50-60% Tunai : 40-50% Diputar Otomatis)
  const [autoCompoundConfig, setAutoCompoundConfig] = useState<AutoCompoundConfig>({
    isEnabled: true,
    cashPayoutPercent: 60,
    autoCompoundPercent: 40,
    targetReinvestment: 'HYBRID_GROWTH',
    totalCompoundedAmountIdr: 450000,
    totalAdditionalBirdsFromCompound: 10,
    totalFeedStockPurchasedKg: 65,
    compoundingCyclesCompleted: 3,
    lastCompoundedAt: 'Hari ini (Siklus Panen)',
    projectedMonthlyGrowthRatePercent: 18.5,
  });

  // Target checkout package for direct payment activation (QRIS/DANA/BCA/Web3)
  const [targetCheckoutPackage, setTargetCheckoutPackage] = useState<InfrastructurePackage | null>(null);

  // Global Readiness & International Cooperative States
  const [isOpenGlobalOnboarding, setIsOpenGlobalOnboarding] = useState<boolean>(false);
  const [isOpenGlobalCoopMap, setIsOpenGlobalCoopMap] = useState<boolean>(false);
  const [isOpenGlobalAudit, setIsOpenGlobalAudit] = useState<boolean>(false);
  const [lang, setLang] = useState<SupportedLanguage>('id');
  const [activeCurrency, setActiveCurrency] = useState<SupportedCurrency>('IDR');
  const [farmerCountry, setFarmerCountry] = useState({
    name: 'Indonesia (Genesis Origin)',
    code: 'ID',
    flag: '🇮🇩',
    flockSize: 40,
  });

  // Real-Time Domestic & Global Poultry Market Prices State
  const [marketPrices, setMarketPrices] = useState<MarketPriceItem[]>(INITIAL_MARKET_PRICES);

  // View & UI Preferences
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Automated Emergency Priority Directive Calculation
  const emergencyDirective = useMemo(() => {
    return calculateEmergencyDirective(cycle, balances);
  }, [cycle, balances]);

  // Check if critical siren sound should be played upon state changes
  useEffect(() => {
    if (emergencyDirective.urgencyLevel === 'CRITICAL' && soundEnabled) {
      sounds.playEmergencyAlarm();
    }
  }, [emergencyDirective.urgencyLevel, cycle.cohorts.sickChicksCount]);

  // Fetch active farmer account data
  const fetchActiveFarmer = async () => {
    try {
      const res = await fetch(`/api/farmer-accounts/${activeFarmerId}`);
      const data = await res.json();
      if (data.success && data.account) {
        setActiveFarmer(data.account);
      }
    } catch (err) {
      console.error('Failed to fetch active farmer account:', err);
    }
  };

  useEffect(() => {
    fetchActiveFarmer();
  }, [activeFarmerId]);

  // Automated daily production runner: ticks eggs & sensors every 8 seconds when active
  useEffect(() => {
    if (!activeFarmer || activeFarmer.status !== 'ACTIVE') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/farmer-accounts/${activeFarmer.id}/production-tick`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ incrementEggs: 4 })
        });
        const data = await res.json();
        if (data.success && data.liveProduction) {
          setActiveFarmer((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              liveProduction: data.liveProduction
            };
          });
        }
      } catch (_) {}
    }, 8000);

    return () => clearInterval(interval);
  }, [activeFarmer?.id, activeFarmer?.status]);

  // Helper to add ledger entry
  const addLedger = (
    title: string,
    description: string,
    category: LedgerEntry['category'],
    isSuccess = true,
    amountIdr?: number,
    amountEth?: number,
    txHash?: string,
    p2pRefId?: string
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}.${String(now.getSeconds()).padStart(2, '0')}`;
    const actorLabel = farmer.mode === 'sovereign' ? 'Sovereign Node' : farmer.name;

    const newEntry: LedgerEntry = {
      id: 'log-' + Date.now() + Math.random().toString(36).substring(2, 5),
      timestamp: timeStr,
      rawTime: Date.now(),
      title: `${title} (${actorLabel})`,
      description,
      actor: actorLabel,
      category,
      amountIdr,
      amountEth,
      isSuccess,
      txHash,
      p2pRefId,
    };

    setLedger((prev) => [newEntry, ...prev]);
  };

  // Auth Handler: Google & Manual Sign In/Up
  const handleAuthSuccess = (user: AuthUser) => {
    setAuthUser(user);
    localStorage.setItem('gamegrafity_auth_user', JSON.stringify(user));
    setUserProfile({
      fullName: user.full_name,
      role: user.role,
      walletAddress: userProfile.walletAddress
    });
    addLedger(
      'AUTENTIKASI GMAIL / GOOGLE BERHASIL',
      `Pengguna '${user.full_name}' (${user.google_email}) berhasil autentikasi. Data sesi dicatat ke tabel Neon PostgreSQL farmers_users (last_sign_in diperbarui).`,
      'SYSTEM',
      true
    );
  };

  // Auth Handler: Sign Out
  const handleSignOut = () => {
    if (authUser?.google_email) {
      addLedger(
        'SIGN OUT PENGGUNA',
        `Sesi '${authUser.google_email}' telah berakhir. Kolom last_sign_out diperbarui ke waktu saat ini.`,
        'SYSTEM',
        true
      );
    }
    setAuthUser(null);
    localStorage.removeItem('gamegrafity_auth_user');
  };

  // Function to transition to Sovereign Mode and cleanse legacy name "Riska"
  const activateSovereignMode = () => {
    setFarmer((prev) => ({
      ...prev,
      mode: 'sovereign',
      name: `${prev.walletAddress.substring(0, 6)}...${prev.walletAddress.substring(prev.walletAddress.length - 4)} (Sovereign)`,
      isSmartContractActive: true,
    }));

    // Cleanse ledger entries of the legacy name
    setLedger((prev) =>
      prev.map((entry) => ({
        ...entry,
        title: entry.title.replace(/\(Riska\)/g, '(Sovereign Node)').replace(/Riska/g, 'Sovereign Node'),
        actor: 'Sovereign Node',
      }))
    );

    // Add milestone ledger entry
    addLedger(
      'TRANSISI KE SOVEREIGN MODE WEB3',
      `Identitas legacy peternak (Riska) telah dibersihkan. Node diikat langsung ke Smart Contract GamegrafityFarmCore.sol (DID: ${signerWallet.address.substring(0, 8)}...).`,
      'SYSTEM',
      true
    );
  };

  const handleToggleSovereignMode = () => {
    if (farmer.mode === 'legacy') {
      activateSovereignMode();
    } else {
      setFarmer((prev) => ({
        ...prev,
        mode: 'legacy',
        name: userProfile.fullName || 'Riska',
        isSmartContractActive: false,
      }));
    }
  };

  // Synchronize MetaMask Web3 Provider Account when connected
  useEffect(() => {
    if (metaMaskAccount) {
      setFarmer((prev) => ({
        ...prev,
        walletAddress: metaMaskAccount,
        mode: 'sovereign',
        name: `${metaMaskAccount.substring(0, 6)}...${metaMaskAccount.substring(metaMaskAccount.length - 4)} (${userProfile.fullName || 'Sovereign'})`,
        isSmartContractActive: true,
      }));
      setUserProfile((prev) => ({
        ...prev,
        walletAddress: metaMaskAccount,
      }));
      addLedger(
        'METAMASK WEB3 TERHUBUNG',
        `Dompet MetaMask terhubung (${shortenAddress(metaMaskAccount)}). Saldo: ${metaMaskBalanceEth || '0.00'} ETH. Transaksi on-chain terarah langsung ke Treasury Owner ${OWNER_METAMASK_ADDRESS}.`,
        'SYSTEM',
        true
      );
    }
  }, [metaMaskAccount, metaMaskBalanceEth, userProfile.fullName]);

  // Polling / initial fetch for Two-Way Confirmation pending count
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch('/api/p2p/two-way-confirmations');
        const data = await res.json();
        if (data.success && typeof data.pendingCount === 'number') {
          setTwoWayPendingCount(data.pendingCount);
        }
      } catch (_) {}
    };
    fetchPending();
    const interval = setInterval(fetchPending, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handle Two-Way Payment Approved by Owner/Admin
  const handlePaymentApprovedFromTwoWay = (record: any) => {
    // 1. Credit Kas Treasury Owner
    setBalances((prev) => ({
      ...prev,
      kasTreasuryOwner: prev.kasTreasuryOwner + (record.amountIdr || 0),
    }));

    // 2. Unlock module or activate package if matches
    if (record.serviceName?.includes('Pro IoT') || record.serviceName?.includes('Starter') || record.serviceName?.includes('Sovereign')) {
      const durationDays = 30;
      const newExpires = Date.now() + durationDays * 86400 * 1000;
      setActiveCoopRental(() => ({
        coopId: record.serviceName.includes('Pro IoT') ? 'kandang-bertingkat-iot' : 'kandang-standar',
        name: record.serviceName,
        tier: record.serviceName.includes('Pro IoT') ? 'Smart Multi-Tier Closed House' : 'Starter Semi-Closed',
        status: 'AKTIF',
        rentedAt: Date.now(),
        expiresAt: newExpires,
        durationDays,
        monthlyRentIdr: record.amountIdr,
        contractCode: record.contractCode || 'COOP-TWOWAY-' + Math.floor(1000 + Math.random() * 9000),
        txHash: record.txHash || '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        capacityBirds: record.serviceName.includes('Mega') ? 1500 : record.serviceName.includes('Pro IoT') ? 500 : 150,
        iotTelemetry: {
          tempC: cycle.ambientTempC,
          targetTempC: cycle.targetTempC,
          humidityRh: cycle.humidityRh,
          targetHumidityRh: 65,
          ammoniaPpm: 7.2,
          coolingPadActive: true,
          exhaustFanRpm: 1450,
          airVelocityMs: 2.4,
          lastSyncTime: 'Real-Time IoT Active (Approved)',
          sensorHealthPercent: 100,
        },
      }));
    } else if (record.serviceName?.includes('Top-Up')) {
      setBalances((prev) => ({
        ...prev,
        saldoDompetSaya: prev.saldoDompetSaya + (record.amountIdr || 0),
      }));
    }

    // 3. Add to Live Ledger
    addLedger(
      'KONFIRMASI 2-ARAH: OWNER APPROVE',
      `Penerima (${record.receiverApprovedBy || 'Mudhofar'}) telah memvalidasi mutasi DANA dan menyetujui pembayaran ${record.id} (${formatRupiah(record.amountIdr)}). Akses '${record.unlockedModule}' resmi aktif!`,
      'SYSTEM',
      true,
      record.amountIdr,
      undefined,
      record.txHash
    );

    setTwoWayPendingCount((prev) => Math.max(0, prev - 1));
  };

  // ======================== MANAJEMEN MULTI-KANDANG & MESIN TETAS (10 - 6.000 EKOR) ========================
  const handleAddCoop = (newCoop: CoopUnit, costIdr: number) => {
    // Potong saldo dompet peternak & setorkan ke Kas Treasury Owner (+Rp 750.000)
    setBalances((prev) => ({
      ...prev,
      saldoDompetSaya: Math.max(0, prev.saldoDompetSaya - costIdr),
      kasTreasuryOwner: prev.kasTreasuryOwner + costIdr,
    }));

    setCoops((prev) => [...prev, newCoop]);

    // Sinkronisasi pertumbuhan biologis ke cycle
    setCycle((prev) => ({
      ...prev,
      population: prev.population + newCoop.chickenCount,
      hens: prev.hens + newCoop.chickenCount,
      landPlots: prev.landPlots + 1,
      cohorts: {
        ...prev.cohorts,
        layerProductiveCount: prev.cohorts.layerProductiveCount + newCoop.chickenCount,
      },
    }));

    addLedger(
      'EKSPANSI MULTI-KANDANG & SUPLAI HULU',
      `Membuka ${newCoop.name} (Kapasitas: ${newCoop.capacity} ekor). Biaya sewa lahan & suplai hulu ${formatRupiah(costIdr)} disetorkan ke Kas Treasury Owner. Total ayam bertambah +${newCoop.chickenCount} ekor menuju target 6.000 ekor.`,
      'PURCHASE',
      true,
      costIdr
    );

    try {
      fetch('/api/multi-coops/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ costIdr, farmerAddress: metaMaskAccount || signerWallet.address }),
      }).catch(() => {});
    } catch (_) {}
  };

  const handleIncubateHatch = (coopId: number, count: number) => {
    if (totalHatcheryStock < count) return;

    setTotalHatcheryStock((prev) => Math.max(0, prev - count));
    setCoops((prev) =>
      prev.map((c) => {
        if (c.id === coopId) {
          const newCount = Math.min(c.capacity, c.chickenCount + count);
          return {
            ...c,
            chickenCount: newCount,
            status: newCount >= c.capacity ? 'Full' : 'Active',
            dailyEggs: Math.floor(newCount * 0.88),
            feedDailyKg: Math.round(newCount * 0.12),
          };
        }
        return c;
      })
    );

    setCycle((prev) => ({
      ...prev,
      population: prev.population + count,
      hens: prev.hens + count,
      cohorts: {
        ...prev.cohorts,
        layerProductiveCount: prev.cohorts.layerProductiveCount + count,
      },
    }));

    addLedger(
      'MENETASKAN DOC MESIN TETAS',
      `Menetaskan ${count} ekor DOC dari mesin tetas ke Kandang #${coopId}. Pertumbuhan populasi unggas berdaulat tanpa modal luar.`,
      'CYCLE',
      true
    );
  };

  // Handler saat peternak dunia menyelesaikan pendaftaran global
  const handleCompleteGlobalOnboarding = (data: {
    farmName: string;
    country: string;
    countryCode: string;
    flag: string;
    flockSize: number;
    housingSystem: string;
    certifications: string[];
    payoutRail: string;
    currency: SupportedCurrency;
    did: string;
    ensName: string;
    txHash?: string;
    blockNumber?: number;
  }) => {
    setFarmerCountry({
      name: data.country,
      code: data.countryCode,
      flag: data.flag,
      flockSize: data.flockSize,
    });
    setActiveCurrency(data.currency);

    // Otomatis aktifkan sovereign mode dan ganti nama peternak
    setFarmer((prev) => ({
      ...prev,
      mode: 'sovereign',
      name: data.farmName,
      did: data.did,
      ensName: data.ensName,
      isSmartContractActive: true,
    }));

    // Sesuaikan proporsi kawanan ayam sesuai skala baru
    if (data.flockSize > 100) {
      const layers = Math.floor(data.flockSize * 0.72);
      const pullets = Math.floor(data.flockSize * 0.15);
      const chicks = Math.floor(data.flockSize * 0.08);
      const afkir = Math.floor(data.flockSize * 0.02);
      const roosters = Math.max(2, Math.floor(data.flockSize * 0.03));
      const hens = layers + pullets + chicks + afkir;

      setCycle((prev) => ({
        ...prev,
        population: data.flockSize,
        hens,
        roosters,
        accumulatedEggs: Math.floor(layers * 0.9),
        feedStockKg: Math.max(100, Math.floor((data.flockSize * 115 * 5) / 1000)),
        cohorts: {
          ...prev.cohorts,
          layerProductiveCount: layers,
          growerPulletCount: pullets,
          chicksDocCount: chicks,
          spentHensAfkirCount: afkir,
          sickChicksCount: 0,
        },
      }));
    }

    addLedger(
      `PENDAFTARAN SOVEREIGN GLOBAL (${data.flag} ${data.country})`,
      `Peternakan '${data.farmName}' resmi terakreditasi di Federasi Sovereign Dunia dengan DID ${data.did.substring(0, 24)}... Smart Contract GamegrafityFarmCore: Confirmed di Block #${data.blockNumber || 21049360}. Standar: ${data.certifications.slice(0, 2).join(', ')}.`,
      'SYSTEM',
      true,
      undefined,
      undefined,
      data.txHash
    );

    try {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
      });
    } catch (_) {}
  };

  // ======================== PROTOKOL JUNKFOOD & PENYELAMATAN VIRUS ========================
  // Jual anak ayam bergejala virus ke pabrik olahan junkfood sebelum mati
  const handleSalvageSickChicks = () => {
    const sickCount = cycle.cohorts.sickChicksCount;
    if (sickCount <= 0) return;

    const salvageValue = sickCount * 15000; // Rp 15.000 / ekor salvage value

    setBalances((prev) => ({
      ...prev,
      saldoDompetSaya: prev.saldoDompetSaya + salvageValue,
    }));

    setCycle((prev) => {
      const remainingChicks = Math.max(0, prev.cohorts.chicksDocCount - sickCount);
      const newHens = prev.hens - sickCount;
      const newPop = prev.population - sickCount;

      return {
        ...prev,
        population: newPop,
        hens: newHens,
        biosecurityHealth: Math.min(100, prev.biosecurityHealth + 15),
        cohorts: {
          ...prev.cohorts,
          chicksDocCount: remainingChicks,
          sickChicksCount: 0,
          virusDetected: false,
          virusName: 'None',
          virusSymptoms: 'None',
        },
      };
    });

    sounds.playCash();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    addLedger(
      'SALVAGE JUNKFOOD (ELIMINASI KERUGIAN)',
      `Berhasil menjual ${sickCount} ekor anak ayam bergejala virus ke rantai pasok industri olahan junkfood. Menerima +${formatRupiah(salvageValue)} tunai dan memulihkan sanitasi kandang!`,
      'SALVAGE',
      true,
      salvageValue
    );
  };

  // ======================== PENJUALAN AYAM AFKIR TUA KE KARKAS ========================
  const handleSellSpentHens = () => {
    const spentCount = cycle.cohorts.spentHensAfkirCount;
    if (spentCount <= 0) return;

    const karkasValue = spentCount * 38000; // Rp 38.000 / ekor

    setBalances((prev) => ({
      ...prev,
      saldoDompetSaya: prev.saldoDompetSaya + karkasValue,
    }));

    setCycle((prev) => {
      const newHens = prev.hens - spentCount;
      const newPop = prev.population - spentCount;

      return {
        ...prev,
        population: newPop,
        hens: newHens,
        cohorts: {
          ...prev.cohorts,
          spentHensAfkirCount: 0,
        },
      };
    });

    sounds.playCash();
    addLedger(
      'PENJUALAN AYAM AFKIR (PASAR KARKAS)',
      `Menjual ${spentCount} ekor layer tua non-produksi ke pedagang karkas daging potong seharga ${formatRupiah(karkasValue)}. Menghemat pakan dan menyegarkan modal bibit baru.`,
      'SALVAGE',
      true,
      karkasValue
    );
  };

  // ======================== MASUKKAN TELUR KE MESIN TETAS ========================
  const handleStartIncubationBatch = () => {
    if (cycle.accumulatedEggs < 10) {
      alert('Dibutuhkan minimal 10 butir telur fertil untuk mesin tetas.');
      return;
    }
    if (cycle.incubatorUnits === 0) {
      alert('Anda belum memiliki Mesin Tetas Otomatis! Silakan sewa/beli di katalog aset terlebih dahulu.');
      return;
    }

    const batchSize = Math.min(20, cycle.accumulatedEggs);

    setCycle((prev) => ({
      ...prev,
      accumulatedEggs: prev.accumulatedEggs - batchSize,
      cohorts: {
        ...prev.cohorts,
        incubatingEggs: batchSize,
        incubationProgressDays: 1,
      },
    }));

    sounds.playHarvest();
    addLedger(
      'INKUBASI MESIN TETAS',
      `Memasukkan ${batchSize} butir telur fertil ke Mesin Tetas Otomatis. Siklus inkubasi 21 hari dimulai hingga menetas menjadi DOC.`,
      'CYCLE',
      true
    );
  };

  // ======================== EKSEKUSI OTOMATIS DIRECTIVE ALARM ========================
  const handleExecuteDirectiveAction = () => {
    const { actionType, highlightTarget } = emergencyDirective;

    switch (actionType) {
      case 'JUNKFOOD_SALVAGE':
        handleSalvageSickChicks();
        break;

      case 'BUY_FEED': {
        const feedItem = INITIAL_CATALOG.find((i) => i.id === 'feed-concentrate');
        if (feedItem) {
          handlePurchase(feedItem, 3); // Beli 30 Kg
        }
        break;
      }

      case 'BUY_ELECTRICITY': {
        const elecItem = INITIAL_CATALOG.find((i) => i.id === 'electricity-ventilation');
        if (elecItem) {
          handlePurchase(elecItem, 1);
        }
        break;
      }

      case 'BUY_AC_CLIMATE': {
        const acItem = INITIAL_CATALOG.find((i) => i.id === 'ac-climate-controller');
        if (acItem) {
          handlePurchase(acItem, 1);
        }
        break;
      }

      case 'CALL_DOCTOR': {
        const doctorItem = INITIAL_CATALOG.find((i) => i.id === 'vitamin-biosecurity');
        if (doctorItem) {
          handlePurchase(doctorItem, 1);
        }
        break;
      }

      case 'SELL_SPENT_HENS':
        handleSellSpentHens();
        break;

      case 'HARVEST_EGGS':
        setIsOpenWithdraw(true);
        break;

      case 'NONE':
        handleAdvanceCycle();
        break;

      default:
        // Scroll to highlighted target
        if (highlightTarget) {
          const el = document.getElementById(highlightTarget);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        break;
    }
  };

  // ======================== MAJUKAN SIKLUS 1 HARI (REAL BIOLOGY) ========================
  const handleAdvanceCycle = () => {
    setCycle((prev) => {
      const { cohorts } = prev;
      const adultBirds = cohorts.layerProductiveCount + cohorts.growerPulletCount + cohorts.spentHensAfkirCount + prev.roosters;
      const chicks = cohorts.chicksDocCount;

      // Realistic daily feed consumption: ~120g/adult bird, ~40g/chick
      const feedNeeded = Math.ceil(adultBirds * 0.12 + chicks * 0.04);
      const hasEnoughFeed = prev.feedStockKg >= feedNeeded;

      // Realistic Lay Rate: ONLY Layer Produktif Bertelur! (Chicks, Pullets & Afkir = 0 eggs!)
      let newEggs = 0;
      if (hasEnoughFeed && prev.electricityDaysRemaining > 0) {
        // Lay rate 85% - 95% of productive layers
        const layRate = 0.85 + Math.random() * 0.1;
        newEggs = Math.floor(cohorts.layerProductiveCount * layRate);
      } else {
        // Underfed or dark/hot coop causes steep egg drop
        newEggs = Math.floor(cohorts.layerProductiveCount * 0.2);
      }

      // Incubation Lifecycle Progression (Hari 1 s/d 21)
      let nextIncubatingEggs = cohorts.incubatingEggs;
      let nextIncubationDays = cohorts.incubationProgressDays;
      let hatchedChicks = 0;

      if (nextIncubatingEggs > 0) {
        nextIncubationDays += 1;
        if (nextIncubationDays >= 21) {
          // Telur menetas menjadi anak ayam DOC!
          hatchedChicks = nextIncubatingEggs;
          nextIncubatingEggs = 0;
          nextIncubationDays = 0;
        }
      }

      // Cohort Ageing Transition Simulation (every 10 days)
      let nextChicks = cohorts.chicksDocCount + hatchedChicks;
      let nextGrower = cohorts.growerPulletCount;
      let nextLayer = cohorts.layerProductiveCount;
      let nextSpent = cohorts.spentHensAfkirCount;

      const nextDay = prev.dayCount + 1;

      // Pullets reach maturity (point of lay) -> become productive layers
      if (nextDay % 12 === 0 && nextGrower > 1) {
        const matured = 2;
        nextGrower -= matured;
        nextLayer += matured;
      }

      // Older layers reach end of productive life -> become spent afkir hens
      if (nextDay % 25 === 0 && nextLayer > 20) {
        const aged = 1;
        nextLayer -= aged;
        nextSpent += aged;
      }

      // Real virus hazard trigger if biosecurity or electricity is compromised
      let newSickChicks = cohorts.sickChicksCount;
      let virusDetected = cohorts.virusDetected;
      let virusName = cohorts.virusName;
      let virusSymptoms = cohorts.virusSymptoms;

      if ((prev.biosecurityHealth < 75 || prev.electricityDaysRemaining <= 0) && nextChicks > 0) {
        // 25% chance of virus symptoms appearing in chicks
        if (Math.random() < 0.35 && newSickChicks === 0) {
          newSickChicks = Math.min(nextChicks, Math.floor(2 + Math.random() * 4));
          virusDetected = true;
          virusName = 'Avian Adenovirus & Koksidiosis';
          virusSymptoms = 'Sayap terkulai, nafsu makan drop, kotoran kapur putih berbusa';
        }
      }

      // Climate & AC Conditioning Regulation
      const nextAcDays = Math.max(0, prev.acClimateDaysRemaining - 1);
      let nextTemp = prev.ambientTempC;
      let heatStress = false;

      if (nextAcDays > 0) {
        // Active AC Conditioner stabilizes temperature around target 24°C
        nextTemp = Number((prev.targetTempC + (Math.random() * 0.6 - 0.3)).toFixed(1));
        heatStress = false;
      } else {
        // Outside tropical heat raises coop temperature to 29.5°C - 32.5°C
        nextTemp = Number((29.5 + Math.random() * 3.0).toFixed(1));
        heatStress = true;
      }

      const nextFeed = Math.max(0, prev.feedStockKg - feedNeeded);
      const nextElectricity = Math.max(0, prev.electricityDaysRemaining - 1);
      const nextModernCoop = Math.max(0, prev.modernCoopDaysRemaining - 1);

      // Lay rate penalty if under heat stress
      if (heatStress) {
        newEggs = Math.floor(newEggs * 0.75); // 25% egg drop due to panting & heatstress
      }

      // Phase calculation
      let nextPhase = prev.phase;
      if (newSickChicks > 0) {
        nextPhase = 'Molting Ringan';
      } else if (heatStress) {
        nextPhase = 'Molting Ringan';
      } else if (nextDay % 10 === 0) {
        nextPhase = 'Puncak Ovulasi';
      } else {
        nextPhase = 'Produktif Normal';
      }

      const nextHens = nextChicks + nextGrower + nextLayer + nextSpent;
      const nextTotalPop = nextHens + prev.roosters;

      const updatedCycle: BiologicalCycle = {
        ...prev,
        dayCount: nextDay,
        phase: nextPhase,
        population: nextTotalPop,
        hens: nextHens,
        accumulatedEggs: prev.accumulatedEggs + newEggs,
        feedStockKg: nextFeed,
        electricityDaysRemaining: nextElectricity,
        acClimateDaysRemaining: nextAcDays,
        ambientTempC: nextTemp,
        heatStressActive: heatStress,
        modernCoopDaysRemaining: nextModernCoop,
        biosecurityHealth: hasEnoughFeed && nextElectricity > 0 && newSickChicks === 0 && !heatStress ? 100 : Math.max(45, prev.biosecurityHealth - (heatStress ? 12 : 8)),
        cohorts: {
          incubatingEggs: nextIncubatingEggs,
          incubationProgressDays: nextIncubationDays,
          chicksDocCount: nextChicks,
          growerPulletCount: nextGrower,
          layerProductiveCount: nextLayer,
          spentHensAfkirCount: nextSpent,
          sickChicksCount: newSickChicks,
          virusDetected,
          virusName,
          virusSymptoms,
        },
      };

      let summaryLog = `Hari ke-${nextDay}: Layer aktif bertelur +${newEggs} butir (Suhu: ${nextTemp}°C). Pakan terpakai: -${feedNeeded} Kg.`;
      if (heatStress) {
        summaryLog += ` ⚠️ Peringatan: Suhu kandang ${nextTemp}°C memicu heatstress (AC mati)! Produksi telur drop 25%.`;
      }
      if (hatchedChicks > 0) {
        summaryLog += ` 🐣 ${hatchedChicks} telur di inkubator berhasil menetas menjadi anak ayam DOC!`;
      }
      if (newSickChicks > 0) {
        summaryLog += ` ⚠️ PERINGATAN: ${newSickChicks} anak ayam terdeteksi virus ${virusName}! Segera jual ke junkfood!`;
      }

      addLedger('SIKLUS BIOLOGIS', summaryLog, 'CYCLE', true);

      return updatedCycle;
    });
  };

  // Quick feed action
  const handleFeedQuick = () => {
    setCycle((prev) => ({
      ...prev,
      feedStockKg: prev.feedStockKg + 20,
    }));
    sounds.playCash();
  };

  // Handle Payment & Top-Up Success (QRIS, DANA, BCA, Web3 Wallet)
  const handlePaymentSuccess = (amount: number, method: SupportedPaymentChannel, targetPackageId?: string) => {
    // If this payment is for direct package activation
    if (targetPackageId) {
      const targetPkg = INFRASTRUCTURE_PACKAGES.find((p) => p.id === targetPackageId);
      if (targetPkg) {
        // 1. Dana masuk dan menambah Kas Treasury Owner secara instan
        setBalances((prev) => ({
          ...prev,
          kasTreasuryOwner: prev.kasTreasuryOwner + amount,
        }));

        // 2. Status kandang otomatis berubah menjadi AKTIF
        const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const contractCode = `PKG-${targetPkg.tierLevel.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const expiresAt = Date.now() + 30 * 86400 * 1000;

        setActiveCoopRental({
          coopId: targetPkg.id,
          name: targetPkg.name,
          tier: targetPkg.tierLevel.toUpperCase(),
          status: 'AKTIF',
          rentedAt: Date.now(),
          expiresAt,
          durationDays: 30,
          monthlyRentIdr: amount,
          contractCode,
          txHash,
          capacityBirds: targetPkg.capacityBirds,
          packageId: targetPkg.id,
          packageName: targetPkg.name,
          iotTelemetry: {
            tempC: 24.0,
            targetTempC: 24.0,
            humidityRh: 65,
            targetHumidityRh: 65,
            ammoniaPpm: 7.2,
            coolingPadActive: true,
            exhaustFanRpm: 1450,
            airVelocityMs: 2.4,
            lastSyncTime: 'Baru saja (Real-Time)',
            sensorHealthPercent: 100,
          },
        });

        // 3. Update modern coop days in cycle & improve biosecurity & stabilize climate
        setCycle((prev) => ({
          ...prev,
          modernCoopDaysRemaining: prev.modernCoopDaysRemaining + 30,
          acClimateDaysRemaining: prev.acClimateDaysRemaining + 30,
          ambientTempC: prev.targetTempC,
          heatStressActive: false,
          biosecurityHealth: 100,
          landPlots: prev.landPlots + 1,
        }));

        sounds.playCash();

        // 4. Catat transaksi ke Live Ledger on-chain
        addLedger(
          `PEMBAYARAN LUNAS (${targetPkg.name})`,
          `Pembayaran via ${method} lunas sebesar ${formatRupiah(amount)}. Status kandang otomatis AKTIF. Kas Treasury Owner bertambah +${formatRupiah(amount)}. Sensor IoT (24°C / 65% RH / 7.2 PPM) & timer masa sewa 30 hari langsung berjalan 24/7. Kontrak: ${contractCode}.`,
          'PURCHASE',
          true,
          amount,
          undefined,
          txHash
        );

        // 5. Backend sync
        try {
          fetch('/api/payment/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              packageId: targetPkg.id,
              paymentChannel: method,
              amountIdr: amount,
              farmerAddress: signerWallet.address,
            }),
          }).catch(() => {});
        } catch (_) {}

        setTargetCheckoutPackage(null);
        return;
      }
    }

    // Regular Top-Up
    setBalances((prev) => ({
      ...prev,
      saldoDompetSaya: prev.saldoDompetSaya + amount,
    }));

    addLedger(
      `TOP-UP ${method}`,
      `Berhasil mengisi saldo sebesar ${formatRupiah(amount)} via ${method} tanpa biaya potongan broker.`,
      'TOPUP',
      true,
      amount
    );
  };

  // ======================== FITUR PARTIAL AUTO-COMPOUND ========================
  const handleExecuteCompoundBatch = (compoundAmountIdr: number, cashPayoutIdr: number) => {
    const addedBirds = Math.floor((compoundAmountIdr * 0.6) / 45000);
    const addedFeedKg = Math.floor((compoundAmountIdr * 0.4) / 7000);

    // 1. Porsi Tunai Cair masuk ke saldo peternak, porsi compound masuk ke Kas Owner (beli pakan/bibit)
    setBalances((prev) => ({
      ...prev,
      saldoDompetSaya: prev.saldoDompetSaya + cashPayoutIdr,
      kasTreasuryOwner: prev.kasTreasuryOwner + compoundAmountIdr,
    }));

    // 2. Tambah populasi ayam produktif & pakan secara otomatis tanpa modal baru
    setCycle((prev) => ({
      ...prev,
      population: prev.population + addedBirds,
      hens: prev.hens + addedBirds,
      feedStockKg: prev.feedStockKg + addedFeedKg,
      cohorts: {
        ...prev.cohorts,
        layerProductiveCount: prev.cohorts.layerProductiveCount + addedBirds,
      },
    }));

    // 3. Update auto-compound state
    setAutoCompoundConfig((prev) => ({
      ...prev,
      totalCompoundedAmountIdr: prev.totalCompoundedAmountIdr + compoundAmountIdr,
      totalAdditionalBirdsFromCompound: prev.totalAdditionalBirdsFromCompound + addedBirds,
      totalFeedStockPurchasedKg: prev.totalFeedStockPurchasedKg + addedFeedKg,
      compoundingCyclesCompleted: prev.compoundingCyclesCompleted + 1,
      lastCompoundedAt: 'Baru saja dieksekusi',
    }));

    // 4. Catat transaksi ke Live Ledger
    addLedger(
      'PARTIAL AUTO-COMPOUND DIEKSEKUSI',
      `Hasil panen di-split otomatis: ${autoCompoundConfig.cashPayoutPercent}% Tunai Cair (+${formatRupiah(cashPayoutIdr)}) masuk dompet peternak, dan ${autoCompoundConfig.autoCompoundPercent}% Reinvestasi (+${formatRupiah(compoundAmountIdr)}) otomatis membelikan +${addedBirds} ekor ayam produktif & +${addedFeedKg} kg pakan tanpa setor modal baru!`,
      'CYCLE',
      true,
      cashPayoutIdr
    );

    // 5. Backend sync
    try {
      fetch('/api/compound/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compoundAmountIdr,
          cashPayoutIdr,
        }),
      }).catch(() => {});
    } catch (_) {}
  };

  // ======================== SEWA KANDANG METAVERSE & INFRASTRUKTUR IOT ========================
  const handleRentCoop = (item: MetaverseCoopItem, durationDays = 30, totalCost = item.monthlyRentIdr) => {
    if (balances.saldoDompetSaya < totalCost) {
      sounds.playError();
      const kekurangan = totalCost - balances.saldoDompetSaya;
      alert(`Saldo dompet tidak cukup. Dibutuhkan ${formatRupiah(totalCost)}, saldo Anda ${formatRupiah(balances.saldoDompetSaya)}. Kurang ${formatRupiah(kekurangan)}.`);
      setIsOpenTopUp(true);
      return;
    }

    // 1. Potong saldo dompet peternak & otomatis tambah Kas Treasury Owner
    setBalances((prev) => ({
      ...prev,
      saldoDompetSaya: prev.saldoDompetSaya - totalCost,
      kasTreasuryOwner: prev.kasTreasuryOwner + totalCost,
    }));

    // 2. Ubah status kandang menjadi AKTIF dan perbarui hitung mundur masa sewa
    const currentExpires = (activeCoopRental && activeCoopRental.coopId === item.id && activeCoopRental.expiresAt > Date.now())
      ? activeCoopRental.expiresAt
      : Date.now();
    const newExpires = currentExpires + durationDays * 86400 * 1000;
    const contractCode = `COOP-${item.id.toUpperCase().replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    setActiveCoopRental({
      coopId: item.id,
      name: item.name,
      tier: item.tier,
      status: 'AKTIF',
      rentedAt: Date.now(),
      expiresAt: newExpires,
      durationDays: durationDays,
      monthlyRentIdr: item.monthlyRentIdr,
      contractCode,
      txHash,
      capacityBirds: item.capacityBirds,
      iotTelemetry: {
        tempC: cycle.ambientTempC,
        targetTempC: cycle.targetTempC,
        humidityRh: cycle.humidityRh,
        targetHumidityRh: 65,
        ammoniaPpm: 7.8,
        coolingPadActive: true,
        exhaustFanRpm: 1450,
        airVelocityMs: 2.4,
        lastSyncTime: 'Baru saja (Real-Time)',
        sensorHealthPercent: 100,
      },
    });

    // 3. Update modern coop days in cycle & improve biosecurity & stabilize climate
    setCycle((prev) => ({
      ...prev,
      modernCoopDaysRemaining: prev.modernCoopDaysRemaining + durationDays,
      acClimateDaysRemaining: prev.acClimateDaysRemaining + durationDays,
      ambientTempC: prev.targetTempC,
      heatStressActive: false,
      biosecurityHealth: Math.min(100, prev.biosecurityHealth + 20),
    }));

    sounds.playCash();

    // 4. Catat transaksi ke Live Ledger
    addLedger(
      `SEWA INFRASTRUKTUR (${item.name})`,
      `Berhasil menyewa '${item.name}' selama ${durationDays} hari seharga ${formatRupiah(totalCost)}. Saldo dompet peternak dipotong, Kas Treasury Owner bertambah +${formatRupiah(totalCost)}. Sensor IoT LoRaWAN aktif (Suhu ${cycle.ambientTempC}°C, Kelembapan ${cycle.humidityRh}% RH). Kontrak: ${contractCode}.`,
      'PURCHASE',
      true,
      totalCost,
      undefined,
      txHash
    );

    // Kirim sinkronisasi ke backend API
    try {
      fetch('/api/infrastructure/rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coopId: item.id,
          name: item.name,
          durationDays,
          costIdr: totalCost,
          farmerAddress: signerWallet.address,
        }),
      }).catch(() => {});
    } catch (_) {}
  };

  // ======================== SEWA PAKET BUNDLING INFRASTRUKTUR (Lahan + Kandang) ========================
  const handleRentPackage = (pkg: InfrastructurePackage, durationDays = 30, totalCost = pkg.totalMonthlyRentIdr) => {
    if (balances.saldoDompetSaya < totalCost) {
      sounds.playError();
      const kekurangan = totalCost - balances.saldoDompetSaya;
      alert(`Saldo dompet tidak cukup. Dibutuhkan ${formatRupiah(totalCost)}, saldo Anda ${formatRupiah(balances.saldoDompetSaya)}. Kurang ${formatRupiah(kekurangan)}. Silakan top-up terlebih dahulu.`);
      setIsOpenTopUp(true);
      return;
    }

    // 1. Potong saldo dompet peternak & otomatis tambah Kas Treasury Owner
    setBalances((prev) => ({
      ...prev,
      saldoDompetSaya: prev.saldoDompetSaya - totalCost,
      kasTreasuryOwner: prev.kasTreasuryOwner + totalCost,
    }));

    // 2. Ubah status kandang menjadi AKTIF dan perbarui hitung mundur masa sewa
    const currentExpires = (activeCoopRental && activeCoopRental.expiresAt > Date.now())
      ? activeCoopRental.expiresAt
      : Date.now();
    const newExpires = currentExpires + durationDays * 86400 * 1000;
    const contractCode = `PKG-${pkg.tierLevel.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    setActiveCoopRental({
      coopId: pkg.id,
      name: pkg.name,
      tier: pkg.tierLevel.toUpperCase(),
      status: 'AKTIF',
      rentedAt: Date.now(),
      expiresAt: newExpires,
      durationDays: durationDays,
      monthlyRentIdr: pkg.totalMonthlyRentIdr,
      contractCode,
      txHash,
      capacityBirds: pkg.capacityBirds,
      packageId: pkg.id,
      packageName: pkg.name,
      iotTelemetry: {
        tempC: 24.0,
        targetTempC: 24.0,
        humidityRh: 65,
        targetHumidityRh: 65,
        ammoniaPpm: 7.2,
        coolingPadActive: true,
        exhaustFanRpm: 1450,
        airVelocityMs: 2.4,
        lastSyncTime: 'Baru saja (Real-Time)',
        sensorHealthPercent: 100,
      },
    });

    // 3. Update modern coop days in cycle & improve biosecurity & stabilize climate
    setCycle((prev) => ({
      ...prev,
      modernCoopDaysRemaining: prev.modernCoopDaysRemaining + durationDays,
      acClimateDaysRemaining: prev.acClimateDaysRemaining + durationDays,
      ambientTempC: prev.targetTempC,
      heatStressActive: false,
      biosecurityHealth: 100,
      landPlots: prev.landPlots + 1,
    }));

    sounds.playCash();

    // 4. Catat transaksi ke Live Ledger
    addLedger(
      `SEWA PAKET BUNDLING (${pkg.name})`,
      `Berhasil menyewa '${pkg.name}' (Lahan + Kandang) selama ${durationDays} hari seharga ${formatRupiah(totalCost)}. Saldo dompet peternak dipotong, Kas Treasury Owner bertambah +${formatRupiah(totalCost)}. Kapasitas: ${pkg.capacityBirds} ekor ayam. Proyeksi Net Profit: ${pkg.projectedNetProfitMonthly.displayRange}. Kontrak on-chain: ${contractCode}.`,
      'PURCHASE',
      true,
      totalCost,
      undefined,
      txHash
    );

    // Sinkronisasi ke backend API
    try {
      fetch('/api/infrastructure/packages/rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          durationDays,
          costIdr: totalCost,
          farmerAddress: signerWallet.address,
        }),
      }).catch(() => {});
    } catch (_) {}
  };

  // Handle Purchase of Asset/Utility
  const handlePurchase = (item: CatalogItem, quantity = 1) => {
    const totalCost = item.price * quantity;

    if (balances.saldoDompetSaya < totalCost) {
      sounds.playError();
      addLedger(
        `Gagal membeli ${item.name}`,
        `Saldo tidak cukup. Dibutuhkan ${formatRupiah(totalCost)}, saldo saat ini ${formatRupiah(balances.saldoDompetSaya)}.`,
        'PURCHASE',
        false,
        totalCost
      );
      setIsOpenTopUp(true);
      return;
    }

    sounds.playCash();

    // Deduct from farmer wallet and add to Kas Treasury Owner
    setBalances((prev) => ({
      ...prev,
      saldoDompetSaya: prev.saldoDompetSaya - totalCost,
      kasTreasuryOwner: prev.kasTreasuryOwner + totalCost,
    }));

    // Apply gameplay farm perks
    setCycle((prev) => {
      let updated = { ...prev };
      switch (item.id) {
        case 'chick-pullet':
          // Adds grower pullet
          updated.population += 1;
          updated.hens += 1;
          updated.cohorts.growerPulletCount += 1;
          break;
        case 'feed-concentrate':
          updated.feedStockKg += 10 * quantity;
          break;
        case 'vitamin-biosecurity':
          updated.biosecurityHealth = 100;
          break;
        case 'automatic-incubator':
          updated.incubatorUnits += 1;
          break;
        case 'metaverse-land-plot':
          updated.landPlots += 1;
          break;
        case 'modern-coop-rental': {
          updated.modernCoopDaysRemaining += 30;
          const targetCoop = METAVERSE_COOP_CATALOG.find((c) => c.id === 'kandang-standar') || METAVERSE_COOP_CATALOG[0];
          const currentExp = (activeCoopRental && activeCoopRental.expiresAt > Date.now())
            ? activeCoopRental.expiresAt
            : Date.now();
          setActiveCoopRental({
            coopId: targetCoop.id,
            name: targetCoop.name,
            tier: targetCoop.tier,
            status: 'AKTIF',
            rentedAt: Date.now(),
            expiresAt: currentExp + 30 * 86400 * 1000,
            durationDays: 30,
            monthlyRentIdr: targetCoop.monthlyRentIdr,
            contractCode: `COOP-STD-${Math.floor(1000 + Math.random() * 9000)}`,
            txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            capacityBirds: targetCoop.capacityBirds,
            iotTelemetry: {
              tempC: updated.ambientTempC,
              targetTempC: updated.targetTempC,
              humidityRh: updated.humidityRh,
              targetHumidityRh: 65,
              ammoniaPpm: 8.2,
              coolingPadActive: true,
              exhaustFanRpm: 1200,
              airVelocityMs: 1.8,
              lastSyncTime: 'Baru saja (Real-Time)',
              sensorHealthPercent: 98,
            },
          });
          break;
        }
        case 'electricity-ventilation':
          updated.electricityDaysRemaining += 7;
          break;
        case 'doctor-specialist':
          updated.biosecurityHealth = 100;
          if (updated.cohorts.sickChicksCount > 0) {
            updated.cohorts.sickChicksCount = 0;
            updated.cohorts.virusDetected = false;
          }
          break;
        case 'ac-climate-controller':
          updated.acClimateDaysRemaining += 7 * quantity;
          updated.ambientTempC = updated.targetTempC;
          updated.heatStressActive = false;
          break;
      }
      return updated;
    });

    addLedger(
      'PEMBELIAN',
      `Membeli '${item.name}' seharga ${formatRupiah(totalCost)}. Kas Owner bertambah.`,
      'PURCHASE',
      true,
      totalCost
    );
  };

  // ======================== PENCAIRAN KAS TREASURY OWNER KE DUNIA NYATA ========================
  const handleExecuteOwnerCashout = (
    amountIdr: number,
    destination: OwnerCashoutDestination,
    account: string
  ) => {
    if (balances.kasTreasuryOwner < amountIdr) {
      sounds.playError();
      alert(`Saldo Kas Treasury Owner tidak mencukupi! Dibutuhkan ${formatRupiah(amountIdr)}, saldo kas saat ini ${formatRupiah(balances.kasTreasuryOwner)}.`);
      return;
    }

    // 1. Potong saldo Kas Treasury Owner
    setBalances((prev) => ({
      ...prev,
      kasTreasuryOwner: prev.kasTreasuryOwner - amountIdr,
    }));

    sounds.playCash();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
    });

    const destinationLabel =
      destination === 'BCA_CORPORATE'
        ? 'Rekening Bisnis PT Gamegrafity Agro (BCA)'
        : destination === 'MANDIRI_TREASURY'
        ? 'Mandiri Commercial Escrow'
        : destination === 'DANA_BUSINESS'
        ? 'DANA Merchant QRIS Settlement'
        : destination === 'WEB3_USDC_MAINNET'
        ? 'Web3 Multi-Sig Gnosis Safe (USDC)'
        : 'Platform Land Expansion Reserve Pool';

    // 2. Catat transaksi ke Live Ledger
    addLedger(
      'PENCAIRAN KAS TREASURY OWNER KE DUNIA NYATA',
      `Owner berhasil mencairkan keuntungan bersih sebesar ${formatRupiah(amountIdr)} ke ${destinationLabel} (${account}). Dana siap ditarik tunai atau dialokasikan untuk ekspansi aset peternakan global. Ref: SETTLE-${Date.now().toString(36).toUpperCase()}`,
      'WITHDRAW_P2P',
      true,
      amountIdr
    );

    // 3. Sinkronisasi ke backend API
    try {
      fetch('/api/treasury/cashout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountIdr,
          destination,
          destinationAccount: account,
          purpose: 'REAL_WORLD_CASHOUT',
        }),
      }).catch(() => {});
    } catch (_) {}
  };

  // ======================== KONVERSI PANEN VIRTUAL & REVENUE SPLIT (ENDING FLOW) ========================
  // Handle P2P DANA Success & Virtual Harvest Conversion
  const handleP2PSuccess = (receipt: P2PReceipt, eggCountSold: number, amountIdr: number) => {
    const weightKg = eggCountSold > 0 ? Number(((eggCountSold * 62.5) / 1000).toFixed(2)) : 0;

    if (eggCountSold > 0) {
      // 1. Potong stok telur virtual yang dipanen
      setCycle((prev) => ({
        ...prev,
        accumulatedEggs: Math.max(0, prev.accumulatedEggs - eggCountSold),
      }));

      // 2. Revenue Split Waterfall:
      // Operational deductions: 12% sewa lahan/kandang + 15% margin suplai konsentrat/DOC + 3% platform broker fee = 30%
      // 30% ini bermuara langsung sebagai REAL PROFIT Kas Treasury Owner!
      const operationalProfitIdr = Math.round(amountIdr * 0.30);
      const farmerNetShareIdr = amountIdr - operationalProfitIdr;

      // 3. Alokasikan hak peternak (Porsi Tunai Cair vs Porsi Auto-Compound)
      if (autoCompoundConfig.isEnabled) {
        const cashPayout = Math.round((farmerNetShareIdr * autoCompoundConfig.cashPayoutPercent) / 100);
        const compoundAmount = farmerNetShareIdr - cashPayout;
        const addedBirds = Math.floor((compoundAmount * 0.6) / 45000);
        const addedFeedKg = Math.floor((compoundAmount * 0.4) / 7000);

        setBalances((prev) => ({
          ...prev,
          saldoDompetSaya: prev.saldoDompetSaya + cashPayout,
          kasTreasuryOwner: prev.kasTreasuryOwner + operationalProfitIdr + compoundAmount,
          totalWithdrawnIdr: prev.totalWithdrawnIdr + cashPayout,
          totalEggHarvestedAllTime: prev.totalEggHarvestedAllTime + eggCountSold,
          totalGramasiSoldKg: prev.totalGramasiSoldKg + weightKg,
        }));

        setCycle((prev) => ({
          ...prev,
          population: prev.population + addedBirds,
          hens: prev.hens + addedBirds,
          feedStockKg: prev.feedStockKg + addedFeedKg,
          cohorts: {
            ...prev.cohorts,
            layerProductiveCount: prev.cohorts.layerProductiveCount + addedBirds,
          },
        }));

        setAutoCompoundConfig((prev) => ({
          ...prev,
          totalCompoundedAmountIdr: prev.totalCompoundedAmountIdr + compoundAmount,
          totalAdditionalBirdsFromCompound: prev.totalAdditionalBirdsFromCompound + addedBirds,
          totalFeedStockPurchasedKg: prev.totalFeedStockPurchasedKg + addedFeedKg,
          compoundingCyclesCompleted: prev.compoundingCyclesCompleted + 1,
          lastCompoundedAt: 'Baru saja (Panen P2P)',
        }));

        addLedger(
          'KONVERSI PANEN VIRTUAL & REVENUE SPLIT OTOMATIS',
          `Panen virtual ${eggCountSold} butir (${weightKg} Kg) dilikuidasi senilai ${formatRupiah(amountIdr)}. Split: Tunai Peternak (+${formatRupiah(cashPayout)}), Auto-Compound (+${formatRupiah(compoundAmount)} untuk +${addedBirds} ekor layer & +${addedFeedKg} kg pakan), serta Real Profit Kas Treasury Owner bertambah +${formatRupiah(operationalProfitIdr + compoundAmount)} siap dicairkan ke dunia nyata!`,
          'CYCLE',
          true,
          cashPayout
        );
      } else {
        setBalances((prev) => ({
          ...prev,
          saldoDompetSaya: prev.saldoDompetSaya + farmerNetShareIdr,
          kasTreasuryOwner: prev.kasTreasuryOwner + operationalProfitIdr,
          totalWithdrawnIdr: prev.totalWithdrawnIdr + farmerNetShareIdr,
          totalEggHarvestedAllTime: prev.totalEggHarvestedAllTime + eggCountSold,
          totalGramasiSoldKg: prev.totalGramasiSoldKg + weightKg,
        }));

        addLedger(
          'KONVERSI PANEN VIRTUAL & REVENUE SPLIT',
          `Panen ${eggCountSold} butir (${weightKg} Kg) senilai ${formatRupiah(amountIdr)} dilikuidasi. Peternak menerima tunai ${formatRupiah(farmerNetShareIdr)} ke DANA ${receipt.danaNumber}. Potongan operasional (+${formatRupiah(operationalProfitIdr)}) bermuara langsung sebagai Real Profit Kas Treasury Owner!`,
          'WITHDRAW_P2P',
          true,
          farmerNetShareIdr
        );
      }

      // Backend sync
      try {
        fetch('/api/harvest/settle-split', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eggCount: eggCountSold,
            customPricePerKg: 30000,
            cashPercent: autoCompoundConfig.cashPayoutPercent,
            compoundPercent: autoCompoundConfig.autoCompoundPercent,
            farmerAddress: signerWallet.address,
          }),
        }).catch(() => {});
      } catch (_) {}
    } else {
      // Penarikan saldo dompet biasa tanpa panen telur
      setBalances((prev) => ({
        ...prev,
        saldoDompetSaya: Math.max(0, prev.saldoDompetSaya - amountIdr),
        totalWithdrawnIdr: prev.totalWithdrawnIdr + amountIdr,
      }));

      addLedger(
        'PENARIKAN SALDO DANA',
        `Berhasil mencairkan saldo dompet sebesar ${formatRupiah(amountIdr)} ke akun DANA ${receipt.danaNumber} (${receipt.accountName}). Node Escrow P2P terverifikasi.`,
        'WITHDRAW_P2P',
        true,
        amountIdr,
        undefined,
        undefined,
        receipt.refId
      );
    }
  };

  // Handle Web3 Harvest Execution Success & On-Chain Settlement
  const handleWeb3Success = (receipt: Web3TransactionReceipt, eggCountSold: number) => {
    const weightKg = Number(((eggCountSold * 62.5) / 1000).toFixed(2));

    setCycle((prev) => ({
      ...prev,
      accumulatedEggs: Math.max(0, prev.accumulatedEggs - eggCountSold),
    }));

    const ethNum = parseFloat(receipt.valueEth);
    const fiatValueIdr = receipt.fiatValueIdr || Math.round(ethNum * 45000000);
    // Real profit deduction 30% flows directly into kasTreasuryOwner
    const treasuryProfitIdr = Math.round(fiatValueIdr * 0.30);

    setBalances((prev) => ({
      ...prev,
      ethBalance: prev.ethBalance + ethNum,
      kasTreasuryOwner: prev.kasTreasuryOwner + treasuryProfitIdr,
      totalEggHarvestedAllTime: prev.totalEggHarvestedAllTime + eggCountSold,
      totalWithdrawnEth: prev.totalWithdrawnEth + ethNum,
      totalGramasiSoldKg: prev.totalGramasiSoldKg + weightKg,
    }));

    activateSovereignMode();

    addLedger(
      'WEB3 SMART CONTRACT PANEN & PROTOCOL SETTLEMENT',
      `Batch panen ${eggCountSold} butir (${weightKg} Kg) berhasil dilikuidasi ke Smart Contract. Peternak menerima +${receipt.valueEth} ETH (~${formatRupiah(fiatValueIdr)}). Real Profit Kas Treasury Owner bertambah +${formatRupiah(treasuryProfitIdr)} di Block #${receipt.blockNumber}.`,
      'WITHDRAW_WEB3',
      true,
      fiatValueIdr,
      ethNum,
      receipt.txHash
    );

    // Backend sync
    try {
      fetch('/api/harvest/settle-split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eggCount: eggCountSold,
          customPricePerKg: 30000,
          cashPercent: 70,
          compoundPercent: 30,
          farmerAddress: signerWallet.address,
        }),
      }).catch(() => {});
    } catch (_) {}
  };

  const handleOpenEtherscan = (receipt: Web3TransactionReceipt) => {
    setActiveEtherscanReceipt(receipt);
  };

  const handleOpenEtherscanByHash = (txHash: string) => {
    const found: Web3TransactionReceipt = {
      txHash,
      blockNumber: 21049320,
      timestamp: 'Terverifikasi On-Chain',
      from: signerWallet.address,
      to: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      valueEth: '0.006666',
      gasUsed: '84,392',
      gasPriceGwei: '14.5',
      confirmations: 12,
      status: 'Success',
      method: 'harvestEggPayout(uint256,address)',
      eggCount: 120,
      fiatValueIdr: 300000,
      contractAddress: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    };
    setActiveEtherscanReceipt(found);
  };

  // Handle direct Write Contract execution from Etherscan Console
  const handleWeb3WriteHarvest = (eggCount: number) => {
    const countToHarvest = Math.min(eggCount, cycle.accumulatedEggs > 0 ? cycle.accumulatedEggs : eggCount);
    const ethPayout = (countToHarvest * 2500) / 45000000;
    const idrEquivalent = countToHarvest * 2500;

    setCycle((prev) => ({
      ...prev,
      accumulatedEggs: Math.max(0, prev.accumulatedEggs - countToHarvest),
    }));

    setBalances((prev) => ({
      ...prev,
      ethBalance: prev.ethBalance + ethPayout,
      totalEggHarvestedAllTime: prev.totalEggHarvestedAllTime + countToHarvest,
      totalWithdrawnEth: prev.totalWithdrawnEth + ethPayout,
    }));

    activateSovereignMode();

    addLedger(
      'WRITE CONTRACT ETHERSCAN',
      `Berhasil mengeksekusi panen ${countToHarvest} butir via Etherscan Console. Payout +${ethPayout.toFixed(6)} ETH (${formatRupiah(idrEquivalent)}) langsung ke wallet peternak. Merkle Root verified.`,
      'WITHDRAW_WEB3',
      true,
      idrEquivalent,
      ethPayout
    );
  };

  // Crisis simulation triggers
  const triggerVirusSimulation = () => {
    setCycle((prev) => ({
      ...prev,
      biosecurityHealth: 65,
      cohorts: {
        ...prev.cohorts,
        sickChicksCount: Math.min(6, prev.cohorts.chicksDocCount || 4),
        virusDetected: true,
        virusName: 'Newcastle Disease (Tetelo) & Koksidiosis',
        virusSymptoms: 'Sayap terkulai lemas, feses kapur putih, tremor saraf',
      },
    }));
    sounds.playEmergencyAlarm();
  };

  const triggerFeedOutageSimulation = () => {
    setCycle((prev) => ({
      ...prev,
      feedStockKg: 2,
    }));
    sounds.playEmergencyAlarm();
  };

  const triggerSpentHensSimulation = () => {
    setCycle((prev) => ({
      ...prev,
      cohorts: {
        ...prev.cohorts,
        spentHensAfkirCount: prev.cohorts.spentHensAfkirCount + 4,
      },
    }));
    sounds.playDirectivePing();
  };

  const triggerHeatStressSimulation = () => {
    setCycle((prev) => ({
      ...prev,
      ambientTempC: 31.8,
      heatStressActive: true,
      acClimateDaysRemaining: 0,
      biosecurityHealth: Math.max(40, prev.biosecurityHealth - 20),
    }));
    sounds.playEmergencyAlarm();
  };

  // Climate Control Handlers
  const handleUpdateTargetTemp = (newTemp: number) => {
    setCycle((prev) => ({
      ...prev,
      targetTempC: newTemp,
      ambientTempC: prev.acClimateDaysRemaining > 0 ? newTemp : prev.ambientTempC,
    }));
  };

  const handleSetClimateMode = (mode: ClimateMode) => {
    setCycle((prev) => ({
      ...prev,
      climateMode: mode,
    }));
  };

  const handleRentAcClimate = () => {
    const acCost = 65000 * 7; // 7 hari = Rp 455.000
    if (balances.saldoDompetSaya < acCost) {
      // Coba sewa 1 hari
      if (balances.saldoDompetSaya >= 65000) {
        setBalances((prev) => ({
          ...prev,
          saldoDompetSaya: prev.saldoDompetSaya - 65000,
          kasTreasuryOwner: prev.kasTreasuryOwner + 65000,
        }));
        setCycle((prev) => ({
          ...prev,
          acClimateDaysRemaining: prev.acClimateDaysRemaining + 1,
          ambientTempC: prev.targetTempC,
          heatStressActive: false,
        }));
        addLedger(
          'SEWA UTILITAS AC KANDANG',
          'Berhasil menyewa AC conditioner & pengatur suhu otomatis selama 1 hari (Rp 65.000). Suhu kembali stabil 24°C.',
          'CLIMATE',
          true,
          65000
        );
        return;
      }
      sounds.playError();
      alert('Saldo tidak cukup untuk menyewa AC Conditioner! Silakan top-up terlebih dahulu.');
      setIsOpenTopUp(true);
      return;
    }

    setBalances((prev) => ({
      ...prev,
      saldoDompetSaya: prev.saldoDompetSaya - acCost,
      kasTreasuryOwner: prev.kasTreasuryOwner + acCost,
    }));
    setCycle((prev) => ({
      ...prev,
      acClimateDaysRemaining: prev.acClimateDaysRemaining + 7,
      ambientTempC: prev.targetTempC,
      heatStressActive: false,
    }));
    addLedger(
      'SEWA UTILITAS AC KANDANG',
      `Berhasil memperpanjang sewa AC conditioner & pengatur suhu api otomatis selama 7 hari (${formatRupiah(acCost)}). Kas Owner bertambah.`,
      'CLIMATE',
      true,
      acCost
    );
  };

  // Refresh Real-Time Market Prices
  const handleRefreshMarketPrices = () => {
    setMarketPrices((prev) =>
      prev.map((item) => {
        const delta = (Math.random() * 3 - 1.4) / 100; // -1.4% to +1.6%
        const newPrice = item.currency === 'IDR'
          ? Math.round(item.price * (1 + delta) / 100) * 100
          : Number((item.price * (1 + delta)).toFixed(2));
        const newPercent = Number((item.change24hPercent + delta * 10).toFixed(1));

        return {
          ...item,
          price: newPrice,
          change24hPercent: newPercent,
          updatedAt: 'Baru saja di-refresh (Live)',
        };
      })
    );
    sounds.playDirectivePing();
  };

  // Render Inner Content
  const renderAppContent = () => (
    <div className="space-y-6">
      {/* 1. Header & Identity Strip & Balances */}
      <SovereignIdentityHeader
        farmer={farmer}
        balances={balances}
        onOpenTopUp={() => setIsOpenTopUp(true)}
        onOpenWithdraw={() => setIsOpenWithdraw(true)}
        onOpenContractViewer={() => setIsOpenContractViewer(true)}
        onOpenEtherscan={() => setIsOpenEtherscanConsole(true)}
        onOpenGramasiModal={() => setIsOpenGramasiModal(true)}
        onToggleSovereignMode={handleToggleSovereignMode}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          sounds.enabled = !soundEnabled;
          setSoundEnabled(!soundEnabled);
        }}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
        lang={lang}
        onSelectLang={setLang}
        activeCurrency={activeCurrency}
        onSelectCurrency={setActiveCurrency}
        onOpenGlobalOnboarding={() => setIsOpenGlobalOnboarding(true)}
        onOpenGlobalCoopMap={() => setIsOpenGlobalCoopMap(true)}
        onOpenGlobalAudit={() => setIsOpenGlobalAudit(true)}
        onOpenOwnerTreasuryModal={() => setIsOpenOwnerTreasuryModal(true)}
        onScrollToCoopSection={() => {
          const el = document.getElementById('metaverse-coop-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onScrollToMultiCoop={() => {
          const el = document.getElementById('multi-coop-manager-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenProfileModal={() => setIsOpenProfileModal(true)}
        onOpenQrisModal={() => setIsOpenQrisModal(true)}
        onOpenTwoWayConfirmation={() => setIsOpenTwoWayModal(true)}
        twoWayPendingCount={twoWayPendingCount}
        connectedMetaMaskAddress={metaMaskAccount}
        onConnectMetaMask={connectMetaMask}
        onDisconnectMetaMask={disconnectMetaMask}
        metaMaskBalanceEth={metaMaskBalanceEth}
        userProfile={{ fullName: userProfile.fullName, role: userProfile.role }}
        activeFarmerAccount={activeFarmer}
        onOpenPersonalDashboard={() => {
          const el = document.getElementById('personal-farmer-dashboard-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenFarmerSwitcher={() => setIsOpenFarmerSwitcher(true)}
        onOpenMonetaryDirective={() => setIsOpenMonetaryDirectiveModal(true)}
        onOpenAboutModal={() => setIsOpenAboutModal(true)}
        onOpenAuthModal={() => setIsOpenAuthModal(true)}
        authUser={authUser}
        onSignOut={handleSignOut}
        farmerCountryFlag={farmerCountry.flag}
        farmerCountryName={farmerCountry.name}
        farmerFlockSize={farmerCountry.flockSize}
      />

      {/* 1.5. DASBOR PERSONAL PETERNAK & MANAJEMEN PENGGUNA MANDIRI */}
      <div id="personal-farmer-dashboard-section" className="scroll-mt-6">
        <PersonalFarmerDashboard
          farmer={activeFarmer}
          onRefresh={fetchActiveFarmer}
          onSwitchFarmerRequest={() => setIsOpenFarmerSwitcher(true)}
          currentUserRole={userProfile.role}
          onOpenOwnerSettlement={() => setIsOpenOwnerTreasuryModal(true)}
          onOpenQrisModal={() => setIsOpenQrisModal(true)}
        />
      </div>

      {/* 2. AUTOMATED EMERGENCY ALARM & TRIAGE DIRECTIVE (Requested feature) */}
      <EmergencyAlertBanner
        directive={emergencyDirective}
        onExecuteDirectiveAction={handleExecuteDirectiveAction}
        onTriggerVirusSimulation={triggerVirusSimulation}
        onTriggerFeedOutageSimulation={triggerFeedOutageSimulation}
        onTriggerSpentHensSimulation={triggerSpentHensSimulation}
        onTriggerHeatStressSimulation={triggerHeatStressSimulation}
        hasSickChicks={cycle.cohorts.sickChicksCount > 0}
      />

      {/* 3. REAL BIOLOGICAL LIFECYCLE & POULTRY COHORT PIPELINE (Requested feature) */}
      <PoultryLifecyclePipeline
        cycle={cycle}
        onSalvageSickChicks={handleSalvageSickChicks}
        onSellSpentHens={handleSellSpentHens}
        onStartIncubationBatch={handleStartIncubationBatch}
        canIncubate={cycle.incubatorUnits > 0 && cycle.accumulatedEggs >= 10}
      />

      {/* 4. PENGATUR SUHU RUANGAN OTOMATIS & AC CONDITIONER API KANDANG (Requested Feature) */}
      <ClimateControlPanel
        cycle={cycle}
        onUpdateTargetTemp={handleUpdateTargetTemp}
        onSetClimateMode={handleSetClimateMode}
        onRentAcClimate={handleRentAcClimate}
        saldoDompetSaya={balances.saldoDompetSaya}
      />

      {/* 5. AGRO-FI IOT ORACLE & MERKLE ATTESTATION ANCHOR (Enterprise Web3 Integration) */}
      <AgroFiOracleBar
        ambientTempC={cycle.ambientTempC}
        humidityRh={cycle.humidityRh}
        biosecurityHealth={cycle.biosecurityHealth}
        accumulatedEggs={cycle.accumulatedEggs}
        onOpenEtherscan={() => setIsOpenEtherscanConsole(true)}
      />

      {/* 6. Biological Poultry Cycle Real-Time Simulator */}
      <FarmVisualizer
        cycle={cycle}
        onAdvanceCycle={handleAdvanceCycle}
        onOpenWithdraw={() => setIsOpenWithdraw(true)}
        onFeedQuick={handleFeedQuick}
        canAdvance={true}
      />

      {/* 6. REAL-TIME MARKET PRICE BOARD: INDONESIA & DUNIA (Requested Feature) */}
      <MarketPriceBoard
        prices={marketPrices}
        onRefreshPrices={handleRefreshMarketPrices}
        onOpenWithdrawWithTargetPrice={() => setIsOpenWithdraw(true)}
      />

      {/* 7. MANAJEMEN MULTI-KANDANG & MESIN TETAS (Skala Peternak 10 -> 40 -> 1.000 -> 6.000 Ekor) */}
      <MultiCoopManager
        coops={coops}
        onAddCoop={handleAddCoop}
        onIncubateHatch={handleIncubateHatch}
        saldoDompetSaya={balances.saldoDompetSaya}
        kasTreasuryOwner={balances.kasTreasuryOwner}
        accumulatedEggs={cycle.accumulatedEggs}
        totalHatcheryStock={totalHatcheryStock}
        onOpenTopUp={() => setIsOpenTopUp(true)}
      />

      {/* 8. KANDANG METAVERSE & SEWA INFRASTRUKTUR (Katalog Paket Bundling, Simulasi Net Profit, Sewa, IoT & Countdown) */}
      <MetaverseCoopRental
        saldoDompetSaya={balances.saldoDompetSaya}
        kasTreasuryOwner={balances.kasTreasuryOwner}
        activeRental={activeCoopRental}
        onRentCoop={handleRentCoop}
        onRentPackage={handleRentPackage}
        onOpenCheckoutPackage={(pkg) => {
          setTargetCheckoutPackage(pkg);
          setIsOpenTopUp(true);
        }}
        onOpenTopUp={() => {
          setTargetCheckoutPackage(null);
          setIsOpenTopUp(true);
        }}
        onInspectEtherscan={handleOpenEtherscanByHash}
        ambientTempC={cycle.ambientTempC}
        humidityRh={cycle.humidityRh}
        onOpenTwoWayConfirmation={(service) => {
          setTwoWayTargetService(service);
          setIsOpenTwoWayModal(true);
        }}
      />

      {/* 8. FITUR PARTIAL AUTO-COMPOUND (Komponding Sebagian Otomatis: 50-60% Tunai : 40-50% Diputar) */}
      <PartialAutoCompoundPanel
        config={autoCompoundConfig}
        onUpdateConfig={setAutoCompoundConfig}
        onExecuteCompoundBatch={handleExecuteCompoundBatch}
        cycle={cycle}
        saldoDompetSaya={balances.saldoDompetSaya}
      />

      {/* 8. Catalog of Owner Assets & Utilities */}
      <CatalogTable
        items={INITIAL_CATALOG}
        saldoDompetSaya={balances.saldoDompetSaya}
        onPurchase={handlePurchase}
        onOpenTopUp={() => setIsOpenTopUp(true)}
        highlightTargetId={emergencyDirective.highlightTarget}
      />

      {/* 8. Live Ledger & Audit Trail */}
      <LiveLedger
        entries={ledger}
        onOpenEtherscanByHash={handleOpenEtherscanByHash}
      />

      {/* TENTANG GAMEGRAFITY FARM & LANGKAH MUDAH UNTUK UNTUNG */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">🐔</span>
              <h3 className="text-lg font-extrabold text-white">
                Tentang Gamegrafity Farm
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                Anti-Defisit
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              <strong>Gamegrafity Farm</strong> adalah platform peternakan digital berbasis Web3 dan ekonomi Sovereign yang memastikan peternak pasti untung dan aman dari risiko kerugian, dengan sistem kas pusat yang otomatis melindungi dana agar tidak pernah kebobolan.
            </p>
          </div>

          <button
            onClick={() => setIsOpenAboutModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
          >
            <span>Buka Panduan Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dual-Payout Hub & 4 Langkah Mudah Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          {/* Card 1: Dual-Payout Hub */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Sistem Pembayaran (Dual-Payout Hub)</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-start gap-2.5">
                <span className="text-base shrink-0">📲</span>
                <div>
                  <strong className="text-white block text-[11px]">QRIS &amp; DANA P2P:</strong>
                  <span className="text-slate-300 text-[11px]">Memungkinkan pencairan dana instan secara peer-to-peer langsung ke dompet digital DANA atau menggunakan pindai kode QR yang praktis.</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-start gap-2.5">
                <span className="text-base shrink-0">🏦</span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-white block text-[11px]">Rekening Bank Lokal (BCA, dll.):</strong>
                    <span className="text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1 py-0.2 rounded">
                      Kas Pusat
                    </span>
                  </div>
                  <span className="text-slate-300 text-[11px] block">Mendukung transfer langsung ke rekening bank lokal milik peternak untuk penarikan dana yang aman.</span>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/60 text-[10px] font-mono text-blue-200">
                    <span className="font-bold text-white">{OFFICIAL_BCA_CONFIG.bankName}:</span>
                    <span className="tracking-wide text-cyan-300 font-bold">{OFFICIAL_BCA_CONFIG.accountNumber}</span>
                    <span className="text-slate-300">a.n.</span>
                    <span className="font-bold text-slate-100">{OFFICIAL_BCA_CONFIG.accountHolder}</span>
                  </div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-start gap-2.5">
                <span className="text-base shrink-0">🦊</span>
                <div>
                  <strong className="text-white block text-[11px]">Web3 Wallet (MetaMask):</strong>
                  <span className="text-slate-300 text-[11px]">Menyediakan opsi integrasi dompet kripto bagi pengguna yang bertransaksi dalam ekosistem desentralisasi.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 4 Langkah Mudah untuk Untung */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Langkah Mudah untuk Untung</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-white text-[11px]">Aktivasi Siklus:</strong>
                  <span className="text-slate-300 text-[11px] block">Memulai siklus pemeliharaan di sistem dengan dukungan utilitas dan pemantauan harga pasar secara real-time.</span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-white text-[11px]">Bebas Risiko Kematian (Zero Mortality):</strong>
                  <span className="text-slate-300 text-[11px] block">Terbebas dari risiko kerugian fisik akibat kematian ternak melalui sistem mitigasi dan efisiensi virtual yang melindungi peternak.</span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-white text-[11px]">Harga Serap di Atas HPP:</strong>
                  <span className="text-slate-300 text-[11px] block">Saat panen tiba, hasil dikunci pada harga serap yang berada di atas Harga Pokok Penjualan (HPP), sehingga margin keuntungan bersih langsung terbentuk.</span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                <div>
                  <strong className="text-white text-[11px]">Pencairan Instan:</strong>
                  <span className="text-slate-300 text-[11px] block">Tarik keuntungan bersih Anda secara langsung ke DANA, rekening bank lokal, atau dompet digital kapan pun siklus selesai.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kepemilikan & Hak Cipta Mudhofar's™ */}
      <footer className="text-center py-8 text-xs text-slate-400 space-y-4 font-sans border-t border-slate-800/80 mt-10">
        <div className="max-w-3xl mx-auto p-5 rounded-3xl bg-gradient-to-r from-slate-900/95 via-indigo-950/50 to-slate-900/95 border border-indigo-500/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-center gap-2 mb-2 text-indigo-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>Kepemilikan &amp; Hak Cipta</span>
          </div>

          <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
            © 2026 Gamegrafity Farm. Created &amp; Owned by Mudhofar's™. All rights reserved.
          </h3>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-2xl mx-auto">
            <strong className="text-indigo-300">Sovereign Mode™</strong>, <strong className="text-cyan-300">Web3 Agro-Fi™</strong>, dan <strong className="text-emerald-300">Dual-Payout Hub™</strong> adalah merek dan kekayaan intelektual digital terdaftar dari ekosistem <strong className="text-purple-300">Mudhofar's™</strong>.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700">
              Genesis Origin: Blitar, Indonesia
            </span>
            <span>•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700">
              Protokol Peternakan Berdaulat Tanpa Broker
            </span>
            <span>•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700">
              Multi-Chain &amp; DANA P2P Settlement
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-mono">
          Gamegrafity Farm Sovereign Mode v2.5.0 • Verified Smart Contract &amp; Direct Owner Treasury Routing
        </p>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200">
      {viewMode === 'desktop' ? (
        /* Full Desktop / Tablet Viewport */
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {renderAppContent()}
        </main>
      ) : (
        /* React Native Mobile Simulator Shell */
        <div className="py-6 sm:py-10 px-2 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center mb-3">
            <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60">
              📱 React Native Mobile DApp Simulator
            </span>
          </div>

          {/* Smartphone Bezel */}
          <div className="relative w-full max-w-[420px] bg-black rounded-[48px] border-[10px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-slate-700/60">
            {/* Notch & Status Bar */}
            <div className="bg-black text-white px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono select-none border-b border-slate-900">
              <span className="font-bold">09:41</span>
              {/* Dynamic Island / Notch */}
              <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-1.5 px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Scrollable Mobile Content */}
            <div className="max-h-[820px] overflow-y-auto p-4 bg-[#080c14]">
              {renderAppContent()}
            </div>

            {/* Home indicator bar */}
            <div className="bg-black py-2.5 flex justify-center">
              <div className="w-32 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <TopUpModal
        isOpen={isOpenTopUp}
        onClose={() => {
          setIsOpenTopUp(false);
          setTargetCheckoutPackage(null);
        }}
        onSuccess={handlePaymentSuccess}
        actorName={farmer.mode === 'sovereign' ? 'Sovereign Node' : farmer.name}
        initialAmount={targetCheckoutPackage ? targetCheckoutPackage.totalMonthlyRentIdr : undefined}
        targetPackage={
          targetCheckoutPackage
            ? {
                id: targetCheckoutPackage.id,
                name: targetCheckoutPackage.name,
                priceIdr: targetCheckoutPackage.totalMonthlyRentIdr,
              }
            : undefined
        }
        onOpenTwoWayConfirmation={(service) => {
          setTwoWayTargetService(service);
          setIsOpenTwoWayModal(true);
        }}
      />

      <WithdrawModal
        isOpen={isOpenWithdraw}
        onClose={() => setIsOpenWithdraw(false)}
        accumulatedEggs={cycle.accumulatedEggs}
        saldoDompetSaya={balances.saldoDompetSaya}
        ethBalance={balances.ethBalance}
        farmer={farmer}
        signerWallet={signerWallet}
        onP2PSuccess={handleP2PSuccess}
        onWeb3Success={handleWeb3Success}
        onOpenEtherscan={handleOpenEtherscan}
        onActivateSovereignMode={activateSovereignMode}
        onOpenQrisModal={() => setIsOpenQrisModal(true)}
      />

      {/* Real National QRIS / DANA P2P Payment Barcode Modal */}
      <P2PQrisBarcodeModal
        isOpen={isOpenQrisModal}
        onClose={() => setIsOpenQrisModal(false)}
        onOpenTwoWayConfirmation={(service) => {
          setTwoWayTargetService(service);
          setIsOpenTwoWayModal(true);
        }}
      />

      {/* Konfirmasi Dua Arah Modal (Pengirim 'Saya Sudah Membayar' & Penerima 'Owner Approve') */}
      <TwoWayConfirmationModal
        isOpen={isOpenTwoWayModal}
        onClose={() => setIsOpenTwoWayModal(false)}
        userRole={userProfile.role}
        userName={userProfile.fullName}
        initialService={twoWayTargetService}
        onPaymentApproved={handlePaymentApprovedFromTwoWay}
      />

      <EtherscanModal
        isOpen={!!activeEtherscanReceipt || isOpenEtherscanConsole}
        onClose={() => {
          setActiveEtherscanReceipt(null);
          setIsOpenEtherscanConsole(false);
        }}
        receipt={activeEtherscanReceipt}
        sovereignAddress={signerWallet.address}
        onWriteHarvest={handleWeb3WriteHarvest}
      />

      <SmartContractViewer
        isOpen={isOpenContractViewer}
        onClose={() => setIsOpenContractViewer(false)}
      />

      <GramasiBusinessModal
        isOpen={isOpenGramasiModal}
        onClose={() => setIsOpenGramasiModal(false)}
        accumulatedEggs={cycle.accumulatedEggs}
        spentHensCount={cycle.cohorts.spentHensAfkirCount}
      />

      {/* Global Farmer World Gateway & Onboarding Portal */}
      <GlobalFarmerOnboardingModal
        isOpen={isOpenGlobalOnboarding}
        onClose={() => setIsOpenGlobalOnboarding(false)}
        currentFarmer={farmer}
        onCompleteOnboarding={handleCompleteGlobalOnboarding}
        onInspectEtherscan={handleOpenEtherscanByHash}
        lang={lang}
      />

      {/* World Poultry Cooperative Network Map & Global Nodes */}
      <GlobalCoopNetworkMap
        isOpen={isOpenGlobalCoopMap}
        onClose={() => setIsOpenGlobalCoopMap(false)}
        lang={lang}
        activeCurrency={activeCurrency}
        onSelectCountryForOnboard={(countryName) => {
          setIsOpenGlobalCoopMap(false);
          setIsOpenGlobalOnboarding(true);
        }}
        onInspectEtherscan={handleOpenEtherscanByHash}
      />

      {/* Global Readiness Audit & 10-Pillar International Verification */}
      <GlobalReadinessAuditModal
        isOpen={isOpenGlobalAudit}
        onClose={() => setIsOpenGlobalAudit(false)}
        farmer={farmer}
        lang={lang}
      />

      {/* Owner Treasury Settlement & Real-World Cashout Modal (Ending Flow) */}
      <OwnerTreasurySettlementModal
        isOpen={isOpenOwnerTreasuryModal}
        onClose={() => setIsOpenOwnerTreasuryModal(false)}
        kasTreasuryOwner={balances.kasTreasuryOwner}
        ethBalance={balances.ethBalance}
        onExecuteOwnerCashout={handleExecuteOwnerCashout}
      />

      {/* User Profile & Web3 MetaMask Wallet Settings Modal (Mudhofar / Owner) */}
      <UserProfileModal
        isOpen={isOpenProfileModal}
        onClose={() => setIsOpenProfileModal(false)}
        currentWalletAddress={metaMaskAccount || userProfile.walletAddress}
        onConnectMetaMask={connectMetaMask}
        onProfileUpdated={(updated) => {
          setUserProfile({
            fullName: updated.fullName,
            role: updated.role,
            walletAddress: updated.walletAddress,
          });
          setFarmer((prev) => ({
            ...prev,
            name: `${(updated.walletAddress || prev.walletAddress).substring(0, 6)}... (${updated.fullName})`,
          }));
          addLedger(
            'PROFIL PENGGUNA DIPERBARUI',
            `Profil '${updated.fullName}' (${updated.role === 'owner' ? 'Owner / Pengelola' : 'Peternak Lapangan'}) dan alamat dompet MetaMask berhasil disinkronisasi ke sistem.`,
            'SYSTEM',
            true
          );
        }}
      />

      {/* Multi-Farmer Account Switcher & Registration Modal (Data Isolation) */}
      <FarmerAccountSwitcherModal
        isOpen={isOpenFarmerSwitcher}
        onClose={() => setIsOpenFarmerSwitcher(false)}
        activeFarmerId={activeFarmerId}
        onSelectFarmer={(id) => {
          setActiveFarmerId(id);
          sounds.playSuccess();
        }}
        onAccountsUpdated={fetchActiveFarmer}
        onOpenQrisModal={() => setIsOpenQrisModal(true)}
      />

      {/* Sovereign Ecosystem Core Backend Mathematical & Monetary Directive Modal */}
      <SovereignMonetaryDirectiveModal
        isOpen={isOpenMonetaryDirectiveModal}
        onClose={() => setIsOpenMonetaryDirectiveModal(false)}
        activeFarmerId={activeFarmerId}
        onRefreshParent={fetchActiveFarmer}
      />

      {/* Tentang Gamegrafity Farm, Dual-Payout Hub & Panduan Untung Modal */}
      <AboutGamegrafityModal
        isOpen={isOpenAboutModal}
        onClose={() => setIsOpenAboutModal(false)}
        onOpenQrisModal={() => setIsOpenQrisModal(true)}
        onOpenPersonalDashboard={() => {
          const el = document.getElementById('personal-farmer-dashboard-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenTopUp={() => setIsOpenTopUp(true)}
      />

      {/* Autentikasi Gmail / Google, Manual Form & Neon PostgreSQL farmers_users Modal */}
      <AuthModal
        isOpen={isOpenAuthModal}
        onClose={() => setIsOpenAuthModal(false)}
        currentUser={authUser}
        onAuthSuccess={handleAuthSuccess}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
