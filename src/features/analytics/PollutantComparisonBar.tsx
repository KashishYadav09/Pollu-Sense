import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { useAqiStore } from '../../store/AqiGlobalStore';
import { BarChart3, Info } from 'lucide-react';

interface PollutantBarTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomBarTooltip: React.FC<PollutantBarTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xl font-sans text-xs text-slate-800">
        <p className="font-bold text-slate-800 pb-1 mb-1 border-b border-slate-100">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="text-slate-500 flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-sm"
                  style={{ backgroundColor: entry.fill || entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-slate-900">
                {entry.value} {entry.payload.unit || 'µg/m³'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const PollutantComparisonBar: React.FC = () => {
  const { getLatestCityRecords, selectedCity } = useAqiStore();
  const latestCities = getLatestCityRecords();

  const [viewMode, setViewMode] = useState<'by-pollutant' | 'by-city'>('by-city');
  const [citySubset, setCitySubset] = useState<'hotspots' | 'cleanest' | 'all'>('hotspots');

  // Filter or sort cities so each bar and label is spacious and crystal clear
  let filteredCities = [...latestCities];
  if (citySubset === 'hotspots') {
    filteredCities = [...latestCities]
      .sort((a, b) => b.pm25 - a.pm25)
      .slice(0, 14);
  } else if (citySubset === 'cleanest') {
    filteredCities = [...latestCities]
      .sort((a, b) => a.pm25 - b.pm25)
      .slice(0, 14);
  }

  // If a specific city is selected in the global sidebar and not in the top subset, include it!
  if (selectedCity !== 'ALL' && citySubset !== 'all') {
    const sel = latestCities.find(
      (c) => c.city.toLowerCase() === selectedCity.toLowerCase()
    );
    if (sel && !filteredCities.some((c) => c.city.toLowerCase() === sel.city.toLowerCase())) {
      filteredCities = [sel, ...filteredCities.slice(0, 13)];
    }
  }

  // View 1: Inter-city comparison for primary hazardous pollutants
  const cityComparisonData = filteredCities.map((rec) => ({
    city: rec.city,
    'PM2.5': rec.pm25,
    'PM10': rec.pm10,
    'NO2': rec.no2,
    unit: 'µg/m³',
  }));

  // View 2: Detailed chemical species breakdown for the selected city or nationwide average
  const selectedRec =
    selectedCity !== 'ALL'
      ? latestCities.find((c) => c.city.toLowerCase() === selectedCity.toLowerCase())
      : null;

  const pollutantBreakdownData = [
    {
      pollutant: 'PM2.5 (Fine)',
      value: selectedRec
        ? selectedRec.pm25
        : Math.round(latestCities.reduce((a, b) => a + b.pm25, 0) / (latestCities.length || 1)),
      safeLimit: 60, // NAAQS 24hr standard
      unit: 'µg/m³',
      fill: '#ef4444',
    },
    {
      pollutant: 'PM10 (Coarse)',
      value: selectedRec
        ? selectedRec.pm10
        : Math.round(latestCities.reduce((a, b) => a + b.pm10, 0) / (latestCities.length || 1)),
      safeLimit: 100, // NAAQS standard
      unit: 'µg/m³',
      fill: '#f97316',
    },
    {
      pollutant: 'NO₂ (Dioxide)',
      value: selectedRec
        ? selectedRec.no2
        : Math.round(latestCities.reduce((a, b) => a + b.no2, 0) / (latestCities.length || 1)),
      safeLimit: 80,
      unit: 'ppb',
      fill: '#eab308',
    },
    {
      pollutant: 'SO₂ (Sulphur)',
      value: selectedRec
        ? selectedRec.so2
        : Math.round(latestCities.reduce((a, b) => a + b.so2, 0) / (latestCities.length || 1)),
      safeLimit: 80,
      unit: 'ppb',
      fill: '#06b6d4',
    },
    {
      pollutant: 'O₃ (Ozone)',
      value: selectedRec
        ? selectedRec.o3
        : Math.round(latestCities.reduce((a, b) => a + b.o3, 0) / (latestCities.length || 1)),
      safeLimit: 100,
      unit: 'ppb',
      fill: '#10b981',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col gap-5 w-full">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex-shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pollutant Component Dispersion & Chemical Comparison
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative particulate & gas concentrations vs National Ambient Air Quality limits
            </p>
          </div>
        </div>

        {/* View Toggle & Sub-filters */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {viewMode === 'by-city' && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              <button
                onClick={() => setCitySubset('hotspots')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  citySubset === 'hotspots'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Top 14 Hotspots
              </button>
              <button
                onClick={() => setCitySubset('cleanest')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  citySubset === 'cleanest'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Cleanest Air
              </button>
              <button
                onClick={() => setCitySubset('all')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  citySubset === 'all'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                All Cities ({latestCities.length})
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('by-city')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                viewMode === 'by-city'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              Regional Multi-City
            </button>
            <button
              onClick={() => setViewMode('by-pollutant')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                viewMode === 'by-pollutant'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              Chemical Thresholds
            </button>
          </div>
        </div>
      </div>

      {/* Spacious Full-width Bar Chart Container */}
      <div className="h-[400px] sm:h-[460px] lg:h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'by-city' ? (
            <BarChart
              data={cityComparisonData}
              margin={{ top: 15, right: 30, left: 10, bottom: 45 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
              <XAxis
                dataKey="city"
                stroke="#64748b"
                fontSize={12}
                fontWeight={500}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                interval={0}
                angle={-40}
                textAnchor="end"
                height={75}
                tick={{ fill: '#334155' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#475569' }}
                label={{
                  value: 'Concentration (µg/m³)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#94a3b8',
                  fontSize: 12,
                  offset: 5,
                }}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '16px', fontSize: '12px', fontWeight: 500 }}
              />
              <Bar
                dataKey="PM2.5"
                fill="#ef4444"
                radius={[6, 6, 0, 0]}
                maxBarSize={citySubset === 'all' ? 22 : 36}
              />
              <Bar
                dataKey="PM10"
                fill="#f97316"
                radius={[6, 6, 0, 0]}
                maxBarSize={citySubset === 'all' ? 22 : 36}
              />
              <Bar
                dataKey="NO2"
                fill="#0ea5e9"
                radius={[6, 6, 0, 0]}
                maxBarSize={citySubset === 'all' ? 22 : 36}
              />
            </BarChart>
          ) : (
            <BarChart
              data={pollutantBreakdownData}
              margin={{ top: 15, right: 30, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
              <XAxis
                dataKey="pollutant"
                stroke="#64748b"
                fontSize={12}
                fontWeight={500}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#334155' }}
                dy={8}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#475569' }}
                label={{
                  value: 'Observed vs Safe Threshold',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#94a3b8',
                  fontSize: 12,
                  offset: 5,
                }}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '16px', fontSize: '12px', fontWeight: 500 }}
              />
              <Bar
                dataKey="value"
                name={selectedCity === 'ALL' ? 'Nationwide Average' : `${selectedCity} Reading`}
                fill="#0ea5e9"
                radius={[8, 8, 0, 0]}
                maxBarSize={55}
              >
                {pollutantBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
              <Bar
                dataKey="safeLimit"
                name="NAAQS Safe Threshold Limit"
                fill="#cbd5e1"
                radius={[8, 8, 0, 0]}
                maxBarSize={55}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2.5 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <span>
          {viewMode === 'by-city'
            ? 'PM2.5 (particulates < 2.5µm) penetrate deep into the pulmonary alveoli and bloodstream, representing the primary hazard index across Indian monitoring stations.'
            : 'Safe threshold limits are derived from the Indian Central Pollution Control Board (CPCB) NAAQS 24-hour standards.'}
        </span>
      </div>
    </div>
  );
};
