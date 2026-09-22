import React, { useState } from 'react';
import { X, Copy, Check, Download, ExternalLink, Mail, ShieldAlert, Printer } from 'lucide-react';
import { ScanResult } from '../types';

interface IncidentToolkitModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ScanResult | null;
}

export const IncidentToolkitModal: React.FC<IncidentToolkitModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [activeTab, setActiveTab] = useState<'verify' | 'report' | 'export'>('verify');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  const verificationEmailTemplate = `Subject: Verification Request: Employment Offer / Recruitment Communication Authenticity

To the Talent Acquisition & Security Compliance Team at [Company Name],

I am writing to verify the authenticity of an employment offer / communication I recently received, purportedly extended on behalf of your organization.

Details of Received Communication:
- Sender Name / Title: [Claimed Recruiter Name, e.g. Sarah Jenkins]
- Sender Email Address: ${result?.senderEmail || '[Claimed Recruiter Email]'}
- Position Specified: [Claimed Position Title, e.g. Remote Data Specialist]
- Date Received: ${result ? new Date(result.timestamp).toLocaleDateString() : '[Date]'}

Before taking any action or sharing sensitive documentation, I wanted to independently verify whether this job requisition is legitimate and whether this recruiter is authorized to issue offers on behalf of your company.

Thank you for your assistance in confirming this matter.

Sincerely,
[Your Name]
[Your Phone Number]`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(verificationEmailTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const downloadJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PhishGuard_Forensic_Report_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0c1222] border border-white/[0.12] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Incident Response Toolkit</h3>
              <p className="text-[11px] text-slate-400">Defensive response, reporting, and evidence export</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/[0.08] px-6 bg-black/20">
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'verify'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>HR Verification Template</span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'report'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Official Reporting Portals</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Evidence Export &amp; Print</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'verify' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  Copy and send this formal inquiry to the company&apos;s verified public HR department:
                </p>
                <button
                  onClick={copyTemplate}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  {copiedTemplate ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-black/50 border border-white/[0.08] p-4">
                <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                  {verificationEmailTemplate}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'report' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                If financial fraud, identity theft, or impersonation was attempted, report the evidence directly to cyber authorities:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://reportfraud.ftc.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] p-3.5 space-y-1 block transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-100 group-hover:text-cyan-400">
                    <span>FTC ReportFraud</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Federal Trade Commission portal for fake job offers, check scams, and gift card fraud.
                  </p>
                </a>

                <a
                  href="https://www.ic3.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] p-3.5 space-y-1 block transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-100 group-hover:text-cyan-400">
                    <span>FBI IC3 Complaint Center</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Internet Crime Complaint Center for Business Email Compromise (BEC) and wire fraud.
                  </p>
                </a>

                <a
                  href="https://safebrowsing.google.com/safebrowsing/report_phish/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] p-3.5 space-y-1 block transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-100 group-hover:text-cyan-400">
                    <span>Google Safe Browsing</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Submit malicious URLs to block phishing sites across Chrome and web browsers.
                  </p>
                </a>

                <a
                  href="https://apwg.org/reportphishing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] p-3.5 space-y-1 block transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-100 group-hover:text-cyan-400">
                    <span>APWG Phishing Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Global Anti-Phishing Working Group database for shared threat intelligence.
                  </p>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Preserve forensic evidence for internal SOC investigation, law enforcement, or record-keeping:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={downloadJson}
                  disabled={!result}
                  className="rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] p-4 text-left transition-all cursor-pointer flex flex-col justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-emerald-400" />
                      Download JSON Evidence Dossier
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Includes full raw text, calibrated scores, triggered regex signatures, and reasoning traces.
                    </p>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold">.JSON File &rarr;</span>
                </button>

                <button
                  onClick={handlePrint}
                  disabled={!result}
                  className="rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] p-4 text-left transition-all cursor-pointer flex flex-col justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <Printer className="w-4 h-4 text-cyan-400" />
                      Print / Save as PDF
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Generates a formal, printable security evaluation report suitable for presentation.
                    </p>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-semibold">Print Dialog &rarr;</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
