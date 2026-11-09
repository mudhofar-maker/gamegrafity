import React, { useState, useEffect, useRef } from 'react';
import {
  FarmerAccount,
  BrokerAbsorptionRecord,
  EggGrade
} from '../types/farm';
import { formatRupiah } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import {
  User,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Camera,
  Layers,
  Thermometer,
  Droplets,
  Wind,
  Zap,
  TrendingUp,
  Truck,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Package,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

interface PersonalFarmerDashboardProps {
  farmer: FarmerAccount | null;
  onRefresh: () => void;
  onSwitchFarmerRequest: () => void;
  currentUserRole?: 'owner' | 'peternak';
  onOpenOwnerSettlement?: () => void;
  onOpenQrisModal?: () => void;
}

export const PersonalFarmerDashboard: React.FC<PersonalFarmerDashboardProps> = ({
  farmer,
  onRefresh,
  onSwitchFarmerRequest,
  currentUserRole = 'owner',
  onOpenOwnerSettlement,
  onOpenQrisModal,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState(farmer?.fullName || '');
  const [phone, setPhone] = useState(farmer?.phone || '');
  const [email, setEmail] = useState(farmer?.email || '');
  const [location, setLocation] = useState(farmer?.location || '');
  const [walletAddress, setWalletAddress] = useState(farmer?.walletAddress || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(farmer?.avatarUrl || null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Broker offtake state
  const [isOfftaking, setIsOfftaking] = useState(false);
  const [offtakeEggsInput, setOfftakeEggsInput] = useState<number>(0);
  const [offtakeGrade, setOfftakeGrade] = useState<EggGrade>('GRADE_B');
  const [offtakeSuccessMessage, setOfftakeSuccessMessage] = useState<string | null>(null);

  // Approval processing state (for Owner quick-action)
  const [isApproving, setIsApproving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state when farmer prop updates
  useEffect(() => {
    if (farmer) {
      setFullName(farmer.fullName);
      setPhone(farmer.phone);
      setEmail(farmer.email);
      setLocation(farmer.location);
      setWalletAddress(farmer.walletAddress);
      setAvatarPreview(farmer.avatarUrl);
      setOfftakeEggsInput(farmer.liveProduction?.accumulatedEggsReady || 100);
    }
  }, [farmer]);

  if (!farmer) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
          <User className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Memuat Dasbor Personal Peternak...</h3>
        <p className="text-sm max-w-md mx-auto mb-4">
          Silakan hubungkan akun peternak atau pilih peternak terdaftar untuk memuat kandang personal.
        </p>
        <button
          onClick={onSwitchFarmerRequest}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition inline-flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          <span>Pilih Akun Peternak</span>
        </button>
      </div>
    );
  }

  // Handle Photo Upload (Convert file to base64 Data URL)
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      sounds.playError();
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatarPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Save updated profile to backend
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch(`/api/farmer-accounts/${farmer.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          location,
          walletAddress,
          avatarUrl: avatarPreview || farmer.avatarUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        sounds.playSuccess();
        setSaveMessage('✅ Profil dan foto berhasil diperbarui!');
        setIsEditingProfile(false);
        onRefresh();
      } else {
        setSaveMessage(`❌ Gagal: ${data.message}`);
      }
    } catch (err: any) {
      console.error(err);
      setSaveMessage('❌ Terjadi kesalahan jaringan saat menyimpan profil.');
    } finally {
      setIsSaving(false);
    }
  };

  // Owner Quick-Approve button handler (for P2P workflow testing)
  const handleQuickApprove = async () => {
    setIsApproving(true);
    try {
      const res = await fetch(`/api/farmer-accounts/${farmer.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        sounds.playSuccess();
        setOfftakeSuccessMessage(`Persetujuan Berhasil! TxHash: ${data.txHash}`);
        onRefresh();
      } else {
        sounds.playError();
      }
    } catch (err) {
      console.error(err);
      sounds.playError();
    } finally {
      setIsApproving(false);
    }
  };

  // Handle offtake harvest selling to broker
  const handleExecuteOfftake = async () => {
    if (offtakeEggsInput <= 0) {
      sounds.playError();
      return;
    }
    setIsOfftaking(true);
    setOfftakeSuccessMessage(null);

    try {
      const res = await fetch(`/api/farmer-accounts/${farmer.id}/offtake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eggCount: offtakeEggsInput,
          grade: offtakeGrade,
          brokerName: 'CV Mitra Unggas Pinsar Jawa Timur'
        })
      });
      const data = await res.json();
      if (data.success) {
        sounds.playSuccess();
        setOfftakeSuccessMessage(data.message);
        onRefresh();
      } else {
        sounds.playError();
      }
    } catch (err) {
      console.error(err);
      sounds.playError();
    } finally {
      setIsOfftaking(false);
    }
  };

  // Days left calculation for active lease
  const daysRemaining = farmer.rentalPackage?.expiresAt
    ? Math.max(0, Math.ceil((farmer.rentalPackage.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)))
    : 30;

  const isPending = farmer.status === 'PENDING_APPROVAL';

  return (
    <div className="space-y-6">
      {/* ================= TOP HEADER: PERSONAL IDENTITY & PHOTO ================= */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Avatar with Upload and Personal Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Profile Photo with interactive Camera button */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-indigo-400/50 shadow-xl bg-slate-800 flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={farmer.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="text-indigo-400 flex flex-col items-center">
                    <User className="w-12 h-12" />
                    <span className="text-[10px] font-mono mt-1">No Photo</span>
                  </div>
                )}
              </div>

              {/* Upload Photo Button Overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg border border-purple-300/40 transition hover:scale-110"
                title="Unggah Foto Profil Baru"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            {/* Farmer Name, Role, Location, Wallet */}
            <div className="text-center sm:text-left space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>{farmer.fullName}</span>
                </h1>

                {/* Status Badge */}
                {isPending ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    <span>MENUNGGU PERSETUJUAN OWNER</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>KANDANG AKTIF (SOVEREIGN)</span>
                  </span>
                )}

                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono uppercase">
                  {farmer.role === 'owner' ? '👑 Owner' : '🧑‍🌾 Peternak Lapangan'}
                </span>
              </div>

              <p className="text-slate-300 text-sm flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span>📍 {farmer.location}</span>
                <span>•</span>
                <span>📱 {farmer.phone}</span>
                <span>•</span>
                <span>📧 {farmer.email}</span>
              </p>

              {/* Wallet Address Display */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-mono">Web3 Node:</span>
                <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-lg border border-purple-500/30 truncate max-w-[220px] sm:max-w-[320px]">
                  {farmer.walletAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isEditingProfile ? 'Tutup Edit Profil' : 'Edit Profil Mandiri'}</span>
            </button>

            <button
              onClick={onSwitchFarmerRequest}
              className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-2 transition"
              title="Ganti ke Peternak Lain untuk Memverifikasi Isolasi Data"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
              <span>Ganti Akun / Daftar Baru</span>
            </button>

            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Perbarui Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* INLINE PROFILE EDIT FORM (Expanded when user clicks Edit) */}
        {isEditingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn"
          >
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">No. WhatsApp / Ponsel</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Lokasi Peternakan</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Alamat Dompet Web3</label>
              <input
                type="text"
                value={walletAddress}
                onChange={e => setWalletAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-purple-500 outline-none"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-4 flex items-center justify-between gap-4 pt-2">
              <div className="text-xs">
                {saveMessage && <span className="font-semibold">{saveMessage}</span>}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Foto & Data'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* ================= REQUIREMENT 2: P2P APPROVAL GATEWAY ================= */}
      {isPending && (
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/60 border-2 border-dashed border-amber-500/50 rounded-3xl p-6 shadow-xl relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    Menunggu Persetujuan Owner (P2P Approval Gateway)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
                    PENDING
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Pendaftaran akun dan sewa kandang <span className="text-amber-300 font-semibold">{farmer.rentalPackage?.name}</span> telah tercatat di sistem. Sesuai arsitektur dua arah, status kandang berstatus <span className="text-amber-300 font-mono">Pending</span> hingga Owner menekan tombol <span className="text-white font-semibold">Approve</span> pada panel P2P Settlement.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
                  <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                    💳 Biaya Sewa: <strong className="text-emerald-400">{formatRupiah(farmer.rentalPackage?.monthlyCostIdr || 1250000)}</strong>
                  </span>
                  <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                    📝 Catatan: <em>{farmer.rentalPackage?.paymentProofNote || 'Transfer QRIS Lumpia Ipul'}</em>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action for Approval (Owner or Test Mode) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
              {onOpenQrisModal && (
                <button
                  onClick={onOpenQrisModal}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span>📲 Cek Barcode QRIS</span>
                </button>
              )}

              {/* Owner Instant Approve Action */}
              <button
                onClick={handleQuickApprove}
                disabled={isApproving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition disabled:opacity-50"
                title="Tekan untuk Menyetujui Akun Peternak sebagai Owner (Membuka Akses Dasbor & Memasukkan 100% Sewa ke Treasury)"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isApproving ? 'Memproses Persetujuan...' : '⚡ Owner: Setujui & Aktifkan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= REQUIREMENT 3: AUTOMATED PERSONAL DASHBOARD ================= */}
      {/* 1. RENTAL PACKAGE & LIVESTOCK POPULATION CALCULATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Lease Status & Countdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
                Paket Sewa Aktif
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {farmer.rentalPackage?.contractCode || 'COOP-IOT-TIER1'}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {farmer.rentalPackage?.name || 'Paket Pro IoT Closed-House'}
              </h3>
              <p className="text-xs text-slate-400">
                Infrastruktur modern dengan sensor otomatisasi iklim & isolasi biosecurity level 4.
              </p>
            </div>

            {/* Countdown Lease Bar */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Masa Sewa Berjalan
                </span>
                <span className="text-cyan-300 font-bold font-mono">
                  {daysRemaining} Hari Tersisa / 30 Hari
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, (daysRemaining / 30) * 100))}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-right">
                100% biaya sewa ({formatRupiah(farmer.rentalPackage?.monthlyCostIdr || 1250000)}) dialirkan ke Kolam Cadangan Kas Treasury.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Biaya Sewa Bulanan:</span>
            <span className="text-emerald-400 font-bold font-mono text-sm">
              {formatRupiah(farmer.rentalPackage?.monthlyCostIdr || 1250000)}
            </span>
          </div>
        </div>

        {/* Center & Right: Population Calculation Module */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Kalkulasi Populasi Ternak ({farmer.liveProduction?.population || 500} Ekor)
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Kapasitas Penuh 100%
              </span>
            </div>

            {/* Population Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Roosters / Jantan */}
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-xs text-slate-400 block mb-1">Jantan Pemacek</span>
                <span className="text-xl font-extrabold text-amber-400 font-mono">
                  {farmer.liveProduction?.roosters || 25}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Rasio 1:19</span>
              </div>

              {/* Hens / Betina */}
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-xs text-slate-400 block mb-1">Betina Petelur</span>
                <span className="text-xl font-extrabold text-purple-400 font-mono">
                  {farmer.liveProduction?.hens || 475}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Induk Aktif</span>
              </div>

              {/* Layer Produktif */}
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-xs text-slate-400 block mb-1">Layer Produktif</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">
                  {farmer.liveProduction?.cohorts?.layerCount || 450}
                </span>
                <span className="text-[10px] text-emerald-400/80 block mt-0.5">Bertelur Tiap Hari</span>
              </div>

              {/* DOC & Pullet */}
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-xs text-slate-400 block mb-1">DOC / Pullet Dara</span>
                <span className="text-xl font-extrabold text-cyan-400 font-mono">
                  {(farmer.liveProduction?.cohorts?.docCount || 0) + (farmer.liveProduction?.cohorts?.pulletCount || 25)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Siklus Regenerasi</span>
              </div>
            </div>
          </div>

          {/* Feed & Expected Yield Bottom Strip */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
              <span className="text-slate-400">Konsumsi Pakan Harian:</span>
              <span className="text-amber-300 font-bold font-mono">
                {farmer.liveProduction?.dailyFeedKg || 55} kg / hari (110g/ekor)
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
              <span className="text-slate-400">Target Panen Harian (HD 88%):</span>
              <span className="text-cyan-300 font-bold font-mono">
                {farmer.liveProduction?.dailyEggsExpected || 440} Butir / hari
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AUTOMATED DAILY PRODUCTION MONITORING MODULE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">
                Monitoring Aktivitas Produksi Harian (Otomatis 24/7)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Data telemetri sensor IoT closed-house dan akumulasi produksi telur berjalan secara mandiri dan real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              SISTEM OTOMATIS BERJALAN
            </span>
          </div>
        </div>

        {/* Live Metrics: Egg Production Counter + Feed + Warehouse Ready */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Running Daily Egg Yield Counter */}
          <div className="bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              Telur Terproduksi Hari Ini
            </span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono animate-pulse">
                {farmer.liveProduction?.dailyProductionRunningEggs || 388}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {farmer.liveProduction?.dailyEggsExpected || 440} target
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      ((farmer.liveProduction?.dailyProductionRunningEggs || 388) /
                        (farmer.liveProduction?.dailyEggsExpected || 440)) *
                        100
                    )
                  )}%`
                }}
              />
            </div>
            <p className="text-[11px] text-amber-300/80">
              Hen-Day Productivity: {Math.round(
                ((farmer.liveProduction?.dailyProductionRunningEggs || 388) /
                  (farmer.liveProduction?.hens || 475)) *
                  100
              )}%
            </p>
          </div>

          {/* Accumulated Eggs Ready for Broker Absorption */}
          <div className="bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30 rounded-2xl p-5 relative overflow-hidden">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">
              Telur Siap Serap Broker (Ready Pool)
            </span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                {farmer.liveProduction?.accumulatedEggsReady || 120}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Butir (~{Number((((farmer.liveProduction?.accumulatedEggsReady || 120) * 62.5) / 1000).toFixed(2))} kg)
              </span>
            </div>
            <p className="text-[11px] text-purple-300/80 mb-3">
              Kompensasi kas langsung cair saat diserap offtaker dengan harga Pinsar terkunci.
            </p>
            <button
              onClick={() => {
                setOfftakeEggsInput(farmer.liveProduction?.accumulatedEggsReady || 120);
                const el = document.getElementById('broker-offtake-action-box');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Serap ke Broker Sekarang</span>
            </button>
          </div>

          {/* Farmer Cumulative Earnings */}
          <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              Total Pencairan Kas Panen Peternak
            </span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mb-2">
              {formatRupiah(farmer.liveProduction?.totalEarningsIdr || 3643750)}
            </div>
            <p className="text-[11px] text-slate-300">
              Total Panen: <strong className="text-white font-mono">{farmer.liveProduction?.totalHarvestedAllTime || 2200}</strong> butir ({farmer.liveProduction?.totalGramasiKgAllTime || 137.5} kg bobot riil)
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] flex justify-between items-center text-slate-400">
              <span>Saldo Kas Tersedia:</span>
              <span className="text-white font-mono font-bold">
                {formatRupiah(farmer.liveProduction?.walletBalanceIdr || 850000)}
              </span>
            </div>
          </div>
        </div>

        {/* Real-Time IoT Closed-House Environment Sensors */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Telemetri Sensor IoT Kandang (Auto Closed-House)
              </h4>
            </div>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              Target Ideal: 24.0°C | RH 60-65%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Temperature */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Suhu Udara</span>
                <span className="text-base font-bold text-white font-mono">
                  {farmer.liveProduction?.iotSensor?.tempC || 24.2}°C
                </span>
                <span className="text-[10px] text-emerald-400 block font-medium">Optimal</span>
              </div>
            </div>

            {/* Humidity */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Kelembaban RH</span>
                <span className="text-base font-bold text-white font-mono">
                  {farmer.liveProduction?.iotSensor?.humidityRh || 65}%
                </span>
                <span className="text-[10px] text-emerald-400 block font-medium">Stabil</span>
              </div>
            </div>

            {/* Ammonia */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Gas Amonia</span>
                <span className="text-base font-bold text-white font-mono">
                  {farmer.liveProduction?.iotSensor?.ammoniaPpm || 6.8} PPM
                </span>
                <span className="text-[10px] text-emerald-400 block font-medium">&lt; 10 PPM Aman</span>
              </div>
            </div>

            {/* Exhaust Fan & Cooling */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Exhaust Fan</span>
                <span className="text-base font-bold text-white font-mono">
                  {farmer.liveProduction?.iotSensor?.exhaustRpm || 1450} RPM
                </span>
                <span className="text-[10px] text-cyan-400 block font-medium">Cooling Pad ON</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. REKAPITULASI HASIL PANEN & PENYERAPAN OLEH BROKER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">
                Rekapitulasi Hasil Panen & Catatan Penyerapan Broker
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Setiap butir telur hasil panen diserap offtaker dengan harga beli terkunci (Pinsar Standard) yang menjamin surplus margin dan kepastian pasar bagi peternak.
            </p>
          </div>
        </div>

        {/* Action Box: Jual Panen ke Broker Offtaker */}
        <div id="broker-offtake-action-box" className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-800 to-indigo-950/50 border border-purple-500/40 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Algoritma Serap Panen Tanpa Batas Fisik (Infinite Absorption)
            </span>
            <span className="text-xs text-emerald-400 font-semibold font-mono">
              H_broker: Rp 25.776 / kg &gt; HPP (Rp 19.700)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono">
            <span className="text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Hukum Besi: V_system ({formatRupiah(13950000)}) ≥ (1 + 0.15) · V_harvest
            </span>
            <span className="text-emerald-400 font-semibold">
              Jaminan Serap 100% Tanpa Penolakan Kas • 0% Mortalitas Ternak
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Jumlah Butir Telur</label>
              <input
                type="number"
                min={10}
                value={offtakeEggsInput}
                onChange={e => setOfftakeEggsInput(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-purple-500 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Estimasi Bobot: {Number(((offtakeEggsInput * 62.5) / 1000).toFixed(2))} kg (62.5g/butir)
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Kualitas Grade</label>
              <select
                value={offtakeGrade}
                onChange={e => setOfftakeGrade(e.target.value as EggGrade)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 outline-none"
              >
                <option value="GRADE_B">Grade B (Standar Pasar 62.5g)</option>
                <option value="GRADE_A">Grade A (Super Omega 68.0g)</option>
                <option value="GRADE_C">Grade C (Industri 55.0g)</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Offtaker: CV Mitra Unggas Pinsar Jawa Timur
              </span>
            </div>

            <div>
              <button
                onClick={handleExecuteOfftake}
                disabled={isOfftaking || offtakeEggsInput <= 0}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Truck className="w-4 h-4" />
                <span>
                  {isOfftaking ? 'Memproses Penyerapan...' : `Cairkan Kas (${formatRupiah(Math.round(((offtakeEggsInput * 62.5) / 1000) * 26500))})`}
                </span>
              </button>
            </div>
          </div>

          {offtakeSuccessMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{offtakeSuccessMessage}</span>
            </div>
          )}
        </div>

        {/* Absorption History Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Batch ID</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Jumlah Telur</th>
                <th className="py-3 px-4">Bobot Riil</th>
                <th className="py-3 px-4">Harga / Kg</th>
                <th className="py-3 px-4">Total Payout</th>
                <th className="py-3 px-4">Broker Offtaker</th>
                <th className="py-3 px-4">Status & On-Chain Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {farmer.brokerAbsorptions && farmer.brokerAbsorptions.length > 0 ? (
                farmer.brokerAbsorptions.map(record => (
                  <tr key={record.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-white">{record.batchCode}</td>
                    <td className="py-3 px-4 text-slate-400">{record.date}</td>
                    <td className="py-3 px-4 text-amber-300 font-bold">{record.eggCount} butir</td>
                    <td className="py-3 px-4 text-slate-300">{record.weightKg} kg</td>
                    <td className="py-3 px-4 text-slate-400">{formatRupiah(record.pricePerKg)}/kg</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{formatRupiah(record.payoutIdr)}</td>
                    <td className="py-3 px-4 text-slate-300 font-sans">{record.brokerName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          {record.status}
                        </span>
                        <span
                          className="text-[10px] text-purple-400 truncate max-w-[90px] cursor-pointer hover:underline"
                          title="Klik untuk menyalin TxHash"
                          onClick={() => {
                            if (record.txHash) {
                              navigator.clipboard?.writeText(record.txHash);
                              sounds.playClick();
                            }
                          }}
                        >
                          {record.txHash ? record.txHash.slice(0, 8) + '...' : '-'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    Belum ada riwayat penyerapan panen untuk peternak ini. Tekan tombol "Serap Panen ke Broker" di atas untuk mencairkan kas perdana!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
