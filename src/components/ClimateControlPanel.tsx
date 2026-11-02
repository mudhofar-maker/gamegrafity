import React, { useState } from 'react';
import { BiologicalCycle, ClimateMode } from '../types/farm';
import { formatRupiah } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import {
  Thermometer,
  Flame,
  Wind,
  Droplets,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Power,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface ClimateControlPanelProps {
  cycle: BiologicalCycle;
  onUpdateTargetTemp: (newTemp: number) => void;
  onSetClimateMode: (mode: ClimateMode) => void;
  onRentAcClimate: () => void;
  saldoDompetSaya: number;
}

export const ClimateControlPanel: React.FC<ClimateControlPanelProps> = ({
  cycle,
  onUpdateTargetTemp,
  onSetClimateMode,
  onRentAcClimate,
  saldoDompetSaya,
}) => {
  const isAcRented = cycle.acClimateDaysRemaining > 0;
  const isHeatStress = cycle.ambientTempC > 28.5 || cycle.heatStressActive;
  const isOptimal = cycle.ambientTempC >= 22.0 && cycle.ambientTempC <= 26.5;

  const handleTempAdjust = (delta: number) => {
    const next = Math.min(32, Math.max(18, Number((cycle.targetTempC + delta).toFixed(1))));
    onUpdateTargetTemp(next);
    sounds.playClick();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Thermometer className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Pengatur Suhu Ruangan Otomatis &amp; AC Api Kandang
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isAcRented
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {isAcRented ? `Sewa Aktif (${cycle.acClimateDaysRemaining} Hari)` : 'Belum Disewa'}
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Stabilisator iklim closed-house: AC evaporative cooling pad &amp; pemanas api gasolec otomatis
          </p>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Status Termal:</span>
          {isOptimal ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Suhu Nyaman (24°C Ideal)
            </span>
          ) : isHeatStress ? (
            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 flex items-center gap-1.5 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Peringatan Heatstress!
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
              Suhu Dingin
            </span>
          )}
        </div>
      </div>

      {/* Main Climate Instruments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Live Ambient Temperature Gauge */}
        <div className={`p-4 rounded-xl border relative overflow-hidden transition ${
          isHeatStress
            ? 'bg-rose-950/30 border-rose-500/50'
            : isOptimal
            ? 'bg-slate-950/80 border-cyan-500/30'
            : 'bg-blue-950/20 border-blue-500/40'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              Suhu Ruang Kandang
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              Sensors Live
            </span>
          </div>

          <div className="text-3xl font-extrabold font-mono text-white tracking-tight flex items-baseline gap-1 mt-1">
            {cycle.ambientTempC.toFixed(1)} <span className="text-sm font-sans font-normal text-cyan-400">°C</span>
          </div>

          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span>Zona Target:</span>
            <span className="font-mono text-emerald-400 font-bold">{cycle.targetTempC.toFixed(1)}°C (Stabil)</span>
          </div>
        </div>

        {/* Card 2: Kelembaban Udara (RH %) */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              Kelembaban Udara (RH)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Optimal 60-70%
            </span>
          </div>

          <div className="text-3xl font-extrabold font-mono text-blue-300 tracking-tight mt-1">
            {cycle.humidityRh}% <span className="text-sm font-sans font-normal text-slate-400">RH</span>
          </div>

          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span>Kualitas Cangkang:</span>
            <span className="text-emerald-300 font-medium">Tebal &amp; Keras (Grade A)</span>
          </div>
        </div>

        {/* Card 3: Status AC & Pemanas Api (Heater) */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                Mode Pengatur Iklim
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                Gasolec &amp; Pad
              </span>
            </div>

            <div className="text-base font-bold font-mono text-white mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              {cycle.climateMode === 'AUTO'
                ? 'OTOMATIS (AI INVERTER)'
                : cycle.climateMode === 'COOLING_PAD'
                ? 'AC EVAPORATIVE COOLING'
                : 'PEMANAS API (GASOLEC)'}
            </div>

            <p className="text-[10px] text-slate-400 mt-1">
              {isAcRented
                ? 'Sistem aktif mengatur blower & spuyer pendingin otomatis saat suhu naik di atas 26°C.'
                : 'Sistem AC & pemanas belum aktif. Ayam berisiko mengalami stres panas.'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Daya Blower:</span>
            <span className="text-cyan-400 font-bold">12.500 CFM</span>
          </div>
        </div>
      </div>

      {/* Climate Controls & Mode Switcher */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Target Temperature Adjuster */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span>Atur Suhu Target Kandang:</span>
            <span className="font-mono text-cyan-400 font-bold text-sm">{cycle.targetTempC.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center gap-2">
            {[22, 24, 26].map((temp) => (
              <button
                key={temp}
                type="button"
                onClick={() => {
                  onUpdateTargetTemp(temp);
                  sounds.playClick();
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition border ${
                  Math.round(cycle.targetTempC) === temp
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {temp}°C
              </button>
            ))}

            <div className="flex items-center gap-1 ml-2">
              <button
                type="button"
                onClick={() => handleTempAdjust(-0.5)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center transition"
                title="Turunkan 0.5°C"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => handleTempAdjust(0.5)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center transition"
                title="Naikkan 0.5°C"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Middle: Mode Switch */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Pilihan Mode Operasi:
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['AUTO', 'COOLING_PAD', 'HEATER_API'] as ClimateMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  onSetClimateMode(mode);
                  sounds.playClick();
                }}
                className={`py-1.5 px-3 rounded-lg text-[11px] font-mono font-bold transition ${
                  cycle.climateMode === mode
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'AUTO' ? '⚡ Auto AI' : mode === 'COOLING_PAD' ? '❄️ AC Pad' : '🔥 Pemanas Api'}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Rent or Extend AC Utility Button */}
        <div className="shrink-0">
          {!isAcRented ? (
            <button
              type="button"
              onClick={() => {
                sounds.playCash();
                onRentAcClimate();
              }}
              className="w-full md:w-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 transition active:scale-95 animate-pulse"
            >
              <Zap className="w-4 h-4 text-cyan-200" />
              <span>Sewa AC Conditioner (Rp 65.000/Hari)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                sounds.playCash();
                onRentAcClimate();
              }}
              className="w-full md:w-auto py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Perpanjang Sewa AC (+7 Hari)</span>
            </button>
          )}
        </div>
      </div>

      {/* Explanatory Note on Poultry Climate Control */}
      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2 leading-relaxed">
        <span className="text-cyan-400 font-bold text-sm">💡</span>
        <div>
          <strong className="text-slate-200">Mengapa Suhu 24°C &amp; AC Api Sangat Vital Bagi Peternak?</strong>
          <span className="block mt-0.5">
            Ayam petelur tidak memiliki kelenjar keringat. Pada suhu &gt;28°C, ayam mengalami <em>heat stress</em> (megap-megap), nafsu makan turun drastis, kalsium darah rusak sehingga cangkang telur tipis/pecah, dan produksi telur anjlok hingga 40%. Dengan AC evaporative cooling pad dan pemanas api gasolec otomatis, suhu terjaga stabil 24°C, menghasilkan <strong>persentase telur Grade A mencapai 92%</strong>!
          </span>
        </div>
      </div>
    </div>
  );
};
