import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  X, 
  Maximize2, 
  BarChart3, 
  LineChart,
  Info
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { KpiDefinition } from '@/lib/localKpiData';
import { generateYearlyKpiData, KpiWithHistory } from '@/lib/yearlyDataGenerator';
import { KpiDetailsPanel } from '@/components/kpi/KpiDetailsPanel';
import { format, parseISO } from 'date-fns';

interface ChartWidgetProps {
  kpiDefinition: KpiDefinition;
  onRemove?: () => void;
  className?: string;
  chartType?: 'line' | 'bar' | 'area';
  showMetadata?: boolean;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ 
  kpiDefinition, 
  onRemove,
  className = "",
  chartType = 'area',
  showMetadata = true
}) => {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<KpiWithHistory | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentChartType, setCurrentChartType] = useState<'line' | 'bar' | 'area'>(chartType);

  useEffect(() => {
    const generateData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const data = generateYearlyKpiData(kpiDefinition, 1);
        setKpiData(data);
      } catch (error) {
        console.error('Error generating KPI data:', error);
      } finally {
        setLoading(false);
      }
    };

    generateData();
  }, [kpiDefinition]);

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'seconds') return `${value.toFixed(1)}s`;
    if (unit === 'minutes') return `${value.toFixed(1)}m`;
    if (unit === 'hours') return `${value.toFixed(1)}h`;
    if (unit === 'currency') return `$${value.toFixed(2)}`;
    if (value > 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value > 1000) return `${(value / 1000).toFixed(1)}K`;
    return Math.round(value).toLocaleString();
  };

  const getTrendIcon = () => {
    if (!kpiData) return <Minus className="h-4 w-4 text-gray-500" />;
    if (kpiData.trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (kpiData.trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (!kpiData) return 'text-gray-600';
    if (kpiData.trend === 'up') return 'text-green-600';
    if (kpiData.trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  // Prepare chart data - show last 60 days for better visualization
  const chartData = kpiData?.historicalData
    ?.slice(-60)
    ?.map(point => ({
      date: point.date,
      value: point.value,
      formattedDate: format(parseISO(point.date), 'MMM dd'),
      target: kpiDefinition.target
    })) || [];

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg text-sm">
          <p className="font-medium">{format(parseISO(label), 'MMM dd, yyyy')}</p>
          <p className="text-blue-600">
            Value: {formatValue(payload[0].value, kpiDefinition.unit)}
          </p>
          <p className="text-gray-600">
            Target: {formatValue(kpiDefinition.target, kpiDefinition.unit)}
          </p>
          <p className="text-orange-600 mt-1 text-xs">Click for full details</p>
        </div>
      );
    }
    return null;
  };

  // Get chart color based on trend
  const getChartColor = () => {
    if (!kpiData) return '#6b7280';
    if (kpiData.trend === 'up') return '#10b981';
    if (kpiData.trend === 'down') return '#ef4444';
    return '#6b7280';
  };

  const getPriorityColor = () => {
    switch (kpiDefinition.priority) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <Card className={`${getPriorityColor()} ${className}`}>
        <CardHeader className="pb-2">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={`relative ${getPriorityColor()} ${className}`}>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100 z-10"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-8">
              <CardTitle className="text-sm font-medium truncate">
                {kpiDefinition.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {kpiDefinition.description}
              </p>
              
              {showMetadata && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant={kpiDefinition.priority === 'critical' ? 'destructive' : 
                             kpiDefinition.priority === 'medium' ? 'default' : 'outline'} 
                    className="text-xs"
                  >
                    {kpiDefinition.priority}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {kpiDefinition.type.replace('_', ' ')}
                  </Badge>
                  
                  {kpiData && (
                    <div className="flex items-center gap-1 ml-auto">
                      {getTrendIcon()}
                      <span className={`text-xs font-medium ${getTrendColor()}`}>
                        {kpiData.currentValue ? formatValue(kpiData.currentValue, kpiDefinition.unit) : 'N/A'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Chart Type Selector */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground">
              Last 60 Days
            </span>
            <div className="flex gap-1">
              <Button
                variant={currentChartType === 'area' ? 'default' : 'ghost'}
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setCurrentChartType('area')}
              >
                <AreaChart className="h-3 w-3" />
              </Button>
              <Button
                variant={currentChartType === 'line' ? 'default' : 'ghost'}
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setCurrentChartType('line')}
              >
                <LineChart className="h-3 w-3" />
              </Button>
              <Button
                variant={currentChartType === 'bar' ? 'default' : 'ghost'}
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setCurrentChartType('bar')}
              >
                <BarChart3 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowDetails(true)}
              >
                <Info className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {/* Main Chart Display */}
          <div 
            className="h-40 w-full cursor-pointer hover:bg-opacity-80 transition-all rounded"
            onClick={() => setShowDetails(true)}
          >
            <ResponsiveContainer width="100%" height="100%">
              {currentChartType === 'line' ? (
                <RechartsLineChart data={chartData}>
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={getChartColor()}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: getChartColor() }}
                  />
                </RechartsLineChart>
              ) : currentChartType === 'bar' ? (
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    fill={getChartColor()}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              ) : (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`gradient-${kpiDefinition.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getChartColor()} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={getChartColor()} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={getChartColor()}
                    fill={`url(#gradient-${kpiDefinition.id})`}
                    strokeWidth={2}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
          
          <div className="text-xs text-center text-muted-foreground mt-2">
            Click chart to drill down and explore yearly patterns
          </div>
        </CardContent>
      </Card>

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

export default ChartWidget;