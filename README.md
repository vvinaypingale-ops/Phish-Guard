# PhishGuard AI 🛡️

**Forensic Fraud Inspector & Phishing Threat Intelligence Engine**

PhishGuard AI analyzes suspicious communications—such as scam offer letters, phishing emails, smishing SMS messages, and executive impersonation (BEC)—using a hybrid heuristic engine and Gemini AI model to detect social engineering tactics, fake cashier check schemes, and domain spoofing.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vvinaypingale-ops/Phish-Guard.git
   cd Phish-Guard
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables (Optional):**
   Set your Gemini API key in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Features

- **Hybrid Forensic Analysis**: Combines instant offline pattern matching rules with Gemini 3.6 Flash deep reasoning.
- **Domain Spoofing Verification**: Checks for homograph attacks, typosquatting, and suspicious TLDs.
- **Risk Scoring (0-100)**: Evaluates threat severity across Financial, Urgency, Credential Harvesting, and Identity categories.
- **Actionable Incident Toolkit**: Provides step-by-step guidance for reporting to IC3/FTC and halting fraudulent transfers.
