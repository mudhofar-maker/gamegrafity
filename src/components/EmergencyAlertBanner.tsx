import React from 'react';
import { EmergencyDirective } from '../types/farm';
import { sounds } from '../utils/soundEffects';
import {
  AlertTriangle,
  Flame,
  Zap,
  ArrowRight,
  ShieldAlert,
  ArrowDownRight,
  CheckCircle2,
  BellRing,
  Sparkles,
  RefreshCw,
  Skull,
  TrendingDown,
  ShoppingBag,
} from 'lucide-react';

interface EmergencyAlertBannerProps {
  directive: EmergencyDirective;
  onExecuteDirectiveAction: () => void;
  onTriggerVirusSimulation: () => void;
  onTriggerFeedOutageSimulation: () => void;
  onTriggerSpentHensSimulation: () => void;
  onTriggerHeatStressSimulation?: () => void;
  hasSickChicks: boolean;
}

export const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({
  directive,
  onExecuteDirectiveAction,
  onTriggerVirusSimulation,
  onTriggerFeedOutageSimulation,
  onTriggerSpentHensSimulation,
  onTriggerHeatStressSimulation,
  hasSickChicks,
}) => {
  const isCritical = directive.urgencyLevel === 'CRITICAL';
  const isHigh = directive.urgencyLevel === 'HIGH';
  const isMedium = directive.urgencyLevel === 'MEDIUM';

  const getUrgencyBadge = () => {
    switch (directive.urgencyLevel) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-1 rounded-md bg-red-500/25 text-red-300 border border-red-500/50 font-mono text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-red-400" /> PRIORITAS #1: DARURAT KRITIS
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-1 rounded-md bg-amber-500/25 text-amber-300 border border-amber-500/50 font-mono text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> PRIORITAS #2: TINGGI
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-1 rounded-md bg-sky-500/25 text-sky-300 border border-sky-500/50 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ArrowDownRight className="w-3.5 h-3.5 text-sky-400" /> PRIORITAS #3: OPTIMALISASI
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> KONDISI STABIL
          </span>
        );
    }
  };

  const getContainerBg = () => {
    if (isCritical) {
      return 'bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/40 border-red-500/80 shadow-red-950/50 shadow-2xl ring-2 ring-red-500/40';
    }
    if (isHigh) {
      return 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/30 border-amber-500/80 shadow-amber-950/40 shadow-xl';
    }
    if (isMedium) {
      return 'bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-900 border-sky-500/50 shadow-lg';
    }
    return 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/30';
  };

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 relative overflow-hidden ${getContainerBg()}`}>
      {/* Decorative pulse line for critical urgency */}
      {isCritical && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 animate-pulse" />
      )}

      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border flex items-center justify-center ${
              isCritical
                ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-bounce'
                : isHigh
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
            }`}
          >
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base tracking-wide font-sans">
                Indikator Alarm Darurat & Triage Operasional Otomatis
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Sistem menghitung otomatis urgensi peternakan tanpa membuat pengguna bingung
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getUrgencyBadge()}
        </div>
      </div>

      {/* Main Directive & Clear Visual Arrow Pointer */}
      <div className="mt-3.5 space-y-3">
        {/* Directed Target with Small Arrow */}
        <div className="bg-slate-950/90 rounded-xl p-3.5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-sm font-bold">
              <span className="text-amber-400 animate-pulse text-base">➔</span>
              <span className={isCritical ? 'text-red-400' : isHigh ? 'text-amber-300' : 'text-cyan-300'}>
                {directive.directiveText}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              {directive.explanation}
            </p>
            <div className="text-[11px] font-mono text-slate-400 pl-6 flex items-center gap-1.5 pt-0.5">
              <span className="text-slate-500">Dampak Finansial:</span>
              <strong className={isCritical ? 'text-red-300' : 'text-emerald-400'}>
                {directive.financialImpact}
              </strong>
            </div>
          </div>

          {/* Big One-Click Resolution Button */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playDirectivePing();
                onExecuteDirectiveAction();
              }}
              className={`w-full md:w-auto py-3 px-5 rounded-xl font-bold text-xs tracking-wide shadow-lg flex items-center justify-center gap-2 transition active:scale-95 ${
                isCritical
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white shadow-red-950/50 animate-pulse'
                  : isHigh
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 shadow-amber-950/40'
                  : 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-cyan-950/40'
              }`}
            >
              <span className="text-sm font-mono">⚡</span>
              <span>{directive.actionLabel}</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Small Arrow Direction Helper */}
        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 px-1 pt-0.5">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-cyan-400 font-bold">↳ Petunjuk:</span>
            <span>
              Target interaksi:{' '}
              <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                {directive.highlightTarget}
              </span>
            </span>
          </div>

          {/* Sandbox Scenarios for testing real poultry crises */}
          <div className="flex items-center gap-1.5 pt-1 sm:pt-0">
            <span className="text-slate-500 text-[10px]">Tes Simulasi Krisis:</span>
            <button
              type="button"
              onClick={onTriggerVirusSimulation}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition border ${
                hasSickChicks
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
              }`}
              title="Munculkan gejala virus pada anak ayam untuk menguji salvage junkfood"
            >
              🦠 Virus Anak Ayam
            </button>
            <button
              type="button"
              onClick={onTriggerFeedOutageSimulation}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
              title="Turunkan pakan ke 0 kg untuk memicu alarm darurat pakan"
            >
              🌾 Pakan Habis
            </button>
            <button
              type="button"
              onClick={onTriggerSpentHensSimulation}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
              title="Munculkan ayam afkir tua siap karkas"
            >
              🍗 Ayam Afkir
            </button>
            {onTriggerHeatStressSimulation && (
              <button
                type="button"
                onClick={onTriggerHeatStressSimulation}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
                title="Simulasi suhu panas 31.5°C untuk memicu heatstress"
              >
                🌡️ Panas 31°C
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
