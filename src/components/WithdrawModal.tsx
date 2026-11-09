import React, { useState } from 'react';
import { X, ArrowDownRight, Wallet, ShieldCheck, CheckCircle2, ExternalLink, Sparkles, AlertCircle, RefreshCw, Scale, Building, Copy, Check } from 'lucide-react';
import { formatRupiah, formatEth, shortenAddress } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import { IDR_PER_EGG, IDR_PER_ETH, eggCountToEth, executeWeb3HarvestTransaction } from '../services/web3Service';
import { Web3TransactionReceipt, P2PReceipt, FarmerIdentity, EggGrade } from '../types/farm';
import { calculateEggGramasi, EGG_GRADE_SPECS } from '../utils/gramasiEngine';
import { OFFICIAL_BCA_CONFIG } from '../config/bankConfig';
import { ethers } from 'ethers';
import confetti from 'canvas-confetti';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  accumulatedEggs: number;
  saldoDompetSaya: number;
  ethBalance: number;
  farmer: FarmerIdentity;
  signerWallet: ethers.HDNodeWallet | ethers.Wallet;
  onP2PSuccess: (receipt: P2PReceipt, eggCountSold: number, amountIdr: number) => void;
  onWeb3Success: (receipt: Web3TransactionReceipt, eggCountSold: number) => void;
  onOpenEtherscan: (receipt: Web3TransactionReceipt) => void;
  onActivateSovereignMode: () => void;
  onOpenQrisModal?: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  accumulatedEggs,
  saldoDompetSaya,
  ethBalance,
  farmer,
  signerWallet,
  onP2PSuccess,
  onWeb3Success,
  onOpenEtherscan,
  onActivateSovereignMode,
  onOpenQrisModal,
}) => {
  const [activeTab, setActiveTab] = useState<'DANA_P2P' | 'WEB3_ETH'>('DANA_P2P');
  const [eggToWithdraw, setEggToWithdraw] = useState<number>(accumulatedEggs);
  const [selectedGrade, setSelectedGrade] = useState<EggGrade>('GRADE_B');
  const [withdrawSource, setWithdrawSource] = useState<'EGGS' | 'WALLET_IDR'>('EGGS');
  const [walletAmountIdr, setWalletAmountIdr] = useState<number>(saldoDompetSaya);

  // DANA P2P & Bank Local Form States
  const [fiatChannel, setFiatChannel] = useState<'DANA' | 'BANK'>('DANA');
  const [selectedBank, setSelectedBank] = useState<string>('BCA');
  const [bankAccountNumber, setBankAccountNumber] = useState<string>('');
  const [bankAccountHolder, setBankAccountHolder] = useState<string>(farmer.name || 'Peternak Gamegrafity');
  const [copiedTreasuryBca, setCopiedTreasuryBca] = useState<boolean>(false);
  const [danaNumber, setDanaNumber] = useState<string>('0813-8920-1123');
  const [accountName, setAccountName] = useState<string>('Sovereign Agro Farmer');
  const [p2pStep, setP2pStep] = useState<'IDLE' | 'MATCHING_ESCROW' | 'TRANSFERRING' | 'SUCCESS'>('IDLE');
  const [latestP2pReceipt, setLatestP2pReceipt] = useState<P2PReceipt | null>(null);

  // Web3 ETH Form States
  const [customEthRecipient, setCustomEthRecipient] = useState<string>('');
  const [web3Step, setWeb3Step] = useState<'IDLE' | 'SIGNING' | 'MINING' | 'CONFIRMED'>('IDLE');
  const [latestWeb3Receipt, setLatestWeb3Receipt] = useState<Web3TransactionReceipt | null>(null);

  if (!isOpen) return null;

  // Real Gramasi & Financial Calculations
  const gramasiCalc = calculateEggGramasi(eggToWithdraw, selectedGrade);
  const calculatedIdrFromEggs = gramasiCalc.farmerGrossRevenue;
  const calculatedEthFromEggs = gramasiCalc.farmerGrossRevenue / IDR_PER_ETH;

  const effectiveIdrPayout = withdrawSource === 'EGGS' ? calculatedIdrFromEggs : walletAmountIdr;

  const [formError, setFormError] = useState<string | null>(null);

  // Handle DANA P2P or Local Bank Payout
  const handleExecuteP2P = async () => {
    setFormError(null);
    if (withdrawSource === 'EGGS' && (eggToWithdraw <= 0 || eggToWithdraw > accumulatedEggs)) {
      sounds.playError();
      setFormError('Jumlah telur yang ditarik tidak valid!');
      return;
    }
    if (withdrawSource === 'WALLET_IDR' && (walletAmountIdr <= 0 || walletAmountIdr > saldoDompetSaya)) {
      sounds.playError();
      setFormError('Saldo dompet tidak mencukupi untuk penarikan!');
      return;
    }

    if (fiatChannel === 'DANA') {
      if (!danaNumber || danaNumber.length < 8) {
        sounds.playError();
        setFormError('Masukkan nomor akun DANA yang valid!');
        return;
      }
    } else {
      if (!bankAccountNumber || bankAccountNumber.trim().length < 5) {
        sounds.playError();
        setFormError('Masukkan nomor rekening bank tujuan yang valid!');
        return;
      }
      if (!bankAccountHolder || !bankAccountHolder.trim()) {
        sounds.playError();
        setFormError('Masukkan nama pemilik rekening bank tujuan!');
        return;
      }
    }

    sounds.playClick();
    setP2pStep('MATCHING_ESCROW');

    setTimeout(() => {
      setP2pStep('TRANSFERRING');
      setTimeout(() => {
        const isBank = fiatChannel === 'BANK';
        const receipt: P2PReceipt = {
          txId: (isBank ? `${selectedBank}-` : 'DANA-P2P-') + Math.random().toString(36).substring(2, 8).toUpperCase(),
          refId: (isBank ? 'BCAREF' : 'DANAREF') + Math.floor(1000000000 + Math.random() * 9000000000),
          danaNumber: isBank ? `${selectedBank} ${bankAccountNumber}` : danaNumber,
          accountName: isBank ? bankAccountHolder : accountName,
          amountIdr: effectiveIdrPayout,
          eggCount: withdrawSource === 'EGGS' ? eggToWithdraw : 0,
          timestamp: new Date().toLocaleTimeString('id-ID'),
          escrowMerchant: `Treasury Clearing Node (${OFFICIAL_BCA_CONFIG.bankName} No. ${OFFICIAL_BCA_CONFIG.accountNumber} a.n. ${OFFICIAL_BCA_CONFIG.accountHolder})`,
          status: 'COMPLETED',
          feeIdr: 0,
        };

        setLatestP2pReceipt(receipt);
        setP2pStep('SUCCESS');
        sounds.playCash();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });

        onP2PSuccess(
          receipt,
          withdrawSource === 'EGGS' ? eggToWithdraw : 0,
          effectiveIdrPayout
        );
      }, 1400);
    }, 1200);
  };

  // Handle Web3 ETH Smart Contract Payout
  const handleExecuteWeb3 = async () => {
    setFormError(null);
    if (eggToWithdraw <= 0 || eggToWithdraw > accumulatedEggs) {
      sounds.playError();
      setFormError('Jumlah telur yang ditarik ke Web3 tidak valid!');
      return;
    }

    sounds.playClick();
    setWeb3Step('SIGNING');

    // Automatically transition to Sovereign Mode and drop legacy 'Riska' name as specified by user
    if (!farmer.isSmartContractActive || farmer.mode === 'legacy') {
      onActivateSovereignMode();
    }

    const recipient = customEthRecipient.trim() || signerWallet.address;

    setTimeout(async () => {
      setWeb3Step('MINING');
      try {
        const receipt = await executeWeb3HarvestTransaction(
          eggToWithdraw,
          recipient,
          signerWallet,
          {
            grade: selectedGrade,
            weightKg: gramasiCalc.totalWeightKg,
            ambientTempC: 24.0,
            biosecurityScore: 100,
          }
        );

        setTimeout(() => {
          setLatestWeb3Receipt(receipt);
          setWeb3Step('CONFIRMED');
          sounds.playWeb3Success();
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.5 },
          });

          onWeb3Success(receipt, eggToWithdraw);
        }, 1500);
      } catch (err) {
        console.error('Web3 execution failed', err);
        setWeb3Step('IDLE');
        sounds.playError();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                Tarik Saldo & Profit Panen
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                  Dual Payout Hub
                </span>
              </h3>
              <p className="text-xs text-slate-400">P2P Fiat E-Wallet DANA & Web3 Ethereum Smart Contract</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('DANA_P2P');
              sounds.playClick();
              setP2pStep('IDLE');
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2.5 border ${
              activeTab === 'DANA_P2P'
                ? 'bg-sky-600/25 border-sky-500 text-sky-300 shadow-lg shadow-sky-950/50'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            1. P2P DANA &amp; Rekening Bank (IDR Fiat)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('WEB3_ETH');
              sounds.playClick();
              setWeb3Step('IDLE');
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2.5 border ${
              activeTab === 'WEB3_ETH'
                ? 'bg-purple-600/25 border-purple-500 text-purple-300 shadow-lg shadow-purple-950/50'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            2. Web3 ETH Smart Contract
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-rose-400 hover:text-white text-xs px-2 py-0.5 rounded"
              >
                Tutup
              </button>
            </div>
          )}

          {/* ===================== TAB 1: P2P DANA ===================== */}
          {activeTab === 'DANA_P2P' && (
            <div className="space-y-4">
              {p2pStep === 'SUCCESS' && latestP2pReceipt ? (
                /* Success Receipt view */
                <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 text-center space-y-4 animate-fade-in">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Penarikan Fiat Berhasil!</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Dana instan telah diproses oleh Treasury Node tanpa potongan broker.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 rounded-xl p-4 text-left border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Nominal Diterima:</span>
                      <span className="text-emerald-400 font-bold">{formatRupiah(latestP2pReceipt.amountIdr)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Tujuan Pencairan:</span>
                      <span className="text-slate-200 font-bold">{latestP2pReceipt.danaNumber}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Nama Penerima:</span>
                      <span className="text-slate-200">{latestP2pReceipt.accountName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">ID Referensi:</span>
                      <span className="text-slate-300">{latestP2pReceipt.refId}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-slate-800 gap-1">
                      <span className="text-slate-400 shrink-0">Kas Pengirim (Treasury):</span>
                      <span className="text-sky-300 text-left sm:text-right text-[11px]">{latestP2pReceipt.escrowMerchant}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Biaya Broker:</span>
                      <span className="text-emerald-400 font-bold">Rp 0 (GRATIS)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setP2pStep('IDLE');
                      onClose();
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
                  >
                    Tutup & Kembali ke Kandang
                  </button>
                </div>
              ) : (
                /* Form Input View */
                <>
                  {/* Source selector */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Sumber Dana Pencairan
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setWithdrawSource('EGGS');
                          sounds.playClick();
                        }}
                        className={`p-3 rounded-xl border text-left transition ${
                          withdrawSource === 'EGGS'
                            ? 'bg-sky-500/20 border-sky-500 text-sky-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-[11px] text-slate-400">Hasil Panen Telur</div>
                        <div className="text-sm font-bold font-mono text-white mt-0.5">
                          {accumulatedEggs} Butir
                        </div>
                        <div className="text-[10px] text-emerald-400 mt-1">
                          Nilai: {formatRupiah(accumulatedEggs * IDR_PER_EGG)}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setWithdrawSource('WALLET_IDR');
                          sounds.playClick();
                        }}
                        className={`p-3 rounded-xl border text-left transition ${
                          withdrawSource === 'WALLET_IDR'
                            ? 'bg-sky-500/20 border-sky-500 text-sky-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-[11px] text-slate-400">Saldo Dompet Saya</div>
                        <div className="text-sm font-bold font-mono text-white mt-0.5">
                          {formatRupiah(saldoDompetSaya)}
                        </div>
                        <div className="text-[10px] text-sky-400 mt-1">Siap dicairkan ke DANA</div>
                      </button>
                    </div>
                  </div>

                  {withdrawSource === 'EGGS' ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-400 font-semibold uppercase tracking-wider">
                            Jumlah Telur yang Dicairkan (Butir)
                          </span>
                          <button
                            type="button"
                            onClick={() => setEggToWithdraw(accumulatedEggs)}
                            className="text-[11px] font-mono text-sky-400 hover:underline"
                          >
                            Cairkan Semua ({accumulatedEggs} Butir)
                          </button>
                        </div>
                        <input
                          type="number"
                          min={1}
                          max={accumulatedEggs}
                          value={eggToWithdraw}
                          onChange={(e) => setEggToWithdraw(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      {/* Grading Selector for Gramasi */}
                      <div>
                        <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                          <span>Pilih Grade Timbangan Gramasi:</span>
                          <span className="text-amber-400 font-mono text-[10px]">Standar Industri Pinsar</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {(['GRADE_A', 'GRADE_B', 'GRADE_C'] as EggGrade[]).map((gradeKey) => {
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
                                className={`p-2 rounded-xl border text-center transition ${
                                  isSelected
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <div className="text-[11px] font-bold">{gradeKey.replace('_', ' ')}</div>
                                <div className="text-[10px] font-mono text-slate-300">{formatRupiah(spec.pricePerKg)}/Kg</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Live Scale Weight Result */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-amber-400" />
                          <span className="text-slate-400">Hasil Timbangan Netto:</span>
                          <strong className="text-white">{gramasiCalc.totalWeightKg.toFixed(2)} Kg</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-400 font-bold">{formatRupiah(gramasiCalc.farmerGrossRevenue)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider">
                          Nominal Tarik Dompet (IDR)
                        </span>
                        <button
                          type="button"
                          onClick={() => setWalletAmountIdr(saldoDompetSaya)}
                          className="text-[11px] font-mono text-sky-400 hover:underline"
                        >
                          Maksimal ({formatRupiah(saldoDompetSaya)})
                        </button>
                      </div>
                      <input
                        type="number"
                        min={10000}
                        max={saldoDompetSaya}
                        value={walletAmountIdr}
                        onChange={(e) => setWalletAmountIdr(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  )}

                  {/* Fiat Payout Destination Details */}
                  <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Wallet className="w-4 h-4 text-sky-400" />
                        Pilih Saluran Pencairan Fiat (Dual-Payout Hub)
                      </div>
                    </div>

                    {/* Channel selector */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFiatChannel('DANA');
                          sounds.playClick();
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-2 ${
                          fiatChannel === 'DANA'
                            ? 'bg-sky-600/25 border-sky-500 text-sky-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>📲</span>
                        <span>DANA P2P</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFiatChannel('BANK');
                          sounds.playClick();
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-2 ${
                          fiatChannel === 'BANK'
                            ? 'bg-blue-600/25 border-blue-500 text-blue-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Building className="w-3.5 h-3.5" />
                        <span>Transfer Bank Lokal</span>
                      </button>
                    </div>

                    {fiatChannel === 'DANA' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Nomor Ponsel DANA</label>
                          <input
                            type="text"
                            value={danaNumber}
                            onChange={(e) => setDanaNumber(e.target.value)}
                            placeholder="Contoh: 081234567890"
                            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Nama Pemilik Akun DANA</label>
                          <input
                            type="text"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            placeholder="Nama tertera di akun DANA"
                            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">Bank Tujuan</label>
                            <select
                              value={selectedBank}
                              onChange={(e) => setSelectedBank(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                            >
                              <option value="BCA">BCA</option>
                              <option value="Mandiri">Bank Mandiri</option>
                              <option value="BRI">Bank BRI</option>
                              <option value="BNI">Bank BNI</option>
                              <option value="CIMB">CIMB Niaga</option>
                              <option value="Permata">Bank Permata</option>
                              <option value="Bank Lain">Bank Lainnya</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">Nomor Rekening Tujuan</label>
                            <input
                              type="text"
                              value={bankAccountNumber}
                              onChange={(e) => setBankAccountNumber(e.target.value)}
                              placeholder="Contoh: 1234567890"
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">Nama Pemilik Rekening</label>
                            <input
                              type="text"
                              value={bankAccountHolder}
                              onChange={(e) => setBankAccountHolder(e.target.value)}
                              placeholder="Nama terdaftar di buku tabungan"
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Official Treasury Clearing Node Info */}
                    <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-blue-300 font-bold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                          <span>Pusat Kliring Kas Resmi Gamegrafity:</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          100% Terjamin
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300 font-mono text-[11px] pt-0.5">
                        <span>
                          {OFFICIAL_BCA_CONFIG.bankName} - <strong className="text-white">{OFFICIAL_BCA_CONFIG.accountNumber}</strong> a.n. <strong className="text-cyan-300">{OFFICIAL_BCA_CONFIG.accountHolder}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            navigator.clipboard.writeText(OFFICIAL_BCA_CONFIG.accountNumber);
                            setCopiedTreasuryBca(true);
                            setTimeout(() => setCopiedTreasuryBca(false), 2000);
                          }}
                          className="px-2 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-[10px] flex items-center gap-1 border border-blue-500/40 transition shrink-0 ml-2"
                        >
                          {copiedTreasuryBca ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedTreasuryBca ? 'Tersalin' : 'Salin'}</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Dana dicairkan langsung dari rekening kas operasional resmi tanpa perantara broker konvensional.
                      </p>
                    </div>

                    {onOpenQrisModal && (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[11px] text-slate-400">Atau verifikasi pembayaran via Merchant QRIS:</span>
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            onOpenQrisModal();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/40 transition flex items-center gap-1.5"
                        >
                          <span>📲</span>
                          <span>Buka Barcode QRIS Lumpia Ipul</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Total summary */}
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400">Total Pencairan Diterima:</div>
                      <div className="text-lg font-bold font-mono text-emerald-400">
                        {formatRupiah(effectiveIdrPayout)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Biaya Broker:</div>
                      <div className="text-xs font-mono text-emerald-400 font-bold">Rp 0 (0% Potongan)</div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    disabled={p2pStep !== 'IDLE' || effectiveIdrPayout <= 0}
                    onClick={handleExecuteP2P}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-sky-500 hover:from-sky-500 hover:to-blue-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-sky-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {p2pStep === 'MATCHING_ESCROW' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Mencocokkan Node Escrow P2P...</span>
                      </>
                    ) : p2pStep === 'TRANSFERRING' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Mengirim Saldo ke Aplikasi DANA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Proses Penarikan ke DANA ({formatRupiah(effectiveIdrPayout)})</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ===================== TAB 2: WEB3 ETH ===================== */}
          {activeTab === 'WEB3_ETH' && (
            <div className="space-y-4">
              {web3Step === 'CONFIRMED' && latestWeb3Receipt ? (
                /* Success Web3 View */
                <div className="bg-slate-950 border border-purple-500/40 rounded-2xl p-5 text-center space-y-4 animate-fade-in">
                  <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto border border-purple-500/30">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Smart Contract Execution Confirmed!</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Batch panen berhasil dilikuidasi ke blockchain Ethereum via{' '}
                      <code className="text-purple-300 font-mono">GamegrafityFarmCore.sol</code>
                    </p>
                  </div>

                  <div className="bg-slate-900/90 rounded-xl p-4 text-left border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Tx Hash:</span>
                      <span className="text-purple-300 font-bold">{shortenAddress(latestWeb3Receipt.txHash, 6)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-emerald-400 font-bold">0x1 (Success - 12 Block Confirmations)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Nilai ETH Diterima:</span>
                      <span className="text-purple-400 font-bold">{latestWeb3Receipt.valueEth} ETH</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Estimasi Fiat:</span>
                      <span className="text-slate-200">{formatRupiah(latestWeb3Receipt.fiatValueIdr)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Penerima Sovereign:</span>
                      <span className="text-slate-200">{shortenAddress(latestWeb3Receipt.from, 5)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Gas Used:</span>
                      <span className="text-slate-400">{latestWeb3Receipt.gasUsed} Units</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenEtherscan(latestWeb3Receipt)}
                      className="flex-1 py-3 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-950/40"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Verifikasi di Etherscan Explorer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWeb3Step('IDLE');
                        onClose();
                      }}
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              ) : (
                /* Form Input Web3 */
                <>
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-purple-300">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Sovereign Web3 Protocol Active
                    </div>
                    <p className="text-[11px] text-purple-300/80 leading-relaxed">
                      Eksekusi penarikan memvalidasi batch telur langsung ke Smart Contract tanpa broker. Nama
                      peternak legacy (Riska) telah dibersihkan dan dialihkan ke identitas kriptografi terdesentralisasi
                      (Sovereign DID).
                    </p>
                  </div>

                  {/* Egg quantity input */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider">
                        Jumlah Telur yang Dilikuidasi ke ETH
                      </span>
                      <button
                        type="button"
                        onClick={() => setEggToWithdraw(accumulatedEggs)}
                        className="text-[11px] font-mono text-purple-400 hover:underline"
                      >
                        Likuidasi Semua ({accumulatedEggs} Butir)
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={accumulatedEggs}
                        value={eggToWithdraw}
                        onChange={(e) => setEggToWithdraw(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-purple-500"
                      />
                      <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                        = ~{calculatedEthFromEggs.toFixed(6)} ETH
                      </span>
                    </div>
                  </div>

                  {/* Wallet address & signer info */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Dompet Sovereign Penandatangan:</span>
                      <span className="font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {shortenAddress(signerWallet.address, 5)}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Alamat ETH Penerima (Opsional, Default ke Dompet Sovereign)
                      </label>
                      <input
                        type="text"
                        value={customEthRecipient}
                        onChange={(e) => setCustomEthRecipient(e.target.value)}
                        placeholder={signerWallet.address}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                      <div className="text-slate-400">
                        Smart Contract:
                        <div className="text-slate-200 truncate">GamegrafityFarmCore.sol</div>
                      </div>
                      <div className="text-slate-400 text-right">
                        Gas Limit:
                        <div className="text-slate-200">~84,392 Gwei (Subsidi 100%)</div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    disabled={web3Step !== 'IDLE' || eggToWithdraw <= 0}
                    onClick={handleExecuteWeb3}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {web3Step === 'SIGNING' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Menandatangani Transaksi Ethers.js...</span>
                      </>
                    ) : web3Step === 'MINING' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Mining & Konfirmasi Blok Sepolia/Mainnet...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>
                          Klaim {calculatedEthFromEggs.toFixed(6)} ETH ({formatRupiah(calculatedIdrFromEggs)}) via Smart Contract
                        </span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
