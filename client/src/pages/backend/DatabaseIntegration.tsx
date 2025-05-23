import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Database,
  Server,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  BarChart3,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Eye,
  TrendingUp,
  HardDrive,
  Cpu,
  MemoryStick
} from 'lucide-react';

interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgresql' | 'azure-sql' | 'sql-server';
  environment: 'production' | 'staging' | 'development';
  status: 'connected' | 'disconnected' | 'error';
  host: string;
  database: string;
  activeConnections: number;
  maxConnections: number;
  responseTime: number;
  uptime: number;
  lastHealthCheck: string;
}

interface StoredProcedure {
  id: string;
  name: string;
  type: 'data_access' | 'business_logic' | 'maintenance';
  executionCount: number;
  avgExecutionTime: number;
  lastExecuted: string;
  status: 'active' | 'deprecated' | 'error';
  errorRate: number;
}

interface DatabaseMetrics {
  totalQueries: number;
  avgResponseTime: number;
  errorRate: number;
  connectionPoolUtilization: number;
  transactionThroughput: number;
  deadlockCount: number;
}

const DatabaseIntegration: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('connections');

  // Enterprise database connection data
  const databaseConnections: DatabaseConnection[] = [
    {
      id: 'db-prod-primary',
      name: 'Production Primary Database',
      type: 'azure-sql',
      environment: 'production',
      status: 'connected',
      host: 'callcenter1.database.windows.net',
      database: 'call_center_intelligence',
      activeConnections: 87,
      maxConnections: 200,
      responseTime: 12.5,
      uptime: 99.97,
      lastHealthCheck: '2025-05-23T14:33:22Z'
    },
    {
      id: 'db-prod-replica',
      name: 'Production Read Replica',
      type: 'azure-sql',
      environment: 'production',
      status: 'connected',
      host: 'callcenter1-replica.database.windows.net',
      database: 'call_center_intelligence_replica',
      activeConnections: 34,
      maxConnections: 100,
      responseTime: 8.3,
      uptime: 99.95,
      lastHealthCheck: '2025-05-23T14:33:18Z'
    },
    {
      id: 'db-staging',
      name: 'Staging Database',
      type: 'postgresql',
      environment: 'staging',
      status: 'connected',
      host: 'staging-db.internal',
      database: 'call_center_staging',
      activeConnections: 12,
      maxConnections: 50,
      responseTime: 15.2,
      uptime: 98.8,
      lastHealthCheck: '2025-05-23T14:32:45Z'
    },
    {
      id: 'db-analytics',
      name: 'Analytics Warehouse',
      type: 'sql-server',
      environment: 'production',
      status: 'error',
      host: 'analytics-warehouse.internal',
      database: 'call_center_analytics',
      activeConnections: 0,
      maxConnections: 150,
      responseTime: 0,
      uptime: 87.3,
      lastHealthCheck: '2025-05-23T13:45:12Z'
    }
  ];

  // Stored procedures data
  const storedProcedures: StoredProcedure[] = [
    {
      id: 'sp-001',
      name: 'sp_InsertTranscriptionResult',
      type: 'data_access',
      executionCount: 15847,
      avgExecutionTime: 125,
      lastExecuted: '2025-05-23T14:32:45Z',
      status: 'active',
      errorRate: 0.2
    },
    {
      id: 'sp-002',
      name: 'sp_ProcessCallIntelligence',
      type: 'business_logic',
      executionCount: 8934,
      avgExecutionTime: 2340,
      lastExecuted: '2025-05-23T14:31:22Z',
      status: 'active',
      errorRate: 1.1
    },
    {
      id: 'sp-003',
      name: 'sp_CalculateAgentMetrics',
      type: 'business_logic',
      executionCount: 2456,
      avgExecutionTime: 890,
      lastExecuted: '2025-05-23T14:15:33Z',
      status: 'active',
      errorRate: 0.8
    },
    {
      id: 'sp-004',
      name: 'sp_ArchiveOldRecordings',
      type: 'maintenance',
      executionCount: 147,
      avgExecutionTime: 45000,
      lastExecuted: '2025-05-23T02:00:00Z',
      status: 'active',
      errorRate: 2.1
    },
    {
      id: 'sp-005',
      name: 'sp_LegacyDataMigration',
      type: 'maintenance',
      executionCount: 23,
      avgExecutionTime: 15000,
      lastExecuted: '2025-05-20T18:30:00Z',
      status: 'deprecated',
      errorRate: 15.6
    }
  ];

  const dbMetrics: DatabaseMetrics = {
    totalQueries: 2847953,
    avgResponseTime: 11.7,
    errorRate: 0.8,
    connectionPoolUtilization: 43.5,
    transactionThroughput: 1250,
    deadlockCount: 3
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      connected: 'default',
      error: 'destructive',
      disconnected: 'secondary',
      active: 'default',
      deprecated: 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const getDatabaseTypeIcon = (type: string) => {
    switch (type) {
      case 'azure-sql': return <Database className="h-4 w-4 text-blue-500" />;
      case 'postgresql': return <Database className="h-4 w-4 text-blue-600" />;
      case 'sql-server': return <Server className="h-4 w-4 text-green-600" />;
      default: return <Database className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatExecutionTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database Integration</h1>
          <p className="text-muted-foreground">
            Monitor database connections, stored procedures, and performance metrics
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

      {/* Database Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Queries</p>
                <p className="text-2xl font-bold">{dbMetrics.totalQueries.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{dbMetrics.avgResponseTime}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold">{dbMetrics.errorRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pool Usage</p>
                <p className="text-2xl font-bold">{dbMetrics.connectionPoolUtilization}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Throughput/s</p>
                <p className="text-2xl font-bold">{dbMetrics.transactionThroughput}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Deadlocks</p>
                <p className="text-2xl font-bold">{dbMetrics.deadlockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="procedures">Stored Procedures</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4">
          <div className="grid gap-4">
            {databaseConnections.map((connection) => (
              <Card key={connection.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getDatabaseTypeIcon(connection.type)}
                      <div>
                        <CardTitle className="text-lg">{connection.name}</CardTitle>
                        <CardDescription>
                          {connection.host} • {connection.database}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={connection.environment === 'production' ? 'destructive' : 'secondary'}>
                        {connection.environment.charAt(0).toUpperCase() + connection.environment.slice(1)}
                      </Badge>
                      <Badge variant={getStatusBadge(connection.status)}>
                        {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                      </Badge>
                      {getStatusIcon(connection.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xl font-semibold">{connection.activeConnections}</p>
                        <span className="text-sm text-muted-foreground">/ {connection.maxConnections}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                      <p className="text-xl font-semibold">{connection.responseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                      <p className="text-xl font-semibold text-green-600">{connection.uptime}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pool Utilization</p>
                      <div className="space-y-1">
                        <Progress value={(connection.activeConnections / connection.maxConnections) * 100} />
                        <span className="text-sm">
                          {((connection.activeConnections / connection.maxConnections) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Health Check</p>
                      <p className="text-sm">{new Date(connection.lastHealthCheck).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  
                  {connection.status === 'error' && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Connection failed. Check network connectivity and authentication credentials.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button size="sm">
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="procedures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stored Procedures Management</CardTitle>
              <CardDescription>Monitor and manage stored procedure execution and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Procedure Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Executions</TableHead>
                    <TableHead>Avg Execution Time</TableHead>
                    <TableHead>Error Rate</TableHead>
                    <TableHead>Last Executed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storedProcedures.map((sp) => (
                    <TableRow key={sp.id}>
                      <TableCell className="font-medium">{sp.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {sp.type.replace('_', ' ').charAt(0).toUpperCase() + sp.type.replace('_', ' ').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{sp.executionCount.toLocaleString()}</TableCell>
                      <TableCell>{formatExecutionTime(sp.avgExecutionTime)}</TableCell>
                      <TableCell>
                        <span className={sp.errorRate > 5 ? 'text-red-600' : sp.errorRate > 2 ? 'text-yellow-600' : 'text-green-600'}>
                          {sp.errorRate}%
                        </span>
                      </TableCell>
                      <TableCell>{new Date(sp.lastExecuted).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(sp.status)}>
                          {sp.status.charAt(0).toUpperCase() + sp.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Execution Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Executions Today</span>
                    <span className="font-semibold">27,407</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Execution Time</span>
                    <span className="font-semibold">1.3s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-semibold text-green-600">98.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Fastest Procedure</span>
                    <span className="font-semibold">sp_GetAgentStatus (45ms)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Slowest Procedure</span>
                    <span className="font-semibold">sp_ArchiveOldRecordings (45s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Most Used</span>
                    <span className="font-semibold">sp_InsertTranscriptionResult</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      sp_LegacyDataMigration has high error rate (15.6%)
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      sp_ProcessCallIntelligence execution time increased 23%
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>CPU Utilization</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Memory Usage</span>
                      <span>82%</span>
                    </div>
                    <Progress value={82} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Disk I/O</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Network I/O</span>
                      <span>23%</span>
                    </div>
                    <Progress value={23} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connection Pool Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-blue-600">123</p>
                      <p className="text-sm text-muted-foreground">Active Connections</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-green-600">77</p>
                      <p className="text-sm text-muted-foreground">Idle Connections</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-orange-600">12</p>
                      <p className="text-sm text-muted-foreground">Waiting Requests</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-purple-600">43.5%</p>
                      <p className="text-sm text-muted-foreground">Pool Utilization</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Query Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Query Type</TableHead>
                    <TableHead>Execution Count</TableHead>
                    <TableHead>Avg Duration</TableHead>
                    <TableHead>Total CPU Time</TableHead>
                    <TableHead>Logical Reads</TableHead>
                    <TableHead>Physical Reads</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>INSERT Operations</TableCell>
                    <TableCell>15,847</TableCell>
                    <TableCell>125ms</TableCell>
                    <TableCell>1,980,875ms</TableCell>
                    <TableCell>4,756,234</TableCell>
                    <TableCell>234,567</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SELECT Operations</TableCell>
                    <TableCell>234,567</TableCell>
                    <TableCell>45ms</TableCell>
                    <TableCell>10,555,515ms</TableCell>
                    <TableCell>89,234,567</TableCell>
                    <TableCell>1,234,567</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>UPDATE Operations</TableCell>
                    <TableCell>8,934</TableCell>
                    <TableCell>230ms</TableCell>
                    <TableCell>2,054,820ms</TableCell>
                    <TableCell>12,345,678</TableCell>
                    <TableCell>456,789</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Monitoring Dashboard</CardTitle>
                <CardDescription>Live database health and performance monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded">
                    <Cpu className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">67%</p>
                    <p className="text-sm text-muted-foreground">CPU Usage</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <MemoryStick className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">82%</p>
                    <p className="text-sm text-muted-foreground">Memory Usage</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <HardDrive className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold">45%</p>
                    <p className="text-sm text-muted-foreground">Disk I/O</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-2xl font-bold">1,250</p>
                    <p className="text-sm text-muted-foreground">Transactions/sec</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>System Health:</strong> All database connections are healthy and responding within acceptable thresholds.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Memory Warning:</strong> Memory utilization is at 82%. Consider scaling resources if trend continues.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Connection Error:</strong> Analytics Warehouse connection failed. Immediate attention required.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Last Run</TableHead>
                      <TableHead>Next Run</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Index Maintenance</TableCell>
                      <TableCell>Daily</TableCell>
                      <TableCell>2025-05-23 02:00:00</TableCell>
                      <TableCell>2025-05-24 02:00:00</TableCell>
                      <TableCell>
                        <Badge variant="default">Scheduled</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Statistics Update</TableCell>
                      <TableCell>Weekly</TableCell>
                      <TableCell>2025-05-19 03:00:00</TableCell>
                      <TableCell>2025-05-26 03:00:00</TableCell>
                      <TableCell>
                        <Badge variant="default">Scheduled</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Backup Verification</TableCell>
                      <TableCell>Daily</TableCell>
                      <TableCell>2025-05-23 04:00:00</TableCell>
                      <TableCell>2025-05-24 04:00:00</TableCell>
                      <TableCell>
                        <Badge variant="default">Completed</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseIntegration;