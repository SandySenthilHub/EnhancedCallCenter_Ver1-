
import React, { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Button } from '@/components/ui/button';
import { Save, BarChart3, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChartWidget from './ChartWidget';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface DashboardProps {
  pageType: 'home' | 'contact_center' | 'mobile_banking';
}

const Dashboard: React.FC<DashboardProps> = ({ pageType }) => {
  const { isEditMode, saveDashboard, dashboards, activeDashboard } = useDashboard();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!activeDashboard) return;

    setIsSaving(true);
    try {
      await saveDashboard();
      toast({
        title: 'Dashboard saved',
        description: 'Your dashboard configuration has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error saving dashboard',
        description: 'There was an error saving your dashboard. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // KPI data with chart configuration
  const kpiData = [
    {
      id: 'aht',
      name: 'Average Handle Time',
      description: 'Average time taken to handle customer calls',
      type: 'time_metric',
      unit: 'seconds',
      target: 180,
      priority: 'critical'
    },
    {
      id: 'csat',
      name: 'Customer Satisfaction',
      description: 'Overall customer satisfaction score',
      type: 'score',
      unit: '%',
      target: 90,
      priority: 'high'
    }
  ];

  return (
    <div className="p-4">
      {/* Dashboard Controls */}
      <div className="mb-4 flex items-center justify-between bg-muted/30 p-3 rounded-md border">
        <div className="flex-1">
          <h2 className="text-lg font-medium">Analytics Dashboard</h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              placeholder="Search metrics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>

          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            size="sm"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData
          .filter(kpi => 
            kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            kpi.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((kpi) => (
            <ChartWidget
              key={kpi.id}
              kpiDefinition={kpi}
              chartType="area"
              showMetadata={true}
            />
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
