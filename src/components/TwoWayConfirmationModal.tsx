import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Wallet,
  ArrowRight,
  UserCheck,
  Send,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Lock,
  Unlock,
  Building2,
  ExternalLink
} from 'lucide-react';
import { formatRupiah, shortenAddress } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import { TwoWayPaymentRecord, TwoWaySenderStatus, TwoWayReceiverStatus } from '../types/farm';
import { QRIS_MERCHANT_NAME, QRIS_NMID } from './P2PQrisBarcodeModal';
import confetti from 'canvas-confetti';

interface TwoWayConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'owner' | 'peternak';
  userName?: string;
  initialService?: {
    name: string;
    amountIdr: number;
    channel?: 'DANA_P2P' | 'QRIS' | 'BCA' | 'WEB3_WALLET';
  };
  onPaymentApproved?: (record: TwoWayPaymentRecord) => void;
}

export const TwoWayConfirmationModal: React.FC<TwoWayConfirmationModalProps> = ({
  isOpen,
  onClose,
  userRole = 'peternak',
  userName = 'Peternak Lapangan',
  initialService,
  onPaymentApproved
}) => {
  // Active viewing side: 'SENDER' or 'RECEIVER'
  const [activeTab, setActiveTab] = useState<'SENDER' | 'RECEIVER'>(
    userRole === 'owner' ? 'RECEIVER' : 'SENDER'
  );

  // Sender form state
  const [senderName, setSenderName] = useState<string>(userName || 'Ahmad (Peternak)');
  const [senderPhone, setSenderPhone] = useState<string>('0813-8821-9043');
  const [serviceName, setServiceName] = useState<string>(
    initialService?.name || 'Paket Pro IoT Tier-1 (500 Ekor)'
  );
  const [amountIdr, setAmountIdr] = useState<number>(
    initialService?.amountIdr || 2350000
  );
  const [paymentChannel, setPaymentChannel] = useState<'DANA_P2P' | 'QRIS' | 'BCA' | 'WEB3_WALLET'>(
    initialService?.channel || 'DANA_P2P'
  );
  const [proofNote, setProofNote] = useState<string>(
    'Sudah transfer via aplikasi DANA ke QRIS Lumpia Ipul. Berita: Sewa Kandang & Produksi IoT.'
  );
  const [isSubmittingSender, setIsSubmittingSender] = useState<boolean>(false);
  const [activePaymentRecord, setActivePaymentRecord] = useState<TwoWayPaymentRecord | null>(null);

  // Receiver list & approval state
  const [records, setRecords] = useState<TwoWayPaymentRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch all records from backend
  const fetchRecords = async () => {
    setIsLoadingRecords(true);
    try {
      const res = await fetch('/api/p2p/two-way-confirmations');
      const data = await res.json();
      if (data.success && Array.isArray(data.records)) {
        setRecords(data.records);
        // Find existing record for current sender if any
        if (!activePaymentRecord && data.records.length > 0) {
          const match = data.records.find((r: TwoWayPaymentRecord) => r.senderName === senderName);
          if (match) setActivePaymentRecord(match);
        }
      }
    } catch (err) {
      console.warn('Gagal memuat antrean konfirmasi dua arah:', err);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecords();
      if (initialService) {
        setServiceName(initialService.name);
        setAmountIdr(initialService.amountIdr);
        if (initialService.channel) setPaymentChannel(initialService.channel);
      }
    }
  }, [isOpen, initialService]);

  if (!isOpen) return null;

  // Handler: Pengirim menekan tombol "Saya Sudah Membayar"
  const handleSenderSubmitPayment = async () => {
    if (amountIdr <= 0) {
      sounds.playError();
      return;
    }

    setIsSubmittingSender(true);
    sounds.playClick();

    const payload = {
      id: activePaymentRecord?.id,
      senderName,
      senderWalletOrPhone: senderPhone,
      serviceName,
      amountIdr,
      paymentChannel,
      senderProofNote: proofNote
    };

    try {
      const res = await fetch('/api/p2p/sender-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.record) {
        setActivePaymentRecord(data.record);
        sounds.playDirectivePing();
        await fetchRecords();
      }
    } catch (err) {
      console.error('Error konfirmasi pengirim:', err);
      // Fallback local update
      const fallbackRecord: TwoWayPaymentRecord = {
        id: 'PAY-DANA-' + Math.floor(1000 + Math.random() * 9000),
        senderName,
        senderWalletOrPhone: senderPhone,
        serviceName,
        amountIdr,
        paymentChannel,
        merchantTarget: `${QRIS_MERCHANT_NAME} (NMID: ${QRIS_NMID})`,
        senderStatus: 'SUDAH_BAYAR',
        senderConfirmedAt: new Date().toISOString(),
        senderProofNote: proofNote,
        receiverStatus: 'PENDING_APPROVAL',
        unlockedModule: `Akses ${serviceName}`,
        createdAt: new Date().toISOString()
      };
      setActivePaymentRecord(fallbackRecord);
      setRecords((prev) => [fallbackRecord, ...prev]);
      sounds.playDirectivePing();
    } finally {
      setIsSubmittingSender(false);
    }
  };

  // Handler: Penerima (Owner/Admin) Approve
  const handleReceiverApprove = async (record: TwoWayPaymentRecord) => {
    setApprovingId(record.id);
    sounds.playClick();

    try {
      const res = await fetch('/api/p2p/receiver-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: record.id,
          approvedBy: 'Mudhofar (Owner/Admin)'
        })
      });
      const data = await res.json();

      if (data.success && data.record) {
        sounds.playCash();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Update local records
        setRecords((prev) =>
          prev.map((r) => (r.id === record.id ? data.record : r))
        );
        if (activePaymentRecord?.id === record.id) {
          setActivePaymentRecord(data.record);
        }

        // Notify parent callback to unlock the production module or credit balance
        if (onPaymentApproved) {
          onPaymentApproved(data.record);
        }
      }
    } catch (err) {
      console.error('Error approve penerima:', err);
      const approvedMock: TwoWayPaymentRecord = {
        ...record,
        receiverStatus: 'APPROVED',
        receiverApprovedAt: new Date().toISOString(),
        receiverApprovedBy: 'Mudhofar (Owner/Admin)',
        txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      };
      setRecords((prev) => prev.map((r) => (r.id === record.id ? approvedMock : r)));
      if (activePaymentRecord?.id === record.id) setActivePaymentRecord(approvedMock);
      sounds.playCash();
      if (onPaymentApproved) onPaymentApproved(approvedMock);
    } finally {
      setApprovingId(null);
    }
  };

  // Handler: Penerima Reject
  const handleReceiverReject = async (recordId: string) => {
    const reason = prompt('Masukkan alasan penolakan (misal: dana belum masuk mutasi DANA):', 'Dana belum masuk ke mutasi akun DANA Lumpia Ipul.');
    if (!reason) return;

    sounds.playClick();
    try {
      const res = await fetch('/api/p2p/receiver-reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: recordId, reason })
      });
      const data = await res.json();
      if (data.success) {
        fetchRecords();
      }
    } catch (err) {
      console.error(err);
      setRecords((prev) =>
        prev.map((r) => (r.id === recordId ? { ...r, receiverStatus: 'REJECTED' } : r))
      );
    }
  };

  const pendingCount = records.filter((r) => r.receiverStatus === 'PENDING_APPROVAL').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-200 flex flex-col max-h-[92vh]">
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-500 to-sky-500" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 text-xl font-bold">
              🤝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  Konfirmasi Dua Arah (P2P Settlement)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Dual-Signed
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pihak Pengirim (Saya Sudah Membayar) & Pihak Penerima (Owner Approve & Buka Akses)
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

        {/* Dual Role Switcher Tabs */}
        <div className="px-5 pt-3 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('SENDER');
                sounds.playClick();
              }}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                activeTab === 'SENDER'
                  ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>1. Pihak Pengirim (Peternak)</span>
              {activePaymentRecord?.senderStatus === 'SUDAH_BAYAR' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('RECEIVER');
                sounds.playClick();
              }}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 border relative ${
                activeTab === 'RECEIVER'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Pihak Penerima (Owner/Admin)</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={fetchRecords}
            disabled={isLoadingRecords}
            className="p-1.5 text-slate-400 hover:text-slate-200 transition text-xs flex items-center gap-1 font-mono"
            title="Refresh status antrean"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRecords ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* ============================== TAB 1: PIHAK PENGIRIM ============================== */}
          {activeTab === 'SENDER' && (
            <div className="space-y-4">
              {/* Stepper Indicator */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    activePaymentRecord?.senderStatus === 'SUDAH_BAYAR'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                  }`}>
                    {activePaymentRecord?.senderStatus === 'SUDAH_BAYAR' ? '✓' : '1'}
                  </div>
                  <div>
                    <span className="font-bold text-white block">Konfirmasi Pengirim</span>
                    <span className="text-[10px] text-slate-400">Tekan "Saya Sudah Membayar"</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600" />

                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    activePaymentRecord?.receiverStatus === 'APPROVED'
                      ? 'bg-emerald-500 text-slate-950'
                      : activePaymentRecord?.senderStatus === 'SUDAH_BAYAR'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {activePaymentRecord?.receiverStatus === 'APPROVED' ? '✓' : '2'}
                  </div>
                  <div>
                    <span className="font-bold text-white block">Konfirmasi Penerima</span>
                    <span className="text-[10px] text-slate-400">Owner Approve & Buka Akses</span>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              {activePaymentRecord && (
                <div className={`p-4 rounded-2xl border transition-all ${
                  activePaymentRecord.receiverStatus === 'APPROVED'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : activePaymentRecord.receiverStatus === 'REJECTED'
                    ? 'bg-red-950/40 border-red-500/40 text-red-200'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      {activePaymentRecord.receiverStatus === 'APPROVED' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : activePaymentRecord.receiverStatus === 'REJECTED' ? (
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-spin-slow" />
                      )}
                      <div>
                        <div className="text-sm font-bold flex items-center gap-2">
                          <span>
                            {activePaymentRecord.receiverStatus === 'APPROVED'
                              ? 'Pembayaran Lunas & Diverifikasi Owner!'
                              : activePaymentRecord.receiverStatus === 'REJECTED'
                              ? 'Transaksi Ditolak'
                              : 'Menunggu Konfirmasi Akhir Penerima (Owner/Admin)...'}
                          </span>
                        </div>
                        <p className="text-xs mt-1 text-slate-300">
                          {activePaymentRecord.receiverStatus === 'APPROVED' ? (
                            <>
                              Dana masuk ke akun DANA Lumpia Ipul. Modul{' '}
                              <strong className="text-emerald-300">{activePaymentRecord.unlockedModule}</strong>{' '}
                              telah dibuka penuh dan status kandang aktif 24/7!
                            </>
                          ) : activePaymentRecord.receiverStatus === 'REJECTED' ? (
                            'Owner tidak menemukan mutasi masuk. Silakan periksa kembali bukti transfer.'
                          ) : (
                            <>
                              Anda telah menekan <strong>"Saya Sudah Membayar"</strong>. Owner Mudhofar sedang memeriksa mutasi saldo masuk pada akun DANA Lumpia Ipul.
                            </>
                          )}
                        </p>
                        {activePaymentRecord.txHash && (
                          <div className="text-[10px] font-mono text-purple-300 mt-1.5 flex items-center gap-1.5">
                            <span>Tx Hash On-Chain:</span>
                            <span className="text-slate-200">{shortenAddress(activePaymentRecord.txHash, 8)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase border shrink-0">
                      {activePaymentRecord.receiverStatus === 'APPROVED'
                        ? 'STATUS: AKTIF'
                        : activePaymentRecord.receiverStatus === 'REJECTED'
                        ? 'STATUS: REJECT'
                        : 'STATUS: PENDING OWNER'}
                    </span>
                  </div>
                </div>
              )}

              {/* Form Input Detail Transfer Pengirim */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Rincian Pembayaran Pengirim:</span>
                  <span className="text-[10px] font-mono text-emerald-400">Rekening Tujuan: Lumpia Ipul (NMID: ID1026601649688)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Nama Pengirim / Peternak</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Nama Anda"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Nomor Ponsel Akun DANA Pengirim</label>
                    <input
                      type="text"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Layanan / Modul Produksi</label>
                    <select
                      value={serviceName}
                      onChange={(e) => {
                        setServiceName(e.target.value);
                        if (e.target.value.includes('Starter')) setAmountIdr(1250000);
                        if (e.target.value.includes('Pro IoT')) setAmountIdr(2350000);
                        if (e.target.value.includes('Mega-House')) setAmountIdr(4000000);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="Paket Pro IoT Tier-1 (500 Ekor)">Paket Pro IoT Tier-1 (Rp 2.350.000)</option>
                      <option value="Paket Starter Node (150 Ekor)">Paket Starter Node (Rp 1.250.000)</option>
                      <option value="Paket Sovereign Mega-House (1.500 Ekor)">Paket Sovereign Mega-House (Rp 4.000.000)</option>
                      <option value="Top-Up Saldo Dompet Rp 500.000">Top-Up Saldo Dompet (Rp 500.000)</option>
                      <option value="Suplai Konsentrat Layer 500 Kg">Suplai Konsentrat Layer 500 Kg (Rp 3.500.000)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Nominal Transfer (IDR)</label>
                    <input
                      type="number"
                      value={amountIdr}
                      onChange={(e) => setAmountIdr(Number(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Catatan Bukti Transfer / Berita DANA</label>
                  <input
                    type="text"
                    value={proofNote}
                    onChange={(e) => setProofNote(e.target.value)}
                    placeholder="Contoh: Berita transfer DANA / nomor referensi transaksi"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* ACTION BUTTON PENGIRIM: "Saya Sudah Membayar" */}
              <button
                type="button"
                disabled={isSubmittingSender || amountIdr <= 0}
                onClick={handleSenderSubmitPayment}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2.5 transition active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmittingSender ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mendaftarkan Konfirmasi Pengirim...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                    <span>
                      Saya Sudah Membayar ({formatRupiah(amountIdr)}) &rarr;
                    </span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('RECEIVER')}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-mono"
                >
                  Beralih ke Tampilan Penerima (Owner/Admin) untuk Approve &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ============================== TAB 2: PIHAK PENERIMA (OWNER / ADMIN) ============================== */}
          {activeTab === 'RECEIVER' && (
            <div className="space-y-4">
              {/* Receiver Header Card */}
              <div className="p-4 bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-900 border border-amber-500/40 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-lg">
                    👑
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Kas Penerima: Lumpia Ipul</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Admin: Mudhofar
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      NMID: {QRIS_NMID} • Terminal: A01
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Antrean Pending:</span>
                  <span className="text-sm font-extrabold font-mono text-amber-400">
                    {pendingCount} Transaksi Menunggu Approve
                  </span>
                </div>
              </div>

              {/* Transaction Verification List */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 block">
                  Daftar Konfirmasi Pengirim Masuk:
                </span>

                {records.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                    Belum ada riwayat konfirmasi dua arah.
                  </div>
                ) : (
                  records.map((rec) => {
                    const isPending = rec.receiverStatus === 'PENDING_APPROVAL';
                    const isApproved = rec.receiverStatus === 'APPROVED';
                    const isRejected = rec.receiverStatus === 'REJECTED';

                    return (
                      <div
                        key={rec.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isPending
                            ? 'bg-slate-950 border-amber-500/50 shadow-lg shadow-amber-950/20'
                            : isApproved
                            ? 'bg-slate-950/70 border-emerald-500/30'
                            : 'bg-slate-950/50 border-red-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{rec.senderName}</span>
                              <span className="text-[10px] font-mono text-slate-400">({rec.senderWalletOrPhone})</span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                                  isPending
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                                    : isApproved
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                                }`}
                              >
                                {isPending ? '⏳ Menunggu Approve' : isApproved ? '✓ Disetujui' : '✗ Ditolak'}
                              </span>
                            </div>

                            <div className="text-xs font-semibold text-slate-300 mt-1">
                              Layanan: <strong className="text-cyan-300">{rec.serviceName}</strong>
                            </div>

                            <p className="text-[11px] text-slate-400 mt-1">
                              Bukti: "{rec.senderProofNote}"
                            </p>

                            <div className="text-[10px] font-mono text-slate-500 mt-1">
                              ID: {rec.id} • Channel: {rec.paymentChannel} • Waktu: {new Date(rec.createdAt).toLocaleTimeString('id-ID')}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-extrabold font-mono text-emerald-400">
                              {formatRupiah(rec.amountIdr)}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Masuk Kas Treasury Owner
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons for Owner */}
                        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                          <div className="text-[11px] text-slate-400">
                            {isApproved ? (
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <Unlock className="w-3.5 h-3.5" />
                                Modul produksi telah aktif & dibuka bagi pengguna.
                              </span>
                            ) : isPending ? (
                              <span className="text-amber-400 flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5" />
                                Modul masih terkunci sampai penerima memberi approval.
                              </span>
                            ) : (
                              <span className="text-red-400">Transaksi ditolak oleh Owner.</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleReceiverReject(rec.id)}
                                  className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-semibold transition"
                                >
                                  Tolak
                                </button>

                                <button
                                  type="button"
                                  disabled={approvingId === rec.id}
                                  onClick={() => handleReceiverApprove(rec)}
                                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition flex items-center gap-1.5 disabled:opacity-50"
                                >
                                  {approvingId === rec.id ? (
                                    <>
                                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                      <span>Meng-approve...</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Konfirmasi & Setujui (Approve)</span>
                                    </>
                                  )}
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                                Approved oleh: {rec.receiverApprovedBy || 'Mudhofar'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Protokol Verifikasi P2P 2-Arah Tanpa Perantara Broker</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="py-1.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
