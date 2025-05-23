import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import RoleModal from "@/components/modals/RoleModal";
import { useAuth } from "@/hooks/useAuth";

export default function Roles() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const currentTenantId = user?.currentTenantId;

  const { data: roles = [], isLoading } = useQuery({
    queryKey: [`/api/tenants/${currentTenantId}/roles`],
    enabled: !!currentTenantId,
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/roles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tenants/${currentTenantId}/roles`] });
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    },
  });

  const filteredRoles = roles.filter((role: any) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setShowRoleModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this role?")) {
      deleteRoleMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setShowRoleModal(false);
    setEditingRole(null);
  };

  const getRoleLevel = (role: any) => {
    if (role.isSystemRole) return { label: "System", color: "bg-red-100 text-red-800" };
    if (role.permissions?.length > 10) return { label: "Admin", color: "bg-blue-100 text-blue-800" };
    if (role.permissions?.length > 5) return { label: "Manager", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Basic", color: "bg-green-100 text-green-800" };
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
          <h1 className="text-2xl font-semibold text-slate-900">Roles & Permissions</h1>
          <p className="text-slate-600 mt-1">Define roles and manage access permissions</p>
        </div>
        <Button onClick={() => setShowRoleModal(true)} className="bg-primary hover:bg-blue-700">
          <Plus className="mr-2" size={16} />
          Create Role
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles Grid */}
      {filteredRoles.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="mx-auto text-slate-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No roles found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm ? "No roles match your search criteria." : "Create your first role to manage permissions."}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowRoleModal(true)} className="bg-primary hover:bg-blue-700">
                <Plus className="mr-2" size={16} />
                Create Role
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role: any) => {
            const roleLevel = getRoleLevel(role);
            return (
              <Card key={role.id} className="border border-slate-200 hover:border-primary transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Shield className="text-primary" size={20} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        {role.description && (
                          <p className="text-sm text-slate-500 mt-1">{role.description}</p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(role)}>
                          <Edit className="mr-2" size={14} />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(role.id)}
                          className="text-red-600"
                          disabled={role.isSystemRole}
                        >
                          <Trash2 className="mr-2" size={14} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Role Level</span>
                      <Badge className={roleLevel.color}>
                        {roleLevel.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Permissions</span>
                      <span className="text-sm font-medium">{role.permissions?.length || 0}</span>
                    </div>
                    {role.isSystemRole && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Type</span>
                        <Badge variant="outline" className="border-red-200 text-red-700">
                          System Role
                        </Badge>
                      </div>
                    )}
                    
                    {role.permissions?.length > 0 && (
                      <div>
                        <span className="text-sm text-slate-600">Key Permissions</span>
                        <div className="mt-2 space-y-1">
                          {role.permissions.slice(0, 3).map((permission: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs mr-1">
                              {permission.replace(/_/g, ' ').toLowerCase()}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-500">
                        Created {new Date(role.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Role Modal */}
      <RoleModal
        isOpen={showRoleModal}
        onClose={handleCloseModal}
        tenantId={currentTenantId}
        role={editingRole}
      />
    </div>
  );
}
