import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Search, MoreHorizontal, Mail, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import UserModal from "@/components/modals/UserModal";
import { useAuth } from "@/hooks/useAuth";

export default function Users() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const currentTenantId = user?.currentTenantId;

  const { data: users = [], isLoading } = useQuery({
    queryKey: [`/api/tenants/${currentTenantId}/users`],
    enabled: !!currentTenantId,
  });

  const removeUserRoleMutation = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: number }) => {
      await apiRequest("DELETE", `/api/user-roles/${userId}/${currentTenantId}/${roleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tenants/${currentTenantId}/users`] });
      toast({
        title: "Success",
        description: "User role removed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove user role",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users.filter((user: any) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveRole = (userId: string, roleId: number) => {
    if (confirm("Are you sure you want to remove this role from the user?")) {
      removeUserRoleMutation.mutate({ userId, roleId });
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">Manage users and their roles within this tenant</p>
        </div>
        <Button onClick={() => setShowUserModal(true)} className="bg-primary hover:bg-blue-700">
          <UserPlus className="mr-2" size={16} />
          Add User
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <UserPlus className="mx-auto text-slate-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No users found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm ? "No users match your search criteria." : "Start by adding users to this tenant."}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowUserModal(true)} className="bg-primary hover:bg-blue-700">
                <UserPlus className="mr-2" size={16} />
                Add User
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredUsers.map((userData: any) => (
            <Card key={userData.id} className="border border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={userData.profileImageUrl} />
                      <AvatarFallback className="bg-primary text-white">
                        {getInitials(userData.firstName, userData.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {userData.firstName} {userData.lastName}
                      </h3>
                      {userData.email && (
                        <div className="flex items-center space-x-1 text-slate-600 mt-1">
                          <Mail size={14} />
                          <span className="text-sm">{userData.email}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        {userData.roles?.map((role: any) => (
                          <div key={role.id} className="flex items-center space-x-1">
                            <Badge 
                              variant="outline" 
                              className={role.isSystemRole ? "border-red-200 text-red-700" : "border-blue-200 text-blue-700"}
                            >
                              <Shield size={12} className="mr-1" />
                              {role.name}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {userData.roles?.map((role: any) => (
                        <DropdownMenuItem 
                          key={role.id}
                          onClick={() => handleRemoveRole(userData.id, role.id)}
                          className="text-red-600"
                        >
                          Remove {role.name} role
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {userData.roles?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Permissions Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {userData.roles?.flatMap((role: any) => role.permissions || []).slice(0, 4).map((permission: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission.replace(/_/g, ' ').toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        tenantId={currentTenantId}
      />
    </div>
  );
}
