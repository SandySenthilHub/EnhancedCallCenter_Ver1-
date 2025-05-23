import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Download, Calendar, Users, Database, Ticket } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Reports() {
  const { user } = useAuth();
  const currentTenantId = user?.currentTenantId;

  const { data: entities = [] } = useQuery({
    queryKey: [`/api/tenants/${currentTenantId}/entities`],
    enabled: !!currentTenantId,
  });

  const { data: users = [] } = useQuery({
    queryKey: [`/api/tenants/${currentTenantId}/users`],
    enabled: !!currentTenantId,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: [`/api/tenants/${currentTenantId}/transaction-instances`],
    enabled: !!currentTenantId,
  });

  const { data: roles = [] } = useQuery({
    queryKey: [`/api/tenants/${currentTenantId}/roles`],
    enabled: !!currentTenantId,
  });

  // Mock data for charts
  const entityData = entities.map((entity: any) => ({
    name: entity.displayName,
    records: entity.recordCount || Math.floor(Math.random() * 1000),
    type: entity.type,
  }));

  const transactionStatusData = [
    { name: 'Completed', value: transactions.filter((t: any) => t.status === 'completed').length, color: '#10B981' },
    { name: 'Processing', value: transactions.filter((t: any) => t.status === 'processing').length, color: '#3B82F6' },
    { name: 'Failed', value: transactions.filter((t: any) => t.status === 'failed').length, color: '#EF4444' },
    { name: 'Pending', value: transactions.filter((t: any) => t.status === 'pending').length, color: '#F59E0B' },
  ];

  const userActivityData = [
    { month: 'Jan', activeUsers: Math.floor(users.length * 0.8) },
    { month: 'Feb', activeUsers: Math.floor(users.length * 0.9) },
    { month: 'Mar', activeUsers: Math.floor(users.length * 0.7) },
    { month: 'Apr', activeUsers: Math.floor(users.length * 0.95) },
    { month: 'May', activeUsers: users.length },
    { month: 'Jun', activeUsers: Math.floor(users.length * 0.85) },
  ];

  const summary = {
    totalEntities: entities.length,
    totalUsers: users.length,
    totalTransactions: transactions.length,
    totalRoles: roles.length,
    activeEntities: entities.filter((e: any) => e.isActive).length,
    completedTransactions: transactions.filter((t: any) => t.status === 'completed').length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-1">View insights and analytics for your tenant</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2" size={16} />
            Date Range
          </Button>
          <Button className="bg-primary hover:bg-blue-700">
            <Download className="mr-2" size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Entities</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{summary.totalEntities}</p>
                <p className="text-sm text-green-600 mt-1">
                  {summary.activeEntities} active
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Database className="text-primary" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{summary.totalUsers}</p>
                <p className="text-sm text-green-600 mt-1">
                  {summary.totalRoles} roles
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="text-green-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Transactions</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{summary.totalTransactions}</p>
                <p className="text-sm text-green-600 mt-1">
                  {summary.completedTransactions} completed
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Ticket className="text-purple-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Success Rate</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {summary.totalTransactions > 0 
                    ? Math.round((summary.completedTransactions / summary.totalTransactions) * 100)
                    : 0}%
                </p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="inline mr-1" size={12} />
                  Excellent
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Entity Records Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Entity Records Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {entityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={entityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="records" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-slate-500">
                No entity data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {transactionStatusData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={transactionStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {transactionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-slate-500">
                No transaction data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Activity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="activeUsers" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Entity Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['primary', 'sub', 'reference'].map(type => {
                const count = entities.filter((e: any) => e.type === type).length;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 capitalize">{type} Entities</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Active Entities</span>
                <Badge className="bg-green-100 text-green-800">
                  {Math.round((summary.activeEntities / summary.totalEntities) * 100) || 0}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Success Rate</span>
                <Badge className="bg-green-100 text-green-800">
                  {Math.round((summary.completedTransactions / summary.totalTransactions) * 100) || 0}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">System Status</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2" size={14} />
                Export Entity Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2" size={14} />
                Export User Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2" size={14} />
                Export Transaction Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
