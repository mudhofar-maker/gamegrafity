import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  DollarSign,
  Building,
  Users,
  Database,
  Sliders,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { formatRupiah, formatEth } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import { FarmBalances, FarmerIdentity } from '../types/farm';
import { SupportedCurrency } from '../utils/i18n';
import { OFFICIAL_BCA_CONFIG } from '../config/bankConfig';
import { PERPETUAL_FOUNTAIN_PACKAGES } from '../utils/gramasiEngine';

interface SovereignAdminOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  balances: FarmBalances;
  activeCurrency: SupportedCurrency;
  twoWayPendingCount: number;
  farmer: FarmerIdentity;
  onOpenOwnerTreasury: () => void;
  onOpenTwoWayApproval: () => void;
  onOpenFarmerSwitcher: () => void;
  onOpenAuthDatabase: () => void;
  onOpenMonetaryDirective: () => void;
  onLockToPublic: () => void;
}

export const SovereignAdminOfficeModal: React.FC<SovereignAdminOfficeModalProps> = ({
  isOpen,
  onClose,
  balances,
  activeCurrency,
  twoWayPendingCount,
  farmer,
  onOpenOwnerTreasury,
  onOpenTwoWayApproval,
  onOpenFarmerSwitcher,
  onOpenAuthDatabase,
  onOpenMonetaryDirective,
  onLockToPublic,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TREASURY' | 'APPROVALS' | 'SYSTEM'>('OVERVIEW');
  const [confirmLockModal, setConfirmLockModal] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLockAndClose = () => {
    sounds.playClick();
    onLockToPublic();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100 ring-1 ring-amber-500/20">
        {/* Top Secret Header Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-950/80 via-slate-950 to-slate-950 border-b border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-xl shadow-lg shadow-amber-950/50">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-white text-base tracking-wide">
                  Kantor Pusat Sovereign Owner &amp; Admin
                </h2>
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  Mode Privat (5x Tap 🐔)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pusat kendali tertutup ekosistem Mudhofar's™ • Kas Treasury, Approval Mutasi &amp; Database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLockAndClose}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-sm"
              title="Kunci kembali mode privat dan sembunyikan dari pandangan umum"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Kunci &amp; Sembunyikan</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Tutup Modal (Tetap dalam status Admin Unlocked)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 bg-slate-950 border-b border-slate-800 flex gap-2 overflow-x-auto text-xs font-mono">
          {[
            { id: 'OVERVIEW', label: 'Ringkasan Eksekutif' },
            { id: 'TREASURY', label: 'Kas Treasury & 8 Gerbang Margin' },
            { id: 'APPROVALS', label: `Persetujuan Mutasi (${twoWayPendingCount})` },
            { id: 'SYSTEM', label: 'Database & Keamanan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`py-3 px-3.5 border-b-2 font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Highlight Card: Kas Treasury Owner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5 mb-1">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Total Kas Treasury Owner (Protocol Reserve)
                    </span>
                    <div className="text-3xl sm:text-4xl font-black font-mono text-amber-300 tracking-tight">
                      {formatRupiah(balances.kasTreasuryOwner)}
                    </div>
                    <p className="text-slate-300 text-xs mt-1 max-w-xl">
                      Akumulasi seluruh pemasukan hulu: sewa utilitas kandang (10-1.000 ekor), margin pakan 5 fase, margin bibit pullet, jasa sanitasi pasca-afkir, dan fee transaksi.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenOwnerTreasury();
                    }}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs tracking-wider uppercase transition shadow-lg shadow-amber-950/60 flex items-center gap-2 shrink-0 active:scale-95"
                  >
                    <span>Cairkan Kas Owner Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4 Quick Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Approval Center */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">🤝</span>
                    {twoWayPendingCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold animate-pulse">
                        {twoWayPendingCount} Pending
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                        Clean
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-xs">Persetujuan Konfirmasi 2-Arah</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Verifikasi bukti transfer peternak yang sudah klik "Saya Sudah Bayar".
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenTwoWayApproval();
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30 flex items-center justify-center gap-1 transition"
                  >
                    <span>Buka Panel Approval</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 2. Farmer Management */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">🧑‍🌾</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                      Multi-Akun
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Kelola Akun Peternak</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Ganti sesi peternak lapangan, isolasi data pribadi, dan unggah foto profil.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenFarmerSwitcher();
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-mono text-[11px] font-bold border border-indigo-500/30 flex items-center justify-center gap-1 transition"
                  >
                    <span>Kelola Peternak</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 3. Database Neon PostgreSQL */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">🗄️</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                      farmers_users
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Database &amp; Sesi User</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Pencatatan sesi last_sign_in, last_sign_out, dan registrasi publik aman.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenAuthDatabase();
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 font-mono text-[11px] font-bold border border-cyan-500/30 flex items-center justify-center gap-1 transition"
                  >
                    <span>Lihat Rekap Data</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 4. Monetary Policy & HPP Hulu */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">⚖️</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px]">
                      Air Mancur
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Arahan Moneter &amp; HPP</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    5 Strain komersial, harga pakan 5 fase, harga broker telur Rp 21k-22k.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenMonetaryDirective();
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-mono text-[11px] font-bold border border-purple-500/30 flex items-center justify-center gap-1 transition"
                  >
                    <span>Buka Arahan HPP</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Status Rekening Penampung Kas Owner */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-400" />
                    Rekening Kas Operasional Resmi Owner
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">
                    Kliring Korporat
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Bank Kas Utama</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">{OFFICIAL_BCA_CONFIG.bankName}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Nomor Rekening Kas</span>
                    <span className="font-bold text-cyan-300 text-sm mt-0.5 font-mono block">{OFFICIAL_BCA_CONFIG.accountNumber}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Atas Nama Pemilik</span>
                    <span className="font-bold text-slate-100 text-sm mt-0.5 block">{OFFICIAL_BCA_CONFIG.accountHolder}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TREASURY' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Rincian 8 Gerbang Margin Keuntungan Tertutup (Air Mancur Abadi)
                </h3>
                <p className="text-slate-400 text-xs">
                  Seluruh arus kas utilitas dirancang secara matematis di mana Owner bertindak sebagai penyedia hulu dan broker penampung dengan margin pasti.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    no: 1,
                    nama: 'Margin Penjualan Pullet Siap Produksi (18 Minggu)',
                    desc: 'Margin Rp 10.000 / ekor atas penyediaan bibit Lohmann / Hy-Line Brown.',
                    margin10: 'Rp 100.000',
                    margin100: 'Rp 1.000.000',
                  },
                  {
                    no: 2,
                    nama: 'Margin Penjualan Pakan 5 Fase (Konsentrat & Layer)',
                    desc: 'Margin rata-rata Rp 1.400 / kg pakan komplit selama siklus 12 bulan.',
                    margin10: 'Rp 630.000',
                    margin100: 'Rp 6.300.000',
                  },
                  {
                    no: 3,
                    nama: 'Margin Vitamin, Mineral Kalsium & Anti-Stres',
                    desc: 'Suplementasi pencegah kelumpuhan & penguat cangkang telur.',
                    margin10: 'Rp 12.000',
                    margin100: 'Rp 120.000',
                  },
                  {
                    no: 4,
                    nama: 'Sewa Utilitas Kandang Berdaulat (IoT Closed-House)',
                    desc: '100% diterima penuh oleh Owner sebagai pemilik infrastruktur lahan & kandang.',
                    margin10: 'Rp 1.020.000',
                    margin100: 'Rp 6.600.000',
                  },
                  {
                    no: 5,
                    nama: 'Jasa Sanitasi & Pembersihan Kandang Pasca-Afkir',
                    desc: 'Jet washer, desinfeksi medis total, dan tebar sekam masa istirahat kandang.',
                    margin10: 'Rp 35.000',
                    margin100: 'Rp 350.000',
                  },
                  {
                    no: 6,
                    nama: 'Margin Broker Telur Hulu-ke-Grosir (Rp 6.000 / kg)',
                    desc: 'Beli dari peternak Rp 21.500/kg, lepas ke pasar ritel/grosir Rp 27.500/kg.',
                    margin10: 'Rp 1.163.400',
                    margin100: 'Rp 11.634.000',
                  },
                  {
                    no: 7,
                    nama: 'Margin Broker Pembelian Ayam Afkir di Akhir Siklus',
                    desc: 'Beli Rp 40.000/ekor (Rp 15.000/kg), jual ke broker daging afkir Rp 58.000/ekor.',
                    margin10: 'Rp 180.000',
                    margin100: 'Rp 1.800.000',
                  },
                  {
                    no: 8,
                    nama: 'Administrasi Fee Fasilitas Auto-Compounding (3,5%)',
                    desc: 'Dipungut otomatis saat peternak memutar porsi panen untuk ekspansi ternak.',
                    margin10: 'Rp 92.000',
                    margin100: 'Rp 920.000',
                  },
                ].map((g) => (
                  <div key={g.no} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] flex items-center justify-center">
                          {g.no}
                        </span>
                        {g.nama}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{g.desc}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-300">
                      <span>Paket 10 Ekor: <strong className="text-amber-400">{g.margin10}</strong></span>
                      <span>Paket 100 Ekor: <strong className="text-emerald-400">{g.margin100}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'APPROVALS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Konfirmasi Dua Arah (Pengirim 'Saya Sudah Membayar' &amp; Owner Approve)
                </h3>
                <p className="text-slate-400 text-xs">
                  Ketika peternak melakukan pembayaran via QRIS atau DANA manual dan mengunggah konfirmasi, notifikasi approval akan muncul di sini untuk validasi owner.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenTwoWayApproval();
                    }}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40"
                  >
                    <span>Buka Konsol Persetujuan Dua Arah Lengkap</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SYSTEM' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Keamanan Data &amp; Isolasi Privasi Publik
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Semua halaman admin, tombol kas treasury owner, dan mutasi privat disembunyikan sepenuhnya dari publik secara default. Akses masuk hanya dapat dipicu oleh ketukan rahasia (5x tap cepat pada logo ayam 🐔).
                </p>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trigger Masuk:</span>
                    <span className="text-emerald-400 font-bold">5x Tap Logo Ayam 🐔 (&lt; 2,5 Detik)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status Akses Saat Ini:</span>
                    <span className="text-amber-300 font-bold">ADMIN UNLOCKED (Privat)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Visibilitas Publik:</span>
                    <span className="text-purple-300 font-bold">Terproteksi &amp; Aman</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={handleLockAndClose}
                    className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/40 transition"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Kunci Kembali ke Mode Publik Sekarang</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px]">Sovereign Owner Console Active • Mudhofar's™</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLockAndClose}
              className="py-1.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-mono font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Kunci Mode Publik</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
