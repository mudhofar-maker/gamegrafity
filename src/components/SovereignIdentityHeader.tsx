import React from 'react';
import { FarmerIdentity, FarmBalances } from '../types/farm';
import { formatRupiah, formatEth, shortenAddress } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import { Web3WalletButton } from './Web3WalletButton';
import {
  Wallet,
  ShieldCheck,
  Sparkles,
  ArrowDownRight,
  PlusCircle,
  Smartphone,
  Monitor,
  Volume2,
  VolumeX,
  Code2,
  ExternalLink,
  Lock,
  Unlock,
  Scale,
  Globe,
  Award,
  ChevronDown,
  Home,
  User,
  LogOut,
} from 'lucide-react';
import {
  SupportedLanguage,
  SupportedCurrency,
  TRANSLATIONS,
  CURRENCY_RATES,
  formatCustomCurrency,
} from '../utils/i18n';

interface SovereignIdentityHeaderProps {
  farmer: FarmerIdentity;
  balances: FarmBalances;
  onOpenTopUp: () => void;
  onOpenWithdraw: () => void;
  onOpenContractViewer: () => void;
  onOpenEtherscan: () => void;
  onOpenGramasiModal: () => void;
  onToggleSovereignMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  viewMode: 'desktop' | 'mobile';
  onToggleViewMode: () => void;
  lang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  activeCurrency: SupportedCurrency;
  onSelectCurrency: (curr: SupportedCurrency) => void;
  onOpenGlobalOnboarding: () => void;
  onOpenGlobalCoopMap: () => void;
  onOpenGlobalAudit: () => void;
  onOpenOwnerTreasuryModal?: () => void;
  onScrollToCoopSection?: () => void;
  onOpenProfileModal?: () => void;
  onScrollToMultiCoop?: () => void;
  onOpenQrisModal?: () => void;
  onOpenTwoWayConfirmation?: () => void;
  twoWayPendingCount?: number;
  connectedMetaMaskAddress?: string | null;
  onConnectMetaMask?: () => void;
  onDisconnectMetaMask?: () => void;
  metaMaskBalanceEth?: string | null;
  userProfile?: { fullName: string; role: 'owner' | 'peternak' };
  activeFarmerAccount?: { id: string; fullName: string; avatarUrl?: string; role: 'owner' | 'peternak'; status: string; } | null;
  onOpenPersonalDashboard?: () => void;
  onOpenFarmerSwitcher?: () => void;
  onOpenMonetaryDirective?: () => void;
  onOpenAboutModal?: () => void;
  farmerCountryFlag?: string;
  farmerCountryName?: string;
  farmerFlockSize?: number;
  onOpenAuthModal?: () => void;
  authUser?: any;
  onSignOut?: () => void;
  onOpenCertifications?: () => void;
}

export const SovereignIdentityHeader: React.FC<SovereignIdentityHeaderProps> = ({
  farmer,
  balances,
  onOpenTopUp,
  onOpenWithdraw,
  onOpenContractViewer,
  onOpenEtherscan,
  onOpenGramasiModal,
  onToggleSovereignMode,
  soundEnabled,
  onToggleSound,
  viewMode,
  onToggleViewMode,
  lang,
  onSelectLang,
  activeCurrency,
  onSelectCurrency,
  onOpenGlobalOnboarding,
  onOpenGlobalCoopMap,
  onOpenGlobalAudit,
  onOpenOwnerTreasuryModal,
  onScrollToCoopSection,
  onOpenProfileModal,
  onScrollToMultiCoop,
  onOpenQrisModal,
  onOpenTwoWayConfirmation,
  twoWayPendingCount,
  connectedMetaMaskAddress,
  onConnectMetaMask,
  onDisconnectMetaMask,
  metaMaskBalanceEth,
  userProfile,
  activeFarmerAccount,
  onOpenPersonalDashboard,
  onOpenFarmerSwitcher,
  onOpenMonetaryDirective,
  onOpenAboutModal,
  onOpenAuthModal,
  authUser,
  onSignOut,
  onOpenCertifications,
  farmerCountryFlag = '🇮🇩',
  farmerCountryName = 'Indonesia (Genesis Hub)',
  farmerFlockSize = 40,
}) => {
  const isSovereign = farmer.mode === 'sovereign' || farmer.isSmartContractActive;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.id;

  return (
    <div className="space-y-4">
      {/* Brand & Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
            🐔
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-white tracking-wide">
                Gamegrafity Farm
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {t.sovereignBadge}
              </span>
              <span className="text-sm" title={farmerCountryName}>
                {farmerCountryFlag}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* Global Controls & International Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Switcher */}
          <div className="flex items-center rounded-xl bg-slate-800/80 border border-slate-700/60 p-1 text-xs">
            <span className="text-[10px] text-slate-400 px-1 font-semibold">Lang:</span>
            {(['id', 'en', 'es', 'pt', 'zh'] as SupportedLanguage[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  onSelectLang(l);
                  sounds.click();
                }}
                className={`px-1.5 py-0.5 rounded-lg font-mono font-bold transition text-[10px] ${
                  lang === l
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Switch language to ${l.toUpperCase()}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center rounded-xl bg-slate-800/80 border border-slate-700/60 p-1 text-xs">
            <span className="text-[10px] text-slate-400 px-1 font-semibold">Valas:</span>
            {(['IDR', 'USD', 'EUR', 'BRL', 'ETH'] as SupportedCurrency[]).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => {
                  onSelectCurrency(curr);
                  sounds.click();
                }}
                className={`px-1.5 py-0.5 rounded-lg font-mono font-bold transition text-[10px] ${
                  activeCurrency === curr
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Display balances in ${curr}`}
              >
                {CURRENCY_RATES[curr].flag} {curr}
              </button>
            ))}
          </div>

          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* View Mode Toggle (Mobile React Native frame vs Desktop) */}
          <button
            type="button"
            onClick={onToggleViewMode}
            className="py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60 flex items-center gap-1.5 text-xs font-semibold"
            title="Ganti Mode Tampilan"
          >
            {viewMode === 'desktop' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">React Native</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Desktop</span>
              </>
            )}
          </button>

          {/* Timbangan & Logika Bisnis Gramasi Button */}
          <button
            type="button"
            onClick={onOpenGramasiModal}
            className="py-1.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 transition border border-amber-500/30 flex items-center gap-1.5 text-xs font-semibold font-mono"
            title="Buka Kalkulator & Logika Bisnis Gramasi Win-Win"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Gramasi</span>
          </button>

          {/* Sovereign Core Mathematical & Monetary Directive Button */}
          {onOpenMonetaryDirective && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenMonetaryDirective();
              }}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 hover:from-indigo-500/30 hover:to-cyan-500/30 text-cyan-300 transition border border-cyan-500/40 flex items-center gap-1.5 text-xs font-semibold font-mono shadow-sm"
              title="Buka Sovereign Mathematical & Monetary Directive (Hukum Besi Invarian & Infinite Absorption)"
            >
              <span>📐</span>
              <span className="hidden sm:inline">Directive Moneter</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40">
                V_sys &gt; V_harv
              </span>
            </button>
          )}

          {/* Tentang Gamegrafity Farm & Panduan Untung Button */}
          {onOpenAboutModal && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenAboutModal();
              }}
              className="py-1.5 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 transition border border-purple-500/40 flex items-center gap-1.5 text-xs font-semibold font-mono shadow-sm"
              title="Buka Tentang Gamegrafity Farm, Dual-Payout Hub & 4 Langkah Mudah untuk Untung"
            >
              <span>ℹ️</span>
              <span className="hidden sm:inline">Tentang Platform</span>
            </button>
          )}

          {/* Sertifikasi & Legalitas Resmi Platform Button */}
          {onOpenCertifications && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenCertifications();
              }}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 transition border border-emerald-500/40 flex items-center gap-1.5 text-xs font-semibold font-mono shadow-sm"
              title="Buka Dokumen Sertifikasi Resmi (NKV Kementan, Halal BPJPH, ISO 22000/9001, Audit Web3, PSE Kominfo)"
            >
              <span>🎖️</span>
              <span className="hidden sm:inline">Sertifikasi</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40">
                7 Resmi
              </span>
            </button>
          )}

          {/* Smart Contract Source Viewer Button */}
          <button
            type="button"
            onClick={onOpenContractViewer}
            className="py-1.5 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 transition border border-purple-500/30 flex items-center gap-1.5 text-xs font-semibold font-mono"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Contract</span>
          </button>

          {/* Etherscan Explorer Button */}
          <button
            type="button"
            onClick={onOpenEtherscan}
            className="py-1.5 px-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 transition border border-blue-500/30 flex items-center gap-1.5 text-xs font-semibold font-mono"
            title="Buka Etherscan Explorer & Web3 Read/Write Console"
          >
            <span className="font-bold text-blue-400">Ξ</span>
            <span className="hidden md:inline">Etherscan</span>
          </button>

          {/* Kandang Metaverse & Sewa Infrastruktur Quick Button */}
          <button
            type="button"
            onClick={() => {
              if (onScrollToCoopSection) {
                onScrollToCoopSection();
              } else {
                const el = document.getElementById('metaverse-coop-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
              sounds.playClick();
            }}
            className="py-1.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 transition border border-cyan-500/30 flex items-center gap-1.5 text-xs font-semibold font-mono"
            title="Buka Sewa Kandang Metaverse & Monitoring Sensor IoT"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Kandang IoT</span>
          </button>

          {/* Multi-Kandang & Mesin Tetas Quick Button (10 - 6.000 Ekor) */}
          <button
            type="button"
            onClick={() => {
              if (onScrollToMultiCoop) {
                onScrollToMultiCoop();
              } else {
                const el = document.getElementById('multi-coop-manager-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
              sounds.playClick();
            }}
            className="py-1.5 px-3 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 transition border border-indigo-500/30 flex items-center gap-1.5 text-xs font-semibold font-mono"
            title="Buka Manajemen Multi-Kandang & Mesin Tetas (Sovereign Scale)"
          >
            <span>🏗️ Multi-Kandang</span>
          </button>

          {/* Barcode DANA / QRIS Quick Modal Button */}
          {onOpenQrisModal && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenQrisModal();
              }}
              className="py-1.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition border border-rose-500/40 flex items-center gap-1.5 text-xs font-semibold font-mono shadow-sm"
              title="Buka Barcode QRIS / DANA P2P (Lumpia Ipul - NMID ID1026601649688)"
            >
              <span>📲</span>
              <span>QRIS DANA P2P</span>
            </button>
          )}

          {/* Konfirmasi 2-Arah (Pengirim 'Saya Sudah Membayar' & Penerima 'Owner Approve') */}
          {onOpenTwoWayConfirmation && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenTwoWayConfirmation();
              }}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-sky-500/20 hover:from-emerald-500/30 hover:to-sky-500/30 text-emerald-300 transition border border-emerald-500/40 flex items-center gap-1.5 text-xs font-semibold font-mono shadow-sm"
              title="Konfirmasi Dua Arah: Pengirim 'Saya Sudah Membayar' & Penerima 'Owner Approve'"
            >
              <span>🤝</span>
              <span>Konfirmasi 2-Arah</span>
              {twoWayPendingCount !== undefined && twoWayPendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white font-mono text-[9px] font-bold animate-pulse">
                  {twoWayPendingCount}
                </span>
              )}
            </button>
          )}

          {/* Dasbor Personal Peternak Quick Button */}
          {onOpenPersonalDashboard && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenPersonalDashboard();
              }}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 text-purple-200 transition border border-purple-500/50 flex items-center gap-1.5 text-xs font-semibold font-mono shadow-sm"
              title="Buka Dasbor Personal Peternak & Monitoring Produksi Harian Otomatis"
            >
              <span>🧑‍🌾</span>
              <span className="font-bold">Dasbor Personal</span>
              {activeFarmerAccount?.status === 'PENDING_APPROVAL' && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-mono text-[9px] font-bold">
                  PENDING
                </span>
              )}
            </button>
          )}

          {/* Profil Peternak / Switcher Button with Avatar Photo */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              if (onOpenFarmerSwitcher) {
                onOpenFarmerSwitcher();
              } else if (onOpenProfileModal) {
                onOpenProfileModal();
              }
            }}
            className="py-1.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 transition border border-slate-700/80 flex items-center gap-2 text-xs font-semibold font-mono shadow-sm"
            title="Ganti Akun Peternak / Unggah Foto Profil"
          >
            {activeFarmerAccount?.avatarUrl ? (
              <img
                src={activeFarmerAccount.avatarUrl}
                alt={activeFarmerAccount.fullName}
                className="w-5 h-5 rounded-full object-cover border border-purple-400"
              />
            ) : (
              <User className="w-3.5 h-3.5 text-purple-400" />
            )}
            <span>{activeFarmerAccount?.fullName || userProfile?.fullName || 'Mudhofar'}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200 uppercase font-mono">
              {activeFarmerAccount?.role || userProfile?.role || 'owner'}
            </span>
          </button>

          {/* Gmail / Google Auth & Sign Out Button (farmers_users Neon DB) */}
          {authUser ? (
            <div className="flex items-center gap-1 bg-slate-800/90 border border-emerald-500/50 rounded-xl p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenAuthModal?.();
                }}
                className="py-1 px-2.5 hover:bg-slate-700/80 rounded-lg text-slate-200 transition flex items-center gap-2 text-xs font-semibold font-mono"
                title="Kelola Sesi Akun Google (Neon DB farmers_users)"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold border border-emerald-500/40">
                  G
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-[11px] text-white leading-tight truncate max-w-[110px]">
                    {authUser.full_name || authUser.google_email.split('@')[0]}
                  </span>
                  <span className="block text-[9px] text-emerald-400 font-mono leading-tight">
                    Online (Neon DB)
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onSignOut?.();
                }}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                title="Sign Out (Perbarui last_sign_out)"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenAuthModal?.();
              }}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-600/30 to-amber-600/30 hover:from-red-600/40 hover:to-amber-600/40 text-slate-100 transition border border-red-500/40 flex items-center gap-2 text-xs font-bold font-mono shadow-sm"
              title="Sign Up / Sign In dengan Google (Gmail)"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign In (Gmail)</span>
            </button>
          )}

          {/* Real MetaMask Web3 Provider Connect Button */}
          <Web3WalletButton
            account={connectedMetaMaskAddress || null}
            onConnect={onConnectMetaMask || (() => {})}
            onDisconnect={onDisconnectMetaMask}
            onOpenProfile={onOpenProfileModal}
            balanceEth={metaMaskBalanceEth}
          />
        </div>
      </div>

      {/* Global Farmer World Gateway & Readiness Quick Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/40 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-cyan-300 border border-blue-400/30 flex items-center justify-center">
            <Globe className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                World Poultry Sovereign Federation
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Tier-1 Global Ready (Score: 98/100)
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Menerima pendaftaran peternak ayam dari Amerika, Eropa, Brasil, Asia & Afrika dengan W3C DID dan sertifikasi internasional.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Button 1: Onboard Global Farmer */}
          <button
            type="button"
            onClick={onOpenGlobalOnboarding}
            className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs tracking-wide shadow-md shadow-cyan-950/40 flex items-center gap-1.5 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>🌍 {t.globalGatewayBtn}</span>
          </button>

          {/* Button 2: Global Co-op Map */}
          <button
            type="button"
            onClick={onOpenGlobalCoopMap}
            className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition"
          >
            <span>🗺️ {t.globalCoopBtn}</span>
          </button>

          {/* Button 3: Global Readiness Audit */}
          <button
            type="button"
            onClick={onOpenGlobalAudit}
            className="py-1.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-semibold text-xs border border-emerald-500/30 flex items-center gap-1.5 transition"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.globalAuditBtn}</span>
          </button>
        </div>
      </div>

      {/* Identity & Status Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        {/* Left: Active Farmer Identification */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${
              isSovereign
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 ring-2 ring-purple-500/20'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isSovereign ? '⛓️' : '🧑‍🌾'}
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>{t.activeFarmer}:</span>
              <span className="text-slate-300">{farmerCountryFlag} {farmerCountryName}</span>
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              {isSovereign ? (
                <>
                  <span className="text-purple-300 font-mono">
                    {shortenAddress(farmer.walletAddress, 4)} ({farmer.name})
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    DID Verified
                  </span>
                </>
              ) : (
                <>
                  <span className="text-white font-semibold">{farmer.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Legacy ID
                  </span>
                </>
              )}
            </div>
            {isSovereign && (
              <div className="text-[11px] font-mono text-slate-400">
                DID: <span className="text-cyan-400">{shortenAddress(farmer.did, 10)}</span> • ENS: <span className="text-purple-300">{farmer.ensName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Identity Migration / Sovereign Mode Toggle */}
        <div className="flex items-center gap-2">
          {!isSovereign ? (
            <button
              type="button"
              onClick={() => {
                sounds.playWeb3Success();
                onToggleSovereignMode();
              }}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-md shadow-purple-950/40 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Beralih ke Sovereign Mode (Desentralisasi Web3)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sovereign Mode Aktif (Nama Legacy Riska Dibersihkan)
              </span>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onToggleSovereignMode();
                }}
                className="text-[10px] font-mono text-slate-500 hover:text-slate-300 underline"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Balances & Quick CTAs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kas Treasury Owner Card */}
        <div className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-amber-400/90 mb-1">
            <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              {t.ownerKas}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Protocol Reserve
            </span>
          </div>

          <div className="text-3xl font-extrabold font-mono text-amber-300 tracking-tight mt-1">
            {formatCustomCurrency(balances.kasTreasuryOwner, activeCurrency)}
          </div>
          {activeCurrency !== 'IDR' && (
            <div className="text-xs font-mono text-slate-400 mt-0.5">
              ≈ {formatRupiah(balances.kasTreasuryOwner)}
            </div>
          )}

          <p className="text-[11px] text-slate-400 mt-2">
            Pemasukan dari pembelian aset & sewa utilitas peternak masuk langsung ke kas treasury owner.
          </p>

          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-amber-500/20">
            <span className="text-[10px] font-mono text-amber-300/80">0xOwner...89D2</span>
            {onOpenOwnerTreasuryModal && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenOwnerTreasuryModal();
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40 transition flex items-center gap-1 shadow-sm"
              >
                <span>Kelola & Cairkan Kas &rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* Saldo Dompet Saya Card */}
        <div className="bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
            <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              {t.myWalletBalance}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {formatEth(balances.ethBalance)}
            </span>
          </div>

          <div className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight mt-1">
            {formatCustomCurrency(balances.saldoDompetSaya, activeCurrency)}
          </div>
          {activeCurrency !== 'IDR' && (
            <div className="text-xs font-mono text-slate-400 mt-0.5">
              ≈ {formatRupiah(balances.saldoDompetSaya)}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>Saldo On-Chain ETH:</span>
            <span className="font-mono text-purple-300 font-bold">
              {formatEth(balances.ethBalance, 4)} (~{formatCustomCurrency(balances.ethBalance * 49600000, activeCurrency)})
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Callout Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Top-Up QRIS / DANA */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onOpenTopUp();
          }}
          className="group p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-500 hover:bg-slate-850 transition text-left shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-sm">
                {t.topUpBtn}
              </span>
            </div>
            <span className="text-emerald-400 text-xs font-mono group-hover:translate-x-1 transition-transform">
              &rarr;
            </span>
          </div>
          <p className="text-xs text-slate-400 pl-11">
            {t.topUpSub}
          </p>
        </button>

        {/* Tarik Saldo (Withdraw / Pencairan) */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onOpenWithdraw();
          }}
          className="group p-4 rounded-2xl bg-slate-900/90 border border-sky-500/40 hover:border-sky-500 hover:bg-slate-850 transition text-left shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 group-hover:scale-105 transition-transform">
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-sm">
                {t.withdrawBtn}
              </span>
            </div>
            <span className="text-sky-400 text-xs font-mono group-hover:translate-x-1 transition-transform">
              &rarr;
            </span>
          </div>
          <p className="text-xs text-slate-400 pl-11">
            {t.withdrawSub}
          </p>
        </button>

        {/* Barcode DANA / QRIS Merchant Callout */}
        {onOpenQrisModal && (
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenQrisModal();
            }}
            className="group p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/50 hover:border-rose-400 hover:bg-slate-850 transition text-left shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 group-hover:scale-105 transition-transform flex items-center justify-center font-bold text-base shadow-sm">
                  📲
                </div>
                <div>
                  <span className="font-bold text-white text-sm block">
                    Barcode QRIS / DANA
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">
                    LUMPIA IPUL (NMID A01)
                  </span>
                </div>
              </div>
              <span className="text-rose-400 text-xs font-mono group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </div>
            <p className="text-xs text-slate-400 pl-11">
              Scan barcode nasional untuk top-up & transfer P2P langsung
            </p>
          </button>
        )}
      </div>
    </div>
  );
};
