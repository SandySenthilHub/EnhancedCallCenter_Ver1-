import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { queryClient } from '../lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';

interface KPI {
  id: string;
  name: string;
  description: string;
  type: 'contact_center' | 'mobile_banking';
  priority: 'critical' | 'medium' | 'low';
  unit: string;
  value: number;
  target: number;
  threshold: number;
  timestamp?: string;
}

const KpiDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contact_center' | 'mobile_banking'>('contact_center');
  const [priority, setPriority] = useState<'critical' | 'medium' | 'low' | 'all'>('critical');
  const { currentTenant } = useAuth();
  const tenantId = currentTenant?.id || 1;

  // Import local KPI data
  const { getKpisByTypeAndPriority, generateKpiValues } = require('../lib/localKpiData');

  // Get KPI definitions from local data
  const kpiDefinitions = React.useMemo(() => {
    return getKpisByTypeAndPriority(
      activeTab, 
      priority !== 'all' ? priority : undefined
    );
  }, [activeTab, priority]);

  // Generate KPI values based on tenant ID
  const kpis: KPI[] = React.useMemo(() => {
    if (!kpiDefinitions) return [];
    return generateKpiValues(tenantId, kpiDefinitions.slice(0, 12));
  }, [kpiDefinitions, tenantId]);

  // Create grid of KPI cards
  const renderKpiGrid = () => {
    if (!kpis || kpis.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No KPIs found for the selected filters.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map(kpi => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">KPI Dashboard</h1>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="flex-1">
          <Tabs 
            defaultValue="contact_center" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'contact_center' | 'mobile_banking')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contact_center">Contact Center</TabsTrigger>
              <TabsTrigger value="mobile_banking">Mobile Banking</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="w-full md:w-64">
          <Select 
            value={priority} 
            onValueChange={(value) => setPriority(value as 'critical' | 'medium' | 'low' | 'all')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Priority</SelectLabel>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-64">
          <Select 
            value={tenantId.toString()} 
            onValueChange={(value) => {
              // Tenant selection is now managed by the AuthContext
              const tenant = { id: parseInt(value), name: value === '1' ? 'X Bank' : 'Y Bank' };
              useAuth().setCurrentTenant(tenant as any);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Tenant" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tenant</SelectLabel>
                <SelectItem value="1">X Bank</SelectItem>
                <SelectItem value="2">Y Bank</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {renderKpiGrid()}
    </div>
  );
};

// KPI Card Component
const KpiCard: React.FC<{ kpi: KPI }> = ({ kpi }) => {
  // Calculate performance indicators
  const performance = kpi.value / kpi.target;
  const isGood = performance >= 1;
  const isCritical = kpi.value <= kpi.threshold;
  
  // Determine color based on performance
  let colorClass = 'bg-yellow-50 border-yellow-200';
  let valueColorClass = 'text-yellow-700';
  let icon = <Minus className="h-4 w-4 text-yellow-500" />;
  
  if (isGood) {
    colorClass = 'bg-green-50 border-green-200';
    valueColorClass = 'text-green-700';
    icon = <TrendingUp className="h-4 w-4 text-green-500" />;
  } else if (isCritical) {
    colorClass = 'bg-red-50 border-red-200';
    valueColorClass = 'text-red-700';
    icon = <TrendingDown className="h-4 w-4 text-red-500" />;
  }
  
  // Format value based on unit
  const formatValue = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'seconds') return `${value.toFixed(1)}s`;
    if (unit === 'minutes') return `${value.toFixed(1)}m`;
    if (unit === 'hours') return `${value.toFixed(1)}h`;
    if (unit === 'currency') return `$${value.toFixed(2)}`;
    return value.toLocaleString();
  };
  
  return (
    <Card className={`border ${colorClass}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{kpi.name}</CardTitle>
        <CardDescription className="text-xs line-clamp-2">{kpi.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className={`text-2xl font-bold ${valueColorClass}`}>
              {formatValue(kpi.value, kpi.unit)}
            </p>
            <p className="text-xs text-muted-foreground">
              Target: {formatValue(kpi.target, kpi.unit)}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            {icon}
            <span className={`text-sm ${valueColorClass}`}>
              {(performance * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${isGood ? 'bg-green-500' : isCritical ? 'bg-red-500' : 'bg-yellow-500'}`}
              style={{ width: `${Math.min(performance * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KpiDashboard;