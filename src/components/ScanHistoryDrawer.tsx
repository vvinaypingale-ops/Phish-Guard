import React from 'react';
import { X, Trash2, ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import { ScanResult } from '../types';

interface ScanHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanResult[];
  onSelectScan: (item: ScanResult) => void;
  onClearHistory: () => void;
}

export const ScanHistoryDrawer: React.FC<ScanHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectScan,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md h-full bg-[#0a0f1e] border-l border-white/[0.1] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Scan History</h3>
            <p className="text-[11px] text-slate-400">Previous threat inspections in this session</p>
          </div>

          <div className="flex items-center gap-1.5">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                title="Clear All History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs italic">
              No previous scans in session history.
            </div>
          ) : (
            history.map((scan) => {
              const isHigh = scan.threatScore >= 50;

              return (
                <div
                  key={scan.id}
                  onClick={() => {
                    onSelectScan(scan);
                    onClose();
                  }}
                  className="rounded-xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/[0.07] p-3.5 space-y-2 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(scan.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                        isHigh
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      }`}
                    >
                      {isHigh ? (
                        <ShieldAlert className="w-3 h-3 text-rose-400" />
                      ) : (
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      )}
                      <span>{scan.threatScore}% Risk</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {scan.scannedText}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-white/[0.05]">
                    <span>{scan.detectedFlags.length} flags triggered</span>
                    <span className="flex items-center gap-1 text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Load Scan <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
