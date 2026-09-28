# 🌿 Pollu Sense — Serverless Air Quality & Geospatial Analytics Dashboard

**Pollu Sense** is a production-grade, serverless web application engineered for real-time and historical Air Quality Index (AQI) trend analysis, geospatial pollutant heatmapping, and public health impact advisory across metropolitan regions in India.

Built specifically for high-intensity hackathon evaluation with a clean **Feature-Sliced Architecture**, zero-backend overhead, and reactive **Zustand** state synchronization.

---

## 🛠️ Architecture & Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18+ & Vite** | Lightning-fast HMR and bundle optimization |
| **TypeScript (Strict)** | Strict typing across all data models and stores |
| **Tailwind CSS** | Dark theme, glassmorphism, responsive flex/grid layouts |
| **Zustand** | Global client-side store with derived selectors |
| **React-Leaflet & Leaflet** | Geospatial interactive map with CartoDB Dark Matter tiles |
| **Recharts** | Interactive time-series trajectory and pollutant bar charts |
| **Lucide React** | Consistent iconography |

---

## 📂 Project Structure (Feature-Based Design)

```
pollu-sense/
├── src/
│   ├── assets/
│   │   └── aqi_data.json                 # Pre-cleaned mock dataset with historical telemetry
│   ├── core/
│   │   └── AppEntry.tsx                  # Core app container mounting the main dashboard
│   ├── features/
│   │   ├── dashboard/
│   │   │   ├── PollutionDashboard.tsx    # Primary responsive dashboard layout & export logic
│   │   │   └── AqiKPIStats.tsx           # Health impact alert banner & dynamic KPI cards
│   │   ├── map/
│   │   │   └── GeospatialAqiMap.tsx      # React-Leaflet interactive map with color brackets
│   │   └── analytics/
│   │       ├── TemporalTrendChart.tsx    # Recharts time-series line chart with threshold lines
│   │       └── PollutantComparisonBar.tsx# Recharts bar chart for PM2.5, PM10, NO2, and limits
│   ├── shared/
│   │   ├── components/
│   │   │   └── FilterSidebar.tsx         # City selector, search, date range & metric filters
│   │   └── utils/
│   │       └── aqiUtils.ts               # AQI brackets, CPCB colors, warnings & formatters
│   ├── store/
│   │   └── AqiGlobalStore.ts             # Zustand store with reactive computed getters
│   ├── types/
│   │   └── aqi.ts                        # TypeScript interfaces & bracket type definitions
│   ├── index.css                         # Tailwind directives, Leaflet dark styles, glassmorphism
│   └── main.tsx                          # App initialization
├── index.html                            # Dark-themed HTML with Google Fonts
├── tailwind.config.js                    # Tailwind configuration with AQI health colors
├── tsconfig.json & tsconfig.app.json     # Strict TypeScript configuration
└── package.json
```

---

## 🚀 Core Features

1. **Zustand Global Store (`AqiGlobalStore.ts`)**
   - Reads pre-cleaned dataset from `src/assets/aqi_data.json`.
   - Manages selected city (`ALL` or specific city), temporal filters (`all`, `7d`, `today`), search queries, and metric selection.
   - Provides computed getters for `KPIStats`, `getFilteredRecords()`, and latest city records.

2. **Geospatial Health Heatmap (`GeospatialAqiMap.tsx`)**
   - Color-coded circular markers reflecting AQI severity:
     - 🟢 `< 50`: **Good**
     - 🟡 `51 - 100`: **Moderate**
     - 🟠 `101 - 200`: **Poor**
     - 🔴 `> 200`: **Very Poor / Hazardous**
   - Auto-pans and zooms when an individual city is selected from the sidebar or map pin.
   - Interactive popups with PM2.5, PM10, and NO₂ levels.

3. **Analytics Dashboard (`TemporalTrendChart.tsx` & `PollutantComparisonBar.tsx`)**
   - **Time-Series Trajectory**: Recharts line chart showing historical progression with benchmark reference lines (Good 50, Moderate 100, Hazardous 200).
   - **Pollutant Breakdown Bar**: Allows toggling between inter-city comparisons and specific pollutant concentrations vs Indian CPCB NAAQS safe limits.

4. **Health Impact KPIs & Advisory Banner (`AqiKPIStats.tsx`)**
   - Dynamic alert banners reflecting real-time calculated exposure risk with actionable health precautions (e.g. N95 mask advisory, indoor air purifiers).
   - Metrics for Mean AQI, Peak Exposure Hotspot, Optimal Quality Pocket, and dominant chemical species.

5. **Serverless Data Portability**
   - One-click `Export JSON` functionality to export the filtered dataset directly from the client.

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build & type check
npm run build
```
