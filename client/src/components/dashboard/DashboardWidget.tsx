import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, Database, ExternalLink, Move, Maximize2 } from 'lucide-react';
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

const sizeClasses = {
  small: 'col-span-12 md:col-span-3',
  medium: 'col-span-12 md:col-span-6',
  large: 'col-span-12 md:col-span-9',
  full: 'col-span-12'
};

const DashboardWidget: React.FC<WidgetProps> = ({
  id,
  title,
  type,
  size,
  children,
  onRemove,
  onSizeChange,
  draggable = false,
  onDragStart
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { currentTheme } = useTheme();
  
  const handleRemove = () => {
    onRemove(id);
  };
  
  const handleSizeChange = (newSize: 'small' | 'medium' | 'large' | 'full') => {
    onSizeChange(id, newSize);
  };

  return (
    <Card 
      className={`shadow-sm transition-all duration-200 h-full ${isHovered ? 'ring-1 ring-primary/30' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable={draggable}
      onDragStart={onDragStart}
      data-widget-id={id}
    >
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between border-b">
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
      </CardHeader>
      <CardContent className="p-4 h-[calc(100%-50px)]">
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardWidget;