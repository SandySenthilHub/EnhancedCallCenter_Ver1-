import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Define the widget types
interface WidgetDefinition {
  id: string;
  name: string;
  description: string;
  type: string;
}

// Available widgets for the dashboard
const availableWidgets: WidgetDefinition[] = [
  {
    id: 'key-performance',
    name: 'Key Performance Indicators',
    description: 'AHT, CSAT, FCR, etc.',
    type: 'kpi',
  },
  {
    id: 'call-volume',
    name: 'Call Volume Chart',
    description: 'Line chart of call volumes',
    type: 'chart',
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    description: 'Pie chart of call sentiments',
    type: 'chart',
  },
  {
    id: 'mobile-banking',
    name: 'Mobile Banking Metrics',
    description: 'App usage and transaction stats',
    type: 'metrics',
  },
  {
    id: 'ivr-flow',
    name: 'IVR Flow Analysis',
    description: 'Sankey diagram of IVR paths',
    type: 'flow',
  },
  {
    id: 'agent-performance',
    name: 'Agent Performance',
    description: 'Table of agent metrics',
    type: 'table',
  },
  {
    id: 'key-phrases',
    name: 'Key Phrases',
    description: 'Word cloud of common phrases',
    type: 'cloud',
  },
  {
    id: 'recent-alerts',
    name: 'Recent Alerts',
    description: 'System and KPI alerts',
    type: 'alerts',
  },
];

interface CustomizeDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (layout: string[]) => void;
  currentLayout?: string[];
}

export function CustomizeDashboard({
  isOpen,
  onClose,
  onSave,
  currentLayout = []
}: CustomizeDashboardProps) {
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(currentLayout);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  // Add a widget to the dashboard
  const addWidget = (widgetId: string) => {
    if (!selectedWidgets.includes(widgetId)) {
      setSelectedWidgets([...selectedWidgets, widgetId]);
    }
  };

  // Remove a widget from the dashboard
  const removeWidget = (widgetId: string) => {
    setSelectedWidgets(selectedWidgets.filter(id => id !== widgetId));
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.setData('widgetId', widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const widgetId = e.dataTransfer.getData('widgetId');
    
    // If the widget is not already in the selected widgets, add it
    if (!selectedWidgets.includes(widgetId)) {
      addWidget(widgetId);
    }
    
    setDraggedWidget(null);
  };

  // Handle save
  const handleSave = () => {
    onSave(selectedWidgets);
    onClose();
  };

  // Reset to default layout
  const resetToDefault = () => {
    setSelectedWidgets(['key-performance', 'call-volume', 'sentiment-analysis', 'agent-performance']);
  };

  // Render a widget item in the available widgets list
  const renderWidgetItem = (widget: WidgetDefinition) => {
    const isSelected = selectedWidgets.includes(widget.id);
    
    return (
      <div
        key={widget.id}
        className="flex items-center justify-between p-4 mb-2 bg-white border rounded-md shadow-sm"
        draggable
        onDragStart={(e) => handleDragStart(e, widget.id)}
      >
        <div className="flex-1">
          <h3 className="text-sm font-medium">{widget.name}</h3>
          <p className="text-xs text-muted-foreground">{widget.description}</p>
        </div>
        <Button
          size="sm"
          variant={isSelected ? "secondary" : "ghost"}
          className="ml-2"
          onClick={() => isSelected ? removeWidget(widget.id) : addWidget(widget.id)}
        >
          <Plus className={`h-4 w-4 ${isSelected ? 'rotate-45' : ''}`} />
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Customize Dashboard Layout</DialogTitle>
          <DialogDescription>
            Drag and drop widgets to customize your dashboard layout
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          {/* Available Widgets Column */}
          <div className="w-full md:w-1/3">
            <h3 className="text-sm font-medium mb-3">Available Widgets</h3>
            <div className="space-y-2">
              {availableWidgets.map(renderWidgetItem)}
            </div>
          </div>
          
          {/* Dashboard Layout Column */}
          <div 
            className="w-full md:w-2/3 border border-dashed rounded-md p-4 min-h-[400px] flex items-center justify-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {selectedWidgets.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <p>Drag widgets here to add them to your dashboard</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {selectedWidgets.map(widgetId => {
                  const widget = availableWidgets.find(w => w.id === widgetId);
                  if (!widget) return null;
                  
                  return (
                    <div 
                      key={widget.id}
                      className="bg-white border rounded-md p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">{widget.name}</h3>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeWidget(widget.id)}
                        >
                          <Plus className="h-4 w-4 rotate-45" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{widget.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={resetToDefault}
            className="mr-auto"
          >
            Reset to Default
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}