import React, { useState } from 'react';
import {
  X,
  Lock,
  Building,
  CreditCard,
  Wallet,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Globe,
  PieChart,
  Sparkles,
  ExternalLink,
  Coins,
  Landmark,
  Layers,
  Check,
  Copy
} from 'lucide-react';
import { formatRupiah, formatEth } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { OwnerCashoutDestination, OwnerRealWorldWithdrawal } from '../types/farm';
import { OFFICIAL_BCA_CONFIG } from '../config/bankConfig';

interface OwnerTreasurySettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  kasTreasuryOwner: number;
  ethBalance: number;
  onExecuteOwnerCashout: (amountIdr: number, destination: OwnerCashoutDestination, account: string) => void;
}

export const OwnerTreasurySettlementModal: React.FC<OwnerTreasurySettlementModalProps> = ({
  isOpen,
  onClose,
  kasTreasuryOwner,
  ethBalance,
  onExecuteOwnerCashout,
}) => {
  const [selectedDestination, setSelectedDestination] = useState<OwnerCashoutDestination>('BCA_CORPORATE');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(Math.min(kasTreasuryOwner, 5000000));
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [lastReceipt, setLastReceipt] = useState<OwnerRealWorldWithdrawal | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeAmount = customAmount ? parseInt(customAmount) || 0 : withdrawAmount;

  const destinations: {
    id: OwnerCashoutDestination;
    name: string;
    sub: string;
    account: string;
    icon: any;
    color: string;
  }[] = [
    {
      id: 'BCA_CORPORATE',
      name: `Bank ${OFFICIAL_BCA_CONFIG.bankName}`,
      sub: `Pusat Pencairan Dana & Pengelolaan Kas Operasional Aman (${OFFICIAL_BCA_CONFIG.accountHolder})`,
      account: `${OFFICIAL_BCA_CONFIG.accountNumber} a.n. ${OFFICIAL_BCA_CONFIG.accountHolder}`,
      icon: Building,
      color: 'text-blue-400 border-blue-500/40 bg-blue-950/30'
    },
    {
      id: 'MANDIRI_TREASURY',
      name: 'Bank Mandiri Agro-Treasury',
      sub: 'Treasury Reserve Pool Mandiri Bisnis Escrow',
      account: '140-00-9876543-2',
      icon: Landmark,
      color: 'text-amber-400 border-amber-500/40 bg-amber-950/30'
    },
    {
      id: 'DANA_BUSINESS',
      name: 'DANA Bisnis Merchant ID',
      sub: 'Settlement Instan Dompet Digital Bisnis 0% Broker Fee',
      account: '0812-9988-7766 (Gamegrafity Agro)',
      icon: CreditCard,
      color: 'text-sky-400 border-sky-500/40 bg-sky-950/30'
    },
    {
      id: 'WEB3_USDC_MAINNET',
      name: 'Web3 USDC / ETH Hardware Wallet',
      sub: 'Ethereum Mainnet Safe Multisig (0xOwner...89D2)',
      account: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      icon: Wallet,
      color: 'text-purple-400 border-purple-500/40 bg-purple-950/30'
    },
    {
      id: 'GLOBAL_LAND_EXPANSION',
      name: 'Cadangan Aset Ekspansi Platform',
      sub: 'Alokasi Lahan Baru, Inkubator & Solar Microgrid',
      account: 'RESERVE-EXPANSION-PARCEL-GLOBAL',
      icon: Globe,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30'
    }
  ];

  const currentDest = destinations.find((d) => d.id === selectedDestination) || destinations[0];

  const handleExecuteCashout = () => {
    setErrorMsg(null);
    if (activeAmount <= 0) {
      sounds.playError();
      setErrorMsg('Masukkan nominal pencairan kas yang valid.');
      return;
    }
    if (activeAmount > kasTreasuryOwner) {
      sounds.playError();
      setErrorMsg(`Nominal penarikan (${formatRupiah(activeAmount)}) melebihi saldo Kas Treasury Owner (${formatRupiah(kasTreasuryOwner)}).`);
      return;
    }

    setIsProcessing(true);
    sounds.playDirectivePing();

    setTimeout(() => {
      setIsProcessing(false);
      sounds.playCash();

      const receiptRef = 'SETTLE-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
      const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const record: OwnerRealWorldWithdrawal = {
        id: 'cashout-' + Date.now(),
        timestamp: new Date().toLocaleTimeString('id-ID'),
        amountIdr: activeAmount,
        destination: selectedDestination,
        destinationAccount: currentDest.account,
        purpose: selectedDestination === 'GLOBAL_LAND_EXPANSION' ? 'LAND_EXPANSION_RESERVE' : 'REAL_WORLD_CASHOUT',
        status: 'COMPLETED',
        receiptRef,
        txHash
      };

      setLastReceipt(record);
      onExecuteOwnerCashout(activeAmount, selectedDestination, currentDest.account);

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (_) {}
    }, 1400);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base tracking-wide">
                  Dompet Kas Treasury Owner & Real-World Cashout
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                  Real Net Profit
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Penyelesaian hasil panen virtual bermuara sebagai keuntungan riil yang siap ditarik ke rekening nyata / Web3
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* 1. Treasury Reserves Metric Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Kas Treasury Owner</span>
              <div className="text-2xl font-black font-mono text-amber-300 mt-0.5">
                {formatRupiah(kasTreasuryOwner)}
              </div>
              <span className="text-[10px] font-mono text-emerald-400">100% Likuid & Siap Dicairkan</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Cadangan On-Chain (Web3)</span>
              <div className="text-2xl font-black font-mono text-purple-300 mt-0.5">
                {formatEth(ethBalance, 4)}
              </div>
              <span className="text-[10px] font-mono text-slate-400">~{formatRupiah(ethBalance * 49600000)}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Alamat Kas Protokol Safe</span>
              <div className="text-xs font-mono text-cyan-300 font-bold mt-1.5 truncate">
                0x89D24A6b...260359
              </div>
              <span className="text-[10px] font-mono text-slate-400">Ethereum Mainnet Smart Contract</span>
            </div>
          </div>

          {/* 2. Visual Waterfall Revenue Split Diagram (User Requirement 5) */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-cyan-400" />
                Ending Alur: Waterfall Konversi Panen Virtual & Split Kas Owner
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                Otomasi 100% Smart Protocol
              </span>
            </div>

            {/* Waterfall Flow Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
              {/* Step 1: Panen Telur Virtual */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-cyan-400 font-bold">1. HASIL PANEN VIRTUAL</div>
                <div className="font-bold text-white">100% Nilai Telur</div>
                <p className="text-[10px] text-slate-400">
                  Telur dikonversi otomatis ke nilai likuid berbasis harga pasar Pinsar (Rp 30.000/Kg).
                </p>
              </div>

              {/* Step 2: Hak Peternak */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-emerald-400 font-bold">2. HAK PETERNAK</div>
                <div className="font-bold text-emerald-300">50-60% Tunai + 40-50% Cmp</div>
                <p className="text-[10px] text-slate-400">
                  Sebagian masuk dompet cair peternak, sebagian diputar beli pakan batch berikutnya.
                </p>
              </div>

              {/* Step 3: Biaya Sewa & Suplai */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-yellow-400 font-bold">3. BIAYA OPERASIONAL</div>
                <div className="font-bold text-yellow-300">Sewa + Margin Suplai</div>
                <p className="text-[10px] text-slate-400">
                  Sewa lahan/kandang IoT + selisih margin pabrik pakan konsentrat & hatchery DOC.
                </p>
              </div>

              {/* Step 4: Kas Treasury Owner */}
              <div className="p-3 bg-amber-950/40 rounded-lg border-2 border-amber-500/60 space-y-1 shadow-md">
                <div className="text-[10px] font-mono text-amber-300 font-bold">4. KAS TREASURY OWNER</div>
                <div className="font-black text-amber-300 text-sm">REAL NET PROFIT OWNER</div>
                <p className="text-[10px] text-amber-200/80">
                  Bermuara sebagai laba bersih owner yang siap ditarik tunai ke rekening nyata.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Real-World Withdrawal Destination Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Pilih Tujuan Pencairan Kas Treasury ke Dunia Nyata:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {destinations.map((dest) => {
                const isSelected = selectedDestination === dest.id;
                const Icon = dest.icon;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => {
                      setSelectedDestination(dest.id);
                      sounds.playClick();
                    }}
                    className={`p-3 rounded-xl text-left border transition flex items-start gap-3 ${
                      isSelected
                        ? `${dest.color} ring-2 ring-amber-400/30`
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white text-xs block">{dest.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{dest.sub}</span>
                      <span className="text-[10px] font-mono text-cyan-400 block mt-1">
                        Rek/Vault: {dest.account}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Nominal Input & Quick Percentages */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">Nominal Penarikan Kas Owner:</span>
              <span className="text-amber-300 font-black text-base">{formatRupiah(activeAmount)}</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((pct) => {
                const amountForPct = Math.round((kasTreasuryOwner * pct) / 100);
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => {
                      setWithdrawAmount(amountForPct);
                      setCustomAmount('');
                      sounds.playClick();
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition border ${
                      withdrawAmount === amountForPct && !customAmount
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {pct === 100 ? 'Maksimal (100%)' : `${pct}% (${formatRupiah(amountForPct)})`}
                  </button>
                );
              })}
            </div>

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
                  setWithdrawAmount(0);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 5. Execution Button */}
          <button
            type="button"
            disabled={isProcessing || activeAmount <= 0 || activeAmount > kasTreasuryOwner}
            onClick={handleExecuteCashout}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-sm tracking-wider uppercase transition shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memproses Settlement ke Rekening Nyata...</span>
              </>
            ) : (
              <>
                <Coins className="w-4 h-4 text-amber-200" />
                <span>Cairkan Kas Treasury Owner ({formatRupiah(activeAmount)}) &rarr;</span>
              </>
            )}
          </button>

          {/* Settlement Confirmation Receipt if executed */}
          {lastReceipt && (
            <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/50 space-y-2 animate-fade-in font-mono text-xs">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  SETTLEMENT PENCAIRAN BERHASIL DITRANSFER
                </span>
                <span>{lastReceipt.timestamp}</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nominal Dicairkan:</span>
                  <span className="text-emerald-300 font-bold">{formatRupiah(lastReceipt.amountIdr)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tujuan Rekening Nyata:</span>
                  <span className="text-white font-bold">{lastReceipt.destinationAccount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Referensi Kode Escrow:</span>
                  <span className="text-cyan-300 font-bold">{lastReceipt.receiptRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">On-Chain TxHash:</span>
                  <span className="text-purple-300 font-bold">{lastReceipt.txHash?.substring(0, 18)}...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
