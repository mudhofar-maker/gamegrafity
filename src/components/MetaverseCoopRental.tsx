import React, { useState, useEffect, useMemo } from 'react';
import { MetaverseCoopItem, ActiveCoopRental, InfrastructurePackage } from '../types/farm';
import { METAVERSE_COOP_CATALOG, INFRASTRUCTURE_PACKAGES } from '../data/metaverseCoopData';
import { formatRupiah } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Home,
  Cpu,
  Thermometer,
  Droplets,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Sliders,
  Flame,
  Wind,
  Package,
  Calculator,
  Shield,
  Award,
  DollarSign
} from 'lucide-react';

interface MetaverseCoopRentalProps {
  saldoDompetSaya: number;
  kasTreasuryOwner: number;
  activeRental: ActiveCoopRental | null;
  onRentCoop: (item: MetaverseCoopItem, durationDays: number, totalCost: number) => void;
  onRentPackage?: (pkg: InfrastructurePackage, durationDays: number, totalCost: number) => void;
  onOpenCheckoutPackage?: (pkg: InfrastructurePackage) => void;
  onOpenTopUp: () => void;
  onInspectEtherscan?: (txHash: string) => void;
  ambientTempC?: number;
  humidityRh?: number;
  onOpenTwoWayConfirmation?: (service: { name: string; amountIdr: number; channel?: any }) => void;
}

