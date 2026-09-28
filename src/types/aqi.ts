export type AqiStatusCategory = 
  | 'Good'
  | 'Moderate'
  | 'Poor'
  | 'Very Poor'
  | 'Hazardous';

export interface AqiDataRecord {
  id: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  date: string; // ISO date string YYYY-MM-DD
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  temperature: number; // Celsius
  humidity: number; // Percentage
  dominantPollutant: 'PM2.5' | 'PM10' | 'NO2' | 'SO2' | 'CO' | 'O3' | 'NH3';
}

export interface RawAqiTelemetryRecord {
  country?: string;
  state?: string;
  city?: string;
  station?: string;
  last_update?: string;
  latitude?: number;
  longitude?: number;
  pollutant_id?: string;
  pollutant_min?: number;
  pollutant_max?: number;
  pollutant_avg?: number;
}

export interface AqiBracketInfo {
  category: AqiStatusCategory;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  glowClass: string;
  advisory: string;
  healthWarning: string;
  min: number;
  max: number;
}

export type DateRangeFilter = 'day' | 'month' | 'year' | 'all' | '7d' | '30d' | 'today';

export interface FilterState {
  selectedCity: string; // 'ALL' or specific city
  dateRange: DateRangeFilter;
  activePollutantMetric: 'aqi' | 'pm25' | 'pm10' | 'no2' | 'so2' | 'co' | 'o3';
  searchQuery: string;
}
