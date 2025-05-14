import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiDefinition } from '@/lib/localKpiData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KpiDetailsPanelProps {
  kpi: KpiDefinition;
}

export function KpiDetailsPanel({ kpi }: KpiDetailsPanelProps) {
  if (!kpi) return null;

  const hasSqlDetails = Boolean(kpi.calculation || kpi.sourceTables || kpi.sourceSchema);

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" /> 
          KPI Technical Details: {kpi.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasSqlDetails ? (
          <Tabs defaultValue="calculation">
            <TabsList>
              <TabsTrigger value="calculation">SQL Calculation</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="tables">Source Tables</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculation">
              <Card>
                <CardContent className="pt-4">
                  <div className="bg-slate-100 p-4 rounded-md">
                    <h4 className="text-sm font-semibold mb-2">SQL Query</h4>
                    <ScrollArea className="h-[200px]">
                      <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap">
                        {kpi.calculation || "No SQL calculation defined"}
                      </pre>
                    </ScrollArea>
                    
                    {kpi.isRealTime !== undefined && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${kpi.isRealTime ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        <span className="text-xs font-medium">
                          {kpi.isRealTime ? 'Real-time KPI' : 'Batch-processed KPI'}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schema">
              <Card>
                <CardContent className="pt-4">
                  <div className="bg-slate-100 p-4 rounded-md">
                    <h4 className="text-sm font-semibold mb-2">Database Schema</h4>
                    <ScrollArea className="h-[200px]">
                      <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap">
                        {kpi.sourceSchema || "No schema information available"}
                      </pre>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tables">
              <Card>
                <CardContent className="pt-4">
                  <div className="bg-slate-100 p-4 rounded-md">
                    <h4 className="text-sm font-semibold mb-2">Source Tables</h4>
                    {kpi.sourceTables && kpi.sourceTables.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {kpi.sourceTables.map((table, i) => (
                          <li key={i} className="text-sm">{table}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-600">No source tables information available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-4 bg-slate-100 rounded-md">
            <p className="text-sm text-slate-600">No SQL details available for this KPI</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function KpiDetailsList({ kpis }: { kpis: KpiDefinition[] }) {
  if (!kpis || kpis.length === 0) return null;
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">KPI Technical Details</h3>
      <Accordion type="single" collapsible className="w-full">
        {kpis.map((kpi, index) => (
          <AccordionItem key={kpi.id} value={kpi.id}>
            <AccordionTrigger className="hover:bg-slate-50 px-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{kpi.name}</span>
                <span className="text-xs bg-slate-200 px-2 py-0.5 rounded">
                  {kpi.priority}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <KpiDetailsPanel kpi={kpi} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}