import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Server,
  Activity,
  Cpu,
  HardDrive,
  Network,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  RefreshCw,
  Database,
  Shield,
  Monitor,
  Zap,
  BarChart3,
  Globe
} from 'lucide-react';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: string;
  status: 'healthy' | 'warning' | 'critical';
}

interface IntelService {
  id: string;
  name: string;
  type: 'AI' | 'Analytics' | 'Processing' | 'Database';
  status: 'running' | 'stopped' | 'error' | 'maintenance';
  cpu: number;
  memory: number;
  responseTime: number;
  requests: number;
  lastUpdate: string;
}

const IntelDelta: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // System metrics
  const systemMetrics: SystemMetrics = {
    cpu: 73.2,
    memory: 68.5,
    disk: 45.8,
    network: 12.4,
    uptime: "15 days, 7 hours",
    status: 'healthy'
  };

  // Intel Delta services
  const intelServices: IntelService[] = [
    {
      id: 'service-001',
      name: 'Voice Recognition Engine',
      type: 'AI',
      status: 'running',
      cpu: 45.2,
      memory: 67.8,
      responseTime: 234,
      requests: 2847,
      lastUpdate: '2025-05-23T11:25:00Z'
    },
    {
      id: 'service-002',
      name: 'Sentiment Analysis Core',
      type: 'AI',
      status: 'running',
      cpu: 38.9,
      memory: 52.3,
      responseTime: 156,
      requests: 1923,
      lastUpdate: '2025-05-23T11:24:45Z'
    },
    {
      id: 'service-003',
      name: 'Predictive Analytics Engine',
      type: 'Analytics',
      status: 'running',
      cpu: 71.4,
      memory: 89.2,
      responseTime: 567,
      requests: 834,
      lastUpdate: '2025-05-23T11:24:30Z'
    },
    {
      id: 'service-004',
      name: 'Real-time Processing Hub',
      type: 'Processing',
      status: 'warning',
      cpu: 92.1,
      memory: 94.7,
      responseTime: 1234,
      requests: 5672,
      lastUpdate: '2025-05-23T11:23:15Z'
    },
    {
      id: 'service-005',
      name: 'Intelligence Database Cluster',
      type: 'Database',
      status: 'running',
      cpu: 34.6,
      memory: 76.3,
      responseTime: 89,
      requests: 8945,
      lastUpdate: '2025-05-23T11:25:10Z'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'maintenance': return <Settings className="h-4 w-4 text-blue-500" />;
      case 'stopped': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      running: 'default',
      warning: 'secondary',
      error: 'destructive',
      maintenance: 'outline',
      stopped: 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'AI': return <Cpu className="h-4 w-4 text-purple-500" />;
      case 'Analytics': return <BarChart3 className="h-4 w-4 text-blue-500" />;
      case 'Processing': return <Zap className="h-4 w-4 text-orange-500" />;
      case 'Database': return <Database className="h-4 w-4 text-green-500" />;
      default: return <Server className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intel Delta Control Center</h1>
          <p className="text-muted-foreground">
            Advanced intelligence services monitoring and management platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">CPU Usage</p>
                <p className="text-2xl font-bold">{systemMetrics.cpu}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Memory</p>
                <p className="text-2xl font-bold">{systemMetrics.memory}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Network I/O</p>
                <p className="text-2xl font-bold">{systemMetrics.network} MB/s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                <p className="text-xl font-bold">{systemMetrics.uptime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="services">Intel Services</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health Status</CardTitle>
                <CardDescription>Overall system performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>CPU Performance</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{systemMetrics.cpu}%</span>
                      <Badge variant={systemMetrics.cpu < 80 ? 'default' : 'destructive'}>
                        {systemMetrics.cpu < 80 ? 'Normal' : 'High'}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={systemMetrics.cpu} />

                  <div className="flex justify-between items-center">
                    <span>Memory Usage</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{systemMetrics.memory}%</span>
                      <Badge variant={systemMetrics.memory < 75 ? 'default' : 'secondary'}>
                        {systemMetrics.memory < 75 ? 'Normal' : 'Moderate'}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={systemMetrics.memory} />

                  <div className="flex justify-between items-center">
                    <span>Disk Usage</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{systemMetrics.disk}%</span>
                      <Badge variant="default">Normal</Badge>
                    </div>
                  </div>
                  <Progress value={systemMetrics.disk} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Services Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {intelServices.slice(0, 4).map((service) => (
                    <div key={service.id} className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(service.type)}
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(service.status)}
                        <Badge variant={getStatusBadge(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intel Delta Services Management</CardTitle>
              <CardDescription>Monitor and control all intelligence services</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>CPU</TableHead>
                    <TableHead>Memory</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {intelServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(service.type)}
                          <span>{service.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(service.status)}
                          <Badge variant={getStatusBadge(service.status)}>
                            {service.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{service.cpu}%</TableCell>
                      <TableCell>{service.memory}%</TableCell>
                      <TableCell>{service.responseTime}ms</TableCell>
                      <TableCell>{service.requests.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time System Monitoring</CardTitle>
              <CardDescription>Live performance metrics and system health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Trends</h4>
                  <div className="space-y-3">
                    <div className="border rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">CPU Load Trend</span>
                        <Badge variant="default">Stable</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Average: 73.2% | Peak: 89.4% | Low: 45.6%
                      </div>
                    </div>
                    <div className="border rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Memory Usage Trend</span>
                        <Badge variant="secondary">Increasing</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Average: 68.5% | Peak: 94.7% | Low: 34.2%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Service Health</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-green-600">4</p>
                      <p className="text-sm text-muted-foreground">Running</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-yellow-600">1</p>
                      <p className="text-sm text-muted-foreground">Warning</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-red-600">0</p>
                      <p className="text-sm text-muted-foreground">Error</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-blue-600">0</p>
                      <p className="text-sm text-muted-foreground">Maintenance</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics Dashboard</CardTitle>
              <CardDescription>Detailed analysis of system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 border rounded">
                  <p className="text-2xl font-bold text-blue-600">99.7%</p>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                  <p className="text-xs text-green-600">↑ 0.3% vs last month</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <p className="text-2xl font-bold text-green-600">234ms</p>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <p className="text-xs text-green-600">↓ 45ms vs last week</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <p className="text-2xl font-bold text-purple-600">15.7K</p>
                  <p className="text-sm text-muted-foreground">Daily Requests</p>
                  <p className="text-xs text-green-600">↑ 12% vs yesterday</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Service Performance Rankings</h4>
                <div className="space-y-2">
                  {intelServices
                    .sort((a, b) => a.responseTime - b.responseTime)
                    .map((service, index) => (
                      <div key={service.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-lg">#{index + 1}</span>
                          {getTypeIcon(service.type)}
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{service.responseTime}ms</p>
                          <p className="text-sm text-muted-foreground">{service.requests.toLocaleString()} req/day</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts & Notifications</CardTitle>
              <CardDescription>Active alerts and system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>High CPU Usage:</strong> Real-time Processing Hub is running at 92.1% CPU usage. Consider scaling resources.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Performance Improvement:</strong> Voice Recognition Engine response time improved by 23% after optimization.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Memory Warning:</strong> Intelligence Database Cluster memory usage approaching 95%. Monitoring closely.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelDelta;