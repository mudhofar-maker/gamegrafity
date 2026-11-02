import React from 'react';
import { FarmerIdentity, FarmBalances } from '../types/farm';
import { formatRupiah, formatEth, shortenAddress } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
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
  farmerCountryFlag?: string;
  farmerCountryName?: string;
  farmerFlockSize?: number;
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

      {/* Dual Quick Action Callout Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
      </div>
    </div>
  );
};
