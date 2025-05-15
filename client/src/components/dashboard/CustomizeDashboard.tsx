import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  BarChart, 
  LineChart, 
  PieChart, 
  Activity
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard, Widget } from '@/contexts/DashboardContext';
import { useToast } from '@/hooks/use-toast';

// Import the KPI definitions
import {
  KpiDefinition,
  contactCenterCriticalKpis,
  contactCenterMediumKpis,
  contactCenterLowKpis,
  mobileBankingCriticalKpis,
  mobileBankingMediumKpis,
  mobileBankingLowKpis
} from '@/lib/localKpiData';
import KpiList from '@/components/kpi/KpiList';

// Combine all KPIs for easy access
const allKpis = [
  ...contactCenterCriticalKpis,
  ...contactCenterMediumKpis,
  ...contactCenterLowKpis,
  ...mobileBankingCriticalKpis,
  ...mobileBankingMediumKpis,
  ...mobileBankingLowKpis
];

// Organize KPIs by type
const contactCenterKpis = [
  ...contactCenterCriticalKpis,
  ...contactCenterMediumKpis,
  ...contactCenterLowKpis
];

const mobileBankingKpis = [
  ...mobileBankingCriticalKpis,
  ...mobileBankingMediumKpis,
  ...mobileBankingLowKpis
];

interface CustomizeDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DraggableWidgetProps {
  kpi: KpiDefinition;
  onAdd: () => void;
}

// Individual widget option component
const DraggableWidget: React.FC<DraggableWidgetProps> = ({ kpi, onAdd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { currentTheme } = useTheme();
  
  // Determine badge color based on priority
  const priorityBadgeColor = {
    critical: 'bg-red-100 text-red-800',
    medium: 'bg-amber-100 text-amber-800',
    low: 'bg-green-100 text-green-800'
  }[kpi.priority];
  
  // Determine icon based on unit or type
  const getIcon = () => {
    if (kpi.unit.includes('%')) {
      return <PieChart className="h-4 w-4 text-muted-foreground" />;
    } else if (kpi.unit.includes('seconds') || kpi.unit.includes('milliseconds')) {
      return <Activity className="h-4 w-4 text-muted-foreground" />;
    } else if (kpi.unit.includes('users') || kpi.unit.includes('count')) {
      return <BarChart className="h-4 w-4 text-muted-foreground" />;
    } else {
      return <LineChart className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  return (
    <div 
      className={`flex justify-between items-center p-3 border rounded-md mb-2 bg-white cursor-grab hover:border-primary/50 ${
        isDragging ? 'opacity-50' : ''
      }`}
      draggable 
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.setData('text/plain', kpi.id);
      }}
      onDragEnd={() => setIsDragging(false)}
    >
      <div className="flex items-center">
        <div className="mr-2">
          {getIcon()}
        </div>
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-sm">{kpi.name}</h3>
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${priorityBadgeColor}`}>
              {kpi.priority}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{kpi.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <span className="text-xs text-muted-foreground">{kpi.unit}</span>
        <button 
          onClick={onAdd}
          className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-muted"
          title="Add to dashboard"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const CustomizeDashboard: React.FC<CustomizeDashboardProps> = ({ isOpen, onClose }) => {
  const { addWidget } = useDashboard();
  const { toast } = useToast();
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  // State for drag and drop handling
  const [draggedKpi, setDraggedKpi] = useState<KpiDefinition | null>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const kpiId = e.dataTransfer.getData('text/plain');
    const kpiDef = allKpis.find((k: KpiDefinition) => k.id === kpiId);
    
    if (kpiDef) {
      addWidgetFromKpi(kpiDef);
    }
  };
  
  const addWidgetFromKpi = (kpi: KpiDefinition) => {
    // Determine widget type based on KPI characteristics
    let widgetType: 'chart' | 'value' | 'table' | 'list' = 'value';
    let chartType: 'bar' | 'line' | 'pie' | 'donut' | undefined = undefined;
    
    if (kpi.unit === '%') {
      widgetType = 'chart';
      chartType = 'pie';
    } else if (kpi.unit.includes('seconds') || kpi.unit.includes('milliseconds')) {
      widgetType = 'chart';
      chartType = 'line';
    } else if (kpi.name.toLowerCase().includes('rate') || kpi.name.toLowerCase().includes('trend')) {
      widgetType = 'chart';
      chartType = 'line';
    } else if (kpi.unit.includes('users') || kpi.unit.includes('count')) {
      widgetType = 'chart';
      chartType = 'bar';
    }
    
    const newWidget: Widget = {
      id: `widget-${kpi.id}-${Date.now()}`,
      title: kpi.name,
      type: widgetType,
      size: kpi.priority === 'critical' ? 'medium' : 'small',
      chartType: chartType,
      kpiId: kpi.id,
      sqlQuery: kpi.calculation,
    };
    
    addWidget(newWidget);
    
    toast({
      title: 'KPI added',
      description: `${kpi.name} has been added to your dashboard.`,
    });
  };
  
  const handleReset = () => {
    // Logic to reset dashboard to default
    toast({
      title: 'Dashboard reset',
      description: 'Your dashboard has been reset to default layout.',
    });
  };
  
  // We don't need a filter function anymore since KpiList handles filtering internally
  
  // No need to redefine these arrays as they're already defined at the top level
  
  // Handle KPI drag start from the KpiList component
  const handleKpiDragStart = (kpi: KpiDefinition) => {
    // Set the dragged KPI state for reference
    setDraggedKpi(kpi);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Customize Dashboard Layout</DialogTitle>
          <DialogDescription>
            Drag and drop KPIs to customize your dashboard layout
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden py-4 flex gap-6">
          {/* Available KPIs Column */}
          <div className="w-[350px] flex-shrink-0 flex flex-col h-full">
            {/* Use our new KpiList component */}
            <KpiList 
              contactCenterKpis={contactCenterKpis}
              mobileBankingKpis={mobileBankingKpis}
              onKpiDragStart={handleKpiDragStart}
            />
          </div>
          
          {/* Drop Zone Column */}
          <div className="flex-1">
            <div
              ref={dropZoneRef}
              className={`border-2 ${
                isDragOver 
                  ? 'border-primary border-solid' 
                  : 'border-dashed'
              } rounded-md h-full p-4 flex items-center justify-center`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center text-muted-foreground">
                <p>Drag KPIs here to add them to your dashboard</p>
                <p className="text-xs mt-2">KPIs will automatically select the appropriate visualization</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <div>
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button onClick={onClose}>
              Save Layout
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizeDashboard;