import React from 'react';
import { Columns, X, Check } from 'lucide-react';
import { LegitimacyComparison } from '../types';

interface LegitimacyBaselineCardProps {
  comparisons: LegitimacyComparison[];
}

export const LegitimacyBaselineCard: React.FC<LegitimacyBaselineCardProps> = ({ comparisons }) => {
  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.09] p-6 space-y-5 shadow-2xl">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
          <Columns className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100">Legitimacy Comparison Baseline</h3>
          <p className="text-[11px] text-slate-400">
            Side-by-side contrast of observed anomalies against Fortune 500 &amp; FTC compliance standards
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: This Document */}
        <div className="rounded-xl bg-black/35 border border-rose-500/25 p-4 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 border-b border-rose-500/20 pb-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center">
              <X className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider">This Inspected Document</h4>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            {comparisons.map((c, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{c.anomaly}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Standard Legitimate Baseline */}
        <div className="rounded-xl bg-black/35 border border-emerald-500/25 p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 border-b border-emerald-500/20 pb-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Standard Corporate Baseline</h4>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            {comparisons.map((c, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">{c.baseline}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
