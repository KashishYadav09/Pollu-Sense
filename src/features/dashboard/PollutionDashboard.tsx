import React, { useState } from 'react';
import { FilterSidebar } from '../../shared/components/FilterSidebar';
import { AqiKPIStats } from './AqiKPIStats';
import { GeospatialAqiMap } from '../map/GeospatialAqiMap';
import { TemporalTrendChart } from '../analytics/TemporalTrendChart';
import { PollutantComparisonBar } from '../analytics/PollutantComparisonBar';
import { useAqiStore } from '../../store/AqiGlobalStore';
import { 
  Radio, 
  Menu, 
  X, 
  Download, 
  CloudFog, 
  Database 
} from 'lucide-react';

export const PollutionDashboard: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { allRecords, selectedCity } = useAqiStore();

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allRecords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pollu_sense_${selectedCity.toLowerCase()}_data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-slate-800 flex flex-col">
      {/* Top Application Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900"
            aria-label="Toggle Navigation Filter Menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center shadow-sm">
              <CloudFog className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  Pollu Sense
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
                  Live Network
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Serverless Air Quality & Environmental Telemetry
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-2xl border border-slate-200/80">
            <Database className="w-3.5 h-3.5 text-slate-600" />
            <span>Dataset: <span className="text-slate-800 font-mono font-medium">aqi_data.json</span></span>
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-2xl bg-black hover:bg-slate-800 text-white transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        {/* Mobile Slide-over Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-50 w-80 max-w-full bg-[#f4f5f8] h-full p-4 overflow-y-auto shadow-2xl border-r border-slate-200">
              <FilterSidebar />
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Section 1: Health Impact KPIs */}
          <AqiKPIStats />

          {/* Section 2: Geospatial Map */}
          <GeospatialAqiMap />

          {/* Section 3: Analytical Charts (Full Width Viewport) */}
          <div className="flex flex-col gap-6 w-full">
            <TemporalTrendChart />
            <PollutantComparisonBar />
          </div>

          {/* Footer info note */}
          <footer className="pt-4 pb-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <p>
              Pollu Sense © 2026 — Built with React 18, Vite, TypeScript, Leaflet & Recharts.
            </p>
            <p className="flex items-center gap-1">
              <span>Station telemetry updated every hour</span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};
