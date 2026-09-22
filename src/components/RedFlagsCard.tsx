import React, { useState } from 'react';
import { AlertCircle, CreditCard, Clock, Globe, Shield, Terminal, CheckCircle2 } from 'lucide-react';
import { RedFlag, FlagCategory } from '../types';

interface RedFlagsCardProps {
  flags: RedFlag[];
  onSelectFlag?: (flag: RedFlag) => void;
}

export const RedFlagsCard: React.FC<RedFlagsCardProps> = ({ flags, onSelectFlag }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Flags', count: flags.length },
    { id: 'financial', label: 'Financial', icon: CreditCard, count: flags.filter(f => f.category === 'financial').length },
    { id: 'urgency', label: 'Urgency', icon: Clock, count: flags.filter(f => f.category === 'urgency').length },
    { id: 'identity', label: 'Identity', icon: Globe, count: flags.filter(f => f.category === 'identity').length },
    { id: 'process', label: 'Process', icon: Shield, count: flags.filter(f => f.category === 'process').length },
    { id: 'technical', label: 'Technical', icon: Terminal, count: flags.filter(f => f.category === 'technical').length },
  ];

  const filteredFlags = selectedCategory === 'all'
    ? flags
    : flags.filter((f) => f.category === selectedCategory);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'high':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'low':
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  const getCategoryBorder = (category: string) => {
    switch (category) {
      case 'financial':
        return 'border-l-4 border-l-red-500';
      case 'urgency':
        return 'border-l-4 border-l-amber-500';
      case 'identity':
        return 'border-l-4 border-l-cyan-500';
      case 'process':
        return 'border-l-4 border-l-violet-500';
      case 'technical':
      default:
        return 'border-l-4 border-l-rose-500';
    }
  };

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.09] p-6 space-y-5 shadow-2xl">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">Detected Threat Red Flags</h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                {flags.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Categorized pattern triggers &amp; malicious social engineering hallmarks
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white/15 text-white border border-white/25 shadow-sm'
                    : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-transparent hover:bg-white/[0.08]'
                }`}
              >
                <span>{cat.label}</span>
                {cat.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Red Flags */}
      {filteredFlags.length === 0 ? (
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-8 text-center text-slate-400 text-sm italic flex flex-col items-center gap-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500/60" />
          <span>No red flags detected in the {selectedCategory.toUpperCase()} category.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredFlags.map((flag) => {
            const borderClass = getCategoryBorder(flag.category);
            const badgeClass = getSeverityBadge(flag.severity);

            return (
              <div
                key={flag.id}
                onClick={() => onSelectFlag?.(flag)}
                className={`rounded-xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.07] p-4 space-y-2.5 transition-all shadow-md ${borderClass} cursor-pointer group`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${badgeClass}`}
                  >
                    {flag.severity} risk
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    {flag.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {flag.label}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{flag.explanation}</p>
                </div>

                {flag.evidence && (
                  <div className="rounded-lg bg-black/40 border border-white/[0.06] px-3 py-2 text-[11px] font-mono text-amber-200/90 leading-tight">
                    <span className="text-slate-500 select-none mr-1.5">&gt;</span>
                    &ldquo;{flag.evidence}&rdquo;
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
