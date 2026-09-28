import { create } from 'zustand';
import rawData from '../assets/aqi_data.json';
import type { AqiBracketInfo, AqiDataRecord, DateRangeFilter, FilterState } from '../types/aqi';
import { getAqiBracket } from '../shared/utils/aqiUtils';
import { parseAqiTelemetryData } from '../shared/utils/dataParser';

export interface KPIStats {
  averageAqi: number;
  maxAqi: number;
  maxAqiCity: string;
  minAqi: number;
  minAqiCity: string;
  dominantPollutant: string;
  totalMonitoredCities: number;
  bracketInfo: AqiBracketInfo;
  criticalCityCount: number;
  moderateCityCount: number;
  goodCityCount: number;
}

interface AqiState extends FilterState {
  allRecords: AqiDataRecord[];
  hoveredCity: string | null;

  // Actions
  setSelectedCity: (city: string) => void;
  setDateRange: (range: DateRangeFilter) => void;
  setActivePollutantMetric: (metric: FilterState['activePollutantMetric']) => void;
  setSearchQuery: (query: string) => void;
  setHoveredCity: (city: string | null) => void;
  resetFilters: () => void;

  // Derived Getters
  getFilteredRecords: () => AqiDataRecord[];
  getLatestCityRecords: () => AqiDataRecord[];
  getUniqueCities: () => string[];
  getKPIStats: () => KPIStats;
}

export const useAqiStore = create<AqiState>((set, get) => ({
  allRecords: parseAqiTelemetryData(rawData),
  selectedCity: 'ALL',
  dateRange: 'month',
  activePollutantMetric: 'aqi',
  searchQuery: '',
  hoveredCity: null,

  setSelectedCity: (city: string) => set({ selectedCity: city }),
  setDateRange: (dateRange: DateRangeFilter) => set({ dateRange }),
  setActivePollutantMetric: (activePollutantMetric) => set({ activePollutantMetric }),
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  setHoveredCity: (hoveredCity: string | null) => set({ hoveredCity }),

  resetFilters: () =>
    set({
      selectedCity: 'ALL',
      dateRange: 'month',
      activePollutantMetric: 'aqi',
      searchQuery: '',
      hoveredCity: null,
    }),

  getFilteredRecords: () => {
    const { allRecords, selectedCity, dateRange, searchQuery } = get();

    // Determine latest date in the current dataset dynamically
    const sortedDates = Array.from(new Set(allRecords.map((r) => r.date))).sort();
    const latestDate = sortedDates[sortedDates.length - 1] || '2025-05-19';
    const cutoff7d =
      sortedDates.length >= 7
        ? sortedDates[sortedDates.length - 7]
        : sortedDates[0] || '2025-05-10';
    const cutoff30d =
      sortedDates.length >= 30
        ? sortedDates[sortedDates.length - 30]
        : sortedDates[0] || '2025-04-19';

    return allRecords.filter((record) => {
      // City filter
      if (selectedCity !== 'ALL' && record.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Search query (city or state)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesCity = record.city.toLowerCase().includes(query);
        const matchesState = record.state.toLowerCase().includes(query);
        if (!matchesCity && !matchesState) return false;
      }

      // Date Range filter
      if (dateRange === 'day' || dateRange === 'today') {
        return record.date === latestDate;
      }

      if (dateRange === '7d') {
        return record.date >= cutoff7d;
      }

      if (dateRange === 'month' || dateRange === '30d') {
        return record.date >= cutoff30d;
      }

      // 'year' or 'all' returns all
      return true;
    });
  },

  getLatestCityRecords: () => {
    const { allRecords, searchQuery, selectedCity } = get();
    const cityMap = new Map<string, AqiDataRecord>();

    // Sort descending by date so latest is chosen per city
    const sorted = [...allRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const record of sorted) {
      if (!cityMap.has(record.city)) {
        cityMap.set(record.city, record);
      }
    }

    let records = Array.from(cityMap.values());

    if (selectedCity !== 'ALL') {
      records = records.filter(
        (r) => r.city.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      records = records.filter(
        (r) =>
          r.city.toLowerCase().includes(query) ||
          r.state.toLowerCase().includes(query)
      );
    }

    return records;
  },

  getUniqueCities: () => {
    const { allRecords } = get();
    return Array.from(new Set(allRecords.map((r) => r.city))).sort();
  },

  getKPIStats: () => {
    const records = get().getFilteredRecords();
    const latestRecords = get().getLatestCityRecords();

    if (records.length === 0) {
      return {
        averageAqi: 0,
        maxAqi: 0,
        maxAqiCity: 'N/A',
        minAqi: 0,
        minAqiCity: 'N/A',
        dominantPollutant: 'N/A',
        totalMonitoredCities: 0,
        bracketInfo: getAqiBracket(0),
        criticalCityCount: 0,
        moderateCityCount: 0,
        goodCityCount: 0,
      };
    }

    const totalAqi = records.reduce((acc, curr) => acc + curr.aqi, 0);
    const averageAqi = Math.round(totalAqi / records.length);

    const targetSet = latestRecords.length > 0 ? latestRecords : records;
    let maxRec = targetSet[0];
    let minRec = targetSet[0];

    let criticalCount = 0;
    let moderateCount = 0;
    let goodCount = 0;

    targetSet.forEach((rec) => {
      if (rec.aqi > maxRec.aqi) maxRec = rec;
      if (rec.aqi < minRec.aqi) minRec = rec;

      if (rec.aqi > 200) criticalCount++;
      else if (rec.aqi > 50) moderateCount++;
      else goodCount++;
    });

    const pollutantCount: Record<string, number> = {};
    records.forEach((r) => {
      pollutantCount[r.dominantPollutant] =
        (pollutantCount[r.dominantPollutant] || 0) + 1;
    });

    let dominantPollutant = 'PM2.5';
    let maxPollutantCount = 0;
    Object.entries(pollutantCount).forEach(([p, count]) => {
      if (count > maxPollutantCount) {
        maxPollutantCount = count;
        dominantPollutant = p;
      }
    });

    return {
      averageAqi,
      maxAqi: maxRec.aqi,
      maxAqiCity: maxRec.city,
      minAqi: minRec.aqi,
      minAqiCity: minRec.city,
      dominantPollutant,
      totalMonitoredCities: latestRecords.length,
      bracketInfo: getAqiBracket(averageAqi),
      criticalCityCount: criticalCount,
      moderateCityCount: moderateCount,
      goodCityCount: goodCount,
    };
  },
}));
