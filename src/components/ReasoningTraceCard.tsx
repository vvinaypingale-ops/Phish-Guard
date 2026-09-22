import React from 'react';
import { Cpu, Zap, Activity } from 'lucide-react';
import { ScanResult } from '../types';

interface ReasoningTraceCardProps {
  result: ScanResult;
}

export const ReasoningTraceCard: React.FC<ReasoningTraceCardProps> = ({ result }) => {
  const { reasoningTrace, deltaExplanation, llmAdjustment, aiPowered } = result;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-violet-950/20 via-black/40 to-slate-900/40 backdrop-blur-xl border border-violet-500/25 p-6 space-y-4 shadow-2xl relative overflow-hidden">
      {/* Decorative accent glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-violet-200">
              AI Forensic Reasoning Trace &amp; Delta Calibration
            </h3>
            <p className="text-[11px] text-slate-400">
              Deep contextual evaluation &amp; linguistic gap resolution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold tracking-wider">
            {aiPowered ? 'NEURAL DEEP TRACE' : 'HEURISTIC BASELINE'}
          </span>
        </div>
      </div>

      {/* Two columns: Step-by-Step Trace & Delta Calibration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* Step-by-step reasoning trace */}
        <div className="rounded-xl bg-black/40 border border-violet-500/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-violet-300">
            <Activity className="w-3.5 h-3.5" />
            <h4 className="text-[11px] font-bold uppercase tracking-wider">
              Step-by-Step Reasoning Trace
            </h4>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
            {reasoningTrace || 'Running heuristic rule-matching engine to detect advance-fee signatures and urgency triggers.'}
          </p>
        </div>

        {/* Heuristic vs AI Delta */}
        <div className="rounded-xl bg-black/40 border border-cyan-500/20 p-4 space-y-2">
          <div className="flex items-center justify-between text-cyan-300">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider">
                Heuristic vs. AI Delta Calibration
              </h4>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                llmAdjustment > 0
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : llmAdjustment < 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-500/20 text-slate-300'
              }`}
            >
              Delta: {llmAdjustment > 0 ? `+${llmAdjustment}` : llmAdjustment} pts
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {deltaExplanation || 'The AI model evaluates holistic intent, checking if aggressive urgency or financial coercion modifies the baseline heuristic probability.'}
          </p>
        </div>
      </div>
    </div>
  );
};
