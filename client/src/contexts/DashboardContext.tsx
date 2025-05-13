import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DashboardConfig, DashboardWidget, TimeRange } from '@/lib/types';
import { useAuth } from './AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface DashboardContextType {
  dashboardConfig: DashboardConfig;
  setDashboardConfig: (config: DashboardConfig) => void;
  saveDashboardConfig: () => Promise<void>;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  isConfigLoading: boolean;
  availableWidgets: { type: string; title: string; description: string }[];
  addWidget: (widgetType: string) => void;
  removeWidget: (widgetId: string) => void;
  updateWidgetPosition: (widgetId: string, newPosition: number) => void;
  getDateRangeParams: () => { startDate?: string; endDate?: string };
}

const DashboardContext = createContext<DashboardContextType>({
  dashboardConfig: { widgets: [] },
  setDashboardConfig: () => {},
  saveDashboardConfig: async () => {},
  isEditMode: false,
  setIsEditMode: () => {},
  timeRange: 'today',
  setTimeRange: () => {},
  startDate: null,
  setStartDate: () => {},
  endDate: null,
  setEndDate: () => {},
  isConfigLoading: false,
  availableWidgets: [],
  addWidget: () => {},
  removeWidget: () => {},
  updateWidgetPosition: () => {},
  getDateRangeParams: () => ({}),
});

export const useDashboard = () => useContext(DashboardContext);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const { currentUser, currentTenant } = useAuth();
  const { toast } = useToast();
  
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>({ widgets: [] });
  const [isEditMode, setIsEditMode] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isConfigLoading, setIsConfigLoading] = useState(false);

  // Available widgets for the dashboard
  const availableWidgets = [
    { type: 'kpi', title: 'Key Performance Indicators', description: 'AHT, CSAT, FCR, etc.' },
    { type: 'call-volume', title: 'Call Volume Chart', description: 'Line chart of call volumes' },
    { type: 'sentiment-analysis', title: 'Sentiment Analysis', description: 'Pie chart of call sentiments' },
    { type: 'mobile-banking-metrics', title: 'Mobile Banking Metrics', description: 'App usage and transaction stats' },
    { type: 'ivr-flow', title: 'IVR Flow Analysis', description: 'Sankey diagram of IVR paths' },
    { type: 'agent-performance', title: 'Agent Performance', description: 'Table of agent metrics' },
    { type: 'key-phrases', title: 'Key Phrases', description: 'Word cloud of common phrases' },
    { type: 'alerts', title: 'Recent Alerts', description: 'System and KPI alerts' },
  ];

  // Load dashboard configuration when user or tenant changes
  useEffect(() => {
    const loadDashboardConfig = async () => {
      if (!currentUser || !currentTenant) return;

      setIsConfigLoading(true);
      try {
        const response = await fetch(`/api/dashboard-customizations?userId=${currentUser.id}&tenantId=${currentTenant.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to load dashboard configuration');
        }
        
        const data = await response.json();
        
        if (data && data.dashboardConfig) {
          try {
            const config = typeof data.dashboardConfig === 'string' 
              ? JSON.parse(data.dashboardConfig) 
              : data.dashboardConfig;
              
            setDashboardConfig(config);
          } catch (e) {
            console.error('Error parsing dashboard config:', e);
            setDashboardConfig({ widgets: [] });
          }
        } else {
          // Create a default dashboard if none exists
          setDashboardConfig({
            widgets: [
              { id: 'kpi-1', type: 'kpi', title: 'Key Performance Indicators', size: 'full', position: 0, config: {} },
              { id: 'call-volume-1', type: 'call-volume', title: 'Call Volume Trends', size: 'large', position: 1, config: {} },
              { id: 'sentiment-1', type: 'sentiment-analysis', title: 'Call Sentiment Distribution', size: 'medium', position: 2, config: {} }
            ]
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard config:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard configuration',
          variant: 'destructive',
        });
        
        // Create a default dashboard if loading fails
        setDashboardConfig({
          widgets: [
            { id: 'kpi-1', type: 'kpi', title: 'Key Performance Indicators', size: 'full', position: 0, config: {} },
            { id: 'call-volume-1', type: 'call-volume', title: 'Call Volume Trends', size: 'large', position: 1, config: {} },
            { id: 'sentiment-1', type: 'sentiment-analysis', title: 'Call Sentiment Distribution', size: 'medium', position: 2, config: {} }
          ]
        });
      } finally {
        setIsConfigLoading(false);
      }
    };

    loadDashboardConfig();
  }, [currentUser, currentTenant]);

  // Save dashboard configuration
  const saveDashboardConfig = async () => {
    if (!currentUser || !currentTenant) return;

    try {
      const response = await apiRequest('POST', '/api/dashboard-customizations', {
        userId: currentUser.id,
        tenantId: currentTenant.id,
        dashboardConfig: JSON.stringify(dashboardConfig),
        lastUpdated: new Date().toISOString()
      });

      if (!response.ok) {
        throw new Error('Failed to save dashboard configuration');
      }

      toast({
        title: 'Success',
        description: 'Dashboard configuration saved',
      });
      
      setIsEditMode(false);
    } catch (error) {
      console.error('Failed to save dashboard config:', error);
      toast({
        title: 'Error',
        description: 'Failed to save dashboard configuration',
        variant: 'destructive',
      });
    }
  };

  // Add a new widget to the dashboard
  const addWidget = (widgetType: string) => {
    const widget = availableWidgets.find(w => w.type === widgetType);
    if (!widget) return;

    const newWidget: DashboardWidget = {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType,
      title: widget.title,
      size: 'medium',
      position: dashboardConfig.widgets.length,
      config: {}
    };

    setDashboardConfig({
      ...dashboardConfig,
      widgets: [...dashboardConfig.widgets, newWidget]
    });
  };

  // Remove a widget from the dashboard
  const removeWidget = (widgetId: string) => {
    setDashboardConfig({
      ...dashboardConfig,
      widgets: dashboardConfig.widgets.filter(w => w.id !== widgetId)
    });
  };

  // Update widget position
  const updateWidgetPosition = (widgetId: string, newPosition: number) => {
    const updatedWidgets = [...dashboardConfig.widgets];
    const widgetIndex = updatedWidgets.findIndex(w => w.id === widgetId);
    
    if (widgetIndex === -1) return;
    
    const widget = updatedWidgets[widgetIndex];
    updatedWidgets.splice(widgetIndex, 1);
    updatedWidgets.splice(newPosition, 0, widget);
    
    // Update positions
    updatedWidgets.forEach((w, i) => {
      w.position = i;
    });
    
    setDashboardConfig({
      ...dashboardConfig,
      widgets: updatedWidgets
    });
  };

  // Get start and end date parameters based on time range
  const getDateRangeParams = () => {
    if (timeRange === 'custom' && startDate && endDate) {
      return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
    }

    const now = new Date();
    let start: Date;
    
    switch (timeRange) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        return {
          startDate: start.toISOString(),
          endDate: now.toISOString()
        };
      case 'yesterday':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
        return {
          startDate: start.toISOString(),
          endDate: end.toISOString()
        };
      case 'week':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        return {
          startDate: start.toISOString(),
          endDate: now.toISOString()
        };
      case 'month':
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        return {
          startDate: start.toISOString(),
          endDate: now.toISOString()
        };
      default:
        return {};
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboardConfig,
        setDashboardConfig,
        saveDashboardConfig,
        isEditMode,
        setIsEditMode,
        timeRange,
        setTimeRange,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        isConfigLoading,
        availableWidgets,
        addWidget,
        removeWidget,
        updateWidgetPosition,
        getDateRangeParams,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
