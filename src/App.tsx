import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScannerInput } from './components/ScannerInput';
import { ThreatGauge } from './components/ThreatGauge';
import { ExecutiveSummaryCard } from './components/ExecutiveSummaryCard';
import { ReasoningTraceCard } from './components/ReasoningTraceCard';
import { RedFlagsCard } from './components/RedFlagsCard';
import { MissingElementsCard } from './components/MissingElementsCard';
import { LegitimacyBaselineCard } from './components/LegitimacyBaselineCard';
import { RecommendedActionsCard } from './components/RecommendedActionsCard';
import { ForensicDocumentViewer } from './components/ForensicDocumentViewer';
import { IncidentToolkitModal } from './components/IncidentToolkitModal';
import { ScanHistoryDrawer } from './components/ScanHistoryDrawer';
import { PRESET_SCENARIOS } from './data/presets';
import { runHeuristicScan } from './lib/heuristicEngine';
import { ScanResult, RedFlag } from './types';
import { Shield, Sparkles, CheckCircle, AlertTriangle, ArrowDown } from 'lucide-react';

export default function App() {
  const [text, setText] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [companyUrl, setCompanyUrl] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(1);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStepTitle, setScanStepTitle] = useState<string>('Initializing Engine...');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isToolkitOpen, setIsToolkitOpen] = useState<boolean>(false);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);
  const [activeFlag, setActiveFlag] = useState<RedFlag | null>(null);

  // Check health and load initial preset on first load
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasGeminiKey(Boolean(data.hasGeminiKey));
      })
      .catch(() => {
        setHasGeminiKey(false);
      });

    // Load default preset for instant preview
    const defaultPreset = PRESET_SCENARIOS[0];
    if (defaultPreset) {
      setText(defaultPreset.content);
      setSenderEmail(defaultPreset.senderEmail);
      setCompanyUrl(defaultPreset.companyUrl);
    }
  }, []);

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_SCENARIOS.find((p) => p.id === presetId);
    if (preset) {
      setText(preset.content);
      setSenderEmail(preset.senderEmail);
      setCompanyUrl(preset.companyUrl);
      setResult(null);
    }
  };

  const handleReset = () => {
    setText('');
    setSenderEmail('');
    setCompanyUrl('');
    setResult(null);
    setActiveFlag(null);
  };

  const executeScan = async () => {
    if (!text.trim()) return;

    setIsScanning(true);
    setScanProgress(20);
    setScanStep(1);
    setScanStepTitle('Analyzing Heuristic Signatures & Payment Patterns...');

    // Progress animation milestones
    const t1 = setTimeout(() => {
      setScanProgress(55);
      setScanStep(2);
      setScanStepTitle('Verifying Domain Legitimacy & Typosquatting Distance...');
    }, 400);

    const t2 = setTimeout(() => {
      setScanProgress(85);
      setScanStep(3);
      setScanStepTitle('Synthesizing Neural Context Trace with Gemini 3.8 Flash...');
    }, 850);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          senderEmail,
          companyUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('API scan failed');
      }

      const scanData: ScanResult = await response.json();
      setScanProgress(100);

      setTimeout(() => {
        setResult(scanData);
        setHistory((prev) => [scanData, ...prev.slice(0, 19)]);
        setIsScanning(false);

        // Smooth scroll to results
        setTimeout(() => {
          document.getElementById('results-dashboard')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 300);
    } catch (err) {
      console.warn('Backend scan failed, running client heuristic fallback:', err);
      // Fallback to client-side heuristic engine
      const fallback = runHeuristicScan(text, senderEmail, companyUrl);
      const fallbackResult: ScanResult = {
        id: `scan_${Date.now()}`,
        timestamp: new Date().toISOString(),
        threatScore: fallback.heuristicScore,
        heuristicScore: fallback.heuristicScore,
        llmAdjustment: 0,
        riskLevel:
          fallback.heuristicScore >= 80
            ? 'Critical Fraud'
            : fallback.heuristicScore >= 60
            ? 'High Threat'
            : fallback.heuristicScore >= 35
            ? 'Suspicious'
            : fallback.heuristicScore >= 15
            ? 'Low Risk'
            : 'Legitimate / Safe',
        confidence: 'Standard',
        executiveSummary:
          fallback.heuristicScore >= 60
            ? 'Heuristic detection indicates multiple advance-fee, check deposit, or identity theft triggers.'
            : 'Communication conforms reasonably to standard baseline checks.',
        reasoningTrace:
          'Local heuristic pattern engine identified matches across payment, process, and urgency rules.',
        deltaExplanation: 'Heuristic-only analysis running locally.',
        detectedFlags: fallback.detectedFlags,
        missingElements: fallback.missingElements,
        comparisonBaseline: fallback.comparisonBaseline,
        domainVerifications: fallback.domainVerifications,
        recommendedActions: fallback.recommendedActions,
        scannedText: text,
        senderEmail,
        companyUrl,
        aiPowered: false,
      };

      setScanProgress(100);
      setTimeout(() => {
        setResult(fallbackResult);
        setHistory((prev) => [fallbackResult, ...prev.slice(0, 19)]);
        setIsScanning(false);
      }, 300);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const reportText = `[PHISHGUARD AI FORENSIC REPORT]
Threat Score: ${result.threatScore}% (${result.riskLevel})
Heuristic Base: ${result.heuristicScore} | LLM Delta: ${result.llmAdjustment}
Confidence: ${result.confidence}
Timestamp: ${new Date(result.timestamp).toLocaleString()}

EXECUTIVE SUMMARY:
${result.executiveSummary}

REASONING TRACE:
${result.reasoningTrace}

DETECTED RED FLAGS (${result.detectedFlags.length}):
${result.detectedFlags.map((f, i) => `${i + 1}. [${f.category.toUpperCase()}] ${f.label} - Evidence: "${f.evidence}"`).join('\n')}

DOMAIN VERIFICATION:
${result.domainVerifications.map((d) => `- ${d.label}: ${d.target} (${d.detail})`).join('\n')}

RECOMMENDED ACTIONS:
${result.recommendedActions.map((a, i) => `${i + 1}. ${a.title}: ${a.description}`).join('\n')}`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans relative selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed top-[40%] right-[30%] w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[140px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <Header
        hasGeminiKey={hasGeminiKey}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenToolkit={() => setIsToolkitOpen(true)}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-lg shadow-cyan-500/10">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Forensic Threat Intelligence &amp; Fraud Inspector</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Inspect Scam Offers,
            </span>
            <br />
            <span className="text-white">Phishing Emails &amp; Deceptive URLs</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Detect advance-fee employment fraud, fake cashier checks, typosquatting domains, and coercive phishing in real-time with dual-layer calibrated threat scoring.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-extrabold text-sm">35+</span>
              <span>Pattern Signatures</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400 font-extrabold text-sm">0–100%</span>
              <span>Calibrated Risk Score</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <div className="flex items-center gap-1.5">
              <span className="text-violet-400 font-extrabold text-sm">Forensic</span>
              <span>Neural Reasoning Trace</span>
            </div>
          </div>
        </section>

        {/* Input Form Section */}
        <section>
          <ScannerInput
            text={text}
            senderEmail={senderEmail}
            companyUrl={companyUrl}
            isScanning={isScanning}
            onTextChange={setText}
            onSenderEmailChange={setSenderEmail}
            onCompanyUrlChange={setCompanyUrl}
            onScan={executeScan}
            onSelectPreset={handleSelectPreset}
          />
        </section>

        {/* Loading Progress State */}
        {isScanning && (
          <div className="rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] p-8 text-center space-y-4 shadow-2xl animate-pulse">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
              <div
                className="absolute inset-2 rounded-full border-2 border-cyan-400 border-b-transparent animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '1s' }}
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{scanStepTitle}</h3>
              <p className="text-xs text-slate-400">
                Step {scanStep} of 3 • Deep Threat Inspection
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Verification Pipeline</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/40 border border-white/[0.08] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && !isScanning && (
          <section id="results-dashboard" className="space-y-6 pt-2">
            {/* Top Indicator */}
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-200">Forensic Threat Assessment Report</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Generated {new Date(result.timestamp).toLocaleTimeString()}
              </span>
            </div>

            {/* Row 1: Threat Gauge + AI Executive Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5">
                <ThreatGauge
                  result={result}
                  onCopyReport={handleCopyReport}
                  copied={copiedReport}
                />
              </div>
              <div className="lg:col-span-7">
                <ExecutiveSummaryCard result={result} />
              </div>
            </div>

            {/* Row 2: AI Reasoning Trace & Heuristic vs AI Delta */}
            <ReasoningTraceCard result={result} />

            {/* Row 3: Detected Red Flags */}
            <RedFlagsCard
              flags={result.detectedFlags}
              onSelectFlag={(flag) => setActiveFlag(flag)}
            />

            {/* Row 4: Interactive Forensic Document View */}
            <ForensicDocumentViewer
              text={result.scannedText}
              flags={result.detectedFlags}
              activeFlagId={activeFlag?.id}
              onSelectFlag={(flag) => setActiveFlag(flag)}
            />

            {/* Row 5: Missing Legitimate Elements */}
            <MissingElementsCard missingElements={result.missingElements} />

            {/* Row 6: Legitimacy Comparison Baseline */}
            <LegitimacyBaselineCard comparisons={result.comparisonBaseline} />

            {/* Row 7: Recommended Actions */}
            <RecommendedActionsCard
              actions={result.recommendedActions}
              onOpenToolkit={() => setIsToolkitOpen(true)}
            />
          </section>
        )}
      </main>

      {/* Incident Toolkit Modal */}
      <IncidentToolkitModal
        isOpen={isToolkitOpen}
        onClose={() => setIsToolkitOpen(false)}
        result={result}
      />

      {/* History Drawer */}
      <ScanHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectScan={(item) => setResult(item)}
        onClearHistory={() => setHistory([])}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-black/40 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            PhishGuard AI Threat Engine v2.5 Pro
          </span>
          <span>•</span>
          <span>Dual-Layer Architecture (Heuristic Pattern Engine + Gemini 3.8 Flash)</span>
          <span>•</span>
          <span>Security Boundary Enforced</span>
        </div>
      </footer>
    </div>
  );
}
