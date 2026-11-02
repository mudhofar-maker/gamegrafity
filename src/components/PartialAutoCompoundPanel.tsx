import React, { useState, useMemo } from 'react';
import { AutoCompoundConfig, BiologicalCycle } from '../types/farm';
import { formatRupiah } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  TrendingUp,
  RefreshCw,
  Wallet,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  PieChart,
  Sliders,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  Bird,
  Wheat,
  Clock
} from 'lucide-react';

interface PartialAutoCompoundPanelProps {
  config: AutoCompoundConfig;
  onUpdateConfig: (newConfig: AutoCompoundConfig) => void;
  onExecuteCompoundBatch: (amountToCompound: number, cashPayoutAmount: number) => void;
  cycle: BiologicalCycle;
  saldoDompetSaya: number;
}

export const PartialAutoCompoundPanel: React.FC<PartialAutoCompoundPanelProps> = ({
  config,
  onUpdateConfig,
  onExecuteCompoundBatch,
  cycle,
  saldoDompetSaya
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number>(config.cashPayoutPercent);
  const [simulatedFlockBase, setSimulatedFlockBase] = useState<number>(500);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Quick preset ratios
  const presets = [
    { label: '50% Tunai : 50% Compound', cash: 50, compound: 50, tag: 'Aggressive Growth' },
    { label: '60% Tunai : 40% Compound', cash: 60, compound: 40, tag: 'Rekomendasi Utama (Balanced)', recommended: true },
    { label: '70% Tunai : 30% Compound', cash: 70, compound: 30, tag: 'High Cash Flow' },
  ];

  const handleSelectPreset = (cashPercent: number) => {
    setSelectedPreset(cashPercent);
    onUpdateConfig({
      ...config,
      cashPayoutPercent: cashPercent,
      autoCompoundPercent: 100 - cashPercent,
    });
    sounds.playClick();
  };

  const handleToggleAutoCompound = () => {
    onUpdateConfig({
      ...config,
      isEnabled: !config.isEnabled,
    });
    sounds.playClick();
  };

  const handleSetTargetReinvestment = (target: AutoCompoundConfig['targetReinvestment']) => {
    onUpdateConfig({
      ...config,
      targetReinvestment: target,
    });
    sounds.playClick();
  };

  // Monthly Simulation Calculations
  const calc = useMemo(() => {
    const birds = simulatedFlockBase;
    const dailyEggs = Math.floor(birds * 0.88);
    const monthlyEggs = dailyEggs * 30;
    const monthlyKg = Number(((monthlyEggs * 62.5) / 1000).toFixed(1));
    const grossRevenue = monthlyKg * 30000; // Rp 30.000 / Kg

    // Package cost
    const packageCost = birds <= 150 ? 1250000 : birds <= 500 ? 2350000 : 4000000;
    // Feed: 3.3 kg/month * Rp 7.000/kg
    const feedCost = Math.round(birds * 3.3 * 7000);
    const utilityCost = birds <= 150 ? 500000 : birds <= 500 ? 1200000 : 3500000;
    const totalExpenses = packageCost + feedCost + utilityCost;

    // Monthly Net Profit
    const netProfit = Math.max(0, grossRevenue - totalExpenses);

    const cashSharePercent = config.cashPayoutPercent;
    const compoundSharePercent = config.autoCompoundPercent;

    const cashPayout = Math.round((netProfit * cashSharePercent) / 100);
    const compoundPayout = Math.round((netProfit * compoundSharePercent) / 100);

    // Compound power: How many birds and how much feed does it buy?
    // Pullet Rp 45.000 / bird, Feed Rp 7.000 / kg
    const newBirdsFromCompound = Math.floor((compoundPayout * 0.6) / 45000);
    const newFeedKgFromCompound = Math.floor((compoundPayout * 0.4) / 7000);

    // Multi-month growth simulation
    // Month 1
    const m1Birds = birds;
    const m1Net = netProfit;
    const m1Cash = cashPayout;
    const m1Compound = compoundPayout;
    const m1AddedBirds = newBirdsFromCompound;

    // Month 2 (Compounded)
    const m2Birds = m1Birds + m1AddedBirds;
    const m2Net = Math.round(m1Net * (m2Birds / m1Birds));
    const m2Cash = Math.round((m2Net * cashSharePercent) / 100);
    const m2Compound = Math.round((m2Net * compoundSharePercent) / 100);
    const m2AddedBirds = Math.floor((m2Compound * 0.6) / 45000);

    // Month 3 (Compounded)
    const m3Birds = m2Birds + m2AddedBirds;
    const m3Net = Math.round(m1Net * (m3Birds / m1Birds));
    const m3Cash = Math.round((m3Net * cashSharePercent) / 100);
    const m3Compound = Math.round((m3Net * compoundSharePercent) / 100);
    const m3AddedBirds = Math.floor((m3Compound * 0.6) / 45000);

    const total3MonthsCash = m1Cash + m2Cash + m3Cash;
    const totalFlockGrowth = m1AddedBirds + m2AddedBirds + m3AddedBirds;
    const totalAssetValueAdded = totalFlockGrowth * 45000;

    return {
      birds,
      monthlyEggs,
      monthlyKg,
      grossRevenue,
      packageCost,
      feedCost,
      utilityCost,
      totalExpenses,
      netProfit,
      cashPayout,
      compoundPayout,
      newBirdsFromCompound,
      newFeedKgFromCompound,
      projection: [
        { month: 'Bulan 1', birds: m1Birds, netProfit: m1Net, cash: m1Cash, compound: m1Compound, addedBirds: m1AddedBirds },
        { month: 'Bulan 2', birds: m2Birds, netProfit: m2Net, cash: m2Cash, compound: m2Compound, addedBirds: m2AddedBirds },
        { month: 'Bulan 3', birds: m3Birds, netProfit: m3Net, cash: m3Cash, compound: m3Compound, addedBirds: m3AddedBirds },
      ],
      total3MonthsCash,
      totalFlockGrowth,
      totalAssetValueAdded
    };
  }, [simulatedFlockBase, config.cashPayoutPercent, config.autoCompoundPercent]);

  // Execute compound manual simulation
  const handleExecuteManualBatch = () => {
    setIsExecuting(true);
    sounds.playDirectivePing();

    setTimeout(() => {
      setIsExecuting(false);
      sounds.playCash();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 }
      });
      onExecuteCompoundBatch(calc.compoundPayout, calc.cashPayout);
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* 1. Header & Switch Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/40 border border-purple-400/30">
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white tracking-wide">
                Fitur Partial Auto-Compound (Otomasi Panen Berdaulat)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold uppercase">
                Zero Capital Inflow
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Bagi hasil panen secara otomatis: sebagian masuk saldo tunai cair (50-60%), sisanya (40-50%) diputar kembali untuk ekspansi peternakan tanpa setor modal baru.
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <span className="text-xs font-mono font-semibold text-slate-300">
            Status Auto-Compound:
          </span>
          <button
            type="button"
            onClick={handleToggleAutoCompound}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              config.isEnabled
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${config.isEnabled ? 'bg-emerald-200 animate-ping' : 'bg-slate-500'}`} />
            {config.isEnabled ? 'AKTIF (Otomatis)' : 'NON-AKTIF'}
          </button>
        </div>
      </div>

      {/* 2. Interactive Ratio Selector & Visual Dual Bar */}
      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Pilih Rasio Pembagian Hasil Panen:
          </span>
          <span className="text-xs font-mono text-slate-400">
            Porsi Tunai: <strong className="text-emerald-400">{config.cashPayoutPercent}%</strong> • Porsi Compound: <strong className="text-purple-400">{config.autoCompoundPercent}%</strong>
          </span>
        </div>

        {/* Preset Ratio Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {presets.map((p) => {
            const isSelected = config.cashPayoutPercent === p.cash;
            return (
              <button
                key={p.cash}
                type="button"
                onClick={() => handleSelectPreset(p.cash)}
                className={`p-3 rounded-xl text-left border transition relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-950/60 to-purple-950/60 border-cyan-400/50 shadow-md ring-1 ring-cyan-500/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                {p.recommended && (
                  <span className="absolute -top-2 right-2 text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded-full bg-cyan-500 text-black">
                    Rekomendasi
                  </span>
                )}
                <div className="font-bold text-xs text-white">
                  {p.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  {p.tag}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dual Progress Visualizer */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              Porsi Tunai Cair: {config.cashPayoutPercent}% ({formatRupiah(calc.cashPayout)})
            </span>
            <span className="text-purple-400 font-bold flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" />
              Porsi Diputar Otomatis: {config.autoCompoundPercent}% ({formatRupiah(calc.compoundPayout)})
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${config.cashPayoutPercent}%` }}
              title={`Porsi Tunai: ${config.cashPayoutPercent}%`}
            />
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${config.autoCompoundPercent}%` }}
              title={`Porsi Compound: ${config.autoCompoundPercent}%`}
            />
          </div>
        </div>
      </div>

      {/* 3. Target Reinvestment Allocation Options */}
      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
        <span className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider block">
          Tujuan Reinvestasi Dana Compound (Otomatis):
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Option 1: Pakan */}
          <button
            type="button"
            onClick={() => handleSetTargetReinvestment('FEED_AND_SUPPLIES')}
            className={`p-3 rounded-xl text-left border transition flex items-start gap-2.5 ${
              config.targetReinvestment === 'FEED_AND_SUPPLIES'
                ? 'bg-yellow-950/30 border-yellow-500/50 text-yellow-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Wheat className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">100% Pakan & Suplai</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Membeli stok pakan konsentrat CP 21% & vitamin secara kontinu untuk buffer silo aman.
              </span>
            </div>
          </button>

          {/* Option 2: Ayam */}
          <button
            type="button"
            onClick={() => handleSetTargetReinvestment('EXPAND_FLOCK_CAPACITY')}
            className={`p-3 rounded-xl text-left border transition flex items-start gap-2.5 ${
              config.targetReinvestment === 'EXPAND_FLOCK_CAPACITY'
                ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Bird className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">100% Ekspansi Ayam</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Membeli bibit ayam Isa Brown baru untuk menaikkan tonase panen telur harian.
              </span>
            </div>
          </button>

          {/* Option 3: Hybrid */}
          <button
            type="button"
            onClick={() => handleSetTargetReinvestment('HYBRID_GROWTH')}
            className={`p-3 rounded-xl text-left border transition flex items-start gap-2.5 ${
              config.targetReinvestment === 'HYBRID_GROWTH'
                ? 'bg-indigo-950/40 border-cyan-400/50 text-cyan-200 shadow-md ring-1 ring-cyan-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Hybrid Growth (50:50)</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                50% untuk pakan harian + 50% untuk penambahan ayam produktif baru. Keseimbangan optimal.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Real-Time Compounding Monitoring Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Dana Ter-Compound</span>
          <div className="text-lg font-black font-mono text-purple-300 mt-1">
            {formatRupiah(config.totalCompoundedAmountIdr)}
          </div>
          <span className="text-[10px] font-mono text-slate-500 block mt-0.5">{config.compoundingCyclesCompleted} Siklus Terlaksana</span>
        </div>

        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Ayam dari Compound</span>
          <div className="text-lg font-black font-mono text-emerald-400 mt-1">
            +{config.totalAdditionalBirdsFromCompound} Ekor
          </div>
          <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Menaikkan +{config.totalAdditionalBirdsFromCompound * 0.88} butir/hari</span>
        </div>

        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Pakan Terbeli Otomatis</span>
          <div className="text-lg font-black font-mono text-yellow-300 mt-1">
            +{config.totalFeedStockPurchasedKg} Kg
          </div>
          <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Buffer Silo Otomatis</span>
        </div>

        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Pertumbuhan Modal</span>
          <div className="text-lg font-black font-mono text-cyan-300 mt-1">
            +{config.projectedMonthlyGrowthRatePercent}% <span className="text-xs font-normal text-slate-400">/ bln</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">Tanpa Setor Modal Baru</span>
        </div>
      </div>

      {/* 5. 3-Month Compounding Projection Simulator Table */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
              Tabel Proyeksi Compounding 3 Bulan (Kapasitas Awal: {calc.birds} Ekor):
            </span>
            <span className="text-[11px] text-slate-400">
              Perhatikan bagaimana porsi kas tunai terus meningkat seiring bertambahnya populasi ayam dari dana compound.
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 block">Total Tunai Diterima (3 Bulan):</span>
            <span className="text-base font-extrabold font-mono text-emerald-400">{formatRupiah(calc.total3MonthsCash)}</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-2.5 px-3">Periode</th>
                <th className="py-2.5 px-3">Populasi Unggas</th>
                <th className="py-2.5 px-3">Net Profit Bersih</th>
                <th className="py-2.5 px-3 text-emerald-400">Porsi Tunai ({config.cashPayoutPercent}%)</th>
                <th className="py-2.5 px-3 text-purple-400">Porsi Compound ({config.autoCompoundPercent}%)</th>
                <th className="py-2.5 px-3 text-right">Pertumbuhan Ayam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {calc.projection.map((p, idx) => (
                <tr key={p.month} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-bold text-white">{p.month}</td>
                  <td className="py-2.5 px-3 text-slate-300">{p.birds.toLocaleString()} Ekor</td>
                  <td className="py-2.5 px-3 text-slate-200">{formatRupiah(p.netProfit)}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{formatRupiah(p.cash)}</td>
                  <td className="py-2.5 px-3 text-purple-300">{formatRupiah(p.compound)}</td>
                  <td className="py-2.5 px-3 text-right text-cyan-300 font-bold">+{p.addedBirds} Ekor</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
          <span>Nilai Aset Tambahan Tanpa Modal Baru: <strong className="text-cyan-300">+{calc.totalFlockGrowth} Ekor ({formatRupiah(calc.totalAssetValueAdded)})</strong></span>
          <span className="text-emerald-400">✓ Kas Treasury Owner otomatis bertambah dari pembelian pakan & bibit berdaulat</span>
        </div>
      </div>

      {/* 6. Action Button: Execute Manual Batch */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-400">
          Setiap siklus panen berjalan, sistem secara otomatis mengeksekusi split pembayaran ini ke saldo peternak & Kas Owner.
        </div>
        <button
          type="button"
          disabled={isExecuting}
          onClick={handleExecuteManualBatch}
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 hover:from-purple-500 hover:to-teal-500 text-white font-extrabold text-xs tracking-wider uppercase transition shadow-lg shadow-purple-950/40 flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {isExecuting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Memproses Compounding...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 text-purple-200" />
              <span>Simulasikan & Jalankan Compound Sekarang</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
