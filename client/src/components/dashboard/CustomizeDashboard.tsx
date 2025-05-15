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
import { Plus, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard, Widget } from '@/contexts/DashboardContext';
import { useToast } from '@/hooks/use-toast';

// Define available widgets based on the image
const availableWidgetDefinitions = [
  {
    id: 'kpi',
    name: 'Key Performance Indicators',
    description: 'AHT, CSAT, FCR, etc.',
    type: 'value',
    size: 'small'
  },
  {
    id: 'call-volume',
    name: 'Call Volume Chart',
    description: 'Line chart of call volumes',
    type: 'chart',
    chartType: 'line',
    size: 'medium'
  },
  {
    id: 'sentiment',
    name: 'Sentiment Analysis',
    description: 'Pie chart of call sentiments',
    type: 'chart',
    chartType: 'pie',
    size: 'medium'
  },
  {
    id: 'mobile-banking',
    name: 'Mobile Banking Metrics',
    description: 'App usage and transaction stats',
    type: 'chart',
    chartType: 'bar',
    size: 'medium'
  },
  {
    id: 'ivr-flow',
    name: 'IVR Flow Analysis',
    description: 'Sankey diagram of IVR paths',
    type: 'chart',
    chartType: 'sankey',
    size: 'large'
  },
  {
    id: 'agent-performance',
    name: 'Agent Performance',
    description: 'Table of agent metrics',
    type: 'table',
    size: 'large'
  },
  {
    id: 'key-phrases',
    name: 'Key Phrases',
    description: 'Word cloud of common phrases',
    type: 'chart',
    chartType: 'wordcloud',
    size: 'medium'
  },
  {
    id: 'alerts',
    name: 'Recent Alerts',
    description: 'System and KPI alerts',
    type: 'list',
    size: 'medium'
  },
];

interface CustomizeDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DraggableWidgetProps {
  name: string;
  description: string;
  onAdd: () => void;
}

// Individual widget option component
const DraggableWidget: React.FC<DraggableWidgetProps> = ({ name, description, onAdd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { currentTheme } = useTheme();
  
  return (
    <div 
      className={`flex justify-between items-center p-4 border rounded-md mb-3 bg-white cursor-grab ${
        isDragging ? 'opacity-50' : ''
      }`}
      draggable 
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.setData('text/plain', name);
      }}
      onDragEnd={() => setIsDragging(false)}
    >
      <div>
        <h3 className="font-medium text-sm">{name}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button 
        onClick={onAdd}
        className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-muted"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

const CustomizeDashboard: React.FC<CustomizeDashboardProps> = ({ isOpen, onClose }) => {
  const { addWidget } = useDashboard();
  const { toast } = useToast();
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
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
    
    const widgetName = e.dataTransfer.getData('text/plain');
    const widgetDef = availableWidgetDefinitions.find(w => w.name === widgetName);
    
    if (widgetDef) {
      addWidgetFromDefinition(widgetDef);
    }
  };
  
  const addWidgetFromDefinition = (widgetDef: any) => {
    const newWidget: Widget = {
      id: `widget-${widgetDef.id}-${Date.now()}`,
      title: widgetDef.name,
      type: widgetDef.type,
      size: widgetDef.size,
      chartType: widgetDef.chartType,
    };
    
    addWidget(newWidget);
    
    toast({
      title: 'Widget added',
      description: `${widgetDef.name} has been added to your dashboard.`,
    });
  };
  
  const handleReset = () => {
    // Logic to reset dashboard to default
    toast({
      title: 'Dashboard reset',
      description: 'Your dashboard has been reset to default layout.',
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Customize Dashboard Layout</DialogTitle>
          <DialogDescription>
            Drag and drop widgets to customize your dashboard layout
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto py-4 flex gap-6">
          {/* Available Widgets Column */}
          <div className="w-[300px] flex-shrink-0">
            <h3 className="font-medium mb-3">Available Widgets</h3>
            <div className="space-y-1">
              {availableWidgetDefinitions.map((widget) => (
                <DraggableWidget
                  key={widget.id}
                  name={widget.name}
                  description={widget.description}
                  onAdd={() => addWidgetFromDefinition(widget)}
                />
              ))}
            </div>
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
                <p>Drag widgets here to add them to your dashboard</p>
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