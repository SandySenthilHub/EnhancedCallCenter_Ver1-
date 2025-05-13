import React, { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useToast } from '@/hooks/use-toast';
import { X, Edit, Trash2, Plus, Save } from 'lucide-react';
import { DashboardWidget } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const DashboardEditor: React.FC = () => {
  const { 
    dashboardConfig, 
    setDashboardConfig, 
    isEditMode, 
    setIsEditMode, 
    saveDashboardConfig,
    availableWidgets,
    addWidget,
    removeWidget,
    updateWidgetPosition
  } = useDashboard();
  const { toast } = useToast();
  const [draggingWidget, setDraggingWidget] = useState<string | null>(null);
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(null);

  const handleDragStart = (widgetId: string) => {
    setDraggingWidget(widgetId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetPosition: number) => {
    if (draggingWidget) {
      updateWidgetPosition(draggingWidget, targetPosition);
      setDraggingWidget(null);
    }
  };

  const handleSaveLayout = async () => {
    try {
      await saveDashboardConfig();
      toast({
        title: 'Dashboard saved',
        description: 'Your dashboard layout has been saved successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error saving dashboard',
        description: 'There was a problem saving your dashboard layout.',
        variant: 'destructive'
      });
    }
  };

  const handleAddWidget = (widgetType: string) => {
    addWidget(widgetType);
  };

  const handleResetDashboard = () => {
    // Set to default configuration
    setDashboardConfig({
      widgets: [
        { id: 'kpi-1', type: 'kpi', title: 'Key Performance Indicators', size: 'full', position: 0, config: {} },
        { id: 'call-volume-1', type: 'call-volume', title: 'Call Volume Trends', size: 'large', position: 1, config: {} },
        { id: 'sentiment-1', type: 'sentiment-analysis', title: 'Call Sentiment Distribution', size: 'medium', position: 2, config: {} }
      ]
    });
    
    toast({
      title: 'Dashboard reset',
      description: 'Your dashboard has been reset to default layout.'
    });
  };

  return (
    <>
      <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Customize Dashboard Layout</DialogTitle>
            <DialogDescription>
              Drag and drop widgets to customize your dashboard layout
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-1 overflow-hidden">
            {/* Widget Sidebar */}
            <div className="w-64 bg-neutral-50 border-r border-neutral-100 p-4 overflow-y-auto">
              <h3 className="text-sm font-medium text-neutral-700 mb-2">Available Widgets</h3>
              <div className="space-y-2">
                {availableWidgets.map((widget) => (
                  <div 
                    key={widget.type}
                    className="bg-white p-2 rounded border border-neutral-200 shadow-sm cursor-move"
                    onClick={() => handleAddWidget(widget.type)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-neutral-700">{widget.title}</div>
                        <div className="text-xs text-neutral-500">{widget.description}</div>
                      </div>
                      <Plus className="h-4 w-4 text-neutral-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Layout Editor */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="bg-neutral-50 border border-dashed border-neutral-300 rounded-lg p-4 min-h-full">
                {dashboardConfig.widgets.length === 0 ? (
                  <div className="text-center text-neutral-400 p-8">
                    Drag widgets here to add them to your dashboard
                  </div>
                ) : (
                  <div 
                    className="grid grid-cols-12 gap-4"
                    onDragOver={handleDragOver}
                  >
                    {dashboardConfig.widgets.map((widget, index) => {
                      const sizeClass = 
                        widget.size === 'small' ? 'col-span-12 md:col-span-3' :
                        widget.size === 'medium' ? 'col-span-12 md:col-span-4' :
                        widget.size === 'large' ? 'col-span-12 md:col-span-8' :
                        'col-span-12';
                        
                      return (
                        <div 
                          key={widget.id}
                          className={`${sizeClass} bg-white p-3 rounded border border-neutral-200 shadow-sm`}
                          draggable
                          onDragStart={() => handleDragStart(widget.id)}
                          onDrop={() => handleDrop(index)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-medium text-neutral-700">{widget.title}</div>
                            <div className="flex space-x-1">
                              <button 
                                className="p-1 text-neutral-400 hover:text-neutral-500"
                                onClick={() => setEditingWidget(widget)}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                className="p-1 text-neutral-400 hover:text-neutral-500"
                                onClick={() => removeWidget(widget.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="bg-neutral-50 h-32 rounded flex items-center justify-center">
                            <div className="text-xs text-neutral-400">{widget.type} widget preview</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-100 p-4 flex justify-between">
            <button 
              className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 text-sm hover:bg-neutral-50"
              onClick={handleResetDashboard}
            >
              Reset to Default
            </button>
            <div className="space-x-2">
              <button 
                className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 text-sm hover:bg-neutral-50"
                onClick={() => setIsEditMode(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-primary-600 border border-primary-600 rounded-md text-white text-sm hover:bg-primary-700 flex items-center"
                onClick={handleSaveLayout}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Layout
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Widget Editor Dialog - if needed */}
      {editingWidget && (
        <Dialog open={!!editingWidget} onOpenChange={() => setEditingWidget(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Widget</DialogTitle>
              <DialogDescription>
                Customize the widget settings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input 
                  type="text" 
                  className="w-full border border-neutral-200 rounded-md p-2 text-sm"
                  value={editingWidget.title}
                  onChange={(e) => {
                    setEditingWidget({
                      ...editingWidget,
                      title: e.target.value
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <select 
                  className="w-full border border-neutral-200 rounded-md p-2 text-sm"
                  value={editingWidget.size}
                  onChange={(e) => {
                    setEditingWidget({
                      ...editingWidget,
                      size: e.target.value as any
                    });
                  }}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="full">Full Width</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 text-sm hover:bg-neutral-50"
                onClick={() => setEditingWidget(null)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-primary-600 border border-primary-600 rounded-md text-white text-sm hover:bg-primary-700"
                onClick={() => {
                  // Update the widget in the dashboard config
                  setDashboardConfig({
                    ...dashboardConfig,
                    widgets: dashboardConfig.widgets.map(w => 
                      w.id === editingWidget.id ? editingWidget : w
                    )
                  });
                  
                  setEditingWidget(null);
                }}
              >
                Apply Changes
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default DashboardEditor;
