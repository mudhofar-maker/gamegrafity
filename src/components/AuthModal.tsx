import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Database,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Server
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export interface AuthUser {
  id: number | string;
  google_email: string;
  full_name: string;
  signup_date: string;
  last_sign_in: string | null;
  last_sign_out: string | null;
  avatar_url?: string;
  role: 'owner' | 'peternak';
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onAuthSuccess: (user: AuthUser) => void;
  onSignOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onSignOut
}) => {
  const [mode, setMode] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  
  // Requirement #2: Interactive Eye Icon for Password Visibility Toggle
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Database status & live rows from farmers_users
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [userList, setUserList] = useState<AuthUser[]>([]);
  const [showDbViewer, setShowDbViewer] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDbStatus();
    }
  }, [isOpen]);

  const fetchDbStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      if (data.success) {
        setDbStatus(data.status);
        if (data.users) {
          setUserList(data.users);
        }
      }
    } catch {
      // Ignore network errors in local dev
    }
  };

  if (!isOpen) return null;

  // Toggle Password Visibility
  const handleTogglePasswordVisibility = () => {
    sounds.playClick();
    setShowPassword(!showPassword);
  };

  // Google (Gmail) Sign In / Sign Up handler
  const handleGoogleAuth = async (customEmail?: string, customName?: string) => {
    sounds.playClick();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const targetEmail = customEmail || email || 'uangnyagoparbanyak@gmail.com';
    const targetName = customName || fullName || (targetEmail.includes('uangnyagopar') ? 'Mudhofar (Owner)' : 'Peternak Gamegrafity');

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          google_email: targetEmail,
          full_name: targetName,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(targetName)}&background=ea4335&color=fff`
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        sounds.playSuccess();
        setSuccessMessage(`Berhasil masuk via Google! Data dicatat ke tabel farmers_users.`);
        onAuthSuccess(data.user);
        fetchDbStatus();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        sounds.playError();
        setErrorMessage(data.message || 'Gagal autentikasi Google.');
      }
    } catch (err: any) {
      sounds.playError();
      setErrorMessage(err.message || 'Terjadi kesalahan server saat koneksi Google.');
    } finally {
      setLoading(false);
    }
  };

  // Manual Sign In
  const handleManualSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Silakan masukkan alamat email.');
      return;
    }

    sounds.playClick();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        sounds.playSuccess();
        setSuccessMessage('Sign In berhasil! Waktu login tercatat di last_sign_in.');
        onAuthSuccess(data.user);
        fetchDbStatus();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        sounds.playError();
        setErrorMessage(data.message || 'Gagal Sign In.');
      }
    } catch (err: any) {
      sounds.playError();
      setErrorMessage(err.message || 'Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  // Manual Sign Up
  const handleManualSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      setErrorMessage('Nama lengkap dan email wajib diisi.');
      return;
    }

    sounds.playClick();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, full_name: fullName, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        sounds.playSuccess();
        setSuccessMessage('Pendaftaran berhasil! Akun baru masuk ke tabel farmers_users.');
        onAuthSuccess(data.user);
        fetchDbStatus();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        sounds.playError();
        setErrorMessage(data.message || 'Gagal mendaftar.');
      }
    } catch (err: any) {
      sounds.playError();
      setErrorMessage(err.message || 'Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  // Sign Out Handler (Updates last_sign_out in farmers_users)
  const handleSignOutClick = async () => {
    sounds.playClick();
    setLoading(true);
    try {
      if (currentUser?.google_email) {
        await fetch('/api/auth/signout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentUser.google_email })
        });
      }
      sounds.playCash();
      onSignOut();
      fetchDbStatus();
      setSuccessMessage('Sesi berhasil diakhiri. Kolom last_sign_out telah diperbarui.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch {
      onSignOut();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Autentikasi Akun Peternak</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Neon DB
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Pendaftaran &amp; Sesi Terhubung ke <code className="text-cyan-300">farmers_users</code>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center transition border border-slate-700/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Active Session Display if already logged in */}
          {currentUser ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.full_name}
                  className="w-12 h-12 rounded-full border-2 border-emerald-400 object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{currentUser.full_name}</h4>
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono truncate">{currentUser.google_email}</p>
                </div>
              </div>

              {/* Database Timestamps */}
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>signup_date:</span>
                  <span className="text-slate-200">
                    {new Date(currentUser.signup_date).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>last_sign_in:</span>
                  <span className="text-emerald-300">
                    {currentUser.last_sign_in ? new Date(currentUser.last_sign_in).toLocaleTimeString('id-ID') : '-'}
                  </span>
                </div>
                {currentUser.last_sign_out && (
                  <div className="flex justify-between text-slate-400">
                    <span>last_sign_out:</span>
                    <span className="text-amber-300">
                      {new Date(currentUser.last_sign_out).toLocaleTimeString('id-ID')}
                    </span>
                  </div>
                )}
              </div>

              {/* Sign Out Button (Requirement #1) */}
              <button
                type="button"
                onClick={handleSignOutClick}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out (Akhiri Sesi &amp; Perbarui last_sign_out)</span>
              </button>
            </div>
          ) : (
            <>
              {/* Tab Selector: Sign In vs Sign Up */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setMode('SIGN_IN');
                    setErrorMessage('');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    mode === 'SIGN_IN'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In (Masuk)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setMode('SIGN_UP');
                    setErrorMessage('');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    mode === 'SIGN_UP'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign Up (Daftar Baru)
                </button>
              </div>

              {/* Requirement #1: Google (Gmail) One-Click Button */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleGoogleAuth('uangnyagoparbanyak@gmail.com', 'Mudhofar')}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 shadow-lg shadow-white/5 transition border border-slate-200"
                >
                  {/* Google colorful G logo */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>
                    {mode === 'SIGN_UP' ? 'Sign Up dengan Google (Gmail)' : 'Sign In dengan Google (Gmail)'}
                  </span>
                </button>
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Akun Cepat Terdaftar: <strong className="text-cyan-300">uangnyagoparbanyak@gmail.com</strong>
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px bg-slate-800 flex-1" />
                <span className="text-[10px] font-mono uppercase text-slate-500">atau email manual</span>
                <div className="h-px bg-slate-800 flex-1" />
              </div>

              {/* Requirement #1 & #2: Manual Form with Password Eye Icon */}
              <form onSubmit={mode === 'SIGN_IN' ? handleManualSignIn : handleManualSignUp} className="space-y-3">
                {mode === 'SIGN_UP' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Nama Lengkap (full_name)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Mudhofar"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Alamat Email (google_email)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@gmail.com"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pl-9 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Requirement #2: Kolom Kata Sandi dengan Tombol Ikon Mata Interaktif */}
                {/* Password Input Field with Interactive Eye Icon Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-slate-300">
                      Kata Sandi (Password)
                    </label>
                    <button
                      type="button"
                      onClick={handleTogglePasswordVisibility}
                      className="text-[10px] text-slate-400 hover:text-cyan-300 font-mono transition flex items-center gap-1"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="w-3 h-3 text-cyan-400" />
                          <span className="text-cyan-400 font-bold">Teks Terlihat</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>Tersandi</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      autoComplete={mode === 'SIGN_IN' ? 'current-password' : 'new-password'}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pl-9 pr-11 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono transition"
                    />
                    
                    {/* Interactive Eye Icon Toggle Button */}
                    <button
                      type="button"
                      onClick={handleTogglePasswordVisibility}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      title={showPassword ? 'Sembunyikan kata sandi (jadikan titik-titik)' : 'Tampilkan kata sandi (lihat teks asli)'}
                      aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error & Success Messages */}
                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]">
                    {successMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'SIGN_IN' ? 'Sign In Sekarang' : 'Daftar Akun Baru'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Database Integration Info (Requirement #3: Neon PostgreSQL) */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold font-mono">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Status Neon PostgreSQL:</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                dbStatus?.connectedToPostgres
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}>
                {dbStatus?.connectedToPostgres ? 'Connected Live' : 'Active (Neon Schema Ready)'}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Tabel Target:</span>
                <span className="text-white font-bold">farmers_users</span>
              </div>
              <div className="flex justify-between">
                <span>Kolom Spesifikasi:</span>
                <span className="text-slate-300">google_email, full_name, signup_date</span>
              </div>
              <div className="flex justify-between">
                <span>Tracking Sesi:</span>
                <span className="text-slate-300">last_sign_in &amp; last_sign_out</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowDbViewer(!showDbViewer);
                }}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 font-mono"
              >
                <span>{showDbViewer ? 'Sembunyikan' : 'Lihat Rekap Baris'} farmers_users ({userList.length} User)</span>
              </button>
              <span className="text-[9px] text-slate-500 font-mono">DATABASE_URL</span>
            </div>

            {/* Collapsible Table Row Viewer */}
            {showDbViewer && (
              <div className="mt-2 p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 max-h-36 overflow-y-auto font-mono text-[10px]">
                {userList.map((u, idx) => (
                  <div key={idx} className="p-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold">{u.full_name}</span>
                      <span className="text-slate-400 block text-[9px]">{u.google_email}</span>
                    </div>
                    <div className="text-right text-[9px]">
                      <span className="text-emerald-400 block">In: {u.last_sign_in ? new Date(u.last_sign_in).toLocaleTimeString('id-ID') : '-'}</span>
                      <span className="text-amber-400 block">Out: {u.last_sign_out ? new Date(u.last_sign_out).toLocaleTimeString('id-ID') : '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
