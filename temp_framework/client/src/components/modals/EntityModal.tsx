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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const entitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  displayName: z.string().min(1, "Display name is required"),
  type: z.enum(["primary", "sub", "reference"]),
  description: z.string().optional(),
  parentEntityId: z.number().optional(),
});

const fieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  type: z.enum(["string", "integer", "boolean", "date", "text"]),
  required: z.boolean().default(false),
});

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId?: number;
  entity?: any;
}

export default function EntityModal({ isOpen, onClose, tenantId, entity }: EntityModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fields, setFields] = useState<z.infer<typeof fieldSchema>[]>([
    { name: "id", type: "integer", required: true },
  ]);

  const form = useForm<z.infer<typeof entitySchema>>({
    resolver: zodResolver(entitySchema),
    defaultValues: {
      name: "",
      displayName: "",
      type: "primary",
      description: "",
    },
  });

  useEffect(() => {
    if (entity) {
      form.reset({
        name: entity.name,
        displayName: entity.displayName,
        type: entity.type,
        description: entity.description || "",
        parentEntityId: entity.parentEntityId,
      });
      
      if (entity.schema?.fields) {
        setFields(entity.schema.fields);
      }
    } else {
      form.reset({
        name: "",
        displayName: "",
        type: "primary",
        description: "",
      });
      setFields([{ name: "id", type: "integer", required: true }]);
    }
  }, [entity, form]);

  const createEntityMutation = useMutation({
    mutationFn: async (data: any) => {
      const entityData = {
        ...data,
        schema: { fields },
      };
      
      if (entity) {
        const response = await apiRequest("PUT", `/api/entities/${entity.id}`, entityData);
        return response.json();
      } else {
        const response = await apiRequest("POST", `/api/tenants/${tenantId}/entities`, entityData);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tenants/${tenantId}/entities`] });
      toast({
        title: "Success",
        description: `Entity ${entity ? 'updated' : 'created'} successfully`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${entity ? 'update' : 'create'} entity`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof entitySchema>) => {
    createEntityMutation.mutate(data);
  };

  const addField = () => {
    setFields([...fields, { name: "", type: "string", required: false }]);
  };

  const removeField = (index: number) => {
    if (fields[index].name === "id") return; // Don't allow removing ID field
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, field: Partial<z.infer<typeof fieldSchema>>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...field };
    setFields(updatedFields);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {entity ? 'Edit Entity' : 'Create New Entity'}
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
                    <FormLabel>Entity Name</FormLabel>
                    <FormControl>
                      <Input placeholder="customer_data" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer Data" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primary">Primary Entity</SelectItem>
                        <SelectItem value="sub">Sub Entity</SelectItem>
                        <SelectItem value="reference">Reference Entity</SelectItem>
                      </SelectContent>
                    </Select>
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
                      placeholder="Describe the entity purpose..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Field Configuration */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <FormLabel>Field Configuration</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={addField}>
                  <Plus className="mr-1" size={14} />
                  Add Field
                </Button>
              </div>
              
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg">
                    <Input
                      placeholder="Field name"
                      value={field.name}
                      onChange={(e) => updateField(index, { name: e.target.value })}
                      disabled={field.name === "id"}
                      className="flex-1"
                    />
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(index, { type: value as any })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="integer">Integer</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(index, { required: e.target.checked })}
                        disabled={field.name === "id"}
                        className="rounded"
                      />
                      <span className="text-xs text-slate-600">Required</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(index)}
                      disabled={field.name === "id"}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
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
                disabled={createEntityMutation.isPending}
              >
                {createEntityMutation.isPending 
                  ? (entity ? 'Updating...' : 'Creating...') 
                  : (entity ? 'Update Entity' : 'Create Entity')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
