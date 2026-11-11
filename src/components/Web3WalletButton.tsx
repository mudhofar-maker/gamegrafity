import React, { useState } from 'react';
import { Wallet, Check, Copy, ExternalLink, LogOut, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';
import { shortenAddress } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import { OWNER_METAMASK_ADDRESS } from '../config/web3Config';

interface Web3WalletButtonProps {
  account: string | null;
  isConnecting?: boolean;
  onConnect: () => void;
  onDisconnect?: () => void;
  onOpenProfile?: () => void;
  compact?: boolean;
  className?: string;
  balanceEth?: string | null;
  chainId?: number | null;
  onSwitchNetwork?: (targetChainId: number) => void;
}

export const Web3WalletButton: React.FC<Web3WalletButtonProps> = ({
  account,
  isConnecting = false,
  onConnect,
  onDisconnect,
  onOpenProfile,
  compact = false,
  className = '',
  balanceEth,
  chainId,
  onSwitchNetwork,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwner = Boolean(
    account && account.toLowerCase() === OWNER_METAMASK_ADDRESS.toLowerCase()
  );

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      sounds.playClick();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(false);
    sounds.playClick();
    onDisconnect?.();
  };

  // If connected, show connected badge with dropdown
  if (account) {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setDropdownOpen(!dropdownOpen);
          }}
          className={`group flex items-center gap-2 rounded-xl border transition-all duration-200 shadow-sm ${
            isOwner
              ? 'bg-amber-950/40 border-amber-500/50 hover:border-amber-400 text-amber-200'
              : 'bg-slate-900/90 border-purple-500/40 hover:border-purple-400 text-purple-200'
          } ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-xs font-mono font-semibold'}`}
          title={`Dompet Terhubung: ${account}`}
        >
          {/* Status Indicator */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>

          {/* MetaMask Fox SVG */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 32 32" fill="none">
            <path
              d="M29.28 12.84l-2.04-7.53a1.2 1.2 0 00-.77-.8l-6.73-2.3a1.2 1.2 0 00-1.02.14l-5.6 4.1-5.6-4.1a1.2 1.2 0 00-1.02-.14l-6.73 2.3a1.2 1.2 0 00-.77.8l-2.04 7.53a1.2 1.2 0 00.37 1.23l12.44 11.2a1.2 1.2 0 001.62 0l12.44-11.2a1.2 1.2 0 00.38-1.23z"
              fill="#E17726"
            />
            <path
              d="M10.12 14.1l-4.5-3.32-1.92 5.06 6.42-1.74zm11.76 0l4.5-3.32 1.92 5.06-6.42-1.74z"
              fill="#E2761B"
            />
            <path
              d="M6.28 19.34l3.84 2.86-3.84-2.86zm19.44 0l-3.84 2.86 3.84-2.86z"
              fill="#D5BFB2"
            />
          </svg>

          {/* Address Display */}
          <span className="font-mono tracking-wide">{shortenAddress(account)}</span>

          {/* Balance Preview if available */}
          {balanceEth && (
            <span className="hidden md:inline-block px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-emerald-400 font-mono">
              {balanceEth} ETH
            </span>
          )}

          {/* Owner Badge */}
          {isOwner && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/40 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              Owner
            </span>
          )}

          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white transition" />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 text-xs font-mono space-y-1">
              <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-between mb-1">
                  <span>METAMASK EVM</span>
                  <span className="text-emerald-400">Terhubung</span>
                </div>
                <div className="text-[11px] text-slate-200 break-all select-all font-mono">
                  {account}
                </div>
                {balanceEth && (
                  <div className="mt-1 text-[11px] text-emerald-400 font-bold">
                    Saldo: {balanceEth} ETH
                  </div>
                )}
              </div>

              {/* Network Status & Switcher */}
              <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>JARINGAN AKTIF</span>
                  <span className={`font-bold ${
                    chainId === 137 ? 'text-purple-400' : chainId === 42161 ? 'text-sky-400' : 'text-blue-400'
                  }`}>
                    {chainId === 137 ? '🟣 Polygon PoS' : chainId === 42161 ? '🔵 Arbitrum One' : chainId === 1 ? '🔷 Ethereum' : `Chain #${chainId || '137'}`}
                  </span>
                </div>
                {onSwitchNetwork && (
                  <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onSwitchNetwork(137);
                      }}
                      className={`py-1 px-1.5 rounded text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                        chainId === 137 ? 'bg-purple-600/40 text-purple-200 border border-purple-500/60' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      🟣 Polygon
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onSwitchNetwork(42161);
                      }}
                      className={`py-1 px-1.5 rounded text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                        chainId === 42161 ? 'bg-sky-600/40 text-sky-200 border border-sky-500/60' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      🔵 Arbitrum
                    </button>
                  </div>
                )}
              </div>

              {/* Action: Copy Address */}
              <button
                type="button"
                onClick={handleCopy}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 transition text-left"
              >
                <span className="flex items-center gap-2">
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  Salin Alamat Dompet
                </span>
                {copied && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              {/* Action: Explorer Link */}
              <a
                href={
                  chainId === 137
                    ? `https://polygonscan.com/address/${account}`
                    : chainId === 42161
                    ? `https://arbiscan.io/address/${account}`
                    : `https://etherscan.io/address/${account}`
                }
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 transition text-left"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                Lihat di {chainId === 137 ? 'PolygonScan' : chainId === 42161 ? 'Arbiscan' : 'Etherscan'}
              </a>

              {/* Action: User Profile Settings */}
              {onOpenProfile && (
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-purple-300 transition text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Pengaturan Profil & Peran
                </button>
              )}

              {/* Action: Disconnect */}
              {onDisconnect && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-950/40 text-red-400 hover:text-red-300 transition text-left border-t border-slate-800"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  Putuskan Koneksi MetaMask
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Not connected state: Sleek "Hubungkan MetaMask" button
  return (
    <button
      type="button"
      onClick={() => {
        sounds.playClick();
        onConnect();
      }}
      disabled={isConnecting}
      className={`group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-purple-600 hover:from-orange-500 hover:via-amber-500 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-md shadow-orange-950/40 transition-all active:scale-95 disabled:opacity-60 border border-orange-400/30 ${
        compact ? 'px-3 py-1.5' : 'px-3.5 py-2'
      } ${className}`}
      title="Hubungkan dompet Web3 MetaMask (EVM Provider)"
    >
      {/* MetaMask Fox SVG */}
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 32 32" fill="none">
        <path
          d="M29.28 12.84l-2.04-7.53a1.2 1.2 0 00-.77-.8l-6.73-2.3a1.2 1.2 0 00-1.02.14l-5.6 4.1-5.6-4.1a1.2 1.2 0 00-1.02-.14l-6.73 2.3a1.2 1.2 0 00-.77.8l-2.04 7.53a1.2 1.2 0 00.37 1.23l12.44 11.2a1.2 1.2 0 001.62 0l12.44-11.2a1.2 1.2 0 00.38-1.23z"
          fill="#FFF"
        />
      </svg>
      <span>{isConnecting ? 'Menghubungkan...' : 'Hubungkan MetaMask'}</span>
    </button>
  );
};
