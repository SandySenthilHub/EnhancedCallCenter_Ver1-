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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Phone, Headphones, Users, Clock } from "lucide-react";

const ContactCenter: React.FC = () => {
  const [priority, setPriority] = useState<'critical' | 'medium' | 'low' | 'all'>('all');
  const { currentTenant } = useAuth();
  const tenantId = currentTenant?.id || 1;

  // Get KPI data
  const kpiDefinitions = React.useMemo(() => {
    return getKpisByTypeAndPriority(
      'contact_center', 
      priority !== 'all' ? priority : undefined
    );
  }, [priority]);

  // Generate KPI values based on tenant ID
  const kpis = React.useMemo(() => {
    if (!kpiDefinitions) return [];
    return generateKpiValues(tenantId, kpiDefinitions);
  }, [kpiDefinitions, tenantId]);

  // Get trend indicator component
  const getTrendIndicator = (kpi: any) => {
    // Calculate percentage of target
    const percentage = (kpi.value / kpi.target) * 100;
    
    if (percentage >= 95) {
      return <TrendingUp className="text-green-500 ml-2" size={18} />;
    } else if (percentage < kpi.threshold / kpi.target * 100) {
      return <TrendingDown className="text-red-500 ml-2" size={18} />;
    } else {
      return <Minus className="text-yellow-500 ml-2" size={18} />;
    }
  };

  // Get color based on KPI status
  const getStatusColor = (kpi: any) => {
    const percentage = (kpi.value / kpi.target) * 100;
    
    if (percentage >= 95) {
      return "bg-green-100 text-green-800";
    } else if (percentage < kpi.threshold / kpi.target * 100) {
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

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Contact Center Analytics</h1>
        <p className="text-muted-foreground">
          Monitor and analyze call center performance metrics
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Card className="p-2 px-4 flex items-center space-x-2">
            <Phone size={18} />
            <div>
              <p className="text-xs text-muted-foreground">Daily Calls</p>
              <p className="font-medium">1,284</p>
            </div>
          </Card>
          
          <Card className="p-2 px-4 flex items-center space-x-2">
            <Headphones size={18} />
            <div>
              <p className="text-xs text-muted-foreground">Active Agents</p>
              <p className="font-medium">42</p>
            </div>
          </Card>
          
          <Card className="p-2 px-4 flex items-center space-x-2">
            <Users size={18} />
            <div>
              <p className="text-xs text-muted-foreground">Queue Size</p>
              <p className="font-medium">8</p>
            </div>
          </Card>
          
          <Card className="p-2 px-4 flex items-center space-x-2">
            <Clock size={18} />
            <div>
              <p className="text-xs text-muted-foreground">Avg. Wait Time</p>
              <p className="font-medium">1m 24s</p>
            </div>
          </Card>
        </div>

        <div className="flex items-center space-x-2">
          <Select 
            value={priority} 
            onValueChange={(value) => setPriority(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Priority</SelectLabel>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Call Center KPI Dashboard</CardTitle>
          <CardDescription>Monitoring {kpis.length} key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Contact center KPIs for {currentTenant?.name || 'X Bank'}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">KPI Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Target</TableHead>
                <TableHead className="text-right">Threshold</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpis.map(kpi => (
                <TableRow key={kpi.id}>
                  <TableCell className="font-medium">{kpi.name}</TableCell>
                  <TableCell>{getPriorityBadge(kpi.priority)}</TableCell>
                  <TableCell className="max-w-md truncate">{kpi.description}</TableCell>
                  <TableCell className="text-right">{kpi.target}{kpi.unit}</TableCell>
                  <TableCell className="text-right">{kpi.threshold}{kpi.unit}</TableCell>
                  <TableCell className="text-right font-medium">{kpi.value}{kpi.unit}</TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(kpi)}`}>
                      {kpi.value >= kpi.target ? 'On Target' : kpi.value >= kpi.threshold ? 'Warning' : 'Alert'}
                      {getTrendIndicator(kpi)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactCenter;
