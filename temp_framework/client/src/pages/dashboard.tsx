import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Users, Ticket, HeartPulse, Edit, UserPlus, Cog, Plus } from "lucide-react";
import { useState } from "react";
import EntityModal from "@/components/modals/EntityModal";
import UserModal from "@/components/modals/UserModal";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [showEntityModal, setShowEntityModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

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

  const stats = [
    {
      title: "Total Entities",
      value: entities.length.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Database,
      color: "blue",
    },
    {
      title: "Active Users",
      value: users.length.toString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: Users,
      color: "green",
    },
    {
      title: "Transactions",
      value: transactions.length.toString(),
      change: "-2%",
      changeType: "negative" as const,
      icon: Ticket,
      color: "amber",
    },
    {
      title: "System Health",
      value: "99.8%",
      change: "Excellent",
      changeType: "positive" as const,
      icon: HeartPulse,
      color: "green",
    },
  ];

  const iconColors = {
    blue: "text-primary",
    green: "text-green-500",
    amber: "text-amber-500",
  };

  const bgColors = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    amber: "bg-amber-50",
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.changeType === "positive" ? "text-green-600" : "text-red-500"
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 ${bgColors[stat.color]} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`${iconColors[stat.color]} text-xl`} size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entity Management Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle>Entity Management</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      <th className="pb-3">Entity Name</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Records</th>
                      <th className="pb-3">Last Modified</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entities.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No entities found. Create your first entity to get started.
                        </td>
                      </tr>
                    ) : (
                      entities.slice(0, 5).map((entity: any) => (
                        <tr key={entity.id} className="border-t border-slate-100">
                          <td className="py-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Database className="text-primary text-sm" size={16} />
                              </div>
                              <span className="font-medium text-slate-900">{entity.displayName}</span>
                            </div>
                          </td>
                          <td className="py-3 text-slate-600 capitalize">{entity.type} Entity</td>
                          <td className="py-3 text-slate-600">{entity.recordCount}</td>
                          <td className="py-3 text-slate-600">
                            {new Date(entity.lastModified).toLocaleString()}
                          </td>
                          <td className="py-3">
                            <Badge 
                              variant={entity.isActive ? "default" : "secondary"}
                              className={entity.isActive ? "bg-green-100 text-green-800" : ""}
                            >
                              {entity.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={() => setShowEntityModal(true)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Plus className="text-primary" size={16} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Create Entity</p>
                    <p className="text-sm text-slate-500">Add new data entity</p>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={() => setShowUserModal(true)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <UserPlus className="text-green-500" size={16} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Add User</p>
                    <p className="text-sm text-slate-500">Invite team member</p>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Cog className="text-purple-500" size={16} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Configure Screen</p>
                    <p className="text-sm text-slate-500">Set up interface</p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {entities.length === 0 ? (
                <p className="text-slate-500 text-sm">No recent activity</p>
              ) : (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Edit className="text-primary text-sm" size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900">
                        Entity "<span className="font-medium">{entities[0]?.displayName}</span>" was created
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(entities[0]?.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {users.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <UserPlus className="text-green-500 text-sm" size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900">
                          <span className="font-medium">{users[0]?.firstName} {users[0]?.lastName}</span> joined the tenant
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Recently</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <EntityModal 
        isOpen={showEntityModal} 
        onClose={() => setShowEntityModal(false)} 
        tenantId={currentTenantId}
      />
      <UserModal 
        isOpen={showUserModal} 
        onClose={() => setShowUserModal(false)} 
        tenantId={currentTenantId}
      />
    </div>
  );
}
