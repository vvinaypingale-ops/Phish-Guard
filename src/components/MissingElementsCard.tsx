import React from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';
import { MissingElement } from '../types';

interface MissingElementsCardProps {
  missingElements: MissingElement[];
}

export const MissingElementsCard: React.FC<MissingElementsCardProps> = ({ missingElements }) => {
  if (missingElements.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.09] p-6 space-y-4 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Missing Legitimate Elements</h3>
            <p className="text-[11px] text-slate-400">
              Crucial governance, legal, and operational attributes absent in this communication
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
          {missingElements.length} Absent
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {missingElements.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-black/25 border border-white/[0.07] p-3.5 space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-200">{item.name}</span>
              <span
                className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                  item.importance === 'critical'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : item.importance === 'high'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}
              >
                {item.importance}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
