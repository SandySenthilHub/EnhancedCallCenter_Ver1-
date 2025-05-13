import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Alert } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface AlertsProps {
  title?: string;
  limit?: number;
}

const Alerts: React.FC<AlertsProps> = ({ title = 'Recent Alerts', limit = 3 }) => {
  const { currentTenant } = useAuth();
  
  const queryParams = new URLSearchParams({
    tenantId: currentTenant?.id?.toString() || '1',
    limit: limit.toString()
  }).toString();
  
  const { data, isLoading, isError } = useQuery<Alert[]>({
    queryKey: [`/api/alerts?${queryParams}`],
    enabled: !!currentTenant
  });

  // Sample data - in a real app, this would come from the API
  const alertsData: Alert[] = data || [
    {
      id: 1,
      tenantId: 1,
      alertType: 'kpi_threshold',
      message: 'Call volume exceeded threshold (250 calls/hour). Current: 272 calls/hour.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      severity: 'high',
      status: 'active'
    },
    {
      id: 2,
      tenantId: 1,
      alertType: 'app_error',
      message: 'Transaction failure rate at 3.6% (threshold: 3.0%). Investigating potential API timeout issues.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      severity: 'medium',
      status: 'active'
    },
    {
      id: 3,
      tenantId: 1,
      alertType: 'ml_model',
      message: 'Sentiment analysis model retrained with new data. Accuracy improved by 2.1%.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      severity: 'low',
      status: 'acknowledged'
    }
  ];

  const getSeverityIndicator = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-error';
      case 'medium':
        return 'bg-warning';
      case 'low':
        return 'bg-success';
      default:
        return 'bg-neutral-400';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-neutral-100 shadow-sm overflow-hidden">
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg border border-neutral-100 shadow-sm overflow-hidden p-4">
        <div className="h-[100px] flex items-center justify-center">
          <p className="text-neutral-500">Failed to load alerts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-100 shadow-sm overflow-hidden">
      {alertsData.map((alert, index) => (
        <div 
          key={alert.id}
          className={`p-4 ${index === 0 ? 'bg-neutral-50 border-b border-neutral-100' : index < alertsData.length - 1 ? 'border-b border-neutral-100' : ''}`}
        >
          <div className="flex items-center text-sm">
            <span className={`inline-block w-2 h-2 rounded-full ${getSeverityIndicator(alert.severity)} mr-2`}></span>
            <span className="font-medium text-neutral-700">{alert.alertType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            <span className="ml-auto text-neutral-400">{formatTimestamp(alert.timestamp)}</span>
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            {alert.message}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Alerts;
