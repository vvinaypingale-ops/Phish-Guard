import { PresetScenario } from '../types.ts';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'preset_fake_job',
    title: 'Counterfeit Check & Equipment Scam',
    tag: 'Advance-Fee Job Scam',
    type: 'fake_job',
    threatExpected: 'Critical Fraud',
    senderEmail: 'recruitment.team@google-careers-portal.net',
    companyUrl: 'https://careers-google-verify.xyz/onboarding',
    content: `CONGRATULATIONS! EMPLOYMENT OFFER NOTIFICATION

Dear Applicant,

Following review of your resume on LinkedIn/Indeed, the Hiring Board of Google Cloud Operations is pleased to offer you the position of Remote Senior Data Entry & Operations Specialist.

Position Details:
- Compensation: $85.00 per hour (Bi-weekly payment via direct deposit)
- Hours: Flexible 25-35 hours/week
- Status: 100% Work from Home

Due to rapid expansion, no prior interview is required; your credentials and background questionnaire have qualified you immediately.

EQUIPMENT PROCUREMENT & ONBOARDING REQUIREMENT:
To establish your home office workstation (Apple MacBook Pro M3, Encrypted Dual Monitors, Cisco Secure Router), our Accounting Dept has issued a cashier check of $4,850.00 to your mailing address.
Upon receipt, you must deposit this check into your bank account immediately. Within 24 hours of deposit, send $2,450.00 via Zelle, Cash App, or Apple Gift Cards to our approved regional logistics vendor to reserve your equipment courier. The remaining balance ($2,400) is your sign-on stipend.

IMPORTANT: You must keep this confidential and complete transfer within 24 hours, or your employment offer will be forfeited and terminated.

Reply IMMEDIATELY to confirm your receipt.

Warm regards,
Sarah Jenkins
Google Global Talent Acquisition
recruitment.team@google-careers-portal.net`
  },
  {
    id: 'preset_m365_phish',
    title: 'Microsoft 365 Security Quarantine',
    tag: 'Credential Harvesting',
    type: 'm365_phish',
    threatExpected: 'High Threat',
    senderEmail: 'no-reply@security-microsoft365-alert.com',
    companyUrl: 'http://185.220.101.42/auth/login?session=ms365',
    content: `MICROSOFT 365 SECURITY ALERT: 7 INCOMING MESSAGES QUARANTINED

Dear User,

Your corporate Microsoft 365 account has experienced multiple failed authentication attempts from an unrecognized IP address (Moscow, Russia).

As a safety protocol, 7 high-priority business emails have been withheld and quarantined on the Microsoft Exchange Server.

ACTION REQUIRED:
To prevent permanent account deletion and release your pending emails, verify your credentials within 12 hours:

Click here to verify: http://185.220.101.42/auth/login?session=ms365

Failure to re-authenticate credentials immediately will result in complete account deactivation and termination of Outlook exchange services.

Microsoft Trust & Safety Center
Notification ID: #MS-992144-SEC`
  },
  {
    id: 'preset_usps_smish',
    title: 'USPS Package Redelivery Smishing',
    tag: 'SMS / Delivery Scam',
    type: 'smishing',
    threatExpected: 'High Threat',
    senderEmail: 'delivery-support@usps-tracking-info.top',
    companyUrl: 'https://usps-parcel-redelivery.buzz/pay-fee',
    content: `[U.S. Postal Service Alert]: Your parcel package tracking number #US94001092023 cannot be delivered due to an incomplete street address and an unpaid redelivery fee of $1.85.

Please update your delivery address and settle the customs clearing fee within 24 hours to prevent your package from being returned to the sender or destroyed.

Update now: https://usps-parcel-redelivery.buzz/pay-fee

Note: We accept debit cards or pre-paid voucher cards for immediate clearing.`
  },
  {
    id: 'preset_bec_wire',
    title: 'CEO Impersonation Urgent Wire (BEC)',
    tag: 'Business Email Compromise',
    type: 'bec_wire',
    threatExpected: 'Critical Fraud',
    senderEmail: 'ceo.corporate.office77@gmail.com',
    companyUrl: 'https://ourcompany.com',
    content: `From: David Sterling (CEO)
To: Finance / Payroll Director
Subject: URGENT & CONFIDENTIAL: Acquisition Wire Transfer

Are you at your desk right now? I am currently locked in an all-day confidential board meeting for an emergency corporate acquisition.

I need you to process an urgent wire transfer of $42,500 immediately to our outside counsel's escrow account before 2:00 PM today to finalize the contract closing.

Please do not call me as I cannot pick up during the meeting, and keep this strictly confidential from other team members until the press release is announced. Reply back to this email so I can send you the escrow routing and account numbers right away.

Treat this with top priority.

David Sterling
Chief Executive Officer`
  },
  {
    id: 'preset_legit_offer',
    title: 'Legitimate Corporate Offer (Stripe / Google)',
    tag: 'Clean Benchmark',
    type: 'legitimate',
    threatExpected: 'Legitimate / Safe',
    senderEmail: 'talent-recruiting@stripe.com',
    companyUrl: 'https://stripe.com/jobs',
    content: `Dear Alex Morgan,

Following your conversations with our Engineering Directors and your final on-site panel interview last Tuesday, we are thrilled to offer you the position of Senior Infrastructure Engineer at Stripe!

Role Summary:
- Position: Senior Infrastructure Engineer (Level L5)
- Organization: Core Platform & Payments Infrastructure
- Reporting Manager: Elena Rostova, VP of Infrastructure
- Annual Base Salary: $185,000 USD (paid bi-weekly)
- Equity: $240,000 initial RSU grant vesting over 4 years
- Comprehensive benefits: 100% covered health, dental, and vision; 401(k) matching up to 6%; flexible PTO policy

Equipment & Hardware:
Stripe will ship pre-configured, encrypted corporate MacBook hardware and IT accessories directly to your home address via secure FedEx tracking prior to your start date of October 15. You will never be asked to purchase equipment or transfer money.

Acceptance Instructions:
Please review and execute the formal employment agreement and intellectual property disclosure via the DocuSign envelope linked in your candidate portal. Please respond by Friday, October 3.

If you have any questions, feel free to contact me directly at (415) 555-0192 or your hiring manager.

Congratulations! We cannot wait to welcome you to the team.

Warmly,
Marcus Vance
Senior Talent Lead, Stripe Engineering
talent-recruiting@stripe.com
https://stripe.com`
  }
];
