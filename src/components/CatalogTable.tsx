import React, { useState } from 'react';
import { CatalogItem } from '../types/farm';
import { formatRupiah } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import {
  Bird,
  Wheat,
  ShieldAlert,
  Cpu,
  MapPin,
  Home,
  Zap,
  Stethoscope,
  Thermometer,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface CatalogTableProps {
  items: CatalogItem[];
  saldoDompetSaya: number;
  onPurchase: (item: CatalogItem, quantity: number) => void;
  onOpenTopUp: () => void;
  highlightTargetId?: string;
}

export const CatalogTable: React.FC<CatalogTableProps> = ({
  items,
  saldoDompetSaya,
  onPurchase,
  onOpenTopUp,
  highlightTargetId,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<CatalogItem | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bird':
        return <Bird className="w-4 h-4 text-amber-400" />;
      case 'Wheat':
        return <Wheat className="w-4 h-4 text-yellow-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-emerald-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'MapPin':
        return <MapPin className="w-4 h-4 text-rose-400" />;
      case 'Home':
        return <Home className="w-4 h-4 text-indigo-400" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'Stethoscope':
        return <Stethoscope className="w-4 h-4 text-red-400" />;
      case 'Thermometer':
        return <Thermometer className="w-4 h-4 text-teal-400" />;
      default:
        return <ShoppingCart className="w-4 h-4 text-slate-400" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Livestock':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Hulu Suplai':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
      case 'Preventif':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Infrastruktur':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Sewa Bulanan':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'Utilitas Harian':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Medis Kritis':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const categories = ['ALL', ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems =
    filterCategory === 'ALL' ? items : items.filter((i) => i.category === filterCategory);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header section with Unlimited Digital Supply Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShoppingCart className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">
              Katalog Suplai Hulu & Utilitas Peternak
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Unlimited Digital Supply (24/7 Zero Stock-Out)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Suplai 5 strain bibit pullet siap telur (Hy-Line, Lohmann, Isa, Hisex, Arab/Lokal), pakan konsentrat 21%, vaksin, listrik, dan AC conditioner selalu tersedia 24/7.
          </p>
        </div>

        {/* Categories pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setFilterCategory(cat);
                sounds.playClick();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterCategory === cat
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/60'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Unlimited Supply Architecture Callout */}
      <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 border border-emerald-500/20 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-emerald-400 font-bold font-mono">⚡ 24/7 LOGIKA SUPLAI:</span>
          <span className="text-slate-300">
            Seluruh item memiliki jaminan suplai tanpa batas (anti-stockout) dengan replenishment otomatis langsung dari pabrik & offtaker induk.
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
          <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">SLA Dispatch: Instan &lt; 15s</span>
          <span className="bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">Kas Alokasi: Treasury Owner</span>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/90 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
              <th className="py-3 px-4">Nama Suplai / Aset</th>
              <th className="py-3 px-4">Kategori & Status Stok</th>
              <th className="py-3 px-4">Harga Satuan</th>
              <th className="py-3 px-4 text-right">Aksi Pembelian (24/7)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-sans">
            {filteredItems.map((item) => {
              const canAfford = saldoDompetSaya >= item.price;
              const isTargeted = highlightTargetId === `catalog-${item.id}`;
              return (
                <tr
                  key={item.id}
                  id={`catalog-${item.id}`}
                  className={`transition-all duration-300 group ${
                    isTargeted
                      ? 'bg-amber-500/15 border-2 border-amber-500 ring-2 ring-amber-500/40'
                      : 'hover:bg-slate-850/50'
                  }`}
                >
                  {/* Nama Aset */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border transition ${
                        isTargeted ? 'bg-amber-500/25 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 group-hover:border-slate-700'
                      }`}>
                        {getIcon(item.iconName)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs flex items-center gap-2">
                          {isTargeted && (
                            <span className="text-amber-400 font-mono font-extrabold animate-pulse flex items-center gap-1 text-[11px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                              ➔ PRIORITAS #1
                            </span>
                          )}
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-normal">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {item.description}
                        </p>
                        
                        {/* Pre-Order batch and continuous quota status */}
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {item.continuousQuotaStatus || 'Stok Selalu Tersedia (Unlimited 24/7)'}
                          </span>
                          {item.replenishmentSchedule && (
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700">
                              🕒 {item.replenishmentSchedule}
                            </span>
                          )}
                        </div>

                        {item.businessLogicNote && (
                          <div className="text-[10px] text-emerald-400/90 font-mono mt-1.5 flex items-center gap-1 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/40">
                            <span className="text-emerald-400">💡</span>
                            <span>{item.businessLogicNote}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Kategori & Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span
                        className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border inline-block ${getCategoryBadgeClass(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                      <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                        <span className="text-[8px]">●</span> Zero Stock-Out
                      </div>
                    </div>
                  </td>

                  {/* Harga Satuan */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-white text-xs">
                      {formatRupiah(item.price)}
                      <span className="text-slate-400 text-[11px] font-normal ml-1">
                        {item.unit}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Kas Owner +{formatRupiah(item.price)}
                    </div>
                  </td>

                  {/* Aksi Pembelian - Guaranteed Never Stock-Out */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {canAfford ? (
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          onPurchase(item, 1);
                        }}
                        className="py-1.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-95 inline-flex items-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {item.actionText} Instan
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playError();
                          onPurchase(item, 1);
                        }}
                        className="py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs transition inline-flex items-center gap-1.5"
                        title="Saldo kurang. Klik untuk Top-Up otomatis dan selesaikan pembelian."
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        {item.actionText} (Top-Up Saldo)
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1 px-1">
        <span>
          Menampilkan <strong>{filteredItems.length}</strong> suplai & utilitas • Semua berstatus <strong>Unlimited Digital Stock</strong>
        </span>
        <button
          type="button"
          onClick={onOpenTopUp}
          className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline flex items-center gap-1"
        >
          Isi Saldo Tambahan via QRIS / DANA &rarr;
        </button>
      </div>
    </div>
  );
};
