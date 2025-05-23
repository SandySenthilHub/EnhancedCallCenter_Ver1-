import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const userRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  roleIds: z.array(z.number()).min(1, "At least one role must be selected"),
});

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId?: number;
}

export default function UserModal({ isOpen, onClose, tenantId }: UserModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const { data: roles = [] } = useQuery({
    queryKey: [`/api/tenants/${tenantId}/roles`],
    enabled: !!tenantId && isOpen,
  });

  const form = useForm<z.infer<typeof userRoleSchema>>({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      userId: "",
      roleIds: [],
    },
  });

  useEffect(() => {
    form.reset({
      userId: "",
      roleIds: [],
    });
    setSelectedRoles([]);
  }, [isOpen, form]);

  const assignUserRoleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof userRoleSchema>) => {
      // Assign multiple roles to the user
      const promises = data.roleIds.map(roleId =>
        apiRequest("POST", "/api/user-roles", {
          userId: data.userId,
          tenantId,
          roleId,
        })
      );
      
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tenants/${tenantId}/users`] });
      toast({
        title: "Success",
        description: "User roles assigned successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign user roles",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof userRoleSchema>) => {
    assignUserRoleMutation.mutate({
      ...data,
      roleIds: selectedRoles,
    });
  };

  const toggleRole = (roleId: number) => {
    setSelectedRoles(prev => 
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const getRoleLevel = (role: any) => {
    if (role.isSystemRole) return { label: "System", color: "bg-red-100 text-red-800" };
    if (role.permissions?.length > 10) return { label: "Admin", color: "bg-blue-100 text-blue-800" };
    if (role.permissions?.length > 5) return { label: "Manager", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Basic", color: "bg-green-100 text-green-800" };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add User to Tenant</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter user ID (from Replit authentication)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-slate-500">
                    This should be the user's unique identifier from the authentication system
                  </p>
                </FormItem>
              )}
            />

            {/* Role Selection */}
            <div>
              <FormLabel className="text-base font-medium">Assign Roles</FormLabel>
              <p className="text-sm text-slate-600 mb-4">
                Select the roles this user should have in this tenant
              </p>
              
              {roles.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-slate-500">No roles available. Create roles first.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {roles.map((role: any) => {
                    const roleLevel = getRoleLevel(role);
                    return (
                      <Card 
                        key={role.id} 
                        className={`cursor-pointer transition-colors ${
                          selectedRoles.includes(role.id) 
                            ? "border-primary bg-blue-50" 
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => toggleRole(role.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={selectedRoles.includes(role.id)}
                              onChange={() => toggleRole(role.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-slate-900">{role.name}</h4>
                                <Badge className={roleLevel.color}>
                                  {roleLevel.label}
                                </Badge>
                              </div>
                              {role.description && (
                                <p className="text-sm text-slate-600 mt-1">{role.description}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                                <span>{role.permissions?.length || 0} permissions</span>
                                {role.isSystemRole && (
                                  <Badge variant="outline" className="border-red-200 text-red-700">
                                    System Role
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-blue-700"
                disabled={assignUserRoleMutation.isPending || selectedRoles.length === 0}
              >
                {assignUserRoleMutation.isPending ? 'Assigning...' : 'Assign User'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