export const MetaverseCoopRental: React.FC<MetaverseCoopRentalProps> = ({
  saldoDompetSaya,
  kasTreasuryOwner,
  activeRental,
  onRentCoop,
  onRentPackage,
  onOpenCheckoutPackage,
  onOpenTopUp,
  onInspectEtherscan,
  ambientTempC = 24.2,
  humidityRh = 65,
  onOpenTwoWayConfirmation,
}) => {
  // Tabs: 'packages' (Bundled Packages) | 'simulator' (Net Profit Calculator) | 'table' (Individual Coops) | 'iot' (Live Telemetry & Countdown) | 'specs'
  const [activeTab, setActiveTab] = useState<'packages' | 'simulator' | 'table' | 'iot' | 'specs'>('packages');
  const [selectedCoopForDetail, setSelectedCoopForDetail] = useState<MetaverseCoopItem | null>(null);
  const [selectedPackageForDetail, setSelectedPackageForDetail] = useState<InfrastructurePackage | null>(null);

  // Simulation capacity state (150, 500, 1500 ekor or custom)
  const [simulatedFlockCapacity, setSimulatedFlockCapacity] = useState<number>(500);

  // IoT test stress state
  const [isSimulatingHeat, setIsSimulatingHeat] = useState<boolean>(false);
  const [simulatedTempOffset, setSimulatedTempOffset] = useState<number>(0);
  const [simulatedFanBoost, setSimulatedFanBoost] = useState<boolean>(false);

  // Success modal
  const [showRentSuccessModal, setShowRentSuccessModal] = useState<boolean>(false);
  const [justRentedName, setJustRentedName] = useState<string>('');

  // Live countdown ticker state (updates every second)
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate live countdown components
  const countdown = useMemo(() => {
    if (!activeRental || activeRental.status !== 'AKTIF') {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSecondsRemaining: 0, percentRemaining: 0, isExpired: true };
    }

    const diffMs = activeRental.expiresAt - now;
    if (diffMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSecondsRemaining: 0, percentRemaining: 0, isExpired: true };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const totalDurationMs = (activeRental.durationDays || 30) * 86400 * 1000;
    const percentRemaining = Math.max(0, Math.min(100, Math.round((diffMs / totalDurationMs) * 100)));

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSecondsRemaining: totalSeconds,
      percentRemaining,
      isExpired: false,
    };
  }, [activeRental, now]);

  // Handle rental for Bundled Package
  const handleExecuteRentPackage = (pkg: InfrastructurePackage) => {
    if (onOpenCheckoutPackage) {
      onOpenCheckoutPackage(pkg);
      return;
    }

    const cost = pkg.totalMonthlyRentIdr;
    if (saldoDompetSaya < cost) {
      sounds.playDirectivePing();
      onOpenTopUp();
      return;
    }

    if (onRentPackage) {
      onRentPackage(pkg, 30, cost);
    } else {
      // Fallback: convert to coop item representation
      const coopItem: MetaverseCoopItem = {
        id: pkg.id,
        name: pkg.name,
        tier: pkg.tierLevel.toUpperCase(),
        monthlyRentIdr: pkg.totalMonthlyRentIdr,
        capacityBirds: pkg.capacityBirds,
        description: pkg.tagline,
        ventilationType: pkg.hardwareSpecs.ventilation,
        coolingSystem: pkg.hardwareSpecs.coolingSystem,
        sensors: [pkg.hardwareSpecs.sensors],
        eggBonusPercent: 25,
        badge: pkg.badge,
        specDetails: {
          dimensions: 'Modular Grid',
          feederType: 'Automatic Feed Pipeline',
          manureHandling: 'Conveyor',
          lightingControl: 'Dynamic LED',
          iotTelemetryInterval: 'Real-Time',
          biosecurityRating: 'Tier 1'
        }
      };
      onRentCoop(coopItem, 30, cost);
    }

    setJustRentedName(pkg.name);
    setShowRentSuccessModal(true);
    setActiveTab('iot');

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (_) {}
  };

  // Handle action click "Sewa" individual coop
  const handleExecuteRentCoop = (item: MetaverseCoopItem) => {
    const cost = item.monthlyRentIdr;
    if (saldoDompetSaya < cost) {
      sounds.playError();
      const kekurangan = cost - saldoDompetSaya;
      if (confirm(`Saldo Dompet Anda (${formatRupiah(saldoDompetSaya)}) tidak mencukupi untuk menyewa ${item.name} (${formatRupiah(cost)}). Kekurangan: ${formatRupiah(kekurangan)}. Buka menu Top-Up QRIS / DANA sekarang?`)) {
        onOpenTopUp();
      }
      return;
    }

    onRentCoop(item, 30, cost);
    setJustRentedName(item.name);
    setShowRentSuccessModal(true);
    setActiveTab('iot');

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (_) {}
  };

  // Interactive IoT heat stress test simulation
  const handleTriggerHeatSpike = () => {
    if (isSimulatingHeat) return;
    setIsSimulatingHeat(true);
    setSimulatedTempOffset(6.2); // Suhu naik ke ~30.4°C
    sounds.playEmergencyAlarm();

    // After 2s, IoT Cooling Pad kicks in
    setTimeout(() => {
      setSimulatedFanBoost(true);
      sounds.playDirectivePing();
    }, 2000);

    // After 5s, temperature normalizes back to 24°C
    setTimeout(() => {
      setSimulatedTempOffset(0);
      setSimulatedFanBoost(false);
      setIsSimulatingHeat(false);
      sounds.playWeb3Success();
    }, 5500);
  };

  // Current live IoT values based on active rental or baseline
  const currentTemp = Number((ambientTempC + simulatedTempOffset).toFixed(1));
  const currentHumidity = Number((humidityRh + (isSimulatingHeat ? -8 : 0)).toFixed(1));
  const isHeatWarning = currentTemp > 26.5;

  // Simulator Net Profit calculations based on capacity
  const simulationMetrics = useMemo(() => {
    const birds = simulatedFlockCapacity;
    const layRate = 0.88; // 88% production rate
    const dailyEggs = Math.floor(birds * layRate);
    const monthlyEggs = dailyEggs * 30;
    const weightPerEggGrams = 62.5; // Pinsar Grade A/B average
    const monthlyWeightKg = Number(((monthlyEggs * weightPerEggGrams) / 1000).toFixed(1));
    const eggPricePerKg = 30000; // Rp 30.000 / Kg (~Rp 1.875 / butir)
    const grossRevenueIdr = Math.round(monthlyWeightKg * eggPricePerKg);

    // Package rent cost mapping
    let packageCostIdr = 1250000;
    let packageName = 'Paket Starter Node';
    if (birds >= 1500) {
      packageCostIdr = 4000000;
      packageName = 'Paket Sovereign Mega-House';
    } else if (birds >= 500) {
      packageCostIdr = 2350000;
      packageName = 'Paket Pro IoT Tier-1';
    }

    // Feed: 110 grams/bird/day * 30 days = 3.3 kg/month * Rp 7.000/kg
    const feedKgMonthly = birds * 3.3;
    const feedCostIdr = Math.round(feedKgMonthly * 7000);
    // Utility & climate: Rp 500k (150 ekor), Rp 1.2M (500 ekor), Rp 3.5M (1500 ekor)
    const utilityCostIdr = birds <= 150 ? 500000 : birds <= 500 ? 1200000 : 3500000;

    const totalOperationalCost = packageCostIdr + feedCostIdr + utilityCostIdr;
    const netProfitIdr = grossRevenueIdr - totalOperationalCost;
    const roiPercent = Number(((netProfitIdr / totalOperationalCost) * 100).toFixed(1));

    return {
      birds,
      packageName,
      packageCostIdr,
      dailyEggs,
      monthlyEggs,
      monthlyWeightKg,
      grossRevenueIdr,
      feedKgMonthly,
      feedCostIdr,
      utilityCostIdr,
      totalOperationalCost,
      netProfitIdr,
      roiPercent,
      targetProfitRange:
        birds <= 150
          ? 'Rp 1.200.000 - Rp 1.500.000 / bln'
          : birds <= 500
          ? 'Rp 4.500.000 - Rp 5.500.000 / bln'
          : 'Rp 14.000.000 - Rp 18.000.000 / bln',
    };
  }, [simulatedFlockCapacity]);

  return (
    <div id="metaverse-coop-section" className="space-y-5">
      {/* 1. Header Banner & Financial Treasury Flow Counter */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-950/50 border border-cyan-400/30">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">
                  Kandang Metaverse & Sewa Infrastruktur
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Smart Closed-House IoT
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pilih paket sewa infrastruktur bulanan (Lahan + Kandang), bayar instan ke Kas Treasury Owner, dan kalkulasi proyeksi net profit panen otomatis.
              </p>
            </div>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('packages');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'packages'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>Katalog Paket Bundling</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('simulator');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'simulator'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kalkulator Proyeksi Net Profit</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('iot');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition relative ${
                activeTab === 'iot'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Monitoring Sensor IoT</span>
              {activeRental && activeRental.status === 'AKTIF' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('table');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'table'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kandang Satuan</span>
            </button>
          </div>
        </div>

        {/* Real-Time Financial Flow Bridge: Farmer Wallet -> Owner Treasury */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 items-center">
          {/* Box 1: Saldo Dompet Peternak */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 rounded-lg border border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Saldo Dompet Peternak
              </span>
              <span className="text-base font-extrabold font-mono text-emerald-400">
                {formatRupiah(saldoDompetSaya)}
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenTopUp}
              className="text-[11px] font-bold text-cyan-300 hover:text-cyan-200 underline font-mono"
            >
              + Top-Up Saldo
            </button>
          </div>

          {/* Box 2: Flow Indicator Banner */}
          <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-300 font-mono py-1">
            <span className="text-emerald-400 font-bold">Potong Dompet</span>
            <div className="flex items-center text-cyan-400">
              <span className="animate-pulse">────</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </div>
            <span className="text-amber-400 font-bold">Kas Treasury Owner</span>
          </div>

          {/* Box 3: Kas Treasury Owner */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 rounded-lg border border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Kas Treasury Owner (Protocol)
              </span>
              <span className="text-base font-extrabold font-mono text-amber-300">
                {formatRupiah(kasTreasuryOwner)}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              0xOwner...89D2
            </span>
          </div>
        </div>
      </div>

      {/* 2. TAB CONTENT: KATALOG PAKET & INOVASI INFRASTRUKTUR (Sewa Bulanan Bundling) */}
      {activeTab === 'packages' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">
                Paket Sewa Bundling Infrastruktur (Lahan + Kandang)
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px]">
                3 Tier Pilihan
              </span>
            </div>
            <span className="text-emerald-400 font-mono text-[11px]">
              ✓ Biaya sewa otomatis memotong saldo & seketika mengaktifkan sensor IoT
            </span>
          </div>

          {/* Cards Grid for the Bundled Packages (Mikro 10, Starter 100, Pro 500, Sovereign 1.000) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INFRASTRUCTURE_PACKAGES.map((pkg) => {
              const isAffordable = saldoDompetSaya >= pkg.totalMonthlyRentIdr;
              const isActive =
                activeRental &&
                activeRental.status === 'AKTIF' &&
                (activeRental.packageId === pkg.id || activeRental.coopId === pkg.id);

              return (
                <div
                  key={pkg.id}
                  className={`rounded-2xl border transition-all duration-300 relative flex flex-col justify-between overflow-hidden shadow-xl ${
                    pkg.recommended
                      ? 'bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border-cyan-400/50 ring-2 ring-cyan-500/20'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Badge */}
                  {pkg.recommended && (
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black text-[10px] font-black uppercase tracking-wider py-1 text-center font-mono shadow-sm">
                      ★ Rekomendasi Utama (Best ROI Peternak) ★
                    </div>
                  )}

                  <div className="p-5 space-y-4">
                    {/* Header: Name & Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-bold uppercase">
                          {pkg.badge}
                        </span>
                        <h3 className="text-lg font-black text-white mt-1">
                          {pkg.name}
                        </h3>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-cyan-400">
                        <Home className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Price & Monthly Rent Tag */}
                    <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2">
                      {pkg.entryPackagePriceIdr && (
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block">
                            Modal Masuk Paket Kemitraan All-In:
                          </span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-black font-mono text-amber-300">
                              {formatRupiah(pkg.entryPackagePriceIdr)}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                              Siap Produksi
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Termasuk 100% bibit pullet 18 minggu, sewa kandang, vitamin, &amp; SOP steril pasca-afkir.
                          </span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[11px] text-slate-400">Sewa Utility Berjalan:</span>
                          <span className="text-sm font-bold font-mono text-slate-200">
                            {formatRupiah(pkg.totalMonthlyRentIdr)} <span className="text-[10px] text-slate-400 font-normal">/ bln</span>
                          </span>
                        </div>
                        {/* Breakdown Lahan + Kandang */}
                        <div className="mt-1 pt-1 border-t border-slate-900 text-[10px] font-mono text-slate-400 space-y-0.5">
                          <div className="flex justify-between">
                            <span>• Sewa Lahan Berdaulat:</span>
                            <span className="text-slate-300">{formatRupiah(pkg.breakdown.landCostIdr)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>• Sewa Utility Kandang:</span>
                            <span className="text-slate-300">{formatRupiah(pkg.breakdown.coopCostIdr)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Capacity Badge */}
                    <div className="flex items-center gap-2 p-2 bg-emerald-950/30 rounded-lg border border-emerald-500/20 text-xs">
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-300">
                        Kapasitas Populasi: <strong className="text-emerald-300 font-mono text-sm">{pkg.capacityBirds.toLocaleString()}</strong> Ekor Pullet (Otomatis)
                      </span>
                    </div>

                    {/* Hardware & IoT Specifications */}
                    <div className="space-y-2 text-xs">
                      <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider block">
                        Spesifikasi Teknis & Otomasi:
                      </span>
                      <div className="space-y-1.5 text-[11px] text-slate-300">
                        <div className="flex items-start gap-1.5">
                          <Wind className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{pkg.hardwareSpecs.ventilation}</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{pkg.hardwareSpecs.sensors}</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Thermometer className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span>{pkg.hardwareSpecs.coolingSystem}</span>
                        </div>
                      </div>
                    </div>

                    {/* Projected Net Profit Monthly Banner */}
                    <div className="p-3 bg-gradient-to-r from-emerald-950/40 via-slate-950 to-emerald-950/40 rounded-xl border border-emerald-500/30">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Estimasi Net Profit Bulanan Peternak (Acuan Broker Rp 21.500/Kg):
                      </span>
                      <div className="text-sm font-extrabold font-mono text-emerald-400 mt-0.5">
                        {pkg.projectedNetProfitMonthly.displayRange}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Est. Panen: ~{pkg.projectedNetProfitMonthly.dailyEggs} butir/hari ({Math.round(pkg.capacityBirds * 0.85 * 30)} butir/bln)
                      </span>
                    </div>
                  </div>

                  {/* Action Button: Pilih & Aktifkan Paket */}
                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      onClick={() => handleExecuteRentPackage(pkg)}
                      className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg active:scale-98 ${
                        isActive
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50 border border-indigo-400/40'
                          : isAffordable
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50 border border-emerald-400/40'
                          : 'bg-gradient-to-r from-amber-600/30 to-indigo-600/30 hover:from-amber-600/40 hover:to-indigo-600/40 text-amber-200 border border-amber-500/40'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          <span>Paket Aktif Berproduksi (Perpanjang {formatRupiah(pkg.totalMonthlyRentIdr)})</span>
                        </>
                      ) : isAffordable ? (
                        <>
                          <Zap className="w-4 h-4 text-emerald-200" />
                          <span>Order &amp; Mulai Produksi Otomatis</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-amber-400" />
                          <span>Order Paket (Bayar QRIS / DANA / BCA)</span>
                        </>
                      )}
                    </button>
                    {!isAffordable && (
                      <span className="text-[10px] text-amber-400/90 text-center block mt-1.5 font-mono">
                        Saldo kurang {formatRupiah(pkg.totalMonthlyRentIdr - saldoDompetSaya)}. Klik untuk bayar via QRIS / DANA / BCA / Web3 & aktifkan seketika.
                      </span>
                    )}

                    {onOpenTwoWayConfirmation && (
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          onOpenTwoWayConfirmation({
                            name: pkg.name,
                            amountIdr: pkg.totalMonthlyRentIdr,
                            channel: 'DANA_P2P'
                          });
                        }}
                        className="w-full mt-2 py-1.5 px-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-mono text-[10px] flex items-center justify-center gap-1.5 transition"
                        title="Konfirmasi Dua Arah: Pengirim 'Saya Sudah Membayar' & Penerima 'Owner Approve'"
                      >
                        <span>🤝</span>
                        <span>Konfirmasi 2-Arah (Saya Sudah Membayar)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Notice */}
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Seluruh paket telah terverifikasi SLA Smart Contract Ethereum & didukung telemetri sensor LoRaWAN continuous.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Buka Kalkulator Net Profit Lengkap &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: KALKULATOR PROYEKSI PENDAPATAN PANEN OTOMATIS (Net Profit Calculator) */}
      {activeTab === 'simulator' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Kalkulator Proyeksi Pendapatan Panen & Net Profit Bulanan
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hitung proyeksi pendapatan bersih peternak secara real-time berdasarkan kapasitas populasi dan efisiensi pakan.
                  </p>
                </div>
              </div>

              {/* Preset Capacity Quick Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 px-2">Preset Paket:</span>
                {[
                  { label: '150 Ekor (Starter)', val: 150 },
                  { label: '500 Ekor (Pro IoT)', val: 500 },
                  { label: '1.500 Ekor (Mega)', val: 1500 },
                ].map((tier) => (
                  <button
                    key={tier.val}
                    type="button"
                    onClick={() => {
                      setSimulatedFlockCapacity(tier.val);
                      sounds.playClick();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                      simulatedFlockCapacity === tier.val
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity Slider Control */}
            <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Kapasitas Populasi Unggas:
                </span>
                <span className="text-lg font-black text-cyan-300">
                  {simulatedFlockCapacity.toLocaleString()} Ekor Ayam
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={simulatedFlockCapacity}
                onChange={(e) => setSimulatedFlockCapacity(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>100 Ekor</span>
                <span>150 Ekor (Starter Node)</span>
                <span>500 Ekor (Pro IoT Tier-1)</span>
                <span>1.500 Ekor (Sovereign Mega)</span>
                <span>2.000 Ekor</span>
              </div>
            </div>

            {/* Financial Projection Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Box 1: Estimasi Produksi Telur */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Estimasi Produksi Telur
                </span>
                <div className="text-xl font-black font-mono text-white mt-1">
                  {simulationMetrics.monthlyEggs.toLocaleString()} <span className="text-xs font-normal text-slate-400">Butir/bln</span>
                </div>
                <div className="text-[11px] font-mono text-cyan-400 mt-1">
                  ~{simulationMetrics.dailyEggs} Butir/Hari ({simulationMetrics.monthlyWeightKg} Kg)
                </div>
              </div>

              {/* Box 2: Estimasi Gross Revenue */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Gross Revenue Panen Telur
                </span>
                <div className="text-xl font-black font-mono text-amber-300 mt-1">
                  {formatRupiah(simulationMetrics.grossRevenueIdr)}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Acuan Pinsar @ Rp 30.000/Kg
                </div>
              </div>

              {/* Box 3: Biaya Operasional & Sewa */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Total Biaya (Sewa + Pakan)
                </span>
                <div className="text-xl font-black font-mono text-rose-300 mt-1">
                  -{formatRupiah(simulationMetrics.totalOperationalCost)}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Sewa: {formatRupiah(simulationMetrics.packageCostIdr)} • Pakan: {formatRupiah(simulationMetrics.feedCostIdr)}
                </div>
              </div>

              {/* Box 4: NET PROFIT BERSIH PETERNAK */}
              <div className="p-3.5 bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 rounded-xl border-2 border-emerald-500/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                    NET PROFIT BERSIH
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    ROI {simulationMetrics.roiPercent}%
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-300 mt-1">
                  {formatRupiah(simulationMetrics.netProfitIdr)}
                </div>
                <div className="text-[10px] font-mono text-emerald-400/90 mt-1">
                  Rentang Target: {simulationMetrics.targetProfitRange}
                </div>
              </div>
            </div>

            {/* Embedded Live IoT Baseline Indicators */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Panel Sensor IoT Otomatis (Standar Produktivitas 24/7):
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  Target Net Profit Tercapai jika Suhu 24°C & RH 65%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Sensor Suhu</span>
                    <span className="text-base font-bold text-cyan-300">24.0°C</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">Optimal</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Kelembapan (RH)</span>
                    <span className="text-base font-bold text-blue-300">65% RH</span>
                  </div>
                  <span className="text-[10px] text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded">Zona 60-70%</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Gas Amonia (NH3)</span>
                    <span className="text-base font-bold text-emerald-300">7.2 PPM</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">&lt;15 PPM Aman</span>
                </div>
              </div>
            </div>

            {/* Countdown Active Timer Banner */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Masa Sewa Aktif: <strong>{activeRental?.name || 'Kandang Bertingkat IoT'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-white">
                <span className="text-cyan-300 font-bold">{countdown.days}h {countdown.hours}j {countdown.minutes}m {countdown.seconds}d</span>
                <span className="text-slate-500">tersisa</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: TABEL PILIHAN KANDANG SATUAN */}
      {activeTab === 'table' && (
        <div className="space-y-4">
          {/* Official 4-Scale Construction Benchmark Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/70 border border-slate-700/80 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    Patokan Harga Kandang: Biaya Konstruksi Fisik vs Sewa Utility Bulanan
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Standar Pinsar & Industri RI
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Sistem sewa utility mengeliminasi 100% biaya modal konstruksi (Capex) di awal bagi peternak
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                ✓ Potong saldo otomatis ke Kas Owner
              </span>
            </div>

            {/* 4 Scales Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Skala Kecil</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">50 Ekor</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Konstruksi: <strong className="text-amber-300 font-mono">Rp 1.5M – Rp 3M</strong>
                </div>
                <div className="text-[11px] font-mono font-bold text-emerald-400">
                  Sewa: Rp 250.000 / bln
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Kapasitas Menengah</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">100 Ekor</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Konstruksi: <strong className="text-amber-300 font-mono">Rp 3.5M – Rp 6.5M</strong>
                </div>
                <div className="text-[11px] font-mono font-bold text-emerald-400">
                  Sewa: Rp 550.000 / bln
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 ring-1 ring-cyan-500/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Skala Komersial</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">500 Ekor</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Konstruksi: <strong className="text-amber-300 font-mono">Rp 15M – Rp 25M</strong>
                </div>
                <div className="text-[11px] font-mono font-bold text-emerald-400">
                  Sewa: Rp 1.850.000 / bln
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Skala Industri</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">1.000 Ekor</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Konstruksi: <strong className="text-amber-300 font-mono">Rp 35M – Rp 55M</strong>
                </div>
                <div className="text-[11px] font-mono font-bold text-emerald-400">
                  Sewa: Rp 3.500.000 / bln
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Jenis Kandang & Spesifikasi</th>
                  <th className="py-3 px-3 text-center">Kapasitas</th>
                  <th className="py-3 px-3">Acuan Biaya Konstruksi</th>
                  <th className="py-3 px-3">Ventilasi & Pendingin</th>
                  <th className="py-3 px-4 text-right">Biaya Sewa Utility</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi Sewa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {METAVERSE_COOP_CATALOG.map((item) => {
                  const isActive = activeRental && activeRental.coopId === item.id && activeRental.status === 'AKTIF';
                  const isAffordable = saldoDompetSaya >= item.monthlyRentIdr;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors hover:bg-slate-800/40 ${
                        item.recommended ? 'bg-cyan-950/15' : ''
                      } ${isActive ? 'bg-emerald-950/20' : ''}`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                              item.recommended
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                : isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            <Home className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">
                                {item.name}
                              </span>
                              {item.recommended && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                                  Best ROI
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-cyan-400 block mt-0.5">
                              {item.tier}
                            </span>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 max-w-xs">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono">
                        <span className="font-bold text-white text-sm">
                          {item.capacityBirds.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Ekor Ayam</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="inline-flex flex-col">
                          <span className="text-amber-300 font-mono font-bold text-[11px]">
                            {item.constructionCostRangeIdr || 'Tergantung Desain'}
                          </span>
                          <span className="text-[9px] text-slate-500">
                            {item.scaleCategory === 'LAHAN' ? 'Plot Tanah' : 'Capex Fisik Dieliminasi'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 max-w-[200px]">
                        <span className="font-semibold text-slate-200 block text-[11px]">
                          {item.ventilationType}
                        </span>
                        <span className="text-[10px] text-emerald-400/90 flex items-center gap-1 mt-0.5">
                          <Wind className="w-3 h-3 shrink-0" />
                          {item.coolingSystem}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-[11px] text-slate-300">
                            <Thermometer className="w-3 h-3 text-cyan-400" />
                            <span>Digital Suhu (°C)</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-300">
                            <Droplets className="w-3 h-3 text-blue-400" />
                            <span>Kelembapan (RH%)</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="text-sm font-extrabold text-amber-300">
                          {formatRupiah(item.monthlyRentIdr)}
                        </div>
                        <span className="text-[10px] text-slate-400 block">/ 30 Hari</span>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {isActive ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              AKTIF
                            </span>
                            <span className="text-[9px] font-mono text-emerald-400 mt-1">
                              {countdown.days}h {countdown.hours}j tersisa
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60">
                            Siap Sewa
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleExecuteRentCoop(item)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs tracking-wide transition flex items-center justify-center gap-1.5 shadow-md ${
                            isActive
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/40'
                              : isAffordable
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Perpanjang</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5" />
                              <span>Sewa</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: MONITORING SENSOR IOT & COUNTDOWN DETAIL */}
      {activeTab === 'iot' && (
        <div className="space-y-4">
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg border ${
                    activeRental && activeRental.status === 'AKTIF'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-950/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {activeRental && activeRental.status === 'AKTIF' ? '📡' : '⚠️'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white">
                      {activeRental?.name || 'Kandang Bertingkat IoT'}
                    </span>
                    {activeRental && activeRental.status === 'AKTIF' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        STATUS KANDANG: AKTIF
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50">
                        STANDBY / BELUM AKTIF
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                    Kontrak ID: <span className="text-cyan-400">{activeRental?.contractCode || 'COOP-IOT-2026-X891'}</span> • LoRaWAN 915MHz • Status: Live
                  </span>
                </div>
              </div>

              {/* Hitung Mundur Masa Sewa (Countdown Timer) */}
              <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800/80 flex items-center gap-3">
                <div className="text-indigo-400">
                  <Clock className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Hitung Mundur Masa Sewa
                  </span>
                  <div className="text-base font-extrabold font-mono text-white tracking-tight flex items-center gap-1">
                    <span className="text-cyan-300">{String(countdown.days).padStart(2, '0')}</span>
                    <span className="text-slate-500 text-xs">h</span>
                    <span className="text-cyan-300">{String(countdown.hours).padStart(2, '0')}</span>
                    <span className="text-slate-500 text-xs">j</span>
                    <span className="text-cyan-300">{String(countdown.minutes).padStart(2, '0')}</span>
                    <span className="text-slate-500 text-xs">m</span>
                    <span className="text-emerald-400 animate-pulse">{String(countdown.seconds).padStart(2, '0')}</span>
                    <span className="text-slate-500 text-xs">d</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const coop = METAVERSE_COOP_CATALOG.find((c) => c.id === (activeRental?.coopId || 'kandang-bertingkat-iot')) || METAVERSE_COOP_CATALOG[1];
                    handleExecuteRentCoop(coop);
                  }}
                  className="ml-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold font-mono transition flex items-center gap-1 shadow-md shadow-indigo-950/40"
                  title="Perpanjang masa sewa +30 Hari lagi"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>+30 Hari</span>
                </button>
              </div>
            </div>

            {/* Countdown Progress Bar */}
            <div className="mt-3 pt-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Masa Sewa Berjalan (30 Hari Siklus)</span>
                <span className="text-cyan-300 font-bold">{countdown.percentRemaining}% Tersisa</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-1000 rounded-full"
                  style={{ width: `${Math.max(4, countdown.percentRemaining)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Real-Time IoT Sensor Telemetry Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Sensor 1: Suhu Kandang Digital (°C) */}
            <div
              className={`p-4 rounded-2xl border transition shadow-lg relative overflow-hidden ${
                isHeatWarning
                  ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-950 border-cyan-500/40 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-cyan-400" />
                  Sensor Suhu (IoT)
                </span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    isHeatWarning
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isHeatWarning ? 'Suhu Tinggi' : 'Ideal 24.0°C'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                  {currentTemp}°C
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Target: 24.0°C
                </span>
              </div>

              <div className="mt-3">
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isHeatWarning ? 'bg-rose-500' : 'bg-cyan-400'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(10, ((currentTemp - 18) / (36 - 18)) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                  <span>18°C</span>
                  <span className="text-emerald-400 font-bold">24°C Optimal</span>
                  <span>36°C</span>
                </div>
              </div>
            </div>

            {/* Sensor 2: Kelembapan Relatif (RH%) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/30 via-slate-900 to-slate-950 border border-blue-500/40 text-slate-200 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  Kelembapan (RH)
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Zona Sehat
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                  {currentHumidity}%
                </span>
                <span className="text-xs font-mono text-slate-400">
                  RH Standar (60-70%)
                </span>
              </div>

              <div className="mt-3">
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, currentHumidity)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                  <span>40%</span>
                  <span className="text-blue-400 font-bold">65% Nyaman</span>
                  <span>90%</span>
                </div>
              </div>
            </div>

            {/* Sensor 3: Gas Amonia (NH3) & Biosekuriti */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/40 text-slate-200 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Gas Amonia (NH3)
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Aman (&lt;15 ppm)
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                  7.8 <span className="text-sm font-normal text-slate-400">PPM</span>
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  Steril (0% Bau)
                </span>
              </div>

              <div className="mt-3">
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: '26%' }} />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                  <span>0 ppm</span>
                  <span className="text-emerald-400 font-bold">7.8 ppm</span>
                  <span>25 ppm Limit</span>
                </div>
              </div>
            </div>

            {/* Sensor 4: Evaporative Cooling Pad & Exhaust Fan */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 border border-indigo-500/40 text-slate-200 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-indigo-400" />
                  Cooling Pad & Fan
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Aktif (1.450 RPM)
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                  {simulatedFanBoost ? '1.800' : '1.450'} <span className="text-sm font-normal text-slate-400">RPM</span>
                </span>
                <span className="text-xs font-mono text-indigo-300">
                  Tunnel 2.4 m/s
                </span>
              </div>

              <div className="mt-3">
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400" style={{ width: '80%' }} />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                  <span>0 RPM</span>
                  <span className="text-indigo-400 font-bold">Negative Pressure</span>
                  <span>2.000 Max</span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostik Sensor Otomatis */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-200 text-xs block">
                Kalibrasi & Diagnostik Respon Sensor IoT:
              </span>
              <span className="text-[11px] text-slate-400">
                Uji diagnosa respon pendingin evaporative pad dan exhaust fan terhadap fluktuasi mikroklimat kandang.
              </span>
            </div>
            <button
              type="button"
              disabled={isSimulatingHeat}
              onClick={handleTriggerHeatSpike}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition flex items-center gap-1.5 ${
                isSimulatingHeat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSimulatingHeat ? 'Diagnostik Berjalan...' : 'Uji Respon Sensor Otomatis (+6°C)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: SLA & SPESIFIKASI */}
      {activeTab === 'specs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">
              SLA Teknis & Dokumen Spesifikasi Infrastruktur
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Standar arsitektur peternakan unggas berdaulat Gamegrafity Farm Sovereign Mode.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-400 text-sm block">1. Otomasi Iklim 24/7</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Sistem pendingin evaporative cellulose pad otomatis terhubung dengan sensor suhu SHT31. Kipas exhaust tunnel menjaga kecepatan udara 2.0 - 2.5 m/s untuk pendinginan angin sejuk (wind chill effect) tanpa menyebabkan ayam masuk angin.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm block">2. Kas Treasury Owner On-Chain</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Setiap pembayaran sewa bulanan langsung dialokasikan 100% tanpa potongan perantara broker ke alamat kas reserve <code>0xOwnerTreasuryProtocolReserve89D2</code>. Bukti transaksi dicatat on-chain dengan Merkle Root Leaf hash.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">3. Jaminan Suplai Tak Pernah Habis</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Didukung ekosistem digital suplai hulu tak terbatas (Isa Brown, pakan konsentrat CP 21%, vaksin ND-IB, dan listrik microgrid) dengan pre-order terjadwal sehingga peternak tidak pernah mengalami kekosongan stok.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rent Success Modal Confirmation */}
      {showRentSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white">
                Sewa Infrastruktur Berhasil Diaktifkan!
              </h3>
              <p className="text-xs text-slate-300">
                {justRentedName} telah berstatus <strong>AKTIF</strong>. Saldo dompet peternak berhasil dipotong dan seketika disetorkan ke Kas Treasury Owner.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Durasi Sewa:</span>
                <span className="text-cyan-300 font-bold">30 Hari Penuh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sensor IoT LoRaWAN:</span>
                <span className="text-emerald-400 font-bold">Aktif (24°C / RH 65%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kas Treasury Owner:</span>
                <span className="text-amber-300 font-bold">Terkredit Seketika</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRentSuccessModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider transition"
            >
              Lihat Dashboard Monitoring IoT &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
