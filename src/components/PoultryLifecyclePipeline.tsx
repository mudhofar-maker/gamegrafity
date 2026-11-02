import React from 'react';
import { BiologicalCycle, PoultryCohorts } from '../types/farm';
import { formatNumber, formatRupiah } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import {
  Egg,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  ShoppingBag,
  TrendingUp,
  Skull,
  HelpCircle,
} from 'lucide-react';

interface PoultryLifecyclePipelineProps {
  cycle: BiologicalCycle;
  onSalvageSickChicks: () => void;
  onSellSpentHens: () => void;
  onStartIncubationBatch: () => void;
  canIncubate: boolean;
}

export const PoultryLifecyclePipeline: React.FC<PoultryLifecyclePipelineProps> = ({
  cycle,
  onSalvageSickChicks,
  onSellSpentHens,
  onStartIncubationBatch,
  canIncubate,
}) => {
  const { cohorts } = cycle;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Siklus Biologis Nyata Peternakan (Lifecycle Pipeline)
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Real Poultry Cohorts
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pelacakan akurat umur ayam: kapan bertelur, fase non-produksi, inkubasi telur, afkir, hingga salvage krisis virus
          </p>
        </div>

        <div className="text-right text-xs font-mono text-slate-400">
          Total Populasi Terintegrasi:{' '}
          <strong className="text-white font-bold">{cycle.population} Ekor</strong>
        </div>
      </div>

      {/* 5-Stage Visual Timeline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {/* ================= STAGE 1: INKUBASI TELUR ================= */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between relative group hover:border-amber-500/40 transition">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold">
                TAHAP 1: TELUR
              </span>
              <Egg className="w-4 h-4 text-amber-400" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-white">Inkubasi Mesin Tetas</h4>
              <p className="text-[10px] text-slate-400">Hari ke-1 s/d 21 Menetas</p>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Di Inkubator:</span>
                <span className="text-amber-300 font-bold">{cohorts.incubatingEggs} Butir</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Embrio:</span>
                <span className="text-slate-200">
                  {cohorts.incubatingEggs > 0 ? `Hari ${cohorts.incubationProgressDays}/21` : 'Kosong'}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-amber-400/80 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Non-Produksi (21 Hari)</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80">
            {cohorts.incubatingEggs === 0 ? (
              <button
                type="button"
                onClick={onStartIncubationBatch}
                disabled={cycle.accumulatedEggs < 10 || cycle.incubatorUnits === 0}
                className="w-full py-1.5 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-[10px] transition disabled:opacity-40"
              >
                + Masukkan 20 Telur Tetas
              </button>
            ) : (
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-1.5 transition-all duration-500"
                  style={{ width: `${(cohorts.incubationProgressDays / 21) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ================= STAGE 2: ANAK AYAM DOC ================= */}
        <div
          className={`bg-slate-950/80 border rounded-xl p-3.5 flex flex-col justify-between relative group transition ${
            cohorts.sickChicksCount > 0
              ? 'border-red-500/80 ring-2 ring-red-500/30'
              : 'border-slate-800 hover:border-yellow-500/40'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  cohorts.sickChicksCount > 0
                    ? 'bg-red-500/25 text-red-300'
                    : 'bg-yellow-500/15 text-yellow-300'
                }`}
              >
                TAHAP 2: DOC
              </span>
              <span className="text-sm">🐣</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white">Anak Ayam Starter</h4>
              <p className="text-[10px] text-slate-400">Minggu 0 - 6 (Rentan Virus)</p>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Populasi DOC:</span>
                <span className="text-yellow-300 font-bold">{cohorts.chicksDocCount} Ekor</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gejala Sakit:</span>
                <span className={cohorts.sickChicksCount > 0 ? 'text-red-400 font-bold animate-pulse' : 'text-emerald-400'}>
                  {cohorts.sickChicksCount > 0 ? `${cohorts.sickChicksCount} Ekor (Kritis!)` : '0 Ekor'}
                </span>
              </div>
            </div>

            {cohorts.sickChicksCount > 0 ? (
              <div className="p-1.5 rounded bg-red-950/40 border border-red-900/60 text-[10px] text-red-300">
                ⚠️ Ditemukan gejala {cohorts.virusName}! Jual cepat ke junkfood sebelum mati!
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>Non-Produksi (Masa Brooding)</span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80">
            {cohorts.sickChicksCount > 0 && (
              <button
                type="button"
                id="btn-junkfood-salvage"
                onClick={() => {
                  sounds.playCash();
                  onSalvageSickChicks();
                }}
                className="w-full py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] tracking-tight shadow-md shadow-red-950/50 flex items-center justify-center gap-1 animate-pulse"
              >
                <span>🍔</span>
                <span>Jual ke Junkfood (+{formatRupiah(cohorts.sickChicksCount * 15000)})</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= STAGE 3: PULLET DARA ================= */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between relative group hover:border-blue-500/40 transition">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 font-bold">
                TAHAP 3: GROWER
              </span>
              <span className="text-sm">🐥</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white">Ayam Dara (Pullet)</h4>
              <p className="text-[10px] text-slate-400">Minggu 7 - 18 (Pembesaran)</p>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Populasi Dara:</span>
                <span className="text-blue-300 font-bold">{cohorts.growerPulletCount} Ekor</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Bertelur:</span>
                <span className="text-amber-400 font-medium">Non-Produksi</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 leading-tight">
              Organ reproduksi sedang matang. Menuju fase bertelur pertama (Point of Lay).
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Kebutuhan:</span>
            <span className="text-slate-200">Pakan Konsentrat</span>
          </div>
        </div>

        {/* ================= STAGE 4: LAYER PRODUKTIF (BERTELUR PUNCAK) ================= */}
        <div className="bg-slate-950/80 border border-emerald-500/40 rounded-xl p-3.5 flex flex-col justify-between relative group hover:border-emerald-500/70 transition shadow-lg shadow-emerald-950/20">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                TAHAP 4: LAYER
              </span>
              <span className="text-sm">🐔</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-emerald-300">Indukan Bertelur Puncak</h4>
              <p className="text-[10px] text-slate-400">Minggu 19 - 72 (Masa Emas)</p>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Layer Aktif:</span>
                <span className="text-emerald-400 font-bold">{cohorts.layerProductiveCount} Ekor</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Produksi Harian:</span>
                <span className="text-emerald-300 font-bold">~85-95% Lay Rate</span>
              </div>
            </div>

            <div className="text-[10px] text-emerald-400/90 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>Sumber Utama Akumulasi Telur</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Telur Siap Panen:</span>
            <span className="text-amber-300 font-bold">{cycle.accumulatedEggs} Butir</span>
          </div>
        </div>

        {/* ================= STAGE 5: AYAM AFKIR (TUA / NON-PRODUKSI) ================= */}
        <div
          className={`bg-slate-950/80 border rounded-xl p-3.5 flex flex-col justify-between relative group transition ${
            cohorts.spentHensAfkirCount > 0
              ? 'border-amber-500/80 bg-amber-950/20'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                TAHAP 5: AFKIR
              </span>
              <span className="text-sm">🍗</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white">Ayam Afkir Tua</h4>
              <p className="text-[10px] text-slate-400">Minggu 73+ (Non-Produksi)</p>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Jumlah Afkir:</span>
                <span className={cohorts.spentHensAfkirCount > 0 ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                  {cohorts.spentHensAfkirCount} Ekor
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Pakan:</span>
                <span className="text-red-400 text-[10px]">Boros Pakan (-Cost)</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 leading-tight">
              Produksi telur drop di bawah 30%. Harus segera dijual sebagai daging karkas untuk modal baru.
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80">
            {cohorts.spentHensAfkirCount > 0 ? (
              <button
                type="button"
                id="btn-sell-afkir"
                onClick={() => {
                  sounds.playCash();
                  onSellSpentHens();
                }}
                className="w-full py-1.5 px-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[10px] tracking-tight shadow-md flex items-center justify-center gap-1"
              >
                <span>🍗 Jual Karkas (+{formatRupiah(cohorts.spentHensAfkirCount * 38000)})</span>
              </button>
            ) : (
              <div className="text-[10px] font-mono text-slate-500 text-center">
                Belum ada ayam tua
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real Biological Cycle Explanatory Legend & Protocol Info */}
      <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
        <div className="flex items-start gap-2">
          <span className="text-amber-400 font-bold font-mono text-sm">💡</span>
          <div>
            <strong className="text-slate-200">Kapan Ayam Bertelur vs Non-Produksi?</strong>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Tahap 1 (Inkubasi 21 Hari), Tahap 2 (DOC 6 Minggu), dan Tahap 3 (Pullet 18 Minggu) adalah <strong>Non-Produksi</strong>. Ayam hanya bertelur aktif pada <strong>Tahap 4 (Minggu 19 - 72)</strong>. Pada Tahap 5 (Afkir), ayam berhenti bertelur dan wajib dijual ke pasar karkas.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-red-400 font-bold font-mono text-sm">🛡️</span>
          <div>
            <strong className="text-slate-200">Protokol Penyelamatan Virus (Junkfood Salvage):</strong>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Jika anak ayam terdeteksi gejala virus dan dibiarkan mati, peternak kehilangan 100% modal (rugi Rp 45.000/ekor). Dengan menjual cepat ke <strong>rantai pasok olahan junkfood</strong>, peternak memperoleh salvage value Rp 15.000/ekor sehingga kerugian tereliminasi secara realistis!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
