import React from 'react';
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
import { Loader2 } from 'lucide-react';

interface DashboardProps {
  pageType?: 'home' | 'contact-center' | 'mobile-banking' | 'ivr-analytics' | 'cognitive-services';
}

const Dashboard: React.FC<DashboardProps> = ({ pageType = 'home' }) => {
  const { dashboardConfig, isEditMode, isConfigLoading } = useDashboard();
  const { isLoading: isAuthLoading } = useAuth();

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

  return (
    <>
      <div className="p-4 md:p-8">
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
    </>
  );
};

export default Dashboard;
