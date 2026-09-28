import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import { useAqiStore } from '../../store/AqiGlobalStore';
import { TrendingUp, Clock } from 'lucide-react';
import { getAqiBracket } from '../../shared/utils/aqiUtils';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xl font-sans text-xs text-slate-800">
        <p className="font-semibold text-slate-700 pb-1.5 mb-1.5 border-b border-slate-100 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Timeline: {label}</span>
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => {
            const bracket = getAqiBracket(entry.value);
            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.stroke || entry.color }}
                  />
                  <span>{entry.name}:</span>
                </span>
                <span className="font-mono font-bold" style={{ color: entry.stroke || bracket.color }}>
                  {entry.value} AQI
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export const TemporalTrendChart: React.FC = () => {
  const { allRecords, selectedCity } = useAqiStore();

  // Extract unique sorted dates
  const dates = Array.from(new Set(allRecords.map((r) => r.date))).sort();

  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length >= 3) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        return `${monthNames[m] || parts[1]} ${d}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  let chartData: any[] = [];

  if (selectedCity !== 'ALL') {
    const cityRecords = allRecords
      .filter((r) => r.city.toLowerCase() === selectedCity.toLowerCase())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    chartData = cityRecords.map((r) => ({
      date: formatDateDisplay(r.date),
      fullDate: r.date,
      [r.city]: r.aqi,
      PM25: r.pm25,
      PM10: r.pm10,
    }));
  } else {
    chartData = dates.map((date) => {
      const recordsOnDate = allRecords.filter((r) => r.date === date);
      const row: any = {
        date: formatDateDisplay(date),
        fullDate: date,
      };

      recordsOnDate.forEach((r) => {
        row[r.city] = r.aqi;
      });

      const avg = Math.round(
        recordsOnDate.reduce((sum, item) => sum + item.aqi, 0) / (recordsOnDate.length || 1)
      );
      row['National Average'] = avg;

      return row;
    });
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col gap-5 w-full">
      {/* Chart Title and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Temporal AQI Trajectory & Trendline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedCity === 'ALL'
                ? 'Multi-city comparative time-series trajectory with national baseline'
                : `Historical pollution trajectory and particulate concentrations for ${selectedCity}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          <span className="text-xs px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-mono font-medium whitespace-nowrap">
            {chartData.length} Timestamps
          </span>
        </div>
      </div>

      {/* Full-width spacious Chart Canvas */}
      <div className="h-[380px] sm:h-[440px] lg:h-[480px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 15, right: 30, left: 10, bottom: 15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={12}
              fontWeight={500}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#475569' }}
              dy={8}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              domain={[0, 'auto']}
              tick={{ fill: '#475569' }}
              label={{
                value: 'Air Quality Index (AQI)',
                angle: -90,
                position: 'insideLeft',
                fill: '#94a3b8',
                fontSize: 12,
                offset: 5,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '16px', fontSize: '12px', fontWeight: 500 }}
              iconType="circle"
              iconSize={9}
            />

            {/* Threshold Reference Lines */}
            <ReferenceLine y={50} stroke="#10b981" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: 'Good (≤50)', fill: '#10b981', fontSize: 11, fontWeight: 600, position: 'insideTopLeft' }} />
            <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: 'Moderate (≤100)', fill: '#f59e0b', fontSize: 11, fontWeight: 600, position: 'insideTopLeft' }} />
            <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: 'Hazardous (>200)', fill: '#ef4444', fontSize: 11, fontWeight: 600, position: 'insideTopLeft' }} />

            {selectedCity !== 'ALL' ? (
              <>
                <Line
                  type="monotone"
                  dataKey={selectedCity}
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2, stroke: '#080d1a' }}
                  activeDot={{ r: 6, fill: '#38bdf8' }}
                  name={`${selectedCity} AQI`}
                />
                <Line
                  type="monotone"
                  dataKey="PM25"
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  name="PM2.5 Conc."
                />
                <Line
                  type="monotone"
                  dataKey="PM10"
                  stroke="#a855f7"
                  strokeWidth={2}
                  strokeDasharray="2 2"
                  dot={false}
                  name="PM10 Conc."
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="National Average"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#38bdf8' }}
                  name="National Baseline"
                />
                <Line
                  type="monotone"
                  dataKey="Delhi"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  name="Delhi"
                />
                <Line
                  type="monotone"
                  dataKey="Mumbai"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="Mumbai"
                />
                <Line
                  type="monotone"
                  dataKey="Bengaluru"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Bengaluru"
                />
                <Line
                  type="monotone"
                  dataKey="Kolkata"
                  stroke="#f97316"
                  strokeWidth={1.5}
                  dot={false}
                  name="Kolkata"
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
