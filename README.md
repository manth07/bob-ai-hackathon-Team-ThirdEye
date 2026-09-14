# ⚡ GridSentry

> Predict power outages before they happen.

---

## 👥 Team

| Field | Value |
|---|---|
| **Team Name** | Team ThirdEye |
| **Track** | AI |
| **Team Lead** | Manthan Vasoya — 25ce136@charusat.edu.in |
| **Members** | Manthan Vasoya, Pratik Kotecha, Ayush Padaliya, Vagisha Mankad |

---

## 🎯 Problem Statement

Utilities run maintenance on fixed calendar schedules instead of actual equipment condition. Sensor data that could predict transformer and substation failures weeks in advance is ignored, and weather forecasts are never combined with it in real time. These preventable failures cause blackouts that cost utilities $1M+ per hour.

---

## 💡 Solution

GridSentry is a browser-based grid advisor that monitors a fleet of 35 simulated grid assets (transformers, substations, feeders) by combining synthetic sensor telemetry, live weather forecasts from Open-Meteo, and historical incident data into a single composite Risk Score (0–100) per asset. It ranks assets by risk and grid-impact severity, explains in plain English why each asset is risky, and generates a prioritised maintenance plan the operator can act on today — all running client-side with no backend and no paid APIs.

---

## ✨ Key Features

- **Composite Risk Score (0–100):** Weighted formula — sensor health (45%) + weather risk (30%) + incident history (25%) — with plain-English explanation of the top contributing factor per asset.
- **Interactive Dark Risk Map:** OpenStreetMap tiles with a CSS dark filter, colour-coded CircleMarkers by risk tier (green → yellow → orange → red), click-to-select.
- **Ranked Asset List:** Sortable cards with risk badges, score bars, and tier labels; selection cross-highlights on the map.
- **Sensor Trend Charts:** 24-day history per asset for temperature, load %, vibration, and oil quality (Recharts dark theme).
- **Prioritised Maintenance Plan:** Full fleet action table with priority tier, recommended action, timeframe (Immediate / Urgent / Scheduled / Routine), and estimated cost range.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | TypeScript, CSS |
| **Frameworks** | React 18, Vite, Tailwind CSS, Recharts, React-Leaflet, Zustand |
| **IBM Technologies** | IBM Bob (full SDLC — planning, implementation, testing, debugging) |
| **Databases** | None (client-side only; all data generated deterministically in-browser) |
| **Other** | Open-Meteo API (free, keyless), OpenStreetMap tiles (keyless), Vitest, ESLint |

---

## 📁 Repository Structure

```
bob-ai-hackathon-Team-ThirdEye/
├── AGENTS.md                   Bob's auto-loaded project context
├── PHASES.md                   7-phase build plan with Bobcoin budgets
├── MEMORY.md                   Living log — read/write every session
├── submission.yaml             Hackathon submission metadata (REQUIRED)
├── README.md                   This file (REQUIRED)
├── CONTRIBUTING.md             Contribution guidelines (REQUIRED)
├── .gitignore                  (REQUIRED)
├── .bob/
│   ├── rules/                  Auto-injected project rules
│   └── skills/                 6 project-specific Bob skills
├── src/                        All source code (REQUIRED)
│   ├── data/                   Seeded asset fleet, sensor generator, incident history
│   ├── services/               Open-Meteo weather service with mock fallback
│   ├── engine/                 Risk scoring, ranking, explanation, maintenance plan
│   ├── store/                  Zustand store wiring data to UI
│   ├── components/             Map, list, detail, plan, layout components
│   ├── types/                  Domain types (Asset, SensorReading, RiskScore, …)
│   └── styles/                 Global CSS / Tailwind theme
├── docs/                       Written documentation (REQUIRED)
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md
├── demo/                       Demo artifacts (REQUIRED)
│   ├── demo-video-link.txt
│   ├── live-demo-url.txt
│   └── screenshots/
└── presentation/               Slide deck (REQUIRED)
    └── SLIDES-OUTLINE.md
```

---

## ⚡ How to Run

No API keys, no environment variables, no backend setup required.

```bash
# 1. Clone the repository
git clone https://github.com/manth07/bob-ai-hackathon-Team-ThirdEye/bob-ai-hackathon-Team-ThirdEye.git
cd bob-ai-hackathon-Team-ThirdEye

# 2. Install dependencies (~30 seconds)
npm install

# 3. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

The app renders immediately with estimated weather data, then fetches live forecasts from Open-Meteo in the background (~2–5 s). If Open-Meteo is unreachable, the app continues with estimated data and shows a **⚠ Estimated** badge — no crash, no blank screen.

Other useful commands:

```bash
npm run build    # Production build (must complete with zero TypeScript errors)
npm run lint     # ESLint (must pass with zero errors)
npm run test     # Vitest — 23 unit tests on the scoring engine
```

---

## 🖥️ Demo

| Artifact | Link |
|---|---|
| 📹 Demo Video | [See demo/demo-video-link.txt](demo/demo-video-link.txt) |
| 🌐 Live Demo | [See demo/live-demo-url.txt](demo/live-demo-url.txt) |
| 🖼️ Screenshots | [See demo/screenshots/](demo/screenshots/) |
| 📊 Presentation | [See presentation/](presentation/) |

---

## ⚠️ Known Limitations

- **Synthetic data only:** Sensor readings and incident histories are generated deterministically with a seeded PRNG — not connected to real SCADA or utility systems.
- **No authentication:** The app is a single-user, read-only dashboard with no login or multi-user support.
- **Weather is the only live external data source:** Open-Meteo provides real forecasts; everything else is simulated. If Open-Meteo is rate-limited, the app falls back to estimated weather automatically.
- **Not yet deployed publicly:** Run locally with `npm install && npm run dev`. A live URL will be added before the submission deadline if deployment is completed.
- **Single JS bundle:** The app ships as one ~700 kB bundle (Vite advisory warning, not an error). Code-splitting was intentionally deferred to stay within the Bobcoin budget.

---

## 🏅 What We're Most Proud Of

The **deterministic risk scoring engine** is the heart of GridSentry. It's a pure TypeScript function — no side effects, no randomness, 22 Vitest unit tests — that takes three independent data streams (sensor telemetry, live weather, incident history) and reduces them to a single 0–100 score with an automatically generated plain-English explanation. A judge with no utilities background can read "Elevated sensor readings (health index 78/100) indicate potential equipment stress. Recommend urgent (within 7 days) inspection." and immediately understand both the risk and the action, without needing to interpret any raw numbers. That translation from data to decision is the whole value of the product.
