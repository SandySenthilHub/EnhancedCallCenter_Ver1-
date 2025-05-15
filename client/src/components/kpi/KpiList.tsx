import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KpiDefinition } from '@/lib/localKpiData';
import { Search, Activity, Phone, Smartphone } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface KpiListProps {
  contactCenterKpis: KpiDefinition[];
  mobileBankingKpis: KpiDefinition[];
  onKpiDragStart: (kpi: KpiDefinition) => void;
}

interface GroupedKpis {
  critical: KpiDefinition[];
  medium: KpiDefinition[];
  low: KpiDefinition[];
}

const KpiList: React.FC<KpiListProps> = ({ 
  contactCenterKpis, 
  mobileBankingKpis,
  onKpiDragStart
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter KPIs based on search query
  const filterKpis = (kpis: KpiDefinition[]) => {
    if (!searchQuery) return kpis;
    
    const query = searchQuery.toLowerCase();
    return kpis.filter(kpi => 
      kpi.name.toLowerCase().includes(query) || 
      kpi.description.toLowerCase().includes(query) ||
      kpi.id.toLowerCase().includes(query)
    );
  };
  
  // Group KPIs by priority
  const groupKpisByPriority = (kpis: KpiDefinition[]): GroupedKpis => {
    return {
      critical: kpis.filter(kpi => kpi.priority === 'critical'),
      medium: kpis.filter(kpi => kpi.priority === 'medium'),
      low: kpis.filter(kpi => kpi.priority === 'low'),
    };
  };
  
  const filteredContactCenterKpis = filterKpis(contactCenterKpis);
  const filteredMobileBankingKpis = filterKpis(mobileBankingKpis);
  
  const groupedContactCenter = groupKpisByPriority(filteredContactCenterKpis);
  const groupedMobileBanking = groupKpisByPriority(filteredMobileBankingKpis);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, kpi: KpiDefinition) => {
    e.dataTransfer.setData('text/plain', kpi.id);
    e.dataTransfer.effectAllowed = 'copy';
    onKpiDragStart(kpi);
  };
  
  const renderKpis = (kpis: KpiDefinition[]) => {
    return kpis.map(kpi => (
      <div 
        key={kpi.id}
        className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all mb-2 cursor-grab"
        draggable 
        onDragStart={(e) => handleDragStart(e, kpi)}
      >
        <div className="flex items-start justify-between">
          <div className="font-medium text-sm truncate flex-1">{kpi.name}</div>
          <Badge 
            variant="outline" 
            className={`ml-2 ${
              kpi.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' : 
              kpi.priority === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100' : 
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
            }`}
          >
            {kpi.priority}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{kpi.description}</p>
        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center mr-3">
            <Activity className="h-3 w-3 mr-1" />
            {kpi.unit}
          </span>
          {kpi.isRealTime && (
            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-1.5 py-0.5 rounded">
              real-time
            </span>
          )}
        </div>
      </div>
    ));
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          type="text"
          placeholder="Search KPIs..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="contact-center" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact-center" className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            <span className="truncate">Contact Center</span>
            <Badge variant="secondary" className="ml-1.5">
              {filteredContactCenterKpis.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="mobile-banking" className="flex items-center">
            <Smartphone className="h-4 w-4 mr-2" />
            <span className="truncate">Mobile Banking</span>
            <Badge variant="secondary" className="ml-1.5">
              {filteredMobileBankingKpis.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contact-center" className="flex-1 overflow-y-auto mt-4 px-0.5 scrollbar-thin">
          <Accordion type="multiple" defaultValue={['critical']} className="w-full">
            <AccordionItem value="critical">
              <AccordionTrigger className="py-2">
                <div className="flex items-center">
                  <span>Critical KPIs</span>
                  <Badge variant="outline" className="ml-2 bg-red-50 text-red-800">
                    {groupedContactCenter.critical.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderKpis(groupedContactCenter.critical)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="medium">
              <AccordionTrigger className="py-2">
                <div className="flex items-center">
                  <span>Medium KPIs</span>
                  <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-800">
                    {groupedContactCenter.medium.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderKpis(groupedContactCenter.medium)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="low">
              <AccordionTrigger className="py-2">
                <div className="flex items-center">
                  <span>Low Priority KPIs</span>
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-800">
                    {groupedContactCenter.low.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderKpis(groupedContactCenter.low)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        <TabsContent value="mobile-banking" className="flex-1 overflow-y-auto mt-4 px-0.5 scrollbar-thin">
          <Accordion type="multiple" defaultValue={['critical']} className="w-full">
            <AccordionItem value="critical">
              <AccordionTrigger className="py-2">
                <div className="flex items-center">
                  <span>Critical KPIs</span>
                  <Badge variant="outline" className="ml-2 bg-red-50 text-red-800">
                    {groupedMobileBanking.critical.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderKpis(groupedMobileBanking.critical)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="medium">
              <AccordionTrigger className="py-2">
                <div className="flex items-center">
                  <span>Medium KPIs</span>
                  <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-800">
                    {groupedMobileBanking.medium.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderKpis(groupedMobileBanking.medium)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="low">
              <AccordionTrigger className="py-2">
                <div className="flex items-center">
                  <span>Low Priority KPIs</span>
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-800">
                    {groupedMobileBanking.low.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderKpis(groupedMobileBanking.low)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KpiList;