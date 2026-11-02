import React, { useState } from 'react';
import { X, Scale, TrendingUp, ShieldCheck, CheckCircle2, ArrowRight, DollarSign, HelpCircle, Layers, Sparkles } from 'lucide-react';
import { EggGrade } from '../types/farm';
import {
  EGG_GRADE_SPECS,
  calculateEggGramasi,
  calculateSpentHensGramasi,
  WIN_WIN_BUSINESS_EXPLANATION,
} from '../utils/gramasiEngine';
import { formatRupiah, formatNumber } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';

interface GramasiBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  accumulatedEggs: number;
  spentHensCount: number;
}

export const GramasiBusinessModal: React.FC<GramasiBusinessModalProps> = ({
  isOpen,
  onClose,
  accumulatedEggs,
  spentHensCount,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<EggGrade>('GRADE_B');
  const [simEggCount, setSimEggCount] = useState<number>(accumulatedEggs || 120);
  const [simHenCount, setSimHenCount] = useState<number>(spentHensCount || 10);
  const [activeTab, setActiveTab] = useState<'EGGS_SCALE' | 'AFKIR_LIVEWEIGHT' | 'WIN_WIN_LOGIC'>('EGGS_SCALE');

  if (!isOpen) return null;

  const eggCalc = calculateEggGramasi(simEggCount, selectedGrade);
  const afkirCalc = calculateSpentHensGramasi(simHenCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                Logika Bisnis & Timbangan Gramasi
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Win-Win Agro-Fi
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Beli bibit per ekor, jual telur & ayam afkir menggunakan gramasi timbangan kilogram netto
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 bg-slate-950/70 border-b border-slate-800 flex gap-2 overflow-x-auto">
          {[
            { id: 'EGGS_SCALE', label: '1. Timbangan Gramasi Telur (Kg)', icon: Scale },
            { id: 'AFKIR_LIVEWEIGHT', label: '2. Beli Per Ekor vs Jual Gramasi Afkir', icon: TrendingUp },
            { id: 'WIN_WIN_LOGIC', label: '3. Transparansi Margin Win-Win', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  sounds.playClick();
                }}
                className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* ===================== TAB 1: TIMBANGAN GRAMASI TELUR ===================== */}
          {activeTab === 'EGGS_SCALE' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Standar Industri Perunggasan Komersial: Penjualan Berbasis Gramasi (Kg)
                </div>
                <p className="text-[11px] text-amber-300/80 leading-relaxed">
                  Di peternakan nyata, broker/owner tidak membeli telur secara eceran per butir, melainkan
                  menggunakan <strong>timbangan gramasi kilogram (Kg)</strong>. Peternak yang merawat ayam dengan
                  nutrisi terbaik akan menghasilkan telur Grade A (berat &gt;63g) yang nilainya jauh lebih tinggi!
                </p>
              </div>

              {/* Interactive Simulation Controls */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider">
                      Jumlah Telur yang Ditimbang:
                    </span>
                    <span className="font-mono text-white font-bold">{simEggCount} Butir</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={1000}
                    step={10}
                    value={simEggCount}
                    onChange={(e) => setSimEggCount(parseInt(e.target.value) || 10)}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Grade Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Pilih Kualitas / Grading Gramasi Telur
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(Object.keys(EGG_GRADE_SPECS) as EggGrade[]).map((gradeKey) => {
                      const spec = EGG_GRADE_SPECS[gradeKey];
                      const isSelected = selectedGrade === gradeKey;
                      return (
                        <button
                          key={gradeKey}
                          type="button"
                          onClick={() => {
                            setSelectedGrade(gradeKey);
                            sounds.playClick();
                          }}
                          className={`p-3 rounded-xl border text-left transition ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-2 ring-amber-500/30'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-bold text-white text-xs">{spec.label}</div>
                          <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                            {formatRupiah(spec.pricePerKg)} / Kg
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                            {spec.sublabel}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Digital Scale Display Box */}
                <div className="bg-[#0b101b] rounded-xl border-2 border-amber-500/40 p-4 font-mono space-y-3">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <Scale className="w-4 h-4" /> TIMBANGAN DIGITAL PETERNIK (TARE NET WEIGHT)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      TERVERIFIKASI SISTEM
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Total Berat Netto:</div>
                      <div className="text-xl font-bold text-white mt-0.5">
                        {eggCalc.totalWeightKg.toFixed(2)}{' '}
                        <span className="text-xs text-amber-400 font-normal">Kg</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        ({formatNumber(eggCalc.totalWeightGrams)} gram)
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Harga Acuan Gramasi:</div>
                      <div className="text-xl font-bold text-amber-400 mt-0.5">
                        {formatRupiah(eggCalc.pricePerKg)}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">per kilogram</div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-emerald-500/40 bg-emerald-950/20">
                      <div className="text-[10px] text-emerald-400">Uang Diterima Peternak:</div>
                      <div className="text-xl font-bold text-emerald-300 mt-0.5">
                        {formatRupiah(eggCalc.farmerGrossRevenue)}
                      </div>
                      <div className="text-[10px] text-emerald-400/80 mt-0.5">
                        (~{formatRupiah(eggCalc.equivalentPricePerEgg)} / butir)
                      </div>
                    </div>
                  </div>

                  {/* Owner offtaker spread explanation */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Margin Agregasi Owner / Offtaker (Distribusi Supermarket):
                    </span>
                    <span className="text-amber-300 font-bold">
                      +{formatRupiah(eggCalc.ownerOfftakerMargin)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: BELI PER EKOR VS JUAL AFKIR GRAMASI ===================== */}
          {activeTab === 'AFKIR_LIVEWEIGHT' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Mengapa Beli Per Ekor & Jual Afkir Gramasi Sangat Menguntungkan?
                </div>
                <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                  Peternak membeli bibit ayam siap telur (*Pullet*) <strong>per ekor (Rp 45.000)</strong> saat bobotnya masih 1.2 Kg.
                  Setelah bertelur ratusan butir hingga masa pensiun/afkir, ayam memiliki bobot hidup rata-rata <strong>1.95 Kg</strong>.
                  Broker/Owner membeli kembali ayam afkir dengan sistem <strong>Gramasi Bobot Hidup (Rp 23.000 / Kg)</strong>.
                </p>
              </div>

              {/* Simulation for spent hens */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider">
                      Simulasi Jumlah Ayam Afkir Dijual:
                    </span>
                    <span className="font-mono text-white font-bold">{simHenCount} Ekor</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={simHenCount}
                    onChange={(e) => setSimHenCount(parseInt(e.target.value) || 1)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  {/* Input Side: Beli ke Owner */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-[11px] uppercase font-bold text-slate-400">
                      1. Modal Awal Input (Beli Bibit per Ekor)
                    </div>
                    <div className="text-base font-bold text-white">
                      {formatRupiah(simHenCount * 45000)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {simHenCount} ekor pullet @ Rp 45.000/ekor (bobot awal ~1.2 Kg)
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-amber-400">
                      Margin Pembibitan Owner: +{formatRupiah(simHenCount * 5000)}
                    </div>
                  </div>

                  {/* Output Side: Jual Gramasi ke Owner */}
                  <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/40 space-y-2">
                    <div className="text-[11px] uppercase font-bold text-emerald-400">
                      2. Pencairan Akhir Output (Jual Gramasi Bobot Hidup)
                    </div>
                    <div className="text-base font-bold text-emerald-300">
                      {formatRupiah(afkirCalc.farmerPayout)}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Total Berat Hidup: <strong>{afkirCalc.totalWeightKg.toFixed(1)} Kg</strong> (@ Rp 23.000/Kg)
                    </div>
                    <div className="pt-2 border-t border-emerald-900/50 text-[10px] text-emerald-300 font-bold">
                      Nilai Balik per Ekor: {formatRupiah(afkirCalc.payoutPerBird)} (Modal Bibit Balik 99.7%!)
                    </div>
                  </div>
                </div>

                {/* Big Key Insight Banner */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 text-lg">
                    🎯
                  </div>
                  <div>
                    <strong className="text-white text-xs">Kesimpulan Keuntungan Mutlak:</strong>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Karena modal bibit hampir 100% kembali saat ayam afkir ditimbang per Kg, maka <strong>seluruh telur yang dihasilkan selama 72 minggu (ratusan butir) adalah MURNI KEUNTUNGAN BERSIH</strong> bagi peternak!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: TRANSPARANSI WIN-WIN ===================== */}
          {activeTab === 'WIN_WIN_LOGIC' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WIN_WIN_BUSINESS_EXPLANATION.points.map((section, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border space-y-3 ${
                      idx === 0
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-amber-950/20 border-amber-500/40'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                        idx === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {section.actor}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{section.role}</h4>
                    </div>

                    <ul className="space-y-2">
                      {section.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 text-[11px] text-slate-300">
                          <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            idx === 0 ? 'text-emerald-400' : 'text-amber-400'
                          }`} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Economic Formula Equation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="text-slate-400 font-bold uppercase tracking-wider">
                  Rumus Matematika Profit Bersih Peternak (Net Farm Profit):
                </div>
                <div className="bg-slate-900 p-3 rounded-lg text-emerald-300 border border-slate-800 leading-relaxed">
                  <strong>Net Profit Peternak</strong> = [Σ (Gramasi Telur Kg × Harga Grade Acuan)] + [Gramasi Ayam Afkir Kg × Rp 23.000] - [Modal Bibit Pullet Awal] - [Total Biaya Pakan &amp; Utilitas Listrik] + [Salvage Anak Ayam Sakit]
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Standar Transaksi Agro-Fi Sovereign Mode</span>
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Tutup Kalkulator
          </button>
        </div>
      </div>
    </div>
  );
};
