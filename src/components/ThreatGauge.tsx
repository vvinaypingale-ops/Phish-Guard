import React, { useState } from 'react';
import { Copy, Check, ShieldAlert, ShieldCheck, HelpCircle } from 'lucide-react';
import { ScanResult } from '../types';

interface ThreatGaugeProps {
  result: ScanResult;
  onCopyReport: () => void;
  copied: boolean;
}

export const ThreatGauge: React.FC<ThreatGaugeProps> = ({ result, onCopyReport, copied }) => {
  const { threatScore, heuristicScore, llmAdjustment, riskLevel } = result;

  // Arc math: circumference of radius 78 = 2 * pi * 78 ~= 490
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, threatScore));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getTheme = () => {
    if (threatScore >= 85) {
      return {
        badgeBg: 'bg-red-500/15 border-red-500/40 text-red-300',
        strokeColor: '#ef4444',
        shadowGlow: 'rgba(239, 68, 68, 0.4)',
        barGrad: 'from-red-500 to-rose-600',
      };
    }
    if (threatScore >= 65) {
      return {
        badgeBg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
        strokeColor: '#f43f5e',
        shadowGlow: 'rgba(244, 63, 94, 0.4)',
        barGrad: 'from-orange-500 to-rose-500',
      };
    }
    if (threatScore >= 35) {
      return {
        badgeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
        strokeColor: '#f59e0b',
        shadowGlow: 'rgba(245, 158, 11, 0.4)',
        barGrad: 'from-amber-400 to-orange-500',
      };
    }
    if (threatScore >= 15) {
      return {
        badgeBg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
        strokeColor: '#06b6d4',
        shadowGlow: 'rgba(6, 182, 212, 0.4)',
        barGrad: 'from-cyan-400 to-blue-500',
      };
    }
    return {
      badgeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
      strokeColor: '#10b981',
      shadowGlow: 'rgba(16, 185, 129, 0.4)',
      barGrad: 'from-emerald-400 to-teal-500',
    };
  };

  const theme = getTheme();

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.09] p-6 flex flex-col items-center justify-between gap-5 shadow-2xl relative overflow-hidden">
      {/* Background ambient radial glow matching risk */}
      <div
        className="absolute -top-16 -left-16 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-20 transition-all duration-700"
        style={{ background: theme.strokeColor }}
      />

      {/* Header / Actions */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Threat Index
          </p>
        </div>

        <button
          onClick={onCopyReport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Report</span>
            </>
          )}
        </button>
      </div>

      {/* SVG Circular Gauge */}
      <div className="relative w-52 h-52 flex items-center justify-center my-1">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(0,0,0,0.5)]"
        >
          <defs>
            <linearGradient id="threatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#06b6d4" />
              <stop offset="65%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="14"
          />

          {/* Active Animated Gauge */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={theme.strokeColor}
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${theme.shadowGlow})`,
            }}
          />
        </svg>

        {/* Center Text Metric */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <div className="text-5xl font-black tracking-tight text-white flex items-baseline">
            <span>{threatScore}</span>
            <span className="text-2xl text-slate-400 font-bold ml-0.5">%</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
            Calculated Risk
          </span>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div
        className={`w-full py-2.5 px-4 rounded-xl text-center text-sm font-extrabold uppercase tracking-wide border ${theme.badgeBg} flex items-center justify-center gap-2`}
      >
        {threatScore >= 50 ? (
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
        ) : (
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
        )}
        <span>{riskLevel}</span>
      </div>

      {/* Calibration Breakdown Card */}
      <div className="w-full rounded-xl bg-black/25 border border-white/[0.08] p-3.5 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1">
            Heuristic Base
            <span className="text-[10px] text-slate-500">(15+ Signatures)</span>
          </span>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, heuristicScore)}%` }}
              />
            </div>
            <span className="font-bold font-mono text-slate-200 w-8 text-right">
              {heuristicScore}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1">
            Neural Adjustment
            <span className="text-[10px] text-slate-500">(Gemini Context)</span>
          </span>
          <span
            className={`font-mono font-bold ${
              llmAdjustment > 0
                ? 'text-rose-400'
                : llmAdjustment < 0
                ? 'text-emerald-400'
                : 'text-slate-400'
            }`}
          >
            {llmAdjustment > 0 ? `+${llmAdjustment}` : llmAdjustment}
          </span>
        </div>

        <div className="border-t border-white/[0.08] pt-2 flex items-center justify-between">
          <span className="text-slate-200 font-semibold">Final Calibrated Score</span>
          <span className="font-mono font-extrabold text-white text-sm">{threatScore}/100</span>
        </div>
      </div>
    </div>
  );
};
