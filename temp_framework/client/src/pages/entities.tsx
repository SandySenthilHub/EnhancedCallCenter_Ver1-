import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Database, Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import EntityModal from "@/components/modals/EntityModal";
import { useAuth } from "@/hooks/useAuth";

export default function Entities() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showEntityModal, setShowEntityModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const currentTenantId = user?.currentTenantId;

  const { data: entities = [], isLoading } = useQuery({
    queryKey: [`/api/tenants/${currentTenantId}/entities`],
    enabled: !!currentTenantId,
  });

  const deleteEntityMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/entities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tenants/${currentTenantId}/entities`] });
      toast({
        title: "Success",
        description: "Entity deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete entity",
        variant: "destructive",
      });
    },
  });

  const filteredEntities = entities.filter((entity: any) =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (entity: any) => {
    setEditingEntity(entity);
    setShowEntityModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this entity?")) {
      deleteEntityMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setShowEntityModal(false);
    setEditingEntity(null);
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
          <h1 className="text-2xl font-semibold text-slate-900">Entity Management</h1>
          <p className="text-slate-600 mt-1">Manage your data entities and their configurations</p>
        </div>
        <Button onClick={() => setShowEntityModal(true)} className="bg-primary hover:bg-blue-700">
          <Plus className="mr-2" size={16} />
          Create Entity
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Search entities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entities Grid */}
      {filteredEntities.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Database className="mx-auto text-slate-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No entities found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm ? "No entities match your search criteria." : "Get started by creating your first entity."}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowEntityModal(true)} className="bg-primary hover:bg-blue-700">
                <Plus className="mr-2" size={16} />
                Create Entity
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntities.map((entity: any) => (
            <Card key={entity.id} className="border border-slate-200 hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Database className="text-primary" size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{entity.displayName}</CardTitle>
                      <p className="text-sm text-slate-500">{entity.name}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(entity)}>
                        <Edit className="mr-2" size={14} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(entity.id)}
                        className="text-red-600"
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
                    <span className="text-sm text-slate-600">Type</span>
                    <Badge variant="outline" className="capitalize">
                      {entity.type} Entity
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Records</span>
                    <span className="text-sm font-medium">{entity.recordCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <Badge 
                      variant={entity.isActive ? "default" : "secondary"}
                      className={entity.isActive ? "bg-green-100 text-green-800" : ""}
                    >
                      {entity.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {entity.description && (
                    <div>
                      <span className="text-sm text-slate-600">Description</span>
                      <p className="text-sm text-slate-900 mt-1 line-clamp-2">{entity.description}</p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      Last modified {new Date(entity.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Entity Modal */}
      <EntityModal
        isOpen={showEntityModal}
        onClose={handleCloseModal}
        tenantId={currentTenantId}
        entity={editingEntity}
      />
    </div>
  );
}
