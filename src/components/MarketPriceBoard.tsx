import React, { useState } from 'react';
import { MarketPriceItem } from '../types/farm';
import { formatRupiah, formatNumber } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import {
  TrendingUp,
  TrendingDown,
  Globe,
  Radio,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface MarketPriceBoardProps {
  prices: MarketPriceItem[];
  onRefreshPrices: () => void;
  onOpenWithdrawWithTargetPrice?: () => void;
}

export const MarketPriceBoard: React.FC<MarketPriceBoardProps> = ({
  prices,
  onRefreshPrices,
  onOpenWithdrawWithTargetPrice,
}) => {
  const [filterScope, setFilterScope] = useState<'ALL' | 'INDONESIA' | 'DUNIA'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPrices = prices.filter((item) => {
    const matchesScope = filterScope === 'ALL' || item.marketScope === filterScope;
    const matchesSearch =
      searchQuery === '' ||
      item.commodityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.regionOrExchange.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceBenchmark.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesScope && matchesSearch;
  });

  const getSignalBadge = (signal: MarketPriceItem['timingSignal']) => {
    switch (signal) {
      case 'SELL_NOW':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            WAKTU JUAL TERBAIK
          </span>
        );
      case 'HOLD_PEAK':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            TAHAN PANEN (TREN NAIK)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-semibold">
            HARGA WAJAR (STABIL)
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Globe className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Indeks Pasaran Telur &amp; Ayam Petelur (Indonesia &amp; Dunia)
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Real-Time Feed
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Panduan harga resmi harian agar peternak tidak asal jual atau dibodohi perantara broker
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onRefreshPrices();
            }}
            className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Update Harga Pasar</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'ALL', label: 'Semua Pasaran' },
            { id: 'INDONESIA', label: '🇮🇩 Domestik Indonesia (Pinsar / Bapanas)' },
            { id: 'DUNIA', label: '🌍 Pasar Global (CME / USDA / Euro)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterScope(tab.id as any);
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                filterScope === tab.id
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari komoditas (Telur, Blitar, CME, Afkir)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
      </div>

      {/* Grid of Live Commodity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredPrices.map((item) => {
          const isPositive = item.change24hPercent >= 0;
          return (
            <div
              key={item.id}
              className="bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 transition group flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                        {item.marketScope === 'INDONESIA' ? '🇮🇩 INDONESIA' : '🌍 GLOBAL'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{item.regionOrExchange}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1 group-hover:text-emerald-300 transition">
                      {item.commodityName}
                    </h4>
                  </div>
                  <div>{getSignalBadge(item.timingSignal)}</div>
                </div>

                {/* Price Display */}
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold font-mono text-white tracking-tight">
                      {item.currency === 'IDR' ? formatRupiah(item.price) : `$${item.price.toFixed(2)}`}
                    </span>
                    <span className="text-xs font-sans text-slate-400 ml-1">/ {item.unit}</span>
                  </div>

                  <div className={`flex items-center gap-1 font-mono text-xs font-bold ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{isPositive ? `+${item.change24hPercent}%` : `${item.change24hPercent}%`}</span>
                  </div>
                </div>

                {/* 24h High / Low & Benchmark */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                  <div>
                    <span>Rentang 24j: </span>
                    <span className="text-slate-200">
                      {item.currency === 'IDR' ? formatRupiah(item.low24h) : `$${item.low24h}`} -{' '}
                      {item.currency === 'IDR' ? formatRupiah(item.high24h) : `$${item.high24h}`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span>Sumber Acuan: </span>
                    <span className="text-slate-300 font-medium">{item.sourceBenchmark}</span>
                  </div>
                </div>
              </div>

              {/* Recommendation Note for Farmers */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed flex items-start gap-1.5">
                <span className="text-amber-400 font-bold shrink-0">📌 Saran Peternak:</span>
                <span>{item.timingNote}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Insight */}
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
          <ShieldCheck className="w-4 h-4" />
          Data Terverifikasi Pinsar &amp; Bapanas RI • Diperbarui Secara Berkala
        </span>
        {onOpenWithdrawWithTargetPrice && (
          <button
            type="button"
            onClick={onOpenWithdrawWithTargetPrice}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 font-mono"
          >
            Eksekusi Pencairan Hasil Panen Sesuai Harga Acuan &rarr;
          </button>
        )}
      </div>
    </div>
  );
};
