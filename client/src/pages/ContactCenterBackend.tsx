import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Phone,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Database,
  Server,
  Network,
  Settings,
  RefreshCw,
  Eye,
  Play,
  Pause,
  BarChart3,
  Target,
  Headphones,
  Volume2,
  Calendar,
  FileText,
  Shield
} from 'lucide-react';

interface CallMetrics {
  totalCalls: number;
  activeCalls: number;
  waitingCalls: number;
  avgWaitTime: number;
  avgHandleTime: number;
  serviceLevel: number;
  abandonRate: number;
  firstCallResolution: number;
}

interface AgentStatus {
  id: string;
  name: string;
  status: 'available' | 'on-call' | 'after-call-work' | 'break' | 'offline';
  currentCallDuration: number;
  callsToday: number;
  avgHandleTime: number;
  extension: string;
  team: string;
}

interface CallQueue {
  id: string;
  name: string;
  waitingCalls: number;
  longestWait: number;
  avgWaitTime: number;
  serviceLevel: number;
  staffed: number;
  required: number;
  status: 'normal' | 'warning' | 'critical';
}

interface SystemHealth {
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  lastCheck: string;
}

const ContactCenterBackend: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('realtime');

  // Real-time call center metrics
  const callMetrics: CallMetrics = {
    totalCalls: 1847,
    activeCalls: 89,
    waitingCalls: 23,
    avgWaitTime: 47,
    avgHandleTime: 267,
    serviceLevel: 84.2,
    abandonRate: 5.8,
    firstCallResolution: 87.3
  };

  // Agent status monitoring
  const agents: AgentStatus[] = [
    {
      id: 'agt-001',
      name: 'Sarah Johnson',
      status: 'on-call',
      currentCallDuration: 143,
      callsToday: 24,
      avgHandleTime: 245,
      extension: '2001',
      team: 'Technical Support'
    },
    {
      id: 'agt-002',
      name: 'Michael Chen',
      status: 'available',
      currentCallDuration: 0,
      callsToday: 31,
      avgHandleTime: 198,
      extension: '2002',
      team: 'Customer Service'
    },
    {
      id: 'agt-003',
      name: 'Emily Rodriguez',
      status: 'after-call-work',
      currentCallDuration: 0,
      callsToday: 19,
      avgHandleTime: 312,
      extension: '2003',
      team: 'Billing Support'
    },
    {
      id: 'agt-004',
      name: 'David Kim',
      status: 'break',
      currentCallDuration: 0,
      callsToday: 27,
      avgHandleTime: 234,
      extension: '2004',
      team: 'Technical Support'
    }
  ];

  // Call queue monitoring
  const callQueues: CallQueue[] = [
    {
      id: 'queue-tech',
      name: 'Technical Support',
      waitingCalls: 8,
      longestWait: 127,
      avgWaitTime: 45,
      serviceLevel: 82.4,
      staffed: 12,
      required: 15,
      status: 'warning'
    },
    {
      id: 'queue-billing',
      name: 'Billing Support',
      waitingCalls: 15,
      longestWait: 234,
      avgWaitTime: 89,
      serviceLevel: 67.2,
      staffed: 8,
      required: 12,
      status: 'critical'
    },
    {
      id: 'queue-sales',
      name: 'Sales',
      waitingCalls: 0,
      longestWait: 0,
      avgWaitTime: 23,
      serviceLevel: 94.1,
      staffed: 6,
      required: 4,
      status: 'normal'
    }
  ];

  // System health monitoring
  const systemHealth: SystemHealth[] = [
    {
      component: 'PBX System',
      status: 'healthy',
      uptime: 99.97,
      responseTime: 12,
      errorRate: 0.1,
      lastCheck: '2025-05-23T14:32:00Z'
    },
    {
      component: 'IVR Platform',
      status: 'healthy',
      uptime: 99.95,
      responseTime: 18,
      errorRate: 0.3,
      lastCheck: '2025-05-23T14:31:45Z'
    },
    {
      component: 'Call Recording',
      status: 'warning',
      uptime: 98.1,
      responseTime: 45,
      errorRate: 2.1,
      lastCheck: '2025-05-23T14:30:22Z'
    },
    {
      component: 'CTI Integration',
      status: 'healthy',
      uptime: 99.8,
      responseTime: 23,
      errorRate: 0.5,
      lastCheck: '2025-05-23T14:32:15Z'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'on-call': return <Phone className="h-4 w-4 text-blue-500" />;
      case 'after-call-work': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'break': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'offline': return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'healthy': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      available: 'default',
      'on-call': 'secondary',
      'after-call-work': 'outline',
      break: 'secondary',
      offline: 'secondary',
      normal: 'default',
      warning: 'secondary',
      critical: 'destructive',
      healthy: 'default'
    };
    return variants[status] || 'secondary';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Center Operations</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and management of call center infrastructure and operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Calls</p>
                <p className="text-2xl font-bold">{callMetrics.activeCalls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Waiting Calls</p>
                <p className="text-2xl font-bold">{callMetrics.waitingCalls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Service Level</p>
                <p className="text-2xl font-bold">{callMetrics.serviceLevel}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">FCR Rate</p>
                <p className="text-2xl font-bold">{callMetrics.firstCallResolution}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="realtime">Real-time Dashboard</TabsTrigger>
          <TabsTrigger value="agents">Agent Status</TabsTrigger>
          <TabsTrigger value="queues">Call Queues</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Call Metrics</CardTitle>
                <CardDescription>Real-time call center performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Wait Time</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{formatTime(callMetrics.avgWaitTime)}</span>
                      <Badge variant={callMetrics.avgWaitTime < 60 ? 'default' : 'destructive'}>
                        Target: 1:00
                      </Badge>
                    </div>
                  </div>
                  <Progress value={(60 - callMetrics.avgWaitTime) / 60 * 100} />

                  <div className="flex justify-between items-center">
                    <span>Average Handle Time</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{formatTime(callMetrics.avgHandleTime)}</span>
                      <Badge variant={callMetrics.avgHandleTime < 300 ? 'default' : 'secondary'}>
                        Target: 5:00
                      </Badge>
                    </div>
                  </div>
                  <Progress value={(300 - callMetrics.avgHandleTime) / 300 * 100} />

                  <div className="flex justify-between items-center">
                    <span>Abandon Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{callMetrics.abandonRate}%</span>
                      <Badge variant={callMetrics.abandonRate < 5 ? 'default' : 'destructive'}>
                        Target: &lt;5%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={(10 - callMetrics.abandonRate) / 10 * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded">
                    <p className="text-2xl font-bold text-blue-600">{callMetrics.totalCalls}</p>
                    <p className="text-sm text-muted-foreground">Total Calls</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-2xl font-bold text-green-600">{callMetrics.serviceLevel}%</p>
                    <p className="text-sm text-muted-foreground">Service Level</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-2xl font-bold text-purple-600">{callMetrics.firstCallResolution}%</p>
                    <p className="text-sm text-muted-foreground">FCR Rate</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-2xl font-bold text-orange-600">{callMetrics.abandonRate}%</p>
                    <p className="text-sm text-muted-foreground">Abandon Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Queue Alert:</strong> Billing Support queue has 15 waiting calls with average wait time of 1:29
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Performance Goal:</strong> Sales team exceeded FCR target with 94.1% resolution rate
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Status Monitor</CardTitle>
              <CardDescription>Real-time agent availability and performance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Extension</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Call</TableHead>
                    <TableHead>Calls Today</TableHead>
                    <TableHead>Avg Handle Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>{agent.extension}</TableCell>
                      <TableCell>{agent.team}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(agent.status)}
                          <Badge variant={getStatusBadge(agent.status)}>
                            {agent.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {agent.status === 'on-call' ? formatTime(agent.currentCallDuration) : '--'}
                      </TableCell>
                      <TableCell>{agent.callsToday}</TableCell>
                      <TableCell>{formatTime(agent.avgHandleTime)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Headphones className="h-4 w-4" />
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

        <TabsContent value="queues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call Queue Management</CardTitle>
              <CardDescription>Monitor and manage call distribution across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {callQueues.map((queue) => (
                  <div key={queue.id} className="border rounded p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-semibold">{queue.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {queue.staffed} of {queue.required} agents staffed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={getStatusBadge(queue.status)}>
                          {queue.status.charAt(0).toUpperCase() + queue.status.slice(1)}
                        </Badge>
                        {getStatusIcon(queue.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Waiting Calls</p>
                        <p className="text-xl font-semibold">{queue.waitingCalls}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Longest Wait</p>
                        <p className="text-xl font-semibold">{formatTime(queue.longestWait)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg Wait Time</p>
                        <p className="text-xl font-semibold">{formatTime(queue.avgWaitTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Service Level</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={queue.serviceLevel} className="flex-1" />
                          <span className="text-sm font-semibold">{queue.serviceLevel}%</span>
                        </div>
                      </div>
                    </div>

                    {queue.status === 'critical' && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Critical: Queue requires immediate attention. Consider reallocating agents or enabling overflow.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health Monitor</CardTitle>
              <CardDescription>Infrastructure health and performance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Error Rate</TableHead>
                    <TableHead>Last Check</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemHealth.map((component, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{component.component}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(component.status)}
                          <Badge variant={getStatusBadge(component.status)}>
                            {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{component.uptime}%</TableCell>
                      <TableCell>{component.responseTime}ms</TableCell>
                      <TableCell>{component.errorRate}%</TableCell>
                      <TableCell>{new Date(component.lastCheck).toLocaleTimeString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
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
      </Tabs>
    </div>
  );
};

export default ContactCenterBackend;