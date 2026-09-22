import { RedFlag, DomainVerification, MissingElement, LegitimacyComparison, RecommendedAction } from '../types.ts';

const KNOWN_BRANDS = [
  'google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'paypal.com',
  'meta.com', 'netflix.com', 'chase.com', 'wellsfargo.com', 'bankofamerica.com',
  'stripe.com', 'linkedin.com', 'adobe.com', 'cisco.com', 'salesforce.com',
  'dropbox.com', 'zoom.us', 'slack.com', 'docuSign.com', 'oracle.com',
  'fedex.com', 'usps.com', 'ups.com', 'dhl.com', 'irs.gov'
];

const FREE_EMAIL_PROVIDERS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'proton.me', 'protonmail.com', 'mail.com', 'zoho.com',
  'yandex.com', 'gmx.com'
];

const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.click', '.buzz', '.work', '.icu', '.tk', '.ml',
  '.ga', '.cf', '.gq', '.rest', '.quest', '.monster', '.ru', '.cn', '.su'
];

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

export function extractDomain(input: string): string {
  if (!input) return '';
  let str = input.trim().toLowerCase();
  str = str.replace(/^[a-z]+:\/\//i, '');
  str = str.split('/')[0];
  str = str.split('@').pop() || '';
  str = str.split(':')[0];
  return str.replace(/^\.+|\.+$/g, '');
}

export function extractEmailsAndUrls(text: string): { emails: string[]; urls: string[] } {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const urlRegex = /(https?:\/\/[^\s<>"'()]+|[a-zA-Z0-9-]+\.(?:com|org|net|io|co|xyz|top|info|site|online|tech)[^\s<>"'()]*)/gi;

  const emailMatches = text.match(emailRegex) || [];
  const urlMatches = text.match(urlRegex) || [];

  return {
    emails: Array.from(new Set(emailMatches)),
    urls: Array.from(new Set(urlMatches))
  };
}

export interface HeuristicRule {
  pattern: RegExp;
  category: RedFlag['category'];
  severity: RedFlag['severity'];
  weight: number;
  label: string;
  explanation: string;
  defaultEvidence: string;
}

const RULES: HeuristicRule[] = [
  // Financial
  {
    pattern: /(\$\d[\d,]*|\bcheck\b|funds?|stipend).{0,90}(zelle|venmo|cash\s?app|western union|wire transfer|moneygram|bitcoin|crypto|usdt|gift card|amazon card|google play card|apple card|itunes card)/i,
    category: 'financial',
    severity: 'critical',
    weight: 35,
    label: 'Demands payment via untraceable / non-refundable channel',
    explanation: 'Requests money or reimbursement through gift cards, Zelle, Cash App, wire transfer, or cryptocurrency. This is the #1 universal signature of advance-fee and employment scams.',
    defaultEvidence: 'Transfer funds or purchase cards via Zelle / gift card'
  },
  {
    pattern: /deposit.{0,40}(check|cheque)|(check|cheque).{0,40}deposit|mail.{0,30}(check|cheque)|cashier'?s check/i,
    category: 'financial',
    severity: 'critical',
    weight: 30,
    label: 'Check bounce & advance-fee counterfeit scheme',
    explanation: 'Scammer offers to mail a cashier check or electronic deposit, instructing candidate to deposit it and immediately transfer a portion back. In reality, checks take days to bounce, leaving victim liable.',
    defaultEvidence: 'Deposit company check and forward excess funds'
  },
  {
    pattern: /(equipment|workstation|laptop|hardware|home office).{0,40}(vendor|supplier|authorized dealer|our portal|approved merchant)/i,
    category: 'financial',
    severity: 'high',
    weight: 25,
    label: 'Mandatory equipment purchase from "approved vendor"',
    explanation: 'Legitimate employers either ship enterprise hardware directly or provide pre-provisioned MDM devices. Directing candidates to buy from an unknown vendor using candidate funds is fraud.',
    defaultEvidence: 'Must purchase home workstation from approved vendor'
  },
  {
    pattern: /gift card|amazon (e-)?gift|itunes voucher|google play (gift )?card|steam card|apple gift card/i,
    category: 'financial',
    severity: 'critical',
    weight: 30,
    label: 'Gift cards specified for payment or verification',
    explanation: 'Federal Trade Commission (FTC) warns that legitimate businesses never ask for payment or hardware reserves via gift card pin numbers.',
    defaultEvidence: 'Pay or verify with gift card codes'
  },
  {
    pattern: /(upfront|advance|registration|clearance|training|insurance) (fee|cost|payment|deposit)|pay first|security deposit of \$\d/i,
    category: 'financial',
    severity: 'high',
    weight: 25,
    label: 'Upfront onboarding or training fee requirement',
    explanation: 'Candidates are never legally required to pay upfront recruitment fees, background check fees, or training costs as a prerequisite for hiring.',
    defaultEvidence: 'Upfront deposit/fee requested before work start'
  },

  // Urgency
  {
    pattern: /within (24|12|48|2) hours|respond immediately|act now|do not delay|don'?t delay|reply (now|asap|today|immediately)|urgent notice/i,
    category: 'urgency',
    severity: 'medium',
    weight: 15,
    label: 'Manufactured artificial urgency and panic triggers',
    explanation: 'Attackers create rapid time constraints to bypass critical thinking and prevent candidates or employees from verifying the sender through external channels.',
    defaultEvidence: 'Must complete and reply within strict 24hr deadline'
  },
  {
    pattern: /(offer|position|account|access).{0,25}(forfeited|cancelled|terminated|suspended|revoked|closed)|final warning|last chance/i,
    category: 'urgency',
    severity: 'high',
    weight: 20,
    label: 'Coercive deadline & penalty threats',
    explanation: 'Threatening immediate cancellation or severe penalty creates fear of missing out or panic, typical of social engineering psychology.',
    defaultEvidence: 'Position will be forfeited if not confirmed today'
  },

  // Identity / Recruiter
  {
    pattern: /(dear (applicant|candidate|job seeker|sir|madam|beneficiary|customer|client|friend|user|member))|(to whom it may concern)/i,
    category: 'identity',
    severity: 'low',
    weight: 10,
    label: 'Impersonal or mass-blast generic greeting',
    explanation: 'Legitimate recruiters and enterprise services address you by your verified name, especially at the formal offer or security alert phase.',
    defaultEvidence: 'Generic greeting (e.g. Dear Applicant / Dear User)'
  },
  {
    pattern: /(telegram|whatsapp|signal|hangouts?|skype chat).{0,60}(interview|connect|recruiter|hr|manager|hiring|task)/i,
    category: 'process',
    severity: 'high',
    weight: 25,
    label: 'Off-platform interview via encrypted chat app',
    explanation: 'Conducting hiring interviews solely via Telegram, WhatsApp, or Signal text chats is a primary evasion tactic to prevent corporate surveillance and IP tracing.',
    defaultEvidence: 'Interview conducted via Telegram / WhatsApp'
  },

  // Process / Offer Validity
  {
    pattern: /no interview (is )?(needed|required)|selected without (an )?interview|immediate hiring without|start immediately without meeting/i,
    category: 'process',
    severity: 'critical',
    weight: 30,
    label: 'Job offer granted without formal video/onsite interview',
    explanation: 'Corporate entities never extend contractual employment without multiple stages of structured interviews, identity vetting, and managerial approvals.',
    defaultEvidence: 'Job awarded without prior formal interview'
  },
  {
    pattern: /(\$|usd\s?)(6[5-9]|[7-9]\d|1[0-4]\d)\s?(\/|\s?per\s?)(hr|hour)|data entry.{0,40}\$(5[0-9]|[6-9]\d)/i,
    category: 'process',
    severity: 'high',
    weight: 20,
    label: 'Inflated compensation for entry-level tasks',
    explanation: 'Unusually high hourly rates ($65-$120/hr) for generic tasks like data entry, copy-typing, or remote coordination is a classic bait designed to induce compliance.',
    defaultEvidence: 'Exorbitant compensation for entry-level remote work'
  },
  {
    pattern: /keep (this|it) (strictly )?(confidential|secret)|do not discuss with (your )?bank|secret shopper|mystery shopper/i,
    category: 'process',
    severity: 'critical',
    weight: 30,
    label: 'Secrecy mandate & bank-teller evasion instructions',
    explanation: 'Explicitly instructing someone to keep financial transactions secret from bank personnel or family is a definitive red flag of mule or check-kiting fraud.',
    defaultEvidence: 'Instructs secrecy / do not tell bank teller'
  },
  {
    pattern: /(provide|send|submit).{0,35}(social security|ssn|credit card|routing number|passport scan|driver'?s license|id photo|card number|cvv|pin)/i,
    category: 'technical',
    severity: 'high',
    weight: 25,
    label: 'Pre-contract sensitive PII & financial data harvesting',
    explanation: 'Demanding SSN, passport copies, or bank routing numbers via unsecured email or chat before signing a formalized contract is an identity theft trap.',
    defaultEvidence: 'Requests SSN or direct banking credentials upfront'
  },
  {
    pattern: /(password|account).{0,30}(expired|compromised|reset required|unauthorized login)|(verify|re-enter).{0,30}(credentials|pin|password)/i,
    category: 'technical',
    severity: 'high',
    weight: 20,
    label: 'Deceptive credential harvesting / login prompt',
    explanation: 'Classic credential phishing lure designed to redirect the user to a spoofed single-sign-on (SSO) login portal to harvest enterprise passwords.',
    defaultEvidence: 'Requests urgent credential verification / login link'
  }
];

export function analyzeDomains(senderEmail: string, companyUrl: string): DomainVerification[] {
  const verifications: DomainVerification[] = [];

  // Sender Email Analysis
  if (senderEmail && senderEmail.trim()) {
    const emailDomain = extractDomain(senderEmail);
    const isFree = FREE_EMAIL_PROVIDERS.includes(emailDomain);

    if (isFree) {
      verifications.push({
        target: senderEmail,
        type: 'email',
        status: 'suspicious',
        label: 'Free Webmail Service Recruiter',
        detail: `Sent from ${emailDomain}. Legitimate corporate recruiters use verified enterprise domains, not free personal email accounts.`
      });
    } else {
      // Check for typosquatting vs known brands
      let typosquatMatch: { brand: string; dist: number } | null = null;
      for (const brand of KNOWN_BRANDS) {
        const brandClean = brand.replace(/\.[a-z]+$/, '');
        const emailClean = emailDomain.replace(/\.[a-z]+$/, '');
        const dist = levenshtein(emailClean, brandClean);
        if (dist > 0 && dist <= 2 && emailDomain !== brand) {
          typosquatMatch = { brand, dist };
          break;
        }
      }

      if (typosquatMatch) {
        verifications.push({
          target: senderEmail,
          type: 'email',
          status: 'typosquat',
          label: 'Brand Typosquatting / Impersonation',
          detail: `Domain "${emailDomain}" closely mimics "${typosquatMatch.brand}" (Levenshtein distance ${typosquatMatch.dist}). High probability of deceptive domain registration.`,
          similarity: typosquatMatch.dist,
          impersonatedBrand: typosquatMatch.brand
        });
      } else {
        const tld = '.' + (emailDomain.split('.').pop() || '');
        if (SUSPICIOUS_TLDS.includes(tld)) {
          verifications.push({
            target: senderEmail,
            type: 'email',
            status: 'warning',
            label: 'High-Risk TLD in Sender Address',
            detail: `Domain uses top-level domain ${tld}, frequently abused by threat actors for disposable spam.`
          });
        } else {
          verifications.push({
            target: senderEmail,
            type: 'email',
            status: 'valid',
            label: 'Custom Domain Format',
            detail: `Corporate domain format recognized (${emailDomain}). Verify SPF/DKIM records before trust.`
          });
        }
      }
    }
  }

  // Company URL Analysis
  if (companyUrl && companyUrl.trim()) {
    const urlDomain = extractDomain(companyUrl);
    const isIp = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(urlDomain);
    const tld = '.' + (urlDomain.split('.').pop() || '');

    if (isIp) {
      verifications.push({
        target: companyUrl,
        type: 'url',
        status: 'suspicious',
        label: 'Raw IP Address Host',
        detail: `The URL links directly to an IPv4 host (${urlDomain}), bypassing DNS oversight.`
      });
    } else if (SUSPICIOUS_TLDS.includes(tld)) {
      verifications.push({
        target: companyUrl,
        type: 'url',
        status: 'warning',
        label: 'Disreputable Domain TLD',
        detail: `The destination uses high-abuse TLD "${tld}" with elevated fraud incidence.`
      });
    } else {
      let typosquatMatch: { brand: string; dist: number } | null = null;
      for (const brand of KNOWN_BRANDS) {
        const brandClean = brand.replace(/\.[a-z]+$/, '');
        const urlClean = urlDomain.replace(/\.[a-z]+$/, '');
        const dist = levenshtein(urlClean, brandClean);
        if (dist > 0 && dist <= 2 && urlDomain !== brand) {
          typosquatMatch = { brand, dist };
          break;
        }
      }

      if (typosquatMatch) {
        verifications.push({
          target: companyUrl,
          type: 'url',
          status: 'typosquat',
          label: 'Deceptive Lookalike URL',
          detail: `URL "${urlDomain}" is an impostor domain imitating "${typosquatMatch.brand}".`,
          similarity: typosquatMatch.dist,
          impersonatedBrand: typosquatMatch.brand
        });
      } else {
        verifications.push({
          target: companyUrl,
          type: 'url',
          status: 'valid',
          label: 'Standard URL Structure',
          detail: `Valid structure (${urlDomain}). Always inspect SSL cert and WHOIS registration age.`
        });
      }
    }

    // Sender Domain vs Company URL mismatch check
    if (senderEmail && senderEmail.trim()) {
      const emailDomain = extractDomain(senderEmail);
      if (emailDomain && urlDomain && emailDomain !== urlDomain && !FREE_EMAIL_PROVIDERS.includes(emailDomain)) {
        verifications.push({
          target: `${emailDomain} ⇄ ${urlDomain}`,
          type: 'email',
          status: 'warning',
          label: 'Sender / Company Domain Discrepancy',
          detail: `Sender claims to represent "${urlDomain}" but sent email from mismatched domain "${emailDomain}".`
        });
      }
    }
  }

  return verifications;
}

export function runHeuristicScan(
  text: string,
  senderEmail: string = '',
  companyUrl: string = ''
): {
  heuristicScore: number;
  detectedFlags: RedFlag[];
  domainVerifications: DomainVerification[];
  missingElements: MissingElement[];
  comparisonBaseline: LegitimacyComparison[];
  recommendedActions: RecommendedAction[];
} {
  const flags: RedFlag[] = [];
  let scoreAccumulator = 0;

  RULES.forEach((rule, idx) => {
    const match = text.match(rule.pattern);
    if (match) {
      scoreAccumulator += rule.weight;
      flags.push({
        id: `flag_${idx}_${Date.now()}`,
        category: rule.category,
        severity: rule.severity,
        weight: rule.weight,
        label: rule.label,
        explanation: rule.explanation,
        evidence: match[0],
        matchedSnippet: match[0]
      });
    }
  });

  const domainVerifications = analyzeDomains(senderEmail, companyUrl);
  domainVerifications.forEach(d => {
    if (d.status === 'suspicious') scoreAccumulator += 20;
    if (d.status === 'typosquat') scoreAccumulator += 30;
    if (d.status === 'warning') scoreAccumulator += 15;
  });

  // Calculate Heuristic Score clamped between 0 and 100
  const heuristicScore = Math.min(100, Math.max(0, Math.round(scoreAccumulator)));

  // Missing Legitimate Elements
  const missingElements: MissingElement[] = [];
  const textLower = text.toLowerCase();

  if (!/(docusign|sign now|adobe sign|pandadoc|portal|formal agreement)/i.test(textLower)) {
    missingElements.push({
      id: 'miss_sign',
      name: 'Verifiable Signature Service',
      description: 'Absence of secure e-signature workflows (DocuSign, Adobe Sign, or enterprise HR portal).',
      importance: 'high'
    });
  }

  if (!/(benefits|401k|health insurance|pto|paid time off|dental|vision)/i.test(textLower)) {
    missingElements.push({
      id: 'miss_benefits',
      name: 'Corporate Benefits Breakdown',
      description: 'Standard employment packages outline 401(k), health, and PTO policies in detail.',
      importance: 'medium'
    });
  }

  if (!/(hr contact|human resources|phone:|tel:|direct extension|\+1\s?\d{3})/i.test(textLower)) {
    missingElements.push({
      id: 'miss_hr_contact',
      name: 'Direct HR Telephone & Extension',
      description: 'No verifiable corporate telephone extension or direct named HR contact.',
      importance: 'critical'
    });
  }

  if (!/(interviewed with|prior discussions|round \d|screening call|technical assessment)/i.test(textLower)) {
    missingElements.push({
      id: 'miss_interview_ref',
      name: 'Prior Interview Audit Trail',
      description: 'Does not reference any prior screening rounds, interview panels, or hiring manager conversations.',
      importance: 'critical'
    });
  }

  if (!/(w-4|i-9|tax documentation|employment authorization)/i.test(textLower)) {
    missingElements.push({
      id: 'miss_tax_forms',
      name: 'Formal Tax & Verification Compliance',
      description: 'Missing standard IRS W-4 and federal I-9 onboarding compliance protocols.',
      importance: 'medium'
    });
  }

  // Legitimacy Comparison Baseline
  const comparisonBaseline: LegitimacyComparison[] = [
    {
      anomaly: flags.some(f => f.category === 'financial')
        ? 'Requests candidate funds, checks, or third-party hardware payments'
        : 'Lacks transparent corporate reimbursement guarantees',
      baseline: 'Company provides 100% company-owned hardware or direct corporate shipping'
    },
    {
      anomaly: flags.some(f => f.category === 'process')
        ? 'Rushed onboarding or off-platform communication (Telegram/Signal/Chat)'
        : 'Vague interview history or unstructured evaluation metrics',
      baseline: 'Multi-stage structured video/onsite interviews with prospective team'
    },
    {
      anomaly: domainVerifications.some(d => d.status !== 'valid')
        ? 'Suspicious domain, free webmail, or unverified sender origin'
        : 'Sender address requires secondary cryptographic verification',
      baseline: 'Strict corporate domain with authenticated SPF/DKIM/DMARC headers'
    },
    {
      anomaly: flags.some(f => f.category === 'urgency')
        ? 'Coercive time pressure with punitive cancellation threats'
        : 'Standard offer window without artificial panic deadlines',
      baseline: 'Standard 3–7 business day review period with clear point of contact'
    }
  ];

  // Recommended Actions
  const recommendedActions: RecommendedAction[] = [];
  if (heuristicScore >= 50) {
    recommendedActions.push({
      id: 'act_stop_funds',
      priority: 'immediate',
      title: 'Halt All Financial Transactions',
      description: 'Do NOT cash any checks, wire funds, or purchase gift cards/equipment. Any sent funds cannot be recovered.',
      actionType: 'do_not_pay'
    });
    recommendedActions.push({
      id: 'act_verify_careers',
      priority: 'immediate',
      title: 'Verify via Official Career Directory',
      description: 'Look up the company\'s official website independently via search engine. Contact their official HR department to verify if the job requisition exists.',
      actionType: 'verify'
    });
    recommendedActions.push({
      id: 'act_report_ic3',
      priority: 'reporting',
      title: 'File Incident Report with IC3 & FTC',
      description: 'Report the scam email and payment demands to the FBI Internet Crime Complaint Center (ic3.gov) and FTC (reportfraud.ftc.gov).',
      actionType: 'report'
    });
  } else {
    recommendedActions.push({
      id: 'act_check_email_headers',
      priority: 'advisory',
      title: 'Inspect Email Transport Headers',
      description: 'Check the raw email headers to confirm SPF, DKIM, and DMARC alignments pass with the sender\'s published policies.',
      actionType: 'verify'
    });
    recommendedActions.push({
      id: 'act_call_switchboard',
      priority: 'advisory',
      title: 'Call Company Switchboard',
      description: 'Dial the main public phone number of the hiring organization and ask to be connected with the named hiring manager or recruiter.',
      actionType: 'verify'
    });
  }

  return {
    heuristicScore,
    detectedFlags: flags,
    domainVerifications,
    missingElements,
    comparisonBaseline,
    recommendedActions
  };
}
