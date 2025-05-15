import { KpiDefinition } from './localKpiData';
import { addDays, format, subDays } from 'date-fns';

// Interface for time series data point
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

// Interface for KPI with historical data
export interface KpiWithHistory {
  id: string;
  name: string;
  description: string;
  type: 'contact_center' | 'mobile_banking';
  priority: 'critical' | 'medium' | 'low';
  unit: string;
  target: number;
  threshold: number;
  currentValue: number;
  trend: 'up' | 'down' | 'flat';
  trendPercentage: number;
  historicalData: TimeSeriesDataPoint[];
}

/**
 * Generate a random value based on a target, with some noise
 * @param target The target value
 * @param variability How much the value can vary (percentage)
 * @returns A random value close to the target
 */
const generateRandomValue = (target: number, variability: number = 0.2): number => {
  const min = target * (1 - variability);
  const max = target * (1 + variability);
  return parseFloat((min + Math.random() * (max - min)).toFixed(2));
};

/**
 * Generate a smoother sequence of values, simulating real-world data patterns
 * with seasonality, trends, and some randomness
 */
const generateSmoothSequence = (
  days: number,
  target: number,
  options: {
    trend?: 'up' | 'down' | 'flat';
    trendStrength?: number;
    seasonality?: boolean;
    seasonalityPeriod?: number;
    seasonalityAmplitude?: number;
    volatility?: number;
    specialEvents?: Array<{ day: number; multiplier: number }>;
  } = {}
): number[] => {
  const {
    trend = 'flat',
    trendStrength = 0.0005,
    seasonality = true,
    seasonalityPeriod = 7, // Weekly cycle by default
    seasonalityAmplitude = 0.1,
    volatility = 0.03,
    specialEvents = []
  } = options;

  // Create an empty array to store our values
  const values: number[] = [];
  
  // Fill the array with smoothed values
  for (let i = 0; i < days; i++) {
    // Base value
    let value = target;
    
    // Apply trend
    if (trend === 'up') {
      value += value * trendStrength * i;
    } else if (trend === 'down') {
      value -= value * trendStrength * i;
    }
    
    // Apply seasonality (e.g., weekly patterns)
    if (seasonality) {
      // Using sine wave for seasonality
      const seasonalEffect = Math.sin((2 * Math.PI * i) / seasonalityPeriod) * seasonalityAmplitude * target;
      value += seasonalEffect;
    }
    
    // Apply random volatility
    const randomNoise = (Math.random() - 0.5) * 2 * volatility * target;
    value += randomNoise;
    
    // Apply special events (holidays, promotions, etc.)
    const specialEvent = specialEvents.find(event => event.day === i);
    if (specialEvent) {
      value *= specialEvent.multiplier;
    }
    
    // Ensure values don't go negative for metrics that can't be negative
    value = Math.max(0, value);
    
    // Round to 2 decimal places for cleanliness
    values.push(parseFloat(value.toFixed(2)));
  }
  
  return values;
};

/**
 * Generate one year of daily data for a KPI
 * @param kpi The KPI definition
 * @param tenantId The tenant ID
 * @returns The KPI with historical data
 */
