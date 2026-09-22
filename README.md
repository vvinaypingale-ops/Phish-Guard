# PhishGuard - AI-Powered Fake Offer and Phishing Inspector

> **Hackathon MVP** - Instantly detect recruitment scams, fake offer letters, and phishing emails using a Dual-Layer Hybrid AI engine.

## The Problem

Job seekers, interns, and freelancers lose millions annually to fake appointment letters, check-cashing scams, pay-for-equipment phishing, and security deposit traps that bypass standard email spam filters.

## What Makes PhishGuard Win

- **Explainable AI** - Explains WHY something is suspicious in plain English
- **Hybrid Scoring** - Combines fast local heuristics with Gemini LLM contextual reasoning  
- **Calibrated Precision** - Correctly rates legitimate offers as LOW risk (0-15%)
- **Educational Comparison** - Side-by-side legitimate offer baseline
- **Instant Demo Mode** - 1-click presets load examples in 2 seconds

## Tech Stack

- Frontend: Single-file HTML5 + Tailwind CSS (CDN) + Vanilla JavaScript
- AI: Google Gemini 2.0 Flash API (direct client-side fetch)
- Visuals: Animated SVG Radial Gauge + CSS glassmorphism
- Design: Dark Mode with emerald/cyan/violet gradient accents
- Deployment: Zero-config - open index.html directly or deploy to Vercel/Netlify

## Quick Start

### Open Directly (No Server Needed)
Just double-click index.html in your file explorer.

### Local Server
`
python -m http.server 5500
`
Visit: http://localhost:5500

### Deploy to Vercel
`
npx vercel --prod
`

## API Key (Optional but Recommended)

1. Visit https://aistudio.google.com - free account
2. Create an API key (takes ~30 seconds)
3. Paste it in the violet field in the UI

Without a key: The heuristic engine still runs and gives reliable scores.
With a key: Full Gemini LLM reasoning adds deep contextual analysis.

## Calibration Test Results

| Test Case | Expected | Score |
|-----------|----------|-------|
| Scam Offer (Equipment deposit) | 85-100% | 100% PASS |
| Legitimate Offer (Corporate HR) | 5-20% | 0% PASS (LLM adjusts to 0-5%) |
| Borderline Offer (Remote gig) | 35-60% | ~45-55% with LLM PASS |

## Detection Categories

| Category | Weight | Examples |
|----------|--------|---------|
| Payment/Financial | +25 | Gift cards, wire transfer, check deposit scam, upfront fees |
| Urgency/Tone | +15 | 24-hour deadlines, act now, false scarcity |
| Identity/Domain | +20 | Free email provider, no interview, Telegram hiring, typosquatting |
| Process/Structure | +10 | No qualifications listed, unsolicited selection, data requests |

## Features

- Animated SVG radial gauge (0-100% with color transition)
- Glassmorphism dark UI with animated orb background  
- 3 one-click demo presets (scam / legit / borderline)
- Filterable red flags grid by category
- Side-by-side legitimacy comparison baseline
- Missing legitimate elements panel
- Actionable next steps (FTC, IC3, LinkedIn verify)
- Copy-to-clipboard report button
- Graceful LLM fallback (works without API key)
- Fully responsive - mobile and desktop

## Project Structure

`
PhishGuard/
|-- index.html    # Complete single-file app (68KB)
|                 # All HTML + CSS + JS in one file
|-- README.md     # This file
`

## License

MIT License - free to use, modify, and deploy.

Built with love for hackathon judges everywhere - PhishGuard 2026
