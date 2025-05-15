import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { KpiDefinition } from '@/lib/localKpiData';
import { Widget } from '@/contexts/DashboardContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Code, Info, Activity, LineChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { generateYearlyKpiData } from '@/lib/yearlyDataGenerator';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface KpiDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  kpi?: KpiDefinition;
  widget?: Partial<Widget>;
}

// Syntax highlighting styles for SQL code
const sqlStyles = {
  keyword: 'text-blue-600 font-semibold',
  function: 'text-amber-600',
  table: 'text-green-600 font-semibold',
  column: 'text-purple-600',
  operator: 'text-red-600',
  literal: 'text-cyan-600',
  comment: 'text-gray-500 italic',
  string: 'text-green-500',
};

// Simple SQL formatter/highlighter
const formatSql = (sql: string) => {
  if (!sql) return <span className="text-gray-500 italic">No SQL query available</span>;
  
  // Clean up multi-line SQL and extra spaces
  const cleanedSql = sql.replace(/\\n/g, '\n').replace(/\s+/g, ' ').trim();
  
  // Basic SQL keyword highlighting - this is a simplistic approach
  return cleanedSql.split(/\b/).map((token, i) => {
    const lowerToken = token.toLowerCase();
    
    if (['select', 'from', 'where', 'join', 'on', 'group', 'by', 'order', 'having', 'and', 'or', 'as', 'case', 'when', 'then', 'else', 'end'].includes(lowerToken)) {
      return <span key={i} className={sqlStyles.keyword}>{token}</span>;
    } else if (['count', 'sum', 'avg', 'min', 'max', 'cast', 'convert', 'dateadd', 'datediff'].includes(lowerToken)) {
      return <span key={i} className={sqlStyles.function}>{token}</span>;
    } else if (lowerToken === 'null' || /^\d+$/.test(token)) {
      return <span key={i} className={sqlStyles.literal}>{token}</span>;
    } else if (['+', '-', '*', '/', '=', '<', '>', '>=', '<=', '<>'].includes(token)) {
      return <span key={i} className={sqlStyles.operator}>{token}</span>;
    } else {
      return <span key={i}>{token}</span>;
    }
  });
};

const KpiDetailsPanel: React.FC<KpiDetailsPanelProps> = ({ isOpen, onClose, kpi, widget }) => {
  const [yearlyData, setYearlyData] = useState<any | null>(null);
  
  useEffect(() => {
    if (kpi) {
      // Generate a full year of data for this KPI
      const data = generateYearlyKpiData(kpi, 1); // Using tenantId 1
      setYearlyData(data);
    }
  }, [kpi]);

  if (!kpi) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            {kpi.name}
            <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
              kpi.priority === 'critical' ? 'bg-red-100 text-red-800' :
              kpi.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
              'bg-green-100 text-green-800'
            }`}>
              {kpi.priority}
            </span>
          </SheetTitle>
          <SheetDescription>
            {kpi.description}
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info" className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex items-center">
              <LineChart className="h-4 w-4 mr-2" />
              Annual Data
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Data Source
            </TabsTrigger>
            <TabsTrigger value="sql" className="flex items-center">
              <Code className="h-4 w-4 mr-2" />
              SQL Query
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">KPI ID</h4>
                  <p className="text-sm">{kpi.id}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                  <p className="text-sm capitalize">{kpi.type.replace('_', ' ')}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Unit</h4>
                  <p className="text-sm">{kpi.unit}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Real-time</h4>
                  <p className="text-sm">{kpi.isRealTime ? 'Yes' : 'No'}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Target</h4>
                  <p className="text-sm">{kpi.target} {kpi.unit}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Threshold</h4>
                  <p className="text-sm">{kpi.threshold} {kpi.unit}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Performance Indicators</h4>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      kpi.target > kpi.threshold 
                        ? 'bg-red-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min(100, Math.random() * 100)}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">0</span>
                  <span className="text-xs text-muted-foreground">
                    {(kpi.target > kpi.threshold) 
                      ? Math.max(kpi.target, kpi.threshold) * 1.5 
                      : Math.max(kpi.target, kpi.threshold) * 0.5} {kpi.unit}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="mt-4">
            <div className="space-y-4">
              <div className="text-muted-foreground text-sm">
                {kpi.type === 'contact_center' 
                  ? 'Data sourced from Contact Center database tables'
                  : 'Data sourced from Mobile Banking database tables'
                }
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Source Tables</h4>
                <div className="grid grid-cols-1 gap-2">
                  {kpi.type === 'contact_center' ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Calls</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Agents</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">CallTranscriptions</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">MobileTransactions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">AppSessions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">KpiMetrics</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sql" className="mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium mb-2">Calculation Query</h4>
              {kpi.calculation ? (
                <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-auto whitespace-pre-wrap max-h-60 dark:bg-gray-800">
                  {formatSql(kpi.calculation)}
                </pre>
              ) : (
                <div className="text-muted-foreground text-sm">
                  No SQL query available for this KPI
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// List component for showing multiple KPIs
interface KpiDetailsListProps {
  kpis: KpiDefinition[];
}

const KpiDetailsList: React.FC<KpiDetailsListProps> = ({ kpis }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">KPI Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="bg-card border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium flex items-center">
                <Activity className="h-4 w-4 mr-2 text-primary" />
                {kpi.name}
              </h4>
              <Badge 
                variant="outline" 
                className={
                  kpi.priority === 'critical' ? 'bg-red-100 text-red-800' :
                  kpi.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                  'bg-green-100 text-green-800'
                }
              >
                {kpi.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{kpi.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Target:</span> {kpi.target} {kpi.unit}
              </div>
              <div>
                <span className="text-muted-foreground">Threshold:</span> {kpi.threshold} {kpi.unit}
              </div>
              <div>
                <span className="text-muted-foreground">Real-time:</span> {kpi.isRealTime ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span> {kpi.type.replace('_', ' ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Make sure to export both components explicitly
export { KpiDetailsPanel, KpiDetailsList };

export default KpiDetailsPanel;