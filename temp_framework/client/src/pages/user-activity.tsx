import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, User, Shield, Activity, Eye, Filter, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function UserActivity() {
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("7days");
  const [searchTerm, setSearchTerm] = useState("");

  // Get current tenant from user context
  const { data: tenants = [] } = useQuery({
    queryKey: ['/api/tenants'],
  });

  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);

  // Set default tenant when tenants load
  useEffect(() => {
    if (tenants.length > 0 && !selectedTenantId) {
      setSelectedTenantId(tenants[0]?.id || 1);
    }
  }, [tenants, selectedTenantId]);

  const { data: activityData = [], isLoading } = useQuery({
    queryKey: ['/api/user-activity', selectedTenantId, filterType, dateRange],
    enabled: !!selectedTenantId,
  });

  const { data: activityStats = {} } = useQuery({
    queryKey: ['/api/user-activity/stats', selectedTenantId, dateRange],
    enabled: !!selectedTenantId,
  });

  // Mock data for demonstration (replace with real API data)
  const mockActivityData = [
    {
      id: 1,
      userId: "user123",
      userName: "John Doe",
      userEmail: "john@example.com",
      action: "LOGIN",
      resource: "System",
      details: "User logged in successfully",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0.0",
      timestamp: "2024-01-23T10:30:00Z",
      status: "SUCCESS",
      isAdmin: false,
    },
    {
      id: 2,
      userId: "admin456",
      userName: "Admin User",
      userEmail: "admin@example.com",
      action: "CREATE_TEAM",
      resource: "Teams",
      details: "Created team 'Development Team'",
      ipAddress: "192.168.1.101",
      userAgent: "Firefox 121.0",
      timestamp: "2024-01-23T10:25:00Z",
      status: "SUCCESS",
      isAdmin: true,
    },
    {
      id: 3,
      userId: "user789",
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      action: "VIEW_COUNTRIES",
      resource: "Countries",
      details: "Viewed countries reference data",
      ipAddress: "192.168.1.102",
      userAgent: "Safari 17.2",
      timestamp: "2024-01-23T10:20:00Z",
      status: "SUCCESS",
      isAdmin: false,
    },
    {
      id: 4,
      userId: "admin456",
      userName: "Admin User",
      userEmail: "admin@example.com",
      action: "UPDATE_USER_ROLE",
      resource: "Users",
      details: "Updated role for user 'john@example.com'",
      ipAddress: "192.168.1.101",
      userAgent: "Firefox 121.0",
      timestamp: "2024-01-23T10:15:00Z",
      status: "SUCCESS",
      isAdmin: true,
    },
    {
      id: 5,
      userId: "user123",
      userName: "John Doe",
      userEmail: "john@example.com",
      action: "FAILED_LOGIN",
      resource: "System",
      details: "Failed login attempt - invalid password",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0.0",
      timestamp: "2024-01-23T10:10:00Z",
      status: "FAILED",
      isAdmin: false,
    },
  ];

  const mockStats = {
    totalActivities: 1247,
    uniqueUsers: 89,
    adminActivities: 156,
    failedAttempts: 23,
    topActions: [
      { action: "LOGIN", count: 445 },
      { action: "VIEW_DATA", count: 289 },
      { action: "CREATE_RECORD", count: 167 },
      { action: "UPDATE_RECORD", count: 134 },
    ],
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      case "WARNING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "LOGIN":
      case "LOGOUT":
        return <User className="h-4 w-4" />;
      case "CREATE_TEAM":
      case "UPDATE_USER_ROLE":
        return <Shield className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const filteredData = mockActivityData.filter((item) => {
    if (filterType !== "all") {
      if (filterType === "admin" && !item.isAdmin) return false;
      if (filterType === "user" && item.isAdmin) return false;
      if (filterType === "failed" && item.status !== "FAILED") return false;
    }
    if (searchTerm) {
      return (
        item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.resource.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading user activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Activity Monitor</h1>
          <p className="text-muted-foreground">
            Track and monitor tenant user activity and administrative actions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Activity Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalActivities.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">Unique users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Activities</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.adminActivities}</div>
            <p className="text-xs text-muted-foreground">Administrative actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockStats.failedAttempts}</div>
            <p className="text-xs text-muted-foreground">Security incidents</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Select 
              value={selectedTenantId?.toString() || ""} 
              onValueChange={(value) => setSelectedTenantId(parseInt(value))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(tenants) && tenants.map((tenant: any) => (
                  <SelectItem key={tenant.id} value={tenant.id.toString()}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search users, actions, or resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="admin">Admin Only</SelectItem>
                <SelectItem value="user">Users Only</SelectItem>
                <SelectItem value="failed">Failed Attempts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1day">Last 24 hours</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Tabs */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Showing {filteredData.length} of {mockActivityData.length} activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {activity.isAdmin && (
                            <Shield className="h-4 w-4 text-blue-600" />
                          )}
                          <div>
                            <div className="font-medium">{activity.userName}</div>
                            <div className="text-sm text-muted-foreground">
                              {activity.userEmail}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(activity.action)}
                          <div>
                            <div className="font-medium">{activity.action}</div>
                            <div className="text-sm text-muted-foreground">
                              {activity.details}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{activity.resource}</TableCell>
                      <TableCell>{getStatusBadge(activity.status)}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {activity.ipAddress}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Actions</CardTitle>
                <CardDescription>Most frequent user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStats.topActions.map((action, index) => (
                    <div key={action.action} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{action.action}</span>
                      </div>
                      <span className="text-muted-foreground">{action.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Trends</CardTitle>
                <CardDescription>Activity patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>Activity trend chart would be displayed here</p>
                  <p className="text-sm">Integration with charting library needed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}