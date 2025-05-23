import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Ticket, Plus, Search, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function Transactions() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const currentTenantId = user?.currentTenantId;

  const { data: definitions = [], isLoading: definitionsLoading } = useQuery({
    queryKey: [`/api/tenants/${currentTenantId}/transaction-definitions`],
    enabled: !!currentTenantId,
  });

  const { data: instances = [], isLoading: instancesLoading } = useQuery({
    queryKey: [`/api/tenants/${currentTenantId}/transaction-instances`],
    enabled: !!currentTenantId,
  });

  const filteredDefinitions = definitions.filter((def: any) =>
    def.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    def.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInstances = instances.filter((instance: any) => {
    const definition = definitions.find((def: any) => def.id === instance.definitionId);
    return definition?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           instance.status.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'failed':
        return <XCircle className="text-red-500" size={16} />;
      case 'processing':
        return <Clock className="text-blue-500" size={16} />;
      default:
        return <AlertCircle className="text-yellow-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (definitionsLoading || instancesLoading) {
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
          <h1 className="text-2xl font-semibold text-slate-900">Transaction Management</h1>
          <p className="text-slate-600 mt-1">Manage transaction workflows and monitor executions</p>
        </div>
        <Button className="bg-primary hover:bg-blue-700">
          <Plus className="mr-2" size={16} />
          Create Transaction
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="definitions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="definitions">Transaction Definitions</TabsTrigger>
          <TabsTrigger value="instances">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="definitions">
          {filteredDefinitions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Ticket className="mx-auto text-slate-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No transaction definitions found</h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm ? "No definitions match your search criteria." : "Create your first transaction definition to get started."}
                </p>
                {!searchTerm && (
                  <Button className="bg-primary hover:bg-blue-700">
                    <Plus className="mr-2" size={16} />
                    Create Transaction Definition
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDefinitions.map((definition: any) => (
                <Card key={definition.id} className="border border-slate-200 hover:border-primary transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                          <Ticket className="text-purple-500" size={20} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{definition.name}</CardTitle>
                          {definition.description && (
                            <p className="text-sm text-slate-500 mt-1">{definition.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Status</span>
                        <Badge 
                          variant={definition.isActive ? "default" : "secondary"}
                          className={definition.isActive ? "bg-green-100 text-green-800" : ""}
                        >
                          {definition.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Workflow Steps</span>
                        <span className="text-sm font-medium">
                          {definition.workflow?.steps?.length || 0}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500">
                          Created {new Date(definition.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="instances">
          {filteredInstances.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="mx-auto text-slate-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No transaction history found</h3>
                <p className="text-slate-600">
                  {searchTerm ? "No transactions match your search criteria." : "Transaction executions will appear here."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredInstances.map((instance: any) => {
                const definition = definitions.find((def: any) => def.id === instance.definitionId);
                return (
                  <Card key={instance.id} className="border border-slate-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Ticket className="text-purple-500" size={20} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                              {definition?.name || 'Unknown Definition'}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              {getStatusIcon(instance.status)}
                              <Badge className={getStatusColor(instance.status)}>
                                {instance.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">
                            {instance.executedAt 
                              ? `Executed ${new Date(instance.executedAt).toLocaleString()}`
                              : `Created ${new Date(instance.createdAt).toLocaleString()}`
                            }
                          </p>
                          {instance.executedBy && (
                            <p className="text-xs text-slate-500 mt-1">
                              by {instance.executedBy}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {instance.data && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <h4 className="text-sm font-medium text-slate-700 mb-2">Transaction Data</h4>
                          <div className="bg-slate-50 rounded-lg p-3">
                            <pre className="text-xs text-slate-700 overflow-x-auto">
                              {JSON.stringify(instance.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
