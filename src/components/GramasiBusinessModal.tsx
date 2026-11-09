import React, { useState } from 'react';
import { X, Scale, TrendingUp, ShieldCheck, CheckCircle2, ArrowRight, DollarSign, HelpCircle, Layers, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { EggGrade } from '../types/farm';
import {
  EGG_GRADE_SPECS,
  calculateEggGramasi,
  calculateSpentHensGramasi,
  COMMERCIAL_LAYER_STRAINS,
  calculateAntiBankruptcyEconomics,
  WIN_WIN_BUSINESS_EXPLANATION,
  OFFICIAL_PRODUCTIVE_CYCLE_SPEC,
  calculateFullCycleProduction,
  AFKIR_GRAMASI_CONFIG,
  DATABASE_UTILITY_LENGKAP_HULU,
  hitungHppHuluTotal,
  PERPETUAL_FOUNTAIN_PACKAGES,
  EGG_BROKER_PRICE_CONFIG,
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
  const [simHenCount, setSimHenCount] = useState<number>(spentHensCount || 100);
  const [selectedStrainKey, setSelectedStrainKey] = useState<string>('hyline-brown');
  const [simFlockSize, setSimFlockSize] = useState<number>(500);
  const [cycleFlockSize, setCycleFlockSize] = useState<number>(100);
  const [afkirPricingMode, setAfkirPricingMode] = useState<'PER_EKOR' | 'PER_KG'>('PER_EKOR');
  const [customAfkirPricePerBird, setCustomAfkirPricePerBird] = useState<number>(40000);
  const [customAfkirWeightPerBird, setCustomAfkirWeightPerBird] = useState<number>(2.50);
  const [selectedFountainPackageKey, setSelectedFountainPackageKey] = useState<string>('pkg-starter-100');
  const [activeTab, setActiveTab] = useState<'AIR_MANCUR_ABADI' | 'STRAINS_ECONOMICS' | 'COOP_CONSTRUCTION_BENCHMARK' | 'EGGS_SCALE' | 'AFKIR_LIVEWEIGHT' | 'WIN_WIN_LOGIC'>('AIR_MANCUR_ABADI');

  if (!isOpen) return null;

  const eggCalc = calculateEggGramasi(simEggCount, selectedGrade);
  const afkirCalc = calculateSpentHensGramasi(simHenCount, afkirPricingMode, customAfkirPricePerBird, customAfkirWeightPerBird);
  const hppHuluCalc = hitungHppHuluTotal(DATABASE_UTILITY_LENGKAP_HULU);
  const activeFountainPkg = PERPETUAL_FOUNTAIN_PACKAGES[selectedFountainPackageKey] || PERPETUAL_FOUNTAIN_PACKAGES['pkg-starter-100'];
  const cycleCalc = calculateFullCycleProduction(cycleFlockSize);
  const solvencyCalc = calculateAntiBankruptcyEconomics(selectedStrainKey, simFlockSize);

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
            { id: 'AIR_MANCUR_ABADI', label: '1. Ekosistem Air Mancur Abadi (HPP Hulu & Margin)', icon: Sparkles },
            { id: 'STRAINS_ECONOMICS', label: '2. 5 Strain Pullet & Anti-Bangkrut', icon: Layers },
            { id: 'COOP_CONSTRUCTION_BENCHMARK', label: '3. Acuan Konstruksi & Sewa Utility Kandang', icon: DollarSign },
            { id: 'EGGS_SCALE', label: '4. Timbangan Gramasi Telur (Broker Rp 21k-22k)', icon: Scale },
            { id: 'AFKIR_LIVEWEIGHT', label: '5. Siklus 1 Thn & Pembelian Afkir Broker', icon: TrendingUp },
            { id: 'WIN_WIN_LOGIC', label: '6. Transparansi Margin Win-Win', icon: ShieldCheck },
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
          {/* ===================== TAB 1: EKOSISTEM AIR MANCUR ABADI (HPP HULU & MARGIN OWNER-MITRA) ===================== */}
          {activeTab === 'AIR_MANCUR_ABADI' && (
            <div className="space-y-5">
              {/* Grand Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border border-amber-500/40 text-amber-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-amber-300 text-sm flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Filosofi Ekosistem &quot;Air Mancur Abadi&quot;: Matematika Bisnis Nyata Tanpa Risiko Bangkrut
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
                    Perpetual Profit Flow
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sistem diprogram berputar seperti <strong>air mancur abadi</strong> yang bertumpu pada acuan harga kehidupan nyata.
                  <br />• <strong>Owner / Sistem</strong> adalah penjual semua utility (bibit pullet 18 minggu, 5 fase pakan, 3 suplemen vitamin, infrastruktur listrik & air), pemilik lahan kandang yang disewakan, penyedia jasa pembersihan kandang kosong pasca-afkir, broker pembeli akhir telur & karkas afkir, serta penerima fee administrasi fasilitas auto-compounding. Semua transaksi dari hulu hingga hilir memiliki margin keuntungan nyata bagi owner.
                  <br />• <strong>Mitra (Pengguna)</strong> adalah operator sistem produksi otomatis yang masuk dengan uang nyata membeli paket, menerima produksi telur harian (31.025 butir / 1.939 kg per 100 ekor) dan uang afkir di ujung siklus, dengan <strong>keuntungan sepadan, realistis (~45% - 50% ROI), dan terlindungi</strong>.
                </p>
              </div>

              {/* Selector 3 Paket Kemitraan */}
              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2 text-[11px]">
                  Pilih Simulasi Paket Kemitraan Resmi (Siap Order):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(PERPETUAL_FOUNTAIN_PACKAGES).map(([key, pkg]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedFountainPackageKey(key);
                        sounds.playClick();
                      }}
                      className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        selectedFountainPackageKey === key
                          ? 'bg-amber-500/15 border-amber-500 text-white ring-2 ring-amber-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-white">{pkg.packageName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            ROI {pkg.farmerRoiPercent}%
                          </span>
                        </div>
                        <div className="text-lg font-black font-mono text-amber-300 mt-1">
                          {formatRupiah(pkg.entryCostIdr)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          Populasi: {pkg.flockSize} Ekor Pullet • Sewa: {formatRupiah(pkg.monthlyCoopRentIdr)}/bln
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] flex justify-between font-mono">
                        <span className="text-slate-400">Net Profit Mitra:</span>
                        <span className="text-emerald-400 font-bold">{formatRupiah(pkg.netFarmerProfitIdr)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Komparasi Hasil Finansial Paket Terpilih */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sisi Mitra */}
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Arus Kas & Keuntungan Mitra ({activeFountainPkg.flockSize} Ekor)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      Operator Terlindungi
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Modal Masuk Paket Awal:</span>
                      <span className="text-white font-mono font-bold">{formatRupiah(activeFountainPkg.entryCostIdr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Panen Telur 1 Thn ({activeFountainPkg.annualEggOutputKg.toLocaleString()} Kg @ Rp 21.500):</span>
                      <span className="text-amber-300 font-mono font-bold">{formatRupiah(activeFountainPkg.annualEggRevenueBrokerIdr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Penjualan Ayam Afkir ke Broker:</span>
                      <span className="text-teal-300 font-mono font-bold">{formatRupiah(activeFountainPkg.terminalAfkirRevenueIdr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Pendapatan Bruto:</span>
                      <span className="text-white font-mono font-bold">{formatRupiah(activeFountainPkg.totalGrossFarmerRevenueIdr)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Beban Pakan & Sewa Berjalan (Revolving):</span>
                      <span className="font-mono text-rose-300">-{formatRupiah(activeFountainPkg.annualFeedAndOperationalCostIdr)}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex justify-between items-center text-sm">
                      <span className="font-bold text-emerald-300">Laba Bersih Mitra (Net):</span>
                      <span className="font-black font-mono text-emerald-400 text-base">
                        +{formatRupiah(activeFountainPkg.netFarmerProfitIdr)} ({activeFountainPkg.farmerRoiPercent}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sisi Owner */}
                <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-indigo-400" />
                      8 Sumber Keuntungan Kas Owner (&quot;Air Mancur Abadi&quot;)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                      Kas Surplus Total
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span>1. Margin Bibit Pullet Hulu:</span>
                      <span className="text-emerald-400">+{formatRupiah(activeFountainPkg.ownerAnnualRevenueStreams.pulletSaleMarginIdr)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>2. Margin Grosir Suplai 5 Fase Pakan:</span>
                      <span className="text-emerald-400">+{formatRupiah(activeFountainPkg.ownerAnnualRevenueStreams.feedPhasesMarginIdr)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>3. Margin Vitamin & Suplemen:</span>
                      <span className="text-emerald-400">+{formatRupiah(activeFountainPkg.ownerAnnualRevenueStreams.vitaminMarginIdr)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>4. Sewa Utility Kandang & Lahan (12 Bln):</span>
                      <span className="text-emerald-400">+{formatRupiah(activeFountainPkg.ownerAnnualRevenueStreams.coopRentAnnualIdr)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>5. Jasa Cuci Kandang Kosong Pasca-Afkir:</span>
                      <span className="text-emerald-400">+{formatRupiah(activeFountainPkg.ownerAnnualRevenueStreams.cleaningPostAfkirServiceIdr)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>6. Margin Broker Telur (Ritel Rp 27.5k vs Beli Rp 21.5k):</span>
                      <span className="text-cyan-400 font-bold">+{formatRupiah(activeFountainPkg.ownerAnnualRevenueStreams.eggBrokerTradingMarginIdr)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>7. Margin Broker Karkas Afkir:</span>
                      <span className="text-emerald-400">+{formatRupiah(activeFountainPkg.ownerAnnualRevenueStreams.afkirBrokerTradingMarginIdr)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>8. Fee Administrasi Auto-Compounding (3.5%):</span>
                      <span className="text-purple-400 font-bold">+{formatRupiah(activeFountainPkg.ownerAnnualRevenueStreams.autoCompoundingFeeIdr)}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex justify-between items-center text-xs mt-2">
                      <span className="font-bold text-indigo-300">Total Surplus Kas Owner:</span>
                      <span className="font-black font-mono text-cyan-300 text-sm">
                        +{formatRupiah(activeFountainPkg.ownerAnnualRevenueStreams.totalOwnerNetProfitIdr)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TABEL DATA UTILITY HULU STANDAR INDUSTRI PRESISI */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    Database Utilitas Lengkap Hulu (Standar Industri Presisi 100 Ekor / 12 Bulan)
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    SOP Tertutup Tanpa Merek Komersial
                  </span>
                </div>

                {/* 1. Pullet Awal */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white text-xs">1. {DATABASE_UTILITY_LENGKAP_HULU.pulletAwal.item}</div>
                    <div className="text-[11px] text-slate-400">100 Ekor Pullet Umur 18 Minggu Siap Produksi</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-300 font-mono text-sm">{formatRupiah(DATABASE_UTILITY_LENGKAP_HULU.pulletAwal.subtotal)}</div>
                    <div className="text-[10px] text-slate-400">@{formatRupiah(DATABASE_UTILITY_LENGKAP_HULU.pulletAwal.hargaSatuan)} / ekor</div>
                  </div>
                </div>

                {/* 2. 5 Fase Pakan Berurutan */}
                <div>
                  <div className="text-slate-300 font-bold mb-2 flex items-center justify-between text-[11px]">
                    <span>2. 5 Fase Pakan Standar Berurutan (Total 45 Kg/Ekor = 4.500 Kg):</span>
                    <span className="text-amber-300 font-mono font-bold">
                      Subtotal: {formatRupiah(DATABASE_UTILITY_LENGKAP_HULU.pakanFaseBerurutan.reduce((a, b) => a + b.subtotal, 0))}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                          <th className="p-2">Fase</th>
                          <th className="p-2">Nama Fase & Spesifikasi</th>
                          <th className="p-2 text-right">Konsumsi/Ekor</th>
                          <th className="p-2 text-right">Harga/Kg</th>
                          <th className="p-2 text-right">Subtotal (100 Ekor)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {DATABASE_UTILITY_LENGKAP_HULU.pakanFaseBerurutan.map((fase) => (
                          <tr key={fase.faseId} className="hover:bg-slate-900/50">
                            <td className="p-2 text-slate-300 font-bold">Fase {fase.faseId}</td>
                            <td className="p-2 font-sans">
                              <span className="font-semibold text-white">{fase.namaFase}</span>
                              <span className="block text-[10px] text-slate-400">{fase.spesifikasi}</span>
                            </td>
                            <td className="p-2 text-right text-slate-300">{fase.konsumsiKgPerEkor} kg</td>
                            <td className="p-2 text-right text-slate-300">{formatRupiah(fase.hargaPerKg)}</td>
                            <td className="p-2 text-right font-bold text-amber-300">{formatRupiah(fase.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Vitamin & Kesehatan */}
                <div>
                  <div className="text-slate-300 font-bold mb-2 flex items-center justify-between text-[11px]">
                    <span>3. Standar Vitamin & Suplemen Kesehatan:</span>
                    <span className="text-emerald-300 font-mono font-bold">
                      Subtotal: {formatRupiah(DATABASE_UTILITY_LENGKAP_HULU.vitaminDanKesehatan.reduce((a, b) => a + b.subtotal, 0))}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {DATABASE_UTILITY_LENGKAP_HULU.vitaminDanKesehatan.map((vit, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                        <div className="font-bold text-white text-[11px]">{vit.item}</div>
                        <div className="text-[10px] text-slate-400">{vit.fungsi}</div>
                        <div className="pt-1 border-t border-slate-800 flex justify-between font-mono text-[10px]">
                          <span className="text-slate-400">
                            {vit.kebutuhanKg ? `${vit.kebutuhanKg} Kg` : `${vit.kebutuhanSatuan} Unit`}
                          </span>
                          <span className="text-emerald-400 font-bold">{formatRupiah(vit.subtotal)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Jasa Perawatan Kandang Kosong & Listrik/Air */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-white text-xs">
                        4. {DATABASE_UTILITY_LENGKAP_HULU.jasaPerawatanKandangKosong.item}
                      </div>
                      <span className="font-mono font-bold text-amber-300">
                        {formatRupiah(DATABASE_UTILITY_LENGKAP_HULU.jasaPerawatanKandangKosong.subtotal)}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {DATABASE_UTILITY_LENGKAP_HULU.jasaPerawatanKandangKosong.rincian}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-white text-xs">
                        5. Infrastruktur Listrik & Air Bersih
                      </div>
                      <span className="font-mono font-bold text-amber-300">
                        {formatRupiah(DATABASE_UTILITY_LENGKAP_HULU.infrastrukturPendukung.listrikDanAir)}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Alokasi daya genset stabilizer, penerangan timer 16 jam, sirkulasi exhaust fan, dan pasokan air artesis higienis selama 12 bulan penuh.
                    </p>
                  </div>
                </div>

                {/* Total HPP Hulu Sempurna */}
                <div className="p-3.5 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 rounded-xl border border-amber-500/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Total HPP Hulu Sempurna per Paket (100 Ekor / 12 Bulan):</div>
                    <div className="text-[10px] text-slate-400 font-mono">Bibit Pullet + 5 Fase Pakan + 3 Vitamin + Jasa Cuci Kandang + Listrik/Air</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black font-mono text-amber-300">{formatRupiah(hppHuluCalc.totalHpp)}</span>
                  </div>
                </div>

                {/* Acuan Harga Telur Broker */}
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-amber-400" />
                    Acuan Resmi Harga Telur Peternak ke Broker:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Acuan Awal Penarikan:</span>
                      <strong className="text-white text-sm">{formatRupiah(EGG_BROKER_PRICE_CONFIG.initialWithdrawalPriceKg)} / Kg</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Kisaran Beli Broker:</span>
                      <strong className="text-emerald-400 text-sm">{formatRupiah(EGG_BROKER_PRICE_CONFIG.minBrokerBuyPriceKg)} – {formatRupiah(EGG_BROKER_PRICE_CONFIG.maxBrokerBuyPriceKg)} / Kg</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Jual Broker ke Ritel Modern:</span>
                      <strong className="text-cyan-300 text-sm">{formatRupiah(EGG_BROKER_PRICE_CONFIG.retailModernMarketPriceKg)} / Kg</strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Spread Owner: +{formatRupiah(EGG_BROKER_PRICE_CONFIG.ownerOfftakerSpreadAvgKg)}/Kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: 5 STRAIN PULLET & ANTI-BANGKRUT ===================== */}
          {activeTab === 'STRAINS_ECONOMICS' && (
            <div className="space-y-4">
              {/* Header Box */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/30 text-emerald-200 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Formula Matematika Bisnis Teruji: Solvabilitas & Jaminan Anti-Kebangkrutan
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Semua transaksi keuangan di platform menggunakan model perunggasan industri komersial standar Pinsar & Bapanas RI. 
                  Arus kas likuidasi hasil panen telur dan residual karkas afkir selalu lebih besar dari biaya modal bibit dan pakan, 
                  menjamin <strong>Rasio Solvabilitas &gt; 1.30x (100% Bebas Risiko Defisit)</strong>.
                </p>
              </div>

              {/* 5 Strain Selection Grid */}
              <div>
                <label className="block text-slate-400 font-semibold uppercase tracking-wider mb-2 text-[11px]">
                  Pilih Strain Komersial Utama (Patokan Pasar Petelur Indonesia):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {Object.entries(COMMERCIAL_LAYER_STRAINS).map(([key, strain]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedStrainKey(key);
                        sounds.playClick();
                      }}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        selectedStrainKey === key
                          ? 'bg-amber-500/15 border-amber-500 text-white ring-2 ring-amber-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-white">{strain.name}</div>
                        <div className="text-[10px] text-amber-300 font-mono font-semibold mt-0.5">
                          {formatRupiah(strain.officialPriceIdr)}
                        </div>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-2 pt-1.5 border-t border-slate-800/80 font-mono">
                        {strain.marketPriceRangeIdr}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Strain Detail Card */}
              {solvencyCalc && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {solvencyCalc.strain.name}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          {solvencyCalc.strain.marketPriceRangeIdr}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {solvencyCalc.strain.highlightTrait}
                      </p>
                    </div>

                    {/* Scale Size Selector */}
                    <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                      {[150, 500, 1500].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setSimFlockSize(size);
                            sounds.playClick();
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition ${
                            simFlockSize === size
                              ? 'bg-amber-500 text-slate-950'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {size} Ekor
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Anti-Bankruptcy Mathematical Proof Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                    {/* Column 1: Modal & Biaya (Input) */}
                    <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        1. Total Biaya Modal (Input)
                      </div>
                      <div className="text-lg font-bold text-rose-400">
                        {formatRupiah(solvencyCalc.totalPulletCost + solvencyCalc.totalFeedCost)}
                      </div>
                      <div className="text-[10px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                        <div className="flex justify-between">
                          <span>• Modal Bibit ({simFlockSize} Ekor):</span>
                          <span className="text-white font-semibold">{formatRupiah(solvencyCalc.totalPulletCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Pakan ({formatNumber(solvencyCalc.totalFeedKgConsumed)} Kg @ Rp 7k):</span>
                          <span className="text-white font-semibold">{formatRupiah(solvencyCalc.totalFeedCost)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Total Arus Kas Masuk (Output) */}
                    <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        2. Total Kas Masuk Panen (Output)
                      </div>
                      <div className="text-lg font-bold text-emerald-400">
                        {formatRupiah(solvencyCalc.totalEggRevenueWholesale + solvencyCalc.afkirTerminalPayout)}
                      </div>
                      <div className="text-[10px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                        <div className="flex justify-between">
                          <span>• Panen Telur ({formatNumber(solvencyCalc.totalEggWeightKg)} Kg):</span>
                          <span className="text-emerald-300 font-semibold">{formatRupiah(solvencyCalc.totalEggRevenueWholesale)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Jual Afkir Gramasi:</span>
                          <span className="text-cyan-300 font-semibold">{formatRupiah(solvencyCalc.afkirTerminalPayout)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Solvency Ratio & Net Profit */}
                    <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/40 space-y-2">
                      <div className="text-[10px] uppercase font-bold text-emerald-400">
                        3. Rasio Solvabilitas & Net Profit
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-emerald-300">
                          {solvencyCalc.solvencyRatio}x
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold">
                          SURPLUS AMAN
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-300 space-y-1 pt-1 border-t border-emerald-500/30">
                        <div className="flex justify-between text-emerald-200 font-bold">
                          <span>• Net Profit Peternak:</span>
                          <span>{formatRupiah(solvencyCalc.netFarmerProfitTotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>• Rata-Rata Bulanan:</span>
                          <span className="text-white font-semibold">~{formatRupiah(solvencyCalc.monthlyFarmerNetProfit)}/bln</span>
                        </div>
                        <div className="flex justify-between text-amber-300">
                          <span>• Surplus Kas Owner:</span>
                          <span className="font-semibold">+{formatRupiah(solvencyCalc.ownerTotalClearanceRevenue)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Math Anti-Bankruptcy Guarantee Callout */}
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 text-base">🛡️</span>
                      <span className="text-slate-300">
                        <strong>Jaminan Matematika:</strong> Total Arus Kas Masuk ({formatRupiah(solvencyCalc.totalEggRevenueWholesale + solvencyCalc.afkirTerminalPayout)}) melebihi beban input ({formatRupiah(solvencyCalc.totalPulletCost + solvencyCalc.totalFeedCost)}) dengan rasio solvabilitas <strong>{solvencyCalc.solvencyRatio}x</strong>. Baik peternak maupun treasury platform dipastikan selalu surplus dan kebal terhadap kebangrutan.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 2: ACUAN KONSTRUKSI & SEWA UTILITY KANDANG ===================== */}
          {activeTab === 'COOP_CONSTRUCTION_BENCHMARK' && (
            <div className="space-y-4">
              {/* Header Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border border-cyan-500/30 text-cyan-200 space-y-1">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  Acuan Resmi Harga Konstruksi Kandang vs Utility Sewa Bulanan
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Patokan harga konstruksi fisik kandang riil di Indonesia sesuai kapasitas populasinya. 
                  Model utility sewa bulanan mengeliminasi 100% beban belanja modal awal (Capex) yang berat bagi peternak, 
                  sehingga modal kerja dapat difokuskan pada bibit pullet berkualitas dan pakan konsentrat berprotein tinggi.
                </p>
              </div>

              {/* 4 Official Scales Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Skala Kecil (50 Ekor) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">1. Skala Kecil</span>
                      <div className="text-[10px] text-cyan-400 font-mono">Kapasitas 50 Ekor</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                      Modular Mini
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-lg space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Harga Konstruksi Fisik:</span>
                      <strong className="text-amber-300 font-mono">Rp 1.500.000 – Rp 3.000.000</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Utility Sewa Bulanan:</span>
                      <strong className="text-emerald-400 font-mono">Rp 250.000 / bln</strong>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>Setara Biaya Harian:</span>
                      <span className="font-mono text-slate-300">~Rp 8.333 / hari</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 space-y-1 border-t border-slate-800/80 pt-2">
                    <div>• <strong>Teknologi:</strong> Exhaust Fan 16" & ram kawat kasa ganda</div>
                    <div>• <strong>Hasil Telur:</strong> ~44 butir / hari (~2.75 Kg @ Rp 27.000 = Rp 74.250/hari)</div>
                    <div className="text-emerald-400 font-semibold">• <strong>Est. Net Profit Peternak:</strong> ~Rp 600.000 – Rp 750.000 / bln</div>
                  </div>
                </div>

                {/* 2. Kapasitas Menengah (100 Ekor) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">2. Kapasitas Menengah</span>
                      <div className="text-[10px] text-cyan-400 font-mono">Kapasitas 100 Ekor</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                      Standar Pinsar
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-lg space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Harga Konstruksi Fisik:</span>
                      <strong className="text-amber-300 font-mono">Rp 3.500.000 – Rp 6.500.000</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Utility Sewa Bulanan:</span>
                      <strong className="text-emerald-400 font-mono">Rp 550.000 / bln</strong>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>Setara Biaya Harian:</span>
                      <span className="font-mono text-slate-300">~Rp 18.333 / hari</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 space-y-1 border-t border-slate-800/80 pt-2">
                    <div>• <strong>Teknologi:</strong> Semi-closed galvanis, dual blower 24", micro-mist</div>
                    <div>• <strong>Hasil Telur:</strong> ~88 butir / hari (~5.5 Kg @ Rp 27.000 = Rp 148.500/hari)</div>
                    <div className="text-emerald-400 font-semibold">• <strong>Est. Net Profit Peternak:</strong> ~Rp 1.250.000 – Rp 1.500.000 / bln</div>
                  </div>
                </div>

                {/* 3. Skala Komersial (500 Ekor) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 hover:border-slate-700 transition ring-1 ring-cyan-500/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">3. Skala Komersial</span>
                      <div className="text-[10px] text-cyan-400 font-mono">Kapasitas 500 Ekor</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Best ROI LoRaWAN
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-lg space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Harga Konstruksi Fisik:</span>
                      <strong className="text-amber-300 font-mono">Rp 15.000.000 – Rp 25.000.000</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Utility Sewa Bulanan:</span>
                      <strong className="text-emerald-400 font-mono">Rp 1.850.000 / bln</strong>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>Setara Biaya Harian:</span>
                      <span className="font-mono text-slate-300">~Rp 61.666 / hari</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 space-y-1 border-t border-slate-800/80 pt-2">
                    <div>• <strong>Teknologi:</strong> 3 Lantai Closed House, SHT31 LoRaWAN, Evaporative Pad</div>
                    <div>• <strong>Hasil Telur:</strong> ~440 butir / hari (~27.5 Kg = Rp 742.500/hari)</div>
                    <div className="text-emerald-400 font-semibold">• <strong>Est. Net Profit Peternak:</strong> ~Rp 4.500.000 – Rp 5.500.000 / bln</div>
                  </div>
                </div>

                {/* 4. Skala Industri (1.000 Ekor) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">4. Skala Industri</span>
                      <div className="text-[10px] text-cyan-400 font-mono">Kapasitas 1.000 Ekor</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                      Hyper-Scale Mega
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-lg space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Harga Konstruksi Fisik:</span>
                      <strong className="text-amber-300 font-mono">Rp 35.000.000 – Rp 55.000.000</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Utility Sewa Bulanan:</span>
                      <strong className="text-emerald-400 font-mono">Rp 3.500.000 / bln</strong>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>Setara Biaya Harian:</span>
                      <span className="font-mono text-slate-300">~Rp 116.666 / hari</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 space-y-1 border-t border-slate-800/80 pt-2">
                    <div>• <strong>Teknologi:</strong> Mega Closed House AI HVAC, solar microgrid, konveyor otomatis</div>
                    <div>• <strong>Hasil Telur:</strong> ~880 butir / hari (~55 Kg = Rp 1.485.000/hari)</div>
                    <div className="text-emerald-400 font-semibold">• <strong>Est. Net Profit Peternak:</strong> ~Rp 9.500.000 – Rp 12.000.000 / bln</div>
                  </div>
                </div>
              </div>

              {/* Economic Advantage Callout */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-2">
                <div className="text-slate-300 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Mengapa Utility Sewa Mencegah Kebangkrutan & Kegagalan Usaha?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400">
                  <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20">
                    <strong className="text-red-300 block mb-1">❌ Risiko Membangun Sendiri (Capex Murni):</strong>
                    Membangun kandang komersial (500-1000 ekor) menguras tabungan Rp 20M - Rp 50M di muka. Bila harga telur fluktuatif atau terjadi kendala manajemen, peternak terancam gagal bayar dan kehilangan aset.
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                    <strong className="text-emerald-300 block mb-1">✓ Keunggulan Sewa Utility Agro-Fi:</strong>
                    Biaya sewa utility hanya dibayarkan secara berkala dari hasil panen berjalan. Rasio sewa bulanan terhadap nilai konstruksi (~8% - 11%) memberi ROI stabil ke Kas Owner, sekaligus membebaskan peternak dari utang modal awal.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: TIMBANGAN GRAMASI TELUR ===================== */}
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

          {/* ===================== TAB 4: SIKLUS PRODUKTIF 1 TAHUN & PEMBELIAN AFKIR BROKER ===================== */}
          {activeTab === 'AFKIR_LIVEWEIGHT' && (
            <div className="space-y-4">
              {/* Header Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/30 text-emerald-200 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Parameter Resmi Siklus Produktif (1 Tahun Penuh) & Likuidasi Akhir ke Broker
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Siklus pemeliharaan layer komersial berlangsung <strong>1 tahun (12 bulan penuh / 72–78 minggu usia ayam)</strong>.
                  Di ujung siklus, seluruh ayam dijual ke broker/pengepul sebagai ayam afkir dan <strong>kondisi kandang menjadi kosong total</strong> untuk pembersihan dan persiapan siklus baru.
                </p>
              </div>

              {/* 1. Card: Durasi Siklus & Akumulasi Telur per 100 Ekor */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Acuan Produksi Telur per 100 Ekor (Produktivitas 85% Hen-Day)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Standar 365 Hari Produktif (Usia 18 Minggu s/d 72-78 Minggu)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    Standar 100 Ekor = 31.025 Butir
                  </span>
                </div>

                {/* 3 Metric Pills per 100 Ekor */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tingkat Produktivitas:</span>
                    <div className="text-lg font-black text-amber-400">85.0%</div>
                    <span className="text-[10px] text-slate-400 block">Rata-rata 85 butir / hari / 100 ekor</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Butir Telur (1 Thn):</span>
                    <div className="text-lg font-black text-white">31.025 Butir</div>
                    <span className="text-[10px] text-emerald-400 block">365 hari × 85 butir/hari</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Akumulasi Berat:</span>
                    <div className="text-lg font-black text-emerald-300">~1.939 Kg</div>
                    <span className="text-[10px] text-cyan-400 block">Rata-rata ~62.5g / butir</span>
                  </div>
                </div>

                {/* Interactive Scalability Slider */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">
                      Simulasi Ukuran Populasi Kandang:
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">{cycleFlockSize} Ekor Ayam</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={1000}
                    step={50}
                    value={cycleFlockSize}
                    onChange={(e) => setCycleFlockSize(parseInt(e.target.value) || 100)}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-slate-400">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-center">
                      <span className="block text-slate-500">Harian:</span>
                      <strong className="text-white text-xs">{cycleCalc.dailyEggs} Butir</strong> ({cycleCalc.dailyWeightKg} Kg)
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-center">
                      <span className="block text-slate-500">Total 1 Tahun:</span>
                      <strong className="text-white text-xs">{cycleCalc.totalEggs.toLocaleString()} Butir</strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-center">
                      <span className="block text-slate-500">Total Tonase Telur:</span>
                      <strong className="text-emerald-300 text-xs">{cycleCalc.totalWeightKg.toLocaleString()} Kg</strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-center">
                      <span className="block text-slate-500">Omzet Telur (@Rp26.5k):</span>
                      <strong className="text-amber-300 text-xs">{formatRupiah(cycleCalc.totalWeightKg * 26500)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Card: Harga Beli Ayam Afkir oleh Broker (Acuan Sistem / Broker) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      Harga Beli Ayam Afkir oleh Broker / Pengepul
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Acuan Resmi: Rp 35.000 – Rp 45.000 / Ekor ATAU Rp 15.000 / Kg Bobot Hidup
                    </span>
                  </div>

                  {/* Toggle Pricing Mode */}
                  <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setAfkirPricingMode('PER_EKOR');
                        sounds.playClick();
                      }}
                      className={`px-2.5 py-1 rounded-md font-bold transition ${
                        afkirPricingMode === 'PER_EKOR'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Per Ekor (Rp 35k - 45k)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAfkirPricingMode('PER_KG');
                        sounds.playClick();
                      }}
                      className={`px-2.5 py-1 rounded-md font-bold transition ${
                        afkirPricingMode === 'PER_KG'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Timbangan Kiloan (@ Rp 15.000/Kg)
                    </button>
                  </div>
                </div>

                {/* Interactive Controls based on Mode */}
                {afkirPricingMode === 'PER_EKOR' ? (
                  <div className="space-y-2 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold">
                        Acuan Harga Beli Broker per Ekor:
                      </span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">
                        {formatRupiah(customAfkirPricePerBird)} / ekor
                      </span>
                    </div>
                    <input
                      type="range"
                      min={35000}
                      max={45000}
                      step={1000}
                      value={customAfkirPricePerBird}
                      onChange={(e) => setCustomAfkirPricePerBird(parseInt(e.target.value) || 40000)}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>Batas Bawah: Rp 35.000</span>
                      <span className="text-emerald-400">Patokan Rata-Rata: Rp 40.000</span>
                      <span>Batas Atas: Rp 45.000</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold">
                        Timbangan Bobot Hidup Rata-Rata di Ujung Siklus:
                      </span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">
                        {customAfkirWeightPerBird.toFixed(2)} Kg / ekor (@ Rp 15.000/Kg)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2.0}
                      max={3.0}
                      step={0.05}
                      value={customAfkirWeightPerBird}
                      onChange={(e) => setCustomAfkirWeightPerBird(parseFloat(e.target.value) || 2.5)}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>2.00 Kg (Rp 30.000)</span>
                      <span className="text-emerald-400">2.50 Kg Standar (Rp 37.500)</span>
                      <span>3.00 Kg Super (Rp 45.000)</span>
                    </div>
                  </div>
                )}

                {/* Calculation Result for Full Flock Liquidation */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/40 space-y-3 font-mono">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/40 pb-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400">
                        Hasil Penjualan Seluruh Ayam ke Broker (Ujung Siklus):
                      </span>
                      <div className="text-xl font-black text-white mt-0.5">
                        {formatRupiah(
                          afkirPricingMode === 'PER_EKOR'
                            ? cycleFlockSize * customAfkirPricePerBird
                            : Math.round(cycleFlockSize * customAfkirWeightPerBird * 15000)
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Kondisi Kandang:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                        KOSONG TOTAL (ALL-OUT)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Populasi Dilikuidasi:</span>
                      <strong className="text-white">{cycleFlockSize} Ekor Layer Tua</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total Berat Karkas Hidup:</span>
                      <strong className="text-emerald-300">{(cycleFlockSize * customAfkirWeightPerBird).toFixed(1)} Kg</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Nilai Cair per Ekor:</span>
                      <strong className="text-amber-300">
                        {formatRupiah(
                          afkirPricingMode === 'PER_EKOR'
                            ? customAfkirPricePerBird
                            : Math.round(customAfkirWeightPerBird * 15000)
                        )} / ekor
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Terminal Event & All-Out Sanitation Callout */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] flex items-start gap-2.5 text-slate-300">
                  <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-white block">Protokol All-In All-Out (Kandang Kosong Total):</strong>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Sesuai pedoman manajemen ayam petelur modern, menjual seluruh populasi ke broker di akhir siklus 1 tahun 
                      memungkinkan kandang dikosongkan total untuk proses pencucian disinfektan, fumigasi, dan istirahat kandang (14 hari). 
                      Hal ini memutus siklus patogen virus/bakteri sebelum memasukkan batch pullet baru berumur 18 minggu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 5: TRANSPARANSI WIN-WIN ===================== */}
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
