import React, { useState, useEffect } from 'react';
import { Mail, Globe, Zap, AlertTriangle, CheckCircle, FileText, ArrowRight } from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/presets';
import { extractEmailsAndUrls } from '../lib/heuristicEngine';

interface ScannerInputProps {
  text: string;
  senderEmail: string;
  companyUrl: string;
  isScanning: boolean;
  onTextChange: (val: string) => void;
  onSenderEmailChange: (val: string) => void;
  onCompanyUrlChange: (val: string) => void;
  onScan: () => void;
  onSelectPreset: (presetId: string) => void;
}

export const ScannerInput: React.FC<ScannerInputProps> = ({
  text,
  senderEmail,
  companyUrl,
  isScanning,
  onTextChange,
  onSenderEmailChange,
  onCompanyUrlChange,
  onScan,
  onSelectPreset,
}) => {
  const [detectedEmails, setDetectedEmails] = useState<string[]>([]);
  const [detectedUrls, setDetectedUrls] = useState<string[]>([]);

  useEffect(() => {
    if (text) {
      const extracted = extractEmailsAndUrls(text);
      setDetectedEmails(extracted.emails);
      setDetectedUrls(extracted.urls);
    } else {
      setDetectedEmails([]);
      setDetectedUrls([]);
    }
  }, [text]);

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.09] p-5 sm:p-6 space-y-5 shadow-2xl">
      {/* Real-world attack presets selector */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Load Sample Threat Vector Or Paste Below
          </span>
          <span className="text-[11px] text-slate-500">Click to auto-populate</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white transition-all cursor-pointer group"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  preset.type === 'legitimate'
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                    : 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]'
                }`}
              />
              <span className="font-semibold">{preset.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 group-hover:text-slate-300">
                {preset.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Offer Letter, Phishing Email, or Suspicious Message Content
          </label>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>{text.length} chars</span>
            {text.length > 0 && <span>• {text.trim().split(/\s+/).length} words</span>}
          </div>
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            rows={8}
            placeholder={`Paste the full text of the offer letter, job recruitment email, M365 security alert, or SMS message here...\n\nExample:\n"Congratulations! You have been selected for a remote data entry position paying $85/hr. No interview required. Deposit our cashier check of $4,850 and immediately wire $2,450 to our approved equipment vendor via Zelle or Apple Gift Cards..."`}
            className="w-full rounded-xl bg-black/30 border border-white/[0.1] focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 p-4 text-sm text-slate-100 placeholder-slate-500 font-mono resize-y leading-relaxed outline-none transition-all"
          />
        </div>

        {/* Auto-extracted metadata tags helper */}
        {(detectedEmails.length > 0 || detectedUrls.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">
              Auto-detected:
            </span>
            {detectedEmails.map((email) => (
              <button
                key={email}
                type="button"
                onClick={() => onSenderEmailChange(email)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-[11px] hover:bg-cyan-900/50 cursor-pointer"
                title="Click to use as Sender Email"
              >
                <Mail className="w-3 h-3" />
                {email}
                <ArrowRight className="w-2.5 h-2.5 text-cyan-400 ml-0.5" />
              </button>
            ))}
            {detectedUrls.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => onCompanyUrlChange(url)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-950/40 border border-violet-800/40 text-violet-300 text-[11px] hover:bg-violet-900/50 cursor-pointer max-w-[260px] truncate"
                title="Click to use as Company URL"
              >
                <Globe className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{url}</span>
                <ArrowRight className="w-2.5 h-2.5 text-violet-400 ml-0.5 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Auxiliary Inputs: Sender Email & Company URL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              Sender Email Address
            </span>
            <span className="text-[10px] text-slate-500 font-normal">Optional</span>
          </label>
          <input
            type="text"
            value={senderEmail}
            onChange={(e) => onSenderEmailChange(e.target.value)}
            placeholder="e.g. hr-operations@job-google.net or recruiter@gmail.com"
            className="w-full rounded-xl bg-black/30 border border-white/[0.1] focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/20 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-violet-400" />
              Company or Target URL
            </span>
            <span className="text-[10px] text-slate-500 font-normal">Optional</span>
          </label>
          <input
            type="text"
            value={companyUrl}
            onChange={(e) => onCompanyUrlChange(e.target.value)}
            placeholder="e.g. https://google.com or careers.app1e.io"
            className="w-full rounded-xl bg-black/30 border border-white/[0.1] focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all font-mono"
          />
        </div>
      </div>

      {/* Scan Button */}
      <div>
        <button
          onClick={onScan}
          disabled={isScanning || !text.trim()}
          className="w-full relative group overflow-hidden rounded-xl py-4 px-6 font-bold text-base text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] cursor-pointer flex items-center justify-center gap-2.5"
        >
          {/* Animated light reflection */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />

          {isScanning ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Forensic Threat Engine Scanning...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>Scan for Threat Risk &amp; Phishing Indicators</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
