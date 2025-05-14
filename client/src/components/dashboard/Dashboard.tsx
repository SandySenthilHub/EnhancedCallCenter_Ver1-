import React, { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useAuth } from '@/contexts/AuthContext';
import KpiCard from './KpiCard';
import CallVolumeChart from './CallVolumeChart';
import SentimentAnalysis from './SentimentAnalysis';
import MobileBankingMetrics from './MobileBankingMetrics';
import IvrFlowAnalysis from './IvrFlowAnalysis';
import AgentPerformance from './AgentPerformance';
import KeyPhrases from './KeyPhrases';
import Alerts from './Alerts';
import DashboardEditor from './DashboardEditor';
import { CustomizeDashboard } from './CustomizeDashboard';
import { Loader2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  pageType?: 'home' | 'contact-center' | 'mobile-banking' | 'ivr-analytics' | 'cognitive-services';
}

const Dashboard: React.FC<DashboardProps> = ({ pageType = 'home' }) => {
  const { dashboardConfig, isEditMode, isConfigLoading, setDashboardConfig } = useDashboard();
  const { isLoading: isAuthLoading } = useAuth();
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Filter widgets based on page type
  const getFilteredWidgets = () => {
    if (pageType === 'home') {
      return dashboardConfig.widgets;
    }

    // Filter widgets based on page type
    const typeMap: Record<string, string[]> = {
      'contact-center': ['kpi', 'call-volume', 'sentiment-analysis', 'agent-performance'],
      'mobile-banking': ['kpi', 'mobile-banking-metrics'],
      'ivr-analytics': ['ivr-flow'],
      'cognitive-services': ['sentiment-analysis', 'key-phrases']
    };

    const allowedTypes = typeMap[pageType] || [];
    return dashboardConfig.widgets.filter(widget => allowedTypes.includes(widget.type));
  };

  const filteredWidgets = getFilteredWidgets();

  // Render skeleton when loading
  if (isConfigLoading || isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
        <p className="mt-4 text-neutral-500">Loading dashboard...</p>
      </div>
    );
  }

  // Sort widgets by position
  const sortedWidgets = [...filteredWidgets].sort((a, b) => a.position - b.position);

  // Handle saving the dashboard layout
  const handleSaveDashboardLayout = (widgetIds: string[]) => {
    // Convert widget IDs to actual widget configurations
    const widgetMap = {
      'key-performance': { id: 'kpi-summary', type: 'kpi', title: 'KPI Summary', size: 'full', position: 0 },
      'call-volume': { id: 'call-volume', type: 'call-volume', title: 'Call Volume Trends', size: 'medium', position: 1 },
      'sentiment-analysis': { id: 'sentiment', type: 'sentiment-analysis', title: 'Call Sentiment Analysis', size: 'medium', position: 2 },
      'mobile-banking': { id: 'mobile-metrics', type: 'mobile-banking-metrics', title: 'Mobile Banking Metrics', size: 'medium', position: 3 },
      'ivr-flow': { id: 'ivr-analysis', type: 'ivr-flow', title: 'IVR Flow Analysis', size: 'large', position: 4 },
      'agent-performance': { id: 'agent-stats', type: 'agent-performance', title: 'Agent Performance', size: 'large', position: 5 },
      'key-phrases': { id: 'key-phrases', type: 'key-phrases', title: 'Key Phrases', size: 'medium', position: 6 },
      'recent-alerts': { id: 'alerts', type: 'alerts', title: 'Recent Alerts', size: 'full', position: 7 }
    };
    
    // Create a new dashboard config with the selected widgets
    const newWidgets = widgetIds.map((id, index) => ({
      ...(widgetMap as any)[id],
      position: index
    }));
    
    setDashboardConfig({
      ...dashboardConfig,
      widgets: newWidgets
    });
  };

  return (
    <>
      <div className="p-4 md:p-8">
        {/* Dashboard Header with Customize Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800">
            {pageType === 'home' ? 'Analytics Dashboard' : 
             pageType === 'contact-center' ? 'Contact Center Analytics' :
             pageType === 'mobile-banking' ? 'Mobile Banking Analytics' :
             pageType === 'ivr-analytics' ? 'IVR Analytics' : 'Cognitive Services'}
          </h1>
          <Button 
            variant="outline" 
            onClick={() => setIsCustomizeOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Customize Layout
          </Button>
        </div>
        
        {/* Dashboard Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard 
            title="Average Handle Time"
            value="08:24"
            unit="min:sec"
            target="06:30"
            threshold="08:00"
            trend="up"
            trendValue={5.2}
            progress={75}
            status="error"
            isGood={false}
            isCritical={true}
          />
          <KpiCard 
            title="Customer Satisfaction"
            value="87.4%"
            unit="score"
            target="85%"
            threshold="80%"
            trend="up"
            trendValue={2.1}
            progress={87}
            status="success"
            isGood={true}
            isCritical={false}
          />
          <KpiCard 
            title="First Call Resolution"
            value="78.2%"
            unit="rate"
            target="75%"
            threshold="70%"
            trend="up"
            trendValue={1.8}
            progress={78}
            status="success"
            isGood={true}
            isCritical={false}
          />
          <KpiCard 
            title="App Transaction Success"
            value="96.4%"
            unit="rate"
            target="99%"
            threshold="95%"
            trend="down"
            trendValue={1.3}
            progress={96}
            status="warning"
            isGood={false}
            isCritical={false}
          />
        </div>
        
        {/* Dashboard Main Content - Multiple Rows of Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {sortedWidgets.map(widget => {
            // Map widget type to component
            const sizeMap: Record<string, string> = {
              'small': 'md:col-span-3',
              'medium': 'md:col-span-4',
              'large': 'md:col-span-8',
              'full': 'md:col-span-12'
            };
            
            const widgetSize = sizeMap[widget.size] || 'md:col-span-6';
            
            return (
              <div key={widget.id} className={`${widgetSize} bg-white rounded-lg border border-neutral-100 shadow-sm p-4`}>
                {widget.type === 'call-volume' && <CallVolumeChart title={widget.title} />}
                {widget.type === 'sentiment-analysis' && <SentimentAnalysis title={widget.title} />}
                {widget.type === 'mobile-banking-metrics' && <MobileBankingMetrics title={widget.title} />}
                {widget.type === 'ivr-flow' && <IvrFlowAnalysis title={widget.title} />}
                {widget.type === 'agent-performance' && <AgentPerformance title={widget.title} />}
                {widget.type === 'key-phrases' && <KeyPhrases title={widget.title} />}
                {widget.type === 'alerts' && <Alerts title={widget.title} />}
              </div>
            );
          })}
        </div>
        
        {/* Recent Alerts */}
        <div className="mt-6">
          <h3 className="font-medium text-neutral-700 mb-3">Recent Alerts</h3>
          <Alerts />
        </div>
      </div>
      
      {/* Dashboard Editor Modal */}
      {isEditMode && <DashboardEditor />}
      
      {/* Customize Dashboard Dialog */}
      <CustomizeDashboard 
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        onSave={handleSaveDashboardLayout}
        currentLayout={dashboardConfig.widgets.map(w => {
          // Map widget types back to widget IDs
          const typeToIdMap: Record<string, string> = {
            'kpi': 'key-performance',
            'call-volume': 'call-volume',
            'sentiment-analysis': 'sentiment-analysis',
            'mobile-banking-metrics': 'mobile-banking',
            'ivr-flow': 'ivr-flow',
            'agent-performance': 'agent-performance',
            'key-phrases': 'key-phrases',
            'alerts': 'recent-alerts'
          };
          return typeToIdMap[w.type] || '';
        }).filter(Boolean)}
      />
    </>
  );
};

export default Dashboard;
