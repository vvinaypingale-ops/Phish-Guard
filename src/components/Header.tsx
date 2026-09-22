import React from 'react';
import { Shield, Sparkles, History, FileSpreadsheet, RotateCcw } from 'lucide-react';

interface HeaderProps {
  hasGeminiKey: boolean;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenToolkit: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasGeminiKey,
  historyCount,
  onOpenHistory,
  onOpenToolkit,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#080d1a]/80 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold ring-1 ring-white/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                PhishGuard AI
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                v2.5 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Forensic Fraud Inspector &amp; Threat Intelligence Engine
            </p>
          </div>
        </div>

        {/* Status and Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium flex items-center gap-1">
              {hasGeminiKey ? (
                <>
                  <Sparkles className="w-3 h-3 text-cyan-400 inline" />
                  Dual-Engine: Heuristic + Gemini 3.8
                </>
              ) : (
                'Dual-Layer Heuristic Active'
              )}
            </span>
          </div>

          <button
            onClick={onOpenToolkit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            title="Incident Response Toolkit"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Incident Toolkit</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            title="Scan History"
          >
            <History className="w-3.5 h-3.5 text-violet-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-violet-500/30 text-violet-200 text-[10px] flex items-center justify-center font-bold">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="Clear and Start New Scan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
