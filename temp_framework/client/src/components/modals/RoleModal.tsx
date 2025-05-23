import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AVAILABLE_PERMISSIONS, PERMISSION_GROUPS } from "@/lib/permissions";

const roleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  permissions: z.array(z.string()),
});

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId?: number;
  role?: any;
}

export default function RoleModal({ isOpen, onClose, tenantId, role }: RoleModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description || "",
        permissions: role.permissions || [],
      });
      setSelectedPermissions(role.permissions || []);
    } else {
      form.reset({
        name: "",
        description: "",
        permissions: [],
      });
      setSelectedPermissions([]);
    }
  }, [role, form]);

  const createRoleMutation = useMutation({
    mutationFn: async (data: any) => {
      const roleData = {
        ...data,
        permissions: selectedPermissions,
      };
      
      if (role) {
        const response = await apiRequest("PUT", `/api/roles/${role.id}`, roleData);
        return response.json();
      } else {
        const response = await apiRequest("POST", `/api/tenants/${tenantId}/roles`, roleData);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tenants/${tenantId}/roles`] });
      toast({
        title: "Success",
        description: `Role ${role ? 'updated' : 'created'} successfully`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${role ? 'update' : 'create'} role`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof roleSchema>) => {
    createRoleMutation.mutate(data);
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const toggleAllInGroup = (groupPermissions: string[]) => {
    const allSelected = groupPermissions.every(p => selectedPermissions.includes(p));
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(p => !groupPermissions.includes(p)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...groupPermissions])]);
    }
  };

  const isGroupSelected = (groupPermissions: string[]) => {
    return groupPermissions.every(p => selectedPermissions.includes(p));
  };

  const isGroupPartiallySelected = (groupPermissions: string[]) => {
    return groupPermissions.some(p => selectedPermissions.includes(p)) && 
           !groupPermissions.every(p => selectedPermissions.includes(p));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {role ? 'Edit Role' : 'Create New Role'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Entity Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the role and its responsibilities..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permissions */}
            <div>
              <FormLabel className="text-base font-medium">Permissions</FormLabel>
              <p className="text-sm text-slate-600 mb-4">
                Select the permissions this role should have
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(PERMISSION_GROUPS).map(([groupName, groupData]) => (
                  <Card key={groupName}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={isGroupSelected(groupData.permissions)}
                          onCheckedChange={() => toggleAllInGroup(groupData.permissions)}
                          className={isGroupPartiallySelected(groupData.permissions) ? "data-[state=checked]:bg-slate-400" : ""}
                        />
                        <CardTitle className="text-sm">{groupData.label}</CardTitle>
                      </div>
                      <p className="text-xs text-slate-500">{groupData.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {groupData.permissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedPermissions.includes(permission)}
                            onCheckedChange={() => togglePermission(permission)}
                          />
                          <span className="text-sm text-slate-700">
                            {AVAILABLE_PERMISSIONS[permission] || permission.replace(/_/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-blue-700"
                disabled={createRoleMutation.isPending}
              >
                {createRoleMutation.isPending 
                  ? (role ? 'Updating...' : 'Creating...') 
                  : (role ? 'Update Role' : 'Create Role')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
