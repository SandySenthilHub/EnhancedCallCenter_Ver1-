import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDashboard, Widget } from '@/contexts/DashboardContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BarChart3, PieChart, LineChart, Table } from 'lucide-react';
import { 
  contactCenterCriticalKpis,
  contactCenterMediumKpis,
  contactCenterLowKpis,
  mobileBankingCriticalKpis,
  mobileBankingMediumKpis,
  mobileBankingLowKpis
} from '@/lib/localKpiData';

// Define form schema
const widgetFormSchema = z.object({
  title: z.string().min(1, 'Widget title is required'),
  type: z.enum(['chart', 'value', 'table', 'list']),
  size: z.enum(['small', 'medium', 'large', 'full']),
  kpiId: z.string().optional(),
  chartType: z.enum(['bar', 'line', 'pie', 'donut']).optional(),
});

type WidgetFormValues = z.infer<typeof widgetFormSchema>;

// Combine all KPI definitions for selection
const allKpis = [
  ...contactCenterCriticalKpis.slice(0, 5),  // Take first 5 from each category for better UI
  ...contactCenterMediumKpis.slice(0, 5),
  ...contactCenterLowKpis.slice(0, 5),
  ...mobileBankingCriticalKpis.slice(0, 5),
  ...mobileBankingMediumKpis.slice(0, 5),
  ...mobileBankingLowKpis.slice(0, 5),
];

interface AddWidgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ isOpen, onClose }) => {
  const { addWidget } = useDashboard();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>('chart');
  
  const form = useForm<WidgetFormValues>({
    resolver: zodResolver(widgetFormSchema),
    defaultValues: {
      title: '',
      type: 'chart',
      size: 'medium',
      chartType: 'bar',
    },
  });
  
  function onSubmit(data: WidgetFormValues) {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      title: data.title,
      type: data.type,
      size: data.size,
      kpiId: data.kpiId,
      chartType: data.chartType,
    };
    
    addWidget(newWidget);
    
    toast({
      title: "Widget added",
      description: `${data.title} widget has been added to your dashboard`,
    });
    
    form.reset();
    onClose();
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
          <DialogDescription>
            Create a new widget to display on your dashboard
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Widget Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter widget title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Widget Type</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedType(value);
                      }}
                      defaultValue={field.value} 
                      className="grid grid-cols-4 gap-4"
                    >
                      <FormItem className="flex flex-col items-center space-y-1 rounded-md border p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-primary-foreground">
                        <FormControl>
                          <RadioGroupItem value="chart" className="sr-only" />
                        </FormControl>
                        <BarChart3 className="h-6 w-6" />
                        <FormLabel className="text-xs font-normal">Chart</FormLabel>
                      </FormItem>
                      
                      <FormItem className="flex flex-col items-center space-y-1 rounded-md border p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-primary-foreground">
                        <FormControl>
                          <RadioGroupItem value="value" className="sr-only" />
                        </FormControl>
                        <div className="flex h-6 w-6 items-center justify-center font-bold">123</div>
                        <FormLabel className="text-xs font-normal">Value</FormLabel>
                      </FormItem>
                      
                      <FormItem className="flex flex-col items-center space-y-1 rounded-md border p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-primary-foreground">
                        <FormControl>
                          <RadioGroupItem value="table" className="sr-only" />
                        </FormControl>
                        <Table className="h-6 w-6" />
                        <FormLabel className="text-xs font-normal">Table</FormLabel>
                      </FormItem>
                      
                      <FormItem className="flex flex-col items-center space-y-1 rounded-md border p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-primary-foreground">
                        <FormControl>
                          <RadioGroupItem value="list" className="sr-only" />
                        </FormControl>
                        <div className="flex h-6 w-6 items-center justify-center">
                          <div className="space-y-1 w-5">
                            <div className="h-0.5 w-full bg-current"></div>
                            <div className="h-0.5 w-full bg-current"></div>
                            <div className="h-0.5 w-full bg-current"></div>
                          </div>
                        </div>
                        <FormLabel className="text-xs font-normal">List</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            {selectedType === 'chart' && (
              <FormField
                control={form.control}
                name="chartType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chart Type</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange}
                        defaultValue={field.value} 
                        className="grid grid-cols-4 gap-4"
                      >
                        <FormItem className="flex flex-col items-center space-y-1 rounded-md border p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-primary-foreground">
                          <FormControl>
                            <RadioGroupItem value="bar" className="sr-only" />
                          </FormControl>
                          <BarChart3 className="h-6 w-6" />
                          <FormLabel className="text-xs font-normal">Bar</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex flex-col items-center space-y-1 rounded-md border p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-primary-foreground">
                          <FormControl>
                            <RadioGroupItem value="line" className="sr-only" />
                          </FormControl>
                          <LineChart className="h-6 w-6" />
                          <FormLabel className="text-xs font-normal">Line</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex flex-col items-center space-y-1 rounded-md border p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-primary-foreground">
                          <FormControl>
                            <RadioGroupItem value="pie" className="sr-only" />
                          </FormControl>
                          <PieChart className="h-6 w-6" />
                          <FormLabel className="text-xs font-normal">Pie</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex flex-col items-center space-y-1 rounded-md border p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-primary-foreground">
                          <FormControl>
                            <RadioGroupItem value="donut" className="sr-only" />
                          </FormControl>
                          <div className="relative h-6 w-6">
                            <PieChart className="h-6 w-6" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-current"></div>
                            </div>
                          </div>
                          <FormLabel className="text-xs font-normal">Donut</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="kpiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KPI</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select KPI" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      {/* Contact Center Critical KPIs */}
                      <div className="px-2 py-1.5 text-xs font-semibold">Contact Center - Critical</div>
                      {contactCenterCriticalKpis.slice(0, 10).map(kpi => (
                        <SelectItem key={kpi.id} value={kpi.id}>
                          {kpi.name}
                        </SelectItem>
                      ))}
                      
                      {/* Contact Center Medium KPIs */}
                      <div className="px-2 py-1.5 text-xs font-semibold mt-2">Contact Center - Medium</div>
                      {contactCenterMediumKpis.slice(0, 10).map(kpi => (
                        <SelectItem key={kpi.id} value={kpi.id}>
                          {kpi.name}
                        </SelectItem>
                      ))}
                      
                      {/* Mobile Banking Critical KPIs */}
                      <div className="px-2 py-1.5 text-xs font-semibold mt-2">Mobile Banking - Critical</div>
                      {mobileBankingCriticalKpis.slice(0, 10).map(kpi => (
                        <SelectItem key={kpi.id} value={kpi.id}>
                          {kpi.name}
                        </SelectItem>
                      ))}
                      
                      {/* Mobile Banking Medium KPIs */}
                      <div className="px-2 py-1.5 text-xs font-semibold mt-2">Mobile Banking - Medium</div>
                      {mobileBankingMediumKpis.slice(0, 10).map(kpi => (
                        <SelectItem key={kpi.id} value={kpi.id}>
                          {kpi.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Widget Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="small">Small (25%)</SelectItem>
                      <SelectItem value="medium">Medium (50%)</SelectItem>
                      <SelectItem value="large">Large (75%)</SelectItem>
                      <SelectItem value="full">Full Width (100%)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add Widget</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;