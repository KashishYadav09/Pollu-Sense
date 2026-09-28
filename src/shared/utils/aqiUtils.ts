import type { AqiBracketInfo } from '../../types/aqi';

export function getAqiBracket(aqi: number): AqiBracketInfo {
  if (aqi <= 50) {
    return {
      category: 'Good',
      color: '#10b981', // green
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-200',
      textClass: 'text-emerald-700',
      glowClass: 'shadow-sm',
      advisory: 'Air quality is satisfactory. Air pollution poses little or no risk.',
      healthWarning: 'Air Quality: Healthy — Ideal for outdoor activities and exercise.',
      min: 0,
      max: 50,
    };
  } else if (aqi <= 100) {
    return {
      category: 'Moderate',
      color: '#f59e0b', // yellow / amber
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-200',
      textClass: 'text-amber-700',
      glowClass: 'shadow-sm',
      advisory: 'Acceptable air quality. Unusually sensitive people should consider reducing outdoor exertion.',
      healthWarning: 'Air Quality: Moderate — Minor breathing discomfort to sensitive individuals.',
      min: 51,
      max: 100,
    };
  } else if (aqi <= 200) {
    return {
      category: 'Poor',
      color: '#f97316', // orange
      bgClass: 'bg-orange-50',
      borderClass: 'border-orange-200',
      textClass: 'text-orange-700',
      glowClass: 'shadow-sm',
      advisory: 'Unhealthy for sensitive groups. Breathing discomfort to people with asthma and heart conditions.',
      healthWarning: 'Unhealthy Alert — Sensitive groups should wear N95 masks & limit prolonged outdoor stays.',
      min: 101,
      max: 200,
    };
  } else if (aqi <= 300) {
    return {
      category: 'Very Poor',
      color: '#ef4444', // red
      bgClass: 'bg-rose-50',
      borderClass: 'border-rose-200',
      textClass: 'text-rose-700',
      glowClass: 'shadow-sm',
      advisory: 'Health alert: Everyone may begin to experience health effects. Significant respiratory impact.',
      healthWarning: 'Hazardous — Avoid Outdoor Activities. Keep windows closed and run HEPA air purifiers.',
      min: 201,
      max: 300,
    };
  } else {
    return {
      category: 'Hazardous',
      color: '#b91c1c', // deep red/maroon
      bgClass: 'bg-red-50',
      borderClass: 'border-red-200',
      textClass: 'text-red-800',
      glowClass: 'shadow-sm',
      advisory: 'Emergency health warnings. Entire population is more likely to be seriously affected.',
      healthWarning: 'Severe Emergency — Life-threatening toxicity. Strictly avoid all outdoor exposure.',
      min: 301,
      max: 500,
    };
  }
}

export function formatNumber(num: number, decimals: number = 0): string {
  return Number(num).toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}
