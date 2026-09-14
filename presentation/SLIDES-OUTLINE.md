# GridSentry — Presentation Outline

## Slide Deck: GridSentry — Power Outage Prediction & Grid Equipment Failure Advisor

### Slide 1: Title
- **GridSentry** — Predict Power Outages Before They Happen
- Team ThirdEye · IBM Bob AI Innovation Hackathon · Problem U1: Utilities Track
- One-line pitch: *"We give utility operators a 7-day warning before a transformer fails."*

### Slide 2: The Problem
- Utilities use calendar-based maintenance — not condition-based
- 3 ignored signals: sensor telemetry, live weather, incident history
- Cost of failure: $1M+/hour in blackout costs
- Visual: calendar vs. real-time dashboard

### Slide 3: Our Solution
- GridSentry: browser-based grid advisor
- Combines sensor health (45%) + weather risk (30%) + incident history (25%)
- Single 0–100 Risk Score per asset with plain-English explanation
- Prioritised maintenance plan: Immediate / Urgent / Scheduled / Routine

### Slide 4: How It Works — Architecture
- Client-side only: React + Vite + TypeScript
- Open-Meteo (free, keyless) weather API
- Seeded deterministic synthetic data (same demo every time)
- Graceful fallback: estimated weather badge, never a crash

### Slide 5: Demo Highlights
- Screenshot 1: KPI bar + risk map with colour-coded markers
- Screenshot 2: Ranked asset list, selecting a Critical asset
- Screenshot 3: Asset detail — sensor charts + weather panel + risk explanation
- Screenshot 4: Maintenance plan — full fleet, prioritised, with cost estimates

### Slide 6: Risk Scoring Engine
- Formula: sensor × 0.45 + weather × 0.30 + incidents × 0.25
- Sensor: temperature, load, vibration, oil quality
- Weather: wind speed, precipitation, storm codes, temperature extremes
- Incidents: recency-weighted count of past failures
- 22+ Vitest unit tests validate scoring correctness

### Slide 7: IBM Bob AI — How We Used It
- Built entirely with IBM Bob AI (Agent mode + Plan mode)
- Used Bob's skills system for: risk scoring spec, data gen spec, UI conventions
- Autonomous build loop: build → lint → test → verify, per phase
- 7 phases, ~50 Bobcoins budget, zero-error final build

### Slide 8: Results & Impact
- 35 assets monitored, 23 unit tests passing, zero build errors
- Early detection → $5k preventive maintenance vs $500k+ emergency repair
- Operator can act on the top risk in < 60 seconds from opening the app
- All 10 Core Features (F1-F10) implemented and working

### Slide 9: What's Next
- Integrate real SCADA sensor feeds
- Add alert notifications (email/SMS for Critical tier changes)
- Deploy to IBM Cloud (static site, no backend required)
- Add historical score trending (was it better last week?)

### Slide 10: Thank You
- Team ThirdEye
- Live demo: `npm install && npm run dev`
- GitHub: github.com/[org]/bob-ai-hackathon-Team-ThirdEye

---

## How to Create the Slide Deck

1. Use Google Slides, PowerPoint, or Keynote
2. Export as `GridSentry-Team-ThirdEye.pdf` or `.pptx`
3. Place the file in this `presentation/` directory
4. Update `submission.yaml` if the filename differs from the default
