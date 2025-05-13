import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { AgentPerformanceData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AgentPerformanceProps {
  title?: string;
}

const AgentPerformance: React.FC<AgentPerformanceProps> = ({ title = 'Agent Performance Overview' }) => {
  const { currentTenant } = useAuth();
  const { getDateRangeParams } = useDashboard();
  const [shift, setShift] = useState<string>('all');
  
  const dateParams = getDateRangeParams();
  const queryParams = new URLSearchParams({
    tenantId: currentTenant?.id?.toString() || '1',
    shift,
    ...(dateParams.startDate && { startDate: dateParams.startDate }),
    ...(dateParams.endDate && { endDate: dateParams.endDate })
  }).toString();
  
  const { data, isLoading, isError } = useQuery<AgentPerformanceData[]>({
    queryKey: [`/api/agents/performance?${queryParams}`],
    enabled: !!currentTenant
  });

  // Sample data - in a real app, this would come from the API
  const agentData: AgentPerformanceData[] = data || [
    { agent: 'Mohammed A.', calls: 42, averageHandleTime: '06:24', csat: '92%', fcr: '85%', sentiment: 'positive' },
    { agent: 'Sarah K.', calls: 38, averageHandleTime: '07:12', csat: '88%', fcr: '79%', sentiment: 'neutral' },
    { agent: 'Ahmed R.', calls: 45, averageHandleTime: '05:49', csat: '94%', fcr: '87%', sentiment: 'positive' },
    { agent: 'Fatima H.', calls: 36, averageHandleTime: '08:35', csat: '81%', fcr: '72%', sentiment: 'negative' },
    { agent: 'Omar Y.', calls: 41, averageHandleTime: '07:03', csat: '89%', fcr: '81%', sentiment: 'positive' }
  ];

  const handleShiftChange = (value: string) => {
    setShift(value);
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-neutral-700">{title}</h3>
          <Select value={shift} onValueChange={handleShiftChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="morning">Morning Shift</SelectItem>
              <SelectItem value="afternoon">Afternoon Shift</SelectItem>
              <SelectItem value="night">Night Shift</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Skeleton className="h-[250px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-neutral-700">{title}</h3>
          <Select value={shift} onValueChange={handleShiftChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="morning">Morning Shift</SelectItem>
              <SelectItem value="afternoon">Afternoon Shift</SelectItem>
              <SelectItem value="night">Night Shift</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-[250px] flex items-center justify-center bg-neutral-50 rounded-md">
          <p className="text-neutral-500">Failed to load agent performance data</p>
        </div>
      </div>
    );
  }

  const getSentimentBadgeClass = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'neutral':
        return 'bg-blue-100 text-blue-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-neutral-700">{title}</h3>
        <Select value={shift} onValueChange={handleShiftChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            <SelectItem value="morning">Morning Shift</SelectItem>
            <SelectItem value="afternoon">Afternoon Shift</SelectItem>
            <SelectItem value="night">Night Shift</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Agent</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Calls</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Avg. Handle Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">CSAT</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">FCR</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Sentiment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {agentData.map((agent, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-sm text-neutral-700">{agent.agent}</td>
                <td className="px-4 py-3 text-sm text-neutral-700">{agent.calls}</td>
                <td className="px-4 py-3 text-sm text-neutral-700">{agent.averageHandleTime}</td>
                <td className="px-4 py-3 text-sm text-neutral-700">{agent.csat}</td>
                <td className="px-4 py-3 text-sm text-neutral-700">{agent.fcr}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSentimentBadgeClass(agent.sentiment)}`}>
                    {agent.sentiment.charAt(0).toUpperCase() + agent.sentiment.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentPerformance;
