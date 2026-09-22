import React, { useState } from 'react';
import { Eye, FileCode, Check, AlertTriangle } from 'lucide-react';
import { RedFlag } from '../types';

interface ForensicDocumentViewerProps {
  text: string;
  flags: RedFlag[];
  activeFlagId?: string;
  onSelectFlag?: (flag: RedFlag) => void;
}

export const ForensicDocumentViewer: React.FC<ForensicDocumentViewerProps> = ({
  text,
  flags,
  activeFlagId,
  onSelectFlag,
}) => {
  const [viewMode, setViewMode] = useState<'annotated' | 'raw'>('annotated');

  // Build highlighted spans by matching flag evidence in the text
  const renderAnnotatedText = () => {
    if (!text) return null;

    // Collect valid evidence strings sorted by length descending to match longest phrases first
    const evidenceList = flags
      .filter((f) => f.evidence && f.evidence.length >= 3)
      .map((f) => ({
        flag: f,
        evidence: f.evidence,
      }));

    if (evidenceList.length === 0) {
      return <span className="text-slate-300 whitespace-pre-wrap">{text}</span>;
    }

    // Simple robust tokenizer for highlighted segments
    const lines = text.split('\n');

    return (
      <div className="space-y-1 font-mono text-xs leading-relaxed text-slate-300">
        {lines.map((line, lineIdx) => {
          let remaining = line;
          const segments: React.ReactNode[] = [];

          while (remaining.length > 0) {
            let earliestMatch: { index: number; length: number; flag: RedFlag } | null = null;

            for (const item of evidenceList) {
              const idx = remaining.toLowerCase().indexOf(item.evidence.toLowerCase());
              if (idx !== -1) {
                if (!earliestMatch || idx < earliestMatch.index) {
                  earliestMatch = {
                    index: idx,
                    length: item.evidence.length,
                    flag: item.flag,
                  };
                }
              }
            }

            if (earliestMatch) {
              if (earliestMatch.index > 0) {
                segments.push(remaining.substring(0, earliestMatch.index));
              }

              const matchedText = remaining.substring(
                earliestMatch.index,
                earliestMatch.index + earliestMatch.length
              );
              const flag = earliestMatch.flag;
              const isSelected = activeFlagId === flag.id;

              segments.push(
                <mark
                  key={`${lineIdx}_${segments.length}`}
                  onClick={() => onSelectFlag?.(flag)}
                  title={`${flag.label} (${flag.severity.toUpperCase()})`}
                  className={`inline-block px-1.5 py-0.5 rounded transition-all cursor-pointer font-semibold ${
                    flag.severity === 'critical'
                      ? 'bg-rose-500/30 text-rose-200 border-b-2 border-rose-500 hover:bg-rose-500/40'
                      : flag.severity === 'high'
                      ? 'bg-red-500/30 text-red-200 border-b-2 border-red-500 hover:bg-red-500/40'
                      : flag.severity === 'medium'
                      ? 'bg-amber-500/30 text-amber-200 border-b-2 border-amber-500 hover:bg-amber-500/40'
                      : 'bg-cyan-500/30 text-cyan-200 border-b-2 border-cyan-500 hover:bg-cyan-500/40'
                  } ${isSelected ? 'ring-2 ring-white scale-[1.02]' : ''}`}
                >
                  {matchedText}
                </mark>
              );

              remaining = remaining.substring(earliestMatch.index + earliestMatch.length);
            } else {
              segments.push(remaining);
              remaining = '';
            }
          }

          return (
            <div key={lineIdx} className="min-h-[1.25rem]">
              {segments}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.09] p-6 space-y-4 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Forensic Document Inspector</h3>
            <p className="text-[11px] text-slate-400">
              Interactive highlighted view mapping text passages to detected fraud indicators
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.08]">
          <button
            onClick={() => setViewMode('annotated')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'annotated'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Annotated</span>
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'raw'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3 h-3" />
            <span>Raw Source</span>
          </button>
        </div>
      </div>

      {/* Text Container */}
      <div className="rounded-xl bg-black/40 border border-white/[0.08] p-5 max-h-[380px] overflow-y-auto scrollbar-thin">
        {viewMode === 'annotated' ? (
          renderAnnotatedText()
        ) : (
          <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {text}
          </pre>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
        <span className="font-bold text-slate-500 uppercase tracking-wider font-mono">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Critical / Advance Fee</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span>High Risk Deception</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Urgency &amp; Pressure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>Process &amp; Identity</span>
        </div>
      </div>
    </div>
  );
};
