import React, { useState } from 'react';
import { useDashboard, Widget } from '@/contexts/DashboardContext';
import DashboardWidget from './DashboardWidget';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddWidgetDialog from './AddWidgetDialog';
import { useTheme } from '@/contexts/ThemeContext';

// Import chart components as needed
// import BarChartComponent from './charts/BarChartComponent';
// import LineChartComponent from './charts/LineChartComponent';
// import PieChartComponent from './charts/PieChartComponent';
// import ValueComponent from './charts/ValueComponent';

interface DashboardGridProps {
  className?: string;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ className }) => {
  const { widgets, isEditMode, updateWidget, removeWidget } = useDashboard();
  const [isAddWidgetDialogOpen, setIsAddWidgetDialogOpen] = useState(false);
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);
  const { currentTheme } = useTheme();
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, widgetId: string) => {
    setDraggedWidgetId(widgetId);
    e.dataTransfer.setData('text/plain', widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isEditMode) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (!isEditMode || !draggedWidgetId) return;
    
    // Reorder widgets based on drag and drop
    const widgetId = e.dataTransfer.getData('text/plain');
    const draggedWidget = widgets.find(w => w.id === widgetId);
    if (!draggedWidget) return;
    
    // Remove widget from original position and add at new position
    const filteredWidgets = widgets.filter(w => w.id !== widgetId);
    filteredWidgets.splice(index, 0, draggedWidget);
    
    // Update position for all widgets
    const updatedWidgets = filteredWidgets.map((widget, idx) => ({
      ...widget,
      position: idx
    }));
    
    // Update widgets in dashboard context
    updatedWidgets.forEach(widget => {
      updateWidget(widget.id, { position: widget.position });
    });
    
    setDraggedWidgetId(null);
  };
  
  const handleSizeChange = (id: string, size: 'small' | 'medium' | 'large' | 'full') => {
    updateWidget(id, { size });
  };
  
  // Sort widgets by position if available
  const sortedWidgets = [...widgets].sort((a, b) => {
    if (a.position !== undefined && b.position !== undefined) {
      return a.position - b.position;
    }
    return 0;
  });
  
  // Get size classes based on widget size
  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-12 sm:col-span-6 md:col-span-3';
      case 'medium': return 'col-span-12 md:col-span-6';
      case 'large': return 'col-span-12 md:col-span-9';
      case 'full': return 'col-span-12';
      default: return 'col-span-12 md:col-span-6';
    }
  };
  
  // Placeholder content for widget types
  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case 'chart':
        return (
          <div className="flex items-center justify-center h-full">
            {widget.chartType === 'bar' && <div className="w-full h-full bg-primary/20 flex items-center justify-center rounded-md">Bar Chart</div>}
            {widget.chartType === 'line' && <div className="w-full h-full bg-secondary/20 flex items-center justify-center rounded-md">Line Chart</div>}
            {widget.chartType === 'pie' && <div className="w-full h-full bg-accent/20 flex items-center justify-center rounded-md">Pie Chart</div>}
            {widget.chartType === 'donut' && <div className="w-full h-full bg-muted flex items-center justify-center rounded-md">Donut Chart</div>}
          </div>
        );
      case 'value':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-bold">123</div>
            <div className="text-sm text-muted-foreground mt-2">Sample Value</div>
          </div>
        );
      case 'table':
        return (
          <div className="w-full h-full bg-muted/20 flex items-center justify-center rounded-md">
            Table View
          </div>
        );
      case 'list':
        return (
          <div className="w-full h-full bg-muted/20 flex items-center justify-center rounded-md">
            List View
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className={`container mx-auto py-4 ${className}`}>
      {isEditMode && (
        <div className="mb-4 flex justify-end">
          <Button
            onClick={() => setIsAddWidgetDialogOpen(true)}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Widget
          </Button>
        </div>
      )}
      
      <div 
        className="grid grid-cols-12 gap-4"
        onDragOver={handleDragOver}
      >
        {sortedWidgets.map((widget, index) => (
          <div
            key={widget.id}
            className={`${getSizeClass(widget.size)}`}
            onDrop={(e) => handleDrop(e, index)}
          >
            <DashboardWidget
              id={widget.id}
              title={widget.title}
              type={widget.type}
              size={widget.size}
              onRemove={removeWidget}
              onSizeChange={handleSizeChange}
              draggable={isEditMode}
              onDragStart={(e) => handleDragStart(e, widget.id)}
            >
              {renderWidgetContent(widget)}
            </DashboardWidget>
          </div>
        ))}
        
        {widgets.length === 0 && (
          <div className="col-span-12 h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No widgets added to the dashboard yet</p>
            {isEditMode && (
              <Button onClick={() => setIsAddWidgetDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Widget
              </Button>
            )}
          </div>
        )}
      </div>
      
      <AddWidgetDialog 
        isOpen={isAddWidgetDialogOpen} 
        onClose={() => setIsAddWidgetDialogOpen(false)} 
      />
    </div>
  );
};

export default DashboardGrid;