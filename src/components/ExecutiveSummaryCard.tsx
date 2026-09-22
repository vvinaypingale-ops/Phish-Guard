import React from 'react';
import { Sparkles, CheckCircle2, AlertOctagon, AlertTriangle, ShieldCheck, Mail, Globe } from 'lucide-react';
import { ScanResult } from '../types';

interface ExecutiveSummaryCardProps {
  result: ScanResult;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({ result }) => {
  const { executiveSummary, domainVerifications, aiPowered, confidence } = result;

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.09] p-6 space-y-5 shadow-2xl flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">AI Executive Summary</h3>
              <p className="text-[11px] text-slate-400">Forensic threat intelligence synthesis</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                confidence === 'High'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              }`}
            >
              CONFIDENCE: {confidence.toUpperCase()}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {aiPowered ? 'Gemini 3.8 Flash' : 'Heuristic Engine'}
            </span>
          </div>
        </div>

        {/* Executive Summary Quote Box */}
        <div className="rounded-xl bg-black/30 border border-white/[0.08] p-4 text-slate-200 text-sm leading-relaxed relative">
          <div className="absolute top-2 left-2 text-2xl text-emerald-500/20 font-serif select-none pointer-events-none">
            “
          </div>
          <p className="pl-3.5 italic text-slate-200">{executiveSummary}</p>
        </div>
      </div>

      {/* Domain & Sender Verification Block */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Domain &amp; Sender Infrastructure Verification
          </h4>
        </div>

        {domainVerifications.length === 0 ? (
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 text-xs text-slate-400 flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-500" />
            <span>No external sender email or company URL provided. Scanning embedded body references.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {domainVerifications.map((item, idx) => {
              const isDanger = item.status === 'suspicious' || item.status === 'typosquat';
              const isWarning = item.status === 'warning';

              return (
                <div
                  key={idx}
                  className={`rounded-xl p-3 border text-xs flex items-start gap-2.5 ${
                    isDanger
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                      : isWarning
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isDanger ? (
                      <AlertOctagon className="w-4 h-4 text-rose-400" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold text-slate-100">{item.label}</span>
                      <span className="font-mono text-[10px] opacity-80 truncate">{item.target}</span>
                    </div>
                    <p className="text-slate-300 leading-normal">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
