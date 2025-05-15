import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MoreHorizontal, Database, ExternalLink, Move } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import KpiDetailsPanel from '@/components/kpi/KpiDetailsPanel';
import { 
  KpiDefinition,
  contactCenterCriticalKpis,
  contactCenterMediumKpis,
  contactCenterLowKpis,
  mobileBankingCriticalKpis,
  mobileBankingMediumKpis,
  mobileBankingLowKpis
} from '@/lib/localKpiData';

// Combine all KPIs for easy access
const allKpis = [
  ...contactCenterCriticalKpis,
  ...contactCenterMediumKpis,
  ...contactCenterLowKpis,
  ...mobileBankingCriticalKpis,
  ...mobileBankingMediumKpis,
  ...mobileBankingLowKpis
];

export interface WidgetProps {
  id: string;
  title: string;
  type: 'chart' | 'value' | 'table' | 'list';
  size: 'small' | 'medium' | 'large' | 'full';
  children: React.ReactNode;
  onRemove: (id: string) => void;
  onSizeChange: (id: string, size: 'small' | 'medium' | 'large' | 'full') => void;
  draggable?: boolean;
  onDragStart?: React.DragEventHandler<HTMLDivElement>;
  kpiId?: string;
  sqlQuery?: string;
}

const DashboardWidget: React.FC<WidgetProps> = ({
  id,
  title,
  type,
  size,
  children,
  onRemove,
  onSizeChange,
  draggable = false,
  onDragStart,
  kpiId,
  sqlQuery
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [kpiDetails, setKpiDetails] = useState<KpiDefinition | undefined>(undefined);
  const { currentTheme } = useTheme();
  
  useEffect(() => {
    if (kpiId) {
      const kpi = allKpis.find(k => k.id === kpiId);
      if (kpi) {
        setKpiDetails(kpi);
      }
    }
  }, [kpiId]);
  
  const handleRemove = () => {
    onRemove(id);
  };
  
  const handleSizeChange = (newSize: 'small' | 'medium' | 'large' | 'full') => {
    onSizeChange(id, newSize);
  };
  
  const openDetails = () => {
    setIsDetailsOpen(true);
  };

  return (
    <Card 
      className={`shadow-sm transition-all duration-200 h-full relative ${isHovered ? 'ring-1 ring-primary/30' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable={draggable}
      onDragStart={onDragStart}
      data-widget-id={id}
    >
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex flex-col">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              {draggable && (
                <div className="mr-2 cursor-move opacity-70 hover:opacity-100">
                  <Move className="h-4 w-4" />
                </div>
              )}
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Widget menu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {kpiId && (
                  <DropdownMenuItem onClick={openDetails} className="text-primary">
                    <Database className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleSizeChange('small')}>
                  Small
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSizeChange('medium')}>
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSizeChange('large')}>
                  Large
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSizeChange('full')}>
                  Full Width
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRemove} className="text-destructive">
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {kpiDetails && (
            <CardDescription className="text-xs mt-1 line-clamp-2">
              {kpiDetails.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 h-[calc(100%-75px)]">
        {children}
      </CardContent>

      {/* Add details button for KPI widgets */}
      {kpiId && kpiDetails && (
        <div className="absolute bottom-3 right-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 w-7 p-0 rounded-full bg-background/60 backdrop-blur-sm"
            onClick={openDetails}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="sr-only">View KPI Details</span>
          </Button>
        </div>
      )}

      {/* KPI Details Panel */}
      {kpiDetails && (
        <KpiDetailsPanel 
          isOpen={isDetailsOpen} 
          onClose={() => setIsDetailsOpen(false)} 
          kpi={kpiDetails}
          widget={{
            id,
            title,
            type,
            size,
            sqlQuery,
            kpiId
          }}
        />
      )}
    </Card>
  );
};

export default DashboardWidget;