import React, { useState } from 'react';
import { X, Code2, Copy, Check, FileCheck, Layers, Terminal, Sparkles, ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, CONTRACT_NAME, SOLIDITY_SOURCE_CODE, CONTRACT_ABI } from '../services/web3Service';
import { sounds } from '../utils/soundEffects';

interface SmartContractViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartContractViewer: React.FC<SmartContractViewerProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedAbi, setCopiedAbi] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'SOURCE' | 'ABI' | 'ARCHITECTURE'>('SOURCE');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(SOLIDITY_SOURCE_CODE);
    sounds.playClick();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyAbi = () => {
    navigator.clipboard.writeText(JSON.stringify(CONTRACT_ABI, null, 2));
    sounds.playClick();
    setCopiedAbi(true);
    setTimeout(() => setCopiedAbi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                Smart Contract & Arsitektur DApp
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Solidity 0.8.24
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Alamat Kontrak: <code className="text-purple-300 font-mono">{CONTRACT_ADDRESS}</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="px-6 bg-slate-950/70 border-b border-slate-800 flex gap-2">
          <button
            onClick={() => { setActiveTab('SOURCE'); sounds.playClick(); }}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'SOURCE'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Solidity Source ({CONTRACT_NAME}.sol)
          </button>
          <button
            onClick={() => { setActiveTab('ABI'); sounds.playClick(); }}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'ABI'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Contract ABI (Ethers.js Ready)
          </button>
          <button
            onClick={() => { setActiveTab('ARCHITECTURE'); sounds.playClick(); }}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'ARCHITECTURE'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Arsitektur & Penghapusan ID Legacy
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'SOURCE' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Verified Contract • License: MIT • EVM Compatible</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono font-semibold"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Tersalin' : 'Salin Kode Solidity'}
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[460px] overflow-y-auto">
                <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {SOLIDITY_SOURCE_CODE}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'ABI' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Antarmuka Biner Aplikasi untuk Node.js & React Native Ethers.js:</span>
                <button
                  type="button"
                  onClick={handleCopyAbi}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono font-semibold"
                >
                  {copiedAbi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAbi ? 'Tersalin' : 'Salin ABI'}
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[460px] overflow-y-auto">
                <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                  {JSON.stringify(CONTRACT_ABI, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'ARCHITECTURE' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-2">
                <h4 className="font-bold text-sm text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Pembersihan Identitas Legacy & Sovereign Mode
                </h4>
                <p>
                  Sesuai instruksi: Saat peternak beralih ke Smart Contract Web3, nama legacy (seperti Riska)
                  secara permanen dibersihkan dari state blockchain dan digantikan oleh identitas kriptografi:
                </p>
                <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-purple-200">
                  <li>Identitas Peternak: Alamat Ethereum Terverifikasi (Checksummed)</li>
                  <li>Sovereign DID: did:pkh:eip155:1:0x...</li>
                  <li>ENS: sovereign.gamegrafity.eth</li>
                  <li>Settlement: Zero-broker direct ETH transfer & P2P DANA escrow</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-sm text-white">Spesifikasi Teknologi:</h4>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div>• Frontend: React 19 + TypeScript + Vite</div>
                  <div>• Mobile View: React Native Responsive Simulator</div>
                  <div>• Backend: Node.js Express 4.x Verification Proxy</div>
                  <div>• Web3: Ethers.js v6 + Etherscan Verification</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
