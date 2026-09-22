export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical';

export type FlagCategory = 'financial' | 'urgency' | 'identity' | 'process' | 'technical';

export interface RedFlag {
  id: string;
  category: FlagCategory;
  severity: ThreatSeverity;
  weight: number;
  label: string;
  explanation: string;
  evidence: string;
  matchedSnippet?: string;
}

export interface DomainVerification {
  target: string;
  type: 'email' | 'url';
  status: 'valid' | 'suspicious' | 'typosquat' | 'warning' | 'neutral';
  label: string;
  detail: string;
  similarity?: number;
  impersonatedBrand?: string;
}

export interface MissingElement {
  id: string;
  name: string;
  description: string;
  importance: 'critical' | 'high' | 'medium';
}

export interface LegitimacyComparison {
  anomaly: string;
  baseline: string;
}

export interface RecommendedAction {
  id: string;
  priority: 'immediate' | 'advisory' | 'reporting';
  title: string;
  description: string;
  actionType?: 'do_not_pay' | 'verify' | 'report' | 'freeze' | 'preserve';
}

export interface ScanResult {
  id: string;
  timestamp: string;
  threatScore: number;
  heuristicScore: number;
  llmAdjustment: number;
  riskLevel: 'Legitimate / Safe' | 'Low Risk' | 'Suspicious' | 'High Threat' | 'Critical Fraud';
  confidence: 'High' | 'Medium' | 'Standard';
  executiveSummary: string;
  reasoningTrace: string;
  deltaExplanation: string;
  detectedFlags: RedFlag[];
  missingElements: MissingElement[];
  comparisonBaseline: LegitimacyComparison[];
  domainVerifications: DomainVerification[];
  recommendedActions: RecommendedAction[];
  scannedText: string;
  senderEmail?: string;
  companyUrl?: string;
  aiPowered: boolean;
}

export interface PresetScenario {
  id: string;
  title: string;
  tag: string;
  type: 'fake_job' | 'm365_phish' | 'smishing' | 'bec_wire' | 'legitimate';
  threatExpected: 'High Threat' | 'Critical Fraud' | 'Legitimate / Safe';
  senderEmail: string;
  companyUrl: string;
  content: string;
}
