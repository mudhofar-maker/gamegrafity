import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Wallet,
  Scale,
  Lock,
  Layers,
  Award,
  Globe,
  Copy,
  Check
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { OFFICIAL_BCA_CONFIG } from '../config/bankConfig';

interface AboutGamegrafityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQrisModal?: () => void;
  onOpenPersonalDashboard?: () => void;
  onOpenTopUp?: () => void;
  onOpenCertifications?: () => void;
}

export const AboutGamegrafityModal: React.FC<AboutGamegrafityModalProps> = ({
  isOpen,
  onClose,
  onOpenQrisModal,
  onOpenPersonalDashboard,
  onOpenTopUp,
  onOpenCertifications,
}) => {
  const [copiedBca, setCopiedBca] = useState(false);

  if (!isOpen) return null;

  const handleCopyBca = () => {
    sounds.playClick();
    navigator.clipboard.writeText(OFFICIAL_BCA_CONFIG.accountNumber);
    setCopiedBca(true);
    setTimeout(() => setCopiedBca(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-indigo-950/70 to-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                  Tentang Gamegrafity Farm
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  Sovereign Mode™
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Platform Peternakan Digital Berbasis Web3 &amp; Ekonomi Sovereign Anti-Defisit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs">
          {/* 1. Definisi & Nilai Inti Platform */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/40 shadow-xl relative overflow-hidden space-y-2">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ekosistem Peternakan Berdaulat</span>
            </div>
            <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
              <strong>Gamegrafity Farm</strong> adalah platform peternakan digital berbasis Web3 dan ekonomi Sovereign yang memastikan peternak pasti untung dan aman dari risiko kerugian, dengan sistem kas pusat yang otomatis melindungi dana agar tidak pernah kebobolan.
            </p>
          </div>

          {/* 2. Sistem Pembayaran (Dual-Payout Hub) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>Sistem Pembayaran (Dual-Payout Hub)</span>
              </h3>
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                Multi-Channel Settlement
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* QRIS & DANA P2P */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-indigo-500/50 transition space-y-2">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">QRIS &amp; DANA P2P</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Memungkinkan pencairan dana instan secara peer-to-peer langsung ke dompet digital DANA atau menggunakan pindai kode QR yang praktis.
                </p>
                {onOpenQrisModal && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOpenQrisModal();
                    }}
                    className="text-[10px] text-rose-300 hover:underline font-semibold flex items-center gap-1 pt-1"
                  >
                    <span>Cek Barcode QRIS</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Rekening Bank Lokal */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-blue-500/50 transition space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Rekening Bank Lokal (BCA, dll.)</h4>
                  <span className="text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded">
                    Official Hub
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Mendukung transfer langsung ke rekening bank lokal milik peternak untuk penarikan dana yang aman.
                </p>
                {/* Official Bank Account Box */}
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/50 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono text-[10px]">Bank Kas Pusat:</span>
                    <span className="font-bold text-blue-300 font-mono">{OFFICIAL_BCA_CONFIG.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-black text-white tracking-wider">
                      {OFFICIAL_BCA_CONFIG.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyBca}
                      className="px-2 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-[10px] font-mono flex items-center gap-1 transition"
                      title="Salin No. Rekening BCA"
                    >
                      {copiedBca ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedBca ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-300 pt-0.5 border-t border-blue-900/40">
                    <span>Atas Nama:</span>
                    <span className="font-bold text-slate-100 font-mono">{OFFICIAL_BCA_CONFIG.accountHolder}</span>
                  </div>
                </div>
                <div className="pt-0.5 text-[10px] text-blue-300/80 font-mono">
                  BCA • Mandiri • BRI • BNI
                </div>
              </div>

              {/* Web3 Wallet */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-indigo-500/50 transition space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Web3 Wallet (MetaMask)</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Menyediakan opsi integrasi dompet kripto bagi pengguna yang bertransaksi dalam ekosistem desentralisasi.
                </p>
                <div className="pt-1 text-[10px] text-purple-300 font-mono">
                  EVM • Smart Contract • Etherscan
                </div>
              </div>
            </div>
          </div>

          {/* 3. Langkah Mudah untuk Untung */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Langkah Mudah untuk Untung</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                4 Tahapan Sederhana
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Langkah 1 */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold font-mono text-sm border border-indigo-500/30 flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Aktivasi Siklus</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Memulai siklus pemeliharaan di sistem dengan dukungan utilitas dan pemantauan harga pasar secara real-time.
                  </p>
                </div>
              </div>

              {/* Langkah 2 */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold font-mono text-sm border border-emerald-500/30 flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Bebas Risiko Kematian (Zero Mortality)</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Terbebas dari risiko kerugian fisik akibat kematian ternak melalui sistem mitigasi dan efisiensi virtual yang melindungi peternak.
                  </p>
                </div>
              </div>

              {/* Langkah 3 */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-bold font-mono text-sm border border-amber-500/30 flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Harga Serap di Atas HPP</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Saat panen tiba, hasil dikunci pada harga serap yang berada di atas Harga Pokok Penjualan (HPP), sehingga margin keuntungan bersih langsung terbentuk.
                  </p>
                </div>
              </div>

              {/* Langkah 4 */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold font-mono text-sm border border-cyan-500/30 flex items-center justify-center shrink-0">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Pencairan Instan</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Tarik keuntungan bersih Anda secara langsung ke DANA, rekening bank lokal, atau dompet digital kapan pun siklus selesai.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Sertifikasi & Legalitas Resmi */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎖️</span>
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Sertifikasi &amp; Standar Mutu Resmi
                </h3>
              </div>
              {onOpenCertifications && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCertifications();
                  }}
                  className="text-xs font-mono text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  Lihat 7 Sertifikat →
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-emerald-400 font-bold">NKV TINGKAT 1</div>
                <div className="text-slate-400 text-[9px] mt-0.5">Kementan RI</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-emerald-400 font-bold">HALAL 100%</div>
                <div className="text-slate-400 text-[9px] mt-0.5">BPJPH &amp; MUI</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-cyan-400 font-bold">ISO 22000 &amp; 9001</div>
                <div className="text-slate-400 text-[9px] mt-0.5">KAN / ISO Global</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-purple-400 font-bold">SMART CONTRACT</div>
                <div className="text-slate-400 text-[9px] mt-0.5">0 Vulnerability</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Footer Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              {onOpenPersonalDashboard && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPersonalDashboard();
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-purple-950/40"
                >
                  <span>🧑‍🌾 Buka Dasbor Peternak</span>
                </button>
              )}

              {onOpenTopUp && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTopUp();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-700"
                >
                  <span>Top-Up Saldo</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Tutup
            </button>
          </div>

          {/* Kepemilikan & Hak Cipta Mudhofar's™ */}
          <div className="pt-3 border-t border-slate-800/80 text-center space-y-1">
            <p className="text-[11px] font-bold text-slate-300">
              © 2026 Gamegrafity Farm. Created &amp; Owned by Mudhofar's™. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-400">
              Sovereign Mode™, Web3 Agro-Fi™, dan Dual-Payout Hub™ adalah merek dan kekayaan intelektual digital terdaftar dari ekosistem Mudhofar's™.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
