import React, { useState } from 'react';
import { getKpisByTypeAndPriority, generateKpiValues } from '../lib/localKpiData';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Phone, Headphones, Users, Clock, Plus } from "lucide-react";
import DataTable from "@/components/ui/data-table";
import KpiEditor from "@/components/kpi/KpiEditor";

const ContactCenter: React.FC = () => {
  const [kpis, setKpis] = useState<any[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<any>(null);
  const { currentTenant } = useAuth();
  const tenantId = currentTenant?.id || 1;

  // Get KPI data from the local store
  React.useEffect(() => {
    const kpiDefinitions = getKpisByTypeAndPriority('contact_center');
    const generatedKpis = generateKpiValues(tenantId, kpiDefinitions);
    setKpis(generatedKpis);
  }, [tenantId]);

  // Trend indicator component
  const getTrendIndicator = (value: number, target: number, threshold: number) => {
    const percentage = (value / target) * 100;
    
    if (percentage >= 95) {
      return <TrendingUp className="text-green-500 ml-2" size={18} />;
    } else if (percentage < threshold / target * 100) {
      return <TrendingDown className="text-red-500 ml-2" size={18} />;
    } else {
      return <Minus className="text-yellow-500 ml-2" size={18} />;
    }
  };

  // Get color based on KPI status
  const getStatusColor = (value: number, target: number, threshold: number) => {
    const percentage = (value / target) * 100;
    
    if (percentage >= 95) {
      return "bg-green-100 text-green-800";
    } else if (percentage < threshold / target * 100) {
      return "bg-red-100 text-red-800";
    } else {
      return "bg-yellow-100 text-yellow-800";
    }
  };

  // Get category badge
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  // Handle create KPI
  const handleCreate = () => {
    setSelectedKpi(null);
    setIsEditorOpen(true);
  };

  // Handle edit KPI
  const handleEdit = (kpi: any) => {
    setSelectedKpi(kpi);
    setIsEditorOpen(true);
  };

  // Handle delete KPI
  const handleDelete = (kpi: any) => {
    setKpis(prevKpis => prevKpis.filter(k => k.id !== kpi.id));
  };

  // Handle save KPI
  const handleSave = (kpi: any) => {
    if (selectedKpi) {
      // Edit existing KPI
      setKpis(prevKpis => prevKpis.map(k => k.id === kpi.id ? { ...kpi, value: k.value } : k));
    } else {
      // Create new KPI
      const newValue = Math.random() * (kpi.target * 1.2);
      setKpis(prevKpis => [...prevKpis, { ...kpi, value: Math.round(newValue * 100) / 100 }]);
    }
  };

  // Define data table columns
  const columns = [
    {
      key: 'name',
      header: 'KPI Name',
      width: 'w-[200px]'
    },
    {
      key: 'priority',
      header: 'Priority',
      width: 'w-[100px]',
      render: (value: string) => getPriorityBadge(value)
    },
    {
      key: 'description',
      header: 'Description',
      width: 'w-[300px]'
    },
    {
      key: 'target',
      header: 'Target',
      align: 'right' as 'right',
      render: (value: number, record: any) => `${value}${record.unit}`
    },
    {
      key: 'threshold',
      header: 'Threshold',
      align: 'right' as 'right',
      render: (value: number, record: any) => `${value}${record.unit}`
    },
    {
      key: 'value',
      header: 'Current Value',
      align: 'right' as 'right',
      render: (value: number, record: any) => `${value}${record.unit}`
    },
    {
      key: 'status',
      header: 'Status',
      align: 'right' as 'right',
      render: (value: any, record: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.value, record.target, record.threshold)}`}>
          {record.value >= record.target ? 'On Target' : record.value >= record.threshold ? 'Warning' : 'Alert'}
          {getTrendIndicator(record.value, record.target, record.threshold)}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Contact Center Analytics</h1>
        <p className="text-muted-foreground">
          Monitor and analyze call center performance metrics
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 flex items-start space-x-4">
          <Phone size={24} className="mt-1 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Daily Calls</p>
            <p className="text-2xl font-semibold">1,284</p>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-start space-x-4">
          <Headphones size={24} className="mt-1 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Active Agents</p>
            <p className="text-2xl font-semibold">42</p>
            <p className="text-xs text-muted-foreground">95% of capacity</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-start space-x-4">
          <Users size={24} className="mt-1 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Queue Size</p>
            <p className="text-2xl font-semibold">8</p>
            <p className="text-xs text-muted-foreground">Average wait: 3m 12s</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-start space-x-4">
          <Clock size={24} className="mt-1 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Avg. Handle Time</p>
            <p className="text-2xl font-semibold">4m 12s</p>
            <p className="text-xs text-muted-foreground">-8% from target</p>
          </div>
        </Card>
      </div>
      
      <div className="mb-8">
        <DataTable
          data={kpis}
          columns={columns}
          keyField="id"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          title="Contact Center KPIs"
          description={`Monitoring ${kpis.length} key performance indicators for ${currentTenant?.name || 'X Bank'}`}
          pageSize={10}
          isCreatable={true}
          isEditable={true}
          isDeletable={true}
        />
      </div>

      {/* KPI Editor Dialog */}
      <KpiEditor
        kpi={selectedKpi}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        kpiType="contact_center"
      />
    </div>
  );
};

export default ContactCenter;
