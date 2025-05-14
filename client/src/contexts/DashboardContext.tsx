import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define widget types
export interface Widget {
  id: string;
  title: string;
  type: 'chart' | 'value' | 'table' | 'list';
  size: 'small' | 'medium' | 'large' | 'full';
  kpiId?: string;
  chartType?: 'bar' | 'line' | 'pie' | 'donut';
  position?: number;
  sqlQuery?: string;
  layoutInfo?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

// Define dashboard layout configuration
export interface DashboardConfig {
  id: string;
  name: string;
  createdBy: string;
  widgets: Widget[];
  layout: 'grid' | 'fluid';
  isDefault: boolean;
}

// Define dashboard context type
interface DashboardContextType {
  dashboards: DashboardConfig[];
  activeDashboard: DashboardConfig | null;
  widgets: Widget[];
  isEditMode: boolean;
  timeRange: string;
  setDashboards: (dashboards: DashboardConfig[]) => void;
  setActiveDashboard: (dashboard: DashboardConfig) => void;
  setWidgets: (widgets: Widget[]) => void;
  addWidget: (widget: Widget) => void;
  updateWidget: (id: string, widget: Partial<Widget>) => void;
  removeWidget: (id: string) => void;
  setIsEditMode: (isEdit: boolean) => void;
  setTimeRange: (range: string) => void;
  saveDashboard: () => Promise<void>;
  createDashboard: (name: string) => void;
}

// Create context with default values
const DashboardContext = createContext<DashboardContextType>({
  dashboards: [],
  activeDashboard: null,
  widgets: [],
  isEditMode: false,
  timeRange: 'week',
  setDashboards: () => {},
  setActiveDashboard: () => {},
  setWidgets: () => {},
  addWidget: () => {},
  updateWidget: () => {},
  removeWidget: () => {},
  setIsEditMode: () => {},
  setTimeRange: () => {},
  saveDashboard: async () => {},
  createDashboard: () => {},
});

// Provider component
interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [dashboards, setDashboards] = useState<DashboardConfig[]>([]);
  const [activeDashboard, setActiveDashboard] = useState<DashboardConfig | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [timeRange, setTimeRange] = useState('week');

  // Load dashboards from localStorage or API on mount
  useEffect(() => {
    const loadDashboards = async () => {
      try {
        // First try to load from API
        // const response = await fetch('/api/dashboards');
        // if (response.ok) {
        //   const data = await response.json();
        //   setDashboards(data);
        //   if (data.length > 0) {
        //     setActiveDashboard(data.find(d => d.isDefault) || data[0]);
        //   }
        //   return;
        // }

        // Fallback to localStorage if API fails
        const savedDashboards = localStorage.getItem('user-dashboards');
        if (savedDashboards) {
          const parsedDashboards = JSON.parse(savedDashboards);
          setDashboards(parsedDashboards);
          
          // Set active dashboard to default or first
          if (parsedDashboards.length > 0) {
            const defaultDashboard = parsedDashboards.find((d: DashboardConfig) => d.isDefault);
            setActiveDashboard(defaultDashboard || parsedDashboards[0]);
          }
        } else {
          // Create a default dashboard if none exists
          const defaultDashboard: DashboardConfig = {
            id: 'default',
            name: 'Main Dashboard',
            createdBy: 'system',
            widgets: [],
            layout: 'grid',
            isDefault: true,
          };
          setDashboards([defaultDashboard]);
          setActiveDashboard(defaultDashboard);
        }
      } catch (error) {
        console.error('Failed to load dashboards:', error);
      }
    };

    loadDashboards();
  }, []);

  // Update widgets when active dashboard changes
  useEffect(() => {
    if (activeDashboard) {
      setWidgets(activeDashboard.widgets);
    }
  }, [activeDashboard]);

  // Add a new widget
  const addWidget = (widget: Widget) => {
    const newWidgets = [...widgets, widget];
    setWidgets(newWidgets);
    
    // Also update in the active dashboard
    if (activeDashboard) {
      const updatedDashboard = {
        ...activeDashboard,
        widgets: newWidgets,
      };
      setActiveDashboard(updatedDashboard);
      
      // Update in dashboards array
      const updatedDashboards = dashboards.map(d => 
        d.id === updatedDashboard.id ? updatedDashboard : d
      );
      setDashboards(updatedDashboards);
    }
  };

  // Update an existing widget
  const updateWidget = (id: string, widgetUpdate: Partial<Widget>) => {
    const updatedWidgets = widgets.map(widget => 
      widget.id === id ? { ...widget, ...widgetUpdate } : widget
    );
    setWidgets(updatedWidgets);
    
    // Also update in the active dashboard
    if (activeDashboard) {
      const updatedDashboard = {
        ...activeDashboard,
        widgets: updatedWidgets,
      };
      setActiveDashboard(updatedDashboard);
      
      // Update in dashboards array
      const updatedDashboards = dashboards.map(d => 
        d.id === updatedDashboard.id ? updatedDashboard : d
      );
      setDashboards(updatedDashboards);
    }
  };

  // Remove a widget
  const removeWidget = (id: string) => {
    const updatedWidgets = widgets.filter(widget => widget.id !== id);
    setWidgets(updatedWidgets);
    
    // Also update in the active dashboard
    if (activeDashboard) {
      const updatedDashboard = {
        ...activeDashboard,
        widgets: updatedWidgets,
      };
      setActiveDashboard(updatedDashboard);
      
      // Update in dashboards array
      const updatedDashboards = dashboards.map(d => 
        d.id === updatedDashboard.id ? updatedDashboard : d
      );
      setDashboards(updatedDashboards);
    }
  };

  // Save dashboard to localStorage and/or API
  const saveDashboard = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('user-dashboards', JSON.stringify(dashboards));
      
      // TODO: Save to API
      // const response = await fetch('/api/dashboards', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(dashboards),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to save dashboards');
      // }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving dashboard:', error);
      return Promise.reject(error);
    }
  };

  // Create a new dashboard
  const createDashboard = (name: string) => {
    const newDashboard: DashboardConfig = {
      id: `dashboard-${Date.now()}`,
      name,
      createdBy: 'user',
      widgets: [],
      layout: 'grid',
      isDefault: false,
    };
    
    const updatedDashboards = [...dashboards, newDashboard];
    setDashboards(updatedDashboards);
    setActiveDashboard(newDashboard);
    
    // Save to localStorage
    localStorage.setItem('user-dashboards', JSON.stringify(updatedDashboards));
  };

  const contextValue: DashboardContextType = {
    dashboards,
    activeDashboard,
    widgets,
    isEditMode, 
    timeRange,
    setDashboards,
    setActiveDashboard,
    setWidgets,
    addWidget,
    updateWidget,
    removeWidget,
    setIsEditMode,
    setTimeRange,
    saveDashboard,
    createDashboard,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

// Hook for easy access to the dashboard context
export function useDashboard() {
  return useContext(DashboardContext);
}