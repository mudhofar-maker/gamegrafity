import React from 'react';
import { BiologicalCycle } from '../types/farm';
import { formatNumber, formatRupiah } from '../utils/formatters';
import { IDR_PER_EGG } from '../services/web3Service';
import { sounds } from '../utils/soundEffects';
import { Activity, ShieldCheck, HeartPulse, Sparkles, Zap, Utensils, Egg, Clock, Cpu, Award } from 'lucide-react';

interface FarmVisualizerProps {
  cycle: BiologicalCycle;
  onAdvanceCycle: () => void;
  onOpenWithdraw: () => void;
  onFeedQuick: () => void;
  canAdvance: boolean;
}

export const FarmVisualizer: React.FC<FarmVisualizerProps> = ({
  cycle,
  onAdvanceCycle,
  onOpenWithdraw,
  onFeedQuick,
  canAdvance,
}) => {
  const eggValueIdr = cycle.accumulatedEggs * IDR_PER_EGG;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Top Banner / Biological Phase Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">
              Siklus Biologis Ayam (Real-Time Simulator)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manajemen populasi layer & biosekuriti kandang sovereign otomatis • Hari ke-{cycle.dayCount}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Fase Biologis:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {cycle.phase}
          </span>
        </div>
      </div>

      {/* 24/7 Autopilot Automated Production Notice */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-950 to-teal-950/60 border border-emerald-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300 font-mono">
                Produksi Berjalan Otomatis (24/7 Autopilot)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                Auto-Lay & Auto-Feed
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Aliran telur bertelur live, pakan terisi otomatis dari silo hulu, dan suhu 24°C terjaga tanpa henti. Cukup <strong className="text-cyan-300">Top-Up Awal</strong> & <strong className="text-amber-300">Jual Panen / Tarik Dana (WD) Manual</strong> di akhir.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Status Siklus:</span>
          <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Streaming
          </span>
        </div>
      </div>

      {/* Primary Key Stats Cards Grid (Matching user brief layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Populasi Aktif */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Populasi Aktif</span>
            <span className="text-emerald-400 text-[11px] font-mono">
              {cycle.landPlots * 50} Kapasitas Max
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {formatNumber(cycle.population)} <span className="text-sm font-sans font-normal text-slate-400">Ekor</span>
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span>Rasio:</span>
            <span className="font-mono text-slate-200 font-semibold">
              {cycle.roosters} Jantan : {cycle.hens} Betina
            </span>
          </div>
        </div>

        {/* Card 2: Akumulasi Telur */}
        <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 relative overflow-hidden group hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between text-xs text-amber-400/90 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Egg className="w-3.5 h-3.5" />
              Akumulasi Telur
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Siap Panen Broker
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 tracking-tight flex items-baseline gap-1.5">
            {formatNumber(cycle.accumulatedEggs)} <span className="text-sm font-sans font-normal text-amber-400/80">Butir</span>
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span>Estimasi Nilai:</span>
            <span className="font-mono text-emerald-400 font-bold">
              {formatRupiah(eggValueIdr)}
            </span>
          </div>
        </div>

        {/* Card 3: Biosekuriti */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Kesehatan Biosekuriti
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              {cycle.biosecurityHealth}% (Aman)
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
            {cycle.biosecurityHealth}%
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span>Status Sanitasi:</span>
            <span className="text-emerald-300 font-medium text-[11px]">Vaksinasi Terjaga</span>
          </div>
        </div>
      </div>

      {/* Animated Cyber-Farm Canvas Visualizer */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-4">
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {cycle.incubatorUnits > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30 flex items-center gap-1">
              <Cpu className="w-3 h-3" /> {cycle.incubatorUnits}x Mesin Tetas Aktif
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Listrik Kandang {cycle.electricityDaysRemaining} Hari
          </span>
        </div>

        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Visualisasi Kandang Closed-House Digital
        </div>

        {/* Visual chicken & coop layout */}
        <div className="h-44 relative flex items-center justify-around px-4 rounded-xl bg-slate-950/70 border border-slate-800/60 overflow-hidden">
          {/* Ambient Lighting & Ventilation Stream */}
          <div className="absolute inset-0 bg-radial-at-c from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

          {/* Animated Chickens (Hens & Roosters) */}
          {[
            { id: 1, type: 'rooster', name: 'Pejantan Apex 1', x: '5%' },
            { id: 2, type: 'hen', name: 'Layer Isa Brown 1', x: '22%' },
            { id: 3, type: 'hen', name: 'Layer Isa Brown 2', x: '42%' },
            { id: 4, type: 'hen', name: 'Layer Lohmann 1', x: '62%' },
            { id: 5, type: 'rooster', name: 'Pejantan Pemacek 2', x: '82%' },
          ].map((bird, i) => (
            <div
              key={bird.id}
              className="flex flex-col items-center group relative cursor-pointer"
              style={{
                animation: `float-slow ${3 + (i % 3) * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
              onClick={() => {
                sounds.playHarvest();
              }}
            >
              {/* Chicken Avatar SVG */}
              <div className="relative">
                <svg
                  className="w-14 h-14 drop-shadow-lg transition-transform group-hover:scale-110"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Comb */}
                  <path
                    d="M26 14C26 11 29 9 32 10C34 11 36 9 38 11C40 12 41 15 39 17C37 18 36 18 36 20H26V14Z"
                    fill={bird.type === 'rooster' ? '#ef4444' : '#f87171'}
                  />
                  {/* Body */}
                  <ellipse
                    cx="32"
                    cy="36"
                    rx="18"
                    ry="15"
                    fill={bird.type === 'rooster' ? '#d97706' : '#f59e0b'}
                  />
                  {/* Wing */}
                  <ellipse
                    cx="30"
                    cy="37"
                    rx="11"
                    ry="8"
                    fill={bird.type === 'rooster' ? '#b45309' : '#d97706'}
                  />
                  {/* Eye */}
                  <circle cx="38" cy="24" r="2.5" fill="#0f172a" />
                  <circle cx="39" cy="23.5" r="0.8" fill="white" />
                  {/* Beak */}
                  <polygon points="44,25 50,28 44,31" fill="#f97316" />
                  {/* Wattle */}
                  <path d="M42 31C42 34 39 36 37 34" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                  {/* Legs */}
                  <line x1="28" y1="50" x2="26" y2="58" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="36" y1="50" x2="38" y2="58" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M23 58h6M35 58h6" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                </svg>

                {/* Egg laying badge if hen */}
                {bird.type === 'hen' && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-bold text-[9px] flex items-center justify-center shadow-md animate-bounce">
                    🥚
                  </div>
                )}
              </div>

              <span className="text-[10px] font-mono text-slate-300 mt-1 opacity-80 group-hover:opacity-100">
                {bird.name}
              </span>
            </div>
          ))}

          {/* Golden Eggs Accumulated Basket */}
          <div className="absolute bottom-2 left-4 flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 rounded-lg px-2.5 py-1">
            <span className="text-amber-400 text-sm">🧺</span>
            <span className="text-[11px] font-mono text-amber-300 font-bold">
              {cycle.accumulatedEggs} Telur Terkumpul
            </span>
          </div>

          {/* Feed Stock Indicator */}
          <div className="absolute bottom-2 right-4 flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-lg px-2.5 py-1">
            <span className="text-emerald-400 text-xs">🌾 Pakan:</span>
            <span className="text-[11px] font-mono text-slate-200 font-bold">
              {cycle.feedStockKg} Kg
            </span>
          </div>
        </div>

        {/* Action Controls for Biological Cycle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {/* Action 1: Majukan Siklus 1 Hari (Opsional Turbo Boost) */}
          <button
            type="button"
            id="btn-advance-cycle"
            onClick={() => {
              sounds.playHarvest();
              onAdvanceCycle();
            }}
            disabled={!canAdvance}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600/80 via-amber-500/80 to-yellow-500/80 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50"
          >
            <Clock className="w-4 h-4 text-slate-950" />
            <span>Akselerasi 1 Hari Tambahan (Turbo Opsional)</span>
          </button>

          {/* Action 2: Jual Panen / Tarik Dana (WD) Manual */}
          <button
            type="button"
            id="btn-withdraw-eggs"
            onClick={() => {
              sounds.playClick();
              onOpenWithdraw();
            }}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition active:scale-[0.98] ring-2 ring-emerald-400/30"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Jual Panen / Tarik Dana (WD) Manual ({formatRupiah(eggValueIdr)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
