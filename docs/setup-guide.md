# Setup Guide

## Prerequisites

- **Node.js** 18 or later — check with `node --version`
- **npm** 9 or later — check with `npm --version`
- A modern browser (Chrome, Firefox, Edge, Safari)
- An internet connection (for live weather data from Open-Meteo — the app works offline with estimated data if unavailable)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/[your-github-org]/bob-ai-hackathon-Team-ThirdEye.git
cd bob-ai-hackathon-Team-ThirdEye

# 2. Install dependencies (takes ~30 seconds)
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## No Configuration Required

GridSentry uses no paid APIs and requires no environment variables. The `.env.example` file is provided for reference but does not need to be copied or filled in.

The app will:
1. Immediately render all 35 grid assets with estimated weather data (from seeded mock)
2. Fetch live weather in the background from [Open-Meteo](https://open-meteo.com/) (free, no key)
3. Update risk scores with live data when the weather fetch completes (~2-5 seconds)

If Open-Meteo is unreachable (e.g., offline), the app continues working with estimated weather and shows a **⚠ Estimated** badge. No crash, no blank screen.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server at http://localhost:5173 |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint (must pass with zero errors) |
| `npm run test` | Run Vitest unit tests |

## Verifying the Build

```bash
# Type-check and build
npm run build

# Should output: ✓ built in Xs (no TypeScript errors)

# Run tests
npm run test

# Should output: 23 passed (0 failed)
```

## Troubleshooting

**`npm install` fails:**
- Make sure you're using Node.js 18+. Run `node --version`.
- Delete `node_modules/` and `package-lock.json`, then retry.

**Map tiles don't load:**
- This requires an internet connection to CARTO tile servers. On an offline network, the map will show a dark background with asset markers but no tiles.

**Weather shows "⚠ Estimated":**
- This is expected if Open-Meteo is unreachable or rate-limited. All features work normally with estimated weather.

**Port 5173 already in use:**
- Vite will automatically try port 5174, 5175, etc. Check the terminal output for the actual URL.
