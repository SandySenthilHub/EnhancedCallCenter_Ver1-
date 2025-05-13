import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { SentimentDistribution } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal } from 'lucide-react';

interface SentimentAnalysisProps {
  title?: string;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ title = 'Call Sentiment Distribution' }) => {
  const { currentTenant } = useAuth();
  const { getDateRangeParams } = useDashboard();
  
  const dateParams = getDateRangeParams();
  const queryParams = new URLSearchParams({
    tenantId: currentTenant?.id?.toString() || '1',
    ...(dateParams.startDate && { startDate: dateParams.startDate }),
    ...(dateParams.endDate && { endDate: dateParams.endDate })
  }).toString();
  
  const { data, isLoading, isError } = useQuery<SentimentDistribution>({
    queryKey: [`/api/calls/sentiment?${queryParams}`],
    enabled: !!currentTenant
  });

  // Sample data if API doesn't return any
  const sentimentData = data || {
    positive: 42,
    neutral: 37,
    negative: 21
  };

  // Format for pie chart
  const chartData = [
    { name: 'Positive', value: sentimentData.positive, color: '#26a269' },
    { name: 'Neutral', value: sentimentData.neutral, color: '#3a7bd5' },
    { name: 'Negative', value: sentimentData.negative, color: '#d91921' }
  ];

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-neutral-700">{title}</h3>
          <button className="text-neutral-400 hover:text-neutral-500">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-neutral-700">{title}</h3>
          <button className="text-neutral-400 hover:text-neutral-500">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        <div className="h-[200px] flex items-center justify-center bg-neutral-50 rounded-md">
          <p className="text-neutral-500">Failed to load sentiment data</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-neutral-700">{title}</h3>
        <button className="text-neutral-400 hover:text-neutral-500">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="bg-green-50 p-2 rounded">
          <div className="text-sm font-semibold text-green-600">Positive</div>
          <div className="text-lg font-medium text-green-700">{sentimentData.positive}%</div>
        </div>
        <div className="bg-blue-50 p-2 rounded">
          <div className="text-sm font-semibold text-blue-600">Neutral</div>
          <div className="text-lg font-medium text-blue-700">{sentimentData.neutral}%</div>
        </div>
        <div className="bg-red-50 p-2 rounded">
          <div className="text-sm font-semibold text-red-600">Negative</div>
          <div className="text-lg font-medium text-red-700">{sentimentData.negative}%</div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
