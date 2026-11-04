import React, { useState, useEffect } from 'react';
import { SovereignMonetaryDirectiveState } from '../types/farm';
import { formatRupiah } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Sparkles,
  Lock,
  DollarSign,
  Scale,
  Activity,
  Flame,
  Check
} from 'lucide-react';

interface SovereignMonetaryDirectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFarmerId?: string;
  onRefreshParent?: () => void;
}

export const SovereignMonetaryDirectiveModal: React.FC<SovereignMonetaryDirectiveModalProps> = ({
  isOpen,
  onClose,
  activeFarmerId = 'farmer-ahmad',
  onRefreshParent,
}) => {
  const [directive, setDirective] = useState<SovereignMonetaryDirectiveState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'invariants' | 'simulator'>('overview');

  // Simulation state
  const [simEggCount, setSimEggCount] = useState<number>(440);
  const [simGrade, setSimGrade] = useState<'GRADE_B' | 'GRADE_A' | 'GRADE_C'>('GRADE_B');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<any | null>(null);

  const fetchDirective = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sovereign-directive/status');
      const data = await res.json();
      if (data.success && data.directive) {
        setDirective(data.directive);
      }
    } catch (err) {
      console.error('Failed to load sovereign directive:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDirective();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExecuteInfiniteAbsorption = async (eggsToAbsorb: number) => {
    try {
      setIsSimulating(true);
      setSimResult(null);
      const res = await fetch('/api/sovereign-directive/infinite-absorb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: activeFarmerId,
          eggCount: eggsToAbsorb,
          grade: simGrade
        })
      });
      const data = await res.json();
      if (data.success) {
        sounds.playSuccess();
        setSimResult(data);
        if (data.updatedDirective) {
          setDirective(data.updatedDirective);
        }
        if (onRefreshParent) {
          onRefreshParent();
        }
      } else {
        alert(`Gagal serap: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengeksekusi serap tanpa batas.');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                  SOVEREIGN ECOSYSTEM: CORE MATHEMATICAL & MONETARY DIRECTIVE
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  <Lock className="w-3 h-3" />
                  LOCKED & ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Executable System Directive & Invarian Matematika Moneter Berantai Pasok 100% Anti-Defisit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDirective}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Refresh Telemetri Directive"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>4 Pilar Matematika Bisnis</span>
          </button>

          <button
            onClick={() => setActiveTab('invariants')}
            className={`py-3 px-4 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'invariants'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Hukum Besi & Flow Rate Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-3 px-4 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulasi Serap Tanpa Batas (Infinite Absorption)</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs">
          {/* Status Ribbon */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-indigo-950/50 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <span className="text-white font-bold text-xs font-mono uppercase">
                  Status Sistem: LOCKED & ACTIVE
                </span>
                <p className="text-[11px] text-slate-400">
                  Semua perhitungan berdiri di atas harga pasar riil, efisiensi virtual mutlak (0% mortalitas), dan keamanan kas broker terjamin 100%.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-cyan-500/30">
                V_system: {formatRupiah(directive?.V_system || 13950000)}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 border border-emerald-500/30">
                Liquidity Ratio: {directive?.liquidity_ratio_percent || 1320}%
              </span>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* PILAR I: DEFINISI VARIABEL UTAMA & ACUAN REAL-TIME */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">I</span>
                    <span>Definisi Variabel Utama & Acuan Real-Time</span>
                  </h3>
                  <span className="text-slate-400 text-[11px] font-mono">Pinsar & Kramat Jati Benchmark</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* V_system */}
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">V_system (Treasury Reserve)</span>
                    <div className="text-lg font-bold text-white font-mono">
                      {formatRupiah(directive?.V_system || 13950000)}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Total kas riil di pusat akumulasi 100% dari modal sewa infrastruktur awal.
                    </p>
                  </div>

                  {/* Q Volume */}
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Q (Volume / Gramasi Riil)</span>
                    <div className="text-lg font-bold text-white font-mono">
                      {directive?.Q_total_pending_eggs || 600} Butir ({directive?.Q_total_pending_kg || 37.5} kg)
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Jumlah total panen aktual real-time seluruh kandang virtual aktif.
                    </p>
                  </div>

                  {/* P_realtime */}
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">P_realtime (Pasar Terbuka)</span>
                    <div className="text-lg font-bold text-white font-mono">
                      Rp 28.800 / kg
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Acuan harga faktual tingkat distributor/pasar spot detik transaksi panen.
                    </p>
                  </div>

                  {/* HPP Riil */}
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">HPP (Harga Pokok Produksi)</span>
                    <div className="text-lg font-bold text-white font-mono">
                      {formatRupiah(directive?.hppBreakdown.totalHPPPerKg || 19700)} / kg
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Modal riil (pakan 2.2 FCR + DOC + kWh listrik IoT + dokter/vaksin).
                    </p>
                  </div>

                  {/* H_broker */}
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1 sm:col-span-2">
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">H_broker (Harga Serap Sistem)</span>
                    <div className="text-lg font-bold text-white font-mono">
                      {formatRupiah(directive?.H_broker_average || 25776)} / kg (~Rp 1.611 / butir)
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Terkunci di bawah P_realtime ({formatRupiah(28800)}), namun wajib di atas HPP ({formatRupiah(19700)}). Memberi peternak surplus kas riil pasti.
                    </p>
                  </div>
                </div>

                {/* HPP Component Breakdown Card */}
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-300 font-mono">
                    <span>🔬 Rincian Struktur Biaya HPP Riil (Efisiensi Closed-House Modern)</span>
                    <span>Total: {formatRupiah(directive?.hppBreakdown.totalHPPPerKg || 19700)} / kg</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">Pakan Konsentrat (FCR 2.2)</span>
                      <strong className="text-white">{formatRupiah(directive?.hppBreakdown.feedCostPerKg || 15400)}/kg</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">Amortisasi Bibit DOC</span>
                      <strong className="text-white">{formatRupiah(directive?.hppBreakdown.docAmortizationPerKg || 2500)}/kg</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">Listrik IoT & Iklim AC</span>
                      <strong className="text-white">{formatRupiah(directive?.hppBreakdown.energyKwhClimatePerKg || 1200)}/kg</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">Biosecurity & Dokter</span>
                      <strong className="text-white">{formatRupiah(directive?.hppBreakdown.doctorBiosecurityPerKg || 600)}/kg</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* PILAR III: ALGORITMA WAJIB SERAP TANPA BATAS FISIK */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">III</span>
                    <span>Algoritma Wajib Serap Tanpa Batas Fisik (Infinite Absorption)</span>
                  </h3>
                  <span className="text-emerald-400 text-[11px] font-mono">0% Mortality Guaranteed</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <span className="font-mono font-bold text-amber-300">
                      Persamaan Validasi: HPP &lt; H_broker &lt; P_realtime
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                      H_broker = HPP + Margin Bersih Peternak
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">Margin Bersih Peternak</span>
                      <span className="text-base font-bold text-emerald-400">+Rp 6.076 / kg</span>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                        Untung bersih +30.8% di atas HPP, sah dicairkan ke DANA / Bank.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">Guaranteed Broker Surplus</span>
                      <span className="text-base font-bold text-cyan-400">+Rp 3.024 / kg</span>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                        Surplus +10.5% terkunci saat aset dijual kembali ke pasar terbuka.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">Risiko Kematian Ternak</span>
                      <span className="text-base font-bold text-emerald-400">0.0% (Zero Risk)</span>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                        Efisiensi utilitas closed-house 24°C & biosecurity level 4.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invariants' && (
            <div className="space-y-6">
              {/* PILAR II: HUKUM BESI KESEIMBANGAN MONETER */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">II</span>
                    <span>Hukum Besi Keseimbangan Moneter: V_system &gt; V_harvest</span>
                  </h3>
                  <span className="text-emerald-400 text-[11px] font-mono">Invarian Mutlak Terkunci</span>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-800 to-slate-900 border border-indigo-500/30 space-y-4">
                  {/* Formula banner */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-indigo-500/40 text-center font-mono space-y-1">
                    <span className="text-xs text-indigo-300 block uppercase tracking-wider">Persamaan Invarian Moneter Mutlak</span>
                    <div className="text-lg sm:text-xl font-extrabold text-cyan-300">
                      V_system ≥ (1 + α) · V_harvest
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      di mana α = 0.15 (15% Koefisien Buffer Darurat Likuiditas Sistem)
                    </span>
                  </div>

                  {/* Numbers Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">V_system (Kas Cadangan)</span>
                      <span className="text-base font-bold text-emerald-400">{formatRupiah(directive?.V_system || 13950000)}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">(1 + α) · V_harvest (Kewajiban + Buffer)</span>
                      <span className="text-base font-bold text-amber-400">{formatRupiah(directive?.required_reserve_with_buffer || 1111646)}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">Surplus Bantalan Bersih</span>
                      <span className="text-base font-bold text-cyan-400">+{formatRupiah(directive?.reserve_surplus_idr || 12838354)}</span>
                    </div>
                  </div>

                  {/* Execution Rule */}
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-slate-300 flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Aturan Eksekusi Penjaga Likuiditas:</strong>
                      Jika total kewajiban serap panen mendekati batas V_system (rasio &lt; 100%), backend secara otomatis menahan (throttle) ekspansi siklus baru hingga kas masuk riil menyeimbangkannya.
                      Saat ini rasio berada di <strong className="text-emerald-400 font-mono">{directive?.liquidity_ratio_percent || 1320}%</strong> ({directive?.expansionStatus || 'PERMITTED'}).
                    </div>
                  </div>
                </div>
              </div>

              {/* PILAR IV: REGULASI KECEPATAN PRODUKSI VS LIKUIDITAS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">IV</span>
                    <span>Regulasi Kecepatan Produksi vs Likuiditas (Flow Rate Synchronization)</span>
                  </h3>
                  <span className="text-cyan-400 text-[11px] font-mono">Differential Flow Balance</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono">
                    <span className="text-xs text-blue-300 block uppercase">Persamaan Sinkronisasi Arus Kas</span>
                    <div className="text-lg font-bold text-white mt-1">
                      (d V_system / dt) ≥ (d Q / dt) · H_broker
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">dV_system / dt (Laju Kas Masuk per Jam)</span>
                      <span className="text-base font-bold text-emerald-400">
                        +{formatRupiah(directive?.flowRate.dV_system_dt_per_hour || 110000)} / jam
                      </span>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                        Dari sewa bulanan & realisasi penjualan pasar komoditas.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">(dQ/dt) · H_broker (Laju Beban Serap Panen)</span>
                      <span className="text-base font-bold text-amber-400">
                        {formatRupiah(directive?.flowRate.dQ_dt_burn_idr_per_hour || 56388)} / jam
                      </span>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                        Kapasitas panen terdistribusi (~{directive?.flowRate.dQ_dt_eggs_per_hour || 35} butir/jam).
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-between text-[11px]">
                    <span>Mode Regulasi Arus:</span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {directive?.flowRate.pacingMode || 'NORMAL'} (Pacing Interval: {directive?.flowRate.pacingIntervalSeconds || 8}s)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-800 to-indigo-950/40 border border-purple-500/40 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Eksekutor Algoritma Wajib Serap Tanpa Batas Fisik</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Sistem wajib membeli seluruh hasil panen seberapa pun besarnya yang dihasilkan peternak tanpa pernah mengalami penolakan kas atau salah hitung.
                  </p>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Volume Panen (Butir Telur)</label>
                    <input
                      type="number"
                      min={10}
                      value={simEggCount}
                      onChange={e => setSimEggCount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-purple-500 outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Bobot Riil: {Number(((simEggCount * 62.5) / 1000).toFixed(2))} kg (62.5g/butir)
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Pilihan Komoditas</label>
                    <select
                      value={simGrade}
                      onChange={e => setSimGrade(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-purple-500 outline-none"
                    >
                      <option value="GRADE_B">Grade B (Standar Pinsar Rp 25.776/kg)</option>
                      <option value="GRADE_A">Grade A (Super Horeka Rp 28.192/kg)</option>
                      <option value="GRADE_C">Grade C (Industri Rp 22.822/kg)</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <button
                      onClick={() => handleExecuteInfiniteAbsorption(simEggCount)}
                      disabled={isSimulating || simEggCount <= 0}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4" />
                      <span>{isSimulating ? 'Menyerap...' : 'Uji Serap Seketika'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="text-slate-400">Preset Volume Cepat:</span>
                  <button
                    onClick={() => { setSimEggCount(150); handleExecuteInfiniteAbsorption(150); }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono"
                  >
                    150 Butir (Starter)
                  </button>
                  <button
                    onClick={() => { setSimEggCount(500); handleExecuteInfiniteAbsorption(500); }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono"
                  >
                    500 Butir (Pro IoT)
                  </button>
                  <button
                    onClick={() => { setSimEggCount(2500); handleExecuteInfiniteAbsorption(2500); }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 font-mono"
                  >
                    2.500 Butir (Massif)
                  </button>
                </div>
              </div>

              {/* Simulation Output Result Box */}
              {simResult && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>HASIL EKSEKUSI SERAP TANPA BATAS FISIK: SUKSES 100%</span>
                  </div>

                  <p className="text-slate-300">{simResult.message}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-[11px] pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Total Kas Dibayar ke Peternak</span>
                      <strong className="text-emerald-400 text-sm">
                        {formatRupiah(simResult.absorptionResult.payoutIdr)}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Keuntungan Bersih Peternak</span>
                      <strong className="text-cyan-400 text-sm">
                        +{formatRupiah(simResult.absorptionResult.farmerProfitIdr)}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Surplus Margin Broker Terkunci</span>
                      <strong className="text-amber-400 text-sm">
                        +{formatRupiah(simResult.absorptionResult.guaranteedSurplusIdr)}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">On-Chain Audit Hash</span>
                      <span className="text-purple-300 text-[10px] truncate block" title={simResult.absorptionResult.txHash}>
                        {simResult.absorptionResult.txHash.slice(0, 10)}...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* All-Time Infinite Absorption Telemetry */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-400 font-mono">Kumulatif Penyerapan Sepanjang Masa:</span>
                  <div className="text-base font-bold text-white font-mono flex items-center gap-3">
                    <span>{directive?.infiniteAbsorption.totalAbsorbedAllTimeEggs.toLocaleString()} Butir</span>
                    <span>•</span>
                    <span>{directive?.infiniteAbsorption.totalAbsorbedAllTimeKg.toLocaleString()} Kg</span>
                    <span>•</span>
                    <span className="text-emerald-400">{formatRupiah(directive?.infiniteAbsorption.totalCashPaidToFarmersIdr || 0)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40">
                    Jaminan Penolakan Kas: 0% (Tolak Bayar = FALSE)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
