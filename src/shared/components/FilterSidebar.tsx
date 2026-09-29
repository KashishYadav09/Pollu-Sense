import React from 'react';
import { useAqiStore } from '../../store/AqiGlobalStore';
import type { DateRangeFilter } from '../../types/aqi';
import { getAqiBracket } from '../utils/aqiUtils';
import logo from '../../assets/logo.png';
import { 
  MapPin, 
  Calendar, 
  Search, 
  RotateCcw, 
  Activity, 
  Flame, 
  ChevronRight
} from 'lucide-react';

export const FilterSidebar: React.FC = () => {
  const {
    selectedCity,
    dateRange,
    activePollutantMetric,
    searchQuery,
    setSelectedCity,
    setDateRange,
    setActivePollutantMetric,
    setSearchQuery,
    resetFilters,
    getUniqueCities,
    getLatestCityRecords,
  } = useAqiStore();

  const cities = getUniqueCities();
  const latestRecords = getLatestCityRecords();

  const temporalTabs: { label: string; value: DateRangeFilter }[] = [
    { label: 'Day', value: 'day' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
  ];

  const pollutantMetrics: { label: string; value: typeof activePollutantMetric; unit: string }[] = [
    { label: 'Overall AQI', value: 'aqi', unit: 'Index' },
    { label: 'PM2.5 (Fine)', value: 'pm25', unit: 'µg/m³' },
    { label: 'PM10 (Coarse)', value: 'pm10', unit: 'µg/m³' },
    { label: 'Nitrogen Dioxide (NO₂)', value: 'no2', unit: 'ppb' },
    { label: 'Sulphur Dioxide (SO₂)', value: 'so2', unit: 'ppb' },
    { label: 'Carbon Monoxide (CO)', value: 'co', unit: 'mg/m³' },
    { label: 'Ozone (O₃)', value: 'o3', unit: 'ppb' },
  ];

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-5 p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Pollu Sense" className="h-8 w-8 object-contain" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Pollu Sense
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Air Quality Intelligence
            </p>
          </div>
        </div>

        <button
          onClick={resetFilters}
          title="Reset all filters"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar - Exactly like User Image 1 */}
      <div className="relative w-full">
        <div className="relative flex items-center w-full bg-white rounded-full border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:border-slate-300 focus-within:border-slate-400 transition-all">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 stroke-[1.8] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-9 py-2.5 bg-transparent rounded-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 w-4 h-4 flex items-center justify-center text-xs text-slate-400 hover:text-slate-600 transition-colors rounded-full"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Temporal Range Toggle - Exactly like User Image 2 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Time Range</span>
          </span>
          <span className="text-[11px] text-slate-400 capitalize font-medium">
            {dateRange}
          </span>
        </div>
        <div className="flex items-center justify-between p-1 bg-white rounded-2xl border border-slate-200/90 shadow-sm w-full gap-1">
          {temporalTabs.map((tab) => {
            const isActive =
              dateRange === tab.value ||
              (tab.value === 'day' && dateRange === 'today') ||
              (tab.value === 'month' && (dateRange === '30d' || dateRange === '7d')) ||
              (tab.value === 'year' && dateRange === 'all');

            return (
              <button
                key={tab.value}
                onClick={() => setDateRange(tab.value)}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all text-center ${
                  isActive
                    ? 'bg-black text-white shadow-sm'
                    : 'text-slate-700 hover:text-black hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pollutant Metric Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
          <Activity className="w-3.5 h-3.5 text-slate-500" />
          <span>Active Metric</span>
        </div>
        <select
          value={activePollutantMetric}
          onChange={(e) => setActivePollutantMetric(e.target.value as typeof activePollutantMetric)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all cursor-pointer"
        >
          {pollutantMetrics.map((p) => (
            <option key={p.value} value={p.value} className="bg-white text-slate-800">
              {p.label} ({p.unit})
            </option>
          ))}
        </select>
      </div>

      {/* City Selector List */}
      <div className="space-y-2 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>Target Region</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {cities.length} cities
          </span>
        </div>

        <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
          {/* All Cities Option */}
          <button
            onClick={() => setSelectedCity('ALL')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
              selectedCity === 'ALL'
                ? 'bg-black text-white shadow-sm border border-black'
                : 'bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${selectedCity === 'ALL' ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
              <span>All Monitored Cities</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                selectedCity === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              Aggregate
            </span>
          </button>

          {/* Individual Cities */}
          {latestRecords.map((cityRec) => {
            const bracket = getAqiBracket(cityRec.aqi);
            const isSelected = selectedCity.toLowerCase() === cityRec.city.toLowerCase();

            return (
              <button
                key={cityRec.id}
                onClick={() => setSelectedCity(cityRec.city)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-medium transition-all group ${
                  isSelected
                    ? 'bg-black text-white shadow-sm border border-black'
                    : 'bg-slate-50/70 hover:bg-slate-100 border border-slate-200/60 text-slate-700'
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-800 group-hover:text-black'} transition-colors`}>
                    {cityRec.city}
                  </span>
                  <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    {cityRec.state}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold border ${bracket.bgClass} ${bracket.borderClass} ${bracket.textClass}`}
                  >
                    {cityRec.aqi}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-white translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AQI Reference Scale Legend */}
      <div className="pt-3 border-t border-slate-100 space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 px-1">
          <Flame className="w-3 h-3 text-rose-500" />
          <span>AQI Health Scale</span>
        </span>
        <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-semibold">
          <div className="py-1 px-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            &lt;50 Good
          </div>
          <div className="py-1 px-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            51-100 Mod
          </div>
          <div className="py-1 px-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
            101-200 Poor
          </div>
          <div className="py-1 px-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            &gt;200 Haz
          </div>
        </div>
      </div>
    </aside>
  );
};
