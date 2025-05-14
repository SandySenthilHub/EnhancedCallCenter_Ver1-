import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Define KPI schema with validation
const kpiSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  type: z.enum(["contact_center", "mobile_banking"]),
  priority: z.enum(["critical", "medium", "low"]),
  unit: z.string().min(1, { message: "Unit is required" }),
  target: z.coerce.number().positive({ message: "Target must be a positive number" }),
  threshold: z.coerce.number().positive({ message: "Threshold must be a positive number" }),
  calculation: z.string().optional(),
  sourceSchema: z.string().optional(),
  sourceTables: z.array(z.string()).optional(),
  isRealTime: z.boolean().optional()
});

type KpiFormValues = z.infer<typeof kpiSchema>;

interface KpiEditorProps {
  kpi?: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (kpi: any) => void;
  kpiType: 'contact_center' | 'mobile_banking';
}

const KpiEditor: React.FC<KpiEditorProps> = ({
  kpi,
  isOpen,
  onClose,
  onSave,
  kpiType
}) => {
  // Initialize form with default values or existing KPI data
  const form = useForm<KpiFormValues>({
    resolver: zodResolver(kpiSchema),
    defaultValues: {
      id: kpi?.id || '',
      name: kpi?.name || '',
      description: kpi?.description || '',
      type: kpiType,
      priority: kpi?.priority || 'medium',
      unit: kpi?.unit || '%',
      target: kpi?.target || 0,
      threshold: kpi?.threshold || 0
    }
  });

  // Update form when KPI changes
  useEffect(() => {
    if (kpi) {
      form.reset({
        id: kpi.id,
        name: kpi.name,
        description: kpi.description,
        type: kpi.type,
        priority: kpi.priority,
        unit: kpi.unit,
        target: kpi.target,
        threshold: kpi.threshold,
        calculation: kpi.calculation || '',
        sourceSchema: kpi.sourceSchema || '',
        sourceTables: kpi.sourceTables || [],
        isRealTime: kpi.isRealTime || false
      });
    } else {
      form.reset({
        id: '',
        name: '',
        description: '',
        type: kpiType,
        priority: 'medium',
        unit: '%',
        target: 0,
        threshold: 0,
        calculation: '',
        sourceSchema: '',
        sourceTables: [],
        isRealTime: false
      });
    }
  }, [kpi, kpiType, form]);

  // Handle form submission
  const onSubmit = (values: KpiFormValues) => {
    // Generate a random ID if not provided (for new KPIs)
    if (!values.id) {
      values.id = `${kpiType}_${Math.random().toString(36).substring(2, 10)}`;
    }
    
    onSave(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{kpi ? 'Edit KPI' : 'Create New KPI'}</DialogTitle>
          <DialogDescription>
            {kpi 
              ? 'Update the KPI details below.' 
              : 'Fill in the details to create a new KPI.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="KPI Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Detailed description of what this KPI measures" 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="%, seconds, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Value</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="Target value"
                      />
                    </FormControl>
                    <FormDescription>
                      The ideal value to achieve
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Threshold Value</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="Threshold value"
                      />
                    </FormControl>
                    <FormDescription>
                      The value that triggers alerts
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <h3 className="text-md font-semibold mt-8 mb-4">SQL Schema Information</h3>
            
            <FormField
              control={form.control}
              name="calculation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SQL Calculation Query</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="SQL query used to calculate this KPI" 
                      rows={4}
                      className="font-mono text-xs"
                    />
                  </FormControl>
                  <FormDescription>
                    The SQL query template used to calculate this KPI's value
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sourceSchema"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Schema</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="CREATE TABLE statements for related tables" 
                      rows={4}
                      className="font-mono text-xs"
                    />
                  </FormControl>
                  <FormDescription>
                    Database schema (CREATE TABLE statements) related to this KPI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sourceTables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Tables</FormLabel>
                    <FormControl>
                      <Input 
                        value={field.value?.join(', ') || ''} 
                        onChange={(e) => {
                          field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean));
                        }}
                        placeholder="Table1, Table2, ..."
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of source tables
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isRealTime"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Real-time KPI</FormLabel>
                      <FormDescription>
                        Requires near real-time updates
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {kpi ? 'Update KPI' : 'Create KPI'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default KpiEditor;