import React, { useState, useEffect } from 'react';
import {
  QrCode,
  X,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  Copy,
  Check,
  CreditCard,
  Wallet,
  Building,
  ArrowRight,
  Lock
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { SupportedPaymentChannel } from '../types/farm';
import { OFFICIAL_BCA_CONFIG } from '../config/bankConfig';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, method: SupportedPaymentChannel, targetPackageId?: string) => void;
  actorName: string;
  initialAmount?: number;
  targetPackage?: {
    id: string;
    name: string;
    priceIdr: number;
  };
  onOpenTwoWayConfirmation?: (service: { name: string; amountIdr: number; channel?: SupportedPaymentChannel }) => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actorName,
  initialAmount,
  targetPackage,
  onOpenTwoWayConfirmation
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount || targetPackage?.priceIdr || 100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<SupportedPaymentChannel>('QRIS');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const presetAmounts = [50000, 100000, 250000, 500000, 1250000, 2350000, 4000000];

  useEffect(() => {
    if (initialAmount) {
      setSelectedAmount(initialAmount);
    } else if (targetPackage) {
      setSelectedAmount(targetPackage.priceIdr);
    }
  }, [initialAmount, targetPackage, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(300);
      setIsProcessing(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;

  const handleSimulatePayment = () => {
    if (currentAmount < 10000) {
      sounds.playError();
      alert('Minimal pembayaran adalah Rp 10.000');
      return;
    }
    sounds.playQrisScan();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      sounds.playCash();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
      onSuccess(currentAmount, paymentMethod, targetPackage?.id);
      onClose();
    }, 1300);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                {targetPackage ? `Bayar & Aktifkan ${targetPackage.name}` : 'Gateway Pembayaran Peternak Berdaulat'}
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  Sovereign 0% Fee
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Lokal (QRIS / DANA / BCA) & Global (Web3 Gateway) • Alokasi ke Kas Owner
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

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {targetPackage && (
            <div className="p-3 bg-gradient-to-r from-indigo-950/60 to-slate-950 rounded-xl border border-indigo-500/30 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Paket Terpilih:</span>
                <span className="text-white font-bold text-sm">{targetPackage.name}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] uppercase block">Biaya Sewa 30 Hari:</span>
                <span className="text-amber-300 font-extrabold text-sm">{formatRupiah(targetPackage.priceIdr)}</span>
              </div>
            </div>
          )}

          {/* 4 Multi-Rail Payment Channels (QRIS, DANA, BCA, Web3 Wallet) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Pilih Saluran Pembayaran (Lokal & Global)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* QRIS */}
              <button
                type="button"
                onClick={() => { setPaymentMethod('QRIS'); sounds.playClick(); }}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition border ${
                  paymentMethod === 'QRIS'
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/50'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">QRIS</span>
                <span className="text-[9px] font-mono text-slate-400">Semua Bank/E-Wallet</span>
              </button>

              {/* DANA */}
              <button
                type="button"
                onClick={() => { setPaymentMethod('DANA'); sounds.playClick(); }}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition border ${
                  paymentMethod === 'DANA'
                    ? 'bg-sky-600/30 border-sky-500 text-sky-300 shadow-md shadow-sky-950/50'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-4 h-4 text-sky-400" />
                <span className="font-bold">DANA Pay</span>
                <span className="text-[9px] font-mono text-slate-400">Instant Direct</span>
              </button>

              {/* BCA Virtual Account */}
              <button
                type="button"
                onClick={() => { setPaymentMethod('BCA'); sounds.playClick(); }}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition border ${
                  paymentMethod === 'BCA'
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-md shadow-blue-950/50'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building className="w-4 h-4 text-blue-400" />
                <span className="font-bold">BCA VA</span>
                <span className="text-[9px] font-mono text-slate-400">Verifikasi Otomatis</span>
              </button>

              {/* Web3 Wallet */}
              <button
                type="button"
                onClick={() => { setPaymentMethod('WEB3_WALLET'); sounds.playClick(); }}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition border ${
                  paymentMethod === 'WEB3_WALLET'
                    ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-md shadow-purple-950/50'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wallet className="w-4 h-4 text-purple-400" />
                <span className="font-bold">Web3 Global</span>
                <span className="text-[9px] font-mono text-slate-400">ETH & USDC Instant</span>
              </button>
            </div>
          </div>

          {/* Amount Selection presets if not paying a fixed package */}
          {!targetPackage && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Pilih Nominal Pembayaran
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                      sounds.playClick();
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition border ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {formatRupiah(amt)}
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="mt-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    placeholder="Nominal custom lainnya..."
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Payment Channel Display */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
            <div className="flex items-center justify-between w-full mb-3 px-1">
              <span className="text-[11px] font-mono text-slate-400">
                {paymentMethod === 'BCA' && 'Rekening BCA: '}
                {paymentMethod === 'WEB3_WALLET' && 'Smart Contract Treasury: '}
                {(paymentMethod === 'QRIS' || paymentMethod === 'DANA') && 'NMID (LUMPIA IPUL): '}
                <strong className="text-slate-200">
                  {paymentMethod === 'BCA' ? OFFICIAL_BCA_CONFIG.accountNumber : paymentMethod === 'WEB3_WALLET' ? '0x89D2...0359' : 'ID1026601649688'}
                </strong>
              </span>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                ⏳ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>

            {/* Visual based on channel: Real QRIS Barcode Lumpia Ipul */}
            {(paymentMethod === 'QRIS' || paymentMethod === 'DANA') && (
              <div className="w-full max-w-[280px] p-3 bg-white rounded-2xl shadow-xl flex flex-col items-center border-2 border-red-500/40 my-1">
                <div className="w-full flex items-center justify-between pb-1 mb-1 border-b border-slate-200">
                  <div className="text-left">
                    <span className="text-[8px] font-bold text-slate-800 font-sans block">QR Code Standar Pembayaran Nasional</span>
                    <span className="text-[11px] font-extrabold text-red-700 block">LUMPIA IPUL</span>
                  </div>
                  <span className="text-[8px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">GPN</span>
                </div>

                <div className="w-full text-center py-0.5 text-[9px] font-mono text-slate-700 bg-slate-50 rounded mb-1">
                  NMID: <strong className="text-slate-900">ID1026601649688</strong> • A01
                </div>

                {/* Real Barcode Image */}
                <div className="w-full max-h-[220px] overflow-hidden rounded-xl border border-slate-200 flex items-center justify-center bg-white my-1">
                  <img
                    src="/assets/aistudio/Screenshot_20261012-140910_f358145d.png"
                    alt="Barcode QRIS Lumpia Ipul DANA P2P"
                    className="w-full h-auto object-contain"
                  />
                </div>

                <div className="w-full text-center pt-1 text-[8px] font-bold text-red-700 uppercase tracking-wider font-sans">
                  SATU QRIS UNTUK SEMUA (DANA & SEMUA BANK)
                </div>

                <div className="w-full mt-2 flex items-center justify-between gap-1 pt-1.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleCopy('ID1026601649688')}
                    className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-600" />}
                    Salin NMID
                  </button>
                  <a
                    href="/assets/aistudio/Screenshot_20261012-140910_f358145d.png"
                    target="_blank"
                    rel="noreferrer"
                    className="py-1 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition"
                  >
                    Buka Penuh
                  </a>
                </div>
              </div>
            )}

            {paymentMethod === 'BCA' && (
              <div className="w-full p-4 bg-blue-950/40 rounded-xl border border-blue-500/30 text-left space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-blue-500/20">
                  <span className="text-slate-400">Nama Bank:</span>
                  <span className="font-mono text-cyan-300 font-bold">{OFFICIAL_BCA_CONFIG.bankName}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-blue-500/20">
                  <span className="text-slate-400">Nomor Rekening:</span>
                  <span className="font-mono text-blue-300 font-bold text-base tracking-wider">{OFFICIAL_BCA_CONFIG.accountNumber}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-blue-500/20">
                  <span className="text-slate-400">Atas Nama:</span>
                  <span className="font-mono text-white font-bold">{OFFICIAL_BCA_CONFIG.accountHolder}</span>
                </div>
                <div className="text-[11px] text-blue-200/90 leading-relaxed bg-blue-900/30 p-2.5 rounded-lg border border-blue-500/20">
                  {OFFICIAL_BCA_CONFIG.description}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(OFFICIAL_BCA_CONFIG.accountNumber)}
                  className="w-full py-2 rounded-lg bg-blue-600/40 hover:bg-blue-600/60 text-blue-100 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition border border-blue-500/50 shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Salin Nomor Rekening BCA (3432650071)
                </button>
              </div>
            )}

            {paymentMethod === 'WEB3_WALLET' && (
              <div className="w-full p-4 bg-purple-950/40 rounded-xl border border-purple-500/30 text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Jaringan:</span>
                  <span className="font-mono text-purple-300 font-bold">Ethereum / Arbitrum L2</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Alamat Smart Contract:</span>
                  <span className="font-mono text-white font-bold text-[11px]">0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Nilai Ekivalen ETH:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    ~{(currentAmount / 45000000).toFixed(6)} ETH
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359')}
                  className="w-full py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition border border-purple-500/40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Salin Contract Address
                </button>
              </div>
            )}

            <div className="mt-3 text-center w-full">
              <div className="text-xs text-slate-400">Total Nominal Pembayaran:</div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
                {formatRupiah(currentAmount)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Alokasi: <span className="text-amber-300 font-bold">Kas Treasury Owner (0xOwner...89D2)</span>
              </div>
            </div>
          </div>

          {/* Action Button: Konfirmasi Pembayaran Pengirim */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={isProcessing || currentAmount <= 0}
              onClick={handleSimulatePayment}
              className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memvalidasi Pembayaran & Mengaktifkan Smart Contract...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>
                    Saya Sudah Membayar ({formatRupiah(currentAmount)}) &rarr;
                  </span>
                </>
              )}
            </button>

            {onOpenTwoWayConfirmation && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenTwoWayConfirmation({
                    name: targetPackage?.name || `Top-Up Saldo Dompet ${formatRupiah(currentAmount)}`,
                    amountIdr: currentAmount,
                    channel: paymentMethod
                  });
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-mono text-xs font-bold border border-amber-500/40 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>🤝</span>
                <span>Buka Panel Konfirmasi 2-Arah (Menunggu Approve Owner)</span>
              </button>
            )}
          </div>

          {/* Instant Activation Guarantees */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Otomasi Setelah Pembayaran Dikonfirmasi:</span>
            </div>
            <ul className="list-disc list-inside text-[10px] text-slate-300 space-y-0.5 pl-1">
              <li>Status kandang otomatis berubah menjadi <strong>AKTIF</strong> berdenyut.</li>
              <li>Nomor kontrak dan txHash terbit di ledger on-chain.</li>
              <li>Saldo seketika masuk menambah <strong>Kas Treasury Owner</strong>.</li>
              <li>Sensor IoT (suhu 24°C, RH 65%, NH3 &lt; 15 PPM) dan timer 30 hari langsung berjalan 24/7.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
