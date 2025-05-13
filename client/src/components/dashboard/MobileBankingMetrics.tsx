import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MobileBankingMetricsProps {
  title?: string;
}

const MobileBankingMetrics: React.FC<MobileBankingMetricsProps> = ({ title = 'Mobile Banking Metrics' }) => {
  const { currentTenant } = useAuth();
  const { getDateRangeParams } = useDashboard();
  
  const dateParams = getDateRangeParams();
  const queryParams = new URLSearchParams({
    tenantId: currentTenant?.id?.toString() || '1',
    ...(dateParams.startDate && { startDate: dateParams.startDate }),
    ...(dateParams.endDate && { endDate: dateParams.endDate })
  }).toString();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: [`/api/mobile-banking/metrics?${queryParams}`],
    enabled: !!currentTenant
  });

  // Sample data
  const metrics = {
    activeUsers: {
      value: 8792,
      change: 12.4,
      trend: 'up'
    },
    transactions: {
      value: 14328,
      change: 8.2,
      trend: 'up'
    },
    loadTime: {
      value: 1.24,
      percentage: 65
    },
    successRate: {
      value: 96.4,
      percentage: 96
    },
    authSuccess: {
      value: 99.2,
      percentage: 99
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-neutral-700">{title}</h3>
          <div className="text-xs text-neutral-400">Loading...</div>
        </div>
        <Skeleton className="h-[240px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-neutral-700">{title}</h3>
        </div>
        <div className="h-[240px] flex items-center justify-center bg-neutral-50 rounded-md">
          <p className="text-neutral-500">Failed to load mobile banking metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-neutral-700">{title}</h3>
        <div className="text-xs text-neutral-400">Updated 5 minutes ago</div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-neutral-50 p-3 rounded-md">
            <div className="text-xs text-neutral-500 mb-1">Active Users</div>
            <div className="text-lg font-semibold text-neutral-700">{metrics.activeUsers.value.toLocaleString()}</div>
            <div className="text-xs text-success flex items-center mt-1">
              {metrics.activeUsers.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {metrics.activeUsers.change}% from last week
            </div>
          </div>
          <div className="bg-neutral-50 p-3 rounded-md">
            <div className="text-xs text-neutral-500 mb-1">Transactions Today</div>
            <div className="text-lg font-semibold text-neutral-700">{metrics.transactions.value.toLocaleString()}</div>
            <div className="text-xs text-success flex items-center mt-1">
              {metrics.transactions.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {metrics.transactions.change}% from yesterday
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="text-xs font-medium text-neutral-600">App Load Time</div>
              <div className="text-xs font-medium text-neutral-500">{metrics.loadTime.value}s</div>
            </div>
            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="bg-success h-full rounded-full" 
                style={{ width: `${metrics.loadTime.percentage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="text-xs font-medium text-neutral-600">Transaction Success Rate</div>
              <div className="text-xs font-medium text-neutral-500">{metrics.successRate.value}%</div>
            </div>
            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="bg-warning h-full rounded-full"
                style={{ width: `${metrics.successRate.percentage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="text-xs font-medium text-neutral-600">Authentication Success</div>
              <div className="text-xs font-medium text-neutral-500">{metrics.authSuccess.value}%</div>
            </div>
            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="bg-success h-full rounded-full"
                style={{ width: `${metrics.authSuccess.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBankingMetrics;
