import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Search, Edit2, FileText, User, Calendar, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AuditLog {
  id: number;
  tenantId: number;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  requestData: any;
  responseStatus: number;
  createdAt: string;
}

interface UserActivity {
  id: number;
  userId: string;
  tenantId: number;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  status: string;
  isAdminAction: boolean;
  sessionId: string;
  duration: number;
  createdAt: string;
}

const AuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  // Sample audit log data
  const sampleAuditLogs: AuditLog[] = [
    {
      id: 1,
      tenantId: 1,
      userId: 'admin',
      action: 'USER_CREATED',
      resource: 'users',
      resourceId: 'user_123',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      requestData: { username: 'new_user', role: 'agent' },
      responseStatus: 201,
      createdAt: '2024-01-20T15:30:00Z'
    },
    {
      id: 2,
      tenantId: 1,
      userId: 'manager_001',
      action: 'ROLE_UPDATED',
      resource: 'roles',
      resourceId: 'role_456',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      requestData: { permissions: ['user.read', 'user.update'] },
      responseStatus: 200,
      createdAt: '2024-01-20T14:45:00Z'
    },
    {
      id: 3,
      tenantId: 1,
      userId: 'agent_002',
      action: 'CUSTOMER_VIEWED',
      resource: 'customers',
      resourceId: 'cust_789',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      requestData: { customer_id: 'cust_789' },
      responseStatus: 200,
      createdAt: '2024-01-20T13:20:00Z'
    },
    {
      id: 4,
      tenantId: 1,
      userId: 'system',
      action: 'BACKUP_COMPLETED',
      resource: 'system',
      resourceId: 'backup_001',
      ipAddress: '127.0.0.1',
      userAgent: 'SystemScheduler/1.0',
      requestData: { backup_size: '2.3GB', duration: '45min' },
      responseStatus: 200,
      createdAt: '2024-01-20T12:00:00Z'
    },
    {
      id: 5,
      tenantId: 1,
      userId: 'compliance_officer',
      action: 'REPORT_GENERATED',
      resource: 'reports',
      resourceId: 'rpt_monthly_001',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      requestData: { report_type: 'monthly_compliance', period: '2024-01' },
      responseStatus: 200,
      createdAt: '2024-01-20T11:30:00Z'
    }
  ];

  // Sample user activity data
  const sampleUserActivities: UserActivity[] = [
    {
      id: 1,
      userId: 'admin',
      tenantId: 1,
      action: 'LOGIN',
      resource: 'authentication',
      resourceId: 'session_abc123',
      details: 'Successful admin login from desktop',
      ipAddress: '192.168.1.100',
      status: 'SUCCESS',
      isAdminAction: true,
      sessionId: 'sess_abc123',
      duration: 0,
      createdAt: '2024-01-20T15:45:00Z'
    },
    {
      id: 2,
      userId: 'agent_001',
      tenantId: 1,
      action: 'VIEW_DASHBOARD',
      resource: 'dashboard',
      resourceId: 'kpi_dashboard',
      details: 'Accessed KPI dashboard for daily metrics',
      ipAddress: '192.168.1.103',
      status: 'SUCCESS',
      isAdminAction: false,
      sessionId: 'sess_def456',
      duration: 2300,
      createdAt: '2024-01-20T15:30:00Z'
    },
    {
      id: 3,
      userId: 'manager_002',
      tenantId: 1,
      action: 'CREATE_TEAM',
      resource: 'teams',
      resourceId: 'team_789',
      details: 'Created new customer service team',
      ipAddress: '192.168.1.104',
      status: 'SUCCESS',
      isAdminAction: true,
      sessionId: 'sess_ghi789',
      duration: 1200,
      createdAt: '2024-01-20T14:15:00Z'
    }
  ];

  const filteredAuditLogs = sampleAuditLogs.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === 'all' || log.action.includes(selectedAction.toUpperCase());
    return matchesSearch && matchesAction;
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-green-100 text-green-800';
    if (action.includes('UPDATE')) return 'bg-blue-100 text-blue-800';
    if (action.includes('DELETE')) return 'bg-red-100 text-red-800';
    if (action.includes('VIEW')) return 'bg-gray-100 text-gray-800';
    return 'bg-purple-100 text-purple-800';
  };

  const getStatusBadgeColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-800';
    if (status >= 500) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const auditStats = {
    totalLogs: sampleAuditLogs.length,
    todayLogs: sampleAuditLogs.filter(log => 
      new Date(log.createdAt).toDateString() === new Date().toDateString()
    ).length,
    uniqueUsers: new Set(sampleAuditLogs.map(log => log.userId)).size,
    adminActions: sampleUserActivities.filter(activity => activity.isAdminAction).length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">Complete audit trail of system activities and user actions</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{auditStats.totalLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Logs</p>
                <p className="text-2xl font-bold text-gray-900">{auditStats.todayLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Users</p>
                <p className="text-2xl font-bold text-gray-900">{auditStats.uniqueUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Edit2 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admin Actions</p>
                <p className="text-2xl font-bold text-gray-900">{auditStats.adminActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Audit Trail ({filteredAuditLogs.length})</CardTitle>
          <CardDescription>
            Comprehensive log of all system activities and user interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by action, resource, or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Actions</option>
              <option value="create">Create Actions</option>
              <option value="update">Update Actions</option>
              <option value="delete">Delete Actions</option>
              <option value="view">View Actions</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-900">Timestamp</th>
                  <th className="text-left p-4 font-medium text-gray-900">User</th>
                  <th className="text-left p-4 font-medium text-gray-900">Action</th>
                  <th className="text-left p-4 font-medium text-gray-900">Resource</th>
                  <th className="text-left p-4 font-medium text-gray-900">IP Address</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-900">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-900">{log.userId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getActionBadgeColor(log.action)}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.resource}</div>
                        <div className="text-sm text-gray-500">ID: {log.resourceId}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {log.ipAddress}
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusBadgeColor(log.responseStatus)}>
                        {log.responseStatus}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
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
    </div>
  );
};

export default AuditLogs;