export function generateYearlyKpiData(kpi: KpiDefinition, tenantId: number): KpiWithHistory {
  // Today's date as a string
  const today = new Date();
  
  // Number of days in a year
  const daysInYear = 365;
  
  // Start date (one year ago)
  const startDate = subDays(today, daysInYear);
  
  // Generate trend direction (weighted more towards 'up' for positive metrics)
  const trendOptions: Array<'up' | 'down' | 'flat'> = ['up', 'down', 'flat'];
  const trendWeights = kpi.name.includes('Rate') || kpi.name.includes('Score') ? [0.6, 0.2, 0.2] : [0.4, 0.4, 0.2];
  
  // Randomly select trend based on weights
  let trend: 'up' | 'down' | 'flat' = 'flat';
  const randomValue = Math.random();
  let cumulativeWeight = 0;
  for (let i = 0; i < trendOptions.length; i++) {
    cumulativeWeight += trendWeights[i];
    if (randomValue <= cumulativeWeight) {
      trend = trendOptions[i];
      break;
    }
  }
  
  // Determine if this is a metric where "up" is good or bad
  const upIsGood = !kpi.name.includes('Wait') && 
                   !kpi.name.includes('Duration') && 
                   !kpi.name.includes('Time') &&
                   !kpi.name.includes('Error');
  
  // Generate special events (like holidays or promotions)
  const specialEvents = [];
  // Major holidays (approximate days from start of year)
  const holidays = [1, 45, 105, 170, 220, 300, 359]; // New Year, Valentine's, Easter, Independence Day, Labor Day, Thanksgiving, Christmas
  for (const holiday of holidays) {
    specialEvents.push({
      day: holiday,
      // For contact center, holidays mean more calls (higher values)
      // For mobile banking, holidays could mean less usage
      multiplier: kpi.type === 'contact_center' ? 1.5 : 0.7
    });
  }
  
  // Special promotional days (random days with spikes)
  for (let i = 0; i < 5; i++) {
    specialEvents.push({
      day: Math.floor(Math.random() * daysInYear),
      multiplier: 1.3 + Math.random() * 0.7 // Random multiplier between 1.3 and 2.0
    });
  }
  
  // Generate a smooth sequence of values for the year
  const values = generateSmoothSequence(daysInYear, kpi.target, {
    trend,
    trendStrength: 0.0003, // Subtle trend over a year
    seasonality: true,
    seasonalityPeriod: kpi.type === 'contact_center' ? 7 : 30, // Weekly for call center, monthly for mobile
    seasonalityAmplitude: 0.15,
    volatility: 0.05,
    specialEvents
  });
  
  // Convert to time series format
  const historicalData: TimeSeriesDataPoint[] = values.map((value, index) => {
    const date = addDays(startDate, index);
    return {
      date: format(date, 'yyyy-MM-dd'),
      value
    };
  });
  
  // Calculate current value and trend
  const currentValue = values[values.length - 1];
  const previousValue = values[values.length - 30]; // Value from 30 days ago
  const trendPercentage = ((currentValue - previousValue) / previousValue) * 100;
  
  // Determine if the trend is good or bad based on the KPI type
  const calculatedTrend: 'up' | 'down' | 'flat' = 
    Math.abs(trendPercentage) < 1 ? 'flat' :
    trendPercentage > 0 ? 'up' : 'down';
  
  // For metrics where "up" is bad, invert the display trend
  const displayTrend = upIsGood ? calculatedTrend : 
    calculatedTrend === 'up' ? 'down' : 
    calculatedTrend === 'down' ? 'up' : 'flat';
  
  return {
    ...kpi,
    currentValue,
    trend: displayTrend,
    trendPercentage: parseFloat(trendPercentage.toFixed(1)),
    historicalData
  };
}

/**
 * Generate one year of daily data for multiple KPIs
 * @param tenantId The tenant ID
 * @param kpis The KPI definitions
 * @returns An array of KPIs with historical data
 */
export function generateYearlyKpisData(tenantId: number, kpis: KpiDefinition[]): KpiWithHistory[] {
  return kpis.map(kpi => generateYearlyKpiData(kpi, tenantId));
}

/**
 * Get data for a specific date range from the historical data
 * @param kpi The KPI with historical data
 * @param startDate The start date (YYYY-MM-DD)
 * @param endDate The end date (YYYY-MM-DD)
 * @returns Filtered historical data for the date range
 */
export function getKpiDataForDateRange(
  kpi: KpiWithHistory, 
  startDate: string, 
  endDate: string
): TimeSeriesDataPoint[] {
  return kpi.historicalData.filter(
    dataPoint => dataPoint.date >= startDate && dataPoint.date <= endDate
  );
}