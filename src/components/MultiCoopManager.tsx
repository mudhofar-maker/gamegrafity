import React, { useState, useMemo } from 'react';
import {
  Home,
  Egg,
  TrendingUp,
  Zap,
  Sparkles,
  ShieldCheck,
  Plus,
  Thermometer,
  Droplets,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Award,
  DollarSign
} from 'lucide-react';
import { CoopUnit, CoopUnitStatus } from '../types/farm';
import { formatRupiah } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface MultiCoopManagerProps {
  coops: CoopUnit[];
  onAddCoop: (newCoop: CoopUnit, costIdr: number) => void;
  onIncubateHatch: (coopId: number, count: number) => void;
  saldoDompetSaya: number;
  kasTreasuryOwner: number;
  accumulatedEggs: number;
  totalHatcheryStock: number;
  onOpenTopUp: () => void;
}

export const MultiCoopManager: React.FC<MultiCoopManagerProps> = ({
  coops,
  onAddCoop,
  onIncubateHatch,
  saldoDompetSaya,
  kasTreasuryOwner,
  accumulatedEggs,
  totalHatcheryStock,
  onOpenTopUp,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'Active' | 'Hatching' | 'Full'>('ALL');
  const [isExpanding, setIsExpanding] = useState(false);
  const [showScaleModal, setShowScaleModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 4 Official Scales & Construction Cost Benchmarks
  const EXPANSION_SCALES = [
    {
      id: 'scale-50',
      title: 'Skala Kecil (50 Ekor)',
      capacity: 50,
      constructionCostRange: 'Rp 1.500.000 – Rp 3.000.000',
      monthlyRentIdr: 250000,
      tier: 'Modular Semi-Closed Mini',
      initialBirds: 40,
      badge: 'Hemat Capex (Pemula)',
      description: 'Kandang modular mini ram kawat ganda. Menghemat biaya konstruksi fisik Rp 1.5M - 3M.',
    },
    {
      id: 'scale-100',
      title: 'Kapasitas Menengah (100 Ekor)',
      capacity: 100,
      constructionCostRange: 'Rp 3.500.000 – Rp 6.500.000',
      monthlyRentIdr: 550000,
      tier: 'Semi-Closed Standar Galvanis',
      initialBirds: 85,
      badge: 'Standar Pinsar',
      description: 'Kandang standar semi-closed galvanis. Mengeliminasi modal konstruksi Rp 3.5M - 6.5M.',
    },
    {
      id: 'scale-500',
      title: 'Skala Komersial (500 Ekor)',
      capacity: 500,
      constructionCostRange: 'Rp 15.000.000 – Rp 25.000.000',
      monthlyRentIdr: 1850000,
      tier: 'Smart Multi-Tier Closed House',
      initialBirds: 440,
      badge: 'Best ROI LoRaWAN',
      description: 'Closed house 3 tingkat galvanis LoRaWAN + evaporative pad. Bebas modal Rp 15M - 25M.',
    },
    {
      id: 'scale-1000',
      title: 'Skala Industri (1.000 Ekor)',
      capacity: 1000,
      constructionCostRange: 'Rp 35.000.000 – Rp 55.000.000',
      monthlyRentIdr: 3500000,
      tier: 'Hyper-Scale Mega Closed House',
      initialBirds: 880,
      badge: 'Hyper-Scale Mega',
      description: 'Mega closed house AI microclimate HVAC & konveyor telur. Bebas modal Rp 35M - 55M.',
    },
  ];

  // Growth Journey Milestones (Requested: 10 -> 20 -> 40 -> 1000 -> 6000 ekor)
  const totalChickens = useMemo(
    () => coops.reduce((sum, c) => sum + c.chickenCount, 0),
    [coops]
  );
  const totalCapacity = useMemo(
    () => coops.reduce((sum, c) => sum + c.capacity, 0),
    [coops]
  );
  const totalDailyEggs = useMemo(
    () => Math.floor(totalChickens * 0.88),
    [totalChickens]
  );
  const dailyGrossRevenueIdr = totalDailyEggs * 2500;
  const monthlyGrossRevenueIdr = dailyGrossRevenueIdr * 30;

  const milestones = [
    { target: 10, label: '10 Ekor', desc: 'Genesis Awal' },
    { target: 20, label: '20 Ekor', desc: 'Inkubasi Batch #1' },
    { target: 40, label: '40 Ekor', desc: 'Mandiri Pangan' },
    { target: 150, label: '150 Ekor', desc: 'Kandang Standar' },
    { target: 500, label: '500 Ekor', desc: 'Pro Tier-1 Closed' },
    { target: 1000, label: '1.000 Ekor', desc: 'Sovereign Megahub' },
    { target: 6000, label: '6.000 Ekor', desc: 'Hyper-Scale Master' },
  ];

  // Current active milestone index
  const currentMilestoneIndex = milestones.findIndex((m) => totalChickens < m.target);
  const activeLevel = currentMilestoneIndex === -1 ? milestones.length - 1 : Math.max(0, currentMilestoneIndex);

  const handleSelectScaleToExpand = (scaleItem: typeof EXPANSION_SCALES[0]) => {
    if (coops.length >= 20) {
      setErrorMessage('Kapasitas maksimal 20 unit kandang telah tercapai!');
      return;
    }

    if (saldoDompetSaya < scaleItem.monthlyRentIdr) {
      sounds.playError();
      const kurang = scaleItem.monthlyRentIdr - saldoDompetSaya;
      setErrorMessage(`Saldo dompet tidak cukup untuk ${scaleItem.title}! Butuh ${formatRupiah(scaleItem.monthlyRentIdr)}, kurang ${formatRupiah(kurang)}.`);
      onOpenTopUp();
      return;
    }

    setErrorMessage(null);
    setIsExpanding(true);
    sounds.playDirectivePing();

    setTimeout(() => {
      setIsExpanding(false);
      setShowScaleModal(false);
      const newId = coops.length + 1;
      const initialBirds = scaleItem.initialBirds;

      const newUnit: CoopUnit = {
        id: newId,
        name: `${scaleItem.title} #${newId}`,
        capacity: scaleItem.capacity,
        status: initialBirds >= scaleItem.capacity ? 'Full' : 'Active',
        chickenCount: initialBirds,
        tier: scaleItem.tier,
        dailyEggs: Math.floor(initialBirds * 0.88),
        feedDailyKg: Math.round(initialBirds * 0.12),
        tempC: 24.0,
        humidityRh: 65,
        ammoniaPpm: scaleItem.capacity >= 1000 ? 5.2 : scaleItem.capacity >= 500 ? 6.5 : 7.8,
      };

      onAddCoop(newUnit, scaleItem.monthlyRentIdr);
      sounds.playCash();

      // Trigger celebratory confetti if crossing major milestones
      if (totalChickens + initialBirds >= 1000 || totalChickens + initialBirds >= 6000) {
        try {
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.5 },
          });
        } catch (_) {}
      }
    }, 500);
  };

  const filteredCoops = coops.filter((c) => {
    if (selectedFilter === 'ALL') return true;
    return c.status === selectedFilter;
  });

  return (
    <div id="multi-coop-manager-section" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-200">
      {/* Scale Expansion Selector Modal */}
      {showScaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-cyan-400" />
                  Pilih Skala Kandang yang Ingin Dibuka
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bebas beban modal konstruksi fisik dengan sistem sewa utility bulanan langsung ke Kas Owner
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowScaleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXPANSION_SCALES.map((scale) => {
                const isAffordable = saldoDompetSaya >= scale.monthlyRentIdr;
                return (
                  <div
                    key={scale.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-white text-sm">{scale.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {scale.badge}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{scale.tier}</div>
                      
                      <div className="mt-2 p-2 bg-slate-900/80 rounded-lg space-y-1 text-[11px]">
                        <div className="flex justify-between text-slate-400">
                          <span>Acuan Konstruksi Fisik:</span>
                          <span className="text-amber-300 font-mono font-semibold">{scale.constructionCostRange}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Sewa Utility Bulanan:</span>
                          <span className="text-emerald-400 font-mono font-bold">{formatRupiah(scale.monthlyRentIdr)} / bln</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                        {scale.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectScaleToExpand(scale)}
                      disabled={isExpanding}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                        isAffordable
                          ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAffordable ? `Buka Unit (${formatRupiah(scale.monthlyRentIdr)})` : `Top Up (${formatRupiah(scale.monthlyRentIdr)})`}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 1. Header & Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-950/40">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Manajemen Multi-Kandang & Mesin Tetas (Sovereign Scale)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Target: 6.000 Ekor
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Skala peternak berdaulat: Ekspansi kandang bertahap dari 10 &rarr; 40 &rarr; 1.000 hingga 6.000 ekor ayam
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buka Kandang Baru */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setShowScaleModal(true);
              sounds.playClick();
            }}
            disabled={isExpanding || coops.length >= 20}
            className="group relative px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-950/50 flex items-center gap-2 transition active:scale-95 disabled:opacity-50 border border-purple-400/30"
          >
            <span className="text-base group-hover:scale-110 transition">🏗️</span>
            <span>{isExpanding ? 'Memproses Ekspansi...' : 'Buka Kandang Baru (4 Skala)'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-purple-200 font-mono">
              Sewa Utility / Bln
            </span>
          </button>
        </div>
      </div>

      {/* 2. Sovereign Scaling Journey (10 -> 20 -> 40 -> 1000 -> 6000 ekor) */}
      <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Jenjang Skala Peternak (Roadmap Panen Besar)
          </span>
          <span className="font-mono text-cyan-400">
            Total Populasi: <strong className="text-white text-sm">{totalChickens.toLocaleString()}</strong> / {totalCapacity.toLocaleString()} Ekor ({Math.round((totalChickens / totalCapacity) * 100)}% Kapasitas)
          </span>
        </div>

        {/* Milestone Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {milestones.map((m, idx) => {
            const isReached = totalChickens >= m.target;
            const isCurrent = idx === activeLevel;

            return (
              <div
                key={m.target}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isReached
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : isCurrent
                    ? 'bg-purple-950/40 border-purple-500/60 text-purple-200 ring-1 ring-purple-500'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[11px] font-bold font-mono flex items-center justify-center gap-1">
                  {isReached && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  {m.label}
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5 truncate">{m.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(5, (totalChickens / 6000) * 100))}%` }}
          />
        </div>
      </div>

      {/* 3. KPI Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Jumlah Kandang</span>
            <Home className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {coops.length} <span className="text-xs text-slate-400 font-normal">Unit</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Maks. 20 Kandang</p>
        </div>

        <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Produksi Telur / Hari</span>
            <Egg className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">
            +{totalDailyEggs.toLocaleString()} <span className="text-xs text-slate-400 font-normal">Butir</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">~{((totalDailyEggs * 62.5) / 1000).toFixed(1)} Kg / hari</p>
        </div>

        <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Omzet Kotor / Bulan</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {formatRupiah(monthlyGrossRevenueIdr)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Pinsar Rp 2.500 / butir</p>
        </div>

        <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Mesin Tetas Otomatis</span>
            <Zap className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-300 mt-1">
            {totalHatcheryStock} <span className="text-xs text-slate-400 font-normal">DOC Ready</span>
          </div>
          <p className="text-[10px] text-purple-400/80 mt-0.5">Inkubasi 21 Hari Aktif</p>
        </div>
      </div>

      {/* 4. Filter Buttons */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold text-slate-300">
          Daftar Kandang Aktif ({filteredCoops.length} Unit)
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {(['ALL', 'Active', 'Hatching', 'Full'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setSelectedFilter(filter);
                sounds.playClick();
              }}
              className={`px-3 py-1 rounded-lg transition ${
                selectedFilter === filter
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter === 'ALL' ? 'Semua' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Grid Daftar Kandang Peternak */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredCoops.map((coop) => {
          const fillPercent = Math.min(100, Math.round((coop.chickenCount / coop.capacity) * 100));
          const isFull = coop.chickenCount >= coop.capacity;

          return (
            <div
              key={coop.id}
              className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg flex flex-col justify-between transition-all group hover:shadow-cyan-950/20"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-amber-300 font-mono">
                      Kandang #{coop.id}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({coop.tier || 'IoT Multi-Tier'})
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isFull
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : coop.status === 'Hatching'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {isFull ? 'Full' : coop.status}
                  </span>
                </div>

                {/* Population and Capacity */}
                <div className="space-y-1.5 my-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Populasi:</span>
                    <span className="font-bold text-white">
                      {coop.chickenCount} / {coop.capacity} Ekor
                    </span>
                  </div>
                  {/* Capacity Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull
                          ? 'bg-red-500'
                          : fillPercent > 70
                          ? 'bg-amber-400'
                          : 'bg-cyan-400'
                      }`}
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                </div>

                {/* Production Stats */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] font-mono">
                  <div className="text-slate-400">
                    <div>Telur / Hari</div>
                    <div className="font-bold text-amber-300">
                      +{Math.floor(coop.chickenCount * 0.88)} butir
                    </div>
                  </div>
                  <div className="text-slate-400">
                    <div>Pakan / Hari</div>
                    <div className="font-bold text-cyan-300">
                      ~{Math.round(coop.chickenCount * 0.12)} Kg
                    </div>
                  </div>
                </div>

                {/* IoT Quick Sensor Readout */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2.5 pt-2 border-t border-slate-800/60">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Thermometer className="w-3 h-3" />
                    {coop.tempC || 24.0}°C
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Droplets className="w-3 h-3" />
                    {coop.humidityRh || 65}% RH
                  </span>
                  <span className="text-slate-500">
                    NH3: {coop.ammoniaPpm || 7.2} PPM
                  </span>
                </div>
              </div>

              {/* Action buttons inside card */}
              <div className="mt-3 pt-2">
                {!isFull && totalHatcheryStock > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const amount = Math.min(20, coop.capacity - coop.chickenCount, totalHatcheryStock);
                      onIncubateHatch(coop.id, amount);
                      sounds.playCash();
                    }}
                    className="w-full py-1.5 px-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <span>🐣 Masukkan DOC Tetas (+20 Ekor)</span>
                  </button>
                ) : (
                  <div className="text-[10px] text-center text-slate-500 font-mono py-1">
                    {isFull ? '✓ Kapasitas Maksimal Terisi' : 'Siap Menerima Batch Ayam'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Insight Note */}
      <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
        <span className="text-base">💡</span>
        <span>
          Setiap kali peternak menambah kandang baru melalui mesin tetas atau sewa infrastruktur, omzet suplai konsentrat hulu dan sewa bulanan otomatis bermuara menambah <strong>Kas Treasury Owner (+Rp 750.000 / kandang)</strong>.
        </span>
      </div>
    </div>
  );
};
