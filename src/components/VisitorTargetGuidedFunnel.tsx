import React, { useState } from 'react';
import { UserCheck, ShieldCheck, ArrowRight, Zap, CheckCircle2, Sparkles, Cpu, ShoppingBag, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { InfrastructurePackage, ActiveCoopRental } from '../types/farm';
import { AuthUser } from './AuthModal';
import { INFRASTRUCTURE_PACKAGES } from '../data/metaverseCoopData';
import { formatRupiah } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';

interface VisitorTargetGuidedFunnelProps {
  authUser: AuthUser | null;
  onOpenSignUp: () => void;
  onOpenSignIn: () => void;
  onSelectPackage: (pkg: InfrastructurePackage) => void;
  onScrollToAutomation: () => void;
  activeRental: ActiveCoopRental | null;
}

export const VisitorTargetGuidedFunnel: React.FC<VisitorTargetGuidedFunnelProps> = ({
  authUser,
  onOpenSignUp,
  onOpenSignIn,
  onSelectPackage,
  onScrollToAutomation,
  activeRental,
}) => {
  const [activeTabPackageId, setActiveTabPackageId] = useState<string>(
    INFRASTRUCTURE_PACKAGES[2]?.id || 'pkg-pro-iot-tier1'
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const selectedPkg = INFRASTRUCTURE_PACKAGES.find((p) => p.id === activeTabPackageId) || INFRASTRUCTURE_PACKAGES[0];

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-4 sm:p-6 shadow-2xl shadow-emerald-950/30">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Panduan Cepat Pengunjung & Peternak Baru
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
              3 Langkah Mudah Menjadi Peternak Berdaulat
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Alur Pendaftaran & Aktivasi Otomatisasi Kandang
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Ikuti 3 titik target di bawah ini untuk memulai kemitraan dan menikmati bagi hasil harian otomatis.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setIsExpanded(!isExpanded);
          }}
          className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 text-emerald-400" />
              Sembunyikan Alur
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 text-emerald-400" />
              Buka 3 Titik Alur
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-5 space-y-6">
          {/* 3 Step Stepper Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ===================== TITIK 1: DAFTAR / SIGN UP ===================== */}
            <div className={`relative flex flex-col justify-between rounded-xl p-4 border transition-all ${
              authUser
                ? 'bg-slate-800/40 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                : 'bg-slate-800/80 border-cyan-500/60 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/30'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg font-black text-sm bg-cyan-500 text-slate-950 shadow">
                      1
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Titik Target 1
                    </span>
                  </div>
                  {authUser ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Terdaftar
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse">
                      Wajib Pertama
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-1">
                  Daftar Akun Peternak (Sign Up)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Pendaftaran akun cepat publik. Hubungkan akun Anda untuk verifikasi identitas mitra dan mencatat kepemilikan aset ayam.
                </p>

                {authUser ? (
                  <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-2.5 mb-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                      <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">Akun Aktif: {authUser.full_name || authUser.google_email || 'Peternak Berdaulat'}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 pl-6">
                      Sesi akun siap. Silakan lanjutkan ke Titik 2 memilih paket kandang.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 mb-3">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onOpenSignUp();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-950/50 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                    >
                      <UserCheck className="w-4 h-4" />
                      Daftar Akun Baru (Sign Up) &rarr;
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onOpenSignIn();
                      }}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 transition text-center"
                    >
                      Sudah punya akun? Masuk (Sign In)
                    </button>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-2 border-t border-slate-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Privasi aman &bull; Email terlindungi dari publik</span>
              </div>
            </div>

            {/* ===================== TITIK 2: PILIH PAKET 1/2/3/4 & BAYAR ===================== */}
            <div className="relative flex flex-col justify-between rounded-xl p-4 border bg-slate-800/80 border-emerald-500/60 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg font-black text-sm bg-emerald-500 text-slate-950 shadow">
                      2
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Titik Target 2
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                    DANA / BCA Instant
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">
                  Pilih Paket 1 / 2 / 3 / 4 & Bayar
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Pilih kapasitas ayam yang Anda inginkan (mulai 10 ekor hingga 1.000 ekor). Klik paket untuk langsung pembayaran via DANA atau Transfer BCA.
                </p>

                {/* Quick 4-Package Grid Selector */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {INFRASTRUCTURE_PACKAGES.map((pkg, idx) => {
                    const isSelected = pkg.id === activeTabPackageId;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => {
                          sounds.playClick();
                          setActiveTabPackageId(pkg.id);
                        }}
                        className={`text-left p-2 rounded-lg border transition ${
                          isSelected
                            ? 'bg-emerald-950/70 border-emerald-400 shadow-sm'
                            : 'bg-slate-900/70 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-white">
                            Paket {idx + 1}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {pkg.capacityBirds} Ekor
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-emerald-400 mt-1 truncate">
                          {formatRupiah(pkg.entryPackagePriceIdr || 0)}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Sewa: {formatRupiah(pkg.totalMonthlyRentIdr)}/bln
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Package Action Card */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-700/80 p-3 mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold truncate">
                      {selectedPkg.name}
                    </span>
                    {selectedPkg.recommended && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-500/40">
                        Rekomendasi
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mb-2.5">
                    Est. Hasil: <strong className="text-emerald-400 font-semibold">{selectedPkg.projectedNetProfitMonthly.displayRange}</strong>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playCash();
                      onSelectPackage(selectedPkg);
                    }}
                    className="w-full py-2 px-3 rounded-lg font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pilih Paket Ini & Bayar (DANA / BCA) &rarr;
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-2 border-t border-slate-700/60">
                <ShoppingBag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Otomatis redirect: Sign Up &rarr; Pembayaran DANA/BCA</span>
              </div>
            </div>

            {/* ===================== TITIK 3: AKTIFKAN OTOMATISASI LAYANAN ===================== */}
            <div className="relative flex flex-col justify-between rounded-xl p-4 border bg-slate-800/80 border-purple-500/60 shadow-lg shadow-purple-950/30 ring-1 ring-purple-500/30">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg font-black text-sm bg-purple-500 text-slate-950 shadow">
                      3
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                      Titik Target 3
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-full">
                    24/7 Autopilot
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">
                  Aktifkan Otomatisasi Layanan
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Begitu pembayaran terverifikasi, sistem otonom langsung menjalankan seluruh operasional peternakan Anda tanpa intervensi manual.
                </p>

                {/* Automation Benefits List */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2 text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <Cpu className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200">Status Kandang Otomatis AKTIF:</strong>
                      <span className="text-slate-400 block text-[11px]">Sensor LoRaWAN suhu/kelembaban & ventilasi closed house menyala.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200">Panen & Penyerapan Broker Harian:</strong>
                      <span className="text-slate-400 block text-[11px]">Telur diserap otomatis oleh broker pasar tanpa repot mencari pembeli.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200">Pencairan Hasil ke DANA/BCA:</strong>
                      <span className="text-slate-400 block text-[11px]">Profit panen langsung dapat ditarik kapan saja ke dompet Anda.</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onScrollToAutomation();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-950/40 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                >
                  <Cpu className="w-4 h-4" />
                  Lihat Otomatisasi Kandang & IoT &darr;
                </button>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-700/60">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${activeRental ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                  Status Kandang: <strong className={activeRental ? 'text-emerald-400' : 'text-slate-400'}>{activeRental ? 'AKTIF BEROPERASI' : 'Siap Diaktivasi'}</strong>
                </span>
                {activeRental && (
                  <span className="text-[10px] text-emerald-300 font-semibold">
                    {Math.max(0, Math.ceil((activeRental.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)))} Hari Tersisa
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick 4-Package Comparison Strip */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                Ringkasan Pilihan 4 Paket Kemitraan Tersedia
              </span>
              <span className="text-[11px] text-slate-400">
                Semua paket include: Lahan, Kandang, Bibit Pullet Siap Produksi, & Otomasi IoT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {INFRASTRUCTURE_PACKAGES.map((pkg, idx) => (
                <div
                  key={pkg.id}
                  className={`p-3 rounded-xl border flex flex-col justify-between transition ${
                    pkg.id === activeTabPackageId
                      ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-white">
                        Paket {idx + 1}: {pkg.capacityBirds} Ekor
                      </span>
                      {pkg.recommended ? (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Favorit
                        </span>
                      ) : idx === 0 ? (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Terkecil
                        </span>
                      ) : null}
                    </div>

                    <div className="text-xs text-slate-300 font-medium line-clamp-1 mb-2">
                      {pkg.name}
                    </div>

                    <div className="space-y-1 text-xs mb-3">
                      <div className="flex justify-between text-slate-400">
                        <span>Modal Awal:</span>
                        <strong className="text-white font-semibold">{formatRupiah(pkg.entryPackagePriceIdr || 0)}</strong>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Sewa Bulanan:</span>
                        <span className="text-slate-300">{formatRupiah(pkg.totalMonthlyRentIdr)}/bln</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Hasil Bersih:</span>
                        <strong className="text-emerald-400 font-semibold">{pkg.projectedNetProfitMonthly.displayRange}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playCash();
                      onSelectPackage(pkg);
                    }}
                    className="w-full py-1.5 px-3 rounded-lg font-bold text-xs bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500 transition flex items-center justify-center gap-1 active:scale-[0.98]"
                  >
                    <span>Pilih Paket {idx + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
