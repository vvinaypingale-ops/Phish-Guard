import React from 'react';
import { ShieldCheck, AlertOctagon, CheckSquare, ExternalLink, FileText } from 'lucide-react';
import { RecommendedAction } from '../types';

interface RecommendedActionsCardProps {
  actions: RecommendedAction[];
  onOpenToolkit: () => void;
}

export const RecommendedActionsCard: React.FC<RecommendedActionsCardProps> = ({
  actions,
  onOpenToolkit,
}) => {
  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.09] p-6 space-y-5 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Recommended Next Actions</h3>
            <p className="text-[11px] text-slate-400">
              Prescribed defensive steps, threat containment, and reporting workflow
            </p>
          </div>
        </div>

        <button
          onClick={onOpenToolkit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Open Verification Templates</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {actions.map((act, idx) => {
          const isImmediate = act.priority === 'immediate';
          const isReporting = act.priority === 'reporting';

          return (
            <div
              key={act.id}
              className={`rounded-xl p-4 space-y-2 border transition-all ${
                isImmediate
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : isReporting
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-white/[0.03] border-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                  Step {idx + 1}
                </span>
                <span
                  className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    isImmediate
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : isReporting
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {act.priority}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                {isImmediate ? (
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                ) : (
                  <CheckSquare className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                )}
                <span>{act.title}</span>
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
