import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, User, Wallet, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { shortenAddress } from '../utils/formatters';
import { OWNER_METAMASK_ADDRESS } from '../config/web3Config';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWalletAddress?: string | null;
  onProfileUpdated?: (profile: { fullName: string; role: 'owner' | 'peternak'; walletAddress: string | null }) => void;
  onConnectMetaMask?: () => Promise<string | null>;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentWalletAddress,
  onProfileUpdated,
  onConnectMetaMask,
}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(() => {
    return currentWalletAddress || localStorage.getItem('gamegrafity_profile_wallet') || null;
  });
  const [fullName, setFullName] = useState<string>(() => {
    return localStorage.getItem('gamegrafity_profile_name') || 'Mudhofar';
  });
  const [role, setRole] = useState<'owner' | 'peternak'>(() => {
    return (localStorage.getItem('gamegrafity_profile_role') as 'owner' | 'peternak') || 'owner';
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync with currentWalletAddress if updated externally
  useEffect(() => {
    if (currentWalletAddress) {
      setWalletAddress(currentWalletAddress);
    }
  }, [currentWalletAddress]);

  // Cek apakah dompet sudah terhubung saat komponen dimuat
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum && !walletAddress) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        })
        .catch(() => {});
    }
  }, [walletAddress]);

  if (!isOpen) return null;

  const handleConnectWallet = async () => {
    sounds.playClick();
    if (onConnectMetaMask) {
      const addr = await onConnectMetaMask();
      if (addr) {
        setWalletAddress(addr);
        return;
      }
    }

    if (typeof window === 'undefined' || !window.ethereum) {
      alert('MetaMask tidak terdeteksi! Silakan buka melalui peramban Web3 atau pasang ekstensi MetaMask.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        sounds.playWeb3Success();
      }
    } catch (error) {
      console.error('Gagal menghubungkan dompet:', error);
      sounds.playError();
    }
  };

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      sounds.playClick();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simpan ke localStorage terlebih dahulu untuk persistensi instan di peramban
    try {
      localStorage.setItem('gamegrafity_profile_name', fullName);
      localStorage.setItem('gamegrafity_profile_role', role);
      if (walletAddress) {
        localStorage.setItem('gamegrafity_profile_wallet', walletAddress);
      }
    } catch (_) {}

    // Simpan ke API backend / database
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          role: role,
          wallet_address: walletAddress,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        sounds.playCash();
        onProfileUpdated?.({ fullName, role, walletAddress });
        setTimeout(() => {
          setSaveSuccess(false);
          onClose();
        }, 1500);
      } else {
        alert('Gagal menyimpan profil ke database server.');
      }
    } catch (err) {
      console.error('Kesalahan jaringan:', err);
      // Fallback offline success via localStorage
      setSaveSuccess(true);
      onProfileUpdated?.({ fullName, role, walletAddress });
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } finally {
      setIsSaving(false);
    }
  };

  const isOwnerWallet = Boolean(
    walletAddress && walletAddress.toLowerCase() === OWNER_METAMASK_ADDRESS.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl overflow-hidden text-slate-200">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-amber-500 to-cyan-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-950/50">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>Pengaturan Profil & Dompet</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Web3 EVM
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Kelola identitas berdaulat dan alamat dompet MetaMask Anda
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

        {/* Form Body */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              placeholder="Contoh: Mudhofar"
              required
            />
          </div>

          {/* Peran / Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Peran Akses Sistem
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'owner' | 'peternak')}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
            >
              <option value="owner">Owner / Pengelola Utama (Kas Treasury Protocol)</option>
              <option value="peternak">Peternak Lapangan (Sovereign Node Multi-Kandang)</option>
            </select>
          </div>

          {/* Status Dompet Web3 MetaMask */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                Alamat Dompet Web3 (MetaMask)
              </label>
              {isOwnerWallet && (
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/40">
                  Verified Owner
                </span>
              )}
            </div>

            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 break-all select-all flex items-center justify-between gap-2">
              <span>{walletAddress ? walletAddress : 'Belum ada dompet MetaMask terhubung'}</span>
              {walletAddress && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                    title="Salin alamat dompet"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`https://etherscan.io/address/${walletAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 transition"
                    title="Lihat di Etherscan"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {walletAddress ? (
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Terhubung ke Jaringan EVM
                </span>
                <button
                  type="button"
                  onClick={handleConnectWallet}
                  className="text-xs text-purple-400 hover:text-purple-300 underline font-mono"
                >
                  Ganti Akun
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConnectWallet}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl text-xs tracking-wide shadow-md shadow-orange-950/40 flex items-center justify-center gap-2 transition"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M29.28 12.84l-2.04-7.53a1.2 1.2 0 00-.77-.8l-6.73-2.3a1.2 1.2 0 00-1.02.14l-5.6 4.1-5.6-4.1a1.2 1.2 0 00-1.02-.14l-6.73 2.3a1.2 1.2 0 00-.77.8l-2.04 7.53a1.2 1.2 0 00.37 1.23l12.44 11.2a1.2 1.2 0 001.62 0l12.44-11.2a1.2 1.2 0 00.38-1.23z"
                    fill="#FFF"
                  />
                </svg>
                <span>Hubungkan MetaMask Sekarang</span>
              </button>
            )}
          </div>

          {/* Konfigurasi Penerima Kas Owner */}
          <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-[11px] text-amber-200/90 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Direct Owner Treasury Contract Routing:
            </div>
            <p className="font-mono text-[10px] text-amber-400/80 break-all">
              {OWNER_METAMASK_ADDRESS}
            </p>
            <p className="text-[10px] text-slate-400">
              Semua transaksi global on-chain dan sewa kandang terarah langsung ke alamat ini tanpa perantara pihak ketiga.
            </p>
          </div>

          {/* Success Banner */}
          {saveSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Profil dan pengaturan dompet berhasil disimpan ke sistem!</span>
            </div>
          )}

          {/* Tombol Simpan */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-950/50 transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <span>Menyimpan ke Sistem...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Simpan Perubahan Profil</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
