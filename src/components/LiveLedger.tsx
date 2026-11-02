import React, { useState } from 'react';
import { LedgerEntry } from '../types/farm';
import { sounds } from '../utils/soundEffects';
import { Terminal, Download, Filter, Search, ArrowUpRight, ArrowDownLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LiveLedgerProps {
  entries: LedgerEntry[];
  onOpenEtherscanByHash?: (txHash: string) => void;
}

export const LiveLedger: React.FC<LiveLedgerProps> = ({ entries, onOpenEtherscanByHash }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredEntries = entries.filter((item) => {
    const matchesFilter = filterType === 'ALL' || item.category === filterType;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.actor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExportJson = () => {
    sounds.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gamegrafity_ledger_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Terminal className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Indeks Pembelian & Penjualan
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Ledger
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail transaksi otomatis, audit log biosekuriti & smart contract settlement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            Export Ledger
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi ledger (TOP-UP, Mesin Tetas, DANA, Web3)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'TOPUP', label: 'Top-Up' },
            { id: 'PURCHASE', label: 'Pembelian' },
            { id: 'CYCLE', label: 'Siklus' },
            { id: 'WITHDRAW_P2P', label: 'DANA P2P' },
            { id: 'WITHDRAW_WEB3', label: 'Web3 ETH' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterType(tab.id);
                sounds.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Terminal Log Stream */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 max-h-72 overflow-y-auto font-mono text-xs space-y-2">
        {filteredEntries.length === 0 ? (
          <div className="py-8 text-center text-slate-600">
            Tidak ada catatan log yang sesuai dengan filter.
          </div>
        ) : (
          filteredEntries.map((item) => {
            const isError = !item.isSuccess;
            const isWeb3 = item.category === 'WITHDRAW_WEB3';
            const isTopUp = item.category === 'TOPUP';

            return (
              <div
                key={item.id}
                className={`py-1.5 px-2.5 rounded-lg border transition-all flex flex-wrap items-start justify-between gap-2 ${
                  isError
                    ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                    : isWeb3
                    ? 'bg-purple-950/20 border-purple-900/40 text-purple-200'
                    : isTopUp
                    ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-start gap-2 max-w-[85%]">
                  <span className="text-slate-500 select-none text-[11px] whitespace-nowrap">
                    [{item.timestamp}]
                  </span>

                  <div>
                    <span
                      className={`font-bold mr-1.5 ${
                        isError
                          ? 'text-rose-400'
                          : isWeb3
                          ? 'text-purple-400'
                          : isTopUp
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {item.title}:
                    </span>
                    <span className="text-slate-200">{item.description}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto shrink-0">
                  {item.txHash && onOpenEtherscanByHash && (
                    <button
                      type="button"
                      onClick={() => onOpenEtherscanByHash(item.txHash!)}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition flex items-center gap-1 font-mono"
                    >
                      Etherscan
                    </button>
                  )}
                  {item.p2pRefId && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono">
                      {item.p2pRefId}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between px-1">
        <span>Log Ledger Tersinkronisasi Otomatis</span>
        <span>Total Entri: {entries.length} baris</span>
      </div>
    </div>
  );
};
