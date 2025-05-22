import React, { useEffect, useState } from 'react';
import DashboardWidget, { WidgetProps } from './DashboardWidget';
import { KpiDefinition } from '@/lib/localKpiData';
import { Card, CardContent } from '@/components/ui/card';
import { generateYearlyKpiData, KpiWithHistory } from '@/lib/yearlyDataGenerator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDown, ArrowRight, ArrowUp, Activity } from 'lucide-react';
import { KpiDetailsPanel } from '@/components/kpi/KpiDetailsPanel';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface KpiWidgetProps extends Omit<WidgetProps, 'children' | 'type'> {
  kpiDefinition: KpiDefinition;
}

const KpiWidget: React.FC<KpiWidgetProps> = ({
  id,
  title,
  size,
  onRemove,
  onSizeChange,
  draggable,
  onDragStart,
  kpiDefinition,
}) => {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<KpiWithHistory | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Generate synthetic data for this KPI
    const generateData = async () => {
      setLoading(true);
      try {
        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = generateYearlyKpiData(kpiDefinition, 1); // Using tenant ID 1
        setKpiData(data);
      } catch (error) {
        console.error('Error generating KPI data:', error);
      } finally {
        setLoading(false);
      }
    };

    generateData();
  }, [kpiDefinition]);

  // Format the current value based on the KPI's unit
  const formatValue = (value: number, unit: string) => {
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    } else if (unit === 'seconds' || unit === 'sec') {
      return `${value.toFixed(1)}s`;
    } else if (value > 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value > 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(1);
  };

  // Get the trend indicator and color
  const getTrendIndicator = (trend: 'up' | 'down' | 'flat', percentage: number) => {
    const formattedPercentage = Math.abs(percentage).toFixed(1);
    
    if (trend === 'up') {
      return {
        icon: <ArrowUp className="h-4 w-4" />,
        text: `+${formattedPercentage}%`,
        color: 'text-green-500',
      };
    } else if (trend === 'down') {
      return {
        icon: <ArrowDown className="h-4 w-4" />,
        text: `-${formattedPercentage}%`,
        color: 'text-red-500',
      };
    } else {
      return {
        icon: <ArrowRight className="h-4 w-4" />,
        text: `${formattedPercentage}%`,
        color: 'text-yellow-500',
      };
    }
  };

  // Get the last 30 days of data for the mini chart
  const getRecentData = () => {
    if (!kpiData || !kpiData.historicalData) return [];
    return kpiData.historicalData.slice(-30);
  };

  // Handle drill-down to show detailed view
  const handleDrillDown = () => {
    setShowDetails(true);
  };

  return (
    <>
      <DashboardWidget
        id={id}
        title={title}
        type="value"
        size={size}
        onRemove={onRemove}
        onSizeChange={onSizeChange}
        draggable={draggable}
        onDragStart={onDragStart}
        kpiId={kpiDefinition.id}
        sqlQuery={kpiDefinition.calculation}
      >
        {loading ? (
          <div className="flex flex-col space-y-4 h-full justify-center items-center">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : kpiData ? (
          <div className="flex flex-col h-full">
            <div className="flex items-baseline justify-between mb-2">
              <div className="text-2xl font-bold">
                {formatValue(kpiData.currentValue, kpiDefinition.unit)}
              </div>
              
              {kpiData.trend !== 'flat' && (
                <div className={`flex items-center ${getTrendIndicator(kpiData.trend, kpiData.trendPercentage).color}`}>
                  {getTrendIndicator(kpiData.trend, kpiData.trendPercentage).icon}
                  <span className="text-xs ml-1">
                    {getTrendIndicator(kpiData.trend, kpiData.trendPercentage).text}
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground mb-4">
              <div className="flex items-center">
                <Activity className="h-3 w-3 mr-1" />
                <span>
                  Target: {kpiDefinition.target} {kpiDefinition.unit} / 
                  Threshold: {kpiDefinition.threshold} {kpiDefinition.unit}
                </span>
              </div>
            </div>
            
            <div className="flex-grow cursor-pointer group" onClick={() => handleDrillDown()}>
              <ResponsiveContainer width="100%" height="100%" minHeight={60}>
                <AreaChart data={getRecentData()} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const value = payload[0]?.value;
                        return (
                          <div className="bg-white p-2 border rounded shadow-lg text-xs">
                            <p className="font-medium">{label}</p>
                            <p className="text-blue-600">
                              Value: {formatValue(Number(value || 0), kpiDefinition.unit)}
                            </p>
                            <p className="text-gray-600">
                              Target: {formatValue(kpiDefinition.target, kpiDefinition.unit)}
                            </p>
                            <p className="text-orange-600 mt-1">Click to drill down</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    fill={`url(#gradient-${id})`} 
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="text-xs text-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                Click chart to drill down and see full year data
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No data available
          </div>
        )}
      </DashboardWidget>
      
      {/* Drill-down Details Panel */}
      {showDetails && kpiData && (
        <KpiDetailsPanel
          kpi={kpiData}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default KpiWidget;