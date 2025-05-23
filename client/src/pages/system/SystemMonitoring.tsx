import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Search, Edit2, Activity, AlertTriangle, CheckCircle, Clock, Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HealthCheck {
  id: number;
  serviceName: string;
  status: string;
  responseTime: number;
  details: any;
  checkedAt: string;
  lastFailure: string | null;
  uptime: number;
}

interface SystemAlert {
  id: number;
  serviceName: string;
  alertType: string;
  severity: string;
  message: string;
  isActive: boolean;
  createdAt: string;
  resolvedAt: string | null;
}

const SystemMonitoring: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTab, setSelectedTab] = useState('health');

  // Sample health check data
  const sampleHealthChecks: HealthCheck[] = [
    {
      id: 1,
      serviceName: 'Database Connection',
      status: 'healthy',
      responseTime: 45,
      details: { pool_size: 10, active_connections: 3, max_connections: 100 },
      checkedAt: '2024-01-20T15:30:00Z',
      lastFailure: null,
      uptime: 99.9
    },
    {
      id: 2,
      serviceName: 'Authentication Service',
      status: 'healthy',
      responseTime: 120,
      details: { active_sessions: 234, tokens_issued: 1567, cache_hit_rate: 95.2 },
      checkedAt: '2024-01-20T15:30:00Z',
      lastFailure: '2024-01-18T10:15:00Z',
      uptime: 99.7
    },
    {
      id: 3,
      serviceName: 'Payment Gateway',
      status: 'degraded',
      responseTime: 850,
      details: { transaction_volume: 456, error_rate: 2.1, queue_length: 23 },
      checkedAt: '2024-01-20T15:30:00Z',
      lastFailure: '2024-01-20T14:45:00Z',
      uptime: 98.5
    },
    {
      id: 4,
      serviceName: 'File Storage',
      status: 'healthy',
      responseTime: 200,
      details: { storage_used: '2.3TB', available_space: '7.7TB', backup_status: 'completed' },
      checkedAt: '2024-01-20T15:30:00Z',
      lastFailure: null,
      uptime: 99.95
    },
    {
      id: 5,
      serviceName: 'Email Service',
      status: 'unhealthy',
      responseTime: 0,
      details: { connection_error: 'SMTP server unreachable', retry_count: 3 },
      checkedAt: '2024-01-20T15:30:00Z',
      lastFailure: '2024-01-20T15:25:00Z',
      uptime: 97.8
    }
  ];

  // Sample system alerts
  const sampleAlerts: SystemAlert[] = [
    {
      id: 1,
      serviceName: 'Payment Gateway',
      alertType: 'performance',
      severity: 'warning',
      message: 'Response time exceeding threshold (>500ms)',
      isActive: true,
      createdAt: '2024-01-20T14:45:00Z',
      resolvedAt: null
    },
    {
      id: 2,
      serviceName: 'Email Service',
      alertType: 'connectivity',
      severity: 'critical',
      message: 'SMTP server connection failed',
      isActive: true,
      createdAt: '2024-01-20T15:25:00Z',
      resolvedAt: null
    },
    {
      id: 3,
      serviceName: 'Database Connection',
      alertType: 'capacity',
      severity: 'info',
      message: 'Connection pool utilization at 30%',
      isActive: false,
      createdAt: '2024-01-20T12:00:00Z',
      resolvedAt: '2024-01-20T12:15:00Z'
    },
    {
      id: 4,
      serviceName: 'Authentication Service',
      alertType: 'security',
      severity: 'warning',
      message: 'Unusual login pattern detected',
      isActive: false,
      createdAt: '2024-01-19T18:30:00Z',
      resolvedAt: '2024-01-19T19:45:00Z'
    }
  ];

  const filteredHealthChecks = sampleHealthChecks.filter((check) => {
    const matchesSearch = check.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || check.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredAlerts = sampleAlerts.filter((alert) => {
    const matchesSearch = alert.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && alert.isActive) ||
                         (selectedStatus === 'resolved' && !alert.isActive);
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'degraded': return <Clock className="h-4 w-4" />;
      case 'unhealthy': return <AlertTriangle className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  const systemStats = {
    totalServices: sampleHealthChecks.length,
    healthyServices: sampleHealthChecks.filter(h => h.status === 'healthy').length,
    activeAlerts: sampleAlerts.filter(a => a.isActive).length,
    avgResponseTime: Math.round(sampleHealthChecks.reduce((sum, h) => sum + h.responseTime, 0) / sampleHealthChecks.length),
    overallUptime: Math.round(sampleHealthChecks.reduce((sum, h) => sum + h.uptime, 0) / sampleHealthChecks.length * 10) / 10
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health Monitoring</h1>
          <p className="text-gray-600">Monitor system performance, health checks, and alerts</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Health Check
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Server className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalServices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Healthy Services</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.healthyServices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.activeAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.avgResponseTime}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.overallUptime}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">Health Checks ({filteredHealthChecks.length})</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts ({filteredAlerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Health Monitoring</CardTitle>
              <CardDescription>
                Real-time status and performance metrics for all system services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">All Services</option>
                  <option value="healthy">Healthy</option>
                  <option value="degraded">Degraded</option>
                  <option value="unhealthy">Unhealthy</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-gray-900">Service</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Response Time</th>
                      <th className="text-left p-4 font-medium text-gray-900">Uptime</th>
                      <th className="text-left p-4 font-medium text-gray-900">Last Check</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHealthChecks.map((check) => (
                      <tr key={check.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              {getStatusIcon(check.status)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{check.serviceName}</div>
                              <div className="text-sm text-gray-500">Service monitoring</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusBadgeColor(check.status)}>
                            {check.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className={`text-sm font-medium ${
                            check.responseTime > 500 ? 'text-red-600' : 
                            check.responseTime > 200 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {check.responseTime}ms
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  check.uptime > 99 ? 'bg-green-500' : 
                                  check.uptime > 95 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${check.uptime}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{check.uptime}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {new Date(check.checkedAt).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Activity className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Active and resolved system alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">All Alerts</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className={`hover:shadow-md transition-shadow ${
                    alert.isActive ? 'border-l-4 border-l-red-500' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <h3 className="font-semibold text-gray-900">{alert.serviceName}</h3>
                            <Badge className={getSeverityBadgeColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <Badge className={alert.isActive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                              {alert.isActive ? 'Active' : 'Resolved'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{alert.message}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Created: {new Date(alert.createdAt).toLocaleString()}</span>
                            {alert.resolvedAt && (
                              <span>Resolved: {new Date(alert.resolvedAt).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        {alert.isActive && (
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit2 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMonitoring;