import React, { useState, useEffect, useRef } from 'react';
import { FarmerAccount, FarmerAccountStatus } from '../types/farm';
import { formatRupiah } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import {
  User,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  X,
  Camera,
  Layers,
  ShieldCheck,
  Building,
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface FarmerAccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFarmerId: string;
  onSelectFarmer: (id: string) => void;
  onAccountsUpdated: () => void;
  onOpenQrisModal?: () => void;
}

export const FarmerAccountSwitcherModal: React.FC<FarmerAccountSwitcherModalProps> = ({
  isOpen,
  onClose,
  activeFarmerId,
  onSelectFarmer,
  onAccountsUpdated,
  onOpenQrisModal
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'register'>('list');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Blitar, Jawa Timur');
  const [packageId, setPackageId] = useState('pkg-pro-iot-tier1');
  const [paymentProofNote, setPaymentProofNote] = useState('Transfer QRIS Lumpia Ipul (NMID ID1026601649688)');
  const [paymentChannel, setPaymentChannel] = useState('DANA_P2P');
  const [walletAddress, setWalletAddress] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch accounts from backend
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/farmer-accounts');
      const data = await res.json();
      if (data.success && data.accounts) {
        setAccounts(data.accounts);
      }
    } catch (err) {
      console.error('Failed to load accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Photo Select in Registration Form
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran foto maksimal 8 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit new farmer registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Nama lengkap dan nomor telepon wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setRegisterSuccessMsg(null);

    try {
      const res = await fetch('/api/farmer-accounts/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          location,
          avatarUrl: avatarPreview,
          packageId,
          paymentProofNote,
          paymentChannel,
          walletAddress
        })
      });

      const data = await res.json();
      if (data.success) {
        sounds.playSuccess();
        setRegisterSuccessMsg(data.message);
        await fetchAccounts();
        onAccountsUpdated();
        // Switch to the newly created account so the user can inspect the PENDING state
        if (data.account?.id) {
          onSelectFarmer(data.account.id);
        }
        setTimeout(() => {
          setActiveTab('list');
          setRegisterSuccessMsg(null);
        }, 2200);
      } else {
        alert(`Gagal: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mendaftarkan peternak.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Approve action for Owner directly on account card
  const handleApproveAccount = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/farmer-accounts/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        sounds.playSuccess();
        alert(`🎉 Sukses! Akun ${name} telah disetujui Owner dan berstatus AKTIF.`);
        await fetchAccounts();
        onAccountsUpdated();
      } else {
        alert(`Gagal: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyetujui akun.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Manajemen Pengguna & Isolasi Data Peternak</span>
              </h2>
              <p className="text-xs text-slate-400">
                Pilih profil peternak aktif atau daftarkan anggota baru dengan alur persetujuan Owner (P2P).
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/80 px-6">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-3 px-4 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
              activeTab === 'list'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Daftar Akun Peternak ({accounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`py-3 px-4 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
              activeTab === 'register'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Daftar Peternak Baru & Unggah Foto</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'list' ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300 flex items-center justify-between">
                <span>
                  🛡️ <strong>Isolasi Multi-Tenant:</strong> Setiap peternak hanya memiliki akses ke profil, kandang, sensor, dan rekapitulasi panen miliknya sendiri.
                </span>
                {onOpenQrisModal && (
                  <button
                    onClick={onOpenQrisModal}
                    className="text-purple-300 hover:underline shrink-0 text-xs font-semibold ml-3"
                  >
                    Cek Barcode DANA
                  </button>
                )}
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400">
                  <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2" />
                  <span>Memuat daftar peternak...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {accounts.map(acc => {
                    const isCurrent = acc.id === activeFarmerId;
                    const isPending = acc.status === 'PENDING_APPROVAL';

                    return (
                      <div
                        key={acc.id}
                        className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          isCurrent
                            ? 'bg-purple-950/40 border-purple-500/60 shadow-lg'
                            : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Avatar Thumbnail */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                            {acc.avatarUrl ? (
                              <img
                                src={acc.avatarUrl}
                                alt={acc.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500">
                                <User className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{acc.fullName}</h4>
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                                {acc.role}
                              </span>

                              {/* Status Tag */}
                              {isPending ? (
                                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  PENDING APPROVAL
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  ACTIVE
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-400">
                              {acc.rentalPackage?.name || 'Paket Kandang'} • {acc.birdsCapacity} Ekor • {acc.location}
                            </p>
                            <p className="text-[11px] font-mono text-purple-300/80 truncate max-w-[260px] sm:max-w-[340px]">
                              {acc.walletAddress}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          {isPending && (
                            <button
                              onClick={() => handleApproveAccount(acc.id, acc.fullName)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                              title="Owner: Setujui P2P untuk Mengaktifkan Dasbor Peternak ini"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>⚡ Approve</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              onSelectFarmer(acc.id);
                              sounds.playClick();
                              onClose();
                            }}
                            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
                              isCurrent
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            }`}
                          >
                            {isCurrent ? 'Sedang Aktif' : 'Pilih Akun Ini'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Register New Farmer Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {registerSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{registerSuccessMsg}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                {/* Photo Preview & Selector */}
                <div className="relative group shrink-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 border-2 border-indigo-400/40 flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-500 flex flex-col items-center">
                        <User className="w-8 h-8" />
                        <span className="text-[9px] font-mono mt-0.5">Pilih Foto</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-purple-600 text-white shadow hover:scale-105 transition"
                    title="Unggah Foto Profil"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-white">Unggah Foto Profil Mandiri</h4>
                  <p className="text-xs text-slate-400">
                    Foto peternak akan langsung tampil di halaman dasbor personal dan kartu sertifikasi sovereign.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 underline"
                  >
                    Pilih File dari Perangkat
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">No. WhatsApp / HP *</label>
                  <input
                    type="text"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="peternak@gamegrafity.id"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Lokasi Peternakan</label>
                  <input
                    type="text"
                    placeholder="Blitar / Kediri / Malang"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pilihan Paket Sewa Kandang</label>
                <select
                  value={packageId}
                  onChange={e => setPackageId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 outline-none font-medium"
                >
                  <option value="pkg-starter-node">Paket Starter Node (150 Ekor Ayam - Rp 1.250.000 / bln)</option>
                  <option value="pkg-pro-iot-tier1">Paket Pro IoT Tier-1 (500 Ekor Ayam - Rp 2.350.000 / bln)</option>
                  <option value="pkg-sovereign-6000">Paket Mega Sovereign (1.500 Ekor Ayam - Rp 5.800.000 / bln)</option>
                </select>
                <p className="text-[11px] text-amber-400/90 mt-1">
                  100% biaya sewa otomatis dialirkan ke Kolam Cadangan Kas Treasury sebagai likuiditas penyangga.
                </p>
              </div>

              {/* Payment Proof / Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kanal Pembayaran</label>
                  <select
                    value={paymentChannel}
                    onChange={e => setPaymentChannel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 outline-none"
                  >
                    <option value="DANA_P2P">DANA P2P (QRIS Lumpia Ipul)</option>
                    <option value="QRIS">QRIS Semua Bank / E-Wallet</option>
                    <option value="BCA">Transfer Bank BCA</option>
                    <option value="WEB3_USDT">Web3 Smart Contract (USDT/ETH)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Catatan Bukti Pembayaran</label>
                  <input
                    type="text"
                    value={paymentProofNote}
                    onChange={e => setPaymentProofNote(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Web3 Address optional */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Alamat Dompet Web3 (Opsional / Otomatis Digenerate)</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={e => setWalletAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-purple-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Status akun awal: <strong className="text-amber-400 font-mono">PENDING APPROVAL</strong>
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40 transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Mendaftarkan Peternak...' : 'Daftar & Minta Persetujuan Owner'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
