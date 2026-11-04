import React, { useState } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
  Download,
  Maximize2,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';

interface P2PQrisBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  nominalIdr?: number;
  purpose?: string;
  onOpenTwoWayConfirmation?: (service: { name: string; amountIdr: number; channel?: any }) => void;
}

export const QRIS_MERCHANT_NAME = 'LUMPIA IPUL';
export const QRIS_NMID = 'ID1026601649688';
export const QRIS_TERMINAL_ID = 'A01';
export const QRIS_IMAGE_URL = '/assets/aistudio/Screenshot_20261012-140910_f358145d.png';

export const P2PQrisBarcodeModal: React.FC<P2PQrisBarcodeModalProps> = ({
  isOpen,
  onClose,
  nominalIdr,
  purpose = 'Pembayaran & Top-Up P2P Peternak Sovereign',
  onOpenTwoWayConfirmation,
}) => {
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen) return null;

  const handleCopyNmid = () => {
    navigator.clipboard.writeText(QRIS_NMID);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const supportedWallets = [
    { name: 'DANA', color: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
    { name: 'GoPay', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    { name: 'OVO', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    { name: 'ShopeePay', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
    { name: 'BCA Mobile', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    { name: 'Livin Mandiri', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    { name: 'BRImo', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    { name: 'Semua Bank', color: 'bg-slate-700/50 text-slate-300 border-slate-600' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-200 flex flex-col max-h-[92vh]">
        {/* Glow Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-red-600" />

        {/* Modal Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-950/50">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Barcode DANA / QRIS P2P</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  GPN Resmi
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Merchant Resmi: <strong className="text-amber-300">{QRIS_MERCHANT_NAME}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Nominal if provided */}
          {nominalIdr ? (
            <div className="p-3 bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/30 rounded-2xl text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                Nominal Pembayaran / Top-Up:
              </span>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-0.5">
                {formatRupiah(nominalIdr)}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{purpose}</p>
            </div>
          ) : (
            <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-center text-xs text-slate-400">
              {purpose}
            </div>
          )}

          {/* Barcode Frame / Display */}
          <div className="relative bg-white rounded-2xl p-3 shadow-xl flex flex-col items-center border-4 border-slate-800 group">
            {/* Header in QR Card */}
            <div className="w-full flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-200">
              <div className="text-left">
                <span className="text-[9px] font-bold text-slate-800 font-sans tracking-wide block">
                  QR Code Standar Pembayaran Nasional
                </span>
                <span className="text-[12px] font-extrabold text-red-700 tracking-tight block">
                  {QRIS_MERCHANT_NAME}
                </span>
              </div>
              <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                GPN
              </span>
            </div>

            {/* Merchant Details Strip */}
            <div className="w-full text-center py-1 text-[11px] font-mono text-slate-700 border-b border-slate-100 bg-slate-50/80 my-1 rounded">
              NMID: <strong className="text-slate-900">{QRIS_NMID}</strong> • {QRIS_TERMINAL_ID}
            </div>

            {/* The Real QRIS Image */}
            <div className="relative my-2 overflow-hidden rounded-xl border border-slate-200 max-h-[340px] flex items-center justify-center bg-white">
              <img
                src={QRIS_IMAGE_URL}
                alt="Barcode QRIS Lumpia Ipul DANA P2P"
                className={`w-full object-contain transition-all duration-300 ${
                  isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            </div>

            {/* Footer in QR Card */}
            <div className="w-full text-center pt-1 text-[10px] font-bold text-red-700 uppercase tracking-wider font-sans">
              SATU QRIS UNTUK SEMUA (DANA & SEMUA BANK)
            </div>
          </div>

          {/* Supported Wallets Pills */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-semibold block text-center">
              Dapat Di-scan Menggunakan Aplikasi:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {supportedWallets.map((w) => (
                <span
                  key={w.name}
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${w.color}`}
                >
                  {w.name}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Copy NMID & Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyNmid}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'NMID Disalin' : 'Salin NMID'}</span>
            </button>

            <a
              href={QRIS_IMAGE_URL}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-md shadow-red-950/40"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Gambar Penuh</span>
            </a>
          </div>

          {/* Info Banner */}
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Buka aplikasi <strong>DANA</strong> atau mobile banking Anda, pilih menu <strong>Scan / Bayar</strong>, lalu arahkan kamera ke barcode di atas. Pembayaran diverifikasi langsung ke Kas Treasury Owner (Lumpia Ipul) tanpa biaya broker.
            </p>
          </div>

          {/* Action Button: Konfirmasi Pengirim "Saya Sudah Membayar" */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                if (onOpenTwoWayConfirmation) {
                  onOpenTwoWayConfirmation({
                    name: purpose || 'Pembayaran QRIS / DANA P2P',
                    amountIdr: nominalIdr || 1250000,
                    channel: 'QRIS'
                  });
                }
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              <span>
                Saya Sudah Membayar {nominalIdr ? `(${formatRupiah(nominalIdr)})` : 'via DANA'} &rarr;
              </span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-1.5">
              Klik setelah transfer untuk mengirimkan konfirmasi ke Owner & membuka modul produksi.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            NMID: {QRIS_NMID}
          </span>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="py-2 px-5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
