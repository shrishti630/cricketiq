# 🏏 CricketIQ — Premier IPL Intelligence Hub (Light UI)

A modern, high-performance **IPL Analytics and Agentic Cricket Intelligence Platform** built strictly adhering to the **Premier Zone Light Aesthetic** (`https://premier-zone-frontend.vercel.app/`).

---

## 🌟 Premier Zone Light UI Features

- **Crisp Sports Portal Aesthetic**: Pure white card surfaces (`#FFFFFF`), subtle borders (`#E2E8F0`), and high-contrast charcoal typography (`#0F172A`).
- **Official Franchise Crests Ticker**: Top banner featuring badges for all 10 IPL franchises (`CSK`, `MI`, `RCB`, `KKR`, `SRH`, `RR`, `GT`, `LSG`, `DC`, `PK`) with live score indicators.
- **Match Center Dashboard**: Live scoreboard (CSK vs MI El Clásico), real-time logistic win probability bar, upcoming fixtures, and quick AI scenario chips.
- **Club Hubs**: Franchise grid showing trophies, captains, head coaches, home grounds, and interactive squad roster modals.
- **Player Scout & Comparator**: Side-by-side comparator that evaluates metric deltas (`Strike Rate`, `Average`, `Boundaries`, `Wickets`, `Economy`, `Fantasy Floor`).
- **Interactive Fantasy Pitch Builder**: Visual pitch displaying role slots (`WK`, `BAT`, `AR`, `BOWL`), credit counter (`100.0` max), `2x` Captain and `1.5x` Vice-Captain selectors, and an **"AI Auto-Optimize Squad"** solver.
- **Autonomous Multi-Agent Layer**: Standalone client-side agent engine ensuring **all chatbot queries, comparisons, fantasy optimization, and playoff simulations run 100% smoothly on Vercel without needing any external server**.

---

## 🚀 Instant Deployment on Vercel

This repository is pre-configured with `vercel.json` for immediate one-click deployment on Vercel.

### Method 1: Deploy via Vercel Web Dashboard (Easiest)
1. Go to [https://vercel.com/new](https://vercel.com/new) and log in.
2. Select **Import Git Repository** and choose **`shrishti630/cricketiq`**.
3. Framework preset will automatically be detected as **Vite**.
4. Click **Deploy**! 

*Your application will go live at `https://cricketiq.vercel.app` (or similar assigned domain) in ~45 seconds!*

### Method 2: Deploy via Vercel CLI
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open your browser at `http://localhost:5173`.
