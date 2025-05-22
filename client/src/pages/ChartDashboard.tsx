import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Grid3X3, 
  List, 
  Filter,
  RefreshCw,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { KpiDefinition, getKpisByTypeAndPriority } from '@/lib/localKpiData';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SelectedKpi extends KpiDefinition {
  id: string;
  chartType: 'line' | 'bar' | 'area';
}

export const ChartDashboard: React.FC = () => {
  const [selectedKpis, setSelectedKpis] = useState<SelectedKpi[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'contact_center' | 'mobile_banking'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'critical' | 'medium' | 'low'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { currentTenant } = useAuth();

  // Get available KPIs based on filters
  const availableKpis = React.useMemo(() => {
    const contactCenterKpis = getKpisByTypeAndPriority('contact_center', filterPriority !== 'all' ? filterPriority : undefined);
    const mobileBankingKpis = getKpisByTypeAndPriority('mobile_banking', filterPriority !== 'all' ? filterPriority : undefined);
    
    if (filterType === 'contact_center') return contactCenterKpis;
    if (filterType === 'mobile_banking') return mobileBankingKpis;
    return [...contactCenterKpis, ...mobileBankingKpis];
  }, [filterType, filterPriority]);

  // Load saved configuration from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chartDashboardConfig');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setSelectedKpis(config.selectedKpis || []);
        setViewMode(config.viewMode || 'grid');
      } catch (error) {
        console.error('Error loading chart dashboard config:', error);
      }
    } else {
      // Default selection - add a few sample KPIs
      const defaultKpis = availableKpis.slice(0, 6).map(kpi => ({
        ...kpi,
        chartType: 'area' as const
      }));
      setSelectedKpis(defaultKpis);
    }
  }, []);

  // Save configuration to localStorage
  useEffect(() => {
    const config = {
      selectedKpis,
      viewMode
    };
    localStorage.setItem('chartDashboardConfig', JSON.stringify(config));
  }, [selectedKpis, viewMode]);

  const addKpi = (kpi: KpiDefinition, chartType: 'line' | 'bar' | 'area' = 'area') => {
    const newKpi: SelectedKpi = {
      ...kpi,
      chartType
    };
    setSelectedKpis(prev => [...prev, newKpi]);
    setShowAddDialog(false);
  };

  const removeKpi = (kpiId: string) => {
    setSelectedKpis(prev => prev.filter(kpi => kpi.id !== kpiId));
  };

  const updateChartType = (kpiId: string, chartType: 'line' | 'bar' | 'area') => {
    setSelectedKpis(prev => 
      prev.map(kpi => 
        kpi.id === kpiId ? { ...kpi, chartType } : kpi
      )
    );
  };

  const resetDashboard = () => {
    setSelectedKpis([]);
    localStorage.removeItem('chartDashboardConfig');
  };

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Chart Dashboard
            </h1>
            <p className="text-muted-foreground">
              Interactive visualization dashboard for {currentTenant?.name || 'X Bank'} KPIs
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetDashboard}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Chart
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add KPI Chart</DialogTitle>
                  <DialogDescription>
                    Select a KPI to visualize from the available metrics
                  </DialogDescription>
                </DialogHeader>
                
                {/* Filters */}
                <div className="flex gap-4 mb-4">
                  <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="contact_center">Contact Center</SelectItem>
                      <SelectItem value="mobile_banking">Mobile Banking</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as any)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Available KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableKpis
                    .filter(kpi => !selectedKpis.some(selected => selected.id === kpi.id))
                    .map(kpi => (
                    <Card key={kpi.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-sm">{kpi.name}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {kpi.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant={kpi.priority === 'critical' ? 'destructive' : 
                                     kpi.priority === 'medium' ? 'default' : 'outline'} 
                            className="text-xs"
                          >
                            {kpi.priority}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {kpi.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => addKpi(kpi, 'area')}
                            className="flex-1"
                          >
                            Area Chart
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => addKpi(kpi, 'line')}
                            className="flex-1"
                          >
                            Line Chart
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => addKpi(kpi, 'bar')}
                            className="flex-1"
                          >
                            Bar Chart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* View Mode Toggle and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {selectedKpis.length} charts displayed
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">
              Live data with banking patterns
            </span>
          </div>
        </div>
      </div>

      {/* Charts Display */}
      {selectedKpis.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No charts selected</h3>
            <p className="text-muted-foreground mb-4">
              Add KPI charts to start visualizing your banking analytics data
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Chart
            </Button>
          </div>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-6"
        }>
          {selectedKpis.map((kpi) => (
            <ChartWidget
              key={kpi.id}
              kpiDefinition={kpi}
              chartType={kpi.chartType}
              onRemove={() => removeKpi(kpi.id)}
              className={viewMode === 'list' ? 'w-full' : ''}
              showMetadata={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartDashboard;