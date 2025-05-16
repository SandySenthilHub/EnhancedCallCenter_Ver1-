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
  
  // KPI-specific patterns based on KPI ID and name
  let trend: 'up' | 'down' | 'flat' = 'flat';
  let trendStrength = 0.0003; // Default subtle trend
  let seasonalityPeriod = kpi.type === 'contact_center' ? 7 : 30; // Default: Weekly for call center, monthly for mobile
  let seasonalityAmplitude = 0.15; // Default seasonality strength
  let volatility = 0.05; // Default volatility
  
  // Determine appropriate patterns based on KPI type and ID
  if (kpi.type === 'contact_center') {
    // Contact center specific patterns
    if (kpi.id.includes('aht') || kpi.id.includes('handle_time')) {
      // Average handle time typically trends down over time due to efficiency improvements
      trend = 'down';
      trendStrength = 0.0002;
      seasonalityPeriod = 5; // Business week cycle
      volatility = 0.08; // Higher volatility in handle times
    } 
    else if (kpi.id.includes('csat') || kpi.id.includes('satisfaction')) {
      // Customer satisfaction scores often show small improvements over time
      trend = 'up';
      trendStrength = 0.0001; // Very subtle improvement
      seasonalityPeriod = 30; // Monthly patterns
      volatility = 0.03; // Relatively stable
    }
    else if (kpi.id.includes('abandon') || kpi.id.includes('drop')) {
      // Abandon rates often show spikes during peak times
      trend = 'flat'; // General trend is flat
      seasonalityPeriod = 7; // Weekly cycle
      seasonalityAmplitude = 0.25; // Strong seasonality
      volatility = 0.15; // High volatility
    }
    else if (kpi.id.includes('sentiment')) {
      // Sentiment tends to be stable with occasional dips
      trend = 'flat';
      seasonalityPeriod = 90; // Quarterly patterns
      volatility = 0.07;
    }
    else if (kpi.id.includes('occupancy') || kpi.id.includes('utilization')) {
      // Agent occupancy often has weekly patterns
      trend = 'flat';
      seasonalityPeriod = 7; // Weekly cycle
      seasonalityAmplitude = 0.20; // Strong weekly pattern
    }
  } 
  else if (kpi.type === 'mobile_banking') {
    // Mobile banking specific patterns
    if (kpi.id.includes('login') || kpi.id.includes('success')) {
      // Login success rates typically improve over time
      trend = 'up';
      trendStrength = 0.0001;
      volatility = 0.02; // Very stable
    }
    else if (kpi.id.includes('transaction') || kpi.id.includes('tx')) {
      // Transaction volumes often increase over time
      trend = 'up';
      trendStrength = 0.0005; // Strong growth
      seasonalityPeriod = 30; // Monthly cycle (payday effects)
      seasonalityAmplitude = 0.30; // Strong monthly pattern
    }
    else if (kpi.id.includes('active_users') || kpi.id.includes('dau')) {
      // Active users typically grow with occasional plateaus
      trend = 'up';
      trendStrength = 0.0004;
      seasonalityPeriod = 7; // Weekly cycle (weekday vs weekend)
      seasonalityAmplitude = 0.15;
    }
    else if (kpi.id.includes('crash') || kpi.id.includes('error')) {
      // Crashes should trend down over time
      trend = 'down';
      trendStrength = 0.0003;
      volatility = 0.20; // High volatility
    }
    else if (kpi.id.includes('session') || kpi.id.includes('duration')) {
      // Session durations often increase over time
      trend = 'up';
      trendStrength = 0.0002;
      seasonalityPeriod = 7; // Weekly
    }
  }
  
  // Determine if this is a metric where "up" is good or bad
  const upIsGood = !kpi.name.toLowerCase().includes('wait') && 
                   !kpi.name.toLowerCase().includes('duration') && 
                   !kpi.name.toLowerCase().includes('time') &&
                   !kpi.name.toLowerCase().includes('error') &&
                   !kpi.name.toLowerCase().includes('abandon') &&
                   !kpi.name.toLowerCase().includes('crash');
  
  // Generate special events (like holidays or promotions)
  const specialEvents = [];
  
  // Major holidays with realistic multipliers based on KPI type
  const holidays = [
    { day: 1, name: "New Year's Day" },
    { day: 45, name: "Valentine's Day" },
    { day: 105, name: "Easter" },
    { day: 170, name: "Independence Day" },
    { day: 220, name: "Labor Day" },
    { day: 300, name: "Thanksgiving" },
    { day: 359, name: "Christmas" }
  ];
  
  for (const holiday of holidays) {
    let multiplier = 1.0;
    
    // Custom multipliers based on KPI type and holiday
    if (kpi.type === 'contact_center') {
      // Contact center volumes increase on holidays
      if (kpi.id.includes('call_volume') || kpi.id.includes('volume')) {
        multiplier = holiday.name === "Christmas" || holiday.name === "New Year's Day" ? 2.0 : 1.6;
      }
      // Wait times increase on busy holidays
      else if (kpi.id.includes('wait') || kpi.id.includes('handle')) {
        multiplier = holiday.name === "Christmas" || holiday.name === "New Year's Day" ? 1.8 : 1.4;
      }
      // Customer satisfaction decreases slightly on busy days
      else if (kpi.id.includes('satisfaction') || kpi.id.includes('csat')) {
        multiplier = holiday.name === "Christmas" || holiday.name === "New Year's Day" ? 0.9 : 0.95;
      }
      // Abandon rates increase on busy days
      else if (kpi.id.includes('abandon')) {
        multiplier = holiday.name === "Christmas" ? 1.7 : 1.3;
      } 
      else {
        multiplier = 1.5; // Default for contact center metrics
      }
    } 
    else if (kpi.type === 'mobile_banking') {
      // Mobile banking usage drops on major holidays
      if (kpi.id.includes('active') || kpi.id.includes('login')) {
        multiplier = holiday.name === "Christmas" || holiday.name === "New Year's Day" ? 0.6 : 0.8;
      }
      // Transactions spike before some holidays and drop during
      else if (kpi.id.includes('transaction') || kpi.id.includes('tx')) {
        // Transactions spike before Christmas but drop during
        if (holiday.name === "Christmas") {
          // Add a pre-holiday spike 2 days before
          specialEvents.push({
            day: holiday.day - 2,
            multiplier: 1.8,
            name: "Pre-Christmas Shopping"
          });
          multiplier = 0.7; // Drop during the holiday
        } 
        else if (holiday.name === "Valentine's Day" || holiday.name === "Independence Day") {
          // Add pre-holiday spike one day before
          specialEvents.push({
            day: holiday.day - 1,
            multiplier: 1.4,
            name: `Pre-${holiday.name} Activity`
          });
          multiplier = 0.8;
        } 
        else {
          multiplier = 0.7;
        }
      }
      // Mobile app crashes might increase slightly due to high load before holidays
      else if (kpi.id.includes('crash') || kpi.id.includes('error')) {
        if (holiday.name === "Christmas" || holiday.name === "New Year's Day") {
          specialEvents.push({
            day: holiday.day - 1,
            multiplier: 1.5,
            name: `Pre-${holiday.name} High Load`
          });
        }
        multiplier = 1.1;
      } 
      else {
        multiplier = 0.7; // Default for mobile banking metrics
      }
    }
    
    specialEvents.push({
      day: holiday.day,
      multiplier: multiplier,
      name: holiday.name
    });
  }
  
  // Add monthly payroll days with appropriate effects
  for (let month = 0; month < 12; month++) {
    const paydayOffset = 15 + (month * 30); // ~15th of each month
    if (paydayOffset <= daysInYear) {
      const paydayEffect = {
        day: paydayOffset,
        multiplier: 1.0,
        name: `Month ${month + 1} Payday`
      };
      
      // Custom multiplier based on KPI type
      if (kpi.type === 'mobile_banking') {
        if (kpi.id.includes('transaction') || kpi.id.includes('tx')) {
          paydayEffect.multiplier = 1.9; // Strong spike in transactions
        } 
        else if (kpi.id.includes('active') || kpi.id.includes('login')) {
          paydayEffect.multiplier = 1.6; // More users log in
        } 
        else {
          paydayEffect.multiplier = 1.4; // Default increase
        }
      } 
      else if (kpi.type === 'contact_center') {
        if (kpi.id.includes('volume')) {
          paydayEffect.multiplier = 1.5; // More calls
        } 
        else if (kpi.id.includes('handle') || kpi.id.includes('aht')) {
          paydayEffect.multiplier = 1.3; // Longer handle time
        } 
        else if (kpi.id.includes('wait')) {
          paydayEffect.multiplier = 1.4; // Longer wait times
        } 
        else {
          paydayEffect.multiplier = 1.2; // Default increase
        }
      }
      
      specialEvents.push(paydayEffect);
    }
  }
  
  // Add quarterly financial events (Tax seasons, quarterly reporting)
  const quarterlyEvents = [90, 180, 270, 360]; // End of quarters
  for (const day of quarterlyEvents) {
    if (day <= daysInYear) {
      const quarterEvent = {
        day: day,
        multiplier: 1.0,
        name: `Q${Math.ceil(day/90)} End`
      };
      
      if (kpi.type === 'mobile_banking') {
        if (kpi.id.includes('transaction')) {
          quarterEvent.multiplier = 1.4;
        }
      } 
      else if (kpi.type === 'contact_center') {
        if (kpi.id.includes('volume')) {
          quarterEvent.multiplier = 1.5;
        }
      }
      
      specialEvents.push(quarterEvent);
      
      // Add pre-quarter end peaks (7 days before quarter end)
      if (day > 7) {
        specialEvents.push({
          day: day - 7,
          multiplier: 1.3,
          name: `Pre-Q${Math.ceil(day/90)} Activity`
        });
      }
    }
  }
  
  // Filter out any duplicate days and sort by day
  const uniqueEvents = specialEvents.filter((event, index, self) => 
    index === self.findIndex(e => e.day === event.day)
  ).sort((a, b) => a.day - b.day);
  
  // Generate a smooth sequence of values for the year
  const values = generateSmoothSequence(daysInYear, kpi.target, {
    trend,
    trendStrength,
    seasonality: true,
    seasonalityPeriod,
    seasonalityAmplitude,
    volatility,
    specialEvents: uniqueEvents
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