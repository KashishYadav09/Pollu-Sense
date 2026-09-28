import React from 'react';
import { useAqiStore } from '../../store/AqiGlobalStore';
import { formatNumber } from '../../shared/utils/aqiUtils';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Wind, 
  Activity, 
  TrendingUp, 
  TrendingDown
} from 'lucide-react';

export const AqiKPIStats: React.FC = () => {
  const { getKPIStats, selectedCity, getFilteredRecords } = useAqiStore();
  const kpis = getKPIStats();
  const records = getFilteredRecords();

  const avgTemp = records.length
    ? Math.round(records.reduce((acc, r) => acc + r.temperature, 0) / records.length)
    : 28;
  const avgHumidity = records.length
    ? Math.round(records.reduce((acc, r) => acc + r.humidity, 0) / records.length)
    : 65;

  const { category, bgClass, borderClass, textClass, healthWarning, advisory } =
    kpis.bracketInfo;

  return (
    <section className="flex flex-col gap-4">
      {/* Primary Health Advisory Alert Banner */}
      <div
        className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white ${borderClass} shadow-sm`}
      >
        <div className="flex items-start md:items-center gap-3.5">
          <div
            className={`p-3 rounded-2xl border ${borderClass} ${textClass} ${bgClass} flex-shrink-0`}
          >
            {kpis.averageAqi > 100 ? (
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${bgClass} ${borderClass} ${textClass}`}>
                {category} Status
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Scope: {selectedCity === 'ALL' ? 'Nationwide Average' : `${selectedCity} Region`}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {healthWarning}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 max-w-3xl leading-relaxed">
              {advisory}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto flex-shrink-0">
          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Calculated AQI
            </span>
            <span className={`text-4xl font-extrabold tracking-tight ${textClass}`}>
              {kpis.averageAqi}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Key Analytical Metrics - Styled with clean white cards matching design system */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Average AQI Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Mean Air Index
            </span>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {formatNumber(kpis.averageAqi)}
              </span>
              <span className="text-xs font-medium text-slate-400">AQI</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${kpis.averageAqi > 100 ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span>{category} tier ({kpis.totalMonitoredCities} points)</span>
            </p>
          </div>
        </div>

        {/* Highest Toxicity / Critical City */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Peak Exposure Hotspot
            </span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-rose-600 tracking-tight">
                {kpis.maxAqi}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {kpis.maxAqiCity}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span className="text-rose-600 font-semibold">Critical hotspot</span> — high respirable load
            </p>
          </div>
        </div>

        {/* Cleanest Air Hotspot */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Optimal Quality Pocket
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                {kpis.minAqi}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {kpis.minAqiCity}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold">Safe air</span> — minimal respiratory risk
            </p>
          </div>
        </div>

        {/* Dominant Toxic Pollutant & Atmosphere */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Primary Pollutant & Climate
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {kpis.dominantPollutant}
              </span>
              <span className="text-xs font-medium text-slate-500">
                ({avgTemp}°C / {avgHumidity}% RH)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Key respiratory irritant driving primary AQI score.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
