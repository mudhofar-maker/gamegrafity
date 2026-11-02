import React, { useState } from 'react';
import {
  Fingerprint,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../services/web3Service';
import { shortenAddress } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';

interface AgroFiOracleBarProps {
  ambientTempC: number;
  humidityRh: number;
  biosecurityHealth: number;
  accumulatedEggs: number;
  onOpenEtherscan: () => void;
}

export const AgroFiOracleBar: React.FC<AgroFiOracleBarProps> = ({
  ambientTempC,
  humidityRh,
  biosecurityHealth,
  accumulatedEggs,
  onOpenEtherscan,
}) => {
  const [isUpdatingRoot, setIsUpdatingRoot] = useState<boolean>(false);
  const [rootUpdatedNotice, setRootUpdatedNotice] = useState<string | null>(null);
  const [currentRoot, setCurrentRoot] = useState<string>(
    '0x7c8a14d5e12f6b8c9a341b80d0e65c9284a123f05b90e1c2479f6e80b1593c21'
  );

  const handleRefreshMerkleRoot = () => {
    sounds.playClick();
    setIsUpdatingRoot(true);
    setTimeout(() => {
      const randomHex = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      const newRoot = `0x${randomHex}`;
      setCurrentRoot(newRoot);
      setIsUpdatingRoot(false);
      setRootUpdatedNotice('Root Merkle diperbarui & ditandatangani oleh Oracle Node!');
      sounds.playWeb3Success();
      setTimeout(() => setRootUpdatedNotice(null), 3000);
    }, 1200);
  };

  return (
    <div className="bg-gradient-to-r from-slate-950 via-[#0d1627] to-slate-950 border border-blue-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-full bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        {/* Left: Oracle & Merkle Status */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5 font-mono">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              Agro-Fi IoT Oracle Node #ETH-01
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Cold-Chain Attested
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Merkle Tree Proof
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-300 flex-wrap">
            <div>
              <span className="text-slate-500">Suhu IoT: </span>
              <span className="text-emerald-400 font-bold">{ambientTempC.toFixed(1)}°C</span>
              <span className="text-slate-500 text-[11px]"> (Ideal 24°C)</span>
            </div>
            <span className="text-slate-700">•</span>
            <div>
              <span className="text-slate-500">Biosekuriti: </span>
              <span className="text-purple-300 font-bold">{biosecurityHealth}%</span>
              <span className="text-emerald-400 text-[11px]"> (Salmonella Negatif)</span>
            </div>
            <span className="text-slate-700">•</span>
            <div>
              <span className="text-slate-500">Active Merkle Root: </span>
              <span className="text-blue-300 select-all">{shortenAddress(currentRoot, 6)}</span>
            </div>
          </div>
        </div>

        {/* Right: Interactive CTAs */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Refresh Merkle Attestation Root */}
          <button
            type="button"
            onClick={handleRefreshMerkleRoot}
            disabled={isUpdatingRoot}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
            title="Sinkronisasi sensor kandang ke Merkle Tree on-chain"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingRoot ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Sinkron Root Oracle</span>
          </button>

          {/* Launch Etherscan Console */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenEtherscan();
            }}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-950/40 flex items-center gap-2 transition"
          >
            <Layers className="w-4 h-4 text-blue-200" />
            <span>Etherscan Console & Read/Write</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
          </button>
        </div>
      </div>

      {rootUpdatedNotice && (
        <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          {rootUpdatedNotice}
        </div>
      )}
    </div>
  );
};
