import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Monitor, Plus, Search, Layout, Edit, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

export default function Screens() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const currentTenantId = user?.currentTenantId;

  const { data: screenAssets = [], isLoading } = useQuery({
    queryKey: [`/api/tenants/${currentTenantId}/screen-assets`],
    enabled: !!currentTenantId,
  });

  const { data: entities = [] } = useQuery({
    queryKey: [`/api/tenants/${currentTenantId}/entities`],
    enabled: !!currentTenantId,
  });

  const filteredScreens = screenAssets.filter((screen: any) =>
    screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    screen.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'list':
        return <Layout className="text-blue-500" size={16} />;
      case 'form':
        return <Edit className="text-green-500" size={16} />;
      case 'detail':
        return <Monitor className="text-purple-500" size={16} />;
      default:
        return <Monitor className="text-slate-500" size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'list':
        return 'bg-blue-100 text-blue-800';
      case 'form':
        return 'bg-green-100 text-green-800';
      case 'detail':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getEntityName = (entityId: number) => {
    const entity = entities.find((e: any) => e.id === entityId);
    return entity?.displayName || 'Unknown Entity';
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
          <h1 className="text-2xl font-semibold text-slate-900">Screen Assets</h1>
          <p className="text-slate-600 mt-1">Manage user interface screens and field configurations</p>
        </div>
        <Button className="bg-primary hover:bg-blue-700">
          <Plus className="mr-2" size={16} />
          Create Screen
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Search screens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Screens Grid */}
      {filteredScreens.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Monitor className="mx-auto text-slate-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No screen assets found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm ? "No screens match your search criteria." : "Create your first screen asset to define user interfaces."}
            </p>
            {!searchTerm && (
              <Button className="bg-primary hover:bg-blue-700">
                <Plus className="mr-2" size={16} />
                Create Screen
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScreens.map((screen: any) => (
            <Card key={screen.id} className="border border-slate-200 hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                      {getTypeIcon(screen.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{screen.name}</CardTitle>
                      <p className="text-sm text-slate-500">{getEntityName(screen.entityId)}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="mr-2" size={14} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Monitor className="mr-2" size={14} />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
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
                    <Badge className={getTypeColor(screen.type)}>
                      {screen.type} Screen
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <Badge 
                      variant={screen.isActive ? "default" : "secondary"}
                      className={screen.isActive ? "bg-green-100 text-green-800" : ""}
                    >
                      {screen.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Fields</span>
                    <span className="text-sm font-medium">
                      {screen.configuration?.fields?.length || 0}
                    </span>
                  </div>
                  
                  {screen.configuration?.fields && (
                    <div>
                      <span className="text-sm text-slate-600">Field Types</span>
                      <div className="mt-2 space-y-1">
                        {screen.configuration.fields.slice(0, 3).map((field: any, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs mr-1">
                            {field.type || 'text'}
                          </Badge>
                        ))}
                        {screen.configuration.fields.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{screen.configuration.fields.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      Created {new Date(screen.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
