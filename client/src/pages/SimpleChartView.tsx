import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { getKpisByTypeAndPriority } from '@/lib/localKpiData';
import { generateYearlyKpiData } from '@/lib/yearlyDataGenerator';
import { format, parseISO } from 'date-fns';
import { LineChart, BarChart3, TrendingUp, Plus, X } from 'lucide-react';

const SimpleChartView: React.FC = () => {
  const [charts, setCharts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDefaultCharts = async () => {
      setLoading(true);
      
      // Get some default KPIs
      const contactKpis = getKpisByTypeAndPriority('contact_center', 'critical').slice(0, 3);
      const mobileKpis = getKpisByTypeAndPriority('mobile_banking', 'critical').slice(0, 3);
      const allKpis = [...contactKpis, ...mobileKpis];
      
      // Generate data for each KPI
      const chartData = await Promise.all(
        allKpis.map(async (kpi) => {
          const kpiWithData = generateYearlyKpiData(kpi, 1);
          const chartPoints = kpiWithData.historicalData.slice(-30).map(point => ({
            date: point.date,
            value: point.value,
            formattedDate: format(parseISO(point.date), 'MMM dd')
          }));
          
          return {
            kpi: kpiWithData,
            chartData: chartPoints,
            chartType: 'area' as const
          };
        })
      );
      
      setCharts(chartData);
      setLoading(false);
    };

    loadDefaultCharts();
  }, []);

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'seconds') return `${value.toFixed(1)}s`;
    if (unit === 'minutes') return `${value.toFixed(1)}m`;
    if (value > 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value > 1000) return `${(value / 1000).toFixed(1)}K`;
    return Math.round(value).toLocaleString();
  };

  const getChartColor = (trend: string) => {
    if (trend === 'up') return '#10b981';
    if (trend === 'down') return '#ef4444';
    return '#6b7280';
  };

  const updateChartType = (index: number, newType: 'line' | 'bar' | 'area') => {
    setCharts(prev => prev.map((chart, i) => 
      i === index ? { ...chart, chartType: newType } : chart
    ));
  };

  const removeChart = (index: number) => {
    setCharts(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Loading Charts...</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-300 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Banking KPI Charts</h1>
        <p className="text-muted-foreground">Real-time visualization of key performance indicators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts.map((chart, index) => (
          <Card key={index} className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100 z-10"
              onClick={() => removeChart(index)}
            >
              <X className="h-3 w-3" />
            </Button>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-sm pr-8">{chart.kpi.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={chart.kpi.priority === 'critical' ? 'destructive' : 'default'} className="text-xs">
                  {chart.kpi.priority}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {chart.kpi.type.replace('_', ' ')}
                </Badge>
              </div>
              <div className="text-lg font-bold">
                {formatValue(chart.kpi.currentValue, chart.kpi.unit)}
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Chart Type Selector */}
              <div className="flex gap-1 mb-3">
                <Button
                  variant={chart.chartType === 'area' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => updateChartType(index, 'area')}
                >
                  <TrendingUp className="h-3 w-3" />
                </Button>
                <Button
                  variant={chart.chartType === 'line' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => updateChartType(index, 'line')}
                >
                  <LineChart className="h-3 w-3" />
                </Button>
                <Button
                  variant={chart.chartType === 'bar' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => updateChartType(index, 'bar')}
                >
                  <BarChart3 className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Actual Chart */}
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chart.chartType === 'line' ? (
                    <RechartsLineChart data={chart.chartData}>
                      <XAxis dataKey="formattedDate" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip 
                        formatter={(value) => [formatValue(Number(value), chart.kpi.unit), 'Value']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={getChartColor(chart.kpi.trend)}
                        strokeWidth={2}
                        dot={false}
                      />
                    </RechartsLineChart>
                  ) : chart.chartType === 'bar' ? (
                    <BarChart data={chart.chartData}>
                      <XAxis dataKey="formattedDate" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip 
                        formatter={(value) => [formatValue(Number(value), chart.kpi.unit), 'Value']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Bar 
                        dataKey="value" 
                        fill={getChartColor(chart.kpi.trend)}
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  ) : (
                    <AreaChart data={chart.chartData}>
                      <defs>
                        <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={getChartColor(chart.kpi.trend)} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={getChartColor(chart.kpi.trend)} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="formattedDate" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip 
                        formatter={(value) => [formatValue(Number(value), chart.kpi.unit), 'Value']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={getChartColor(chart.kpi.trend)}
                        fill={`url(#gradient-${index})`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
              
              <div className="text-xs text-muted-foreground text-center mt-2">
                Last 30 days • Target: {formatValue(chart.kpi.target, chart.kpi.unit)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {charts.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No charts displayed</h3>
            <p className="text-muted-foreground">Charts have been removed or failed to load</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SimpleChartView;